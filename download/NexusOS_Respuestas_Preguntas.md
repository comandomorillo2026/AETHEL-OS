# 📋 RESPUESTAS A TUS PREGUNTAS
## NexusOS - Guía Completa

---

## ❓ PREGUNTA 1: ¿Puedo gestionar mis propias contraseñas?

### ✅ SÍ, COMPLETAMENTE

El sistema incluye:

```
SISTEMA DE USUARIOS
├── Cambio de contraseña
│   └── Desde configuración de perfil
├── Recuperación de contraseña
│   └── Email con enlace de reset
├── Sesiones seguras
│   └── Logout automático por inactividad
└── 2FA (opcional)
    └── Autenticación de dos factores
```

**Cómo funciona:**
1. Ve a tu perfil → Configuración
2. Click en "Cambiar Contraseña"
3. Ingresa contraseña actual y nueva
4. Guardar cambios

**Para el Super Admin (Tú):**
- Puedes resetear contraseñas de cualquier usuario
- Puedes crear usuarios nuevos con contraseñas temporales
- Puedes forzar cambio de contraseña en primer login

---

## ❓ PREGUNTA 2: ¿Puedo cambiar el dominio?

### ✅ SÍ, AQUÍ TE EXPLICO CÓMO

### Opción A: Subdominio Gratis (Vercel)
```
TU DOMINIO ACTUAL:
├── nexusos.vercel.app (gratis)
├── tu-nombre.vercel.app (gratis)
└── Cualquier subdominio que quieras
```

### Opción B: Dominio Personalizado
```
PASOS PARA TU DOMINIO PROPIO:
│
├── 1. Comprar dominio
│   ├── Namecheap: $8-15 USD/año
│   ├── GoDaddy: $12-20 USD/año
│   └── Cloudflare: $8-10 USD/año (recomendado)
│
├── 2. Configurar DNS
│   ├── Ir a Vercel → Settings → Domains
│   ├── Agregar: nexusos.tt
│   └── Copiar registros DNS
│
├── 3. Agregar registros en tu proveedor
│   ├── A record → 76.76.21.21
│   └── CNAME → cname.vercel-dns.com
│
└── 4. Esperar propagación (5 min - 48 hrs)
```

### Dominios Recomendados para T&T:
```
• nexusos.tt        → Perfecto para Trinidad
• nexusos.com.tt    → Alternativa local
• nexusos.com       → Internacional
• nexusoscaribbean.com → Regional
```

### Costo de Dominio:
| Proveedor | .tt | .com | .com.tt |
|-----------|-----|------|---------|
| NIC TT | ~$50 USD/año | - | ~$50 USD/año |
| Namecheap | - | $9 USD/año | - |
| GoDaddy | - | $12 USD/año | - |

---

## ❓ PREGUNTA 3: ¿Dónde recopilo los datos de clientes del portal?

### ✅ SISTEMA DE LEADS INTEGRADO

```
FLUJO DE DATOS:
│
├── VISITANTE → Portal Web
│   └── Llena formulario de registro
│
├── SISTEMA → Crea LEAD automáticamente
│   ├── Nombre del negocio
│   ├── Nombre del propietario
│   ├── Email
│   ├── Teléfono
│   ├── Industria de interés
│   ├── Plan de interés
│   └── Fuente (UTM tracking)
│
├── TORRE DE CONTROL → Tú ves el lead
│   ├── Estado: Nuevo → Contactado → Calificado → Convertido
│   └── Puedes agregar notas
│
└── CONVERSIÓN → Crear Inquilino
    └── Lead se convierte en cliente activo
```

### Datos que se capturan automáticamente:
```
✅ Business Name
✅ Owner Name
✅ Email
✅ Phone
✅ Industry
✅ Country
✅ Plan Interest
✅ UTM Source (si viene de anuncio)
✅ Date/Time
✅ IP Address
```

---

## ❓ PREGUNTA 4: ¿Tengo un email que reciba estos datos?

### ✅ SÍ, NOTIFICACIONES AUTOMÁTICAS

```
SISTEMA DE NOTIFICACIONES:
│
├── EMAIL AUTOMÁTICO
│   ├── Nuevo lead → Email a: admin@nexusos.tt
│   ├── Asunto: "Nuevo Lead: [Nombre del Negocio]"
│   └── Contenido: Todos los datos del formulario
│
├── DASHBOARD
│   ├── Torre de Control → Sección "Leads"
│   ├── Lista de todos los leads
│   └── Estados y seguimiento
│
└── WHATSAPP (opcional)
    ├── Notificación a tu celular
    └── Requiere configurar WhatsApp Business API
```

### Configurar Email de Notificaciones:
```
1. Ve a Torre de Control
2. Configuración → Notificaciones
3. Agrega tu email: tu-email@personal.com
4. Activa notificaciones por lead
5. ¡Listo! Cada nuevo lead te llega al email
```

