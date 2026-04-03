/**
 * NexusOS Legacy Data Migration - Bakery Field Mapper
 * 
 * Maps fields from various source systems to NexusOS Bakery entities:
 * - Products: name, sku, price, category, stock
 * - Customers: name, phone, email, address
 * - Suppliers: name, contact, phone
 * - Orders: customer, items, total, date
 */

import type {
  FieldMapping,
  MappingSuggestion,
  MappingTemplate,
  MigrationEntityType,
  SourceSystem,
  ProductMigrationData,
  CustomerMigrationData,
  SupplierMigrationData,
  OrderMigrationData,
  OrderItemMigrationData,
  IngredientMigrationData,
  StaffMigrationData,
  ValidationError,
} from '../types';

// ============================================
// FIELD DEFINITIONS FOR NEXUSOS BAKERY
// ============================================

export const BAKERY_FIELD_DEFINITIONS = {
  products: {
    required: ['sku', 'name', 'basePrice'],
    optional: [
      'description', 'category', 'subcategory', 'costPrice',
      'stockQuantity', 'minStock', 'unit', 'isActive',
      'imageUrl', 'allergens', 'productionTime', 'shelfLife'
    ],
    fieldTypes: {
      sku: 'string',
      name: 'string',
      description: 'string',
      category: 'string',
      subcategory: 'string',
      basePrice: 'number',
      costPrice: 'number',
      stockQuantity: 'number',
      minStock: 'number',
      unit: 'string',
      isActive: 'boolean',
      imageUrl: 'string',
      allergens: 'string',
      productionTime: 'number',
      shelfLife: 'number',
    },
    defaultValues: {
      category: 'BREAD',
      unit: 'unidad',
      isActive: true,
      stockQuantity: 0,
      minStock: 0,
      costPrice: 0,
    },
  },
  customers: {
    required: ['name', 'phone'],
    optional: [
      'email', 'address', 'city', 'birthday',
      'loyaltyPoints', 'loyaltyTier', 'totalPurchases',
      'ordersCount', 'preferences'
    ],
    fieldTypes: {
      name: 'string',
      email: 'string',
      phone: 'string',
      address: 'string',
      city: 'string',
      birthday: 'string',
      loyaltyPoints: 'number',
      loyaltyTier: 'string',
      totalPurchases: 'number',
      ordersCount: 'number',
      preferences: 'string',
    },
    defaultValues: {
      loyaltyPoints: 0,
      loyaltyTier: 'bronze',
      totalPurchases: 0,
      ordersCount: 0,
    },
  },
  suppliers: {
    required: ['name'],
    optional: [
      'contactName', 'email', 'phone', 'address',
      'taxId', 'paymentTerms', 'notes', 'isActive'
    ],
    fieldTypes: {
      name: 'string',
      contactName: 'string',
      email: 'string',
      phone: 'string',
      address: 'string',
      taxId: 'string',
      paymentTerms: 'string',
      notes: 'string',
      isActive: 'boolean',
    },
    defaultValues: {
      isActive: true,
    },
  },
  orders: {
    required: ['orderNumber', 'customerName', 'total'],
    optional: [
      'orderType', 'customerPhone', 'customerEmail',
      'deliveryType', 'deliveryAddress', 'deliveryDate',
      'deliveryTime', 'items', 'subtotal', 'discount',
      'deliveryFee', 'tax', 'paymentStatus', 'paymentMethod',
      'status', 'notes', 'createdAt'
    ],
    fieldTypes: {
      orderNumber: 'string',
      orderType: 'string',
      customerName: 'string',
      customerPhone: 'string',
      customerEmail: 'string',
      deliveryType: 'string',
      deliveryAddress: 'string',
      deliveryDate: 'string',
      deliveryTime: 'string',
      items: 'array',
      subtotal: 'number',
      discount: 'number',
      deliveryFee: 'number',
      tax: 'number',
      total: 'number',
      paymentStatus: 'string',
      paymentMethod: 'string',
      status: 'string',
      notes: 'string',
      createdAt: 'string',
    },
    defaultValues: {
      orderType: 'POS',
      deliveryType: 'PICKUP',
      paymentStatus: 'PENDING',
      status: 'RECEIVED',
      subtotal: 0,
      discount: 0,
      deliveryFee: 0,
      tax: 0,
    },
  },
  ingredients: {
    required: ['name', 'unit'],
    optional: [
      'sku', 'category', 'currentStock', 'minStock',
      'unitCost', 'supplierName'
    ],
    fieldTypes: {
      sku: 'string',
      name: 'string',
      category: 'string',
      currentStock: 'number',
      minStock: 'number',
      unit: 'string',
      unitCost: 'number',
      supplierName: 'string',
    },
    defaultValues: {
      currentStock: 0,
      minStock: 0,
      unitCost: 0,
    },
  },
  staff: {
    required: ['firstName', 'lastName'],
    optional: [
      'fullName', 'email', 'phone', 'role', 'position',
      'workingHours', 'workingDays', 'hourlyRate', 'salary',
      'isActive', 'hireDate'
    ],
    fieldTypes: {
      firstName: 'string',
      lastName: 'string',
      fullName: 'string',
      email: 'string',
      phone: 'string',
      role: 'string',
      position: 'string',
      workingHours: 'string',
      workingDays: 'string',
      hourlyRate: 'number',
      salary: 'number',
      isActive: 'boolean',
      hireDate: 'string',
    },
    defaultValues: {
      role: 'BAKER',
      isActive: true,
    },
  },
} as const;

