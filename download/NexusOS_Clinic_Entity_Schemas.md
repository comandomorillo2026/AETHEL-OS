// ============================================
// NEXUSOS CLINIC MODULES - ENTITY SCHEMAS
// Basado en Epic, Cerner, Athenahealth, Doctolib
// ============================================

// Módulo: Pacientes
model Patient {
  id                String   @id @default(cuid())
  tenantId          String   // Multi-tenant
  
  // Datos personales
  firstName         String
  lastName          String
  fullName          String
  dateOfBirth       String?
  gender            String?  // male | female | other
  bloodType         String?
  
  // Contacto
  email             String?
  phone             String
  phoneAlt          String?
  address           String?
  city              String?
  country           String   @default("Trinidad & Tobago")
  
  // Médico
  allergies         String?  // JSON array
  medications       String?  // JSON array
  conditions        String?  // JSON array chronic conditions
  emergencyContact  String?  // JSON {name, phone, relationship}
  
  // Seguro
  insuranceProvider String?
  insuranceNumber   String?
  insurancePlan     String?
  
  // Sistema
  patientNumber     String   // Auto-generated: PAT-001
  status            String   @default("active") // active | inactive | deceased
  notes             String?
  tags              String?  // JSON array for categorization
  
  // Avatar
  avatarUrl         String?
  
  // Metadata
  isDeleted         Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  appointments      Appointment[]
  invoices          Invoice[]
  medicalRecords    MedicalRecord[]
  documents         PatientDocument[]
  
  @@index([tenantId])
  @@index([patientNumber])
  @@index([phone])
}

// Módulo: Citas
model Appointment {
  id                String   @id @default(cuid())
  tenantId          String
  
  // Paciente
  patientId         String
  patientName       String
  
  // Cita
  appointmentNumber String   // Auto: APT-2026-0001
  title             String
  description       String?
  
  // Fecha y hora
  date              String   // YYYY-MM-DD
  startTime         String   // HH:MM
  endTime           String?  // HH:MM
  duration          Int      @default(30) // minutes
  
  // Estado
  status            String   @default("scheduled") 
  // scheduled | confirmed | in-progress | completed | cancelled | no-show
  
  // Tipo
  type              String   @default("consultation")
  // consultation | follow-up | procedure | telemedicine | emergency
  
  // Médico/Proveedor
  providerId        String?
  providerName      String?
  
  // Precio
  price             Float?
  paid              Boolean  @default(false)
  
  // Recordatorios
  reminderSmsSent   Boolean  @default(false)
  reminderEmailSent Boolean  @default(false)
  reminderWhatsappSent Boolean @default(false)
  
  // Notas
  notes             String?
  cancellationReason String?
  
  // Metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  patient           Patient  @relation(fields: [patientId], references: [id])
  
  @@index([tenantId])
  @@index([date])
  @@index([status])
}

// Módulo: Expediente Médico
model MedicalRecord {
  id                String   @id @default(cuid())
  tenantId          String
  patientId         String
  
  // Datos de la visita
  visitDate         String
  appointmentId     String?
  
  // SOAP Notes
  subjective        String?  // Lo que dice el paciente
  objective         String?  // Lo que observa el médico
  assessment        String?  // Diagnóstico
  plan              String?  // Tratamiento
  
  // Signos vitales
  bloodPressure     String?  // 120/80
  heartRate         Int?     // bpm
  temperature       Float?   // celsius
  weight            Float?   // kg
  height            Float?   // cm
  bmi               Float?   // calculated
  oxygenSaturation  Int?     // %
  
  // Diagnóstico
  chiefComplaint    String?  // Motivo de consulta
  diagnosis         String?  // JSON array of ICD codes
  notes             String?
  
  // Médico
  providerId        String?
  providerName      String?
  
  // Metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  patient           Patient  @relation(fields: [patientId], references: [id])
  
  @@index([tenantId])
  @@index([patientId])
}

// Módulo: Documentos de Paciente
model PatientDocument {
  id                String   @id @default(cuid())
  tenantId          String
  patientId         String
  
  // Documento
  name              String
  type              String   // lab-result | prescription | image | report | other
  category          String?
  
  // Archivo
  fileUrl           String
  fileSize          Int?
  mimeType          String?
  
  // Metadatos
  description       String?
  tags              String?  // JSON array
  
  // Fechas
  documentDate      String?  // Fecha del documento (puede ser distinta a upload)
  
  createdAt         DateTime @default(now())
  
  patient           Patient  @relation(fields: [patientId], references: [id])
  
  @@index([tenantId])
  @@index([patientId])
}

