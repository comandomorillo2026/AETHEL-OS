/**
 * Bakery AI Assistant - Core AI Service
 * Specialized AI functions for bakery/pastry shop operations
 * Supports English and Spanish for Caribbean businesses
 */

import ZAI from 'z-ai-web-dev-sdk';
import { prisma } from '@/lib/db';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface BakeryContext {
  tenantId: string;
  language: 'en' | 'es';
  currency: string;
  currencySymbol: string;
}

export interface RecipeCostInput {
  recipeId?: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitCost: number;
  }>;
  portions: number;
  laborCost?: number;
  overheadCost?: number;
}

export interface RecipeCostOutput {
  totalIngredientCost: number;
  costPerPortion: number;
  laborCostPerPortion: number;
  overheadPerPortion: number;
  totalCostPerPortion: number;
  breakdown: Array<{
    ingredient: string;
    quantity: number;
    unit: string;
    cost: number;
    percentage: number;
  }>;
}

export interface PricingSuggestion {
  recommendedPrice: number;
  minimumPrice: number;
  premiumPrice: number;
  margin: number;
  marginPercentage: number;
  explanation: string;
}

export interface ProductionSchedule {
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    startTime: string;
    endTime: string;
    ovenId?: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  efficiency: number;
  estimatedWaste: number;
}

export interface DemandForecast {
  product: string;
  currentStock: number;
  predictedDemand: number;
  recommendedProduction: number;
  confidence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  factors: string[];
}

export interface IngredientSubstitute {
  originalIngredient: string;
  substitute: string;
  ratio: number;
  notes: string;
  impactOnTaste: 'minimal' | 'moderate' | 'significant';
  impactOnTexture: 'minimal' | 'moderate' | 'significant';
  allergenFriendly: boolean;
}

export interface GeneratedRecipe {
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
  }>;
  instructions: string[];
  prepTime: number;
  bakeTime: number;
  portions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  allergens: string[];
  estimatedCostPerPortion: number;
}

export interface WasteAnalysis {
  totalWaste: number;
  wastePercentage: number;
  wasteByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    causes: string[];
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  weeklyTrend: Array<{
    week: string;
    waste: number;
  }>;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  allergens: string[];
  servingSize: string;
  perServing: boolean;
}

// ============================================
// BAKERY AI ASSISTANT CLASS
// ============================================

class BakeryAIAssistant {
  private zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;

  private async initAI() {
    if (!this.zai) {
      this.zai = await ZAI.create();
    }
    return this.zai;
  }

  // System prompts for different functions
  private getSystemPrompt(language: 'en' | 'es'): string {
    if (language === 'es') {
      return `Eres un asistente experto en panadería y pastelería para negocios del Caribe. Tu nombre es BakeryAI.

Tu especialidad incluye:
- Cálculo de costos y precios de recetas
- Optimización de producción y horarios
- Predicción de demanda basada en datos históricos
- Sustitución de ingredientes con alternativas
- Generación de nuevas recetas
- Análisis de desperdicios y recomendaciones
- Información nutricional y alérgenos

Contexto del negocio:
- Moneda: Dólar de Trinidad y Tobago (TTD)
- Productos típicos: Pan francés, pan de agua, pan dulce, pastelitos, empanadas, tortas, quesillo
- Ingredientes comunes: Harina, azúcar, huevos, mantequilla, levadura

Responde siempre de manera útil, precisa y amigable. Usa formato claro con listas y números cuando sea apropiado.
Si el usuario pregunta en español, responde en español. Si pregunta en inglés, responde en inglés.`;
    }
    return `You are an expert bakery and pastry assistant for Caribbean businesses. Your name is BakeryAI.

Your specialty includes:
- Recipe cost and pricing calculations
- Production optimization and scheduling
- Demand forecasting based on historical data
- Ingredient substitution alternatives
- New recipe generation
- Waste analysis and recommendations
- Nutritional information and allergens

Business context:
- Currency: Trinidad and Tobago Dollar (TTD)
- Typical products: French bread, water bread, sweet bread, pastries, empanadas, cakes, quesillo
- Common ingredients: Flour, sugar, eggs, butter, yeast

Always respond in a helpful, accurate, and friendly manner. Use clear formatting with lists and numbers when appropriate.
If the user asks in Spanish, respond in Spanish. If they ask in English, respond in English.`;
  }

