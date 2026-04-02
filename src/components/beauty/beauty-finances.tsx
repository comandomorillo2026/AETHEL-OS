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
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building,
  Zap,
  Droplet,
  Wifi,
  Wrench,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";

const expenseCategories = [
  { id: "rent", name: "Alquiler", icon: Building, color: "bg-blue-100 text-blue-600" },
  { id: "electricity", name: "Electricidad", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { id: "water", name: "Agua", icon: Droplet, color: "bg-cyan-100 text-cyan-600" },
  { id: "internet", name: "Internet", icon: Wifi, color: "bg-purple-100 text-purple-600" },
  { id: "ac_maintenance", name: "Mantenimiento AC", icon: Wrench, color: "bg-orange-100 text-orange-600" },
  { id: "salary", name: "Nómina", icon: DollarSign, color: "bg-green-100 text-green-600" },
  { id: "taxes", name: "Impuestos", icon: FileText, color: "bg-red-100 text-red-600" },
  { id: "other", name: "Otros", icon: CreditCard, color: "bg-gray-100 text-gray-600" },
];

const mockExpenses = [
  {
    id: "1",
    number: "GTO-001",
    category: "rent",
    description: "Alquiler mensual - Marzo 2026",
    amount: 8500,
    dueDate: "2026-03-30",
    status: "pending",
    recurring: true,
  },
  {
    id: "2",
    number: "GTO-002",
    category: "electricity",
    description: "Electricidad - Febrero 2026",
    amount: 1250,
    dueDate: "2026-03-25",
    status: "pending",
    recurring: true,
  },
  {
    id: "3",
    number: "GTO-003",
    category: "water",
    description: "Agua - Febrero 2026",
    amount: 380,
    dueDate: "2026-03-20",
    status: "paid",
    paidAt: "2026-03-18",
    recurring: true,
  },
  {
    id: "4",
    number: "GTO-004",
    category: "internet",
    description: "Internet Fibra - Marzo 2026",
    amount: 450,
    dueDate: "2026-03-15",
    status: "paid",
    paidAt: "2026-03-14",
    recurring: true,
  },
  {
    id: "5",
    number: "GTO-005",
    category: "ac_maintenance",
    description: "Mantenimiento preventivo AC",
    amount: 800,
    dueDate: "2026-03-28",
    status: "pending",
    recurring: true,
  },
  {
    id: "6",
    number: "GTO-006",
    category: "salary",
    description: "Nómina Quincena 1 - Marzo",
    amount: 12500,
    dueDate: "2026-03-15",
    status: "paid",
    paidAt: "2026-03-15",
    recurring: true,
  },
];

const mockTaxes = [
  {
    id: "1",
    type: "vat",
    name: "IVA (Value Added Tax)",
    period: "Enero - Marzo 2026",
    grossRevenue: 125000,
    taxableAmount: 125000,
    rate: 12.5,
    amount: 15625,
    dueDate: "2026-04-30",
    status: "pending",
  },
  {
    id: "2",
    type: "business_levy",
    name: "Business Levy",
    period: "Año Fiscal 2025",
    grossRevenue: 480000,
    taxableAmount: 480000,
    rate: 0.75,
    amount: 3600,
    dueDate: "2026-04-15",
    status: "pending",
  },
  {
    id: "3",
    type: "national_insurance",
    name: "National Insurance",
    period: "Febrero 2026",
    grossRevenue: 0,
    taxableAmount: 25000,
    rate: 13.2,
    amount: 3300,
    dueDate: "2026-03-14",
    status: "paid",
  },
];

export function BeautyFinances() {
  const [activeTab, setActiveTab] = useState<"expenses" | "taxes" | "accounting">("expenses");
  const [newExpenseOpen, setNewExpenseOpen] = useState(false);

  const pendingExpenses = mockExpenses.filter((e) => e.status === "pending");
  const totalPending = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const paidThisMonth = mockExpenses
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const getCategoryInfo = (categoryId: string) => {
    return expenseCategories.find((c) => c.id === categoryId) || expenseCategories[7];
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  TT${totalPending.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Por Pagar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  TT${paidThisMonth.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Pagado este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">TT${22,525}</p>
                <p className="text-sm text-gray-500">Impuestos Pendientes</p>
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
                <p className="text-2xl font-bold">TT$42,800</p>
                <p className="text-sm text-gray-500">Balance del Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <Button
          variant={activeTab === "expenses" ? "default" : "ghost"}
          onClick={() => setActiveTab("expenses")}
          className={activeTab === "expenses" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          Gastos Operativos
        </Button>
        <Button
          variant={activeTab === "taxes" ? "default" : "ghost"}
          onClick={() => setActiveTab("taxes")}
          className={activeTab === "taxes" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          Impuestos
        </Button>
        <Button
          variant={activeTab === "accounting" ? "default" : "ghost"}
          onClick={() => setActiveTab("accounting")}
          className={activeTab === "accounting" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          Contabilidad
        </Button>
      </div>

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Gastos Operativos</h2>
            <Dialog open={newExpenseOpen} onOpenChange={setNewExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Gasto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Categoría
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Descripción
                    </label>
                    <Input placeholder="Ej: Alquiler mensual - Marzo" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Monto (TT$)
                      </label>
                      <Input type="number" placeholder="8500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Fecha de Pago
                      </label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="recurring" className="rounded" />
                    <label htmlFor="recurring" className="text-sm text-gray-700">
                      Gasto recurrente mensual
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setNewExpenseOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={() => setNewExpenseOpen(false)}>
                      Guardar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expense Categories Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expenseCategories.slice(0, 4).map((cat) => {
              const Icon = cat.icon;
              const categoryTotal = mockExpenses
                .filter((e) => e.category === cat.id)
                .reduce((sum, e) => sum + e.amount, 0);
              return (
                <Card key={cat.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${cat.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{cat.name}</p>
                        <p className="font-bold">TT${categoryTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Expenses List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockExpenses.map((expense) => {
                  const category = getCategoryInfo(expense.category);
                  const Icon = category.icon;
                  const isOverdue = expense.status === "pending" && new Date(expense.dueDate) < new Date();

                  return (
                    <div
                      key={expense.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                        isOverdue ? "bg-red-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{expense.number}</span>
                            {expense.recurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurrente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">TT${expense.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            {expense.status === "paid" ? `Pagado: ${expense.paidAt}` : `Vence: ${expense.dueDate}`}
                          </p>
                        </div>
                        {expense.status === "pending" ? (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Pagar
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pagado
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Taxes Tab */}
      {activeTab === "taxes" && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Impuestos - Trinidad & Tobago</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockTaxes.map((tax) => (
              <Card key={tax.id} className={tax.status === "pending" ? "border-yellow-200" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{tax.name}</h3>
                      <p className="text-sm text-gray-500">{tax.period}</p>
                    </div>
                    <Badge
                      className={
                        tax.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {tax.status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ingresos Brutos:</span>
                      <span>TT${tax.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monto Gravable:</span>
                      <span>TT${tax.taxableAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tasa:</span>
                      <span>{tax.rate}%</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                      <span>Total a Pagar:</span>
                      <span className="text-pink-600">TT${tax.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Vence: {tax.dueDate}
                      </span>
                      {tax.status === "pending" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Declarar
                          </Button>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Pagar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accounting Tab */}
      {activeTab === "accounting" && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Contabilidad</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar para Contador
              </Button>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Send className="h-4 w-4 mr-2" />
                Enviar al Contador
              </Button>
            </div>
          </div>

          {/* Quick Books Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <h3 className="font-medium text-green-700 mb-2">Ingresos del Mes</h3>
                <p className="text-3xl font-bold text-green-600">TT$125,400</p>
                <p className="text-sm text-green-600 mt-1">+12% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <h3 className="font-medium text-red-700 mb-2">Egresos del Mes</h3>
                <p className="text-3xl font-bold text-red-600">TT$82,600</p>
                <p className="text-sm text-red-600 mt-1">65.8% de ingresos</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <h3 className="font-medium text-purple-700 mb-2">Utilidad Neta</h3>
                <p className="text-3xl font-bold text-purple-600">TT$42,800</p>
                <p className="text-sm text-purple-600 mt-1">34.2% margen</p>
              </CardContent>
            </Card>
          </div>

          {/* Accountant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información para el Contador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Datos del Negocio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nombre Legal:</span>
                      <span>Beauty Salon S.A.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">RIF/Tax ID:</span>
                      <span>J-12345678-9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Período Fiscal:</span>
                      <span>Enero - Diciembre 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Moneda:</span>
                      <span>TTD (Dólar Trinitense)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Documentos Disponibles</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Balance General - Marzo 2026
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Estado de Resultados - Q1 2026
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Libro de Ventas - Marzo 2026
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Libro de Compras - Marzo 2026
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
