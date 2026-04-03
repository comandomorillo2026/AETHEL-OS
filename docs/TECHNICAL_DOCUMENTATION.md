# 📚 NEXUSOS - DOCUMENTACIÓN TÉCNICA COMPLETA

> **Versión:** 1.0.0  
> **Última actualización:** 31 Marzo 2026  
> **Autor:** Sistema Automatizado

---

## 1. VISIÓN GENERAL

NexusOS es una plataforma SaaS multi-tenant diseñada para negocios del Caribe. Permite que múltiples empresas usen el mismo sistema con sus datos completamente aislados.

### Stack Tecnológico
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Estilos:** Tailwind CSS 4 + shadcn/ui
- **Base de datos:** Prisma ORM (SQLite dev / PostgreSQL prod)
- **Autenticación:** NextAuth.js v5
- **Pagos:** WiPay + Artim
- **Email:** Resend
- **IA:** z-ai-web-dev-sdk
- **Deployment:** Vercel

### URLs
- **Producción:** https://nexus-os-alpha.vercel.app
- **Repositorio:** https://github.com/comandomorillo2026/NexusOS
- **Rama principal:** main

---

## 2. ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXUSOS ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   LANDING   │    │ SALES PORTAL│    │   ADMIN     │     │
│  │   PAGE      │    │   /portal   │    │   /admin    │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                   │            │
│         └──────────────────┼───────────────────┘            │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    NEXT.JS API                        │   │
│  │  /api/auth/*  /api/admin/*  /api/payments/*          │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             ▼                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   PRISMA ORM                          │   │
│  │  Tenant | SystemUser | ClinicConfig | SalesOrder     │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             ▼                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 DATABASE                              │   │
│  │  SQLite (dev) | PostgreSQL (prod via Vercel)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               EXTERNAL SERVICES                       │   │
│  │  WiPay | Artim | Resend | z-ai-web-dev-sdk           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. INDUSTRIAS SOPORTADAS

| Industria | Slug | Precio Base | Estado |
|-----------|------|-------------|--------|
| Clínica Médica | `clinic` | TT$800-2,800/mes | ✅ Activo |
| Enfermería | `nurse` | TT$600-2,200/mes | ✅ Activo |
| Salón de Belleza | `beauty` | TT$500-1,900/mes | ✅ Activo |
| Bufete de Abogados | `lawfirm` | TT$800-2,800/mes | ✅ Activo |
| Farmacia | `pharmacy` | TT$800-2,800/mes | ⚠️ Beta |
| Seguros | `insurance` | TT$8,000-28,000/mes | ⚠️ Beta |

---

## 4. ROLES Y PERMISOS

### SUPER_ADMIN
- Acceso total al sistema
- Puede crear/eliminar tenants
- Configura precios globales
- Ve todos los datos
- Acceso a IA Assistant

### TENANT_ADMIN
- Administrador de un tenant específico
- Gestiona usuarios de su organización
- Configura su espacio de trabajo
- Ve reportes de su negocio

### USER
- Usuario regular dentro de un tenant
- Acceso limitado a módulos asignados
- No puede configurar el sistema

---

## 5. FLUJO DE ONBOARDING DE CLIENTE

```
1. Cliente llega a / → Landing page
           │
           ▼
2. Click "Ver Productos" → /portal
           │
           ▼
3. Selecciona industria → /portal?industry=clinic
           │
           ▼
4. Llena formulario 3 pasos (ApplyForm)
           │
           ▼
5. API /api/checkout/create
   - Crea SalesOrder
   - Crea PaymentVerification
   - Crea ProvisioningJob
   - Redirige a WiPay/Artim
           │
           ▼
6. Webhook /api/webhooks/wipay o /api/webhooks/artim
   - Marca pago como verificado
   - Inicia provisioning automático
           │
           ▼
7. Sistema crea:
   - Tenant
   - SystemUser (TENANT_ADMIN)
   - Configuración específica de industria
           │
           ▼
8. Email de bienvenida con credenciales
           │
           ▼
9. Cliente accede a /login → /clinic, /beauty, etc.
```

---

## 6. VARIABLES DE ENTORNO REQUERIDAS

```env
# Database
DATABASE_URL="file:./dev.db"  # Development
# DATABASE_URL="postgres://..." # Production (Vercel)

# NextAuth
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Development
# NEXTAUTH_URL="https://nexus-os-alpha.vercel.app" # Production

# WiPay (Caribbean Payment Gateway)
WIPIFY_API_KEY="tu-api-key"
WIPIFY_ACCOUNT_ID="tu-account-id"
WIPIFY_RETURN_URL="https://nexus-os-alpha.vercel.app/checkout/success"
WIPIFY_CANCEL_URL="https://nexus-os-alpha.vercel.app/checkout/cancel"

# Artim (Alternative Payment)
ARTIM_API_KEY="tu-api-key"
ARTIM_MERCHANT_ID="tu-merchant-id"

# Resend (Email)
RESEND_API_KEY="re_xxxxx"

# App
APP_URL="https://nexus-os-alpha.vercel.app"
```

---

## 7. COMANDOS IMPORTANTES

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción

# Base de datos
npx prisma db push   # Sincroniza schema con DB
npx prisma generate  # Genera cliente Prisma
npx prisma studio    # Abre GUI de base de datos
npx prisma migrate dev --name nombre  # Crea migración

# Deployment
git push origin main # Auto-deploy en Vercel
```

---

## 8. ESTRUCTURA DE CARPETAS

```
/home/z/my-project/
├── src/
│   ├── app/                    # App Router (Next.js 16)
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Admin endpoints
│   │   │   ├── auth/           # Autenticación
│   │   │   ├── checkout/       # Checkout y pagos
│   │   │   ├── webhooks/       # Webhooks de pagos
│   │   │   └── ai/             # IA Chat
│   │   ├── admin/              # Panel admin
│   │   ├── portal/             # Portal de ventas
│   │   ├── clinic/             # Dashboard clínica
│   │   ├── beauty/             # Dashboard salón
│   │   ├── lawfirm/            # Dashboard bufete
│   │   ├── nurse/              # Dashboard enfermería
│   │   └── ...
│   ├── components/             # Componentes React
│   │   ├── admin/              # Componentes admin
│   │   ├── clinic/             # Componentes clínica
│   │   ├── beauty/             # Componentes belleza
│   │   ├── lawfirm/            # Componentes bufete
│   │   ├── sales-portal/       # Componentes ventas
│   │   └── ui/                 # shadcn/ui components
│   └── lib/                    # Utilidades
│       ├── auth/               # Autenticación
│       ├── payments/           # WiPay, Artim
│       └── db.ts               # Prisma client
├── prisma/
│   └── schema.prisma           # Schema de base de datos
└── package.json
```

---

## 9. ENDPOINTS DE API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/forgot-password` | Solicitar reset de password |
| POST | `/api/auth/reset-password` | Resetear password |

### Admin
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/tenants` | Listar todos los tenants |
| POST | `/api/admin/tenants` | Crear nuevo tenant |

### Checkout
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/checkout/create` | Crear orden y pago |
| POST | `/api/orders` | Crear orden (alternativo) |

### Webhooks
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/webhooks/wipay` | Webhook de WiPay |
| POST | `/api/webhooks/artim` | Webhook de Artim |

### IA
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat con IA |

---

## 10. MANTENIMIENTO ROUTINARIO

### Diario
- [ ] Revisar logs de Vercel para errores
- [ ] Verificar webhooks de pago funcionando
- [ ] Revisar emails en cola en Resend

### Semanal
- [ ] Backup de base de datos
- [ ] Revisar métricas de rendimiento
- [ ] Actualizar dependencias con vulnerabilidades

### Mensual
- [ ] Revisar facturación de Vercel/Resend
- [ ] Actualizar documentación
- [ ] Revisar tenants inactivos

---

## 11. TROUBLESHOOTING COMÚN

### Error: "Prisma Client could not be generated"
```bash
npx prisma generate
```

### Error: "Database connection failed"
- Verificar DATABASE_URL en .env
- Verificar que la base de datos esté corriendo

### Error: "Payment webhook not received"
- Verificar URL del webhook en WiPay/Artim
- Verificar que el endpoint esté accesible públicamente

### Error: "Email not sending"
- Verificar RESEND_API_KEY
- Verificar dominio verificado en Resend

---

## 12. CREDENCIALES DE DEMO

| Rol | Email | Password | Dashboard |
|-----|-------|----------|-----------|
| SUPER_ADMIN | admin@nexusos.tt | admin123 | /admin |
| Clínica | clinic@demo.tt | demo123 | /clinic |
| Bufete | lawfirm@demo.tt | demo123 | /lawfirm |
| Belleza | beauty@demo.tt | demo123 | /beauty |
| Enfermería | nurse@demo.tt | demo123 | /nurse |

---

**Este documento debe mantenerse actualizado con cada cambio importante al sistema.**
