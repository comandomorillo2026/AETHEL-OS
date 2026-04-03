# 🔧 ELEMENTOS FALTANTES — NexusOS Sales Portal

## 1. TRADUCCIONES COMPLETAS AL ESPAÑOL

### PAIN POINTS (ES)
```yaml
title: "Si algo de esto te suena familiar... NexusOS fue creado para ti."
pains:
  - "Registrando pedidos en mensajes de WhatsApp y rezando 🙏"
  - "Persiguiendo pagos porque olvidaste quién debe qué"
  - "Tu 'sistema' es un cuaderno que solo tú puedes entender"
  - "No puedes tomarte un día libre porque todo vive en tu cabeza"
  - "Clientes quejándose de no recibir facturas, ni recordatorios, ni actualizaciones"
  - "El cierre de mes es un caos porque los números están por todas partes"
```

### PRICING SECTION (ES)
```yaml
section_tag: "Precios Simples y Honestos"
title: "Menos que el costo del tiempo extra de un empleado."
sub: "Cada plan incluye configuración, capacitación y soporte completo. Sin cargos ocultos. Sin contratos. Cancela cuando quieras."
toggle_monthly: "Mensual"
toggle_annual: "Anual (Ahorra 20%)"

plan_starter:
  name: "STARTER"
  price_ttd: "TT$500"
  price_usd: "≈ USD $75"
  period: "/mes"
  badge: "COMENZAR"
  tagline: "Para negocios que dan su primer paso hacia el orden digital."
  cta: "Empezar con Starter"
  ideal_for: "Negocios desde casa, emprendedores individuales, primeros usuarios digitales"

plan_growth:
  name: "GROWTH ENGINE"
  price_ttd: "TT$1,200"
  price_usd: "≈ USD $180"
  period: "/mes"
  badge: "MÁS POPULAR 🔥"
  tagline: "Para negocios listos para crecer sin perder el control."
  cta: "Lanzar Mi Crecimiento"
  ideal_for: "2–10 empleados, múltiples ubicaciones, negocios con ingresos de 6–7 cifras TTD"

plan_premium:
  name: "PREMIUM ELITE"
  price_ttd: "TT$2,500"
  price_usd: "≈ USD $375"
  period: "/mes"
  badge: "GRADO EMPRESARIAL"
  tagline: "El centro de comando digital completo. Sin límites."
  cta: "Reclamar Premium"
  ideal_for: "Clínicas, bufetes, operaciones HSE, agencias de seguros, múltiples sucursales"

activation_fee:
  amount: "TT$1,250 activación única"
  includes: "Configuración de cuenta · Crédito primer mes · Sesión de capacitación"
  urgency: "⚡ Solo primeros 50 clientes — tarifa de acceso anticipado. Precio regular: TT$2,500."
```

### TESTIMONIALS (ES)
```yaml
testimonials:
  - quote: "Antes perdía al menos 5 pedidos por semana en mi WhatsApp. Ahora todo está organizado, mis clientes reciben facturas automáticamente, y realmente conozco mi margen de ganancia."
    reviewer: "Sandra M., Chef Pastelera, Puerto España"
    rating: 5

  - quote: "Nuestra recepción pasó del caos a la calma en una semana. Admisión de pacientes, facturación y seguimientos todo en un solo lugar."
    reviewer: "Dr. K. Rampersad, Clínica de Medicina General"
    rating: 5

  - quote: "Como bufete de abogados, el seguimiento de documentos y facturación era una pesadilla. NexusOS lo maneja como si hubiera sido creado específicamente para nosotros."
    reviewer: "A. Hosein, Abogado Litigante"
    rating: 5
```

