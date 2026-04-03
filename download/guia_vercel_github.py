from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')

# Create document
output_path = '/home/z/my-project/download/Guia_Vercel_GitHub_NexusOS.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    rightMargin=72,
    leftMargin=72,
    topMargin=72,
    bottomMargin=72,
    title='Guia Vercel GitHub NexusOS',
    author='Z.ai',
    creator='Z.ai',
    subject='Guia explicativa de Vercel y GitHub para el sistema NexusOS'
)

# Styles
styles = getSampleStyleSheet()

cover_title_style = ParagraphStyle(
    name='CoverTitle',
    fontName='Times New Roman',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    spaceAfter=36
)

cover_subtitle_style = ParagraphStyle(
    name='CoverSubtitle',
    fontName='Times New Roman',
    fontSize=18,
    leading=26,
    alignment=TA_CENTER,
    spaceAfter=48,
    textColor=colors.HexColor('#6C3FCE')
)

cover_author_style = ParagraphStyle(
    name='CoverAuthor',
    fontName='Times New Roman',
    fontSize=14,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=18
)

h1_style = ParagraphStyle(
    name='Heading1Custom',
    fontName='Times New Roman',
    fontSize=20,
    leading=28,
    alignment=TA_LEFT,
    spaceBefore=24,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='Heading2Custom',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    spaceBefore=18,
    spaceAfter=8,
    textColor=colors.HexColor('#6C3FCE')
)

h3_style = ParagraphStyle(
    name='Heading3Custom',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#F0B429')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=8
)

body_left_style = ParagraphStyle(
    name='BodyLeftStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    spaceAfter=8
)

tbl_header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
)

tbl_cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT
)

tbl_cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER
)

bullet_style = ParagraphStyle(
    name='BulletStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    leftIndent=20,
    spaceAfter=4
)

note_style = ParagraphStyle(
    name='NoteStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    leftIndent=20,
    textColor=colors.HexColor('#666666'),
    spaceAfter=8
)

caption_style = ParagraphStyle(
    name='Caption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER,
    textColor=colors.gray
)

story = []

# COVER PAGE
story.append(Spacer(1, 120))
story.append(Paragraph("<b>Guia de Vercel y GitHub</b>", cover_title_style))
story.append(Spacer(1, 36))
story.append(Paragraph("Para tu Sistema NexusOS", cover_subtitle_style))
story.append(Spacer(1, 48))
story.append(Paragraph("Aprende a desplegar y gestionar tu plataforma SaaS", cover_author_style))
story.append(Spacer(1, 18))
story.append(Paragraph("Paso a paso con explicaciones claras", cover_author_style))
story.append(Spacer(1, 60))
story.append(Paragraph("Marzo 2026", cover_author_style))
story.append(PageBreak())

# TABLE OF CONTENTS
story.append(Paragraph("<b>Indice de Contenidos</b>", h1_style))
story.append(Spacer(1, 12))

toc_items = [
    ("1. Que es GitHub y para que sirve", "Funciones principales y como usarlo con NexusOS"),
    ("2. Que es Vercel y para que sirve", "Plataforma de despliegue y hosting de aplicaciones"),
    ("3. Flujo de trabajo completo", "De tu codigo local a la aplicacion en vivo"),
    ("4. Pasos practicos en GitHub", "Crear cuenta, repositorio y subir codigo"),
    ("5. Pasos practicos en Vercel", "Conectar GitHub y desplegar NexusOS"),
    ("6. Configuracion de variables de entorno", "API keys y secretos en Vercel"),
    ("7. Dominios personalizados", "Conectar tu propio dominio"),
    ("8. Solucion de problemas comunes", "Errores frecuentes y como resolverlos"),
]

for title, desc in toc_items:
    story.append(Paragraph(f"<b>{title}</b>", body_left_style))
    story.append(Paragraph(desc, note_style))
    story.append(Spacer(1, 6))

story.append(PageBreak())

# SECTION 1: GITHUB
story.append(Paragraph("<b>1. Que es GitHub y para que sirve</b>", h1_style))

story.append(Paragraph("""
GitHub es una plataforma de desarrollo colaborativo que permite almacenar, gestionar y versionar codigo fuente. 
Piensa en GitHub como un "Google Drive para programadores" donde guardas todo tu codigo de forma segura y organizada. 
Es el lugar donde vive el codigo fuente de tu aplicacion NexusOS, permitiendo que multiples desarrolladores trabajen 
en el mismo proyecto sin sobrescribir el trabajo de otros.
""", body_style))

