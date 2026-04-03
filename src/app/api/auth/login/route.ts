import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[AUTH] Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email y contraseña son requeridos' 
      }, { status: 400 });
    }

    // Find user in database
    const user = await db.systemUser.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        tenant: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            industrySlug: true,
          }
        }
      }
    });

    console.log('[AUTH] User found:', user ? user.email : 'NOT FOUND');

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario inactivo. Contacta al administrador.' 
      }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('[AUTH] Password match:', passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({ 
        success: false, 
        error: 'Contraseña incorrecta' 
      }, { status: 401 });
    }

    // Update last login
    await db.systemUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date().toISOString() },
    }).catch(err => console.log('[AUTH] Failed to update lastLoginAt:', err.message));

    // Determine redirect path based on role and tenant
    let redirectPath = '/clinic'; // default
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      redirectPath = '/admin';
    } else if (user.tenant?.slug) {
      redirectPath = `/${user.tenant.slug}`;
    }

    console.log('[AUTH] Login successful for:', user.email, '- Redirecting to:', redirectPath);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantSlug: user.tenant?.slug || null,
        tenantName: user.tenant?.businessName || null,
        industrySlug: user.tenant?.industrySlug || null,
      },
      redirectPath,
    });
  } catch (error) {
    console.error('[AUTH] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error del servidor',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
