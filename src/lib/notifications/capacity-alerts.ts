/**
 * Capacity Alerts System for NexusOS
 * 
 * This module provides comprehensive capacity monitoring and alerting
 * for multi-tenant SaaS platform usage limits.
 */

import { prisma } from '@/lib/db';

// ============================================
// TYPES AND INTERFACES
// ============================================

export type AlertType = 
  | 'bandwidth'
  | 'functionInvocations'
  | 'buildMinutes'
  | 'storage'
  | 'apiCalls';

export type Severity = 'info' | 'warning' | 'critical';

export type AlertStatus = 'active' | 'acknowledged' | 'dismissed' | 'resolved';

export type NotificationMode = 'immediate' | 'digest';

export type DigestFrequency = 'hourly' | 'daily' | 'weekly';

export interface MetricThresholds {
  warning: number;  // 50%
  high: number;     // 75%
  critical: number; // 90%
}

export interface UsageMetric {
  type: AlertType;
  current: number;
  limit: number;
  percentage: number;
  unit: string;
  displayName: string;
}

export interface CapacityAlertInput {
  tenantId?: string;
  alertType: AlertType;
  severity: Severity;
  threshold: number;
  currentUsage: number;
  limit: number;
  percentage: number;
  title: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface NotificationPreferences {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  notificationMode: NotificationMode;
  digestFrequency: DigestFrequency;
  digestTime: string;
  alertAt50: boolean;
  alertAt75: boolean;
  alertAt90: boolean;
  bandwidthAlerts: boolean;
  functionAlerts: boolean;
  buildMinutesAlerts: boolean;
  storageAlerts: boolean;
  apiCallsAlerts: boolean;
  adminEmails?: string;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  escalationEnabled: boolean;
  escalationEmail?: string;
  escalationDelayMinutes: number;
}

// ============================================
// CONSTANTS
// ============================================

export const THRESHOLDS: Record<AlertType, MetricThresholds> = {
  bandwidth: { warning: 50, high: 75, critical: 90 },
  functionInvocations: { warning: 50, high: 75, critical: 90 },
  buildMinutes: { warning: 50, high: 75, critical: 90 },
  storage: { warning: 50, high: 75, critical: 90 },
  apiCalls: { warning: 50, high: 75, critical: 90 },
};

export const METRIC_LIMITS: Record<AlertType, { limit: number; unit: string; displayName: string }> = {
  bandwidth: { limit: 100, unit: 'GB', displayName: 'Bandwidth' },
  functionInvocations: { limit: 1000000, unit: 'invocations', displayName: 'Function Invocations' },
  buildMinutes: { limit: 6000, unit: 'minutes', displayName: 'Build Minutes' },
  storage: { limit: 1, unit: 'GB', displayName: 'Storage' },
  apiCalls: { limit: 100000, unit: 'calls', displayName: 'API Calls' },
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  info: '#3B82F6',      // Blue
  warning: '#F59E0B',   // Amber
  critical: '#EF4444',  // Red
};

export const ALERT_TITLES: Record<AlertType, Record<Severity, string>> = {
  bandwidth: {
    info: 'Bandwidth Usage Approaching Limit',
    warning: 'Bandwidth Usage Warning',
    critical: 'Critical: Bandwidth Limit Reached',
  },
  functionInvocations: {
    info: 'Function Invocations Approaching Limit',
    warning: 'Function Invocations Warning',
    critical: 'Critical: Function Invocations Limit Reached',
  },
  buildMinutes: {
    info: 'Build Minutes Approaching Limit',
    warning: 'Build Minutes Warning',
    critical: 'Critical: Build Minutes Limit Reached',
  },
  storage: {
    info: 'Storage Usage Approaching Limit',
    warning: 'Storage Usage Warning',
    critical: 'Critical: Storage Limit Reached',
  },
  apiCalls: {
    info: 'API Calls Approaching Limit',
    warning: 'API Calls Warning',
    critical: 'Critical: API Calls Limit Reached',
  },
};

// ============================================
// CAPACITY ALERT SERVICE
// ============================================

/**
 * Main service for capacity alert operations
 */
export class CapacityAlertService {
  
