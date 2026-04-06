import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

const SESSION_DURATION_DAYS = 30;
const TEMP_SESSION_DURATION_HOURS = 4;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, rememberMe } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    // Verify user exists and is active
    const user = await db.systemUser.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Usuario no válido' }, { status: 401 });
    }

    // Generate session token
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = rememberMe
      ? new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + TEMP_SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString();

    // Store session (we'll use a cookie approach for simplicity)
    // The token is stored in an HTTP-only cookie

    const response = NextResponse.json({
      success: true,
      sessionToken,
      expiresAt,
      rememberMe,
    });

    // Set HTTP-only cookie with session token
    const cookieMaxAge = rememberMe
      ? SESSION_DURATION_DAYS * 24 * 60 * 60  // 30 days
      : TEMP_SESSION_DURATION_HOURS * 60 * 60; // 4 hours

    response.cookies.set('aethel_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });

    // Also set user info cookie (not sensitive, for quick access)
    response.cookies.set('aethel_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });

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
    console.error('[SESSION_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Error creando sesión' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('aethel_session')?.value;
    const userId = request.cookies.get('aethel_user_id')?.value;

    if (!sessionToken || !userId) {
      return NextResponse.json({ valid: false });
    }

    // Verify user exists and is active
    const user = await db.systemUser.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            industrySlug: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      // Clear invalid cookies
      const response = NextResponse.json({ valid: false });
      response.cookies.delete('aethel_session');
      response.cookies.delete('aethel_user_id');
      response.cookies.delete('aethel_remember');
      return response;
    }

    return NextResponse.json({
      valid: true,
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
    });
  } catch (error) {
    console.error('[SESSION_VALIDATE_ERROR]', error);
    return NextResponse.json({ valid: false });
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear all session cookies
  response.cookies.delete('aethel_session');
  response.cookies.delete('aethel_user_id');
  response.cookies.delete('aethel_remember');

  return response;
}
