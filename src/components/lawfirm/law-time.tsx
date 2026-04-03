"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Search,
  Timer,
  Calendar,
  User,
  Briefcase,
  DollarSign,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
} from "lucide-react";

// Mock time entries
const mockTimeEntries = [
  {
    id: "1",
    case: "Smith vs. Johnson Holdings",
    caseId: "1",
    client: "Robert Smith",
    attorney: "Dr. James Rodriguez",
    date: "2026-03-27",
    startTime: "09:00",
    endTime: "12:30",
    durationMinutes: 210,
    description: "Document review and legal research",
    activityCode: "research",
    rate: 850,
    amount: 2975,
    billable: true,
    billed: false,
    invoiceId: null,
  },
  {
    id: "2",
    case: "TT Corp Contract Dispute",
    caseId: "3",
    client: "TT Corporation Ltd.",
    attorney: "Dr. James Rodriguez",
    date: "2026-03-27",
    startTime: "14:00",
    endTime: "16:00",
    durationMinutes: 120,
    description: "Client meeting - strategy discussion",
    activityCode: "meeting",
    rate: 1200,
    amount: 2400,
    billable: true,
    billed: false,
    invoiceId: null,
  },
  {
    id: "3",
    case: "Garcia - Divorce Proceedings",
    caseId: "4",
    client: "Ana Garcia",
    attorney: "Sarah Johnson",
    date: "2026-03-26",
    startTime: "10:00",
    endTime: "14:00",
    durationMinutes: 240,
    description: "Mediation preparation and document drafting",
    activityCode: "drafting",
    rate: 900,
    amount: 3600,
    billable: true,
    billed: false,
    invoiceId: null,
  },
  {
    id: "4",
    case: "R. Singh - Criminal Defense",
    caseId: "5",
    client: "Rajesh Singh",
    attorney: "David Singh",
    date: "2026-03-25",
    startTime: "08:00",
    endTime: "13:00",
    durationMinutes: 300,
    description: "Witness interviews and evidence review",
    activityCode: "investigation",
    rate: 800,
    amount: 4000,
    billable: true,
    billed: false,
    invoiceId: null,
  },
  {
    id: "5",
    case: "Smith vs. Johnson Holdings",
    caseId: "1",
    client: "Robert Smith",
    attorney: "Dr. James Rodriguez",
    date: "2026-03-24",
    startTime: "09:00",
    endTime: "17:00",
    durationMinutes: 480,
    description: "Court preparation and filing",
    activityCode: "court",
    rate: 850,
    amount: 6800,
    billable: true,
    billed: true,
    invoiceId: "INV-2026-002",
  },
];

const activityCodes = [
  { value: "research", label: "Investigación Legal", color: "bg-blue-100 text-blue-700" },
  { value: "drafting", label: "Redacción de Documentos", color: "bg-purple-100 text-purple-700" },
  { value: "meeting", label: "Reunión con Cliente", color: "bg-green-100 text-green-700" },
  { value: "court", label: "Comparecencia en Corte", color: "bg-red-100 text-red-700" },
  { value: "calls", label: "Llamadas Telefónicas", color: "bg-yellow-100 text-yellow-700" },
  { value: "review", label: "Revisión de Documentos", color: "bg-indigo-100 text-indigo-700" },
  { value: "investigation", label: "Investigación", color: "bg-orange-100 text-orange-700" },
  { value: "negotiation", label: "Negociación", color: "bg-teal-100 text-teal-700" },
  { value: "consultation", label: "Consultoría", color: "bg-pink-100 text-pink-700" },
  { value: "travel", label: "Viaje", color: "bg-gray-100 text-gray-700" },
];

