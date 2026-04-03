import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/bakery/products - List products with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock') === 'true';
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (lowStock) {
      // Products with stock at or below reorder level
      where.quantityInStock = { lte: prisma.bakeryProduct.fields.reorderLevel };
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const products = await prisma.bakeryProduct.findMany({
      where,
      include: {
        variants: true,
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    // Get categories for filtering
    const categories = await prisma.bakeryProduct.groupBy({
      by: ['category'],
      where: { tenantId, isActive: true },
      _count: { id: true },
    });

    return NextResponse.json({
      products,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching bakery products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST /api/bakery/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 400 });
    }

    const body = await request.json();
    
    const {
      sku,
      name,
      description,
      category,
      costPrice,
      sellingPrice,
      quantityInStock,
      reorderLevel,
      reorderQuantity,
      unitOfMeasure,
      imageUrl,
      isCustomizable,
      variants,
      expiryDate,
      location,
      supplierId,
      supplierName,
    } = body;

    // Validate required fields
    if (!name || !category || sellingPrice === undefined) {
      return NextResponse.json(
        { error: 'Nombre, categoria y precio son requeridos' },
        { status: 400 }
      );
    }

    // Generate SKU if not provided
    const productSku = sku || `BK-${Date.now().toString(36).toUpperCase()}`;

    // Check if SKU already exists for this tenant
    const existingProduct = await prisma.bakeryProduct.findFirst({
      where: { tenantId, sku: productSku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este SKU' },
        { status: 400 }
      );
    }

    // Create product with variants
    const product = await prisma.bakeryProduct.create({
      data: {
        tenantId,
        sku: productSku,
        name,
        description,
        category,
        costPrice: costPrice || 0,
        sellingPrice,
        quantityInStock: quantityInStock || 0,
        reorderLevel,
        reorderQuantity,
        unitOfMeasure: unitOfMeasure || 'unidad',
        imageUrl,
        isCustomizable: isCustomizable || false,
        expiryDate,
        location,
        supplierId,
        supplierName,
        variants: variants ? {
          create: variants.map((v: any) => ({
            name: v.name,
            priceModifier: v.priceModifier || 0,
            sku: v.sku,
          })),
        } : undefined,
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating bakery product:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
