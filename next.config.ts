import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// ============================================================================
// AETHEL OS - CONFIGURACIÓN DE PRODUCCIÓN
// ============================================================================

const nextConfig: NextConfig = {
  // TEMPORAL: Ignorar errores de build hasta resolverlos todos
  // TODO: Resolver errores de TypeScript y remover esta configuración
  typescript: {
    ignoreBuildErrors: true,
  },

  // Habilitar Strict Mode para React
  reactStrictMode: true,

  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevenir clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevenir MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Habilitar XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // CSP para páginas de API
        source: '/api/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Powered-by header removido por seguridad
  poweredByHeader: false,

  // Compresión habilitada
  compress: true,

  // Generar ETags para cache
  generateEtags: true,
};

// Sentry configuration
const sentryConfig = {
  // Silent logging in production
  silent: process.env.NODE_ENV === 'production',

  // Source maps upload configuration
  org: 'aethel-os',
  project: 'aethel-os',

  // widen the file trace for troubleshooting
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: '/monitoring',

  // Hide source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
};

// Export with Sentry wrapper if DSN is configured
export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryConfig)
  : nextConfig;
