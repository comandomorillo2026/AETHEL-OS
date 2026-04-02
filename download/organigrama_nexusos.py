from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

output_path = '/home/z/my-project/download/Organigrama_NexusOS.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    rightMargin=50,
    leftMargin=50,
    topMargin=50,
    bottomMargin=50,
    title='Organigrama NexusOS',
    author='Z.ai',
    creator='Z.ai',
    subject='Organigrama de navegacion del sistema NexusOS'
)

styles = getSampleStyleSheet()

# Styles
title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times New Roman',
    fontSize=24,
    leading=30,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#6C3FCE')
)

h1_style = ParagraphStyle(
    name='H1Style',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=10,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='H2Style',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=15,
    spaceAfter=8,
    textColor=colors.HexColor('#6C3FCE')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=15,
    alignment=TA_LEFT,
    spaceAfter=8
)

# Box styles for the diagram
box_main = ParagraphStyle(
    name='BoxMain',
    fontName='Times New Roman',
    fontSize=10,
    leading=13,
    alignment=TA_CENTER,
    textColor=colors.white
)

box_industry = ParagraphStyle(
    name='BoxIndustry',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.white
)

box_auth = ParagraphStyle(
    name='BoxAuth',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.black
)

box_dashboard = ParagraphStyle(
    name='BoxDashboard',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.white
)

box_label = ParagraphStyle(
    name='BoxLabel',
    fontName='Times New Roman',
    fontSize=8,
    leading=10,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)

story = []

# TITLE
story.append(Paragraph("<b>ORGANIGRAMA DE NAVEGACION</b>", title_style))
story.append(Paragraph("Sistema NexusOS - Flujo de Paginas", ParagraphStyle(
    name='Subtitle', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER, textColor=colors.HexColor('#9D7BEA')
)))
story.append(Spacer(1, 20))

# ========== SECTION 1: VISITOR FLOW ==========
story.append(Paragraph("<b>1. FLUJO DEL VISITANTE (Usuario NO Registrado)</b>", h1_style))
story.append(Paragraph("""
Cuando alguien entra a tu dominio (ej: nexusos.vercel.app), ve el siguiente recorrido:
""", body_style))

# Main entry point diagram
entry_data = [
    [Paragraph('<b>DOMINIO PRINCIPAL</b><br/>nexusos.vercel.app', box_main)]
]
entry_table = Table(entry_data, colWidths=[450])
entry_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#6C3FCE')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 15),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
    ('ROUNDEDCORNERS', [8, 8, 8, 8]),
]))
story.append(entry_table)
story.append(Spacer(1, 5))
story.append(Paragraph("[ La persona escribe tu URL en el navegador ]", box_label))
story.append(Spacer(1, 15))

# Arrow down
arrow_down = Paragraph('<b>v</b>', ParagraphStyle(name='Arrow', fontName='Times New Roman', fontSize=20, alignment=TA_CENTER, textColor=colors.HexColor('#F0B429')))
story.append(arrow_down)
story.append(Spacer(1, 5))

# Landing page (THE OFFICE)
story.append(Paragraph("<b>PAGINA DE INICIO / - LA OFICINA</b>", h2_style))

office_desc = """
Esta es la pagina principal donde los visitantes conocen quien eres y que vendes. Funciona como una recepcion:
"""
story.append(Paragraph(office_desc, body_style))

office_data = [
    [Paragraph('<b>PAGINA DE INICIO (/)</b><br/><br/>La Oficina Virtual<br/><br/>Contenido:<br/>- Quienes somos<br/>- Que ofrecemos<br/>- Beneficios<br/>- Boton "Ver Planes"<br/>- Boton "Iniciar Sesion"', box_main)]
]
office_table = Table(office_data, colWidths=[450])
office_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0B429')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
]))
story.append(office_table)
story.append(Spacer(1, 5))
story.append(Paragraph("[ El visitante lee sobre NexusOS y decide si le interesa ]", box_label))
story.append(Spacer(1, 15))

# Two paths from office
story.append(Paragraph("<b>DESDE LA OFICINA, EL VISITANTE PUEDE IR A:</b>", h2_style))

# Split diagram
split_data = [
    [Paragraph('<b>Ver Planes</b><br/>Ir a Portales<br/>de Ventas', box_auth), 
     Paragraph('    ', body_style),
     Paragraph('<b>Iniciar Sesion</b><br/>Ir a Login<br/>(ya tiene cuenta)', box_auth)]
]
split_table = Table(split_data, colWidths=[200, 50, 200])
split_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#E0E0E0')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#E0E0E0')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ('BOX', (0, 0), (0, 0), 1, colors.HexColor('#999999')),
    ('BOX', (2, 0), (2, 0), 1, colors.HexColor('#999999')),
]))
story.append(split_table)
story.append(Spacer(1, 20))

