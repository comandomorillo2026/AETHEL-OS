/**
 * AETHEL OS - Structured Logging System
 * Professional logging with Pino for production environments
 */

import pino from 'pino';

// Log levels
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Log context interface
export interface LogContext {
  [key: string]: string | number | boolean | null | undefined;
}

// Configure logger based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create Pino logger instance
const pinoLogger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      'authorization',
      'cookie',
    ],
    censor: '[REDACTED]',
  },
});

/**
 * AETHEL Logger class with structured logging
 */
class AethelLogger {
  private context: LogContext = {
    service: 'aethel-os',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  constructor(private baseLogger: pino.Logger = pinoLogger) {}

  /**
   * Set persistent context for all logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): AethelLogger {
    const childLogger = new AethelLogger(this.baseLogger.child(context));
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  /**
   * Log trace message
   */
  trace(message: string, context?: LogContext): void {
    this.baseLogger.trace({ ...this.context, ...context }, message);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    this.baseLogger.debug({ ...this.context, ...context }, message);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.baseLogger.info({ ...this.context, ...context }, message);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.baseLogger.warn({ ...this.context, ...context }, message);
  }

  /**
   * Log error message with optional error object
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...this.context, ...context };

    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.errorStack = isDevelopment ? error.stack : undefined;
    } else if (error) {
      errorContext.error = String(error);
    }

    this.baseLogger.error(errorContext, message);
  }

  /**
   * Log fatal message (process should terminate)
   */
  fatal(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...this.context, ...context };

    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.errorStack = error.stack;
    } else if (error) {
      errorContext.error = String(error);
    }

    this.baseLogger.fatal(errorContext, message);
  }

  /**
   * Log API request
   */
  apiRequest(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
  ): void {
    this.info('API Request', {
      ...context,
      type: 'api_request',
      method,
      path,
      statusCode,
      durationMs,
      success: statusCode < 400,
    });
  }

  /**
   * Log authentication event
   */
  auth(event: string, userId?: string, context?: LogContext): void {
    this.info(`Auth: ${event}`, {
      ...context,
      type: 'auth',
      event,
      userId,
    });
  }

  /**
   * Log database operation
   */
  db(operation: string, table: string, durationMs?: number, context?: LogContext): void {
    this.debug('Database Operation', {
      ...context,
      type: 'database',
      operation,
      table,
      durationMs,
    });
  }

  /**
   * Log tenant operation
   */
  tenant(tenantId: string, action: string, context?: LogContext): void {
    this.info(`Tenant: ${action}`, {
      ...context,
      type: 'tenant',
      tenantId,
      action,
    });
  }

  /**
   * Log security event
   */
  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): void {
    const logFn = severity === 'critical' || severity === 'high' ? this.warn : this.info;
    logFn.call(this, `Security: ${event}`, {
      ...context,
      type: 'security',
      event,
      severity,
    });
  }

  /**
   * Log email event
   */
  email(event: string, to: string, success: boolean, context?: LogContext): void {
    const logFn = success ? this.info : this.warn;
    logFn.call(this, `Email: ${event}`, {
      ...context,
      type: 'email',
      event,
      to: success ? to : '[failed]',
      success,
    });
  }

  /**
   * Log payment event
   */
  payment(event: string, amount: number, currency: string, context?: LogContext): void {
    this.info(`Payment: ${event}`, {
      ...context,
      type: 'payment',
      event,
      amount,
      currency,
    });
  }
}

// Export singleton instance
export const logger = new AethelLogger();

// Create context-specific loggers
export const apiLogger = logger.child({ component: 'api' });
export const authLogger = logger.child({ component: 'auth' });
export const dbLogger = logger.child({ component: 'database' });
export const emailLogger = logger.child({ component: 'email' });
export const securityLogger = logger.child({ component: 'security' });

// Export default
export default logger;
