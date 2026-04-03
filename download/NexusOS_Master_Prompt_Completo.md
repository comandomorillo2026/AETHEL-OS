# NEXUSOS - SISTEMA COMPLETO
## Prompt Maestro para Creación de Ecosistema SaaS Multi-Tenant

---

## INSTRUCCIONES DE USO
Copia este documento completo y pégalo en cualquier IA (ChatGPT, Claude, Gemini, Base44, Bolt, etc.) para generar el sistema completo.

---

# PARTE 1: VISIÓN DEL PROYECTO

## Ecosistema NexusOS - 3 Capas

```
┌─────────────────────────────────────────────────────────────┐
│ TORRE DE CONTROL (Bunker - Solo Tú)                         │
│ → Crear inquilinos, monitorear, controlar todo el sistema   │
├─────────────────────────────────────────────────────────────┤
│ EDIFICIO NEXUS (Inquilinos/Empresas)                        │
│ → Cada uno tiene espacio aislado                            │
│ → Funciona OFFLINE (PWA)                                    │
│ → Contabilidad, recordatorios, gestión completa             │
├─────────────────────────────────────────────────────────────┤
│ SALES PORTAL (Público 24/7)                                 │
│ → Oficina digital que vende por ti                          │
│ → Información → Pago → Inquilino creado automáticamente     │
└─────────────────────────────────────────────────────────────┘
```

---

# PARTE 2: STACK TECNOLÓGICO

## Frontend
- Next.js 16 con App Router
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (componentes)
- Framer Motion (animaciones)
- PWA (Service Workers para offline)
- IndexedDB (almacenamiento offline)

## Backend
- Next.js API Routes
- Prisma ORM
- SQLite/PostgreSQL
- Resend (emails)
- Stripe SDK
- WiPay API

## Hosting (Versiones Gratuitas)
- Vercel Free (frontend)
- Supabase Free (base de datos)
- Cloudflare Free (CDN)
- Resend Free (3,000 emails/mes)

---

# PARTE 3: ESQUEMA DE BASE DE DATOS

```prisma
model SalesOrder {
  id                      String   @id @default(cuid())
  orderNumber             String   @unique
  status                  String   @default("draft")
  businessName            String
  legalName               String?
  businessAddress         String?
  ownerName               String
  ownerEmail              String
  ownerPhone              String
  country                 String   @default("Trinidad & Tobago")
  industrySlug            String
  industryName            String
  planSlug                String
  planName                String
  planTier                String
  billingCycle            String   @default("monthly")
  planPriceTtd            Float
  activationFeeTtd        Float    @default(1250)
  totalChargedTtd         Float
  currencyUsed            String   @default("TTD")
  paymentMethod           String?
  transactionId           String?
  receiptUrl              String?
  paymentVerifiedAt       String?
  invoiceNumber           String?
  couponCode              String?
  discountAmountTtd       Float    @default(0)
  languagePreference      String   @default("es")
  isDeleted               Boolean  @default(false)
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}

model PaymentVerification {
  id                    String   @id @default(cuid())
  salesOrderId          String
  orderNumber           String
  verificationMethod    String
  status                String   @default("pending")
  transactionId         String?
  receiptFileUrl        String?
  reviewedBy            String?
  reviewedAt            String?
  rejectionReason       String?
  amountDeclared        Float?
  amountVerified        Float?
  currency              String   @default("TTD")
  createdAt             DateTime @default(now())
}

model ProvisioningJob {
  id                    String   @id @default(cuid())
  salesOrderId          String
  orderNumber           String
  status                String   @default("queued")
  tenantCreated         Boolean  @default(false)
  nshTenantId           String?
  subscriptionCreated   Boolean  @default(false)
  userProvisioned       Boolean  @default(false)
  welcomeEmailSent      Boolean  @default(false)
  invoiceGenerated      Boolean  @default(false)
  startedAt             String?
  completedAt           String?
  errorLog              String?
  retryCount            Int      @default(0)
  createdAt             DateTime @default(now())
}

model SalesCoupon {
  id                    String   @id @default(cuid())
  code                  String   @unique
  discountType          String
  discountValue         Float
  appliesTo             String
  maxUses               Int?
  timesUsed             Int      @default(0)
  validFrom             String?
  validUntil            String?
  status                String   @default("active")
  description           String?
  createdAt             DateTime @default(now())
}

model Industry {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  nameEn                String
  nameEs                String
  icon                  String
  descriptionEn         String
  descriptionEs         String
  status                String   @default("active")
  sortOrder             Int      @default(0)
  createdAt             DateTime @default(now())
}

model Plan {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  nameEn                String
  nameEs                String
  tier                  String
  priceMonthlyTtd       Float
  priceAnnualTtd        Float
  maxUsers              Int
  maxBranches           Int
  badgeEn               String?
  badgeEs               String?
  createdAt             DateTime @default(now())
}

model Tenant {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  businessName          String
  industrySlug          String
  ownerName             String
  ownerEmail            String
  ownerPhone            String
  planSlug              String
  billingCycle          String
  status                String   @default("active")
  activatedAt           String?
  settings              String?
  isDeleted             Boolean  @default(false)
  createdAt             DateTime @default(now())
}
```

