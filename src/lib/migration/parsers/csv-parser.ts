/**
 * NexusOS Legacy Data Migration - CSV Parser
 * 
 * Parses CSV files with auto-detect delimiter, column mapping,
 * and data validation for importing data into NexusOS Bakery.
 */

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

// Common delimiters to auto-detect
const DELIMITERS = [',', ';', '\t', '|', ':'];

// Common encodings to try
const ENCODINGS = ['utf-8', 'latin1', 'iso-8859-1', 'windows-1252'];

/**
 * Auto-detect the delimiter used in a CSV file
 */
export function detectDelimiter(content: string): string {
  const firstLines = content.split('\n').slice(0, 10).join('\n');
  
  const delimiterCounts: Record<string, number[]> = {};
  
  for (const delimiter of DELIMITERS) {
    const counts = firstLines.split('\n').map(line => {
      let count = 0;
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (!inQuotes && char === delimiter) {
          count++;
        }
      }
      
      return count;
    });
    
    // Check if the count is consistent across lines
    if (counts.length > 0 && counts[0] > 0) {
      const firstCount = counts[0];
      const consistent = counts.filter(c => c === firstCount).length;
      
      if (consistent >= counts.length * 0.8) {
        delimiterCounts[delimiter] = counts;
      }
    }
  }
  
  // Return the delimiter with the highest consistent count
  let bestDelimiter = ',';
  let bestScore = 0;
  
  for (const [delimiter, counts] of Object.entries(delimiterCounts)) {
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    if (avgCount > bestScore) {
      bestScore = avgCount;
      bestDelimiter = delimiter;
    }
  }
  
  return bestDelimiter;
}

/**
 * Detect encoding of the file content
 */
export function detectEncoding(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  
  // Check for BOM (Byte Order Mark)
  if (uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
    return 'utf-8';
  }
  if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
    return 'utf-16le';
  }
  if (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
    return 'utf-16be';
  }
  
  // Default to UTF-8
  return 'utf-8';
}

/**
 * Parse a CSV line respecting quoted fields
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  
  // Add the last field
  fields.push(currentField.trim());
  
  return fields;
}

/**
 * Detect the source system based on column names and data patterns
 */
export function detectSourceSystem(
  columns: string[],
  sampleData: Record<string, unknown>[]
): SourceDetection {
  const normalizedColumns = columns.map(c => c.toLowerCase().replace(/[_\s]/g, ''));
  
  // QuickBooks indicators
  const quickBooksIndicators = [
    'name', 'type', 'unitprice', 'purchasecost', 'qtyonhand',
    'incomeaccountref', 'expenseaccountref', 'assetaccountref',
    'displayname', 'primaryemailaddr', 'billaddr', 'txnsource'
  ];
  
  // Square indicators
  const squareIndicators = [
    'variationname', 'priceamount', 'currency', 'itemdata',
    'catalogobject', 'squareid', 'locationid'
  ];
  
  // Generic POS indicators
  const posIndicators = [
    'sku', 'barcode', 'plu', 'itemname', 'price', 'quantity',
    'customername', 'phone', 'email', 'total', 'subtotal'
  ];
  
  // Check for QuickBooks
  const quickBooksMatches = normalizedColumns.filter(c => 
    quickBooksIndicators.some(i => c.includes(i))
  ).length;
  
  // Check for Square
  const squareMatches = normalizedColumns.filter(c => 
    squareIndicators.some(i => c.includes(i))
  ).length;
  
  // Check for generic POS
  const posMatches = normalizedColumns.filter(c => 
    posIndicators.some(i => c.includes(i))
  ).length;
  
  // Determine the most likely source
  const indicators: string[] = [];
  let system: SourceSystem = 'csv';
  let confidence = 0;
  
  if (quickBooksMatches > squareMatches && quickBooksMatches > posMatches) {
    system = 'quickbooks';
    confidence = Math.min(quickBooksMatches / columns.length * 2, 1);
    indicators.push(`Found ${quickBooksMatches} QuickBooks-specific columns`);
  } else if (squareMatches > 0) {
    system = 'square';
    confidence = Math.min(squareMatches / columns.length * 2, 1);
    indicators.push(`Found ${squareMatches} Square-specific columns`);
  } else if (posMatches > 0) {
    system = 'csv';
    confidence = Math.min(posMatches / columns.length * 1.5, 0.9);
    indicators.push(`Found ${posMatches} common POS columns`);
  }
  
  return {
    system,
    confidence,
    indicators,
  };
}

