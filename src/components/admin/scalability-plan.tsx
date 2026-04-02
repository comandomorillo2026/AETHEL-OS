'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Server,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Zap,
  HardDrive,
  Globe,
  GitBranch,
  RefreshCw,
  Bell,
  TrendingUp,
  AlertCircle,
  Info,
  ChevronRight,
  Building2,
  Users,
  DollarSign,
  Settings
} from 'lucide-react';

// ============================================
// SCALABILITY PLAN - Plan de Escalabilidad
// ============================================

interface ScalabilityPhase {
  etapa: string;
  inquilinos: string;
  infraestructura: string;
  costo: string;
  accion: string;
  status: 'active' | 'available' | 'locked';
}

const scalabilityPhases: ScalabilityPhase[] = [
  {
    etapa: 'Actual',
    inquilinos: '1-50',
    infraestructura: 'Vercel Hobby + SQLite',
    costo: '$0',
    accion: 'Activo',
    status: 'active'
  },
  {
    etapa: 'Fase 1',
    inquilinos: '50-100',
    infraestructura: 'Vercel Pro + PostgreSQL',
    costo: '$20',
    accion: 'Upgrade manual',
    status: 'available'
  },
  {
    etapa: 'Fase 2',
    inquilinos: '100-300',
    infraestructura: 'Vercel Pro + PostgreSQL Pro',
    costo: '$50',
    accion: 'Upgrade manual',
    status: 'available'
  },
  {
    etapa: 'Fase 3+',
    inquilinos: '300+',
    infraestructura: 'Vercel Team + DB Dedicada',
    costo: '$100+',
    accion: 'Contactar soporte',
    status: 'locked'
  }
];

const warningSigns = [
  {
    icon: Clock,
    title: 'Cargas de página lentas',
    description: 'Tiempo de respuesta > 3 segundos',
    severity: 'warning'
  },
  {
    icon: AlertTriangle,
    title: 'Timeouts en API',
    description: 'Peticiones fallidas por timeout',
    severity: 'critical'
  },
  {
    icon: RefreshCw,
    title: 'Fallos en builds',
    description: 'Deployments fallidos recurrentes',
    severity: 'warning'
  },
  {
    icon: Database,
    title: 'Advertencias de tamaño DB',
    description: 'Base de datos cerca del límite',
    severity: 'critical'
  },
  {
    icon: Users,
    title: 'Límite de usuarios concurrentes',
    description: 'Usuarios reportan problemas de acceso',
    severity: 'warning'
  },
  {
    icon: Zap,
    title: 'Funciones serverless agotadas',
    description: 'Límite de invocaciones excedido',
    severity: 'critical'
  }
];

const infrastructureDetails = {
  vercel: [
    {
      tier: 'Hobby (Free)',
      features: ['100GB bandwidth', '100 builds/día', '1 concurrent build', 'Serverless Functions: 12s timeout'],
      limitations: ['Sin SLA', 'Sin dominios custom', 'Cola en builds']
    },
    {
      tier: 'Pro ($20/mes)',
      features: ['1TB bandwidth', 'Unlimited team members', 'Analíticas avanzadas', 'Priority support'],
      limitations: ['5 concurrent builds', 'Funciones 60s timeout']
    },
    {
      tier: 'Team ($100+/mes)',
      features: ['Dedicated resources', 'SLA garantizado', 'SSO/SAML', 'Advanced security'],
      limitations: ['Requiere contacto comercial']
    }
  ],
  database: [
    {
      type: 'SQLite (Actual)',
      features: ['Archivo local', 'Sin configuración', 'Ideal para desarrollo', 'Rápido para reads'],
      limitations: ['No escalable', 'Límite ~1GB', 'Una conexión escritura', 'No suitable for high traffic']
    },
    {
      type: 'PostgreSQL',
      features: ['Escalabilidad horizontal', 'Múltiples conexiones', 'ACID compliance', 'Advanced indexing'],
      limitations: ['Requiere migración', 'Costo adicional', 'Configuración inicial']
    }
  ],
  github: [
    {
      aspect: 'Repositorio',
      details: 'Se mantiene igual en todos los planes'
    },
    {
      aspect: 'CI/CD',
      details: 'GitHub Actions funcionan igual en todos los tiers'
    },
    {
      aspect: 'Integración',
      details: 'Vercel se conecta automáticamente a GitHub'
    }
  ]
};

