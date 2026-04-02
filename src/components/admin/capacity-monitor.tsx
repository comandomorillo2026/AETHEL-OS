'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  Server,
  Database,
  Globe,
  GitBranch,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Zap,
  HardDrive,
  Users,
  RefreshCw,
  Bell,
  Lightbulb,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

// ============================================
// TYPES (matching API response)
// ============================================

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
}

interface VercelMetrics {
  bandwidth: UsageMetric;
  functionInvocations: UsageMetric;
  buildMinutes: UsageMetric;
  deployments: UsageMetric;
  domains: number;
  teamMembers: number;
  plan: 'hobby' | 'pro' | 'enterprise';
  lastUpdated: string;
  isMockData: boolean;
}

interface GitHubMetrics {
  rateLimit: UsageMetric;
  storage: UsageMetric;
  actions: UsageMetric;
  packages: UsageMetric;
  collaborators: number;
  privateRepos: number;
  publicRepos: number;
  openPRs: number;
  openIssues: number;
  repoName: string;
  lastUpdated: string;
  isMockData: boolean;
}

interface AlertData {
  id: string;
  type: 'warning' | 'critical';
  source: 'vercel' | 'github';
  message: string;
  percentage: number;
}

interface MetricsResponse {
  vercel: VercelMetrics;
  github: GitHubMetrics;
  recommendations: {
    vercel: string[];
    github: string[];
    general: string[];
  };
  alerts: AlertData[];
  lastUpdated: string;
}

// ============================================
// THRESHOLD CONSTANTS
// ============================================

const THRESHOLDS = {
  WARNING: 50,
  ALERT: 75,
  CRITICAL: 90
} as const;

// ============================================
// CAPACITY MONITOR COMPONENT
// ============================================

