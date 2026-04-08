const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create clinic tenant
  try {
    const clinicTenant = await prisma.tenant.create({
      data: {
        id: 'tenant-clinic-demo',
        slug: 'clinic',
        businessName: 'Clínica Demo',
        industrySlug: 'clinic',
        ownerName: 'Admin',
        ownerEmail: 'admin@aethel.tt',
        ownerPhone: '+1-868-000-0000',
        planSlug: 'professional',
        billingCycle: 'monthly',
        status: 'active',
        isTrial: false,
      }
    });
    console.log('✅ Clinic tenant created');
  } catch (e) {
    console.log('ℹ️ Clinic tenant:', e.code === 'P2002' ? 'already exists' : e.message);
  }
  
  // Create condo tenant
  try {
    const condoTenant = await prisma.tenant.create({
      data: {
        id: 'tenant-condo-demo',
        slug: 'condo',
        businessName: 'Condominio Demo',
        industrySlug: 'condo',
        ownerName: 'Admin',
        ownerEmail: 'admin@aethel.tt',
        ownerPhone: '+1-868-000-0001',
        planSlug: 'professional',
        billingCycle: 'monthly',
        status: 'active',
        isTrial: false,
      }
    });
    console.log('✅ Condo tenant created');
  } catch (e) {
    console.log('ℹ️ Condo tenant:', e.code === 'P2002' ? 'already exists' : e.message);
  }
  
  await prisma.$disconnect();
}

main();
