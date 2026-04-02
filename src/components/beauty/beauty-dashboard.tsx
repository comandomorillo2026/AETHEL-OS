"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Scissors,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Package,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-400">vs ayer</span>
            </div>
          </div>
          <div
            className="p-3 rounded-xl text-white"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AppointmentRowProps {
  time: string;
  client: string;
  service: string;
  staff: string;
  status: "confirmed" | "pending" | "in-progress";
}

function AppointmentRow({
  time,
  client,
  service,
  staff,
  status,
}: AppointmentRowProps) {
  const statusConfig = {
    confirmed: { label: "Confirmada", color: "bg-green-100 text-green-700" },
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
    "in-progress": { label: "En Progreso", color: "bg-blue-100 text-blue-700" },
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-16 text-sm font-medium text-gray-600">{time}</div>
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <span className="text-pink-600 font-medium text-sm">
            {client
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{client}</p>
          <p className="text-sm text-gray-500">{service}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{staff}</span>
        <Badge className={statusConfig[status].color}>
          {statusConfig[status].label}
        </Badge>
      </div>
    </div>
  );
}

interface StaffPerformanceProps {
  name: string;
  role: string;
  clients: number;
  revenue: number;
  commission: number;
  rating: number;
  avatar: string;
}

function StaffPerformance({
  name,
  role,
  clients,
  revenue,
  commission,
  rating,
  avatar,
}: StaffPerformanceProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
          {avatar}
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-medium">{clients}</p>
          <p className="text-gray-500">Clientes</p>
        </div>
        <div className="text-center">
          <p className="font-medium">TT${revenue.toLocaleString()}</p>
          <p className="text-gray-500">Ventas</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-green-600">TT${commission}</p>
          <p className="text-gray-500">Comisión</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>
    </div>
  );
}

export function BeautyDashboard() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const todayAppointments = [
    {
      time: "09:00",
      client: "María González",
      service: "Corte + Tinte",
      staff: "Ana García",
      status: "confirmed" as const,
    },
    {
      time: "10:30",
      client: "Carlos Pérez",
      service: "Corte Caballero",
      staff: "Pedro López",
      status: "in-progress" as const,
    },
    {
      time: "11:00",
      client: "Laura Rodríguez",
      service: "Manicure + Pedicure",
      staff: "Sofía Martínez",
      status: "pending" as const,
    },
    {
      time: "12:00",
      client: "Ana Martínez",
      service: "Tratamiento Facial",
      staff: "Carmen Ruiz",
      status: "confirmed" as const,
    },
    {
      time: "14:30",
      client: "Roberto Silva",
      service: "Barba + Corte",
      staff: "Pedro López",
      status: "pending" as const,
    },
  ];

  const staffPerformance = [
    {
      name: "Ana García",
      role: "Estilista Senior",
      clients: 12,
      revenue: 2400,
      commission: 480,
      rating: 4.9,
      avatar: "AG",
    },
    {
      name: "Pedro López",
      role: "Barbero",
      clients: 15,
      revenue: 1800,
      commission: 360,
      rating: 4.8,
      avatar: "PL",
    },
    {
      name: "Sofía Martínez",
      role: "Técnica de Uñas",
      clients: 8,
      revenue: 1600,
      commission: 320,
      rating: 5.0,
      avatar: "SM",
    },
    {
      name: "Carmen Ruiz",
      role: "Esteticista",
      clients: 6,
      revenue: 1200,
      commission: 240,
      rating: 4.7,
      avatar: "CR",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas del Día"
          value="TT$7,850"
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
          color="#EC4899"
        />
        <StatCard
          title="Clientes Hoy"
          value="41"
          change="+8"
          trend="up"
          icon={<Users className="h-6 w-6" />}
          color="#8B5CF6"
        />
        <StatCard
          title="Citas Programadas"
          value="28"
          change="-3"
          trend="down"
          icon={<Calendar className="h-6 w-6" />}
          color="#F59E0B"
        />
        <StatCard
          title="Ticket Promedio"
          value="TT$191"
          change="+5.2%"
          trend="up"
          icon={<CreditCard className="h-6 w-6" />}
          color="#10B981"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-pink-500" />
              Citas de Hoy
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Calendario
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {todayAppointments.map((apt, index) => (
                <AppointmentRow key={index} {...apt} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Resumen del Día
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Ocupación</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Servicios Completados</span>
                <span className="font-medium">23/41</span>
              </div>
              <Progress value={56} className="h-2 bg-gray-200 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Meta de Ventas</span>
                <span className="font-medium">TT$7,850 / TT$10,000</span>
              </div>
              <Progress value={78.5} className="h-2 bg-gray-200 [&>div]:bg-pink-500" />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <Scissors className="h-5 w-5 mx-auto text-pink-500 mb-1" />
                  <p className="text-2xl font-bold text-gray-900">41</p>
                  <p className="text-xs text-gray-500">Servicios</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Package className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Productos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Rendimiento del Equipo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={period === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("today")}
              className={period === "today" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              Hoy
            </Button>
            <Button
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("week")}
              className={period === "week" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              Semana
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("month")}
              className={period === "month" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              Mes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {staffPerformance.map((staff, index) => (
              <StaffPerformance key={index} {...staff} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Alerts & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Alertas de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-700">Alquiler - Vence en 3 días</p>
                <p className="text-sm text-red-600">TT$8,500 mensual</p>
              </div>
              <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                Pagar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-700">Electricidad - Por vencer</p>
                <p className="text-sm text-yellow-600">TT$1,200 estimado</p>
              </div>
              <Button size="sm" variant="outline" className="border-yellow-200 text-yellow-700">
                Ver
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-700">Mantenimiento AC - Programado</p>
                <p className="text-sm text-blue-600">TT$800 - 15 del mes</p>
              </div>
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700">
                Detalles
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Shampoo Profesional 1L</p>
                  <p className="text-sm text-orange-600">Quedan 2 unidades</p>
                </div>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Reordenar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tinte Rubio Ceniza</p>
                  <p className="text-sm text-orange-600">Quedan 3 unidades</p>
                </div>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Reordenar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Esmalte Rojo Classic</p>
                  <p className="text-sm text-orange-600">Quedan 5 unidades</p>
                </div>
              </div>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Reordenar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
