"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Store,
  CreditCard,
  Bell,
  Palette,
  Clock,
  Percent,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Calendar,
} from "lucide-react";

export function BeautySettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Configuración del Salón</h2>
        <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="h-5 w-5 text-pink-500" />
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre del Salón
              </label>
              <Input defaultValue="Beauty & Style Salon" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre Legal
              </label>
              <Input defaultValue="Beauty & Style S.A." />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                RIF / Tax ID
              </label>
              <Input defaultValue="J-12345678-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tipo de Salón
              </label>
              <Select defaultValue="mixed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ladies">Solo Damas</SelectItem>
                  <SelectItem value="gents">Solo Caballeros</SelectItem>
                  <SelectItem value="mixed">Mixto</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="spa">Spa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Dirección
            </label>
            <Input defaultValue="123 Frederick Street, Port of Spain" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Ciudad
              </label>
              <Input defaultValue="Port of Spain" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Teléfono
              </label>
              <Input defaultValue="868-555-0100" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                WhatsApp
              </label>
              <Input defaultValue="868-555-0100" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Horario de Operación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Hora de Apertura
                </label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Hora de Cierre
                </label>
                <Input type="time" defaultValue="18:00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Días de Trabajo
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
                  <Badge
                    key={i}
                    className={`cursor-pointer ${
                      i < 6 ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Configuración de Reservas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Intervalo de Reserva
              </label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Anticipación Mínima
              </label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="1440">1 día</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Anticipación Máxima
              </label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 semana</SelectItem>
                  <SelectItem value="14">2 semanas</SelectItem>
                  <SelectItem value="30">1 mes</SelectItem>
                  <SelectItem value="60">2 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Horas para Cancelación Sin Cargo
            </label>
            <Select defaultValue="24">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 horas</SelectItem>
                <SelectItem value="24">24 horas</SelectItem>
                <SelectItem value="48">48 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5 text-green-500" />
            Configuración de Impuestos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Habilitar Impuestos</p>
              <p className="text-sm text-gray-500">Activar cálculo automático de IVA</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre del Impuesto
              </label>
              <Input defaultValue="VAT" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tasa de Impuesto (%)
              </label>
              <Input type="number" defaultValue="12.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Número de Registro Fiscal
            </label>
            <Input defaultValue="VAT-123456789" />
          </div>
        </CardContent>
      </Card>

      {/* Deposit Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Configuración de Depósitos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Requerir Depósito</p>
              <p className="text-sm text-gray-500">Solicitar depósito para ciertos servicios</p>
            </div>
            <Switch />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Porcentaje de Depósito
              </label>
              <Input type="number" defaultValue="20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Servicios que Requieren Depósito
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servicios</SelectItem>
                  <SelectItem value="expensive">Servicios +TT$200</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Recordatorios Automáticos</p>
              <p className="text-sm text-gray-500">Enviar recordatorios a clientes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Horas antes de la cita
              </label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 horas</SelectItem>
                  <SelectItem value="24">24 horas</SelectItem>
                  <SelectItem value="48">48 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Canales de Notificación
              </label>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-700 cursor-pointer">SMS ✓</Badge>
                <Badge className="bg-blue-100 text-blue-700 cursor-pointer">Email ✓</Badge>
                <Badge className="bg-green-100 text-green-700 cursor-pointer">WhatsApp ✓</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-500" />
            Pasarelas de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="font-bold text-orange-600">W</span>
              </div>
              <div>
                <p className="font-medium">WiPay</p>
                <p className="text-sm text-gray-500">Trinidad & Tobago</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="font-bold text-purple-600">S</span>
              </div>
              <div>
                <p className="font-medium">Stripe</p>
                <p className="text-sm text-gray-500">Internacional</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Accountant Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-500" />
            Integración Contable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email del Contador
            </label>
            <Input type="email" placeholder="contador@ejemplo.com" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Envío Automático de Reportes</p>
              <p className="text-sm text-gray-500">Enviar reportes mensuales al contador</p>
            </div>
            <Switch />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Frecuencia de Reportes
            </label>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="biweekly">Quincenal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