### FAQ (ES)
```yaml
faq:
  - question: "¿Necesito conocimientos técnicos para usar NexusOS?"
    answer: "Para nada. Si sabes usar WhatsApp, puedes usar NexusOS. También incluimos una sesión completa de capacitación en tu tarifa de activación."

  - question: "¿Qué pasa después de pagar?"
    answer: "En cuestión de minutos, tu espacio de trabajo privado es creado. Recibes un email de confirmación con tu enlace de acceso, factura y guía de inicio. Sin esperas."

  - question: "¿Puedo cambiar de plan después?"
    answer: "Sí. Puedes subir o bajar de plan en cualquier momento. Las actualizaciones son prorrateadas. Los cambios a menor plan aplican en el próximo ciclo de facturación."

  - question: "¿Están seguros mis datos?"
    answer: "Tus datos están completamente aislados en tu propio espacio de trabajo privado. Ningún otro negocio puede ver tu información. Usamos encriptación de grado empresarial."

  - question: "¿Soportan español?"
    answer: "Sí — NexusOS es completamente bilingüe. La plataforma, facturas y soporte están disponibles tanto en inglés como en español."

  - question: "¿Qué métodos de pago aceptan?"
    answer: "Para clientes de Trinidad y Tobago: WiPay (débito/crédito). Clientes internacionales: Stripe (tarjetas principales). También aceptamos transferencia bancaria con verificación de recibo."
```

### APPLY FORM LABELS (ES)
```yaml
form:
  step_1_title: "Información del Negocio"
  
  business_name: "Nombre del Negocio*"
  business_name_placeholder: "Ej: Panadería Doña María"
  
  legal_name: "Nombre Legal/Registrado"
  legal_name_hint: "Si es diferente al nombre comercial"
  
  business_address: "Dirección del Negocio*"
  business_address_placeholder: "Dirección completa"
  
  owner_name: "Nombre Completo del Propietario*"
  owner_name_placeholder: "Tu nombre completo"
  
  owner_email: "Correo Electrónico*"
  owner_email_placeholder: "correo@ejemplo.com"
  
  owner_phone: "WhatsApp / Teléfono*"
  owner_phone_placeholder: "+1 868 XXX-XXXX"
  
  country: "País*"
  country_options:
    - "Trinidad y Tobago"
    - "Guyana"
    - "Barbados"
    - "Jamaica"
    - "Otro"
  
  language_preference: "Idioma Preferido"
  language_options:
    - "English"
    - "Español"

  step_2_title: "Industria y Plan"
  select_industry: "Selecciona tu industria"
  billing_cycle: "Ciclo de Facturación"
  monthly: "Mensual"
  annual_save: "Anual (Ahorra 20%)"
  coupon_code: "Código de descuento"
  coupon_apply: "Aplicar"
  coupon_applied: "✓ [code] aplicado — TT$XXX de descuento en activación!"
  coupon_invalid: "Código inválido o expirado"
  
  order_summary: "Resumen del Pedido"
  selected_industry: "Industria Seleccionada"
  selected_plan: "Plan Seleccionado"
  plan_price: "Precio del Plan"
  activation_fee: "Tarifa de Activación"
  coupon_discount: "Descuento"
  total_due: "TOTAL A PAGAR"
  
  step_3_title: "Pago"
  payment_method: "Método de Pago"
  
  wipay:
    name: "WiPay"
    recommended: "Recomendado para T&T"
    description: "Tarjeta de Crédito/Débito vía WiPay"
    redirect_notice: "Serás redirigido a la página de pago seguro de WiPay. Después del pago, regresa aquí para confirmación instantánea."
    button: "Pagar TT$[total] vía WiPay →"
  
  stripe:
    name: "Stripe"
    international: "Internacional"
    description: "Todas las tarjetas principales aceptadas"
    button: "Pagar TT$[total] vía Stripe →"
  
  bank_transfer:
    name: "Transferencia Bancaria"
    local: "Bancos locales de Trinidad y Tobago"
    bank_details: "Republic Bank — Cuenta: 220-XXXX-XXX"
    branch: "Sucursal: Port of Spain Main"
    reference: "Referencia: Tu correo electrónico"
    receipt_upload: "Subir comprobante de transferencia"
    processing_time: "Pago procesado en 2–24 horas después de verificación del recibo."
    button: "Enviar Comprobante de Transferencia"
  
  step_4_title: "Confirmación"
  order_confirmed: "¡Tu pedido está confirmado! 🎉"
  
  provisioning_message: "Tu espacio de trabajo está siendo configurado — espera tus datos de acceso en 5 minutos."
  
  bank_transfer_message: "Tu comprobante ha sido recibido. Nuestro equipo verificará y activará tu espacio de trabajo en 2–24 horas."
  
  order_number: "Número de Orden"
  business: "Negocio"
  plan: "Plan"
  total_paid: "Total Pagado"
  check_email: "Revisa tu correo: [email]"
  download_agreement: "Descargar Acuerdo"
  whatsapp_support: "Soporte por WhatsApp"
```

