import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SESSION_DURATION_DAYS = 30;
const TEMP_SESSION_DURATION_HOURS = 4;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    console.log('[AUTH] Login attempt for:', email, '| Remember me:', rememberMe);

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

    // Create session token
    const sessionToken = randomBytes(32).toString('hex');
    const cookieMaxAge = rememberMe
      ? SESSION_DURATION_DAYS * 24 * 60 * 60  // 30 days in seconds
      : TEMP_SESSION_DURATION_HOURS * 60 * 60; // 4 hours in seconds

    console.log('[AUTH] Login successful for:', user.email, '- Redirecting to:', redirectPath);

    const response = NextResponse.json({
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
      sessionCreated: true,
    });

    // Set HTTP-only session cookie
    response.cookies.set('aethel_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });

    // Set user ID cookie for quick validation
    response.cookies.set('aethel_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });

    // Set remember me flag (accessible to frontend)
    if (rememberMe) {
      response.cookies.set('aethel_remember', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: cookieMaxAge,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('[AUTH] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error del servidor',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
