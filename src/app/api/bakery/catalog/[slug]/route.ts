import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bakery/catalog/[slug] - Get public catalog data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find tenant by slug
    const tenant = await db.tenant.findFirst({
      where: {
        slug: slug,
        industry: 'bakery'
      },
      include: {
        settings: true
      }
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Bakery not found' },
        { status: 404 }
      );
    }

    // Get bakery products
    const products = await db.bakeryProduct.findMany({
      where: {
        tenantId: tenant.id,
        showInCatalog: true
      },
      orderBy: [
        { isPromo: 'desc' },
        { name: 'asc' }
      ]
    });

    // Get active promotions
    const promotions = await db.bakeryPromotion.findMany({
      where: {
        tenantId: tenant.id,
        active: true,
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } }
        ]
      },
      orderBy: { order: 'asc' },
      take: 6
    });

    // Build response
    const catalogData = {
      bakery: {
        name: tenant.name,
        slug: tenant.slug,
        logo: tenant.logoUrl,
        description: tenant.settings?.catalogDescription || tenant.description || '',
        phone: tenant.phone || '',
        email: tenant.email || '',
        whatsapp: tenant.settings?.whatsapp || tenant.phone?.replace(/[^0-9]/g, '') || '',
        address: tenant.address || '',
        instagram: tenant.settings?.instagram || '',
        facebook: tenant.settings?.facebook || '',
        schedule: tenant.settings?.schedule || {
          weekdays: '6:00 AM - 7:00 PM',
          saturday: '7:00 AM - 6:00 PM',
          sunday: '7:00 AM - 2:00 PM'
        },
        theme: tenant.settings?.catalogTheme || {
          primary: '#F97316',
          secondary: '#FBBF24'
        }
      },
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        image: p.imageUrl,
        category: p.category,
        isPromo: p.isPromo,
        promoPrice: p.promoPrice,
        allergens: p.allergens || [],
        inStock: p.stock > 0
      })),
      promotions: promotions.map(promo => ({
        id: promo.id,
        title: promo.title,
        description: promo.description || '',
        image: promo.imageUrl,
        validUntil: promo.validUntil?.toISOString()
      }))
    };

    return NextResponse.json(catalogData);
  } catch (error) {
    console.error('Error fetching bakery catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
