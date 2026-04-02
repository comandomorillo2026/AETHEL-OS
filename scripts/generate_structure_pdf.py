#!/usr/bin/env python3
"""
NexusOS - Documento de Estructura Completa del Sistema
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

def create_pdf():
    doc = SimpleDocTemplate("/home/z/my-project/download/NexusOS_Estructura_Completa.pdf", pagesize=letter,
        title="NexusOS Estructura Completa", author='Z.ai', creator='Z.ai')
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name='Title', fontName='Times New Roman', fontSize=28, leading=34, alignment=TA_CENTER, spaceAfter=30)
    h1_style = ParagraphStyle(name='H1', fontName='Times New Roman', fontSize=18, leading=22, spaceBefore=20, spaceAfter=12, textColor=colors.HexColor('#6C3FCE'))
    h2_style = ParagraphStyle(name='H2', fontName='Times New Roman', fontSize=14, leading=18, spaceBefore=15, spaceAfter=8, textColor=colors.HexColor('#22D3EE'))
    body_style = ParagraphStyle(name='Body', fontName='Times New Roman', fontSize=10, leading=14, alignment=TA_JUSTIFY, spaceAfter=8)
    code_style = ParagraphStyle(name='Code', fontName='Times New Roman', fontSize=9, leading=12, leftIndent=20, backColor=colors.HexColor('#F5F5F5'))
    
    story = []
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("<b>NexusOS</b>", title_style))
    story.append(Paragraph("Sistema de Gestion Empresarial para el Caribe", ParagraphStyle(name='Sub', fontName='Times New Roman', fontSize=16, alignment=TA_CENTER)))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Documento de Estructura Completa", ParagraphStyle(name='Sub2', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER, textColor=colors.grey)))
    story.append(PageBreak())
    
    # Content
    story.append(Paragraph("<b>1. VISION GENERAL</b>", h1_style))
    story.append(Paragraph("NexusOS es una plataforma SaaS multi-tenant para el Caribe. Permite multiples empresas operar con datos aislados. Actualmente enfocado en clinicas.", body_style))
    
    story.append(Paragraph("<b>Componentes:</b>", h2_style))
    story.append(Paragraph("- Portal de Ventas: Captar clientes y pagos<br/>- Torre de Control: Admin del dueno<br/>- Sistema de Clinica: Dashboard por tenant<br/>- Portal de Enfermeria: Sistema SBAR<br/>- Portal de Pacientes: Autoservicio", body_style))
    
    story.append(Paragraph("<b>Tecnologias:</b>", h2_style))
    story.append(Paragraph("- Frontend: Next.js 16 + React + TypeScript<br/>- Estilos: Tailwind CSS + shadcn/ui<br/>- Database: Prisma ORM + SQLite/PostgreSQL<br/>- Auth: bcrypt + JWT<br/>- Pagos: WiPay + Stripe<br/>- Email: Resend<br/>- Hosting: Vercel (gratis)", body_style))
    
    story.append(Paragraph("<b>2. ESTRUCTURA DE ARCHIVOS</b>", h1_style))
    story.append(Paragraph("""
