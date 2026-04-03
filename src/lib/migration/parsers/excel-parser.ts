/**
 * NexusOS Legacy Data Migration - Excel Parser
 * 
 * Parses XLSX files with multi-sheet support, column mapping,
 * and data validation for importing data into NexusOS Bakery.
 */

import * as XLSX from 'xlsx';
import type {
  ParseResult,
  ParseError,
  ParseWarning,
  ParseMetadata,
  ColumnAnalysis,
  FileAnalysis,
  MigrationEntityType,
  SourceDetection,
  SourceSystem,
} from '../types';

/**
 * Detect the source system based on sheet names and column headers
 */
export function detectExcelSourceSystem(
  sheetNames: string[],
  columns: string[]
): SourceDetection {
  const normalizedSheets = sheetNames.map(s => s.toLowerCase());
  const normalizedColumns = columns.map(c => c.toLowerCase().replace(/[_\s]/g, ''));
  
  const indicators: string[] = [];
  let system: SourceSystem = 'excel';
  let confidence = 0;
  
  // QuickBooks indicators
  if (normalizedSheets.some(s => s.includes('item') || s.includes('customer') || s.includes('vendor'))) {
    const quickBooksColumns = ['name', 'type', 'unitprice', 'purchasecost', 'qtyonhand', 'accountref'];
    const matches = normalizedColumns.filter(c => quickBooksColumns.some(q => c.includes(q))).length;
    
    if (matches >= 3) {
      system = 'quickbooks';
      confidence = 0.8;
      indicators.push(`Found ${matches} QuickBooks columns, sheet names match QuickBooks export`);
    }
  }
  
  // Square indicators
  if (normalizedSheets.some(s => s.includes('catalog') || s.includes('items') || s.includes('transactions'))) {
    const squareColumns = ['variation', 'priceamount', 'currency', 'location', 'square'];
    const matches = normalizedColumns.filter(c => squareColumns.some(s => c.includes(s))).length;
    
    if (matches >= 2) {
      system = 'square';
      confidence = 0.7;
      indicators.push(`Found ${matches} Square-specific columns`);
    }
  }
  
  // Generic bakery/POS indicators
  const bakeryColumns = ['product', 'item', 'price', 'stock', 'order', 'customer', 'phone'];
  const bakeryMatches = normalizedColumns.filter(c => bakeryColumns.some(b => c.includes(b))).length;
  
  if (bakeryMatches >= 3 && confidence < 0.5) {
    system = 'excel';
    confidence = 0.6;
    indicators.push(`Found ${bakeryMatches} common bakery/POS columns`);
  }
  
  return { system, confidence, indicators };
}

/**
 * Detect the entity type from Excel data
 */
export function detectExcelEntityType(
  sheetName: string,
  columns: string[]
): { type: MigrationEntityType | undefined; confidence: number } {
  const normalizedSheet = sheetName.toLowerCase();
  const normalizedColumns = columns.map(c => c.toLowerCase().replace(/[_\s]/g, ''));
  
  // Try to detect from sheet name first
  if (normalizedSheet.includes('product') || normalizedSheet.includes('item') || normalizedSheet.includes('inventory')) {
    return { type: 'products', confidence: 0.9 };
  }
  if (normalizedSheet.includes('customer') || normalizedSheet.includes('client')) {
    return { type: 'customers', confidence: 0.9 };
  }
  if (normalizedSheet.includes('order') || normalizedSheet.includes('sale') || normalizedSheet.includes('transaction')) {
    return { type: 'orders', confidence: 0.9 };
  }
  if (normalizedSheet.includes('supplier') || normalizedSheet.includes('vendor')) {
    return { type: 'suppliers', confidence: 0.9 };
  }
  if (normalizedSheet.includes('ingredient') || normalizedSheet.includes('raw') || normalizedSheet.includes('material')) {
    return { type: 'ingredients', confidence: 0.9 };
  }
  if (normalizedSheet.includes('staff') || normalizedSheet.includes('employee') || normalizedSheet.includes('worker')) {
    return { type: 'staff', confidence: 0.9 };
  }
  
  // Fall back to column analysis
  const productColumns = ['sku', 'productname', 'itemname', 'baseprice', 'costprice', 'stockquantity', 'category'];
  const productMatches = normalizedColumns.filter(c => productColumns.some(p => c.includes(p))).length;
  
  const customerColumns = ['customername', 'customeremail', 'customerphone', 'loyalty', 'birthday'];
  const customerMatches = normalizedColumns.filter(c => customerColumns.some(p => c.includes(p))).length;
  
  const orderColumns = ['ordernumber', 'orderid', 'total', 'subtotal', 'paymentstatus', 'delivery'];
  const orderMatches = normalizedColumns.filter(c => orderColumns.some(p => c.includes(p))).length;
  
  const supplierColumns = ['suppliername', 'vendorname', 'contactname', 'paymentterms'];
  const supplierMatches = normalizedColumns.filter(c => supplierColumns.some(p => c.includes(p))).length;
  
  const ingredientColumns = ['ingredientname', 'unitcost', 'currentstock', 'minstock'];
  const ingredientMatches = normalizedColumns.filter(c => ingredientColumns.some(p => c.includes(p))).length;
  
  const staffColumns = ['employeename', 'firstname', 'lastname', 'role', 'hourlyrate', 'salary'];
  const staffMatches = normalizedColumns.filter(c => staffColumns.some(p => c.includes(p))).length;
  
  const scores: Array<{ type: MigrationEntityType; score: number }> = [
    { type: 'products', score: productMatches },
    { type: 'customers', score: customerMatches },
    { type: 'orders', score: orderMatches },
    { type: 'suppliers', score: supplierMatches },
    { type: 'ingredients', score: ingredientMatches },
    { type: 'staff', score: staffMatches },
  ];
  
  const best = scores.sort((a, b) => b.score - a.score)[0];
  
  if (best.score >= 2) {
    return { type: best.type, confidence: Math.min(best.score / 5, 1) };
  }
  
  return { type: undefined, confidence: 0 };
}

