'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Database,
  HardDrive,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  RefreshCw,
  ExternalLink,
  Shield,
  Server
} from 'lucide-react';

interface DatabaseMetrics {
  storageUsed: number;
  storageLimit: number;
  computeUsed: number;
  computeLimit: number;
  tenants: number;
  users: number;
  records: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Simulated metrics - in production, these would come from actual database queries
const getEstimatedMetrics = (tenants: number): DatabaseMetrics => {
  // Based on calculations: ~7.5MB per tenant average
  const storagePerTenant = 7.5; // MB
  const storageUsed = tenants * storagePerTenant;
  
  // Compute: ~0.05 hours per tenant per month
  const computePerTenant = 0.05;
  const computeUsed = tenants * computePerTenant;
  
  // Users: ~4 per tenant
  const users = tenants * 4;
  
  // Records: ~5000 per tenant (clients, appointments, invoices, etc.)
  const records = tenants * 5000;
  
  // Determine status
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (storageUsed > 400) status = 'warning';
  if (storageUsed > 480) status = 'critical';
  
  return {
    storageUsed,
    storageLimit: 512, // Neon free tier
    computeUsed,
    computeLimit: 191, // Neon free tier hours
    tenants,
    users,
    records,
    status
  };
};

const projections = [
  { year: 1, tenants: 10, storage: 75, cost: 0 },
  { year: 2, tenants: 25, storage: 187, cost: 0 },
  { year: 3, tenants: 50, storage: 375, cost: 0 },
  { year: 4, tenants: 80, storage: 600, cost: 19 },
  { year: 5, tenants: 100, storage: 750, cost: 19 },
];

export function DatabaseMonitor() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProjections, setShowProjections] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const data = await response.json();
        // Estimate tenants from metrics
        const tenantCount = data.tenants || 1;
        setMetrics(getEstimatedMetrics(tenantCount));
      } else {
        // Default for demo
        setMetrics(getEstimatedMetrics(1));
      }
    } catch {
      setMetrics(getEstimatedMetrics(1));
    }
    setLoading(false);
  };

  const getStoragePercentage = () => {
    if (!metrics) return 0;
    return Math.min((metrics.storageUsed / metrics.storageLimit) * 100, 100);
  };

  const getComputePercentage = () => {
    if (!metrics) return 0;
    return Math.min((metrics.computeUsed / metrics.computeLimit) * 100, 100);
  };

  const getStatusColor = () => {
    if (!metrics) return 'text-gray-400';
    switch (metrics.status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
    }
  };

  const getStatusBg = () => {
    if (!metrics) return 'bg-gray-500/10 border-gray-500/30';
    switch (metrics.status) {
      case 'healthy': return 'bg-green-500/10 border-green-500/30';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'critical': return 'bg-red-500/10 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Database className="w-6 h-6" />
            Base de Datos
          </h2>
          <p className="text-[var(--text-mid)] text-sm mt-1">
            Monitoreo de Neon PostgreSQL
          </p>
        </div>
        <Button
          onClick={fetchMetrics}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Status Banner */}
      {metrics && (
        <Card className={`p-4 ${getStatusBg()}`}>
          <div className="flex items-center gap-3">
            {metrics.status === 'healthy' && <CheckCircle className="w-6 h-6 text-green-400" />}
            {metrics.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-400" />}
            {metrics.status === 'critical' && <AlertTriangle className="w-6 h-6 text-red-400" />}
            <div>
              <p className={`font-semibold ${getStatusColor()}`}>
                {metrics.status === 'healthy' && 'Sistema Saludable'}
                {metrics.status === 'warning' && 'Atención: Almacenamiento elevado'}
                {metrics.status === 'critical' && 'Crítico: Almacenamiento casi lleno'}
              </p>
              <p className="text-sm text-[var(--text-mid)]">
                Plan actual: Neon Gratis (512 MB, 191 horas/mes)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Storage */}
        <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-mid)]">Almacenamiento</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {metrics ? `${metrics.storageUsed.toFixed(1)} MB` : '--'}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all ${
                getStoragePercentage() > 80 ? 'bg-red-500' : 
                getStoragePercentage() > 60 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${getStoragePercentage()}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            de 512 MB ({getStoragePercentage().toFixed(1)}%)
          </p>
        </Card>

        {/* Compute */}
        <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-mid)]">Compute Hours</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {metrics ? `${metrics.computeUsed.toFixed(1)} h` : '--'}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="h-2 rounded-full bg-purple-500 transition-all"
              style={{ width: `${getComputePercentage()}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-dim)]">
            de 191 h/mes ({getComputePercentage().toFixed(1)}%)
          </p>
        </Card>

        {/* Tenants */}
        <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-mid)]">Negocios Activos</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {metrics?.tenants ?? '--'}
              </p>
            </div>
          </div>
        </Card>

        {/* Users */}
        <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-mid)]">Total Usuarios</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {metrics?.users ?? '--'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upgrade Warning */}
      {metrics && metrics.storageUsed > 350 && (
        <Card className="p-4 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-400">Tiempo de Actualización Acercándose</p>
              <p className="text-sm text-[var(--text-mid)] mt-1">
                Con el crecimiento actual, necesitarás actualizar a Neon Pro ($19/mes) 
                cuando alcances ~80-100 negocios activos.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Projections Toggle */}
      <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
        <button
          onClick={() => setShowProjections(!showProjections)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
            <span className="font-semibold text-[var(--text-primary)]">
              Proyección de Crecimiento
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {showProjections ? 'Ocultar' : 'Mostrar'}
          </Badge>
        </button>

        {showProjections && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="text-left py-2 text-[var(--text-mid)]">Año</th>
                  <th className="text-left py-2 text-[var(--text-mid)]">Negocios</th>
                  <th className="text-left py-2 text-[var(--text-mid)]">Almacenamiento</th>
                  <th className="text-left py-2 text-[var(--text-mid)]">Plan</th>
                  <th className="text-right py-2 text-[var(--text-mid)]">Costo/mes</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p) => (
                  <tr key={p.year} className="border-b border-[var(--glass-border)]/50">
                    <td className="py-2 text-[var(--text-primary)]">Año {p.year}</td>
                    <td className="py-2 text-[var(--text-primary)]">{p.tenants}</td>
                    <td className="py-2 text-[var(--text-primary)]">
                      {p.storage} MB
                      {p.storage > 512 && (
                        <Badge className="ml-2 bg-yellow-500/20 text-yellow-400 text-xs">
                          Excede gratis
                        </Badge>
                      )}
                    </td>
                    <td className="py-2">
                      <Badge className={p.cost === 0 ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}>
                        {p.cost === 0 ? 'Gratis' : 'Pro'}
                      </Badge>
                    </td>
                    <td className="py-2 text-right text-[var(--text-primary)]">
                      {p.cost === 0 ? (
                        <span className="text-green-400">$0</span>
                      ) : (
                        <span className="text-yellow-400">${p.cost}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Security Status */}
      <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
          Nivel de Seguridad Actual
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'HTTPS/SSL', status: true },
            { name: 'bcrypt Hashing', status: true },
            { name: 'NextAuth JWT', status: true },
            { name: 'Role Control', status: true },
            { name: 'Tenant Isolation', status: true },
            { name: 'Activity Logs', status: true },
            { name: '2FA', status: false },
            { name: 'SOC2/HIPAA', status: false },
          ].map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                item.status ? 'bg-green-500/10' : 'bg-gray-500/10'
              }`}
            >
              {item.status ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-500" />
              )}
              <span className={`text-xs ${item.status ? 'text-green-400' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-[var(--nexus-violet)]/10 border border-[var(--nexus-violet)]/30">
          <p className="text-sm text-[var(--text-mid)]">
            <strong className="text-[var(--text-primary)]">Nivel Actual:</strong> Avanzado (3/5)
            <br />
            <span className="text-xs">Apto para: PYMES, clínicas privadas, despachos, retail</span>
          </p>
        </div>
      </Card>

      {/* Sales Pitch - Security Info */}
      <Card className="p-4 bg-[var(--glass)] border-[var(--glass-border)]">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[var(--nexus-gold)]" />
          Motor de Seguridad - Información para Ventas
        </h3>
        <div className="p-4 rounded-lg bg-[#0A0820] border border-[var(--nexus-gold)]/20 mb-4">
          <p className="text-sm text-[var(--text-primary)] mb-3">
            NexusOS usa la misma tecnología que empresas como <strong className="text-[var(--nexus-gold)]">Vercel, Netflix</strong> y plataformas financieras:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <strong className="text-green-400">Encriptación SSL</strong> - datos en tránsito protegidos
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <strong className="text-green-400">Contraseñas hasheadas</strong> - nunca visibles, irreversibles
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <strong className="text-green-400">Aislamiento de datos</strong> - cada negocio es privado
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <strong className="text-green-400">Auditoría completa</strong> - sabes quién hace qué
            </li>
            <li className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <strong className="text-green-400">Backups automáticos</strong> - nunca pierdes datos
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30">
            <p className="text-xs text-[#22D3EE] font-medium mb-1">GDPR Compatible</p>
            <p className="text-xs text-[var(--text-dim)]">Ley de Protección de Datos</p>
          </div>
          <div className="p-3 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30">
            <p className="text-xs text-[#34D399] font-medium mb-1">Clínicas Privadas</p>
            <p className="text-xs text-[var(--text-dim)]">Normativas médicas</p>
          </div>
          <div className="p-3 rounded-lg bg-[#C4A35A]/10 border border-[#C4A35A]/30">
            <p className="text-xs text-[#C4A35A] font-medium mb-1">Confidencialidad Legal</p>
            <p className="text-xs text-[var(--text-dim)]">Bufetes y despachos</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="text-xs text-[var(--text-mid)]">
            <strong className="text-green-400">✓ Mercado Actual:</strong> PYMES, clínicas privadas, spas, panaderías, retail, despachos de abogados, farmacias
          </p>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => window.open('https://console.neon.tech', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir Neon Console
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowProjections(!showProjections)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Ver Proyecciones
        </Button>
      </div>
    </div>
  );
}
