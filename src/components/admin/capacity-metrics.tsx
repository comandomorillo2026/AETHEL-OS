'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Database, 
  HardDrive, 
  Globe, 
  Users, 
  Server,
  TrendingUp,
  TrendingDown,
  ChefHat,
  Stethoscope,
  UtensilsCrossed,
  Wine,
  Scissors,
  Scale,
  Pill,
  Building2,
  DollarSign,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';

// ============================================
// TIPOS Y DATOS
// ============================================
interface IndustryCapacity {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  maxTenants: number;
  dbPerTenant: number; // MB por empresa/mes
  bandwidthPerTenant: number; // GB por empresa/mes
  apiCallsPerTenant: number; // por mes
  pricePerTenant: number; // TT$/mes promedio
}

interface PlatformLimits {
  name: string;
  storage: number; // MB
  bandwidth: number; // GB
  apiCalls: number;
  realtimeConnections: number;
  price: string;
}

// ============================================
// DATOS REALES DE CAPACIDAD
// ============================================
const INDUSTRIES_CAPACITY: IndustryCapacity[] = [
  {
    id: 'bakery',
    name: 'Pastelerías',
    icon: ChefHat,
    color: '#F97316',
    maxTenants: 35,
    dbPerTenant: 8,
    bandwidthPerTenant: 2.4,
    apiCallsPerTenant: 75000,
    pricePerTenant: 900
  },
  {
    id: 'clinic',
    name: 'Clínicas',
    icon: Stethoscope,
    color: '#22D3EE',
    maxTenants: 20,
    dbPerTenant: 15,
    bandwidthPerTenant: 3.6,
    apiCallsPerTenant: 150000,
    pricePerTenant: 2200
  },
  {
    id: 'restaurant',
    name: 'Restaurantes',
    icon: UtensilsCrossed,
    color: '#EF4444',
    maxTenants: 22,
    dbPerTenant: 12,
    bandwidthPerTenant: 5.4,
    apiCallsPerTenant: 240000,
    pricePerTenant: 1300
  },
  {
    id: 'bar',
    name: 'Bares',
    icon: Wine,
    color: '#8B5CF6',
    maxTenants: 25,
    dbPerTenant: 10,
    bandwidthPerTenant: 3,
    apiCallsPerTenant: 300000,
    pricePerTenant: 1100
  },
  {
    id: 'beauty',
    name: 'Salones Belleza',
    icon: Scissors,
    color: '#EC4899',
    maxTenants: 40,
    dbPerTenant: 6,
    bandwidthPerTenant: 1.5,
    apiCallsPerTenant: 60000,
    pricePerTenant: 1100
  },
  {
    id: 'lawfirm',
    name: 'Bufetes',
    icon: Scale,
    color: '#C4A35A',
    maxTenants: 45,
    dbPerTenant: 10,
    bandwidthPerTenant: 1.2,
    apiCallsPerTenant: 30000,
    pricePerTenant: 2800
  },
  {
    id: 'pharmacy',
    name: 'Farmacias',
    icon: Pill,
    color: '#10B981',
    maxTenants: 15,
    dbPerTenant: 20,
    bandwidthPerTenant: 4.5,
    apiCallsPerTenant: 210000,
    pricePerTenant: 3200
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: Building2,
    color: '#3B82F6',
    maxTenants: 30,
    dbPerTenant: 8,
    bandwidthPerTenant: 2,
    apiCallsPerTenant: 80000,
    pricePerTenant: 1300
  }
];

