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
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Scissors,
} from "lucide-react";

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const staffMembers = [
  { id: "1", name: "Ana García", role: "Estilista Senior", color: "#EC4899" },
  { id: "2", name: "Pedro López", role: "Barbero", color: "#8B5CF6" },
  { id: "3", name: "Sofía Martínez", role: "Técnica de Uñas", color: "#F59E0B" },
  { id: "4", name: "Carmen Ruiz", role: "Esteticista", color: "#10B981" },
];

const services = [
  { id: "1", name: "Corte Dama", duration: 45, price: 150 },
  { id: "2", name: "Corte Caballero", duration: 30, price: 80 },
  { id: "3", name: "Tinte", duration: 90, price: 350 },
  { id: "4", name: "Mechas", duration: 120, price: 500 },
  { id: "5", name: "Manicure", duration: 45, price: 120 },
  { id: "6", name: "Pedicure", duration: 60, price: 150 },
  { id: "7", name: "Tratamiento Facial", duration: 60, price: 280 },
  { id: "8", name: "Barba", duration: 30, price: 60 },
];

export function BeautyAppointments() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  // Mock appointments
  const appointments = [
    {
      id: "1",
      time: "09:00",
      duration: 90,
      client: "María González",
      phone: "868-555-0101",
      service: "Corte + Tinte",
      staff: "Ana García",
      staffId: "1",
      status: "confirmed",
      notes: "Cliente frecuente, prefiere tonos claros",
    },
    {
      id: "2",
      time: "10:30",
      duration: 30,
      client: "Carlos Pérez",
      phone: "868-555-0102",
      service: "Corte Caballero",
      staff: "Pedro López",
      staffId: "2",
      status: "in-progress",
      notes: "",
    },
    {
      id: "3",
      time: "11:00",
      duration: 105,
      client: "Laura Rodríguez",
      phone: "868-555-0103",
      service: "Manicure + Pedicure",
      staff: "Sofía Martínez",
      staffId: "3",
      status: "pending",
      notes: "Alergia a algunos esmaltes - verificar",
    },
    {
      id: "4",
      time: "14:00",
      duration: 60,
      client: "Ana Martínez",
      phone: "868-555-0104",
      service: "Tratamiento Facial",
      staff: "Carmen Ruiz",
      staffId: "4",
      status: "confirmed",
      notes: "Primera vez - piel sensible",
    },
    {
      id: "5",
      time: "15:30",
      duration: 60,
      client: "Roberto Silva",
      phone: "868-555-0105",
      service: "Barba + Corte",
      staff: "Pedro López",
      staffId: "2",
      status: "pending",
      notes: "",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "in-progress":
        return "En Progreso";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente o servicio..."
              className="w-64 pl-10"
            />
          </div>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los estilistas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estilistas</SelectItem>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className={view === "calendar" ? "bg-pink-500 hover:bg-pink-600" : ""}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendario
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className={view === "list" ? "bg-pink-500 hover:bg-pink-600" : ""}
          >
            Lista
          </Button>
          <Dialog open={newAppointmentOpen} onOpenChange={setNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Cita</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Cliente
                  </label>
                  <Input placeholder="Nombre del cliente" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Teléfono
                  </label>
                  <Input placeholder="868-XXX-XXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Servicio
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - TT${service.price} ({service.duration}min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Estilista
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estilista" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} - {staff.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Fecha
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Hora
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Notas
                  </label>
                  <Input placeholder="Notas adicionales..." />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setNewAppointmentOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                    onClick={() => setNewAppointmentOpen(false)}
                  >
                    Crear Cita
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg">Marzo 27, 2026</CardTitle>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Confirmada</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>En Progreso</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Time Grid Header */}
                <div className="grid grid-cols-[80px_repeat(4,1fr)] gap-2 mb-2">
                  <div className="text-sm font-medium text-gray-500 text-center">
                    Hora
                  </div>
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="text-center p-2 rounded-lg"
                      style={{ backgroundColor: `${staff.color}15` }}
                    >
                      <p
                        className="font-medium text-sm"
                        style={{ color: staff.color }}
                      >
                        {staff.name}
                      </p>
                      <p className="text-xs text-gray-500">{staff.role}</p>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {timeSlots.slice(0, 14).map((time) => {
                    const appointmentsAtTime = appointments.filter(
                      (apt) => apt.time === time
                    );

                    return (
                      <div
                        key={time}
                        className="grid grid-cols-[80px_repeat(4,1fr)] gap-2 min-h-[60px]"
                      >
                        <div className="text-sm text-gray-500 text-center py-2">
                          {time}
                        </div>
                        {staffMembers.map((staff) => {
                          const apt = appointmentsAtTime.find(
                            (a) => a.staffId === staff.id
                          );

                          if (apt) {
                            return (
                              <div
                                key={staff.id}
                                className={`p-2 rounded-lg border ${getStatusColor(
                                  apt.status
                                )} cursor-pointer hover:opacity-80 transition-opacity`}
                                style={{
                                  minHeight: `${apt.duration * 0.7}px`,
                                }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">
                                    {apt.client}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-white/50"
                                  >
                                    {apt.duration}min
                                  </Badge>
                                </div>
                                <p className="text-xs truncate">{apt.service}</p>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={staff.id}
                              className="border border-dashed border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50/50 cursor-pointer transition-colors"
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Todas las Citas de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-200 hover:bg-pink-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gray-900">{apt.time}</p>
                      <p className="text-xs text-gray-500">{apt.duration} min</p>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div>
                      <p className="font-medium text-gray-900">{apt.client}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {apt.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Scissors className="h-3 w-3" />
                          {apt.service}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{apt.staff}</p>
                      <p className="text-sm text-gray-500">Estilista</p>
                    </div>
                    <Badge className={getStatusColor(apt.status)}>
                      {getStatusLabel(apt.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
