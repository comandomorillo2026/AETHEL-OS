const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin exists
    const existing = await prisma.systemUser.findUnique({
      where: { email: 'admin@aethel.tt' }
    });
    
    if (existing) {
      console.log('✅ Admin user already exists');
      console.log('   Email:', existing.email);
      console.log('   Role:', existing.role);
      return;
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash('Aethel2024!', 10);
    
    // Create admin user
    const admin = await prisma.systemUser.create({
      data: {
        email: 'admin@aethel.tt',
        name: 'Administrador AETHEL',
        passwordHash: passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    
    // Create a demo tenant for clinic
    const tenant = await prisma.tenant.create({
      data: {
        id: 'tenant-clinic-demo',
        slug: 'clinic',
        businessName: 'Clínica Demo',
        industrySlug: 'clinic',
        isActive: true,
      }
    });
    console.log('✅ Demo tenant created:', tenant.businessName);
    
    // Create a clinic user
    const clinicPassword = await bcrypt.hash('demo123', 10);
    const clinicUser = await prisma.systemUser.create({
      data: {
        email: 'clinic@demo.tt',
        name: 'Dr. Demo',
        passwordHash: clinicPassword,
        role: 'USER',
        tenantId: 'tenant-clinic-demo',
        isActive: true,
      }
    });
    console.log('✅ Clinic user created:', clinicUser.email);
    
    // Create condo tenant
    const condoTenant = await prisma.tenant.create({
      data: {
        id: 'tenant-condo-demo',
        slug: 'condo',
        businessName: 'Condominio Demo',
        industrySlug: 'condo',
        isActive: true,
      }
    });
    console.log('✅ Condo tenant created:', condoTenant.businessName);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
