/**
 * API Route for Capacity Notifications
 * 
 * Handles CRUD operations for capacity alerts and notification settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import {
  CapacityAlertService,
  EmailNotificationService,
  DigestService,
  type AlertType,
  type Severity,
  type AlertStatus,
  type NotificationPreferences,
} from '@/lib/notifications/capacity-alerts';

// ============================================
// GET /api/admin/notifications
// ============================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId') || undefined;
    const status = searchParams.get('status') as AlertStatus | null;
    const severity = searchParams.get('severity') as Severity | null;
    const alertType = searchParams.get('alertType') as AlertType | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    switch (action) {
      case 'stats':
        const stats = await CapacityAlertService.getAlertStats(tenantId);
        return NextResponse.json(stats);

      case 'settings':
        const settings = await CapacityAlertService.getNotificationSettings(tenantId);
        return NextResponse.json(settings);

      case 'active':
        const activeAlerts = await CapacityAlertService.getActiveAlerts(tenantId);
        return NextResponse.json({ alerts: activeAlerts });

      case 'check':
        // Trigger a capacity check
        const newAlerts = await CapacityAlertService.checkAndCreateAlerts(tenantId);
        return NextResponse.json({ 
          message: 'Capacity check completed',
          newAlertsCount: newAlerts.length,
          newAlerts 
        });

      case 'history':
        const history = await prisma.alertHistory.findMany({
          where: tenantId ? { tenantId } : {},
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        });
        return NextResponse.json({ history });

      default:
        // Get all alerts with filters
        const { alerts, total } = await CapacityAlertService.getAlerts(tenantId, {
          status: status || undefined,
          severity: severity || undefined,
          alertType: alertType || undefined,
          limit,
          offset,
        });
        return NextResponse.json({ alerts, total, limit, offset });
    }
  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/admin/notifications
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, tenantId } = body;

    switch (action) {
      case 'check':
        // Run capacity check and create alerts
        const newAlerts = await CapacityAlertService.checkAndCreateAlerts(tenantId);
        
        // Create alerts in database
        const createdAlertIds = [];
        for (const alert of newAlerts) {
          const alertId = await CapacityAlertService.createAlert(alert);
          createdAlertIds.push(alertId);

          // Send email if configured
          if (alert.severity === 'critical') {
            const settings = await CapacityAlertService.getNotificationSettings(tenantId);
            if (settings.emailNotifications && settings.adminEmails) {
              const recipients = settings.adminEmails.split(',').map(e => e.trim());
              await EmailNotificationService.sendAlertEmail(alert, recipients);
            }
          }
        }

        return NextResponse.json({
          success: true,
          checked: true,
          alertsCreated: createdAlertIds.length,
          alertIds: createdAlertIds,
        });

      case 'acknowledge':
        if (!body.alertId) {
          return NextResponse.json({ error: 'alertId is required' }, { status: 400 });
        }
        
        await CapacityAlertService.acknowledgeAlert(
          body.alertId,
          session.user.id || 'unknown',
          session.user.email || 'unknown',
          body.note
        );

        return NextResponse.json({
          success: true,
          message: 'Alert acknowledged',
        });

      case 'dismiss':
        if (!body.alertId) {
          return NextResponse.json({ error: 'alertId is required' }, { status: 400 });
        }

        await CapacityAlertService.dismissAlert(
          body.alertId,
          session.user.id || 'unknown',
          session.user.email || 'unknown',
          body.reason
        );

        return NextResponse.json({
          success: true,
          message: 'Alert dismissed',
        });

      case 'resolve':
        if (!body.alertId) {
          return NextResponse.json({ error: 'alertId is required' }, { status: 400 });
        }

        await CapacityAlertService.resolveAlert(
          body.alertId,
          session.user.id || 'unknown',
          session.user.email || 'unknown',
          body.note
        );

        return NextResponse.json({
          success: true,
          message: 'Alert resolved',
        });

      case 'bulk-acknowledge':
        if (!body.alertIds || !Array.isArray(body.alertIds)) {
          return NextResponse.json({ error: 'alertIds array is required' }, { status: 400 });
        }

        for (const alertId of body.alertIds) {
          await CapacityAlertService.acknowledgeAlert(
            alertId,
            session.user.id || 'unknown',
            session.user.email || 'unknown',
            body.note
          );
        }

        return NextResponse.json({
          success: true,
          message: `${body.alertIds.length} alerts acknowledged`,
        });

      case 'bulk-dismiss':
        if (!body.alertIds || !Array.isArray(body.alertIds)) {
          return NextResponse.json({ error: 'alertIds array is required' }, { status: 400 });
        }

        for (const alertId of body.alertIds) {
          await CapacityAlertService.dismissAlert(
            alertId,
            session.user.id || 'unknown',
            session.user.email || 'unknown',
            body.reason
          );
        }

        return NextResponse.json({
          success: true,
          message: `${body.alertIds.length} alerts dismissed`,
        });

      case 'create-digest':
        if (!tenantId) {
          return NextResponse.json({ error: 'tenantId is required for digest' }, { status: 400 });
        }

        // Get pending alerts
        const { alerts: pendingAlerts } = await CapacityAlertService.getAlerts(tenantId, {
          status: 'active',
        });

        if (pendingAlerts.length === 0) {
          return NextResponse.json({ message: 'No pending alerts for digest' });
        }

        const digestId = await DigestService.createDigest(
          tenantId, 
          pendingAlerts.map((a: Record<string, unknown>) => ({
            alertType: a.alertType as AlertType,
            severity: a.severity as Severity,
            threshold: a.threshold as number,
            currentUsage: a.currentUsage as number,
            limit: a.limit as number,
            percentage: a.percentage as number,
            title: a.title as string,
            message: a.message as string,
          }))
        );

        return NextResponse.json({
          success: true,
          digestId,
          alertCount: pendingAlerts.length,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/admin/notifications
// ============================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, tenantId, settings } = body;

    switch (action) {
      case 'update-settings':
        if (!tenantId) {
          return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
        }

        await CapacityAlertService.updateNotificationSettings(
          tenantId,
          settings as Partial<NotificationPreferences>
        );

        return NextResponse.json({
          success: true,
          message: 'Notification settings updated',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/admin/notifications
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const alertId = searchParams.get('alertId');

    if (!alertId) {
      return NextResponse.json({ error: 'alertId is required' }, { status: 400 });
    }

    // Soft delete by marking as dismissed
    await CapacityAlertService.dismissAlert(
      alertId,
      session.user.id || 'unknown',
      session.user.email || 'unknown',
      'Deleted via API'
    );

    return NextResponse.json({
      success: true,
      message: 'Alert deleted',
    });
  } catch (error) {
    console.error('[Notifications API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
