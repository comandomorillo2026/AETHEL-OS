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
  Package,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  Pill,
  TestTube,
  Syringe,
  Bandage,
  Stethoscope,
  Activity,
  History,
  X,
  Check
} from 'lucide-react';

// Types
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'medications' | 'supplies' | 'equipment' | 'lab_materials';
  description: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  location: string;
  supplier: string;
  expiryDate?: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  date: string;
  reference?: string;
}

// Demo data
const DEMO_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'MED-001', name: 'Amoxicilina 500mg', category: 'medications', description: 'Antibiótico en cápsulas', unit: 'Caja (20 caps)', currentStock: 45, minStock: 20, maxStock: 100, unitPrice: 25, location: 'Almacén A-1', supplier: 'PharmaCorp', expiryDate: '2026-12-15', lastRestocked: '2026-03-15', status: 'in_stock' },
  { id: '2', sku: 'MED-002', name: 'Ibuprofeno 400mg', category: 'medications', description: 'Antiinflamatorio tabletas', unit: 'Caja (30 tabs)', currentStock: 12, minStock: 20, maxStock: 80, unitPrice: 15, location: 'Almacén A-1', supplier: 'MediLab', expiryDate: '2027-06-20', lastRestocked: '2026-03-10', status: 'low_stock' },
  { id: '3', sku: 'MED-003', name: 'Lisinopril 10mg', category: 'medications', description: 'Antihipertensivo', unit: 'Caja (30 tabs)', currentStock: 0, minStock: 15, maxStock: 50, unitPrice: 35, location: 'Almacén A-2', supplier: 'CardioHealth', expiryDate: '2026-08-10', lastRestocked: '2026-02-28', status: 'out_of_stock' },
  { id: '4', sku: 'SUP-001', name: 'Guantes de Látex M', category: 'supplies', description: 'Guantes examen estériles', unit: 'Caja (100 pz)', currentStock: 150, minStock: 50, maxStock: 200, unitPrice: 18, location: 'Almacén B-1', supplier: 'MediSupply', expiryDate: '2028-03-15', lastRestocked: '2026-03-18', status: 'in_stock' },
  { id: '5', sku: 'SUP-002', name: 'Jeringas 5ml', category: 'supplies', description: 'Jeringas desechables', unit: 'Caja (100 pz)', currentStock: 80, minStock: 40, maxStock: 150, unitPrice: 22, location: 'Almacén B-1', supplier: 'MediSupply', expiryDate: '2029-01-20', lastRestocked: '2026-03-12', status: 'in_stock' },
  { id: '6', sku: 'SUP-003', name: 'Algodón Hidrófilo', category: 'supplies', description: 'Algodón médico 500g', unit: 'Paquete', currentStock: 8, minStock: 20, maxStock: 50, unitPrice: 8, location: 'Almacén B-2', supplier: 'MediSupply', expiryDate: undefined, lastRestocked: '2026-03-05', status: 'low_stock' },
  { id: '7', sku: 'EQP-001', name: 'Tensiómetro Digital', category: 'equipment', description: 'Monitor de presión arterial', unit: 'Unidad', currentStock: 5, minStock: 2, maxStock: 10, unitPrice: 250, location: 'Equipo Médico', supplier: 'MedEquip', expiryDate: undefined, lastRestocked: '2026-02-20', status: 'in_stock' },
  { id: '8', sku: 'EQP-002', name: 'Estetoscopio Clínico', category: 'equipment', description: 'Estetoscopio biauricular', unit: 'Unidad', currentStock: 3, minStock: 3, maxStock: 8, unitPrice: 180, location: 'Equipo Médico', supplier: 'MedEquip', expiryDate: undefined, lastRestocked: '2026-01-15', status: 'in_stock' },
  { id: '9', sku: 'LAB-001', name: 'Tubos de Ensayo', category: 'lab_materials', description: 'Tubos de vidrio 10ml', unit: 'Caja (50 pz)', currentStock: 200, minStock: 100, maxStock: 400, unitPrice: 15, location: 'Laboratorio', supplier: 'LabSupply', expiryDate: undefined, lastRestocked: '2026-03-19', status: 'in_stock' },
  { id: '10', sku: 'LAB-002', name: 'Agujas Hipodérmicas 21G', category: 'lab_materials', description: 'Agujas desechables', unit: 'Caja (100 pz)', currentStock: 5, minStock: 30, maxStock: 100, unitPrice: 12, location: 'Laboratorio', supplier: 'LabSupply', expiryDate: '2026-05-10', lastRestocked: '2026-02-25', status: 'low_stock' },
  { id: '11', sku: 'MED-004', name: 'Omeprazol 20mg', category: 'medications', description: 'Protector gástrico', unit: 'Caja (28 caps)', currentStock: 60, minStock: 25, maxStock: 100, unitPrice: 20, location: 'Almacén A-1', supplier: 'GastroMed', expiryDate: '2027-03-10', lastRestocked: '2026-03-17', status: 'in_stock' },
  { id: '12', sku: 'MED-005', name: 'Metformina 850mg', category: 'medications', description: 'Antidiabético oral', unit: 'Caja (60 tabs)', currentStock: 35, minStock: 20, maxStock: 80, unitPrice: 30, location: 'Almacén A-2', supplier: 'GlucoCare', expiryDate: '2026-04-15', lastRestocked: '2026-03-01', status: 'expired' },
];

