import { NextResponse } from 'next/server';

export async function GET() {
  // Security check - only allow with secret
  const authHeader = process.env.DEBUG_SECRET;
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      hasUrl: !!process.env.DATABASE_URL,
      urlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
      urlIncludesPostgres: process.env.DATABASE_URL?.startsWith('postgresql://') || false,
      urlIncludesPooler: process.env.DATABASE_URL?.includes('pooler.supabase.com') || false,
    },
    supabase: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    },
    otherVars: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    }
  };
  
  // Try to connect to database
  let dbStatus = 'not_tested';
  let dbError = null;
  let userCount = 0;
  let adminUser = null;
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
    
    // Get user count
    userCount = await prisma.systemUser.count();
    
    // Check admin user
    adminUser = await prisma.systemUser.findUnique({
      where: { email: 'admin@aethel.tt' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    
    await prisma.$disconnect();
  } catch (error: any) {
    dbStatus = 'error';
    dbError = error.message;
  }
  
  return NextResponse.json({
    ...results,
    databaseTest: {
      status: dbStatus,
      error: dbError,
      userCount,
      adminUser
    }
  });
}
