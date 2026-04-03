# 🥐 NexusOS Bakery - Diseño del Sistema

## VISIÓN GENERAL

Sistema integral de gestión para panaderías y pastelerías, diseñado para escalar desde un emprendimiento casero hasta una franquicia multinacional.

---

## 🏗️ ARQUITECTURA DE 3 SECCIONES

### SECCIÓN 1: 🏠 MI NEGOCIO (Configuración y Administración)

**Para:** Dueños y administradores
**Acceso:** Web + App móvil

| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | KPIs del día, ventas, producción, alertas |
| **Configuración** | Datos fiscales, moneda, VAT, horarios |
| **Personal** | Empleados, roles, permisos, nómina |
| **Contabilidad** | Libro diario, balance, impuestos, reportes |
| **Proveedores** | Inventario de insumos, órdenes de compra |
| **Reportes** | Ventas, costos, márgenes, tendencias |
| **IA Assistant** | Asistente especializado en panadería |

### SECCIÓN 2: 🛒 PUNTO DE VENTA (POS)

**Para:** Vendedores y cajeros
**Acceso:** Tablet + Web + App móvil

| Módulo | Funcionalidades |
|--------|-----------------|
| **Ventas Rápidas** | Productos favoritos, códigos de barra |
| **Pedidos Especiales** | Tortas personalizadas, fechas de entrega |
| **Descuentos** | Promociones, cupones, cliente frecuente |
| **Pagos Mixtos** | Efectivo, tarjeta, transferencia, combo |
| **Facturación** | Factura automática, recibos por email |
| **Modo Offline** | Sigue funcionando sin internet |
| **Cierre de Caja** | Arqueo, diferencias, reporte diario |

### SECCIÓN 3: 📱 PORTAL DEL CLIENTE

**Para:** Clientes finales
**Acceso:** Web pública + App

| Módulo | Funcionalidades |
|--------|-----------------|
| **Catálogo** | Productos, precios, fotos, alérgenos |
| **Pedidos Online** | Carrito, personalización, agenda entrega |
| **Mi Cuenta** | Historial, favoritos, direcciones |
| **Seguimiento** | Estado del pedido, notificaciones |
| **Fidelidad** | Puntos, recompensas, cumpleaños |
| **Facturas** | Descargar comprobantes históricos |

---

## 📋 MODELO DE DATOS COMPLETO

### Entidades Principales

