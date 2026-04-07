const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update clinic user with tenant
  try {
    await prisma.systemUser.update({
      where: { email: 'clinic@demo.tt' },
      data: { tenantId: 'tenant-clinic-demo' }
    });
    console.log('✅ Clinic user assigned to tenant');
  } catch (e) {
    console.log('Clinic user update error:', e.message);
  }
  
  // Update condo user with tenant
  try {
    await prisma.systemUser.update({
      where: { email: 'condo@demo.tt' },
      data: { tenantId: 'tenant-condo-demo' }
    });
    console.log('✅ Condo user assigned to tenant');
  } catch (e) {
    console.log('Condo user update error:', e.message);
  }
  
  // List all users
  const users = await prisma.systemUser.findMany({
    select: { email: true, role: true, tenantId: true }
  });
  
  console.log('\n📋 USUARIOS EN LA BASE DE DATOS:');
  users.forEach(u => console.log(`  ${u.email} | ${u.role} | tenant: ${u.tenantId || 'none'}`));
  
  await prisma.$disconnect();
}

main();
