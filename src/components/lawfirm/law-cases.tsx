"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Scale,
  Calendar,
  Clock,
  DollarSign,
  User,
  Building,
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowRight,
  Timer,
  ChevronDown,
  Gavel,
  Users,
  Target,
  Activity,
  Upload,
  Download,
} from "lucide-react";

// Mock cases data
const mockCases = [
  {
    id: "1",
    caseNumber: "CAS-2026-001",
    title: "Smith vs. Johnson Holdings Ltd.",
    client: "Robert Smith",
    clientType: "individual",
    practiceArea: "civil",
    caseType: "lawsuit",
    jurisdiction: "Trinidad & Tobago",
    court: "High Court",
    judge: "Hon. Justice Williams",
    status: "in_progress",
    stage: "Discovery",
    priority: "high",
    openDate: "2025-11-15",
    nextDeadline: "2026-04-15",
    nextDeadlineDesc: "File Discovery Documents",
    progress: 65,
    leadAttorney: "Dr. James Rodriguez",
    teamMembers: ["Maria Chen", "David Singh"],
    billingType: "hourly",
    hourlyRate: 850,
    billableHours: 45.5,
    totalBilled: 38675,
    trustBalance: 25000,
    opposingParty: "Johnson Holdings Ltd.",
    opposingCounsel: "Baker & Associates",
    description: "Breach of contract claim regarding commercial property lease.",
  },
  {
    id: "2",
    caseNumber: "CAS-2026-002",
    title: "Estate of Williams - Probate",
    client: "Maria Williams",
    clientType: "individual",
    practiceArea: "probate",
    caseType: "probate",
    jurisdiction: "Trinidad & Tobago",
    court: "Probate Court",
    status: "open",
    stage: "Application",
    priority: "normal",
    openDate: "2026-02-20",
    nextDeadline: "2026-04-20",
    nextDeadlineDesc: "Submit Probate Application",
    progress: 30,
    leadAttorney: "Sarah Johnson",
    teamMembers: [],
    billingType: "flat_fee",
    flatFee: 8000,
    billableHours: 12,
    totalBilled: 4000,
    trustBalance: 8000,
    opposingParty: null,
    opposingCounsel: null,
    description: "Probate application for estate of late John Williams.",
  },
  {
    id: "3",
    caseNumber: "CAS-2026-003",
    title: "TT Corporation - Contract Dispute",
    client: "TT Corporation Ltd.",
    clientType: "company",
    practiceArea: "corporate",
    caseType: "mediation",
    jurisdiction: "Trinidad & Tobago",
    court: null,
    status: "discovery",
    stage: "Pre-Mediation",
    priority: "urgent",
    openDate: "2026-01-10",
    nextDeadline: "2026-04-10",
    nextDeadlineDesc: "Mediation Session",
    progress: 45,
    leadAttorney: "Dr. James Rodriguez",
    teamMembers: ["Maria Chen", "Kevin Brown"],
    billingType: "hourly",
    hourlyRate: 1200,
    billableHours: 78.5,
    totalBilled: 94200,
    trustBalance: 100000,
    opposingParty: "Caribbean Suppliers Ltd.",
    opposingCounsel: "Mitchell & Co.",
    description: "Commercial contract dispute regarding supply agreement.",
  },
  {
    id: "4",
    caseNumber: "CAS-2026-004",
    title: "Garcia - Divorce Proceedings",
    client: "Ana Garcia",
    clientType: "individual",
    practiceArea: "family",
    caseType: "lawsuit",
    jurisdiction: "Trinidad & Tobago",
    court: "Family Court",
    status: "pending",
    stage: "Filing",
    priority: "normal",
    openDate: "2026-03-01",
    nextDeadline: "2026-04-05",
    nextDeadlineDesc: "File Petition",
    progress: 20,
    leadAttorney: "Sarah Johnson",
    teamMembers: [],
    billingType: "flat_fee",
    flatFee: 15000,
    billableHours: 8,
    totalBilled: 0,
    trustBalance: 7500,
    opposingParty: "Carlos Garcia",
    opposingCounsel: null,
    description: "Divorce proceedings with property division and custody matters.",
  },
  {
    id: "5",
    caseNumber: "CAS-2026-005",
    title: "R. Singh - Criminal Defense",
    client: "Rajesh Singh",
    clientType: "individual",
    practiceArea: "criminal",
    caseType: "lawsuit",
    jurisdiction: "Trinidad & Tobago",
    court: "Magistrates Court",
    status: "in_progress",
    stage: "Trial",
    priority: "urgent",
    openDate: "2025-12-05",
    nextDeadline: "2026-03-30",
    nextDeadlineDesc: "Court Appearance",
    progress: 70,
    leadAttorney: "Dr. James Rodriguez",
    teamMembers: ["David Singh"],
    billingType: "hourly",
    hourlyRate: 950,
    billableHours: 52,
    totalBilled: 49400,
    trustBalance: 30000,
    opposingParty: "The State",
    opposingCounsel: "DPP Office",
    description: "Criminal defense case - fraud charges.",
  },
];