# ========== PORTAL DE VENTAS ==========
story.append(Paragraph("<b>2. PORTAL DE VENTAS - Mostrador de Productos</b>", h1_style))

portal_desc = """
El Portal de Ventas (/portal) es como un "mostrador" donde el visitante ve todas las industrias disponibles 
y puede hacer clic en la que le interese para ver detalles y precios especificos:
"""
story.append(Paragraph(portal_desc, body_style))

# Portal main
portal_data = [
    [Paragraph('<b>PORTAL DE VENTAS (/portal)</b><br/><br/>El Mostrador Principal<br/><br/>- Lista de todas las industrias<br/>- Boton "Solicitar Demo"<br/>- FAQ<br/>- Precios generales', box_main)]
]
portal_table = Table(portal_data, colWidths=[450])
portal_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#3B82F6')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 12),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
]))
story.append(portal_table)
story.append(Spacer(1, 10))

# Arrow
story.append(Paragraph('<b>v</b>', ParagraphStyle(name='Arrow2', fontName='Times New Roman', fontSize=16, alignment=TA_CENTER, textColor=colors.HexColor('#22D3EE'))))
story.append(Spacer(1, 5))

# Industries grid
story.append(Paragraph("<b>INDUSTRIAS DISPONIBLES (Cada una con su propia pagina de venta):</b>", h2_style))

industries_data = [
    [Paragraph('<b>CLINICA</b><br/>/portal/clinic<br/><br/>Info y precios<br/>para clinicas', box_industry),
     Paragraph('<b>ENFERMERIA</b><br/>/portal/nurse<br/><br/>Info y precios<br/>para enfermeras', box_industry),
     Paragraph('<b>BUFETES</b><br/>/portal/lawfirm<br/><br/>Info y precios<br/>para abogados', box_industry),
     Paragraph('<b>BELLEZA</b><br/>/portal/beauty<br/><br/>Info y precios<br/>para salones', box_industry)],
    [Paragraph('<b>RETAIL</b><br/>/portal/retail<br/><br/>Info y precios<br/>para tiendas', box_industry),
     Paragraph('<b>PANADERIA</b><br/>/portal/bakery<br/><br/>Info y precios<br/>para panaderias', box_industry),
     Paragraph('<b>TELEMEDICINA</b><br/>/telemedicina<br/><br/>Info de servicio<br/>telemedico', box_industry),
     Paragraph('<b>PORTAL PACIENTE</b><br/>/portal-paciente<br/><br/>Para pacientes<br/>existentes', box_industry)]
]

industries_table = Table(industries_data, colWidths=[112, 112, 112, 112])
industries_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#22D3EE')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#34D399')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#C4A35A')),
    ('BACKGROUND', (3, 0), (3, 0), colors.HexColor('#EC4899')),
    ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#F59E0B')),
    ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#F87171')),
    ('BACKGROUND', (2, 1), (2, 1), colors.HexColor('#8B5CF6')),
    ('BACKGROUND', (3, 1), (3, 1), colors.HexColor('#6366F1')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('BOX', (0, 0), (-1, -1), 1, colors.white),
    ('INNERGRID', (0, 0), (-1, -1), 2, colors.white),
]))
story.append(industries_table)
story.append(Spacer(1, 5))
story.append(Paragraph("[ Cada industria tiene PRECIOS DIFERENTES segun sus necesidades ]", box_label))

story.append(PageBreak())

# ========== SECTION 3: REGISTRATION FLOW ==========
story.append(Paragraph("<b>3. FLUJO DE REGISTRO (Nuevo Cliente)</b>", h1_style))

story.append(Paragraph("""
Cuando un visitante quiere contratar NexusOS, debe registrarse. El flujo es:
""", body_style))

