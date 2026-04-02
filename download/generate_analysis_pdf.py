from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/NexusOS_Estado_Sistema.pdf",
    pagesize=letter,
    title="NexusOS_Estado_Sistema",
    author='Z.ai',
    creator='Z.ai',
    subject='Analisis completo del estado actual de NexusOS'
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='Title',
    fontName='Times New Roman',
    fontSize=28,
    leading=34,
    alignment=TA_CENTER,
    spaceAfter=20
)

heading1_style = ParagraphStyle(
    name='Heading1',
    fontName='Times New Roman',
    fontSize=18,
    leading=22,
    spaceBefore=20,
    spaceAfter=10
)

heading2_style = ParagraphStyle(
    name='Heading2',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    spaceBefore=15,
    spaceAfter=8
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    spaceAfter=8
)

center_style = ParagraphStyle(
    name='CenterStyle',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_CENTER,
    spaceAfter=8
)

# Build story
story = []

# Cover
story.append(Spacer(1, 100))
story.append(Paragraph("<b>NEXUSOS</b>", title_style))
story.append(Paragraph("Analisis de Estado del Sistema", ParagraphStyle(
    name='Subtitle', fontName='Times New Roman', fontSize=18, alignment=TA_CENTER, spaceAfter=30
)))
story.append(Paragraph("Plataforma SaaS Multi-tenant para el Caribe", center_style))
story.append(Spacer(1, 40))
story.append(Paragraph("Fecha: 29 de Marzo, 2026", center_style))
story.append(Paragraph("Version: Demo/Prototipo", center_style))
story.append(Spacer(1, 60))
story.append(Paragraph("<b>RESUMEN EJECUTIVO</b>", heading1_style))
story.append(Paragraph(
    "NexusOS es un ambicioso proyecto de sistema operativo empresarial multi-tenant disenado para el mercado del Caribe. "
    "El proyecto tiene una arquitectura solida y un diseno profesional, pero se encuentra en estado de prototipo/demo "
    "con muchas funcionalidades simuladas en lugar de implementadas. A continuacion se presenta el analisis detallado.",
    body_style
))
story.append(Spacer(1, 20))

# Completion Table
story.append(Paragraph("<b>COMPLETITUD GENERAL: 45%</b>", heading1_style))

header_style = ParagraphStyle(name='TableHeader', fontName='Times New Roman', fontSize=10, textColor=colors.white, alignment=TA_CENTER)
cell_style = ParagraphStyle(name='TableCell', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER)

completion_data = [
    [Paragraph('<b>Componente</b>', header_style), Paragraph('<b>Estado</b>', header_style), Paragraph('<b>%</b>', header_style)],
    [Paragraph('UI/UX Frontend', cell_style), Paragraph('Muy avanzado', cell_style), Paragraph('85%', cell_style)],
    [Paragraph('Base de Datos (Schema)', cell_style), Paragraph('Completo', cell_style), Paragraph('90%', cell_style)],
    [Paragraph('Portal de Ventas', cell_style), Paragraph('Funcional', cell_style), Paragraph('80%', cell_style)],
    [Paragraph('Dashboards por Industria', cell_style), Paragraph('Funcional', cell_style), Paragraph('75%', cell_style)],
    [Paragraph('Sistema de Autenticacion', cell_style), Paragraph('Solo demo', cell_style), Paragraph('25%', cell_style)],
    [Paragraph('Integraciones', cell_style), Paragraph('Solo UI', cell_style), Paragraph('5%', cell_style)],
    [Paragraph('Multi-tenancy Real', cell_style), Paragraph('No implementado', cell_style), Paragraph('10%', cell_style)],
]

completion_table = Table(completion_data, colWidths=[200, 150, 80])
completion_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
]))
story.append(completion_table)
story.append(Spacer(1, 20))

# Page break
story.append(PageBreak())

# Section 1: Experiencia del Inquilino
story.append(Paragraph("<b>1. EXPERIENCIA DEL INQUILINO (TENANT)</b>", heading1_style))
story.append(Paragraph("<b>Estado Actual: 70% Completo</b>", heading2_style))