story.append(Paragraph("<b>Funciones principales de GitHub:</b>", h2_style))

github_functions = [
    "<b>Control de versiones (Git):</b> Cada cambio que hagas en el codigo queda registrado. Puedes volver a cualquier version anterior si algo sale mal. Es como tener un boton de 'deshacer' infinito para todo tu proyecto.",
    "<b>Almacenamiento en la nube:</b> Tu codigo no esta solo en tu computadora. Esta guardado en los servidores de GitHub, accesible desde cualquier lugar del mundo. Si tu computadora falla, tu codigo esta seguro.",
    "<b>Colaboracion:</b> Varios desarrolladores pueden trabajar en el mismo proyecto simultaneamente. GitHub gestiona los conflictos y fusiona los cambios de forma inteligente.",
    "<b>Documentacion:</b> Cada proyecto tiene un archivo README.md que explica que hace el proyecto, como instalarlo y como usarlo. Es la carta de presentacion de tu software.",
    "<b>Integracion continua:</b> Se conecta automaticamente con Vercel para desplegar tu aplicacion cada vez que haces cambios en el codigo.",
]

for func in github_functions:
    story.append(Paragraph(func, bullet_style))

story.append(Spacer(1, 12))
story.append(Paragraph("<b>Por que GitHub es esencial para NexusOS:</b>", h2_style))

story.append(Paragraph("""
Tu sistema NexusOS esta compuesto por mas de 170 archivos TypeScript, decenas de componentes React, configuraciones de 
base de datos, y mucho mas. GitHub es el "hogar" de todo este codigo. Cuando Vercel necesita desplegar tu aplicacion, 
va a GitHub, descarga la ultima version del codigo, y lo convierte en una pagina web funcional. Sin GitHub, no habria 
una forma confiable de mantener y desplegar tu aplicacion.
""", body_style))

# SECTION 2: VERCEL
story.append(Paragraph("<b>2. Que es Vercel y para que sirve</b>", h1_style))

story.append(Paragraph("""
Vercel es una plataforma de hosting y despliegue especializada en aplicaciones web modernas, especialmente aquellas 
construidas con Next.js (el framework que usa NexusOS). Vercel fue creado por los mismos desarrolladores de Next.js, 
lo que significa que tu aplicacion tendra el mejor rendimiento posible. Es como tener un equipo de ingenieros de 
Google trabajando 24/7 para que tu pagina web cargue rapidisimo.
""", body_style))

story.append(Paragraph("<b>Funciones principales de Vercel:</b>", h2_style))

vercel_functions = [
    "<b>Despliegue automatico:</b> Conectas tu repositorio de GitHub una vez, y cada vez que hagas cambios, Vercel automaticamente detecta los cambios, construye tu aplicacion y la publica. No necesitas conocimientos de servidores ni terminal.",
    "<b>Hosting global (CDN):</b> Tu aplicacion se almacena en mas de 100 servidores alrededor del mundo. Cuando un usuario en Trinidad accede a NexusOS, los archivos vienen del servidor mas cercano, haciendo que cargue muy rapido.",
    "<b>SSL/HTTPS automatico:</b> Vercel proporciona certificados de seguridad gratuitos para que tu pagina tenga el candado verde en el navegador. Esto es esencial para que los usuarios confien en tu plataforma.",
    "<b>Dominios personalizados:</b> Puedes conectar tu propio dominio (como nexusos.com) facilmente sin configuraciones complicadas de DNS.",
    "<b>Variables de entorno:</b> Puedes almacenar de forma segura tus API keys (como la de Resend) sin que aparezcan en el codigo publico.",
    "<b>Previsualizaciones:</b> Cada vez que alguien sugiere un cambio en GitHub, Vercel crea una version de prueba para que puedas ver como quedaria antes de aprobarlo.",
]

for func in vercel_functions:
    story.append(Paragraph(func, bullet_style))

story.append(Spacer(1, 12))
story.append(Paragraph("<b>Que partes de NexusOS se benefician de Vercel:</b>", h2_style))