```prisma
// ===== PRODUCTOS =====
model BakeryProduct {
  id                String   @id @default(cuid())
  tenantId          String
  
  // Información básica
  sku               String   // Código único
  name              String
  description       String?
  category          BakeryProductCategory
  subcategory       String?  // Tortas, Panes, Postres, etc.
  
  // Precios
  basePrice         Decimal  @db.Decimal(10, 2)
  costPrice         Decimal  @db.Decimal(10, 2)
  currency          String   @default("TTD")
  
  // Inventario
  trackInventory    Boolean  @default(true)
  stockQuantity     Decimal  @db.Decimal(10, 3)
  minStock          Decimal  @db.Decimal(10, 3)
  unit              String   @default("unidad") // kg, unidad, litro
  
  // Producción
  productionTime    Int?     // minutos
  shelfLife         Int?     // horas de vida útil
  recipeId          String?  // Receta base
  isCustomizable    Boolean  @default(false)
  
  // Presentación
  imageUrl          String?
  allergens         String?  // JSON array: ["gluten", "huevos", "lácteos"]
  nutritionalInfo   Json?    // Calorías, grasas, etc.
  
  // Estado
  isActive          Boolean  @default(true)
  isFeatured        Boolean  @default(false)
  
  // Relaciones
  variants          BakeryProductVariant[]
  recipe            BakeryRecipe?         @relation(fields: [recipeId], references: [id])
  orderItems        BakeryOrderItem[]
  productionItems   BakeryProductionItem[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  
  @@unique([tenantId, sku])
}

model BakeryProductVariant {
  id                String   @id @default(cuid())
  productId         String
  
  name              String   // Pequeño, Mediano, Grande
  sku               String
  priceModifier     Decimal  @db.Decimal(10, 2) // +$50 o -$10
  weight            Decimal? @db.Decimal(10, 3)
  portions          Int?
  
  product           BakeryProduct @relation(fields: [productId], references: [id])
}

enum BakeryProductCategory {
  BREAD           // Panes
  PASTRY          // Pastelería
  CAKE            // Tortas
  DESSERT         // Postres
  BEVERAGE        // Bebidas
  SAVORY          // Salados (empanadas, etc.)
  CUSTOM          // Personalizado
}

// ===== RECETAS Y PRODUCCIÓN =====
model BakeryRecipe {
  id                String   @id @default(cuid())
  tenantId          String
  
  name              String
  description       String?
  portions          Int      @default(1)
  prepTime          Int      // minutos
  bakeTime          Int?     // minutos
  bakeTemp          Int?     // grados
  
  instructions      String   // JSON o markdown
  tips              String?
  
  ingredients       BakeryRecipeIngredient[]
  products          BakeryProduct[]
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model BakeryRecipeIngredient {
  id                String   @id @default(cuid())
  recipeId          String
  ingredientId      String
  
  quantity          Decimal  @db.Decimal(10, 3)
  unit              String   // kg, g, ml, unidad
  
  recipe            BakeryRecipe     @relation(fields: [recipeId], references: [id])
  ingredient        BakeryIngredient @relation(fields: [ingredientId], references: [id])
}

model BakeryIngredient {
  id                String   @id @default(cuid())
  tenantId          String
  
  sku               String
  name              String
  category          String?  // Harinas, Lácteos, etc.
  
  // Inventario
  currentStock      Decimal  @db.Decimal(10, 3)
  minStock          Decimal  @db.Decimal(10, 3)
  unit              String
  
  // Costos
  unitCost          Decimal  @db.Decimal(10, 2)
  currency          String   @default("TTD")
  
  // Proveedor
  supplierId        String?
  supplierSku       String?
  
  recipes           BakeryRecipeIngredient[]
  purchaseItems     BakeryPurchaseItem[]
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
}

// ===== PEDIDOS =====
model BakeryOrder {
  id                String   @id @default(cuid())
  tenantId          String
  
  orderNumber       String   // BAK-2024-0001
  orderType         BakeryOrderType
  
  // Cliente
  customerId        String?
  customerName      String
  customerPhone     String?
  customerEmail     String?
  
  // Entrega
  deliveryType      BakeryDeliveryType
  deliveryAddress   String?
  deliveryDate      DateTime?
  deliveryTime      String?
  deliveryNotes     String?
  
  // Pedido especial (tortas)
  isCustomOrder     Boolean  @default(false)
  customDetails     Json?    // Diseño, inscripciones, fotos
  
  // Montos
  subtotal          Decimal  @db.Decimal(10, 2)
  discount          Decimal  @db.Decimal(10, 2) @default(0)
  deliveryFee       Decimal  @db.Decimal(10, 2) @default(0)
  tax               Decimal  @db.Decimal(10, 2) @default(0)
  total             Decimal  @db.Decimal(10, 2)
  currency          String   @default("TTD")
  
  // Pago
  paymentStatus     BakeryPaymentStatus
  paymentMethod     String?
  paymentReference  String?
  
  // Estado
  status            BakeryOrderStatus
  notes             String?
  
  // Producción
  productionStatus  BakeryProductionStatus?
  productionNotes   String?
  
  items             BakeryOrderItem[]
  invoice           BakeryInvoice?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  customer          BakeryCustomer? @relation(fields: [customerId], references: [id])
  
  @@unique([tenantId, orderNumber])
}

enum BakeryOrderType {
  POS           // Venta en mostrador
  ONLINE        // Pedido web
  PHONE         // Pedido telefónico
  WHOLESALE     // Mayoreo
}

enum BakeryDeliveryType {
  PICKUP        // Recoger en tienda
  DELIVERY      // Entrega a domicilio
  DINE_IN       // Consumo en local
}

enum BakeryPaymentStatus {
  PENDING
  PARTIAL
  PAID
  REFUNDED
}

enum BakeryOrderStatus {
  RECEIVED
  CONFIRMED
  IN_PRODUCTION
  READY
  DELIVERED
  CANCELLED
}

enum BakeryProductionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
}

// ===== LÍNEAS DE PEDIDO =====
model BakeryOrderItem {
  id                String   @id @default(cuid())
  orderId           String
  
  productId         String
  variantId         String?
  
  productName       String
  variantName       String?
  quantity          Decimal  @db.Decimal(10, 3)
  unitPrice         Decimal  @db.Decimal(10, 2)
  totalPrice        Decimal  @db.Decimal(10, 2)
  
  notes             String?  // "Sin nueces", etc.
  
  order             BakeryOrder     @relation(fields: [orderId], references: [id])
  product           BakeryProduct   @relation(fields: [productId], references: [id])
}

// ===== CLIENTES =====
model BakeryCustomer {
  id                String   @id @default(cuid())
  tenantId          String
  
  name              String
  email             String?
  phone             String
  address           String?
  
  // Fidelidad
  loyaltyPoints     Int      @default(0)
  loyaltyTier       String   @default("bronze")
  totalPurchases    Decimal  @db.Decimal(10, 2) @default(0)
  ordersCount       Int      @default(0)
  
  // Cumpleaños (para promociones)
  birthday          DateTime?
  
  // Preferencias
  preferences       Json?    // Alergias, favoritos
  
  orders            BakeryOrder[]
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// ===== FACTURACIÓN =====
model BakeryInvoice {
  id                String   @id @default(cuid())
  tenantId          String
  
  invoiceNumber     String   // INV-2024-0001
  orderId           String?  @unique
  
  // Datos fiscales
  customerTaxId     String?  // RUC, VAT ID, etc.
  customerName      String
  customerAddress   String?
  
  // Montos
  subtotal          Decimal  @db.Decimal(10, 2)
  taxRate           Decimal  @db.Decimal(5, 2)  // 12.5%
  taxAmount         Decimal  @db.Decimal(10, 2)
  total             Decimal  @db.Decimal(10, 2)
  currency          String   @default("TTD")
  
  // Estado
  status            BakeryInvoiceStatus
  paidAt            DateTime?
  
  // PDF
  pdfUrl            String?
  
  order             BakeryOrder? @relation(fields: [orderId], references: [id])
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
  
  @@unique([tenantId, invoiceNumber])
}

enum BakeryInvoiceStatus {
  DRAFT
  ISSUED
  PAID
  CANCELLED
}

// ===== PRODUCCIÓN =====
model BakeryProductionPlan {
  id                String   @id @default(cuid())
  tenantId          String
  
  date              DateTime
  shift             String?  // Mañana, Tarde
  
  items             BakeryProductionItem[]
  
  status            BakeryProductionStatus
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
}

model BakeryProductionItem {
  id                String   @id @default(cuid())
  planId            String
  productId         String
  
  quantity          Decimal  @db.Decimal(10, 3)
  quantityProduced  Decimal  @db.Decimal(10, 3) @default(0)
  quantityWasted    Decimal  @db.Decimal(10, 3) @default(0)
  
  assignedTo        String?  // Usuario
  startTime         DateTime?
  endTime           DateTime?
  
  notes             String?
  
  plan              BakeryProductionPlan @relation(fields: [planId], references: [id])
  product           BakeryProduct @relation(fields: [productId], references: [id])
}

// ===== COMPRAS A PROVEEDORES =====
model BakeryPurchaseOrder {
  id                String   @id @default(cuid())
  tenantId          String
  
  orderNumber       String
  supplierId        String?
  supplierName      String
  
  status            BakeryPurchaseStatus
  expectedDate      DateTime?
  receivedDate      DateTime?
  
  subtotal          Decimal  @db.Decimal(10, 2)
  tax               Decimal  @db.Decimal(10, 2)
  total             Decimal  @db.Decimal(10, 2)
  
  items             BakeryPurchaseItem[]
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
}

enum BakeryPurchaseStatus {
  DRAFT
  ORDERED
  PARTIAL
  RECEIVED
  CANCELLED
}

model BakeryPurchaseItem {
  id                String   @id @default(cuid())
  purchaseOrderId   String
  ingredientId      String
  
  ingredientName    String
  quantity          Decimal  @db.Decimal(10, 3)
  unitCost          Decimal  @db.Decimal(10, 2)
  totalCost         Decimal  @db.Decimal(10, 2)
  
  quantityReceived  Decimal  @db.Decimal(10, 3) @default(0)
  
  purchaseOrder     BakeryPurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  ingredient        BakeryIngredient @relation(fields: [ingredientId], references: [id])
}

// ===== CONTABILIDAD =====
model BakeryJournalEntry {
  id                String   @id @default(cuid())
  tenantId          String
  
  entryNumber       String
  date              DateTime
  description       String
  
  reference         String?  // Orden, factura, etc.
  referenceType     String?  // ORDER, INVOICE, PURCHASE, etc.
  
  lines             BakeryJournalLine[]
  
  isPosted          Boolean  @default(false)
  postedAt          DateTime?
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
  createdAt         DateTime @default(now())
}

model BakeryJournalLine {
  id                String   @id @default(cuid())
  entryId           String
  
  accountId         String
  accountName       String
  description       String?
  
  debit             Decimal  @db.Decimal(10, 2) @default(0)
  credit            Decimal  @db.Decimal(10, 2) @default(0)
  
  entry             BakeryJournalEntry @relation(fields: [entryId], references: [id])
}

// ===== CAJA (POS) =====
model BakeryCashRegister {
  id                String   @id @default(cuid())
  tenantId          String
  
  name              String   // Caja 1, Caja Principal
  location          String?
  
  isOpen            Boolean  @default(false)
  openedAt          DateTime?
  openedBy          String?
  openingBalance    Decimal  @db.Decimal(10, 2) @default(0)
  
  currentBalance    Decimal  @db.Decimal(10, 2) @default(0)
  
  closedAt          DateTime?
  closedBy          String?
  closingBalance    Decimal  @db.Decimal(10, 2) @default(0)
  difference        Decimal  @db.Decimal(10, 2) @default(0)
  
  transactions      BakeryCashTransaction[]
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
}

model BakeryCashTransaction {
  id                String   @id @default(cuid())
  registerId        String
  
  type              BakeryCashTransactionType
  amount            Decimal  @db.Decimal(10, 2)
  description       String?
  
  reference         String?  // Orden ID, etc.
  
  register          BakeryCashRegister @relation(fields: [registerId], references: [id])
  createdAt         DateTime @default(now())
}

enum BakeryCashTransactionType {
  SALE
  REFUND
  CASH_IN
  CASH_OUT
  ADJUSTMENT
}

// ===== CONFIGURACIÓN FISCAL =====
model BakeryTaxConfig {
  id                String   @id @default(cuid())
  tenantId          String
  
  name              String   // VAT, IVA, GST
  rate              Decimal  @db.Decimal(5, 2)  // 12.5%
  
  taxNumber         String?  // Número de registro fiscal
  taxIdType         String?  // VAT, RUC, RIF
  
  isDefault         Boolean  @default(false)
  isActive          Boolean  @default(true)
  
  tenant            Tenant   @relation(fields: [tenantId], references: [id])
}
```

