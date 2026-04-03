'use client';

import React, { useState, useMemo } from 'react';
import { ClinicLayout } from './clinic-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  DollarSign,
  FileText,
  Printer,
  Download,
  Filter,
  Calendar,
  User,
  CreditCard,
  Check,
  X,
  Clock,
  AlertTriangle,
  Trash2,
  Edit2,
  Eye,
  MoreVertical,
  ChevronDown,
  Percent,
  Receipt,
  Banknote,
  Building2
} from 'lucide-react';

// Types
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'check';
  reference?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  paid: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  payments: Payment[];
  notes?: string;
}

// Demo data
const DEMO_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-001',
    patientId: 'PAT-001',
    patientName: 'María González',
    patientPhone: '+1 868 555-0001',
    date: '2026-03-20',
    dueDate: '2026-04-20',
    items: [
      { id: '1', description: 'Consulta General', quantity: 1, unitPrice: 200, total: 200 },
      { id: '2', description: 'Examen de Sangre', quantity: 1, unitPrice: 150, total: 150 },
    ],
    subtotal: 350,
    tax: 52.50,
    taxRate: 15,
    discount: 0,
    discountType: 'percentage',
    total: 402.50,
    paid: 402.50,
    balance: 0,
    status: 'paid',
    payments: [{ id: '1', date: '2026-03-20', amount: 402.50, method: 'card', reference: 'TXN-001' }],
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-002',
    patientId: 'PAT-002',
    patientName: 'Carlos Rodríguez',
    patientPhone: '+1 868 555-0002',
    date: '2026-03-18',
    dueDate: '2026-04-18',
    items: [
      { id: '1', description: 'Consulta Cardiología', quantity: 1, unitPrice: 350, total: 350 },
      { id: '2', description: 'Electrocardiograma', quantity: 1, unitPrice: 250, total: 250 },
      { id: '3', description: 'Medicamentos', quantity: 2, unitPrice: 75, total: 150 },
    ],
    subtotal: 750,
    tax: 112.50,
    taxRate: 15,
    discount: 50,
    discountType: 'fixed',
    total: 812.50,
    paid: 400,
    balance: 412.50,
    status: 'partial',
    payments: [{ id: '1', date: '2026-03-18', amount: 400, method: 'cash' }],
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-003',
    patientId: 'PAT-003',
    patientName: 'Ana Martínez',
    patientPhone: '+1 868 555-0003',
    date: '2026-03-15',
    dueDate: '2026-03-25',
    items: [
      { id: '1', description: 'Consulta Pediatría', quantity: 1, unitPrice: 180, total: 180 },
    ],
    subtotal: 180,
    tax: 27,
    taxRate: 15,
    discount: 0,
    discountType: 'percentage',
    total: 207,
    paid: 0,
    balance: 207,
    status: 'overdue',
    payments: [],
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-004',
    patientId: 'PAT-004',
    patientName: 'José Pérez',
    patientPhone: '+1 868 555-0004',
    date: '2026-03-21',
    dueDate: '2026-04-21',
    items: [
      { id: '1', description: 'Consulta Especializada', quantity: 1, unitPrice: 300, total: 300 },
      { id: '2', description: 'Rayos X', quantity: 1, unitPrice: 200, total: 200 },
    ],
    subtotal: 500,
    tax: 75,
    taxRate: 15,
    discount: 10,
    discountType: 'percentage',
    total: 525,
    paid: 0,
    balance: 525,
    status: 'sent',
    payments: [],
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-005',
    patientId: 'PAT-005',
    patientName: 'Laura Sánchez',
    patientPhone: '+1 868 555-0005',
    date: '2026-03-21',
    dueDate: '2026-04-21',
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 15,
    discount: 0,
    discountType: 'percentage',
    total: 0,
    paid: 0,
    balance: 0,
    status: 'draft',
    payments: [],
  },
];

