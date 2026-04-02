/**
 * Vercel API Integration for Usage Metrics
 * 
 * Uses Vercel's REST API to fetch:
 * - Bandwidth usage
 * - Function invocations
 * - Build minutes
 * - Deployment count
 * 
 * API Documentation: https://vercel.com/docs/rest-api
 */

// ============================================
// TYPES
// ============================================

export interface VercelUsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface VercelMetricsResponse {
  bandwidth: VercelUsageMetric;
  functionInvocations: VercelUsageMetric;
  buildMinutes: VercelUsageMetric;
  deployments: VercelUsageMetric;
  domains: number;
  teamMembers: number;
  plan: 'hobby' | 'pro' | 'enterprise';
  lastUpdated: string;
  isMockData: boolean;
  error?: string;
}

interface VercelTeamUsage {
  metrics: {
    bandwidth: {
      total: number;
      limit: number;
    };
    serverless: {
      total: number;
      limit: number;
    };
    builds: {
      total: number;
      limit: number;
    };
  };
}

interface VercelDeployment {
  uid: string;
  name: string;
  state: string;
  created: number;
}

interface VercelTeam {
  id: string;
  name: string;
  slug: string;
}

// ============================================
// THRESHOLD CONSTANTS
// ============================================

const THRESHOLDS = {
  WARNING: 50,  // 50% - Warning alert
  ALERT: 75,    // 75% - Alert level
  CRITICAL: 90  // 90% - Critical alert
} as const;

