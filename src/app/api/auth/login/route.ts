import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';
import { authLogger, securityLogger } from '@/lib/logger';

const SESSION_DURATION_DAYS = 30;
const TEMP_SESSION_DURATION_HOURS = 4;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Apply rate limiting for auth endpoints
    const rateLimitResult = checkRateLimit(request, 'auth');
    if (!rateLimitResult.success) {
      securityLogger.warn('Rate limit exceeded on login endpoint', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        remaining: rateLimitResult.remaining,
      });

      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.message,
          retryAfter: Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    authLogger.debug('Login attempt', { email, rememberMe });

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email y contraseña son requeridos'
      }, { status: 400 });
    }

    // Find user in database
    const user = await db.systemUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      securityLogger.warn('Login attempt with non-existent email', { email });
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 401 });
    }

    if (!user.isActive) {
      securityLogger.warn('Login attempt for inactive user', { email, userId: user.id });
      return NextResponse.json({
        success: false,
        error: 'Usuario inactivo. Contacta al administrador.'
      }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      securityLogger.warn('Failed login attempt - wrong password', { email, userId: user.id });
      return NextResponse.json({
        success: false,
        error: 'Contraseña incorrecta'
      }, { status: 401 });
    }

    // Get tenant info if user has a tenantId
    let tenant = null;
    if (user.tenantId) {
      try {
        tenant = await db.tenant.findUnique({
          where: { id: user.tenantId },
          select: {
            id: true,
            slug: true,
            businessName: true,
            industrySlug: true,
          }
        });
      } catch (e) {
        authLogger.warn('Could not fetch tenant info', { tenantId: user.tenantId });
      }
    }

    // Update last login
    await db.systemUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date().toISOString() },
    }).catch(err => authLogger.error('Failed to update lastLoginAt', err));

    // Determine redirect path based on role and tenant
    let redirectPath = '/clinic'; // default
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      redirectPath = '/admin';
    } else if (tenant?.slug) {
      redirectPath = `/${tenant.slug}`;
    }

    // Create session token
    const sessionToken = randomBytes(32).toString('hex');
    const cookieMaxAge = rememberMe
      ? SESSION_DURATION_DAYS * 24 * 60 * 60  // 30 days in seconds
      : TEMP_SESSION_DURATION_HOURS * 60 * 60; // 4 hours in seconds

    authLogger.info('Login successful', {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      rememberMe,
      duration: Date.now() - startTime,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantSlug: tenant?.slug || null,
        tenantName: tenant?.businessName || null,
        industrySlug: tenant?.industrySlug || null,
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

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

    return response;
  } catch (error) {
    authLogger.error('Login error', error);
    return NextResponse.json({
      success: false,
      error: 'Error del servidor',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
