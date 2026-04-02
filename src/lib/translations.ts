// NexusOS Complete Translations - ES/EN
// All text for the Sales Portal

export const translations = {
  en: {
    // NAVBAR
    nav: {
      features: "Features",
      pricing: "Pricing",
      industries: "Industries",
      testimonials: "Testimonials",
      faq: "FAQ",
      getStarted: "Get Started →",
      langToggle: "ES",
    },
    
    // HERO SECTION
    hero: {
      eyebrow: "BUILT FOR THE CARIBBEAN. READY FOR THE WORLD.",
      headline: "Your Business Deserves an Operating System.",
      subheadline: "NexusOS gives every industry the digital infrastructure that Fortune 500 companies pay millions for. Bakeries. Law firms. Clinics. Salons. All on one platform.",
      ctaPrimary: "Claim Your Workspace →",
      ctaSecondary: "See How It Works",
      trustLine: "Trusted by businesses in Trinidad, Tobago & Guyana",
      trustBadges: {
        secure: "Secure",
        wipay: "WiPay",
        stripe: "Stripe",
        industries: "11 Industries",
      },
      priceTag: "Starting at TT$500/month",
    },
    
    // PAIN POINTS
    painPoints: {
      title: "If any of this sounds familiar... NexusOS was built for you.",
      items: [
        "Tracking orders in WhatsApp messages and prayer 🙏",
        "Chasing payments because you forgot who owes what",
        "Your 'system' is a notebook that nobody but you can read",
        "You can't take a day off because everything lives in your head",
        "Clients complaining about no receipts, no reminders, no updates",
        "Month-end is chaos because the numbers are scattered everywhere",
      ],
    },
    
    // HOW IT WORKS
    howItWorks: {
      title: "How It Works",
      subtitle: "From sign-up to live workspace in under 10 minutes",
      steps: [
        {
          title: "Pick Your Industry",
          description: "Select your business type. NexusOS configures the exact modules your industry uses — no bloat, no missing tools.",
          icon: "Building2",
        },
        {
          title: "Choose Your Plan",
          description: "Pick Starter, Growth, or Premium. Pay securely via WiPay (T&T) or Stripe (international). Instant confirmation.",
          icon: "CreditCard",
        },
        {
          title: "Your Workspace Opens",
          description: "Within minutes, your private digital headquarters is live. Your team logs in. You never go back to spreadsheets.",
          icon: "Zap",
        },
      ],
    },
    
    // INDUSTRIES
    industries: {
      title: "Built for Your Industry",
      subtitle: "Every business is different. NexusOS adapts to you.",
      badge: {
        active: "Active",
        comingSoon: "Coming Soon",
      },
      // Prices shown on individual industry pages only
      items: [
        {
          slug: "clinic",
          icon: "🏥",
          name: "Clinics & Wellness",
          description: "Appointments, patient records, telemedicine & nurse portal",
        },
        {
          slug: "nurse",
          icon: "💉",
          name: "Nursing & Home Care",
          description: "Home visits, care plans, vital signs & MAR",
        },
        {
          slug: "beauty",
          icon: "💇",
          name: "Salon & Spa",
          description: "Bookings, stylists, memberships & gift cards",
        },
        {
          slug: "lawfirm",
          icon: "⚖️",
          name: "Law Firms",
          description: "Case management, trust accounting, AI documents",
        },
        {
          slug: "pharmacy",
          icon: "💊",
          name: "Pharmacy",
          description: "Prescriptions, drug database, insurance claims",
        },
        {
          slug: "insurance",
          icon: "🛡️",
          name: "Insurance",
          description: "Enterprise platform: AI fraud, IFRS 17, reinsurance",
        },
        {
          slug: "retail",
          icon: "🛍️",
          name: "Retail & Boutique",
          description: "Inventory, POS, multi-branch & loyalty programs",
        },
        {
          slug: "bakery",
          icon: "🧁",
          name: "Bakery & Pastry",
          description: "Manage orders, recipes, clients & POS in one place",
        },
        {
          slug: "hospitality",
          icon: "🍸",
          name: "Bars & Hospitality",
          description: "Table management, tabs, events & staff scheduling",
        },
        {
          slug: "events",
          icon: "🎉",
          name: "Events & Venues",
          description: "Bookings, client contracts, vendor management",
        },
        {
          slug: "hse",
          icon: "🔧",
          name: "HSE & Offshore",
          description: "Compliance logs, incident reports, certifications",
        },
      ],
    },
    
    // FEATURES
    features: {
      title: "Everything You Need",
      subtitle: "Powerful features that grow with your business",
      tabs: {
        starter: "STARTER",
        growth: "GROWTH ENGINE",
        premium: "PREMIUM ELITE",
      },
      byPlan: {
        starter: [
          "Client Management",
          "Basic Invoicing",
          "Appointment Scheduling",
          "Contact Directory",
          "Email Notifications",
          "Single Branch",
          "Up to 3 Users",
          "Mobile App Access",
        ],
        growth: [
          "Everything in Starter",
          "Advanced Analytics",
          "Inventory Management",
          "Multi-Branch (3 locations)",
          "Custom Templates",
          "Up to 10 Users",
          "Priority Support",
          "Quotations & Proposals",
          "Recurring Billing",
        ],
        premium: [
          "Everything in Growth",
          "Unlimited Templates",
          "Enterprise Security",
          "Full Audit Trail",
          "Compliance Tools",
          "Multi-Branch (10 locations)",
          "50 Users",
          "API Access",
          "Custom Branding",
          "Dedicated Account Manager",
        ],
      },
    },
    
    // PRICING
    pricing: {
      tag: "Simple, Honest Pricing",
      title: "Less than the cost of one staff member's overtime.",
      subtitle: "Every plan includes setup, onboarding, and full support. No hidden fees. No contracts. Cancel anytime.",
      toggleMonthly: "Monthly",
      toggleAnnual: "Annual (Save 20%)",
      plans: {
        starter: {
          name: "STARTER",
          priceMonthly: 500,
          priceAnnual: 400,
          priceUsd: "≈ USD $75",
          period: "/month",
          badge: "GET STARTED",
          tagline: "For businesses taking their first step into digital order.",
          cta: "Start with Starter",
          idealFor: "Home-based businesses, solo operators, first-time digital users",
        },
        growth: {
          name: "GROWTH ENGINE",
          priceMonthly: 1200,
          priceAnnual: 960,
          priceUsd: "≈ USD $180",
          period: "/month",
          badge: "MOST POPULAR 🔥",
          tagline: "For businesses ready to scale without losing control.",
          cta: "Launch My Growth",
          idealFor: "2–10 staff, multi-location, businesses earning 6–7 figures TTD",
        },
        premium: {
          name: "PREMIUM ELITE",
          priceMonthly: 2500,
          priceAnnual: 2000,
          priceUsd: "≈ USD $375",
          period: "/month",
          badge: "ENTERPRISE GRADE",
          tagline: "The complete digital command center. Nothing held back.",
          cta: "Claim Premium",
          idealFor: "Clinics, law firms, HSE ops, insurance agencies, multi-branch",
        },
      },
      activationFee: {
        amount: "TT$1,250 one-time activation",
        includes: "Account setup · First-month credit · Onboarding session",
        urgency: "⚡ First 50 clients only — early access rate. Regular price: TT$2,500.",
      },
      comparison: {
        title: "Plan Comparison",
        rows: [
          { feature: "Max Users", starter: "3", growth: "10", premium: "50" },
          { feature: "Max Branches", starter: "1", growth: "3", premium: "10" },
          { feature: "Analytics", starter: "Basic", growth: "Advanced", premium: "Enterprise" },
          { feature: "Multi-Branch", starter: false, growth: true, premium: true },
          { feature: "Audit Trail", starter: false, growth: false, premium: true },
          { feature: "API Access", starter: false, growth: false, premium: true },
          { feature: "Priority Support", starter: false, growth: true, premium: true },
          { feature: "Custom Branding", starter: false, growth: false, premium: true },
        ],
      },
    },
    
    // TESTIMONIALS
    testimonials: {
      title: "Trusted by Caribbean Businesses",
      subtitle: "See what our clients are saying",
      items: [
        {
          quote: "I used to lose track of at least 5 orders per week in my WhatsApp. Now everything is organized, my clients get receipts automatically, and I actually know my profit margin.",
          author: "Sandra M.",
          role: "Pastry Chef",
          location: "Port of Spain",
          rating: 5,
        },
        {
          quote: "Our front desk went from chaos to calm in one week. Patient intake, billing, and follow-ups all in one place.",
          author: "Dr. K. Rampersad",
          role: "GP Clinic",
          location: "San Fernando",
          rating: 5,
        },
        {
          quote: "As a law firm, document tracking and billing used to be a nightmare. NexusOS handles it like it was built specifically for us.",
          author: "A. Hosein",
          role: "Attorney-at-Law",
          location: "Port of Spain",
          rating: 5,
        },
      ],
    },
    
    // FAQ
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      items: [
        {
          question: "Do I need technical knowledge to use NexusOS?",
          answer: "None at all. If you can use WhatsApp, you can use NexusOS. We also provide a full onboarding session included in your activation fee.",
        },
        {
          question: "What happens after I pay?",
          answer: "Within minutes, your private workspace is created. You receive a confirmation email with your login link, invoice, and getting-started guide. No waiting.",
        },
        {
          question: "Can I change plans later?",
          answer: "Yes. You can upgrade or downgrade at any time. Upgrades are prorated. Downgrades take effect at the next billing cycle.",
        },
        {
          question: "Is my data safe?",
          answer: "Your data is completely isolated in your own private workspace. No other business can see your information. We use enterprise-grade encryption.",
        },
        {
          question: "Do you support Spanish?",
          answer: "Yes — NexusOS is fully bilingual. The platform, invoices, and support are available in both English and Spanish.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "For Trinidad & Tobago clients: WiPay (debit/credit). International clients: Stripe (major cards). We also accept bank transfer with receipt verification.",
        },
      ],
    },
    
    // APPLY FORM
    form: {
      title: "Get Started Today",
      subtitle: "Your digital transformation begins here",
      steps: ["Business Info", "Industry & Plan", "Payment", "Confirmation"],
      
      // Step 1
      step1: {
        title: "Business Information",
        businessName: "Business Name",
        businessNamePlaceholder: "e.g., Maria's Bakery",
        legalName: "Legal/Registered Name",
        legalNameHint: "If different from business name",
        businessAddress: "Business Address",
        businessAddressPlaceholder: "Full address",
        ownerName: "Owner Full Name",
        ownerNamePlaceholder: "Your full name",
        ownerEmail: "Email Address",
        ownerEmailPlaceholder: "email@example.com",
        ownerPhone: "WhatsApp / Phone",
        ownerPhonePlaceholder: "+1 868 XXX-XXXX",
        country: "Country",
        countryOptions: ["Trinidad & Tobago", "Guyana", "Barbados", "Jamaica", "Other"],
        languagePreference: "Preferred Language",
        languageOptions: ["English", "Español"],
        nextButton: "Continue →",
      },
      
      // Step 2
      step2: {
        title: "Select Your Plan",
        selectIndustry: "Select Your Industry",
        billingCycle: "Billing Cycle",
        monthly: "Monthly",
        annualSave: "Annual (Save 20%)",
        couponCode: "Promo Code",
        couponPlaceholder: "Enter code",
        couponApply: "Apply",
        couponApplied: "✓ Code applied — TT$",
        couponInvalid: "Invalid or expired code",
        couponOff: " off!",
        orderSummary: "Order Summary",
        selectedIndustry: "Selected Industry",
        selectedPlan: "Selected Plan",
        planPrice: "Plan Price",
        activationFee: "Activation Fee",
        discount: "Discount",
        totalDue: "TOTAL DUE",
        backButton: "← Back",
        nextButton: "Continue to Payment →",
      },
      
      // Step 3
      step3: {
        title: "Payment Method",
        wipay: {
          name: "WiPay",
          recommended: "Recommended for T&T",
          description: "Credit/Debit Card via WiPay",
          redirectNotice: "You will be redirected to WiPay's secure payment page. After payment, return here for instant confirmation.",
          button: "Pay TT$",
          buttonSuffix: " via WiPay →",
        },
        stripe: {
          name: "Stripe",
          international: "International",
          description: "All major cards accepted",
          button: "Pay TT$",
          buttonSuffix: " via Stripe →",
        },
        bankTransfer: {
          name: "Bank Transfer",
          local: "T&T Local Banks",
          description: "Manual verification required",
          bankDetails: "Republic Bank — Account: 220-XXXX-XXX",
          branch: "Branch: Port of Spain Main",
          reference: "Reference: Your email address",
          receiptUpload: "Upload Transfer Receipt",
          processingTime: "Payment processed within 2–24 hours after verification.",
          button: "Submit Transfer Receipt",
        },
        backButton: "← Back",
        simulateButton: "Simulate Payment (Demo)",
      },
      
      // Step 4
      step4: {
        title: "Order Confirmed! 🎉",
        provisioning: "Your workspace is being provisioned — expect your login details within 5 minutes.",
        bankTransfer: "Your receipt has been received. Our team will verify and activate your workspace within 2–24 hours.",
        orderNumber: "Order Number",
        business: "Business",
        plan: "Plan",
        totalPaid: "Total Paid",
        checkEmail: "Check your email:",
        downloadInvoice: "Download Invoice",
        whatsappSupport: "WhatsApp Support",
        dashboardButton: "Go to Dashboard →",
        thankYou: "Thank you for choosing NexusOS!",
      },
      
      // Validation
      validation: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email",
        invalidPhone: "Please enter a valid phone number",
      },
    },
    
    // FOOTER
    footer: {
      tagline: "Your Business Deserves an Operating System.",
      description: "NexusOS provides enterprise-grade digital infrastructure for Caribbean businesses.",
      links: {
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        industries: "Industries",
        company: "Company",
        about: "About Us",
        contact: "Contact",
        careers: "Careers",
        legal: "Legal",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        refund: "Refund Policy",
      },
      contact: {
        title: "Contact",
        email: "support@nexusos.tt",
        phone: "+1 868 XXX-XXXX",
        whatsapp: "WhatsApp",
      },
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        twitter: "Twitter",
      },
      copyright: "© 2026 NexusOS. Built in Trinidad & Tobago 🇹🇹",
    },
    
    // COMMON
    common: {
      loading: "Loading...",
      error: "Something went wrong. Please try again.",
      success: "Success!",
      currency: "TT$",
      usdEquivalent: "≈ USD $",
    },
  },
  
  // ============================================
  // SPANISH TRANSLATIONS
  // ============================================
  es: {
    // NAVBAR
    nav: {
      features: "Funciones",
      pricing: "Precios",
      industries: "Industrias",
      testimonials: "Testimonios",
      faq: "FAQ",
      getStarted: "Comenzar →",
      langToggle: "EN",
    },
    
    // HERO SECTION
    hero: {
      eyebrow: "CREADO PARA EL CARIBE. LISTO PARA EL MUNDO.",
      headline: "Tu Negocio Merece un Sistema Operativo.",
      subheadline: "NexusOS le da a cada industria la infraestructura digital que las empresas del Fortune 500 pagan millones. Panaderías. Bufetes. Clínicas. Salones. En una plataforma.",
      ctaPrimary: "Reclama Tu Espacio →",
      ctaSecondary: "Cómo Funciona",
      trustLine: "Confiado por negocios en Trinidad, Tobago y Guyana",
      trustBadges: {
        secure: "Seguro",
        wipay: "WiPay",
        stripe: "Stripe",
        industries: "11 Industrias",
      },
      priceTag: "Desde TT$500/mes",
    },
    
    // PAIN POINTS
    painPoints: {
      title: "Si algo de esto te suena familiar... NexusOS fue creado para ti.",
      items: [
        "Registrando pedidos en mensajes de WhatsApp y rezando 🙏",
        "Persiguiendo pagos porque olvidaste quién debe qué",
        "Tu 'sistema' es un cuaderno que solo tú puedes entender",
        "No puedes tomarte un día libre porque todo vive en tu cabeza",
        "Clientes quejándose de no recibir facturas, ni recordatorios, ni actualizaciones",
        "El cierre de mes es un caos porque los números están por todas partes",
      ],
    },
    
    // HOW IT WORKS
    howItWorks: {
      title: "Cómo Funciona",
      subtitle: "De registro a espacio de trabajo activo en menos de 10 minutos",
      steps: [
        {
          title: "Elige Tu Industria",
          description: "Selecciona tu tipo de negocio. NexusOS configura exactamente los módulos que tu industria usa — sin excesos, sin herramientas faltantes.",
          icon: "Building2",
        },
        {
          title: "Escoge Tu Plan",
          description: "Elige Starter, Growth o Premium. Paga de forma segura por WiPay (T&T) o Stripe (internacional). Confirmación instantánea.",
          icon: "CreditCard",
        },
        {
          title: "Tu Espacio Abre",
          description: "En minutos, tu sede digital privada está en vivo. Tu equipo inicia sesión. Nunca vuelves a las hojas de cálculo.",
          icon: "Zap",
        },
      ],
    },
    
    // INDUSTRIES
    industries: {
      title: "Creado para Tu Industria",
      subtitle: "Cada negocio es diferente. NexusOS se adapta a ti.",
      badge: {
        active: "Activo",
        comingSoon: "Próximamente",
      },
      // Precios mostrados solo en páginas de industria individuales
      items: [
        {
          slug: "clinic",
          icon: "🏥",
          name: "Clínicas y Bienestar",
          description: "Citas, historiales, telemedicina y portal de enfermería",
        },
        {
          slug: "nurse",
          icon: "💉",
          name: "Enfermería y Home Care",
          description: "Visitas domiciliarias, planes de cuidado, signos vitales",
        },
        {
          slug: "beauty",
          icon: "💇",
          name: "Salón y Spa",
          description: "Reservas, estilistas, membresías y tarjetas de regalo",
        },
        {
          slug: "lawfirm",
          icon: "⚖️",
          name: "Bufetes de Abogados",
          description: "Gestión de casos, trust accounting, AI documentos",
        },
        {
          slug: "pharmacy",
          icon: "💊",
          name: "Farmacia",
          description: "Recetas, base de datos medicamentos, seguros",
        },
        {
          slug: "insurance",
          icon: "🛡️",
          name: "Aseguradoras",
          description: "Plataforma enterprise: AI fraude, IFRS 17, reaseguro",
        },
        {
          slug: "retail",
          icon: "🛍️",
          name: "Retail y Boutique",
          description: "Inventario, POS, multi-sucursal y programas de lealtad",
        },
        {
          slug: "bakery",
          icon: "🧁",
          name: "Panadería y Pastelería",
          description: "Gestiona pedidos, recetas, clientes y POS en un solo lugar",
        },
        {
          slug: "hospitality",
          icon: "🍸",
          name: "Bares y Hospitalidad",
          description: "Gestión de mesas, cuentas, eventos y horarios de personal",
        },
        {
          slug: "events",
          icon: "🎉",
          name: "Eventos y Locales",
          description: "Reservas, contratos de clientes, gestión de proveedores",
        },
        {
          slug: "hse",
          icon: "🔧",
          name: "HSE y Offshore",
          description: "Registros de cumplimiento, reportes de incidentes, certificaciones",
        },
      ],
    },
    
    // FEATURES
    features: {
      title: "Todo Lo Que Necesitas",
      subtitle: "Funciones poderosas que crecen con tu negocio",
      tabs: {
        starter: "STARTER",
        growth: "GROWTH ENGINE",
        premium: "PREMIUM ELITE",
      },
      byPlan: {
        starter: [
          "Gestión de Clientes",
          "Facturación Básica",
          "Programación de Citas",
          "Directorio de Contactos",
          "Notificaciones por Email",
          "Una Sede",
          "Hasta 3 Usuarios",
          "Acceso App Móvil",
        ],
        growth: [
          "Todo en Starter",
          "Análisis Avanzados",
          "Gestión de Inventario",
          "Multi-Sede (3 ubicaciones)",
          "Plantillas Personalizadas",
          "Hasta 10 Usuarios",
          "Soporte Prioritario",
          "Cotizaciones y Propuestas",
          "Facturación Recurrente",
        ],
        premium: [
          "Todo en Growth",
          "Plantillas Ilimitadas",
          "Seguridad Empresarial",
          "Registro de Auditoría Completo",
          "Herramientas de Cumplimiento",
          "Multi-Sede (10 ubicaciones)",
          "50 Usuarios",
          "Acceso API",
          "Marca Personalizada",
          "Gerente de Cuenta Dedicado",
        ],
      },
    },
    
    // PRICING
    pricing: {
      tag: "Precios Simples y Honestos",
      title: "Menos que el costo del tiempo extra de un empleado.",
      subtitle: "Cada plan incluye configuración, capacitación y soporte completo. Sin cargos ocultos. Sin contratos. Cancela cuando quieras.",
      toggleMonthly: "Mensual",
      toggleAnnual: "Anual (Ahorra 20%)",
      plans: {
        starter: {
          name: "STARTER",
          priceMonthly: 500,
          priceAnnual: 400,
          priceUsd: "≈ USD $75",
          period: "/mes",
          badge: "COMENZAR",
          tagline: "Para negocios que dan su primer paso hacia el orden digital.",
          cta: "Empezar con Starter",
          idealFor: "Negocios desde casa, emprendedores individuales, primeros usuarios digitales",
        },
        growth: {
          name: "GROWTH ENGINE",
          priceMonthly: 1200,
          priceAnnual: 960,
          priceUsd: "≈ USD $180",
          period: "/mes",
          badge: "MÁS POPULAR 🔥",
          tagline: "Para negocios listos para crecer sin perder el control.",
          cta: "Lanzar Mi Crecimiento",
          idealFor: "2–10 empleados, múltiples ubicaciones, negocios con ingresos de 6–7 cifras TTD",
        },
        premium: {
          name: "PREMIUM ELITE",
          priceMonthly: 2500,
          priceAnnual: 2000,
          priceUsd: "≈ USD $375",
          period: "/mes",
          badge: "GRADO EMPRESARIAL",
          tagline: "El centro de comando digital completo. Sin límites.",
          cta: "Reclamar Premium",
          idealFor: "Clínicas, bufetes, operaciones HSE, agencias de seguros, múltiples sucursales",
        },
      },
      activationFee: {
        amount: "TT$1,250 activación única",
        includes: "Configuración de cuenta · Crédito primer mes · Sesión de capacitación",
        urgency: "⚡ Solo primeros 50 clientes — tarifa de acceso anticipado. Precio regular: TT$2,500.",
      },
      comparison: {
        title: "Comparación de Planes",
        rows: [
          { feature: "Máx Usuarios", starter: "3", growth: "10", premium: "50" },
          { feature: "Máx Sedes", starter: "1", growth: "3", premium: "10" },
          { feature: "Análisis", starter: "Básico", growth: "Avanzado", premium: "Empresarial" },
          { feature: "Multi-Sede", starter: false, growth: true, premium: true },
          { feature: "Registro Auditoría", starter: false, growth: false, premium: true },
          { feature: "Acceso API", starter: false, growth: false, premium: true },
          { feature: "Soporte Prioritario", starter: false, growth: true, premium: true },
          { feature: "Marca Personalizada", starter: false, growth: false, premium: true },
        ],
      },
    },
    
    // TESTIMONIALS
    testimonials: {
      title: "Confiado por Negocios del Caribe",
      subtitle: "Mira lo que dicen nuestros clientes",
      items: [
        {
          quote: "Antes perdía al menos 5 pedidos por semana en mi WhatsApp. Ahora todo está organizado, mis clientes reciben facturas automáticamente, y realmente conozco mi margen de ganancia.",
          author: "Sandra M.",
          role: "Chef Pastelera",
          location: "Puerto España",
          rating: 5,
        },
        {
          quote: "Nuestra recepción pasó del caos a la calma en una semana. Admisión de pacientes, facturación y seguimientos todo en un solo lugar.",
          author: "Dr. K. Rampersad",
          role: "Clínica de Medicina General",
          location: "San Fernando",
          rating: 5,
        },
        {
          quote: "Como bufete de abogados, el seguimiento de documentos y facturación era una pesadilla. NexusOS lo maneja como si hubiera sido creado específicamente para nosotros.",
          author: "A. Hosein",
          role: "Abogado Litigante",
          location: "Puerto España",
          rating: 5,
        },
      ],
    },
    
    // FAQ
    faq: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber",
      items: [
        {
          question: "¿Necesito conocimientos técnicos para usar NexusOS?",
          answer: "Para nada. Si sabes usar WhatsApp, puedes usar NexusOS. También incluimos una sesión completa de capacitación en tu tarifa de activación.",
        },
        {
          question: "¿Qué pasa después de pagar?",
          answer: "En cuestión de minutos, tu espacio de trabajo privado es creado. Recibes un email de confirmación con tu enlace de acceso, factura y guía de inicio. Sin esperas.",
        },
        {
          question: "¿Puedo cambiar de plan después?",
          answer: "Sí. Puedes subir o bajar de plan en cualquier momento. Las actualizaciones son prorrateadas. Los cambios a menor plan aplican en el próximo ciclo de facturación.",
        },
        {
          question: "¿Están seguros mis datos?",
          answer: "Tus datos están completamente aislados en tu propio espacio de trabajo privado. Ningún otro negocio puede ver tu información. Usamos encriptación de grado empresarial.",
        },
        {
          question: "¿Soportan español?",
          answer: "Sí — NexusOS es completamente bilingüe. La plataforma, facturas y soporte están disponibles tanto en inglés como en español.",
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Para clientes de Trinidad y Tobago: WiPay (débito/crédito). Clientes internacionales: Stripe (tarjetas principales). También aceptamos transferencia bancaria con verificación de recibo.",
        },
      ],
    },
    
    // APPLY FORM
    form: {
      title: "Comienza Hoy",
      subtitle: "Tu transformación digital comienza aquí",
      steps: ["Info Negocio", "Industria y Plan", "Pago", "Confirmación"],
      
      // Step 1
      step1: {
        title: "Información del Negocio",
        businessName: "Nombre del Negocio",
        businessNamePlaceholder: "Ej: Panadería Doña María",
        legalName: "Nombre Legal/Registrado",
        legalNameHint: "Si es diferente al nombre comercial",
        businessAddress: "Dirección del Negocio",
        businessAddressPlaceholder: "Dirección completa",
        ownerName: "Nombre Completo del Propietario",
        ownerNamePlaceholder: "Tu nombre completo",
        ownerEmail: "Correo Electrónico",
        ownerEmailPlaceholder: "correo@ejemplo.com",
        ownerPhone: "WhatsApp / Teléfono",
        ownerPhonePlaceholder: "+1 868 XXX-XXXX",
        country: "País",
        countryOptions: ["Trinidad y Tobago", "Guyana", "Barbados", "Jamaica", "Otro"],
        languagePreference: "Idioma Preferido",
        languageOptions: ["English", "Español"],
        nextButton: "Continuar →",
      },
      
      // Step 2
      step2: {
        title: "Selecciona Tu Plan",
        selectIndustry: "Selecciona Tu Industria",
        billingCycle: "Ciclo de Facturación",
        monthly: "Mensual",
        annualSave: "Anual (Ahorra 20%)",
        couponCode: "Código Promocional",
        couponPlaceholder: "Ingresa código",
        couponApply: "Aplicar",
        couponApplied: "✓ Código aplicado — TT$",
        couponInvalid: "Código inválido o expirado",
        couponOff: " de descuento!",
        orderSummary: "Resumen del Pedido",
        selectedIndustry: "Industria Seleccionada",
        selectedPlan: "Plan Seleccionado",
        planPrice: "Precio del Plan",
        activationFee: "Tarifa de Activación",
        discount: "Descuento",
        totalDue: "TOTAL A PAGAR",
        backButton: "← Atrás",
        nextButton: "Continuar al Pago →",
      },
      
      // Step 3
      step3: {
        title: "Método de Pago",
        wipay: {
          name: "WiPay",
          recommended: "Recomendado para T&T",
          description: "Tarjeta de Crédito/Débito vía WiPay",
          redirectNotice: "Serás redirigido a la página de pago seguro de WiPay. Después del pago, regresa aquí para confirmación instantánea.",
          button: "Pagar TT$",
          buttonSuffix: " vía WiPay →",
        },
        stripe: {
          name: "Stripe",
          international: "Internacional",
          description: "Todas las tarjetas principales aceptadas",
          button: "Pagar TT$",
          buttonSuffix: " vía Stripe →",
        },
        bankTransfer: {
          name: "Transferencia Bancaria",
          local: "Bancos Locales T&T",
          description: "Verificación manual requerida",
          bankDetails: "Republic Bank — Cuenta: 220-XXXX-XXX",
          branch: "Sucursal: Port of Spain Main",
          reference: "Referencia: Tu correo electrónico",
          receiptUpload: "Subir Comprobante de Transferencia",
          processingTime: "Pago procesado en 2–24 horas después de verificación.",
          button: "Enviar Comprobante",
        },
        backButton: "← Atrás",
        simulateButton: "Simular Pago (Demo)",
      },
      
      // Step 4
      step4: {
        title: "¡Pedido Confirmado! 🎉",
        provisioning: "Tu espacio de trabajo está siendo configurado — espera tus datos de acceso en 5 minutos.",
        bankTransfer: "Tu comprobante ha sido recibido. Nuestro equipo verificará y activará tu espacio de trabajo en 2–24 horas.",
        orderNumber: "Número de Orden",
        business: "Negocio",
        plan: "Plan",
        totalPaid: "Total Pagado",
        checkEmail: "Revisa tu correo:",
        downloadInvoice: "Descargar Factura",
        whatsappSupport: "Soporte WhatsApp",
        dashboardButton: "Ir al Dashboard →",
        thankYou: "¡Gracias por elegir NexusOS!",
      },
      
      // Validation
      validation: {
        required: "Este campo es requerido",
        invalidEmail: "Por favor ingresa un email válido",
        invalidPhone: "Por favor ingresa un número de teléfono válido",
      },
    },
    
    // FOOTER
    footer: {
      tagline: "Tu Negocio Merece un Sistema Operativo.",
      description: "NexusOS proporciona infraestructura digital de grado empresarial para negocios del Caribe.",
      links: {
        product: "Producto",
        features: "Funciones",
        pricing: "Precios",
        industries: "Industrias",
        company: "Empresa",
        about: "Nosotros",
        contact: "Contacto",
        careers: "Carreras",
        legal: "Legal",
        terms: "Términos de Servicio",
        privacy: "Política de Privacidad",
        refund: "Política de Reembolso",
      },
      contact: {
        title: "Contacto",
        email: "soporte@nexusos.tt",
        phone: "+1 868 XXX-XXXX",
        whatsapp: "WhatsApp",
      },
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        twitter: "Twitter",
      },
      copyright: "© 2026 NexusOS. Creado en Trinidad & Tobago 🇹🇹",
    },
    
    // COMMON
    common: {
      loading: "Cargando...",
      error: "Algo salió mal. Por favor intenta de nuevo.",
      success: "¡Éxito!",
      currency: "TT$",
      usdEquivalent: "≈ USD $",
    },
  },
};

export type Language = 'en' | 'es';
export type TranslationType = typeof translations.en;