---

## 🌍 CONFIGURACIÓN REGIONAL

### Impuestos (VAT/GST/IVA) por Región

| País/Región | Impuesto | Tasa | ID Fiscal |
|-------------|----------|------|-----------|
| Trinidad & Tobago | VAT | 12.5% | TIN |
| Caricom (general) | VAT | 15% | VARÍA |
| México | IVA | 16% | RFC |
| Colombia | IVA | 19% | NIT |
| España | IVA | 21% | NIF |
| USA | Sales Tax | 0-10% | EIN |

### Monedas Soportadas

| Moneda | Código | Símbolo | Región |
|--------|--------|---------|--------|
| Dólar TT | TTD | TT$ | Trinidad & Tobago |
| Dólar US | USD | $ | Internacional |
| Dólar Barbados | BBD | Bds$ | Barbados |
| Peso Mexicano | MXN | $ | México |
| Euro | EUR | € | Europa |

---

## 🤖 IA ESPECIALIZADA PARA PANADERÍA

### Capacidades del Asistente

```typescript
const BAKERY_AI_PROMPT = `
Eres BakeBot, el asistente AI especializado en panaderías y pastelerías de NexusOS.

Tus conocimientos incluyen:

1. **RECETAS Y TÉCNICAS:**
   - Conversiones de medidas (tazas a gramos, etc.)
   - Sustituciones de ingredientes
   - Técnicas de horneado
   - Solución de problemas comunes (¿por qué se hundió el pastel?)

