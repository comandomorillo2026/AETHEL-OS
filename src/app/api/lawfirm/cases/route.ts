import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all cases
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'demo-tenant';
    const status = searchParams.get('status');
    const practiceArea = searchParams.get('practiceArea');

    const where: any = {
      tenantId,
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }
    if (practiceArea) {
      where.practiceArea = practiceArea;
    }

    const cases = await db.lawCase.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            clientType: true,
            email: true,
            phone: true,
          },
        },
        leadAttorney: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: cases,
      count: cases.length,
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

// POST - Create new case
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId = 'demo-tenant',
      caseNumber,
      title,
      description,
      clientId,
      practiceArea,
      caseType,
      jurisdiction,
      court,
      judge,
      leadAttorneyId,
      billingType,
      hourlyRate,
      flatFee,
      priority,
      opposingParty,
      opposingCounsel,
      openDate,
    } = body;

    // Generate case number if not provided
    const generatedCaseNumber = caseNumber || `CAS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const newCase = await db.lawCase.create({
      data: {
        tenantId,
        caseNumber: generatedCaseNumber,
        title,
        description,
        clientId,
        practiceArea,
        caseType: caseType || 'lawsuit',
        jurisdiction: jurisdiction || 'Trinidad & Tobago',
        court,
        judge,
        leadAttorneyId,
        status: 'open',
        stage: 'Intake',
        billingType: billingType || 'hourly',
        hourlyRate,
        flatFee,
        priority: priority || 'normal',
        opposingParty,
        opposingCounsel,
        openDate: openDate || new Date().toISOString().split('T')[0],
        progress: 0,
        billableHours: 0,
        totalBilled: 0,
        trustBalance: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newCase,
      message: 'Case created successfully',
    });
  } catch (error: any) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create case' },
      { status: 500 }
    );
  }
}
