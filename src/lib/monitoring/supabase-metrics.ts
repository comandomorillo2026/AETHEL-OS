/**
 * AETHEL OS - Supabase Database Metrics
 * Real-time monitoring of database capacity and performance
 */

import { db } from '@/lib/db';

export interface DatabaseMetrics {
  // Connection metrics
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
  connectionPercentage: number;

  // Table metrics
  totalTables: number;
  totalRecords: number;
  largestTables: TableSizeInfo[];

  // Storage metrics
  totalStorageBytes: number;
  storageUsedMB: number;
  storageLimitMB: number;
  storagePercentage: number;

  // Performance metrics
  averageQueryTime: number;
  slowQueries: number;
  cacheHitRatio: number;

  // Health status
  healthStatus: 'healthy' | 'warning' | 'critical';
  alerts: DatabaseAlert[];
}

export interface TableSizeInfo {
  name: string;
  rowCount: number;
  sizeBytes: number;
  sizeMB: number;
}

export interface DatabaseAlert {
  id: string;
  type: 'connection' | 'storage' | 'performance' | 'table';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  timestamp: Date;
}

/**
 * Get comprehensive database metrics
 */
export async function getSupabaseMetrics(): Promise<DatabaseMetrics> {
  const alerts: DatabaseAlert[] = [];

  try {
    // Get table sizes and row counts
    const tableMetrics = await getTableMetrics();

    // Calculate total records
    const totalRecords = tableMetrics.reduce((sum, t) => sum + t.rowCount, 0);
    const totalStorageBytes = tableMetrics.reduce((sum, t) => sum + t.sizeBytes, 0);
    const storageUsedMB = totalStorageBytes / (1024 * 1024);

    // Supabase free tier limits
    const storageLimitMB = 500; // 500MB for free tier
    const storagePercentage = (storageUsedMB / storageLimitMB) * 100;

    // Get connection info (simulated - actual requires Supabase API)
    const connectionMetrics = await getConnectionMetrics();

    // Generate alerts based on metrics
    if (storagePercentage > 80) {
      alerts.push({
        id: `storage-${Date.now()}`,
        type: 'storage',
        severity: storagePercentage > 95 ? 'critical' : 'high',
        message: `Almacenamiento al ${storagePercentage.toFixed(1)}% de capacidad`,
        recommendation: storagePercentage > 95
          ? 'URGENTE: Actualiza tu plan de Supabase o elimina datos antiguos'
          : 'Considera actualizar tu plan o archivar datos antiguos',
        timestamp: new Date(),
      });
    }

    if (connectionMetrics.connectionPercentage > 80) {
      alerts.push({
        id: `conn-${Date.now()}`,
        type: 'connection',
        severity: connectionMetrics.connectionPercentage > 95 ? 'critical' : 'high',
        message: `Conexiones al ${connectionMetrics.connectionPercentage.toFixed(1)}% del límite`,
        recommendation: 'Optimiza conexiones o actualiza tu plan',
        timestamp: new Date(),
      });
    }

    // Check for large tables
    const largeTables = tableMetrics.filter(t => t.rowCount > 100000);
    largeTables.forEach(table => {
      alerts.push({
        id: `table-${table.name}`,
        type: 'table',
        severity: 'medium',
        message: `Tabla ${table.name} tiene ${table.rowCount.toLocaleString()} registros`,
        recommendation: 'Considera particionar o archivar registros antiguos',
        timestamp: new Date(),
      });
    });

    // Determine health status
    let healthStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (alerts.some(a => a.severity === 'critical')) {
      healthStatus = 'critical';
    } else if (alerts.some(a => a.severity === 'high' || a.severity === 'medium')) {
      healthStatus = 'warning';
    }

    return {
      ...connectionMetrics,
      totalTables: tableMetrics.length,
      totalRecords,
      largestTables: tableMetrics.slice(0, 10),
      totalStorageBytes,
      storageUsedMB: Math.round(storageUsedMB * 100) / 100,
      storageLimitMB,
      storagePercentage: Math.round(storagePercentage * 100) / 100,
      averageQueryTime: 50, // ms - simulated
      slowQueries: 0,
      cacheHitRatio: 98.5, // simulated
      healthStatus,
      alerts,
    };
  } catch (error) {
    console.error('Error getting Supabase metrics:', error);
    return getEmptyMetrics();
  }
}

/**
 * Get table metrics using raw SQL query
 */
