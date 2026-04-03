"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  FileText,
  Download,
  Send,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Calculator,
  PieChart,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  FileSpreadsheet,
  Users,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Printer,
  Mail,
} from "lucide-react";

// Plan de Cuentas - Chart of Accounts for Trinidad & Tobago
const defaultAccounts = [
  // ACTIVOS (Assets)
  { code: "1.0.0", name: "ACTIVOS", type: "header", normalBalance: "debit" },
  { code: "1.1.0", name: "Activo Corriente", type: "header", normalBalance: "debit" },
  { code: "1.1.1", name: "Caja", type: "asset", normalBalance: "debit" },
  { code: "1.1.2", name: "Banco - Cuenta Corriente", type: "asset", normalBalance: "debit", isBank: true },
  { code: "1.1.3", name: "Banco - Cuenta de Ahorro", type: "asset", normalBalance: "debit", isBank: true },
  { code: "1.1.4", name: "Cuentas por Cobrar", type: "asset", normalBalance: "debit" },
  { code: "1.1.5", name: "Inventarios", type: "asset", normalBalance: "debit" },
  { code: "1.1.6", name: "Anticipos a Empleados", type: "asset", normalBalance: "debit" },
  { code: "1.2.0", name: "Activo Fijo", type: "header", normalBalance: "debit" },
  { code: "1.2.1", name: "Equipos de Salón", type: "asset", normalBalance: "debit" },
  { code: "1.2.2", name: "Mobiliario y Equipo", type: "asset", normalBalance: "debit" },
  { code: "1.2.3", name: "Depreciación Acumulada", type: "asset", normalBalance: "credit" },
  { code: "1.3.0", name: "Activo Intangible", type: "header", normalBalance: "debit" },
  { code: "1.3.1", name: "Software y Licencias", type: "asset", normalBalance: "debit" },

  // PASIVOS (Liabilities)
  { code: "2.0.0", name: "PASIVOS", type: "header", normalBalance: "credit" },
  { code: "2.1.0", name: "Pasivo Corriente", type: "header", normalBalance: "credit" },
  { code: "2.1.1", name: "Cuentas por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.2", name: "Nómina por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.3", name: "IVA por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.4", name: "National Insurance por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.5", name: "Health Surcharge por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.6", name: "Impuesto sobre la Renta por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.1.7", name: "Anticipos de Clientes", type: "liability", normalBalance: "credit" },
  { code: "2.1.8", name: "Comisiones por Pagar", type: "liability", normalBalance: "credit" },
  { code: "2.2.0", name: "Pasivo Largo Plazo", type: "header", normalBalance: "credit" },
  { code: "2.2.1", name: "Préstamos Bancarios", type: "liability", normalBalance: "credit" },
  { code: "2.2.2", name: "Leasing", type: "liability", normalBalance: "credit" },

  // CAPITAL (Equity)
  { code: "3.0.0", name: "CAPITAL", type: "header", normalBalance: "credit" },
  { code: "3.1.1", name: "Capital Social", type: "equity", normalBalance: "credit" },
  { code: "3.1.2", name: "Utilidades Retenidas", type: "equity", normalBalance: "credit" },
  { code: "3.1.3", name: "Resultado del Ejercicio", type: "equity", normalBalance: "credit" },

  // INGRESOS (Income)
  { code: "4.0.0", name: "INGRESOS", type: "header", normalBalance: "credit" },
  { code: "4.1.1", name: "Ingresos por Servicios", type: "income", normalBalance: "credit" },
  { code: "4.1.2", name: "Ingresos por Productos", type: "income", normalBalance: "credit" },
  { code: "4.1.3", name: "Ingresos por Membresías", type: "income", normalBalance: "credit" },
  { code: "4.1.4", name: "Propinas Recibidas", type: "income", normalBalance: "credit" },
  { code: "4.1.5", name: "Descuentos Concedidos", type: "income", normalBalance: "debit" },
  { code: "4.2.1", name: "Otros Ingresos", type: "income", normalBalance: "credit" },

  // GASTOS (Expenses)
  { code: "5.0.0", name: "GASTOS OPERATIVOS", type: "header", normalBalance: "debit" },
  { code: "5.1.1", name: "Alquiler", type: "expense", normalBalance: "debit" },
  { code: "5.1.2", name: "Servicios Públicos", type: "expense", normalBalance: "debit" },
  { code: "5.1.3", name: "Electricidad", type: "expense", normalBalance: "debit" },
  { code: "5.1.4", name: "Agua", type: "expense", normalBalance: "debit" },
  { code: "5.1.5", name: "Internet y Teléfono", type: "expense", normalBalance: "debit" },
  { code: "5.2.1", name: "Nómina de Empleados", type: "expense", normalBalance: "debit" },
  { code: "5.2.2", name: "Comisiones Pagadas", type: "expense", normalBalance: "debit" },
  { code: "5.2.3", name: "Beneficios de Empleados", type: "expense", normalBalance: "debit" },
  { code: "5.3.1", name: "Mantenimiento de Equipo", type: "expense", normalBalance: "debit" },
  { code: "5.3.2", name: "Mantenimiento de AC", type: "expense", normalBalance: "debit" },
  { code: "5.3.3", name: "Reparaciones", type: "expense", normalBalance: "debit" },
  { code: "5.4.1", name: "Inventario Usado", type: "expense", normalBalance: "debit" },
  { code: "5.4.2", name: "Productos para Venta - Costo", type: "expense", normalBalance: "debit" },
  { code: "5.5.1", name: "Marketing y Publicidad", type: "expense", normalBalance: "debit" },
  { code: "5.5.2", name: "Seguros", type: "expense", normalBalance: "debit" },
  { code: "5.5.3", name: "Gastos Bancarios", type: "expense", normalBalance: "debit" },
  { code: "5.5.4", name: "Gastos de Oficina", type: "expense", normalBalance: "debit" },
  { code: "5.6.1", name: "Depreciación", type: "expense", normalBalance: "debit" },
  { code: "5.7.1", name: "Impuestos y Licencias", type: "expense", normalBalance: "debit" },
  { code: "5.7.2", name: "Gastos Varios", type: "expense", normalBalance: "debit" },
];

