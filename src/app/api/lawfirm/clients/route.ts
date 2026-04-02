import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all clients
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'demo-tenant';
    const clientType = searchParams.get('clientType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {
      tenantId,
      isDeleted: false,
    };

    if (clientType) {
      where.clientType = clientType;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const clients = await db.lawClient.findMany({
      where,
      include: {
        cases: {
          where: { isDeleted: false },
          select: {
            id: true,
            caseNumber: true,
            title: true,
            status: true,
          },
        },
        _count: {
          cases: true,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: clients,
      count: clients.length,
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId = 'demo-tenant',
      clientType = 'individual',
      fullName,
      companyName,
      firstName,
      lastName,
      email,
      phone,
      phoneAlt,
      address,
      city,
      country = 'Trinidad & Tobago',
      idType,
      idNumber,
      occupation,
      notes,
      billingType = 'hourly',
      billingRate,
    } = body;

    const newClient = await db.lawClient.create({
      data: {
        tenantId,
        clientType,
        fullName: fullName || companyName,
        companyName,
        firstName,
        lastName,
        email,
        phone,
        phoneAlt,
        address,
        city,
        country,
        idType: idType || 'national_id',
        idNumber,
        occupation,
        notes,
        status: 'active',
        billingType,
        billingRate: billingRate || 850,
        openCases: 0,
        totalBilled: 0,
        trustBalance: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Client created successfully',
    });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create client' },
      { status: 500 }
    );
  }
}