2. **NEGOCIO:**
   - Cálculo de costos y márgenes
   - Pricing de productos
   - Gestión de inventario perecedero
   - Optimización de producción

3. **REGULATORIO:**
   - Normativas de manipulación de alimentos
   - Etiquetado nutricional
   - Alérgenos y advertencias
   - Impuestos aplicables

4. **MARKETING:**
   - Ideas para promociones
   - Nombres creativos para productos
   - Descripciones atractivas
   - Redes sociales para panaderías

Contexto del negocio:
- País: {país}
- Moneda: {moneda}
- Impuesto: {vat}%

Responde siempre de forma práctica y orientada a la acción.
`;
```

---

## 📱 FUNCIONES OFFLINE (PWA)

### Estrategia Offline-First

```typescript
// IndexedDB Schema para POS offline
const OFFLINE_DB = {
  products: {
    keyPath: 'id',
    indexes: ['sku', 'name', 'category']
  },
  customers: {
    keyPath: 'id',
    indexes: ['phone', 'email']
  },
  orders: {
    keyPath: 'id',
    indexes: ['orderNumber', 'status', 'createdAt']
  },
  pendingSync: {
    keyPath: 'id',
    indexes: ['type', 'timestamp']
  }
};
```

### Sincronización

1. **Al conectar:** Sincroniza pedidos pendientes
2. **Conflictos:** Último cambio gana, con alerta
3. **Validación:** Verifica integridad antes de subir

