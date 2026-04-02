import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/bakery/dashboard - Get dashboard metrics
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get today's sales
    const todayOrders = await prisma.bakeryOrder.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: today,
          lte: todayEnd,
        },
        status: { not: 'cancelled' },
      },
      select: {
        total: true,
        items: {
          select: { quantity: true },
        },
      },
    });

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const productsSoldToday = todayOrders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0
    );

    // Get pending orders
    const pendingOrders = await prisma.bakeryOrder.count({
      where: {
        tenantId,
        status: { in: ['pending', 'preparing', 'ready'] },
      },
    });

    // Get low stock products
    const lowStockProducts = await prisma.bakeryProduct.findMany({
      where: {
        tenantId,
        isActive: true,
        quantityInStock: { lte: prisma.bakeryProduct.fields.reorderLevel },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        quantityInStock: true,
        reorderLevel: true,
        category: true,
      },
      take: 10,
    });

    // Get recent orders
    const recentOrders = await prisma.bakeryOrder.findMany({
      where: { tenantId },
      include: {
        items: {
          select: {
            productName: true,
            quantity: true,
            totalPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get sales chart data (last 7 days)
    const salesChart = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        SUM(total) as total_sales,
        COUNT(*) as order_count
      FROM "BakeryOrder"
      WHERE tenant_id = ${tenantId}
        AND created_at >= ${sevenDaysAgo}
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get top selling products
    const topProducts = await prisma.bakeryOrderItem.groupBy({
      by: ['productId', 'productName'],
      where: {
        order: { tenantId },
        order: { status: { not: 'cancelled' } },
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get production plans for today
    const todayProduction = await prisma.bakeryProductionItem.findMany({
      where: {
        productionPlan: {
          tenantId,
          productionDate: {
            gte: today,
            lte: todayEnd,
          },
        },
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
    });

    // Get yesterday's sales for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const yesterdayOrders = await prisma.bakeryOrder.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: yesterday,
          lte: yesterdayEnd,
        },
        status: { not: 'cancelled' },
      },
      select: { total: true },
    });

    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate percentage change
    const salesChange = yesterdaySales > 0 
      ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 
      : 0;

    // Get customer count today
    const customersToday = await prisma.bakeryOrder.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: today,
          lte: todayEnd,
        },
      },
      select: { customerId: true, customerPhone: true },
      distinct: ['customerPhone'],
    });

    return NextResponse.json({
      metrics: {
        todaySales,
        yesterdaySales,
        salesChange: salesChange.toFixed(1),
        productsSoldToday,
        pendingOrders,
        customersToday: customersToday.length,
      },
      lowStockProducts,
      recentOrders,
      salesChart: salesChart.map((row: any) => ({
        date: row.date,
        totalSales: Number(row.total_sales),
        orderCount: Number(row.order_count),
      })),
      topProducts: topProducts.map(p => ({
        name: p.productName,
        quantity: p._sum.quantity || 0,
        revenue: p._sum.totalPrice || 0,
      })),
      todayProduction,
    });
  } catch (error) {
    console.error('Error fetching bakery dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