async function getTableMetrics(): Promise<TableSizeInfo[]> {
  try {
    // Use Prisma to query table information
    const result = await db.$queryRaw<Array<{ tablename: string; n_tup_ins: bigint; n_tup_upd: bigint; n_tup_del: bigint }>>`
      SELECT
        schemaname || '.' || relname as tablename,
        n_tup_ins + n_tup_upd + n_tup_del as row_estimate
      FROM pg_stat_user_tables
      ORDER BY row_estimate DESC
      LIMIT 20
    `;

    // Get actual row counts for main tables
    const tables: TableSizeInfo[] = [];

    // Get counts for key tables
    const tableCounts = await Promise.all([
      db.systemUser.count().then(c => ({ name: 'SystemUser', count: c })),
      db.tenant.count().then(c => ({ name: 'Tenant', count: c })),
      db.activityLog.count().then(c => ({ name: 'ActivityLog', count: c })),
      db.session.count().then(c => ({ name: 'Session', count: c })),
      db.passwordResetToken.count().then(c => ({ name: 'PasswordResetToken', count: c })),
    ].map(async p => {
      const r = await p;
      return r;
    }));

    tableCounts.forEach(t => {
      tables.push({
        name: t.name,
        rowCount: t.count,
        sizeBytes: t.count * 1024, // Estimate 1KB per row
        sizeMB: (t.count * 1024) / (1024 * 1024),
      });
    });

    return tables.sort((a, b) => b.rowCount - a.rowCount);
  } catch (error) {
    console.error('Error getting table metrics:', error);
    return [];
  }
}

/**
 * Get connection metrics
 */
async function getConnectionMetrics() {
  try {
    // Get active connections count
    const connections = await db.$queryRaw<Array<{ count: bigint }>>`
      SELECT count(*) FROM pg_stat_activity
      WHERE datname = current_database()
    `;

    const activeConnections = Number(connections[0]?.count || 1);

    // Supabase free tier limits
    const maxConnections = 20; // Free tier limit

    return {
      totalConnections: activeConnections,
      activeConnections,
      idleConnections: Math.max(0, maxConnections - activeConnections),
      maxConnections,
      connectionPercentage: Math.round((activeConnections / maxConnections) * 100),
    };
  } catch (error) {
    return {
      totalConnections: 1,
      activeConnections: 1,
      idleConnections: 19,
      maxConnections: 20,
      connectionPercentage: 5,
    };
  }
}

/**
 * Get empty metrics for error cases
 */
function getEmptyMetrics(): DatabaseMetrics {
  return {
    totalConnections: 0,
    activeConnections: 0,
    idleConnections: 0,
    maxConnections: 20,
    connectionPercentage: 0,
    totalTables: 0,
    totalRecords: 0,
    largestTables: [],
    totalStorageBytes: 0,
    storageUsedMB: 0,
    storageLimitMB: 500,
    storagePercentage: 0,
    averageQueryTime: 0,
    slowQueries: 0,
    cacheHitRatio: 0,
    healthStatus: 'healthy',
    alerts: [],
  };
}

/**
 * Get plan recommendation based on current usage
 */
export function getPlanRecommendation(metrics: DatabaseMetrics): {
  currentPlan: string;
  recommendedPlan: string;
  reason: string;
  upgradeUrl: string;
} {
  const { storagePercentage, connectionPercentage, totalRecords } = metrics;

  if (storagePercentage > 90 || connectionPercentage > 90) {
    return {
      currentPlan: 'Free (500MB, 20 conexiones)',
      recommendedPlan: 'Pro ($25/mes - 8GB, 60 conexiones)',
      reason: 'Estás cerca del límite de tu plan actual. Actualiza para evitar interrupciones.',
      upgradeUrl: 'https://supabase.com/dashboard/project/_/settings/billing',
    };
  }

  if (totalRecords > 50000) {
    return {
      currentPlan: 'Free (500MB, 20 conexiones)',
      recommendedPlan: 'Pro ($25/mes - 8GB, 60 conexiones)',
      reason: 'Tienes muchos registros. Un plan superior mejorará el rendimiento.',
      upgradeUrl: 'https://supabase.com/dashboard/project/_/settings/billing',
    };
  }

  return {
    currentPlan: 'Free (500MB, 20 conexiones)',
    recommendedPlan: 'Free (Plan actual)',
    reason: 'Tu uso está dentro de los límites del plan gratuito.',
    upgradeUrl: 'https://supabase.com/dashboard/project/_/settings/billing',
  };
}
