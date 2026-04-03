// Create admin user - reads .env file directly
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
});

console.log('DATABASE_URL found:', !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  const email = 'comandomorillo2020@gmail.com';
  const password = 'NexusOS2026!';
  const name = 'Admin Principal';
  
  console.log('Checking for existing user...');
  
  const existingUser = await prisma.systemUser.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (existingUser) {
    console.log('User exists, updating to SUPER_ADMIN...');
    const updated = await prisma.systemUser.update({
      where: { id: existingUser.id },
      data: { role: 'SUPER_ADMIN', isActive: true, name }
    });
    console.log('✅ Updated successfully!');
    console.log('   Email:', updated.email);
    console.log('   Role:', updated.role);
    return;
  }
  
  console.log('Creating new admin user...');
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.systemUser.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'SUPER_ADMIN',
      isActive: true,
    }
  });
  
  console.log('✅ Admin created successfully!');
  console.log('');
  console.log('   Email:', admin.email);
  console.log('   Name:', admin.name);
  console.log('   Role:', admin.role);
  console.log('   Password: NexusOS2026!');
  console.log('');
  console.log('⚠️  Change the password after first login!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
