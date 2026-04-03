import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('[LOGIN-TEST] Attempting login for:', email);

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y password requeridos' }, { status: 400 });
    }

    // Find user
    const user = await db.systemUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    console.log('[LOGIN-TEST] User found:', !!user);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado',
        debug: { email: email.toLowerCase().trim() }
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Usuario inactivo' }, { status: 401 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('[LOGIN-TEST] Password match:', passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password incorrecto',
        debug: {
          hashLength: user.passwordHash.length,
          hashPrefix: user.passwordHash.substring(0, 10)
        }
      }, { status: 401 });
    }

    // Success
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('[LOGIN-TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}