// ============================================
// SOURCE SYSTEM FIELD MAPPINGS
// ============================================

const SOURCE_FIELD_MAPPINGS: Record<SourceSystem, Record<MigrationEntityType, Record<string, string>>> = {
  excel: {
    products: {
      'product name': 'name',
      'productname': 'name',
      'item name': 'name',
      'itemname': 'name',
      'name': 'name',
      'description': 'description',
      'sku': 'sku',
      'item code': 'sku',
      'itemcode': 'sku',
      'code': 'sku',
      'product code': 'sku',
      'barcode': 'sku',
      'price': 'basePrice',
      'unit price': 'basePrice',
      'unitprice': 'basePrice',
      'selling price': 'basePrice',
      'sellingprice': 'basePrice',
      'retail price': 'basePrice',
      'cost': 'costPrice',
      'cost price': 'costPrice',
      'costprice': 'costPrice',
      'category': 'category',
      'product category': 'category',
      'subcategory': 'subcategory',
      'stock': 'stockQuantity',
      'quantity': 'stockQuantity',
      'stock quantity': 'stockQuantity',
      'stockquantity': 'stockQuantity',
      'qty': 'stockQuantity',
      'qty on hand': 'stockQuantity',
      'minimum stock': 'minStock',
      'minstock': 'minStock',
      'reorder level': 'minStock',
      'unit': 'unit',
      'uom': 'unit',
      'active': 'isActive',
      'is active': 'isActive',
      'status': 'isActive',
      'image': 'imageUrl',
      'image url': 'imageUrl',
      'imageurl': 'imageUrl',
      'photo': 'imageUrl',
      'allergens': 'allergens',
      'allergies': 'allergens',
      'production time': 'productionTime',
      'productiontime': 'productionTime',
      'shelf life': 'shelfLife',
      'shelflife': 'shelfLife',
      'expiry days': 'shelfLife',
    },
    customers: {
      'customer name': 'name',
      'customername': 'name',
      'name': 'name',
      'full name': 'name',
      'fullname': 'name',
      'contact name': 'name',
      'email': 'email',
      'email address': 'email',
      'emailaddress': 'email',
      'phone': 'phone',
      'phone number': 'phone',
      'phonenumber': 'phone',
      'mobile': 'phone',
      'cell': 'phone',
      'address': 'address',
      'street': 'address',
      'address line 1': 'address',
      'city': 'city',
      'town': 'city',
      'birthday': 'birthday',
      'date of birth': 'birthday',
      'dob': 'birthday',
      'birth date': 'birthday',
      'loyalty points': 'loyaltyPoints',
      'loyaltypoints': 'loyaltyPoints',
      'points': 'loyaltyPoints',
      'loyalty tier': 'loyaltyTier',
      'loyaltytier': 'loyaltyTier',
      'tier': 'loyaltyTier',
      'total purchases': 'totalPurchases',
      'totalpurchases': 'totalPurchases',
      'total spent': 'totalPurchases',
      'totalspent': 'totalPurchases',
      'orders count': 'ordersCount',
      'orderscount': 'ordersCount',
      'total orders': 'ordersCount',
      'preferences': 'preferences',
      'notes': 'preferences',
    },
    suppliers: {
      'supplier name': 'name',
      'suppliername': 'name',
      'vendor name': 'name',
      'vendorname': 'name',
      'name': 'name',
      'company': 'name',
      'contact': 'contactName',
      'contact name': 'contactName',
      'contactname': 'contactName',
      'contact person': 'contactName',
      'contactperson': 'contactName',
      'email': 'email',
      'phone': 'phone',
      'telephone': 'phone',
      'address': 'address',
      'tax id': 'taxId',
      'taxid': 'taxId',
      'vat number': 'taxId',
      'payment terms': 'paymentTerms',
      'paymentterms': 'paymentTerms',
      'terms': 'paymentTerms',
      'notes': 'notes',
      'comments': 'notes',
      'active': 'isActive',
      'is active': 'isActive',
      'status': 'isActive',
    },
    orders: {
      'order number': 'orderNumber',
      'ordernumber': 'orderNumber',
      'order id': 'orderNumber',
      'orderid': 'orderNumber',
      'order no': 'orderNumber',
      'orderno': 'orderNumber',
      'invoice number': 'orderNumber',
      'invoicenumber': 'orderNumber',
      'receipt number': 'orderNumber',
      'customer': 'customerName',
      'customer name': 'customerName',
      'customername': 'customerName',
      'client': 'customerName',
      'client name': 'customerName',
      'phone': 'customerPhone',
      'customer phone': 'customerPhone',
      'customerphone': 'customerPhone',
      'email': 'customerEmail',
      'customer email': 'customerEmail',
      'customeremail': 'customerEmail',
      'delivery type': 'deliveryType',
      'deliverytype': 'deliveryType',
      'type': 'deliveryType',
      'delivery address': 'deliveryAddress',
      'deliveryaddress': 'deliveryAddress',
      'shipping address': 'deliveryAddress',
      'delivery date': 'deliveryDate',
      'deliverydate': 'deliveryDate',
      'date': 'deliveryDate',
      'delivery time': 'deliveryTime',
      'deliverytime': 'deliveryTime',
      'time': 'deliveryTime',
      'subtotal': 'subtotal',
      'sub total': 'subtotal',
      'sub-total': 'subtotal',
      'discount': 'discount',
      'discount amount': 'discount',
      'delivery fee': 'deliveryFee',
      'deliveryfee': 'deliveryFee',
      'shipping': 'deliveryFee',
      'tax': 'tax',
      'vat': 'tax',
      'total': 'total',
      'total amount': 'total',
      'totalamount': 'total',
      'grand total': 'total',
      'payment status': 'paymentStatus',
      'paymentstatus': 'paymentStatus',
      'paid': 'paymentStatus',
      'payment method': 'paymentMethod',
      'paymentmethod': 'paymentMethod',
      'status': 'status',
      'order status': 'status',
      'notes': 'notes',
      'comments': 'notes',
      'date created': 'createdAt',
      'datecreated': 'createdAt',
      'created at': 'createdAt',
      'createdat': 'createdAt',
    },
    ingredients: {
      'ingredient': 'name',
      'ingredient name': 'name',
      'ingredientname': 'name',
      'name': 'name',
      'item': 'name',
      'sku': 'sku',
      'code': 'sku',
      'category': 'category',
      'type': 'category',
      'stock': 'currentStock',
      'current stock': 'currentStock',
      'currentstock': 'currentStock',
      'quantity': 'currentStock',
      'qty': 'currentStock',
      'min stock': 'minStock',
      'minstock': 'minStock',
      'minimum': 'minStock',
      'reorder level': 'minStock',
      'unit': 'unit',
      'uom': 'unit',
      'measure': 'unit',
      'cost': 'unitCost',
      'unit cost': 'unitCost',
      'unitcost': 'unitCost',
      'price': 'unitCost',
      'supplier': 'supplierName',
      'supplier name': 'supplierName',
      'suppliername': 'supplierName',
      'vendor': 'supplierName',
    },
    staff: {
      'first name': 'firstName',
      'firstname': 'firstName',
      'name': 'firstName',
      'last name': 'lastName',
      'lastname': 'lastName',
      'surname': 'lastName',
      'full name': 'fullName',
      'fullname': 'fullName',
      'employee name': 'fullName',
      'employeename': 'fullName',
      'email': 'email',
      'phone': 'phone',
      'mobile': 'phone',
      'role': 'role',
      'position': 'position',
      'title': 'position',
      'job title': 'position',
      'jobtitle': 'position',
      'hours': 'workingHours',
      'working hours': 'workingHours',
      'workinghours': 'workingHours',
      'days': 'workingDays',
      'working days': 'workingDays',
      'workingdays': 'workingDays',
      'rate': 'hourlyRate',
      'hourly rate': 'hourlyRate',
      'hourlyrate': 'hourlyRate',
      'wage': 'hourlyRate',
      'salary': 'salary',
      'pay': 'salary',
      'active': 'isActive',
      'is active': 'isActive',
      'status': 'isActive',
      'hire date': 'hireDate',
      'hiredate': 'hireDate',
      'start date': 'hireDate',
      'startdate': 'hireDate',
    },
  },
  csv: {
    products: {
      'product_name': 'name',
      'productname': 'name',
      'item_name': 'name',
      'itemname': 'name',
      'name': 'name',
      'item_code': 'sku',
      'itemcode': 'sku',
      'product_code': 'sku',
      'productcode': 'sku',
      'sku': 'sku',
      'unit_price': 'basePrice',
      'unitprice': 'basePrice',
      'selling_price': 'basePrice',
      'sellingprice': 'basePrice',
      'price': 'basePrice',
      'cost_price': 'costPrice',
      'costprice': 'costPrice',
      'cost': 'costPrice',
      'stock_quantity': 'stockQuantity',
      'stockquantity': 'stockQuantity',
      'stock': 'stockQuantity',
      'qty': 'stockQuantity',
      'quantity': 'stockQuantity',
      'min_stock': 'minStock',
      'minstock': 'minStock',
      'reorder_level': 'minStock',
      'reorderlevel': 'minStock',
    },
    customers: {
      'customer_name': 'name',
      'customername': 'name',
      'name': 'name',
      'full_name': 'name',
      'fullname': 'name',
      'email_address': 'email',
      'emailaddress': 'email',
      'email': 'email',
      'phone_number': 'phone',
      'phonenumber': 'phone',
      'phone': 'phone',
      'mobile': 'phone',
      'date_of_birth': 'birthday',
      'dateofbirth': 'birthday',
      'dob': 'birthday',
      'birthday': 'birthday',
      'loyalty_points': 'loyaltyPoints',
      'loyaltypoints': 'loyaltyPoints',
      'points': 'loyaltyPoints',
      'total_purchases': 'totalPurchases',
      'totalpurchases': 'totalPurchases',
    },
    suppliers: {
      'supplier_name': 'name',
      'suppliername': 'name',
      'vendor_name': 'name',
      'vendorname': 'name',
      'name': 'name',
      'contact_name': 'contactName',
      'contactname': 'contactName',
      'contact_person': 'contactName',
      'contactperson': 'contactName',
      'tax_id': 'taxId',
      'taxid': 'taxId',
      'payment_terms': 'paymentTerms',
      'paymentterms': 'paymentTerms',
    },
    orders: {
      'order_number': 'orderNumber',
      'ordernumber': 'orderNumber',
      'order_id': 'orderNumber',
      'orderid': 'orderNumber',
      'customer_name': 'customerName',
      'customername': 'customerName',
      'customer_phone': 'customerPhone',
      'customerphone': 'customerPhone',
      'customer_email': 'customerEmail',
      'customeremail': 'customerEmail',
      'delivery_type': 'deliveryType',
      'deliverytype': 'deliveryType',
      'delivery_date': 'deliveryDate',
      'deliverydate': 'deliveryDate',
      'delivery_address': 'deliveryAddress',
      'deliveryaddress': 'deliveryAddress',
      'delivery_fee': 'deliveryFee',
      'deliveryfee': 'deliveryFee',
      'payment_status': 'paymentStatus',
      'paymentstatus': 'paymentStatus',
      'payment_method': 'paymentMethod',
      'paymentmethod': 'paymentMethod',
      'total_amount': 'total',
      'totalamount': 'total',
      'grand_total': 'total',
      'grandtotal': 'total',
    },
    ingredients: {
      'ingredient_name': 'name',
      'ingredientname': 'name',
      'name': 'name',
      'current_stock': 'currentStock',
      'currentstock': 'currentStock',
      'min_stock': 'minStock',
      'minstock': 'minStock',
      'unit_cost': 'unitCost',
      'unitcost': 'unitCost',
      'supplier_name': 'supplierName',
      'suppliername': 'supplierName',
    },
    staff: {
      'first_name': 'firstName',
      'firstname': 'firstName',
      'last_name': 'lastName',
      'lastname': 'lastName',
      'full_name': 'fullName',
      'fullname': 'fullName',
      'hourly_rate': 'hourlyRate',
      'hourlyrate': 'hourlyRate',
      'working_hours': 'workingHours',
      'workinghours': 'workingHours',
      'hire_date': 'hireDate',
      'hiredate': 'hireDate',
    },
  },
  json: {
    products: {
      'name': 'name',
      'sku': 'sku',
      'price': 'basePrice',
      'cost': 'costPrice',
      'stock': 'stockQuantity',
      'category': 'category',
    },
    customers: {
      'name': 'name',
      'email': 'email',
      'phone': 'phone',
      'address': 'address',
    },
    suppliers: {
      'name': 'name',
      'contact': 'contactName',
      'phone': 'phone',
    },
    orders: {
      'orderNumber': 'orderNumber',
      'customer': 'customerName',
      'total': 'total',
    },
    ingredients: {
      'name': 'name',
      'unit': 'unit',
      'cost': 'unitCost',
    },
    staff: {
      'firstName': 'firstName',
      'lastName': 'lastName',
      'email': 'email',
    },
  },
  quickbooks: {
    products: {
      'Name': 'name',
      'Description': 'description',
      'SKU': 'sku',
      'UnitPrice': 'basePrice',
      'PurchaseCost': 'costPrice',
      'QtyOnHand': 'stockQuantity',
      'TrackQtyOnHand': 'trackInventory',
      'Type': 'category',
      'IncomeAccountRef.name': 'incomeAccount',
      'ExpenseAccountRef.name': 'expenseAccount',
    },
    customers: {
      'DisplayName': 'name',
      'CompanyName': 'companyName',
      'GivenName': 'firstName',
      'FamilyName': 'lastName',
      'PrimaryEmailAddr.Address': 'email',
      'PrimaryPhone.FreeFormNumber': 'phone',
      'BillAddr.Line1': 'address',
      'BillAddr.City': 'city',
      'Notes': 'notes',
    },
    suppliers: {
      'DisplayName': 'name',
      'CompanyName': 'name',
      'ContactName': 'contactName',
      'PrimaryEmailAddr.Address': 'email',
      'PrimaryPhone.FreeFormNumber': 'phone',
      'BillAddr.Line1': 'address',
    },
    orders: {
      'DocNumber': 'orderNumber',
      'CustomerRef.name': 'customerName',
      'TotalAmt': 'total',
      'TxnDate': 'createdAt',
      'Balance': 'balanceDue',
    },
    ingredients: {
      'Name': 'name',
      'PurchaseCost': 'unitCost',
      'QtyOnHand': 'currentStock',
    },
    staff: {
      'DisplayName': 'fullName',
      'GivenName': 'firstName',
      'FamilyName': 'lastName',
      'PrimaryEmailAddr.Address': 'email',
    },
  },
  square: {
    products: {
      'item_data.name': 'name',
      'item_data.description': 'description',
      'item_data.category_id': 'category',
      'item_data.variations[0].item_variation_data.sku': 'sku',
      'item_data.variations[0].item_variation_data.price_money.amount': 'basePrice',
    },
    customers: {
      'given_name': 'firstName',
      'family_name': 'lastName',
      'email_address': 'email',
      'phone_number': 'phone',
      'address.address_line_1': 'address',
      'address.locality': 'city',
    },
    suppliers: {},
    orders: {
      'id': 'orderNumber',
      'total_money.amount': 'total',
      'created_at': 'createdAt',
    },
    ingredients: {},
    staff: {},
  },
  other: {
    products: {},
    customers: {},
    suppliers: {},
    orders: {},
    ingredients: {},
    staff: {},
  },
};