# Registration flow
reg_data = [
    [Paragraph('<b>1. SOLICITAR DEMO</b><br/>En cualquier portal<br/>de industria', box_auth),
     Paragraph('->', ParagraphStyle(name='Arrow', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)),
     Paragraph('<b>2. FORMULARIO</b><br/>Nombre, email,<br/>telefono, industria', box_auth),
     Paragraph('->', ParagraphStyle(name='Arrow', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)),
     Paragraph('<b>3. TU RECIBES</b><br/>Notificacion por<br/>email', box_auth),
     Paragraph('->', ParagraphStyle(name='Arrow', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)),
     Paragraph('<b>4. CREAS CUENTA</b><br/>Desde tu Admin<br/>creas su tenant', box_auth)]
]
reg_table = Table(reg_data, colWidths=[85, 30, 85, 30, 85, 30, 85])
reg_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#E8F5E9')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#E3F2FD')),
    ('BACKGROUND', (4, 0), (4, 0), colors.HexColor('#FFF3E0')),
    ('BACKGROUND', (6, 0), (6, 0), colors.HexColor('#F3E5F5')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (0, 0), 1, colors.HexColor('#4CAF50')),
    ('BOX', (2, 0), (2, 0), 1, colors.HexColor('#2196F3')),
    ('BOX', (4, 0), (4, 0), 1, colors.HexColor('#FF9800')),
    ('BOX', (6, 0), (6, 0), 1, colors.HexColor('#9C27B0')),
]))
story.append(reg_table)
story.append(Spacer(1, 15))

# What happens after
story.append(Paragraph("<b>QUE PASA DESPUES DEL REGISTRO:</b>", h2_style))
after_reg = """
<b>1. Tu (como SUPER_ADMIN) recibes un email con los datos del interesado</b><br/>
<b>2. Entras a tu Torre de Control (/admin)</b><br/>
<b>3. Creas el tenant (espacio de trabajo) para ese cliente</b><br/>
<b>4. El sistema envia automaticamente un email al cliente con sus credenciales</b><br/>
<b>5. El cliente hace clic en el enlace y activa su cuenta</b>
"""
story.append(Paragraph(after_reg, body_style))

# ========== SECTION 4: LOGIN FLOW ==========
story.append(Spacer(1, 20))
story.append(Paragraph("<b>4. FLUJO DE LOGIN (Usuario YA Registrado)</b>", h1_style))

# Login diagram
login_data = [
    [Paragraph('<b>PAGINA LOGIN</b><br/>/login<br/><br/>Email y Contrasena', box_auth)]
]
login_table = Table(login_data, colWidths=[200])
login_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E8EAF6')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#3F51B5')),
]))
story.append(login_table)
story.append(Spacer(1, 5))
story.append(Paragraph('<b>v</b>', ParagraphStyle(name='Arrow3', fontName='Times New Roman', fontSize=16, alignment=TA_CENTER)))
story.append(Spacer(1, 5))

# Sistema detecta rol
story.append(Paragraph("<b>EL SISTEMA DETECTA AUTOMATICAMENTE:</b>", h2_style))

role_data = [
    [Paragraph('<b>SUPER_ADMIN</b><br/>(Tu, el dueno)<br/><br/>Va a:<br/>/admin<br/>Torre de Control', box_dashboard),
     Paragraph('<b>TENANT_ADMIN</b><br/>(Dueno de clinica<br/>o salon)<br/><br/>Va a su dashboard<br/>/clinic, /beauty, etc.', box_dashboard),
     Paragraph('<b>TENANT_USER</b><br/>(Empleado de<br/>un tenant)<br/><br/>Va a su dashboard<br/>segun su industria', box_dashboard)]
]
role_table = Table(role_data, colWidths=[150, 150, 150])
role_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F0B429')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#22D3EE')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#34D399')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ('BOX', (0, 0), (-1, -1), 1, colors.white),
    ('INNERGRID', (0, 0), (-1, -1), 2, colors.white),
]))
story.append(role_table)

story.append(PageBreak())

# ========== SECTION 5: AUTHENTICATED USER ==========
story.append(Paragraph("<b>5. VISTA DEL USUARIO AUTENTICADO</b>", h1_style))

story.append(Paragraph("""
Una vez que el usuario inicia sesion, su experiencia cambia completamente. Ya no ve las paginas de venta, 
sino su espacio de trabajo privado:
""", body_style))

# Authenticated user flow
auth_header = [
    [Paragraph('<b>USUARIO AUTENTICADO - SU ESPACIO DE TRABAJO</b>', box_main)]
]
auth_header_table = Table(auth_header, colWidths=[450])
auth_header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#6C3FCE')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(auth_header_table)
story.append(Spacer(1, 10))