  /**
   * Check all metrics and create alerts if thresholds are crossed
   */
  static async checkAndCreateAlerts(tenantId?: string): Promise<CapacityAlertInput[]> {
    const alerts: CapacityAlertInput[] = [];
    const preferences = await this.getNotificationSettings(tenantId);
    
    if (!preferences.notificationsEnabled) {
      return alerts;
    }

    // Get current usage for all metrics
    const metrics = await this.getCurrentUsage(tenantId);
    
    for (const metric of metrics) {
      const alert = await this.evaluateMetric(metric, preferences, tenantId);
      if (alert) {
        alerts.push(alert);
      }
    }

    return alerts;
  }

  /**
   * Evaluate a single metric against thresholds
   */
  static async evaluateMetric(
    metric: UsageMetric,
    preferences: NotificationPreferences,
    tenantId?: string
  ): Promise<CapacityAlertInput | null> {
    const thresholds = THRESHOLDS[metric.type];
    const percentage = metric.percentage;

    // Determine severity based on percentage
    let severity: Severity | null = null;
    let threshold = 0;

    if (percentage >= thresholds.critical) {
      if (!preferences.alertAt90) return null;
      severity = 'critical';
      threshold = thresholds.critical;
    } else if (percentage >= thresholds.high) {
      if (!preferences.alertAt75) return null;
      severity = 'warning';
      threshold = thresholds.high;
    } else if (percentage >= thresholds.warning) {
      if (!preferences.alertAt50) return null;
      severity = 'info';
      threshold = thresholds.warning;
    }

    if (!severity) return null;

    // Check if metric type is enabled for alerts
    if (!this.isMetricEnabled(metric.type, preferences)) return null;

    // Check if alert already exists for this threshold
    const existingAlert = await this.findExistingAlert(metric.type, threshold, tenantId);
    if (existingAlert && existingAlert.status === 'active') {
      return null; // Don't create duplicate active alerts
    }

    // Create alert input
    const alert: CapacityAlertInput = {
      tenantId,
      alertType: metric.type,
      severity,
      threshold,
      currentUsage: metric.current,
      limit: metric.limit,
      percentage,
      title: ALERT_TITLES[metric.type][severity],
      message: this.generateAlertMessage(metric, severity),
      details: {
        unit: metric.unit,
        displayName: metric.displayName,
        thresholds,
      },
    };

    return alert;
  }

  /**
   * Create alert in database
   */
  static async createAlert(input: CapacityAlertInput): Promise<string> {
    const alert = await prisma.capacityNotification.create({
      data: {
        tenantId: input.tenantId,
        alertType: input.alertType,
        severity: input.severity,
        threshold: input.threshold,
        currentUsage: input.currentUsage,
        limit: input.limit,
        percentage: input.percentage,
        title: input.title,
        message: input.message,
        details: input.details ? JSON.stringify(input.details) : null,
        status: 'active',
      },
    });

    // Create history entry
    await this.createHistoryEntry(
      alert.id,
      input.tenantId,
      'created',
      null,
      'active',
      null,
      `Alert created for ${input.alertType} at ${input.percentage}%`
    );

    return alert.id;
  }

  /**
   * Acknowledge an alert
   */
  static async acknowledgeAlert(
    alertId: string,
    userId: string,
    userEmail: string,
    note?: string
  ): Promise<void> {
    const alert = await prisma.capacityNotification.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error('Alert not found');
    }

    await prisma.capacityNotification.update({
      where: { id: alertId },
      data: {
        status: 'acknowledged',
        acknowledgedBy: userId,
        acknowledgedAt: new Date().toISOString(),
        acknowledgedNote: note,
      },
    });

    await this.createHistoryEntry(
      alertId,
      alert.tenantId,
      'acknowledged',
      alert.status,
      'acknowledged',
      userId,
      note || 'Alert acknowledged'
    );
  }

  /**
   * Dismiss an alert
   */
  static async dismissAlert(
    alertId: string,
    userId: string,
    userEmail: string,
    reason?: string
  ): Promise<void> {
    const alert = await prisma.capacityNotification.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error('Alert not found');
    }

