"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  UserCircle,
  Plus,
  Search,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Award,
} from "lucide-react";

const staffRoles = [
  { id: "OWNER", name: "Propietario", color: "bg-purple-100 text-purple-700" },
  { id: "MANAGER", name: "Gerente", color: "bg-blue-100 text-blue-700" },
  { id: "STYLIST", name: "Estilista", color: "bg-pink-100 text-pink-700" },
  { id: "BARBER", name: "Barbero", color: "bg-indigo-100 text-indigo-700" },
  { id: "NAIL_TECH", name: "Técnica de Uñas", color: "bg-rose-100 text-rose-700" },
  { id: "MAKEUP_ARTIST", name: "Maquillista", color: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "RECEPTIONIST", name: "Recepcionista", color: "bg-gray-100 text-gray-700" },
  { id: "ASSISTANT", name: "Asistente", color: "bg-green-100 text-green-700" },
];

const staffLevels = [
  { id: "JUNIOR", name: "Junior" },
  { id: "MID", name: "Intermedio" },
  { id: "SENIOR", name: "Senior" },
  { id: "MASTER", name: "Master" },
  { id: "EXPERT", name: "Experto" },
];

const mockStaff = [
  {
    id: "1",
    name: "Ana García",
    email: "ana@salon.com",
    phone: "868-555-0101",
    role: "STYLIST",
    level: "SENIOR",
    specializations: ["Colorimetría", "Cortes de tendencia", "Novias"],
    commission: 20,
    productCommission: 10,
    clients: 156,
    totalSales: 24500,
    totalCommission: 4900,
    rating: 4.9,
    reviews: 89,
    hireDate: "2022-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Pedro López",
    email: "pedro@salon.com",
    phone: "868-555-0102",
    role: "BARBER",
    level: "MASTER",
    specializations: ["Cortes clásicos", "Barba", "Diseños"],
    commission: 25,
    productCommission: 10,
    clients: 203,
    totalSales: 18900,
    totalCommission: 4725,
    rating: 4.8,
    reviews: 124,
    hireDate: "2021-06-01",
    status: "active",
  },
  {
    id: "3",
    name: "Sofía Martínez",
    email: "sofia@salon.com",
    phone: "868-555-0103",
    role: "NAIL_TECH",
    level: "EXPERT",
    specializations: ["Uñas acrílicas", "Gel", "Nail Art"],
    commission: 25,
    productCommission: 15,
    clients: 98,
    totalSales: 16700,
    totalCommission: 4175,
    rating: 5.0,
    reviews: 67,
    hireDate: "2020-09-10",
    status: "active",
  },
  {
    id: "4",
    name: "Carmen Ruiz",
    email: "carmen@salon.com",
    phone: "868-555-0104",
    role: "MAKEUP_ARTIST",
    level: "SENIOR",
    specializations: ["Maquillaje social", "Novias", "Efectos especiales"],
    commission: 20,
    productCommission: 10,
    clients: 78,
    totalSales: 12300,
    totalCommission: 2460,
    rating: 4.7,
    reviews: 45,
    hireDate: "2023-01-20",
    status: "active",
  },
  {
    id: "5",
    name: "Luis Torres",
    email: "luis@salon.com",
    phone: "868-555-0105",
    role: "ASSISTANT",
    level: "JUNIOR",
    specializations: ["Lavado", "Preparación"],
    commission: 5,
    productCommission: 0,
    clients: 0,
    totalSales: 0,
    totalCommission: 0,
    rating: 0,
    reviews: 0,
    hireDate: "2025-11-01",
    status: "active",
  },
];

export function BeautyStaff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [newStaffOpen, setNewStaffOpen] = useState(false);

  const getRoleInfo = (roleId: string) => {
    return staffRoles.find((r) => r.id === roleId) || staffRoles[2];
  };

  const getLevelInfo = (levelId: string) => {
    return staffLevels.find((l) => l.id === levelId) || staffLevels[0];
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <UserCircle className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">Total Equipo</p>
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
                <p className="text-2xl font-bold">TT$72,400</p>
                <p className="text-sm text-gray-500">Ventas del Mes</p>
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
                <p className="text-2xl font-bold">TT$16,260</p>
                <p className="text-sm text-gray-500">Comisiones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.85</p>
                <p className="text-sm text-gray-500">Rating Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar empleado..."
              className="w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {staffRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={newStaffOpen} onOpenChange={setNewStaffOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Empleado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Nombre
                  </label>
                  <Input placeholder="Nombre" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Apellido
                  </label>
                  <Input placeholder="Apellido" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <Input type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Teléfono
                </label>
                <Input placeholder="868-XXX-XXXX" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Rol
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Nivel
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Comisión Servicios (%)
                  </label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Comisión Productos (%)
                  </label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setNewStaffOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                  onClick={() => setNewStaffOpen(false)}
                >
                  Crear Empleado
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockStaff.map((staff) => {
          const role = getRoleInfo(staff.role);
          const level = getLevelInfo(staff.level);

          return (
            <Card key={staff.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-bold text-lg">
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{staff.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={role.color}>{role.name}</Badge>
                        <Badge variant="outline">{level.name}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{staff.rating || "-"}</span>
                    {staff.reviews > 0 && (
                      <span className="text-sm text-gray-500">
                        ({staff.reviews})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {staff.clients}
                    </p>
                    <p className="text-xs text-gray-500">Clientes</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      TT${staff.totalSales.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Ventas</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">
                      TT${staff.totalCommission.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Comisión</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {staff.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {staff.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Desde {staff.hireDate}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {staff.specializations.map((spec, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-pink-200 text-pink-600"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Comisión:{" "}
                    <span className="font-medium text-gray-900">
                      {staff.commission}%
                    </span>{" "}
                    servicios,{" "}
                    <span className="font-medium text-gray-900">
                      {staff.productCommission}%
                    </span>{" "}
                    productos
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