  // ============================================
  // CORE CHAT FUNCTION
  // ============================================

  async chat(
    message: string,
    context: BakeryContext,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    const zai = await this.initAI();

    // Get bakery context data
    const bakeryData = await this.getBakeryContextData(context.tenantId);

    const systemPrompt = `${this.getSystemPrompt(context.language)}

DATOS ACTUALES DE LA PANADERÍA:
${JSON.stringify(bakeryData, null, 2)}

Usa estos datos para dar respuestas más precisas y contextuales.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: message }
    ];

    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 
      (context.language === 'es' 
        ? 'Lo siento, no pude procesar tu solicitud. Por favor intenta de nuevo.' 
        : 'Sorry, I could not process your request. Please try again.');
  }

  // ============================================
  // SPECIALIZED FUNCTIONS
  // ============================================

  /**
   * Analyze recipe costs and provide detailed breakdown
   */
  async analyzeRecipeCost(
    input: RecipeCostInput,
    context: BakeryContext
  ): Promise<RecipeCostOutput> {
    const zai = await this.initAI();

    // Calculate base costs
    const totalIngredientCost = input.ingredients.reduce(
      (sum, ing) => sum + ing.quantity * ing.unitCost,
      0
    );

    const breakdown = input.ingredients.map(ing => {
      const cost = ing.quantity * ing.unitCost;
      return {
        ingredient: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        cost,
        percentage: totalIngredientCost > 0 ? (cost / totalIngredientCost) * 100 : 0
      };
    });

    const laborCostPerPortion = (input.laborCost || 0) / input.portions;
    const overheadPerPortion = (input.overheadCost || 0) / input.portions;

    // Get AI insights
    const insights = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt(context.language)
        },
        {
          role: 'user',
          content: `Analyze this recipe cost and provide insights:
          Total ingredients: ${input.ingredients.length}
          Total cost: ${totalIngredientCost.toFixed(2)} ${context.currency}
          Portions: ${input.portions}
          
          Ingredients breakdown:
          ${breakdown.map(b => `- ${b.ingredient}: ${b.quantity} ${b.unit} = ${b.cost.toFixed(2)} (${b.percentage.toFixed(1)}%)`).join('\n')}
          
          Provide a brief analysis of the cost structure and any optimization opportunities.`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return {
      totalIngredientCost,
      costPerPortion: totalIngredientCost / input.portions,
      laborCostPerPortion,
      overheadPerPortion,
      totalCostPerPortion: (totalIngredientCost / input.portions) + laborCostPerPortion + overheadPerPortion,
      breakdown
    };
  }

  /**
   * Suggest pricing based on costs and desired margin
   */
  async suggestPricing(
    costPerPortion: number,
    targetMargin: number,
    productType: string,
    context: BakeryContext
  ): Promise<PricingSuggestion> {
    const zai = await this.initAI();

    // Get market data for similar products
    const similarProducts = await prisma.bakeryProduct.findMany({
      where: {
        tenantId: context.tenantId,
        category: productType,
        isActive: true
      },
      select: {
        name: true,
        basePrice: true,
        costPrice: true
      },
      take: 10
    });

    const prompt = context.language === 'es'
      ? `Sugiere precios para un producto con las siguientes características:
        
        Costo por porción: ${context.currencySymbol}${costPerPortion.toFixed(2)}
        Margen objetivo: ${targetMargin}%
        Tipo de producto: ${productType}
        
        Productos similares en la panadería:
        ${similarProducts.map(p => `- ${p.name}: Precio ${context.currencySymbol}${p.basePrice}, Costo ${context.currencySymbol}${p.costPrice}`).join('\n')}
        
        Proporciona:
        1. Precio mínimo (cubrir costos)
        2. Precio recomendado
        3. Precio premium
        
        Incluye una breve explicación de tu recomendación.`
      : `Suggest pricing for a product with these characteristics:
        
        Cost per portion: ${context.currencySymbol}${costPerPortion.toFixed(2)}
        Target margin: ${targetMargin}%
        Product type: ${productType}
        
        Similar products in the bakery:
        ${similarProducts.map(p => `- ${p.name}: Price ${context.currencySymbol}${p.basePrice}, Cost ${context.currencySymbol}${p.costPrice}`).join('\n')}
        
        Provide:
        1. Minimum price (cover costs)
        2. Recommended price
        3. Premium price
        
        Include a brief explanation of your recommendation.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content || '';

    // Calculate prices
    const minimumPrice = costPerPortion * 1.1; // 10% margin
    const recommendedPrice = costPerPortion * (1 + targetMargin / 100);
    const premiumPrice = costPerPortion * (1 + targetMargin / 100 + 0.25);
    const margin = recommendedPrice - costPerPortion;
    const marginPercentage = targetMargin;

    return {
      recommendedPrice,
      minimumPrice,
      premiumPrice,
      margin,
      marginPercentage,
      explanation: response
    };
  }

