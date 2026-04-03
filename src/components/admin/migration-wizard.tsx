'use client';

/**
 * NexusOS Legacy Data Migration Wizard
 * 
 * A 6-step wizard for importing data from legacy systems into NexusOS Bakery:
 * 1. Select source type
 * 2. Upload file
 * 3. Map fields
 * 4. Preview & validate
 * 5. Execute migration
 * 6. View results
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload, FileSpreadsheet, FileText, Code, Database, 
  ArrowRight, ArrowLeft, Check, AlertCircle, Info,
  Loader2, CheckCircle, XCircle, RotateCcw, Trash2,
  FileUp, Columns, Eye, Play, BarChart3
} from 'lucide-react';
import type { 
  SourceSystem, 
  MigrationEntityType, 
  FieldMapping, 
  MappingSuggestion,
  ValidationError,
} from '@/lib/migration/types';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface MigrationWizardProps {
  tenantId?: string;
  onComplete?: (sessionId: string) => void;
  onCancel?: () => void;
}

type WizardStep = 
  | 'source'
  | 'upload'
  | 'mapping'
  | 'preview'
  | 'execute'
  | 'results';

interface MigrationState {
  step: WizardStep;
  sourceSystem: SourceSystem | null;
  entityType: MigrationEntityType | null;
  fileName: string;
  fileSize: number;
  sessionId: string | null;
  previewData: {
    columns: string[];
    rows: Record<string, unknown>[];
    totalRows: number;
    sheetNames?: string[];
    selectedSheet?: string;
    delimiter?: string;
  } | null;
  mappingSuggestions: MappingSuggestion[];
  fieldMappings: FieldMapping[];
  validationErrors: ValidationError[];
  detectedSource: SourceSystem | null;
  detectedEntityType: MigrationEntityType | null;
  entityTypeConfidence: number;
  parseErrors: { row: number; message: string; code: string }[];
  parseWarnings: { row: number; message: string }[];
  isProcessing: boolean;
  executionResult: {
    success: boolean;
    totalRecords: number;
    successfulRecords: number;
    failedRecords: number;
    message: string;
  } | null;
  error: string | null;
}

const initialState: MigrationState = {
  step: 'source',
  sourceSystem: null,
  entityType: null,
  fileName: '',
  fileSize: 0,
  sessionId: null,
  previewData: null,
  mappingSuggestions: [],
  fieldMappings: [],
  validationErrors: [],
  detectedSource: null,
  detectedEntityType: null,
  entityTypeConfidence: 0,
  parseErrors: [],
  parseWarnings: [],
  isProcessing: false,
  executionResult: null,
  error: null,
};

// ============================================
// SOURCE SYSTEM OPTIONS
// ============================================

const SOURCE_SYSTEMS: Array<{
  value: SourceSystem;
  label: string;
  description: string;
  icon: React.ElementType;
  fileTypes: string[];
}> = [
  {
    value: 'excel',
    label: 'Excel Spreadsheet',
    description: 'XLSX or XLS files from Microsoft Excel, Google Sheets, or LibreOffice',
    icon: FileSpreadsheet,
    fileTypes: ['.xlsx', '.xls'],
  },
  {
    value: 'csv',
    label: 'CSV File',
    description: 'Comma-separated values from any spreadsheet or POS system',
    icon: FileText,
    fileTypes: ['.csv'],
  },
  {
    value: 'json',
    label: 'JSON Data',
    description: 'JSON files exported from databases or other systems',
    icon: Code,
    fileTypes: ['.json'],
  },
  {
    value: 'quickbooks',
    label: 'QuickBooks Export',
    description: 'Data exported from QuickBooks accounting software',
    icon: Database,
    fileTypes: ['.xlsx', '.csv'],
  },
  {
    value: 'square',
    label: 'Square POS Export',
    description: 'Items and customers from Square Point of Sale',
    icon: Database,
    fileTypes: ['.csv', '.json'],
  },
];

const ENTITY_TYPES: Array<{
  value: MigrationEntityType;
  label: string;
  description: string;
}> = [
  { value: 'products', label: 'Products', description: 'Bakery items, cakes, breads, pastries' },
  { value: 'customers', label: 'Customers', description: 'Customer contacts and loyalty data' },
  { value: 'orders', label: 'Orders', description: 'Past orders and transactions' },
  { value: 'suppliers', label: 'Suppliers', description: 'Vendor and supplier information' },
  { value: 'ingredients', label: 'Ingredients', description: 'Raw materials and inventory' },
  { value: 'staff', label: 'Staff', description: 'Employee information' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function MigrationWizard({ tenantId, onComplete, onCancel }: MigrationWizardProps) {
  const [state, setState] = useState<MigrationState>(initialState);

  // Update field mapping
  const updateFieldMapping = useCallback((index: number, targetField: string) => {
    setState(prev => {
      const newMappings = [...prev.fieldMappings];
      if (newMappings[index]) {
        newMappings[index] = {
          ...newMappings[index],
          targetField,
        };
      }
      return { ...prev, fieldMappings: newMappings };
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null,
      fileName: file.name,
      fileSize: file.size,
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', state.entityType || 'products');
      if (state.sourceSystem) {
        formData.append('sourceSystem', state.sourceSystem);
      }

      const response = await fetch('/api/admin/migration', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      // Create initial field mappings from suggestions
      const initialMappings: FieldMapping[] = data.mappingSuggestions.map((s: MappingSuggestion) => ({
        sourceField: s.sourceField,
        targetField: s.suggestedTarget || '',
        required: false,
      }));

      setState(prev => ({
        ...prev,
        isProcessing: false,
        sessionId: data.sessionId,
        previewData: data.preview,
        mappingSuggestions: data.mappingSuggestions,
        fieldMappings: initialMappings,
        detectedSource: data.detectedSource,
        detectedEntityType: data.detectedEntityType,
        entityTypeConfidence: data.entityTypeConfidence,
        parseErrors: data.parseErrors || [],
        parseWarnings: data.parseWarnings || [],
        step: 'mapping',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      }));
    }
  }, [state.entityType, state.sourceSystem]);

  // Save field mappings
  const saveMappings = useCallback(async () => {
    if (!state.sessionId) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const response = await fetch('/api/admin/migration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          action: 'mapFields',
          mappings: state.fieldMappings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save mappings');
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        step: 'preview',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to save mappings',
      }));
    }
  }, [state.sessionId, state.fieldMappings]);

  // Execute migration
  const executeMigration = useCallback(async (dryRun: boolean = false) => {
    if (!state.sessionId) return;

    setState(prev => ({ ...prev, isProcessing: true, step: 'execute' }));

    try {
      const response = await fetch('/api/admin/migration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          action: 'execute',
          dryRun,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute migration');
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        step: 'results',
        executionResult: {
          success: data.success,
          totalRecords: data.result?.totalRecords || 0,
          successfulRecords: data.result?.successfulRecords || 0,
          failedRecords: data.result?.failedRecords || 0,
          message: data.message,
        },
      }));

      if (onComplete && data.result) {
        onComplete(state.sessionId);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to execute migration',
      }));
    }
  }, [state.sessionId, onComplete]);

  // Rollback migration
  const rollbackMigration = useCallback(async () => {
    if (!state.sessionId) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const response = await fetch('/api/admin/migration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          action: 'rollback',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rollback migration');
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        executionResult: {
          success: true,
          totalRecords: 0,
          successfulRecords: 0,
          failedRecords: 0,
          message: `Rollback complete: ${data.result?.deletedRecords || 0} records deleted, ${data.result?.restoredRecords || 0} records restored`,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to rollback migration',
      }));
    }
  }, [state.sessionId]);

  // Navigate between steps
  const goToStep = useCallback((step: WizardStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const goBack = useCallback(() => {
    const stepOrder: WizardStep[] = ['source', 'upload', 'mapping', 'preview', 'execute', 'results'];
    const currentIndex = stepOrder.indexOf(state.step);
    if (currentIndex > 0) {
      goToStep(stepOrder[currentIndex - 1]);
    }
  }, [state.step, goToStep]);

  // Get required fields for current entity type
  const getRequiredFields = useCallback((): string[] => {
    const requiredFieldsMap: Record<MigrationEntityType, string[]> = {
      products: ['sku', 'name', 'basePrice'],
      customers: ['name', 'phone'],
      suppliers: ['name'],
      orders: ['orderNumber', 'customerName', 'total'],
      ingredients: ['name', 'unit'],
      staff: ['firstName', 'lastName'],
    };
    return requiredFieldsMap[state.entityType || 'products'] || [];
  }, [state.entityType]);

  // Check if all required fields are mapped
  const areRequiredFieldsMapped = useCallback((): boolean => {
    const required = getRequiredFields();
    const mapped = state.fieldMappings.filter(m => m.targetField).map(m => m.targetField);
    return required.every(field => mapped.includes(field));
  }, [getRequiredFields, state.fieldMappings]);

  // ============================================
  // RENDER STEP CONTENT
  // ============================================

  const renderStepContent = () => {
    switch (state.step) {
      case 'source':
        return renderSourceSelection();
      case 'upload':
        return renderFileUpload();
      case 'mapping':
        return renderFieldMapping();
      case 'preview':
        return renderPreview();
      case 'execute':
        return renderExecution();
      case 'results':
        return renderResults();
      default:
        return null;
    }
  };

  // Step 1: Source Selection
  const renderSourceSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Data Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOURCE_SYSTEMS.map(system => {
            const Icon = system.icon;
            const isSelected = state.sourceSystem === system.value;
            return (
              <Card
                key={system.value}
                className={`cursor-pointer transition-all hover:border-orange-400 ${
                  isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' : ''
                }`}
                onClick={() => setState(prev => ({ ...prev, sourceSystem: system.value }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-100 dark:bg-orange-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{system.label}</h4>
                      <p className="text-sm text-gray-500 mt-1">{system.description}</p>
                      <div className="flex gap-1 mt-2">
                        {system.fileTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">What are you importing?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ENTITY_TYPES.map(type => {
            const isSelected = state.entityType === type.value;
            return (
              <Button
                key={type.value}
                variant={isSelected ? 'default' : 'outline'}
                className={`h-auto py-4 flex flex-col items-start ${
                  isSelected ? 'bg-orange-500 hover:bg-orange-600' : ''
                }`}
                onClick={() => setState(prev => ({ ...prev, entityType: type.value }))}
              >
                <span className="font-medium">{type.label}</span>
                <span className="text-xs opacity-80 mt-1">{type.description}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {state.detectedEntityType && state.entityTypeConfidence > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Auto-detected Entity Type</AlertTitle>
          <AlertDescription>
            Based on your previous upload, we detected this might be{' '}
            <strong>{ENTITY_TYPES.find(e => e.value === state.detectedEntityType)?.label}</strong> data
            ({Math.round(state.entityTypeConfidence * 100)}% confidence)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Step 2: File Upload
  const renderFileUpload = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Your File</h3>
        <p className="text-gray-500">
          Upload your {SOURCE_SYSTEMS.find(s => s.value === state.sourceSystem)?.label || 'data file'}
        </p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-input')?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFileUpload(file);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={SOURCE_SYSTEMS.find(s => s.value === state.sourceSystem)?.fileTypes.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        {state.isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-lg font-medium">Processing file...</p>
            <p className="text-sm text-gray-500">This may take a moment for large files</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FileUp className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: {SOURCE_SYSTEMS.find(s => s.value === state.sourceSystem)?.fileTypes.join(', ')}
            </p>
          </div>
        )}
      </div>

      {state.parseErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Parse Errors Detected</AlertTitle>
          <AlertDescription>
            <ScrollArea className="h-32 mt-2">
              {state.parseErrors.slice(0, 10).map((error, i) => (
                <p key={i} className="text-sm">Row {error.row}: {error.message}</p>
              ))}
              {state.parseErrors.length > 10 && (
                <p className="text-sm text-gray-400">...and {state.parseErrors.length - 10} more errors</p>
              )}
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Step 3: Field Mapping
  const renderFieldMapping = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Map Your Fields</h3>
        <p className="text-gray-500">
          Match columns from your file to NexusOS Bakery fields
        </p>
      </div>

      {state.previewData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">File Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">File:</span>
              <p className="font-medium truncate">{state.fileName}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Rows:</span>
              <p className="font-medium">{state.previewData.totalRows}</p>
            </div>
            <div>
              <span className="text-gray-500">Columns:</span>
              <p className="font-medium">{state.previewData.columns.length}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Columns className="w-5 h-5" />
            Field Mappings
          </CardTitle>
          <CardDescription>
            Required fields: {getRequiredFields().join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Column</TableHead>
                  <TableHead>NexusOS Field</TableHead>
                  <TableHead>Sample Values</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.fieldMappings.map((mapping, index) => {
                  const suggestion = state.mappingSuggestions[index];
                  const sampleValues = state.previewData?.rows
                    .slice(0, 3)
                    .map(row => row[mapping.sourceField])
                    .filter(v => v !== null && v !== undefined)
                    .join(', ') || '';
                  
                  const requiredFields = getRequiredFields();
                  
                  return (
                    <TableRow key={mapping.sourceField}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mapping.sourceField}</span>
                          {suggestion?.confidence && suggestion.confidence > 0.7 && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(suggestion.confidence * 100)}% match
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={mapping.targetField}
                          onValueChange={(value) => updateFieldMapping(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Skip this field --</SelectItem>
                            {requiredFields.map(field => (
                              <SelectItem key={field} value={field}>
                                {field} *
                              </SelectItem>
                            ))}
                            {state.entityType && BAKERY_OPTIONAL_FIELDS[state.entityType]?.map(field => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-500 text-sm">
                        {sampleValues || <span className="text-gray-400">No data</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {!areRequiredFieldsMapped() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Required Fields Missing</AlertTitle>
          <AlertDescription>
            Please map all required fields: {getRequiredFields().join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Step 4: Preview
  const renderPreview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preview Data</h3>
        <p className="text-gray-500">
          Review your data before importing
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{state.previewData?.totalRows || 0}</div>
            <p className="text-sm text-gray-500">Total Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {state.fieldMappings.filter(m => m.targetField).length}
            </div>
            <p className="text-sm text-gray-500">Fields Mapped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {getRequiredFields().filter(f => state.fieldMappings.some(m => m.targetField === f)).length}
              /{getRequiredFields().length}
            </div>
            <p className="text-sm text-gray-500">Required Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {state.parseWarnings.length}
            </div>
            <p className="text-sm text-gray-500">Warnings</p>
          </CardContent>
        </Card>
      </div>

      {state.previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Preview (First 10 Rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    {state.previewData.columns.slice(0, 6).map(col => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                    {state.previewData.columns.length > 6 && (
                      <TableHead>+{state.previewData.columns.length - 6} more</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.previewData.rows.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-gray-400">{i + 1}</TableCell>
                      {state.previewData!.columns.slice(0, 6).map(col => (
                        <TableCell key={col} className="max-w-32 truncate">
                          {String(row[col] ?? '')}
                        </TableCell>
                      ))}
                      {state.previewData.columns.length > 6 && (
                        <TableCell className="text-gray-400">...</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {state.parseWarnings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Data Warnings</AlertTitle>
          <AlertDescription>
            <ScrollArea className="h-24 mt-2">
              {state.parseWarnings.slice(0, 5).map((warning, i) => (
                <p key={i} className="text-sm">Row {warning.row}: {warning.message}</p>
              ))}
              {state.parseWarnings.length > 5 && (
                <p className="text-sm text-gray-400">...and {state.parseWarnings.length - 5} more warnings</p>
              )}
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Step 5: Execute
  const renderExecution = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Importing Data</h3>
        <p className="text-gray-500">
          Please wait while your data is being imported...
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 py-12">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
        <Progress value={50} className="w-64" />
        <p className="text-sm text-gray-500">
          Processing {state.previewData?.totalRows || 0} records...
        </p>
      </div>
    </div>
  );

  // Step 6: Results
  const renderResults = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Migration Complete</h3>
        <p className="text-gray-500">
          {state.executionResult?.message || 'Your data has been imported'}
        </p>
      </div>

      {state.executionResult && (
        <div className="grid grid-cols-3 gap-4">
          <Card className={state.executionResult.success ? 'border-green-500' : 'border-red-500'}>
            <CardContent className="pt-6 text-center">
              {state.executionResult.success ? (
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              ) : (
                <XCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
              )}
              <div className="text-2xl font-bold">{state.executionResult.successfulRecords}</div>
              <p className="text-sm text-gray-500">Records Imported</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{state.executionResult.totalRecords}</div>
              <p className="text-sm text-gray-500">Total Processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
              <div className="text-2xl font-bold">{state.executionResult.failedRecords}</div>
              <p className="text-sm text-gray-500">Failed</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={rollbackMigration} disabled={state.isProcessing}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Rollback Import
        </Button>
        <Button variant="outline" onClick={() => setState(initialState)}>
          Start New Import
        </Button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  const stepIndex = ['source', 'upload', 'mapping', 'preview', 'execute', 'results'].indexOf(state.step);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6 text-orange-500" />
          Data Migration Wizard
        </CardTitle>
        <CardDescription>
          Import your existing data into NexusOS Bakery
        </CardDescription>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-6">
          {['Source', 'Upload', 'Mapping', 'Preview', 'Execute', 'Results'].map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < stepIndex
                    ? 'bg-green-500 text-white'
                    : i === stepIndex
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500">{label}</span>
            </div>
          ))}
        </div>
        <Progress value={(stepIndex / 5) * 100} className="mt-2" />
      </CardHeader>

      <CardContent>
        {state.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}
      </CardContent>

      {/* Navigation Buttons */}
      <div className="flex justify-between px-6 pb-6">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={state.step === 'source' || state.isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          {state.step === 'source' && (
            <Button
              onClick={() => goToStep('upload')}
              disabled={!state.sourceSystem || !state.entityType}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {state.step === 'mapping' && (
            <Button
              onClick={saveMappings}
              disabled={!areRequiredFieldsMapped() || state.isProcessing}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {state.isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}

          {state.step === 'preview' && (
            <Button
              onClick={() => executeMigration(false)}
              disabled={state.isProcessing}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Import
            </Button>
          )}

          {state.step === 'results' && state.executionResult?.success && (
            <Button onClick={onCancel || (() => setState(initialState))}>
              Done
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================
// OPTIONAL FIELDS BY ENTITY TYPE
// ============================================

const BAKERY_OPTIONAL_FIELDS: Record<MigrationEntityType, string[]> = {
  products: [
    'description', 'category', 'subcategory', 'costPrice',
    'stockQuantity', 'minStock', 'unit', 'isActive',
    'imageUrl', 'allergens', 'productionTime', 'shelfLife'
  ],
  customers: [
    'email', 'address', 'city', 'birthday',
    'loyaltyPoints', 'loyaltyTier', 'totalPurchases',
    'ordersCount', 'preferences'
  ],
  suppliers: [
    'contactName', 'email', 'phone', 'address',
    'taxId', 'paymentTerms', 'notes', 'isActive'
  ],
  orders: [
    'orderType', 'customerPhone', 'customerEmail',
    'deliveryType', 'deliveryAddress', 'deliveryDate',
    'deliveryTime', 'items', 'subtotal', 'discount',
    'deliveryFee', 'tax', 'paymentStatus', 'paymentMethod',
    'status', 'notes', 'createdAt'
  ],
  ingredients: [
    'sku', 'category', 'currentStock', 'minStock',
    'unitCost', 'supplierName'
  ],
  staff: [
    'fullName', 'email', 'phone', 'role', 'position',
    'workingHours', 'workingDays', 'hourlyRate', 'salary',
    'isActive', 'hireDate'
  ],
};

export default MigrationWizard;
