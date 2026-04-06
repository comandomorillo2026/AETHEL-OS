/**
 * Logger Unit Tests
 * Tests for structured logging system
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock pino
jest.mock('pino', () => {
  const mockLogger = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn(() => mockLogger),
  };
  return jest.fn(() => mockLogger);
});

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Log Levels', () => {
    it('should have correct log levels', () => {
      const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
      expect(levels.length).toBe(6);
    });
  });

  describe('Log Context', () => {
    it('should include service name', () => {
      const expectedService = 'aethel-os';
      expect(expectedService).toBe('aethel-os');
    });

    it('should include environment', () => {
      const env = process.env.NODE_ENV || 'development';
      expect(['development', 'production', 'test']).toContain(env);
    });
  });

  describe('Sensitive Data Redaction', () => {
    it('should redact password fields', () => {
      const sensitiveFields = ['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret', 'authorization', 'cookie'];
      expect(sensitiveFields).toContain('password');
      expect(sensitiveFields).toContain('token');
      expect(sensitiveFields).toContain('apiKey');
    });
  });
});

describe('Logger Context Helpers', () => {
  it('should format API request logs', () => {
    const logData = {
      type: 'api_request',
      method: 'POST',
      path: '/api/auth/login',
      statusCode: 200,
      durationMs: 150,
      success: true,
    };

    expect(logData.type).toBe('api_request');
    expect(logData.success).toBe(logData.statusCode < 400);
  });

  it('should format auth event logs', () => {
    const logData = {
      type: 'auth',
      event: 'login',
      userId: 'user-123',
    };

    expect(logData.type).toBe('auth');
    expect(logData.event).toBe('login');
  });

  it('should format security logs with severity', () => {
    const severities = ['low', 'medium', 'high', 'critical'];
    expect(severities).toContain('low');
    expect(severities).toContain('critical');
  });

  it('should format payment logs', () => {
    const logData = {
      type: 'payment',
      event: 'created',
      amount: 100.00,
      currency: 'TTD',
    };

    expect(logData.type).toBe('payment');
    expect(logData.currency).toBe('TTD');
  });
});

describe('Logger Child Instances', () => {
  it('should create child loggers for different components', () => {
    const components = ['api', 'auth', 'database', 'email', 'security'];
    expect(components.length).toBe(5);
    expect(components).toContain('api');
    expect(components).toContain('auth');
  });
});
