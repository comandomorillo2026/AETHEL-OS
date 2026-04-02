"use client";

import { useState } from "react";
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
  Building,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  FileText,
  Download,
  Filter,
  Clock,
  Shield,
  Banknote,
  CreditCard,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronRight,
  Calendar,
} from "lucide-react";

// Mock trust accounts
const mockTrustAccounts = [
  {
    id: "1",
    client: "TT Corporation Ltd.",
    clientId: "3",
    accountNumber: "****4567",
    bankName: "FirstCitizens Bank",
    balance: 100000,
    status: "active",
    lastActivity: "2026-03-25",
    pendingTransactions: 0,
  },
  {
    id: "2",
    client: "Robert Smith",
    clientId: "1",
    accountNumber: "****2345",
    bankName: "Scotiabank",
    balance: 25000,
    status: "active",
    lastActivity: "2026-03-20",
    pendingTransactions: 0,
  },
  {
    id: "3",
    client: "Maria Williams",
    clientId: "2",
    accountNumber: "****3456",
    bankName: "Republic Bank",
    balance: 8000,
    status: "active",
    lastActivity: "2026-03-18",
    pendingTransactions: 0,
  },
  {
    id: "4",
    client: "Rajesh Singh",
    clientId: "5",
    accountNumber: "****5678",
    bankName: "RBC Royal Bank",
    balance: 30000,
    status: "active",
    lastActivity: "2026-03-23",
    pendingTransactions: 0,
  },
  {
    id: "5",
    client: "Ana Garcia",
    clientId: "4",
    accountNumber: "****6789",
    bankName: "FirstCitizens Bank",
    balance: 7500,
    status: "active",
    lastActivity: "2026-03-15",
    pendingTransactions: 0,
  },
];

// Mock transactions
const mockTransactions = [
  {
    id: "1",
    date: "2026-03-25",
    type: "deposit",
    client: "TT Corporation Ltd.",
    case: "TT Corp Contract Dispute",
    description: "Retainer deposit - March",
    amount: 50000,
    balanceAfter: 100000,
    reference: "TRF-2026-0345",
    status: "completed",
  },
  {
    id: "2",
    date: "2026-03-23",
    type: "withdrawal",
    client: "Rajesh Singh",
    case: "R. Singh - Criminal Defense",
    description: "Payment for INV-2026-003",
    amount: 49400,
    balanceAfter: 30000,
    reference: "INV-2026-003",
    status: "completed",
  },
  {
    id: "3",
    date: "2026-03-20",
    type: "deposit",
    client: "Robert Smith",
    case: "Smith vs. Johnson Holdings",
    description: "Retainer deposit",
    amount: 25000,
    balanceAfter: 25000,
    reference: "CHK-1245",
    status: "completed",
  },
  {
    id: "4",
    date: "2026-03-18",
    type: "deposit",
    client: "Maria Williams",
    case: "Estate of Williams",
    description: "Probate retainer",
    amount: 8000,
    balanceAfter: 8000,
    reference: "TRF-2026-0312",
    status: "completed",
  },
  {
    id: "5",
    date: "2026-03-15",
    type: "deposit",
    client: "Ana Garcia",
    case: "Garcia - Divorce Proceedings",
    description: "Initial retainer",
    amount: 7500,
    balanceAfter: 7500,
    reference: "CHK-1198",
    status: "completed",
  },
];

export function LawTrust() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof mockTrustAccounts[0] | null>(null);

  const totalInTrust = mockTrustAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalDeposits = mockTransactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = mockTransactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredAccounts = mockTrustAccounts.filter((acc) => {
    const matchesSearch = acc.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.case.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Trust Account Management (IOLTA)</h3>
              <p className="text-sm text-amber-700 mt-1">
                Las cuentas de fideicomiso están reguladas. Asegúrese de mantener registros precisos y
                cumplir con las normas del Colegio de Abogados. Nunca mezcle fondos de clientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2C4A6F] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total en Fideicomiso</p>
                <p className="text-2xl font-bold">TT${(totalInTrust / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <Building className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Depósitos del Mes</p>
                <p className="text-2xl font-bold">TT${(totalDeposits / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Retiros del Mes</p>
                <p className="text-2xl font-bold">TT${(totalWithdrawals / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <ArrowDownRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cuentas Activas</p>
                <p className="text-2xl font-bold">{mockTrustAccounts.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trust Accounts List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cuentas de Clientes</CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedAccount?.id === account.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedAccount(account)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center">
                        <Building className="h-4 w-4 text-[#1E3A5F]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{account.client}</p>
                        <p className="text-xs text-gray-500">{account.bankName}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#C4A35A]">
                      TT${account.balance.toLocaleString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        account.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600"
                      }
                    >
                      {account.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg">Transacciones Recientes</CardTitle>
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
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="deposit">Depósitos</SelectItem>
                    <SelectItem value="withdrawal">Retiros</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Registrar Transacción</DialogTitle>
                      <DialogDescription>
                        Deposite o retire fondos de una cuenta de fideicomiso
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tipo</label>
                        <Select defaultValue="deposit">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deposit">Depósito</SelectItem>
                            <SelectItem value="withdrawal">Retiro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Cliente</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockTrustAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.client}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Caso (Opcional)</label>
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
                      <div>
                        <label className="text-sm font-medium mb-1 block">Monto (TT$)</label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Referencia</label>
                        <Input placeholder="Cheque #, Transferencia #, etc." />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Descripción</label>
                        <Textarea placeholder="Descripción de la transacción..." rows={2} />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setNewTransactionOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewTransactionOpen(false)}>
                          Registrar
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-50 cursor-pointer">
                    <TableCell className="text-sm">{tx.date}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === "deposit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {tx.type === "deposit" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {tx.type === "deposit" ? "Depósito" : "Retiro"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{tx.client}</p>
                        <p className="text-xs text-gray-500">{tx.case}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.reference}</p>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${
                      tx.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "deposit" ? "+" : "-"}TT${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      TT${tx.balanceAfter.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Selected Account Detail */}
      {selectedAccount && (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedAccount.client}</h3>
                <p className="text-gray-500 text-sm">
                  {selectedAccount.bankName} • Cuenta: {selectedAccount.accountNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#C4A35A]">
                  TT${selectedAccount.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Balance Actual</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Estado de Cuenta
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Ver Todas las Transacciones
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Warning */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Recordatorio de Cumplimiento</h4>
              <p className="text-sm text-red-700 mt-1">
                Revise mensualmente todas las cuentas de fideicomiso. Asegúrese de que los fondos estén
                debidamente identificados y que no haya discrepancias. El incumplimiento puede resultar
                en sanciones disciplinarias.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
