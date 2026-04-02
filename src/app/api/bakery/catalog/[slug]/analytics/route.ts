import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/bakery/catalog/[slug]/analytics - Track a visit or event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { type, productId, deviceInfo } = body;

    // Find tenant by slug
    const tenant = await db.tenant.findFirst({
      where: { slug, industry: 'bakery' }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Bakery not found' }, { status: 404 });
    }

    // Record analytics event
    // In production, this would save to a dedicated analytics table
    // For now, we'll just return success

    const event = {
      tenantId: tenant.id,
      type: type || 'catalog_view', // catalog_view, product_view, add_to_cart, order_sent, contact_click
      productId: productId || null,
      deviceInfo: deviceInfo || null,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    // TODO: Save to database
    // await db.catalogAnalytics.create({ data: event });

    // Send notification to bakery owner (optional)
    if (type === 'order_sent') {
      // In production, trigger push notification or email
      console.log(`New order from catalog for ${tenant.name}`);
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// GET /api/bakery/catalog/[slug]/analytics - Get analytics data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';

    // Find tenant by slug
    const tenant = await db.tenant.findFirst({
      where: { slug, industry: 'bakery' }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Bakery not found' }, { status: 404 });
    }

    // In production, query analytics from database
    // For now, return demo data structure

    const analytics = {
      totalViews: 1847,
      uniqueVisitors: 892,
      viewsToday: 156,
      viewsThisWeek: 743,
      viewsChange: 12.5,
      topProducts: [],
      topCategories: [],
      recentActivity: [],
      ordersReceived: 23,
      contactClicks: 67,
      deviceBreakdown: { mobile: 68, desktop: 25, tablet: 7 },
      peakHours: []
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