---

## 📧 SISTEMA DE NOTIFICACIONES

### Emails Automáticos

| Evento | Email | Contenido |
|--------|-------|-----------|
| Nuevo pedido | Cliente | Confirmación + detalle |
| Pedido listo | Cliente | "Tu pedido está listo" |
| Recordatorio entrega | Cliente | "Mañana entrega tu torta" |
| Factura emitida | Cliente | PDF adjunto |
| Stock bajo | Admin | Alerta de reorden |
| Cierre de caja | Admin | Resumen del día |

### WhatsApp Integration (Opcional)

- Confirmación de pedido
- Recordatorio de entrega
- Estado del pedido

---

## 🔐 MIGRACIÓN DE DATOS

### Importación desde Sistemas Existentes

Formatos soportados:
- **Excel/CSV:** Productos, clientes, proveedores
- **QuickBooks:** Facturas, clientes
- **Square/Toast:** Transacciones históricas
- **Manual:** Formulario paso a paso

### Proceso de Migración

```
1. Exportar datos del sistema anterior
2. Mapear campos a formato NexusOS
3. Validar datos (duplicados, errores)
4. Importar en modo "borrador"
5. Revisar y confirmar
6. Activar sistema
```

---

## 🎨 PERSONALIZACIÓN

### Facturas y Recibos

- Logo de la panadería
- Colores corporativos
- Mensaje personalizado
- QR para pago móvil
- Redes sociales

### Portal del Cliente

- Dominio personalizado (mitienda.panaderia.com)
- Tema de colores
- Banner promocional
- Catálogo con fotos

---

**Este documento es la base para el desarrollo del módulo Bakery.**
