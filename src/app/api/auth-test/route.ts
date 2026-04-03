import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('[AUTH-TEST] Testing login for:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.systemUser.findUnique({
      where: { email },
    });

    console.log('[AUTH-TEST] User found:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'User inactive' }, { status: 401 });
    }

    console.log('[AUTH-TEST] Testing password...');
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('[AUTH-TEST] Password match:', passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // === ESTO ES LO QUE FALTABA: Crear cookie de sesión ===
    const tokenData = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantSlug: user.tenantSlug || null,
      industrySlug: user.industrySlug || null,
      tenantStatus: user.tenantStatus || null,
      tenantId: user.tenantId || null,
      isTrial: user.isTrial || null,
      trialEndsAt: user.trialEndsAt || null,
    });
    const token = Buffer.from(tokenData).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

    response.cookies.set('nexus_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[AUTH-TEST] Error:', error);
    return NextResponse.json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
