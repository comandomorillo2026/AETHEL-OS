import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendTenantWelcomeEmail } from '@/lib/email/resend';

const prisma = new PrismaClient();

// GET - List all tenants
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    return NextResponse.json({ tenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Error al obtener inquilinos' },
      { status: 500 }
    );
  }
}

// POST - Create new tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessName,
      legalName,
      ownerName,
      email,
      phone,
      industry,
      plan,
      billingCycle,
      notes
    } = body;

    // Validate required fields
    if (!businessName || !ownerName || !email || !industry) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      );
    }

    // Generate slug from business name
    const baseSlug = businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
    while (existingSlug) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Hash password
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Determine plan slug
    const planSlug = plan?.toLowerCase() || 'growth';

    // Calculate billing dates
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Create tenant and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          slug,
          businessName,
          legalName: legalName || businessName,
          industrySlug: industry,
          ownerName,
          ownerEmail: email.toLowerCase(),
          ownerPhone: phone || '',
          planSlug,
          billingCycle: billingCycle || 'monthly',
          status: 'active',
          activatedAt: now.toISOString(),
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: periodEnd.toISOString(),
          settings: JSON.stringify({
            primaryColor: getIndustryColor(industry),
            secondaryColor: '#F0B429',
            language: 'es'
          })
        }
      });

      // Create user
      const user = await tx.systemUser.create({
        data: {
          tenantId: tenant.id,
          email: email.toLowerCase(),
          passwordHash,
          name: ownerName,
          role: 'TENANT_ADMIN',
          phone: phone || null,
          isActive: true
        }
      });

      return { tenant, user };
    });

    // Send welcome email
    try {
      await sendTenantWelcomeEmail({
        to: email.toLowerCase(),
        userName: ownerName,
        businessName,
        loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`,
        email: email.toLowerCase(),
        tempPassword,
        industry
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails - we can retry later
    }

    return NextResponse.json({
      success: true,
      tenant: result.tenant,
      message: 'Inquilino creado exitosamente'
    });

  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: 'Error al crear inquilino' },
      { status: 500 }
    );
  }
}

// Helper function to generate temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const specialChars = '!@#$%&*';
  let password = '';
  
  // Add 8 random chars
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add one special char
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Add one number
  password += Math.floor(Math.random() * 10);
  
  return password;
}

// Helper function to get industry color
function getIndustryColor(industry: string): string {
  const colors: Record<string, string> = {
    clinic: '#22D3EE',
    nurse: '#34D399',
    lawfirm: '#C4A35A',
    beauty: '#EC4899',
    retail: '#F59E0B',
    bakery: '#F87171'
  };
  return colors[industry] || '#6C3FCE';
}
