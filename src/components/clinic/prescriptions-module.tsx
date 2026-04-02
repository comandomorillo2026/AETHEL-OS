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
  Pill,
  FileText,
  Printer,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  RefreshCw,
  Check,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Info,
  Calculator,
  Droplets,
  Activity,
  Heart,
  AlertCircle
} from 'lucide-react';

// Types
interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  strength: string;
  form: string;
  manufacturer: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  interactions: string[];
  sideEffects: string[];
  contraindications: string[];
}

interface PrescriptionItem {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  refills: number;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientWeight?: number;
  providerId: string;
  providerName: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  notes?: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  refillsRemaining: number;
  expiryDate: string;
}

// Demo medications database
const MEDICATIONS_DB: Medication[] = [
  {
    id: 'MED-001',
    name: 'Amoxicilina',
    genericName: 'Amoxicillin',
    category: 'Antibiótico',
    strength: '500mg',
    form: 'Cápsula',
    manufacturer: 'PharmaCorp',
    price: 25,
    stock: 150,
    requiresPrescription: true,
    interactions: ['Warfarina', 'Metotrexato', 'Alopurinol'],
    sideEffects: ['Náuseas', 'Diarrea', 'Erupción cutánea'],
    contraindications: ['Alergia a penicilina', 'Mononucleosis'],
  },
  {
    id: 'MED-002',
    name: 'Ibuprofeno',
    genericName: 'Ibuprofen',
    category: 'Antiinflamatorio',
    strength: '400mg',
    form: 'Tableta',
    manufacturer: 'MediLab',
    price: 15,
    stock: 200,
    requiresPrescription: false,
    interactions: ['Aspirina', 'Litio', 'Diuréticos'],
    sideEffects: ['Dolor estomacal', 'Mareos', 'Retención de líquidos'],
    contraindications: ['Úlcera péptica', 'Insuficiencia renal'],
  },
  {
    id: 'MED-003',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Antihipertensivo',
    strength: '10mg',
    form: 'Tableta',
    manufacturer: 'CardioHealth',
    price: 35,
    stock: 80,
    requiresPrescription: true,
    interactions: ['Potasio', 'Diuréticos', 'AINEs'],
    sideEffects: ['Tos seca', 'Mareos', 'Dolor de cabeza'],
    contraindications: ['Embarazo', 'Angioedema'],
  },
  {
    id: 'MED-004',
    name: 'Metformina',
    genericName: 'Metformin',
    category: 'Antidiabético',
    strength: '850mg',
    form: 'Tableta',
    manufacturer: 'GlucoCare',
    price: 30,
    stock: 120,
    requiresPrescription: true,
    interactions: ['Alcohol', 'Contraste yodado', 'Cimetidina'],
    sideEffects: ['Náuseas', 'Diarrea', 'Dolor abdominal'],
    contraindications: ['Insuficiencia renal', 'Acidosis láctica'],
  },
  {
    id: 'MED-005',
    name: 'Omeprazol',
    genericName: 'Omeprazole',
    category: 'Antiulceroso',
    strength: '20mg',
    form: 'Cápsula',
    manufacturer: 'GastroMed',
    price: 20,
    stock: 180,
    requiresPrescription: false,
    interactions: ['Clopidogrel', 'Ketoconazol', 'Hierro'],
    sideEffects: ['Dolor de cabeza', 'Náuseas', 'Dolor abdominal'],
    contraindications: ['Hipersensibilidad'],
  },
  {
    id: 'MED-006',
    name: 'Losartán',
    genericName: 'Losartan',
    category: 'Antihipertensivo',
    strength: '50mg',
    form: 'Tableta',
    manufacturer: 'CardioHealth',
    price: 40,
    stock: 90,
    requiresPrescription: true,
    interactions: ['Potasio', 'Diuréticos', 'AINEs'],
    sideEffects: ['Mareos', 'Hipotensión', 'Hiperpotasemia'],
    contraindications: ['Embarazo', 'Insuficiencia hepática'],
  },
  {
    id: 'MED-007',
    name: 'Atorvastatina',
    genericName: 'Atorvastatin',
    category: 'Hipolipemiante',
    strength: '20mg',
    form: 'Tableta',
    manufacturer: 'CardioHealth',
    price: 45,
    stock: 100,
    requiresPrescription: true,
    interactions: ['Eritromicina', 'Ciclosporina', 'Jugo de toronja'],
    sideEffects: ['Dolor muscular', 'Problemas hepáticos', 'Dolor de cabeza'],
    contraindications: ['Enfermedad hepática', 'Embarazo'],
  },
  {
    id: 'MED-008',
    name: 'Prednisona',
    genericName: 'Prednisone',
    category: 'Corticoide',
    strength: '20mg',
    form: 'Tableta',
    manufacturer: 'PharmaCorp',
    price: 28,
    stock: 75,
    requiresPrescription: true,
    interactions: ['AINEs', 'Diuréticos', 'Vacunas'],
    sideEffects: ['Aumento de peso', 'Insomnio', 'Cambios de humor'],
    contraindications: ['Infecciones fúngicas', 'Herpes ocular'],
  },
];

