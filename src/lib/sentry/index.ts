/**
 * AETHEL OS - Sentry Error Monitoring Configuration
 * Professional error tracking and performance monitoring
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.NODE_ENV || 'development';

// Initialize Sentry only if DSN is configured
export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,

    // Performance monitoring
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,

    // Session replay (for debugging user issues)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // Ignore known errors that are not actionable
    ignoreErrors: [
      // Browser extensions
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Network errors (usually transient)
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      // Auth errors (handled by app)
      'Unauthorized',
      'Invalid token',
      // Rate limiting (expected)
      'Rate limit exceeded',
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['set-cookie'];
      }

      // Remove sensitive data from request body
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>;
        if (data) {
          delete data.password;
          delete data.passwordHash;
          delete data.token;
          delete data.secret;
        }
      }

      return event;
    },

    // Integrations
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Postgres(),
    ],

    // Additional configuration
    attachStacktrace: true,
    attachViewHierarchy: true,
  });

  console.log(`[Sentry] Initialized for environment: ${SENTRY_ENVIRONMENT}`);
}

// Helper functions for manual error capture
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const addBreadcrumb = Sentry.addBreadcrumb;

/**
 * Wrap an API handler with Sentry error tracking
 */
export function withSentryErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  handler: T,
  context?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Capture error with context
      Sentry.captureException(error, {
        extra: {
          ...context,
          args: args.map((arg) => {
            if (typeof arg === 'object' && arg !== null) {
              // Sanitize request objects
              const sanitized: Record<string, unknown> = {};
              for (const [key, value] of Object.entries(arg as Record<string, unknown>)) {
                if (['password', 'token', 'secret', 'authorization'].includes(key.toLowerCase())) {
                  sanitized[key] = '[REDACTED]';
                } else {
                  sanitized[key] = value;
                }
              }
              return sanitized;
            }
            return arg;
          }),
        },
      });
      throw error;
    }
  }) as T;
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  role?: string;
  tenantId?: string;
}): void {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.email,
    role: user.role,
    tenantId: user.tenantId,
  });
}

/**
 * Clear user context on logout
 */
export function clearSentryUser(): void {
  Sentry.setUser(null);
}

/**
 * Add custom tag for filtering
 */
export function setSentryTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Add custom context for debugging
 */
export function setSentryContext(name: string, context: Record<string, unknown>): void {
  Sentry.setContext(name, context);
}

/**
 * Create a transaction for performance monitoring
 */
export function startSentryTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op });
}

// Export Sentry for direct access
export { Sentry };