const DEMO_TRANSACTIONS: InventoryTransaction[] = [
  { id: '1', itemId: '1', itemName: 'Amoxicilina 500mg', type: 'out', quantity: 10, previousStock: 55, newStock: 45, reason: 'Venta a paciente', performedBy: 'Ana García', date: '2026-03-20', reference: 'RX-2026-001' },
  { id: '2', itemId: '4', itemName: 'Guantes de Látex M', type: 'out', quantity: 5, previousStock: 155, newStock: 150, reason: 'Uso en consulta', performedBy: 'Carlos Mendez', date: '2026-03-20' },
  { id: '3', itemId: '2', itemName: 'Ibuprofeno 400mg', type: 'in', quantity: 30, previousStock: 0, newStock: 30, reason: 'Reposición de inventario', performedBy: 'Admin', date: '2026-03-19', reference: 'PO-2026-045' },
  { id: '4', itemId: '9', itemName: 'Tubos de Ensayo', type: 'in', quantity: 100, previousStock: 100, newStock: 200, reason: 'Compra a proveedor', performedBy: 'Admin', date: '2026-03-19', reference: 'PO-2026-046' },
  { id: '5', itemId: '5', itemName: 'Jeringas 5ml', type: 'out', quantity: 20, previousStock: 100, newStock: 80, reason: 'Uso en procedimiento', performedBy: 'Ana García', date: '2026-03-18' },
  { id: '6', itemId: '3', itemName: 'Lisinopril 10mg', type: 'adjustment', quantity: -15, previousStock: 15, newStock: 0, reason: 'Ajuste de inventario - vencido', performedBy: 'Admin', date: '2026-03-17' },
  { id: '7', itemId: '6', itemName: 'Algodón Hidrófilo', type: 'out', quantity: 12, previousStock: 20, newStock: 8, reason: 'Uso general', performedBy: 'Laura Torres', date: '2026-03-15' },
];

const CATEGORY_CONFIG = {
  medications: { label: 'Medicamentos', icon: Pill, color: 'text-[var(--nexus-violet-lite)]' },
  supplies: { label: 'Insumos', icon: Bandage, color: 'text-[var(--nexus-aqua)]' },
  equipment: { label: 'Equipos', icon: Stethoscope, color: 'text-[var(--nexus-gold)]' },
  lab_materials: { label: 'Materiales Lab', icon: TestTube, color: 'text-[var(--nexus-fuchsia-soft)]' },
};

const STATUS_CONFIG = {
  in_stock: { label: 'En Stock', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Check },
  low_stock: { label: 'Stock Bajo', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: AlertTriangle },
  out_of_stock: { label: 'Sin Stock', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: X },
  expired: { label: 'Vencido', color: 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]', icon: Clock },
};

