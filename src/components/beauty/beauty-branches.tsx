"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Eye,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Branch data
const mockBranches = [
  {
    id: "1",
    name: "Salón Central - Port of Spain",
    code: "POS-01",
    address: " Frederick Street, Port of Spain",
    city: "Port of Spain",
    phone: "+1 868-623-4567",
    email: "central@beauty.com",
    manager: "Ana María Rodríguez",
    managerPhone: "+1 868-689-1234",
    status: "active",
    openingTime: "08:00",
    closingTime: "20:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    staff: 12,
    todayAppointments: 28,
    todayRevenue: 8500,
    weekRevenue: 42500,
    monthRevenue: 185000,
    rating: 4.8,
    reviews: 234,
    primaryColor: "#EC4899",
  },
  {
    id: "2",
    name: "Salón West Mall",
    code: "WES-02",
    address: "West Mall, Western Main Road, Diego Martin",
    city: "Diego Martin",
    phone: "+1 868-634-5678",
    email: "westmall@beauty.com",
    manager: "Carlos Pérez",
    managerPhone: "+1 868-689-2345",
    status: "active",
    openingTime: "09:00",
    closingTime: "21:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    staff: 8,
    todayAppointments: 22,
    todayRevenue: 6200,
    weekRevenue: 32000,
    monthRevenue: 142000,
    rating: 4.6,
    reviews: 156,
    primaryColor: "#8B5CF6",
  },
  {
    id: "3",
    name: "Salón Trincity Mall",
    code: "TRI-03",
    address: "Trincity Mall, Trincity",
    city: "Trincity",
    phone: "+1 868-645-6789",
    email: "trincity@beauty.com",
    manager: "María González",
    managerPhone: "+1 868-689-3456",
    status: "active",
    openingTime: "10:00",
    closingTime: "19:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    staff: 6,
    todayAppointments: 15,
    todayRevenue: 3800,
    weekRevenue: 19500,
    monthRevenue: 85000,
    rating: 4.7,
    reviews: 89,
    primaryColor: "#F59E0B",
  },
  {
    id: "4",
    name: "Salón San Fernando",
    code: "SAN-04",
    address: "High Street, San Fernando",
    city: "San Fernando",
    phone: "+1 868-656-7890",
    email: "sanfernando@beauty.com",
    manager: "Pedro Ramírez",
    managerPhone: "+1 868-689-4567",
    status: "maintenance",
    openingTime: "09:00",
    closingTime: "18:00",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    staff: 5,
    todayAppointments: 0,
    todayRevenue: 0,
    weekRevenue: 12000,
    monthRevenue: 68000,
    rating: 4.5,
    reviews: 67,
    primaryColor: "#10B981",
  },
];

const branchComparison = [
  { metric: "Ingresos Mensuales", pos: 185000, west: 142000, trin: 85000, san: 68000 },
  { metric: "Personal", pos: 12, west: 8, trin: 6, san: 5 },
  { metric: "Citas/Día (Prom)", pos: 35, west: 28, trin: 20, san: 18 },
  { metric: "Ticket Promedio", pos: 220, west: 195, trin: 175, san: 165 },
];

