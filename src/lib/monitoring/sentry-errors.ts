/**
 * AETHEL OS - Sentry Error Monitoring Integration
 * Fetches and analyzes errors from Sentry API
 */

export interface SentryError {
  id: string;
  title: string;
  message: string;
  culprit: string;
  level: 'error' | 'warning' | 'info';
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  project: string;
  permalink: string;
  stacktrace?: string;
}

export interface SentryStats {
  totalErrors: number;
  errors24h: number;
  errors7d: number;
  errors30d: number;
  unresolvedCount: number;
  topErrors: SentryError[];
  errorTrend: ErrorTrendPoint[];
  affectedUsers: number;
  isConfigured: boolean;
}

export interface ErrorTrendPoint {
  date: string;
  count: number;
}

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}

/**
 * Extract Sentry organization and project from DSN
 */
function parseSentryDSN(dsn: string): { host: string; projectId: string } | null {
  try {
    // DSN format: https://key@host/project_id
    const match = dsn.match(/@([^/]+)\/(\d+)/);
    if (match) {
      return {
        host: match[1],
        projectId: match[2],
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Fetch errors from Sentry API
 * Note: This requires Sentry API token in production
 */
export async function getSentryErrors(): Promise<SentryStats> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    return getEmptySentryStats();
  }

  const parsed = parseSentryDSN(dsn);

  // Simulated data for demo - in production, use Sentry API
  // To use real data, you need:
  // 1. Sentry Auth Token (SENTRY_AUTH_TOKEN env var)
  // 2. Call Sentry API: https://sentry.io/api/0/projects/{org}/{project}/issues/

  return {
    totalErrors: 0,
    errors24h: 0,
    errors7d: 0,
    errors30d: 0,
    unresolvedCount: 0,
    topErrors: [],
    errorTrend: generateErrorTrend(),
    affectedUsers: 0,
    isConfigured: true,
  };
}

/**
 * Generate error trend for last 7 days
 */
function generateErrorTrend(): ErrorTrendPoint[] {
  const trend: ErrorTrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      count: 0, // Will be populated by real Sentry data
    });
  }
  return trend;
}

/**
 * Get empty stats when Sentry is not configured
 */
function getEmptySentryStats(): SentryStats {
  return {
    totalErrors: 0,
    errors24h: 0,
    errors7d: 0,
    errors30d: 0,
    unresolvedCount: 0,
    topErrors: [],
    errorTrend: generateErrorTrend(),
    affectedUsers: 0,
    isConfigured: false,
  };
}

/**
 * Analyze errors and provide recommendations
 */
export function analyzeErrors(errors: SentryStats): ErrorAnalysis {
  const analysis: ErrorAnalysis = {
    healthScore: 100,
    criticalIssues: [],
    warnings: [],
    recommendations: [],
  };

  if (!errors.isConfigured) {
    analysis.warnings.push({
      type: 'configuration',
      message: 'Sentry no está configurado',
      action: 'Agrega NEXT_PUBLIC_SENTRY_DSN a tus variables de entorno',
    });
    analysis.healthScore -= 20;
  }

  if (errors.errors24h > 100) {
    analysis.criticalIssues.push({
      type: 'error_volume',
      message: `${errors.errors24h} errores en las últimas 24 horas`,
      action: 'Revisa los logs y corrige los errores más frecuentes',
    });
    analysis.healthScore -= 30;
  } else if (errors.errors24h > 10) {
    analysis.warnings.push({
      type: 'error_volume',
      message: `${errors.errors24h} errores en las últimas 24 horas`,
      action: 'Monitorea los errores y prioriza correcciones',
    });
    analysis.healthScore -= 10;
  }

  if (errors.affectedUsers > 100) {
    analysis.criticalIssues.push({
      type: 'user_impact',
      message: `${errors.affectedUsers} usuarios afectados por errores`,
      action: 'Prioriza correcciones que afecten más usuarios',
    });
    analysis.healthScore -= 20;
  }

  if (errors.unresolvedCount > 50) {
    analysis.recommendations.push({
      type: 'cleanup',
      message: `${errors.unresolvedCount} errores sin resolver`,
      action: 'Resuelve o archiva errores antiguos en Sentry',
    });
  }

  // Ensure health score is between 0 and 100
  analysis.healthScore = Math.max(0, Math.min(100, analysis.healthScore));

  return analysis;
}

export interface ErrorAnalysis {
  healthScore: number;
  criticalIssues: IssueItem[];
  warnings: IssueItem[];
  recommendations: IssueItem[];
}

export interface IssueItem {
  type: string;
  message: string;
  action: string;
}