/**
 * Analyze columns for type detection and statistics
 */
export function analyzeExcelColumns(
  columns: string[],
  rows: Record<string, unknown>[]
): ColumnAnalysis[] {
  return columns.map(column => {
    const values = rows.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
    const nullCount = rows.length - values.length;
    
    // Determine type based on sample values
    let type: 'string' | 'number' | 'date' | 'boolean' | 'mixed' = 'string';
    const typeCounts: Record<string, number> = {
      string: 0,
      number: 0,
      date: 0,
      boolean: 0,
    };
    
    const sampleValues = values.slice(0, 5);
    
    for (const value of sampleValues) {
      if (typeof value === 'boolean') {
        typeCounts.boolean++;
      } else if (typeof value === 'number') {
        typeCounts.number++;
      } else if (value instanceof Date) {
        typeCounts.date++;
      } else if (typeof value === 'string') {
        // Check if it looks like a date
        if (!isNaN(Date.parse(value))) {
          typeCounts.date++;
        } else if (!isNaN(Number(value))) {
          typeCounts.number++;
        } else {
          typeCounts.string++;
        }
      }
    }
    
    // Determine the dominant type
    const dominantType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const totalTyped = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    
    if (totalTyped > 0 && typeCounts[dominantType] / totalTyped > 0.8) {
      type = dominantType as typeof type;
    } else if (totalTyped > 0) {
      type = 'mixed';
    }
    
    // Count unique values
    const uniqueValues = new Set(values.map(v => String(v).toLowerCase()));
    
    return {
      name: column,
      type,
      nullCount,
      uniqueCount: uniqueValues.size,
      sampleValues,
      suggestedMapping: undefined,
      confidence: 0,
    };
  });
}

/**
 * Convert Excel serial date to JavaScript Date
 */
function excelSerialToDate(serial: number): Date | null {
  if (typeof serial !== 'number' || isNaN(serial)) {
    return null;
  }
  
  // Excel serial date starts from 1900-01-01 (but has a bug for 1900 leap year)
  // Using UTC to avoid timezone issues
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
}

/**
 * Parse an Excel cell value to appropriate JavaScript type
 */
function parseExcelValue(value: unknown): unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  // Already a number
  if (typeof value === 'number') {
    // Check if it might be an Excel date serial
    if (value > 25000 && value < 100000) {
      // Likely an Excel date serial number
      const date = excelSerialToDate(value);
      if (date) {
        return date.toISOString().split('T')[0];
      }
    }
    return value;
  }
  
  // Boolean
  if (typeof value === 'boolean') {
    return value;
  }
  
  // Date object
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  
  // String
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a') {
      return null;
    }
    
    // Boolean strings
    const lowerTrimmed = trimmed.toLowerCase();
    if (['true', 'yes', 'y'].includes(lowerTrimmed)) {
      return true;
    }
    if (['false', 'no', 'n'].includes(lowerTrimmed)) {
      return false;
    }
    
    // Number strings
    const numValue = Number(trimmed);
    if (!isNaN(numValue) && trimmed !== '') {
      return numValue;
    }
    
    return trimmed;
  }
  
  return String(value);
}

/**
 * Main Excel parser function
 */