// ============================================
// MAPPING SUGGESTION FUNCTION
// ============================================

/**
 * Generate mapping suggestions based on source columns
 */
export function generateMappingSuggestions(
  sourceColumns: string[],
  entityType: MigrationEntityType,
  sourceSystem: SourceSystem = 'excel'
): MappingSuggestion[] {
  const suggestions: MappingSuggestion[] = [];
  const fieldDefinitions = BAKERY_FIELD_DEFINITIONS[entityType];
  const sourceMappings = SOURCE_FIELD_MAPPINGS[sourceSystem]?.[entityType] || {};
  
  for (const sourceColumn of sourceColumns) {
    const normalizedSource = sourceColumn.toLowerCase().replace(/[_\s]/g, '');
    
    // Try exact match first
    if (sourceMappings[sourceColumn]) {
      suggestions.push({
        sourceField: sourceColumn,
        suggestedTarget: sourceMappings[sourceColumn],
        confidence: 1,
        reason: 'Exact match found in source system mappings',
      });
      continue;
    }
    
    // Try normalized match
    if (sourceMappings[normalizedSource]) {
      suggestions.push({
        sourceField: sourceColumn,
        suggestedTarget: sourceMappings[normalizedSource],
        confidence: 0.95,
        reason: 'Normalized match found in source system mappings',
      });
      continue;
    }
    
    // Try partial match
    let bestMatch: { target: string; confidence: number } | null = null;
    
    for (const [sourcePattern, targetField] of Object.entries(sourceMappings)) {
      const normalizedPattern = sourcePattern.toLowerCase().replace(/[_\s]/g, '');
      
      if (normalizedSource.includes(normalizedPattern) || normalizedPattern.includes(normalizedSource)) {
        const confidence = Math.min(normalizedSource.length, normalizedPattern.length) / 
          Math.max(normalizedSource.length, normalizedPattern.length);
        
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { target: targetField, confidence };
        }
      }
    }
    
    // Also check field definitions
    if (!bestMatch || bestMatch.confidence < 0.5) {
      for (const targetField of [...fieldDefinitions.required, ...fieldDefinitions.optional]) {
        const normalizedTarget = targetField.toLowerCase();
        
        if (normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource)) {
          const confidence = Math.min(normalizedSource.length, normalizedTarget.length) / 
            Math.max(normalizedSource.length, normalizedTarget.length) * 0.8;
          
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = { target: targetField, confidence };
          }
        }
      }
    }
    
    if (bestMatch && bestMatch.confidence > 0.3) {
      suggestions.push({
        sourceField: sourceColumn,
        suggestedTarget: bestMatch.target,
        confidence: bestMatch.confidence,
        reason: bestMatch.confidence > 0.7 
          ? 'Strong similarity detected' 
          : 'Possible match - please verify',
      });
    } else {
      suggestions.push({
        sourceField: sourceColumn,
        suggestedTarget: '',
        confidence: 0,
        reason: 'No matching field found',
      });
    }
  }
  
  return suggestions;
}