export function BeautyBranches() {
  const [activeTab, setActiveTab] = useState<"overview" | "comparison">("overview");
  const [newBranchOpen, setNewBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const totalRevenue = mockBranches.reduce((sum, b) => sum + b.monthRevenue, 0);
  const totalStaff = mockBranches.reduce((sum, b) => sum + b.staff, 0);
  const totalAppointments = mockBranches.reduce((sum, b) => sum + b.todayAppointments, 0);
  const activeBranches = mockBranches.filter(b => b.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500 rounded-lg text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-700">{mockBranches.length}</p>
                <p className="text-sm text-pink-600">{activeBranches} Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  TT${(totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-green-600">Ingresos Totales/Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{totalStaff}</p>
                <p className="text-sm text-purple-600">Empleados Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{totalAppointments}</p>
                <p className="text-sm text-blue-600">Citas Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
          className={activeTab === "overview" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Sedes
        </Button>
        <Button
          variant={activeTab === "comparison" ? "default" : "ghost"}
          onClick={() => setActiveTab("comparison")}
          className={activeTab === "comparison" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Comparativo
        </Button>
      </div>

      {/* Branches Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Todas las Sedes</h2>
            <Dialog open={newBranchOpen} onOpenChange={setNewBranchOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Sede
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nueva Sede</DialogTitle>
                  <DialogDescription>
                    Agrega una nueva ubicación a tu cadena de salones
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nombre de la Sede</label>
                      <Input placeholder="Ej: Salón Chaguanas" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Código</label>
                      <Input placeholder="Ej: CHA-05" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Dirección</label>
                    <Input placeholder="Dirección completa" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Ciudad</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pos">Port of Spain</SelectItem>
                          <SelectItem value="san">San Fernando</SelectItem>
                          <SelectItem value="cha">Chaguanas</SelectItem>
                          <SelectItem value="diego">Diego Martin</SelectItem>
                          <SelectItem value="ari">Arima</SelectItem>
                          <SelectItem value="tri">Trincity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Teléfono</label>
                      <Input placeholder="+1 868-XXX-XXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input type="email" placeholder="sede@beauty.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">WhatsApp</label>
                      <Input placeholder="+1 868-XXX-XXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Horario Apertura</label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Horario Cierre</label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gerente de Sede</label>
                    <Input placeholder="Nombre del gerente" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setNewBranchOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={() => setNewBranchOpen(false)}>
                      Guardar Sede
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Branch Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockBranches.map((branch) => (
              <Card 
                key={branch.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  branch.status === "maintenance" ? "border-yellow-300 bg-yellow-50/30" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: branch.primaryColor }}
                      >
                        {branch.code.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{branch.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {branch.city}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        branch.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {branch.status === "active" ? (
                        <>
                          <Wifi className="h-3 w-3 mr-1" />
                          Activa
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3 mr-1" />
                          Mantenimiento
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{branch.todayAppointments}</p>
                      <p className="text-xs text-gray-500">Citas Hoy</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        TT${(branch.todayRevenue / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-gray-500">Hoy</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{branch.staff}</p>
                      <p className="text-xs text-gray-500">Staff</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-bold text-yellow-600">{branch.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>

                  {/* Manager Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{branch.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {branch.openingTime} - {branch.closingTime}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Reportes
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Comparativo de Sedes</h2>
            <Select defaultValue="month">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingresos por Sede</CardTitle>
              <CardDescription>Comparación mensual de ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBranches.map((branch) => {
                  const maxRevenue = Math.max(...mockBranches.map(b => b.monthRevenue));
                  const percentage = (branch.monthRevenue / maxRevenue) * 100;
                  
                  return (
                    <div key={branch.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{branch.code} - {branch.city}</span>
                        <span className="font-bold">TT${branch.monthRevenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: branch.primaryColor 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métricas Comparativas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-4 font-medium text-gray-500">Métrica</th>
                      <th className="text-right p-4 font-medium text-gray-500">POS-01</th>
                      <th className="text-right p-4 font-medium text-gray-500">WES-02</th>
                      <th className="text-right p-4 font-medium text-gray-500">TRI-03</th>
                      <th className="text-right p-4 font-medium text-gray-500">SAN-04</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Ingresos Mensuales</td>
                      <td className="p-4 text-right font-bold text-green-600">TT$185,000</td>
                      <td className="p-4 text-right">TT$142,000</td>
                      <td className="p-4 text-right">TT$85,000</td>
                      <td className="p-4 text-right">TT$68,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Personal</td>
                      <td className="p-4 text-right">12</td>
                      <td className="p-4 text-right">8</td>
                      <td className="p-4 text-right">6</td>
                      <td className="p-4 text-right">5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Citas/Día (Prom)</td>
                      <td className="p-4 text-right font-bold">35</td>
                      <td className="p-4 text-right">28</td>
                      <td className="p-4 text-right">20</td>
                      <td className="p-4 text-right">18</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Ticket Promedio</td>
                      <td className="p-4 text-right font-bold">TT$220</td>
                      <td className="p-4 text-right">TT$195</td>
                      <td className="p-4 text-right">TT$175</td>
                      <td className="p-4 text-right">TT$165</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Rating</td>
                      <td className="p-4 text-right font-bold">4.8 ⭐</td>
                      <td className="p-4 text-right">4.6 ⭐</td>
                      <td className="p-4 text-right">4.7 ⭐</td>
                      <td className="p-4 text-right">4.5 ⭐</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4 font-bold">Ingreso por Empleado</td>
                      <td className="p-4 text-right font-bold text-green-600">TT$15,417</td>
                      <td className="p-4 text-right">TT$17,750</td>
                      <td className="p-4 text-right">TT$14,167</td>
                      <td className="p-4 text-right">TT$13,600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Consolidated Summary */}
          <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Resumen Consolidado</h3>
                  <p className="text-sm text-gray-600">Todas las sedes combinadas</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-pink-600">
                    TT${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Ingresos totales del mes</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mockBranches.length}</p>
                  <p className="text-sm text-gray-500">Sedes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
                  <p className="text-sm text-gray-500">Empleados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    TT${Math.round(totalRevenue / totalStaff).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Ingreso/Empleado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                  <p className="text-sm text-gray-500">Rating Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
