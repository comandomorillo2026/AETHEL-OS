import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== Verificando usuario admin@aethel.tt ===\n')
  
  // 1. Verificar conexión a la base de datos
  console.log('1. Probando conexión a la base de datos...')
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('   ✅ Conexión exitosa a Supabase\n')
  } catch (error) {
    console.log('   ❌ Error de conexión:', error)
    return
  }
  
  // 2. Listar todas las tablas
  console.log('2. Listando tablas en la base de datos...')
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    console.log('   Tablas encontradas:', (tables as any[]).map(t => (t as any).table_name).join(', '))
    console.log()
  } catch (error) {
    console.log('   ❌ Error:', error)
  }
  
  // 3. Buscar el usuario admin@aethel.tt
  console.log('3. Buscando usuario admin@aethel.tt en SystemUser...')
  try {
    const user = await prisma.systemUser.findUnique({
      where: { email: 'admin@aethel.tt' }
    })
    
    if (user) {
      console.log('   ✅ Usuario encontrado:')
      console.log('   - ID:', user.id)
      console.log('   - Email:', user.email)
      console.log('   - Nombre:', user.name)
      console.log('   - Role:', user.role)
      console.log('   - IsActive:', user.isActive)
      console.log('   - TenantId:', user.tenantId)
      console.log('   - PasswordHash (primeros 20 chars):', user.passwordHash?.substring(0, 20) + '...')
      console.log('   - Creado:', user.createdAt)
      console.log()
      
      // 4. Verificar contraseña
      console.log('4. Verificando contraseña "Aethel2024!"...')
      const passwordMatch = await bcrypt.compare('Aethel2024!', user.passwordHash)
      console.log('   Resultado:', passwordMatch ? '✅ CONTRASEÑA CORRECTA' : '❌ CONTRASEÑA INCORRECTA')
      
      if (!passwordMatch) {
        console.log('\n   Generando nuevo hash para la contraseña...')
        const newHash = await bcrypt.hash('Aethel2024!', 10)
        console.log('   Nuevo hash:', newHash.substring(0, 30) + '...')
        
        console.log('\n   Actualizando contraseña...')
        await prisma.systemUser.update({
          where: { id: user.id },
          data: { passwordHash: newHash }
        })
        console.log('   ✅ Contraseña actualizada')
      }
    } else {
      console.log('   ❌ Usuario NO encontrado')
      console.log('\n   Creando usuario admin@aethel.tt...')
      
      const passwordHash = await bcrypt.hash('Aethel2024!', 10)
      const newUser = await prisma.systemUser.create({
        data: {
          email: 'admin@aethel.tt',
          name: 'Admin',
          role: 'SUPER_ADMIN',
          passwordHash,
          isActive: true
        }
      })
      console.log('   ✅ Usuario creado:', newUser.id)
    }
  } catch (error) {
    console.log('   ❌ Error:', error)
  }
  
  // 5. Listar todos los usuarios
  console.log('\n5. Listando todos los usuarios en SystemUser...')
  try {
    const users = await prisma.systemUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })
    console.log('   Usuarios encontrados:', users.length)
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`)
    })
  } catch (error) {
    console.log('   ❌ Error:', error)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
