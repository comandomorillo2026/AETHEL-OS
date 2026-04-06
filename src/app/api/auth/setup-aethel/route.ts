import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// GET: Check setup status
export async function GET() {
  try {
    const existingAdmin = await db.systemUser.findUnique({
      where: { email: 'admin@aethel.tt' },
    });

    return NextResponse.json({
      setupComplete: !!existingAdmin,
      adminExists: !!existingAdmin,
    });
  } catch (error) {
    console.error('[SETUP] Error checking status:', error);
    return NextResponse.json({
      setupComplete: false,
      error: 'Error checking setup status',
    }, { status: 500 });
  }
}

// POST: Create AETHEL users
export async function POST(request: Request) {
  try {
    // Security check - only allow in development or with secret key
    const authHeader = request.headers.get('authorization');
    const setupKey = process.env.SETUP_KEY || 'aethel-setup-2024';
    
    if (authHeader !== `Bearer ${setupKey}`) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    console.log('[SETUP] Creating AETHEL admin user...');

    // Hash password
    const saltRounds = 12;
    const adminPasswordHash = await bcrypt.hash('Aethel2024!', saltRounds);
    const demoPasswordHash = await bcrypt.hash('Demo2024!', saltRounds);

    // Create SUPER_ADMIN user for AETHEL
    const superAdmin = await db.systemUser.upsert({
      where: { email: 'admin@aethel.tt' },
      update: {
        passwordHash: adminPasswordHash,
        name: 'AETHEL Administrator',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
      create: {
        id: randomUUID(),
        email: 'admin@aethel.tt',
        name: 'AETHEL Administrator',
        passwordHash: adminPasswordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log('[SETUP] Created SUPER_ADMIN:', superAdmin.email);

    // Update system settings for AETHEL branding
    await db.systemSetting.upsert({
      where: { key: 'company_name' },
      update: { value: 'AETHEL OS' },
      create: {
        id: randomUUID(),
        key: 'company_name',
        value: 'AETHEL OS',
        description: 'Company name displayed in the system',
        isPublic: true,
      },
    });

    await db.systemSetting.upsert({
      where: { key: 'support_email' },
      update: { value: 'soporte@aethel.tt' },
      create: {
        id: randomUUID(),
        key: 'support_email',
        value: 'soporte@aethel.tt',
        description: 'Support email address',
        isPublic: true,
      },
    });

    // Create demo tenant for clinic
    const clinicTenant = await db.tenant.upsert({
      where: { slug: 'clinica-demo' },
      update: {},
      create: {
        id: randomUUID(),
        slug: 'clinica-demo',
        businessName: 'Clínica San Fernando',
        legalName: 'Clínica San Fernando S.A.',
        industrySlug: 'clinic',
        ownerName: 'Dr. Juan Martínez',
        ownerEmail: 'clinic@aethel.tt',
        ownerPhone: '+1 868 123 4567',
        planSlug: 'growth',
        billingCycle: 'monthly',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        settings: JSON.stringify({
          primaryColor: '#22D3EE',
          secondaryColor: '#F0B429',
          language: 'es',
        }),
      },
    });

    // Create TENANT_ADMIN for clinic
    await db.systemUser.upsert({
      where: { email: 'clinic@aethel.tt' },
      update: {
        passwordHash: demoPasswordHash,
        tenantId: clinicTenant.id,
      },
      create: {
        id: randomUUID(),
        email: 'clinic@aethel.tt',
        name: 'Dr. Juan Martínez',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: clinicTenant.id,
        isActive: true,
      },
    });

    // Create demo tenant for lawfirm
    const lawfirmTenant = await db.tenant.upsert({
      where: { slug: 'bufete-perez' },
      update: {},
      create: {
        id: randomUUID(),
        slug: 'bufete-perez',
        businessName: 'Bufete Pérez & Asociados',
        legalName: 'Bufete Pérez & Asociados',
        industrySlug: 'lawfirm',
        ownerName: 'Carlos Pérez',
        ownerEmail: 'lawfirm@aethel.tt',
        ownerPhone: '+1 868 234 5678',
        planSlug: 'premium',
        billingCycle: 'annual',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        settings: JSON.stringify({
          primaryColor: '#1E3A5F',
          secondaryColor: '#C4A35A',
          language: 'es',
        }),
      },
    });

    // Create TENANT_ADMIN for lawfirm
    await db.systemUser.upsert({
      where: { email: 'lawfirm@aethel.tt' },
      update: {
        passwordHash: demoPasswordHash,
        tenantId: lawfirmTenant.id,
      },
      create: {
        id: randomUUID(),
        email: 'lawfirm@aethel.tt',
        name: 'Carlos Pérez',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: lawfirmTenant.id,
        isActive: true,
      },
    });

    // Create demo tenant for beauty
    const beautyTenant = await db.tenant.upsert({
      where: { slug: 'salon-bella-vista' },
      update: {},
      create: {
        id: randomUUID(),
        slug: 'salon-bella-vista',
        businessName: 'Salón Bella Vista',
        legalName: 'Salón Bella Vista',
        industrySlug: 'beauty',
        ownerName: 'Ana Gómez',
        ownerEmail: 'beauty@aethel.tt',
        ownerPhone: '+1 868 345 6789',
        planSlug: 'growth',
        billingCycle: 'monthly',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        settings: JSON.stringify({
          primaryColor: '#EC4899',
          secondaryColor: '#8B5CF6',
          language: 'es',
        }),
      },
    });

    // Create TENANT_ADMIN for beauty
    await db.systemUser.upsert({
      where: { email: 'beauty@aethel.tt' },
      update: {
        passwordHash: demoPasswordHash,
        tenantId: beautyTenant.id,
      },
      create: {
        id: randomUUID(),
        email: 'beauty@aethel.tt',
        name: 'Ana Gómez',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: beautyTenant.id,
        isActive: true,
      },
    });

    // Create demo tenant for nurse
    const nurseTenant = await db.tenant.upsert({
      where: { slug: 'enfermeria-cuidados' },
      update: {},
      create: {
        id: randomUUID(),
        slug: 'enfermeria-cuidados',
        businessName: 'Enfermería Cuidados del Hogar',
        legalName: 'Enfermería Cuidados del Hogar',
        industrySlug: 'nurse',
        ownerName: 'María Rodríguez',
        ownerEmail: 'nurse@aethel.tt',
        ownerPhone: '+1 868 456 7890',
        planSlug: 'growth',
        billingCycle: 'monthly',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        settings: JSON.stringify({
          primaryColor: '#34D399',
          secondaryColor: '#F0B429',
          language: 'es',
        }),
      },
    });

    // Create TENANT_ADMIN for nurse
    await db.systemUser.upsert({
      where: { email: 'nurse@aethel.tt' },
      update: {
        passwordHash: demoPasswordHash,
        tenantId: nurseTenant.id,
      },
      create: {
        id: randomUUID(),
        email: 'nurse@aethel.tt',
        name: 'María Rodríguez',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: nurseTenant.id,
        isActive: true,
      },
    });

    console.log('[SETUP] All AETHEL users created successfully!');

    return NextResponse.json({
      success: true,
      message: 'AETHEL users created successfully',
      credentials: {
        superAdmin: { email: 'admin@aethel.tt', password: 'Aethel2024!' },
        clinic: { email: 'clinic@aethel.tt', password: 'Demo2024!' },
        lawfirm: { email: 'lawfirm@aethel.tt', password: 'Demo2024!' },
        beauty: { email: 'beauty@aethel.tt', password: 'Demo2024!' },
        nurse: { email: 'nurse@aethel.tt', password: 'Demo2024!' },
      },
    });
  } catch (error) {
    console.error('[SETUP] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating AETHEL users',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
