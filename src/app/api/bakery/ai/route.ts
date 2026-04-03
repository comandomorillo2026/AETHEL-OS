/**
 * Bakery AI API Endpoint
 * Handles all AI-powered bakery operations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  bakeryAI,
  BakeryContext,
  RecipeCostInput,
  GeneratedRecipe,
} from '@/lib/ai/bakery-assistant';

// Default tenant context (in production, get from auth/session)
const DEFAULT_TENANT_ID = 'bakery-demo-001';

// Get context from request or use defaults
function getBakeryContext(request: NextRequest): BakeryContext {
  // In production, extract tenantId from session/auth
  const tenantId = request.headers.get('x-tenant-id') || DEFAULT_TENANT_ID;
  const language = (request.headers.get('x-language') || 'es') as 'en' | 'es';
  const currency = request.headers.get('x-currency') || 'TTD';

  return {
    tenantId,
    language,
    currency,
    currencySymbol: currency === 'TTD' ? 'TT$' : '$'
  };
}

// ============================================
// POST - Main chat endpoint
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    const context = getBakeryContext(request);

    switch (action) {
      case 'chat':
        return handleChat(data, context);
      case 'analyzeRecipeCost':
        return handleAnalyzeRecipeCost(data, context);
      case 'suggestPricing':
        return handleSuggestPricing(data, context);
      case 'optimizeProduction':
        return handleOptimizeProduction(data, context);
      case 'predictDemand':
        return handlePredictDemand(data, context);
      case 'suggestSubstitutes':
        return handleSuggestSubstitutes(data, context);
      case 'generateRecipe':
        return handleGenerateRecipe(data, context);
      case 'analyzeWaste':
        return handleAnalyzeWaste(context);
      case 'nutritionalAnalysis':
        return handleNutritionalAnalysis(data, context);
      case 'scaleRecipe':
        return handleScaleRecipe(data, context);
      case 'detectAllergens':
        return handleDetectAllergens(data, context);
      case 'seasonalRecommendations':
        return handleSeasonalRecommendations(context);
      default:
        return NextResponse.json(
          { error: 'Invalid action. Available actions: chat, analyzeRecipeCost, suggestPricing, optimizeProduction, predictDemand, suggestSubstitutes, generateRecipe, analyzeWaste, nutritionalAnalysis, scaleRecipe, detectAllergens, seasonalRecommendations' },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error('Bakery AI API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// Action Handlers
// ============================================

async function handleChat(
  data: { message: string; conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }> },
  context: BakeryContext
) {
  if (!data?.message) {
    return NextResponse.json(
      { error: 'Message is required for chat action' },
      { status: 400 }
    );
  }

  const response = await bakeryAI.chat(
    data.message,
    context,
    data.conversationHistory || []
  );

  return NextResponse.json({ 
    success: true, 
    response,
    timestamp: new Date().toISOString()
  });
}

async function handleAnalyzeRecipeCost(
  data: RecipeCostInput,
  context: BakeryContext
) {
  if (!data?.ingredients || !Array.isArray(data.ingredients)) {
    return NextResponse.json(
      { error: 'Ingredients array is required for analyzeRecipeCost' },
      { status: 400 }
    );
  }

  if (!data?.portions || data.portions <= 0) {
    return NextResponse.json(
      { error: 'Portions must be a positive number' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.analyzeRecipeCost(data, context);

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleSuggestPricing(
  data: { costPerPortion: number; targetMargin: number; productType: string },
  context: BakeryContext
) {
  if (typeof data?.costPerPortion !== 'number' || data.costPerPortion < 0) {
    return NextResponse.json(
      { error: 'Valid costPerPortion is required' },
      { status: 400 }
    );
  }

  if (typeof data?.targetMargin !== 'number' || data.targetMargin < 0) {
    return NextResponse.json(
      { error: 'Valid targetMargin is required' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.suggestPricing(
    data.costPerPortion,
    data.targetMargin,
    data.productType || 'general',
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleOptimizeProduction(
  data: { date: string },
  context: BakeryContext
) {
  if (!data?.date) {
    return NextResponse.json(
      { error: 'Date is required for optimizeProduction' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.optimizeProduction(data.date, context);

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handlePredictDemand(
  data: { productId: string; daysAhead: number },
  context: BakeryContext
) {
  if (!data?.productId) {
    return NextResponse.json(
      { error: 'productId is required for predictDemand' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.predictDemand(
    data.productId,
    data.daysAhead || 7,
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleSuggestSubstitutes(
  data: { ingredient: string; reason: string },
  context: BakeryContext
) {
  if (!data?.ingredient) {
    return NextResponse.json(
      { error: 'Ingredient is required for suggestSubstitutes' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.suggestSubstitutes(
    data.ingredient,
    data.reason || 'general substitution',
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleGenerateRecipe(
  data: { ingredients: string[]; recipeType: string; portions: number },
  context: BakeryContext
) {
  if (!data?.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    return NextResponse.json(
      { error: 'Ingredients array is required for generateRecipe' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.generateRecipe(
    data.ingredients,
    data.recipeType || 'general',
    data.portions || 10,
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleAnalyzeWaste(context: BakeryContext) {
  const result = await bakeryAI.analyzeWaste(context);

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleNutritionalAnalysis(
  data: { ingredients: Array<{ name: string; quantity: number; unit: string }>; portions: number },
  context: BakeryContext
) {
  if (!data?.ingredients || !Array.isArray(data.ingredients)) {
    return NextResponse.json(
      { error: 'Ingredients array is required for nutritionalAnalysis' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.nutritionalAnalysis(
    data.ingredients,
    data.portions || 1,
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleScaleRecipe(
  data: { recipeId: string; targetPortions: number },
  context: BakeryContext
) {
  if (!data?.recipeId) {
    return NextResponse.json(
      { error: 'Recipe ID is required for scaleRecipe' },
      { status: 400 }
    );
  }

  if (!data?.targetPortions || data.targetPortions <= 0) {
    return NextResponse.json(
      { error: 'Valid targetPortions is required' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.scaleRecipe(
    data.recipeId,
    data.targetPortions,
    context
  );

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleDetectAllergens(
  data: { ingredients: string[] },
  context: BakeryContext
) {
  if (!data?.ingredients || !Array.isArray(data.ingredients)) {
    return NextResponse.json(
      { error: 'Ingredients array is required for detectAllergens' },
      { status: 400 }
    );
  }

  const result = await bakeryAI.detectAllergens(data.ingredients, context);

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

async function handleSeasonalRecommendations(context: BakeryContext) {
  const result = await bakeryAI.getSeasonalRecommendations(context);

  return NextResponse.json({
    success: true,
    result,
    timestamp: new Date().toISOString()
  });
}

// ============================================
// GET - API Information
// ============================================
export async function GET() {
  return NextResponse.json({
    name: 'Bakery AI Assistant API',
    version: '1.0.0',
    description: 'AI-powered assistant for bakery/pastry shop operations',
    capabilities: [
      {
        action: 'chat',
        description: 'General conversation and Q&A about bakery operations',
        parameters: ['message', 'conversationHistory (optional)']
      },
      {
        action: 'analyzeRecipeCost',
        description: 'Calculate detailed cost breakdown for a recipe',
        parameters: ['ingredients[]', 'portions', 'laborCost (optional)', 'overheadCost (optional)']
      },
      {
        action: 'suggestPricing',
        description: 'Recommend pricing based on costs and market',
        parameters: ['costPerPortion', 'targetMargin', 'productType']
      },
      {
        action: 'optimizeProduction',
        description: 'Generate optimized production schedule',
        parameters: ['date']
      },
      {
        action: 'predictDemand',
        description: 'Forecast demand for a product',
        parameters: ['productId', 'daysAhead']
      },
      {
        action: 'suggestSubstitutes',
        description: 'Find alternative ingredients',
        parameters: ['ingredient', 'reason']
      },
      {
        action: 'generateRecipe',
        description: 'Create new recipe from available ingredients',
        parameters: ['ingredients[]', 'recipeType', 'portions']
      },
      {
        action: 'analyzeWaste',
        description: 'Analyze production waste and suggest improvements',
        parameters: []
      },
      {
        action: 'nutritionalAnalysis',
        description: 'Calculate nutritional information',
        parameters: ['ingredients[]', 'portions']
      },
      {
        action: 'scaleRecipe',
        description: 'Scale recipe to different portion size',
        parameters: ['recipeId', 'targetPortions']
      },
      {
        action: 'detectAllergens',
        description: 'Identify allergens in ingredients',
        parameters: ['ingredients[]']
      },
      {
        action: 'seasonalRecommendations',
        description: 'Get seasonal product recommendations',
        parameters: []
      }
    ],
    languages: ['en', 'es'],
    currency: 'TTD (Trinidad and Tobago Dollar)'
  });
}
