const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.systemUser.findMany({
    select: { email: true, role: true, isActive: true }
  });
  console.log('Users in database:');
  users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
  await prisma.$disconnect();
}

main();
