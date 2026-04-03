"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Clock,
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Gift,
  Heart,
  Bell,
  History,
  Award,
  ChevronRight,
  CheckCircle,
  Scissors,
  Sparkles,
  Crown,
  X,
  Plus,
  CalendarDays,
} from "lucide-react";

// Services catalog
const servicesCatalog = [
  {
    id: "1",
    category: "Cabello",
    name: "Corte + Peinado",
    description: "Corte personalizado y peinado profesional",
    duration: 45,
    price: 180,
    popular: true,
  },
  {
    id: "2",
    category: "Cabello",
    name: "Tinte Completo",
    description: "Coloración completa con productos premium",
    duration: 120,
    price: 450,
    popular: true,
  },
  {
    id: "3",
    category: "Cabello",
    name: "Mechas/Balayage",
    description: "Técnicas de iluminación avanzadas",
    duration: 180,
    price: 650,
    popular: false,
  },
  {
    id: "4",
    category: "Cabello",
    name: "Tratamiento Keratina",
    description: "Alisado y nutrición profunda",
    duration: 150,
    price: 800,
    popular: true,
  },
  {
    id: "5",
    category: "Uñas",
    name: "Manicure Básico",
    description: "Limado, cutículas y esmaltado",
    duration: 30,
    price: 80,
    popular: false,
  },
  {
    id: "6",
    category: "Uñas",
    name: "Manicure + Pedicure Spa",
    description: "Tratamiento completo con spa",
    duration: 60,
    price: 180,
    popular: true,
  },
  {
    id: "7",
    category: "Uñas",
    name: "Uñas Acrílicas",
    description: "Extensiones con diseño",
    duration: 90,
    price: 350,
    popular: false,
  },
  {
    id: "8",
    category: "Facial",
    name: "Limpieza Facial Profunda",
    description: "Extracciones, mascarilla y masaje",
    duration: 60,
    price: 280,
    popular: true,
  },
  {
    id: "9",
    category: "Facial",
    name: "Tratamiento Anti-edad",
    description: "Radiofrecuencia y sueros premium",
    duration: 75,
    price: 450,
    popular: false,
  },
  {
    id: "10",
    category: "Barbería",
    name: "Corte Caballero",
    description: "Corte clásico o moderno",
    duration: 30,
    price: 100,
    popular: true,
  },
  {
    id: "11",
    category: "Barbería",
    name: "Corte + Barba",
    description: "Corte y perfilado de barba",
    duration: 45,
    price: 150,
    popular: true,
  },
  {
    id: "12",
    category: "Barbería",
    name: "Afeitado Clásico",
    description: "Afeitado con navaja caliente",
    duration: 30,
    price: 120,
    popular: false,
  },
];

// Staff members
const staffMembers = [
  {
    id: "1",
    name: "Ana García",
    role: "Estilista Senior",
    specialties: ["Colorimetría", "Cortes", "Novias"],
    rating: 4.9,
    reviews: 145,
    avatar: "AG",
    color: "#EC4899",
  },
  {
    id: "2",
    name: "Pedro López",
    role: "Barbero Master",
    specialties: ["Cortes Caballero", "Barbas", "Diseños"],
    rating: 4.8,
    reviews: 98,
    avatar: "PL",
    color: "#8B5CF6",
  },
  {
    id: "3",
    name: "Sofía Martínez",
    role: "Técnica de Uñas",
    specialties: ["Uñas Acrílicas", "Gel", "Nail Art"],
    rating: 5.0,
    reviews: 76,
    avatar: "SM",
    color: "#F59E0B",
  },
  {
    id: "4",
    name: "Carmen Ruiz",
    role: "Esteticista",
    specialties: ["Faciales", "Tratamientos", "Microblading"],
    rating: 4.7,
    reviews: 89,
    avatar: "CR",
    color: "#10B981",
  },
];

// Available time slots
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

// Mock client data
const clientData = {
  name: "María González",
  email: "maria@email.com",
  phone: "+1 868-689-1234",
  membership: "Gold",
  points: 1250,
  visits: 15,
  totalSpent: 4850,
  favoriteStylist: "Ana García",
};

