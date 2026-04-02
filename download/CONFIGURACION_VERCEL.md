# 🔐 CONFIGURACIÓN DE VARIABLES DE ENTORNO - NexusOS

## 📋 RESUMEN RÁPIDO

| Variable | Valor para Vercel (Producción) |
|----------|-------------------------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_csf7xXbo5nSk@ep-autumn-violet-ae6jqzph-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_DATABASE_URL` | `postgresql://neondb_owner:npg_csf7xXbo5nSk@ep-autumn-violet-ae6jqzph-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_SECRET` | `O2BdD7+7KCDgAGUxd2u27Z+1qAvPo8F4ss13c6LF3jM=` |
| `NEXTAUTH_URL` | `https://nexus-os-alpha.vercel.app` |

---

## 🔑 VARIABLE: NEXTAUTH_SECRET

### ¿Qué es?
Una clave secreta que NextAuth usa para **firmar los tokens de sesión (JWT)**. Sin esta clave, los usuarios no pueden mantener su sesión activa.

### ¿Dónde se guarda?
- **Local**: Archivo `.env` en la raíz del proyecto
- **Vercel**: Dashboard → NexusOS → Settings → Environment Variables

### ¿Cuándo es necesaria?
- **Siempre** - Es obligatoria para que funcione el login
- Cada vez que un usuario inicia sesión, NextAuth usa esta clave para crear un token firmado
- Si cambias esta clave, **TODOS los usuarios tendrán que volver a iniciar sesión**

### ¿Qué pasa si está mal?
- Login falla con "Credenciales inválidas" aunque el usuario y contraseña sean correctos
- Sesiones existentes dejan de funcionar

---

## 🌐 VARIABLE: NEXTAUTH_URL

### ¿Qué es?
La URL base de tu aplicación. NextAuth la usa para generar las URLs de callback y redirecciones.

### ¿Dónde se guarda?
- **Local**: `http://localhost:3000`
- **Vercel**: `https://nexus-os-alpha.vercel.app` (¡SIN slash al final!)

### ¿Cuándo es necesaria?
- **Siempre** - Es obligatoria en producción
- Se usa para redireccionar después del login
- Se usa para generar URLs de callback de OAuth

### ¿Qué pasa si está mal?
- Login redirige a URL incorrecta
- Error "URL no autorizada" en OAuth
- Sesiones no se crean correctamente

---

## 🗄️ VARIABLE: DATABASE_URL

### ¿Qué es?
La conexión a la base de datos PostgreSQL en Neon.

### ¿Dónde se guarda?
- **Local y Vercel**: La MISMA URL (es la base de datos de producción)

### ¿Cuándo es necesaria?
- **Siempre** - Sin ella la aplicación no puede guardar ni leer datos
- Se usa para todos los usuarios, tenants, datos de negocio

### ¿Qué pasa si está mal?
- Error de conexión a base de datos
- La aplicación no carga ningún dato
- Login falla porque no puede verificar usuarios

---

## 🗄️ VARIABLE: DIRECT_DATABASE_URL

### ¿Qué es?
URL directa a la base de datos (sin pooler). Usada por Prisma para migraciones.

### ¿Dónde se guarda?
- **Local y Vercel**: Generalmente la MISMA que DATABASE_URL

---

## 📍 CÓMO CONFIGURAR EN VERCEL

### Paso 1: Ir a Vercel Dashboard
1. Entra a https://vercel.com
2. Selecciona tu proyecto: **NexusOS**
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Verificar/Agregar Variables
Para cada variable de la tabla de arriba:

1. Si **NO existe**: Click en "Add" → Agregar nombre y valor
2. Si **existe**: Click en los 3 puntos → "Edit" → Actualizar valor

### Paso 3: Redeploy
Después de cambiar variables:
1. Ve a **Deployments**
2. Click en los 3 puntos del último deploy
3. Selecciona **Redeploy**

---

## ✅ VERIFICAR CONFIGURACIÓN

Después de configurar, visita:
```
https://nexus-os-alpha.vercel.app/api/diagnostic
```

Esto mostrará:
- ✅ Si la base de datos está conectada
- ✅ Si las variables están configuradas
- ✅ Si los usuarios existen
- ✅ Si bcrypt funciona

---

## 📝 CREDENCIALES DE PRUEBA

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@nexusos.tt | admin123 | SUPER_ADMIN |
| clinic@demo.tt | demo123 | TENANT_ADMIN |
| beauty@demo.tt | demo123 | TENANT_ADMIN |
| lawfirm@demo.tt | demo123 | TENANT_ADMIN |
| nurse@demo.tt | demo123 | TENANT_ADMIN |

---

## 🔄 VARIABLES OPCIONALES (Pago)

| Variable | Descripción |
|----------|-------------|
| `WIPAY_API_KEY` | API key de WiPay |
| `WIPAY_ACCOUNT_ID` | ID de cuenta WiPay |
| `NEXT_PUBLIC_WIPAY_ENVIRONMENT` | `sandbox` o `live` |

---

**Fecha de creación**: 2026-04-02
**Proyecto**: NexusOS
**Base de datos**: Neon PostgreSQL (us-east-2)