### EMAIL TEMPLATES (ES)

**Email 1: Order Confirmed (ES)**
```html
Subject: Pedido Confirmado — NexusOS #NXS-2026-XXXX

<!-- Header -->
<div style="background: linear-gradient(135deg, #6C3FCE, #C026D3); padding: 32px; text-align: center;">
  <h1 style="color: white; margin: 0;">¡Pedido Recibido, [Nombre]! ✅</h1>
</div>

<!-- Body -->
<div style="background: #0f0a1e; padding: 32px; color: #EDE9FE;">
  <p>Tu pedido #NXS-2026-XXXX para <strong>[Business Name]</strong> ([Industry]) ha sido recibido.</p>
  
  <h2 style="color: #F0B429;">Resumen del Pedido</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">Plan:</td>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">[Plan Name] | [Billing Cycle]</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">Tarifa de Activación:</td>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">TT$1,250</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">Plan:</td>
      <td style="padding: 12px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">TT$[price]/mes</td>
    </tr>
    <tr style="font-weight: bold; color: #F0B429;">
      <td style="padding: 12px 0;">TOTAL:</td>
      <td style="padding: 12px 0;">TT$[total]</td>
    </tr>
  </table>
  
  <h2 style="color: #F0B429; margin-top: 32px;">¿Qué Sigue?</h2>
  <ol>
    <li>✓ Pago confirmado (o "En revisión")</li>
    <li>○ Espacio de trabajo configurado (5 min / 24 hrs)</li>
    <li>○ Email de bienvenida con acceso enviado</li>
  </ol>
  
  <p style="margin-top: 32px;">
    <strong>Soporte:</strong> 
    <a href="https://wa.me/18681234567" style="color: #22D3EE;">WhatsApp</a> | 
    <a href="mailto:support@nexusos.tt" style="color: #22D3EE;">Email</a>
  </p>
</div>

<!-- Footer -->
<div style="background: #050410; padding: 16px; text-align: center; color: rgba(167,139,250,0.5);">
  NexusOS | Trinidad & Tobago 🇹🇹
</div>
```

**Email 2: Workspace Live (ES)**
```html
Subject: ¡Tu Espacio de Trabajo NexusOS Está Listo! 🚀 — [Business Name]

<!-- Header -->
<div style="background: linear-gradient(135deg, #6C3FCE, #C026D3); padding: 32px; text-align: center;">
  <h1 style="color: white; margin: 0;">¡Bienvenido a NexusOS, [Nombre]! 🚀</h1>
</div>

<!-- Body -->
<div style="background: #0f0a1e; padding: 32px; color: #EDE9FE;">
  <p>Tu espacio de trabajo para <strong>[Business Name]</strong> está activo y listo.</p>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://nexus-sovereign-hub.base44.app" 
       style="background: linear-gradient(135deg, #F0B429, #d97706); 
              color: #050410; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              display: inline-block;">
      Abrir Mi Espacio de Trabajo →
    </a>
  </div>
  
  <h2 style="color: #F0B429;">Para Comenzar:</h2>
  <ol>
    <li>Visita: <a href="https://nexus-sovereign-hub.base44.app" style="color: #22D3EE;">nexus-sovereign-hub.base44.app</a></li>
    <li>Inicia sesión con Google usando <strong>[owner_email]</strong> O crea una contraseña</li>
    <li>El espacio de trabajo de <strong>[Business Name]</strong> se abrirá inmediatamente — todo pre-configurado</li>
  </ol>
  
  <div style="background: rgba(108,63,206,0.1); border: 1px solid rgba(167,139,250,0.2); border-radius: 8px; padding: 16px; margin-top: 24px;">
    <p style="margin: 0;"><strong>Tu Plan:</strong> [Plan Name]</p>
    <p style="margin: 8px 0 0 0;"><strong>Renovación:</strong> [renewal date] | TT$[price]/mes</p>
  </div>
  
  <p style="margin-top: 32px;">
    <strong>Soporte:</strong> Responde a este email o WhatsApp
  </p>
</div>

<!-- Footer -->
<div style="background: #050410; padding: 16px; text-align: center; color: rgba(167,139,250,0.5);">
  NexusOS | Creado en Trinidad & Tobago 🇹🇹
</div>
```

