/**
 * Rate Limiting Unit Tests
 * Tests for rate limiting middleware
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { checkRateLimit, rateLimitConfig } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

// Mock NextRequest
function createMockRequest(options: {
  ip?: string;
  userAgent?: string;
}): NextRequest {
  const headers = new Headers();
  if (options.ip) {
    headers.set('x-forwarded-for', options.ip);
  }
  if (options.userAgent) {
    headers.set('user-agent', options.userAgent);
  }

  return {
    headers,
    method: 'GET',
    url: 'http://localhost:3000/api/test',
  } as unknown as NextRequest;
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the rate limit store by waiting for window to expire
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Configuration', () => {
    it('should have correct auth rate limits', () => {
      expect(rateLimitConfig.auth.max).toBe(10);
      expect(rateLimitConfig.auth.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    });

    it('should have correct API rate limits', () => {
      expect(rateLimitConfig.api.max).toBe(60);
      expect(rateLimitConfig.api.windowMs).toBe(60 * 1000); // 1 minute
    });

    it('should have correct public rate limits', () => {
      expect(rateLimitConfig.public.max).toBe(100);
      expect(rateLimitConfig.public.windowMs).toBe(60 * 1000);
    });

    it('should have correct admin rate limits', () => {
      expect(rateLimitConfig.admin.max).toBe(200);
      expect(rateLimitConfig.admin.windowMs).toBe(60 * 1000);
    });

    it('should have correct webhook rate limits', () => {
      expect(rateLimitConfig.webhook.max).toBe(500);
      expect(rateLimitConfig.webhook.windowMs).toBe(60 * 1000);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const request = createMockRequest({ ip: '192.168.1.1' });
      const result = checkRateLimit(request, 'api');

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(rateLimitConfig.api.max - 1);
      expect(result.limit).toBe(rateLimitConfig.api.max);
    });

    it('should track multiple requests from same IP', () => {
      const request = createMockRequest({ ip: '192.168.1.1' });

      // First request
      const result1 = checkRateLimit(request, 'api');
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(59);

      // Second request
      const result2 = checkRateLimit(request, 'api');
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(58);
    });

    it('should differentiate between different IPs', () => {
      const request1 = createMockRequest({ ip: '192.168.1.1' });
      const request2 = createMockRequest({ ip: '192.168.1.2' });

      const result1 = checkRateLimit(request1, 'api');
      const result2 = checkRateLimit(request2, 'api');

      // Both should have same remaining (different counters)
      expect(result1.remaining).toBe(59);
      expect(result2.remaining).toBe(59);
    });

    it('should apply stricter limits for auth endpoints', () => {
      const request = createMockRequest({ ip: '192.168.1.1' });
      const result = checkRateLimit(request, 'auth');

      expect(result.limit).toBe(10); // auth has lower limit
    });

    it('should return reset time', () => {
      const request = createMockRequest({ ip: '192.168.1.1' });
      const result = checkRateLimit(request, 'api');

      expect(result.reset).toBeInstanceOf(Date);
      expect(result.reset.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Rate Limit Messages', () => {
    it('should have Spanish message for auth', () => {
      expect(rateLimitConfig.auth.message).toContain('15 minutos');
    });

    it('should have Spanish message for API', () => {
      expect(rateLimitConfig.api.message).toContain('minuto');
    });
  });
});

describe('Rate Limit Headers', () => {
  it('should include standard rate limit headers', () => {
    const request = createMockRequest({ ip: '192.168.1.1' });
    const result = checkRateLimit(request, 'api');

    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('reset');
  });

  it('should return error message when limit exceeded', () => {
    // Simulate exceeding limit by making many requests
    const request = createMockRequest({ ip: '192.168.1.100' });

    // Make requests until we hit the limit
    let lastResult;
    for (let i = 0; i <= rateLimitConfig.auth.max + 1; i++) {
      lastResult = checkRateLimit(request, 'auth');
    }

    expect(lastResult?.success).toBe(false);
    expect(lastResult?.message).toBeTruthy();
  });
});
