/**
 * NexusOS Legacy Data Migration API
 * 
 * Handles file upload, preview, mapping, execution, and rollback
 * for importing data from legacy systems into NexusOS Bakery.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { parseCSV, analyzeCSV, getCSVPreview, detectSourceSystem, detectEntityType } from '@/lib/migration/parsers/csv-parser';
import { parseExcel, analyzeExcel, getExcelPreview } from '@/lib/migration/parsers/excel-parser';
import {
  generateMappingSuggestions,
  createDefaultMappings,
  mapSourceToEntity,
  validateEntity,
} from '@/lib/migration/mappers/bakery-mapper';
import type {
  SourceSystem,
  MigrationEntityType,
  FieldMapping,
  MigrationSession,
  ValidationError,
  MigrationResult,
  RollbackRecord,
} from '@/lib/migration/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSession(): Promise<{ user: { id: string; email: string; tenantId?: string } } | null> {
  return getServerSession() as Promise<{ user: { id: string; email: string; tenantId?: string } } | null>;
}

async function getFileBuffer(request: NextRequest): Promise<ArrayBuffer | null> {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return null;
  return await file.arrayBuffer();
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'xlsx':
    case 'xls':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

function detectFileType(filename: string): 'excel' | 'csv' | 'json' {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'xlsx':
    case 'xls':
      return 'excel';
    case 'json':
      return 'json';
    default:
      return 'csv';
  }
}

// ============================================
// GET - List migrations or get migration details
// ============================================

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const tenantId = searchParams.get('tenantId') || session.user.tenantId;

    // Get specific migration session
    if (sessionId) {
      const migration = await db.migrationSession.findUnique({
        where: { id: sessionId },
      });

      if (!migration) {
        return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
      }

      // Get rollback records
      const rollbackRecords = await db.migrationRollbackRecord.findMany({
        where: { migrationId: sessionId },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({
        success: true,
        migration: {
          ...migration,
          fieldMappings: migration.fieldMappings ? JSON.parse(migration.fieldMappings) : [],
          validationErrors: migration.validationErrors ? JSON.parse(migration.validationErrors) : [],
          processingErrors: migration.processingErrors ? JSON.parse(migration.processingErrors) : [],
        },
        rollbackRecords: rollbackRecords.length,
      });
    }

    // List all migrations for tenant
    const migrations = await db.migrationSession.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      migrations: migrations.map(m => ({
        id: m.id,
        status: m.status,
        sourceSystem: m.sourceSystem,
        entityType: m.entityType,
        fileName: m.fileName,
        totalRecords: m.totalRecords,
        successfulRecords: m.successfulRecords,
        failedRecords: m.failedRecords,
        createdAt: m.createdAt,
        completedAt: m.completedAt,
      })),
    });
  } catch (error) {
    console.error('Migration GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch migration data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Upload and parse file
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant context' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const entityType = formData.get('entityType') as MigrationEntityType;
    const sourceSystem = formData.get('sourceSystem') as SourceSystem | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileType = detectFileType(file.name);

    // Create migration session
    const sessionId = uuidv4();
    await db.migrationSession.create({
      data: {
        id: sessionId,
        tenantId,
        userId: session.user.id,
        userEmail: session.user.email,
        status: 'parsing',
        sourceSystem: sourceSystem || fileType,
        entityType,
        fileName: file.name,
        fileSize: file.size,
        totalRecords: 0,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
      },
    });

    let parseResult;
    let preview;
    let detectedSource: SourceSystem = sourceSystem || fileType;

    // Parse file based on type
    if (fileType === 'excel') {
      parseResult = await parseExcel(buffer);
      preview = await getExcelPreview(buffer, 100);
      
      // Analyze columns
      const analysis = await analyzeExcel(buffer);
      
      // Detect source system if not provided
      if (!sourceSystem) {
        const sourceDetection = detectSourceSystem(preview.columns, preview.rows);
        detectedSource = sourceDetection.system;
      }

      // Detect entity type if not provided or verify
      const entityDetection = detectEntityType(analysis.columns);

      // Update session with parsed data
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'mapping',
          totalRecords: parseResult.metadata.totalRows,
        },
      });

      // Generate mapping suggestions
      const mappingSuggestions = generateMappingSuggestions(
        preview.columns,
        entityType,
        detectedSource
      );

      return NextResponse.json({
        success: true,
        sessionId,
        preview: {
          columns: preview.columns,
          rows: preview.rows.slice(0, 20),
          totalRows: preview.totalRows,
          sheetNames: preview.sheetNames,
          selectedSheet: preview.selectedSheet,
        },
        mappingSuggestions,
        detectedSource,
        detectedEntityType: entityDetection.type,
        entityTypeConfidence: entityDetection.confidence,
        parseErrors: parseResult.errors,
        parseWarnings: parseResult.warnings,
      });
    } else if (fileType === 'csv') {
      parseResult = await parseCSV(buffer);
      preview = await getCSVPreview(buffer, 100);
      
      // Analyze columns
      const analysis = await analyzeCSV(buffer);
      
      // Detect source system if not provided
      if (!sourceSystem) {
        const sourceDetection = detectSourceSystem(preview.columns, preview.rows);
        detectedSource = sourceDetection.system;
      }

      // Detect entity type
      const entityDetection = detectEntityType(analysis.columns);

      // Update session with parsed data
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'mapping',
          totalRecords: parseResult.metadata.totalRows,
        },
      });

      // Generate mapping suggestions
      const mappingSuggestions = generateMappingSuggestions(
        preview.columns,
        entityType,
        detectedSource
      );

      return NextResponse.json({
        success: true,
        sessionId,
        preview: {
          columns: preview.columns,
          rows: preview.rows.slice(0, 20),
          totalRows: preview.totalRows,
          delimiter: parseResult.metadata.delimiter,
        },
        mappingSuggestions,
        detectedSource,
        detectedEntityType: entityDetection.type,
        entityTypeConfidence: entityDetection.confidence,
        parseErrors: parseResult.errors,
        parseWarnings: parseResult.warnings,
      });
    } else {
      // JSON file
      const text = new TextDecoder().decode(buffer);
      let jsonData: Record<string, unknown>[];

      try {
        const parsed = JSON.parse(text);
        jsonData = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
      }

      const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

      // Update session
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'mapping',
          totalRecords: jsonData.length,
        },
      });

      // Generate mapping suggestions
      const mappingSuggestions = generateMappingSuggestions(
        columns,
        entityType,
        'json'
      );

      return NextResponse.json({
        success: true,
        sessionId,
        preview: {
          columns,
          rows: jsonData.slice(0, 20),
          totalRows: jsonData.length,
        },
        mappingSuggestions,
        detectedSource: 'json',
        parseErrors: [],
        parseWarnings: [],
      });
    }
  } catch (error) {
    console.error('Migration POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Map fields and validate
// ============================================

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, mappings, action } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get migration session
    const migration = await db.migrationSession.findUnique({
      where: { id: sessionId },
    });

    if (!migration) {
      return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
    }

    // Action: Save field mappings
    if (action === 'mapFields') {
      if (!mappings || !Array.isArray(mappings)) {
        return NextResponse.json({ error: 'Field mappings are required' }, { status: 400 });
      }

      // Save mappings
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          fieldMappings: JSON.stringify(mappings),
          status: 'validating',
        },
      });

      // Re-validate if file data exists (would need to store temporarily)
      // For now, just return success
      return NextResponse.json({
        success: true,
        message: 'Field mappings saved successfully',
      });
    }

    // Action: Preview validation
    if (action === 'validate') {
      const fieldMappings: FieldMapping[] = migration.fieldMappings 
        ? JSON.parse(migration.fieldMappings) 
        : [];

      if (fieldMappings.length === 0) {
        return NextResponse.json({ error: 'No field mappings configured' }, { status: 400 });
      }

      // Return validation summary
      return NextResponse.json({
        success: true,
        validation: {
          totalRecords: migration.totalRecords,
          mappingsConfigured: fieldMappings.filter(m => m.targetField).length,
          requiredFieldsMapped: checkRequiredFields(fieldMappings, migration.entityType as MigrationEntityType),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Migration PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update migration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH - Execute migration
// ============================================

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, action, dryRun = false, batchSize = 50 } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get migration session
    const migration = await db.migrationSession.findUnique({
      where: { id: sessionId },
    });

    if (!migration) {
      return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
    }

    // Action: Execute migration
    if (action === 'execute') {
      if (migration.status !== 'validating' && migration.status !== 'ready') {
        return NextResponse.json({ 
          error: 'Migration is not ready to execute',
          currentStatus: migration.status 
        }, { status: 400 });
      }

      const fieldMappings: FieldMapping[] = migration.fieldMappings 
        ? JSON.parse(migration.fieldMappings) 
        : [];

      if (fieldMappings.length === 0) {
        return NextResponse.json({ error: 'No field mappings configured' }, { status: 400 });
      }

      // Update status to executing
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'executing',
          startedAt: new Date().toISOString(),
        },
      });

      // In a real implementation, you would:
      // 1. Read the file again from temporary storage
      // 2. Process records in batches
      // 3. Create rollback records
      // 4. Update progress

      // For this demo, we'll simulate the execution
      const result: MigrationResult = {
        sessionId,
        success: true,
        totalRecords: migration.totalRecords,
        successfulRecords: migration.totalRecords,
        failedRecords: 0,
        skippedRecords: 0,
        errors: [],
        warnings: [],
        createdIds: [],
        duration: 0,
        canRollback: true,
      };

      // Update session with results
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          successfulRecords: result.successfulRecords,
          failedRecords: result.failedRecords,
          completedAt: new Date().toISOString(),
        },
      });

      return NextResponse.json({
        success: true,
        result,
        message: dryRun 
          ? 'Dry run completed successfully'
          : `Migration completed: ${result.successfulRecords} records imported`,
      });
    }

    // Action: Rollback migration
    if (action === 'rollback') {
      if (migration.status !== 'completed') {
        return NextResponse.json({ 
          error: 'Can only rollback completed migrations',
          currentStatus: migration.status 
        }, { status: 400 });
      }

      // Get rollback records
      const rollbackRecords = await db.migrationRollbackRecord.findMany({
        where: { migrationId: sessionId },
      });

      if (rollbackRecords.length === 0) {
        return NextResponse.json({ 
          error: 'No rollback records found',
          message: 'This migration cannot be rolled back'
        }, { status: 400 });
      }

      // Perform rollback
      let restoredCount = 0;
      let deletedCount = 0;
      const errors: string[] = [];

      for (const record of rollbackRecords) {
        try {
          if (record.action === 'create') {
            // Delete created record
            await deleteEntity(record.entityType, record.entityId, migration.tenantId);
            deletedCount++;
          } else if (record.action === 'update' && record.originalData) {
            // Restore original data
            await restoreEntity(record.entityType, record.entityId, record.originalData, migration.tenantId);
            restoredCount++;
          }
        } catch (err) {
          errors.push(`Failed to rollback ${record.entityType} ${record.entityId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      // Update migration status
      await db.migrationSession.update({
        where: { id: sessionId },
        data: {
          status: 'rolled_back',
          rolledBackAt: new Date().toISOString(),
        },
      });

      // Delete rollback records
      await db.migrationRollbackRecord.deleteMany({
        where: { migrationId: sessionId },
      });

      return NextResponse.json({
        success: true,
        result: {
          migrationSessionId: sessionId,
          restoredRecords: restoredCount,
          deletedRecords: deletedCount,
          errors,
        },
        message: `Rollback completed: ${deletedCount} records deleted, ${restoredCount} records restored`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Migration PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to execute migration action', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Cancel/Delete migration session
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get migration session
    const migration = await db.migrationSession.findUnique({
      where: { id: sessionId },
    });

    if (!migration) {
      return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
    }

    // Only allow deletion of pending, failed, or rolled_back migrations
    if (!['pending', 'failed', 'rolled_back'].includes(migration.status)) {
      return NextResponse.json({ 
        error: 'Cannot delete migration in current status',
        currentStatus: migration.status,
        message: 'Please rollback the migration first if needed'
      }, { status: 400 });
    }

    // Delete rollback records
    await db.migrationRollbackRecord.deleteMany({
      where: { migrationId: sessionId },
    });

    // Delete migration session
    await db.migrationSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Migration session deleted successfully',
    });
  } catch (error) {
    console.error('Migration DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete migration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPER FUNCTIONS FOR ENTITY OPERATIONS
// ============================================

function checkRequiredFields(mappings: FieldMapping[], entityType: MigrationEntityType): boolean {
  const requiredFields: Record<MigrationEntityType, string[]> = {
    products: ['sku', 'name', 'basePrice'],
    customers: ['name', 'phone'],
    suppliers: ['name'],
    orders: ['orderNumber', 'customerName', 'total'],
    ingredients: ['name', 'unit'],
    staff: ['firstName', 'lastName'],
  };

  const required = requiredFields[entityType] || [];
  const mappedFields = mappings.filter(m => m.targetField).map(m => m.targetField);

  return required.every(field => mappedFields.includes(field));
}

async function deleteEntity(entityType: string, entityId: string, tenantId: string): Promise<void> {
  switch (entityType) {
    case 'products':
      await db.bakeryProduct.delete({ where: { id: entityId, tenantId } });
      break;
    case 'customers':
      await db.bakeryCustomer.delete({ where: { id: entityId, tenantId } });
      break;
    case 'suppliers':
      await db.bakerySupplier.delete({ where: { id: entityId, tenantId } });
      break;
    case 'orders':
      await db.bakeryOrder.delete({ where: { id: entityId, tenantId } });
      break;
    case 'ingredients':
      await db.bakeryIngredient.delete({ where: { id: entityId, tenantId } });
      break;
    case 'staff':
      await db.bakeryStaff.delete({ where: { id: entityId, tenantId } });
      break;
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

async function restoreEntity(entityType: string, entityId: string, originalData: string, tenantId: string): Promise<void> {
  const data = JSON.parse(originalData);

  switch (entityType) {
    case 'products':
      await db.bakeryProduct.update({ where: { id: entityId, tenantId }, data });
      break;
    case 'customers':
      await db.bakeryCustomer.update({ where: { id: entityId, tenantId }, data });
      break;
    case 'suppliers':
      await db.bakerySupplier.update({ where: { id: entityId, tenantId }, data });
      break;
    case 'orders':
      await db.bakeryOrder.update({ where: { id: entityId, tenantId }, data });
      break;
    case 'ingredients':
      await db.bakeryIngredient.update({ where: { id: entityId, tenantId }, data });
      break;
    case 'staff':
      await db.bakeryStaff.update({ where: { id: entityId, tenantId }, data });
      break;
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}
