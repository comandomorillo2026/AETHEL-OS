import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    const userCount = await db.systemUser.count();
    const adminUser = await db.systemUser.findUnique({
      where: { email: 'admin@nexusos.tt' },
      select: { email: true, role: true, isActive: true, passwordHash: true }
    });

    // Verificar variables de entorno (sin exponer secretos)
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_DATABASE_URL: !!process.env.DIRECT_DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    };

    return NextResponse.json({
      status: 'ok',
      database: {
        connected: true,
        userCount,
        adminExists: !!adminUser,
        adminActive: adminUser?.isActive,
        adminHasPassword: !!adminUser?.passwordHash,
        passwordHashLength: adminUser?.passwordHash?.length || 0,
      },
      environment: envCheck,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