const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  free: {
    name: 'Free Tier',
    storage: 500, // MB
    bandwidth: 100, // GB (Vercel)
    apiCalls: 500000, // Supabase Edge Functions
    realtimeConnections: 200,
    price: '$0/mes'
  },
  pro: {
    name: 'Pro Tier',
    storage: 8000, // MB
    bandwidth: 1000, // GB
    apiCalls: 2000000,
    realtimeConnections: 2000,
    price: '$25/mes'
  },
  enterprise: {
    name: 'Enterprise',
    storage: 100000, // MB
    bandwidth: 10000, // GB
    apiCalls: 100000000,
    realtimeConnections: 10000,
    price: 'Custom'
  }
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function CapacityMetrics() {
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [currentUsage, setCurrentUsage] = useState({
    tenants: 0,
    storage: 0,
    bandwidth: 0,
    revenue: 0
  });

  // Simulated tenant distribution (en producción vendría de API)
  const [tenantDistribution, setTenantDistribution] = useState<Record<string, number>>({
    bakery: 5,
    clinic: 3,
    restaurant: 4,
    bar: 3,
    beauty: 5,
    lawfirm: 3,
    pharmacy: 2,
    retail: 0
  });

  // Calculate current usage based on distribution
  useEffect(() => {
    let totalTenants = 0;
    let totalStorage = 0;
    let totalBandwidth = 0;
    let totalRevenue = 0;

    INDUSTRIES_CAPACITY.forEach(industry => {
      const count = tenantDistribution[industry.id] || 0;
      totalTenants += count;
      totalStorage += count * industry.dbPerTenant;
      totalBandwidth += count * industry.bandwidthPerTenant;
      totalRevenue += count * industry.pricePerTenant;
    });

    setCurrentUsage({
      tenants: totalTenants,
      storage: totalStorage,
      bandwidth: totalBandwidth,
      revenue: totalRevenue
    });
  }, [tenantDistribution]);

  const limits = PLATFORM_LIMITS[selectedTier];

  const getUsagePercent = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'var(--error)';
    if (percent >= 70) return 'var(--nexus-gold)';
    return 'var(--success)';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[var(--nexus-gold)]" />
            Torre de Control - Capacidad
          </h3>
          <p className="text-sm text-[var(--text-mid)]">
            Monitoreo en tiempo real de recursos y límites
          </p>
        </div>
        
        {/* Tier Selector */}
        <div className="flex gap-2">
          {(['free', 'pro', 'enterprise'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTier === tier 
                  ? 'bg-[var(--nexus-gold)] text-[var(--obsidian)]' 
                  : 'bg-[var(--glass)] text-[var(--text-mid)] hover:text-[var(--text-primary)]'
              }`}
            >
              {PLATFORM_LIMITS[tier].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tenants */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#6C3FCE]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#6C3FCE]" />
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[var(--glass)] text-[var(--text-dim)]">
              Inquilinos
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{currentUsage.tenants}</span>
            <span className="text-sm text-[var(--text-dim)]">
              / {selectedTier === 'free' ? '30' : selectedTier === 'pro' ? '200' : '∞'}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${selectedTier === 'enterprise' ? 10 : getUsagePercent(currentUsage.tenants, selectedTier === 'free' ? 30 : 200)}%`,
                backgroundColor: getStatusColor(getUsagePercent(currentUsage.tenants, selectedTier === 'free' ? 30 : 200))
              }}
            />
          </div>
        </div>

        {/* Storage */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#22D3EE]/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[var(--glass)] text-[var(--text-dim)]">
              Storage DB
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{currentUsage.storage}</span>
            <span className="text-sm text-[var(--text-dim)]">
              / {limits.storage} MB
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${getUsagePercent(currentUsage.storage, limits.storage)}%`,
                backgroundColor: getStatusColor(getUsagePercent(currentUsage.storage, limits.storage))
              }}
            />
          </div>
        </div>

        {/* Bandwidth */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#34D399]/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#34D399]" />
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[var(--glass)] text-[var(--text-dim)]">
              Ancho de Banda
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{currentUsage.bandwidth.toFixed(1)}</span>
            <span className="text-sm text-[var(--text-dim)]">
              / {limits.bandwidth} GB
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
            <div 
              className="h-full rounded-full bg-[var(--success)] transition-all"
              style={{ width: `${getUsagePercent(currentUsage.bandwidth, limits.bandwidth)}%` }}
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--nexus-gold)]/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[var(--nexus-gold)]" />
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[var(--glass)] text-[var(--text-dim)]">
              Ingresos/mes
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-[var(--nexus-gold)]">TT$</span>
            <span className="text-3xl font-bold text-[var(--text-primary)]">{currentUsage.revenue.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[var(--success)] text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{(currentUsage.revenue * 0.15).toFixed(0)} potencial</span>
          </div>
        </div>
      </div>

      {/* Industry Distribution */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Distribución por Industria
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INDUSTRIES_CAPACITY.map((industry) => {
            const IconComponent = industry.icon;
            const count = tenantDistribution[industry.id] || 0;
            const utilizationPercent = (count / industry.maxTenants) * 100;
            
            return (
              <div 
                key={industry.id}
                className="p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${industry.color}20` }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: industry.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{industry.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">Max: {industry.maxTenants}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-[var(--text-primary)]">{count}</span>
                  <span className="text-xs text-[var(--text-dim)]">
                    TT${(count * industry.pricePerTenant).toLocaleString()}/mes
                  </span>
                </div>
                
                <div className="h-1.5 rounded-full bg-[var(--glass)] overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${utilizationPercent}%`,
                      backgroundColor: industry.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capacity Warnings */}
      {selectedTier === 'free' && currentUsage.storage > 350 && (
        <div className="p-4 rounded-lg bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--nexus-gold)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[var(--text-primary)]">Acercándose al límite de almacenamiento</p>
              <p className="text-sm text-[var(--text-mid)]">
                Estás usando {currentUsage.storage}MB de 500MB. Considera actualizar a Supabase Pro ($25/mes) 
                para obtener 8GB de almacenamiento y evitar interrupciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Summary Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--glass-border)]">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            Capacidad Máxima por Industria
          </h4>
          <p className="text-sm text-[var(--text-mid)]">
            Cuántas empresas pueden operar en el tier {limits.name}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--glass)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Industria</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">DB/empresa</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">BW/empresa</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">API/empresa</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Max {limits.name}</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-mid)]">Precio/mes</th>
              </tr>
            </thead>
            <tbody>
              {INDUSTRIES_CAPACITY.map((industry, index) => (
                <tr 
                  key={industry.id}
                  className={`border-b border-[var(--glass-border)] ${index % 2 === 0 ? 'bg-[var(--obsidian-3)]' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <industry.icon className="w-4 h-4" style={{ color: industry.color }} />
                      <span className="text-[var(--text-primary)]">{industry.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--text-mid)]">{industry.dbPerTenant} MB</td>
                  <td className="text-center py-3 px-4 text-[var(--text-mid)]">{industry.bandwidthPerTenant} GB</td>
                  <td className="text-center py-3 px-4 text-[var(--text-mid)]">{(industry.apiCallsPerTenant / 1000).toFixed(0)}K</td>
                  <td className="text-center py-3 px-4">
                    <span className="font-medium" style={{ color: industry.color }}>
                      {selectedTier === 'free' ? industry.maxTenants : selectedTier === 'pro' ? Math.floor(industry.maxTenants * 6) : '∞'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--nexus-gold)]">
                    TT${industry.pricePerTenant.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimal Distribution */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-[var(--nexus-gold)]" />
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            Distribución Óptima Recomendada
          </h4>
        </div>
        <p className="text-sm text-[var(--text-mid)] mb-4">
          Combinación sugerida para maximizar ingresos en tier gratuito (25 empresas, ~TT$40,000/mes)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
          {INDUSTRIES_CAPACITY.slice(0, 7).map((industry) => {
            const optimal = {
              bakery: 5,
              clinic: 3,
              restaurant: 4,
              bar: 3,
              beauty: 5,
              lawfirm: 3,
              pharmacy: 2
            }[industry.id] || 0;
            
            return (
              <div key={industry.id} className="p-3 rounded-lg bg-[var(--glass)]">
                <industry.icon className="w-4 h-4 mx-auto mb-1" style={{ color: industry.color }} />
                <p className="text-lg font-bold text-[var(--text-primary)]">{optimal}</p>
                <p className="text-xs text-[var(--text-dim)]">{industry.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { CapacityMetrics, INDUSTRIES_CAPACITY, PLATFORM_LIMITS };
