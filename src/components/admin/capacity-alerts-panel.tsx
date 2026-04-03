'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Server,
  Database,
  Cloud,
  Zap,
  HardDrive,
  Globe,
  RefreshCw,
  Settings,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Trash2,
  Eye,
  Check,
  X,
  Mail,
  Moon,
  TrendingUp,
  History,
  MoreHorizontal,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type AlertType = 'bandwidth' | 'functionInvocations' | 'buildMinutes' | 'storage' | 'apiCalls';
type Severity = 'info' | 'warning' | 'critical';
type AlertStatus = 'active' | 'acknowledged' | 'dismissed' | 'resolved';

interface CapacityAlert {
  id: string;
  tenantId?: string;
  alertType: AlertType;
  severity: Severity;
  threshold: number;
  currentUsage: number;
  limit: number;
  percentage: number;
  title: string;
  message: string;
  details?: string;
  status: AlertStatus;
  emailSent: boolean;
  emailSentAt?: string;
  inAppShown: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  acknowledgedNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertStats {
  total: number;
  active: number;
  acknowledged: number;
  dismissed: number;
  resolved: number;
  bySeverity: Record<Severity, number>;
  byType: Record<AlertType, number>;
}

interface NotificationSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  notificationMode: 'immediate' | 'digest';
  digestFrequency: 'hourly' | 'daily' | 'weekly';
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

const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; icon: React.ReactNode; color: string }> = {
  bandwidth: { label: 'Bandwidth', icon: <Activity className="w-4 h-4" />, color: 'text-blue-500' },
  functionInvocations: { label: 'Functions', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500' },
  buildMinutes: { label: 'Build Minutes', icon: <Clock className="w-4 h-4" />, color: 'text-purple-500' },
  storage: { label: 'Storage', icon: <HardDrive className="w-4 h-4" />, color: 'text-green-500' },
  apiCalls: { label: 'API Calls', icon: <Globe className="w-4 h-4" />, color: 'text-orange-500' },
};

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bgColor: string; borderColor: string }> = {
  info: { label: 'Info', color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  warning: { label: 'Warning', color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  critical: { label: 'Critical', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
};

const STATUS_CONFIG: Record<AlertStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  acknowledged: { label: 'Acknowledged', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  dismissed: { label: 'Dismissed', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
  resolved: { label: 'Resolved', color: 'text-green-500', bgColor: 'bg-green-500/10' },
};

// ============================================
// COMPONENTS
// ============================================

export function CapacityAlertsPanel() {
  const [alerts, setAlerts] = useState<CapacityAlert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('alerts');
  const [filters, setFilters] = useState({
    status: 'all' as AlertStatus | 'all',
    severity: 'all' as Severity | 'all',
    type: 'all' as AlertType | 'all',
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.severity !== 'all') params.append('severity', filters.severity);
      if (filters.type !== 'all') params.append('alertType', filters.type);

      const response = await fetch(`/api/admin/notifications?${params.toString()}`);
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications?action=stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications?action=settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchAlerts(), fetchStats(), fetchSettings()]);
      setIsLoading(false);
    };
    load();
  }, [fetchAlerts, fetchStats, fetchSettings]);

  // Refresh alerts when filters change
  useEffect(() => {
    fetchAlerts();
  }, [filters, fetchAlerts]);

  // Run capacity check
  const runCapacityCheck = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
      });
      const data = await response.json();
      if (data.success) {
        await Promise.all([fetchAlerts(), fetchStats()]);
      }
    } catch (error) {
      console.error('Failed to run capacity check:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string, note?: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'acknowledge', alertId, note }),
      });
      await Promise.all([fetchAlerts(), fetchStats()]);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  // Dismiss alert
  const dismissAlert = async (alertId: string, reason?: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', alertId, reason }),
      });
      await Promise.all([fetchAlerts(), fetchStats()]);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId: string, note?: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', alertId, note }),
      });
      await Promise.all([fetchAlerts(), fetchStats()]);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  // Bulk acknowledge
  const bulkAcknowledge = async () => {
    if (selectedAlerts.length === 0) return;
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-acknowledge', alertIds: selectedAlerts }),
      });
      setSelectedAlerts([]);
      await Promise.all([fetchAlerts(), fetchStats()]);
    } catch (error) {
      console.error('Failed to bulk acknowledge:', error);
    }
  };

  // Bulk dismiss
  const bulkDismiss = async () => {
    if (selectedAlerts.length === 0) return;
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-dismiss', alertIds: selectedAlerts }),
      });
      setSelectedAlerts([]);
      await Promise.all([fetchAlerts(), fetchStats()]);
    } catch (error) {
      console.error('Failed to bulk dismiss:', error);
    }
  };

  // Toggle alert selection
  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  // Select all visible alerts
  const selectAllAlerts = () => {
    if (selectedAlerts.length === alerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(alerts.map(a => a.id));
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-[var(--nexus-violet)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Capacity Alerts
          </h2>
          <p className="text-[var(--text-dim)] text-sm">
            Monitor and manage system capacity notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={runCapacityCheck} disabled={isChecking}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Now
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Active</p>
                  <p className="text-2xl font-bold text-red-500">{stats.active}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Acknowledged</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.acknowledged}</p>
                </div>
                <Check className="w-8 h-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Critical</p>
                  <p className="text-2xl font-bold text-red-500">{stats.bySeverity.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)]">Total</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-[var(--nexus-violet)]/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-[var(--glass)] border border-[var(--glass-border)]">
          <TabsTrigger value="alerts">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[var(--text-dim)]" />
                  <span className="text-sm text-[var(--text-dim)]">Filters:</span>
                </div>
                <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v as AlertStatus | 'all' }))}>
                  <SelectTrigger className="w-32 bg-[var(--obsidian)] border-[var(--glass-border)]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.severity} onValueChange={(v) => setFilters(f => ({ ...f, severity: v as Severity | 'all' }))}>
                  <SelectTrigger className="w-32 bg-[var(--obsidian)] border-[var(--glass-border)]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.type} onValueChange={(v) => setFilters(f => ({ ...f, type: v as AlertType | 'all' }))}>
                  <SelectTrigger className="w-32 bg-[var(--obsidian)] border-[var(--glass-border)]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bandwidth">Bandwidth</SelectItem>
                    <SelectItem value="functionInvocations">Functions</SelectItem>
                    <SelectItem value="buildMinutes">Build Minutes</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="apiCalls">API Calls</SelectItem>
                  </SelectContent>
                </Select>
                {selectedAlerts.length > 0 && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-[var(--text-dim)]">{selectedAlerts.length} selected</span>
                    <Button variant="outline" size="sm" onClick={bulkAcknowledge}>
                      <Check className="w-4 h-4 mr-1" />
                      Acknowledge All
                    </Button>
                    <Button variant="outline" size="sm" onClick={bulkDismiss}>
                      <X className="w-4 h-4 mr-1" />
                      Dismiss All
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Alerts ({alerts.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={selectAllAlerts}>
                  {selectedAlerts.length === alerts.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-dim)]">
                    <CheckCircle className="w-12 h-12 mb-4 text-green-500/50" />
                    <p className="text-lg font-medium">No alerts found</p>
                    <p className="text-sm">All systems are running normally</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        isExpanded={expandedAlert === alert.id}
                        isSelected={selectedAlerts.includes(alert.id)}
                        onToggleExpand={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                        onToggleSelect={() => toggleAlertSelection(alert.id)}
                        onAcknowledge={() => acknowledgeAlert(alert.id)}
                        onDismiss={() => dismissAlert(alert.id)}
                        onResolve={() => resolveAlert(alert.id)}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <NotificationSettingsPanel
            settings={settings}
            onUpdate={fetchSettings}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <AlertHistoryPanel formatDate={formatDate} />
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl bg-[var(--obsidian)] border-[var(--glass-border)]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how and when you receive capacity alerts
            </DialogDescription>
          </DialogHeader>
          {settings && (
            <NotificationSettingsPanel settings={settings} onUpdate={fetchSettings} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--obsidian)] border-[var(--glass-border)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Dismiss Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to dismiss this alert? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (alertToDelete) {
                  dismissAlert(alertToDelete);
                  setAlertToDelete(null);
                }
                setShowDeleteDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Dismiss
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================
// ALERT CARD COMPONENT
// ============================================

interface AlertCardProps {
  alert: CapacityAlert;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  onAcknowledge: () => void;
  onDismiss: () => void;
  onResolve: () => void;
  formatDate: (date: string) => string;
}

function AlertCard({
  alert,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onAcknowledge,
  onDismiss,
  onResolve,
  formatDate,
}: AlertCardProps) {
  const typeConfig = ALERT_TYPE_CONFIG[alert.alertType];
  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const statusConfig = STATUS_CONFIG[alert.status];

  return (
    <div
      className={`rounded-lg border ${severityConfig.borderColor} ${severityConfig.bgColor} transition-all`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1 w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--obsidian)]"
          />

          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg ${severityConfig.bgColor} flex items-center justify-center ${typeConfig.color}`}>
            {typeConfig.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-[var(--text-primary)]">{alert.title}</h4>
              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                {statusConfig.label}
              </Badge>
              <Badge className={`${severityConfig.bgColor} ${severityConfig.color} border-0`}>
                {severityConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-mid)] mt-1 line-clamp-2">{alert.message}</p>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-1">
                <span>{typeConfig.label}</span>
                <span>{alert.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={alert.percentage} className="h-2" />
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 text-xs text-[var(--text-dim)] mt-2 hover:text-[var(--text-mid)] transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show more
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {alert.status === 'active' && (
              <>
                <Button variant="outline" size="sm" onClick={onAcknowledge}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={onDismiss}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
            {alert.status === 'acknowledged' && (
              <Button variant="outline" size="sm" onClick={onResolve}>
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[var(--text-dim)]">Current Usage</p>
                <p className="text-[var(--text-primary)] font-medium">
                  {alert.currentUsage.toFixed(2)} / {alert.limit} {alert.details ? JSON.parse(alert.details).unit : ''}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-dim)]">Threshold</p>
                <p className="text-[var(--text-primary)] font-medium">{alert.threshold}%</p>
              </div>
              <div>
                <p className="text-[var(--text-dim)]">Created</p>
                <p className="text-[var(--text-primary)] font-medium">{formatDate(alert.createdAt)}</p>
              </div>
              <div>
                <p className="text-[var(--text-dim)]">Email Sent</p>
                <p className="text-[var(--text-primary)] font-medium">
                  {alert.emailSent ? `Yes (${alert.emailSentAt ? formatDate(alert.emailSentAt) : 'N/A'})` : 'No'}
                </p>
              </div>
              {alert.acknowledgedBy && (
                <div>
                  <p className="text-[var(--text-dim)]">Acknowledged By</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    {alert.acknowledgedBy} ({alert.acknowledgedAt ? formatDate(alert.acknowledgedAt) : 'N/A'})
                  </p>
                </div>
              )}
              {alert.acknowledgedNote && (
                <div className="col-span-2">
                  <p className="text-[var(--text-dim)]">Note</p>
                  <p className="text-[var(--text-primary)]">{alert.acknowledgedNote}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// NOTIFICATION SETTINGS PANEL
// ============================================

interface NotificationSettingsPanelProps {
  settings: NotificationSettings | null;
  onUpdate: () => void;
}

function NotificationSettingsPanel({ settings, onUpdate }: NotificationSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setLocalSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const saveSettings = async () => {
    if (!localSettings) return;
    setIsSaving(true);
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-settings',
          tenantId: 'platform', // Platform-level settings
          settings: localSettings,
        }),
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!localSettings) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Enable Notifications</Label>
              <p className="text-sm text-[var(--text-dim)]">Master toggle for all notifications</p>
            </div>
            <Switch
              checked={localSettings.notificationsEnabled}
              onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Channels */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Delivery Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--text-dim)]" />
              <div>
                <Label className="text-[var(--text-primary)]">Email Notifications</Label>
                <p className="text-sm text-[var(--text-dim)]">Receive alerts via email</p>
              </div>
            </div>
            <Switch
              checked={localSettings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--text-dim)]" />
              <div>
                <Label className="text-[var(--text-primary)]">In-App Notifications</Label>
                <p className="text-sm text-[var(--text-dim)]">Show alerts in the application</p>
              </div>
            </div>
            <Switch
              checked={localSettings.inAppNotifications}
              onCheckedChange={(checked) => updateSetting('inAppNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Mode */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Notification Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Mode</Label>
              <p className="text-sm text-[var(--text-dim)]">Immediate or digest mode</p>
            </div>
            <Select
              value={localSettings.notificationMode}
              onValueChange={(value: 'immediate' | 'digest') => updateSetting('notificationMode', value)}
            >
              <SelectTrigger className="w-40 bg-[var(--obsidian)] border-[var(--glass-border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="digest">Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localSettings.notificationMode === 'digest' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[var(--text-primary)]">Frequency</Label>
                <Select
                  value={localSettings.digestFrequency}
                  onValueChange={(value: 'hourly' | 'daily' | 'weekly') => updateSetting('digestFrequency', value)}
                >
                  <SelectTrigger className="w-full bg-[var(--obsidian)] border-[var(--glass-border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[var(--text-primary)]">Send Time</Label>
                <Input
                  type="time"
                  value={localSettings.digestTime}
                  onChange={(e) => updateSetting('digestTime', e.target.value)}
                  className="bg-[var(--obsidian)] border-[var(--glass-border)]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threshold Alerts */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Threshold Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Alert at 50%</Label>
              <p className="text-sm text-[var(--text-dim)]">Info level notification</p>
            </div>
            <Switch
              checked={localSettings.alertAt50}
              onCheckedChange={(checked) => updateSetting('alertAt50', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Alert at 75%</Label>
              <p className="text-sm text-[var(--text-dim)]">Warning level notification</p>
            </div>
            <Switch
              checked={localSettings.alertAt75}
              onCheckedChange={(checked) => updateSetting('alertAt75', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Alert at 90%</Label>
              <p className="text-sm text-[var(--text-dim)]">Critical level notification</p>
            </div>
            <Switch
              checked={localSettings.alertAt90}
              onCheckedChange={(checked) => updateSetting('alertAt90', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metric-Specific Settings */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Metrics to Monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ALERT_TYPE_CONFIG).map(([key, config]) => (
            <React.Fragment key={key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={config.color}>{config.icon}</span>
                  <Label className="text-[var(--text-primary)]">{config.label} Alerts</Label>
                </div>
                <Switch
                  checked={localSettings[`${key}Alerts` as keyof NotificationSettings] as boolean}
                  onCheckedChange={(checked) => 
                    updateSetting(`${key}Alerts` as keyof NotificationSettings, checked)
                  }
                />
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[var(--text-primary)]">Enable Quiet Hours</Label>
              <p className="text-sm text-[var(--text-dim)]">Pause notifications during specified hours</p>
            </div>
            <Switch
              checked={localSettings.quietHoursEnabled}
              onCheckedChange={(checked) => updateSetting('quietHoursEnabled', checked)}
            />
          </div>
          {localSettings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[var(--text-primary)]">Start Time</Label>
                <Input
                  type="time"
                  value={localSettings.quietHoursStart || '22:00'}
                  onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                  className="bg-[var(--obsidian)] border-[var(--glass-border)]"
                />
              </div>
              <div>
                <Label className="text-[var(--text-primary)]">End Time</Label>
                <Input
                  type="time"
                  value={localSettings.quietHoursEnd || '06:00'}
                  onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                  className="bg-[var(--obsidian)] border-[var(--glass-border)]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Emails */}
      <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Email Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-[var(--text-primary)]">Admin Emails</Label>
            <p className="text-sm text-[var(--text-dim)] mb-2">Comma-separated email addresses</p>
            <Input
              value={localSettings.adminEmails || ''}
              onChange={(e) => updateSetting('adminEmails', e.target.value)}
              placeholder="admin@example.com, ops@example.com"
              className="bg-[var(--obsidian)] border-[var(--glass-border)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setLocalSettings(settings)}>
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// ALERT HISTORY PANEL
// ============================================

interface AlertHistoryPanelProps {
  formatDate: (date: string) => string;
}

function AlertHistoryPanel({ formatDate }: AlertHistoryPanelProps) {
  const [history, setHistory] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/admin/notifications?action=history&limit=100');
        const data = await response.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-[var(--nexus-violet)]" />
      </div>
    );
  }

  return (
    <Card className="bg-[var(--glass)] border-[var(--glass-border)]">
      <CardHeader>
        <CardTitle className="text-lg">Alert History</CardTitle>
        <CardDescription>Audit trail of all alert activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-dim)]">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p>No history records found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item: Record<string, unknown>) => (
                <div
                  key={item.id as string}
                  className="p-3 rounded-lg bg-[var(--obsidian)] border border-[var(--glass-border)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`
                        ${item.eventType === 'created' ? 'bg-blue-500/10 text-blue-500' : ''}
                        ${item.eventType === 'acknowledged' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${item.eventType === 'dismissed' ? 'bg-gray-500/10 text-gray-500' : ''}
                        ${item.eventType === 'resolved' ? 'bg-green-500/10 text-green-500' : ''}
                        ${item.eventType === 'escalated' ? 'bg-red-500/10 text-red-500' : ''}
                      `}>
                        {(item.eventType as string).charAt(0).toUpperCase() + (item.eventType as string).slice(1)}
                      </Badge>
                      <span className="text-[var(--text-primary)]">{item.notes as string}</span>
                    </div>
                    <span className="text-xs text-[var(--text-dim)]">{formatDate(item.createdAt as string)}</span>
                  </div>
                  {item.previousStatus && item.newStatus && (
                    <p className="text-xs text-[var(--text-dim)] mt-1">
                      Status: {item.previousStatus as string} → {item.newStatus as string}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default CapacityAlertsPanel;
