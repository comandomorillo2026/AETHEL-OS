import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List time entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'demo-tenant';
    const caseId = searchParams.get('caseId');
    const attorneyId = searchParams.get('attorneyId');
    const billed = searchParams.get('billed');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      tenantId,
      isDeleted: false,
    };

    if (caseId) {
      where.caseId = caseId;
    }
    if (attorneyId) {
      where.attorneyId = attorneyId;
    }
    if (billed !== null && billed !== undefined) {
      where.billed = billed === 'true';
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const timeEntries = await db.lawTimeEntry.findMany({
      where,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true,
            client: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        attorney: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate totals
    const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    const totalAmount = timeEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const unbilledMinutes = timeEntries.filter(e => !e.billed).reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    const unbilledAmount = timeEntries.filter(e => !e.billed).reduce((sum, entry) => sum + (entry.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: timeEntries,
      count: timeEntries.length,
      summary: {
        totalMinutes,
        totalHours: (totalMinutes / 60).toFixed(1),
        totalAmount,
        unbilledMinutes,
        unbilledHours: (unbilledMinutes / 60).toFixed(1),
        unbilledAmount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

// POST - Create time entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId = 'demo-tenant',
      caseId,
      attorneyId,
      date,
      startTime,
      endTime,
      durationMinutes,
      description,
      activityCode,
      rate,
      billable = true,
    } = body;

    // Calculate duration if not provided
    let calculatedDuration = durationMinutes;
    if (!calculatedDuration && startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      calculatedDuration = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    // Calculate amount
    const amount = billable ? (calculatedDuration / 60) * (rate || 850) : 0;

    const timeEntry = await db.lawTimeEntry.create({
      data: {
        tenantId,
        caseId,
        attorneyId,
        date,
        startTime,
        endTime,
        durationMinutes: calculatedDuration,
        description,
        activityCode: activityCode || 'research',
        rate: rate || 850,
        amount,
        billable,
        billed: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: timeEntry,
      message: 'Time entry created successfully',
    });
  } catch (error: any) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create time entry' },
      { status: 500 }
    );
  }
}
