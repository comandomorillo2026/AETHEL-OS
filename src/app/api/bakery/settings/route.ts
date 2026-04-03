import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

/**
 * GET /api/bakery/settings
 * Get bakery settings for the current tenant
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For demo purposes, get the first tenant's settings
    // In production, you'd get the tenantId from the session
    const settings = await db.bakerySettings.findFirst();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching bakery settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bakery/settings
 * Update bakery settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // For demo purposes, update the first tenant's settings
    // In production, you'd get the tenantId from the session
    const existingSettings = await db.bakerySettings.findFirst();

    let settings;
    if (existingSettings) {
      settings = await db.bakerySettings.update({
        where: { id: existingSettings.id },
        data: {
          bakeryName: data.bakeryName,
          legalName: data.legalName,
          taxId: data.taxId,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          city: data.city,
          currency: data.currency,
          taxEnabled: data.taxEnabled,
          taxRate: data.taxRate,
          taxName: data.taxName,
          defaultOpeningTime: data.openingTime,
          defaultClosingTime: data.closingTime,
          logoUrl: data.logoUrl,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new settings
      settings = await db.bakerySettings.create({
        data: {
          tenantId: 'demo-tenant',
          bakeryName: data.bakeryName || 'New Bakery',
          legalName: data.legalName,
          taxId: data.taxId,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          city: data.city,
          currency: data.currency || 'TTD',
          taxEnabled: data.taxEnabled ?? false,
          taxRate: data.taxRate ?? 0,
          taxName: data.taxName,
          defaultOpeningTime: data.openingTime || '06:00',
          defaultClosingTime: data.closingTime || '20:00',
          logoUrl: data.logoUrl,
          primaryColor: data.primaryColor || '#F97316',
          secondaryColor: data.secondaryColor || '#FBBF24',
          accentColor: data.accentColor || '#78350F',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating bakery settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