// ============================================
// FIELD MAPPING FUNCTIONS
// ============================================

/**
 * Create default field mappings for an entity type
 */
export function createDefaultMappings(
  entityType: MigrationEntityType,
  sourceColumns: string[],
  sourceSystem: SourceSystem = 'excel'
): FieldMapping[] {
  const suggestions = generateMappingSuggestions(sourceColumns, entityType, sourceSystem);
  const fieldDefinitions = BAKERY_FIELD_DEFINITIONS[entityType];
  
  return suggestions.map(suggestion => ({
    sourceField: suggestion.sourceField,
    targetField: suggestion.suggestedTarget,
    required: fieldDefinitions.required.includes(suggestion.suggestedTarget as keyof typeof fieldDefinitions.required),
    defaultValue: fieldDefinitions.defaultValues[suggestion.suggestedTarget as keyof typeof fieldDefinitions.defaultValues],
  }));
}

/**
 * Get mapping templates for a source system and entity type
 */
export function getMappingTemplate(
  sourceSystem: SourceSystem,
  entityType: MigrationEntityType
): MappingTemplate {
  const sourceMappings = SOURCE_FIELD_MAPPINGS[sourceSystem]?.[entityType] || {};
  const fieldDefinitions = BAKERY_FIELD_DEFINITIONS[entityType];
  
  const mappings: FieldMapping[] = Object.entries(sourceMappings).map(([sourceField, targetField]) => ({
    sourceField,
    targetField,
    required: fieldDefinitions.required.includes(targetField as never),
    defaultValue: fieldDefinitions.defaultValues[targetField as keyof typeof fieldDefinitions.defaultValues],
  }));
  
  return {
    name: `${sourceSystem} ${entityType} mapping`,
    sourceSystem,
    entityType,
    mappings,
  };
}

