'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// ============================================
// CAPACITY METRICS - Métricas de Capacidad
// ============================================
function CapacityMetrics() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  
  // Plan limits - approximate limits for Vercel/GitHub
  const planLimits = {
    free: {
    name: 'Hobby (Free)',
    tenants: 5,
    storage: '500MB',
    bandwidth: '100GB/mes',
    builds: 100,
    price: 'Gratis',
    color: '#34D399'
  },
  pro: {
    name: 'Pro',
    tenants: 50,
    storage: '10GB',
    bandwidth: '1TB/mes',
    builds: 1000,
    price: 'US$20/mes',
    color: '#F0B429'
  },
  enterprise: {
    name: 'Enterprise',
    tenants: 'Ilimitados',
    storage: '100GB',
    bandwidth: 'Ilimitado',
    builds: 'Ilimitados',
    price: 'Custom',
    color: '#EC4899'
  }
  };
  
  // Current usage (simulated)
  const currentUsage = {
    tenants: 23,
    storage: '320MB',
    bandwidth: '45GB',
    builds: 67
  };
  
  const currentPlan = planLimits[selectedPlan];
  
  const getUsagePercent = (current: number | string, limit: number | string) => {
    if (limit === 'Ilimitados' || limit === 'Ilimitado') return 0;
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const limitNum = typeof limit === 'string' ? parseFloat(limit) : limit;
    return Math.min((currentNum / limitNum) * 100, 100);
  };
  
  const isOverLimit = (current: number | string, limit: number | string) => {
    if (limit === 'Ilimitados' || limit === 'Ilimitado') return false;
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const limitNum = typeof limit === 'string' ? parseFloat(limit) : limit;
    return currentNum > limitNum;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Capacidad del Sistema</h3>
          <p className="text-sm text-[var(--text-mid)]">Monitorea el uso de recursos</p>
        </div>
        
        {/* Plan Selector */}
        <div className="flex gap-2">
          {(['free', 'pro', 'enterprise'] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan as 'free' | 'pro' | 'enterprise')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedPlan === plan 
                  ? 'bg-[var(--nexus-gold)]/20 text-[var(--nexus-gold)] border border-[var(--nexus-gold)]/30' 
                  : 'bg-[var(--glass)] text-[var(--text-mid)] hover:text-[var(--text-primary)]'
              }`}
            >
              {planLimits[plan].name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current Plan Info */}
      <div className="p-4 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-[var(--text-mid)]">Plan actual:</span>
            <span className="font-semibold text-[var(--text-primary)] ml-2">{currentPlan.name}</span>
          </div>
          <span className="text-sm font-medium" style={{ color: currentPlan.color }}>
            {currentPlan.price}
          </span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tenants */}
        <div className="p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-mid)]">Inquilinos</span>
            {isOverLimit(currentUsage.tenants, currentPlan.tenants) && (
              <span className="text-xs text-[var(--error)]">⚠ Límite</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{currentUsage.tenants}</span>
            <span className="text-sm text-[var(--text-dim)]">/ {currentPlan.tenants}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                getUsagePercent(currentUsage.tenants, currentPlan.tenants) > 80 ? 'bg-[var(--error)]' : 
                getUsagePercent(currentUsage.tenants, currentPlan.tenants) > 60 ? 'bg-[var(--nexus-gold)]' : 'bg-[var(--success)]'
              }`}
              style={{ width: `${getUsagePercent(currentUsage.tenants, currentPlan.tenants)}%` }}
            />
          </div>
        </div>
        
        {/* Storage */}
        <div className="p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-mid)]">Almacenamiento</span>
            {isOverLimit(currentUsage.storage, currentPlan.storage) && (
              <span className="text-xs text-[var(--error)]">⚠ Límite</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{currentUsage.storage}</span>
            <span className="text-sm text-[var(--text-dim)]">/ {currentPlan.storage}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                getUsagePercent(currentUsage.storage, currentPlan.storage) > 80 ? 'bg-[var(--error)]' : 'bg-[var(--success)]'
              }`}
              style={{ width: `${getUsagePercent(currentUsage.storage, currentPlan.storage)}%` }}
            />
          </div>
        </div>
        
        {/* Bandwidth */}
        <div className="p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-mid)]">Ancho de Banda</span>
            {isOverLimit(currentUsage.bandwidth, currentPlan.bandwidth) && (
              <span className="text-xs text-[var(--error)]">⚠ Límite</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{currentUsage.bandwidth}</span>
            <span className="text-sm text-[var(--text-dim)]">/ {currentPlan.bandwidth}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className="h-full rounded-full bg-[var(--success)]"
              style={{ width: `${getUsagePercent(currentUsage.bandwidth, currentPlan.bandwidth)}%` }}
            />
          </div>
        </div>
        
        {/* Builds */}
        <div className="p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-mid)]">Builds/mes</span>
            {isOverLimit(currentUsage.builds, currentPlan.builds) && (
              <span className="text-xs text-[var(--error)]">⚠ Límite</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{currentUsage.builds}</span>
            <span className="text-sm text-[var(--text-dim)]">/ {currentPlan.builds}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className="h-full rounded-full bg-[var(--success)]"
              style={{ width: `${getUsagePercent(currentUsage.builds, currentPlan.builds)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Upgrade Notice */}
      {(selectedPlan === 'free' && currentUsage.tenants >= 4) && (
        <div className="p-4 rounded-lg bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--nexus-gold)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[var(--text-primary)]">Considera actualizar a Pro</p>
              <p className="text-sm text-[var(--text-mid)]">
                Estás cerca del límite del plan gratuito. Con Pro podrás tener hasta 50 inquilinos.
              </p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-[var(--nexus-gold)] text-[var(--obsidian)] text-sm font-medium hover:opacity-90 transition-opacity">
                Ver Planes de Actualización
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Plan Comparison */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Plan</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Inquilinos</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Almacenamiento</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Builds/mes</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Precio</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(planLimits).map(([key, plan]) => (
              <tr key={key} className={`border-b border-[var(--glass-border)] ${selectedPlan === key ? 'bg-[var(--nexus-gold)]/5' : ''}`}>
                <td className="py-3 px-4">
                  <span className="font-medium text-[var(--text-primary)]">{plan.name}</span>
                  {selectedPlan === key && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs bg-[var(--nexus-gold)] text-[var(--obsidian)]">Actual</span>
                  )}
                </td>
                <td className="text-center py-3 px-4 text-[var(--text-mid)]">{plan.tenants}</td>
                <td className="text-center py-3 px-4 text-[var(--text-mid)]">{plan.storage}</td>
                <td className="text-center py-3 px-4 text-[var(--text-mid)]">{plan.builds}</td>
                <td className="text-center py-3 px-4 font-medium" style={{ color: plan.color }}>{plan.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { CapacityMetrics };
