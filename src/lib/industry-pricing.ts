// NexusOS Industry-Specific Pricing
// Based on market research at 75-80% of competitor prices
// Exchange rate: 1 USD ≈ 6.75 TT$
// Updated: April 2026

export interface IndustryPricing {
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  plans: {
    starter: { price: number; priceAnnual: number; users: number; branches: number; employees: string };
    growth: { price: number; priceAnnual: number; users: number; branches: number; employees: string };
    premium: { price: number; priceAnnual: number; users: number; branches: number; employees: string };
    enterprise?: { price: number; priceAnnual: number; users: number; branches: number; employees: string };
  };
  features: string[];
  competitors: { name: string; priceRange: string }[];
}

export const INDUSTRY_PRICING: Record<string, IndustryPricing> = {
  clinic: {
    slug: 'clinic',
    name: 'Clínica Médica',
    nameEn: 'Medical Clinic',
    icon: '🏥',
    color: '#22D3EE',
    plans: {
      starter: { price: 500, priceAnnual: 450, users: 5, branches: 1, employees: '1-2 doctores' },
      growth: { price: 1000, priceAnnual: 900, users: 15, branches: 2, employees: '3-5 doctores' },
      premium: { price: 1800, priceAnnual: 1620, users: 50, branches: 5, employees: '6-10 doctores' },
      enterprise: { price: 2500, priceAnnual: 2250, users: 200, branches: 20, employees: '10+ doctores' },
    },
    features: ['Citas', 'Historiales', 'Recetas', 'Laboratorio', 'Telemedicina', 'Facturación'],
    competitors: [
      { name: 'SimplePractice', priceRange: 'USD $29-99/mes' },
      { name: 'Kareo/Tebra', priceRange: 'USD $150-500/mes' },
      { name: 'Athenahealth', priceRange: 'USD $150-400/mes' },
    ],
  },
  
  nurse: {
    slug: 'nurse',
    name: 'Enfermería / Cuidado en Casa',
    nameEn: 'Nursing / Home Care',
    icon: '💉',
    color: '#34D399',
    plans: {
      starter: { price: 400, priceAnnual: 360, users: 5, branches: 1, employees: '1-3 enfermeras' },
      growth: { price: 750, priceAnnual: 675, users: 15, branches: 2, employees: '4-6 enfermeras' },
      premium: { price: 1200, priceAnnual: 1080, users: 50, branches: 5, employees: '7-10 enfermeras' },
      enterprise: { price: 2000, priceAnnual: 1800, users: 200, branches: 20, employees: '11+ enfermeras' },
    },
    features: ['Visitas domiciliarias', 'Planes de cuidado', 'Signos vitales', 'MAR', 'SBAR Handoff', 'Protocolos'],
    competitors: [
      { name: 'AlayaCare', priceRange: 'USD $200-500/mes' },
      { name: 'ClearCare', priceRange: 'USD $200-600/mes' },
      { name: 'Axxess', priceRange: 'USD $150-400/mes' },
    ],
  },
  
  lawfirm: {
    slug: 'lawfirm',
    name: 'Bufete de Abogados',
    nameEn: 'Law Firm',
    icon: '⚖️',
    color: '#C4A35A',
    plans: {
      starter: { price: 500, priceAnnual: 450, users: 5, branches: 1, employees: '1-2 abogados' },
      growth: { price: 1000, priceAnnual: 900, users: 15, branches: 2, employees: '3-5 abogados' },
      premium: { price: 2000, priceAnnual: 1800, users: 50, branches: 5, employees: '6-10 abogados' },
      enterprise: { price: 3000, priceAnnual: 2700, users: 200, branches: 20, employees: '11+ abogados' },
    },
    features: ['Gestión de casos', 'Trust accounting (IOLTA)', 'Documentos AI', 'Facturación de tiempo', 'Biblioteca legal TT'],
    competitors: [
      { name: 'Clio', priceRange: 'USD $39-145/usuario/mes' },
      { name: 'MyCase', priceRange: 'USD $49-99/usuario/mes' },
      { name: 'PracticePanther', priceRange: 'USD $49-89/usuario/mes' },
    ],
  },
  
  beauty: {
    slug: 'beauty',
    name: 'Salón de Belleza / Spa',
    nameEn: 'Beauty Salon / Spa',
    icon: '💇',
    color: '#EC4899',
    plans: {
      starter: { price: 400, priceAnnual: 360, users: 5, branches: 1, employees: '1-3 empleados' },
      growth: { price: 750, priceAnnual: 675, users: 15, branches: 2, employees: '4-6 empleados' },
      premium: { price: 1200, priceAnnual: 1080, users: 50, branches: 5, employees: '7-10 empleados' },
      enterprise: { price: 1500, priceAnnual: 1350, users: 200, branches: 20, employees: '11+ empleados' },
    },
    features: ['Reservas online', 'POS integrado', 'Inventario', 'Membresías', 'Tarjetas de regalo', 'Contabilidad TT'],
    competitors: [
      { name: 'Mindbody', priceRange: 'USD $129-499/mes' },
      { name: 'Vagaro', priceRange: 'USD $25-95/mes' },
      { name: 'Zenoti', priceRange: 'USD $200-800/mes' },
    ],
  },
  
  bakery: {
    slug: 'bakery',
    name: 'Panadería / Pastelería',
    nameEn: 'Bakery / Pastry Shop',
    icon: '🥐',
    color: '#F59E0B',
    plans: {
      starter: { price: 300, priceAnnual: 270, users: 5, branches: 1, employees: 'Pequeña' },
      growth: { price: 500, priceAnnual: 450, users: 15, branches: 2, employees: 'Mediana' },
      premium: { price: 900, priceAnnual: 810, users: 50, branches: 5, employees: 'Grande' },
      enterprise: { price: 1500, priceAnnual: 1350, users: 200, branches: 20, employees: 'Cadena' },
    },
    features: ['Pedidos personalizados', 'Recetas y producción', 'Clientes', 'POS', 'Catálogo online', 'Delivery'],
    competitors: [
      { name: 'Toast POS', priceRange: 'USD $75-165/mes' },
      { name: 'Square POS', priceRange: 'USD $0-72/mes' },
      { name: 'Lightspeed', priceRange: 'USD $69-199/mes' },
    ],
  },
  
  pharmacy: {
    slug: 'pharmacy',
    name: 'Farmacia',
    nameEn: 'Pharmacy',
    icon: '💊',
    color: '#8B5CF6',
    plans: {
      starter: { price: 1000, priceAnnual: 900, users: 5, branches: 1, employees: 'Pequeña' },
      growth: { price: 1800, priceAnnual: 1620, users: 15, branches: 2, employees: 'Mediana' },
      premium: { price: 2500, priceAnnual: 2250, users: 50, branches: 5, employees: 'Grande' },
      enterprise: { price: 4000, priceAnnual: 3600, users: 200, branches: 20, employees: 'Cadena' },
    },
    features: ['Recetas electrónicas', 'Base de datos medicamentos', 'Seguros', 'Inventario', 'Alertas de vencimiento'],
    competitors: [
      { name: 'PioneerRx', priceRange: 'USD $300-600/mes' },
      { name: 'McKesson', priceRange: 'USD $500-1000/mes' },
      { name: 'QS/1', priceRange: 'USD $350-700/mes' },
    ],
  },
  
  insurance: {
    slug: 'insurance',
    name: 'Aseguradora / Correduría',
    nameEn: 'Insurance Agency',
    icon: '🛡️',
    color: '#6366F1',
    plans: {
      starter: { price: 500, priceAnnual: 450, users: 5, branches: 1, employees: '1-2 agentes' },
      growth: { price: 1000, priceAnnual: 900, users: 15, branches: 2, employees: '3-5 agentes' },
      premium: { price: 2000, priceAnnual: 1800, users: 50, branches: 5, employees: '6-10 agentes' },
      enterprise: { price: 3000, priceAnnual: 2700, users: 200, branches: 20, employees: '11+ agentes' },
    },
    features: ['Gestión de pólizas', 'CRM clientes', 'Comisiones', 'Reportes IFRS 17', 'Siniestros'],
    competitors: [
      { name: 'Applied Epic', priceRange: 'USD $100-300/usuario/mes' },
      { name: 'HawkSoft', priceRange: 'USD $80-200/usuario/mes' },
      { name: 'AgencyBloc', priceRange: 'USD $75-150/usuario/mes' },
    ],
  },
};