const practiceAreas = [
  { value: "civil", label: "Civil", icon: Scale },
  { value: "corporate", label: "Corporativo", icon: Building },
  { value: "family", label: "Familia", icon: Users },
  { value: "criminal", label: "Penal", icon: Gavel },
  { value: "probate", label: "Sucesiones", icon: FileText },
  { value: "real_estate", label: "Inmobiliario", icon: Building },
  { value: "labor", label: "Laboral", icon: User },
  { value: "immigration", label: "Migración", icon: Users },
];

const caseStages = {
  civil: ["Intake", "Pleadings", "Discovery", "Pre-Trial", "Trial", "Appeal", "Closed"],
  corporate: ["Intake", "Review", "Negotiation", "Drafting", "Execution", "Closed"],
  family: ["Intake", "Filing", "Mediation", "Hearing", "Order", "Closed"],
  criminal: ["Intake", "Bail", "Preliminary", "Trial", "Sentencing", "Appeal", "Closed"],
  probate: ["Intake", "Application", "Grant", "Administration", "Distribution", "Closed"],
};

export function LawCases() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<typeof mockCases[0] | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-700 border-blue-200",
      in_progress: "bg-green-100 text-green-700 border-green-200",
      discovery: "bg-purple-100 text-purple-700 border-purple-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      closed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-red-500",
      high: "bg-orange-500",
      normal: "bg-blue-500",
      low: "bg-gray-400",
    };
    return colors[priority] || "bg-gray-400";
  };

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = filterArea === "all" || c.practiceArea === filterArea;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por caso, cliente, número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Áreas</SelectItem>
                {practiceAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="discovery">Descubrimiento</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={newCaseOpen} onOpenChange={setNewCaseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Caso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Caso</DialogTitle>
                <DialogDescription>
                  Complete la información del expediente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Título del Caso</label>
                    <Input placeholder="Ej: Smith vs. Johnson" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Número de Expediente</label>
                    <Input placeholder="Se genera automáticamente" disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cliente</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Nuevo Cliente</SelectItem>
                        {mockCases.map((c) => (
                          <SelectItem key={c.id} value={c.client}>
                            {c.client}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Área de Práctica</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {practiceAreas.map((area) => (
                          <SelectItem key={area.value} value={area.value}>
                            {area.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de Caso</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lawsuit">Demanda</SelectItem>
                        <SelectItem value="consultation">Consultoría</SelectItem>
                        <SelectItem value="contract">Contrato</SelectItem>
                        <SelectItem value="mediation">Mediación</SelectItem>
                        <SelectItem value="arbitration">Arbitraje</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Prioridad</label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgente</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descripción</label>
                  <Textarea placeholder="Descripción del caso..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de Facturación</label>
                    <Select defaultValue="hourly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Por Hora</SelectItem>
                        <SelectItem value="flat_fee">Tarifa Fija</SelectItem>
                        <SelectItem value="contingency">Honorario de Éxito</SelectItem>
                        <SelectItem value="hybrid">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tarifa (TT$)</label>
                    <Input type="number" placeholder="850" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Abogado Principal</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attorney1">Dr. James Rodriguez</SelectItem>
                        <SelectItem value="attorney2">Sarah Johnson</SelectItem>
                        <SelectItem value="attorney3">Maria Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Fecha de Apertura</label>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setNewCaseOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewCaseOpen(false)}>
                    Crear Caso
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCases.length}</p>
              <p className="text-xs text-gray-500">Total Casos</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCases.filter((c) => c.status === "in_progress").length}</p>
              <p className="text-xs text-gray-500">En Progreso</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCases.filter((c) => c.status === "pending").length}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCases.filter((c) => c.priority === "urgent").length}</p>
              <p className="text-xs text-gray-500">Urgentes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C4A35A]/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-[#C4A35A]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                TT${(mockCases.reduce((sum, c) => sum + c.totalBilled, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500">Facturado</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cases Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Caso</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Próximo Plazo</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Trust</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id} className="hover:bg-gray-50 cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full absolute -left-3 top-1/2 -translate-y-1/2" 
                               style={{ backgroundColor: getPriorityColor(caseItem.priority) }} />
                          <Scale className="h-4 w-4 text-[#1E3A5F]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{caseItem.caseNumber}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">{caseItem.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {caseItem.clientType === "company" ? (
                          <Building className="h-4 w-4 text-gray-400" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm">{caseItem.client}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {caseItem.practiceArea}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={caseItem.progress} className="w-16 h-2" />
                        <span className="text-xs">{caseItem.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{caseItem.nextDeadline}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">
                          {caseItem.nextDeadlineDesc}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{caseItem.billableHours}h</p>
                        <p className="text-xs text-gray-500">
                          TT${caseItem.totalBilled.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[#C4A35A]">
                        TT${caseItem.trustBalance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedCase(caseItem)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Timer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Cases Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCase(caseItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" 
                         style={{ backgroundColor: getPriorityColor(caseItem.priority) }} />
                    <span className="text-sm font-mono text-gray-500">{caseItem.caseNumber}</span>
                  </div>
                  <Badge className={getStatusColor(caseItem.status)}>
                    {caseItem.status.replace("_", " ")}
                  </Badge>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{caseItem.title}</h4>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  {caseItem.clientType === "company" ? (
                    <Building className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{caseItem.client}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progreso</span>
                      <span className="font-medium">{caseItem.progress}%</span>
                    </div>
                    <Progress value={caseItem.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{caseItem.billableHours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C4A35A]">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">
                        TT${caseItem.trustBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Próximo: {caseItem.nextDeadline}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Case Detail Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedCase.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-1">
                      <span>{selectedCase.caseNumber}</span>
                      <Badge className={getStatusColor(selectedCase.status)}>
                        {selectedCase.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedCase.practiceArea}
                      </Badge>
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Timer className="h-4 w-4 mr-1" />
                      Timer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="billing">Facturación</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">
                            Información del Caso
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cliente:</span>
                            <span className="font-medium">{selectedCase.client}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Área:</span>
                            <span className="capitalize">{selectedCase.practiceArea}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Etapa:</span>
                            <span>{selectedCase.stage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Abogado:</span>
                            <span>{selectedCase.leadAttorney}</span>
                          </div>
                          {selectedCase.court && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Tribunal:</span>
                              <span>{selectedCase.court}</span>
                            </div>
                          )}
                          {selectedCase.judge && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Juez:</span>
                              <span>{selectedCase.judge}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">
                            Partes Contrarias
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Contraparte:</span>
                            <span className="font-medium">{selectedCase.opposingParty || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Abogado:</span>
                            <span>{selectedCase.opposingCounsel || "N/A"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">
                            Progreso
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 mb-4">
                            <Progress value={selectedCase.progress} className="flex-1 h-3" />
                            <span className="text-lg font-bold">{selectedCase.progress}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Apertura:</span>
                            <span>{selectedCase.openDate}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-500">Próximo plazo:</span>
                            <span className="font-medium text-red-600">{selectedCase.nextDeadline}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{selectedCase.nextDeadlineDesc}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">
                            Financiero
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Modalidad:</span>
                            <span className="capitalize">{selectedCase.billingType.replace("_", " ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tarifa:</span>
                            <span>
                              TT${selectedCase.hourlyRate || selectedCase.flatFee}
                              {selectedCase.billingType === "hourly" ? "/hr" : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Horas:</span>
                            <span>{selectedCase.billableHours}h</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Facturado:</span>
                            <span>TT${selectedCase.totalBilled.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-[#C4A35A]">
                            <span>Trust:</span>
                            <span>TT${selectedCase.trustBalance.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{selectedCase.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4 mt-4">
                  {/* Timeline Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Historial del Caso</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Evento
                    </Button>
                  </div>
                  
                  {/* Timeline */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-4">
                      {[
                        { date: "2026-03-27", title: "Deposición completada", desc: "Deposición del testigo principal realizada", type: "deposition", user: "Dr. James Rodriguez" },
                        { date: "2026-03-20", title: "Documento presentado", desc: "Moción de descubrimiento presentada ante el tribunal", type: "filing", user: "Maria Chen" },
                        { date: "2026-03-15", title: "Reunión con cliente", desc: "Revisión de estrategia y próximos pasos", type: "meeting", user: "Dr. James Rodriguez" },
                        { date: "2026-03-10", title: "Audiencia", desc: "Comparecencia ante el juez Williams", type: "court", user: "Dr. James Rodriguez" },
                        { date: "2026-03-01", title: "Caso abierto", desc: "Registro inicial del expediente", type: "created", user: "Sarah Johnson" },
                      ].map((event, idx) => (
                        <div key={idx} className="relative pl-10">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                            event.type === "court" ? "bg-red-500 border-red-200" :
                            event.type === "meeting" ? "bg-blue-500 border-blue-200" :
                            event.type === "filing" ? "bg-purple-500 border-purple-200" :
                            event.type === "deposition" ? "bg-yellow-500 border-yellow-200" :
                            "bg-green-500 border-green-200"
                          }`} />
                          <Card>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm text-gray-500">{event.desc}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400">{event.date}</p>
                                  <p className="text-xs text-gray-500">{event.user}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  {/* Documents Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Documentos del Caso</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Subir
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Desde Plantilla
                      </Button>
                    </div>
                  </div>
                  
                  {/* Documents List */}
                  <div className="space-y-2">
                    {[
                      { name: "Demanda_Inicial.docx", date: "2026-03-01", size: "245 KB", type: "Pleading" },
                      { name: "Moción_Descubrimiento.pdf", date: "2026-03-20", size: "1.2 MB", type: "Motion" },
                      { name: "Transcripción_Deposición.pdf", date: "2026-03-27", size: "3.5 MB", type: "Deposition" },
                      { name: "Contrato_Servicios.pdf", date: "2026-03-01", size: "180 KB", type: "Contract" },
                      { name: "Correspondencia_Juzgado.pdf", date: "2026-03-15", size: "95 KB", type: "Correspondence" },
                    ].map((doc, idx) => (
                      <Card key={idx} className="hover:shadow-sm cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.date} • {doc.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{doc.type}</Badge>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="space-y-4 mt-4">
                  {/* Billing Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Horas Facturables</p>
                        <p className="text-2xl font-bold">{selectedCase.billableHours}h</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Total Facturado</p>
                        <p className="text-2xl font-bold">TT${selectedCase.totalBilled.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#C4A35A]/10">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Trust Balance</p>
                        <p className="text-2xl font-bold">TT${selectedCase.trustBalance.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Time Entries */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Entradas de Tiempo</CardTitle>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Registrar Tiempo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Horas</TableHead>
                            <TableHead>Tarifa</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { date: "2026-03-27", desc: "Deposición del testigo", hours: 4, rate: 850, billed: false },
                            { date: "2026-03-20", desc: "Preparación de moción", hours: 3.5, rate: 850, billed: true },
                            { date: "2026-03-15", desc: "Reunión con cliente", hours: 2, rate: 850, billed: true },
                            { date: "2026-03-10", desc: "Audiencia en corte", hours: 5, rate: 850, billed: true },
                          ].map((entry, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-sm">{entry.date}</TableCell>
                              <TableCell className="text-sm">{entry.desc}</TableCell>
                              <TableCell className="text-sm font-mono">{entry.hours}h</TableCell>
                              <TableCell className="text-sm">TT${entry.rate}</TableCell>
                              <TableCell>
                                <Badge className={entry.billed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                  {entry.billed ? "Facturado" : "Pendiente"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  {/* Invoices */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Facturas</CardTitle>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Nueva Factura
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Número</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { num: "INV-2026-015", date: "2026-03-25", amount: 8500, status: "sent" },
                            { num: "INV-2026-012", date: "2026-03-10", amount: 12750, status: "paid" },
                            { num: "INV-2026-008", date: "2026-02-28", amount: 17425, status: "paid" },
                          ].map((inv, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{inv.num}</TableCell>
                              <TableCell className="text-sm">{inv.date}</TableCell>
                              <TableCell className="text-sm">TT${inv.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                                  {inv.status === "paid" ? "Pagada" : "Enviada"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">Ver</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 mt-4">
                  {/* Add Note */}
                  <Card>
                    <CardContent className="p-4">
                      <Textarea placeholder="Escribir una nueva nota..." rows={3} className="mb-3" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            Privado (solo visible para ti)
                          </label>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Guardar Nota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Notes List */}
                  <div className="space-y-3">
                    {[
                      { date: "2026-03-27 14:30", user: "Dr. James Rodriguez", text: "Cliente confirmó disponibilidad para la próxima semana. Revisar calendario para programar audiencia de continuación.", private: false },
                      { date: "2026-03-25 09:15", user: "Maria Chen", text: "Documentos de descubrimiento organizados por fecha. Faltan 2 declaraciones de testigos.", private: false },
                      { date: "2026-03-20 16:45", user: "Dr. James Rodriguez", text: "NOTA PRIVADA: El abogado contrario parece dispuesto a negociar. Considerar oferta de acuerdo.", private: true },
                      { date: "2026-03-15 11:00", user: "Sarah Johnson", text: "Revisión inicial del caso completada. Se necesitan más pruebas documentales.", private: false },
                    ].map((note, idx) => (
                      <Card key={idx} className={note.private ? "border-yellow-200 bg-yellow-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-medium">
                                {note.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{note.user}</p>
                                <p className="text-xs text-gray-500">{note.date}</p>
                              </div>
                            </div>
                            {note.private && (
                              <Badge variant="outline" className="text-yellow-700 border-yellow-300">Privado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{note.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