nexus_features_data = [
    [Paragraph('<b>Caracteristica</b>', tbl_header_style), Paragraph('<b>Beneficio de Vercel</b>', tbl_header_style)],
    [Paragraph('Paginas publicas (landing, portales)', tbl_cell_style), Paragraph('CDN global para carga ultrarapida', tbl_cell_style)],
    [Paragraph('Autenticacion (NextAuth)', tbl_cell_style), Paragraph('SSL/HTTPS para conexiones seguras', tbl_cell_style)],
    [Paragraph('APIs backend', tbl_cell_style), Paragraph('Serverless functions incluidas', tbl_cell_style)],
    [Paragraph('Envio de emails (Resend)', tbl_cell_style), Paragraph('Variables de entorno seguras', tbl_cell_style)],
    [Paragraph('Dashboard de clinica/salones', tbl_cell_style), Paragraph('Optimizacion automatica de React', tbl_cell_style)],
]

nexus_table = Table(nexus_features_data, colWidths=[200, 240])
nexus_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(nexus_table)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabla 1. Caracteristicas de NexusOS y beneficios de Vercel", caption_style))

story.append(PageBreak())

# SECTION 3: WORKFLOW
story.append(Paragraph("<b>3. Flujo de trabajo completo</b>", h1_style))

story.append(Paragraph("""
El proceso para llevar tu aplicacion NexusOS desde tu computadora hasta internet sigue un flujo claro y ordenado. 
Entender este flujo te ayudara a diagnosticar problemas y a saber exactamente en que etapa se encuentra tu proyecto.
""", body_style))

story.append(Paragraph("<b>Pasos del flujo de trabajo:</b>", h2_style))

workflow_steps = [
    ("1. Desarrollo local", "Escribes codigo en tu computadora usando VS Code u otro editor. Ejecutas 'npm run dev' para ver los cambios localmente."),
    ("2. Git commit", "Guardas los cambios en Git con un mensaje descriptivo. Cada commit es un punto de restauracion."),
    ("3. Git push", "Subes los cambios a GitHub. El comando es: git push origin main"),
    ("4. Deteccion automatica", "Vercel detecta que hubo cambios en GitHub (webhook automatico)."),
    ("5. Construccion", "Vercel ejecuta 'npm run build' para crear la version optimizada de tu aplicacion."),
    ("6. Despliegue", "Vercel publica la nueva version en segundos. Tu pagina se actualiza automaticamente."),
]

for step, desc in workflow_steps:
    story.append(Paragraph(f"<b>{step}</b>", h3_style))
    story.append(Paragraph(desc, body_style))

story.append(Spacer(1, 12))
story.append(Paragraph("<b>Resumen del flujo:</b>", h2_style))
story.append(Paragraph("""
<b>Tu computadora</b> (desarrollo) ---> <b>GitHub</b> (almacenamiento) ---> <b>Vercel</b> (publicacion) ---> <b>Internet</b> (usuarios)
""", body_style))

# SECTION 4: GITHUB STEPS
story.append(Paragraph("<b>4. Pasos practicos en GitHub</b>", h1_style))

story.append(Paragraph("<b>Paso 1: Crear una cuenta en GitHub</b>", h2_style))
story.append(Paragraph("""
1. Ve a <b>github.com</b> en tu navegador
2. Haz clic en <b>Sign up</b> (esquina superior derecha)
3. Ingresa tu email, crea una contrasena y elige un nombre de usuario
4. Verifica tu email haciendo clic en el enlace que te envian
5. Elige el plan <b>Free</b> (gratuito) - es suficiente para NexusOS
""", body_style))

story.append(Paragraph("<b>Paso 2: Crear un repositorio para NexusOS</b>", h2_style))
story.append(Paragraph("""
1. Despues de iniciar sesion, haz clic en el boton <b>+</b> (esquina superior derecha)
2. Selecciona <b>New repository</b>
3. En "Repository name" escribe: <b>nexusos</b>
4. Dejalo como <b>Public</b> (publico) o selecciona Private si prefieres
5. <b>NO</b> marques "Add a README file" - tu proyecto ya tiene archivos
6. Haz clic en <b>Create repository</b>
""", body_style))

story.append(Paragraph("<b>Paso 3: Subir tu codigo a GitHub</b>", h2_style))
story.append(Paragraph("En tu terminal (dentro de la carpeta del proyecto), ejecuta estos comandos:", body_style))

