/**
 * AETHEL OS - Rate Limiting Middleware
 * Professional API protection with configurable limits
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limit configuration per endpoint type
export const rateLimitConfig = {
  // Authentication endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
    message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.',
  },
  // API endpoints - moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Límite de solicitudes excedido. Intenta de nuevo en un minuto.',
  },
  // Public endpoints - generous limits
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Rate limit exceeded. Please slow down.',
  },
  // Admin endpoints - very generous for internal use
  admin: {
    windowMs: 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute
    message: 'Admin rate limit exceeded.',
  },
  // Webhook endpoints - specific for external services
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    max: 500, // 500 requests per minute (for legitimate webhooks)
    message: 'Webhook rate limit exceeded.',
  },
};

// In-memory store for rate limiting (for development/small deployments)
// In production with multiple instances, use Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000);
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  const ip = cfIp || realIp || forwarded?.split(',')[0] || 'unknown';

  // Include user agent hash for additional fingerprinting
  const userAgent = request.headers.get('user-agent') || '';

  return `${ip}:${hashString(userAgent)}`;
}

/**
 * Simple hash function for fingerprinting
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  message?: string;
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimitConfig = 'api',
  customKey?: string
): RateLimitResult {
  const config = rateLimitConfig[type];
  const clientId = getClientIdentifier(request);
  const key = customKey || `${type}:${clientId}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    // Create new record
    const newRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newRecord);

    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: new Date(newRecord.resetTime),
    };
  }

  // Increment count
  record.count++;

  if (record.count > config.max) {
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      reset: new Date(record.resetTime),
      message: config.message,
    };
  }

  return {
    success: true,
    limit: config.max,
    remaining: config.max - record.count,
    reset: new Date(record.resetTime),
  };
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  type: keyof typeof rateLimitConfig = 'api'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = checkRateLimit(request, type);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Rate Limit Exceeded',
          message: result.message,
          retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toISOString(),
            'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.reset.toISOString());

    return response;
  };
}

/**
 * Higher-order function for rate limiting API routes
 */
export function rateLimited(
  type: keyof typeof rateLimitConfig = 'api'
): (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (request: NextRequest, ...args: unknown[]) {
      const result = checkRateLimit(request, type);

      if (!result.success) {
        return NextResponse.json(
          {
            error: 'Rate Limit Exceeded',
            message: result.message,
          },
          { status: 429 }
        );
      }

      return originalMethod.apply(this, [request, ...args]);
    };

    return descriptor;
  };
}

// Export types
export type RateLimitType = keyof typeof rateLimitConfig;
