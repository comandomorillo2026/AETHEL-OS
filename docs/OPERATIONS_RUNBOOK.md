# 📋 NEXUSOS - RUNBOOK OPERATIVO

> **Guía paso a paso para operaciones diarias**
> **Versión:** 1.0.0 | **Fecha:** 31 Marzo 2026

---

## 🚀 PROCEDIMIENTOS DE INICIO

### Iniciar el sistema localmente
```bash
cd /home/z/my-project
npm run dev
# Acceder a http://localhost:3000
```

### Verificar que todo funciona
1. Abrir http://localhost:3000
2. Verificar que carga la landing page
3. Probar login con admin@nexusos.tt / admin123
4. Verificar que el panel admin carga

---

## 👥 CREAR NUEVO CLIENTE (TENANT)

### Opción A: Desde el Portal (Cliente se registra solo)
1. Cliente va a https://nexus-os-alpha.vercel.app/portal
2. Llena el formulario de 3 pasos
3. Paga con WiPay/Artim
4. Sistema crea tenant automáticamente
5. Verificar en /admin que el tenant aparece

### Opción B: Desde el Admin (Tú lo creas)
1. Ir a /admin
2. Click "Crear Inquilino"
3. Llenar wizard de 3 pasos:
   - Paso 1: Datos del negocio (nombre, email, industria)
   - Paso 2: Seleccionar plan
   - Paso 3: Confirmar
4. Sistema envía email con credenciales
5. Cliente puede hacer login inmediatamente

---

## 💳 GESTIÓN DE PAGOS

### Verificar pago recibido
1. Ir a /admin → Tab "Órdenes"
2. Buscar por número de orden o nombre
3. Estado debe ser "Pagado" (verde)

### Si el pago está pendiente
1. Verificar con el cliente si ya pagó
2. Revisar logs en Vercel: Dashboard → Functions
3. Buscar el webhook: `/api/webhooks/wipay`

### Si el pago falló
1. Revisar error en los logs
2. Contactar al cliente
3. Si es necesario, crear tenant manualmente

---

## 🔧 MODIFICAR PRECIOS

1. Ir a /admin → Tab "Precios"
2. Modificar los valores en cada plan
3. Click "Guardar Cambios"
4. Verificar que los cambios se reflejan en /portal

**Nota:** Los precios en el portal usan valores hardcoded en el componente.
Para cambiarlos en el portal, editar:
- `/src/components/sales-portal/apply-form.tsx` línea ~70

---

## 📧 GESTIÓN DE EMAILS

### Verificar que emails se envían
1. Ir a https://resend.com/dashboard
2. Verificar "Emails" → "Sent"
3. Si hay errores, revisar "Failed"

### Reenviar credenciales a cliente
```bash
# No hay comando directo, usar API:
curl -X POST https://nexus-os-alpha.vercel.app/api/admin/tenants \
  -H "Content-Type: application/json" \
  -d '{"action": "resend-welcome", "tenantId": "xxx"}'
```

---

## 🤖 USAR EL ASISTENTE IA

El asistente IA está disponible SOLO para SUPER_ADMIN en /admin.

### Qué puede hacer:
- Crear módulos nuevos
- Reparar errores en código
- Sugerir mejoras
- Documentar funcionalidades
- Responder preguntas técnicas

### Ejemplos de prompts:
- "Crear módulo de inventario para farmacia"
- "Reparar error en /api/checkout/create"
- "Cómo implemento notificaciones push?"
- "Generar documentación para el módulo de citas"

---

## 🚨 RESPUESTA A INCIDENTES

### El sitio no carga
1. Verificar status de Vercel: https://vercel.com/status
2. Revisar logs: Vercel Dashboard → Deployments → Functions
3. Si hay error de build, revisar el código reciente

### Los pagos no funcionan
1. Verificar que WiPay/Artim estén operativos
2. Verificar variables de entorno en Vercel
3. Probar con tarjeta de prueba

### La IA no responde
1. El SDK z-ai-web-dev-sdk debe estar configurado
2. Verificar que la API /api/ai/chat funciona
3. Si falla, el sistema sigue funcionando sin IA

### Base de datos dañada
1. Restaurar del backup más reciente
2. Si no hay backup, usar Git para re crear schema:
```bash
npx prisma db push --force-reset
```

---

## 📊 MONITOREO

### Métricas importantes
| Métrica | Donde verla | Valor normal |
|---------|-------------|--------------|
| Tenant activos | /admin | > 0 |
| Errores 500 | Vercel Dashboard | 0 |
| Emails enviados | Resend Dashboard | Aumenta diario |
| Webhooks fallidos | Vercel Functions | 0 |

### Alertas configurar
- [ ] Error rate > 1%
- [ ] Response time > 3s
- [ ] Database connection failures
- [ ] Payment webhook failures

---

## 🔄 ACTUALIZACIONES

### Actualizar código desde GitHub
```bash
cd /home/z/my-project
git pull origin main
npm install
npx prisma generate
npm run build
```

### Subir cambios a producción
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
# Vercel auto-deploya
```

### Actualizar dependencias
```bash
npm outdated  # Ver qué está desactualizado
npm update    # Actualizar seguras
npm audit fix # Reparar vulnerabilidades
```

---

## 🔐 SEGURIDAD

### Cambiar credenciales de demo
**IMPORTANTE:** En producción, cambiar estos passwords:
- admin@nexusos.tt / admin123 → password fuerte
- Todos los usuarios demo

### Rotar API keys
Cada 90 días:
1. Generar nueva API key en WiPay, Artim, Resend
2. Actualizar en Vercel Environment Variables
3. Verificar que todo funciona
4. Revocar key antigua

### Backup de seguridad
```bash
# Backup completo
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Subir a almacenamiento seguro
# (Google Drive, Dropbox, etc.)
```

---

## 📞 CONTACTOS DE EMERGENCIA

| Problema | Contactar |
|----------|-----------|
| Vercel down | support@vercel.com |
| WiPay issues | soporte@wipay.com |
| Base de datos | Tu DBA o soporte Vercel |
| Código roto | GitHub Issues |

---

## ✅ CHECKLIST DIARIO

```
[ ] Abrir /admin y verificar que carga
[ ] Revisar órdenes pendientes
[ ] Verificar que no hay errores en Vercel
[ ] Responder emails de soporte
```

## ✅ CHECKLIST SEMANAL

```
[ ] Backup de base de datos
[ ] Revisar métricas de uso
[ ] Actualizar documentación si hubo cambios
[ ] Revisar dependencias desactualizadas
```

## ✅ CHECKLIST MENSUAL

```
[ ] Facturación verificada
[ ] Rotar API keys
[ ] Revisar tenants inactivos (contactar o suspender)
[ ] Actualizar precios si es necesario
```

---

**Este runbook debe imprimirse y mantenerse accesible offline.**
