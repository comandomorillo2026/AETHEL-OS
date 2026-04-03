#!/usr/bin/env python3
"""
NexusOS Competitive Analysis Report - Global Market Comparison
"""
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/NexusOS_Analisis_Competitivo_Global.pdf",
    pagesize=letter,
    title="NexusOS Analisis Competitivo Global",
    author="Z.ai",
    creator="Z.ai",
    subject="Comparativa de NexusOS con los lideres del mercado global"
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times New Roman',
    fontSize=22,
    alignment=TA_CENTER,
    spaceAfter=20
)

heading1_style = ParagraphStyle(
    name='Heading1Style',
    fontName='Times New Roman',
    fontSize=16,
    spaceBefore=18,
    spaceAfter=10,
    textColor=colors.HexColor('#1F4E79')
)

heading2_style = ParagraphStyle(
    name='Heading2Style',
    fontName='Times New Roman',
    fontSize=13,
    spaceBefore=12,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT
)

cell_style = ParagraphStyle(
    name='CellStyle',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)

cell_left = ParagraphStyle(
    name='CellLeft',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_LEFT
)

story = []

# Cover Page
story.append(Spacer(1, 80))
story.append(Paragraph("<b>NexusOS</b>", title_style))
story.append(Paragraph("<b>Analisis Competitivo Global</b>", title_style))
story.append(Spacer(1, 30))
story.append(Paragraph("Comparacion con los Lideres del Mercado 2024-2025", 
    ParagraphStyle('Subtitle', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)))
story.append(Spacer(1, 40))
story.append(Paragraph("Clinicas | Enfermeria | Bufetes | Belleza", 
    ParagraphStyle('Industries', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER)))
story.append(Spacer(1, 60))
story.append(Paragraph("Fecha: 31 de Marzo, 2026", 
    ParagraphStyle('Date', fontName='Times New Roman', fontSize=11, alignment=TA_CENTER)))
story.append(PageBreak())

# ============================================
# CLINICS COMPARISON
# ============================================
story.append(Paragraph("<b>1. CLINICAS MEDICAS - Analisis Competitivo</b>", heading1_style))

story.append(Paragraph("<b>1.1 Lideres del Mercado Global</b>", heading2_style))

clinic_leaders = [
    [Paragraph('<b>Sistema</b>', cell_style), 
     Paragraph('<b>Precio</b>', cell_style), 
     Paragraph('<b> Mercado</b>', cell_style),
     Paragraph('<b>Usuarios</b>', cell_style)],
    [Paragraph('Epic Systems', cell_style), 
     Paragraph('$500K-$10M+', cell_style), 
     Paragraph('42.3%', cell_style),
     Paragraph('250M pacientes', cell_style)],
    [Paragraph('Oracle Health (Cerner)', cell_style), 
     Paragraph('$25K-$1M+', cell_style), 
     Paragraph('21.7%', cell_style),
     Paragraph('Enterprise', cell_style)],
    [Paragraph('athenahealth', cell_style), 
     Paragraph('$140-400/prov/mes', cell_style), 
     Paragraph('16.7%', cell_style),
     Paragraph('160K proveedores', cell_style)],
    [Paragraph('eClinicalWorks', cell_style), 
     Paragraph('$449-599/prov/mes', cell_style), 
     Paragraph('13.9%', cell_style),
     Paragraph('180K proveedores', cell_style)],
    [Paragraph('DrChrono', cell_style), 
     Paragraph('$199-500/prov/mes', cell_style), 
     Paragraph('1-2%', cell_style),
     Paragraph('17K proveedores', cell_style)],
]

