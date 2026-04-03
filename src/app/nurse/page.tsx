'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  ClipboardList,
  Activity,
  Pill,
  FileText,
  BookOpen,
  CheckSquare,
  Clock,
  AlertTriangle,
  Heart,
  Thermometer,
  Droplets,
  Stethoscope,
  UserCheck,
  Send,
  Plus,
  CheckCircle2,
  XCircle,
  Pause,
  Search,
  ChevronRight,
  Calendar,
  Bell,
  Menu,
  X,
  LogOut,
  ArrowRightLeft,
  Zap,
  Timer,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Patient {
  id: string;
  name: string;
  room: string;
  age: number;
  diagnosis: string;
  avatar: string;
}

interface Task {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  category: 'medication' | 'vitals' | 'hygiene' | 'feeding' | 'procedure' | 'documentation';
  title: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  dueTime: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface Medication {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  medication: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  status: 'pending' | 'administered' | 'held' | 'refused';
  isHighRisk: boolean;
}

interface Handoff {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  createdAt: string;
  fromNurse: string;
  toNurse: string;
  status: 'pending' | 'acknowledged';
}

interface VitalSigns {
  patientId: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  tempUnit: 'C' | 'F';
  respiratoryRate: number;
  oxygenSat: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodGlucose?: number;
  painLevel: number;
}

interface NursingNote {
  id: string;
  patientId: string;
  patientName: string;
  type: 'progress' | 'assessment' | 'incident' | 'procedure';
  content: string;
  createdAt: string;
  shift: 'day' | 'night';
}

interface Protocol {
  id: string;
  title: string;
  category: 'emergency' | 'medication' | 'procedure' | 'care' | 'safety';
  steps: string[];
  equipment: string[];
}

interface Checklist {
  id: string;
  title: string;
  type: 'shift' | 'admission' | 'discharge';
  items: { id: string; text: string; completed: boolean }[];
}

// ============================================
// MOCK DATA
// ============================================

const mockPatients: Patient[] = [
  { id: '1', name: 'Maria Santos', room: '101-A', age: 67, diagnosis: 'CHF Exacerbation', avatar: 'MS' },
  { id: '2', name: 'Juan Reyes', room: '102-B', age: 45, diagnosis: 'Post-Appendectomy', avatar: 'JR' },
  { id: '3', name: 'Ana Cruz', room: '103-C', age: 82, diagnosis: 'Pneumonia', avatar: 'AC' },
  { id: '4', name: 'Carlos Garcia', room: '104-A', age: 55, diagnosis: 'DKA', avatar: 'CG' },
  { id: '5', name: 'Lucia Mendez', room: '105-B', age: 38, diagnosis: 'Pre-eclampsia', avatar: 'LM' },
];

const mockTasks: Task[] = [
  { id: '1', patientId: '1', patientName: 'Maria Santos', room: '101-A', category: 'medication', title: 'Administer Lasix 40mg IV', priority: 'high', dueTime: '08:00', status: 'pending' },
  { id: '2', patientId: '1', patientName: 'Maria Santos', room: '101-A', category: 'vitals', title: 'Check vitals q4h', priority: 'normal', dueTime: '08:00', status: 'pending' },
  { id: '3', patientId: '2', patientName: 'Juan Reyes', room: '102-B', category: 'procedure', title: 'Wound dressing change', priority: 'high', dueTime: '09:00', status: 'pending' },
  { id: '4', patientId: '3', patientName: 'Ana Cruz', room: '103-C', category: 'medication', title: 'Administer antibiotics', priority: 'critical', dueTime: '08:30', status: 'pending' },
  { id: '5', patientId: '3', patientName: 'Ana Cruz', room: '103-C', category: 'hygiene', title: 'Bed bath and linen change', priority: 'normal', dueTime: '10:00', status: 'pending' },
  { id: '6', patientId: '4', patientName: 'Carlos Garcia', room: '104-A', category: 'vitals', title: 'Blood glucose check', priority: 'critical', dueTime: '07:30', status: 'in_progress' },
  { id: '7', patientId: '4', patientName: 'Carlos Garcia', room: '104-A', category: 'feeding', title: 'Diabetic meal assistance', priority: 'normal', dueTime: '12:00', status: 'pending' },
  { id: '8', patientId: '5', patientName: 'Lucia Mendez', room: '105-B', category: 'vitals', title: 'Fetal heart rate monitoring', priority: 'high', dueTime: '08:00', status: 'pending' },
  { id: '9', patientId: '5', patientName: 'Lucia Mendez', room: '105-B', category: 'documentation', title: 'Update care plan', priority: 'low', dueTime: '14:00', status: 'pending' },
];

const mockMedications: Medication[] = [
  { id: '1', patientId: '1', patientName: 'Maria Santos', room: '101-A', medication: 'Lasix', dosage: '40mg', route: 'IV', scheduledTime: '08:00', status: 'pending', isHighRisk: false },
  { id: '2', patientId: '1', patientName: 'Maria Santos', room: '101-A', medication: 'Metoprolol', dosage: '25mg', route: 'PO', scheduledTime: '09:00', status: 'pending', isHighRisk: true },
  { id: '3', patientId: '2', patientName: 'Juan Reyes', room: '102-B', medication: 'Morphine', dosage: '4mg', route: 'IV', scheduledTime: '08:00', status: 'pending', isHighRisk: true },
  { id: '4', patientId: '3', patientName: 'Ana Cruz', room: '103-C', medication: 'Azithromycin', dosage: '500mg', route: 'IV', scheduledTime: '08:30', status: 'pending', isHighRisk: false },
  { id: '5', patientId: '4', patientName: 'Carlos Garcia', room: '104-A', medication: 'Insulin Regular', dosage: '8 units', route: 'SC', scheduledTime: '07:30', status: 'pending', isHighRisk: true },
  { id: '6', patientId: '5', patientName: 'Lucia Mendez', room: '105-B', medication: 'Magnesium Sulfate', dosage: '4g', route: 'IV', scheduledTime: '08:00', status: 'pending', isHighRisk: true },
];

const mockHandoffs: Handoff[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Maria Santos',
    room: '101-A',
    situation: 'Patient showing improved respiratory status. Oxygen requirement reduced to 2L.',
    background: 'Admitted 3 days ago with CHF exacerbation. History of HTN, DM2, and AFib.',
    assessment: 'Lungs clear bilaterally. Edema decreasing. BNP trending down. Alert and oriented.',
    recommendation: 'Continue current diuretic regimen. Monitor I/O strictly. PT evaluation tomorrow.',
    createdAt: '07:45',
    fromNurse: 'Elena Rodriguez, RN (Night Shift)',
    toNurse: 'Current Shift',
    status: 'pending'
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Ana Cruz',
    room: '103-C',
    situation: 'Elderly patient with pneumonia, requiring frequent monitoring.',
    background: '82yo female with COPD, admitted for community-acquired pneumonia.',
    assessment: 'Productive cough, SpO2 94% on 3L NC. Afebrile since yesterday. Still weak.',
    recommendation: 'Continue antibiotics. Encourage incentive spirometry. Fall risk precautions.',
    createdAt: '07:50',
    fromNurse: 'Miguel Torres, RN (Night Shift)',
    toNurse: 'Current Shift',
    status: 'acknowledged'
  },
];

