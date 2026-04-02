import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// ============================================================================
// RATE LIMITING - Protección contra ataques de fuerza bruta
// ============================================================================

// Store simple en memoria para rate limiting (para producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;      // Ventana de tiempo en milisegundos
  maxRequests: number;   // Máximo de requests permitidos
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/signin': { windowMs: 15 * 60 * 1000, maxRequests: 5 },     // Login: 5 intentos por 15 min
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 },   // Registro: 3 por hora
  '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // Reset: 3 por hora
  'default': { windowMs: 60 * 1000, maxRequests: 100 },                  // Default: 100 por minuto
};

function getRateLimitKey(ip: string, pathname: string): string {
  // Agrupar rutas similares
  if (pathname.startsWith('/api/auth/signin') || pathname === '/api/auth/callback/credentials') {
    return `rate:auth:${ip}`;
  }
  if (pathname.startsWith('/api/auth/register')) {
    return `rate:register:${ip}`;
  }
  if (pathname.startsWith('/api/auth/forgot-password')) {
    return `rate:forgot:${ip}`;
  }
  return `rate:default:${ip}`;
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number; resetTime: number } {
  const key = getRateLimitKey(ip, pathname);
  
  // Encontrar configuración apropiada
  let config = RATE_LIMITS['default'];
  for (const [path, cfg] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path) || path === pathname) {
      config = cfg;
      break;
    }
  }

  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Nueva ventana
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    // Límite excedido
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Incrementar contador
  record.count++;
  return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

// Limpiar registros expirados cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ============================================================================
// IP EXTRACTION - Obtener IP real del cliente
// ============================================================================

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// ============================================================================
// MIDDLEWARE PRINCIPAL
// ============================================================================

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const ip = getClientIP(req);

    // ========================================================================
    // RATE LIMITING - Verificar límites
    // ========================================================================
    const rateLimit = checkRateLimit(ip, pathname);
    
    if (!rateLimit.allowed) {
      console.log(`[RATE_LIMIT] Blocked ${ip} on ${pathname}`);
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes', 
          message: 'Por favor espera antes de intentar de nuevo.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': 'exceeded',
          }
        }
      );
    }

    // ========================================================================
    // RUTAS PÚBLICAS
    // ========================================================================
    const publicPaths = [
      '/',           // Landing page
      '/login',      // Login page
      '/register',   // Registration page
      '/portal',     // Sales portal
      '/forgot-password',
      '/reset-password',
      '/terms',      // Terms and conditions
      '/checkout',   // Payment checkout pages
      '/setup',      // Database setup page (inicialización)
      '/api/auth',   // Auth API routes
      '/api/setup',  // Setup API routes
      '/api/seed',   // Seed API para inicializar DB
      '/api/seed-now', // Seed API alternativo
      '/api/debug',  // Debug endpoint
      '/api/diagnostic', // Comprehensive diagnostic endpoint
      '/api/login-test', // Login test endpoint
      // NOTA: /api/webhooks/wipay REMOVIDO - tiene su propia validación
    ];

    const isPublicPath = publicPaths.some((path) => {
      if (path === '/') return pathname === '/';
      return pathname.startsWith(path);
    });

    // Catálogos públicos de panadería
    const isPublicCatalog = pathname.match(/^\/bakery\/[^/]+\/catalog/);

    // Webhooks tienen su propia validación de firma
    const isWebhook = pathname.startsWith('/api/webhooks/');

    if (isPublicPath || isPublicCatalog || isWebhook) {
      const response = NextResponse.next();
      // Agregar headers de rate limit
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
      return response;
    }

    // ========================================================================
    // PROTECCIÓN DE RUTAS API CRÍTICAS
    // ========================================================================
    // /api/seed ahora es público para inicializar la base de datos

    // ========================================================================
    // AUTENTICACIÓN REQUERIDA
    // ========================================================================
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as string;
    const tenantSlug = token.tenantSlug as string | null;
    const industrySlug = token.industrySlug as string | null;
    const tenantStatus = token.tenantStatus as string | null;
    const isTrial = token.isTrial as boolean | null;
    const trialEndsAt = token.trialEndsAt as string | null;

    // ========================================================================
    // PROTECCIÓN POR ROL
    // ========================================================================
    
    // Admin routes - solo SUPER_ADMIN
    if (pathname.startsWith('/admin') && userRole !== 'SUPER_ADMIN') {
      console.log(`[SECURITY] Unauthorized admin access attempt by ${token.email}`);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // ========================================================================
    // VERIFICACIÓN DE ESTADO DE TENANT
    // ========================================================================
    if (userRole !== 'SUPER_ADMIN' && tenantStatus) {
      if (tenantStatus === 'suspended') {
        const suspendedUrl = new URL('/suspended', req.url);
        return NextResponse.redirect(suspendedUrl);
      }

      if (isTrial && trialEndsAt) {
        const trialEnd = new Date(trialEndsAt);
        const now = new Date();
        
        if (now >= trialEnd) {
          const activateUrl = new URL('/activate', req.url);
          return NextResponse.redirect(activateUrl);
        }
      }
    }

    // ========================================================================
    // PROTECCIÓN POR INDUSTRIA
    // ========================================================================
    const industryRoutes: Record<string, string> = {
      clinic: '/clinic',
      nurse: '/nurse',
      lawfirm: '/lawfirm',
      beauty: '/beauty',
      bakery: '/bakery',
      pharmacy: '/pharmacy',
      insurance: '/insurance',
    };

    for (const [industry, route] of Object.entries(industryRoutes)) {
      if (pathname.startsWith(route)) {
        if (userRole === 'SUPER_ADMIN') {
          return NextResponse.next();
        }

        if (industrySlug !== industry) {
          if (industrySlug && industryRoutes[industrySlug]) {
            return NextResponse.redirect(new URL(industryRoutes[industrySlug], req.url));
          }
          return NextResponse.redirect(new URL('/login', req.url));
        }
      }
    }

    // ========================================================================
    // HEADERS PARA API ROUTES
    // ========================================================================
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
      const requestHeaders = new Headers(req.headers);
      if (token.tenantId) {
        requestHeaders.set('x-tenant-id', token.tenantId as string);
      }
      requestHeaders.set('x-user-id', token.id as string);
      requestHeaders.set('x-user-role', userRole);
      requestHeaders.set('x-client-ip', ip);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        const publicPaths = [
          '/',
          '/login',
          '/register',
          '/portal',
          '/forgot-password',
          '/reset-password',
          '/terms',
          '/checkout',
          '/setup',
          '/api/auth',
          '/api/setup',
          '/api/seed',
          '/api/seed-now',
          '/api/debug',
          '/api/diagnostic',
          '/api/login-test',
          '/api/webhooks',
        ];

        const isPublicPath = publicPaths.some((path) => {
          if (path === '/') return pathname === '/';
          return pathname.startsWith(path);
        });

        const isPublicCatalog = pathname.match(/^\/bakery\/[^/]+\/catalog/);

        if (isPublicPath || isPublicCatalog) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images|logo\\.svg).*)',
  ],
};