story.append(Paragraph("<b>Rutas de acceso por industria:</b>", body_style))
story.append(Paragraph("- /clinic - Sistema de gestion de clinicas", body_style))
story.append(Paragraph("- /lawfirm - Sistema de gestion de bufetes", body_style))
story.append(Paragraph("- /beauty - Sistema de gestion de salones/spa", body_style))
story.append(Paragraph("- /nurse - Portal de enfermeria", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Lo que funciona:</b>", body_style))
story.append(Paragraph("- Dashboards completos por industria con multiples modulos", body_style))
story.append(Paragraph("- Personalizacion visual (nombre, logo, colores) en UI", body_style))
story.append(Paragraph("- Vista previa de branding en tiempo real", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Lo que FALTA (CRITICO):</b>", body_style))
story.append(Paragraph("- Aislamiento de datos por tenant: Actualmente todos ven los mismos datos demo", body_style))
story.append(Paragraph("- Aprovisionamiento automatico: No se crean workspaces reales al comprar", body_style))
story.append(Paragraph("- Gestion de usuarios del tenant: El TENANT_ADMIN no puede agregar usuarios", body_style))
story.append(Paragraph("- Configuracion persistente: Los cambios de branding no se guardan en BD", body_style))
story.append(Spacer(1, 20))

# Section 2: Autenticacion
story.append(Paragraph("<b>2. SISTEMA DE AUTENTICACION</b>", heading1_style))
story.append(Paragraph("<b>Estado: 25% - CRITICO</b>", heading2_style))

story.append(Paragraph("<b>Problemas actuales:</b>", body_style))
story.append(Paragraph("- Usuarios hardcodeados (admin@nexusos.tt, clinic@demo.tt, etc.)", body_style))
story.append(Paragraph("- No hay hash de contrasenas real", body_style))
story.append(Paragraph("- No hay sesiones JWT", body_style))
story.append(Paragraph("- No hay validacion de roles en backend", body_style))
story.append(Paragraph("- Cualquier usuario puede acceder a cualquier tenant", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Solucion requerida:</b>", body_style))
story.append(Paragraph("- Implementar NextAuth.js o Auth.js", body_style))
story.append(Paragraph("- Hash de contrasenas con bcrypt", body_style))
story.append(Paragraph("- JWT sessions con middleware", body_style))
story.append(Paragraph("- Sistema de invitaciones", body_style))
story.append(Spacer(1, 20))

# Section 3: Integraciones
story.append(Paragraph("<b>3. INTEGRACIONES FALTANTES</b>", heading1_style))
story.append(Paragraph("<b>Estado: 5% - SOLO UI</b>", heading2_style))

story.append(Paragraph("<b>Emails (Resend recomendado):</b>", body_style))
story.append(Paragraph("- Plan gratuito: 3,000 emails/mes", body_style))
story.append(Paragraph("- Plan Pro: $20/mes por 50,000 emails", body_style))
story.append(Paragraph("- FALTA: Templates, bienvenida, recordatorios, facturas", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>WhatsApp Business API:</b>", body_style))
story.append(Paragraph("- Actualmente solo enlace manual wa.me", body_style))
story.append(Paragraph("- FALTA: Integracion real, notificaciones automaticas", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Pasarelas de Pago:</b>", body_style))
story.append(Paragraph("- WiPay (Trinidad): Solo UI, sin SDK integrado", body_style))
story.append(Paragraph("- Stripe: Solo mencion en UI", body_style))
story.append(Paragraph("- FALTA: Creacion de sesiones, webhooks, verificacion", body_style))

story.append(PageBreak())

# Section 4: Recomendaciones
story.append(Paragraph("<b>4. PLAN DE ACCION RECOMENDADO</b>", heading1_style))

story.append(Paragraph("<b>Fase 1: Fundamentos (Semana 1-2)</b>", heading2_style))
story.append(Paragraph("- Implementar autenticacion real con NextAuth.js", body_style))
story.append(Paragraph("- Crear middleware de autorizacion por tenant", body_style))
story.append(Paragraph("- Conectar componentes a la base de datos", body_style))
story.append(Paragraph("- Implementar sistema de emails (Resend)", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Fase 2: Pagos (Semana 3-4)</b>", heading2_style))
story.append(Paragraph("- Integrar WiPay con webhooks", body_style))
story.append(Paragraph("- Crear flujo de pago real", body_style))
story.append(Paragraph("- Implementar verificacion automatica", body_style))
story.append(Paragraph("- Crear provisioning de tenants", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Fase 3: Multi-tenancy (Semana 5-6)</b>", heading2_style))
story.append(Paragraph("- Aislamiento de datos por tenantId", body_style))
story.append(Paragraph("- Rutas dinamicas por tenant slug", body_style))
story.append(Paragraph("- Gestion de usuarios por tenant admin", body_style))
story.append(Paragraph("- Sistema de invitaciones", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>Fase 4: Funcionalidades Core (Semana 7-8)</b>", heading2_style))
story.append(Paragraph("- Notificaciones email/push", body_style))
story.append(Paragraph("- Audit logs funcionales", body_style))
story.append(Paragraph("- Backup automatico", body_style))
story.append(Paragraph("- Reportes basicos", body_style))
story.append(Spacer(1, 20))

# Section 5: Herramientas Recomendadas
story.append(Paragraph("<b>5. HERRAMIENTAS RECOMENDADAS</b>", heading1_style))

tools_data = [
    [Paragraph('<b>Categoria</b>', header_style), Paragraph('<b>Herramienta</b>', header_style), Paragraph('<b>Gratis</b>', header_style), Paragraph('<b>Pro</b>', header_style)],
    [Paragraph('Email', cell_style), Paragraph('Resend', cell_style), Paragraph('3,000/mes', cell_style), Paragraph('$20/50K', cell_style)],
    [Paragraph('Pagos Local', cell_style), Paragraph('WiPay', cell_style), Paragraph('3% + $1', cell_style), Paragraph('2.5%', cell_style)],
    [Paragraph('Pagos Intl', cell_style), Paragraph('Stripe', cell_style), Paragraph('2.9% + $0.30', cell_style), Paragraph('Custom', cell_style)],
    [Paragraph('WhatsApp', cell_style), Paragraph('Business API', cell_style), Paragraph('$0.005/msg', cell_style), Paragraph('Volume', cell_style)],
    [Paragraph('Auth', cell_style), Paragraph('NextAuth.js', cell_style), Paragraph('Gratis', cell_style), Paragraph('N/A', cell_style)],
]

tools_table = Table(tools_data, colWidths=[100, 120, 100, 100])
tools_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
]))
story.append(tools_table)
story.append(Spacer(1, 30))

# Conclusion
story.append(Paragraph("<b>6. CONCLUSIONES</b>", heading1_style))
story.append(Paragraph(
    "<b>Positivo:</b> NexusOS tiene una base solida y un diseno profesional. La arquitectura esta bien pensada y el "
    "schema de base de datos es completo (40+ modelos). El UI/UX es de alta calidad y la experiencia de usuario es fluida.",
    body_style
))
story.append(Spacer(1, 10))
story.append(Paragraph(
    "<b>Negativo:</b> El proyecto esta en estado de prototipo/demo. Las funcionalidades criticas (autenticacion, pagos, "
    "multi-tenancy) estan simuladas en lugar de implementadas. Se necesita trabajo significativo para convertir esto "
    "en un SaaS productivo.",
    body_style
))
story.append(Spacer(1, 10))
story.append(Paragraph(
    "<b>Recomendacion:</b> El proyecto requiere 6-8 semanas de desarrollo intensivo para alcanzar un MVP funcional. "
    "Se recomienda priorizar: 1) Autenticacion real, 2) Integracion de pagos (WiPay), 3) Aislamiento de datos por tenant, "
    "4) Sistema de emails.",
    body_style
))

# Build
doc.build(story)
print("PDF generado exitosamente!")