// Asientos contables de ejemplo
const mockJournalEntries = [
  {
    id: "1",
    entryNumber: "AS-2026-001",
    date: "2026-03-27",
    description: "Ventas del día - Servicios",
    entries: [
      { account: "1.1.1", accountName: "Caja", debit: 8500, credit: 0 },
      { account: "4.1.1", accountName: "Ingresos por Servicios", debit: 0, credit: 8500 },
    ],
    status: "posted",
    postedBy: "Admin",
  },
  {
    id: "2",
    entryNumber: "AS-2026-002",
    date: "2026-03-27",
    description: "Pago de alquiler mensual",
    entries: [
      { account: "5.1.1", accountName: "Alquiler", debit: 8500, credit: 0 },
      { account: "1.1.2", accountName: "Banco - Cuenta Corriente", debit: 0, credit: 8500 },
    ],
    status: "posted",
    postedBy: "Admin",
  },
  {
    id: "3",
    entryNumber: "AS-2026-003",
    date: "2026-03-27",
    description: "Compra de productos para inventario",
    entries: [
      { account: "1.1.5", accountName: "Inventarios", debit: 3200, credit: 0 },
      { account: "1.1.2", accountName: "Banco - Cuenta Corriente", debit: 0, credit: 3200 },
    ],
    status: "pending",
    postedBy: null,
  },
  {
    id: "4",
    entryNumber: "AS-2026-004",
    date: "2026-03-26",
    description: "Pago de nómina quincenal",
    entries: [
      { account: "5.2.1", accountName: "Nómina de Empleados", debit: 12500, credit: 0 },
      { account: "2.1.2", accountName: "Nómina por Pagar", debit: 0, credit: 12500 },
    ],
    status: "posted",
    postedBy: "Admin",
  },
  {
    id: "5",
    entryNumber: "AS-2026-005",
    date: "2026-03-26",
    description: "Provisión de National Insurance",
    entries: [
      { account: "5.2.3", accountName: "Beneficios de Empleados", debit: 1650, credit: 0 },
      { account: "2.1.4", accountName: "National Insurance por Pagar", debit: 0, credit: 1650 },
    ],
    status: "posted",
    postedBy: "Admin",
  },
];