// Plan limits (Hobby tier)
const PLAN_LIMITS = {
  hobby: {
    bandwidth: 100,           // GB per month
    functionInvocations: 160, // GB-hours per month
    buildMinutes: 6000,       // minutes per month
    deployments: 1000,        // deployments per month
    domains: 1,               // max domains
    teamMembers: 1            // max team members
  },
  pro: {
    bandwidth: 1000,          // GB per month
    functionInvocations: 1000,// GB-hours per month
    buildMinutes: 20000,      // minutes per month
    deployments: 6000,        // deployments per month
    domains: 50,              // max domains
    teamMembers: 20           // max team members
  },
  enterprise: {
    bandwidth: 5000,          // GB per month
    functionInvocations: 5000,// GB-hours per month
    buildMinutes: 100000,     // minutes per month
    deployments: 50000,       // deployments per month
    domains: 500,             // max domains
    teamMembers: 100          // max team members
  }
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStatus(percentage: number): 'safe' | 'warning' | 'critical' {
  if (percentage >= THRESHOLDS.CRITICAL) return 'critical';
  if (percentage >= THRESHOLDS.ALERT) return 'warning';
  return 'safe';
}

function calculatePercentage(current: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((current / limit) * 100);
}

// ============================================
// MOCK DATA GENERATOR
// ============================================

function getMockVercelMetrics(): VercelMetricsResponse {
  const bandwidthUsed = Math.random() * 30 + 5; // 5-35 GB
  const functionUsed = Math.random() * 80 + 20; // 20-100 GB-hours
  const buildUsed = Math.random() * 2000 + 500; // 500-2500 min
  const deployCount = Math.round(Math.random() * 30 + 20); // 20-50 deploys

  return {
    bandwidth: {
      name: 'Ancho de Banda',
      current: Math.round(bandwidthUsed * 10) / 10,
      limit: PLAN_LIMITS.hobby.bandwidth,
      unit: 'GB',
      percentage: calculatePercentage(bandwidthUsed, PLAN_LIMITS.hobby.bandwidth),
      status: getStatus(calculatePercentage(bandwidthUsed, PLAN_LIMITS.hobby.bandwidth))
    },
    functionInvocations: {
      name: 'Funciones Serverless',
      current: Math.round(functionUsed * 10) / 10,
      limit: PLAN_LIMITS.hobby.functionInvocations,
      unit: 'GB-hours',
      percentage: calculatePercentage(functionUsed, PLAN_LIMITS.hobby.functionInvocations),
      status: getStatus(calculatePercentage(functionUsed, PLAN_LIMITS.hobby.functionInvocations))
    },
    buildMinutes: {
      name: 'Minutos de Build',
      current: Math.round(buildUsed),
      limit: PLAN_LIMITS.hobby.buildMinutes,
      unit: 'min',
      percentage: calculatePercentage(buildUsed, PLAN_LIMITS.hobby.buildMinutes),
      status: getStatus(calculatePercentage(buildUsed, PLAN_LIMITS.hobby.buildMinutes))
    },
    deployments: {
      name: 'Deployments',
      current: deployCount,
      limit: PLAN_LIMITS.hobby.deployments,
      unit: 'deploys',
      percentage: calculatePercentage(deployCount, PLAN_LIMITS.hobby.deployments),
      status: 'safe'
    },
    domains: 1,
    teamMembers: 1,
    plan: 'hobby',
    lastUpdated: new Date().toISOString(),
    isMockData: true
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch Vercel usage metrics from the API
 * Requires VERCEL_API_TOKEN environment variable
 */
export async function fetchVercelMetrics(): Promise<VercelMetricsResponse> {
  const apiToken = process.env.VERCEL_API_TOKEN;
  
  // Return mock data if no API token configured
  if (!apiToken) {
    console.log('[Vercel Metrics] No API token configured, returning mock data');
    return getMockVercelMetrics();
  }

  try {
    // Fetch team info
    const teamsResponse = await fetch('https://api.vercel.com/v2/teams', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!teamsResponse.ok) {
      throw new Error(`Vercel API error: ${teamsResponse.status}`);
    }

    const teamsData = await teamsResponse.json();
    const teams: VercelTeam[] = teamsData.teams || [];
    const teamId = teams[0]?.id;

    if (!teamId) {
      console.log('[Vercel Metrics] No team found, returning mock data');
      return {
        ...getMockVercelMetrics(),
        error: 'No team found for Vercel account'
      };
    }

    // Fetch usage metrics
    const usageResponse = await fetch(`https://api.vercel.com/v1/usage/${teamId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Fetch recent deployments
    const deploymentsResponse = await fetch(`https://api.vercel.com/v13/deployments?teamId=${teamId}&limit=100`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    let usageData: VercelTeamUsage | null = null;
    let deploymentCount = 0;

    if (usageResponse.ok) {
      usageData = await usageResponse.json();
    }

    if (deploymentsResponse.ok) {
      const deploymentsData = await deploymentsResponse.json();
      const deployments: VercelDeployment[] = deploymentsData.deployments || [];
      
      // Count deployments from current billing period (approximate - last 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      deploymentCount = deployments.filter(d => d.created >= thirtyDaysAgo).length;
    }

    // Determine plan from limits
    const plan: 'hobby' | 'pro' | 'enterprise' = teams[0]?.name?.toLowerCase().includes('pro') 
      ? 'pro' 
      : 'hobby';
    const limits = PLAN_LIMITS[plan];

    // Build metrics response
    const bandwidthUsed = (usageData?.metrics?.bandwidth?.total || 0) / (1024 * 1024 * 1024); // Convert to GB
    const functionUsed = (usageData?.metrics?.serverless?.total || 0) / (1024 * 1024 * 1024); // Convert to GB-hours
    const buildUsed = (usageData?.metrics?.builds?.total || 0) / 60; // Convert to minutes

    return {
      bandwidth: {
        name: 'Ancho de Banda',
        current: Math.round(bandwidthUsed * 10) / 10,
        limit: limits.bandwidth,
        unit: 'GB',
        percentage: calculatePercentage(bandwidthUsed, limits.bandwidth),
        status: getStatus(calculatePercentage(bandwidthUsed, limits.bandwidth))
      },
      functionInvocations: {
        name: 'Funciones Serverless',
        current: Math.round(functionUsed * 10) / 10,
        limit: limits.functionInvocations,
        unit: 'GB-hours',
        percentage: calculatePercentage(functionUsed, limits.functionInvocations),
        status: getStatus(calculatePercentage(functionUsed, limits.functionInvocations))
      },
      buildMinutes: {
        name: 'Minutos de Build',
        current: Math.round(buildUsed),
        limit: limits.buildMinutes,
        unit: 'min',
        percentage: calculatePercentage(buildUsed, limits.buildMinutes),
        status: getStatus(calculatePercentage(buildUsed, limits.buildMinutes))
      },
      deployments: {
        name: 'Deployments',
        current: deploymentCount,
        limit: limits.deployments,
        unit: 'deploys',
        percentage: calculatePercentage(deploymentCount, limits.deployments),
        status: getStatus(calculatePercentage(deploymentCount, limits.deployments))
      },
      domains: 1, // Would need additional API call to fetch
      teamMembers: teams.length,
      plan,
      lastUpdated: new Date().toISOString(),
      isMockData: false
    };

  } catch (error) {
    console.error('[Vercel Metrics] Error fetching metrics:', error);
    
    return {
      ...getMockVercelMetrics(),
      error: error instanceof Error ? error.message : 'Unknown error fetching Vercel metrics'
    };
  }
}

/**
 * Get upgrade recommendations based on current usage
 */
export function getVercelUpgradeRecommendations(metrics: VercelMetricsResponse): string[] {
  const recommendations: string[] = [];

  if (metrics.bandwidth.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `Bandwidth at ${metrics.bandwidth.percentage}% - ${
        metrics.plan === 'hobby' 
          ? 'Consider upgrading to Pro for 1TB bandwidth'
          : 'Monitor bandwidth usage closely'
      }`
    );
  }

  if (metrics.functionInvocations.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `Serverless functions at ${metrics.functionInvocations.percentage}% - Optimize function execution time`
    );
  }

  if (metrics.buildMinutes.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `Build minutes at ${metrics.buildMinutes.percentage}% - Consider caching dependencies or optimizing build process`
    );
  }

  if (metrics.domains >= PLAN_LIMITS[metrics.plan].domains) {
    recommendations.push(
      `Domain limit reached - Upgrade to add custom domains`
    );
  }

  if (metrics.teamMembers >= PLAN_LIMITS[metrics.plan].teamMembers) {
    recommendations.push(
      `Team member limit reached - Upgrade to add more team members`
    );
  }

  if (recommendations.length === 0 && metrics.plan === 'hobby') {
    recommendations.push('Usage is within healthy limits. Consider Pro plan for production workloads.');
  }

  return recommendations;
}

export { THRESHOLDS, PLAN_LIMITS };