---

## 2. ENTIDAD FALTANTE: SalesAuditLog

```json
{
  "name": "SalesAuditLog",
  "fields": [
    {"name": "action", "type": "string"},
    {"name": "order_number", "type": "string"},
    {"name": "sales_order_id", "type": "string"},
    {"name": "performed_by", "type": "string"},
    {"name": "performed_by_email", "type": "string"},
    {"name": "details", "type": "string"},
    {"name": "severity", "type": "enum", "values": ["info", "warning", "error", "critical"]},
    {"name": "ip_address", "type": "string"},
    {"name": "user_agent", "type": "string"},
    {"name": "metadata", "type": "string"},
    {"name": "timestamp", "type": "string"}
  ]
}
```

---

## 3. EMAIL TEMPLATE FALTANTE: Payment Rejected

```html
Subject: Acción Requerida — Verificación de Pago NexusOS

<!-- Header -->
<div style="background: linear-gradient(135deg, #DC2626, #991B1B); padding: 32px; text-align: center;">
  <h1 style="color: white; margin: 0;">⚠️ Verificación de Pago Requerida</h1>
</div>

<!-- Body -->
<div style="background: #0f0a1e; padding: 32px; color: #EDE9FE;">
  <p>Hola [Nombre],</p>
  
  <p>Tu pedido <strong>#NXS-2026-XXXX</strong> para <strong>[Business Name]</strong> requiere verificación adicional.</p>
  
  <div style="background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); border-radius: 8px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; color: #F87171;"><strong>Razón:</strong> [rejection_reason]</p>
  </div>
  
  <h2 style="color: #F0B429;">¿Qué Puedes Hacer?</h2>
  <ol>
    <li><strong>Revisar tu comprobante:</strong> Asegúrate de que el monto coincida con el total de tu pedido.</li>
    <li><strong>Subir nuevo comprobante:</strong> Si hubo un error, puedes subir un nuevo recibo.</li>
    <li><strong>Contactar soporte:</strong> Nuestro equipo puede ayudarte a resolver esto.</li>
  </ol>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://sales.nexusos.tt/order/[order_id]" 
       style="background: linear-gradient(135deg, #F0B429, #d97706); 
              color: #050410; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              display: inline-block;">
      Ver Detalles del Pedido →
    </a>
  </div>
  
  <p style="margin-top: 24px; color: rgba(167,139,250,0.7);">
    Si crees que esto es un error, contáctanos inmediatamente:
  </p>
  <p>
    <strong>WhatsApp:</strong> <a href="https://wa.me/18681234567" style="color: #22D3EE;">+1 868 XXX-XXXX</a><br>
    <strong>Email:</strong> <a href="mailto:support@nexusos.tt" style="color: #22D3EE;">support@nexusos.tt</a>
  </p>
</div>

<!-- Footer -->
<div style="background: #050410; padding: 16px; text-align: center; color: rgba(167,139,250,0.5);">
  NexusOS | Trinidad & Tobago 🇹🇹
</div>
```

---

## 4. ERROR HANDLING MATRIX