story.append(Paragraph("""
<font name="Times New Roman" size="10">
# Inicializar Git (si no esta inicializado)<br/>
git init<br/><br/>
# Agregar todos los archivos<br/>
git add .<br/><br/>
# Crear tu primer commit<br/>
git commit -m "Initial commit: NexusOS SaaS platform"<br/><br/>
# Conectar con tu repositorio de GitHub (reemplaza TU_USUARIO)<br/>
git remote add origin https://github.com/TU_USUARIO/nexusos.git<br/><br/>
# Subir el codigo<br/>
git push -u origin main
</font>
""", body_left_style))

story.append(Paragraph("""
<b>Nota:</b> Si te pide credenciales, GitHub ahora usa tokens de acceso personal (PAT) en lugar de contrasenas. 
Puedes crear uno en: GitHub - Settings - Developer settings - Personal access tokens - Tokens (classic)
""", note_style))

story.append(Paragraph("<b>Paso 4: Verificar que el codigo subio correctamente</b>", h2_style))
story.append(Paragraph("""
1. Ve a tu repositorio en github.com/TU_USUARIO/nexusos
2. Deberias ver todos los archivos y carpetas de tu proyecto
3. El README.md deberia mostrarse automaticamente en la pagina principal
""", body_style))

story.append(PageBreak())

# SECTION 5: VERCEL STEPS
story.append(Paragraph("<b>5. Pasos practicos en Vercel</b>", h1_style))

story.append(Paragraph("<b>Paso 1: Crear una cuenta en Vercel</b>", h2_style))
story.append(Paragraph("""
1. Ve a <b>vercel.com</b> en tu navegador
2. Haz clic en <b>Sign Up</b>
3. Selecciona <b>Continue with GitHub</b> - esto conecta ambas cuentas automaticamente
4. Autoriza a Vercel para acceder a tus repositorios
5. El plan <b>Hobby</b> (gratuito) es perfecto para empezar
""", body_style))

story.append(Paragraph("<b>Paso 2: Importar tu proyecto de GitHub</b>", h2_style))
story.append(Paragraph("""
1. En el dashboard de Vercel, haz clic en <b>Add New...</b> - <b>Project</b>
2. En "Import Git Repository", veras una lista de tus repositorios de GitHub
3. Busca <b>nexusos</b> y haz clic en <b>Import</b>
4. Vercel detectara automaticamente que es un proyecto Next.js
""", body_style))

story.append(Paragraph("<b>Paso 3: Configurar el proyecto (importante)</b>", h2_style))

config_table_data = [
    [Paragraph('<b>Configuracion</b>', tbl_header_style), Paragraph('<b>Valor para NexusOS</b>', tbl_header_style), Paragraph('<b>Notas</b>', tbl_header_style)],
    [Paragraph('Framework Preset', tbl_cell_style), Paragraph('Next.js', tbl_cell_style), Paragraph('Deteccion automatica', tbl_cell_style)],
    [Paragraph('Root Directory', tbl_cell_style), Paragraph('./', tbl_cell_style), Paragraph('Dejar por defecto', tbl_cell_style)],
    [Paragraph('Build Command', tbl_cell_style), Paragraph('npm run build', tbl_cell_style), Paragraph('Automatico para Next.js', tbl_cell_style)],
    [Paragraph('Output Directory', tbl_cell_style), Paragraph('.next', tbl_cell_style), Paragraph('Automatico', tbl_cell_style)],
    [Paragraph('Install Command', tbl_cell_style), Paragraph('npm install', tbl_cell_style), Paragraph('Automatico', tbl_cell_style)],
    [Paragraph('Node.js Version', tbl_cell_style), Paragraph('18.x', tbl_cell_style), Paragraph('Recomendado para Next.js 15', tbl_cell_style)],
]

config_table = Table(config_table_data, colWidths=[130, 150, 160])
config_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(config_table)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabla 2. Configuracion de Vercel para NexusOS", caption_style))

story.append(Paragraph("<b>Paso 4: Agregar variables de entorno (CRITICO)</b>", h2_style))
story.append(Paragraph("""
Antes de hacer clic en "Deploy", debes agregar las variables de entorno para que las API keys funcionen:
""", body_style))

