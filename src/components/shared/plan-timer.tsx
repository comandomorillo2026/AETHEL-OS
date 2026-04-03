'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  AlertTriangle,
  Crown,
  Calendar,
  CreditCard,
  Zap,
  ArrowUp,
  ExternalLink,
  Download,
  FileDown
} from 'lucide-react';

interface PlanTimerProps {
  tenant: {
    id: string;
    businessName: string;
    planSlug: string;
    billingCycle: string;
    status: string;
    isTrial: boolean;
    trialStartsAt?: string;
    trialEndsAt?: string;
    activatedAt?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    suspendedAt?: string;
    gracePeriodEndsAt?: string;
  };
  language?: 'es' | 'en';
  onUpgrade?: () => void;
  onExportData?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

export function PlanTimer({ 
  tenant, 
  language = 'es', 
  onUpgrade, 
  onExportData 
}: PlanTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    expired: false,
  });

  const t = {
    es: {
      trial: 'Período de Prueba',
      active: 'Plan Activo',
      pastDue: 'Pago Vencido',
      suspended: 'Suspendido',
      daysRemaining: 'días restantes',
      hoursRemaining: 'horas restantes',
      expiresAt: 'Expira el',
      upgradePlan: 'Subir de Plan',
      activatePlan: 'Activar Plan',
      renewPlan: 'Renovar Plan',
      yourPlan: 'Tu Plan',
      trialExpired: 'Tu período de prueba ha expirado',
      accountSuspended: 'Tu cuenta está suspendida',
      exportData: 'Exportar Mis Datos',
      gracePeriod: 'Período de gracia - Exporta tus datos antes del',
      contactSupport: 'Contactar Soporte',
      days: 'días',
      hours: 'horas',
      minutes: 'min',
      seconds: 'seg',
    },
    en: {
      trial: 'Trial Period',
      active: 'Active Plan',
      pastDue: 'Past Due',
      suspended: 'Suspended',
      daysRemaining: 'days remaining',
      hoursRemaining: 'hours remaining',
      expiresAt: 'Expires on',
      upgradePlan: 'Upgrade Plan',
      activatePlan: 'Activate Plan',
      renewPlan: 'Renew Plan',
      yourPlan: 'Your Plan',
      trialExpired: 'Your trial period has expired',
      accountSuspended: 'Your account is suspended',
      exportData: 'Export My Data',
      gracePeriod: 'Grace period - Export your data before',
      contactSupport: 'Contact Support',
      days: 'days',
      hours: 'hours',
      minutes: 'min',
      seconds: 'sec',
    },
  };

  const currentT = t[language];

  // Calculate end date based on tenant status
  const getEndDate = (): Date | null => {
    if (tenant.isTrial && tenant.trialEndsAt) {
      return new Date(tenant.trialEndsAt);
    }
    if (tenant.currentPeriodEnd) {
      return new Date(tenant.currentPeriodEnd);
    }
    if (tenant.gracePeriodEndsAt) {
      return new Date(tenant.gracePeriodEndsAt);
    }
    return null;
  };

  // Update countdown timer
  useEffect(() => {
    const endDate = getEndDate();
    
    if (!endDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total: diff,
        expired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tenant]);

  // Get status configuration
  const getStatusConfig = () => {
    if (tenant.status === 'suspended' || timeRemaining.expired) {
      return {
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        icon: AlertTriangle,
        label: currentT.suspended,
      };
    }
    
    if (tenant.status === 'past_due') {
      return {
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        icon: AlertTriangle,
        label: currentT.pastDue,
      };
    }
    
    if (tenant.isTrial) {
      return {
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        icon: Zap,
        label: currentT.trial,
      };
    }
    
    return {
      color: '#22D3EE',
      bgColor: 'rgba(34, 211, 238, 0.1)',
      borderColor: 'rgba(34, 211, 238, 0.3)',
      icon: Crown,
      label: currentT.active,
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    const endDate = getEndDate();
    if (!endDate) return 0;

    let startDate: Date;
    if (tenant.isTrial && tenant.trialStartsAt) {
      startDate = new Date(tenant.trialStartsAt);
    } else if (tenant.currentPeriodStart) {
      startDate = new Date(tenant.currentPeriodStart);
    } else {
      return 0;
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = timeRemaining.total;
    const used = totalDuration - elapsed;
    
    return Math.max(0, Math.min(100, (used / totalDuration) * 100));
  };

  // Format plan name
  const getPlanName = (): string => {
    const plans: Record<string, string> = {
      starter: 'Starter',
      growth: 'Growth',
      premium: 'Premium',
    };
    return plans[tenant.planSlug] || tenant.planSlug;
  };

  // Render expired/suspended state
  if (tenant.status === 'suspended' || timeRemaining.expired) {
    return (
      <div className="p-4 rounded-xl border" style={{
        backgroundColor: statusConfig.bgColor,
        borderColor: statusConfig.borderColor,
      }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
            backgroundColor: `${statusConfig.color}20`,
          }}>
            <AlertTriangle className="w-5 h-5" style={{ color: statusConfig.color }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: statusConfig.color }}>
              {tenant.isTrial ? currentT.trialExpired : currentT.accountSuspended}
            </h3>
            <p className="text-sm text-[var(--text-mid)]">
              {tenant.gracePeriodEndsAt && `${currentT.gracePeriod} ${new Date(tenant.gracePeriodEndsAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {currentT.activatePlan}
          </Button>
          <Button
            onClick={onExportData}
            variant="outline"
            className="w-full border-[var(--glass-border)]"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {currentT.exportData}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border" style={{
      backgroundColor: statusConfig.bgColor,
      borderColor: statusConfig.borderColor,
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
            backgroundColor: `${statusConfig.color}20`,
          }}>
            <StatusIcon className="w-5 h-5" style={{ color: statusConfig.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </span>
              <Badge variant="outline" className="border-[var(--glass-border)]">
                {getPlanName()}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-dim)]">
              {currentT.yourPlan}: {tenant.billingCycle === 'monthly' ? 'Mensual' : tenant.billingCycle === 'annual' ? 'Anual' : 'Bienal'}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div className="p-2 rounded-lg bg-[var(--glass)]">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dm-mono)', color: statusConfig.color }}>
              {String(timeRemaining.days).padStart(2, '0')}
            </p>
            <p className="text-xs text-[var(--text-dim)]">{currentT.days}</p>
          </div>
          <div className="p-2 rounded-lg bg-[var(--glass)]">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dm-mono)', color: statusConfig.color }}>
              {String(timeRemaining.hours).padStart(2, '0')}
            </p>
            <p className="text-xs text-[var(--text-dim)]">{currentT.hours}</p>
          </div>
          <div className="p-2 rounded-lg bg-[var(--glass)]">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dm-mono)', color: statusConfig.color }}>
              {String(timeRemaining.minutes).padStart(2, '0')}
            </p>
            <p className="text-xs text-[var(--text-dim)]">{currentT.minutes}</p>
          </div>
          <div className="p-2 rounded-lg bg-[var(--glass)]">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-dm-mono)', color: statusConfig.color }}>
              {String(timeRemaining.seconds).padStart(2, '0')}
            </p>
            <p className="text-xs text-[var(--text-dim)]">{currentT.seconds}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress 
            value={getProgressPercentage()} 
            className="h-2"
          />
          <p className="text-xs text-[var(--text-dim)] text-center">
            {currentT.expiresAt} {getEndDate()?.toLocaleDateString()} a las 12:00 AM
          </p>
        </div>
      </div>

      {/* Warning for low time */}
      {timeRemaining.days <= 2 && tenant.isTrial && (
        <div className="p-3 rounded-lg bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/30 mb-4">
          <p className="text-sm text-[var(--nexus-gold)]">
            ⚠️ ¡Tu trial está por terminar! Activa tu plan para no perder acceso.
          </p>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onUpgrade}
        className="w-full bg-gradient-to-r from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] text-white"
      >
        <ArrowUp className="w-4 h-4 mr-2" />
        {tenant.isTrial ? currentT.activatePlan : currentT.upgradePlan}
      </Button>
    </div>
  );
}

// Compact version for sidebar/header
export function PlanTimerCompact({ 
  tenant, 
  language = 'es' 
}: { 
  tenant: PlanTimerProps['tenant'];
  language?: 'es' | 'en';
}) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    expired: false,
  });

  useEffect(() => {
    const endDate = tenant.isTrial && tenant.trialEndsAt 
      ? new Date(tenant.trialEndsAt)
      : tenant.currentPeriodEnd 
        ? new Date(tenant.currentPeriodEnd)
        : null;

    if (!endDate) return;

    const updateTimer = () => {
      const diff = endDate.getTime() - Date.now();
      
      if (diff <= 0) {
        setTimeRemaining(prev => ({ ...prev, expired: true }));
        return;
      }

      setTimeRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
        expired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tenant]);

  if (timeRemaining.expired || tenant.status === 'suspended') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30">
        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
        <span className="text-sm text-[#EF4444]">
          {language === 'es' ? 'Cuenta Suspendida' : 'Account Suspended'}
        </span>
      </div>
    );
  }

  const isWarning = timeRemaining.days <= 2 || (timeRemaining.days === 0 && timeRemaining.hours <= 12);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isWarning 
        ? 'bg-[var(--nexus-gold)]/10 border-[var(--nexus-gold)]/30' 
        : tenant.isTrial 
          ? 'bg-[var(--nexus-gold)]/10 border-[var(--nexus-gold)]/30'
          : 'bg-[var(--nexus-violet)]/10 border-[var(--nexus-violet)]/30'
    }`}>
      <Clock className={`w-4 h-4 ${
        isWarning ? 'text-[var(--nexus-gold)]' : tenant.isTrial ? 'text-[var(--nexus-gold)]' : 'text-[var(--nexus-violet-lite)]'
      }`} />
      <span className={`text-sm font-medium ${
        isWarning ? 'text-[var(--nexus-gold)]' : tenant.isTrial ? 'text-[var(--nexus-gold)]' : 'text-[var(--nexus-violet-lite)]'
      }`}>
        {timeRemaining.days > 0 
          ? `${timeRemaining.days} ${language === 'es' ? 'días' : 'days'}`
          : `${timeRemaining.hours}h ${timeRemaining.minutes}m`
        }
      </span>
      {tenant.isTrial && (
        <Badge className="bg-[var(--nexus-gold)]/20 text-[var(--nexus-gold)] text-xs">
          Trial
        </Badge>
      )}
    </div>
  );
}