| Error Code | Scenario | User Message (EN) | User Message (ES) | Recovery Action |
|------------|----------|-------------------|-------------------|-----------------|
| `E_WIPAY_001` | WiPay timeout | "Payment request timed out. Please try again." | "La solicitud de pago expiró. Por favor intenta de nuevo." | Retry button |
| `E_WIPAY_002` | WiPay declined | "Your card was declined. Try a different payment method." | "Tu tarjeta fue rechazada. Intenta con otro método de pago." | Show other payment options |
| `E_STRIPE_001` | Stripe session expired | "Payment session expired. Please start a new checkout." | "La sesión de pago expiró. Inicia un nuevo proceso de pago." | Restart checkout |
| `E_STRIPE_002` | Insufficient funds | "Insufficient funds. Please try a different card." | "Fondos insuficientes. Intenta con otra tarjeta." | Show other payment options |
| `E_NSH_001` | NSH provisioning failed | "Workspace setup failed. Our team has been notified." | "Error en configuración. Nuestro equipo ha sido notificado." | Auto-create support ticket |
| `E_EMAIL_001` | Email send failed | "Order confirmed but email failed. Check spam or contact support." | "Pedido confirmado pero email falló. Revisa spam o contacta soporte." | Queue retry |
| `E_DUPLICATE` | Duplicate order detected | "An order with this email already exists. Check your inbox." | "Ya existe un pedido con este email. Revisa tu bandeja de entrada." | Show existing order link |
| `E_COUPON_001` | Invalid coupon | "This coupon code is invalid or expired." | "Este código de descuento es inválido o ha expirado." | Allow retry |
| `E_VALIDATION` | Form validation failed | "Please check the highlighted fields." | "Por favor revisa los campos resaltados." | Highlight errors |
| `E_FILE_001` | File upload failed | "File upload failed. Max size is 10MB." | "Error al subir archivo. Tamaño máximo 10MB." | Retry with size limit |

---

## 5. WEBHOOK PAYLOAD SPECIFICATIONS

### WiPay Webhook
```json
// Endpoint: POST /api/webhooks/wipay
// Expected payload:
{
  "transaction_id": "WP123456789",
  "order_id": "NXS-2026-0001",
  "status": "completed",
  "amount": 1750.00,
  "currency": "TTD",
  "payer_email": "customer@example.com",
  "timestamp": "2026-03-26T14:30:00Z",
  "signature": "sha256_hash_of_payload"
}

// Verification:
// 1. Validate signature using WIPAY_WEBHOOK_SECRET
// 2. Match order_id to SalesOrder
// 3. Verify amount matches expected total
// 4. Update SalesOrder.status based on result
```

### Stripe Webhook
```json
// Endpoint: POST /api/webhooks/stripe
// Events to subscribe:
// - checkout.session.completed
// - payment_intent.succeeded
// - payment_intent.payment_failed

// Expected payload (checkout.session.completed):
{
  "id": "cs_test_...",
  "object": "checkout.session",
  "metadata": {
    "order_number": "NXS-2026-0001"
  },
  "payment_status": "paid",
  "amount_total": 175000, // cents
  "currency": "ttd",
  "customer_email": "customer@example.com",
  "payment_intent": "pi_..."
}

// Verification:
// 1. Validate signature using STRIPE_WEBHOOK_SECRET
// 2. Retrieve session from Stripe API to confirm
// 3. Match metadata.order_number to SalesOrder
// 4. Trigger provisioning on success
```

---

## 6. INDUSTRY MODULES CONFIGURATION