---

# PARTE 4: DISEÑO VISUAL (OBSIDIAN + AURORA)

## Variables CSS
```css
:root {
  --obsidian: #050410;
  --obsidian-2: #0A0820;
  --ink-card: #0E0C1F;
  --nexus-violet: #6C3FCE;
  --nexus-violet-lite: #B197FC;
  --nexus-fuchsia: #C026D3;
  --nexus-gold: #F0B429;
  --nexus-aqua: #22D3EE;
  --text-primary: #EDE9FE;
  --text-warm: #D4BFFF;
  --text-mid: #9D7BEA;
  --text-dim: rgba(167,139,250,0.5);
  --glass: rgba(108,63,206,0.07);
  --glass-border: rgba(167,139,250,0.14);
  --success: #34D399;
  --error: #F87171;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

## Fuentes Google
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Efectos Clave
- Aurora background animado (CSS only)
- Glass-morphism cards con blur
- Gradient text para títulos
- Gold buttons con glow
- Transiciones suaves (0.3s ease)

---

# PARTE 5: TRADUCCIONES COMPLETAS ES/EN

## Español (ES)

### Hero
- eyebrow: "CREADO PARA EL CARIBE. LISTO PARA EL MUNDO."
- headline: "Tu Negocio Merece un Sistema Operativo."
- subheadline: "NexusOS le da a cada industria la infraestructura digital que las empresas del Fortune 500 pagan millones. Panaderías. Bufetes. Clínicas. Salones. En una plataforma."
- cta: "Reclama Tu Espacio →"
- priceTag: "Desde TT$500/mes"

### Pain Points
- title: "Si algo de esto te suena familiar... NexusOS fue creado para ti."
- items:
  1. "Registrando pedidos en mensajes de WhatsApp y rezando 🙏"
  2. "Persiguiendo pagos porque olvidaste quién debe qué"
  3. "Tu 'sistema' es un cuaderno que solo tú puedes entender"
  4. "No puedes tomarte un día libre porque todo vive en tu cabeza"
  5. "Clientes quejándose de no recibir facturas, ni recordatorios"
  6. "El cierre de mes es un caos porque los números están por todas partes"

### Pricing
- title: "Menos que el costo del tiempo extra de un empleado."
- plans:
  - STARTER: TT$500/mes - Para negocios que dan su primer paso digital
  - GROWTH: TT$1,200/mes - Para negocios listos para crecer (MÁS POPULAR)
  - PREMIUM: TT$2,500/mes - Centro de comando digital completo
- activation: "TT$1,250 activación única (Primeros 50 clientes)"

### FAQ
1. "¿Necesito conocimientos técnicos?" → "Para nada. Si sabes usar WhatsApp, puedes usar NexusOS."
2. "¿Qué pasa después de pagar?" → "En minutos, tu espacio de trabajo está listo. Recibes email con login y factura."
3. "¿Puedo cambiar de plan?" → "Sí, en cualquier momento. Prorrateado."
4. "¿Están seguros mis datos?" → "Completamente aislados. Encriptación empresarial."
5. "¿Soportan español?" → "Sí, completamente bilingüe."
6. "¿Qué métodos de pago?" → "WiPay (T&T), Stripe (internacional), transferencia bancaria."

---

# PARTE 6: INDUSTRIAS (4 INICIALES + 7 PREPARADAS)

## Activas (Lanzamiento)
1. 🧁 Panadería y Pastelería - Pedidos, recetas, clientes, POS
2. 🏥 Clínicas y Bienestar - Citas, historiales, facturación
3. 💇 Salón y Spa - Reservas, estilistas, membresías
4. 🛍️ Retail y Boutique - Inventario, POS, multi-sucursal

## Próximas (Estructura lista)
5. 🍸 Bares y Hospitalidad
6. 🎉 Eventos y Locales
7. 💼 Servicios Profesionales
8. ⚖️ Legal
9. 🛡️ Seguros
10. 🔧 HSE y Offshore
11. 🕊️ Servicios Funerarios

---

# PARTE 7: FLUJO DE PAGO

## Paso 1: Información del Negocio
- Nombre del negocio
- Nombre legal (opcional)
- Dirección
- Nombre del propietario
- Email
- WhatsApp/Teléfono
- País
- Idioma preferido

## Paso 2: Industria y Plan
- Selección de industria (4 cards)
- Ciclo de facturación (Mensual/Anual 20% descuento)
- Selección de plan (3 opciones)
- Código promocional (EARLYBIRD = TT$250 descuento)

## Paso 3: Pago
- WiPay (Recomendado T&T)
- Stripe (Internacional)
- Transferencia bancaria (Manual)

## Paso 4: Confirmación
- Número de orden: NXS-2026-XXXX
- Resumen del pedido
- Email de confirmación
- Factura PDF descargable

---

# PARTE 8: COMPONENTES UI REQUERIDOS

1. **Navbar** - Glass-morphism, logo, links, toggle ES/EN, CTA
2. **Hero** - Aurora background, headline grande, CTAs, trust badges
3. **Pain Points** - Grid 2x3, cards con iconos de alerta
4. **How It Works** - 3 pasos horizontales con conectores
5. **Industries** - Grid de cards con iconos emoji, badges
6. **Features** - Tabs por plan (Starter/Growth/Premium)
7. **Pricing** - Toggle mensual/anual, 3 cards, tabla comparativa
8. **Testimonials** - 3 cards con fotos, estrellas, quotes
9. **FAQ** - Accordion expandible
10. **Apply Form** - Multi-step con indicadores
11. **Footer** - Links, contacto, redes sociales

---

# PARTE 9: API ROUTES

## POST /api/orders
```typescript
// Crea SalesOrder
// Genera orderNumber: NXS-YYYY-NNNN
// Crea PaymentVerification
// Crea ProvisioningJob
// Crea SalesAuditLog
// Retorna: { success, orderNumber, invoiceNumber }
```

## GET /api/seed
```typescript
// Puebla Industries (11)
// Puebla Plans (3)
// Puebla Coupons (EARLYBIRD)
// Puebla SystemSettings
```

---

# PARTE 10: CAPACIDAD Y ESCALABILIDAD

## Con Versiones Gratuitas
- 250+ usuarios simultáneos
- ~10,000 requests/día
- 3,000 emails/mes

## Infraestructura Gratuita
| Servicio | Plan | Límite |
|----------|------|--------|
| Vercel | Free | 100GB bandwidth |
| Supabase | Free | 500MB database |
| Resend | Free | 3,000 emails/mes |
| Cloudflare | Free | CDN ilimitado |

## Escalar (Cuando lo necesites)
- Vercel Pro: $20/mes
- Supabase Pro: $25/mes
- Resend Pro: $20/mes

---

# PARTE 11: SEGURIDAD

- HTTPS automático (Vercel)
- Input validation (Zod)
- SQL injection protection (Prisma)
- XSS protection (React)
- CSRF tokens
- Rate limiting
- Audit logging
- Data encryption

---

# PARTE 12: CHECKLIST DE DESPLIEGUE

1. [ ] Crear proyecto en Vercel
2. [ ] Conectar repositorio GitHub
3. [ ] Configurar Supabase (database)
4. [ ] Configurar Resend (emails)
5. [ ] Ejecutar /api/seed
6. [ ] Probar flujo completo
7. [ ] Conectar dominio
8. [ ] Configurar WiPay/Stripe
9. [ ] Launch!

---

# PARTE 13: PRÓXIMOS PASOS DESPUÉS DEL SALES PORTAL

## Fase 2: Torre de Control
- Dashboard de admin
- Gestión de inquilinos
- Verificación de pagos
- Analytics

## Fase 3: NexusOS (Sistema Principal)
- Multi-tenant
- PWA offline
- Módulos por industria
- Sistema de recordatorios
- Contabilidad

## Fase 4: Integraciones
- WhatsApp Business API
- Contabilidad avanzada
- Multi-moneda
- API pública

---

**FIN DEL PROMPT MAESTRO**

Este documento contiene TODO lo necesario para crear el Sales Portal de NexusOS. Copia y pega en cualquier IA para generar el código completo.
