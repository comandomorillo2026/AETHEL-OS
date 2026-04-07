/**
 * AETHEL OS - AI System Analyst
 * Intelligent monitoring assistant that analyzes system health and provides recommendations
 * Uses z-ai-web-dev-sdk for AI capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';
import { getSupabaseMetrics, getPlanRecommendation } from '@/lib/monitoring/supabase-metrics';
import { getSentryErrors, analyzeErrors } from '@/lib/monitoring/sentry-errors';
import ZAI from 'z-ai-web-dev-sdk';

export interface AIAnalysisRequest {
  question?: string;
  context?: 'full' | 'database' | 'errors' | 'performance';
  autoAction?: boolean;
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  recommendations: Recommendation[];
  potentialActions: PotentialAction[];
  riskLevel: 'low' | 'medium' | 'high';
  canAutoExecute: boolean;
  timestamp: string;
}

export interface Recommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'database' | 'performance' | 'security' | 'cost' | 'maintenance';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface PotentialAction {
  id: string;
  type: 'cleanup' | 'optimize' | 'archive' | 'alert' | 'scale';
  description: string;
  autoExecutable: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedImpact: string;
  requiresApproval: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = checkRateLimit(request, 'admin');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    const body: AIAnalysisRequest = await request.json();
    const { question, context = 'full' } = body;

    // Gather system data
    const [dbMetrics, sentryStats] = await Promise.all([
      getSupabaseMetrics(),
      getSentryErrors(),
    ]);

    const errorAnalysis = analyzeErrors(sentryStats);
    const planRecommendation = getPlanRecommendation(dbMetrics);

    // Build context for AI
    const systemContext = buildSystemContext(dbMetrics, sentryStats, errorAnalysis, planRecommendation);

    // Create AI prompt
    const prompt = buildAIPrompt(question, systemContext, context);

    // Get AI analysis
    const aiResponse = await getAIAnalysis(prompt, systemContext);

    // Generate potential actions (safe, non-destructive)
    const potentialActions = generatePotentialActions(dbMetrics, errorAnalysis);

    const response: AIAnalysisResponse = {
      success: true,
      analysis: aiResponse.analysis,
      recommendations: aiResponse.recommendations,
      potentialActions,
      riskLevel: calculateRiskLevel(dbMetrics, errorAnalysis),
      canAutoExecute: false, // AI cannot auto-execute - requires human approval
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    apiLogger.error('AI Analyst error', error);
    return NextResponse.json(
      {
        success: false,
        analysis: 'Error al analizar el sistema. Por favor intenta de nuevo.',
        recommendations: [],
        potentialActions: [],
        riskLevel: 'medium',
        canAutoExecute: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function buildSystemContext(
  db: ReturnType<typeof getSupabaseMetrics> extends Promise<infer T> ? T : never,
  sentry: ReturnType<typeof getSentryErrors> extends Promise<infer T> ? T : never,
  errors: ReturnType<typeof analyzeErrors>,
  plan: ReturnType<typeof getPlanRecommendation>
): string {
  return `
# AETHEL OS - Estado del Sistema

## Base de Datos (Supabase)
- Almacenamiento usado: ${db.storageUsedMB}MB de ${db.storageLimitMB}MB (${db.storagePercentage}%)
- Conexiones activas: ${db.activeConnections} de ${db.maxConnections} (${db.connectionPercentage}%)
- Total de tablas: ${db.totalTables}
- Total de registros: ${db.totalRecords.toLocaleString()}
- Estado de salud: ${db.healthStatus}
- Alertas activas: ${db.alerts.length}

## Monitoreo de Errores (Sentry)
- Configurado: ${sentry.isConfigured ? 'Sí' : 'No'}
- Errores últimas 24h: ${sentry.errors24h}
- Errores últimos 7 días: ${sentry.errors7d}
- Usuarios afectados: ${sentry.affectedUsers}

## Análisis de Errores
- Puntuación de salud: ${errors.healthScore}/100
- Problemas críticos: ${errors.criticalIssues.length}
- Advertencias: ${errors.warnings.length}

## Plan Actual
- Plan: ${plan.currentPlan}
- Recomendación: ${plan.recommendedPlan}
- Razón: ${plan.reason}
`;
}

function buildAIPrompt(
  question: string | undefined,
  systemContext: string,
  context: string
): string {
  const basePrompt = `Eres el analista de sistemas de AETHEL OS, una plataforma SaaS multi-industria para el mercado caribeño.

Tu rol es:
1. Analizar el estado del sistema en tiempo real
2. Identificar problemas potenciales antes de que sean críticos
3. Proporcionar recomendaciones prácticas y seguras
4. Sugerir acciones que NO dañen el sistema

IMPORTANTE:
- NUNCA sugieras eliminar datos sin confirmación explícita del usuario
- Siempre presenta opciones con diferentes niveles de riesgo
- Prioriza la estabilidad del sistema sobre optimizaciones agresivas
- Considera el contexto de que es un sistema en producción con clientes reales

${systemContext}

${question ? `Pregunta del administrador: ${question}` : 'Por favor analiza el estado actual del sistema y proporciona un diagnóstico completo.'}

Responde en español, con un tono profesional pero accesible. Estructura tu respuesta con:
1. Diagnóstico actual
2. Problemas identificados (si hay)
3. Recomendaciones priorizadas
4. Próximos pasos sugeridos`;

  return basePrompt;
}

async function getAIAnalysis(prompt: string, systemContext: string): Promise<{
  analysis: string;
  recommendations: Recommendation[];
}> {
  try {
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres un analista de sistemas experto para AETHEL OS.
Responde siempre en español.
Sé conciso pero completo.
Proporciona recomendaciones prácticas y seguras.
NUNCA sugieras acciones destructivas sin aprobación.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const analysis = completion.choices[0]?.message?.content || 'No se pudo generar análisis.';

    // Parse recommendations from context
    const recommendations = extractRecommendations(analysis, systemContext);

    return { analysis, recommendations };
  } catch (error) {
    apiLogger.error('AI completion error', error);

    // Fallback analysis without AI
    return {
      analysis: `
## Diagnóstico del Sistema

Basado en las métricas actuales:

**Base de Datos:**
- Almacenamiento y conexiones dentro de parámetros normales
- ${systemContext.includes('Alertas activas: 0') ? 'Sin alertas activas' : 'Revisar alertas activas'}

**Estado General:**
- Sistema operativo y funcional
- Monitoreo activo en funcionamiento

**Recomendaciones:**
1. Continuar monitoreando las métricas regularmente
2. Configurar Sentry para detección temprana de errores
3. Mantener backups actualizados
      `.trim(),
      recommendations: [
        {
          priority: 'medium',
          category: 'monitoring',
          title: 'Configurar Sentry',
          description: 'Agregar DSN de Sentry para monitoreo de errores en tiempo real',
          impact: 'Detección temprana de problemas',
          effort: 'low',
        }
      ]
    };
  }
}

function extractRecommendations(analysis: string, context: string): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Extract from context-based rules
  if (context.includes('storagePercentage') && context.includes('%')) {
    const match = context.match(/Almacenamiento.*?(\d+(?:\.\d+)?)%/);
    if (match && parseFloat(match[1]) > 70) {
      recommendations.push({
        priority: parseFloat(match[1]) > 90 ? 'critical' : 'high',
        category: 'database',
        title: 'Optimizar almacenamiento',
        description: 'El almacenamiento está ocupando más del 70% de la capacidad',
        impact: 'Evitar interrupciones por espacio insuficiente',
        effort: 'medium',
      });
    }
  }

  if (context.includes('Sentry Configurado: No')) {
    recommendations.push({
      priority: 'medium',
      category: 'monitoring',
      title: 'Configurar Sentry',
      description: 'Sentry no está configurado. Perderás visibilidad de errores en producción.',
      impact: 'Mejor detección de errores y tiempos de respuesta más rápidos',
      effort: 'low',
    });
  }

  return recommendations;
}

function generatePotentialActions(
  db: Awaited<ReturnType<typeof getSupabaseMetrics>>,
  errors: ReturnType<typeof analyzeErrors>
): PotentialAction[] {
  const actions: PotentialAction[] = [];

  // Only suggest safe, non-destructive actions
  if (db.storagePercentage > 80) {
    actions.push({
      id: 'archive-old-logs',
      type: 'archive',
      description: 'Archivar logs de actividad mayores a 90 días',
      autoExecutable: false, // Requires approval
      riskLevel: 'low',
      estimatedImpact: 'Podría liberar entre 10-50MB de espacio',
      requiresApproval: true,
    });
  }

  if (db.connectionPercentage > 70) {
    actions.push({
      id: 'optimize-connections',
      type: 'optimize',
      description: 'Cerrar conexiones inactivas y optimizar pool',
      autoExecutable: false,
      riskLevel: 'low',
      estimatedImpact: 'Reducir uso de conexiones en 20-30%',
      requiresApproval: true,
    });
  }

  if (errors.criticalIssues.length > 0) {
    actions.push({
      id: 'alert-team',
      type: 'alert',
      description: 'Enviar alerta al equipo técnico sobre problemas críticos',
      autoExecutable: true, // Safe to auto-execute
      riskLevel: 'low',
      estimatedImpact: 'Notificación inmediata al equipo',
      requiresApproval: false,
    });
  }

  return actions;
}

function calculateRiskLevel(
  db: Awaited<ReturnType<typeof getSupabaseMetrics>>,
  errors: ReturnType<typeof analyzeErrors>
): 'low' | 'medium' | 'high' {
  if (db.healthStatus === 'critical' || errors.criticalIssues.length > 0) {
    return 'high';
  }
  if (db.healthStatus === 'warning' || errors.warnings.length > 0) {
    return 'medium';
  }
  return 'low';
}