export async function parseExcel(
  buffer: ArrayBuffer,
  options?: {
    sheetName?: string;
    sheetIndex?: number;
    hasHeader?: boolean;
    skipEmptyRows?: boolean;
  }
): Promise<ParseResult & { sheetNames: string[]; selectedSheet: string }> {
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  
  try {
    // Read the workbook
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    
    const sheetNames = workbook.SheetNames;
    
    if (sheetNames.length === 0) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, message: 'No sheets found in Excel file', code: 'NO_SHEETS' }],
        warnings: [],
        metadata: {
          totalRows: 0,
          successfulRows: 0,
          failedRows: 0,
          skippedRows: 0,
          detectedColumns: [],
        },
        sheetNames: [],
        selectedSheet: '',
      };
    }
    
    // Select sheet
    let selectedSheet: string;
    
    if (options?.sheetName && sheetNames.includes(options.sheetName)) {
      selectedSheet = options.sheetName;
    } else if (options?.sheetIndex !== undefined && options.sheetIndex < sheetNames.length) {
      selectedSheet = sheetNames[options.sheetIndex];
    } else {
      // Default to first sheet
      selectedSheet = sheetNames[0];
    }
    
    const worksheet = workbook.Sheets[selectedSheet];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: options?.hasHeader !== false ? 1 : undefined,
      defval: null,
      raw: false, // Get formatted values
    }) as unknown[][];
    
    if (jsonData.length === 0) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, message: 'Sheet is empty', code: 'EMPTY_SHEET' }],
        warnings: [],
        metadata: {
          totalRows: 0,
          successfulRows: 0,
          failedRows: 0,
          skippedRows: 0,
          detectedColumns: [],
          sheetName: selectedSheet,
        },
        sheetNames,
        selectedSheet,
      };
    }
    
    // Extract headers from first row
    const hasHeader = options?.hasHeader !== false;
    const headers = hasHeader 
      ? (jsonData[0] as unknown[]).map(h => String(h || '').trim())
      : jsonData[0].map((_, i) => `Column${i + 1}`);
    
    // Parse data rows
    const data: Record<string, unknown>[] = [];
    let successfulRows = 0;
    let failedRows = 0;
    
    const startRow = hasHeader ? 1 : 0;
    
    for (let i = startRow; i < jsonData.length; i++) {
      const row = jsonData[i] as unknown[];
      const rowNumber = i + 1;
      
      // Skip empty rows
      if (options?.skipEmptyRows !== false) {
        const isEmpty = row.every(cell => 
          cell === null || cell === undefined || cell === ''
        );
        if (isEmpty) {
          continue;
        }
      }
      
      try {
        const rowObject: Record<string, unknown> = {};
        
        for (let j = 0; j < headers.length; j++) {
          const value = row[j];
          rowObject[headers[j]] = parseExcelValue(value);
        }
        
        data.push(rowObject);
        successfulRows++;
      } catch (error) {
        failedRows++;
        errors.push({
          row: rowNumber,
          message: `Failed to parse row: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: 'PARSE_ERROR',
        });
      }
    }
    
    return {
      success: errors.length === 0,
      data,
      errors,
      warnings,
      metadata: {
        totalRows: jsonData.length - (hasHeader ? 1 : 0),
        successfulRows,
        failedRows,
        skippedRows: jsonData.length - startRow - successfulRows - failedRows,
        detectedColumns: headers,
        sheetName: selectedSheet,
      },
      sheetNames,
      selectedSheet,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [{
        row: 0,
        message: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'FILE_ERROR',
      }],
      warnings: [],
      metadata: {
        totalRows: 0,
        successfulRows: 0,
        failedRows: 0,
        skippedRows: 0,
        detectedColumns: [],
      },
      sheetNames: [],
      selectedSheet: '',
    };
  }
}

/**
 * Parse all sheets from an Excel file
 */
export async function parseExcelAllSheets(
  buffer: ArrayBuffer
): Promise<Record<string, ParseResult>> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const results: Record<string, ParseResult> = {};
  
  for (const sheetName of workbook.SheetNames) {
    const result = await parseExcel(buffer, { sheetName });
    results[sheetName] = result;
  }
  
  return results;
}

/**
 * Analyze an Excel file and return comprehensive metadata
 */
export async function analyzeExcel(
  buffer: ArrayBuffer,
  sheetName?: string
): Promise<FileAnalysis> {
  const result = await parseExcel(buffer, { sheetName });
  
  if (!result.success) {
    return {
      columns: [],
      totalRows: 0,
      sheetNames: result.sheetNames,
      entityTypeConfidence: 0,
    };
  }
  
  const columns = analyzeExcelColumns(result.metadata.detectedColumns, result.data);
  const entityType = detectExcelEntityType(
    result.selectedSheet,
    result.metadata.detectedColumns
  );
  
  return {
    columns,
    totalRows: result.data.length,
    sheetNames: result.sheetNames,
    detectedEntityType: entityType.type,
    entityTypeConfidence: entityType.confidence,
  };
}

/**
 * Get a preview of Excel data (first N rows)
 */
export async function getExcelPreview(
  buffer: ArrayBuffer,
  maxRows: number = 50,
  sheetName?: string
): Promise<{
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
  sheetNames: string[];
  selectedSheet: string;
}> {
  const result = await parseExcel(buffer, { sheetName });
  
  return {
    columns: result.metadata.detectedColumns,
    rows: result.data.slice(0, maxRows),
    totalRows: result.data.length,
    sheetNames: result.sheetNames,
    selectedSheet: result.selectedSheet,
  };
}

/**
 * Get sheet names from an Excel file
 */
export async function getExcelSheetNames(buffer: ArrayBuffer): Promise<string[]> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  return workbook.SheetNames;
}