// ============================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Transform a value based on its target type
 */
export function transformValue(
  value: unknown,
  targetType: string,
  sourceSystem: SourceSystem = 'excel'
): unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  switch (targetType) {
    case 'string':
      return String(value).trim();
      
    case 'number':
      if (typeof value === 'number') {
        return value;
      }
      // Handle Square's money format (amount in cents)
      if (sourceSystem === 'square' && typeof value === 'number') {
        return value / 100;
      }
      const numValue = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
      return isNaN(numValue) ? 0 : numValue;
      
    case 'boolean':
      if (typeof value === 'boolean') {
        return value;
      }
      const strValue = String(value).toLowerCase().trim();
      return ['true', 'yes', 'y', '1', 'active', 'enabled'].includes(strValue);
      
    case 'date':
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      // Try to parse date string
      const date = new Date(String(value));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      return null;
      
    case 'array':
      if (Array.isArray(value)) {
        return value;
      }
      // Try to parse JSON array
      try {
        const parsed = JSON.parse(String(value));
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Not valid JSON
      }
      return [];
      
    default:
      return value;
  }
}

/**
 * Map source data to target entity format
 */
export function mapToProduct(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<ProductMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.products.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.products.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.products.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  // Handle category mapping
  if (result.category) {
    result.category = mapCategory(String(result.category));
  }
  
  return result as Partial<ProductMigrationData>;
}

