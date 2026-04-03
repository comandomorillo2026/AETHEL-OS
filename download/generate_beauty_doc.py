from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/NexusOS_Beauty_Documentacion.pdf",
    pagesize=letter,
    title="NexusOS Beauty - Documentacion",
    author='Z.ai',
    creator='Z.ai',
    subject='Sistema de Gestion para Salones de Belleza'
)

styles = getSampleStyleSheet()

# Custom styles
styles.add(ParagraphStyle(
    name='CoverTitle',
    fontName='Times New Roman',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#EC4899')
))

styles.add(ParagraphStyle(
    name='CoverSubtitle',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    spaceAfter=30,
    textColor=colors.HexColor('#6B7280')
))

styles.add(ParagraphStyle(
    name='SectionTitle',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=12,
    textColor=colors.HexColor('#EC4899')
))

styles.add(ParagraphStyle(
    name='SubsectionTitle',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=8,
    textColor=colors.HexColor('#8B5CF6')
))

styles.add(ParagraphStyle(
    name='BodyPara',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=8
))

styles.add(ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER
))

styles.add(ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
))

story = []

# Cover Page
story.append(Spacer(1, 120))
story.append(Paragraph("<b>NexusOS Beauty</b>", styles['CoverTitle']))
story.append(Spacer(1, 20))
story.append(Paragraph("Sistema de Gestion Integral para Salones de Belleza", styles['CoverSubtitle']))
story.append(Spacer(1, 40))
story.append(Paragraph("Documentacion Completa del Sistema", styles['CoverSubtitle']))
story.append(Spacer(1, 60))
story.append(Paragraph("Version 1.0 - Marzo 2026", styles['CoverSubtitle']))
story.append(Spacer(1, 20))
story.append(Paragraph("Desarrollado por Z.ai", styles['CoverSubtitle']))
story.append(PageBreak())

# Section 1: Introduccion
story.append(Paragraph("<b>1. Introduccion</b>", styles['SectionTitle']))
story.append(Paragraph(
    "NexusOS Beauty es un sistema de gestion integral disenado especificamente para salones de belleza, barberias, spas y centros de estetica en el Caribe. Este sistema proporciona herramientas completas para la administracion de citas, punto de venta, gestion de clientes, control de inventario, gestion financiera y contabilidad real que ningun otro sistema en el mercado ofrece.",
    styles['BodyPara']
))
story.append(Paragraph(
    "A diferencia de sistemas como Vagaro, Mindbody, Fresha o Square Appointments, NexusOS Beauty incluye funcionalidades unicas como gestion de gastos operativos (alquiler, electricidad, agua, AC, mantenimiento), sistema tributario adaptado a Trinidad y Tobago, y contabilidad integrada que facilita el trabajo del contador profesional.",
    styles['BodyPara']
))

story.append(Spacer(1, 12))

# Section 2: Comparacion con Competencia
story.append(Paragraph("<b>2. Comparacion con Sistemas Existentes</b>", styles['SectionTitle']))

# Comparison table
header_style = ParagraphStyle(name='THead', fontName='Times New Roman', fontSize=10, textColor=colors.white, alignment=TA_CENTER)
cell_style = ParagraphStyle(name='TCell', fontName='Times New Roman', fontSize=9, alignment=TA_CENTER)

data = [
    [Paragraph('<b>Sistema</b>', header_style), Paragraph('<b>Precio/mes</b>', header_style), 
     Paragraph('<b>Contabilidad</b>', header_style), Paragraph('<b>Impuestos</b>', header_style), 
     Paragraph('<b>Gastos Op.</b>', header_style)],
    [Paragraph('Vagaro', cell_style), Paragraph('$25-85', cell_style), 
     Paragraph('No', cell_style), Paragraph('No', cell_style), Paragraph('No', cell_style)],
    [Paragraph('Mindbody', cell_style), Paragraph('$129-349', cell_style), 
     Paragraph('No', cell_style), Paragraph('Basico', cell_style), Paragraph('No', cell_style)],
    [Paragraph('Fresha', cell_style), Paragraph('Variable', cell_style), 
     Paragraph('No', cell_style), Paragraph('No', cell_style), Paragraph('No', cell_style)],
    [Paragraph('Square', cell_style), Paragraph('$0-60', cell_style), 
     Paragraph('No', cell_style), Paragraph('No', cell_style), Paragraph('No', cell_style)],
    [Paragraph('Zenoti', cell_style), Paragraph('$200+', cell_style), 
     Paragraph('Basico', cell_style), Paragraph('Basico', cell_style), Paragraph('No', cell_style)],
    [Paragraph('<b>NexusOS Beauty</b>', cell_style), Paragraph('<b>TT$800-4,500</b>', cell_style), 
     Paragraph('<b>Si</b>', cell_style), Paragraph('<b>Si</b>', cell_style), Paragraph('<b>Si</b>', cell_style)],
]

table = Table(data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EC4899')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F9FAFB')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F9FAFB')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#EC489910')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(table)
story.append(Spacer(1, 18))

# Section 3: Modulos del Sistema
story.append(Paragraph("<b>3. Modulos del Sistema</b>", styles['SectionTitle']))