// Demo prescriptions
const DEMO_PRESCRIPTIONS: Prescription[] = [
  {
    id: '1',
    prescriptionNumber: 'RX-2026-001',
    patientId: 'PAT-001',
    patientName: 'María González',
    patientAge: 45,
    patientWeight: 65,
    providerId: '1',
    providerName: 'Dr. Ana García',
    date: '2026-03-20',
    diagnosis: 'Infección del tracto respiratorio superior',
    items: [
      { id: '1', medicationId: 'MED-001', medicationName: 'Amoxicilina 500mg', dosage: '500mg', frequency: 'Cada 8 horas', duration: '7 días', quantity: 21, instructions: 'Tomar con alimentos', refills: 0 },
      { id: '2', medicationId: 'MED-002', medicationName: 'Ibuprofeno 400mg', dosage: '400mg', frequency: 'Cada 8 horas', duration: '5 días', quantity: 15, instructions: 'Tomar después de las comidas', refills: 1 },
    ],
    status: 'active',
    refillsRemaining: 1,
    expiryDate: '2026-04-20',
  },
  {
    id: '2',
    prescriptionNumber: 'RX-2026-002',
    patientId: 'PAT-002',
    patientName: 'Carlos Rodríguez',
    patientAge: 58,
    patientWeight: 82,
    providerId: '2',
    providerName: 'Dr. Carlos Mendez',
    date: '2026-03-18',
    diagnosis: 'Hipertensión arterial',
    items: [
      { id: '1', medicationId: 'MED-003', medicationName: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Una vez al día', duration: '30 días', quantity: 30, instructions: 'Tomar por la mañana', refills: 3 },
    ],
    status: 'active',
    refillsRemaining: 3,
    expiryDate: '2026-06-18',
  },
  {
    id: '3',
    prescriptionNumber: 'RX-2026-003',
    patientId: 'PAT-003',
    patientName: 'Ana Martínez',
    patientAge: 35,
    patientWeight: 58,
    providerId: '1',
    providerName: 'Dr. Ana García',
    date: '2026-03-15',
    diagnosis: 'Diabetes mellitus tipo 2',
    items: [
      { id: '1', medicationId: 'MED-004', medicationName: 'Metformina 850mg', dosage: '850mg', frequency: 'Dos veces al día', duration: '30 días', quantity: 60, instructions: 'Tomar con las comidas principales', refills: 5 },
    ],
    status: 'active',
    refillsRemaining: 5,
    expiryDate: '2026-09-15',
  },
  {
    id: '4',
    prescriptionNumber: 'RX-2026-004',
    patientId: 'PAT-004',
    patientName: 'José Pérez',
    patientAge: 62,
    providerId: '2',
    providerName: 'Dr. Carlos Mendez',
    date: '2026-03-10',
    diagnosis: 'Dislipidemia',
    items: [
      { id: '1', medicationId: 'MED-007', medicationName: 'Atorvastatina 20mg', dosage: '20mg', frequency: 'Una vez al día', duration: '30 días', quantity: 30, instructions: 'Tomar por la noche', refills: 3 },
    ],
    status: 'completed',
    refillsRemaining: 0,
    expiryDate: '2026-04-10',
  },
];

const STATUS_CONFIG = {
  active: { label: 'Activa', color: 'bg-[var(--success)]/10 text-[var(--success)]', icon: Check },
  completed: { label: 'Completada', color: 'bg-[var(--nexus-violet)]/10 text-[var(--nexus-violet-lite)]', icon: Check },
  cancelled: { label: 'Cancelada', color: 'bg-[var(--error)]/10 text-[var(--error)]', icon: X },
  expired: { label: 'Vencida', color: 'bg-[var(--nexus-gold)]/10 text-[var(--nexus-gold)]', icon: Clock },
};

const FREQUENCY_OPTIONS = [
  'Una vez al día',
  'Dos veces al día',
  'Tres veces al día',
  'Cada 4 horas',
  'Cada 6 horas',
  'Cada 8 horas',
  'Cada 12 horas',
  'Según sea necesario',
];

const DURATION_OPTIONS = [
  '3 días',
  '5 días',
  '7 días',
  '10 días',
  '14 días',
  '30 días',
  '60 días',
  '90 días',
  'Uso crónico',
];

// Medication Search Component
function MedicationSearch({ 
  onSelect, 
  selectedMedications = [] 
}: { 
  onSelect: (medication: Medication) => void;
  selectedMedications?: string[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredMedications = MEDICATIONS_DB.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
      <Input
        placeholder="Buscar medicamento por nombre, genérico o categoría..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        className="pl-10"
      />
      {showResults && searchTerm && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowResults(false)}
          />
          <div className="absolute z-20 w-full mt-1 glass-card max-h-80 overflow-y-auto">
            {filteredMedications.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-mid)]">
                No se encontraron medicamentos
              </div>
            ) : (
              filteredMedications.map(med => (
                <div
                  key={med.id}
                  onClick={() => {
                    if (!selectedMedications.includes(med.id)) {
                      onSelect(med);
                      setSearchTerm('');
                      setShowResults(false);
                    }
                  }}
                  className={`p-3 border-b border-[var(--glass-border)] last:border-0 cursor-pointer transition-colors ${
                    selectedMedications.includes(med.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[var(--glass)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {med.name} {med.strength}
                      </p>
                      <p className="text-xs text-[var(--text-mid)]">
                        {med.genericName} • {med.form} • {med.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-dim)]">Stock</p>
                      <p className={`text-sm font-mono ${med.stock < 50 ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}>
                        {med.stock}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Drug Interaction Checker
function DrugInteractionChecker({ medications }: { medications: string[] }) {
  const interactions = useMemo(() => {
    const result: { drug1: string; drug2: string; severity: 'high' | 'moderate' | 'low'; description: string }[] = [];
    
    medications.forEach((medId, i) => {
      const med = MEDICATIONS_DB.find(m => m.id === medId);
      if (med) {
        med.interactions.forEach(interaction => {
          const otherMed = MEDICATIONS_DB.find(m => 
            m.name === interaction || m.genericName === interaction
          );
          if (otherMed && medications.includes(otherMed.id)) {
            result.push({
              drug1: med.name,
              drug2: otherMed.name,
              severity: med.requiresPrescription ? 'high' : 'moderate',
              description: `Posible interacción entre ${med.name} y ${otherMed.name}`
            });
          }
        });
      }
    });

    return result;
  }, [medications]);

  if (interactions.length === 0) return null;

  return (
    <div className="p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-[var(--error)]" />
        <h4 className="font-medium text-[var(--error)]">Advertencia de Interacciones</h4>
      </div>
      <div className="space-y-2">
        {interactions.map((interaction, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
              interaction.severity === 'high' ? 'bg-[var(--error)]' : 
              interaction.severity === 'moderate' ? 'bg-[var(--nexus-gold)]' : 'bg-[var(--nexus-aqua)]'
            }`} />
            <span className="text-[var(--text-mid)]">{interaction.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dosage Calculator
function DosageCalculator({ 
  weight, 
  onSelectDosage 
}: { 
  weight?: number;
  onSelectDosage: (dosage: string, frequency: string) => void;
}) {
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [calculatedDose, setCalculatedDose] = useState<{ dosage: string; frequency: string } | null>(null);

  const calculateDose = (med: Medication) => {
    if (!weight) return null;
    
    // Simplified dosage calculation (in real app, this would use proper medical formulas)
    const mgPerKg = med.category === 'Antibiótico' ? 10 : 5;
    const totalMg = weight * mgPerKg;
    const doses = med.category === 'Antibiótico' ? 3 : 2;
    const dosePerIntake = Math.round(totalMg / doses);
    
    return {
      dosage: `${dosePerIntake}mg`,
      frequency: doses === 3 ? 'Cada 8 horas' : 'Dos veces al día'
    };
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[var(--nexus-violet-lite)]" />
        <h4 className="font-medium text-[var(--text-primary)]">Calculadora de Dosis</h4>
      </div>

      {!weight ? (
        <p className="text-sm text-[var(--text-mid)]">Ingrese el peso del paciente para usar la calculadora</p>
      ) : (
        <>
          <p className="text-sm text-[var(--text-mid)] mb-3">Peso del paciente: <span className="text-[var(--text-primary)] font-medium">{weight} kg</span></p>
          
          <select
            className="w-full h-10 px-3 rounded-lg mb-3"
            value={selectedMed?.id || ''}
            onChange={(e) => {
              const med = MEDICATIONS_DB.find(m => m.id === e.target.value);
              setSelectedMed(med || null);
              if (med) {
                const dose = calculateDose(med);
                setCalculatedDose(dose);
              }
            }}
          >
            <option value="">Seleccionar medicamento</option>
            {MEDICATIONS_DB.map(med => (
              <option key={med.id} value={med.id}>{med.name} - {med.category}</option>
            ))}
          </select>

          {calculatedDose && (
            <div className="p-3 rounded-lg bg-[var(--nexus-violet)]/10 mb-3">
              <p className="text-sm text-[var(--text-mid)] mb-2">Dosis calculada:</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-[var(--nexus-violet-lite)]">{calculatedDose.dosage}</p>
                  <p className="text-sm text-[var(--text-mid)]">{calculatedDose.frequency}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectDosage(calculatedDose.dosage, calculatedDose.frequency)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-[var(--text-dim)]">
            * La dosis calculada es una sugerencia. Siempre verifique las guías clínicas.
          </p>
        </>
      )}
    </div>
  );
}

// Prescription Form
function PrescriptionForm({ 
  prescription, 
  onSave, 
  onCancel 
}: { 
  prescription?: Prescription | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [patientName, setPatientName] = useState(prescription?.patientName || '');
  const [patientAge, setPatientAge] = useState(prescription?.patientAge?.toString() || '');
  const [patientWeight, setPatientWeight] = useState(prescription?.patientWeight?.toString() || '');
  const [diagnosis, setDiagnosis] = useState(prescription?.diagnosis || '');
  const [notes, setNotes] = useState(prescription?.notes || '');
  const [items, setItems] = useState<PrescriptionItem[]>(prescription?.items || []);

  const addMedication = (med: Medication) => {
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      medicationId: med.id,
      medicationName: `${med.name} ${med.strength}`,
      dosage: med.strength,
      frequency: '',
      duration: '7 días',
      quantity: 0,
      instructions: '',
      refills: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyDosage = (itemId: string, dosage: string, frequency: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, dosage, frequency } : item
    ));
  };

  return (
    <div className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
        {prescription ? 'Editar Receta' : 'Nueva Receta'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Patient Selection */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[var(--text-mid)]">Paciente *</Label>
              <Input
                placeholder="Nombre del paciente"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--text-mid)]">Edad</Label>
              <Input
                type="number"
                placeholder="Años"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[var(--text-mid)]">Peso (kg)</Label>
              <Input
                type="number"
                placeholder="Peso en kg"
                value={patientWeight}
                onChange={(e) => setPatientWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--text-mid)]">Diagnóstico *</Label>
              <Input
                placeholder="Diagnóstico"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
          </div>

          {/* Medication Search */}
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Agregar Medicamento</Label>
            <MedicationSearch 
              onSelect={addMedication} 
              selectedMedications={items.map(i => i.medicationId)}
            />
          </div>

          {/* Drug Interactions */}
          <DrugInteractionChecker medications={items.map(i => i.medicationId)} />

          {/* Medications List */}
          <div className="space-y-4">
            <Label className="text-[var(--text-mid)]">Medicamentos</Label>
            {items.length === 0 ? (
              <div className="border border-dashed border-[var(--glass-border)] rounded-lg p-8 text-center text-[var(--text-mid)]">
                <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Busque y agregue medicamentos a la receta</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => {
                  const med = MEDICATIONS_DB.find(m => m.id === item.medicationId);
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-[var(--glass)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                            <Pill className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{item.medicationName}</p>
                            <p className="text-xs text-[var(--text-mid)]">{med?.category}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded hover:bg-[var(--error)]/10 text-[var(--error)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Dosis</Label>
                          <Input
                            value={item.dosage}
                            onChange={(e) => updateItem(item.id, 'dosage', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Frecuencia</Label>
                          <select
                            value={item.frequency}
                            onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                            className="w-full h-8 px-2 rounded-lg text-sm"
                          >
                            <option value="">Seleccionar</option>
                            {FREQUENCY_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Duración</Label>
                          <select
                            value={item.duration}
                            onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                            className="w-full h-8 px-2 rounded-lg text-sm"
                          >
                            {DURATION_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Cantidad</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Instrucciones</Label>
                          <Input
                            placeholder="Indicaciones especiales..."
                            value={item.instructions}
                            onChange={(e) => updateItem(item.id, 'instructions', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-[var(--text-dim)]">Reposiciones</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.refills}
                            onChange={(e) => updateItem(item.id, 'refills', parseInt(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[var(--text-mid)]">Notas Adicionales</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales para el paciente..."
              className="w-full h-20 px-3 py-2 rounded-lg resize-none"
            />
          </div>
        </div>

        {/* Right Column - Tools */}
        <div className="space-y-4">
          <DosageCalculator 
            weight={patientWeight ? parseInt(patientWeight) : undefined}
            onSelectDosage={(dosage, frequency) => {
              if (items.length > 0) {
                applyDosage(items[items.length - 1].id, dosage, frequency);
              }
            }}
          />

          {/* Medication Info */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[var(--nexus-aqua)]" />
              <h4 className="font-medium text-[var(--text-primary)]">Información</h4>
            </div>
            <div className="space-y-2 text-xs text-[var(--text-mid)]">
              <p>• Verifique alergias del paciente</p>
              <p>• Considere interacciones medicamentosas</p>
              <p>• Ajuste dosis en insuficiencia renal/hepática</p>
              <p>• Indique claramente la duración del tratamiento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="flex-1 btn-gold" onClick={onSave} disabled={items.length === 0 || !patientName || !diagnosis}>
          {prescription ? 'Actualizar Receta' : 'Crear Receta'}
        </Button>
      </div>
    </div>
  );
}

// Prescription Preview/Print
function PrescriptionPreview({ prescription, onClose }: { prescription: Prescription; onClose: () => void }) {
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto print:bg-white print:text-black">
      <div className="flex justify-between items-start mb-6 print:hidden">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Vista Previa</h2>
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
          NexusOS Clinic
        </h1>
        <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Receta Médica</p>
      </div>

      {/* Prescription Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">PACIENTE</p>
          <p className="font-medium text-[var(--text-primary)] print:text-black">{prescription.patientName}</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">Edad: {prescription.patientAge} años</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">FECHA</p>
          <p className="text-sm text-[var(--text-primary)] print:text-black">{prescription.date}</p>
          <p className="text-xs text-[var(--text-mid)] print:text-gray-600">{prescription.prescriptionNumber}</p>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">DIAGNÓSTICO</p>
        <p className="text-sm text-[var(--text-primary)] print:text-black">{prescription.diagnosis}</p>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-2">MEDICAMENTOS</p>
        <div className="space-y-4">
          {prescription.items.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-lg bg-[var(--glass)] print:bg-gray-50 print:border print:border-gray-200">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--nexus-violet)]/20 flex items-center justify-center text-sm text-[var(--nexus-violet-lite)] print:bg-purple-100 print:text-purple-600">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)] print:text-black">{item.medicationName}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-[var(--text-mid)] print:text-gray-600">
                    <div><span className="text-[var(--text-dim)] print:text-gray-400">Dosis:</span> {item.dosage}</div>
                    <div><span className="text-[var(--text-dim)] print:text-gray-400">Frecuencia:</span> {item.frequency}</div>
                    <div><span className="text-[var(--text-dim)] print:text-gray-400">Duración:</span> {item.duration}</div>
                    <div><span className="text-[var(--text-dim)] print:text-gray-400">Cantidad:</span> {item.quantity}</div>
                  </div>
                  {item.instructions && (
                    <p className="mt-2 text-sm text-[var(--nexus-gold)] print:text-amber-600">
                      📋 {item.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div className="mb-6">
          <p className="text-xs text-[var(--text-dim)] print:text-gray-500 mb-1">NOTAS</p>
          <p className="text-sm text-[var(--text-mid)] print:text-gray-600">{prescription.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--glass-border)] print:border-gray-200">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-[var(--text-dim)] print:text-gray-500">Válido hasta</p>
            <p className="text-sm text-[var(--text-primary)] print:text-black">{prescription.expiryDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-dim)] print:text-gray-500">Médico</p>
            <p className="font-medium text-[var(--text-primary)] print:text-black">{prescription.providerName}</p>
            <div className="w-32 mt-4 border-b border-[var(--text-mid)] print:border-gray-400"></div>
            <p className="text-xs text-[var(--text-dim)] print:text-gray-400 mt-1">Firma</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Prescriptions Module
export function PrescriptionsModule() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredPrescriptions = DEMO_PRESCRIPTIONS.filter(pres => {
    const matchesSearch = pres.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pres.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pres.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ClinicLayout activeTab="records">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Recetas Médicas</h1>
          <p className="text-[var(--text-mid)] text-sm">Gestión de prescripciones</p>
        </div>
        <Button className="btn-gold" onClick={() => setShowNewPrescription(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Receta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Total Recetas</p>
          <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_PRESCRIPTIONS.length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Activas</p>
          <p className="text-xl font-bold text-[var(--success)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_PRESCRIPTIONS.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Reposiciones</p>
          <p className="text-xl font-bold text-[var(--nexus-aqua)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {DEMO_PRESCRIPTIONS.reduce((sum, p) => sum + p.refillsRemaining, 0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-mid)]">Por Vencer</p>
          <p className="text-xl font-bold text-[var(--nexus-gold)]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            2
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <Input
            placeholder="Buscar por paciente o número de receta..."
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
          <option value="active">Activas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="expired">Vencidas</option>
        </select>
      </div>

      {/* Prescriptions List */}
      <div className="glass-card p-4 md:p-6">
        <div className="max-h-[600px] overflow-y-auto space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-mid)]">
              No se encontraron recetas
            </div>
          ) : (
            filteredPrescriptions.map(prescription => {
              const StatusIcon = STATUS_CONFIG[prescription.status].icon;
              return (
                <div
                  key={prescription.id}
                  className="p-4 rounded-lg bg-[var(--glass)] hover:bg-[var(--nexus-violet)]/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--nexus-violet)] to-[var(--nexus-fuchsia)] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-[var(--nexus-violet-lite)]">{prescription.prescriptionNumber}</p>
                        <p className="font-medium text-[var(--text-primary)]">{prescription.patientName}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${STATUS_CONFIG[prescription.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {STATUS_CONFIG[prescription.status].label}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-[var(--text-dim)] mb-1">Diagnóstico</p>
                    <p className="text-sm text-[var(--text-mid)]">{prescription.diagnosis}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {prescription.items.map(item => (
                      <span key={item.id} className="px-2 py-1 rounded bg-[var(--nexus-violet)]/10 text-xs text-[var(--nexus-violet-lite)]">
                        {item.medicationName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-mid)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {prescription.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {prescription.providerName}
                      </div>
                    </div>
                    {prescription.refillsRemaining > 0 && (
                      <div className="flex items-center gap-1 text-[var(--nexus-aqua)]">
                        <RefreshCw className="w-3 h-3" />
                        {prescription.refillsRemaining} reposiciones
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Prescription Details */}
      {selectedPrescription && !showPreview && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 glass-card p-4 z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[var(--text-primary)]">Detalles de Receta</h3>
            <button onClick={() => setSelectedPrescription(null)} className="p-1 rounded hover:bg-[var(--glass)]">
              <X className="w-4 h-4 text-[var(--text-mid)]" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-[var(--text-dim)]">Paciente</p>
              <p className="text-sm text-[var(--text-primary)]">{selectedPrescription.patientName}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-dim)]">Medicamentos</p>
              <div className="space-y-1">
                {selectedPrescription.items.map(item => (
                  <p key={item.id} className="text-sm text-[var(--text-mid)]">
                    • {item.medicationName} - {item.dosage} {item.frequency}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-1" />
              Imprimir
            </Button>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showNewPrescription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <PrescriptionForm
            onSave={() => setShowNewPrescription(false)}
            onCancel={() => setShowNewPrescription(false)}
          />
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <PrescriptionPreview
            prescription={selectedPrescription}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}
    </ClinicLayout>
  );
}
