/**
 * AETHEL OS - Control Tower Metrics API
 * Unified metrics endpoint for the control tower dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';
import {
  getSupabaseMetrics,
  getPlanRecommendation,
  DatabaseMetrics
} from '@/lib/monitoring/supabase-metrics';
import {
  getSentryErrors,
  analyzeErrors,
  SentryStats,
  ErrorAnalysis
} from '@/lib/monitoring/sentry-errors';

export interface ControlTowerMetrics {
  timestamp: string;
  database: DatabaseMetrics;
  sentry: SentryStats;
  errorAnalysis: ErrorAnalysis;
  planRecommendation: ReturnType<typeof getPlanRecommendation>;
  systemHealth: {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    message: string;
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Apply rate limiting
    const rateLimitResult = checkRateLimit(request, 'admin');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    // Get all metrics in parallel
    const [dbMetrics, sentryStats] = await Promise.all([
      getSupabaseMetrics(),
      getSentryErrors(),
    ]);

    // Analyze errors
    const errorAnalysis = analyzeErrors(sentryStats);

    // Get plan recommendation
    const planRecommendation = getPlanRecommendation(dbMetrics);

    // Calculate overall system health
    const healthScore = Math.round(
      (dbMetrics.healthStatus === 'healthy' ? 100 :
       dbMetrics.healthStatus === 'warning' ? 70 : 30) * 0.6 +
      errorAnalysis.healthScore * 0.4
    );

    const systemHealth = {
      score: healthScore,
      status: healthScore >= 80 ? 'healthy' as const :
              healthScore >= 50 ? 'warning' as const : 'critical' as const,
      message: getHealthMessage(healthScore, dbMetrics, errorAnalysis),
    };

    const metrics: ControlTowerMetrics = {
      timestamp: new Date().toISOString(),
      database: dbMetrics,
      sentry: sentryStats,
      errorAnalysis,
      planRecommendation,
      systemHealth,
    };

    apiLogger.apiRequest('GET', '/api/admin/control-tower/metrics', 200, Date.now() - startTime);

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    apiLogger.error('Control tower metrics error', error);
    return NextResponse.json(
      { error: 'Error obteniendo métricas del sistema' },
      { status: 500 }
    );
  }
}

function getHealthMessage(
  score: number,
  db: DatabaseMetrics,
  errors: ErrorAnalysis
): string {
  if (score >= 90) {
    return 'Sistema funcionando óptimamente';
  }
  if (score >= 70) {
    if (db.alerts.length > 0) {
      return `Atención: ${db.alerts[0].message}`;
    }
    if (errors.warnings.length > 0) {
      return `Advertencia: ${errors.warnings[0].message}`;
    }
    return 'Sistema con leves advertencias';
  }
  if (score >= 50) {
    if (db.alerts.some(a => a.severity === 'high')) {
      return `Alerta: ${db.alerts.find(a => a.severity === 'high')?.message}`;
    }
    if (errors.criticalIssues.length > 0) {
      return `Error: ${errors.criticalIssues[0].message}`;
    }
    return 'Sistema requiere atención';
  }
  return 'Sistema en estado crítico - Requiere intervención inmediata';
}