const SERVICES_CATALOG = [
  { name: 'Consulta General', price: 200 },
  { name: 'Consulta Especializada', price: 300 },
  { name: 'Consulta Cardiología', price: 350 },
  { name: 'Consulta Pediatría', price: 180 },
  { name: 'Examen de Sangre', price: 150 },
  { name: 'Examen de Orina', price: 100 },
  { name: 'Electrocardiograma', price: 250 },
  { name: 'Rayos X', price: 200 },
  { name: 'Ultrasonido', price: 400 },
  { name: 'Medicamentos', price: 75 },
  { name: 'Curación', price: 50 },
  { name: 'Inyección', price: 30 },
];

const STATUS_CONFIG = {
  draft: { label: 'Borrador', color: 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]', icon: FileText },
  sent: { label: 'Enviada', color: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]', icon: Clock },
  paid: { label: 'Pagada', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Check },
  partial: { label: 'Parcial', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: DollarSign },
  overdue: { label: 'Vencida', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: AlertTriangle },
  cancelled: { label: 'Cancelada', color: 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]', icon: X },
};

const PAYMENT_METHOD_CONFIG = {
  cash: { label: 'Efectivo', icon: Banknote, color: 'text-[var(--success)]' },
  card: { label: 'Tarjeta', icon: CreditCard, color: 'text-[var(--nexus-violet-lite)]' },
  transfer: { label: 'Transferencia', icon: Building2, color: 'text-[var(--nexus-aqua)]' },
  check: { label: 'Cheque', icon: Receipt, color: 'text-[var(--nexus-gold)]' },
};