export function LawTime() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBilled, setFilterBilled] = useState<string>("all");
  const [newEntryOpen, setNewEntryOpen] = useState(false);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerCase, setTimerCase] = useState<string>("");
  const [timerDescription, setTimerDescription] = useState("");
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const startActivityTimer = () => {
    setTimerRunning(true);
    setTimerStartTime(new Date());
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const stopTimer = () => {
    // In a real app, this would save the time entry
    setTimerRunning(false);
    setTimerSeconds(0);
    setTimerCase("");
    setTimerDescription("");
    setTimerStartTime(null);
  };

  const filteredEntries = mockTimeEntries.filter((entry) => {
    const matchesSearch =
      entry.case.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBilled =
      filterBilled === "all" ||
      (filterBilled === "billed" && entry.billed) ||
      (filterBilled === "unbilled" && !entry.billed);
    return matchesSearch && matchesBilled;
  });

  const totalUnbilledHours = mockTimeEntries
    .filter((e) => !e.billed)
    .reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalUnbilledAmount = mockTimeEntries
    .filter((e) => !e.billed)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalBilledThisMonth = mockTimeEntries
    .filter((e) => e.billed)
    .reduce((sum, e) => sum + e.amount, 0);

  const getActivityColor = (code: string) => {
    const activity = activityCodes.find((a) => a.value === code);
    return activity?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <Card className="bg-gradient-to-r from-[#1E3A5F] to-[#2C4A6F] text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-5 w-5" />
                  <span className="text-sm opacity-80">Time Tracker</span>
                </div>
                <p className="text-5xl font-mono font-bold">{formatTime(timerSeconds)}</p>
                {timerStartTime && (
                  <p className="text-sm opacity-60 mt-1">
                    Iniciado: {timerStartTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="space-y-3">
                <Select value={timerCase} onValueChange={setTimerCase}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/50">
                    <SelectValue placeholder="Seleccionar caso..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Smith vs. Johnson Holdings</SelectItem>
                    <SelectItem value="2">Estate of Williams</SelectItem>
                    <SelectItem value="3">TT Corp Contract Dispute</SelectItem>
                    <SelectItem value="4">Garcia - Divorce Proceedings</SelectItem>
                    <SelectItem value="5">R. Singh - Criminal Defense</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Descripción de la actividad..."
                  value={timerDescription}
                  onChange={(e) => setTimerDescription(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!timerRunning ? (
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                  onClick={startActivityTimer}
                  disabled={!timerCase}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-6"
                    onClick={pauseTimer}
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pausar
                  </Button>
                  <Button
                    size="lg"
                    className="bg-red-500 hover:bg-red-600 text-white px-6"
                    onClick={stopTimer}
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Guardar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C4A35A]/20 rounded-lg">
                <Clock className="h-5 w-5 text-[#C4A35A]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalUnbilledHours)}</p>
                <p className="text-xs text-gray-500">Horas Sin Facturar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">TT${(totalUnbilledAmount / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500">Valor Sin Facturar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">TT${(totalBilledThisMonth / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500">Facturado Este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156.5h</p>
                <p className="text-xs text-gray-500">Horas Este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Entradas de Tiempo</CardTitle>
              <CardDescription>Registro de actividades facturables</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <Select value={filterBilled} onValueChange={setFilterBilled}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unbilled">Sin Facturar</SelectItem>
                  <SelectItem value="billed">Facturado</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Entrada
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Registrar Tiempo Manual</DialogTitle>
                    <DialogDescription>
                      Ingresa tiempo trabajado manualmente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Caso</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar caso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Smith vs. Johnson Holdings</SelectItem>
                          <SelectItem value="2">Estate of Williams</SelectItem>
                          <SelectItem value="3">TT Corp Contract Dispute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Fecha</label>
                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Duración</label>
                        <div className="flex gap-2">
                          <Input type="number" placeholder="Horas" className="w-20" />
                          <Input type="number" placeholder="Min" className="w-20" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tipo de Actividad</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityCodes.map((code) => (
                            <SelectItem key={code.value} value={code.value}>
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Descripción</label>
                      <Textarea placeholder="Descripción del trabajo realizado..." rows={3} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="billable" defaultChecked className="rounded" />
                      <label htmlFor="billable" className="text-sm">Facturable</label>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setNewEntryOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewEntryOpen(false)}>
                        Guardar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Fecha</TableHead>
                <TableHead>Caso</TableHead>
                <TableHead>Abogado</TableHead>
                <TableHead>Actividad</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Tarifa</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{entry.date}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{entry.case}</p>
                      <p className="text-xs text-gray-500">{entry.client}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{entry.attorney}</TableCell>
                  <TableCell>
                    <Badge className={getActivityColor(entry.activityCode)}>
                      {activityCodes.find((c) => c.value === entry.activityCode)?.label || entry.activityCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatDuration(entry.durationMinutes)}
                  </TableCell>
                  <TableCell className="text-sm">TT${entry.rate}</TableCell>
                  <TableCell className="font-medium text-[#C4A35A]">
                    TT${entry.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {entry.billed ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Facturado
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {activityCodes.slice(0, 5).map((code) => (
          <Card key={code.value} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Badge className={`${code.color} mb-2`}>{code.label}</Badge>
              <p className="text-xs text-gray-500">Click para registrar</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
