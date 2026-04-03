import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// This endpoint initializes the database with default users
// It should be called once after deployment
// IMPORTANT: In production, you should secure this endpoint

export async function POST(request: NextRequest) {
  try {
    // Check if already initialized
    const existingAdmin = await prisma.systemUser.findUnique({
      where: { email: 'admin@nexusos.tt' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        users: ['admin@nexusos.tt'],
      });
    }

    console.log('[SETUP] Initializing database...');

    // Hash passwords
    const saltRounds = 12;
    const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
    const demoPasswordHash = await bcrypt.hash('demo123', saltRounds);

    const createdUsers: string[] = [];

    // Create industries
    const industries = [
      { slug: 'clinic', nameEn: 'Medical Clinic', nameEs: 'Clínica Médica', icon: '🏥', descriptionEn: 'Complete practice management for medical clinics', descriptionEs: 'Gestión completa para clínicas médicas', sortOrder: 1 },
      { slug: 'nurse', nameEn: 'Nursing Care', nameEs: 'Cuidados de Enfermería', icon: '💉', descriptionEn: 'Home care and nursing management', descriptionEs: 'Gestión de cuidados en casa y enfermería', sortOrder: 2 },
      { slug: 'lawfirm', nameEn: 'Law Firm', nameEs: 'Bufete de Abogados', icon: '⚖️', descriptionEn: 'Case management for law firms', descriptionEs: 'Gestión de casos para bufetes', sortOrder: 3 },
      { slug: 'beauty', nameEn: 'Beauty Salon & SPA', nameEs: 'Salón de Belleza & SPA', icon: '💇‍♀️', descriptionEn: 'Appointment and POS for beauty businesses', descriptionEs: 'Citas y POS para negocios de belleza', sortOrder: 4 },
      { slug: 'bakery', nameEn: 'Bakery', nameEs: 'Panadería', icon: '🍞', descriptionEn: 'POS and catalog for bakeries', descriptionEs: 'POS y catálogo para panaderías', sortOrder: 5 },
      { slug: 'retail', nameEn: 'Retail Store', nameEs: 'Tienda Retail', icon: '🏪', descriptionEn: 'Point of sale for retail stores', descriptionEs: 'Punto de venta para tiendas', sortOrder: 6 },
      { slug: 'pharmacy', nameEn: 'Pharmacy', nameEs: 'Farmacia', icon: '💊', descriptionEn: 'Pharmacy management system', descriptionEs: 'Sistema de gestión de farmacia', sortOrder: 7 },
    ];

    for (const industry of industries) {
      await prisma.industry.upsert({
        where: { slug: industry.slug },
        update: {},
        create: {
          id: randomUUID(),
          ...industry,
          status: 'active',
        },
      });
    }

    console.log('[SETUP] Created industries');

    // Create plans
    const plans = [
      { slug: 'starter', nameEn: 'Starter', nameEs: 'Inicial', tier: 'starter', priceMonthlyTtd: 250, maxUsers: 2, maxBranches: 1 },
      { slug: 'growth', nameEn: 'Growth', nameEs: 'Crecimiento', tier: 'growth', priceMonthlyTtd: 500, maxUsers: 5, maxBranches: 2 },
      { slug: 'premium', nameEn: 'Premium', nameEs: 'Premium', tier: 'premium', priceMonthlyTtd: 1000, maxUsers: 15, maxBranches: 5 },
    ];

    for (const plan of plans) {
      await prisma.plan.upsert({
        where: { slug: plan.slug },
        update: {},
        create: {
          id: randomUUID(),
          ...plan,
          featuresEn: JSON.stringify([]),
          featuresEs: JSON.stringify([]),
        },
      });
    }

    console.log('[SETUP] Created plans');

    // Create SUPER_ADMIN user
    const superAdmin = await prisma.systemUser.create({
      data: {
        id: randomUUID(),
        email: 'admin@nexusos.tt',
        name: 'Super Admin',
        passwordHash: adminPasswordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    createdUsers.push(superAdmin.email);
    console.log('[SETUP] Created SUPER_ADMIN:', superAdmin.email);

    // Create demo clinic tenant
    const clinicTenant = await prisma.tenant.create({
      data: {
        id: randomUUID(),
        slug: 'clinica-demo',
        businessName: 'Clínica San Fernando',
        legalName: 'Clínica San Fernando S.A.',
        industrySlug: 'clinic',
        ownerName: 'Dr. Juan Martínez',
        ownerEmail: 'clinic@demo.tt',
        ownerPhone: '+1 868 123 4567',
        planSlug: 'growth',
        billingCycle: 'monthly',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    // Create clinic admin user
    const clinicAdmin = await prisma.systemUser.create({
      data: {
        id: randomUUID(),
        email: 'clinic@demo.tt',
        name: 'Dr. Juan Martínez',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: clinicTenant.id,
        isActive: true,
      },
    });
    createdUsers.push(clinicAdmin.email);
    console.log('[SETUP] Created TENANT_ADMIN:', clinicAdmin.email);

    // Create demo bakery tenant
    const bakeryTenant = await prisma.tenant.create({
      data: {
        id: randomUUID(),
        slug: 'panaderia-demo',
        businessName: 'Panadería Don José',
        legalName: 'Panadería Don José',
        industrySlug: 'bakery',
        ownerName: 'José García',
        ownerEmail: 'bakery@demo.tt',
        ownerPhone: '+1 868 555 1234',
        planSlug: 'starter',
        billingCycle: 'monthly',
        status: 'active',
        activatedAt: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    // Create bakery admin user
    const bakeryAdmin = await prisma.systemUser.create({
      data: {
        id: randomUUID(),
        email: 'bakery@demo.tt',
        name: 'José García',
        passwordHash: demoPasswordHash,
        role: 'TENANT_ADMIN',
        tenantId: bakeryTenant.id,
        isActive: true,
      },
    });
    createdUsers.push(bakeryAdmin.email);
    console.log('[SETUP] Created TENANT_ADMIN:', bakeryAdmin.email);

    // Create system settings
    await prisma.systemSetting.createMany({
      data: [
        { id: randomUUID(), key: 'company_name', value: 'NexusOS', description: 'Company name', isPublic: true },
        { id: randomUUID(), key: 'support_email', value: 'soporte@nexusos.tt', description: 'Support email', isPublic: true },
      ],
      skipDuplicates: true,
    });

    console.log('[SETUP] Initialization complete!');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      users: createdUsers,
      credentials: {
        admin: { email: 'admin@nexusos.tt', password: 'admin123' },
        clinic: { email: 'clinic@demo.tt', password: 'demo123' },
        bakery: { email: 'bakery@demo.tt', password: 'demo123' },
      },
    });
  } catch (error) {
    console.error('[SETUP] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check initialization status
export async function GET() {
  try {
    const adminCount = await prisma.systemUser.count({
      where: { role: 'SUPER_ADMIN' },
    });

    const tenantCount = await prisma.tenant.count();

    return NextResponse.json({
      initialized: adminCount > 0,
      adminCount,
      tenantCount,
    });
  } catch (error) {
    return NextResponse.json({
      initialized: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