// Invoice List Component
function InvoiceList({ 
  invoices, 
  onSelectInvoice,
  statusFilter,
  setStatusFilter
}: { 
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por número o paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg min-w-[150px]"
        >
          <option value="all">Todos los estados</option>
          <option value="draft">Borradores</option>
          <option value="sent">Enviadas</option>
          <option value="paid">Pagadas</option>
          <option value="partial">Parciales</option>
          <option value="overdue">Vencidas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="p-3 rounded-lg bg-[var(--nexus-gold)]/10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--nexus-gold)]" />
          <span className="text-sm text-[var(--nexus-gold)]">Total por Cobrar</span>
        </div>
        <span className="text-lg font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
          TT${totalOutstanding.toFixed(2)}
        </span>
      </div>

      <div className="max-h-[500px] overflow-y-auto space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-mid)]">
            No se encontraron facturas
          </div>
        ) : (
          filteredInvoices.map(invoice => {
            const StatusIcon = STATUS_CONFIG[invoice.status].icon;
            return (
              <div
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice)}
                className="p-4 rounded-lg bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--nexus-gold)] to-[#d97706] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[var(--obsidian)]" />
                    </div>
                    <div>
                      <p className="text-[var(--nexus-violet-lite)] font-mono text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-[var(--text-primary)] font-medium">{invoice.patientName}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${STATUS_CONFIG[invoice.status].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_CONFIG[invoice.status].label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-[var(--text-mid)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {invoice.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Total: TT${invoice.total.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Balance: TT${invoice.balance.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Line Items Editor
function LineItemsEditor({ 
  items, 
  onChange 
}: { 
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}) {
  const [showServiceSelect, setShowServiceSelect] = useState(false);

  const addItem = (service: typeof SERVICES_CATALOG[0]) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: service.name,
      quantity: 1,
      unitPrice: service.price,
      total: service.price,
    };
    onChange([...items, newItem]);
    setShowServiceSelect(false);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    onChange(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[var(--text-mid)]">Conceptos</Label>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowServiceSelect(!showServiceSelect)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Servicio
          </Button>
          {showServiceSelect && (
            <div className="absolute right-0 top-full mt-1 z-10 glass-card w-64 max-h-64 overflow-y-auto">
              {SERVICES_CATALOG.map(service => (
                <div
                  key={service.name}
                  onClick={() => addItem(service)}
                  className="p-3 hover:bg-[var(--glass)] cursor-pointer border-b border-[var(--glass-border)] last:border-0"
                >
                  <p className="text-sm text-[var(--text-primary)]">{service.name}</p>
                  <p className="text-xs text-[var(--text-mid)]">TT${service.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-[var(--glass)]">
                <th className="text-left p-3 text-xs font-medium text-[var(--text-mid)]">Descripción</th>
                <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] w-20">Cant.</th>
                <th className="text-right p-3 text-xs font-medium text-[var(--text-mid)] w-24">Precio</th>
                <th className="text-right p-3 text-xs font-medium text-[var(--text-mid)] w-24">Total</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-[var(--glass-border)] last:border-0">
                  <td className="p-3">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="h-8 text-sm text-center w-16"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm text-right w-20"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-sm font-mono text-[var(--text-primary)]">
                      TT${item.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-[var(--error)]/10 text-[var(--error)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && (
        <div className="border border-dashed border-[var(--glass-border)] rounded-lg p-8 text-center text-[var(--text-mid)] text-sm">
          No hay conceptos. Agregue servicios usando el botón superior.
        </div>
      )}

      <div className="text-right text-sm">
        <span className="text-[var(--text-mid)]">Subtotal: </span>
        <span className="font-mono text-[var(--text-primary)]">TT${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

// Invoice Form
function InvoiceForm({ 
  invoice, 
  onSave, 
  onCancel 
}: { 
  invoice?: Invoice | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<LineItem[]>(invoice?.items || []);
  const [taxRate, setTaxRate] = useState(invoice?.taxRate || 15);
  const [discount, setDiscount] = useState(invoice?.discount || 0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(invoice?.discountType || 'percentage');
  const [patientName, setPatientName] = useState(invoice?.patientName || '');
  const [notes, setNotes] = useState(invoice?.notes || '');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');

  const mockPatients = [
    { id: 'PAT-001', name: 'María González', phone: '+1 868 555-0001' },
    { id: 'PAT-002', name: 'Carlos Rodríguez', phone: '+1 868 555-0002' },
    { id: 'PAT-003', name: 'Ana Martínez', phone: '+1 868 555-0003' },
    { id: 'PAT-004', name: 'José Pérez', phone: '+1 868 555-0004' },
    { id: 'PAT-005', name: 'Laura Sánchez', phone: '+1 868 555-0005' },
  ];

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const selectPatient = (patient: typeof mockPatients[0]) => {
    setPatientName(patient.name);
    setShowPatientSearch(false);
    setPatientSearch('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discountType === 'percentage' ? subtotal * (discount / 100) : discount;
  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * (taxRate / 100);
  const total = afterDiscount + tax;

  return (
    <div className="glass-card p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
        {invoice ? 'Editar Factura' : 'Nueva Factura'}
      </h2>

      <div className="space-y-6">
        {/* Patient Selection */}
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Paciente *</Label>
          <div className="relative">
            <Input
              placeholder="Buscar paciente..."
              value={patientSearch || patientName}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setShowPatientSearch(true);
              }}
              onFocus={() => setShowPatientSearch(true)}
            />
            {showPatientSearch && patientSearch && (
              <div className="absolute z-10 w-full mt-1 glass-card max-h-48 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => selectPatient(patient)}
                    className="p-3 hover:bg-[var(--glass)] cursor-pointer border-b border-[var(--glass-border)] last:border-0"
                  >
                    <p className="text-sm text-[var(--text-primary)]">{patient.name}</p>
                    <p className="text-xs text-[var(--text-mid)]">{patient.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <LineItemsEditor items={items} onChange={setItems} />

        {/* Tax and Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Impuesto (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="h-10"
              />
              <Percent className="w-5 h-5 text-[var(--text-mid)]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Descuento</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="h-10 flex-1"
              />
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="h-10 px-3 rounded-lg"
              >
                <option value="percentage">%</option>
                <option value="fixed">TT$</option>
              </select>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-[var(--glass-border)] pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-mid)]">Subtotal</span>
            <span className="font-mono text-[var(--text-primary)]">TT${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-mid)]">Descuento</span>
              <span className="font-mono text-[var(--success)]">-TT${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-mid)]">Impuesto ({taxRate}%)</span>
            <span className="font-mono text-[var(--text-primary)]">TT${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-[var(--glass-border)] pt-2 mt-2">
            <span className="text-[var(--text-primary)]">Total</span>
            <span className="font-mono text-[var(--nexus-gold)]">TT${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Notas</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales..."
            className="w-full h-20 px-3 py-2 rounded-lg resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={onSave}>
          {invoice ? 'Actualizar Factura' : 'Crear Factura'}
        </Button>
      </div>
    </div>
  );
}

// Payment Recording
function PaymentForm({ 
  invoice, 
  onPayment, 
  onCancel 
}: { 
  invoice: Invoice;
  onPayment: (payment: Payment) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(invoice.balance);
  const [method, setMethod] = useState<Payment['method']>('cash');
  const [reference, setReference] = useState('');

  return (
    <div className="glass-card p-6 w-full max-w-md">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Registrar Pago</h3>
      
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-[var(--glass)]">
          <p className="text-xs text-[var(--text-mid)]">Balance Pendiente</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${invoice.balance.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Monto a Pagar</Label>
          <Input
            type="number"
            step="0.01"
            max={invoice.balance}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Método de Pago</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PAYMENT_METHOD_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key as Payment['method'])}
                className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                  method === key
                    ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]'
                    : 'bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5'
                }`}
              >
                <config.icon className={`w-5 h-5 ${config.color}`} />
                <span className="text-sm text-[var(--text-primary)]">{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Referencia (opcional)</Label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Número de transacción, cheque, etc."
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          className="flex-1 btn-gold" 
          onClick={() => onPayment({
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            amount,
            method,
            reference: reference || undefined
          })}
          disabled={amount <= 0 || amount > invoice.balance}
        >
          Registrar Pago
        </Button>
      </div>
    </div>
  );
}

// Invoice Preview/Print
function InvoicePreview({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto print:glass-card-none print:bg-white print:text-black">
      <div className="flex justify-between items-start mb-6 print:hidden">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Vista Previa</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-[var(--glass-border)] print:border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] print:text-black" style={{ fontFamily: 'var(--font-cormorant)' }}>
            NexusOS Clinic
          </h1>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Sistema de Gestión Clínica</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-[var(--nexus-violet-lite)] print:text-purple-600" style={{ fontFamily: 'var(--font-cormorant)' }}>
            FACTURA
          </p>
          <p className="font-mono text-[var(--text-primary)] print:text-black">{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">FACTURAR A</p>
          <p className="font-medium text-[var(--text-primary)] print:text-black">{invoice.patientName}</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">{invoice.patientPhone}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <p className="text-xs text-[var(--text-dim)] print:text-gray-500">Fecha</p>
            <p className="text-sm text-[var(--text-primary)] print:text-black">{invoice.date}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)] print:text-gray-500">Vencimiento</p>
            <p className="text-sm text-[var(--text-primary)] print:text-black">{invoice.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--glass-border)] print:border-gray-200">
              <th className="text-left py-2 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Descripción</th>
              <th className="text-center py-2 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Cant.</th>
              <th className="text-right py-2 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Precio</th>
              <th className="text-right py-2 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr key={item.id} className="border-b border-[var(--glass-border)] print:border-gray-100">
                <td className="py-3 text-sm text-[var(--text-primary)] print:text-black">{item.description}</td>
                <td className="py-3 text-sm text-center text-[var(--text-mid)] print:text-gray-600">{item.quantity}</td>
                <td className="py-3 text-sm text-right font-mono text-[var(--text-mid)] print:text-gray-600">TT${item.unitPrice.toFixed(2)}</td>
                <td className="py-3 text-sm text-right font-mono text-[var(--text-primary)] print:text-black">TT${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-[var(--glass-border)] print:border-gray-200 pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-mid)] print:text-gray-600">Subtotal</span>
              <span className="font-mono text-[var(--text-primary)] print:text-black">TT${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-mid)] print:text-gray-600">Descuento</span>
                <span className="font-mono text-[var(--success)] print:text-green-600">-TT${(invoice.discountType === 'percentage' ? invoice.subtotal * (invoice.discount / 100) : invoice.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-mid)] print:text-gray-600">Impuesto ({invoice.taxRate}%)</span>
              <span className="font-mono text-[var(--text-primary)] print:text-black">TT${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-[var(--glass-border)] print:border-gray-200 pt-2 mt-2">
              <span className="text-[var(--text-primary)] print:text-black">Total</span>
              <span className="font-mono text-[var(--nexus-gold)] print:text-amber-600">TT${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {invoice.payments.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[var(--glass-border)] print:border-gray-200">
          <p className="text-sm font-medium text-[var(--text-primary)] print:text-black mb-3">Pagos Recibidos</p>
          <div className="space-y-2">
            {invoice.payments.map(payment => {
              const methodConfig = PAYMENT_METHOD_CONFIG[payment.method];
              return (
                <div key={payment.id} className="flex justify-between text-sm">
                  <span className="text-[var(--text-mid)] print:text-gray-600">
                    {payment.date} - {methodConfig.label} {payment.reference && `(${payment.reference})`}
                  </span>
                  <span className="font-mono text-[var(--success)] print:text-green-600">TT${payment.amount.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex justify-between font-medium pt-2 border-t border-[var(--glass-border)] print:border-gray-100">
              <span className="text-[var(--text-primary)] print:text-black">Balance Pendiente</span>
              <span className="font-mono text-[var(--nexus-gold)] print:text-amber-600">TT${invoice.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6 pt-6 border-t border-[var(--glass-border)] print:border-gray-200">
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">Notas</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

// Main Billing Module
export function BillingModule() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePayment = (payment: Payment) => {
    // In real app, this would update the database
    console.log('Recording payment:', payment);
    setShowPaymentForm(false);
  };

  return (
    <ClinicLayout activeTab="records">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Facturación</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestiona facturas y pagos</p>
        </div>
        <Button className="btn-gold" onClick={() => setShowNewInvoice(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Total Facturado</p>
          <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${DEMO_INVOICES.reduce((sum, inv) => sum + inv.total, 0).toFixed(0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Cobrado</p>
          <p className="text-xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${DEMO_INVOICES.reduce((sum, inv) => sum + inv.paid, 0).toFixed(0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Pendiente</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${DEMO_INVOICES.reduce((sum, inv) => sum + inv.balance, 0).toFixed(0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Vencidas</p>
          <p className="text-xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_INVOICES.filter(inv => inv.status === 'overdue').length}
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className={statusFilter === 'all' ? 'bg-[var(--nexus-violet)]' : ''}
        >
          Todas
        </Button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = DEMO_INVOICES.filter(inv => inv.status === key).length;
          return (
            <Button
              key={key}
              variant={statusFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
              className={statusFilter === key ? 'bg-[var(--nexus-violet)]' : ''}
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <InvoiceList
            invoices={DEMO_INVOICES}
            onSelectInvoice={handleSelectInvoice}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Invoice Details Panel */}
        <div>
          {selectedInvoice ? (
            <div className="glass-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Detalles</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPaymentForm(true)}>
                    <DollarSign className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedInvoice.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{selectedInvoice.patientName}</p>
                    <p className="text-xs text-[var(--text-mid)]">{selectedInvoice.invoiceNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--glass)]">
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Fecha</p>
                    <p className="text-sm text-[var(--text-primary)]">{selectedInvoice.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Vencimiento</p>
                    <p className="text-sm text-[var(--text-primary)]">{selectedInvoice.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Total</p>
                    <p className="text-sm font-bold text-[var(--nexus-gold)]">TT${selectedInvoice.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Balance</p>
                    <p className="text-sm font-bold text-[var(--error)]">TT${selectedInvoice.balance.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-dim)] mb-2">Conceptos</p>
                  <div className="space-y-2">
                    {selectedInvoice.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[var(--text-mid)]">{item.description} x{item.quantity}</span>
                        <span className="font-mono text-[var(--text-primary)]">TT${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--glass-border)]">
                  <Button 
                    className="w-full btn-gold" 
                    onClick={() => setShowPaymentForm(true)}
                    disabled={selectedInvoice.balance <= 0}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Registrar Pago
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <FileText className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3" />
              <p className="text-[var(--text-mid)]">Selecciona una factura para ver detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <InvoiceForm
            onSave={() => setShowNewInvoice(false)}
            onCancel={() => setShowNewInvoice(false)}
          />
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentForm && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <PaymentForm
            invoice={selectedInvoice}
            onPayment={handlePayment}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <InvoicePreview
            invoice={selectedInvoice}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}
    </ClinicLayout>
  );
}