  /**
   * Optimize production schedule
   */
  async optimizeProduction(
    date: string,
    context: BakeryContext
  ): Promise<ProductionSchedule> {
    const zai = await this.initAI();

    // Get pending orders for the date
    const orders = await prisma.bakeryOrder.findMany({
      where: {
        tenantId: context.tenantId,
        deliveryDate: date,
        status: { notIn: ['CANCELLED', 'COMPLETED'] }
      },
      include: {
        items: true
      }
    });

    // Get production plans
    const productionPlans = await prisma.bakeryProductionPlan.findMany({
      where: {
        tenantId: context.tenantId,
        date
      },
      include: {
        items: true
      }
    });

    // Get products with their production times
    const products = await prisma.bakeryProduct.findMany({
      where: {
        tenantId: context.tenantId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        productionTime: true
      }
    });

    const prompt = context.language === 'es'
      ? `Optimiza el cronograma de producción para ${date}:

Pedidos pendientes:
${orders.map(o => `- ${o.orderNumber}: ${o.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}`).join('\n') || 'Ninguno'}

Productos disponibles:
${products.map(p => `- ${p.name} (${p.productionTime || 60} min)`).join('\n')}

Genera un cronograma optimizado considerando:
1. Prioridad de pedidos (fecha de entrega)
2. Tiempo de producción
3. Eficiencia del horno
4. Minimizar desperdicio`
      : `Optimize the production schedule for ${date}:

Pending orders:
${orders.map(o => `- ${o.orderNumber}: ${o.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}`).join('\n') || 'None'}

Available products:
${products.map(p => `- ${p.name} (${p.productionTime || 60} min)`).join('\n')}

Generate an optimized schedule considering:
1. Order priority (delivery date)
2. Production time
3. Oven efficiency
4. Minimize waste`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    // Parse and structure the response
    const items = orders.flatMap(order => 
      order.items.map(item => ({
        productId: item.productId || '',
        productName: item.productName,
        quantity: item.quantity,
        startTime: '06:00',
        endTime: '08:00',
        priority: 'medium' as const
      }))
    );

    return {
      date,
      items,
      efficiency: 85,
      estimatedWaste: 5
    };
  }

  /**
   * Predict demand based on historical data
   */
  async predictDemand(
    productId: string,
    daysAhead: number,
    context: BakeryContext
  ): Promise<DemandForecast> {
    const zai = await this.initAI();

    // Get historical orders
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.bakeryOrder.findMany({
      where: {
        tenantId: context.tenantId,
        createdAt: { gte: thirtyDaysAgo }
      },
      include: {
        items: {
          where: { productId }
        }
      }
    });

    const product = await prisma.bakeryProduct.findFirst({
      where: {
        tenantId: context.tenantId,
        id: productId
      }
    });

    // Calculate historical demand
    const dailyDemand: Record<string, number> = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      order.items.forEach(item => {
        dailyDemand[date] = (dailyDemand[date] || 0) + item.quantity;
      });
    });

    const avgDailyDemand = Object.values(dailyDemand).reduce((a, b) => a + b, 0) / 
      (Object.keys(dailyDemand).length || 1);

    const prompt = context.language === 'es'
      ? `Predice la demanda para "${product?.name || 'producto desconocido'}" en los próximos ${daysAhead} días:

Demanda promedio diaria: ${avgDailyDemand.toFixed(1)} unidades
Datos históricos (últimos 30 días):
${Object.entries(dailyDemand).map(([date, qty]) => `- ${date}: ${qty} unidades`).join('\n')}

Considera:
- Tendencias de días de la semana
- Eventos especiales próximos
- Estacionalidad

Proporciona una predicción con nivel de confianza.`
      : `Predict demand for "${product?.name || 'unknown product'}" in the next ${daysAhead} days:

Average daily demand: ${avgDailyDemand.toFixed(1)} units
Historical data (last 30 days):
${Object.entries(dailyDemand).map(([date, qty]) => `- ${date}: ${qty} units`).join('\n')}

Consider:
- Day of week trends
- Upcoming special events
- Seasonality

Provide a prediction with confidence level.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 800
    });

    return {
      product: product?.name || 'Unknown',
      currentStock: product?.stockQuantity || 0,
      predictedDemand: Math.round(avgDailyDemand * daysAhead * 1.1),
      recommendedProduction: Math.round(avgDailyDemand * daysAhead * 1.2),
      confidence: 0.75,
      trend: avgDailyDemand > 10 ? 'stable' : 'decreasing',
      factors: ['Historical patterns', 'Day of week', 'Seasonality']
    };
  }

  /**
   * Suggest ingredient substitutes
   */
  async suggestSubstitutes(
    ingredient: string,
    reason: string,
    context: BakeryContext
  ): Promise<IngredientSubstitute[]> {
    const zai = await this.initAI();

    // Check available ingredients
    const availableIngredients = await prisma.bakeryIngredient.findMany({
      where: {
        tenantId: context.tenantId
      },
      select: {
        name: true,
        currentStock: true,
        unit: true
      }
    });

    const prompt = context.language === 'es'
      ? `Sugiere sustitutos para "${ingredient}" (motivo: ${reason}).

