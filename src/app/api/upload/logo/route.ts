import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';

// Allowed file types
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
];

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Storage method: 'base64' stores in DB, 'file' stores in public/uploads
type StorageMethod = 'base64' | 'file';

interface UploadResponse {
  success: boolean;
  logoUrl?: string;
  error?: string;
  message?: string;
}

/**
 * POST /api/upload/logo
 * Upload a logo file for a tenant's business
 * 
 * Request body (multipart/form-data):
 * - file: The logo file (PNG, JPG, JPEG, SVG, WEBP)
 * - tenantId: The tenant ID
 * - industry: The industry type (bakery, clinic, beauty, lawfirm, etc.)
 * - storageMethod: 'base64' or 'file' (default: 'base64')
 * 
 * Response:
 * - success: boolean
 * - logoUrl: The URL or Base64 string of the uploaded logo
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tenantId = formData.get('tenantId') as string | null;
    const industry = formData.get('industry') as string || 'general';
    const storageMethod = (formData.get('storageMethod') as StorageMethod) || 'base64';

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type. Allowed types: PNG, JPG, JPEG, SVG, WEBP` 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size exceeds maximum allowed size of 2MB` 
        },
        { status: 400 }
      );
    }

    let logoUrl: string;

    if (storageMethod === 'base64') {
      // Convert to Base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = file.type;
      logoUrl = `data:${mimeType};base64,${base64}`;
    } else {
      // Save to file system
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
      
      // Ensure directory exists
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split('.').pop() || 'png';
      const filename = `${industry}_${tenantId}_${timestamp}_${randomString}.${extension}`;
      const filepath = path.join(uploadsDir, filename);

      // Write file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Return public URL
      logoUrl = `/uploads/logos/${filename}`;
    }

    // Update the settings model for the industry
    await updateLogoInSettings(tenantId, industry, logoUrl);

    return NextResponse.json({
      success: true,
      logoUrl,
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload/logo
 * Get the current logo URL for a tenant
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const industry = searchParams.get('industry') || 'general';

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const logoUrl = await getLogoFromSettings(tenantId, industry);

    return NextResponse.json({
      success: true,
      logoUrl
    });
  } catch (error) {
    console.error('Error fetching logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload/logo
 * Remove a logo from a tenant's settings
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const industry = searchParams.get('industry') || 'general';
    const logoUrl = searchParams.get('logoUrl');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // If it's a file (not base64), delete from filesystem
    if (logoUrl && logoUrl.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', logoUrl);
        const { unlink } = await import('fs/promises');
        await unlink(filePath);
      } catch {
        // File may not exist, continue
      }
    }

    // Clear the logo URL in settings
    await updateLogoInSettings(tenantId, industry, null);

    return NextResponse.json({
      success: true,
      message: 'Logo removed successfully'
    });
  } catch (error) {
    console.error('Error removing logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove logo' },
      { status: 500 }
    );
  }
}

/**
 * Update logo URL in the appropriate settings model
 */
async function updateLogoInSettings(
  tenantId: string, 
  industry: string, 
  logoUrl: string | null
): Promise<void> {
  const settingsModel = getSettingsModel(industry);
  
  if (!settingsModel) {
    console.warn(`No settings model found for industry: ${industry}`);
    return;
  }

  // @ts-expect-error - Dynamic model access
  await db[settingsModel].upsert({
    where: { tenantId },
    update: { logoUrl },
    create: { 
      tenantId, 
      logoUrl,
      // Default required fields based on industry
      ...getDefaultSettingsFields(industry)
    }
  });
}

/**
 * Get logo URL from the appropriate settings model
 */
async function getLogoFromSettings(
  tenantId: string, 
  industry: string
): Promise<string | null> {
  const settingsModel = getSettingsModel(industry);
  
  if (!settingsModel) {
    return null;
  }

  // @ts-expect-error - Dynamic model access
  const settings = await db[settingsModel].findUnique({
    where: { tenantId },
    select: { logoUrl: true }
  });

  return settings?.logoUrl || null;
}

/**
 * Get the Prisma model name for an industry's settings
 */
function getSettingsModel(industry: string): string | null {
  const modelMap: Record<string, string> = {
    bakery: 'bakerySettings',
    clinic: 'clinicConfig',
    beauty: 'beautySettings',
    lawfirm: 'lawSettings',
    nurse: 'nursingSettings',
    retail: 'retailSettings',
  };

  return modelMap[industry.toLowerCase()] || null;
}

/**
 * Get default required fields for creating a new settings record
 */
function getDefaultSettingsFields(industry: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    bakery: {
      bakeryName: 'New Bakery',
      currency: 'TTD',
      currencySymbol: 'TT$',
    },
    clinic: {
      clinicName: 'New Clinic',
      currency: 'TTD',
      currencySymbol: 'TT$',
    },
    beauty: {
      salonName: 'New Salon',
      currency: 'TTD',
      currencySymbol: 'TT$',
    },
    lawfirm: {
      firmName: 'New Law Firm',
    },
  };

  return defaults[industry.toLowerCase()] || {};
}
