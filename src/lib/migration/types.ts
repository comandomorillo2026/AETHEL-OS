/**
 * NexusOS Legacy Data Migration System - Type Definitions
 * 
 * This module provides type definitions for migrating data from legacy systems
 * into NexusOS Bakery module.
 */

// ============================================
// SOURCE SYSTEM TYPES
// ============================================

export type SourceSystem = 
  | 'excel'
  | 'csv'
  | 'json'
  | 'quickbooks'
  | 'square'
  | 'other';

export type MigrationEntityType = 
  | 'products'
  | 'customers'
  | 'orders'
  | 'suppliers'
  | 'ingredients'
  | 'staff';

export type MigrationStatus = 
  | 'pending'
  | 'parsing'
  | 'mapping'
  | 'validating'
  | 'ready'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'rolled_back';

// ============================================
// FILE UPLOAD TYPES
// ============================================

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: ArrayBuffer;
  uploadedAt: Date;
}

export interface ParseResult<T = Record<string, unknown>> {
  success: boolean;
  data: T[];
  errors: ParseError[];
  warnings: ParseWarning[];
  metadata: ParseMetadata;
}

export interface ParseError {
  row: number;
  column?: string;
  message: string;
  value?: unknown;
  code: string;
}

export interface ParseWarning {
  row: number;
  column?: string;
  message: string;
  value?: unknown;
}

export interface ParseMetadata {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  skippedRows: number;
  delimiter?: string;
  sheetName?: string;
  detectedColumns: string[];
  detectedEncoding?: string;
}

// ============================================
// FIELD MAPPING TYPES
// ============================================

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: FieldTransformation;
  required: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
}

export interface FieldTransformation {
  type: 'trim' | 'uppercase' | 'lowercase' | 'number' | 'date' | 'boolean' | 'custom';
  format?: string;
  customFunction?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'phone' | 'url' | 'enum' | 'unique';
  value?: unknown;
  message: string;
}

export interface MappingSuggestion {
  sourceField: string;
  suggestedTarget: string;
  confidence: number;
  reason: string;
}

export interface MappingTemplate {
  name: string;
  sourceSystem: SourceSystem;
  entityType: MigrationEntityType;
  mappings: FieldMapping[];
}

// ============================================
// ENTITY DATA TYPES
// ============================================

export interface ProductMigrationData {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  basePrice: number;
  costPrice?: number;
  stockQuantity?: number;
  minStock?: number;
  unit?: string;
  isActive?: boolean;
  imageUrl?: string;
  allergens?: string;
  productionTime?: number;
  shelfLife?: number;
}

export interface CustomerMigrationData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  birthday?: string;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  totalPurchases?: number;
  ordersCount?: number;
  preferences?: string;
}

export interface SupplierMigrationData {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive?: boolean;
}

export interface OrderMigrationData {
  orderNumber: string;
  orderType?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryType?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  items: OrderItemMigrationData[];
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
  paymentStatus?: string;
  paymentMethod?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
}

