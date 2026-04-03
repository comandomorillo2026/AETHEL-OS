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
  FlaskConical,
  TestTube,
  FileText,
  Printer,
  Share2,
  Clock,
  User,
  Calendar,
  Check,
  X,
  AlertTriangle,
  MoreVertical,
  Eye,
  Activity,
  Droplets,
  Heart,
  Brain,
  Bone,
  Eye as EyeIcon,
  Beaker,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle
} from 'lucide-react';

// Types
interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  sampleType: string;
  turnaroundTime: string;
  price: number;
  preparationRequired?: string;
  referenceRanges: { min: number; max: number; unit: string } | null;
}

interface LabResult {
  testId: string;
  testName: string;
  value: number | string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  notes?: string;
}

interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  providerId: string;
  providerName: string;
  date: string;
  tests: { testId: string; testName: string; status: 'pending' | 'in_progress' | 'completed' }[];
  results: LabResult[];
  status: 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  notes?: string;
  completedDate?: string;
}

// Demo Lab Tests Catalog
const LAB_TESTS_CATALOG: LabTest[] = [
  { id: 'LT-001', code: 'CBC', name: 'Hemograma Completo', category: 'Hematología', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 150, referenceRanges: null },
  { id: 'LT-002', code: 'HGB', name: 'Hemoglobina', category: 'Hematología', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 50, referenceRanges: { min: 12, max: 16, unit: 'g/dL' } },
  { id: 'LT-003', code: 'HCT', name: 'Hematocrito', category: 'Hematología', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 50, referenceRanges: { min: 36, max: 48, unit: '%' } },
  { id: 'LT-004', code: 'WBC', name: 'Leucocitos', category: 'Hematología', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 50, referenceRanges: { min: 4.5, max: 11, unit: 'x10³/µL' } },
  { id: 'LT-005', code: 'PLT', name: 'Plaquetas', category: 'Hematología', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 50, referenceRanges: { min: 150, max: 400, unit: 'x10³/µL' } },
  { id: 'LT-006', code: 'GLU', name: 'Glucosa en Ayunas', category: 'Química Clínica', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 60, preparationRequired: 'Ayuno de 8-12 horas', referenceRanges: { min: 70, max: 100, unit: 'mg/dL' } },
  { id: 'LT-007', code: 'HBA1C', name: 'Hemoglobina Glicosilada', category: 'Química Clínica', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 120, referenceRanges: { min: 4, max: 6, unit: '%' } },
  { id: 'LT-008', code: 'CREA', name: 'Creatinina', category: 'Química Clínica', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 60, referenceRanges: { min: 0.7, max: 1.3, unit: 'mg/dL' } },
  { id: 'LT-009', code: 'BUN', name: 'Nitrógeno Ureico', category: 'Química Clínica', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 60, referenceRanges: { min: 7, max: 20, unit: 'mg/dL' } },
  { id: 'LT-010', code: 'URIC', name: 'Ácido Úrico', category: 'Química Clínica', sampleType: 'Sangre', turnaroundTime: '2 horas', price: 60, referenceRanges: { min: 3.5, max: 7.2, unit: 'mg/dL' } },
  { id: 'LT-011', code: 'CHOL', name: 'Colesterol Total', category: 'Lipidograma', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 80, preparationRequired: 'Ayuno de 12 horas', referenceRanges: { min: 0, max: 200, unit: 'mg/dL' } },
  { id: 'LT-012', code: 'HDL', name: 'Colesterol HDL', category: 'Lipidograma', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 80, referenceRanges: { min: 40, max: 100, unit: 'mg/dL' } },
  { id: 'LT-013', code: 'LDL', name: 'Colesterol LDL', category: 'Lipidograma', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 80, referenceRanges: { min: 0, max: 100, unit: 'mg/dL' } },
  { id: 'LT-014', code: 'TRIG', name: 'Triglicéridos', category: 'Lipidograma', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 70, preparationRequired: 'Ayuno de 12 horas', referenceRanges: { min: 0, max: 150, unit: 'mg/dL' } },
  { id: 'LT-015', code: 'TSH', name: 'Hormona Estimulante de Tiroides', category: 'Endocrinología', sampleType: 'Sangre', turnaroundTime: '6 horas', price: 150, referenceRanges: { min: 0.4, max: 4.0, unit: 'mIU/L' } },
  { id: 'LT-016', code: 'T4', name: 'Tiroxina (T4)', category: 'Endocrinología', sampleType: 'Sangre', turnaroundTime: '6 horas', price: 120, referenceRanges: { min: 5, max: 12, unit: 'µg/dL' } },
  { id: 'LT-017', code: 'URINALYSIS', name: 'Análisis de Orina', category: 'Uroanálisis', sampleType: 'Orina', turnaroundTime: '2 horas', price: 80, referenceRanges: null },
  { id: 'LT-018', code: 'PT', name: 'Tiempo de Protrombina', category: 'Coagulación', sampleType: 'Sangre', turnaroundTime: '3 horas', price: 100, referenceRanges: { min: 11, max: 13.5, unit: 'seg' } },
  { id: 'LT-019', code: 'PTT', name: 'Tiempo de Tromboplastina Parcial', category: 'Coagulación', sampleType: 'Sangre', turnaroundTime: '3 horas', price: 100, referenceRanges: { min: 25, max: 35, unit: 'seg' } },
  { id: 'LT-020', code: 'CRP', name: 'Proteína C Reactiva', category: 'Inmunología', sampleType: 'Sangre', turnaroundTime: '4 horas', price: 90, referenceRanges: { min: 0, max: 5, unit: 'mg/L' } },
];

