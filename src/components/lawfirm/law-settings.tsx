"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Building,
  Users,
  DollarSign,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

const practiceAreasList = [
  { id: "civil", name: "Derecho Civil", active: true },
  { id: "corporate", name: "Derecho Corporativo", active: true },
  { id: "criminal", name: "Derecho Penal", active: true },
  { id: "family", name: "Derecho de Familia", active: true },
  { id: "probate", name: "Sucesiones", active: true },
  { id: "real_estate", name: "Derecho Inmobiliario", active: true },
  { id: "labor", name: "Derecho Laboral", active: false },
  { id: "immigration", name: "Derecho Migratorio", active: false },
  { id: "intellectual", name: "Propiedad Intelectual", active: false },
  { id: "tax", name: "Derecho Tributario", active: false },
];

export function LawSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
          <p className="text-gray-500">Administra la configuración de tu firma</p>
        </div>
        <Button
          className="bg-[#1E3A5F] hover:bg-[#2C4A6F]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <Tabs defaultValue="firm">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="firm">Firma</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="areas">Áreas</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* Firm Settings */}
        <TabsContent value="firm" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información de la Firma
              </CardTitle>
              <CardDescription>Datos generales y de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre de la Firma</label>
                  <Input defaultValue="Rodriguez & Associates" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre Legal</label>
                  <Input defaultValue="Rodriguez & Associates Attorneys at Law" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">RIF/ID Fiscal</label>
                  <Input defaultValue="J-12345678-9" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Registro del Colegio</label>
                  <Input defaultValue="TTBAR-2026-1234" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Principal
                  </label>
                  <Input defaultValue="contact@rodriguezlaw.tt" type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono
                  </label>
                  <Input defaultValue="+1 868-623-4567" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Dirección
                </label>
                <Textarea
                  defaultValue="Suite 500, Maritime Centre, Wrightson Road, Port of Spain, Trinidad & Tobago"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Sitio Web
                </label>
                <Input defaultValue="www.rodriguezlaw.tt" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalización de Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Color Principal</label>
                  <div className="flex gap-2">
                    <Input defaultValue="#1E3A5F" className="flex-1" />
                    <div className="w-10 h-10 rounded border bg-[#1E3A5F]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Color Secundario</label>
                  <div className="flex gap-2">
                    <Input defaultValue="#C4A35A" className="flex-1" />
                    <div className="w-10 h-10 rounded border bg-[#C4A35A]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Logo</label>
                  <Button variant="outline" className="w-full">
                    Subir Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configuración de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Prefijo de Factura</label>
                  <Input defaultValue="INV" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Próximo Número</label>
                  <Input defaultValue="2026-005" disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Moneda Predeterminada</label>
                  <Select defaultValue="ttd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ttd">TT$ - Dólar Trinitense</SelectItem>
                      <SelectItem value="usd">$ - Dólar Americano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Días de Crédito</label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Pago Inmediato</SelectItem>
                      <SelectItem value="15">15 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="45">45 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nota en Factura</label>
                <Textarea
                  defaultValue="Gracias por su confianza. El pago debe realizarse dentro de los 30 días de la fecha de emisión."
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Términos y Condiciones</label>
                <Textarea
                  defaultValue="Esta factura representa servicios legales prestados según el acuerdo profesional firmado..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tarifas por Defecto</CardTitle>
              <CardDescription>Tarifas sugeridas para nuevos casos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Socio/Partner</label>
                    <Input defaultValue="1200" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Associado Senior</label>
                    <Input defaultValue="900" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Associado</label>
                    <Input defaultValue="700" type="number" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Practice Areas */}
        <TabsContent value="areas" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Áreas de Práctica</CardTitle>
                  <CardDescription>Activa las áreas que maneja tu firma</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Área
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practiceAreasList.map((area) => (
                  <div
                    key={area.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      area.active ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={area.active}
                        className="rounded border-gray-300"
                        readOnly
                      />
                      <span className={area.active ? "font-medium" : "text-gray-400"}>
                        {area.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etapas de Casos por Área</CardTitle>
              <CardDescription>Personaliza las etapas para cada área de práctica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select defaultValue="civil">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreasList.filter(a => a.active).map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {["Intake", "Pleadings", "Discovery", "Pre-Trial", "Trial", "Appeal", "Closed"].map((stage, idx) => (
                    <Badge key={stage} variant="outline" className="px-3 py-1">
                      {idx + 1}. {stage}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencias de Notificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Nuevos clientes registrados", email: true, sms: false },
                  { label: "Recordatorios de audiencias", email: true, sms: true },
                  { label: "Plazos próximos a vencer", email: true, sms: true },
                  { label: "Pagos recibidos", email: true, sms: false },
                  { label: "Facturas vencidas", email: true, sms: true },
                  { label: "Nuevas tareas asignadas", email: true, sms: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={item.email} className="rounded" />
                        Email
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={item.sms} className="rounded" />
                        SMS
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Días antes del recordatorio</label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 día</SelectItem>
                        <SelectItem value="2">2 días</SelectItem>
                        <SelectItem value="3">3 días</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hora del recordatorio</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad y Acceso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Autenticación de Dos Factores</p>
                    <p className="text-sm text-green-600">Activada para todas las cuentas</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Encriptación de Datos</p>
                    <p className="text-sm text-blue-600">AES-256 para datos en reposo y en tránsito</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Activo</Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">Tiempo de sesión (minutos)</label>
                <Select defaultValue="60">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="480">8 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Registro de Actividad</p>
                  <p className="text-sm text-gray-500">Mantener un registro de todas las acciones</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Zona de Peligro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exportar Todos los Datos</p>
                  <p className="text-sm text-gray-500">Descarga una copia de todos tus datos</p>
                </div>
                <Button variant="outline">Exportar</Button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="font-medium text-red-700">Eliminar Firma</p>
                  <p className="text-sm text-red-600">Esta acción no se puede deshacer</p>
                </div>
                <Button variant="destructive">Eliminar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
