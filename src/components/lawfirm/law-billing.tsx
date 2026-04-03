"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DollarSign,
  Plus,
  Search,
  FileText,
  Download,
  Send,
  Eye,
  Edit,
  Printer,
  MoreHorizontal,
  Clock,
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Calendar,
  Filter,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  X,
} from "lucide-react";

// Mock invoices data
const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-2026-001",
    client: "TT Corporation Ltd.",
    clientId: "3",
    caseName: "TT Corp Contract Dispute",
    caseId: "3",
    issueDate: "2026-03-15",
    dueDate: "2026-04-15",
    subtotal: 94200,
    discount: 0,
    tax: 0,
    total: 94200,
    amountPaid: 50000,
    balanceDue: 44200,
    status: "partial",
    paymentMethod: "transfer",
    items: [
      { description: "Legal Research", hours: 25, rate: 1200, amount: 30000 },
      { description: "Document Review", hours: 18, rate: 1200, amount: 21600 },
      { description: "Client Meetings", hours: 12, rate: 1200, amount: 14400 },
      { description: "Court Preparation", hours: 23.5, rate: 1200, amount: 28200 },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-002",
    client: "Robert Smith",
    clientId: "1",
    caseName: "Smith vs. Johnson Holdings",
    caseId: "1",
    issueDate: "2026-03-20",
    dueDate: "2026-04-20",
    subtotal: 38675,
    discount: 0,
    tax: 0,
    total: 38675,
    amountPaid: 0,
    balanceDue: 38675,
    status: "sent",
    items: [
      { description: "Initial Consultation", hours: 3, rate: 850, amount: 2550 },
      { description: "Document Preparation", hours: 15, rate: 850, amount: 12750 },
      { description: "Discovery Review", hours: 27.5, rate: 850, amount: 23375 },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-003",
    client: "Rajesh Singh",
    clientId: "5",
    caseName: "R. Singh - Criminal Defense",
    caseId: "5",
    issueDate: "2026-03-01",
    dueDate: "2026-03-15",
    subtotal: 49400,
    discount: 0,
    tax: 0,
    total: 49400,
    amountPaid: 49400,
    balanceDue: 0,
    status: "paid",
    paidDate: "2026-03-10",
    items: [
      { description: "Bail Hearing", hours: 8, rate: 950, amount: 7600 },
      { description: "Evidence Review", hours: 20, rate: 950, amount: 19000 },
      { description: "Court Appearance", hours: 24, rate: 950, amount: 22800 },
    ],
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-004",
    client: "Maria Williams",
    clientId: "2",
    caseName: "Estate of Williams",
    caseId: "2",
    issueDate: "2026-03-25",
    dueDate: "2026-04-25",
    subtotal: 4000,
    discount: 0,
    tax: 0,
    total: 4000,
    amountPaid: 0,
    balanceDue: 4000,
    status: "draft",
    items: [
      { description: "Probate Application", hours: 4, rate: 1000, amount: 4000 },
    ],
  },
];

// Mock unbilled time entries
const mockUnbilledTime = [
  { id: "1", case: "Smith vs Johnson", attorney: "Dr. James Rodriguez", date: "2026-03-26", hours: 3.5, rate: 850, amount: 2975, description: "Document review" },
  { id: "2", case: "TT Corp Dispute", attorney: "Dr. James Rodriguez", date: "2026-03-26", hours: 2, rate: 1200, amount: 2400, description: "Client call" },
  { id: "3", case: "Garcia Divorce", attorney: "Sarah Johnson", date: "2026-03-25", hours: 4, rate: 900, amount: 3600, description: "Mediation prep" },
  { id: "4", case: "Singh Criminal", attorney: "David Singh", date: "2026-03-25", hours: 5, rate: 800, amount: 4000, description: "Witness interviews" },
];