/**
 * Analyze columns for type detection and statistics
 */
export function analyzeColumns(
  columns: string[],
  rows: Record<string, unknown>[]
): ColumnAnalysis[] {
  return columns.map(column => {
    const values = rows.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
    const nullCount = rows.length - values.length;
    
    // Determine type
    let type: 'string' | 'number' | 'date' | 'boolean' | 'mixed' = 'string';
    const sampleTypes = new Set<string>();
    
    const sampleValues = values.slice(0, 5);
    
    for (const value of sampleValues) {
      const strValue = String(value).toLowerCase().trim();
      
      // Check for boolean
      if (['true', 'false', 'yes', 'no', '1', '0', 'y', 'n'].includes(strValue)) {
        sampleTypes.add('boolean');
      }
      // Check for number
      else if (!isNaN(Number(strValue)) && strValue !== '') {
        sampleTypes.add('number');
      }
      // Check for date
      else if (!isNaN(Date.parse(strValue))) {
        sampleTypes.add('date');
      }
      // Default to string
      else {
        sampleTypes.add('string');
      }
    }
    
    if (sampleTypes.size === 1) {
      type = sampleTypes.values().next().value as typeof type;
    } else if (sampleTypes.size > 1) {
      type = 'mixed';
    }
    
    // Count unique values
    const uniqueValues = new Set(values.map(v => String(v).toLowerCase()));
    
    return {
      name: column,
      type,
      nullCount,
      uniqueCount: uniqueValues.size,
      sampleValues: sampleValues,
      suggestedMapping: undefined,
      confidence: 0,
    };
  });
}

/**
 * Detect the entity type from column analysis
 */
export function detectEntityType(columns: ColumnAnalysis[]): {
  type: MigrationEntityType | undefined;
  confidence: number;
} {
  const columnNames = columns.map(c => c.name.toLowerCase().replace(/[_\s]/g, ''));
  
  // Product indicators
  const productColumns = ['sku', 'productname', 'name', 'itemname', 'price', 'baseprice', 'cost', 'stock', 'quantity', 'category'];
  const productMatches = columnNames.filter(c => 
    productColumns.some(p => c.includes(p))
  ).length;
  
  // Customer indicators
  const customerColumns = ['customername', 'customer', 'name', 'email', 'phone', 'address', 'loyalty', 'birthday'];
  const customerMatches = columnNames.filter(c => 
    customerColumns.some(p => c.includes(p))
  ).length;
  
  // Order indicators
  const orderColumns = ['ordernumber', 'orderid', 'order', 'total', 'subtotal', 'items', 'payment', 'delivery'];
  const orderMatches = columnNames.filter(c => 
    orderColumns.some(p => c.includes(p))
  ).length;
  
  // Supplier indicators
  const supplierColumns = ['suppliername', 'supplier', 'vendor', 'vendorname', 'contact', 'paymentterms'];
  const supplierMatches = columnNames.filter(c => 
    supplierColumns.some(p => c.includes(p))
  ).length;
  
  // Ingredient indicators
  const ingredientColumns = ['ingredient', 'ingredientname', 'unitcost', 'currentstock', 'minstock', 'unit'];
  const ingredientMatches = columnNames.filter(c => 
    ingredientColumns.some(p => c.includes(p))
  ).length;
  
  // Staff indicators
  const staffColumns = ['staff', 'employee', 'firstname', 'lastname', 'role', 'position', 'hourlyrate', 'salary'];
  const staffMatches = columnNames.filter(c => 
    staffColumns.some(p => c.includes(p))
  ).length;
  
  // Find the best match
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
    return {
      type: best.type,
      confidence: Math.min(best.score / 5, 1),
    };
  }
  
  return { type: undefined, confidence: 0 };
}

/**
 * Main CSV parser function
 */
