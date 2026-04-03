import ZAI from 'z-ai-web-dev-sdk';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
  businessName: string;
  industry: string;
  loginUrl: string;
}

/**
 * Send an email using Resend API
 * Note: This uses z-ai-web-dev-sdk's LLM capabilities for email generation
 * and standard fetch for sending via Resend API
 */
export async function sendEmail({ to, subject, html, from }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  // Usar el dominio verificado de Resend por defecto, o el configurado
  // Formato: "Nombre Visible <email@dominio.com>"
  const emailFrom = from || process.env.EMAIL_FROM || 'NexusOS <onboarding@resend.dev>';

  // If no API key, log and return success (for development)
  if (!resendApiKey || resendApiKey === 're_your_resend_api_key_here') {
    console.log('[EMAIL DEV MODE] Would send email:', { to, subject, from: emailFrom });
    console.log('[EMAIL DEV MODE] HTML length:', html.length);
    return { success: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[EMAIL ERROR]', error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log('[EMAIL SENT]', data);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate a welcome email HTML template
 */
export function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
  const industryNames: Record<string, string> = {
    clinic: 'Clínica Médica',
    nurse: 'Cuidados de Enfermería',
    lawfirm: 'Bufete de Abogados',
    beauty: 'Salón de Belleza',
    retail: 'Tienda',
    bakery: 'Panadería',
  };

  const industryName = industryNames[data.industry] || data.industry;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a NexusOS</title>
  <style>
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: #050410; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { width: 64px; height: 64px; background: linear-gradient(135deg, #6C3FCE 0%, #C026D3 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .logo-text { color: white; font-size: 24px; font-weight: bold; }
    .card { background: rgba(108, 63, 206, 0.07); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 16px; padding: 32px; }
    .title { color: #EDE9FE; font-size: 28px; font-weight: bold; margin: 0 0 16px; text-align: center; font-family: 'Cormorant Garamond', serif; }
    .subtitle { color: #9D7BEA; font-size: 16px; text-align: center; margin: 0 0 32px; }
    .content { color: #EDE9FE; font-size: 16px; line-height: 1.6; }
    .content p { margin: 0 0 16px; }
    .highlight-box { background: rgba(108, 63, 206, 0.15); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .highlight-box p { margin: 8px 0; }
    .highlight-label { color: #9D7BEA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .highlight-value { color: #EDE9FE; font-size: 16px; font-weight: 500; }
    .button { display: inline-block; background: linear-gradient(135deg, #6C3FCE 0%, #C026D3 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; text-align: center; }
    .footer { color: rgba(167, 139, 250, 0.5); font-size: 14px; text-align: center; margin-top: 32px; }
    .footer a { color: #9D7BEA; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">N</span>
    </div>

    <div class="card">
      <h1 class="title">¡Bienvenido a NexusOS!</h1>
      <p class="subtitle">Tu sistema de gestión está listo</p>

      <div class="content">
        <p>Hola <strong>${data.name}</strong>,</p>
        <p>¡Gracias por unirte a NexusOS! Tu cuenta ha sido creada exitosamente y tu sistema de gestión para <strong>${data.businessName}</strong> está listo para usar.</p>

        <div class="highlight-box">
          <p><span class="highlight-label">Negocio</span><br><span class="highlight-value">${data.businessName}</span></p>
          <p><span class="highlight-label">Industria</span><br><span class="highlight-value">${industryName}</span></p>
          <p><span class="highlight-label">Email de acceso</span><br><span class="highlight-value">${data.email}</span></p>
        </div>

        <p>Con NexusOS tendrás acceso a:</p>
        <ul style="color: #EDE9FE; padding-left: 20px;">
          <li>Gestión completa de clientes y pacientes</li>
          <li>Sistema de citas y calendario</li>
          <li>Facturación y control de pagos</li>
          <li>Reportes y análisis de tu negocio</li>
          <li>Y mucho más...</li>
        </ul>

        <div style="text-align: center;">
          <a href="${data.loginUrl}" class="button">Acceder a Mi Sistema</a>
        </div>

        <p>Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte a hacer crecer tu negocio.</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 NexusOS. Todos los derechos reservados.</p>
      <p>Soporte: <a href="mailto:soporte@nexusos.tt">soporte@nexusos.tt</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate a password reset email HTML template
 */
export function generatePasswordResetEmailHTML(data: { name: string; resetUrl: string }): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña - NexusOS</title>
  <style>
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: #050410; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { width: 64px; height: 64px; background: linear-gradient(135deg, #6C3FCE 0%, #C026D3 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .logo-text { color: white; font-size: 24px; font-weight: bold; }
    .card { background: rgba(108, 63, 206, 0.07); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 16px; padding: 32px; }
    .title { color: #EDE9FE; font-size: 28px; font-weight: bold; margin: 0 0 16px; text-align: center; font-family: 'Cormorant Garamond', serif; }
    .content { color: #EDE9FE; font-size: 16px; line-height: 1.6; text-align: center; }
    .content p { margin: 0 0 16px; }
    .button { display: inline-block; background: linear-gradient(135deg, #6C3FCE 0%, #C026D3 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
    .warning { color: #F87171; font-size: 14px; margin-top: 24px; }
    .footer { color: rgba(167, 139, 250, 0.5); font-size: 14px; text-align: center; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">N</span>
    </div>

    <div class="card">
      <h1 class="title">Restablecer Contraseña</h1>

      <div class="content">
        <p>Hola <strong>${data.name}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:</p>

        <a href="${data.resetUrl}" class="button">Restablecer Contraseña</a>

        <p class="warning">Este enlace expirará en 24 horas. Si no solicitaste este cambio, puedes ignorar este email.</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 NexusOS. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
  const html = generateWelcomeEmailHTML(data);

  return sendEmail({
    to: data.email,
    subject: `¡Bienvenido a NexusOS! - Tu sistema para ${data.businessName} está listo`,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: { name: string; email: string; resetUrl: string }): Promise<{ success: boolean; error?: string }> {
  const html = generatePasswordResetEmailHTML(data);

  return sendEmail({
    to: data.email,
    subject: 'Restablecer tu contraseña - NexusOS',
    html,
  });
}

/**
 * Generate tenant welcome email HTML with temporary password
 */
export function generateTenantWelcomeEmailHTML(data: {
  userName: string;
  businessName: string;
  loginUrl: string;
  email: string;
  tempPassword: string;
  industry: string;
}): string {
  const industryNames: Record<string, string> = {
    clinic: 'Clínica Médica',
    nurse: 'Cuidados de Enfermería',
    lawfirm: 'Bufete de Abogados',
    beauty: 'Salón de Belleza',
    retail: 'Tienda',
    bakery: 'Panadería',
  };

  const industryName = industryNames[data.industry] || data.industry;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Tu Sistema Está Listo! - NexusOS</title>
  <style>
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: #050410; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { width: 64px; height: 64px; background: linear-gradient(135deg, #6C3FCE 0%, #C026D3 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .logo-text { color: white; font-size: 24px; font-weight: bold; }
    .card { background: rgba(108, 63, 206, 0.07); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 16px; padding: 32px; }
    .title { color: #EDE9FE; font-size: 28px; font-weight: bold; margin: 0 0 16px; text-align: center; font-family: 'Cormorant Garamond', serif; }
    .subtitle { color: #F0B429; font-size: 18px; text-align: center; margin: 0 0 32px; font-weight: 600; }
    .content { color: #EDE9FE; font-size: 16px; line-height: 1.6; }
    .content p { margin: 0 0 16px; }
    .credentials-box { background: linear-gradient(135deg, rgba(240, 180, 41, 0.1) 0%, rgba(108, 63, 206, 0.1) 100%); border: 2px solid #F0B429; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .credentials-title { color: #F0B429; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin: 0 0 16px; }
    .credential-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(167, 139, 250, 0.1); }
    .credential-item:last-child { border-bottom: none; }
    .credential-label { color: #9D7BEA; font-size: 14px; }
    .credential-value { color: #EDE9FE; font-size: 16px; font-weight: 600; font-family: 'DM Mono', monospace; }
    .password-value { color: #F0B429; font-size: 20px; letter-spacing: 1px; }
    .button { display: inline-block; background: linear-gradient(135deg, #F0B429 0%, #d97706 100%); color: #050410; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 24px 0; text-align: center; font-size: 16px; }
    .warning-box { background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.3); border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning-text { color: #F87171; font-size: 14px; margin: 0; }
    .features { background: rgba(108, 63, 206, 0.1); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .features h3 { color: #EDE9FE; font-size: 16px; margin: 0 0 12px; }
    .features ul { color: #9D7BEA; font-size: 14px; margin: 0; padding-left: 20px; }
    .features li { margin: 8px 0; }
    .footer { color: rgba(167, 139, 250, 0.5); font-size: 14px; text-align: center; margin-top: 32px; }
    .footer a { color: #9D7BEA; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">N</span>
    </div>

    <div class="card">
      <h1 class="title">¡Tu Sistema Está Listo!</h1>
      <p class="subtitle">${data.businessName}</p>

      <div class="content">
        <p>Hola <strong>${data.userName}</strong>,</p>
        <p>¡Bienvenido a NexusOS! Tu sistema de gestión para <strong>${industryName}</strong> ha sido configurado y está listo para usar.</p>

        <div class="credentials-box">
          <p class="credentials-title">🔐 Tus Credenciales de Acceso</p>
          <div class="credential-item">
            <span class="credential-label">URL de Acceso:</span>
            <span class="credential-value">${data.loginUrl}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">Email:</span>
            <span class="credential-value">${data.email}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">Contraseña Temporal:</span>
            <span class="credential-value password-value">${data.tempPassword}</span>
          </div>
        </div>

        <div class="warning-box">
          <p class="warning-text">⚠️ Por seguridad, cambia esta contraseña después de tu primer inicio de sesión.</p>
        </div>

        <div style="text-align: center;">
          <a href="${data.loginUrl}" class="button">🚀 Acceder a Mi Sistema</a>
        </div>

        <div class="features">
          <h3>✨ Lo que puedes hacer ahora:</h3>
          <ul>
            <li>Registrar tus clientes y pacientes</li>
            <li>Crear citas y gestionar tu calendario</li>
            <li>Generar facturas y recibir pagos</li>
            <li>Ver reportes de tu negocio</li>
            <li>Personalizar la configuración</li>
          </ul>
        </div>

        <p>Si necesitas ayuda, contáctanos en <a href="mailto:soporte@nexusos.tt" style="color: #9D7BEA;">soporte@nexusos.tt</a></p>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 NexusOS - Sistema de Gestión Empresarial para el Caribe</p>
      <p>Este email fue enviado a ${data.email}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send welcome email to new tenant with temporary password
 */
export async function sendTenantWelcomeEmail(data: {
  to: string;
  userName: string;
  businessName: string;
  loginUrl: string;
  email: string;
  tempPassword: string;
  industry: string;
}): Promise<{ success: boolean; error?: string }> {
  const html = generateTenantWelcomeEmailHTML(data);

  return sendEmail({
    to: data.to,
    subject: `🚀 ¡Tu Sistema NexusOS Está Listo! - ${data.businessName}`,
    html,
  });
}