    await prisma.capacityNotification.update({
      where: { id: alertId },
      data: {
        status: 'dismissed',
        resolvedAt: new Date().toISOString(),
        resolvedBy: userId,
        resolutionNote: reason || 'Dismissed by user',
      },
    });

    await this.createHistoryEntry(
      alertId,
      alert.tenantId,
      'dismissed',
      alert.status,
      'dismissed',
      userId,
      reason || 'Alert dismissed'
    );
  }

  /**
   * Resolve an alert
   */
  static async resolveAlert(
    alertId: string,
    userId: string,
    userEmail: string,
    note?: string
  ): Promise<void> {
    const alert = await prisma.capacityNotification.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new Error('Alert not found');
    }

    await prisma.capacityNotification.update({
      where: { id: alertId },
      data: {
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: userId,
        resolutionNote: note,
      },
    });

    await this.createHistoryEntry(
      alertId,
      alert.tenantId,
      'resolved',
      alert.status,
      'resolved',
      userId,
      note || 'Alert resolved'
    );
  }

  /**
   * Get all active alerts
   */
  static async getActiveAlerts(tenantId?: string): Promise<unknown[]> {
    return prisma.capacityNotification.findMany({
      where: {
        tenantId: tenantId || null,
        status: 'active',
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get all alerts with filters
   */
  static async getAlerts(
    tenantId?: string,
    filters?: {
      status?: AlertStatus;
      severity?: Severity;
      alertType?: AlertType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ alerts: unknown[]; total: number }> {
    const where: Record<string, unknown> = {};
    
    if (tenantId !== undefined) {
      where.tenantId = tenantId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.severity) {
      where.severity = filters.severity;
    }
    if (filters?.alertType) {
      where.alertType = filters.alertType;
    }

    const [alerts, total] = await Promise.all([
      prisma.capacityNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      prisma.capacityNotification.count({ where }),
    ]);

    return { alerts, total };
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(tenantId?: string): Promise<NotificationPreferences> {
    if (!tenantId) {
      // Return default settings for platform-level alerts
      return this.getDefaultPreferences();
    }

    const settings = await prisma.notificationSettings.findUnique({
      where: { tenantId },
    });

    if (!settings) {
      // Create default settings for tenant
      return this.createDefaultSettings(tenantId);
    }

    return {
      notificationsEnabled: settings.notificationsEnabled,
      emailNotifications: settings.emailNotifications,
      inAppNotifications: settings.inAppNotifications,
      notificationMode: settings.notificationMode as NotificationMode,
      digestFrequency: settings.digestFrequency as DigestFrequency,
      digestTime: settings.digestTime,
      alertAt50: settings.alertAt50,
      alertAt75: settings.alertAt75,
      alertAt90: settings.alertAt90,
      bandwidthAlerts: settings.bandwidthAlerts,
      functionAlerts: settings.functionAlerts,
      buildMinutesAlerts: settings.buildMinutesAlerts,
      storageAlerts: settings.storageAlerts,
      apiCallsAlerts: settings.apiCallsAlerts,
      adminEmails: settings.adminEmails || undefined,
      quietHoursEnabled: settings.quietHoursEnabled,
      quietHoursStart: settings.quietHoursStart || undefined,
      quietHoursEnd: settings.quietHoursEnd || undefined,
      escalationEnabled: settings.escalationEnabled,
      escalationEmail: settings.escalationEmail || undefined,
      escalationDelayMinutes: settings.escalationDelayMinutes,
    };
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(
    tenantId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<void> {
    await prisma.notificationSettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        ...updates,
      },
      update: updates,
    });
  }

  /**
   * Get alert statistics
   */
  static async getAlertStats(tenantId?: string): Promise<{
    total: number;
    active: number;
    acknowledged: number;
    dismissed: number;
    resolved: number;
    bySeverity: Record<Severity, number>;
    byType: Record<AlertType, number>;
  }> {
    const where = tenantId ? { tenantId } : {};

    const [total, active, acknowledged, dismissed, resolved, bySeverity, byType] = await Promise.all([
      prisma.capacityNotification.count({ where }),
      prisma.capacityNotification.count({ where: { ...where, status: 'active' } }),
      prisma.capacityNotification.count({ where: { ...where, status: 'acknowledged' } }),
      prisma.capacityNotification.count({ where: { ...where, status: 'dismissed' } }),
      prisma.capacityNotification.count({ where: { ...where, status: 'resolved' } }),
      Promise.all([
        prisma.capacityNotification.count({ where: { ...where, severity: 'info' } }),
        prisma.capacityNotification.count({ where: { ...where, severity: 'warning' } }),
        prisma.capacityNotification.count({ where: { ...where, severity: 'critical' } }),
      ]),
      Promise.all([
        prisma.capacityNotification.count({ where: { ...where, alertType: 'bandwidth' } }),
        prisma.capacityNotification.count({ where: { ...where, alertType: 'functionInvocations' } }),
        prisma.capacityNotification.count({ where: { ...where, alertType: 'buildMinutes' } }),
        prisma.capacityNotification.count({ where: { ...where, alertType: 'storage' } }),
        prisma.capacityNotification.count({ where: { ...where, alertType: 'apiCalls' } }),
      ]),
    ]);

    return {
      total,
      active,
      acknowledged,
      dismissed,
      resolved,
      bySeverity: {
        info: bySeverity[0],
        warning: bySeverity[1],
        critical: bySeverity[2],
      },
      byType: {
        bandwidth: byType[0],
        functionInvocations: byType[1],
        buildMinutes: byType[2],
        storage: byType[3],
        apiCalls: byType[4],
      },
    };
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private static async getCurrentUsage(_tenantId?: string): Promise<UsageMetric[]> {
    // In production, this would fetch from Vercel/GitHub APIs
    // For now, return mock data
    const metrics: UsageMetric[] = [];

    for (const [type, config] of Object.entries(METRIC_LIMITS)) {
      const current = Math.random() * config.limit * 0.9; // Random usage up to 90%
      metrics.push({
        type: type as AlertType,
        current,
        limit: config.limit,
        percentage: (current / config.limit) * 100,
        unit: config.unit,
        displayName: config.displayName,
      });
    }

    return metrics;
  }

  private static isMetricEnabled(
    type: AlertType,
    preferences: NotificationPreferences
  ): boolean {
    const enabledMap: Record<AlertType, boolean> = {
      bandwidth: preferences.bandwidthAlerts,
      functionInvocations: preferences.functionAlerts,
      buildMinutes: preferences.buildMinutesAlerts,
      storage: preferences.storageAlerts,
      apiCalls: preferences.apiCallsAlerts,
    };

    return enabledMap[type];
  }

  private static async findExistingAlert(
    alertType: AlertType,
    threshold: number,
    tenantId?: string
  ): Promise<unknown | null> {
    return prisma.capacityNotification.findFirst({
      where: {
        tenantId: tenantId || null,
        alertType,
        threshold,
        status: { in: ['active', 'acknowledged'] },
      },
    });
  }

  private static generateAlertMessage(
    metric: UsageMetric,
    severity: Severity
  ): string {
    const unit = metric.unit;
    const current = metric.current.toFixed(2);
    const limit = metric.limit;
    const percentage = metric.percentage.toFixed(1);

    switch (severity) {
      case 'critical':
        return `Critical: ${metric.displayName} usage has reached ${percentage}% (${current} ${unit} of ${limit} ${unit}). Immediate action required to avoid service disruption.`;
      case 'warning':
        return `Warning: ${metric.displayName} usage is at ${percentage}% (${current} ${unit} of ${limit} ${unit}). Consider monitoring closely.`;
      default:
        return `Info: ${metric.displayName} usage is approaching threshold at ${percentage}% (${current} ${unit} of ${limit} ${unit}).`;
    }
  }

  private static getDefaultPreferences(): NotificationPreferences {
    return {
      notificationsEnabled: true,
      emailNotifications: true,
      inAppNotifications: true,
      notificationMode: 'immediate',
      digestFrequency: 'daily',
      digestTime: '09:00',
      alertAt50: true,
      alertAt75: true,
      alertAt90: true,
      bandwidthAlerts: true,
      functionAlerts: true,
      buildMinutesAlerts: true,
      storageAlerts: true,
      apiCallsAlerts: true,
      quietHoursEnabled: false,
      escalationEnabled: false,
      escalationDelayMinutes: 30,
    };
  }

  private static async createDefaultSettings(tenantId: string): Promise<NotificationPreferences> {
    const defaults = this.getDefaultPreferences();
    
    await prisma.notificationSettings.create({
      data: {
        tenantId,
        ...defaults,
      },
    });

    return defaults;
  }

  private static async createHistoryEntry(
    notificationId: string,
    tenantId: string | null | undefined,
    eventType: string,
    previousStatus: string | null,
    newStatus: string,
    performedBy: string | null,
    notes: string
  ): Promise<void> {
    await prisma.alertHistory.create({
      data: {
        notificationId,
        tenantId: tenantId || null,
        eventType,
        previousStatus,
        newStatus,
        performedBy,
        notes,
      },
    });
  }
}

// ============================================
// EMAIL NOTIFICATION SERVICE
// ============================================

export class EmailNotificationService {
  /**
   * Send email notification for an alert
   */
  static async sendAlertEmail(
    alert: CapacityAlertInput,
    recipients: string[]
  ): Promise<boolean> {
    // In production, integrate with email service (Resend, SendGrid, etc.)
    console.log(`[Email] Sending alert to ${recipients.join(', ')}:`, alert.title);
    
    // Mock implementation - replace with actual email service
    const emailContent = this.generateEmailContent(alert);
    console.log('Email content:', emailContent);
    
    return true;
  }

  /**
   * Send digest email with multiple alerts
   */
  static async sendDigestEmail(
    alerts: CapacityAlertInput[],
    recipients: string[]
  ): Promise<boolean> {
    console.log(`[Email] Sending digest to ${recipients.join(', ')}: ${alerts.length} alerts`);
    return true;
  }

  private static generateEmailContent(alert: CapacityAlertInput): string {
    return `
      <h2>${alert.title}</h2>
      <p>${alert.message}</p>
      <ul>
        <li>Current Usage: ${alert.currentUsage.toFixed(2)} / ${alert.limit}</li>
        <li>Percentage: ${alert.percentage.toFixed(1)}%</li>
        <li>Severity: ${alert.severity.toUpperCase()}</li>
      </ul>
    `;
  }
}

// ============================================
// DIGEST SERVICE
// ============================================

export class DigestService {
  /**
   * Create a new digest entry
   */
  static async createDigest(
    tenantId: string,
    alerts: CapacityAlertInput[]
  ): Promise<string> {
    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setHours(periodStart.getHours() - 24);

    const digest = await prisma.notificationDigest.create({
      data: {
        tenantId,
        periodStart: periodStart.toISOString(),
        periodEnd: now.toISOString(),
        alertCount: alerts.length,
        criticalCount: alerts.filter(a => a.severity === 'critical').length,
        warningCount: alerts.filter(a => a.severity === 'warning').length,
        infoCount: alerts.filter(a => a.severity === 'info').length,
        summary: JSON.stringify(alerts),
        status: 'pending',
      },
    });

    return digest.id;
  }

  /**
   * Process pending digests
   */
  static async processPendingDigests(): Promise<void> {
    const pendingDigests = await prisma.notificationDigest.findMany({
      where: { status: 'pending' },
      take: 100,
    });

    for (const digest of pendingDigests) {
      try {
        const alerts = JSON.parse(digest.summary || '[]') as CapacityAlertInput[];
        const settings = await CapacityAlertService.getNotificationSettings(digest.tenantId || undefined);
        
        if (settings.emailNotifications && settings.adminEmails) {
          const recipients = settings.adminEmails.split(',').map(e => e.trim());
          await EmailNotificationService.sendDigestEmail(alerts, recipients);
        }

        await prisma.notificationDigest.update({
          where: { id: digest.id },
          data: {
            status: 'sent',
            sentAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        await prisma.notificationDigest.update({
          where: { id: digest.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }
  }
}

// Export default instance
export default CapacityAlertService;