/home/z/my-project/<br/>
|-- src/app/page.tsx          # Portal principal<br/>
|-- src/app/home/             # Hub central<br/>
|-- src/app/login/            # Autenticacion<br/>
|-- src/app/admin/            # Torre de Control<br/>
|-- src/app/clinic/           # Sistema Clinica<br/>
|-- src/app/nurse/            # Portal Enfermeria<br/>
|-- src/app/portal-paciente/  # Portal Pacientes<br/>
|-- src/components/clinic/    # Modulos clinica<br/>
|-- src/components/admin/     # Modulos admin<br/>
|-- src/lib/auth/             # Sistema auth<br/>
|-- prisma/schema.prisma      # 30+ entidades<br/>
|-- db/custom.db              # Base SQLite
    """, code_style))
    
    story.append(Paragraph("<b>3. PLANES Y PRECIOS</b>", h1_style))
    
    header_style = ParagraphStyle(name='TH', fontName='Times New Roman', fontSize=10, textColor=colors.white, alignment=TA_CENTER)
    cell_style = ParagraphStyle(name='TC', fontName='Times New Roman', fontSize=9, alignment=TA_CENTER)
    
    plans = [
        [Paragraph('<b>Plan</b>', header_style), Paragraph('<b>Precio</b>', header_style), Paragraph('<b>Enfermeras</b>', header_style), Paragraph('<b>Incluye</b>', header_style)],
        [Paragraph('STARTER', cell_style), Paragraph('TT$800/mes', cell_style), Paragraph('1-2', cell_style), Paragraph('Clinica basica', cell_style)],
        [Paragraph('GROWTH', cell_style), Paragraph('TT$1,500/mes', cell_style), Paragraph('3-5', cell_style), Paragraph('+ Portal Enfermeria, Lab', cell_style)],
        [Paragraph('PREMIUM', cell_style), Paragraph('TT$2,800/mes', cell_style), Paragraph('6-10', cell_style), Paragraph('+ Telemedicina, Portal Paciente', cell_style)],
        [Paragraph('ENTERPRISE', cell_style), Paragraph('TT$4,500/mes', cell_style), Paragraph('11+', cell_style), Paragraph('+ Multi-sede, API, 24/7', cell_style)],
    ]
    t = Table(plans, colWidths=[1.3*inch, 1.3*inch, 1.2*inch, 2.2*inch])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1F4E79')), ('GRID', (0,0), (-1,-1), 0.5, colors.grey), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(t)
    
    story.append(Paragraph("<b>4. CREDENCIALES</b>", h1_style))
    story.append(Paragraph("<b>Super Admin:</b> admin@nexusos.tt / admin123<br/><b>Clinica:</b> clinic@demo.tt / demo123", body_style))
    
    story.append(Paragraph("<b>5. COMANDOS IMPORTANTES</b>", h1_style))
    story.append(Paragraph("""
# Iniciar servidor<br/>
cd /home/z/my-project && npm run dev<br/><br/>
# Verificar activo<br/>
curl http://localhost:3000<br/><br/>
# Regenerar Prisma<br/>
npx prisma generate<br/><br/>
# Resetear DB<br/>
npx prisma migrate reset<br/><br/>
# Build produccion<br/>
npm run build
    """, code_style))
    
    story.append(Paragraph("<b>6. SIGUIENTES INDUSTRIAS</b>", h1_style))
    story.append(Paragraph("1. Clinicas (ACTUAL) - TT$1,500-4,500/mes<br/>2. Restaurantes - TT$800-2,000/mes<br/>3. Salones de Belleza - TT$600-1,500/mes<br/>4. Bufetes de Abogados - TT$1,200-3,000/mes", body_style))
    
    story.append(Paragraph("<b>7. FAQ</b>", h1_style))
    story.append(Paragraph("<b>Funciona en celular?</b> Si, es PWA. No necesita app nativa.<br/><b>Cuantas empresas?</b> Ilimitadas, multi-tenant.<br/><b>Por cuanto tiempo?</b> Indefinidamente mientras el servidor active.<br/><b>Que necesito para produccion?</b> Vercel (gratis) + Supabase (gratis) + Resend (gratis).", body_style))
    
    story.append(Paragraph("<b>8. APP NATIVA vs PWA</b>", h1_style))
    story.append(Paragraph("<b>El sistema actual es PWA</b> - Progressive Web App. Esto significa:<br/>- Funciona en cualquier dispositivo con navegador<br/>- Se puede agregar a la pantalla de inicio<br/>- No requiere app store<br/>- Una sola base de codigo<br/><br/><b>App Nativa requeriria:</b><br/>- React Native o Flutter<br/>- Dos codebases (iOS/Android)<br/>- Publicar en App Store/Play Store<br/>- Costo adicional de desarrollo", body_style))
    
    doc.build(story)
    print("PDF generado: /home/z/my-project/download/NexusOS_Estructura_Completa.pdf")

if __name__ == "__main__":
    create_pdf()