export interface OrderItemMigrationData {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface IngredientMigrationData {
  sku?: string;
  name: string;
  category?: string;
  currentStock?: number;
  minStock?: number;
  unit: string;
  unitCost?: number;
  supplierName?: string;
}

export interface StaffMigrationData {
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  position?: string;
  workingHours?: string;
  workingDays?: string;
  hourlyRate?: number;
  salary?: number;
  isActive?: boolean;
  hireDate?: string;
}

// ============================================
// MIGRATION SESSION TYPES
// ============================================

export interface MigrationSession {
  id: string;
  tenantId: string;
  userId: string;
  status: MigrationStatus;
  sourceSystem: SourceSystem;
  entityType: MigrationEntityType;
  fileName: string;
  fileSize: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  fieldMappings: FieldMapping[];
  validationErrors: ValidationError[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  rolledBackAt?: Date;
}

export interface ValidationError {
  row: number;
  field: string;
  value: unknown;
  message: string;
  code: string;
}

export interface MigrationResult {
  sessionId: string;
  success: boolean;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  skippedRecords: number;
  errors: MigrationError[];
  warnings: MigrationWarning[];
  createdIds: string[];
  duration: number;
  canRollback: boolean;
}

export interface MigrationError {
  row: number;
  data: Record<string, unknown>;
  error: string;
  code: string;
}

export interface MigrationWarning {
  row: number;
  field: string;
  message: string;
}

// ============================================
// ROLLBACK TYPES
// ============================================

export interface RollbackRecord {
  id: string;
  migrationSessionId: string;
  entityType: MigrationEntityType;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  originalData?: Record<string, unknown>;
  createdAt: Date;
}

export interface RollbackResult {
  success: boolean;
  migrationSessionId: string;
  restoredRecords: number;
  deletedRecords: number;
  errors: string[];
}

// ============================================
// PREVIEW TYPES
// ============================================

export interface PreviewData {
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
  sampleSize: number;
  mappingSuggestions: MappingSuggestion[];
  detectedEntityType?: MigrationEntityType;
  confidence: number;
}

export interface PreviewValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: MigrationWarning[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    withWarnings: number;
  };
}

// ============================================
// SOURCE SYSTEM DETECTION
// ============================================

export interface SourceDetection {
  system: SourceSystem;
  confidence: number;
  indicators: string[];
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface UploadRequest {
  file: File;
  entityType: MigrationEntityType;
  sourceSystem?: SourceSystem;
}

export interface UploadResponse {
  success: boolean;
  sessionId: string;
  preview: PreviewData;
  mappingSuggestions: MappingSuggestion[];
  detectedSource?: SourceSystem;
}

export interface MapFieldsRequest {
  sessionId: string;
  mappings: FieldMapping[];
}

export interface MapFieldsResponse {
  success: boolean;
  validation: PreviewValidation;
  preview: PreviewData;
}

export interface ExecuteMigrationRequest {
  sessionId: string;
  dryRun?: boolean;
  batchSize?: number;
}

export interface ExecuteMigrationResponse {
  success: boolean;
  result?: MigrationResult;
  message: string;
}

export interface RollbackRequest {
  sessionId: string;
}

export interface RollbackResponse {
  success: boolean;
  result?: RollbackResult;
  message: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type MigrationDataMap = {
  products: ProductMigrationData;
  customers: CustomerMigrationData;
  suppliers: SupplierMigrationData;
  orders: OrderMigrationData;
  ingredients: IngredientMigrationData;
  staff: StaffMigrationData;
};

export type MigrationData = MigrationDataMap[MigrationEntityType];

export interface ColumnAnalysis {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'mixed';
  nullCount: number;
  uniqueCount: number;
  sampleValues: unknown[];
  suggestedMapping?: string;
  confidence: number;
}

export interface FileAnalysis {
  columns: ColumnAnalysis[];
  totalRows: number;
  detectedDelimiter?: string;
  detectedEncoding?: string;
  sheetNames?: string[];
  detectedEntityType?: MigrationEntityType;
  entityTypeConfidence: number;
}

// ============================================
// QUICKBOOKS SPECIFIC TYPES
// ============================================

export interface QuickBooksItem {
  Name: string;
  Description?: string;
  Type: 'Inventory' | 'Service' | 'NonInventory';
  UnitPrice?: number;
  PurchaseCost?: number;
  QtyOnHand?: number;
  SKU?: string;
  IncomeAccountRef?: { name: string; value: string };
  ExpenseAccountRef?: { name: string; value: string };
  AssetAccountRef?: { name: string; value: string };
  TrackQtyOnHand?: boolean;
}

export interface QuickBooksCustomer {
  DisplayName: string;
  CompanyName?: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    Country?: string;
    PostalCode?: string;
  };
  Notes?: string;
}

// ============================================
// SQUARE SPECIFIC TYPES
// ============================================

export interface SquareCatalogObject {
  type: string;
  id: string;
  item_data?: {
    name: string;
    description?: string;
    category_id?: string;
    variations: Array<{
      id: string;
      item_variation_data: {
        name: string;
        price_money?: { amount: number; currency: string };
        sku?: string;
      };
    }>;
  };
}

export interface SquareCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  address?: {
    address_line_1?: string;
    locality?: string;
    postal_code?: string;
  };
  created_at?: string;
}