export function mapToCustomer(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<CustomerMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.customers.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.customers.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.customers.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  // Normalize phone number (Trinidad & Tobago format)
  if (result.phone) {
    result.phone = normalizePhoneNumber(String(result.phone));
  }
  
  return result as Partial<CustomerMigrationData>;
}

export function mapToSupplier(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<SupplierMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.suppliers.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.suppliers.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.suppliers.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  return result as Partial<SupplierMigrationData>;
}

export function mapToOrder(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<OrderMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.orders.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.orders.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.orders.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  // Map status values
  if (result.status) {
    result.status = mapOrderStatus(String(result.status));
  }
  if (result.paymentStatus) {
    result.paymentStatus = mapPaymentStatus(String(result.paymentStatus));
  }
  if (result.deliveryType) {
    result.deliveryType = mapDeliveryType(String(result.deliveryType));
  }
  
  return result as Partial<OrderMigrationData>;
}

export function mapToIngredient(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<IngredientMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.ingredients.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.ingredients.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.ingredients.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  return result as Partial<IngredientMigrationData>;
}

export function mapToStaff(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  sourceSystem: SourceSystem = 'excel'
): Partial<StaffMigrationData> {
  const result: Record<string, unknown> = {};
  
  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    
    let value = sourceData[mapping.sourceField];
    
    if (value === null || value === undefined || value === '') {
      value = mapping.defaultValue ?? null;
    } else {
      value = transformValue(
        value,
        BAKERY_FIELD_DEFINITIONS.staff.fieldTypes[mapping.targetField as keyof typeof BAKERY_FIELD_DEFINITIONS.staff.fieldTypes] || 'string',
        sourceSystem
      );
    }
    
    if (value !== null) {
      result[mapping.targetField] = value;
    }
  }
  
  // Apply default values
  for (const [field, defaultValue] of Object.entries(BAKERY_FIELD_DEFINITIONS.staff.defaultValues)) {
    if (result[field] === undefined) {
      result[field] = defaultValue;
    }
  }
  
  // Generate fullName if not provided
  if (!result.fullName && (result.firstName || result.lastName)) {
    result.fullName = `${result.firstName || ''} ${result.lastName || ''}`.trim();
  }
  
  // Map role
  if (result.role) {
    result.role = mapStaffRole(String(result.role));
  }
  
  return result as Partial<StaffMigrationData>;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate mapped product data
 */
