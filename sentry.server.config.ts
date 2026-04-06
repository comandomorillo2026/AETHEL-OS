/**
 * Sentry Server Configuration for AETHEL OS
 * Server-side error monitoring
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // Ignore common server errors
    ignoreErrors: [
      'NetworkError',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'Rate limit exceeded',
    ],

    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['x-api-key'];
      }

      return event;
    },

    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],
  });
}