// Módulo: Facturas
model Invoice {
  id                String   @id @default(cuid())
  tenantId          String
  patientId         String?
  
  // Número de factura
  invoiceNumber     String   // Auto: INV-2026-0001
  
  // Datos
  patientName       String
  patientEmail      String?
  patientPhone      String?
  patientAddress    String?
  
  // Items
  items             String   // JSON array [{name, quantity, price, total}]
  
  // Totales
  subtotal          Float
  tax               Float    @default(0)
  discount          Float    @default(0)
  total             Float
  
  // Estado
  status            String   @default("draft")
  // draft | sent | paid | partial | cancelled | refunded
  
  // Fechas
  issueDate         String
  dueDate           String?
  paidAt            String?
  
  // Pago
  paymentMethod     String?
  paymentReference  String?
  notes             String?
  
  // Relación con cita
  appointmentId     String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  patient           Patient? @relation(fields: [patientId], references: [id])
  
  @@index([tenantId])
  @@index([invoiceNumber])
  @@index([status])
}

// Módulo: Servicios de la Clínica
model ClinicService {
  id                String   @id @default(cuid())
  tenantId          String
  
  name              String
  description       String?
  category          String?  // consultation | procedure | lab | imaging
  
  // Precios
  price             Float
  priceCurrency     String   @default("TTD")
  duration          Int      @default(30) // minutes
  
  // Código
  code              String?  // CPT or custom code
  
  // Estado
  isActive          Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tenantId])
}

// Módulo: Proveedores (Médicos)
model Provider {
  id                String   @id @default(cuid())
  tenantId          String
  
  // Datos personales
  firstName         String
  lastName          String
  fullName          String
  email             String?
  phone             String?
  
  // Profesional
  specialization    String?
  licenseNumber     String?
  
  // Horarios
  workingHours      String?  // JSON con horarios
  
  // Estado
  isActive          Boolean  @default(true)
  
  // Avatar
  avatarUrl         String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tenantId])
}

// Módulo: Configuración de Clínica
model ClinicConfig {
  id                String   @id @default(cuid())
  tenantId          String   @unique
  
  // Datos de la clínica
  clinicName        String
  legalName         String?
  taxId             String?
  
  // Contacto
  email             String?
  phone             String?
  website           String?
  
  // Dirección
  address           String?
  city              String?
  country           String   @default("Trinidad & Tobago")
  
  // Branding
  logoUrl           String?
  primaryColor      String   @default("#6C3FCE")
  secondaryColor    String   @default("#F0B429")
  accentColor       String   @default("#C026D3")
  
  // Facturación
  invoicePrefix     String   @default("INV")
  invoiceNotes      String?
  paymentMethods    String?  // JSON array
  bankDetails       String?  // JSON
  
  // Horarios
  businessHours     String?  // JSON con horarios por día
  
  // Recordatorios
  reminderSettings  String?  // JSON
  
  // Moneda
  currency          String   @default("TTD")
  currencySymbol    String   @default("TT$")
  taxRate           Float    @default(0)
  
  // WhatsApp
  whatsappNumber    String?
  whatsappEnabled   Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tenantId])
}

// Módulo: Leads (del Portal Web)
model Lead {
  id                String   @id @default(cuid())
  
  // Datos del lead
  businessName      String
  ownerName         String
  email             String
  phone             String
  industry          String
  country           String?
  
  // Fuente
  source            String   @default("sales_portal")
  utmSource         String?
  utmCampaign       String?
  
  // Estado
  status            String   @default("new")
  // new | contacted | qualified | converted | lost
  
  // Plan de interés
  interestedPlan    String?
  
  // Notas
  notes             String?
  
  // Asignación
  assignedTo        String?
  
  // Conversión
  convertedToTenant Boolean  @default(false)
  tenantId          String?
  salesOrderId      String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([email])
  @@index([status])
}

// Módulo: Usuarios del Sistema
model SystemUser {
  id                String   @id @default(cuid())
  tenantId          String?
  
  // Datos
  email             String   @unique
  passwordHash      String
  name              String
  
  // Rol
  role              String   @default("TENANT_USER")
  // SUPER_ADMIN | ADMIN | TENANT_ADMIN | TENANT_USER
  
  // Perfil
  avatarUrl         String?
  phone             String?
  
  // Estado
  isActive          Boolean  @default(true)
  lastLoginAt       String?
  
  // 2FA
  twoFactorEnabled  Boolean  @default(false)
  twoFactorSecret   String?
  
  // Reset password
  resetToken        String?
  resetTokenExpires String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([email])
  @@index([tenantId])
}

// Módulo: Configuración Global del Sistema
model SystemConfig {
  id                String   @id @default(cuid())
  key               String   @unique
  value             String
  description       String?
  isPublic          Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([key])
}