```yaml
industries:
  bakery:
    name_en: "Bakery & Pastry"
    name_es: "Panadería y Pastelería"
    icon: "🧁"
    slug: "bakery"
    description_en: "Manage orders, recipes, clients & POS in one place"
    description_es: "Gestiona pedidos, recetas, clientes y POS en un solo lugar"
    modules:
      all_plans:
        - client_management
        - order_tracking
        - basic_invoicing
        - appointment_scheduling
      growth_plus:
        - recipe_costing
        - inventory_management
        - delivery_tracking
        - multi_branch
      premium_only:
        - advanced_analytics
        - loyalty_program
        - custom_branding
        - api_access

  clinic:
    name_en: "Clinics & Wellness"
    name_es: "Clínicas y Bienestar"
    icon: "🏥"
    slug: "clinic"
    description_en: "Appointments, patient records, billing & compliance"
    description_es: "Citas, historiales de pacientes, facturación y cumplimiento"
    modules:
      all_plans:
        - client_management
        - appointment_scheduling
        - basic_invoicing
        - email_notifications
      growth_plus:
        - patient_records
        - treatment_tracking
        - insurance_billing
        - multi_branch
      premium_only:
        - compliance_tools
        - advanced_analytics
        - custom_templates
        - api_access

  salon:
    name_en: "Salon & Spa"
    name_es: "Salón y Spa"
    icon: "💇"
    slug: "salon"
    description_en: "Bookings, stylists, memberships & gift cards"
    description_es: "Reservas, estilistas, membresías y tarjetas de regalo"
    modules:
      all_plans:
        - client_management
        - appointment_scheduling
        - basic_invoicing
        - staff_management
      growth_plus:
        - membership_management
        - gift_cards
        - inventory_management
        - multi_branch
      premium_only:
        - advanced_analytics
        - custom_branding
        - loyalty_program
        - api_access

  retail:
    name_en: "Retail & Boutique"
    name_es: "Retail y Boutique"
    icon: "🛍️"
    slug: "retail"
    description_en: "Inventory, POS, multi-branch & loyalty programs"
    description_es: "Inventario, POS, multi-sucursal y programas de lealtad"
    modules:
      all_plans:
        - client_management
        - inventory_management
        - basic_pos
        - basic_invoicing
      growth_plus:
        - multi_branch
        - loyalty_program
        - advanced_inventory
        - supplier_management
      premium_only:
        - advanced_analytics
        - custom_branding
        - api_access
        - multi_warehouse

  hospitality:
    name_en: "Bars & Hospitality"
    name_es: "Bares y Hospitalidad"
    icon: "🍸"
    slug: "hospitality"
    description_en: "Table management, tabs, events & staff scheduling"
    description_es: "Gestión de mesas, cuentas, eventos y horarios de personal"
    modules:
      all_plans:
        - client_management
        - order_tracking
        - basic_pos
        - staff_management
      growth_plus:
        - table_management
        - tabs_and_billing
        - event_management
        - multi_branch
      premium_only:
        - advanced_analytics
        - staff_scheduling
        - inventory_management
        - api_access

  events:
    name_en: "Events & Venues"
    name_es: "Eventos y Locales"
    icon: "🎉"
    slug: "events"
    description_en: "Bookings, client contracts, vendor management"
    description_es: "Reservas, contratos de clientes, gestión de proveedores"
    modules:
      all_plans:
        - client_management
        - booking_management
        - basic_invoicing
        - quotation_system
      growth_plus:
        - contract_management
        - vendor_management
        - event_timeline
        - multi_venue
      premium_only:
        - advanced_analytics
        - custom_branding
        - api_access
        - resource_scheduling

  professional:
    name_en: "Professional Services"
    name_es: "Servicios Profesionales"
    icon: "💼"
    slug: "professional"
    description_en: "CRM, proposals, billing & time tracking"
    description_es: "CRM, propuestas, facturación y seguimiento de tiempo"
    modules:
      all_plans:
        - client_management
        - basic_invoicing
        - email_notifications
        - contact_directory
      growth_plus:
        - crm_pipeline
        - quotation_system
        - time_tracking
        - project_management
      premium_only:
        - advanced_analytics
        - custom_templates
        - api_access
        - team_collaboration

  legal:
    name_en: "Legal"
    name_es: "Legal"
    icon: "⚖️"
    slug: "legal"
    description_en: "Matter management, billing, compliance & documents"
    description_es: "Gestión de casos, facturación, cumplimiento y documentos"
    modules:
      all_plans:
        - client_management
        - matter_management
        - basic_invoicing
        - document_storage
      growth_plus:
        - time_tracking
        - trust_accounting
        - conflict_check
        - multi_branch
      premium_only:
        - compliance_tools
        - audit_trail
        - custom_templates
        - api_access

  insurance:
    name_en: "Insurance"
    name_es: "Seguros"
    icon: "🛡️"
    slug: "insurance"
    description_en: "Policy tracking, renewals, client portal & claims"
    description_es: "Seguimiento de pólizas, renovaciones, portal de clientes y reclamos"
    modules:
      all_plans:
        - client_management
        - policy_tracking
        - basic_invoicing
        - renewal_reminders
      growth_plus:
        - claims_management
        - client_portal
        - multi_branch
        - commission_tracking
      premium_only:
        - advanced_analytics
        - compliance_tools
        - api_access
        - custom_branded_portal

  hse:
    name_en: "HSE & Offshore"
    name_es: "HSE y Offshore"
    icon: "🔧"
    slug: "hse"
    description_en: "Compliance logs, incident reports, certifications"
    description_es: "Registros de cumplimiento, reportes de incidentes, certificaciones"
    modules:
      all_plans:
        - client_management
        - compliance_logs
        - basic_invoicing
        - document_storage
      growth_plus:
        - incident_reporting
        - certification_tracking
        - audit_management
        - multi_site
      premium_only:
        - advanced_analytics
        - api_access
        - custom_forms
        - enterprise_security

  funeral:
    name_en: "Funeral Services"
    name_es: "Servicios Funerarios"
    icon: "🕊️"
    slug: "funeral"
    description_en: "Family management, arrangements, scheduling & billing"
    description_es: "Gestión familiar, arreglos, programación y facturación"
    modules:
      all_plans:
        - client_management
        - arrangement_tracking
        - basic_invoicing
        - scheduling
      growth_plus:
        - inventory_management
        - multi_branch
        - vendor_management
        - payment_plans
      premium_only:
        - advanced_analytics
        - custom_branding
        - api_access
        - compliance_tools
```