---

## ❓ PREGUNTA 5: ¿Puedo cambiar precios desde la Torre de Control?

### ✅ SÍ, CONTROL TOTAL DE PRECIOS

```
TORRE DE CONTROL → CONFIGURACIÓN DE PRECIOS:
│
├── Planes
│   ├── STARTER
│   │   ├── Precio mensual: TT$500 (editable)
│   │   ├── Precio anual: TT$400 (editable)
│   │   └── Activación: TT$1,250 (editable)
│   │
│   ├── GROWTH
│   │   ├── Precio mensual: TT$1,200 (editable)
│   │   ├── Precio anual: TT$960 (editable)
│   │   └── Activación: TT$1,250 (editable)
│   │
│   └── PREMIUM
│       ├── Precio mensual: TT$2,500 (editable)
│       ├── Precio anual: TT$2,000 (editable)
│       └── Activación: TT$1,250 (editable)
│
├── Configuración Global
│   ├── Moneda principal
│   ├── Tasa de cambio
│   ├── Descuento anual (%)
│   └── Impuestos
│
└── Cupones
    ├── Crear cupones de descuento
    ├── Código: EARLYBIRD
    ├── Descuento: TT$250
    └── Límite de usos: 50
```

**Cambios se aplican INMEDIATAMENTE** en el portal público.

---

## ❓ PREGUNTA 6: ¿Facturas de lujo con logo y colores?

### ✅ SÍ, FACTURAS 100% PERSONALIZABLES

```
CONFIGURACIÓN DE FACTURAS:
│
├── BRANDING
│   ├── Logo de tu empresa (upload)
│   ├── Color primario (#6C3FCE por defecto)
│   ├── Color secundario (#F0B429 por defecto)
│   └── Color de acento (#C026D3 por defecto)
│
├── INFORMACIÓN
│   ├── Nombre de la empresa
│   ├── Nombre legal
│   ├── RUC/Tax ID
│   ├── Dirección
│   └── Teléfono/Email
│
├── CONFIGURACIÓN
│   ├── Prefijo de factura (INV, FAC, etc.)
│   ├── Moneda (TTD, USD, GYD)
│   ├── Tasa de impuesto
│   ├── Nota al pie
│   └── Términos y condiciones
│
└── VISTA PREVIA EN TIEMPO REAL
    └── Ver cómo se ve antes de guardar
```

### Ejemplo de Factura Personalizada:
```
┌────────────────────────────────────────────┐
│  [TU LOGO]     CLÍNICA SAN FERNANDO        │
│               RUC: 123456789               │
│               123 Calle Principal          │
│               Puerto España, Trinidad      │
├────────────────────────────────────────────┤
│                                            │
│  FACTURA #: INV-2026-0001                  │
│  Fecha: 26/03/2026                         │
│                                            │
│  Cliente: María González                   │
│  Tel: +1 868 555-0001                      │
│                                            │
├────────────────────────────────────────────┤
│  DESCRIPCIÓN              MONTO            │
│  ────────────────────────────────────      │
│  Consulta General         TT$200.00        │
│                                            │
│  Subtotal:                TT$200.00        │
│  Impuesto (12.5%):        TT$25.00         │
│  ────────────────────────────────────      │
│  TOTAL:                   TT$225.00        │
├────────────────────────────────────────────┤
│  Gracias por su preferencia               │
│  Esta factura es un documento legal       │
└────────────────────────────────────────────┘
```

---

## 📊 RESUMEN DE LO QUE TIENES

| Funcionalidad | Estado | Dónde |
|---------------|--------|-------|
| Gestión de contraseñas | ✅ | Perfil → Configuración |
| Cambio de dominio | ✅ | Vercel → Settings → Domains |
| Leads del portal | ✅ | Torre de Control → Leads |
| Notificaciones email | ✅ | Configuración → Notificaciones |
| Cambiar precios | ✅ | Torre de Control → Precios |
| Facturas personalizadas | ✅ | Clínica → Configuración → Facturas |
| Logo y colores | ✅ | Clínica → Configuración → Branding |

---

## 🚀 PRÓXIMOS PASOS

1. **Abre el Preview Panel** → Sistema funcionando
2. **Login como Admin** → admin@nexusos.tt / admin123
3. **Ve a Leads** → Ve cómo llegan los datos
4. **Ve a Configuración** → Cambia precios, colores, etc.
5. **Login como Clínica** → clinic@demo.tt / demo123
6. **Ve a Configuración** → Personaliza facturas

---

## 💰 COSTOS TOTALES

| Concepto | Costo |
|----------|-------|
| Hosting (Vercel Free) | $0/mes |
| Base de datos (SQLite) | $0/mes |
| Sistema completo | Ya construido |
| Dominio .tt | ~$50 USD/año (opcional) |
| **TOTAL** | **$0/mes + dominio opcional** |

---

*Documento generado: 2026-03-26*