# Dashboard options
dash_data = [
    [Paragraph('<b>CLINICA</b><br/>/clinic<br/><br/>Dashboard, Pacientes<br/>Citas, Facturacion<br/>Recetas, Lab<br/>Inventario, Reportes', box_dashboard),
     Paragraph('<b>ENFERMERIA</b><br/>/nurse<br/><br/>Dashboard SBAR<br/>MAR (medicamentos)<br/>Signos Vitales<br/>Notas, Protocolos', box_dashboard),
     Paragraph('<b>BELLEZA</b><br/>/beauty<br/><br/>Dashboard, Citas<br/>POS, Clientes<br/>Servicios, Productos<br/>Finanzas, Contabilidad', box_dashboard),
     Paragraph('<b>BUFETES</b><br/>/lawfirm<br/><br/>Dashboard, Casos<br/>Clientes, Documentos<br/>Calendario, Tiempo<br/>Facturacion, Trust', box_dashboard)]
]
dash_table = Table(dash_data, colWidths=[112, 112, 112, 112])
dash_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#22D3EE')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#34D399')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#EC4899')),
    ('BACKGROUND', (3, 0), (3, 0), colors.HexColor('#C4A35A')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 1, colors.white),
    ('INNERGRID', (0, 0), (-1, -1), 2, colors.white),
]))
story.append(dash_table)
story.append(Spacer(1, 15))

# ========== SECTION 6: ADMIN VIEW ==========
story.append(Paragraph("<b>6. VISTA DEL SUPER_ADMIN (Tu - El Dueno)</b>", h1_style))

story.append(Paragraph("""
Como dueno de NexusOS, tu tienes acceso a la TORRE DE CONTROL desde donde ves TODO:
""", body_style))

admin_data = [
    [Paragraph('<b>TORRE DE CONTROL /admin</b><br/><br/>SOLO PARA TI (SUPER_ADMIN)<br/><br/>- Ver todos los tenants<br/>- Crear nuevos tenants<br/>- Ver todas las ordenes<br/>- Ver todos los usuarios<br/>- Configurar precios<br/>- Acceder a cualquier industria', box_main)]
]
admin_table = Table(admin_data, colWidths=[450])
admin_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0B429')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 15),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
story.append(admin_table)
story.append(Spacer(1, 15))

# Quick access to all
story.append(Paragraph("<b>DESDE TU TORRE DE CONTROL PUEDES IR A:</b>", h2_style))

admin_links = [
    [Paragraph('/clinic', box_auth), 
     Paragraph('/nurse', box_auth), 
     Paragraph('/beauty', box_auth), 
     Paragraph('/lawfirm', box_auth),
     Paragraph('/home', box_auth)]
]
admin_links_table = Table(admin_links, colWidths=[90, 90, 90, 90, 90])
admin_links_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E8EAF6')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#6C3FCE')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#6C3FCE')),
]))
story.append(admin_links_table)
story.append(Spacer(1, 5))
story.append(Paragraph("[ Como Super Admin puedes entrar a CUALQUIER dashboard sin restricciones ]", box_label))

story.append(PageBreak())

# ========== SECTION 7: COMPLETE DIAGRAM ==========
story.append(Paragraph("<b>7. DIAGRAMA COMPLETO DEL SISTEMA</b>", h1_style))

story.append(Paragraph("""
Este diagrama muestra todas las paginas y como se conectan:
""", body_style))

# Level 0 - Entry
story.append(Paragraph("<b>NIVEL 0: Entrada Principal</b>", h2_style))
l0_data = [[Paragraph('<b>/ (LANDING - OFICINA)</b>', box_main)]]
l0_table = Table(l0_data, colWidths=[450])
l0_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0B429')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(l0_table)
story.append(Spacer(1, 5))

# Level 1 - Public pages
story.append(Paragraph("<b>NIVEL 1: Paginas Publicas (No requieren login)</b>", h2_style))
l1_data = [
    [Paragraph('/portal', box_auth), 
     Paragraph('/login', box_auth), 
     Paragraph('/register', box_auth)]
]
l1_table = Table(l1_data, colWidths=[150, 150, 150])
l1_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E3F2FD')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#2196F3')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#2196F3')),
]))
story.append(l1_table)
story.append(Spacer(1, 5))

# Level 2 - Industry portals
story.append(Paragraph("<b>NIVEL 2: Portales de Industria (Paginas de venta con precios)</b>", h2_style))
l2_data = [
    [Paragraph('/portal/clinic', box_industry), 
     Paragraph('/portal/nurse', box_industry), 
     Paragraph('/portal/beauty', box_industry), 
     Paragraph('/portal/lawfirm', box_industry)],
    [Paragraph('/portal/retail', box_industry), 
     Paragraph('/portal/bakery', box_industry), 
     Paragraph('/telemedicina', box_industry), 
     Paragraph('/portal-paciente', box_industry)]
]
l2_table = Table(l2_data, colWidths=[112, 112, 112, 112])
l2_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#3B82F6')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('BOX', (0, 0), (-1, -1), 1, colors.white),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.white),
]))
story.append(l2_table)
story.append(Spacer(1, 5))

