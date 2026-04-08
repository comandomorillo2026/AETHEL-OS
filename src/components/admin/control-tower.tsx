'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Server,
  Users,
  HardDrive,
  Wifi,
  Bot,
  Send,
  Sparkles,
  Shield,
  ArrowUpCircle,
  Clock,
  MemoryStick,
} from 'lucide-react';

interface ControlTowerMetrics {
  timestamp: string;
  database: {
    storageUsedMB: number;
    storageLimitMB: number;
    storagePercentage: number;
    activeConnections: number;
    idleConnections: number;
    maxConnections: number;
    connectionPercentage: number;
    totalTables: number;
    totalRecords: number;
    healthStatus: 'healthy' | 'warning' | 'critical';
    alerts: Array<{
      id: string;
      type: string;
      severity: string;
      message: string;
      recommendation: string;
    }>;
    largestTables: Array<{
      name: string;
      rowCount: number;
      sizeMB: number;
    }>;
  };
  sentry: {
    isConfigured: boolean;
    errors24h: number;
    errors7d: number;
    affectedUsers: number;
    unresolvedCount: number;
  };
  errorAnalysis: {
    healthScore: number;
    criticalIssues: Array<{ type: string; message: string; action: string }>;
    warnings: Array<{ type: string; message: string; action: string }>;
  };
  planRecommendation: {
    currentPlan: string;
    recommendedPlan: string;
    reason: string;
    upgradeUrl: string;
  };
  systemHealth: {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    message: string;
  };
}

interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  recommendations: Array<{
    priority: string;
    category: string;
    title: string;
    description: string;
    impact: string;
    effort: string;
  }>;
  potentialActions: Array<{
    id: string;
    type: string;
    description: string;
    autoExecutable: boolean;
    riskLevel: string;
    estimatedImpact: string;
    requiresApproval: boolean;
  }>;
  riskLevel: string;
}

