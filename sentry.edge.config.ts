/**
 * Sentry Edge Configuration for AETHEL OS
 * Edge runtime error monitoring (middleware, edge functions)
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Performance monitoring (lower for edge)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // Ignore common errors
    ignoreErrors: [
      'NetworkError',
      'Failed to fetch',
    ],
  });
}