export function validateProduct(data: Partial<ProductMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.sku || String(data.sku).trim() === '') {
    errors.push({
      row,
      field: 'sku',
      value: data.sku,
      message: 'SKU is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (!data.name || String(data.name).trim() === '') {
    errors.push({
      row,
      field: 'name',
      value: data.name,
      message: 'Product name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (data.basePrice === undefined || data.basePrice === null) {
    errors.push({
      row,
      field: 'basePrice',
      value: data.basePrice,
      message: 'Price is required',
      code: 'REQUIRED_FIELD',
    });
  } else if (typeof data.basePrice !== 'number' || data.basePrice < 0) {
    errors.push({
      row,
      field: 'basePrice',
      value: data.basePrice,
      message: 'Price must be a non-negative number',
      code: 'INVALID_TYPE',
    });
  }
  
  return errors;
}

export function validateCustomer(data: Partial<CustomerMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.name || String(data.name).trim() === '') {
    errors.push({
      row,
      field: 'name',
      value: data.name,
      message: 'Customer name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (!data.phone || String(data.phone).trim() === '') {
    errors.push({
      row,
      field: 'phone',
      value: data.phone,
      message: 'Phone number is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (data.email && !isValidEmail(String(data.email))) {
    errors.push({
      row,
      field: 'email',
      value: data.email,
      message: 'Invalid email format',
      code: 'INVALID_FORMAT',
    });
  }
  
  return errors;
}

export function validateSupplier(data: Partial<SupplierMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.name || String(data.name).trim() === '') {
    errors.push({
      row,
      field: 'name',
      value: data.name,
      message: 'Supplier name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  return errors;
}

export function validateOrder(data: Partial<OrderMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.orderNumber || String(data.orderNumber).trim() === '') {
    errors.push({
      row,
      field: 'orderNumber',
      value: data.orderNumber,
      message: 'Order number is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (!data.customerName || String(data.customerName).trim() === '') {
    errors.push({
      row,
      field: 'customerName',
      value: data.customerName,
      message: 'Customer name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (data.total === undefined || data.total === null) {
    errors.push({
      row,
      field: 'total',
      value: data.total,
      message: 'Total is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  return errors;
}

export function validateIngredient(data: Partial<IngredientMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.name || String(data.name).trim() === '') {
    errors.push({
      row,
      field: 'name',
      value: data.name,
      message: 'Ingredient name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (!data.unit || String(data.unit).trim() === '') {
    errors.push({
      row,
      field: 'unit',
      value: data.unit,
      message: 'Unit is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  return errors;
}

export function validateStaff(data: Partial<StaffMigrationData>, row: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.firstName || String(data.firstName).trim() === '') {
    errors.push({
      row,
      field: 'firstName',
      value: data.firstName,
      message: 'First name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  if (!data.lastName || String(data.lastName).trim() === '') {
    errors.push({
      row,
      field: 'lastName',
      value: data.lastName,
      message: 'Last name is required',
      code: 'REQUIRED_FIELD',
    });
  }
  
  return errors;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'bread': 'BREAD',
    'pan': 'BREAD',
    'cake': 'CAKES',
    'pastel': 'CAKES',
    'pastry': 'PASTRIES',
    'pastelito': 'PASTRIES',
    'cookie': 'COOKIES',
    'galleta': 'COOKIES',
    'dessert': 'DESSERTS',
    'postre': 'DESSERTS',
    'drink': 'BEVERAGES',
    'bebida': 'BEVERAGES',
    'sandwich': 'SANDWICHES',
    'other': 'OTHER',
    'otro': 'OTHER',
  };
  
  const normalized = category.toLowerCase().trim();
  return categoryMap[normalized] || category.toUpperCase();
}

function mapOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'PENDING',
    'recibido': 'RECEIVED',
    'received': 'RECEIVED',
    'confirmed': 'CONFIRMED',
    'confirmado': 'CONFIRMED',
    'preparing': 'PREPARING',
    'preparando': 'PREPARING',
    'ready': 'READY',
    'listo': 'READY',
    'delivered': 'DELIVERED',
    'entregado': 'DELIVERED',
    'completed': 'COMPLETED',
    'completado': 'COMPLETED',
    'cancelled': 'CANCELLED',
    'cancelado': 'CANCELLED',
  };
  
  const normalized = status.toLowerCase().trim();
  return statusMap[normalized] || 'RECEIVED';
}

function mapPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'PENDING',
    'pendiente': 'PENDING',
    'paid': 'PAID',
    'pagado': 'PAID',
    'partial': 'PARTIAL',
    'parcial': 'PARTIAL',
    'refunded': 'REFUNDED',
    'reembolsado': 'REFUNDED',
    'failed': 'FAILED',
    'fallido': 'FAILED',
  };
  
  const normalized = status.toLowerCase().trim();
  return statusMap[normalized] || 'PENDING';
}

function mapDeliveryType(type: string): string {
  const typeMap: Record<string, string> = {
    'pickup': 'PICKUP',
    'recoger': 'PICKUP',
    'delivery': 'DELIVERY',
    'envio': 'DELIVERY',
    'envío': 'DELIVERY',
    'dine-in': 'DINE_IN',
    'local': 'DINE_IN',
  };
  
  const normalized = type.toLowerCase().trim();
  return typeMap[normalized] || 'PICKUP';
}

function mapStaffRole(role: string): string {
  const roleMap: Record<string, string> = {
    'baker': 'BAKER',
    'panadero': 'BAKER',
    'cashier': 'CASHIER',
    'cajero': 'CASHIER',
    'manager': 'MANAGER',
    'gerente': 'MANAGER',
    'delivery': 'DELIVERY',
    'repartidor': 'DELIVERY',
    'assistant': 'ASSISTANT',
    'asistente': 'ASSISTANT',
  };
  
  const normalized = role.toLowerCase().trim();
  return roleMap[normalized] || 'BAKER';
}

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // Trinidad & Tobago format: 868-XXX-XXXX
  if (digits.length === 7) {
    digits = '868' + digits;
  } else if (digits.length === 10 && digits.startsWith('868')) {
    // Already correct
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // Remove country code
    digits = digits.substring(1);
  }
  
  // Format as XXX-XXX-XXXX
  if (digits.length === 10) {
    return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
  }
  
  return phone; // Return original if can't normalize
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// EXPORT MAPPING FUNCTION
// ============================================

/**
 * Map source data to target entity based on entity type
 */
export function mapSourceToEntity(
  sourceData: Record<string, unknown>,
  mappings: FieldMapping[],
  entityType: MigrationEntityType,
  sourceSystem: SourceSystem = 'excel'
): unknown {
  switch (entityType) {
    case 'products':
      return mapToProduct(sourceData, mappings, sourceSystem);
    case 'customers':
      return mapToCustomer(sourceData, mappings, sourceSystem);
    case 'suppliers':
      return mapToSupplier(sourceData, mappings, sourceSystem);
    case 'orders':
      return mapToOrder(sourceData, mappings, sourceSystem);
    case 'ingredients':
      return mapToIngredient(sourceData, mappings, sourceSystem);
    case 'staff':
      return mapToStaff(sourceData, mappings, sourceSystem);
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

/**
 * Validate mapped data based on entity type
 */
export function validateEntity(
  data: unknown,
  entityType: MigrationEntityType,
  row: number
): ValidationError[] {
  switch (entityType) {
    case 'products':
      return validateProduct(data as Partial<ProductMigrationData>, row);
    case 'customers':
      return validateCustomer(data as Partial<CustomerMigrationData>, row);
    case 'suppliers':
      return validateSupplier(data as Partial<SupplierMigrationData>, row);
    case 'orders':
      return validateOrder(data as Partial<OrderMigrationData>, row);
    case 'ingredients':
      return validateIngredient(data as Partial<IngredientMigrationData>, row);
    case 'staff':
      return validateStaff(data as Partial<StaffMigrationData>, row);
    default:
      return [];
  }
}