---

## 7. SECURITY SPECIFICATIONS

```yaml
rate_limiting:
  public_endpoints:
    window: "1 minute"
    max_requests: 60
  form_submission:
    window: "1 hour"
    max_requests: 10
  api_endpoints:
    window: "1 minute"
    max_requests: 100

input_validation:
  business_name:
    min_length: 2
    max_length: 100
    pattern: "^[a-zA-Z0-9\\s\\-\\&\\'\\.]+$"
  
  owner_email:
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    
  owner_phone:
    pattern: "^[\\+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,4}[-\\s\\.]?[0-9]{1,9}$"
    
  coupon_code:
    pattern: "^[A-Z0-9]{4,20}$"

file_upload:
  receipt:
    max_size_mb: 10
    allowed_types:
      - "image/jpeg"
      - "image/png"
      - "image/webp"
      - "application/pdf"
    virus_scan: true

session_management:
  type: "JWT"
  expiry: "24 hours"
  refresh_enabled: true
  secure_cookie: true
  same_site: "strict"

admin_security:
  two_factor_required: true
  session_expiry: "4 hours"
  ip_whitelist: false  # Allow any IP for remote work
  password_policy:
    min_length: 12
    require_uppercase: true
    require_lowercase: true
    require_number: true
    require_special: true
```

---

## 8. MONITORING & ALERTING

```yaml
alerts:
  critical:
    - name: "Payment Verification Stuck"
      condition: "SalesOrder.status = pending_verification for > 24 hours"
      notification: "email + SMS to admin"
    
    - name: "Provisioning Failed"
      condition: "ProvisioningJob.status = failed"
      notification: "email to tech team"
    
    - name: "High Error Rate"
      condition: "> 5% requests returning 5xx in 5 minutes"
      notification: "Slack + email"

  warning:
    - name: "Payment Gateway Down"
      condition: "WiPay/Stripe health check fails 3 times"
      notification: "Slack"
    
    - name: "Email Send Failures"
      condition: "> 10 email send failures in 1 hour"
      notification: "email to admin"

logging:
  retention_days: 90
  levels:
    - "error"
    - "warning"
    - "info"
  structured: true
  include:
    - timestamp
    - order_number
    - action
    - user_email
    - ip_address
    - response_time_ms
```

---

*Documento complementario generado el 2026-03-26*
*Este archivo debe ser combinado con el specification original para tener un documento completo.*
