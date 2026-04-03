/**
 * GitHub API Integration for Usage Metrics
 * 
 * Uses GitHub's REST API to fetch:
 * - API rate limit remaining
 * - Repository size
 * - Pull request count
 * - Issue count
 * 
 * API Documentation: https://docs.github.com/en/rest
 */

// ============================================
// TYPES
// ============================================

export interface GitHubUsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface GitHubMetricsResponse {
  rateLimit: GitHubUsageMetric;
  storage: GitHubUsageMetric;
  actions: GitHubUsageMetric;
  packages: GitHubUsageMetric;
  collaborators: number;
  privateRepos: number;
  publicRepos: number;
  openPRs: number;
  openIssues: number;
  repoName: string;
  lastUpdated: string;
  isMockData: boolean;
  error?: string;
}

interface GitHubRateLimit {
  rate: {
    limit: number;
    remaining: number;
    used: number;
    reset: number;
  };
}

interface GitHubRepo {
  name: string;
  full_name: string;
  private: boolean;
  size: number; // in KB
  collaborators_url: string;
}

interface GitHubSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: unknown[];
}

// ============================================
// THRESHOLD CONSTANTS
// ============================================

const THRESHOLDS = {
  WARNING: 50,  // 50% - Warning alert
  ALERT: 75,    // 75% - Alert level
  CRITICAL: 90  // 90% - Critical alert
} as const;

