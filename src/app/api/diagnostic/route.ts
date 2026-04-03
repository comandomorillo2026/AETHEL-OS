import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const startTime = Date.now();

    // Check all critical environment variables (without exposing secrets)
    const envStatus = {
      // Database
      DATABASE_URL: {
        set: !!process.env.DATABASE_URL,
        prefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        isNeon: process.env.DATABASE_URL?.includes('neon.tech') || false,
      },
      DIRECT_DATABASE_URL: {
        set: !!process.env.DIRECT_DATABASE_URL,
        isNeon: process.env.DIRECT_DATABASE_URL?.includes('neon.tech') || false,
      },

      // Auth
      NEXTAUTH_SECRET: {
        set: !!process.env.NEXTAUTH_SECRET,
        length: process.env.NEXTAUTH_SECRET?.length || 0,
      },
      NEXTAUTH_URL: {
        set: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || 'NOT SET',
        isProduction: process.env.NEXTAUTH_URL?.includes('vercel.app') || false,
      },

      // Runtime
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL || 'not on vercel',
    };

    // Test database connection
    let dbStatus = { connected: false, error: null as string | null };
    let users: Array<{ email: string; role: string; isActive: boolean }> = [];

    try {
      await db.$queryRaw`SELECT 1`;
      dbStatus.connected = true;

      users = await db.systemUser.findMany({
        select: { email: true, role: true, isActive: true },
      });
    } catch (dbError) {
      dbStatus.error = dbError instanceof Error ? dbError.message : 'Unknown DB error';
    }

    // Test bcrypt functionality
    let bcryptStatus = { working: false, error: null as string | null };
    try {
      const testHash = await bcrypt.hash('test', 10);
      const testMatch = await bcrypt.compare('test', testHash);
      bcryptStatus.working = testMatch;
    } catch (bcryptError) {
      bcryptStatus.error = bcryptError instanceof Error ? bcryptError.message : 'Unknown bcrypt error';
    }

    // Get admin user details
    const adminUser = await db.systemUser.findUnique({
      where: { email: 'admin@nexusos.tt' },
      select: {
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'diagnostic_complete',
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,

      environment: envStatus,

      database: {
        status: dbStatus.connected ? 'connected' : 'error',
        error: dbStatus.error,
        totalUsers: users.length,
        users: users.map(u => ({
          email: u.email,
          role: u.role,
          active: u.isActive,
        })),
      },

      adminUser: adminUser ? {
        exists: true,
        email: adminUser.email,
        role: adminUser.role,
        isActive: adminUser.isActive,
        hasPassword: !!adminUser.passwordHash,
        hashPrefix: adminUser.passwordHash?.substring(0, 7) + '...',
        hashFormat: adminUser.passwordHash?.startsWith('$2b$') ? 'bcrypt' : 'unknown',
        hashRounds: adminUser.passwordHash?.split('$')[2] || 'unknown',
      } : { exists: false },

      bcrypt: bcryptStatus,

      nextAuthConfig: {
        sessionStrategy: 'jwt',
        providers: ['credentials'],
        signInPage: '/login',
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
    }, { status: 500 });
  }
}

// POST endpoint to test authentication directly
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password required',
      }, { status: 400 });
    }

    // Find user
    const user = await db.systemUser.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email,
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        error: 'User is not active',
        email,
      }, { status: 401 });
    }

    // Test password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      success: passwordMatch,
      error: passwordMatch ? null : 'Password does not match',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        tenantId: user.tenantId,
      },
      debug: {
        hashPrefix: user.passwordHash.substring(0, 10) + '...',
        providedPasswordLength: password.length,
        storedHashLength: user.passwordHash.length,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