env_vars_data = [
    [Paragraph('<b>Nombre de Variable</b>', tbl_header_style), Paragraph('<b>Valor</b>', tbl_header_style), Paragraph('<b>Obligatorio</b>', tbl_header_style)],
    [Paragraph('NEXTAUTH_SECRET', tbl_cell_style), Paragraph('(generar con: openssl rand -base64 32)', tbl_cell_style), Paragraph('Si', tbl_cell_center)],
    [Paragraph('NEXTAUTH_URL', tbl_cell_style), Paragraph('https://tu-proyecto.vercel.app', tbl_cell_style), Paragraph('Si', tbl_cell_center)],
    [Paragraph('DATABASE_URL', tbl_cell_style), Paragraph('(tu URL de PostgreSQL)', tbl_cell_style), Paragraph('Si', tbl_cell_center)],
    [Paragraph('RESEND_API_KEY', tbl_cell_style), Paragraph('re_F7SxZ6MM_KUPYPzChaRiuD14ndSfMhHFS', tbl_cell_style), Paragraph('Si', tbl_cell_center)],
    [Paragraph('EMAIL_FROM', tbl_cell_style), Paragraph('NexusOS onboarding@resend.dev', tbl_cell_style), Paragraph('Si', tbl_cell_center)],
]

env_table = Table(env_vars_data, colWidths=[140, 200, 100])
env_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(env_table)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabla 3. Variables de entorno para NexusOS", caption_style))

story.append(Paragraph("<b>Paso 5: Desplegar</b>", h2_style))
story.append(Paragraph("""
1. Haz clic en el boton <b>Deploy</b> (grande, azul)
2. Vercel comenzara a construir tu aplicacion (tomara 2-5 minutos la primera vez)
3. Veras logs en tiempo real de lo que esta haciendo
4. Cuando termine, veras confeti y un boton <b>Continue to Dashboard</b>
5. Haz clic para ver tu aplicacion en vivo con un URL como: <b>tu-proyecto.vercel.app</b>
""", body_style))

story.append(PageBreak())

# SECTION 6: ENV VARIABLES
story.append(Paragraph("<b>6. Configuracion de variables de entorno</b>", h1_style))

story.append(Paragraph("""
Las variables de entorno son como "secretos" que tu aplicacion necesita para funcionar pero que no deben estar 
escritos directamente en el codigo. Esto incluye API keys, contrasenas de bases de datos, y tokens de autenticacion.
""", body_style))

story.append(Paragraph("<b>Como agregar variables de entorno despues del despliegue:</b>", h2_style))

story.append(Paragraph("""
1. Ve al dashboard de Vercel y selecciona tu proyecto <b>nexusos</b>
2. Haz clic en la pestana <b>Settings</b> en la parte superior
3. En el menu lateral, selecciona <b>Environment Variables</b>
4. Para agregar una nueva variable:
   - Escribe el nombre (ej: <b>NEXTAUTH_SECRET</b>)
   - Escribe el valor (el secreto)
   - Selecciona los entornos: Production, Preview, Development (marcar todos)
   - Haz clic en <b>Save</b>
5. Para que los cambios surtan efecto, debes hacer un nuevo despliegue:
   - Ve a la pestana <b>Deployments</b>
   - Haz clic en los tres puntos <b>...</b> junto al ultimo despliegue
   - Selecciona <b>Redeploy</b>
""", body_style))

story.append(Paragraph("<b>Generar NEXTAUTH_SECRET:</b>", h3_style))
story.append(Paragraph("En tu terminal local, ejecuta este comando para generar un secreto seguro:", body_style))
story.append(Paragraph("<font name='Times New Roman'>openssl rand -base64 32</font>", body_left_style))
story.append(Paragraph("Copia el resultado (una cadena de caracteres aleatorios) y usalo como valor de NEXTAUTH_SECRET.", body_style))

# SECTION 7: CUSTOM DOMAINS
story.append(Paragraph("<b>7. Dominios personalizados</b>", h1_style))

story.append(Paragraph("""
Por defecto, tu aplicacion estara en un URL como <b>nexusos.vercel.app</b>. 
Si compras un dominio propio (como <b>nexusos.com</b> o <b>nexusos.tt</b>), puedes conectarlo facilmente en Vercel.
""", body_style))

story.append(Paragraph("<b>Pasos para conectar un dominio:</b>", h2_style))