export function LawBilling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      viewed: "bg-purple-100 text-purple-700",
      partial: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-500",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.caseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = mockInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalUnbilled = mockUnbilledTime.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2C4A6F] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Por Cobrar</p>
                <p className="text-2xl font-bold">TT${(totalOutstanding / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Cobrado Este Mes</p>
                <p className="text-2xl font-bold">TT${(totalPaid / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#C4A35A] to-[#D4B36A] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Sin Facturar</p>
                <p className="text-2xl font-bold">TT${(totalUnbilled / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Facturas Activas</p>
                <p className="text-2xl font-bold">{mockInvoices.filter(i => i.status !== 'cancelled').length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="unbilled">Tiempo Sin Facturar</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4 mt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar facturas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Factura
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Factura</DialogTitle>
                  <DialogDescription>
                    Genera una factura desde tiempo facturable o crea manualmente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Cliente</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInvoices.map((inv) => (
                            <SelectItem key={inv.clientId} value={inv.clientId}>
                              {inv.client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Caso</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar caso" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInvoices.map((inv) => (
                            <SelectItem key={inv.caseId} value={inv.caseId}>
                              {inv.caseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Fecha de Emisión</label>
                      <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Fecha de Vencimiento</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Conceptos</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
                        <div className="col-span-5">Descripción</div>
                        <div className="col-span-2">Horas</div>
                        <div className="col-span-2">Tarifa</div>
                        <div className="col-span-2">Monto</div>
                        <div className="col-span-1"></div>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <Input className="col-span-5" placeholder="Descripción del servicio" />
                        <Input className="col-span-2" type="number" placeholder="0.0" />
                        <Input className="col-span-2" type="number" placeholder="TT$" />
                        <Input className="col-span-2" disabled placeholder="TT$ 0.00" />
                        <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="h-4 w-4 mr-1" /> Agregar Línea
                    </Button>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setNewInvoiceOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="outline">
                      Guardar Borrador
                    </Button>
                    <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewInvoiceOpen(false)}>
                      Crear y Enviar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Caso</TableHead>
                    <TableHead>Emisión</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pagado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50 cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#1E3A5F]" />
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          {invoice.client}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">{invoice.caseName}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>
                        <span className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                          {invoice.dueDate}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        TT${invoice.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-green-600">
                        TT${invoice.amountPaid.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unbilled Time Tab */}
        <TabsContent value="unbilled" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Entradas de Tiempo Sin Facturar</CardTitle>
                <CardDescription>
                  Selecciona las entradas para crear una factura
                </CardDescription>
              </div>
              <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]" disabled={selectedTimeEntries.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Crear Factura ({selectedTimeEntries.length})
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimeEntries(mockUnbilledTime.map(t => t.id));
                          } else {
                            setSelectedTimeEntries([]);
                          }
                        }}
                        checked={selectedTimeEntries.length === mockUnbilledTime.length}
                      />
                    </TableHead>
                    <TableHead>Caso</TableHead>
                    <TableHead>Abogado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Tarifa</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUnbilledTime.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50 cursor-pointer">
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedTimeEntries.includes(entry.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTimeEntries([...selectedTimeEntries, entry.id]);
                            } else {
                              setSelectedTimeEntries(selectedTimeEntries.filter(id => id !== entry.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{entry.case}</TableCell>
                      <TableCell>{entry.attorney}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.hours}h</TableCell>
                      <TableCell>TT${entry.rate}</TableCell>
                      <TableCell className="font-medium text-[#C4A35A]">
                        TT${entry.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {selectedTimeEntries.length} de {mockUnbilledTime.length} seleccionadas
                </span>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Total seleccionado: </span>
                  <span className="font-bold text-lg">
                    TT${mockUnbilledTime
                      .filter(t => selectedTimeEntries.includes(t.id))
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facturación por Área de Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: "Corporativo", amount: 94200, percent: 51 },
                    { area: "Civil", amount: 38675, percent: 21 },
                    { area: "Penal", amount: 49400, percent: 27 },
                    { area: "Familia", amount: 4000, percent: 2 },
                  ].map((item) => (
                    <div key={item.area} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.area}</span>
                        <span>TT${item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-full bg-[#1E3A5F] rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Cobranza</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Facturas Pagadas</span>
                    </div>
                    <span className="font-bold text-green-600">
                      TT${totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span>Pendiente de Pago</span>
                    </div>
                    <span className="font-bold text-yellow-600">
                      TT${totalOutstanding.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#C4A35A]/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#C4A35A]" />
                      <span>Sin Facturar</span>
                    </div>
                    <span className="font-bold text-[#C4A35A]">
                      TT${totalUnbilled.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedInvoice.invoiceNumber}</DialogTitle>
                    <DialogDescription>{selectedInvoice.caseName}</DialogDescription>
                  </div>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Cliente</h4>
                      <p className="font-medium">{selectedInvoice.client}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Fechas</h4>
                      <div className="flex justify-between text-sm">
                        <span>Emisión: {selectedInvoice.issueDate}</span>
                        <span>Vence: {selectedInvoice.dueDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-medium mb-3">Conceptos</h4>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Descripción</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead>Tarifa</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.hours}h</TableCell>
                          <TableCell>TT${item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">
                            TT${item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>TT${selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Descuento:</span>
                      <span>TT${selectedInvoice.discount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>TT${selectedInvoice.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Pagado:</span>
                      <span>TT${selectedInvoice.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#C4A35A]">
                      <span>Balance:</span>
                      <span>TT${selectedInvoice.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                  {selectedInvoice.balanceDue > 0 && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Registrar Pago
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
