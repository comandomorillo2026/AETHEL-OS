# NexusOS - Guía de Configuración para Producción

## 🔐 Variables de Entorno Requeridas en Vercel

### Base de Datos (Neon PostgreSQL)
```env
DATABASE_URL="postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Autenticación
```env
NEXTAUTH_SECRET="tu-secreto-super-seguro-minimo-32-caracteres"
NEXTAUTH_URL="https://tu-dominio.com"
```

### WiPay (Pagos del Caribe)
```env
WIPAY_ACCOUNT_ID="tu-account-id-de-wipay"
WIPAY_API_KEY="tu-api-key-de-wipay"
WIPAY_ENVIRONMENT="production"  # Cambiar a "production" para pagos reales
```

### Resend (Emails Transaccionales)
```env
RESEND_API_KEY="re_tu_api_key_de_resend"
EMAIL_FROM="NexusOS <noreply@tudominio.com>"
```

### URL Base
```env
NEXT_PUBLIC_BASE_URL="https://tu-dominio.com"
```

---

## 💳 Configurar WiPay para Producción

### Paso 1: Registrar cuenta empresarial
1. Visita [WiPay Caribbean](https://wipaycaribbean.com/)
2. Registra una cuenta empresarial (Business Account)
3. Completa la verificación de negocio con documentos legales

### Paso 2: Obtener credenciales
1. En el dashboard de WiPay, ve a **Settings > API Credentials**
2. Copia tu **Account ID** y **API Key**
3. Asegúrate de cambiar a modo "Live" para producción

### Paso 3: Configurar en Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings > Environment Variables**
3. Agrega las variables:
   - `WIPAY_ACCOUNT_ID` = tu-account-id
   - `WIPAY_API_KEY` = tu-api-key
   - `WIPAY_ENVIRONMENT` = production

### Tarifas de WiPay
- 3% + TT$1 por transacción
- Sin tarifas mensuales
- Pagos en TTD (dólar trinitense)

---

## 📧 Configurar Resend para Emails Transaccionales

### Opción A: Usar dominio gratuito (Recomendado para empezar)
Resend ofrece un dominio de prueba: `onboarding@resend.dev`
- Configura: `EMAIL_FROM="NexusOS <onboarding@resend.dev>"`
- Los correos mostrarán "onboarding@resend.dev" como remitente

### Opción B: Usar tu propio dominio (Más profesional)
1. **Registrar en Resend**: Ve a [resend.com](https://resend.com) y crea una cuenta gratuita
2. **Agregar dominio**: En el dashboard, ve a **Domains > Add Domain**
3. **Verificar dominio**: Agrega los registros DNS que Resend te indique
4. **Configurar remitente**: Una vez verificado, usa `noreply@tudominio.com`

### Configuración recomendada para NexusOS:
```env
# Para desarrollo/pruebas
EMAIL_FROM="NexusOS <onboarding@resend.dev>"

# Para producción (después de verificar dominio)
EMAIL_FROM="NexusOS <noreply@nexusos.tt>"
```

### Límites del plan gratuito de Resend:
- 3,000 emails/mes
- 100 emails/día
- Perfecto para empezar

---

## 🗄️ Configurar Backups en Neon

### Backups Automáticos (Incluidos en Neon)
Neon incluye backups automáticos con retención de:
- **Free Tier**: 1 backup, 7 días de retención
- **Pro Tier**: Retención ilimitada, Point-in-Time Recovery

### Cómo activar backups:
1. Ve a tu proyecto en [Neon Console](https://console.neon.tech)
2. Navega a **Settings > Backup**
3. Los backups automáticos están habilitados por defecto

### Backup Manual (Recomendado semanalmente)
```bash
# Exportar base de datos
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql

# Restaurar desde backup
psql "$DATABASE_URL" < backup_20240101.sql
```

### Script de backup automatizado
Puedes crear un cron job en tu servidor local:
```bash
# Crontab para backup diario a las 3 AM
0 3 * * * pg_dump "$DATABASE_URL" > /backups/nexusos_$(date +\%Y\%m\%d).sql
```

---

## 🚀 Despliegue en Producción

### Checklist antes de production:
- [ ] Variables de entorno configuradas en Vercel
- [ ] WiPay en modo "production" (no sandbox)
- [ ] Dominio verificado en Resend
- [ ] Base de datos con backups configurados
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] Términos y condiciones publicados en `/terms`

### Dominios personalizados en Vercel:
1. Ve a **Settings > Domains**
2. Agrega tu dominio (ej: `nexusos.tt`, `app.nexusos.tt`)
3. Configura los registros DNS según las instrucciones
4. Espera la verificación (puede tomar hasta 48 horas)

---

## 📊 Monitoreo

### Logs en Vercel:
- Ve a **Deployments > [seleccionar deploy] > Functions**
- Revisa los logs de serverless functions

### Monitoreo de base de datos:
- Neon Console > **Monitoring** para ver métricas en tiempo real
- Configura alertas para uso de almacenamiento

---

## 🔧 Soporte

- **WiPay Soporte**: support@wipaycaribbean.com
- **Resend Soporte**: support@resend.com
- **Neon Soporte**: support@neon.tech
- **NexusOS Soporte**: soporte@nexusos.tt
