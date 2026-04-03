import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/export - Export tenant data as JSON
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID required' },
        { status: 400 }
      );
    }

    // Get tenant info
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Create export record
    const exportRecord = await prisma.dataExportRequest.create({
      data: {
        tenantId,
        requestedBy: tenant.ownerEmail,
        requestType: 'full',
        status: 'processing',
      },
    });

    // Collect all tenant data
    const exportData: Record<string, any> = {
      exportInfo: {
        tenantId: tenant.id,
        businessName: tenant.businessName,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0',
      },
    };

    // Export based on industry
    const industry = tenant.industrySlug;

    // Common data for all industries
    exportData.tenant = tenant;

    // Export users
    const users = await prisma.systemUser.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        // Exclude password hash for security
      },
    });
    exportData.users = users;

    // Export activity logs
    const activityLogs = await prisma.activityLog.findMany({
      where: { tenantId },
      take: 1000,
    });
    exportData.activityLogs = activityLogs;

    // Industry-specific exports
    switch (industry) {
      case 'clinic':
        await exportClinicData(tenantId, exportData);
        break;
      case 'bakery':
        // Bakery-specific data
        break;
      case 'beauty':
        await exportBeautyData(tenantId, exportData);
        break;
      case 'lawfirm':
        await exportLawfirmData(tenantId, exportData);
        break;
      case 'nurse':
        await exportNurseData(tenantId, exportData);
        break;
    }

    // Update export record
    const jsonData = JSON.stringify(exportData, null, 2);
    await prisma.dataExportRequest.update({
      where: { id: exportRecord.id },
      data: {
        status: 'ready',
        fileSizeMb: jsonData.length / (1024 * 1024),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    // Return JSON file
    return new NextResponse(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="nexusos-export-${tenant.slug}-${Date.now()}.json"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}

// Helper functions for industry-specific exports
async function exportClinicData(tenantId: string, exportData: Record<string, any>) {
  const [patients, appointments, invoices] = await Promise.all([
    prisma.patient.findMany({ where: { tenantId } }),
    prisma.appointment.findMany({ where: { tenantId } }),
    prisma.invoice.findMany({ where: { tenantId } }),
  ]);

  exportData.patients = patients;
  exportData.appointments = appointments;
  exportData.invoices = invoices;
}

async function exportBeautyData(tenantId: string, exportData: Record<string, any>) {
  const [clients, appointments, sales] = await Promise.all([
    prisma.beautyClient.findMany({ where: { tenantId } }),
    prisma.beautyAppointment.findMany({ where: { tenantId } }),
    prisma.beautySale.findMany({ where: { tenantId } }),
  ]);

  exportData.clients = clients;
  exportData.appointments = appointments;
  exportData.sales = sales;
}

async function exportLawfirmData(tenantId: string, exportData: Record<string, any>) {
  const [clients, cases, invoices] = await Promise.all([
    prisma.lawClient.findMany({ where: { tenantId } }),
    prisma.lawCase.findMany({ where: { tenantId } }),
    prisma.lawInvoice.findMany({ where: { tenantId } }),
  ]);

  exportData.clients = clients;
  exportData.cases = cases;
  exportData.invoices = invoices;
}

async function exportNurseData(tenantId: string, exportData: Record<string, any>) {
  const [staff, tasks, notes] = await Promise.all([
    prisma.nurseStaff.findMany({ where: { tenantId } }),
    prisma.nurseTask.findMany({ where: { tenantId } }),
    prisma.nursingNote.findMany({ where: { tenantId } }),
  ]);

  exportData.staff = staff;
  exportData.tasks = tasks;
  exportData.notes = notes;
}