export function ScalabilityPlan() {
  const [activeTab, setActiveTab] = useState<'phases' | 'infrastructure' | 'warnings'>('phases');
  const [isChecking, setIsChecking] = useState(false);
  const [showAlertConfig, setShowAlertConfig] = useState(false);

  // Simulated current status
  const currentStatus = {
    tier: 'Hobby (Free)',
    tierType: 'free' as 'free' | 'pro' | 'enterprise',
    tenants: 23,
    maxTenants: 50,
    storageUsed: '320MB',
    storageMax: '500MB',
    daysUntilUpgrade: 45,
    usagePercent: 46
  };

  const handleCheckCapacity = async () => {
    setIsChecking(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsChecking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'available':
        return 'text-[var(--nexus-gold)] bg-[var(--nexus-gold)]/10';
      case 'locked':
        return 'text-[var(--text-dim)] bg-[var(--glass)]';
      default:
        return 'text-[var(--text-mid)]';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-[var(--error)] bg-[var(--error)]/5';
      case 'warning':
        return 'border-[var(--nexus-gold)] bg-[var(--nexus-gold)]/5';
      default:
        return 'border-[var(--glass-border)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--nexus-gold)] to-[#C4A35A] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-[var(--obsidian)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Plan de Escalabilidad</h2>
            <p className="text-[var(--text-mid)] mt-1">
              Guía de crecimiento para NexusOS. Planifica la infraestructura necesaria a medida que tu plataforma escala.
            </p>
          </div>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-[var(--success)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Estado Actual</h3>
            <p className="text-sm text-[var(--text-dim)]">Tu posición en el plan de escalabilidad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Tier */}
          <div className="p-4 rounded-xl bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-[var(--nexus-gold)]" />
              <span className="text-xs text-[var(--text-mid)]">Tier Actual</span>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)]">{currentStatus.tier}</p>
            <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-[var(--success)]/10 text-[var(--success)]">
              Activo
            </span>
          </div>

          {/* Usage */}
          <div className="p-4 rounded-xl bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[var(--nexus-gold)]" />
              <span className="text-xs text-[var(--text-mid)]">Uso Actual</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-[var(--text-primary)]">{currentStatus.tenants}</p>
              <span className="text-sm text-[var(--text-dim)]">/ {currentStatus.maxTenants} inquilinos</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[var(--success)] to-[var(--nexus-gold)]"
                style={{ width: `${currentStatus.usagePercent}%` }}
              />
            </div>
          </div>

          {/* Storage */}
          <div className="p-4 rounded-xl bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-[var(--nexus-gold)]" />
              <span className="text-xs text-[var(--text-mid)]">Almacenamiento</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-[var(--text-primary)]">{currentStatus.storageUsed}</p>
              <span className="text-sm text-[var(--text-dim)]">/ {currentStatus.storageMax}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--glass)] overflow-hidden">
              <div 
                className="h-full rounded-full bg-[var(--success)]"
                style={{ width: '64%' }}
              />
            </div>
          </div>

          {/* Days Until Upgrade */}
          <div className="p-4 rounded-xl bg-[var(--nexus-gold)]/5 border border-[var(--nexus-gold)]/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[var(--nexus-gold)]" />
              <span className="text-xs text-[var(--text-mid)]">Próxima Evaluación</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-[var(--nexus-gold)]">{currentStatus.daysUntilUpgrade}</p>
              <span className="text-sm text-[var(--text-dim)]">días</span>
            </div>
            <p className="text-xs text-[var(--text-dim)] mt-1">Recomendación de upgrade</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-[var(--glass-border)] pb-2">
        {[
          { id: 'phases', label: 'Fases de Escalabilidad', icon: TrendingUp },
          { id: 'infrastructure', label: 'Infraestructura', icon: Server },
          { id: 'warnings', label: 'Señales de Alerta', icon: AlertTriangle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)] border-b-2 border-[var(--nexus-gold)]'
                : 'text-[var(--text-mid)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card overflow-hidden">
        {activeTab === 'phases' && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Tabla de Fases</h3>
              <p className="text-sm text-[var(--text-dim)]">Plan de crecimiento escalonado</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] bg-[var(--glass)]">
                    <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Etapa</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Inquilinos</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Infraestructura</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Costo/mes</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Acción</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-[var(--text-mid)]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {scalabilityPhases.map((phase, index) => (
                    <tr 
                      key={phase.etapa}
                      className={`border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--glass)] transition-colors ${
                        phase.status === 'active' ? 'bg-[var(--success)]/5' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            phase.status === 'active' 
                              ? 'bg-[var(--success)]/10' 
                              : phase.status === 'available'
                              ? 'bg-[var(--nexus-gold)]/10'
                              : 'bg-[var(--glass)]'
                          }`}>
                            {phase.status === 'active' ? (
                              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                            ) : (
                              <span className="text-xs font-medium text-[var(--text-mid)]">{index + 1}</span>
                            )}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">{phase.etapa}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-[var(--text-primary)]">{phase.inquilinos}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[var(--text-mid)]">{phase.infraestructura}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${
                          phase.costo === '$0' ? 'text-[var(--success)]' : 'text-[var(--nexus-gold)]'
                        }`}>
                          {phase.costo}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[var(--text-mid)]">{phase.accion}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                          {phase.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {phase.status === 'available' && <ArrowUpRight className="w-3 h-3" />}
                          {phase.status === 'locked' && <Info className="w-3 h-3" />}
                          {phase.status === 'active' ? 'Activo' : phase.status === 'available' ? 'Disponible' : 'Bloqueado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="p-6 space-y-8">
            {/* Vercel Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#000000] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">Vercel</h4>
                  <p className="text-sm text-[var(--text-dim)]">Plataforma de deployment y hosting</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {infrastructureDetails.vercel.map((tier) => (
                  <div 
                    key={tier.tier}
                    className="p-4 rounded-xl bg-[var(--obsidian-3)] border border-[var(--glass-border)]"
                  >
                    <h5 className="font-semibold text-[var(--text-primary)] mb-3">{tier.tier}</h5>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[var(--text-dim)] mb-1">Características</p>
                        <ul className="space-y-1">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                              <CheckCircle className="w-3 h-3 text-[var(--success)] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-dim)] mb-1">Limitaciones</p>
                        <ul className="space-y-1">
                          {tier.limitations.map((lim, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
                              <AlertCircle className="w-3 h-3 text-[var(--nexus-gold)] flex-shrink-0" />
                              {lim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#336791] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">Base de Datos</h4>
                  <p className="text-sm text-[var(--text-dim)]">SQLite vs PostgreSQL - Diferencias clave</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infrastructureDetails.database.map((db) => (
                  <div 
                    key={db.type}
                    className={`p-4 rounded-xl border ${
                      db.type.includes('Actual') 
                        ? 'bg-[var(--success)]/5 border-[var(--success)]/20' 
                        : 'bg-[var(--obsidian-3)] border-[var(--glass-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-[var(--text-primary)]">{db.type}</h5>
                      {db.type.includes('Actual') && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--success)]/10 text-[var(--success)]">
                          Actual
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[var(--text-dim)] mb-1">Ventajas</p>
                        <ul className="space-y-1">
                          {db.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                              <CheckCircle className="w-3 h-3 text-[var(--success)] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-dim)] mb-1">Limitaciones</p>
                        <ul className="space-y-1">
                          {db.limitations.map((lim, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
                              <AlertCircle className="w-3 h-3 text-[var(--nexus-gold)] flex-shrink-0" />
                              {lim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#24292e] flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text-primary)]">GitHub</h4>
                  <p className="text-sm text-[var(--text-dim)]">Lo que permanece igual en todos los planes</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {infrastructureDetails.github.map((item) => (
                    <div key={item.aspect} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--glass)] flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{item.aspect}</p>
                        <p className="text-sm text-[var(--text-mid)]">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Señales de Alerta</h3>
              <p className="text-sm text-[var(--text-dim)]">Síntomas que indican necesidad de upgrade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warningSigns.map((warning, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${getSeverityColor(warning.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      warning.severity === 'critical' 
                        ? 'bg-[var(--error)]/10' 
                        : 'bg-[var(--nexus-gold)]/10'
                    }`}>
                      <warning.icon className={`w-5 h-5 ${
                        warning.severity === 'critical' 
                          ? 'text-[var(--error)]' 
                          : 'text-[var(--nexus-gold)]'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[var(--text-primary)]">{warning.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          warning.severity === 'critical' 
                            ? 'bg-[var(--error)]/10 text-[var(--error)]' 
                            : 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]'
                        }`}>
                          {warning.severity === 'critical' ? 'Crítico' : 'Advertencia'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-mid)] mt-1">{warning.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[var(--nexus-gold)]/5 border border-[var(--nexus-gold)]/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[var(--nexus-gold)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">¿Cuándo actuar?</p>
                  <p className="text-sm text-[var(--text-mid)] mt-1">
                    Si experimentas 2 o más de estas señales, es momento de considerar un upgrade a la siguiente fase.
                    Nuestro sistema de monitoreo te notificará automáticamente cuando detectemos patrones de degradación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={handleCheckCapacity}
          disabled={isChecking}
          className="btn-gold"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Server className="w-4 h-4 mr-2" />
              Verificar Capacidad Actual
            </>
          )}
        </Button>

        <Button 
          onClick={() => setShowAlertConfig(!showAlertConfig)}
          variant="outline"
          className="border-[var(--nexus-gold)]/30 text-[var(--nexus-gold)] hover:bg-[var(--nexus-gold)]/10"
        >
          <Bell className="w-4 h-4 mr-2" />
          Configurar Alertas
        </Button>
      </div>

      {/* Alert Configuration Panel */}
      {showAlertConfig && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Configuración de Alertas</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAlertConfig(false)}
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--nexus-gold)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Alerta de Capacidad</p>
                  <p className="text-sm text-[var(--text-dim)]">Notificar al alcanzar 80% de capacidad</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--glass)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--nexus-gold)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[var(--nexus-gold)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Alerta de Almacenamiento</p>
                  <p className="text-sm text-[var(--text-dim)]">Notificar al alcanzar 90% de almacenamiento</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--glass)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--nexus-gold)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--obsidian-3)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--nexus-gold)]" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Recordatorio de Upgrade</p>
                  <p className="text-sm text-[var(--text-dim)]">Recordatorio mensual para evaluar upgrade</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--glass)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--nexus-gold)]"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="btn-gold">
              <Settings className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScalabilityPlan;