// Default pricing (used when industry is not specified)
export const DEFAULT_PRICING = {
  starter: { price: 400, priceAnnual: 360, users: 5, branches: 1 },
  growth: { price: 800, priceAnnual: 720, users: 15, branches: 2 },
  premium: { price: 1500, priceAnnual: 1350, users: 50, branches: 5 },
  enterprise: { price: 2500, priceAnnual: 2250, users: 200, branches: 20 },
};

// Helper functions
export function getIndustryPricing(industrySlug: string): IndustryPricing | undefined {
  return INDUSTRY_PRICING[industrySlug];
}

export function getPlanPrice(industrySlug: string, planSlug: 'starter' | 'growth' | 'premium' | 'enterprise', isAnnual: boolean = false): number {
  const industry = INDUSTRY_PRICING[industrySlug];
  if (industry && industry.plans[planSlug]) {
    return isAnnual 
      ? industry.plans[planSlug].priceAnnual 
      : industry.plans[planSlug].price;
  }
  const defaultPlan = DEFAULT_PRICING[planSlug as keyof typeof DEFAULT_PRICING];
  if (defaultPlan) {
    return isAnnual ? defaultPlan.priceAnnual : defaultPlan.price;
  }
  return DEFAULT_PRICING.starter.price;
}

export function formatTTD(amount: number): string {
  return `TT$${amount.toLocaleString()}`;
}

export function formatUSD(amountTT: number): string {
  const usd = Math.round(amountTT / 6.75);
  return `≈ USD $${usd}`;
}

// Get the minimum price across all industries for marketing
export function getMinimumPrice(): number {
  let min = Infinity;
  Object.values(INDUSTRY_PRICING).forEach(industry => {
    if (industry.plans.starter.price < min) {
      min = industry.plans.starter.price;
    }
  });
  return min; // Returns 300 (bakery starter)
}

// Calculate savings compared to competitors
export function calculateSavings(nexusPrice: number, competitorPriceUSD: number): { savingsUSD: number; savingsPercent: number } {
  const competitorPriceTT = competitorPriceUSD * 6.75;
  const savingsTT = competitorPriceTT - nexusPrice;
  const savingsPercent = Math.round((savingsTT / competitorPriceTT) * 100);
  return {
    savingsUSD: Math.round(savingsTT / 6.75),
    savingsPercent
  };
}

// Get all industries as array for iteration
export function getAllIndustries(): IndustryPricing[] {
  return Object.values(INDUSTRY_PRICING);
}

// Get plan names in Spanish
export function getPlanNames(): Record<string, { name: string; nameEn: string }> {
  return {
    starter: { name: 'Inicial', nameEn: 'Starter' },
    growth: { name: 'Crecimiento', nameEn: 'Growth' },
    premium: { name: 'Premium', nameEn: 'Premium' },
    enterprise: { name: 'Empresa', nameEn: 'Enterprise' },
  };
}