clinic_table = Table(clinic_leaders, colWidths=[1.6*inch, 1.3*inch, 1*inch, 1.3*inch])
clinic_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
]))
story.append(clinic_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>1.2 Posicion de NexusOS en Clinicas</b>", heading2_style))

nexus_clinic_comparison = [
    [Paragraph('<b>Caracteristica</b>', cell_style), 
     Paragraph('<b>NexusOS</b>', cell_style), 
     Paragraph('<b>Competidores</b>', cell_style)],
    [Paragraph('Precio Mensual', cell_left), 
     Paragraph('TT$ 800-2,800', cell_style), 
     Paragraph('USD $140-500/prov', cell_style)],
    [Paragraph('Mercado Objetivo', cell_left), 
     Paragraph('PYMES Caribe', cell_style), 
     Paragraph('EE.UU./Global', cell_style)],
    [Paragraph('Implementacion', cell_left), 
     Paragraph('Semanas', cell_style), 
     Paragraph('Semanas-Meses', cell_style)],
    [Paragraph('Pacientes', cell_left), 
     Paragraph('Ilimitados', cell_style), 
     Paragraph('Ilimitados', cell_style)],
    [Paragraph('Citas/Calendar', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Facturacion', cell_left), 
     Paragraph('Local TT$', cell_style), 
     Paragraph('USD/USD', cell_style)],
    [Paragraph('Laboratorio', cell_left), 
     Paragraph('Modulo basico', cell_style), 
     Paragraph('Avanzado', cell_style)],
    [Paragraph('Interoperabilidad', cell_left), 
     Paragraph('Basica', cell_style), 
     Paragraph('Avanzada (HL7/FHIR)', cell_style)],
    [Paragraph('Telemedicina', cell_left), 
     Paragraph('Pendiente', cell_style), 
     Paragraph('Integrada', cell_style)],
    [Paragraph('IA/Analytics', cell_left), 
     Paragraph('Basico', cell_style), 
     Paragraph('Avanzado', cell_style)],
]

nexus_clinic_table = Table(nexus_clinic_comparison, colWidths=[1.8*inch, 1.5*inch, 1.8*inch])
nexus_clinic_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#22D3EE')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
]))
story.append(nexus_clinic_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>1.3 Ventajas de NexusOS (Clinicas)</b>", heading2_style))
story.append(Paragraph("""
<b>1. Precio Competitivo:</b> TT$800-2,800/mes vs USD$140-500/proveedor de competidores. Para una clinica pequena de 3 doctores, 
esto representa un ahorro de 50-70% en costos de software.
<br/><br/>
<b>2. Localizacion Caribena:</b> Moneda TT$, direcciones locales, leyes de Trinidad & Tobago, soporte en espanol/ingles.
<br/><br/>
<b>3. Implementacion Rapida:</b> Sistema listo en dias/semanas vs meses de los competidores enterprise.
<br/><br/>
<b>4. Sin Contratos Largos:</b> Pago mensual vs contratos anuales tipicos del mercado.
<br/><br/>
<b>5. Multi-tenant SaaS:</b> Una sola plataforma para multiples clinicas con datos aislados.
""", body_style))

story.append(Paragraph("<b>1.4 Desventajas de NexusOS (Clinicas)</b>", heading2_style))
story.append(Paragraph("""
<b>1. Sin Interoperabilidad HL7/FHIR:</b> Los competidores grandes tienen integracion con hospitales, laboratorios externos, 
y sistemas de seguros medicos.
<br/><br/>
<b>2. Sin Telemedicina:</b> Epic, athenahealth y eClinicalWorks tienen videoconsultas integradas.
<br/><br/>
<b>3. Funcionalidad OASIS Limitada:</b> Para clinicas que reportan a Medicare/Medicaid de EE.UU.
<br/><br/>
<b>4. Marca Desconocida:</b> Sin la reputacion de Epic o athenahealth en el mercado.
<br/><br/>
<b>5. Integraciones Limitadas:</b> Los competidores tienen 250+ integraciones (laboratorios, farmacias, seguros).
""", body_style))

story.append(Paragraph("<b>1.5 Posicion en el Mercado</b>", heading2_style))

position_clinic = [
    [Paragraph('<b>Segmento</b>', cell_style), 
     Paragraph('<b>Posicion NexusOS</b>', cell_style)],
    [Paragraph('Enterprise (50+ doctores)', cell_style), 
     Paragraph('No competitivo', cell_style)],
    [Paragraph('Mediano (10-50 doctores)', cell_style), 
     Paragraph('Alternativa economica', cell_style)],
    [Paragraph('PYME (1-10 doctores)', cell_style), 
     Paragraph('COMPETITIVO - Nicho Caribe', cell_style)],
    [Paragraph('Clinicas independientes', cell_style), 
     Paragraph('MUY COMPETITIVO', cell_style)],
]

position_table = Table(position_clinic, colWidths=[2.5*inch, 2.5*inch])
position_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#90EE90')),
]))
story.append(position_table)

