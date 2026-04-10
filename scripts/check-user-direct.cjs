// Direct database check using pg
const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://postgres.rgpdsjmyamduakbmmdhr:aV2rMTfS9wkrueB1@aws-1-us-east-1.pooler.supabase.com:5432/postgres'
})

async function main() {
  console.log('=== Verificando usuario admin@aethel.tt ===\n')
  
  try {
    await client.connect()
    console.log('✅ Conectado a Supabase\n')
    
    // List tables
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    console.log('Tablas encontradas:', tablesResult.rows.length)
    
    // Check if SystemUser table exists
    const systemUserExists = tablesResult.rows.some(r => r.table_name === 'SystemUser')
    console.log('Tabla SystemUser existe:', systemUserExists ? '✅' : '❌')
    
    if (!systemUserExists) {
      console.log('\n⚠️ La tabla SystemUser NO existe. Necesitas ejecutar prisma db push.')
      return
    }
    
    // Find admin user
    const userResult = await client.query(`
      SELECT id, email, name, role, "isActive", "tenantId", "passwordHash", "createdAt"
      FROM "SystemUser"
      WHERE email = $1
    `, ['admin@aethel.tt'])
    
    console.log('\nBuscando admin@aethel.tt...')
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuario NO encontrado')
      console.log('\nCreando usuario admin@aethel.tt...')
      
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash('Aethel2024!', 10)
      
      await client.query(`
        INSERT INTO "SystemUser" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
      `, ['admin@aethel.tt', 'Admin', 'SUPER_ADMIN', passwordHash])
      
      console.log('✅ Usuario creado exitosamente!')
    } else {
      const user = userResult.rows[0]
      console.log('✅ Usuario encontrado:')
      console.log('   - ID:', user.id)
      console.log('   - Email:', user.email)
      console.log('   - Nombre:', user.name)
      console.log('   - Role:', user.role)
      console.log('   - IsActive:', user.isActive)
      console.log('   - PasswordHash (primeros 30 chars):', user.passwordHash?.substring(0, 30) + '...')
      
      // Verify password
      const bcrypt = require('bcryptjs')
      const passwordMatch = await bcrypt.compare('Aethel2024!', user.passwordHash)
      console.log('\nVerificando contraseña "Aethel2024!":', passwordMatch ? '✅ CORRECTA' : '❌ INCORRECTA')
      
      if (!passwordMatch) {
        console.log('\nActualizando contraseña...')
        const newHash = await bcrypt.hash('Aethel2024!', 10)
        await client.query(`
          UPDATE "SystemUser" SET "passwordHash" = $1, "updatedAt" = NOW()
          WHERE email = $2
        `, [newHash, 'admin@aethel.tt'])
        console.log('✅ Contraseña actualizada!')
      }
    }
    
    // List all users
    const allUsers = await client.query(`SELECT email, name, role, "isActive" FROM "SystemUser"`)
    console.log('\nTodos los usuarios en SystemUser:')
    allUsers.rows.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.end()
  }
}

main()