# Level 3 - Auth pages
story.append(Paragraph("<b>NIVEL 3: Autenticacion y Recuperacion</b>", h2_style))
l3_data = [
    [Paragraph('/forgot-password', box_auth), 
     Paragraph('/reset-password', box_auth)]
]
l3_table = Table(l3_data, colWidths=[225, 225])
l3_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FFF3E0')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#FF9800')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#FF9800')),
]))
story.append(l3_table)
story.append(Spacer(1, 5))

# Level 4 - Private dashboards
story.append(Paragraph("<b>NIVEL 4: Dashboards Privados (Requieren login)</b>", h2_style))
l4_data = [
    [Paragraph('/admin<br/>SUPER_ADMIN', box_dashboard), 
     Paragraph('/clinic<br/>Clinicas', box_dashboard), 
     Paragraph('/nurse<br/>Enfermeria', box_dashboard), 
     Paragraph('/beauty<br/>Salones', box_dashboard),
     Paragraph('/lawfirm<br/>Bufetes', box_dashboard)]
]
l4_table = Table(l4_data, colWidths=[90, 90, 90, 90, 90])
l4_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F0B429')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#22D3EE')),
    ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#34D399')),
    ('BACKGROUND', (3, 0), (3, 0), colors.HexColor('#EC4899')),
    ('BACKGROUND', (4, 0), (4, 0), colors.HexColor('#C4A35A')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 1, colors.white),
    ('INNERGRID', (0, 0), (-1, -1), 2, colors.white),
]))
story.append(l4_table)
story.append(Spacer(1, 5))

# Level 5 - Checkout
story.append(Paragraph("<b>NIVEL 5: Pagos y Confirmaciones</b>", h2_style))
l5_data = [
    [Paragraph('/checkout/success', box_auth), 
     Paragraph('/checkout/cancel', box_auth)]
]
l5_table = Table(l5_data, colWidths=[225, 225])
l5_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#E8F5E9')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#FFEBEE')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('BOX', (0, 0), (0, 0), 1, colors.HexColor('#4CAF50')),
    ('BOX', (1, 0), (1, 0), 1, colors.HexColor('#F44336')),
]))
story.append(l5_table)
story.append(Spacer(1, 5))

# Level 6 - Hub
story.append(Paragraph("<b>NIVEL 6: Centro de Control (Hub interno)</b>", h2_style))
l6_data = [[Paragraph('/home<br/>Acceso rapido a todos los sistemas', box_main)]]
l6_table = Table(l6_data, colWidths=[450])
l6_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#6C3FCE')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(l6_table)

story.append(Spacer(1, 25))

# Legend
story.append(Paragraph("<b>LEYENDA DE COLORES:</b>", h2_style))
legend_data = [
    [Paragraph('Amarillo', box_main), Paragraph('Oro - Tu oficina/Admin', body_style)],
    [Paragraph('Azul', box_industry), Paragraph('Clinica / Portal', body_style)],
    [Paragraph('Verde', box_dashboard), Paragraph('Enfermeria / Exito', body_style)],
    [Paragraph('Rosa', box_dashboard), Paragraph('Belleza', body_style)],
    [Paragraph('Dorado', box_dashboard), Paragraph('Bufetes', body_style)],
    [Paragraph('Violeta', box_main), Paragraph('NexusOS / Hub', body_style)],
    [Paragraph('Gris', box_auth), Paragraph('Paginas publicas', body_style)],
]
legend_table = Table(legend_data, colWidths=[80, 370])
legend_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F0B429')),
    ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#3B82F6')),
    ('BACKGROUND', (0, 2), (0, 2), colors.HexColor('#34D399')),
    ('BACKGROUND', (0, 3), (0, 3), colors.HexColor('#EC4899')),
    ('BACKGROUND', (0, 4), (0, 4), colors.HexColor('#C4A35A')),
    ('BACKGROUND', (0, 5), (0, 5), colors.HexColor('#6C3FCE')),
    ('BACKGROUND', (0, 6), (0, 6), colors.HexColor('#E0E0E0')),
    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(legend_table)

# Build PDF
doc.build(story)
print(f"PDF generado: {output_path}")