const mockProtocols: Protocol[] = [
  {
    id: '1',
    title: 'Code Blue - Adult',
    category: 'emergency',
    steps: [
      'Call for help and activate code blue',
      'Start CPR - 30 compressions, 2 breaths',
      'Attach AED/defibrillator when available',
      'Establish IV access',
      'Administer medications per ACLS protocol',
      'Continue until ROSC or termination'
    ],
    equipment: ['AED/Defibrillator', 'Crash cart', 'IV supplies', 'Airway kit', 'Suction']
  },
  {
    id: '2',
    title: 'Insulin Administration',
    category: 'medication',
    steps: [
      'Verify patient identity using 2 identifiers',
      'Check blood glucose level',
      'Verify insulin type, dose, and expiration',
      'Draw up correct dose with another RN verification',
      'Select appropriate injection site',
      'Administer SC and document'
    ],
    equipment: ['Glucose meter', 'Insulin vial/pen', 'Syringe', 'Alcohol swabs', 'Sharps container']
  },
  {
    id: '3',
    title: 'Fall Prevention Protocol',
    category: 'safety',
    steps: [
      'Assess fall risk using Morse scale',
      'Apply fall risk armband',
      'Place patient in low bed position',
      'Ensure call light within reach',
      'Remove obstacles from pathway',
      'Educate patient and family on fall prevention'
    ],
    equipment: ['Fall risk armband', 'Non-slip socks', 'Bed alarm', 'Call light']
  },
  {
    id: '4',
    title: 'Wound Care - Pressure Ulcer',
    category: 'procedure',
    steps: [
      'Assess wound using PUSH tool',
      'Clean wound with normal saline',
      'Apply appropriate dressing per wound type',
      'Document wound measurements and appearance',
      'Reposition patient every 2 hours',
      'Notify wound care nurse if needed'
    ],
    equipment: ['Sterile gloves', 'Normal saline', 'Gauze', 'Appropriate dressing', 'Measuring guide']
  },
  {
    id: '5',
    title: 'Blood Transfusion',
    category: 'procedure',
    steps: [
      'Verify physician order and consent',
      'Obtain baseline vitals',
      'Verify blood product with another RN',
      'Start with slow rate for first 15 min',
      'Monitor for transfusion reactions',
      'Document and complete within 4 hours'
    ],
    equipment: ['Blood product', 'IV tubing', 'Normal saline', 'Vitals equipment', 'Emergency medications']
  },
];

const mockChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Morning Shift Checklist',
    type: 'shift',
    items: [
      { id: '1', text: 'Receive handoff report from night shift', completed: true },
      { id: '2', text: 'Review patient assignments', completed: true },
      { id: '3', text: 'Check crash cart and emergency equipment', completed: true },
      { id: '4', text: 'Verify medication cart supplies', completed: false },
      { id: '5', text: 'Review patient charts and new orders', completed: false },
      { id: '6', text: 'Complete initial patient rounds', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Admission Checklist',
    type: 'admission',
    items: [
      { id: '1', text: 'Verify patient identity', completed: false },
      { id: '2', text: 'Complete nursing assessment', completed: false },
      { id: '3', text: 'Obtain vital signs', completed: false },
      { id: '4', text: 'Review medication reconciliation', completed: false },
      { id: '5', text: 'Apply ID bands and allergy band', completed: false },
      { id: '6', text: 'Complete fall risk assessment', completed: false },
      { id: '7', text: 'Educate patient on unit routine', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Discharge Checklist',
    type: 'discharge',
    items: [
      { id: '1', text: 'Verify discharge order', completed: false },
      { id: '2', text: 'Complete discharge teaching', completed: false },
      { id: '3', text: 'Provide medication instructions', completed: false },
      { id: '4', text: 'Schedule follow-up appointments', completed: false },
      { id: '5', text: 'Provide discharge summary', completed: false },
      { id: '6', text: 'Assist with transportation', completed: false },
    ]
  },
];

// ============================================
// UTILITY COMPONENTS
// ============================================

function StatCard({ title, value, subtitle, icon: Icon, color, onClick }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'violet' | 'gold' | 'aqua' | 'success' | 'error';
  onClick?: () => void;
}) {
  const colors = {
    violet: 'from-[#6C3FCE] to-[#C026D3]',
    gold: 'from-[#F0B429] to-[#d97706]',
    aqua: 'from-[#22D3EE] to-[#3B82F6]',
    success: 'from-[#34D399] to-[#059669]',
    error: 'from-[#F87171] to-[#dc2626]',
  };

  return (
    <div
      className="glass-card p-4 cursor-pointer hover:border-[rgba(167,139,250,0.3)] transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9D7BEA] text-sm">{title}</p>
          <p className="text-2xl font-bold text-[#EDE9FE] mt-1" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-[rgba(167,139,250,0.5)] mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: 'bg-[#34D399]/10 text-[#34D399] border-[#34D399]/20',
    normal: 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20',
    high: 'bg-[#F0B429]/10 text-[#F0B429] border-[#F0B429]/20',
    critical: 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20 animate-pulse',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[priority] || styles.normal}`}>
      {priority.toUpperCase()}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const icons: Record<string, React.ElementType> = {
    medication: Pill,
    vitals: Activity,
    hygiene: Heart,
    feeding: Users,
    procedure: Stethoscope,
    documentation: FileText,
  };

  const colors: Record<string, string> = {
    medication: 'bg-[#C026D3]/20 text-[#E879F9]',
    vitals: 'bg-[#22D3EE]/20 text-[#22D3EE]',
    hygiene: 'bg-[#34D399]/20 text-[#34D399]',
    feeding: 'bg-[#F0B429]/20 text-[#F0B429]',
    procedure: 'bg-[#6C3FCE]/20 text-[#B197FC]',
    documentation: 'bg-[#3B82F6]/20 text-[#3B82F6]',
  };

  const Icon = icons[category] || FileText;

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${colors[category] || colors.documentation}`}>
      <Icon className="w-3 h-3" />
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

import { NurseRoute } from '@/components/auth/protected-layout';

function NursePortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [vitalsForm, setVitalsForm] = useState<Partial<VitalSigns>>({
    tempUnit: 'C',
    painLevel: 0,
  });
  const [noteForm, setNoteForm] = useState({
    patientId: '',
    type: 'progress' as const,
    content: '',
  });
  const [handoffForm, setHandoffForm] = useState({
    patientId: '',
    situation: '',
    background: '',
    assessment: '',
    recommendation: '',
  });
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>('all');
  const [protocolSearch, setProtocolSearch] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  // Mock data state
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [notes, setNotes] = useState<NursingNote[]>([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate shift time remaining
  const getShiftTimeRemaining = () => {
    const now = currentTime;
    const shiftEnd = new Date(now);
    shiftEnd.setHours(19, 0, 0, 0); // 7 PM shift end
    const diff = shiftEnd.getTime() - now.getTime();
    if (diff < 0) return '0:00';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Task handlers
  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'completed' } : t
    ));
  };

  // Medication handlers
  const handleMedAdminister = (medId: string) => {
    setMedications(medications.map(m =>
      m.id === medId ? { ...m, status: 'administered' } : m
    ));
  };

  const handleMedHold = (medId: string) => {
    setMedications(medications.map(m =>
      m.id === medId ? { ...m, status: 'held' } : m
    ));
  };

  // Checklist handlers
  const handleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: c.items.map(i =>
            i.id === itemId ? { ...i, completed: !i.completed } : i
          )
        };
      }
      return c;
    }));
  };

  // Note handler
  const handleAddNote = () => {
    if (noteForm.patientId && noteForm.content) {
      const patient = mockPatients.find(p => p.id === noteForm.patientId);
      const newNote: NursingNote = {
        id: Date.now().toString(),
        patientId: noteForm.patientId,
        patientName: patient?.name || '',
        type: noteForm.type,
        content: noteForm.content,
        createdAt: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        shift: currentTime.getHours() >= 7 && currentTime.getHours() < 19 ? 'day' : 'night',
      };
      setNotes([newNote, ...notes]);
      setNoteForm({ patientId: '', type: 'progress', content: '' });
    }
  };

  // Calculate stats
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const dueMedications = medications.filter(m => m.status === 'pending').length;

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (taskFilter !== 'all' && t.status !== taskFilter) return false;
    if (taskCategoryFilter !== 'all' && t.category !== taskCategoryFilter) return false;
    return true;
  });

  // Filter protocols
  const filteredProtocols = mockProtocols.filter(p => {
    if (protocolSearch) {
      return p.title.toLowerCase().includes(protocolSearch.toLowerCase()) ||
             p.category.toLowerCase().includes(protocolSearch.toLowerCase());
    }
    return true;
  });

  // Nav items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'handoff', label: 'Shift Handoff', icon: ArrowRightLeft },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'vitals', label: 'Vital Signs', icon: Heart },
    { id: 'mar', label: 'MAR', icon: Pill },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'protocols', label: 'Protocols', icon: BookOpen },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare },
  ];

  // Alert for abnormal vitals
  const checkVitalAlerts = () => {
    const alerts: string[] = [];
    if (vitalsForm.systolic && (vitalsForm.systolic > 140 || vitalsForm.systolic < 90)) {
      alerts.push('Blood pressure outside normal range');
    }
    if (vitalsForm.diastolic && (vitalsForm.diastolic > 90 || vitalsForm.diastolic < 60)) {
      alerts.push('Diastolic pressure outside normal range');
    }
    if (vitalsForm.heartRate && (vitalsForm.heartRate > 100 || vitalsForm.heartRate < 60)) {
      alerts.push('Heart rate outside normal range');
    }
    if (vitalsForm.oxygenSat && vitalsForm.oxygenSat < 95) {
      alerts.push('Oxygen saturation below 95%');
    }
    if (vitalsForm.bloodGlucose && (vitalsForm.bloodGlucose > 180 || vitalsForm.bloodGlucose < 70)) {
      alerts.push('Blood glucose outside normal range');
    }
    return alerts;
  };

  const vitalAlerts = checkVitalAlerts();

  return (
    <div className="min-h-screen bg-[#050410]">
      {/* Aurora Background */}
      <div className="aurora-bg" />

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-[#0A0820]/90 backdrop-blur-xl border-b border-[rgba(167,139,250,0.1)] flex items-center justify-between px-4 sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="text-[#EDE9FE]">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[#EDE9FE]">Nurse Portal</span>
        </div>
        <button className="relative">
          <Bell className="w-5 h-5 text-[#9D7BEA]" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#F0B429]" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <aside className="w-72 h-full bg-[#0A0820]" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b border-[rgba(167,139,250,0.1)]">
              <span className="font-bold text-[#EDE9FE]">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-[#9D7BEA]" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === item.id
                          ? 'bg-[#6C3FCE]/20 text-[#B197FC]'
                          : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.07)]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-[#0A0820]/80 backdrop-blur-xl border-r border-[rgba(167,139,250,0.1)] flex-col hidden lg:flex min-h-screen sticky top-0">
          <div className="p-6 border-b border-[rgba(167,139,250,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  NexusOS
                </h1>
                <p className="text-xs text-[#34D399]">Nurse Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeTab === item.id
                        ? 'bg-[#6C3FCE]/20 text-[#B197FC]'
                        : 'text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.07)] hover:text-[#EDE9FE]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-[rgba(167,139,250,0.1)]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">SR</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#EDE9FE] truncate">Sandra Rodriguez</p>
                <p className="text-xs text-[rgba(167,139,250,0.5)]">Day Shift RN</p>
              </div>
              <button className="text-[rgba(167,139,250,0.5)] hover:text-[#F87171] transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <header className="h-16 bg-[#0A0820]/50 backdrop-blur-xl border-b border-[rgba(167,139,250,0.1)] items-center justify-between px-6 hidden lg:flex sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-[#EDE9FE]">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#9D7BEA]">
                <Calendar className="w-4 h-4" />
                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[rgba(108,63,206,0.07)] transition-colors">
              <Bell className="w-5 h-5 text-[#9D7BEA]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F0B429]" />
            </button>
          </header>

          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Header */}
                <div className="glass-card p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Good Morning, Sandra
                      </h1>
                      <p className="text-[#9D7BEA] mt-1">
                        Day Shift | Started at 07:00 AM
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-[#9D7BEA]">Current Time</p>
                        <p className="text-2xl font-bold text-[#EDE9FE]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="w-px h-12 bg-[rgba(167,139,250,0.2)]" />
                      <div className="text-right">
                        <p className="text-sm text-[#9D7BEA]">Shift Ends In</p>
                        <p className="text-2xl font-bold text-[#F0B429]" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                          {getShiftTimeRemaining()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Patients Assigned"
                    value={mockPatients.length}
                    subtitle="Active patients"
                    icon={Users}
                    color="violet"
                  />
                  <StatCard
                    title="Tasks Pending"
                    value={pendingTasks}
                    subtitle={`${completedTasks} completed`}
                    icon={ClipboardList}
                    color="gold"
                  />
                  <StatCard
                    title="Medications Due"
                    value={dueMedications}
                    subtitle="Next 2 hours"
                    icon={Pill}
                    color="aqua"
                  />
                  <StatCard
                    title="Shift Time"
                    value={getShiftTimeRemaining()}
                    subtitle="Remaining"
                    icon={Timer}
                    color="success"
                  />
                </div>

                {/* Quick Actions & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Critical Tasks */}
                  <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#EDE9FE]">Critical & High Priority Tasks</h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')}>
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {tasks.filter(t => (t.priority === 'critical' || t.priority === 'high') && t.status !== 'completed').slice(0, 4).map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)] transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <PriorityBadge priority={task.priority} />
                              <CategoryBadge category={task.category} />
                            </div>
                            <p className="text-sm text-[#EDE9FE]">{task.title}</p>
                            <p className="text-xs text-[#9D7BEA]">{task.patientName} - Room {task.room}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono text-[#F0B429]">{task.dueTime}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTaskComplete(task.id)}
                              className="mt-1"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="space-y-4">
                    <div className="glass-card p-4 border-l-4 border-l-[#F87171]">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#F87171] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#EDE9FE]">Critical Alerts</p>
                          <ul className="text-xs text-[#9D7BEA] mt-2 space-y-1">
                            <li>• Carlos Garcia - DKA: Check glucose STAT</li>
                            <li>• Lucia Mendez - Pre-eclampsia: BP rising</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 border-l-4 border-l-[#F0B429]">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#F0B429] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#EDE9FE]">Due Soon</p>
                          <ul className="text-xs text-[#9D7BEA] mt-2 space-y-1">
                            <li>• Medication due in 15 min (3 patients)</li>
                            <li>• Vital signs check (2 patients)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4 border-l-4 border-l-[#34D399]">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-[#34D399] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#EDE9FE]">Handoff Status</p>
                          <p className="text-xs text-[#9D7BEA] mt-2">
                            2 pending handoffs to acknowledge
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Patients */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Assigned Patients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockPatients.map(patient => (
                      <div key={patient.id} className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)] transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{patient.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-[#EDE9FE]">{patient.name}</p>
                            <p className="text-xs text-[#9D7BEA]">Room {patient.room}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[rgba(167,139,250,0.7)]">{patient.diagnosis}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-[#22D3EE]/20 text-[#22D3EE] px-2 py-0.5 rounded">
                            {patient.age} years
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shift Handoff Tab */}
            {activeTab === 'handoff' && (
              <div className="space-y-6">
                <Tabs defaultValue="receive" className="w-full">
                  <TabsList className="bg-[rgba(108,63,206,0.07)]">
                    <TabsTrigger value="receive">Receive Handoff</TabsTrigger>
                    <TabsTrigger value="create">Create Handoff</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="receive" className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-[#EDE9FE]">Pending Handoffs</h3>
                    {mockHandoffs.map(handoff => (
                      <div key={handoff.id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3FCE] to-[#C026D3] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {handoff.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-[#EDE9FE]">{handoff.patientName}</p>
                              <p className="text-xs text-[#9D7BEA]">Room {handoff.room} | From: {handoff.fromNurse}</p>
                            </div>
                          </div>
                          <Badge variant={handoff.status === 'pending' ? 'default' : 'secondary'}>
                            {handoff.status === 'pending' ? 'Pending' : 'Acknowledged'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20">
                              <p className="text-xs font-medium text-[#F87171] mb-1">SITUATION</p>
                              <p className="text-sm text-[#EDE9FE]">{handoff.situation}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                              <p className="text-xs font-medium text-[#22D3EE] mb-1">BACKGROUND</p>
                              <p className="text-sm text-[#EDE9FE]">{handoff.background}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-[#F0B429]/10 border border-[#F0B429]/20">
                              <p className="text-xs font-medium text-[#F0B429] mb-1">ASSESSMENT</p>
                              <p className="text-sm text-[#EDE9FE]">{handoff.assessment}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#34D399]/10 border border-[#34D399]/20">
                              <p className="text-xs font-medium text-[#34D399] mb-1">RECOMMENDATION</p>
                              <p className="text-sm text-[#EDE9FE]">{handoff.recommendation}</p>
                            </div>
                          </div>
                        </div>

                        {handoff.status === 'pending' && (
                          <div className="flex justify-end mt-4">
                            <Button className="btn-nexus">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Acknowledge Handoff
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="create" className="space-y-4 mt-4">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Create SBAR Handoff</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-[#9D7BEA] mb-2 block">Select Patient</label>
                          <Select value={handoffForm.patientId} onValueChange={v => setHandoffForm({ ...handoffForm, patientId: v })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select patient..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPatients.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} - Room {p.room}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20">
                          <label className="text-sm font-medium text-[#F87171] mb-2 block">
                            S - Situation (Current situation summary)
                          </label>
                          <Textarea
                            value={handoffForm.situation}
                            onChange={e => setHandoffForm({ ...handoffForm, situation: e.target.value })}
                            placeholder="Describe the current situation..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="p-4 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                          <label className="text-sm font-medium text-[#22D3EE] mb-2 block">
                            B - Background (Relevant patient history)
                          </label>
                          <Textarea
                            value={handoffForm.background}
                            onChange={e => setHandoffForm({ ...handoffForm, background: e.target.value })}
                            placeholder="Provide relevant background information..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="p-4 rounded-lg bg-[#F0B429]/10 border border-[#F0B429]/20">
                          <label className="text-sm font-medium text-[#F0B429] mb-2 block">
                            A - Assessment (Current clinical assessment)
                          </label>
                          <Textarea
                            value={handoffForm.assessment}
                            onChange={e => setHandoffForm({ ...handoffForm, assessment: e.target.value })}
                            placeholder="Provide your clinical assessment..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="p-4 rounded-lg bg-[#34D399]/10 border border-[#34D399]/20">
                          <label className="text-sm font-medium text-[#34D399] mb-2 block">
                            R - Recommendation (Recommended actions)
                          </label>
                          <Textarea
                            value={handoffForm.recommendation}
                            onChange={e => setHandoffForm({ ...handoffForm, recommendation: e.target.value })}
                            placeholder="List recommended actions..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button className="btn-nexus">
                            <Send className="w-4 h-4 mr-2" /> Submit Handoff
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-[#EDE9FE] mb-4">Handoffs Given</h3>
                      <p className="text-[#9D7BEA]">No handoffs given in this shift yet.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#EDE9FE]">Task Management</h3>
                  <div className="flex flex-wrap gap-2">
                    <Select value={taskFilter} onValueChange={v => setTaskFilter(v as typeof taskFilter)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={taskCategoryFilter} onValueChange={setTaskCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="vitals">Vitals</SelectItem>
                        <SelectItem value="hygiene">Hygiene</SelectItem>
                        <SelectItem value="feeding">Feeding</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredTasks.map(task => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          task.status === 'completed'
                            ? 'bg-[#34D399]/5 opacity-60'
                            : 'bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)]'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <PriorityBadge priority={task.priority} />
                            <CategoryBadge category={task.category} />
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              task.status === 'completed' ? 'bg-[#34D399]/20 text-[#34D399]' :
                              task.status === 'in_progress' ? 'bg-[#F0B429]/20 text-[#F0B429]' :
                              'bg-[rgba(167,139,250,0.1)] text-[#9D7BEA]'
                            }`}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className={`text-sm ${task.status === 'completed' ? 'line-through' : ''} text-[#EDE9FE]`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-[#9D7BEA]">{task.patientName}</p>
                            <p className="text-xs text-[#9D7BEA]">Room {task.room}</p>
                            <p className="text-xs font-mono text-[#F0B429]">Due: {task.dueTime}</p>
                          </div>
                        </div>
                        {task.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Vital Signs Tab */}
            {activeTab === 'vitals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#EDE9FE]">Vital Signs Logging</h3>

                {vitalAlerts.length > 0 && (
                  <div className="glass-card p-4 border-l-4 border-l-[#F87171] bg-[#F87171]/5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[#F87171] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#F87171]">Abnormal Values Detected</p>
                        <ul className="text-xs text-[#9D7BEA] mt-1">
                          {vitalAlerts.map((alert, i) => (
                            <li key={i}>• {alert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="glass-card p-6">
                      <div className="mb-4">
                        <label className="text-sm text-[#9D7BEA] mb-2 block">Select Patient</label>
                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select patient..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPatients.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} - Room {p.room}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Blood Pressure */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Activity className="w-5 h-5 text-[#F87171]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Blood Pressure</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Systolic"
                              value={vitalsForm.systolic || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, systolic: parseInt(e.target.value) || undefined })}
                              className="w-24"
                            />
                            <span className="text-[#9D7BEA]">/</span>
                            <Input
                              type="number"
                              placeholder="Diastolic"
                              value={vitalsForm.diastolic || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, diastolic: parseInt(e.target.value) || undefined })}
                              className="w-24"
                            />
                            <span className="text-sm text-[#9D7BEA]">mmHg</span>
                          </div>
                        </div>

                        {/* Heart Rate */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-5 h-5 text-[#F87171]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Heart Rate</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="BPM"
                              value={vitalsForm.heartRate || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, heartRate: parseInt(e.target.value) || undefined })}
                              className="w-32"
                            />
                            <span className="text-sm text-[#9D7BEA]">bpm</span>
                          </div>
                        </div>

                        {/* Temperature */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Thermometer className="w-5 h-5 text-[#F0B429]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Temperature</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Temp"
                              value={vitalsForm.temperature || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, temperature: parseFloat(e.target.value) || undefined })}
                              className="w-24"
                            />
                            <Select value={vitalsForm.tempUnit} onValueChange={v => setVitalsForm({ ...vitalsForm, tempUnit: v as 'C' | 'F' })}>
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="C">°C</SelectItem>
                                <SelectItem value="F">°F</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Respiratory Rate */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Stethoscope className="w-5 h-5 text-[#22D3EE]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Respiratory Rate</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Rate"
                              value={vitalsForm.respiratoryRate || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, respiratoryRate: parseInt(e.target.value) || undefined })}
                              className="w-32"
                            />
                            <span className="text-sm text-[#9D7BEA]">breaths/min</span>
                          </div>
                        </div>

                        {/* Oxygen Saturation */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Droplets className="w-5 h-5 text-[#22D3EE]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Oxygen Saturation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="SpO2"
                              value={vitalsForm.oxygenSat || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, oxygenSat: parseInt(e.target.value) || undefined })}
                              className="w-32"
                            />
                            <span className="text-sm text-[#9D7BEA]">%</span>
                          </div>
                        </div>

                        {/* Blood Glucose */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <Droplets className="w-5 h-5 text-[#C026D3]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Blood Glucose</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Glucose"
                              value={vitalsForm.bloodGlucose || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, bloodGlucose: parseInt(e.target.value) || undefined })}
                              className="w-32"
                            />
                            <span className="text-sm text-[#9D7BEA]">mg/dL</span>
                          </div>
                        </div>

                        {/* Weight & Height */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-[#34D399]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Weight / Height</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={vitalsForm.weight || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, weight: parseFloat(e.target.value) || undefined })}
                              className="w-24"
                            />
                            <span className="text-sm text-[#9D7BEA]">kg</span>
                            <Input
                              type="number"
                              placeholder="Height"
                              value={vitalsForm.height || ''}
                              onChange={e => setVitalsForm({ ...vitalsForm, height: parseFloat(e.target.value) || undefined })}
                              className="w-24 ml-2"
                            />
                            <span className="text-sm text-[#9D7BEA]">cm</span>
                          </div>
                        </div>

                        {/* Pain Level */}
                        <div className="p-4 rounded-lg bg-[rgba(108,63,206,0.07)]">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-[#F0B429]" />
                            <span className="text-sm font-medium text-[#EDE9FE]">Pain Level (0-10)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="range"
                              min="0"
                              max="10"
                              value={vitalsForm.painLevel || 0}
                              onChange={e => setVitalsForm({ ...vitalsForm, painLevel: parseInt(e.target.value) })}
                              className="flex-1"
                            />
                            <span className="text-lg font-bold text-[#F0B429] w-8 text-center">{vitalsForm.painLevel || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button className="btn-nexus">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Save Vital Signs
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Panel */}
                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h4 className="text-sm font-medium text-[#EDE9FE] mb-3">Normal Ranges</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#9D7BEA]">Blood Pressure</span>
                          <span className="text-[#34D399]">90-140 / 60-90 mmHg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9D7BEA]">Heart Rate</span>
                          <span className="text-[#34D399]">60-100 bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9D7BEA]">Temperature</span>
                          <span className="text-[#34D399]">36.5-37.5 °C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9D7BEA]">SpO2</span>
                          <span className="text-[#34D399]">≥95%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9D7BEA]">Blood Glucose</span>
                          <span className="text-[#34D399]">70-180 mg/dL</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <h4 className="text-sm font-medium text-[#EDE9FE] mb-3">Recent Vitals</h4>
                      <p className="text-xs text-[#9D7BEA]">Select a patient to view recent vitals history.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAR Tab */}
            {activeTab === 'mar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#EDE9FE]">Medication Administration Record</h3>
                  <div className="flex items-center gap-2 text-sm text-[#9D7BEA]">
                    <Clock className="w-4 h-4" />
                    <span>Current time: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {medications.map(med => (
                      <div
                        key={med.id}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          med.status === 'administered' ? 'bg-[#34D399]/5 opacity-60' :
                          med.isHighRisk ? 'bg-[#C026D3]/10 border border-[#C026D3]/20' :
                          'bg-[rgba(108,63,206,0.07)]'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${med.status === 'administered' ? 'line-through' : ''} text-[#EDE9FE]`}>
                              {med.medication} {med.dosage}
                            </span>
                            {med.isHighRisk && (
                              <span className="px-2 py-0.5 rounded text-xs bg-[#F87171]/20 text-[#F87171] flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> High Risk
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              med.status === 'administered' ? 'bg-[#34D399]/20 text-[#34D399]' :
                              med.status === 'held' ? 'bg-[#F0B429]/20 text-[#F0B429]' :
                              med.status === 'refused' ? 'bg-[#F87171]/20 text-[#F87171]' :
                              'bg-[rgba(167,139,250,0.1)] text-[#9D7BEA]'
                            }`}>
                              {med.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#9D7BEA]">
                            <span>{med.patientName}</span>
                            <span>Room {med.room}</span>
                            <span>Route: {med.route}</span>
                            <span className="font-mono text-[#F0B429]">Scheduled: {med.scheduledTime}</span>
                          </div>
                        </div>

                        {med.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            {med.isHighRisk && (
                              <Button size="sm" variant="outline" className="text-[#F0B429] border-[#F0B429]/30">
                                <UserCheck className="w-4 h-4 mr-1" /> Verify
                              </Button>
                            )}
                            <Button size="sm" className="bg-[#34D399] hover:bg-[#34D399]/80" onClick={() => handleMedAdminister(med.id)}>
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Administer
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleMedHold(med.id)}>
                              <Pause className="w-4 h-4 mr-1" /> Hold
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#F87171]">
                              <XCircle className="w-4 h-4 mr-1" /> Refuse
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#EDE9FE]">Nursing Notes</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* New Note Form */}
                  <div className="glass-card p-6">
                    <h4 className="text-sm font-medium text-[#EDE9FE] mb-4">New Note</h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[#9D7BEA] mb-2 block">Patient</label>
                          <Select value={noteForm.patientId} onValueChange={v => setNoteForm({ ...noteForm, patientId: v })}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPatients.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-[#9D7BEA] mb-2 block">Note Type</label>
                          <Select value={noteForm.type} onValueChange={v => setNoteForm({ ...noteForm, type: v as typeof noteForm.type })}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="progress">Progress</SelectItem>
                              <SelectItem value="assessment">Assessment</SelectItem>
                              <SelectItem value="incident">Incident</SelectItem>
                              <SelectItem value="procedure">Procedure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-[#9D7BEA] mb-2 block">Note Content</label>
                        <Textarea
                          value={noteForm.content}
                          onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                          placeholder="Enter your nursing note..."
                          className="min-h-[200px]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#9D7BEA]">
                          Shift: {currentTime.getHours() >= 7 && currentTime.getHours() < 19 ? 'Day' : 'Night'}
                        </span>
                        <Button className="btn-nexus" onClick={handleAddNote}>
                          <Plus className="w-4 h-4 mr-2" /> Add Note
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Notes */}
                  <div className="glass-card p-6">
                    <h4 className="text-sm font-medium text-[#EDE9FE] mb-4">Recent Notes</h4>

                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-[#9D7BEA]">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notes recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {notes.map(note => (
                          <div key={note.id} className="p-3 rounded-lg bg-[rgba(108,63,206,0.07)]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-[#EDE9FE]">{note.patientName}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                note.type === 'progress' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' :
                                note.type === 'assessment' ? 'bg-[#F0B429]/20 text-[#F0B429]' :
                                note.type === 'incident' ? 'bg-[#F87171]/20 text-[#F87171]' :
                                'bg-[#6C3FCE]/20 text-[#B197FC]'
                              }`}>
                                {note.type}
                              </span>
                            </div>
                            <p className="text-xs text-[#9D7BEA]">{note.content}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-[rgba(167,139,250,0.5)]">
                              <span>{note.createdAt}</span>
                              <span>•</span>
                              <span>{note.shift} shift</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Protocols Tab */}
            {activeTab === 'protocols' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#EDE9FE]">Protocols Quick Access</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D7BEA]" />
                    <Input
                      placeholder="Search protocols..."
                      value={protocolSearch}
                      onChange={e => setProtocolSearch(e.target.value)}
                      className="w-64 pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Protocol List */}
                  <div className="glass-card p-4">
                    <Tabs defaultValue="all">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="emergency">Emergency</TabsTrigger>
                        <TabsTrigger value="medication">Meds</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredProtocols.map(protocol => (
                          <button
                            key={protocol.id}
                            onClick={() => setSelectedProtocol(protocol)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedProtocol?.id === protocol.id
                                ? 'bg-[#6C3FCE]/20 border border-[#6C3FCE]/30'
                                : 'bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                protocol.category === 'emergency' ? 'bg-[#F87171]' :
                                protocol.category === 'medication' ? 'bg-[#C026D3]' :
                                protocol.category === 'procedure' ? 'bg-[#22D3EE]' :
                                protocol.category === 'care' ? 'bg-[#34D399]' :
                                'bg-[#F0B429]'
                              }`} />
                              <span className="text-sm text-[#EDE9FE]">{protocol.title}</span>
                            </div>
                            <p className="text-xs text-[#9D7BEA] mt-1 capitalize">{protocol.category}</p>
                          </button>
                        ))}
                      </TabsContent>

                      <TabsContent value="emergency" className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredProtocols.filter(p => p.category === 'emergency').map(protocol => (
                          <button
                            key={protocol.id}
                            onClick={() => setSelectedProtocol(protocol)}
                            className="w-full text-left p-3 rounded-lg bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)]"
                          >
                            <span className="text-sm text-[#EDE9FE]">{protocol.title}</span>
                          </button>
                        ))}
                      </TabsContent>

                      <TabsContent value="medication" className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredProtocols.filter(p => p.category === 'medication').map(protocol => (
                          <button
                            key={protocol.id}
                            onClick={() => setSelectedProtocol(protocol)}
                            className="w-full text-left p-3 rounded-lg bg-[rgba(108,63,206,0.07)] hover:bg-[rgba(108,63,206,0.1)]"
                          >
                            <span className="text-sm text-[#EDE9FE]">{protocol.title}</span>
                          </button>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Protocol Details */}
                  <div className="lg:col-span-2">
                    {selectedProtocol ? (
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedProtocol.category === 'emergency' ? 'bg-[#F87171]/20' :
                            selectedProtocol.category === 'medication' ? 'bg-[#C026D3]/20' :
                            selectedProtocol.category === 'procedure' ? 'bg-[#22D3EE]/20' :
                            selectedProtocol.category === 'care' ? 'bg-[#34D399]/20' :
                            'bg-[#F0B429]/20'
                          }`}>
                            <Zap className={`w-6 h-6 ${
                              selectedProtocol.category === 'emergency' ? 'text-[#F87171]' :
                              selectedProtocol.category === 'medication' ? 'text-[#C026D3]' :
                              selectedProtocol.category === 'procedure' ? 'text-[#22D3EE]' :
                              selectedProtocol.category === 'care' ? 'text-[#34D399]' :
                              'text-[#F0B429]'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-[#EDE9FE]">{selectedProtocol.title}</h3>
                            <p className="text-sm text-[#9D7BEA] capitalize">{selectedProtocol.category} Protocol</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Steps */}
                          <div>
                            <h4 className="text-sm font-medium text-[#EDE9FE] mb-3 flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-[#34D399]" /> Steps
                            </h4>
                            <ol className="space-y-2">
                              {selectedProtocol.steps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6C3FCE]/20 text-[#B197FC] flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm text-[#EDE9FE]">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Equipment */}
                          <div>
                            <h4 className="text-sm font-medium text-[#EDE9FE] mb-3 flex items-center gap-2">
                              <Info className="w-4 h-4 text-[#22D3EE]" /> Equipment Needed
                            </h4>
                            <ul className="space-y-2">
                              {selectedProtocol.equipment.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-[#EDE9FE]">
                                  <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card p-6 flex items-center justify-center h-[400px]">
                        <div className="text-center text-[#9D7BEA]">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Select a protocol to view details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Checklists Tab */}
            {activeTab === 'checklists' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#EDE9FE]">Checklists</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {checklists.map(checklist => {
                    const completed = checklist.items.filter(i => i.completed).length;
                    const total = checklist.items.length;
                    const progress = (completed / total) * 100;

                    return (
                      <div key={checklist.id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#EDE9FE]">{checklist.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              checklist.type === 'shift' ? 'bg-[#6C3FCE]/20 text-[#B197FC]' :
                              checklist.type === 'admission' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' :
                              'bg-[#34D399]/20 text-[#34D399]'
                            }`}>
                              {checklist.type}
                            </span>
                          </div>
                          <span className="text-sm text-[#9D7BEA]">{completed}/{total}</span>
                        </div>

                        <Progress value={progress} className="mb-4 h-2" />

                        <div className="space-y-2">
                          {checklist.items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleChecklistItem(checklist.id, item.id)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(108,63,206,0.07)] transition-colors text-left"
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                item.completed
                                  ? 'bg-[#34D399] border-[#34D399]'
                                  : 'border-[rgba(167,139,250,0.3)]'
                              }`}>
                                {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm ${item.completed ? 'line-through text-[rgba(167,139,250,0.5)]' : 'text-[#EDE9FE]'}`}>
                                {item.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function NursePage() {
  return (
    <NurseRoute>
      <NursePortal />
    </NurseRoute>
  );
}