// Balances de prueba
const mockTrialBalance = [
  { account: "1.1.1", name: "Caja", debit: 45000, credit: 38000 },
  { account: "1.1.2", name: "Banco - Cuenta Corriente", debit: 125000, credit: 42000 },
  { account: "1.1.5", name: "Inventarios", debit: 18500, credit: 8500 },
  { account: "2.1.1", name: "Cuentas por Pagar", debit: 0, credit: 12500 },
  { account: "4.1.1", name: "Ingresos por Servicios", debit: 0, credit: 285000 },
  { account: "4.1.2", name: "Ingresos por Productos", debit: 0, credit: 45000 },
  { account: "5.1.1", name: "Alquiler", debit: 25500, credit: 0 },
  { account: "5.1.3", name: "Electricidad", debit: 3600, credit: 0 },
  { account: "5.2.1", name: "Nómina de Empleados", debit: 85000, credit: 0 },
];

export function BeautyAccounting() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Array<{
    account: string;
    debit: number;
    credit: number;
  }>>([{ account: "", debit: 0, credit: 0 }]);

  const totalDebits = mockTrialBalance.reduce((sum, a) => sum + a.debit, 0);
  const totalCredits = mockTrialBalance.reduce((sum, a) => sum + a.credit, 0);
  const isBalanced = totalDebits === totalCredits;

  const addAccountLine = () => {
    setSelectedAccounts([...selectedAccounts, { account: "", debit: 0, credit: 0 }]);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {mockJournalEntries.filter(e => e.status === "posted").length}
                </p>
                <p className="text-sm text-blue-600">Asientos Contables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  TT${totalDebits.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Total Débitos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  TT${totalCredits.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">Total Créditos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br ${isBalanced ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-red-50 to-red-100 border-red-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg text-white ${isBalanced ? 'bg-emerald-500' : 'bg-red-500'}`}>
                {isBalanced ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </div>
              <div>
                <p className={`text-2xl font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isBalanced ? "Balanceado" : "Diferencia"}
                </p>
                <p className={`text-sm ${isBalanced ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isBalanced ? "Partida Doble OK" : `TT$${Math.abs(totalDebits - totalCredits).toLocaleString()}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          onClick={() => setActiveTab("dashboard")}
          className={activeTab === "dashboard" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <PieChart className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "journal" ? "default" : "ghost"}
          onClick={() => setActiveTab("journal")}
          className={activeTab === "journal" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Diario General
        </Button>
        <Button
          variant={activeTab === "ledger" ? "default" : "ghost"}
          onClick={() => setActiveTab("ledger")}
          className={activeTab === "ledger" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Mayor General
        </Button>
        <Button
          variant={activeTab === "trial" ? "default" : "ghost"}
          onClick={() => setActiveTab("trial")}
          className={activeTab === "trial" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Balance de Comprobación
        </Button>
        <Button
          variant={activeTab === "chart" ? "default" : "ghost"}
          onClick={() => setActiveTab("chart")}
          className={activeTab === "chart" ? "bg-pink-500 hover:bg-pink-600 rounded-b-none" : "rounded-b-none"}
        >
          <FileText className="h-4 w-4 mr-2" />
          Plan de Cuentas
        </Button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:border-pink-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-pink-100 rounded-full w-fit mx-auto mb-3">
                      <Plus className="h-6 w-6 text-pink-600" />
                    </div>
                    <p className="font-medium">Nuevo Asiento</p>
                    <p className="text-sm text-gray-500">Crear asiento contable</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Nuevo Asiento Contable</DialogTitle>
                  <DialogDescription>
                    Registre una transacción siguiendo el principio de partida doble
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Fecha</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Referencia</label>
                      <Input placeholder="AS-2026-XXX" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Descripción</label>
                    <Textarea placeholder="Descripción del asiento..." rows={2} />
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-1/2">Cuenta</TableHead>
                          <TableHead className="text-right">Débito</TableHead>
                          <TableHead className="text-right">Crédito</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAccounts.map((line, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar cuenta..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {defaultAccounts
                                    .filter(a => a.type !== "header")
                                    .map((account) => (
                                      <SelectItem key={account.code} value={account.code}>
                                        {account.code} - {account.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="text-right"
                                value={line.debit || ""}
                                onChange={(e) => {
                                  const newAccounts = [...selectedAccounts];
                                  newAccounts[index].debit = parseFloat(e.target.value) || 0;
                                  setSelectedAccounts(newAccounts);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="text-right"
                                value={line.credit || ""}
                                onChange={(e) => {
                                  const newAccounts = [...selectedAccounts];
                                  newAccounts[index].credit = parseFloat(e.target.value) || 0;
                                  setSelectedAccounts(newAccounts);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <Button variant="outline" onClick={addAccountLine} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Línea
                  </Button>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex gap-6">
                      <div>
                        <span className="text-sm text-gray-500">Total Débitos:</span>
                        <span className="ml-2 font-bold">
                          TT${selectedAccounts.reduce((sum, a) => sum + (a.debit || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total Créditos:</span>
                        <span className="ml-2 font-bold">
                          TT${selectedAccounts.reduce((sum, a) => sum + (a.credit || 0), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={
                      selectedAccounts.reduce((sum, a) => sum + (a.debit || 0), 0) === 
                      selectedAccounts.reduce((sum, a) => sum + (a.credit || 0), 0)
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }>
                      {selectedAccounts.reduce((sum, a) => sum + (a.debit || 0), 0) === 
                      selectedAccounts.reduce((sum, a) => sum + (a.credit || 0), 0)
                        ? "Balanceado ✓"
                        : "Desequilibrado"}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setNewEntryOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={() => setNewEntryOpen(false)}>
                      Guardar Asiento
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="cursor-pointer hover:border-pink-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium">Estado de Resultados</p>
                <p className="text-sm text-gray-500">Ingresos vs Gastos</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-pink-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-medium">Balance General</p>
                <p className="text-sm text-gray-500">Activos, Pasivos, Capital</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-pink-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
                <p className="font-medium">Enviar al Contador</p>
                <p className="text-sm text-gray-500">Exportar y notificar</p>
              </CardContent>
            </Card>
          </div>

          {/* Income Statement Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Estado de Resultados - Marzo 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Ingresos */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">INGRESOS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Servicios</span>
                        <span>TT$285,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Productos</span>
                        <span>TT$45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membresías</span>
                        <span>TT$12,500</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2 text-green-600">
                        <span>Total Ingresos</span>
                        <span>TT$342,500</span>
                      </div>
                    </div>
                  </div>

                  {/* Gastos */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">GASTOS OPERATIVOS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nómina</span>
                        <span>TT$85,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alquiler</span>
                        <span>TT$25,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Servicios Públicos</span>
                        <span>TT$8,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inventario Usado</span>
                        <span>TT$42,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Otros Gastos</span>
                        <span>TT$15,800</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2 text-red-600">
                        <span>Total Gastos</span>
                        <span>TT$176,500</span>
                      </div>
                    </div>
                  </div>

                  {/* Utilidad Neta */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-green-600">UTILIDAD NETA</p>
                        <p className="text-2xl font-bold text-green-700">TT$166,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Margen de Utilidad</p>
                        <p className="text-xl font-bold text-green-700">48.5%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accountant Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Integración con Contador
                </CardTitle>
                <CardDescription>
                  Todo listo para tu contador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium text-green-700">Documentos Listos</p>
                      <p className="text-sm text-green-600">Todos los reportes generados</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Balance General - Marzo 2026
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Estado de Resultados - Q1 2026
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Libro de Ventas - Marzo 2026
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Libro de Compras - Marzo 2026
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Mayor General - Marzo 2026
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Contador Asignado</p>
                      <p className="text-sm text-gray-500">contador@ejemplo.com</p>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Todos los Reportes al Contador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === "journal" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Libro Diario General</h2>
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => setNewEntryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Asiento
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>No. Asiento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockJournalEntries.map((entry) => (
                    entry.entries.map((line, lineIndex) => (
                      <TableRow key={`${entry.id}-${lineIndex}`} className={lineIndex > 0 ? "bg-gray-50" : ""}>
                        {lineIndex === 0 ? (
                          <>
                            <TableCell rowSpan={entry.entries.length} className="font-medium">
                              {entry.entryNumber}
                            </TableCell>
                            <TableCell rowSpan={entry.entries.length}>
                              {entry.date}
                            </TableCell>
                            <TableCell rowSpan={entry.entries.length} className="max-w-xs">
                              {entry.description}
                            </TableCell>
                          </>
                        ) : null}
                        <TableCell className="pl-8 text-gray-600">
                          {line.account} - {line.accountName}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.debit > 0 ? `TT$${line.debit.toLocaleString()}` : ""}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit > 0 ? `TT$${line.credit.toLocaleString()}` : ""}
                        </TableCell>
                        {lineIndex === 0 ? (
                          <>
                            <TableCell rowSpan={entry.entries.length}>
                              <Badge className={
                                entry.status === "posted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }>
                                {entry.status === "posted" ? "Contabilizado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                            <TableCell rowSpan={entry.entries.length}>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : null}
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trial Balance Tab */}
      {activeTab === "trial" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Balance de Comprobación - Marzo 2026</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre de Cuenta</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTrialBalance.map((account) => (
                    <TableRow key={account.account}>
                      <TableCell className="font-mono">{account.account}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="text-right">
                        {account.debit > 0 ? `TT$${account.debit.toLocaleString()}` : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.credit > 0 ? `TT$${account.credit.toLocaleString()}` : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell colSpan={2}>TOTALES</TableCell>
                    <TableCell className="text-right">TT${totalDebits.toLocaleString()}</TableCell>
                    <TableCell className="text-right">TT${totalCredits.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {isBalanced && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-green-700">Balance Correcto</p>
                <p className="text-sm text-green-600">
                  Los débitos igualan a los créditos. La partida doble está balanceada.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart of Accounts Tab */}
      {activeTab === "chart" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Plan de Cuentas</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cuenta
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre de Cuenta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Saldo Normal</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultAccounts.map((account) => (
                    <TableRow 
                      key={account.code}
                      className={account.type === "header" ? "bg-gray-100 font-semibold" : ""}
                    >
                      <TableCell className="font-mono">{account.code}</TableCell>
                      <TableCell className={account.type === "header" ? "font-bold" : "pl-8"}>
                        {account.name}
                      </TableCell>
                      <TableCell>
                        {account.type !== "header" && (
                          <Badge variant="outline">
                            {account.type === "asset" && "Activo"}
                            {account.type === "liability" && "Pasivo"}
                            {account.type === "equity" && "Capital"}
                            {account.type === "income" && "Ingreso"}
                            {account.type === "expense" && "Gasto"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.type !== "header" && (
                          <Badge className={
                            account.normalBalance === "debit"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }>
                            {account.normalBalance === "debit" ? "Débito" : "Crédito"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.type !== "header" && (
                          <Badge className="bg-green-100 text-green-700">Activa</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.type !== "header" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ledger Tab */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Libro Mayor General</h2>
            <div className="flex gap-2">
              <Select defaultValue="1.1.1">
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar cuenta..." />
                </SelectTrigger>
                <SelectContent>
                  {defaultAccounts
                    .filter(a => a.type !== "header")
                    .map((account) => (
                      <SelectItem key={account.code} value={account.code}>
                        {account.code} - {account.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cuenta: 1.1.1 - Caja</CardTitle>
                  <CardDescription>Movimientos del período</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Saldo Actual</p>
                  <p className="text-2xl font-bold text-green-600">TT$7,000</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Asiento</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2026-03-01</TableCell>
                    <TableCell>Saldo Inicial</TableCell>
                    <TableCell>Balance inicial del período</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-medium">TT$0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-15</TableCell>
                    <TableCell>AS-2026-045</TableCell>
                    <TableCell>Ventas del día</TableCell>
                    <TableCell className="text-right">TT$12,500</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">TT$12,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-20</TableCell>
                    <TableCell>AS-2026-067</TableCell>
                    <TableCell>Depósito bancario</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">TT$10,000</TableCell>
                    <TableCell className="text-right">TT$2,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-25</TableCell>
                    <TableCell>AS-2026-089</TableCell>
                    <TableCell>Ventas del día</TableCell>
                    <TableCell className="text-right">TT$8,500</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">TT$11,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2026-03-27</TableCell>
                    <TableCell>AS-2026-001</TableCell>
                    <TableCell>Ventas del día - Servicios</TableCell>
                    <TableCell className="text-right">TT$4,000</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold">TT$15,000</TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={3} className="font-bold">TOTALES</TableCell>
                    <TableCell className="text-right font-bold">TT$25,000</TableCell>
                    <TableCell className="text-right font-bold">TT$10,000</TableCell>
                    <TableCell className="text-right font-bold">TT$15,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
