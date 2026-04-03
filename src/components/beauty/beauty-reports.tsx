"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Download,
  FileText,
  PieChart,
  LineChart,
} from "lucide-react";

export function BeautyReports() {
  const [period, setPeriod] = useState("month");

  const reports = [
    {
      id: "sales",
      name: "Reporte de Ventas",
      description: "Detalle de todas las ventas por período",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "staff",
      name: "Rendimiento del Equipo",
      description: "Métricas de cada estilista y comisiones",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "services",
      name: "Servicios Populares",
      description: "Ranking de servicios más solicitados",
      icon: PieChart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "clients",
      name: "Análisis de Clientes",
      description: "Retención, frecuencia y valor de clientes",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "inventory",
      name: "Reporte de Inventario",
      description: "Movimientos y valorización de productos",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "financial",
      name: "Estado Financiero",
      description: "Ingresos, gastos y utilidades",
      icon: LineChart,
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reportes y Análisis</h2>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold">TT$125,400</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes Atendidos</p>
                <p className="text-2xl font-bold">412</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+8%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Promedio</p>
                <p className="text-2xl font-bold">TT$304</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+5%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ocupación</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">-3%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ingresos por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 72, 58, 80, 95, 88, 75, 82, 91, 68, 85, 92, 78, 88, 95, 72, 80, 85, 90, 88, 75, 82, 91, 68, 85, 92, 78, 88, 95, 72].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </CardContent>
        </Card>

        {/* Services Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Servicios más Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Corte Dama", count: 145, percentage: 28 },
                { name: "Manicure + Pedicure", count: 98, percentage: 19 },
                { name: "Corte Caballero", count: 87, percentage: 17 },
                { name: "Tinte / Mechas", count: 65, percentage: 13 },
                { name: "Tratamientos Faciales", count: 52, percentage: 10 },
                { name: "Uñas Acrílicas", count: 40, percentage: 8 },
                { name: "Otros", count: 32, percentage: 5 },
              ].map((service, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-500">{service.count} ({service.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rendimiento del Equipo - Marzo 2026</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estilista</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Clientes</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ventas</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Comisión</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Ana García", role: "Estilista Senior", clients: 156, sales: 24500, commission: 4900, rating: 4.9, trend: "up" },
                  { name: "Pedro López", role: "Barbero Master", clients: 203, sales: 18900, commission: 3780, rating: 4.8, trend: "up" },
                  { name: "Sofía Martínez", role: "Técnica de Uñas", clients: 98, sales: 16700, commission: 4175, rating: 5.0, trend: "up" },
                  { name: "Carmen Ruiz", role: "Esteticista", clients: 78, sales: 12300, commission: 2460, rating: 4.7, trend: "down" },
                ].map((staff, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-pink-600 font-medium text-sm">
                            {staff.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{staff.clients}</td>
                    <td className="py-3 px-4 text-right font-medium">TT${staff.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">TT${staff.commission.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-yellow-100 text-yellow-700">
                        ⭐ {staff.rating}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {staff.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver
                    </Button>
                    <Button size="sm" className="flex-1 bg-pink-500 hover:bg-pink-600">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
