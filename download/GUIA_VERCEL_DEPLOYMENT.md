# 🚀 Guía de Deployment - NexusOS en Vercel

## ¿Por qué Vercel?
- **Gratis** para proyectos personales
- **Creado para Next.js** (plataforma oficial)
- **Deployment automático** desde GitHub
- **SSL gratis** (HTTPS)
- **Muy fácil** - no requiere conocimientos técnicos

---

## 📋 PASO 1: Crear Cuenta en GitHub

1. Ve a: https://github.com
2. Click en "Sign Up"
3. Crea tu cuenta gratuita

---

## 📦 PASO 2: Subir tu Proyecto a GitHub

### Opción A: Si ya tienes GitHub instalado en tu computadora
```bash
cd /home/z/my-project
git init
git add .
git commit -m "NexusOS - Sistema completo"
git remote add origin https://github.com/TU-USUARIO/nexusos.git
git push -u origin main
```

### Opción B: Manual (Más Fácil)
1. En GitHub, click en "New Repository"
2. Nombre: `nexusos`
3. Click "Create repository"
4. Click "uploading an existing file"
5. Arrastra toda la carpeta del proyecto
6. Click "Commit changes"

---

## 🔗 PASO 3: Conectar con Vercel

1. Ve a: https://vercel.com
2. Click en "Sign Up"
3. Elige "Continue with GitHub"
4. Autoriza a Vercel

---

## 🚀 PASO 4: Hacer Deployment

1. En Vercel dashboard, click **"Add New Project"**
2. Selecciona tu repositorio `nexusos`
3. Click **"Import"**
4. Configuración:
   - **Framework Preset**: Next.js (automático)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Click **"Deploy"**

**¡Listo!** En 2-3 minutos tendrás tu proyecto en línea.

---

## 🗄️ PASO 5: Configurar Base de Datos

Vercel necesita una base de datos PostgreSQL. Opciones gratuitas:

### Opción A: Vercel Postgres (Recomendado)
1. En tu proyecto Vercel, ve a "Storage"
2. Click "Create Database"
3. Selecciona "Postgres"
4. Copia la `DATABASE_URL`

### Opción B: Supabase (Gratis)
1. Ve a: https://supabase.com
2. Crea cuenta gratuita
3. Crea un nuevo proyecto
4. Ve a Settings > Database
5. Copia la Connection String

### Opción C: Neon (Gratis)
1. Ve a: https://neon.tech
2. Crea cuenta gratuita
3. Crea un proyecto
4. Copia la Connection String

---

## ⚙️ PASO 6: Variables de Entorno

En Vercel, ve a tu proyecto > Settings > Environment Variables:

Agrega:
```
DATABASE_URL = postgres://usuario:password@host:5432/database
```

Haz **Redeploy** después de agregar las variables.

---

## 🌐 Tu URL Final

Vercel te dará una URL como:
```
https://nexusos-tuusuario.vercel.app
```

Puedes agregar un dominio personalizado en:
- Settings > Domains

---

## ✅ Lista de Verificación

- [ ] Cuenta en GitHub creada
- [ ] Proyecto subido a GitHub
- [ ] Cuenta en Vercel creada
- [ ] Proyecto importado en Vercel
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno agregadas
- [ ] Deployment exitoso
- [ ] Sitio accesible en la URL

---

## 🆘 Problemas Comunes

### Error: "Build Failed"
- Verifica que `package.json` esté en la raíz
- Verifica que todas las dependencias estén listadas

### Error: "Database Connection"
- Verifica la `DATABASE_URL`
- Verifica que la base de datos acepte conexiones externas

### Error: "Out of Memory"
- El plan gratuito tiene límites
- Considera actualizar a plan pagado

---

## 📱 Módulos Disponibles

Tu NexusOS incluye:

| Módulo | URL |
|--------|-----|
| Sales Portal | `/` |
| Admin Dashboard | `/admin` |
| Clínica Médica | `/clinic` |
| Portal de Enfermería | `/nurse` |
| Portal de Pacientes | `/portal-paciente` |
| Salón de Belleza | `/beauty` |
| **Law Firm (NUEVO)** | `/lawfirm` |

---

## 🎉 ¡Felicidades!

Tu sistema NexusOS está en línea y listo para usar.

**¿Preguntas?** 
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Fecha de creación:** Marzo 2026
**Versión:** 1.0
