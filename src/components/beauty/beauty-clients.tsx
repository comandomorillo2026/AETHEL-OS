"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Star,
  Calendar,
  DollarSign,
  MoreVertical,
  Crown,
  Gift,
} from "lucide-react";

const membershipTiers = [
  { id: "regular", name: "Regular", color: "bg-gray-100 text-gray-700", discount: 0 },
  { id: "bronze", name: "Bronce", color: "bg-orange-100 text-orange-700", discount: 5 },
  { id: "silver", name: "Plata", color: "bg-gray-200 text-gray-600", discount: 10 },
  { id: "gold", name: "Oro", color: "bg-yellow-100 text-yellow-700", discount: 15 },
  { id: "platinum", name: "Platino", color: "bg-purple-100 text-purple-700", discount: 20 },
];

const mockClients = [
  {
    id: "1",
    clientNumber: "CLI-0001",
    name: "María González",
    phone: "868-555-0101",
    email: "maria@email.com",
    membership: "gold",
    visits: 24,
    totalSpent: 4850,
    points: 485,
    lastVisit: "2026-03-25",
    preferredStaff: "Ana García",
    notes: "Prefiere tonos claros, alergia al latex",
  },
  {
    id: "2",
    clientNumber: "CLI-0002",
    name: "Carlos Pérez",
    phone: "868-555-0102",
    email: "carlos@email.com",
    membership: "silver",
    visits: 12,
    totalSpent: 1800,
    points: 180,
    lastVisit: "2026-03-27",
    preferredStaff: "Pedro López",
    notes: "Cliente frecuente de barba",
  },
  {
    id: "3",
    clientNumber: "CLI-0003",
    name: "Ana Martínez",
    phone: "868-555-0103",
    email: "ana@email.com",
    membership: "platinum",
    visits: 45,
    totalSpent: 12400,
    points: 2480,
    lastVisit: "2026-03-26",
    preferredStaff: "Sofía Martínez",
    notes: "Cliente VIP, siempre agenda con anticipación",
  },
  {
    id: "4",
    clientNumber: "CLI-0004",
    name: "Roberto Silva",
    phone: "868-555-0104",
    email: "roberto@email.com",
    membership: "bronze",
    visits: 6,
    totalSpent: 720,
    points: 72,
    lastVisit: "2026-03-20",
    preferredStaff: "Pedro López",
    notes: "",
  },
  {
    id: "5",
    clientNumber: "CLI-0005",
    name: "Laura Rodríguez",
    phone: "868-555-0105",
    email: "laura@email.com",
    membership: "regular",
    visits: 2,
    totalSpent: 280,
    points: 28,
    lastVisit: "2026-03-15",
    preferredStaff: "Carmen Ruiz",
    notes: "Primera vez - piel sensible",
  },
];

export function BeautyClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMembership, setFilterMembership] = useState("all");
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembership =
      filterMembership === "all" || client.membership === filterMembership;
    return matchesSearch && matchesMembership;
  });

  const getMembershipInfo = (membershipId: string) => {
    return membershipTiers.find((t) => t.id === membershipId) || membershipTiers[0];
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-gray-500">Total Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-gray-500">Clientes VIP</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-500">Nuevos este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45,230</p>
                <p className="text-sm text-gray-500">Puntos Activos</p>
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
              placeholder="Buscar cliente..."
              className="w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterMembership} onValueChange={setFilterMembership}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Membresía" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las membresías</SelectItem>
              {membershipTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
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
                  Teléfono
                </label>
                <Input placeholder="868-XXX-XXXX" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <Input type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Membresía
                </label>
                <Select defaultValue="regular">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipTiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Notas
                </label>
                <Input placeholder="Alergias, preferencias..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setNewClientOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                  onClick={() => setNewClientOpen(false)}
                >
                  Crear Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Contacto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Membresía
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Visitas
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Total Gastado
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Puntos
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Última Visita
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const membership = getMembershipInfo(client.membership);
                  return (
                    <tr
                      key={client.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-pink-600 font-medium text-sm">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {client.clientNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={membership.color}>
                          {membership.name}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium">{client.visits}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium">
                          TT${client.totalSpent.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium text-purple-600">
                          {client.points}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-500">
                        {client.lastVisit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            Ver
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-xl">
                    {selectedClient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedClient.clientNumber}
                  </p>
                  <Badge
                    className={getMembershipInfo(selectedClient.membership).color}
                  >
                    {getMembershipInfo(selectedClient.membership).name}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{selectedClient.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedClient.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Visitas Totales</p>
                  <p className="font-medium">{selectedClient.visits}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Gastado</p>
                  <p className="font-medium">
                    TT${selectedClient.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Puntos de Lealtad</p>
                  <p className="font-medium text-purple-600">
                    {selectedClient.points}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Estilista Preferido</p>
                  <p className="font-medium">{selectedClient.preferredStaff}</p>
                </div>
              </div>

              {selectedClient.notes && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-700">Notas</p>
                  <p className="text-sm text-yellow-600">{selectedClient.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Cita
                </Button>
                <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Nueva Venta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