export function CapacityMonitor() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/metrics');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: MetricsResponse = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
    // Set up polling every 5 minutes
    const interval = setInterval(loadMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadMetrics]);

  const acknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getStatusColor = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
    }
  };

  const getStatusBg = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'critical': return 'bg-red-500/10 border-red-500/20';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= THRESHOLDS.CRITICAL) return 'bg-red-500';
    if (percentage >= THRESHOLDS.ALERT) return 'bg-orange-500';
    if (percentage >= THRESHOLDS.WARNING) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getThresholdIndicator = (percentage: number) => {
    if (percentage >= THRESHOLDS.CRITICAL) {
      return { label: 'Critical', color: 'text-red-500', icon: XCircle };
    }
    if (percentage >= THRESHOLDS.ALERT) {
      return { label: 'Alert', color: 'text-orange-500', icon: AlertTriangle };
    }
    if (percentage >= THRESHOLDS.WARNING) {
      return { label: 'Warning', color: 'text-yellow-500', icon: AlertTriangle };
    }
    return { label: 'Safe', color: 'text-green-500', icon: CheckCircle };
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderProgressBar = (metric: UsageMetric, icon: React.ReactNode) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-[var(--text-mid)]">{metric.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {metric.current.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
          </span>
          {(() => {
            const indicator = getThresholdIndicator(metric.percentage);
            const IconComponent = indicator.icon;
            return (
              <span className={`flex items-center gap-1 text-xs font-bold ${indicator.color}`}>
                <IconComponent className="w-3 h-3" />
                {metric.percentage}%
              </span>
            );
          })()}
        </div>
      </div>
      <div className="relative h-2 bg-[var(--obsidian)] rounded-full overflow-hidden">
        {/* Threshold markers */}
        <div className="absolute inset-0 flex">
          <div className="w-[50%] border-r border-green-500/30" />
          <div className="w-[25%] border-r border-yellow-500/30" />
          <div className="w-[15%] border-r border-orange-500/30" />
          <div className="w-[10%]" />
        </div>
        {/* Progress bar */}
        <div 
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getProgressColor(metric.percentage)}`}
          style={{ width: `${Math.min(metric.percentage, 100)}%` }}
        />
      </div>
      {/* Threshold labels */}
      <div className="flex justify-between text-[10px] text-[var(--text-dim)]">
        <span>0%</span>
        <span className="text-yellow-500/50">50% Warning</span>
        <span className="text-orange-500/50">75% Alert</span>
        <span className="text-red-500/50">90% Critical</span>
      </div>
    </div>
  );

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-[var(--nexus-violet)]" />
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error && !metrics) {
    return (
      <Alert className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <AlertTitle>Error Loading Metrics</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button variant="outline" size="sm" onClick={loadMetrics} className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Alert>
    );
  }

  if (!metrics) return null;

  const { vercel, github, recommendations, alerts } = metrics;
  const unacknowledgedAlerts = alerts.filter(a => !acknowledgedAlerts.has(a.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Capacity Monitor
          </h2>
          <p className="text-[var(--text-dim)] text-sm">
            Real-time monitoring of Vercel and GitHub usage metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {metrics && (
            <span className="text-xs text-[var(--text-dim)]">
              Updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </span>
          )}
          {(vercel.isMockData || github.isMockData) && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
              Demo Data
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={loadMetrics} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="space-y-3">
          {unacknowledgedAlerts.map(alert => (
            <Alert key={alert.id} className={`${getStatusBg(alert.type === 'critical' ? 'critical' : 'warning')} border`}>
              <AlertTriangle className={`w-4 h-4 ${getStatusColor(alert.type === 'critical' ? 'critical' : 'warning')}`} />
              <AlertTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {alert.source === 'vercel' ? <Cloud className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}
                  {alert.type === 'critical' ? 'Critical Alert' : 'Warning'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  Dismiss
                </Button>
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-violet)]/20 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-[var(--nexus-violet)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-dim)]">Vercel Plan</p>
                <p className="text-lg font-bold text-[var(--text-primary)] capitalize">{vercel.plan}</p>
              </div>
              {vercel.plan === 'hobby' && (
                <Badge variant="outline" className="ml-auto text-green-500 border-green-500/30">
                  Free
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-gold)]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--nexus-gold)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-dim)]">Team Members</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {vercel.teamMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-aqua)]/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[var(--nexus-aqua)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-dim)]">Domains</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {vercel.domains}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-violet)]/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-[var(--nexus-violet)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-dim)]">Repository</p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[120px]">
                  {github.repoName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vercel Metrics */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Cloud className="w-5 h-5 text-[var(--nexus-violet)]" />
            Vercel Usage Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderProgressBar(vercel.bandwidth, <Activity className="w-4 h-4 text-[var(--text-dim)]" />)}
          {renderProgressBar(vercel.functionInvocations, <Zap className="w-4 h-4 text-[var(--text-dim)]" />)}
          {renderProgressBar(vercel.buildMinutes, <Clock className="w-4 h-4 text-[var(--text-dim)]" />)}
          {renderProgressBar(vercel.deployments, <Server className="w-4 h-4 text-[var(--text-dim)]" />)}
        </CardContent>
      </Card>

      {/* GitHub Metrics */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <GitBranch className="w-5 h-5 text-[var(--nexus-gold)]" />
            GitHub Usage Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Rate Limit (reverse - show remaining) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--text-dim)]" />
                <span className="text-sm text-[var(--text-mid)]">{github.rateLimit.name} (Remaining)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {github.rateLimit.current.toLocaleString()} / {github.rateLimit.limit.toLocaleString()} {github.rateLimit.unit}
                </span>
                <span className={`flex items-center gap-1 text-xs font-bold ${getStatusColor(github.rateLimit.status)}`}>
                  {github.rateLimit.current / github.rateLimit.limit * 100}% left
                </span>
              </div>
            </div>
            <div className="relative h-2 bg-[var(--obsidian)] rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-green-500`}
                style={{ width: `${Math.min((github.rateLimit.current / github.rateLimit.limit) * 100, 100)}%` }}
              />
            </div>
          </div>

          {renderProgressBar(github.storage, <HardDrive className="w-4 h-4 text-[var(--text-dim)]" />)}
          {renderProgressBar(github.actions, <Zap className="w-4 h-4 text-[var(--text-dim)]" />)}
          {renderProgressBar(github.packages, <Database className="w-4 h-4 text-[var(--text-dim)]" />)}

          {/* GitHub Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[var(--glass-border)]">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{github.openPRs}</p>
              <p className="text-xs text-[var(--text-dim)]">Open PRs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{github.openIssues}</p>
              <p className="text-xs text-[var(--text-dim)]">Open Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{github.privateRepos}</p>
              <p className="text-xs text-[var(--text-dim)]">Private Repos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{github.publicRepos}</p>
              <p className="text-xs text-[var(--text-dim)]">Public Repos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-[var(--nexus-violet)]/10 to-[var(--nexus-gold)]/10 border-[var(--nexus-violet)]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Lightbulb className="w-5 h-5 text-[var(--nexus-gold)]" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* General Recommendations */}
          {recommendations.general.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--text-mid)]">General</h4>
              {recommendations.general.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-mid)]">
                  <ArrowUpRight className="w-4 h-4 mt-0.5 text-[var(--nexus-violet)]" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}

          {/* Vercel Recommendations */}
          {recommendations.vercel.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--text-mid)]">Vercel</h4>
              {recommendations.vercel.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-mid)]">
                  <Cloud className="w-4 h-4 mt-0.5 text-[var(--nexus-violet)]" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}

          {/* GitHub Recommendations */}
          {recommendations.github.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--text-mid)]">GitHub</h4>
              {recommendations.github.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-mid)]">
                  <GitBranch className="w-4 h-4 mt-0.5 text-[var(--nexus-gold)]" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threshold Legend */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Bell className="w-5 h-5 text-[var(--nexus-violet)]" />
            Alert Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-mid)]">0-50%</span>
                <Badge variant="outline" className="text-green-500 border-green-500/30">Safe</Badge>
              </div>
              <p className="text-xs text-[var(--text-dim)]">Usage is within healthy limits</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-mid)]">50-75%</span>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Warning</Badge>
              </div>
              <p className="text-xs text-[var(--text-dim)]">Monitor usage closely</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-mid)]">75-90%</span>
                <Badge variant="outline" className="text-orange-500 border-orange-500/30">Alert</Badge>
              </div>
              <p className="text-xs text-[var(--text-dim)]">Consider optimization</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-mid)]">90%+</span>
                <Badge variant="outline" className="text-red-500 border-red-500/30">Critical</Badge>
              </div>
              <p className="text-xs text-[var(--text-dim)]">Upgrade recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card className="bg-gradient-to-r from-[var(--nexus-violet)]/20 to-[var(--nexus-gold)]/20 border-[var(--nexus-gold)]/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--nexus-gold)]/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[var(--nexus-gold)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                When to Upgrade?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--nexus-violet)]">Vercel Pro ($20/mo)</h4>
                  <ul className="space-y-1 text-sm text-[var(--text-mid)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      1TB bandwidth (10x more)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unlimited team members
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unlimited domains
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Analytics & logging
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--nexus-gold)]">GitHub Pro ($4/mo)</h4>
                  <ul className="space-y-1 text-sm text-[var(--text-mid)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      3000 Actions minutes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      2GB packages storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Protected branches
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Draft pull requests
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
