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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Gavel,
  Users,
  FileText,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

// Mock events
const mockEvents = [
  {
    id: "1",
    title: "Hearing - Smith vs Johnson",
    type: "court",
    date: "2026-03-28",
    startTime: "09:00",
    endTime: "12:00",
    location: "High Court, Port of Spain",
    case: "Smith vs. Johnson Holdings",
    caseId: "1",
    client: "Robert Smith",
    judge: "Hon. Justice Williams",
    status: "scheduled",
    notes: "Bring all discovery documents",
  },
  {
    id: "2",
    title: "Client Meeting - TT Corp",
    type: "meeting",
    date: "2026-03-29",
    startTime: "14:00",
    endTime: "15:30",
    location: "Office - Conference Room A",
    case: "TT Corp Contract Dispute",
    caseId: "3",
    client: "TT Corporation Ltd.",
    status: "confirmed",
    notes: "Review settlement proposal",
  },
  {
    id: "3",
    title: "Filing Deadline - Garcia Divorce",
    type: "deadline",
    date: "2026-03-30",
    startTime: "16:00",
    endTime: null,
    location: null,
    case: "Garcia - Divorce Proceedings",
    caseId: "4",
    client: "Ana Garcia",
    status: "pending",
    notes: "File petition and supporting documents",
  },
  {
    id: "4",
    title: "Deposition - Williams Estate",
    type: "deposition",
    date: "2026-04-02",
    startTime: "10:00",
    endTime: "14:00",
    location: "Court Reporter Office - Frederick St",
    case: "Estate of Williams",
    caseId: "2",
    client: "Maria Williams",
    status: "scheduled",
    notes: "Deposition of executor",
  },
  {
    id: "5",
    title: "Mediation - TT Corp Dispute",
    type: "meeting",
    date: "2026-04-10",
    startTime: "09:00",
    endTime: "17:00",
    location: "Mediation Center, Port of Spain",
    case: "TT Corp Contract Dispute",
    caseId: "3",
    client: "TT Corporation Ltd.",
    status: "scheduled",
    notes: "Full day mediation session",
  },
];

const eventTypeConfig = {
  court: { label: "Audiencia", icon: Gavel, color: "bg-red-100 text-red-700 border-red-200" },
  meeting: { label: "Reunión", icon: Users, color: "bg-blue-100 text-blue-700 border-blue-200" },
  deadline: { label: "Plazo", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  deposition: { label: "Deposición", icon: FileText, color: "bg-purple-100 text-purple-700 border-purple-200" },
  consultation: { label: "Consulta", icon: Users, color: "bg-green-100 text-green-700 border-green-200" },
};

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function LawCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 27)); // March 27, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockEvents.filter((e) => e.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const events = getEventsForDate(day);
      const isToday = dateStr === todayStr;
      const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;

      days.push(
        <div
          key={day}
          className={`h-24 border-t border-gray-100 p-1 cursor-pointer transition-colors ${
            isToday ? "bg-blue-50" : isSelected ? "bg-[#1E3A5F]/5" : "hover:bg-gray-50"
          }`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
            {day}
          </div>
          <div className="space-y-0.5">
            {events.slice(0, 3).map((event) => {
              const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
              return (
                <div
                  key={event.id}
                  className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer ${config.color}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                >
                  {event.startTime} {event.title}
                </div>
              );
            })}
            {events.length > 3 && (
              <div className="text-xs text-gray-500 px-1">+{events.length - 3} más</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = mockEvents
    .filter((e) => new Date(e.date) >= new Date(2026, 2, 27))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold min-w-48 text-center">
                    {months[month]} {year}
                  </h2>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("month")}
                    className="rounded-none"
                  >
                    Mes
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                    className="rounded-none"
                  >
                    Semana
                  </Button>
                  <Button
                    variant={viewMode === "day" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                    className="rounded-none"
                  >
                    Día
                  </Button>
                </div>
                <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Programar Evento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Título</label>
                        <Input placeholder="Nombre del evento" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tipo</label>
                        <Select defaultValue="meeting">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="court">Audiencia</SelectItem>
                            <SelectItem value="meeting">Reunión</SelectItem>
                            <SelectItem value="deadline">Plazo/Deadline</SelectItem>
                            <SelectItem value="deposition">Deposición</SelectItem>
                            <SelectItem value="consultation">Consulta</SelectItem>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Fecha</label>
                          <Input type="date" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Hora</label>
                          <div className="flex gap-2">
                            <Input type="time" className="flex-1" />
                            <span className="text-gray-400 self-center">a</span>
                            <Input type="time" className="flex-1" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Ubicación</label>
                        <Input placeholder="Dirección o sala" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Notas</label>
                        <Textarea placeholder="Detalles adicionales..." rows={2} />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setNewEventOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewEventOpen(false)}>
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar - Upcoming Events */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {upcomingEvents.map((event) => {
                  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {event.date} • {event.startTime}
                          </p>
                          {event.location && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-3">Leyenda</h4>
              <div className="space-y-2">
                {Object.entries(eventTypeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <div className={`p-1 rounded ${config.color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span>{config.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${eventTypeConfig[selectedEvent.type as keyof typeof eventTypeConfig].color}`}>
                    {(() => {
                      const Icon = eventTypeConfig[selectedEvent.type as keyof typeof eventTypeConfig].icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle>{selectedEvent.title}</DialogTitle>
                    <DialogDescription>
                      {eventTypeConfig[selectedEvent.type as keyof typeof eventTypeConfig].label}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-medium">
                      {selectedEvent.startTime}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Caso</p>
                    <p className="font-medium">{selectedEvent.case}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">{selectedEvent.client}</p>
                  </div>
                </div>
                {selectedEvent.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notas</p>
                    <p className="text-sm">{selectedEvent.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                    <Clock className="h-4 w-4 mr-2" />
                    Registrar Tiempo
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
