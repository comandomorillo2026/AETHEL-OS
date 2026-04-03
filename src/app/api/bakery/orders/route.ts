import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/bakery/orders - List orders with filtering
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
    const status = searchParams.get('status');
    const orderType = searchParams.get('orderType');
    const customerId = searchParams.get('customerId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { tenantId };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (orderType && orderType !== 'all') {
      where.orderType = orderType;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo + 'T23:59:59');
      }
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.bakeryOrder.findMany({
        where,
        include: {
          items: true,
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bakeryOrder.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bakery orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

// POST /api/bakery/orders - Create new order (from POS)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const userId = (session.user as any).id;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant no encontrado' }, { status: 400 });
    }

    const body = await request.json();
    
    const {
      orderType,
      customer,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      notes,
      pickupDate,
      pickupTime,
      deliveryAddress,
      deliveryFee,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un item' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderCount = await prisma.bakeryOrder.count({ where: { tenantId } });
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Find or create customer
    let customerId = null;
    let customerName = 'Cliente General';
    let customerPhone = '';

    if (customer && customer.name) {
      customerName = customer.name;
      customerPhone = customer.phone || '';

      if (customer.phone) {
        const existingCustomer = await prisma.bakeryCustomer.findFirst({
          where: { tenantId, phone: customer.phone },
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
          customerName = existingCustomer.fullName;
          customerPhone = existingCustomer.phone;
        } else {
          // Create new customer
          const newCustomer = await prisma.bakeryCustomer.create({
            data: {
              tenantId,
              fullName: customer.name,
              phone: customer.phone,
              email: customer.email,
            },
          });
          customerId = newCustomer.id;
        }
      }
    }

    // Create order with items
    const order = await prisma.bakeryOrder.create({
      data: {
        tenantId,
        orderNumber,
        orderType: orderType || 'POS',
        customerId,
        customerName,
        customerPhone,
        subtotal: subtotal || 0,
        discount: discount || 0,
        tax: tax || 0,
        total: total || 0,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: 'paid',
        notes,
        pickupDate,
        pickupTime,
        deliveryAddress,
        deliveryFee: deliveryFee || 0,
        status: 'completed',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            variantId: item.variantId,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update product stock
    for (const item of items) {
      if (item.productId) {
        await prisma.bakeryProduct.update({
          where: { id: item.productId },
          data: {
            quantityInStock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Update customer stats
    if (customerId) {
      await prisma.bakeryCustomer.update({
        where: { id: customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastOrderAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating bakery order:', error);
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}
