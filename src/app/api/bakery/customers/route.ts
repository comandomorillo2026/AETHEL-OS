import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

// GET /api/bakery/customers - List customers
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
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.bakeryCustomer.findMany({
        where,
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bakeryCustomer.count({ where }),
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bakery customers:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

// POST /api/bakery/customers - Create customer
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
      fullName,
      phone,
      email,
      address,
      city,
      notes,
      taxId,
      customerType,
    } = body;

    // Validate required fields
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Nombre y telefono son requeridos' },
        { status: 400 }
      );
    }

    // Check if customer with phone already exists
    const existingCustomer = await prisma.bakeryCustomer.findFirst({
      where: { tenantId, phone },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Ya existe un cliente con este telefono' },
        { status: 400 }
      );
    }

    // Generate customer number
    const customerCount = await prisma.bakeryCustomer.count({ where: { tenantId } });
    const customerNumber = `CLI-${String(customerCount + 1).padStart(5, '0')}`;

    // Create customer
    const customer = await prisma.bakeryCustomer.create({
      data: {
        tenantId,
        customerNumber,
        fullName,
        phone,
        email,
        address,
        city,
        notes,
        taxId,
        customerType: customerType || 'regular',
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating bakery customer:', error);
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}
