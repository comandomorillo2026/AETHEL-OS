# 🔧 Configurar Variables de Entorno en Vercel - NexusOS

## 📍 Paso 1: Acceder al Proyecto

1. Ve a: **https://vercel.com/comandomorillo2026s-projects/nexus**
2. Click en la pestaña **"Settings"** (en la parte superior)

---

## 🔐 Paso 2: Variables de Entorno

1. En el menú lateral izquierdo, click en **"Environment Variables"**
2. Verás una lista de variables existentes (si las hay)

---

## ➕ Paso 3: Agregar Variables

Para cada variable, haz lo siguiente:

### Variables OBLIGATORIAS (Sistema)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | Ver abajo | URL de PostgreSQL |
| `NEXTAUTH_SECRET` | Ver abajo | Secreto para autenticación |
| `NEXTAUTH_URL` | `https://nexus-os-alpha.vercel.app` | URL del sitio |
| `APP_URL` | `https://nexus-os-alpha.vercel.app` | URL de la app |

### Variables de WiPay (Pasarela Principal)

| Variable | Valor de Ejemplo | Cómo obtener |
|----------|------------------|--------------|
| `WIPAY_API_KEY` | `pk_live_xxxxx` | Dashboard de WiPay |
| `WIPAY_ACCOUNT_NUMBER` | `123456` | Dashboard de WiPay |
| `WIPAY_API_URL` | `https://wipayfinancial.com/v1` | Fijo |

### Variables de Artim (Pasarela Secundaria)

| Variable | Valor de Ejemplo | Cómo obtener |
|----------|------------------|--------------|
| `ARTIM_API_KEY` | `artim_pk_xxxxx` | Dashboard de Artim |
| `ARTIM_MERCHANT_ID` | `mer_xxxxx` | Dashboard de Artim |
| `ARTIM_SECRET_KEY` | `sk_live_xxxxx` | Dashboard de Artim |
| `ARTIM_WEBHOOK_SECRET` | `whsec_xxxxx` | Dashboard de Artim |
| `ARTIM_API_URL` | `https://api.artim.io/v1` | Fijo |

---

## 🎯 Paso 4: Cómo Agregar Cada Variable

1. En el campo **"Key"**, escribe el nombre de la variable (ej: `ARTIM_API_KEY`)
2. En el campo **"Value"**, escribe el valor
3. Selecciona los entornos:
   - ✅ **Production**
   - ✅ **Preview**
   - ☐ Development (opcional)
4. Click en **"Add"**

---

## 🔑 Generar NEXTAUTH_SECRET

Si no tienes este secreto, generarlo es fácil:

**Opción A: Usar generador online**
- Ve a: https://generate-secret.vercel.app/32
- Copia el resultado

**Opción B: En tu terminal local**
```bash
openssl rand -base64 32
```

**Ejemplo de valor:**
```
/hIWWkYLkXeT5sXr4xMJWTA9ysOTCR1QpbPa6pWehXM=
```

---

## 🗄️ Configurar Base de Datos PostgreSQL

⚠️ **IMPORTANTE**: SQLite NO funciona en Vercel. Necesitas PostgreSQL.

### Opción A: Vercel Postgres (Más Fácil)

1. En tu proyecto Vercel, ve a **"Storage"**
2. Click en **"Create Database"**
3. Selecciona **"Postgres"**
4. Nombra la base: `nexusos-db`
5. Click en **"Create"**
6. Vercel agregará automáticamente `DATABASE_URL`

### Opción B: Supabase (Gratis hasta 500MB)

1. Ve a: https://supabase.com
2. Crea cuenta y proyecto
3. Ve a **Project Settings → Database**
4. Copia la **Connection string** (URI)
5. Pégala en `DATABASE_URL`

**Formato de DATABASE_URL:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Opción C: Neon (Serverless PostgreSQL)

1. Ve a: https://neon.tech
2. Crea cuenta y proyecto
3. Copia la **Connection string**
4. Pégala en `DATABASE_URL`

---

## 🔄 Paso 5: Redesplegar

Después de agregar las variables:

1. Ve a la pestaña **"Deployments"**
2. Click en los **tres puntos (...)** del último deploy
3. Selecciona **"Redeploy"**
4. Click en **"Redeploy"** para confirmar

---

## ✅ Verificar Configuración

Una vez redeployado, verifica:

1. **Health Check**: `https://nexus-os-alpha.vercel.app/api/payments/create` (GET)
   - Debe mostrar las pasarelas disponibles

2. **Artim Status**: La respuesta debe incluir:
   ```json
   {
     "providers": {
       "wipay": { "available": true },
       "artim": { "available": true, "missingConfig": [] }
     }
   }
   ```

---

## 📝 Checklist Final

- [ ] `DATABASE_URL` configurada (PostgreSQL)
- [ ] `NEXTAUTH_SECRET` configurada
- [ ] `NEXTAUTH_URL` configurada
- [ ] `APP_URL` configurada
- [ ] WiPay API keys (si vas a usar WiPay)
- [ ] Artim API keys (si vas a usar Artim)
- [ ] Proyecto redeployado

---

## 🆘 Solución de Problemas

### Error: "Error: listen EADDRINUSE"
- Normal en desarrollo local, ignóralo en Vercel

### Error: "Prisma Client could not connect"
- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de usar PostgreSQL, no SQLite

### Error: "NEXTAUTH_SECRET is required"
- Agrega la variable `NEXTAUTH_SECRET`

### Error: "Invalid API Key"
- Verifica que las keys de WiPay/Artim sean correctas
- Asegúrate de usar keys de PRODUCCIÓN (no test) para producción

---

## 📞 URLs Importantes

| Servicio | URL |
|----------|-----|
| Tu App | https://nexus-os-alpha.vercel.app |
| Vercel Dashboard | https://vercel.com/comandomorillo2026s-projects/nexus |
| WiPay Dashboard | https://wipayfinancial.com/dashboard |
| Artim Dashboard | https://artim.io/dashboard |
| GitHub Repo | https://github.com/comandomorillo2026/NexusOS |

---

## 🔐 Seguridad

⚠️ **NUNCA** subas el archivo `.env` a GitHub con valores reales.

✅ Las variables en Vercel están encriptadas y son seguras.

✅ Usa el archivo `.env.example` para documentar qué variables se necesitan:
