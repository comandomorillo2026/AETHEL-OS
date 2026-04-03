import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email/resend';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  businessName: z.string().min(2, 'El nombre del negocio es requerido'),
  industrySlug: z.string().min(1, 'Selecciona una industria'),
  planSlug: z.string().min(1, 'Selecciona un plan'),
  phone: z.string().optional(),
  country: z.string().default('Trinidad & Tobago'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Generate unique slug from business name
    const slugBase = validatedData.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = slugBase;
    let counter = 1;
    while (await prisma.tenant.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    // Create tenant and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          slug,
          businessName: validatedData.businessName,
          industrySlug: validatedData.industrySlug,
          ownerName: validatedData.name,
          ownerEmail: validatedData.email,
          ownerPhone: validatedData.phone || '',
          planSlug: validatedData.planSlug,
          billingCycle: 'monthly',
          status: 'active',
          activatedAt: new Date().toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          settings: JSON.stringify({
            language: 'es',
            country: validatedData.country,
          }),
        },
      });

      // Create user as TENANT_ADMIN
      const user = await tx.systemUser.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          passwordHash,
          role: 'TENANT_ADMIN',
          tenantId: tenant.id,
          isActive: true,
          phone: validatedData.phone,
        },
      });

      // Create clinic config if industry is clinic
      if (validatedData.industrySlug === 'clinic') {
        await tx.clinicConfig.create({
          data: {
            tenantId: tenant.id,
            clinicName: validatedData.businessName,
            email: validatedData.email,
            phone: validatedData.phone || '',
            country: validatedData.country,
            currency: 'TTD',
            currencySymbol: 'TT$',
          },
        });
      }

      // Log activity
      await tx.activityLog.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          action: 'create',
          entityType: 'tenant',
          entityId: tenant.id,
          description: `Nuevo tenant registrado: ${tenant.businessName}`,
        },
      });

      return { tenant, user };
    });

    // Send welcome email (async, don't wait for it)
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    sendWelcomeEmail({
      name: result.user.name,
      email: result.user.email,
      businessName: result.tenant.businessName,
      industry: result.tenant.industrySlug,
      loginUrl: `${appUrl}/login`,
    }).catch(err => console.error('[WELCOME_EMAIL_ERROR]', err));

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso',
      tenant: {
        slug: result.tenant.slug,
        name: result.tenant.businessName,
        industry: result.tenant.industrySlug,
      },
      user: {
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}
