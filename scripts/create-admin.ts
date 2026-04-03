/**
 * Script to create an admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'comandomorillo2020@gmail.com';
  const password = 'NexusOS2026!'; // Default password - should be changed on first login
  const name = 'Admin Principal';
  
  // Check if user already exists
  const existingUser = await prisma.systemUser.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (existingUser) {
    console.log('✅ User already exists:', existingUser.email);
    console.log('   Role:', existingUser.role);
    
    // Update to SUPER_ADMIN if not already
    if (existingUser.role !== 'SUPER_ADMIN') {
      const updated = await prisma.systemUser.update({
        where: { id: existingUser.id },
        data: { role: 'SUPER_ADMIN', isActive: true }
      });
      console.log('   Updated role to SUPER_ADMIN');
    }
    return;
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Create the admin user
  const admin = await prisma.systemUser.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'SUPER_ADMIN',
      isActive: true,
    }
  });
  
  console.log('✅ Admin user created successfully!');
  console.log('');
  console.log('   Email:', admin.email);
  console.log('   Name:', admin.name);
  console.log('   Role:', admin.role);
  console.log('   Password: NexusOS2026!');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the password after first login!');
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