export async function parseCSV(
  buffer: ArrayBuffer,
  options?: {
    delimiter?: string;
    encoding?: string;
    hasHeader?: boolean;
    skipEmptyRows?: boolean;
  }
): Promise<ParseResult> {
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  
  try {
    // Detect encoding if not specified
    const encoding = options?.encoding || detectEncoding(buffer);
    
    // Decode content
    const decoder = new TextDecoder(encoding);
    const content = decoder.decode(buffer);
    
    // Detect delimiter if not specified
    const delimiter = options?.delimiter || detectDelimiter(content);
    
    // Split into lines
    const lines = content.split(/\r?\n/).filter(line => 
      options?.skipEmptyRows !== false ? line.trim() !== '' : true
    );
    
    if (lines.length === 0) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, message: 'File is empty', code: 'EMPTY_FILE' }],
        warnings: [],
        metadata: {
          totalRows: 0,
          successfulRows: 0,
          failedRows: 0,
          skippedRows: 0,
          delimiter,
          detectedColumns: [],
          detectedEncoding: encoding,
        },
      };
    }
    
    // Parse header
    const hasHeader = options?.hasHeader !== false;
    const headerLine = lines[0];
    const columns = parseCSVLine(headerLine, delimiter);
    
    // Normalize column names
    const normalizedColumns = columns.map(c => 
      c.replace(/^["']|["']$/g, '').trim()
    );
    
    // Parse data rows
    const data: Record<string, unknown>[] = [];
    let successfulRows = 0;
    let failedRows = 0;
    
    for (let i = hasHeader ? 1 : 0; i < lines.length; i++) {
      const line = lines[i];
      const rowNumber = i + 1;
      
      try {
        const values = parseCSVLine(line, delimiter);
        
        // Check if row has same number of columns as header
        if (values.length !== normalizedColumns.length) {
          warnings.push({
            row: rowNumber,
            message: `Column count mismatch: expected ${normalizedColumns.length}, got ${values.length}`,
          });
        }
        
        // Create row object
        const row: Record<string, unknown> = {};
        for (let j = 0; j < normalizedColumns.length; j++) {
          const value = values[j] || '';
          row[normalizedColumns[j]] = parseValue(value);
        }
        
        data.push(row);
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
        totalRows: lines.length - (hasHeader ? 1 : 0),
        successfulRows,
        failedRows,
        skippedRows: 0,
        delimiter,
        detectedColumns: normalizedColumns,
        detectedEncoding: encoding,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [{
        row: 0,
        message: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    };
  }
}

/**
 * Parse a string value to its appropriate type
 */
function parseValue(value: string): unknown {
  // Remove surrounding quotes
  const trimmed = value.replace(/^["']|["']$/g, '').trim();
  
  if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a') {
    return null;
  }
  
  // Boolean
  const lowerTrimmed = trimmed.toLowerCase();
  if (['true', 'yes', 'y', '1'].includes(lowerTrimmed)) {
    return true;
  }
  if (['false', 'no', 'n', '0'].includes(lowerTrimmed)) {
    return false;
  }
  
  // Number
  const numValue = Number(trimmed);
  if (!isNaN(numValue) && trimmed !== '') {
    return numValue;
  }
  
  // Date - check common formats
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  ];
  
  for (const pattern of datePatterns) {
    if (pattern.test(trimmed)) {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        return trimmed; // Keep as string, let mapper handle conversion
      }
    }
  }
  
  // Default to string
  return trimmed;
}

/**
 * Analyze a CSV file and return comprehensive metadata
 */
export async function analyzeCSV(buffer: ArrayBuffer): Promise<FileAnalysis> {
  const result = await parseCSV(buffer);
  
  if (!result.success) {
    return {
      columns: [],
      totalRows: 0,
      detectedDelimiter: result.metadata.delimiter,
      detectedEncoding: result.metadata.detectedEncoding,
      entityTypeConfidence: 0,
    };
  }
  
  const columns = analyzeColumns(result.metadata.detectedColumns, result.data);
  const entityType = detectEntityType(columns);
  
  return {
    columns,
    totalRows: result.data.length,
    detectedDelimiter: result.metadata.delimiter,
    detectedEncoding: result.metadata.detectedEncoding,
    detectedEntityType: entityType.type,
    entityTypeConfidence: entityType.confidence,
  };
}

/**
 * Get a preview of CSV data (first N rows)
 */
export async function getCSVPreview(
  buffer: ArrayBuffer,
  maxRows: number = 50
): Promise<{
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}> {
  const result = await parseCSV(buffer);
  
  return {
    columns: result.metadata.detectedColumns,
    rows: result.data.slice(0, maxRows),
    totalRows: result.data.length,
  };
}