modules = [
    ("Dashboard Principal", "Vista general con metricas clave: ventas del dia, clientes atendidos, citas programadas, alertas de gastos pendientes, stock bajo, y rendimiento del equipo."),
    ("Gestion de Citas", "Calendario visual por estilista, recordatorios automaticos, gestion de walk-ins, depositos para servicios premium."),
    ("Punto de Venta (POS)", "POS intuitivo para ventas rapidas, asignacion de estilistas, descuentos, impuestos automaticos, calculo de comisiones."),
    ("Gestion de Clientes", "Base de datos con historial, membresias, puntos de lealtad, fotos antes/despues."),
    ("Gestion del Equipo", "Empleados con roles, niveles, especializaciones, horarios, comisiones personalizadas."),
    ("Servicios y Precios", "Catalogo organizado por categorias, precios, duracion, comisiones."),
    ("Inventario", "Control de stock, alertas, costos, margenes, movimientos."),
    ("Finanzas", "Gastos operativos (alquiler, electricidad, agua, AC, etc.), gastos recurrentes, alertas de vencimiento."),
    ("Impuestos", "Sistema tributario TT: VAT, Business Levy, National Insurance, Health Surcharge, Green Fund."),
    ("Contabilidad", "Plan de cuentas, doble entrada, balance general, estado de resultados, exportacion para contador."),
    ("Reportes", "Ventas, rendimiento, servicios populares, analisis de clientes, estados financieros."),
]

for title, desc in modules:
    story.append(Paragraph(f"<b>3.{modules.index((title, desc))+1} {title}</b>", styles['SubsectionTitle']))
    story.append(Paragraph(desc, styles['BodyPara']))

story.append(PageBreak())

# Section 4: Entidades de Base de Datos
story.append(Paragraph("<b>4. Estructura de Base de Datos (25+ Entidades)</b>", styles['SectionTitle']))

entities = [
    ("BeautyBranch", "Sucursales para cadenas"),
    ("BeautyStaff", "Empleados y comisiones"),
    ("BeautyClient", "Clientes y membresias"),
    ("BeautyService", "Catalogo de servicios"),
    ("BeautyProduct", "Inventario"),
    ("BeautyAppointment", "Citas y reservas"),
    ("BeautySale", "Ventas POS"),
    ("BeautyCommission", "Comisiones"),
    ("BeautyMembership", "Planes de membresia"),
    ("BeautyExpense", "Gastos operativos"),
    ("BeautyTaxPayment", "Pagos de impuestos"),
    ("BeautyAccountingEntry", "Asientos contables"),
    ("BeautyChartOfAccounts", "Plan de cuentas"),
    ("BeautyFinancialReport", "Reportes financieros"),
    ("BeautySettings", "Configuracion"),
]

data2 = [[Paragraph('<b>Entidad</b>', header_style), Paragraph('<b>Descripcion</b>', header_style)]]
for entity, desc in entities:
    data2.append([Paragraph(entity, cell_style), Paragraph(desc, cell_style)])

table2 = Table(data2, colWidths=[2.5*inch, 4*inch])
table2.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B5CF6')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(table2)
story.append(Spacer(1, 18))

# Section 5: Planes de Precio
story.append(Paragraph("<b>5. Planes de Precio</b>", styles['SectionTitle']))

pricing = [
    ["STARTER", "TT$800/mes", "1-3 empleados", "1 sucursal, 200 clientes, basico"],
    ["GROWTH", "TT$1,500/mes", "4-6 empleados", "1 sucursal, ilimitado, POS"],
    ["PREMIUM", "TT$2,800/mes", "7-10 empleados", "2 sucursales, finanzas"],
    ["ENTERPRISE", "TT$4,500/mes", "11+ empleados", "Ilimitado, soporte 24/7"],
]

data3 = [
    [Paragraph('<b>Plan</b>', header_style), Paragraph('<b>Precio</b>', header_style), 
     Paragraph('<b>Capacidad</b>', header_style), Paragraph('<b>Incluye</b>', header_style)]
]
for row in pricing:
    data3.append([Paragraph(row[0], cell_style), Paragraph(row[1], cell_style), 
                  Paragraph(row[2], cell_style), Paragraph(row[3], cell_style)])

table3 = Table(data3, colWidths=[1.5*inch, 1.3*inch, 1.5*inch, 2.2*inch])
table3.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EC4899')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(table3)
story.append(Spacer(1, 12))
story.append(Paragraph("Activacion: TT$1,250 (unico) | Descuento anual: 15% + 1 mes gratis", styles['BodyPara']))

story.append(Spacer(1, 18))

# Section 6: Ventajas Unicas
story.append(Paragraph("<b>6. Ventajas Unicas vs Competencia</b>", styles['SectionTitle']))

advantages = [
    "1. Contabilidad Real: Sistema de doble entrada con plan de cuentas y exportacion para contadores.",
    "2. Gestion de Gastos Operativos: Alquiler, electricidad, agua, internet, AC, mantenimiento con alertas.",
    "3. Sistema Tributario Local: Adaptado a Trinidad y Tobago con VAT, Business Levy, National Insurance.",
    "4. Multi-locacion Nativo: Gestion de cadenas con consolidacion de reportes.",
    "5. Comisiones Flexibles: Por servicio, por producto, o por niveles de empleado.",
    "6. Membresias y Lealtad: Niveles (Bronce, Plata, Oro, Platino) con descuentos automaticos.",
    "7. Precio Competitivo: Hasta 10x mas economico que Mindbody o Zenoti con mas funcionalidades.",
]

for adv in advantages:
    story.append(Paragraph(adv, styles['BodyPara']))

# Section 7: Tecnologias
story.append(Paragraph("<b>7. Stack Tecnologico</b>", styles['SectionTitle']))
story.append(Paragraph(
    "Frontend: Next.js 14+ con React, TypeScript, Tailwind CSS<br/>"
    "Backend: Next.js API Routes con Prisma ORM<br/>"
    "Base de Datos: SQLite (desarrollo) / PostgreSQL (produccion)<br/>"
    "Pasarelas: WiPay (Trinidad), Stripe (Internacional)<br/>"
    "PWA: Funciona en escritorio y movil sin instalar app",
    styles['BodyPara']
))

# Build PDF
doc.build(story)
print("PDF generated successfully!")
