import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/signin': { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  '/api/auth-test': { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  'default': { windowMs: 60 * 1000, maxRequests: 100 },
};

function getRateLimitKey(ip: string, pathname: string): string {
  if (pathname.startsWith('/api/auth/signin')) return `rate:auth:${ip}`;
  if (pathname.startsWith('/api/auth/register')) return `rate:register:${ip}`;
  if (pathname.startsWith('/api/auth/forgot-password')) return `rate:forgot:${ip}`;
  if (pathname.startsWith('/api/auth-test')) return `rate:auth-test:${ip}`;
  return `rate:default:${ip}`;
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number; resetTime: number } {
  const key = getRateLimitKey(ip, pathname);
  let config = RATE_LIMITS['default'];
  for (const [path, cfg] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) { config = cfg; break; }
  }
  const now = Date.now();
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }
  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  record.count++;
  return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = req.headers.get('x-real-ip');
  if (realIP) return realIP;
  return 'unknown';
}

// ============================================================================
// LEER COOKIE de sesión (soporta tanto nexus_token como aethel_session)
// ============================================================================

function getUserFromCookie(req: NextRequest) {
  // Try nexus_token first (legacy)
  const nexusToken = req.cookies.get('nexus_token')?.value;
  if (nexusToken) {
    try {
      return JSON.parse(atob(nexusToken));
    } catch {
      // Continue to check other cookies
    }
  }
  
  // Try aethel_user_id cookie
  const aethelUserId = req.cookies.get('aethel_user_id')?.value;
  const aethelSession = req.cookies.get('aethel_session')?.value;
  
  if (aethelUserId && aethelSession) {
    // Session exists, return a minimal user object
    // The actual user validation happens in API routes
    return {
      id: aethelUserId,
      sessionToken: aethelSession,
      role: 'USER', // Will be properly validated in protected routes
    };
  }
  
  return null;
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIP(req);

  // RATE LIMITING
  const rateLimit = checkRateLimit(ip, pathname);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
    );
  }

  // RUTAS PÚBLICAS
  const publicPaths = [
    '/', '/login', '/register', '/portal', '/forgot-password', '/reset-password',
    '/terms', '/checkout', '/setup',
    '/api/auth', '/api/setup', '/api/seed', '/api/seed-now',
    '/api/debug', '/api/diagnostic', '/api/login-test', '/api/auth-test', '/api/webhooks',
  ];

  const isPublicPath = publicPaths.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });

  const isPublicCatalog = pathname.match(/^\/bakery\/[^/]+\/catalog/);
  const isWebhook = pathname.startsWith('/api/webhooks/');

  if (isPublicPath || isPublicCatalog || isWebhook) {
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    return response;
  }

  // AUTENTICACIÓN - Leer cookie nexus_token
  const user = getUserFromCookie(req);

  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // PROTECCIÓN POR ROL
  if (pathname.startsWith('/admin') && user.role !== 'SUPER_ADMIN') {
    console.log(`[SECURITY] Unauthorized admin access by ${user.email}`);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // VERIFICACIÓN DE TENANT
  if (user.role !== 'SUPER_ADMIN' && user.tenantStatus === 'suspended') {
    return NextResponse.redirect(new URL('/suspended', req.url));
  }
  if (user.role !== 'SUPER_ADMIN' && user.isTrial && user.trialEndsAt) {
    if (new Date() >= new Date(user.trialEndsAt)) {
      return NextResponse.redirect(new URL('/activate', req.url));
    }
  }

  // PROTECCIÓN POR INDUSTRIA
  const industryRoutes: Record<string, string> = {
    clinic: '/clinic', nurse: '/nurse', lawfirm: '/lawfirm',
    beauty: '/beauty', bakery: '/bakery', pharmacy: '/pharmacy', insurance: '/insurance',
  };

  for (const [industry, route] of Object.entries(industryRoutes)) {
    if (pathname.startsWith(route) && user.role !== 'SUPER_ADMIN') {
      if (user.industrySlug !== industry) {
        if (user.industrySlug && industryRoutes[user.industrySlug]) {
          return NextResponse.redirect(new URL(industryRoutes[user.industrySlug], req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  // HEADERS PARA API ROUTES
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(req.headers);
    if (user.tenantId) requestHeaders.set('x-tenant-id', user.tenantId);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-client-ip', ip);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|public|images|logo\\.svg).*)',
  ],
};