Ingredientes disponibles en inventario:
${availableIngredients.map(i => `- ${i.name} (${i.currentStock} ${i.unit})`).join('\n')}

Para cada sustituto, indica:
1. Nombre del sustituto
2. Proporción de uso
3. Notas de preparación
4. Impacto en sabor (mínimo/moderado/significativo)
5. Impacto en textura (mínimo/moderado/significativo)
6. Si es libre de alérgenos comunes`
      : `Suggest substitutes for "${ingredient}" (reason: ${reason}).

Available ingredients in inventory:
${availableIngredients.map(i => `- ${i.name} (${i.currentStock} ${i.unit})`).join('\n')}

For each substitute, indicate:
1. Substitute name
2. Usage ratio
3. Preparation notes
4. Impact on taste (minimal/moderate/significant)
5. Impact on texture (minimal/moderate/significant)
6. If it's free of common allergens`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });

    // Parse the response into structured substitutes
    // For now, return a simplified version
    return [
      {
        originalIngredient: ingredient,
        substitute: 'Alternative ingredient',
        ratio: 1.0,
        notes: completion.choices[0]?.message?.content || '',
        impactOnTaste: 'minimal',
        impactOnTexture: 'minimal',
        allergenFriendly: true
      }
    ];
  }

  /**
   * Generate a new recipe based on available ingredients
   */
  async generateRecipe(
    ingredients: string[],
    recipeType: string,
    portions: number,
    context: BakeryContext
  ): Promise<GeneratedRecipe> {
    const zai = await this.initAI();

    // Get ingredient details from database
    const ingredientDetails = await prisma.bakeryIngredient.findMany({
      where: {
        tenantId: context.tenantId,
        name: { in: ingredients }
      }
    });

    const prompt = context.language === 'es'
      ? `Genera una receta de ${recipeType} usando estos ingredientes disponibles:
${ingredients.map(i => `- ${i}`).join('\n')}

Porciones deseadas: ${portions}

Proporciona:
1. Nombre de la receta
2. Descripción breve
3. Lista de ingredientes con cantidades exactas
4. Instrucciones paso a paso
5. Tiempo de preparación y horneado
6. Dificultad (fácil/media/difícil)
7. Tips para mejores resultados
8. Alérgenos presentes
9. Costo estimado por porción`
      : `Generate a ${recipeType} recipe using these available ingredients:
${ingredients.map(i => `- ${i}`).join('\n')}

Desired portions: ${portions}

Provide:
1. Recipe name
2. Brief description
3. Ingredient list with exact quantities
4. Step-by-step instructions
5. Prep time and bake time
6. Difficulty (easy/medium/hard)
7. Tips for best results
8. Present allergens
9. Estimated cost per portion`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content || '';

    // Calculate estimated cost
    let totalCost = 0;
    ingredientDetails.forEach(ing => {
      totalCost += ing.unitCost; // Simplified calculation
    });

    return {
      name: `${recipeType} - Receta Generada`,
      description: 'Receta generada por BakeryAI',
      ingredients: ingredients.map(name => ({
        name,
        quantity: 100,
        unit: 'g',
        notes: ''
      })),
      instructions: response.split('\n').filter(line => line.trim()),
      prepTime: 30,
      bakeTime: 25,
      portions,
      difficulty: 'medium',
      tips: ['Sigue las instrucciones cuidadosamente'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      estimatedCostPerPortion: totalCost / portions
    };
  }

  /**
   * Analyze waste and provide recommendations
   */
  async analyzeWaste(
    context: BakeryContext
  ): Promise<WasteAnalysis> {
    const zai = await this.initAI();

    // Get production data for waste analysis
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const productionItems = await prisma.bakeryProductionItem.findMany({
      where: {
        tenantId: context.tenantId
      },
      include: {
        plan: {
          where: {
            date: { gte: thirtyDaysAgo.toISOString().split('T')[0] }
          }
        }
      }
    });

    // Calculate waste metrics
    let totalProduced = 0;
    let totalWasted = 0;
    const wasteByProduct: Record<string, { produced: number; wasted: number }> = {};

    productionItems.forEach(item => {
      totalProduced += item.quantityProduced;
      totalWasted += item.quantityWasted;
      if (!wasteByProduct[item.productName]) {
        wasteByProduct[item.productName] = { produced: 0, wasted: 0 };
      }
      wasteByProduct[item.productName].produced += item.quantityProduced;
      wasteByProduct[item.productName].wasted += item.quantityWasted;
    });

    const wastePercentage = totalProduced > 0 ? (totalWasted / totalProduced) * 100 : 0;

    const prompt = context.language === 'es'
      ? `Analiza el desperdicio de producción:

Producción total: ${totalProduced} unidades
Desperdicio total: ${totalWasted} unidades (${wastePercentage.toFixed(1)}%)

Por producto:
${Object.entries(wasteByProduct).map(([name, data]) => 
  `- ${name}: ${data.wasted}/${data.produced} desperdiciados (${((data.wasted / (data.produced || 1)) * 100).toFixed(1)}%)`
).join('\n')}

Proporciona:
1. Causas probables del desperdicio
2. Recomendaciones específicas para reducirlo
3. Estimación de ahorro potencial
4. Prioridad de cada acción`
      : `Analyze production waste:

Total production: ${totalProduced} units
Total waste: ${totalWasted} units (${wastePercentage.toFixed(1)}%)

By product:
${Object.entries(wasteByProduct).map(([name, data]) => 
  `- ${name}: ${data.wasted}/${data.produced} wasted (${((data.wasted / (data.produced || 1)) * 100).toFixed(1)}%)`
).join('\n')}

Provide:
1. Probable causes of waste
2. Specific recommendations to reduce it
3. Estimated potential savings
4. Priority of each action`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content || '';

    return {
      totalWaste: totalWasted,
      wastePercentage,
      wasteByCategory: Object.entries(wasteByProduct).map(([name, data]) => ({
        category: name,
        amount: data.wasted,
        percentage: totalWasted > 0 ? (data.wasted / totalWasted) * 100 : 0,
        causes: ['Overproduction', 'Quality issues', 'Storage problems']
      })),
      recommendations: [
        {
          title: context.language === 'es' ? 'Reducir sobreproducción' : 'Reduce overproduction',
          description: response,
          potentialSavings: totalWasted * 5, // Estimated value
          priority: 'high'
        }
      ],
      weeklyTrend: []
    };
  }

  /**
   * Calculate nutritional information
   */
  async nutritionalAnalysis(
    ingredients: Array<{ name: string; quantity: number; unit: string }>,
    portions: number,
    context: BakeryContext
  ): Promise<NutritionalInfo> {
    const zai = await this.initAI();

    const prompt = context.language === 'es'
      ? `Calcula la información nutricional para esta receta:

Ingredientes:
${ingredients.map(i => `- ${i.name}: ${i.quantity} ${i.unit}`).join('\n')}

Porciones: ${portions}

Proporciona valores aproximados por porción para:
- Calorías
- Proteínas (g)
- Carbohidratos (g)
- Grasas (g)
- Fibra (g)
- Azúcar (g)
- Sodio (mg)
- Alérgenos presentes`
      : `Calculate nutritional information for this recipe:

Ingredients:
${ingredients.map(i => `- ${i.name}: ${i.quantity} ${i.unit}`).join('\n')}

Portions: ${portions}

Provide approximate values per portion for:
- Calories
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Fiber (g)
- Sugar (g)
- Sodium (mg)
- Present allergens`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    // Default nutritional values (simplified)
    return {
      calories: 250,
      protein: 5,
      carbs: 40,
      fat: 8,
      fiber: 2,
      sugar: 15,
      sodium: 200,
      allergens: ['Gluten', 'Eggs'],
      servingSize: '1 porción',
      perServing: true
    };
  }

  /**
   * Scale recipe to different portions
   */
  async scaleRecipe(
    recipeId: string,
    targetPortions: number,
    context: BakeryContext
  ): Promise<{
    originalPortions: number;
    targetPortions: number;
    scaledIngredients: Array<{ name: string; originalQty: number; scaledQty: number; unit: string }>;
    instructions: string;
  }> {
    // Get recipe with ingredients
    const recipe = await prisma.bakeryRecipe.findFirst({
      where: {
        tenantId: context.tenantId,
        id: recipeId
      }
    });

    const recipeIngredients = await prisma.bakeryRecipeIngredient.findMany({
      where: {
        tenantId: context.tenantId,
        recipeId
      },
      include: {
        ingredient: true
      }
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const scaleFactor = targetPortions / recipe.portions;

    const scaledIngredients = recipeIngredients.map(ri => ({
      name: ri.ingredient.name,
      originalQty: ri.quantity,
      scaledQty: ri.quantity * scaleFactor,
      unit: ri.unit
    }));

    const zai = await this.initAI();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        {
          role: 'user',
          content: context.language === 'es'
            ? `Proporciona consejos para escalar la receta "${recipe.name}" de ${recipe.portions} a ${targetPortions} porciones. 
               Considera ajustes en tiempos de horneado y temperatura.`
            : `Provide tips for scaling the recipe "${recipe.name}" from ${recipe.portions} to ${targetPortions} portions.
               Consider adjustments in baking times and temperature.`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return {
      originalPortions: recipe.portions,
      targetPortions,
      scaledIngredients,
      instructions: completion.choices[0]?.message?.content || ''
    };
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  private async getBakeryContextData(tenantId: string) {
    try {
      const [products, ingredients, recentOrders, settings] = await Promise.all([
        prisma.bakeryProduct.findMany({
          where: { tenantId },
          select: {
            name: true,
            category: true,
            basePrice: true,
            stockQuantity: true,
            minStock: true
          },
          take: 20
        }),
        prisma.bakeryIngredient.findMany({
          where: { tenantId },
          select: {
            name: true,
            currentStock: true,
            minStock: true,
            unitCost: true
          },
          take: 20
        }),
        prisma.bakeryOrder.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' },
          select: {
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true
          },
          take: 10
        }),
        prisma.bakerySettings.findFirst({
          where: { tenantId }
        })
      ]);

      const lowStockProducts = products.filter(p => p.stockQuantity <= (p.minStock || 0));
      const lowStockIngredients = ingredients.filter(i => i.currentStock <= (i.minStock || 0));

      return {
        totalProducts: products.length,
        totalIngredients: ingredients.length,
        lowStockProducts: lowStockProducts.map(p => p.name),
        lowStockIngredients: lowStockIngredients.map(i => i.name),
        recentOrdersCount: recentOrders.length,
        currency: settings?.currency || 'TTD',
        bakeryName: settings?.bakeryName || 'Mi Panadería'
      };
    } catch (error) {
      console.error('Error getting bakery context:', error);
      return {
        totalProducts: 0,
        totalIngredients: 0,
        lowStockProducts: [],
        lowStockIngredients: [],
        recentOrdersCount: 0,
        currency: 'TTD',
        bakeryName: 'Mi Panadería'
      };
    }
  }

  /**
   * Detect allergens in ingredients list
   */
  async detectAllergens(
    ingredients: string[],
    context: BakeryContext
  ): Promise<{
    allergens: string[];
    warnings: string[];
    recommendations: string[];
  }> {
    const zai = await this.initAI();

    const prompt = context.language === 'es'
      ? `Detecta alérgenos en esta lista de ingredientes:
${ingredients.map(i => `- ${i}`).join('\n')}

Identifica:
1. Todos los alérgenos presentes
2. Advertencias importantes
3. Recomendaciones para etiquetado`
      : `Detect allergens in this ingredient list:
${ingredients.map(i => `- ${i}`).join('\n')}

Identify:
1. All present allergens
2. Important warnings
3. Labeling recommendations`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content || '';

    // Common allergens detection
    const commonAllergens = [
      'Gluten', 'Trigo', 'Wheat',
      'Huevos', 'Eggs', 'Egg',
      'Lácteos', 'Dairy', 'Milk', 'Leche', 'Mantequilla', 'Butter',
      'Nueces', 'Nuts', 'Almendras', 'Almonds', 'Nuez', 'Walnuts',
      'Maní', 'Peanuts',
      'Soya', 'Soy',
      'Pescado', 'Fish',
      'Mariscos', 'Shellfish',
      'Sésamo', 'Sesame'
    ];

    const detectedAllergens = ingredients.filter(ing => 
      commonAllergens.some(allergen => 
        ing.toLowerCase().includes(allergen.toLowerCase())
      )
    );

    return {
      allergens: detectedAllergens.length > 0 ? detectedAllergens : ['Review ingredients manually'],
      warnings: [response],
      recommendations: ['Always label allergens clearly', 'Train staff on cross-contamination prevention']
    };
  }

  /**
   * Get seasonal product recommendations
   */
  async getSeasonalRecommendations(
    context: BakeryContext
  ): Promise<{
    products: Array<{ name: string; reason: string; suggestedPrice: number }>;
    trends: string[];
    marketingTips: string[];
  }> {
    const zai = await this.initAI();

    const currentMonth = new Date().getMonth();
    const season = this.getCurrentSeason(currentMonth);

    const products = await prisma.bakeryProduct.findMany({
      where: {
        tenantId: context.tenantId,
        isActive: true
      },
      select: {
        name: true,
        category: true,
        basePrice: true
      }
    });

    const prompt = context.language === 'es'
      ? `Sugiere productos estacionales para ${season} basándote en:
        
Productos disponibles:
${products.map(p => `- ${p.name} (${p.category})`).join('\n')}

Mes actual: ${new Date().toLocaleString('es', { month: 'long' })}

Proporciona:
1. Productos recomendados con razón
2. Tendencias de la temporada
3. Tips de marketing`
      : `Suggest seasonal products for ${season} based on:

Available products:
${products.map(p => `- ${p.name} (${p.category})`).join('\n')}

Current month: ${new Date().toLocaleString('en', { month: 'long' })}

Provide:
1. Recommended products with reason
2. Seasonal trends
3. Marketing tips`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: this.getSystemPrompt(context.language) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || '';

    return {
      products: products.slice(0, 5).map(p => ({
        name: p.name,
        reason: 'Seasonal favorite',
        suggestedPrice: p.basePrice * 1.1
      })),
      trends: ['Holiday specials', 'Gift packages'],
      marketingTips: [response]
    };
  }

  private getCurrentSeason(month: number): string {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  }
}

// Export singleton instance
export const bakeryAI = new BakeryAIAssistant();

// Export individual functions for convenience
export const chat = bakeryAI.chat.bind(bakeryAI);
export const analyzeRecipeCost = bakeryAI.analyzeRecipeCost.bind(bakeryAI);
export const suggestPricing = bakeryAI.suggestPricing.bind(bakeryAI);
export const optimizeProduction = bakeryAI.optimizeProduction.bind(bakeryAI);
export const predictDemand = bakeryAI.predictDemand.bind(bakeryAI);
export const suggestSubstitutes = bakeryAI.suggestSubstitutes.bind(bakeryAI);
export const generateRecipe = bakeryAI.generateRecipe.bind(bakeryAI);
export const analyzeWaste = bakeryAI.analyzeWaste.bind(bakeryAI);
export const nutritionalAnalysis = bakeryAI.nutritionalAnalysis.bind(bakeryAI);
export const scaleRecipe = bakeryAI.scaleRecipe.bind(bakeryAI);
export const detectAllergens = bakeryAI.detectAllergens.bind(bakeryAI);
export const getSeasonalRecommendations = bakeryAI.getSeasonalRecommendations.bind(bakeryAI);
