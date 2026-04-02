/**
 * API Endpoint: Admin Metrics Aggregator
 * 
 * Aggregates Vercel and GitHub usage metrics for the Control Tower dashboard.
 * 
 * GET /api/admin/metrics
 * 
 * Environment Variables:
 * - VERCEL_API_TOKEN: Vercel API token (optional - uses mock data if not set)
 * - GITHUB_TOKEN: GitHub Personal Access Token (optional - uses mock data if not set)
 * - GITHUB_REPO_OWNER: GitHub repository owner (default: nexusos-caribbean)
 * - GITHUB_REPO_NAME: GitHub repository name (default: nexusos)
 */

import { NextResponse } from 'next/server';
import { 
  fetchVercelMetrics, 
  getVercelUpgradeRecommendations,
  type VercelMetricsResponse 
} from '@/lib/monitoring/vercel-metrics';
import { 
  fetchGitHubMetrics, 
  getGitHubUpgradeRecommendations,
  type GitHubMetricsResponse 
} from '@/lib/monitoring/github-metrics';

// ============================================
// RESPONSE TYPES
// ============================================

export interface AggregatedMetricsResponse {
  vercel: VercelMetricsResponse;
  github: GitHubMetricsResponse;
  recommendations: {
    vercel: string[];
    github: string[];
    general: string[];
  };
  alerts: Alert[];
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical';
  source: 'vercel' | 'github';
  message: string;
  percentage: number;
}

// ============================================
// THRESHOLDS
// ============================================

const ALERT_THRESHOLDS = {
  WARNING: 50,
  ALERT: 75,
  CRITICAL: 90
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateAlerts(
  vercel: VercelMetricsResponse, 
  github: GitHubMetricsResponse
): Alert[] {
  const alerts: Alert[] = [];

  // Vercel alerts
  if (vercel.bandwidth.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'vercel-bandwidth',
      type: vercel.bandwidth.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'vercel',
      message: `Bandwidth at ${vercel.bandwidth.percentage}% - ${vercel.bandwidth.current}/${vercel.bandwidth.limit} ${vercel.bandwidth.unit}`,
      percentage: vercel.bandwidth.percentage
    });
  }

  if (vercel.functionInvocations.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'vercel-functions',
      type: vercel.functionInvocations.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'vercel',
      message: `Serverless functions at ${vercel.functionInvocations.percentage}% - ${vercel.functionInvocations.current}/${vercel.functionInvocations.limit} ${vercel.functionInvocations.unit}`,
      percentage: vercel.functionInvocations.percentage
    });
  }

  if (vercel.buildMinutes.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'vercel-build',
      type: vercel.buildMinutes.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'vercel',
      message: `Build minutes at ${vercel.buildMinutes.percentage}% - ${vercel.buildMinutes.current}/${vercel.buildMinutes.limit} ${vercel.buildMinutes.unit}`,
      percentage: vercel.buildMinutes.percentage
    });
  }

  if (vercel.deployments.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'vercel-deployments',
      type: vercel.deployments.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'vercel',
      message: `Deployments at ${vercel.deployments.percentage}% - ${vercel.deployments.current}/${vercel.deployments.limit}`,
      percentage: vercel.deployments.percentage
    });
  }

  // GitHub alerts
  if (github.storage.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'github-storage',
      type: github.storage.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'github',
      message: `Repository storage at ${github.storage.percentage}% - ${github.storage.current}/${github.storage.limit} ${github.storage.unit}`,
      percentage: github.storage.percentage
    });
  }

  if (github.actions.percentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'github-actions',
      type: github.actions.percentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'github',
      message: `GitHub Actions at ${github.actions.percentage}% - ${github.actions.current}/${github.actions.limit} ${github.actions.unit}`,
      percentage: github.actions.percentage
    });
  }

  // Rate limit alert (reverse logic - warn when remaining is low)
  const rateLimitUsedPercentage = 100 - Math.round((github.rateLimit.current / github.rateLimit.limit) * 100);
  if (rateLimitUsedPercentage >= ALERT_THRESHOLDS.WARNING) {
    alerts.push({
      id: 'github-ratelimit',
      type: rateLimitUsedPercentage >= ALERT_THRESHOLDS.CRITICAL ? 'critical' : 'warning',
      source: 'github',
      message: `API rate limit ${rateLimitUsedPercentage}% used - ${github.rateLimit.current}/${github.rateLimit.limit} requests remaining`,
      percentage: rateLimitUsedPercentage
    });
  }

  // Sort by percentage descending
  return alerts.sort((a, b) => b.percentage - a.percentage);
}

function generateGeneralRecommendations(
  vercel: VercelMetricsResponse,
  github: GitHubMetricsResponse
): string[] {
  const recommendations: string[] = [];

  // Check for mock data usage
  if (vercel.isMockData || github.isMockData) {
    recommendations.push(
      'Configure VERCEL_API_TOKEN and GITHUB_TOKEN environment variables for real metrics'
    );
  }

  // Upgrade suggestions
  if (vercel.plan === 'hobby') {
    const hasHighUsage = 
      vercel.bandwidth.percentage >= 50 ||
      vercel.functionInvocations.percentage >= 50 ||
      vercel.buildMinutes.percentage >= 50;

    if (hasHighUsage) {
      recommendations.push(
        'Consider upgrading to Vercel Pro ($20/mo) for 1TB bandwidth, unlimited domains, and team features'
      );
    }
  }

  // GitHub Pro suggestions
  if (github.actions.percentage >= 70) {
    recommendations.push(
      'GitHub Pro ($4/mo) provides 3000 Actions minutes and larger storage limits'
    );
  }

  // Performance tips
  if (vercel.bandwidth.percentage >= 30) {
    recommendations.push(
      'Enable Vercel Analytics and Image Optimization to reduce bandwidth usage'
    );
  }

  if (github.openIssues > 15) {
    recommendations.push(
      `You have ${github.openIssues} open issues - Consider using GitHub Projects for better tracking`
    );
  }

  return recommendations;
}

// ============================================
// API HANDLER
// ============================================

export async function GET() {
  try {
    // Fetch metrics in parallel
    const [vercelMetrics, githubMetrics] = await Promise.all([
      fetchVercelMetrics(),
      fetchGitHubMetrics()
    ]);

    // Generate recommendations
    const vercelRecommendations = getVercelUpgradeRecommendations(vercelMetrics);
    const githubRecommendations = getGitHubUpgradeRecommendations(githubMetrics);
    const generalRecommendations = generateGeneralRecommendations(vercelMetrics, githubMetrics);

    // Generate alerts
    const alerts = generateAlerts(vercelMetrics, githubMetrics);

    const response: AggregatedMetricsResponse = {
      vercel: vercelMetrics,
      github: githubMetrics,
      recommendations: {
        vercel: vercelRecommendations,
        github: githubRecommendations,
        general: generalRecommendations
      },
      alerts,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Admin Metrics API] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow caching for 5 minutes
export const revalidate = 300;