// Demo Lab Orders
const DEMO_LAB_ORDERS: LabOrder[] = [
  {
    id: '1',
    orderNumber: 'LAB-2026-001',
    patientId: 'PAT-001',
    patientName: 'María González',
    patientAge: 45,
    patientGender: 'female',
    providerId: '1',
    providerName: 'Dr. Ana García',
    date: '2026-03-20',
    tests: [
      { testId: 'LT-006', testName: 'Glucosa en Ayunas', status: 'completed' },
      { testId: 'LT-011', testName: 'Colesterol Total', status: 'completed' },
      { testId: 'LT-012', testName: 'Colesterol HDL', status: 'completed' },
      { testId: 'LT-013', testName: 'Colesterol LDL', status: 'completed' },
    ],
    results: [
      { testId: 'LT-006', testName: 'Glucosa en Ayunas', value: 95, unit: 'mg/dL', referenceMin: 70, referenceMax: 100, status: 'normal' },
      { testId: 'LT-011', testName: 'Colesterol Total', value: 220, unit: 'mg/dL', referenceMin: 0, referenceMax: 200, status: 'high' },
      { testId: 'LT-012', testName: 'Colesterol HDL', value: 55, unit: 'mg/dL', referenceMin: 40, referenceMax: 100, status: 'normal' },
      { testId: 'LT-013', testName: 'Colesterol LDL', value: 135, unit: 'mg/dL', referenceMin: 0, referenceMax: 100, status: 'high' },
    ],
    status: 'completed',
    priority: 'routine',
    completedDate: '2026-03-20',
  },
  {
    id: '2',
    orderNumber: 'LAB-2026-002',
    patientId: 'PAT-002',
    patientName: 'Carlos Rodríguez',
    patientAge: 58,
    patientGender: 'male',
    providerId: '2',
    providerName: 'Dr. Carlos Mendez',
    date: '2026-03-20',
    tests: [
      { testId: 'LT-001', testName: 'Hemograma Completo', status: 'completed' },
      { testId: 'LT-008', testName: 'Creatinina', status: 'completed' },
      { testId: 'LT-009', testName: 'Nitrógeno Ureico', status: 'completed' },
    ],
    results: [
      { testId: 'LT-002', testName: 'Hemoglobina', value: 14.2, unit: 'g/dL', referenceMin: 12, referenceMax: 16, status: 'normal' },
      { testId: 'LT-003', testName: 'Hematocrito', value: 42, unit: '%', referenceMin: 36, referenceMax: 48, status: 'normal' },
      { testId: 'LT-004', testName: 'Leucocitos', value: 7.5, unit: 'x10³/µL', referenceMin: 4.5, referenceMax: 11, status: 'normal' },
      { testId: 'LT-005', testName: 'Plaquetas', value: 245, unit: 'x10³/µL', referenceMin: 150, referenceMax: 400, status: 'normal' },
      { testId: 'LT-008', testName: 'Creatinina', value: 1.1, unit: 'mg/dL', referenceMin: 0.7, referenceMax: 1.3, status: 'normal' },
      { testId: 'LT-009', testName: 'Nitrógeno Ureico', value: 18, unit: 'mg/dL', referenceMin: 7, referenceMax: 20, status: 'normal' },
    ],
    status: 'completed',
    priority: 'routine',
    completedDate: '2026-03-20',
  },
  {
    id: '3',
    orderNumber: 'LAB-2026-003',
    patientId: 'PAT-003',
    patientName: 'Ana Martínez',
    patientAge: 35,
    patientGender: 'female',
    providerId: '1',
    providerName: 'Dr. Ana García',
    date: '2026-03-21',
    tests: [
      { testId: 'LT-006', testName: 'Glucosa en Ayunas', status: 'in_progress' },
      { testId: 'LT-007', testName: 'Hemoglobina Glicosilada', status: 'pending' },
    ],
    results: [],
    status: 'processing',
    priority: 'routine',
    notes: 'Control de diabetes',
  },
  {
    id: '4',
    orderNumber: 'LAB-2026-004',
    patientId: 'PAT-004',
    patientName: 'José Pérez',
    patientAge: 62,
    patientGender: 'male',
    providerId: '2',
    providerName: 'Dr. Carlos Mendez',
    date: '2026-03-21',
    tests: [
      { testId: 'LT-015', testName: 'Hormona Estimulante de Tiroides', status: 'pending' },
      { testId: 'LT-016', testName: 'Tiroxina (T4)', status: 'pending' },
    ],
    results: [],
    status: 'sample_collected',
    priority: 'urgent',
    notes: 'Evaluación de tiroides',
  },
  {
    id: '5',
    orderNumber: 'LAB-2026-005',
    patientId: 'PAT-005',
    patientName: 'Laura Sánchez',
    patientAge: 28,
    patientGender: 'female',
    providerId: '1',
    providerName: 'Dr. Ana García',
    date: '2026-03-21',
    tests: [
      { testId: 'LT-001', testName: 'Hemograma Completo', status: 'pending' },
    ],
    results: [],
    status: 'ordered',
    priority: 'stat',
    notes: 'Pre-operatorio',
  },
];

