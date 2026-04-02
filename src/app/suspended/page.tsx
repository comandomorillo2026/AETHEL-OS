'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  AlertTriangle,
  Download,
  CreditCard,
  Clock,
  FileDown,
  FileArchive,
  CheckCircle,
  Loader2,
  ArrowRight,
  Shield,
  HelpCircle,
  Mail,
  Phone,
  Database,
  Calendar
} from 'lucide-react';

export default function SuspendedPage() {
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'ready' | 'downloaded'>('idle');
  const [graceDaysRemaining, setGraceDaysRemaining] = useState(30);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Simulate grace period countdown
  useEffect(() => {
    // In real app, fetch from API
    const graceEndDate = new Date();
    graceEndDate.setDate(graceEndDate.getDate() + 30);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = graceEndDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setGraceDaysRemaining(Math.max(0, days));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle data export
  const handleExport = async () => {
    setExportStatus('processing');
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setExportStatus('ready');
          setDownloadUrl('/api/export/data.zip'); // In real app, generate actual URL
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // Handle download
  const handleDownload = () => {
    if (downloadUrl) {
      // In real app, trigger actual download
      window.open(downloadUrl, '_blank');
      setExportStatus('downloaded');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--obsidian-1)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#EF4444]/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Cuenta Suspendida
          </h1>
          <p className="text-[var(--text-mid)] max-w-md mx-auto">
            Tu suscripción ha vencido y el período de gracia está activo. 
            Tienes tiempo limitado para exportar tus datos.
          </p>
        </div>

        {/* Grace Period Warning */}
        <div className="p-4 rounded-xl bg-[var(--nexus-gold)]/10 border border-[var(--nexus-gold)]/30 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[var(--nexus-gold)]" />
            <div>
              <p className="text-[var(--nexus-gold)] font-medium">
                Período de Gracia: {graceDaysRemaining} días restantes
              </p>
              <p className="text-sm text-[var(--text-mid)]">
                Después de este tiempo, tus datos podrían ser eliminados permanentemente.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Data Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-violet)]/20 flex items-center justify-center">
                <FileDown className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-semibold">Exportar Datos</h3>
                <p className="text-xs text-[var(--text-dim)]">Descarga todos tus datos</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-mid)] mb-4">
              Exporta toda tu información: clientes, productos, facturas, citas y más 
              en un archivo ZIP listo para descargar.
            </p>

            {/* Export Status */}
            {exportStatus === 'idle' && (
              <Button onClick={handleExport} className="w-full btn-nexus">
                <Download className="w-4 h-4 mr-2" />
                Iniciar Exportación
              </Button>
            )}

            {exportStatus === 'processing' && (
              <div className="space-y-3">
                <Progress value={exportProgress} className="h-2" />
                <p className="text-sm text-[var(--text-mid)] text-center">
                  <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                  Exportando... {exportProgress}%
                </p>
              </div>
            )}

            {exportStatus === 'ready' && (
              <Button onClick={handleDownload} className="w-full bg-[var(--success)] hover:bg-[var(--success)]/90 text-white">
                <FileArchive className="w-4 h-4 mr-2" />
                Descargar ZIP ({Math.floor(Math.random() * 50 + 10)} MB)
              </Button>
            )}

            {exportStatus === 'downloaded' && (
              <div className="flex items-center gap-2 text-[var(--success)] justify-center p-3 rounded-lg bg-[var(--success)]/10">
                <CheckCircle className="w-5 h-5" />
                <span>Archivo descargado</span>
              </div>
            )}

            {/* Export Contents */}
            <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
              <p className="text-xs text-[var(--text-dim)] mb-2">El archivo incluye:</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-[var(--text-mid)]">
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Clientes
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Productos
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Facturas
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Citas
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Inventario
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Reportes
                </div>
              </div>
            </div>
          </div>

          {/* Reactivate Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--nexus-gold)]/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[var(--nexus-gold)]" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-semibold">Reactivar Cuenta</h3>
                <p className="text-xs text-[var(--text-dim)]">Continúa usando NexusOS</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-mid)] mb-4">
              Reactiva tu cuenta ahora y recupera acceso inmediato a todas tus funciones.
              Tus datos están intactos y listos para usar.
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                Acceso inmediato
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                Datos preservados
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-mid)]">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                Sin cargo de reactivación
              </div>
            </div>

            <Link href="/checkout/reactivate">
              <Button className="w-full btn-gold">
                <CreditCard className="w-4 h-4 mr-2" />
                Reactivar Suscripción
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)]">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[var(--text-dim)] flex-shrink-0" />
            <div>
              <h4 className="text-[var(--text-primary)] font-medium mb-2">¿Necesitas ayuda?</h4>
              <p className="text-sm text-[var(--text-mid)] mb-3">
                Si tienes preguntas sobre tu cuenta o necesitas asistencia, 
                nuestro equipo de soporte está disponible.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="mailto:support@nexusos.tt" className="flex items-center gap-2 text-[var(--nexus-violet-lite)] hover:underline">
                  <Mail className="w-4 h-4" />
                  support@nexusos.tt
                </a>
                <a href="tel:+18685551234" className="flex items-center gap-2 text-[var(--nexus-violet-lite)] hover:underline">
                  <Phone className="w-4 h-4" />
                  +1 868-555-1234
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/terms" className="text-sm text-[var(--text-dim)] hover:text-[var(--text-mid)]">
            Términos y Condiciones
          </Link>
          <span className="mx-2 text-[var(--text-dim)]">•</span>
          <Link href="/portal" className="text-sm text-[var(--text-dim)] hover:text-[var(--text-mid)]">
            Portal de Ventas
          </Link>
        </div>
      </div>
    </div>
  );
}
