# 🚀 NexusOS - Configuración Rápida en Vercel

## ¿En qué paso estás?

---

## ✅ PASO 1: Crear Base de Datos PostgreSQL

### Opción A: Vercel Postgres (RECOMENDADO - Más fácil)

1. Abre: https://vercel.com/comandomorillo2026s-projects/nexus
2. Click en **Storage** (menú izquierdo)
3. Click en **Create Database**
4. Selecciona **Postgres**
5. Nombre: `nexusos-db`
6. Click en **Create**

✅ Vercel configura `DATABASE_URL` automáticamente.

---

### Opción B: Supabase (GRATIS 500MB)

1. Abre: https://supabase.com
2. Click en **Start your project**
3. Crea cuenta si no tienes
4. Crea un nuevo proyecto:
   - Nombre: `nexusos`
   - Password: (guarda esta contraseña)
5. Espera ~2 minutos mientras se crea
6. Ve a **Project Settings** → **Database**
7. Copia el **Connection string** (URI)
8. Pégalo en Vercel como `DATABASE_URL`

---

## ✅ PASO 2: Configurar Variables en Vercel

1. Abre: https://vercel.com/comandomorillo2026s-projects/nexus/settings/environment-variables

2. Agrega estas 3 variables:

```
Variable: NEXTAUTH_SECRET
Valor: /hIWWkYLkXeT5sXr4xMJWTA9ysOTCR1QpbPa6pWehXM=
Entornos: Production, Preview
```

```
Variable: NEXTAUTH_URL
Valor: https://nexus-os-alpha.vercel.app
Entornos: Production
```

```
Variable: APP_URL
Valor: https://nexus-os-alpha.vercel.app
Entornos: Production
```

---

## ✅ PASO 3: Redesplegar

1. Abre: https://vercel.com/comandomorillo2026s-projects/nexus
2. Click en **Deployments**
3. Click en los **3 puntos (...)** del último deploy
4. Click en **Redeploy**
5. Click en **Redeploy** otra vez

---

## 📱 Verificar

Después de 2-3 minutos, abre:
https://nexus-os-alpha.vercel.app

Deberías ver la página de login de NexusOS.

---

## 🆘 ¿Problemas?

### La página no carga
- Espera 3 minutos más
- Revisa los logs en Vercel → Deployments → Click en deploy → Logs

### Error de base de datos
- Verifica que `DATABASE_URL` existe en Environment Variables

### Error de autenticación
- Verifica que `NEXTAUTH_SECRET` y `NEXTAUTH_URL` estén configuradas

---

## 📞 Links Directos

| Qué | Link |
|-----|------|
| Tu App | https://nexus-os-alpha.vercel.app |
| Variables | https://vercel.com/comandomorillo2026s-projects/nexus/settings/environment-variables |
| Storage (DB) | https://vercel.com/comandomorillo2026s-projects/nexus/stores |
| Redeploy | https://vercel.com/comandomorillo2026s-projects/nexus |
| Supabase | https://supabase.com |

---

## ✨ Checklist Rápido

- [ ] Creé base de datos PostgreSQL
- [ ] Configuré DATABASE_URL
- [ ] Configuré NEXTAUTH_SECRET
- [ ] Configuré NEXTAUTH_URL
- [ ] Configuré APP_URL
- [ ] Redeplegué el proyecto
- [ ] La app carga correctamente