story.append(PageBreak())

# ============================================
# NURSING COMPARISON
# ============================================
story.append(Paragraph("<b>2. ENFERMERIA / HOME CARE - Analisis Competitivo</b>", heading1_style))

story.append(Paragraph("<b>2.1 Lideres del Mercado Global</b>", heading2_style))

nursing_leaders = [
    [Paragraph('<b>Sistema</b>', cell_style), 
     Paragraph('<b>Precio</b>', cell_style), 
     Paragraph('<b>Foco</b>', cell_style),
     Paragraph('<b>Rating</b>', cell_style)],
    [Paragraph('Homecare Homebase', cell_style), 
     Paragraph('$500-1,500/mes', cell_style), 
     Paragraph('Medicare Home Health', cell_style),
     Paragraph('2.8/5', cell_style)],
    [Paragraph('AlayaCare', cell_style), 
     Paragraph('$300-800/mes', cell_style), 
     Paragraph('Multi-servicio', cell_style),
     Paragraph('4.0/5', cell_style)],
    [Paragraph('Axxess', cell_style), 
     Paragraph('$200-600/mes', cell_style), 
     Paragraph('PYME/Startup', cell_style),
     Paragraph('3.9/5', cell_style)],
    [Paragraph('WellSky Personal Care', cell_style), 
     Paragraph('$12/usuario/mes', cell_style), 
     Paragraph('Non-medical care', cell_style),
     Paragraph('4.4/5', cell_style)],
    [Paragraph('MatrixCare', cell_style), 
     Paragraph('$400-1,200/mes', cell_style), 
     Paragraph('Enterprise', cell_style),
     Paragraph('3.5/5', cell_style)],
]

nursing_table = Table(nursing_leaders, colWidths=[1.6*inch, 1.2*inch, 1.5*inch, 0.8*inch])
nursing_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34D399')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(nursing_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>2.2 Comparacion NexusOS vs Competidores</b>", heading2_style))

nexus_nursing_comparison = [
    [Paragraph('<b>Caracteristica</b>', cell_style), 
     Paragraph('<b>NexusOS</b>', cell_style), 
     Paragraph('<b>Competidores</b>', cell_style)],
    [Paragraph('Handoff SBAR', cell_left), 
     Paragraph('Disponible', cell_style), 
     Paragraph('Algunos tienen', cell_style)],
    [Paragraph('Signos Vitales', cell_left), 
     Paragraph('Disponible', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Medicamentos MAR', cell_left), 
     Paragraph('Basico', cell_style), 
     Paragraph('Completo con eMAR', cell_style)],
    [Paragraph('EVV (Verificacion Visitas)', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Obligatorio en EE.UU.', cell_style)],
    [Paragraph('OASIS/Clinical Docs', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Planificacion Cuidados', cell_left), 
     Paragraph('Pendiente', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('App Movil Offline', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Si, todos tienen', cell_style)],
    [Paragraph('Integracion RPM/IoT', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('AlayaCare tiene', cell_style)],
]

nexus_nursing_table = Table(nexus_nursing_comparison, colWidths=[1.8*inch, 1.5*inch, 1.8*inch])
nexus_nursing_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34D399')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(nexus_nursing_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>2.3 Posicion de NexusOS en Enfermeria</b>", heading2_style))
story.append(Paragraph("""
<b>ESTADO: NO COMPETITIVO</b> - El modulo de enfermeria de NexusOS esta en etapa temprana de desarrollo. 
Faltan caracteristicas criticas que los competidores ya tienen implementadas:
<br/><br/>
<b>Critico Faltante:</b>
- EVV (Electronic Visit Verification) - obligatorio para agencias que facturan a Medicare/Medicaid
- App movil con modo offline para trabajo en campo
- Documentacion clinica OASIS
- Integracion con equipos medicos IoT
<br/><br/>
<b>Potencial:</b> Para agencias privadas de cuidado personal en el Caribe que no necesitan cumplir 
con regulaciones de Medicare/Medicaid de EE.UU., NexusOS podria ser una opcion economica.
""", body_style))

story.append(PageBreak())

# ============================================
# LAW FIRM COMPARISON
# ============================================
story.append(Paragraph("<b>3. BUFETES DE ABOGADOS - Analisis Competitivo</b>", heading1_style))

story.append(Paragraph("<b>3.1 Lideres del Mercado Global</b>", heading2_style))

law_leaders = [
    [Paragraph('<b>Sistema</b>', cell_style), 
     Paragraph('<b>Precio</b>', cell_style), 
     Paragraph('<b>Mercado</b>', cell_style),
     Paragraph('<b>Usuarios</b>', cell_style)],
    [Paragraph('Clio', cell_style), 
     Paragraph('$49-149/usuario/mes', cell_style), 
     Paragraph('Lider Global', cell_style),
     Paragraph('150K abogados', cell_style)],
    [Paragraph('MyCase', cell_style), 
     Paragraph('$39-109/usuario/mes', cell_style), 
     Paragraph('Top 3', cell_style),
     Paragraph('PYME', cell_style)],
    [Paragraph('PracticePanther', cell_style), 
     Paragraph('$49-99/usuario/mes', cell_style), 
     Paragraph('Mejor Valor', cell_style),
     Paragraph('PYME', cell_style)],
    [Paragraph('Rocket Matter', cell_style), 
     Paragraph('$39-99/usuario/mes', cell_style), 
     Paragraph('Analytics', cell_style),
     Paragraph('PYME', cell_style)],
    [Paragraph('LEAP Legal', cell_style), 
     Paragraph('$149/usuario/mes', cell_style), 
     Paragraph('Documentos', cell_style),
     Paragraph('Global', cell_style)],
]

law_table = Table(law_leaders, colWidths=[1.5*inch, 1.5*inch, 1.2*inch, 1.2*inch])
law_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#C4A35A')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(law_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>3.2 Comparacion NexusOS vs Competidores</b>", heading2_style))

nexus_law_comparison = [
    [Paragraph('<b>Caracteristica</b>', cell_style), 
     Paragraph('<b>NexusOS</b>', cell_style), 
     Paragraph('<b>Clio/MyCase</b>', cell_style)],
    [Paragraph('Gestion Casos', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Clientes', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Documentos', cell_left), 
     Paragraph('Basico', cell_style), 
     Paragraph('Avanzado + IA', cell_style)],
    [Paragraph('Calendario/Cortes', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Time Tracking', cell_left), 
     Paragraph('Manual', cell_style), 
     Paragraph('Automatico (AI)', cell_style)],
    [Paragraph('Facturacion', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo + LEDES', cell_style)],
    [Paragraph('Trust Accounting (IOLTA)', cell_left), 
     Paragraph('Basico', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Portal Clientes', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Si, todos tienen', cell_style)],
    [Paragraph('Integraciones', cell_left), 
     Paragraph('0', cell_style), 
     Paragraph('Clio: 250+', cell_style)],
    [Paragraph('IA/ML', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Clio Duo, LEAP AI', cell_style)],
]

nexus_law_table = Table(nexus_law_comparison, colWidths=[1.8*inch, 1.5*inch, 1.8*inch])
nexus_law_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#C4A35A')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(nexus_law_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>3.3 Ventajas de NexusOS (Bufetes)</b>", heading2_style))
story.append(Paragraph("""
<b>1. Localizacion Legal Caribena:</b> Plantillas de documentos para Trinidad & Tobago, leyes locales 
(Supreme Court Act, Companies Act), referencias a jurisprudencia del Caribe.
<br/><br/>
<b>2. Precio Competitivo:</b> TT$800-2,800/mes ilimitado vs $49-149/usuario/mes en USD. Para un bufete de 5 abogados, 
NexusOS cuesta ~TT$2,800 (~USD$400) vs Clio que costaria ~USD$500/mes.
<br/><br/>
<b>3. Sin Dependencia de QuickBooks:</b> Sistema contable integrado especifico para bufetes.
<br/><br/>
<b>4. Soporte en Espanol:</b> Atencion al mercado hispano del Caribe.
""", body_style))

story.append(Paragraph("<b>3.4 Desventajas de NexusOS (Bufetes)</b>", heading2_style))
story.append(Paragraph("""
<b>1. Sin Portal de Clientes:</b> Los clientes no pueden ver el estado de sus casos en linea.
<br/><br/>
<b>2. Sin Time Tracking Automatico:</b> Smokeball y LEAP capturan tiempo automaticamente.
<br/><br/>
<b>3. Sin Integraciones:</b> Clio tiene 250+ integraciones con Outlook, Gmail, QuickBooks, etc.
<br/><br/>
<b>4. Sin IA:</b> Clio Duo ofrece asistencia de IA para documentos y analisis.
<br/><br/>
<b>5. Cumplimiento Limitado:</b> Sin certificaciones de cumplimiento legal internacionales.
""", body_style))

story.append(PageBreak())

# ============================================
# BEAUTY COMPARISON
# ============================================
story.append(Paragraph("<b>4. SALONES DE BELLEZA - Analisis Competitivo</b>", heading1_style))

story.append(Paragraph("<b>4.1 Lideres del Mercado Global</b>", heading2_style))

beauty_leaders = [
    [Paragraph('<b>Sistema</b>', cell_style), 
     Paragraph('<b>Precio</b>', cell_style), 
     Paragraph('<b>Usuarios</b>', cell_style),
     Paragraph('<b>Diferenciador</b>', cell_style)],
    [Paragraph('Mindbody', cell_style), 
     Paragraph('$129-449/mes', cell_style), 
     Paragraph('40K+ negocios', cell_style),
     Paragraph('Marketplace 3M+', cell_style)],
    [Paragraph('Vagaro', cell_style), 
     Paragraph('$30-70/mes', cell_style), 
     Paragraph('1,900+ negocios', cell_style),
     Paragraph('Mejor valor', cell_style)],
    [Paragraph('Fresha', cell_style), 
     Paragraph('GRATIS*', cell_style), 
     Paragraph('190K+ negocios', cell_style),
     Paragraph('Sin suscripcion', cell_style)],
    [Paragraph('Booksy', cell_style), 
     Paragraph('$30-110/mes', cell_style), 
     Paragraph('13M usuarios', cell_style),
     Paragraph('App consumidor', cell_style)],
    [Paragraph('Zenoti', cell_style), 
     Paragraph('$235-500/mes', cell_style), 
     Paragraph('30K+ negocios', cell_style),
     Paragraph('Enterprise/AI', cell_style)],
]

beauty_table = Table(beauty_leaders, colWidths=[1.4*inch, 1.2*inch, 1.2*inch, 1.5*inch])
beauty_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EC4899')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(beauty_table)
story.append(Spacer(1, 8))
story.append(Paragraph("*Fresha cobra 2.09% + $0.25 por transaccion de pago", 
    ParagraphStyle('Note', fontName='Times New Roman', fontSize=8, alignment=TA_CENTER)))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>4.2 Comparacion NexusOS vs Competidores</b>", heading2_style))

nexus_beauty_comparison = [
    [Paragraph('<b>Caracteristica</b>', cell_style), 
     Paragraph('<b>NexusOS</b>', cell_style), 
     Paragraph('<b>Competidores</b>', cell_style)],
    [Paragraph('Citas Online', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('POS', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Inventario', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Membresias/Lealtad', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Personal/Comisiones', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Completo', cell_style)],
    [Paragraph('Multi-sucursal', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Zenoti: Mejor', cell_style)],
    [Paragraph('Contabilidad', cell_left), 
     Paragraph('Completo', cell_style), 
     Paragraph('Requiere QuickBooks', cell_style)],
    [Paragraph('Marketplace Consumidor', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Mindbody/Booksy: Si', cell_style)],
    [Paragraph('App Cliente', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Todos tienen', cell_style)],
    [Paragraph('IA/Virtual Front Desk', cell_left), 
     Paragraph('No tiene', cell_style), 
     Paragraph('Zenoti: Si', cell_style)],
]

nexus_beauty_table = Table(nexus_beauty_comparison, colWidths=[1.8*inch, 1.5*inch, 1.8*inch])
nexus_beauty_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EC4899')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(nexus_beauty_table)
story.append(Spacer(1, 12))

story.append(Paragraph("<b>4.3 Posicion de NexusOS en Belleza</b>", heading2_style))
story.append(Paragraph("""
<b>ESTADO: COMPETITIVO PARA MERCADO CARIBENO</b>
<br/><br/>
<b>Ventajas Clave:</b>
- Contabilidad integrada (no requiere QuickBooks como la mayoria)
- Precio en TT$ accesible para el mercado local
- Sistema de membresias y puntos de lealtad completo
- Gestion de comisiones de personal
- Multi-sucursal soportado
<br/><br/>
<b>Desventajas:</b>
- Sin marketplace consumidor (los clientes no te descubren por la app)
- Sin app movil dedicada para clientes
- Sin integracion con redes sociales para marketing
- Menor visibilidad que Booksy/Mindbody
""", body_style))

story.append(PageBreak())

# ============================================
# SUMMARY MATRIX
# ============================================
story.append(Paragraph("<b>5. MATRIZ DE POSICION COMPETITIVA</b>", heading1_style))

summary_matrix = [
    [Paragraph('<b>Industria</b>', cell_style), 
     Paragraph('<b>Posicion</b>', cell_style), 
     Paragraph('<b>Nicho</b>', cell_style),
     Paragraph('<b>Precio vs Mercado</b>', cell_style)],
    [Paragraph('Clinicas', cell_style), 
     Paragraph('COMPETITIVO', cell_style), 
     Paragraph('PYME Caribe', cell_style),
     Paragraph('-50 a -70%', cell_style)],
    [Paragraph('Enfermeria', cell_style), 
     Paragraph('NO COMPETITIVO', cell_style), 
     Paragraph('Muy temprano', cell_style),
     Paragraph('N/A', cell_style)],
    [Paragraph('Bufetes', cell_style), 
     Paragraph('PARCIALMENTE', cell_style), 
     Paragraph('PYME Local', cell_style),
     Paragraph('-30 a -50%', cell_style)],
    [Paragraph('Belleza', cell_style), 
     Paragraph('COMPETITIVO', cell_style), 
     Paragraph('Salones Caribe', cell_style),
     Paragraph('-40 a -60%', cell_style)],
]

summary_table = Table(summary_matrix, colWidths=[1.4*inch, 1.4*inch, 1.4*inch, 1.4*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#90EE90')),
    ('BACKGROUND', (1, 2), (1, 2), colors.HexColor('#FFB6C1')),
    ('BACKGROUND', (1, 3), (1, 3), colors.HexColor('#FFD700')),
    ('BACKGROUND', (1, 4), (1, 4), colors.HexColor('#90EE90')),
]))
story.append(summary_table)
story.append(Spacer(1, 20))

# ============================================
# NEW INDUSTRIES RECOMMENDATIONS
# ============================================
story.append(Paragraph("<b>6. NUEVAS INDUSTRIAS RECOMENDADAS</b>", heading1_style))

story.append(Paragraph("""
Basado en el analisis del mercado, estas son las industrias con mayor potencial de ingreso, 
necesidad critica de sistemas, y capacidad de pago:
""", body_style))

story.append(Paragraph("<b>6.1 RESTAURANTES / FOOD SERVICE</b>", heading2_style))

restaurant_data = [
    [Paragraph('<b>Metrica</b>', cell_style), 
     Paragraph('<b>Valor</b>', cell_style)],
    [Paragraph('Tamano Mercado Global', cell_left), 
     Paragraph('$3.5 trillones (2024)', cell_style)],
    [Paragraph('Software Restaurant Market', cell_left), 
     Paragraph('$6.8 billones, creciendo 14.5%', cell_style)],
    [Paragraph('Lideres: Toast, Square, Clover', cell_left), 
     Paragraph('$79-165/mes + hardware', cell_style)],
    [Paragraph('Necesidad', cell_left), 
     Paragraph('ALTA - Operacion diaria critica', cell_style)],
    [Paragraph('Capacidad Pago', cell_left), 
     Paragraph('ALTA - Margenes 15-25%', cell_style)],
]

restaurant_table = Table(restaurant_data, colWidths=[2.5*inch, 2.5*inch])
restaurant_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FF6B35')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(restaurant_table)
story.append(Spacer(1, 8))
story.append(Paragraph("""
<b>Por que Restaurantes:</b> Todos los dias necesitan tomar ordenes, gestionar inventario de ingredientes, 
controlar mesas, manejar delivery. Es un mercado de "usar o morir". Toast crecio de startup a IPO 
de $18B en 10 anos. En el Caribe hay pocos competidores locales.
""", body_style))

story.append(Paragraph("<b>6.2 FARMACIAS</b>", heading2_style))

pharmacy_data = [
    [Paragraph('<b>Metrica</b>', cell_style), 
     Paragraph('<b>Valor</b>', cell_style)],
    [Paragraph('Tamano Mercado Global', cell_left), 
     Paragraph('$1.4 trillones (2024)', cell_style)],
    [Paragraph('Pharmacy Software Market', cell_left), 
     Paragraph('$72 billones, creciendo 10.2%', cell_style)],
    [Paragraph('Lideres: PioneerRx, QS/1, McKesson', cell_left), 
     Paragraph('$300-800/mes', cell_style)],
    [Paragraph('Necesidad', cell_left), 
     Paragraph('CRITICA - Regulacion estricta', cell_style)],
    [Paragraph('Capacidad Pago', cell_left), 
     Paragraph('MUY ALTA - Margenes 20-30%', cell_style)],
]

pharmacy_table = Table(pharmacy_data, colWidths=[2.5*inch, 2.5*inch])
pharmacy_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4CAF50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(pharmacy_table)
story.append(Spacer(1, 8))
story.append(Paragraph("""
<b>Por que Farmacias:</b> Necesitan gestion de inventario con fechas de vencimiento, control de medicamentos 
controlados, interacciones farmacologicas, integracion con seguros. Margenes altos y pagan bien 
por software que automatice su operacion. Pocas soluciones locales en el Caribe.
""", body_style))

story.append(Paragraph("<b>6.3 CONSTRUCTORAS / CONTRATISTAS</b>", heading2_style))

construction_data = [
    [Paragraph('<b>Metrica</b>', cell_style), 
     Paragraph('<b>Valor</b>', cell_style)],
    [Paragraph('Tamano Mercado Global', cell_left), 
     Paragraph('$14.4 trillones (2024)', cell_style)],
    [Paragraph('Construction Software Market', cell_left), 
     Paragraph('$2.1 billones, creciendo 9.8%', cell_style)],
    [Paragraph('Lideres: Procore, Buildertrend, CoConstruct', cell_left), 
     Paragraph('$200-500/mes', cell_style)],
    [Paragraph('Necesidad', cell_left), 
     Paragraph('ALTA - Proyectos complejos', cell_style)],
    [Paragraph('Capacidad Pago', cell_left), 
     Paragraph('ALTA - Proyectos de alto valor', cell_style)],
]

construction_table = Table(construction_data, colWidths=[2.5*inch, 2.5*inch])
construction_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FF9800')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(construction_table)
story.append(Spacer(1, 8))
story.append(Paragraph("""
<b>Por que Constructoras:</b> Gestion de proyectos, presupuesto, subcontratistas, certificados de pago, 
control de equipos y materiales. Proyecto promedio en el Caribe es de cientos de miles de dolares, 
pueden pagar software de calidad. Mucho trabajo gubernamental que requiere documentacion.
""", body_style))

story.append(Paragraph("<b>6.4 AGENCIAS INMOBILIARIAS</b>", heading2_style))

realestate_data = [
    [Paragraph('<b>Metrica</b>', cell_style), 
     Paragraph('<b>Valor</b>', cell_style)],
    [Paragraph('Tamano Mercado Global', cell_left), 
     Paragraph('$11.1 trillones (2024)', cell_style)],
    [Paragraph('Real Estate Software Market', cell_left), 
     Paragraph('$12.8 billones, creciendo 8.7%', cell_style)],
    [Paragraph('Lideres: Salesforce, BoomTown, Follow Up Boss', cell_left), 
     Paragraph('$100-500/mes', cell_style)],
    [Paragraph('Necesidad', cell_left), 
     Paragraph('ALTA - Leads y propiedades', cell_style)],
    [Paragraph('Capacidad Pago', cell_left), 
     Paragraph('MUY ALTA - Comisiones altas', cell_style)],
]

realestate_table = Table(realestate_data, colWidths=[2.5*inch, 2.5*inch])
realestate_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2196F3')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(realestate_table)
story.append(Spacer(1, 8))
story.append(Paragraph("""
<b>Por que Inmobiliarias:</b> Gestion de propiedades, leads de clientes, CRM, contratos de alquiler/venta, 
portal de propiedades. Comisiones de 3-6% en ventas de propiedades significa alta capacidad de pago. 
Mercado activo en Trinidad, Barbados, Jamaica.
""", body_style))

story.append(PageBreak())

# ============================================
# FINAL RECOMMENDATIONS
# ============================================
story.append(Paragraph("<b>7. RECOMENDACIONES FINALES</b>", heading1_style))

story.append(Paragraph("<b>7.1 Priorizacion de Desarrollo</b>", heading2_style))

priority_data = [
    [Paragraph('<b>Prioridad</b>', cell_style), 
     Paragraph('<b>Industria</b>', cell_style), 
     Paragraph('<b>Razon</b>', cell_style)],
    [Paragraph('1', cell_style), 
     Paragraph('Belleza', cell_style), 
     Paragraph('Ya competitivo, completar app cliente', cell_style)],
    [Paragraph('2', cell_style), 
     Paragraph('Clinicas', cell_style), 
     Paragraph('Mercado grande, agregar telemedicina', cell_style)],
    [Paragraph('3', cell_style), 
     Paragraph('Restaurantes (NUEVO)', cell_style), 
     Paragraph('Mercado masivo, necesidad diaria', cell_style)],
    [Paragraph('4', cell_style), 
     Paragraph('Farmacias (NUEVO)', cell_style), 
     Paragraph('Margenes altos, pocos competidores locales', cell_style)],
    [Paragraph('5', cell_style), 
     Paragraph('Bufetes', cell_style), 
     Paragraph('Agregar portal clientes e IA', cell_style)],
    [Paragraph('6', cell_style), 
     Paragraph('Constructoras (NUEVO)', cell_style), 
     Paragraph('Proyectos de alto valor', cell_style)],
    [Paragraph('7', cell_style), 
     Paragraph('Inmobiliarias (NUEVO)', cell_style), 
     Paragraph('Comisiones altas', cell_style)],
    [Paragraph('8', cell_style), 
     Paragraph('Enfermeria', cell_style), 
     Paragraph('Requiere inversion significativa', cell_style)],
]

priority_table = Table(priority_data, colWidths=[0.8*inch, 1.6*inch, 2.8*inch])
priority_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(priority_table)
story.append(Spacer(1, 20))

story.append(Paragraph("<b>7.2 Diferenciadores Clave para el Caribe</b>", heading2_style))
story.append(Paragraph("""
<b>1. Precio en Moneda Local:</b> TT$, JMD, BBD, XCD - Sin conversion a USD
<br/><br/>
<b>2. Regulaciones Locales:</b> Cumplimiento con leyes de Trinidad & Tobago, Jamaica, Barbados
<br/><br/>
<b>3. Soporte en Espanol:</b> Mercado hispano del Caribe (Republica Dominicana, Cuba, Puerto Rico)
<br/><br/>
<b>4. Integracion WiPay:</b> Pasarela de pago local ya implementada
<br/><br/>
<b>5. Sin Dependencia de QuickBooks:</b> Contabilidad integrada
<br/><br/>
<b>6. Multi-tenant:</b> Una plataforma para todas las industrias
""", body_style))

# Build PDF
doc.build(story)
print("Competitive analysis PDF generated successfully!")
