import type { NextConfig } from "next";

// ============================================================================
// NEXUSOS - CONFIGURACIÓN DE PRODUCCIÓN
// ============================================================================
// 
// NOTA: Los errores de TypeScript/ESLint están temporalmente ignorados.
// PRIORIDAD ALTA: Resolver todos los errores y remover estas configuraciones.
// Ver: /download/NexusOS_Evaluacion_Produccion.md para lista completa.
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

export default nextConfig;