story.append(Paragraph("""
1. Compra un dominio en un registrador como Namecheap, GoDaddy, o tu proveedor local
2. En Vercel, ve a <b>Settings</b> - <b>Domains</b>
3. Escribe tu dominio (ej: <b>nexusos.tt</b>) y presiona <b>Add</b>
4. Vercel te mostrara los registros DNS que necesitas configurar en tu registrador:
   - Un registro <b>A</b> apuntando a: <b>76.76.21.21</b>
   - Un registro <b>CNAME</b> para www apuntando a: <b>cname.vercel-dns.com</b>
5. Ve a tu registrador de dominios y configura estos registros DNS
6. Espera unos minutos (puede tomar hasta 48 horas, pero usualmente es rapido)
7. Vercel configurara automaticamente el SSL/HTTPS
""", body_style))

story.append(Paragraph("<b>Para dominios de Trinidad y Tobago (.tt):</b>", h3_style))
story.append(Paragraph("""
Los dominios .tt se registran a traves de TTNIC (ttnic.tt). El proceso es mas manual que con registradores 
internacionales, pero sigue los mismos principios de configuracion DNS.
""", body_style))

# SECTION 8: TROUBLESHOOTING
story.append(Paragraph("<b>8. Solucion de problemas comunes</b>", h1_style))

story.append(Paragraph("<b>Error: Build failed</b>", h2_style))
story.append(Paragraph("""
<b>Causas comunes:</b> Dependencias faltantes, error de sintaxis, o version incompatible de Node.js.
<b>Solucion:</b> Revisa los logs de construccion en Vercel. El error especifico estara marcado en rojo. 
Asegurate de que tu archivo package.json tenga todas las dependencias correctas.
""", body_style))

story.append(Paragraph("<b>Error: Environment variable not found</b>", h2_style))
story.append(Paragraph("""
<b>Causa:</b> Falta una variable de entorno requerida.
<b>Solucion:</b> Ve a Settings - Environment Variables y asegurate de que todas las variables de la Tabla 3 
esten configuradas. Despues haz un Redeploy.
""", body_style))

story.append(Paragraph("<b>Error: Database connection failed</b>", h2_style))
story.append(Paragraph("""
<b>Causa:</b> La URL de la base de datos es incorrecta o la base de datos no permite conexiones externas.
<b>Solucion:</b> Verifica que DATABASE_URL sea correcta. Si usas PostgreSQL en un servicio como Neon o 
Supabase, asegurate de que tu base de datos acepte conexiones desde cualquier IP.
""", body_style))

story.append(Paragraph("<b>Error: Authentication failed</b>", h2_style))
story.append(Paragraph("""
<b>Causa:</b> NEXTAUTH_SECRET o NEXTAUTH_URL no estan configurados correctamente.
<b>Solucion:</b> NEXTAUTH_URL debe ser el URL completo de tu aplicacion (https://tu-proyecto.vercel.app). 
NEXTAUTH_SECRET debe ser una cadena aleatoria generada con openssl rand -base64 32.
""", body_style))

story.append(Paragraph("<b>Error: Los emails no se envian</b>", h2_style))
story.append(Paragraph("""
<b>Causa:</b> RESEND_API_KEY incorrecta o EMAIL_FROM mal formateado.
<b>Solucion:</b> Verifica que la API key comience con "re_" y que EMAIL_FROM tenga el formato correcto: 
<b>Nombre email@dominio.com</b>
""", body_style))

story.append(Spacer(1, 24))

# FINAL SUMMARY
story.append(Paragraph("<b>Resumen final</b>", h1_style))

story.append(Paragraph("""
Has aprendido que GitHub es donde almacenas tu codigo de forma segura y colaborativa, y que Vercel es la plataforma 
que toma ese codigo y lo convierte en una aplicacion web accesible desde cualquier lugar del mundo. El flujo de 
trabajo es simple: escribes codigo, lo subes a GitHub con git push, y Vercel automaticamente publica los cambios.
""", body_style))

story.append(Paragraph("""
Tu sistema NexusOS esta listo para ser desplegado. Solo necesitas:
<br/>1. Crear cuenta en GitHub y subir el codigo
<br/>2. Crear cuenta en Vercel conectandola con GitHub
<br/>3. Importar el proyecto y agregar las variables de entorno
<br/>4. Hacer clic en Deploy
""", body_style))

story.append(Paragraph("""
<b>Tu proximo paso:</b> Ve a github.com y crea tu cuenta. Luego sigue los pasos de esta guia.
""", body_style))

# Build PDF
doc.build(story)
print(f"PDF generado exitosamente: {output_path}")