// Stock Level Visualization
function StockLevelBar({ current, min, max }: { current: number; min: number; max: number }) {
  const percentage = Math.min(100, (current / max) * 100);
  const minPercentage = (min / max) * 100;
  
  let barColor = 'bg-[var(--success)]';
  if (current < min) {
    barColor = 'bg-[var(--error)]';
  } else if (current < min * 1.5) {
    barColor = 'bg-[var(--nexus-gold)]';
  }

  return (
    <div className="w-full">
      <div className="h-2 bg-[var(--glass)] rounded-full relative overflow-hidden">
        {/* Minimum threshold line */}
        <div 
          className="absolute h-full w-0.5 bg-[var(--nexus-gold)]"
          style={{ left: `${minPercentage}%` }}
        />
        {/* Current stock bar */}
        <div 
          className={`h-full ${barColor} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[var(--text-dim)] mt-1">
        <span>0</span>
        <span className="text-[var(--nexus-gold)]">Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}

// Item List Component
function ItemList({ 
  items, 
  selectedItem,
  onSelectItem,
  categoryFilter,
  statusFilter,
  searchTerm
}: { 
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem) => void;
  categoryFilter: string;
  statusFilter: string;
  searchTerm: string;
}) {
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-2">
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-mid)]">
          No se encontraron items
        </div>
      ) : (
        filteredItems.map(item => {
          const CategoryIcon = CATEGORY_CONFIG[item.category].icon;
          const StatusIcon = STATUS_CONFIG[item.status].icon;
          
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedItem?.id === item.id
                  ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]'
                  : 'bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-[var(--glass)] flex items-center justify-center ${CATEGORY_CONFIG[item.category].color}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{item.sku}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${STATUS_CONFIG[item.status].color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {STATUS_CONFIG[item.status].label}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-mid)]">{item.currentStock} {item.unit}</span>
                <span className="font-mono text-[var(--nexus-gold)]">TT${item.unitPrice}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// Item Form Component
function ItemForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item?: InventoryItem | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || 'medications',
    description: item?.description || '',
    unit: item?.unit || '',
    currentStock: item?.currentStock?.toString() || '0',
    minStock: item?.minStock?.toString() || '10',
    maxStock: item?.maxStock?.toString() || '100',
    unitPrice: item?.unitPrice?.toString() || '0',
    location: item?.location || '',
    supplier: item?.supplier || '',
    expiryDate: item?.expiryDate || '',
  });

  return (
    <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
        {item ? 'Editar Item' : 'Nuevo Item de Inventario'}
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Nombre *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del producto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">SKU</Label>
            <Input
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="SKU-001"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Categoría *</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as InventoryItem['category'] }))}
              className="w-full h-10 px-3 rounded-lg"
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Descripción</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción del producto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Unidad *</Label>
            <Input
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="Caja, Unidad, Paquete"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Precio Unit.</Label>
            <Input
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Stock Actual</Label>
            <Input
              type="number"
              value={formData.currentStock}
              onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Stock Mín.</Label>
            <Input
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Stock Máx.</Label>
            <Input
              type="number"
              value={formData.maxStock}
              onChange={(e) => setFormData(prev => ({ ...prev, maxStock: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Ubicación</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Almacén A-1"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Proveedor</Label>
            <Input
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="Nombre del proveedor"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[var(--text-mid)]">Fecha de Vencimiento</Label>
          <Input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={onSave}>
          {item ? 'Actualizar' : 'Crear'} Item
        </Button>
      </div>
    </div>
  );
}

// Transaction History Component
function TransactionHistory({ transactions }: { transactions: InventoryTransaction[] }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-[var(--text-primary)]">Historial de Movimientos</h4>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Exportar
        </Button>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2">
        {transactions.map(tx => (
          <div key={tx.id} className="p-3 rounded-lg bg-[var(--glass)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tx.type === 'in' ? (
                  <ArrowDownRight className="w-4 h-4 text-[var(--success)]" />
                ) : tx.type === 'out' ? (
                  <ArrowUpRight className="w-4 h-4 text-[var(--error)]" />
                ) : (
                  <Activity className="w-4 h-4 text-[var(--nexus-gold)]" />
                )}
                <span className="font-medium text-[var(--text-primary)]">{tx.itemName}</span>
              </div>
              <span className={`font-mono text-sm ${
                tx.type === 'in' ? 'text-[var(--success)]' : 
                tx.type === 'out' ? 'text-[var(--error)]' : 'text-[var(--nexus-gold)]'
              }`}>
                {tx.type === 'in' ? '+' : tx.type === 'out' ? '-' : ''}{tx.quantity}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-mid)]">
              <span>{tx.reason}</span>
              <span>{tx.date}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mt-1">
              <span>Stock: {tx.previousStock} → {tx.newStock}</span>
              <span>{tx.performedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Expiry Tracking Component
function ExpiryTracking({ items }: { items: InventoryItem[] }) {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  const expiredItems = items.filter(item => item.expiryDate && new Date(item.expiryDate) < today);
  const expiringIn30Days = items.filter(item => {
    if (!item.expiryDate) return false;
    const expDate = new Date(item.expiryDate);
    return expDate >= today && expDate <= thirtyDaysFromNow;
  });
  const expiringIn60Days = items.filter(item => {
    if (!item.expiryDate) return false;
    const expDate = new Date(item.expiryDate);
    return expDate > thirtyDaysFromNow && expDate <= sixtyDaysFromNow;
  });

  return (
    <div className="glass-card p-4">
      <h4 className="font-medium text-[var(--text-primary)] mb-4">Control de Vencimientos</h4>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-[var(--error)]/10">
          <p className="text-2xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {expiredItems.length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">Vencidos</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--nexus-gold)]/10">
          <p className="text-2xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {expiringIn30Days.length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">En 30 días</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--nexus-aqua)]/10">
          <p className="text-2xl font-bold text-[var(--nexus-aqua)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {expiringIn60Days.length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">En 60 días</p>
        </div>
      </div>

      {(expiredItems.length > 0 || expiringIn30Days.length > 0) && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {expiredItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[var(--error)]/10">
              <div>
                <p className="text-sm text-[var(--text-primary)]">{item.name}</p>
                <p className="text-xs text-[var(--error)]">Vencido: {item.expiryDate}</p>
              </div>
              <span className="text-sm text-[var(--text-mid)]">{item.currentStock} {item.unit}</span>
            </div>
          ))}
          {expiringIn30Days.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[var(--nexus-gold)]/10">
              <div>
                <p className="text-sm text-[var(--text-primary)]">{item.name}</p>
                <p className="text-xs text-[var(--nexus-gold)]">Vence: {item.expiryDate}</p>
              </div>
              <span className="text-sm text-[var(--text-mid)]">{item.currentStock} {item.unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Inventory Module
export function InventoryModule() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Calculate stats
  const totalItems = DEMO_INVENTORY.length;
  const totalValue = DEMO_INVENTORY.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockCount = DEMO_INVENTORY.filter(item => item.status === 'low_stock').length;
  const outOfStockCount = DEMO_INVENTORY.filter(item => item.status === 'out_of_stock').length;
  const expiredCount = DEMO_INVENTORY.filter(item => item.status === 'expired').length;

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  return (
    <ClinicLayout activeTab="settings">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Inventario</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestión de stock y suministros</p>
        </div>
        <Button className="btn-gold" onClick={() => {
          setEditingItem(null);
          setShowItemForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Total Items</p>
          <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {totalItems}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Valor Total</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            TT${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 border-l-2 border-l-[var(--nexus-gold)]">
          <p className="text-xs text-[var(--text-mid)]">Stock Bajo</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {lowStockCount}
          </p>
        </div>
        <div className="glass-card p-4 border-l-2 border-l-[var(--error)]">
          <p className="text-xs text-[var(--text-mid)]">Sin Stock</p>
          <p className="text-xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {outOfStockCount}
          </p>
        </div>
        <div className="glass-card p-4 border-l-2 border-l-[var(--text-dim)]">
          <p className="text-xs text-[var(--text-mid)]">Vencidos</p>
          <p className="text-xl font-bold text-[var(--text-dim)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {expiredCount}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="glass-card p-4 mb-6 border-l-4 border-l-[var(--nexus-gold)] bg-[var(--nexus-gold)]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--nexus-gold)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Alertas de Inventario</p>
              <ul className="text-xs text-[var(--text-mid)] mt-1 space-y-1">
                {outOfStockCount > 0 && <li>• {outOfStockCount} items sin stock - requieren reposición urgente</li>}
                {lowStockCount > 0 && <li>• {lowStockCount} items con stock bajo - considerar reordenar</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-lg min-w-[150px]"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg min-w-[150px]"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="xl:col-span-1">
          <div className="glass-card p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-4">Items ({DEMO_INVENTORY.length})</h3>
            <ItemList
              items={DEMO_INVENTORY}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              searchTerm={searchTerm}
            />
          </div>
        </div>

        {/* Item Details */}
        <div className="xl:col-span-2 space-y-4">
          {selectedItem ? (
            <>
              {/* Item Header */}
              <div className="glass-card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg bg-[var(--glass)] flex items-center justify-center ${CATEGORY_CONFIG[selectedItem.category].color}`}>
                      {React.createElement(CATEGORY_CONFIG[selectedItem.category].icon, { className: 'w-7 h-7' })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedItem.name}</h3>
                      <p className="text-sm text-[var(--text-mid)]">{selectedItem.sku} • {CATEGORY_CONFIG[selectedItem.category].label}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditItem(selectedItem)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>

                <p className="text-sm text-[var(--text-mid)] mb-4">{selectedItem.description}</p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Stock Actual</p>
                    <p className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                      {selectedItem.currentStock} <span className="text-[var(--text-mid)] font-normal">{selectedItem.unit}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Stock Mínimo</p>
                    <p className="text-[var(--text-primary)]">{selectedItem.minStock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Precio Unit.</p>
                    <p className="text-[var(--nexus-gold)]">TT${selectedItem.unitPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Valor Total</p>
                    <p className="text-[var(--nexus-gold)]">TT${(selectedItem.currentStock * selectedItem.unitPrice).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Stock Level */}
              <div className="glass-card p-4">
                <h4 className="font-medium text-[var(--text-primary)] mb-3">Nivel de Stock</h4>
                <StockLevelBar 
                  current={selectedItem.currentStock} 
                  min={selectedItem.minStock} 
                  max={selectedItem.maxStock} 
                />
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <h4 className="font-medium text-[var(--text-primary)] mb-3">Información</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-mid)]">Ubicación</span>
                      <span className="text-[var(--text-primary)]">{selectedItem.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-mid)]">Proveedor</span>
                      <span className="text-[var(--text-primary)]">{selectedItem.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-mid)]">Últ. Reposición</span>
                      <span className="text-[var(--text-primary)]">{selectedItem.lastRestocked}</span>
                    </div>
                    {selectedItem.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-[var(--text-mid)]">Vencimiento</span>
                        <span className={new Date(selectedItem.expiryDate) < new Date() ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'}>
                          {selectedItem.expiryDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ExpiryTracking items={DEMO_INVENTORY} />
              </div>

              {/* Transaction History */}
              <TransactionHistory 
                transactions={DEMO_TRANSACTIONS.filter(tx => tx.itemId === selectedItem.id)}
              />
            </>
          ) : (
            <>
              <div className="glass-card p-8 text-center">
                <Package className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3" />
                <p className="text-[var(--text-mid)]">Seleccione un item para ver detalles</p>
              </div>
              <TransactionHistory transactions={DEMO_TRANSACTIONS} />
            </>
          )}
        </div>
      </div>

      {/* Item Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <ItemForm
            item={editingItem}
            onSave={() => {
              setShowItemForm(false);
              setEditingItem(null);
            }}
            onCancel={() => {
              setShowItemForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}
    </ClinicLayout>
  );
}
