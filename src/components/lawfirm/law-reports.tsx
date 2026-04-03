"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Briefcase,
  Clock,
  Download,
  FileText,
  PieChart,
  Activity,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Mail,
} from "lucide-react";

// Mock data for reports
const productivityData = [
  { attorney: "Dr. James Rodriguez", hours: 78.5, billable: 78.5, rate: 1025, revenue: 80462.5 },
  { attorney: "Sarah Johnson", hours: 52, billable: 48, rate: 900, revenue: 43200 },
  { attorney: "Maria Chen", hours: 45, billable: 42, rate: 750, revenue: 31500 },
  { attorney: "David Singh", hours: 38, billable: 35, rate: 800, revenue: 28000 },
];

const practiceAreaData = [
  { area: "Corporativo", cases: 6, hours: 120, revenue: 142000, percent: 35 },
  { area: "Civil", cases: 8, hours: 95, revenue: 85750, percent: 21 },
  { area: "Penal", cases: 2, hours: 52, revenue: 49400, percent: 12 },
  { area: "Familia", cases: 5, hours: 40, revenue: 45000, percent: 11 },
  { area: "Sucesiones", cases: 3, hours: 28, revenue: 35000, percent: 9 },
  { area: "Inmobiliario", cases: 4, hours: 35, revenue: 48000, percent: 12 },
];

const monthlyRevenue = [
  { month: "Oct 2025", revenue: 125000, expenses: 45000 },
  { month: "Nov 2025", revenue: 138000, expenses: 48000 },
  { month: "Dec 2025", revenue: 95000, expenses: 52000 },
  { month: "Jan 2026", revenue: 145000, expenses: 46000 },
  { month: "Feb 2026", revenue: 152000, expenses: 49000 },
  { month: "Mar 2026", revenue: 186275, expenses: 51000 },
];

export function LawReports() {
  const [period, setPeriod] = useState("month");
  const [reportType, setReportType] = useState("overview");

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const totalHours = productivityData.reduce((sum, a) => sum + a.hours, 0);
  const billableRate = (productivityData.reduce((sum, a) => sum + a.billable, 0) / totalHours * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>
          <p className="text-gray-500">Métricas de rendimiento y productividad de la firma</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            <p className="text-2xl font-bold">TT${(totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500">Ingresos del Período</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                {billableRate}%
              </Badge>
            </div>
            <p className="text-2xl font-bold">{totalHours}h</p>
            <p className="text-sm text-gray-500">Horas Trabajadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">+3</Badge>
            </div>
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-gray-500">Casos Activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#C4A35A]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#C4A35A]" />
              </div>
              <Badge className="bg-[#C4A35A]/20 text-[#C4A35A]">
                TT$170.5K
              </Badge>
            </div>
            <p className="text-2xl font-bold">TT${(netIncome / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-500">Ingreso Neto</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="productivity">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="productivity">Productividad</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="cases">Casos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        {/* Productivity Tab */}
        <TabsContent value="productivity" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attorney Productivity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rendimiento por Abogado</CardTitle>
                <CardDescription>Horas facturables y generados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productivityData.map((attorney) => (
                    <div key={attorney.attorney} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{attorney.attorney}</p>
                          <p className="text-xs text-gray-500">
                            {attorney.hours}h trabajadas • {attorney.billable}h facturables
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#C4A35A]">
                            TT${attorney.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            TT${attorney.rate}/hr
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-full bg-[#1E3A5F] rounded-full"
                          style={{ width: `${(attorney.revenue / 80462.5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hours Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribución de Horas</CardTitle>
                <CardDescription>Por área de práctica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceAreaData.map((area) => (
                    <div key={area.area} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{area.area}</span>
                          <span className="text-sm text-gray-500">{area.hours}h</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1E3A5F] to-[#C4A35A]"
                            style={{ width: `${area.percent}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-medium text-sm w-24 text-right">
                        TT${(area.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Tendencia de Ingresos</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-4">
                  {monthlyRevenue.map((m, idx) => {
                    const maxHeight = 180;
                    const revenueHeight = (m.revenue / 200000) * maxHeight;
                    const expenseHeight = (m.expenses / 200000) * maxHeight;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex gap-1 justify-center" style={{ height: maxHeight }}>
                          <div
                            className="w-6 bg-gradient-to-t from-[#1E3A5F] to-[#2C4A6F] rounded-t"
                            style={{ height: revenueHeight, marginTop: maxHeight - revenueHeight }}
                          />
                          <div
                            className="w-6 bg-gradient-to-t from-red-400 to-red-500 rounded-t"
                            style={{ height: expenseHeight, marginTop: maxHeight - expenseHeight }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center">{m.month}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-[#1E3A5F] rounded" />
                    <span className="text-sm text-gray-500">Ingresos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-red-400 rounded" />
                    <span className="text-sm text-gray-500">Gastos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Ingresos Totales</span>
                  <span className="font-bold text-green-600">TT${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Gastos Totales</span>
                  <span className="font-bold text-red-600">TT${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#C4A35A]/10 rounded-lg">
                  <span className="text-sm font-medium">Ingreso Neto</span>
                  <span className="font-bold text-[#C4A35A]">TT${netIncome.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">Margen de Ganancia</span>
                  <span className="font-bold text-blue-600">
                    {((netIncome / totalRevenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Accounts Receivable */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cuentas por Cobrar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">0-30 días</span>
                  <span className="font-medium">TT$45,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">31-60 días</span>
                  <span className="font-medium text-yellow-600">TT$28,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">61-90 días</span>
                  <span className="font-medium text-orange-600">TT$15,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">90+ días</span>
                  <span className="font-medium text-red-600">TT$8,275</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total por Cobrar</span>
                    <span className="text-[#C4A35A]">TT$96,775</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cases Tab */}
        <TabsContent value="cases" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practiceAreaData.map((area) => (
              <Card key={area.area}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{area.area}</h3>
                    <Badge variant="outline">{area.cases} casos</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horas</span>
                      <span>{area.hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ingresos</span>
                      <span className="font-medium text-[#C4A35A]">
                        TT${area.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">% del Total</span>
                      <span>{area.percent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Clientes por Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "TT Corporation Ltd.", cases: 1, revenue: 94200 },
                  { name: "Rajesh Singh", cases: 1, revenue: 49400 },
                  { name: "Robert Smith", cases: 1, revenue: 38675 },
                  { name: "Maria Williams", cases: 1, revenue: 8000 },
                  { name: "Ana Garcia", cases: 1, revenue: 7500 },
                ].map((client, idx) => (
                  <div key={client.name} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.cases} caso(s) activo(s)</p>
                    </div>
                    <span className="font-bold text-[#C4A35A]">
                      TT${client.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