const STATUS_CONFIG = {
  ordered: { label: 'Ordenado', color: 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]', icon: Clock },
  sample_collected: { label: 'Muestra Recolectada', color: 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]', icon: TestTube },
  processing: { label: 'En Proceso', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: FlaskConical },
  completed: { label: 'Completado', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Check },
  cancelled: { label: 'Cancelado', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: X },
};

const PRIORITY_CONFIG = {
  routine: { label: 'Rutina', color: 'bg-[var(--text-dim)]/10 text-[var(--text-dim)]' },
  urgent: { label: 'Urgente', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' },
  stat: { label: 'STAT', color: 'bg-[var(--error)]/10 text-[var(--error)]' },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Hematología': Droplets,
  'Química Clínica': Beaker,
  'Lipidograma': Heart,
  'Endocrinología': Brain,
  'Uroanálisis': FlaskConical,
  'Coagulación': Activity,
  'Inmunología': Activity,
};

// Lab Test Catalog Component
function LabTestCatalog({ 
  selectedTests, 
  onToggleTest 
}: { 
  selectedTests: string[];
  onToggleTest: (test: LabTest) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(LAB_TESTS_CATALOG.map(t => t.category))];

  const filteredTests = LAB_TESTS_CATALOG.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-card p-4">
      <h4 className="font-medium text-[var(--text-primary)] mb-4">Catálogo de Pruebas</h4>
      
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar prueba..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--nexus-violet)] text-white'
                  : 'bg-[var(--glass)] text-[var(--text-mid)] hover:bg-[var(--nexus-violet)]/10'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {filteredTests.map(test => {
            const isSelected = selectedTests.includes(test.id);
            const CategoryIcon = CATEGORY_ICONS[test.category] || FlaskConical;
            
            return (
              <div
                key={test.id}
                onClick={() => onToggleTest(test)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]'
                    : 'bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-[var(--nexus-violet-lite)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{test.name}</p>
                      <p className="text-xs text-[var(--text-mid)]">{test.code} • {test.sampleType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-[var(--nexus-gold)]">TT${test.price}</p>
                    <p className="text-xs text-[var(--text-dim)]">{test.turnaroundTime}</p>
                  </div>
                </div>
                {test.preparationRequired && (
                  <p className="text-xs text-[var(--nexus-gold)] mt-1">⚠️ {test.preparationRequired}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Results Entry Component
function ResultsEntry({ 
  order, 
  onSave, 
  onCancel 
}: { 
  order: LabOrder;
  onSave: (results: LabResult[]) => void;
  onCancel: () => void;
}) {
  const [results, setResults] = useState<LabResult[]>(
    order.tests.map(test => {
      const testInfo = LAB_TESTS_CATALOG.find(t => t.id === test.testId);
      return {
        testId: test.testId,
        testName: test.testName,
        value: '',
        unit: testInfo?.referenceRanges?.unit || '',
        referenceMin: testInfo?.referenceRanges?.min,
        referenceMax: testInfo?.referenceRanges?.max,
        status: 'normal' as const,
        notes: ''
      };
    })
  );

  const updateResult = (index: number, field: keyof LabResult, value: string | number) => {
    setResults(results.map((r, i) => {
      if (i === index) {
        const updated = { ...r, [field]: value };
        // Auto-determine status based on value
        if (field === 'value' && typeof value === 'number') {
          if (updated.referenceMin !== undefined && updated.referenceMax !== undefined) {
            if (value < updated.referenceMin) {
              updated.status = 'low';
            } else if (value > updated.referenceMax) {
              updated.status = 'high';
            } else {
              updated.status = 'normal';
            }
          }
        }
        return updated;
      }
      return r;
    }));
  };

  return (
    <div className="glass-card p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Ingresar Resultados</h2>
      
      <div className="p-4 rounded-lg bg-[var(--glass)] mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-[var(--nexus-violet-lite)]">{order.orderNumber}</p>
            <p className="font-medium text-[var(--text-primary)]">{order.patientName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--text-mid)]">{order.date}</p>
            <p className="text-xs text-[var(--text-dim)]">{order.providerName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              <th className="text-left p-3 text-xs font-medium text-[var(--text-mid)]">Prueba</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] w-28">Valor</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] w-20">Unidad</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] w-32">Referencia</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] w-24">Estado</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={result.testId} className="border-b border-[var(--glass-border)]">
                <td className="p-3">
                  <p className="text-sm text-[var(--text-primary)]">{result.testName}</p>
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={result.value}
                    onChange={(e) => updateResult(idx, 'value', parseFloat(e.target.value) || 0)}
                    className="h-8 text-center"
                  />
                </td>
                <td className="p-3 text-center">
                  <span className="text-sm text-[var(--text-mid)]">{result.unit}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs font-mono text-[var(--text-dim)]">
                    {result.referenceMin !== undefined && result.referenceMax !== undefined
                      ? `${result.referenceMin}-${result.referenceMax}`
                      : '-'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'normal' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                    result.status === 'low' ? 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]' :
                    result.status === 'high' ? 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' :
                    'bg-[var(--error)]/10 text-[var(--error)]'
                  }`}>
                    {result.status === 'normal' ? 'Normal' :
                     result.status === 'low' ? 'Bajo' :
                     result.status === 'high' ? 'Alto' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={() => onSave(results)}>
          Guardar Resultados
        </Button>
      </div>
    </div>
  );
}

// Results Visualization Component
function ResultsVisualization({ order }: { order: LabOrder }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {order.results.filter(r => r.status === 'normal').length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">Normales</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {order.results.filter(r => r.status === 'high' || r.status === 'low').length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">Anormales</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {order.results.filter(r => r.status === 'critical').length}
          </p>
          <p className="text-xs text-[var(--text-mid)]">Críticos</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-card p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              <th className="text-left p-3 text-xs font-medium text-[var(--text-mid)]">Prueba</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)]">Resultado</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)]">Referencia</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {order.results.map((result, idx) => (
              <tr key={idx} className="border-b border-[var(--glass-border)] last:border-0">
                <td className="p-3">
                  <p className="text-sm text-[var(--text-primary)]">{result.testName}</p>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono text-[var(--text-primary)]">
                      {result.value} {result.unit}
                    </span>
                    {result.status === 'high' && <TrendingUp className="w-4 h-4 text-[var(--nexus-gold)]" />}
                    {result.status === 'low' && <TrendingDown className="w-4 h-4 text-[var(--nexus-aqua)]" />}
                    {result.status === 'normal' && <Minus className="w-4 h-4 text-[var(--success)]" />}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs font-mono text-[var(--text-dim)]">
                    {result.referenceMin !== undefined && result.referenceMax !== undefined
                      ? `${result.referenceMin} - ${result.referenceMax} ${result.unit}`
                      : '-'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'normal' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                    result.status === 'low' ? 'bg-[var(--nexus-aqua)]/10 text-[var(--nexus-aqua)]' :
                    result.status === 'high' ? 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' :
                    'bg-[var(--error)]/10 text-[var(--error)]'
                  }`}>
                    {result.status === 'normal' ? 'Normal' :
                     result.status === 'low' ? 'Bajo' :
                     result.status === 'high' ? 'Alto' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Reference Bars */}
      <div className="glass-card p-4">
        <h4 className="font-medium text-[var(--text-primary)] mb-4">Visualización de Referencias</h4>
        <div className="space-y-4">
          {order.results.filter(r => typeof r.value === 'number' && r.referenceMin !== undefined).map((result, idx) => {
            const value = result.value as number;
            const min = result.referenceMin!;
            const max = result.referenceMax!;
            const range = max - min;
            const percentage = Math.min(100, Math.max(0, ((value - min + range * 0.2) / (range * 1.4)) * 100));
            
            return (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-mid)]">{result.testName}</span>
                  <span className="font-mono text-[var(--text-primary)]">{value} {result.unit}</span>
                </div>
                <div className="h-4 bg-[var(--glass)] rounded-full relative overflow-hidden">
                  {/* Reference range */}
                  <div 
                    className="absolute h-full bg-[var(--success)]/20 rounded-full"
                    style={{ left: '20%', width: '60%' }}
                  />
                  {/* Value marker */}
                  <div 
                    className={`absolute w-3 h-3 rounded-full top-0.5 transform -translate-x-1/2 ${
                      result.status === 'normal' ? 'bg-[var(--success)]' :
                      result.status === 'low' ? 'bg-[var(--nexus-aqua)]' :
                      result.status === 'high' ? 'bg-[var(--nexus-gold)]' : 'bg-[var(--error)]'
                    }`}
                    style={{ left: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-dim)] mt-1">
                  <span>{min}</span>
                  <span className="text-[var(--success)]">Normal: {min}-{max}</span>
                  <span>{max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Order Creation Form
function CreateOrderForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: () => void;
  onCancel: () => void;
}) {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'male' | 'female'>('male');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [notes, setNotes] = useState('');

  const toggleTest = (test: LabTest) => {
    setSelectedTests(prev => 
      prev.includes(test.id) 
        ? prev.filter(id => id !== test.id)
        : [...prev, test.id]
    );
  };

  const totalAmount = selectedTests.reduce((sum, id) => {
    const test = LAB_TESTS_CATALOG.find(t => t.id === id);
    return sum + (test?.price || 0);
  }, 0);

  return (
    <div className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Nueva Orden de Laboratorio</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Patient Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Paciente *</Label>
            <Input
              placeholder="Nombre del paciente"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[var(--text-mid)]">Edad</Label>
              <Input
                type="number"
                placeholder="Años"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--text-mid)]">Género</Label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as 'male' | 'female')}
                className="w-full h-10 px-3 rounded-lg"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Prioridad</Label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key as 'routine' | 'urgent' | 'stat')}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    priority === key
                      ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]'
                      : 'bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5'
                  }`}
                >
                  <span className={`text-sm ${priority === key ? 'text-[var(--nexus-violet-lite)]' : 'text-[var(--text-mid)]'}`}>
                    {config.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Notas Clínicas</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indicaciones clínicas..."
              className="w-full h-20 px-3 py-2 rounded-lg resize-none"
            />
          </div>

          {/* Selected Tests Summary */}
          <div className="glass-card p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-3">Pruebas Seleccionadas ({selectedTests.length})</h4>
            {selectedTests.length === 0 ? (
              <p className="text-sm text-[var(--text-mid)]">Seleccione pruebas del catálogo</p>
            ) : (
              <div className="space-y-2">
                {selectedTests.map(testId => {
                  const test = LAB_TESTS_CATALOG.find(t => t.id === testId);
                  return test ? (
                    <div key={testId} className="flex justify-between text-sm">
                      <span className="text-[var(--text-mid)]">{test.name}</span>
                      <span className="font-mono text-[var(--nexus-gold)]">TT${test.price}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between pt-2 border-t border-[var(--glass-border)]">
                  <span className="font-medium text-[var(--text-primary)]">Total</span>
                  <span className="font-mono font-bold text-[var(--nexus-gold)]">TT${totalAmount}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Test Catalog */}
        <LabTestCatalog selectedTests={selectedTests} onToggleTest={toggleTest} />
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={onSave} disabled={selectedTests.length === 0 || !patientName}>
          Crear Orden
        </Button>
      </div>
    </div>
  );
}

// Print Report Component
function LabReportPrint({ order, onClose }: { order: LabOrder; onClose: () => void }) {
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto print:bg-white print:text-black">
      <div className="flex justify-between items-start mb-6 print:hidden">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Reporte de Laboratorio</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-[var(--glass-border)] print:border-gray-200">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] print:text-black" style={{ fontFamily: 'var(--font-cormorant)' }}>
          NexusOS Clinic - Laboratorio
        </h1>
        <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Reporte de Resultados</p>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">PACIENTE</p>
          <p className="font-medium text-[var(--text-primary)] print:text-black">{order.patientName}</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Edad: {order.patientAge} años | {order.patientGender === 'male' ? 'Masculino' : 'Femenino'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">ORDEN</p>
          <p className="font-mono text-[var(--nexus-violet-lite)] print:text-purple-600">{order.orderNumber}</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Fecha: {order.date}</p>
        </div>
      </div>

      {/* Provider */}
      <div className="mb-6 p-4 rounded-lg bg-[var(--glass)] print:bg-gray-50">
        <p className="text-xs text-[var(--text-dim)] print:text-gray-500">MÉDICO SOLICITANTE</p>
        <p className="text-sm text-[var(--text-primary)] print:text-black">{order.providerName}</p>
      </div>

      {/* Results Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--glass-border)] print:border-gray-200">
              <th className="text-left p-3 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Prueba</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Resultado</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Referencia</th>
              <th className="text-center p-3 text-xs font-medium text-[var(--text-mid)] print:text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody>
            {order.results.map((result, idx) => (
              <tr key={idx} className="border-b border-[var(--glass-border)] print:border-gray-100 last:border-0">
                <td className="p-3">
                  <p className="text-sm text-[var(--text-primary)] print:text-black">{result.testName}</p>
                </td>
                <td className="p-3 text-center">
                  <span className="font-mono text-[var(--text-primary)] print:text-black">
                    {result.value} {result.unit}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-xs font-mono text-[var(--text-dim)] print:text-gray-500">
                    {result.referenceMin !== undefined && result.referenceMax !== undefined
                      ? `${result.referenceMin}-${result.referenceMax}`
                      : '-'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'normal' ? 'bg-green-100 text-green-700 print:bg-white print:text-green-600 print:border print:border-green-600' :
                    result.status === 'low' ? 'bg-cyan-100 text-cyan-700 print:bg-white print:text-cyan-600 print:border print:border-cyan-600' :
                    result.status === 'high' ? 'bg-amber-100 text-amber-700 print:bg-white print:text-amber-600 print:border print:border-amber-600' :
                    'bg-red-100 text-red-700 print:bg-white print:text-red-600 print:border print:border-red-600'
                  }`}>
                    {result.status === 'normal' ? 'Normal' :
                     result.status === 'low' ? 'Bajo' :
                     result.status === 'high' ? 'Alto' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-6">
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">NOTAS</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--glass-border)] print:border-gray-200 text-center">
        <p className="text-xs text-[var(--text-dim)] print:text-gray-400">
          Este reporte es confidencial y solo para uso médico.
          <br />
          Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

// Main Lab Module
export function LabModule() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showResultsEntry, setShowResultsEntry] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);

  const filteredOrders = DEMO_LAB_ORDERS.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ClinicLayout activeTab="records">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Laboratorio</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestión de órdenes y resultados</p>
        </div>
        <Button className="btn-gold" onClick={() => setShowCreateOrder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Total Órdenes</p>
          <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LAB_ORDERS.length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Ordenadas</p>
          <p className="text-xl font-bold text-[var(--text-dim)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LAB_ORDERS.filter(o => o.status === 'ordered').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">En Proceso</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LAB_ORDERS.filter(o => o.status === 'processing' || o.status === 'sample_collected').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Completadas</p>
          <p className="text-xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LAB_ORDERS.filter(o => o.status === 'completed').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Urgentes</p>
          <p className="text-xl font-bold text-[var(--error)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_LAB_ORDERS.filter(o => o.priority === 'stat' || o.priority === 'urgent').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por paciente o número de orden..."
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
          <option value="ordered">Ordenados</option>
          <option value="sample_collected">Muestra Recolectada</option>
          <option value="processing">En Proceso</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="xl:col-span-1">
          <div className="glass-card p-4 max-h-[600px] overflow-y-auto space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-mid)]">
                No se encontraron órdenes
              </div>
            ) : (
              filteredOrders.map(order => {
                const StatusIcon = STATUS_CONFIG[order.status].icon;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'bg-[var(--nexus-violet)]/20 border border-[var(--nexus-violet)]'
                        : 'bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-sm text-[var(--nexus-violet-lite)]">{order.orderNumber}</p>
                      <span className={`px-2 py-1 rounded text-xs ${PRIORITY_CONFIG[order.priority].color}`}>
                        {PRIORITY_CONFIG[order.priority].label}
                      </span>
                    </div>
                    <p className="font-medium text-[var(--text-primary)] mb-1">{order.patientName}</p>
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1 text-xs ${STATUS_CONFIG[order.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[order.status].label}
                      </span>
                      <span className="text-xs text-[var(--text-dim)]">{order.tests.length} pruebas</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="xl:col-span-2">
          {selectedOrder ? (
            <div className="space-y-4">
              {/* Order Header */}
              <div className="glass-card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm text-[var(--nexus-violet-lite)]">{selectedOrder.orderNumber}</p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{selectedOrder.patientName}</p>
                    <p className="text-sm text-[var(--text-mid)]">
                      {selectedOrder.patientAge} años | {selectedOrder.patientGender === 'male' ? 'Masculino' : 'Femenino'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedOrder.status === 'completed' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setShowPrintReport(true)}>
                          <Printer className="w-4 h-4 mr-1" />
                          Imprimir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Compartir
                        </Button>
                      </>
                    )}
                    {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                      <Button size="sm" className="btn-nexus" onClick={() => setShowResultsEntry(true)}>
                        <FlaskConical className="w-4 h-4 mr-1" />
                        Ingresar Resultados
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Fecha</p>
                    <p className="text-[var(--text-primary)]">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Prioridad</p>
                    <p className={PRIORITY_CONFIG[selectedOrder.priority].color.split(' ')[1]}>
                      {PRIORITY_CONFIG[selectedOrder.priority].label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Estado</p>
                    <p className={STATUS_CONFIG[selectedOrder.status].color.split(' ')[1]}>
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Médico</p>
                    <p className="text-[var(--text-primary)]">{selectedOrder.providerName}</p>
                  </div>
                </div>
              </div>

              {/* Results or Tests */}
              {selectedOrder.status === 'completed' ? (
                <ResultsVisualization order={selectedOrder} />
              ) : (
                <div className="glass-card p-4">
                  <h4 className="font-medium text-[var(--text-primary)] mb-4">Pruebas Solicitadas</h4>
                  <div className="space-y-3">
                    {selectedOrder.tests.map(test => (
                      <div key={test.testId} className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass)]">
                        <div className="flex items-center gap-3">
                          <TestTube className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
                          <span className="text-[var(--text-primary)]">{test.testName}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          test.status === 'completed' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                          test.status === 'in_progress' ? 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]' :
                          'bg-[var(--text-dim)]/10 text-[var(--text-dim)]'
                        }`}>
                          {test.status === 'completed' ? 'Completado' :
                           test.status === 'in_progress' ? 'En Proceso' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="glass-card p-4">
                  <p className="text-xs text-[var(--text-dim)] mb-1">Notas Clínicas</p>
                  <p className="text-sm text-[var(--text-mid)]">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <FlaskConical className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3" />
              <p className="text-[var(--text-mid)]">Seleccione una orden para ver detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <CreateOrderForm
            onSave={() => setShowCreateOrder(false)}
            onCancel={() => setShowCreateOrder(false)}
          />
        </div>
      )}

      {/* Results Entry Modal */}
      {showResultsEntry && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <ResultsEntry
            order={selectedOrder}
            onSave={() => setShowResultsEntry(false)}
            onCancel={() => setShowResultsEntry(false)}
          />
        </div>
      )}

      {/* Print Report Modal */}
      {showPrintReport && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <LabReportPrint
            order={selectedOrder}
            onClose={() => setShowPrintReport(false)}
          />
        </div>
      )}
    </ClinicLayout>
  );
}
