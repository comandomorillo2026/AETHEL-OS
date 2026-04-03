"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Users,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Bell,
  Timer,
  Pause,
  Play,
  Square,
  BarChart3,
  Target,
  Gavel,
  BookOpen,
  Building,
  UserCheck,
  TimerOff,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";

// Mock data for dashboard
const statsData = {
  activeCases: 24,
  newClients: 8,
  billableHours: 156.5,
  revenue: 48500,
  pendingTasks: 12,
  upcomingDeadlines: 5,
};

const recentCases = [
  {
    id: "1",
    caseNumber: "CAS-2026-001",
    title: "Smith vs. Johnson Holdings",
    client: "Robert Smith",
    practiceArea: "Civil",
    status: "in_progress",
    nextDeadline: "2026-04-15",
    progress: 65,
    billableHours: 45.5,
  },
  {
    id: "2",
    caseNumber: "CAS-2026-002",
    title: "Estate of Williams",
    client: "Maria Williams",
    practiceArea: "Probate",
    status: "open",
    nextDeadline: "2026-04-20",
    progress: 30,
    billableHours: 12.0,
  },
  {
    id: "3",
    caseNumber: "CAS-2026-003",
    title: "TT Corp Contract Dispute",
    client: "TT Corporation Ltd.",
    practiceArea: "Corporate",
    status: "discovery",
    nextDeadline: "2026-04-10",
    progress: 45,
    billableHours: 78.5,
  },
  {
    id: "4",
    caseNumber: "CAS-2026-004",
    title: "Divorce Proceedings - Garcia",
    client: "Ana Garcia",
    practiceArea: "Family",
    status: "pending",
    nextDeadline: "2026-04-05",
    progress: 20,
    billableHours: 8.0,
  },
];

const upcomingEvents = [
  { id: "1", title: "Hearing - Smith vs Johnson", date: "2026-03-28", time: "09:00", type: "court", location: "High Court, Port of Spain" },
  { id: "2", title: "Client Meeting - TT Corp", date: "2026-03-29", time: "14:00", type: "meeting", location: "Office" },
  { id: "3", title: "Deadline - File Response", date: "2026-03-30", time: "16:00", type: "deadline", case: "Garcia Divorce" },
  { id: "4", title: "Deposition - Williams Estate", date: "2026-04-02", time: "10:00", type: "deposition", location: "Court Reporter Office" },
];

const practiceAreaStats = [
  { area: "Civil", cases: 8, revenue: 18500, color: "#1E3A5F" },
  { area: "Corporate", cases: 6, revenue: 22000, color: "#C4A35A" },
  { area: "Family", cases: 5, revenue: 4500, color: "#7C3AED" },
  { area: "Probate", cases: 3, revenue: 3500, color: "#10B981" },
  { area: "Criminal", cases: 2, revenue: 0, color: "#EF4444" },
];

export function LawDashboard() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerCase, setTimerCase] = useState<string | null>(null);
  const [newCaseOpen, setNewCaseOpen] = useState(false);

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-700",
      in_progress: "bg-green-100 text-green-700",
      discovery: "bg-purple-100 text-purple-700",
      pending: "bg-yellow-100 text-yellow-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "court":
        return <Gavel className="h-4 w-4 text-red-500" />;
      case "meeting":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "deadline":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "deposition":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar casos, clientes, documentos..."
              className="pl-10 w-80 bg-white border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Caso
          </Button>
        </div>
      </div>

      {/* Time Tracker - Critical for Lawyers */}
      <Card className="bg-gradient-to-r from-[#1E3A5F] to-[#2C4A6F] text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Timer className="h-6 w-6" />
                <div>
                  <p className="text-sm opacity-80">Time Tracker</p>
                  <p className="text-3xl font-mono font-bold">{formatTime(timerSeconds)}</p>
                </div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm opacity-80">Caso Actual</p>
                <p className="font-medium">{timerCase || "Sin caso seleccionado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select onValueChange={setTimerCase}>
                <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar caso..." />
                </SelectTrigger>
                <SelectContent>
                  {recentCases.map((c) => (
                    <SelectItem key={c.id} value={c.caseNumber}>
                      {c.caseNumber} - {c.title.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!timerRunning ? (
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => setTimerRunning(true)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => setTimerRunning(false)}
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pausar
                  </Button>
                  <Button
                    size="lg"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setTimerRunning(false);
                      // Here would save the time entry
                    }}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1E3A5F] rounded-lg text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsData.activeCases}</p>
                <p className="text-sm text-gray-500">Casos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C4A35A] rounded-lg text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsData.newClients}</p>
                <p className="text-sm text-gray-500">Nuevos Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsData.billableHours}h</p>
                <p className="text-sm text-gray-500">Horas Facturables</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">TT${(statsData.revenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-500">Ingresos Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg text-white">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statsData.pendingTasks}</p>
                <p className="text-sm text-gray-500">Tareas Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{statsData.upcomingDeadlines}</p>
                <p className="text-sm text-red-500">Plazos Próximos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#1E3A5F]" />
              Casos Recientes
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{caseItem.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{caseItem.caseNumber}</span>
                        <span>•</span>
                        <span>{caseItem.client}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Progreso</p>
                      <div className="flex items-center gap-2">
                        <Progress value={caseItem.progress} className="w-16 h-2" />
                        <span className="text-sm font-medium">{caseItem.progress}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Horas</p>
                      <p className="font-medium">{caseItem.billableHours}h</p>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>
                      {caseItem.status.replace("_", " ")}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#C4A35A]" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.date} • {event.time}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-400 truncate">{event.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Calendario Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Practice Area Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#1E3A5F]" />
              Rendimiento por Área de Práctica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practiceAreaStats.map((area) => (
                <div key={area.area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{area.area}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{area.cases} casos</span>
                      <span className="font-bold" style={{ color: area.color }}>
                        TT${area.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(area.revenue / 22000) * 100}%`,
                        backgroundColor: area.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5 text-[#C4A35A]" />
              Cuentas de Fideicomiso (Trust)
            </CardTitle>
            <CardDescription>
              Resumen de cuentas de clientes bajo custodia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Balance Total en Fideicomiso</p>
                  <p className="text-3xl font-bold text-amber-800">TT$125,450.00</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Building className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Depósitos este mes</p>
                    <p className="text-xs text-gray-500">3 transacciones</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+TT$45,000</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Retiros este mes</p>
                    <p className="text-xs text-gray-500">2 transacciones</p>
                  </div>
                </div>
                <span className="font-bold text-red-600">-TT$18,500</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Gestionar Cuentas Trust
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-[#1E3A5F]/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-[#1E3A5F]/10 rounded-full w-fit mx-auto mb-3">
              <Plus className="h-6 w-6 text-[#1E3A5F]" />
            </div>
            <p className="font-medium">Nuevo Caso</p>
            <p className="text-xs text-gray-500 mt-1">Registrar expediente</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-[#1E3A5F]/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-[#C4A35A]/10 rounded-full w-fit mx-auto mb-3">
              <UserCheck className="h-6 w-6 text-[#C4A35A]" />
            </div>
            <p className="font-medium">Nuevo Cliente</p>
            <p className="text-xs text-gray-500 mt-1">Registrar persona/empresa</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-[#1E3A5F]/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <p className="font-medium">Nuevo Documento</p>
            <p className="text-xs text-gray-500 mt-1">Desde template</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-[#1E3A5F]/50 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium">Biblioteca Legal</p>
            <p className="text-xs text-gray-500 mt-1">Leyes y jurisprudencia</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
