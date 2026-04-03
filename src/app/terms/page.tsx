'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Printer,
  Globe,
  Scale,
  Lock,
  Clock,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';

export default function TermsPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const canContinue = acceptedTerms && acceptedPrivacy;

  const t = {
    es: {
      title: 'Términos y Condiciones',
      subtitle: 'Por favor lee y acepta los términos para continuar',
      lastUpdated: 'Última actualización: 1 de Abril, 2026',
      acceptTerms: 'Acepto los Términos y Condiciones',
      acceptPrivacy: 'Acepto la Política de Privacidad',
      continue: 'Continuar al Registro',
      mustAccept: 'Debes aceptar ambos documentos para continuar',
      
      // Terms sections
      termsTitle: 'Términos y Condiciones de Uso',
      termsIntro: 'Bienvenido a NexusOS. Al acceder y utilizar esta plataforma, aceptas estar sujeto a los siguientes términos y condiciones.',
      
      section1Title: '1. Definiciones',
      section1Content: `
        • "Plataforma" se refiere a NexusOS, el sistema de gestión empresarial.
        • "Usuario" se refiere a cualquier persona que acceda o utilice la Plataforma.
        • "Inquilino" (Tenant) se refiere a la empresa o negocio registrado en la Plataforma.
        • "Plan" se refiere al nivel de suscripción contratado (Starter, Growth, Premium).
        • "Período de Prueba" (Trial) se refiere al tiempo de evaluación gratuita del servicio.
      `,
      
      section2Title: '2. Suscripción y Pagos',
      section2Content: `
        2.1. Los planes de suscripción se facturan según el ciclo seleccionado (mensual, anual o bienal).
        
        2.2. El período de prueba tiene una duración de 7 días calendario, expirando a las 12:00 AM del último día.
        
        2.3. Al finalizar el período de prueba sin activación de pago, el acceso será suspendido automáticamente.
        
        2.4. Los pagos se procesan a través de WiPay Caribbean y son seguros.
        
        2.5. No se realizan reembolsos parciales por cancelaciones anticipadas.
      `,
      
      section3Title: '3. Uso Aceptable',
      section3Content: `
        3.1. El Usuario se compromete a utilizar la Plataforma de manera legal y ética.
        
        3.2. Está prohibido:
        • Utilizar la Plataforma para actividades ilegales
        • Intentar acceder a datos de otros inquilinos
        • Compartir credenciales de acceso
        • Sobrecargar los servidores de la Plataforma
        
        3.3. NexusOS se reserva el derecho de suspender cuentas que violen estos términos.
      `,
      
      section4Title: '4. Datos y Privacidad',
      section4Content: `
        4.1. El Usuario es dueño de todos los datos que ingrese en la Plataforma.
        
        4.2. NexusOS no accede, vende ni comparte datos de los inquilinos.
        
        4.3. Al cancelar la suscripción, el Usuario tiene derecho a exportar sus datos durante un período de gracia de 30 días.
        
        4.4. Después del período de gracia, los datos pueden ser eliminados permanentemente.
      `,
      
      section5Title: '5. Limitación de Responsabilidad',
      section5Content: `
        5.1. NexusOS se esforza por mantener un servicio disponible 99.9% del tiempo.
        
        5.2. No nos hacemos responsables por pérdidas derivadas de:
        • Interrupciones por mantenimiento programado
        • Fuerza mayor (desastres naturales, huelgas, etc.)
        • Uso incorrecto de la Plataforma
        
        5.3. La responsabilidad máxima de NexusOS está limitada al valor pagado en los últimos 3 meses de suscripción.
      `,
      
      section6Title: '6. Propiedad Intelectual',
      section6Content: `
        6.1. NexusOS y sus componentes son propiedad de la empresa desarrolladora.
        
        6.2. El Usuario conserva los derechos sobre su contenido y datos.
        
        6.3. Al cancelar, el Usuario puede solicitar la eliminación de sus datos.
      `,
      
      section7Title: '7. Modificaciones',
      section7Content: `
        7.1. NexusOS puede modificar estos términos con 30 días de anticipación.
        
        7.2. Las modificaciones serán notificadas por correo electrónico.
        
        7.3. El uso continuado después de modificaciones constituye aceptación.
      `,
      
      section8Title: '8. Ley Aplicable',
      section8Content: `
        Estos términos se rigen por las leyes de Trinidad & Tobago.
        Cualquier disputa será resuelta en los tribunales de Puerto España.
      `,
      
      // Privacy sections
      privacyTitle: 'Política de Privacidad',
      privacyIntro: 'Tu privacidad es importante para nosotros. Esta política describe cómo recopilamos, usamos y protegemos tu información.',
      
      privacy1Title: '1. Información Recopilada',
      privacy1Content: `
        Recopilamos:
        • Información de registro (nombre, email, teléfono)
        • Información empresarial (nombre de negocio, industria)
        • Datos de uso (actividad en la plataforma)
        • Datos de pago (procesados por WiPay, no almacenamos números de tarjeta)
      `,
      
      privacy2Title: '2. Uso de la Información',
      privacy2Content: `
        Utilizamos tu información para:
        • Proveer y mejorar el servicio
        • Procesar pagos
        • Enviar notificaciones importantes
        • Generar reportes anónimos de uso
        • Soporte al cliente
      `,
      
      privacy3Title: '3. Compartición de Datos',
      privacy3Content: `
        No vendemos ni compartimos tus datos con terceros excepto:
        • Procesadores de pago (WiPay)
        • Cuando sea requerido por ley
        • Con tu consentimiento explícito
      `,
      
      privacy4Title: '4. Seguridad',
      privacy4Content: `
        Implementamos:
        • Encriptación SSL/TLS
        • Autenticación segura
        • Backups diarios
        • Auditorías de seguridad regulares
      `,
      
      privacy5Title: '5. Tus Derechos',
      privacy5Content: `
        Tienes derecho a:
        • Acceder a tus datos
        • Corregir datos incorrectos
        • Exportar tus datos
        • Solicitar eliminación de datos
        • Oponerte al procesamiento
        
        Ejerce estos derechos contactando a privacy@nexusos.tt
      `,
      
      // Contact
      contactTitle: 'Contacto',
      contactContent: 'Para preguntas sobre estos términos, contacta:',
      
      // Download
      downloadPdf: 'Descargar PDF',
      printVersion: 'Versión Imprimible',
    },
    en: {
      title: 'Terms and Conditions',
      subtitle: 'Please read and accept the terms to continue',
      lastUpdated: 'Last updated: April 1, 2026',
      acceptTerms: 'I accept the Terms and Conditions',
      acceptPrivacy: 'I accept the Privacy Policy',
      continue: 'Continue to Registration',
      mustAccept: 'You must accept both documents to continue',
      
      // Terms sections
      termsTitle: 'Terms and Conditions of Use',
      termsIntro: 'Welcome to NexusOS. By accessing and using this platform, you agree to be bound by the following terms and conditions.',
      
      section1Title: '1. Definitions',
      section1Content: `
        • "Platform" refers to NexusOS, the business management system.
        • "User" refers to any person who accesses or uses the Platform.
        • "Tenant" refers to the company or business registered on the Platform.
        • "Plan" refers to the subscription level contracted (Starter, Growth, Premium).
        • "Trial Period" refers to the free evaluation time of the service.
      `,
      
      section2Title: '2. Subscription and Payments',
      section2Content: `
        2.1. Subscription plans are billed according to the selected cycle (monthly, annual, or biannual).
        
        2.2. The trial period lasts 7 calendar days, expiring at 12:00 AM on the last day.
        
        2.3. Upon completion of the trial period without payment activation, access will be automatically suspended.
        
        2.4. Payments are processed through WiPay Caribbean and are secure.
        
        2.5. No partial refunds are made for early cancellations.
      `,
      
      section3Title: '3. Acceptable Use',
      section3Content: `
        3.1. The User agrees to use the Platform legally and ethically.
        
        3.2. It is prohibited to:
        • Use the Platform for illegal activities
        • Attempt to access data from other tenants
        • Share access credentials
        • Overload Platform servers
        
        3.3. NexusOS reserves the right to suspend accounts that violate these terms.
      `,
      
      section4Title: '4. Data and Privacy',
      section4Content: `
        4.1. The User owns all data entered into the Platform.
        
        4.2. NexusOS does not access, sell, or share tenant data.
        
        4.3. Upon subscription cancellation, the User has the right to export their data during a 30-day grace period.
        
        4.4. After the grace period, data may be permanently deleted.
      `,
      
      section5Title: '5. Limitation of Liability',
      section5Content: `
        5.1. NexusOS strives to maintain 99.9% service availability.
        
        5.2. We are not responsible for losses from:
        • Scheduled maintenance interruptions
        • Force majeure (natural disasters, strikes, etc.)
        • Incorrect use of the Platform
        
        5.3. The maximum liability of NexusOS is limited to the value paid in the last 3 months of subscription.
      `,
      
      section6Title: '6. Intellectual Property',
      section6Content: `
        6.1. NexusOS and its components are property of the developing company.
        
        6.2. The User retains rights to their content and data.
        
        6.3. Upon cancellation, the User can request deletion of their data.
      `,
      
      section7Title: '7. Modifications',
      section7Content: `
        7.1. NexusOS may modify these terms with 30 days notice.
        
        7.2. Modifications will be notified by email.
        
        7.3. Continued use after modifications constitutes acceptance.
      `,
      
      section8Title: '8. Governing Law',
      section8Content: `
        These terms are governed by the laws of Trinidad & Tobago.
        Any dispute will be resolved in the courts of Port of Spain.
      `,
      
      // Privacy sections
      privacyTitle: 'Privacy Policy',
      privacyIntro: 'Your privacy is important to us. This policy describes how we collect, use, and protect your information.',
      
      privacy1Title: '1. Information Collected',
      privacy1Content: `
        We collect:
        • Registration information (name, email, phone)
        • Business information (business name, industry)
        • Usage data (platform activity)
        • Payment data (processed by WiPay, we don't store card numbers)
      `,
      
      privacy2Title: '2. Use of Information',
      privacy2Content: `
        We use your information to:
        • Provide and improve the service
        • Process payments
        • Send important notifications
        • Generate anonymous usage reports
        • Customer support
      `,
      
      privacy3Title: '3. Data Sharing',
      privacy3Content: `
        We don't sell or share your data with third parties except:
        • Payment processors (WiPay)
        • When required by law
        • With your explicit consent
      `,
      
      privacy4Title: '4. Security',
      privacy4Content: `
        We implement:
        • SSL/TLS encryption
        • Secure authentication
        • Daily backups
        • Regular security audits
      `,
      
      privacy5Title: '5. Your Rights',
      privacy5Content: `
        You have the right to:
        • Access your data
        • Correct incorrect data
        • Export your data
        • Request data deletion
        • Object to processing
        
        Exercise these rights by contacting privacy@nexusos.tt
      `,
      
      // Contact
      contactTitle: 'Contact',
      contactContent: 'For questions about these terms, contact:',
      
      // Download
      downloadPdf: 'Download PDF',
      printVersion: 'Print Version',
    },
  };

  const currentT = t[language];

  return (
    <div className="min-h-screen bg-[var(--obsidian-1)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--glass-border)] bg-[var(--obsidian-1)]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">NexusOS</h1>
              <p className="text-xs text-[var(--text-dim)]">{currentT.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--glass)]">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  language === 'es' 
                    ? 'bg-[var(--nexus-violet)] text-white' 
                    : 'text-[var(--text-mid)] hover:text-[var(--text-primary)]'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  language === 'en' 
                    ? 'bg-[var(--nexus-violet)] text-white' 
                    : 'text-[var(--text-mid)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" className="border-[var(--glass-border)]">
              <Download className="w-4 h-4 mr-2" />
              {currentT.downloadPdf}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {currentT.title}
          </h2>
          <p className="text-[var(--text-mid)]">{currentT.subtitle}</p>
          <p className="text-sm text-[var(--text-dim)] mt-2">
            <Clock className="w-4 h-4 inline mr-1" />
            {currentT.lastUpdated}
          </p>
        </div>

        {/* Terms Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Terms and Conditions */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--nexus-violet)]/10 to-transparent">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {currentT.termsTitle}
                </h3>
              </div>
            </div>
            
            <ScrollArea className="h-[500px] p-6">
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-[var(--text-mid)] mb-6">{currentT.termsIntro}</p>
                
                {/* Section 1 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section1Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section1Content}
                  </p>
                </section>
                
                {/* Section 2 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section2Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section2Content}
                  </p>
                </section>
                
                {/* Section 3 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section3Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section3Content}
                  </p>
                </section>
                
                {/* Section 4 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section4Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section4Content}
                  </p>
                </section>
                
                {/* Section 5 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section5Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section5Content}
                  </p>
                </section>
                
                {/* Section 6 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section6Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section6Content}
                  </p>
                </section>
                
                {/* Section 7 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section7Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section7Content}
                  </p>
                </section>
                
                {/* Section 8 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.section8Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.section8Content}
                  </p>
                </section>
              </div>
            </ScrollArea>
          </div>

          {/* Privacy Policy */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--nexus-fuchsia)]/10 to-transparent">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[var(--nexus-fuchsia)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {currentT.privacyTitle}
                </h3>
              </div>
            </div>
            
            <ScrollArea className="h-[500px] p-6">
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-[var(--text-mid)] mb-6">{currentT.privacyIntro}</p>
                
                {/* Privacy Section 1 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.privacy1Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.privacy1Content}
                  </p>
                </section>
                
                {/* Privacy Section 2 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.privacy2Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.privacy2Content}
                  </p>
                </section>
                
                {/* Privacy Section 3 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.privacy3Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.privacy3Content}
                  </p>
                </section>
                
                {/* Privacy Section 4 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.privacy4Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.privacy4Content}
                  </p>
                </section>
                
                {/* Privacy Section 5 */}
                <section className="mb-6">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.privacy5Title}
                  </h4>
                  <p className="text-[var(--text-mid)] whitespace-pre-line text-sm">
                    {currentT.privacy5Content}
                  </p>
                </section>
                
                {/* Contact */}
                <section className="mt-8 p-4 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)]">
                  <h4 className="text-[var(--text-primary)] font-semibold mb-3">
                    {currentT.contactTitle}
                  </h4>
                  <p className="text-[var(--text-mid)] text-sm mb-3">
                    {currentT.contactContent}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                      <span className="text-[var(--text-primary)]">legal@nexusos.tt</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                      <span className="text-[var(--text-primary)]">+1 868-XXX-XXXX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                      <span className="text-[var(--text-primary)]">Trinidad & Tobago 🇹🇹</span>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="mt-8 p-6 glass-card">
          <div className="space-y-4 mb-6">
            {/* Accept Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-1"
              />
              <span className="text-[var(--text-primary)]">
                {currentT.acceptTerms}
              </span>
            </label>
            
            {/* Accept Privacy */}
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                className="mt-1"
              />
              <span className="text-[var(--text-primary)]">
                {currentT.acceptPrivacy}
              </span>
            </label>
          </div>

          {!canContinue && (acceptedTerms || acceptedPrivacy) && (
            <div className="flex items-center gap-2 text-sm text-[var(--nexus-gold)] mb-4">
              <AlertCircle className="w-4 h-4" />
              {currentT.mustAccept}
            </div>
          )}

          <Button
            disabled={!canContinue}
            className="w-full bg-gradient-to-r from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] text-white py-6"
          >
            {canContinue ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {currentT.continue}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                {currentT.mustAccept}
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-[var(--text-dim)]">
            © 2026 NexusOS. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-1">
            {language === 'es' ? 'Hecho con ❤️ en Trinidad & Tobago 🇹🇹' : 'Made with ❤️ in Trinidad & Tobago 🇹🇹'}
          </p>
        </div>
      </footer>
    </div>
  );
}