// Past appointments
const pastAppointments = [
  {
    id: "1",
    date: "2026-03-20",
    service: "Corte + Peinado",
    staff: "Ana García",
    price: 180,
    rating: 5,
  },
  {
    id: "2",
    date: "2026-03-10",
    service: "Manicure + Pedicure Spa",
    staff: "Sofía Martínez",
    price: 180,
    rating: 5,
  },
  {
    id: "3",
    date: "2026-02-28",
    service: "Tinte Completo",
    staff: "Ana García",
    price: 450,
    rating: 4,
  },
];

export function BeautyClientPortal() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "profile" | "history">("booking");

  const categories = [...new Set(servicesCatalog.map(s => s.category))];

  const steps = [
    { number: 1, title: "Servicio" },
    { number: 2, title: "Profesional" },
    { number: 3, title: "Fecha y Hora" },
    { number: 4, title: "Confirmar" },
  ];

  const handleConfirmBooking = () => {
    setShowConfirmation(true);
  };

  const selectedServiceData = servicesCatalog.find(s => s.id === selectedService);
  const selectedStaffData = staffMembers.find(s => s.id === selectedStaff);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Beauty Salon</h1>
                <p className="text-xs text-gray-500">Reservas Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">{clientData.membership}</span>
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">{clientData.points} pts</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-medium text-sm">MG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("booking")}
              className={`rounded-none border-b-2 ${
                activeTab === "booking"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Reservar Cita
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("profile")}
              className={`rounded-none border-b-2 ${
                activeTab === "profile"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("history")}
              className={`rounded-none border-b-2 ${
                activeTab === "history"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              Mis Citas
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Booking Tab */}
        {activeTab === "booking" && (
          <div className="space-y-6">
            {/* Progress Steps */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {steps.map((s, index) => (
                    <div key={s.number} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step >= s.number
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step > s.number ? <CheckCircle className="h-4 w-4" /> : s.number}
                        </div>
                        <span className={`text-sm ${step >= s.number ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                          {s.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-16 mx-4 h-0.5 bg-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Selecciona tu Servicio</h2>
                
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {servicesCatalog
                        .filter((s) => s.category === category)
                        .map((service) => (
                          <Card
                            key={service.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedService === service.id
                                ? "ring-2 ring-pink-500 border-pink-300"
                                : ""
                            }`}
                            onClick={() => setSelectedService(service.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{service.name}</h4>
                                {service.popular && (
                                  <Badge className="bg-pink-100 text-pink-700 text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-3">{service.description}</p>
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {service.duration} min
                                </div>
                                <span className="font-bold text-pink-600">
                                  TT${service.price}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 px-8"
                    disabled={!selectedService}
                    onClick={() => setStep(2)}
                  >
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Select Staff */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Elige tu Profesional</h2>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Cambiar Servicio
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staffMembers.map((staff) => (
                    <Card
                      key={staff.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStaff === staff.id
                          ? "ring-2 ring-pink-500 border-pink-300"
                          : ""
                      }`}
                      onClick={() => setSelectedStaff(staff.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: staff.color }}
                          >
                            {staff.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{staff.name}</h4>
                            <p className="text-sm text-gray-500">{staff.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{staff.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">({staff.reviews} reseñas)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {staff.specialties.map((spec) => (
                                <Badge key={spec} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Atrás
                  </Button>
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 px-8"
                    disabled={!selectedStaff}
                    onClick={() => setStep(3)}
                  >
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Selecciona Fecha y Hora</h2>
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Cambiar Profesional
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fecha</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                          <div key={day} className="font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                          const date = new Date(2026, 2, day);
                          const dayOfWeek = date.getDay();
                          const isPast = day < 28;
                          const isSunday = dayOfWeek === 0;
                          const isSelected = selectedDate === `2026-03-${day.toString().padStart(2, "0")}`;
                          
                          if (day === 1 && dayOfWeek !== 1) {
                            return null;
                          }
                          
                          return (
                            <button
                              key={day}
                              disabled={isPast || isSunday}
                              onClick={() => setSelectedDate(`2026-03-${day.toString().padStart(2, "0")}`)}
                              className={`py-2 rounded-lg transition-colors ${
                                isSelected
                                  ? "bg-pink-500 text-white font-medium"
                                  : isPast || isSunday
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "hover:bg-pink-50 text-gray-700"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Time Slots */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Horarios Disponibles</CardTitle>
                      <CardDescription>
                        {selectedDate ? `Fecha: ${selectedDate}` : "Selecciona una fecha"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={
                              selectedTime === time
                                ? "bg-pink-500 hover:bg-pink-600"
                                : ""
                            }
                            disabled={!selectedDate}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Atrás
                  </Button>
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 px-8"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(4)}
                  >
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Confirma tu Reserva</h2>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Service Summary */}
                      <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-lg">{selectedServiceData?.name}</h3>
                          <p className="text-sm text-gray-500">{selectedServiceData?.category}</p>
                        </div>
                        <span className="text-xl font-bold text-pink-600">
                          TT${selectedServiceData?.price}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Profesional</p>
                            <p className="font-medium">{selectedStaffData?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Fecha</p>
                            <p className="font-medium">{selectedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Hora</p>
                            <p className="font-medium">{selectedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duración</p>
                            <p className="font-medium">{selectedServiceData?.duration} minutos</p>
                          </div>
                        </div>
                      </div>

                      {/* Loyalty Points */}
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Gift className="h-6 w-6 text-yellow-500" />
                            <div>
                              <p className="font-medium text-yellow-700">Ganarás {Math.round((selectedServiceData?.price || 0) * 1.5)} puntos</p>
                              <p className="text-sm text-yellow-600">Con tu membresía {clientData.membership}</p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Crown className="h-3 w-3 mr-1" />
                            1.5x Puntos
                          </Badge>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Notas adicionales (opcional)</label>
                        <Textarea placeholder="¿Alguna preferencia o solicitud especial?" rows={2} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Atrás
                  </Button>
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 px-8"
                    onClick={handleConfirmBooking}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Reserva
                  </Button>
                </div>
              </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent className="max-w-md text-center">
                <div className="py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h2>
                  <p className="text-gray-500 mb-4">
                    Tu cita ha sido agendada exitosamente. Recibirás un recordatorio por WhatsApp.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Servicio:</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hora:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Profesional:</span>
                      <span className="font-medium">{selectedStaffData?.name}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    onClick={() => {
                      setShowConfirmation(false);
                      setStep(1);
                      setSelectedService(null);
                      setSelectedStaff(null);
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }}
                  >
                    Listo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    MG
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{clientData.name}</h2>
                    <p className="text-gray-500">{clientData.email}</p>
                    <p className="text-gray-500">{clientData.phone}</p>
                  </div>
                </div>

                {/* Membership Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Crown className="h-6 w-6" />
                      <span className="font-bold text-lg">Membresía {clientData.membership}</span>
                    </div>
                    <Badge className="bg-white/20 text-white">
                      {clientData.points} puntos
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{clientData.visits}</p>
                      <p className="text-sm opacity-80">Visitas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">TT${clientData.totalSpent}</p>
                      <p className="text-sm opacity-80">Total Gastado</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">15%</p>
                      <p className="text-sm opacity-80">Descuento</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-pink-500" />
                        <div>
                          <p className="text-sm text-gray-500">Favorito</p>
                          <p className="font-medium">{clientData.favoriteStylist}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-500">Puntos a canjear</p>
                          <p className="font-medium">{clientData.points} pts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Historial de Citas</h2>
            
            <div className="space-y-4">
              {pastAppointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                          <Scissors className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{apt.service}</h4>
                          <p className="text-sm text-gray-500">
                            {apt.date} • con {apt.staff}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">TT${apt.price}</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < apt.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>📍 Port of Spain, Trinidad & Tobago</span>
              <span>📞 +1 868-623-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="font-semibold text-pink-600">NexusOS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