export function ControlTower() {
  const [metrics, setMetrics] = useState<ControlTowerMetrics | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/control-tower/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAIAnalysis = async (question?: string) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/admin/control-tower/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: 'full' }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data);
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    getAIAnalysis();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefresh]);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Saludable</Badge>;
      case 'warning': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Advertencia</Badge>;
      case 'critical': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Crítico</Badge>;
      default: return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando métricas del sistema...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No se pudieron cargar las métricas del sistema.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Torre de Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoreo en tiempo real de AETHEL OS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { fetchMetrics(); getAIAnalysis(); }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>
      </div>

      {/* Main Health Card */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${
                metrics.systemHealth.status === 'healthy' ? 'bg-green-500/20' :
                metrics.systemHealth.status === 'warning' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                {metrics.systemHealth.status === 'healthy' ? (
                  <CheckCircle className="h-10 w-10 text-green-500" />
                ) : metrics.systemHealth.status === 'warning' ? (
                  <AlertTriangle className="h-10 w-10 text-yellow-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Salud del Sistema: {metrics.systemHealth.score}%
                </h2>
                <p className="text-muted-foreground">{metrics.systemHealth.message}</p>
              </div>
            </div>
            {getHealthBadge(metrics.systemHealth.status)}
          </div>
          <Progress
            value={metrics.systemHealth.score}
            className="mt-4 h-3"
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Base de Datos
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Errores
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="h-4 w-4 mr-2" />
            IA Analista
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Storage Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <HardDrive className="h-4 w-4 mr-2 text-purple-400" />
                  Almacenamiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.database.storageUsedMB}MB
                </div>
                <p className="text-xs text-muted-foreground">
                  de {metrics.database.storageLimitMB}MB
                </p>
                <Progress
                  value={metrics.database.storagePercentage}
                  className={`mt-2 h-2 ${getProgressColor(metrics.database.storagePercentage)}`}
                />
                <p className="text-xs mt-1">
                  {metrics.database.storagePercentage}% usado
                </p>
              </CardContent>
            </Card>

            {/* Connections Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Wifi className="h-4 w-4 mr-2 text-blue-400" />
                  Conexiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.database.activeConnections}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {metrics.database.maxConnections} máx
                </p>
                <Progress
                  value={metrics.database.connectionPercentage}
                  className={`mt-2 h-2 ${getProgressColor(metrics.database.connectionPercentage)}`}
                />
                <p className="text-xs mt-1">
                  {metrics.database.connectionPercentage}% usado
                </p>
              </CardContent>
            </Card>

            {/* Records Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2 text-green-400" />
                  Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.database.totalRecords.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  en {metrics.database.totalTables} tablas
                </p>
              </CardContent>
            </Card>

            {/* Errors Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                  Errores (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.sentry.errors24h}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.sentry.isConfigured ? 'Sentry activo' : 'Sentry no configurado'}
                </p>
                {!metrics.sentry.isConfigured && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Configurar Sentry
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {metrics.database.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  Alertas Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  {metrics.database.alerts.map((alert, i) => (
                    <div
                      key={alert.id || i}
                      className={`p-3 rounded-lg mb-2 ${
                        alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                        alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                        'bg-yellow-500/10 border-yellow-500/30'
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{alert.message}</span>
                        <Badge variant={
                          alert.severity === 'critical' ? 'destructive' :
                          alert.severity === 'high' ? 'default' : 'secondary'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.recommendation}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Plan Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpCircle className="h-5 w-5 mr-2 text-purple-400" />
                Estado del Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan actual</p>
                  <p className="font-medium">{metrics.planRecommendation.currentPlan}</p>
                </div>
                <div className="flex-1 md:text-center">
                  <p className="text-sm text-muted-foreground">Recomendación</p>
                  <p className="font-medium">{metrics.planRecommendation.recommendedPlan}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.planRecommendation.reason}
                  </p>
                </div>
                <Button asChild>
                  <a href={metrics.planRecommendation.upgradeUrl} target="_blank" rel="noopener noreferrer">
                    Gestionar Plan
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Capacidad de Almacenamiento</CardTitle>
                <CardDescription>
                  Uso actual del almacenamiento en Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Espacio usado</span>
                      <span className="font-bold">{metrics.database.storagePercentage}%</span>
                    </div>
                    <Progress
                      value={metrics.database.storagePercentage}
                      className={`h-4 ${getProgressColor(metrics.database.storagePercentage)}`}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {metrics.database.storageUsedMB}MB de {metrics.database.storageLimitMB}MB
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Espacio disponible</span>
                      <span className="font-bold text-green-500">
                        {(metrics.database.storageLimitMB - metrics.database.storageUsedMB).toFixed(2)}MB
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conexiones Activas</CardTitle>
                <CardDescription>
                  Conexiones a la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Conexiones usadas</span>
                      <span className="font-bold">{metrics.database.connectionPercentage}%</span>
                    </div>
                    <Progress
                      value={metrics.database.connectionPercentage}
                      className={`h-4 ${getProgressColor(metrics.database.connectionPercentage)}`}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {metrics.database.activeConnections} de {metrics.database.maxConnections} conexiones
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{metrics.database.activeConnections}</p>
                      <p className="text-xs text-muted-foreground">Activas</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{metrics.database.idleConnections}</p>
                      <p className="text-xs text-muted-foreground">Disponibles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Largest Tables */}
          <Card>
            <CardHeader>
              <CardTitle>Tablas con Más Registros</CardTitle>
              <CardDescription>
                Distribución de datos por tabla
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Tabla</th>
                      <th className="text-right py-2">Registros</th>
                      <th className="text-right py-2">Tamaño Est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.database.largestTables.map((table, i) => (
                      <tr key={i} className="border-b border-muted">
                        <td className="py-3">
                          <span className="font-mono text-sm">{table.name}</span>
                        </td>
                        <td className="text-right">
                          {table.rowCount.toLocaleString()}
                        </td>
                        <td className="text-right text-muted-foreground">
                          {table.sizeMB.toFixed(2)}MB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.sentry.errors24h}</p>
                    <p className="text-sm text-muted-foreground">Errores (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.sentry.errors7d}</p>
                    <p className="text-sm text-muted-foreground">Errores (7 días)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.sentry.affectedUsers}</p>
                    <p className="text-sm text-muted-foreground">Usuarios Afectados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentry Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Estado de Sentry
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.sentry.isConfigured ? (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium">Sentry está configurado y activo</p>
                    <p className="text-sm text-muted-foreground">
                      Los errores se están monitoreando automáticamente
                    </p>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Sentry no está configurado</AlertTitle>
                  <AlertDescription>
                    Para monitorear errores en producción, agrega la variable de entorno
                    <code className="mx-1 px-1 py-0.5 bg-muted rounded">NEXT_PUBLIC_SENTRY_DSN</code>
                    en Vercel.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Error Analysis */}
          {(metrics.errorAnalysis.criticalIssues.length > 0 || metrics.errorAnalysis.warnings.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Problemas</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  {metrics.errorAnalysis.criticalIssues.map((issue, i) => (
                    <div key={i} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-2">
                      <p className="font-medium text-red-400">{issue.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">{issue.action}</p>
                    </div>
                  ))}
                  {metrics.errorAnalysis.warnings.map((warning, i) => (
                    <div key={i} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-2">
                      <p className="font-medium text-yellow-400">{warning.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">{warning.action}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Analyst Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-6 w-6 mr-2 text-purple-400" />
                IA Analista de Sistema
              </CardTitle>
              <CardDescription>
                Asistente inteligente para diagnóstico y recomendaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Question Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Pregunta sobre el estado del sistema..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && getAIAnalysis(aiQuestion)}
                />
                <Button
                  onClick={() => getAIAnalysis(aiQuestion)}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAIAnalysis('¿Cuál es el estado general del sistema?')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Estado General
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAIAnalysis('¿Debo actualizar mi plan de Supabase?')}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Recomendación de Plan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getAIAnalysis('¿Cómo puedo optimizar el rendimiento?')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Optimización
                </Button>
              </div>

              {/* AI Analysis Result */}
              {aiAnalysis && (
                <div className="space-y-4">
                  {/* Analysis Text */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      <span className="font-medium">Análisis de IA</span>
                      <Badge variant={
                        aiAnalysis.riskLevel === 'low' ? 'default' :
                        aiAnalysis.riskLevel === 'medium' ? 'secondary' : 'destructive'
                      }>
                        Riesgo: {aiAnalysis.riskLevel}
                      </Badge>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {aiAnalysis.analysis}
                      </pre>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {aiAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recomendaciones</h4>
                      <div className="space-y-2">
                        {aiAnalysis.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="p-3 bg-muted rounded-lg border-l-4 border-purple-500"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{rec.title}</span>
                              <Badge variant={
                                rec.priority === 'critical' ? 'destructive' :
                                rec.priority === 'high' ? 'default' : 'secondary'
                              }>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rec.description}
                            </p>
                            <p className="text-xs text-purple-400 mt-1">
                              Impacto: {rec.impact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Potential Actions */}
                  {aiAnalysis.potentialActions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Acciones Potenciales</h4>
                      <div className="space-y-2">
                        {aiAnalysis.potentialActions.map((action) => (
                          <div
                            key={action.id}
                            className="p-3 bg-muted rounded-lg flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{action.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Impacto estimado: {action.estimatedImpact}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {action.requiresApproval ? (
                                <Badge variant="outline">Requiere aprobación</Badge>
                              ) : (
                                <Button size="sm" variant="outline">
                                  Ejecutar
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Capabilities Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Capacidades de la IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Análisis de métricas</p>
                    <p className="text-muted-foreground">Interpreta datos del sistema en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Recomendaciones seguras</p>
                    <p className="text-muted-foreground">Solo sugiere acciones no destructivas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Predicción de problemas</p>
                    <p className="text-muted-foreground">Identifica issues antes de que sean críticos</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Sin auto-ejecución</p>
                    <p className="text-muted-foreground">Siempre requiere aprobación humana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
