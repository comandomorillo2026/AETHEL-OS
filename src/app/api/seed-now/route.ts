import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('[SEED-NOW] Starting database initialization...');

    // Verificar si ya existe
    const existingAdmin = await prisma.systemUser.findUnique({
      where: { email: 'admin@nexusos.tt' },
    });

    if (existingAdmin) {
      console.log('[SEED-NOW] Database already initialized');
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        users: ['admin@nexusos.tt', 'clinic@demo.tt']
      });
    }

    const saltRounds = 12;
    const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
    const demoPasswordHash = await bcrypt.hash('demo123', saltRounds);

    // Crear industrias
    const industries = [
      { id: randomUUID(), slug: 'clinic', nameEn: 'Medical Clinic', nameEs: 'Clínica Médica', icon: '🏥', descriptionEn: 'Complete practice management', descriptionEs: 'Gestión completa para clínicas', sortOrder: 1, status: 'active' },
      { id: randomUUID(), slug: 'nurse', nameEn: 'Nursing Care', nameEs: 'Cuidados de Enfermería', icon: '💉', descriptionEn: 'Home care', descriptionEs: 'Cuidados en casa', sortOrder: 2, status: 'active' },
      { id: randomUUID(), slug: 'lawfirm', nameEn: 'Law Firm', nameEs: 'Bufete de Abogados', icon: '⚖️', descriptionEn: 'Case management', descriptionEs: 'Gestión de casos', sortOrder: 3, status: 'active' },
      { id: randomUUID(), slug: 'beauty', nameEn: 'Beauty Salon', nameEs: 'Salón de Belleza', icon: '💇‍♀️', descriptionEn: 'Appointment and POS', descriptionEs: 'Citas y POS', sortOrder: 4, status: 'active' },
      { id: randomUUID(), slug: 'bakery', nameEn: 'Bakery', nameEs: 'Panadería', icon: '🍞', descriptionEn: 'POS and catalog', descriptionEs: 'POS y catálogo', sortOrder: 5, status: 'active' },
      { id: randomUUID(), slug: 'retail', nameEn: 'Retail Store', nameEs: 'Tienda Retail', icon: '🏪', descriptionEn: 'Point of sale', descriptionEs: 'Punto de venta', sortOrder: 6, status: 'active' },
      { id: randomUUID(), slug: 'pharmacy', nameEn: 'Pharmacy', nameEs: 'Farmacia', icon: '💊', descriptionEn: 'Pharmacy management', descriptionEs: 'Gestión de farmacia', sortOrder: 7, status: 'active' },
    ];

    for (const industry of industries) {
      await prisma.industry.create({ data: industry });
    }
    console.log('[SEED-NOW] Created industries');

    // Crear planes
    const plans = [
      { id: randomUUID(), slug: 'starter', nameEn: 'Starter', nameEs: 'Inicial', tier: 'starter', priceMonthlyTtd: 800, priceAnnualTtd: 680, priceBiannualTtd: 750, maxUsers: 2, maxBranches: 1, featuresEn: '[]', featuresEs: '[]' },
      { id: randomUUID(), slug: 'growth', nameEn: 'Growth', nameEs: 'Crecimiento', tier: 'growth', priceMonthlyTtd: 1500, priceAnnualTtd: 1275, priceBiannualTtd: 1400, maxUsers: 5, maxBranches: 2, featuresEn: '[]', featuresEs: '[]' },
      { id: randomUUID(), slug: 'premium', nameEn: 'Premium', nameEs: 'Premium', tier: 'premium', priceMonthlyTtd: 2800, priceAnnualTtd: 2380, priceBiannualTtd: 2600, maxUsers: 15, maxBranches: 5, featuresEn: '[]', featuresEs: '[]' },
    ];

    for (const plan of plans) {
      await prisma.plan.create({ data: plan });
    }
    console.log('[SEED-NOW] Created plans');

    // Crear SUPER_ADMIN
    await prisma.systemUser.create({
      data: {
        id: randomUUID(),
        email: 'admin@nexusos.tt',
        name: 'Super Admin',
        passwordHash: adminPasswordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('[SEED-NOW] Created SUPER_ADMIN: admin@nexusos.tt');

    // Crear tenant clínica
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

    await prisma.systemUser.create({
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
    console.log('[SEED-NOW] Created TENANT_ADMIN: clinic@demo.tt');

    // Crear tenant panadería
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

    await prisma.systemUser.create({
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
    console.log('[SEED-NOW] Created TENANT_ADMIN: bakery@demo.tt');

    console.log('[SEED-NOW] Database initialization complete!');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      credentials: {
        admin: { email: 'admin@nexusos.tt', password: 'admin123' },
        clinic: { email: 'clinic@demo.tt', password: 'demo123' },
        bakery: { email: 'bakery@demo.tt', password: 'demo123' }
      }
    });

  } catch (error) {
    console.error('[SEED-NOW] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