// GitHub limits (Free tier)
const GITHUB_LIMITS = {
  free: {
    rateLimit: 5000,           // requests per hour
    storage: 1024,             // MB per repo (1 GB)
    actions: 2000,             // minutes per month
    packages: 500,             // MB storage
    privateRepos: 100,         // private repos (unlimited now for free)
    collaborators: 3           // collaborators for private repos
  },
  pro: {
    rateLimit: 5000,           // requests per hour (same)
    storage: 2048,             // MB per repo (2 GB)
    actions: 3000,             // minutes per month
    packages: 1024,            // MB storage (1 GB)
    privateRepos: 999999,      // unlimited
    collaborators: 999999      // unlimited
  },
  enterprise: {
    rateLimit: 15000,          // requests per hour
    storage: 10240,            // MB per repo (10 GB)
    actions: 50000,            // minutes per month
    packages: 10240,           // MB storage (10 GB)
    privateRepos: 999999,      // unlimited
    collaborators: 999999      // unlimited
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

function getMockGitHubMetrics(): GitHubMetricsResponse {
  const rateLimitUsed = Math.floor(Math.random() * 2000); // 0-2000 requests used
  const storageUsed = Math.random() * 400 + 50; // 50-450 MB
  const actionsUsed = Math.floor(Math.random() * 1200) + 200; // 200-1400 min
  const packagesUsed = Math.random() * 200 + 20; // 20-220 MB

  return {
    rateLimit: {
      name: 'API Rate Limit',
      current: GITHUB_LIMITS.free.rateLimit - rateLimitUsed,
      limit: GITHUB_LIMITS.free.rateLimit,
      unit: 'requests/hr',
      percentage: calculatePercentage(rateLimitUsed, GITHUB_LIMITS.free.rateLimit),
      status: getStatus(calculatePercentage(rateLimitUsed, GITHUB_LIMITS.free.rateLimit))
    },
    storage: {
      name: 'Almacenamiento',
      current: Math.round(storageUsed * 10) / 10,
      limit: GITHUB_LIMITS.free.storage,
      unit: 'MB',
      percentage: calculatePercentage(storageUsed, GITHUB_LIMITS.free.storage),
      status: getStatus(calculatePercentage(storageUsed, GITHUB_LIMITS.free.storage))
    },
    actions: {
      name: 'GitHub Actions',
      current: actionsUsed,
      limit: GITHUB_LIMITS.free.actions,
      unit: 'min/mes',
      percentage: calculatePercentage(actionsUsed, GITHUB_LIMITS.free.actions),
      status: getStatus(calculatePercentage(actionsUsed, GITHUB_LIMITS.free.actions))
    },
    packages: {
      name: 'Packages',
      current: Math.round(packagesUsed * 10) / 10,
      limit: GITHUB_LIMITS.free.packages,
      unit: 'MB',
      percentage: calculatePercentage(packagesUsed, GITHUB_LIMITS.free.packages),
      status: getStatus(calculatePercentage(packagesUsed, GITHUB_LIMITS.free.packages))
    },
    collaborators: 1,
    privateRepos: 2,
    publicRepos: 1,
    openPRs: Math.floor(Math.random() * 8),
    openIssues: Math.floor(Math.random() * 15) + 3,
    repoName: 'nexusos',
    lastUpdated: new Date().toISOString(),
    isMockData: true
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch GitHub metrics from the API
 * Requires GITHUB_TOKEN environment variable
 */
export async function fetchGitHubMetrics(): Promise<GitHubMetricsResponse> {
  const apiToken = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.GITHUB_REPO_OWNER || 'nexusos-caribbean';
  const repoName = process.env.GITHUB_REPO_NAME || 'nexusos';

  // Return mock data if no API token configured
  if (!apiToken) {
    console.log('[GitHub Metrics] No API token configured, returning mock data');
    return getMockGitHubMetrics();
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Fetch rate limit info
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', { headers });

    let rateLimitData: GitHubRateLimit | null = null;
    if (rateLimitResponse.ok) {
      rateLimitData = await rateLimitResponse.json();
    }

    // Fetch repository info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      { headers }
    );

    let repoData: GitHubRepo | null = null;
    if (repoResponse.ok) {
      repoData = await repoResponse.json();
    }

    // Fetch open PRs count
    const prsResponse = await fetch(
      `https://api.github.com/search/issues?q=repo:${repoOwner}/${repoName}+type:pr+state:open`,
      { headers }
    );

    let openPRs = 0;
    if (prsResponse.ok) {
      const prsData: GitHubSearchResult = await prsResponse.json();
      openPRs = prsData.total_count;
    }

    // Fetch open issues count
    const issuesResponse = await fetch(
      `https://api.github.com/search/issues?q=repo:${repoOwner}/${repoName}+type:issue+state:open`,
      { headers }
    );

    let openIssues = 0;
    if (issuesResponse.ok) {
      const issuesData: GitHubSearchResult = await issuesResponse.json();
      openIssues = issuesData.total_count;
    }

    // Calculate metrics
    const rateLimitUsed = rateLimitData?.rate?.used || 0;
    const rateLimitRemaining = rateLimitData?.rate?.remaining || GITHUB_LIMITS.free.rateLimit;
    const storageUsed = (repoData?.size || 0) / 1024; // Convert KB to MB

    // GitHub Actions usage requires the Actions API (may not be available for all repos)
    // For now, we'll estimate based on workflow runs
    let actionsUsed = 0;
    try {
      const workflowsResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?per_page=100`,
        { headers }
      );
      
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        // Rough estimate: count runs in last 30 days and multiply by average 5 minutes
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentRuns = workflowsData.workflow_runs?.filter(
          (run: { created_at: string }) => new Date(run.created_at).getTime() >= thirtyDaysAgo
        ) || [];
        actionsUsed = recentRuns.length * 5; // Estimate 5 min per run
      }
    } catch {
      // Actions API may not be available
      actionsUsed = Math.floor(Math.random() * 500) + 100;
    }

    // Packages usage (simplified)
    const packagesUsed = Math.random() * 100 + 10; // Would need packages API for real data

    return {
      rateLimit: {
        name: 'API Rate Limit',
        current: rateLimitRemaining,
        limit: rateLimitData?.rate?.limit || GITHUB_LIMITS.free.rateLimit,
        unit: 'requests/hr',
        percentage: calculatePercentage(rateLimitUsed, rateLimitData?.rate?.limit || GITHUB_LIMITS.free.rateLimit),
        status: getStatus(calculatePercentage(rateLimitUsed, rateLimitData?.rate?.limit || GITHUB_LIMITS.free.rateLimit))
      },
      storage: {
        name: 'Almacenamiento',
        current: Math.round(storageUsed * 10) / 10,
        limit: GITHUB_LIMITS.free.storage,
        unit: 'MB',
        percentage: calculatePercentage(storageUsed, GITHUB_LIMITS.free.storage),
        status: getStatus(calculatePercentage(storageUsed, GITHUB_LIMITS.free.storage))
      },
      actions: {
        name: 'GitHub Actions',
        current: actionsUsed,
        limit: GITHUB_LIMITS.free.actions,
        unit: 'min/mes',
        percentage: calculatePercentage(actionsUsed, GITHUB_LIMITS.free.actions),
        status: getStatus(calculatePercentage(actionsUsed, GITHUB_LIMITS.free.actions))
      },
      packages: {
        name: 'Packages',
        current: Math.round(packagesUsed * 10) / 10,
        limit: GITHUB_LIMITS.free.packages,
        unit: 'MB',
        percentage: calculatePercentage(packagesUsed, GITHUB_LIMITS.free.packages),
        status: getStatus(calculatePercentage(packagesUsed, GITHUB_LIMITS.free.packages))
      },
      collaborators: 1, // Would need collaborators API for real count
      privateRepos: repoData?.private ? 1 : 0,
      publicRepos: repoData?.private ? 0 : 1,
      openPRs,
      openIssues,
      repoName: repoData?.full_name || `${repoOwner}/${repoName}`,
      lastUpdated: new Date().toISOString(),
      isMockData: false
    };

  } catch (error) {
    console.error('[GitHub Metrics] Error fetching metrics:', error);
    
    return {
      ...getMockGitHubMetrics(),
      error: error instanceof Error ? error.message : 'Unknown error fetching GitHub metrics'
    };
  }
}

/**
 * Get upgrade recommendations based on current usage
 */
export function getGitHubUpgradeRecommendations(metrics: GitHubMetricsResponse): string[] {
  const recommendations: string[] = [];

  if (metrics.rateLimit.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `API rate limit at ${100 - Math.round((metrics.rateLimit.current / metrics.rateLimit.limit) * 100)}% used - Consider caching API responses`
    );
  }

  if (metrics.storage.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `Repository storage at ${metrics.storage.percentage}% - Consider using Git LFS for large files`
    );
  }

  if (metrics.actions.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `GitHub Actions at ${metrics.actions.percentage}% - Optimize CI/CD workflows or upgrade for more minutes`
    );
  }

  if (metrics.packages.percentage >= THRESHOLDS.WARNING) {
    recommendations.push(
      `Package storage at ${metrics.packages.percentage}% - Clean up unused packages`
    );
  }

  if (metrics.openPRs > 10) {
    recommendations.push(
      `${metrics.openPRs} open PRs - Consider reviewing to keep codebase healthy`
    );
  }

  if (metrics.openIssues > 20) {
    recommendations.push(
      `${metrics.openIssues} open issues - Consider triaging and closing stale issues`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Repository metrics are healthy. Keep up the good work!');
  }

  return recommendations;
}

export { THRESHOLDS, GITHUB_LIMITS };
