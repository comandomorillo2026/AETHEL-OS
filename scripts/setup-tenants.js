const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
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
        isActive: true,
      }
    });
    console.log('✅ Clinic tenant created:', clinicTenant.businessName);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('ℹ️ Clinic tenant already exists');
    } else {
      console.log('Clinic tenant error:', e.message);
    }
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
        isActive: true,
      }
    });
    console.log('✅ Condo tenant created:', condoTenant.businessName);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('ℹ️ Condo tenant already exists');
    } else {
      console.log('Condo tenant error:', e.message);
    }
  }
  
  // Create clinic demo user
  try {
    const clinicPassword = await bcrypt.hash('demo123', 10);
    const clinicUser = await prisma.systemUser.create({
      data: {
        id: 'user-clinic-demo',
        email: 'clinic@demo.tt',
        name: 'Dr. Demo',
        passwordHash: clinicPassword,
        role: 'USER',
        tenantId: 'tenant-clinic-demo',
        isActive: true,
      }
    });
    console.log('✅ Clinic user created:', clinicUser.email);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('ℹ️ Clinic user already exists');
    } else {
      console.log('Clinic user error:', e.message);
    }
  }
  
  // Create condo admin user
  try {
    const condoPassword = await bcrypt.hash('condo123', 10);
    const condoUser = await prisma.systemUser.create({
      data: {
        id: 'user-condo-demo',
        email: 'condo@demo.tt',
        name: 'Admin Condominio',
        passwordHash: condoPassword,
        role: 'ADMIN',
        tenantId: 'tenant-condo-demo',
        isActive: true,
      }
    });
    console.log('✅ Condo admin user created:', condoUser.email);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('ℹ️ Condo user already exists');
    } else {
      console.log('Condo user error:', e.message);
    }
  }
  
  console.log('\n📋 CREDENCIALES DE ACCESO:');
  console.log('═══════════════════════════════════════');
  console.log('👑 SUPER ADMIN:');
  console.log('   Email: admin@aethel.tt');
  console.log('   Password: Aethel2024!');
  console.log('');
  console.log('🏥 CLÍNICA:');
  console.log('   Email: clinic@demo.tt');
  console.log('   Password: demo123');
  console.log('');
  console.log('🏢 CONDOMINIO:');
  console.log('   Email: condo@demo.tt');
  console.log('   Password: condo123');
  console.log('═══════════════════════════════════════');
  
  await prisma.$disconnect();
}

main();
