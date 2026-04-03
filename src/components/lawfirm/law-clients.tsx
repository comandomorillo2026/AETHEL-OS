"use client";

import { useState, useCallback } from "react";
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
  Users,
  Plus,
  Search,
  Upload,
  FileSpreadsheet,
  Download,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle,
  X,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Clock,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Filter,
} from "lucide-react";

// Mock clients data
const mockClients = [
  {
    id: "1",
    clientType: "individual",
    fullName: "Robert Smith",
    firstName: "Robert",
    lastName: "Smith",
    companyName: null,
    idType: "national_id",
    idNumber: "12345678901",
    email: "robert.smith@email.com",
    phone: "+1 868-689-1234",
    phoneAlt: null,
    address: "123 Frederick Street",
    city: "Port of Spain",
    country: "Trinidad & Tobago",
    occupation: "Business Owner",
    status: "active",
    billingType: "hourly",
    billingRate: 850,
    openCases: 1,
    totalBilled: 38675,
    trustBalance: 25000,
    lastActivity: "2026-03-27",
  },
  {
    id: "2",
    clientType: "individual",
    fullName: "Maria Williams",
    firstName: "Maria",
    lastName: "Williams",
    companyName: null,
    idType: "passport",
    idNumber: "AB1234567",
    email: "m.williams@email.com",
    phone: "+1 868-345-6789",
    phoneAlt: "+1 868-345-6790",
    address: "45 Ariapita Avenue",
    city: "Woodbrook",
    country: "Trinidad & Tobago",
    occupation: "Teacher",
    status: "active",
    billingType: "flat_fee",
    billingRate: 8000,
    openCases: 1,
    totalBilled: 4000,
    trustBalance: 8000,
    lastActivity: "2026-03-26",
  },
  {
    id: "3",
    clientType: "company",
    fullName: "TT Corporation Ltd.",
    firstName: null,
    lastName: null,
    companyName: "TT Corporation Ltd.",
    idType: "registration_number",
    idNumber: "C-12345-2010",
    email: "legal@ttcorp.com",
    phone: "+1 868-623-4567",
    phoneAlt: "+1 868-623-4568",
    address: "Tower D, International Waterfront Centre",
    city: "Port of Spain",
    country: "Trinidad & Tobago",
    occupation: null,
    status: "active",
    billingType: "hourly",
    billingRate: 1200,
    openCases: 1,
    totalBilled: 94200,
    trustBalance: 100000,
    lastActivity: "2026-03-25",
  },
  {
    id: "4",
    clientType: "individual",
    fullName: "Ana Garcia",
    firstName: "Ana",
    lastName: "Garcia",
    companyName: null,
    idType: "national_id",
    idNumber: "98765432101",
    email: "ana.garcia@email.com",
    phone: "+1 868-789-0123",
    phoneAlt: null,
    address: "78 Coffee Street",
    city: "San Fernando",
    country: "Trinidad & Tobago",
    occupation: "Accountant",
    status: "active",
    billingType: "flat_fee",
    billingRate: 15000,
    openCases: 1,
    totalBilled: 0,
    trustBalance: 7500,
    lastActivity: "2026-03-24",
  },
  {
    id: "5",
    clientType: "individual",
    fullName: "Rajesh Singh",
    firstName: "Rajesh",
    lastName: "Singh",
    companyName: null,
    idType: "national_id",
    idNumber: "56789012345",
    email: "r.singh@email.com",
    phone: "+1 868-456-7890",
    phoneAlt: null,
    address: "23 High Street",
    city: "Chaguanas",
    country: "Trinidad & Tobago",
    occupation: "Engineer",
    status: "active",
    billingType: "hourly",
    billingRate: 950,
    openCases: 1,
    totalBilled: 49400,
    trustBalance: 30000,
    lastActivity: "2026-03-23",
  },
];

// Column mapping for import
const columnMappings = [
  { system: "fullName", label: "Nombre Completo", required: true },
  { system: "email", label: "Email", required: false },
  { system: "phone", label: "Teléfono", required: true },
  { system: "address", label: "Dirección", required: false },
  { system: "city", label: "Ciudad", required: false },
  { system: "idNumber", label: "ID/RIF/NIT", required: false },
  { system: "companyName", label: "Empresa", required: false },
  { system: "occupation", label: "Ocupación", required: false },
];

export function LawClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<Array<Record<string, string>>>([]);
  const [importMapping, setImportMapping] = useState<Record<string, string>>({});
  const [importStep, setImportStep] = useState<"upload" | "mapping" | "preview" | "importing" | "done">("upload");
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [imported, setImported] = useState(0);

  const filteredClients = mockClients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.idNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || c.clientType === filterType;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Smart text normalization
  const normalizeText = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Auto-detect column mappings
  const autoDetectMapping = (headers: string[]) => {
    const mapping: Record<string, string> = {};
    headers.forEach((header) => {
      const h = header.toLowerCase().replace(/[_\s]/g, "");
      if (h.includes("nombre") || h.includes("name")) {
        mapping["fullName"] = header;
      } else if (h.includes("email") || h.includes("correo")) {
        mapping["email"] = header;
      } else if (h.includes("tel") || h.includes("phone") || h.includes("fono")) {
        mapping["phone"] = header;
      } else if (h.includes("direc") || h.includes("address")) {
        mapping["address"] = header;
      } else if (h.includes("ciudad") || h.includes("city")) {
        mapping["city"] = header;
      } else if (h.includes("id") || h.includes("rif") || h.includes("nit")) {
        mapping["idNumber"] = header;
      } else if (h.includes("empresa") || h.includes("company")) {
        mapping["companyName"] = header;
      } else if (h.includes("ocup") || h.includes("profes")) {
        mapping["occupation"] = header;
      }
    });
    return mapping;
  };

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);

    // Simulate parsing CSV/Excel
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

      const data: Array<Record<string, string>> = [];
      for (let i = 1; i < Math.min(lines.length, 51); i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || "";
          });
          data.push(row);
        }
      }

      setImportData(data);
      setImportMapping(autoDetectMapping(headers));
      setImportStep("mapping");
    };
    reader.readAsText(file);
  }, []);

  // Process import
  const processImport = () => {
    setImportStep("importing");
    setImportProgress(0);
    setImportErrors([]);

    let processed = 0;
    const total = importData.length;

    const interval = setInterval(() => {
      processed++;
      setImportProgress(Math.round((processed / total) * 100));
      setImported(processed);

      if (processed >= total) {
        clearInterval(interval);
        setImportStep("done");
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email, teléfono, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="individual">Personas</SelectItem>
              <SelectItem value="company">Empresas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="prospective">Prospectos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Importar Clientes</DialogTitle>
                <DialogDescription>
                  Importa clientes desde Excel o CSV. El sistema detectará automáticamente las columnas.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Step 1: Upload */}
                {importStep === "upload" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Arrastra tu archivo aquí</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Soporta CSV, XLS, XLSX. Máximo 5,000 registros.
                    </p>
                    <Input
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Archivo
                      </label>
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      El sistema normalizará automáticamente mayúsculas/minúsculas y errores comunes
                    </p>
                  </div>
                )}

                {/* Step 2: Column Mapping */}
                {importStep === "mapping" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mapeo de Columnas</h3>
                        <p className="text-sm text-gray-500">
                          {importData.length} registros encontrados en {importFile?.name}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setImportStep("upload")}>
                        Cambiar Archivo
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {columnMappings.map((col) => (
                            <div key={col.system} className="flex items-center gap-4">
                              <div className="w-40">
                                <span className="text-sm font-medium">{col.label}</span>
                                {col.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </div>
                              <Select
                                value={importMapping[col.system] || ""}
                                onValueChange={(value) => {
                                  setImportMapping((prev) => ({
                                    ...prev,
                                    [col.system]: value,
                                  }));
                                }}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue placeholder="Seleccionar columna" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(importData[0] || {}).map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {importMapping[col.system] && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setImportOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        className="bg-[#1E3A5F] hover:bg-[#2C4A6F]"
                        onClick={() => setImportStep("preview")}
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Preview */}
                {importStep === "preview" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Vista Previa de Importación</h3>
                      <Badge variant="outline">{importData.length} registros</Badge>
                    </div>

                    <Card>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="w-8">#</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead>Estado</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {importData.slice(0, 10).map((row, idx) => {
                                const name = row[importMapping["fullName"]] || "";
                                const email = row[importMapping["email"]] || "";
                                const phone = row[importMapping["phone"]] || "";
                                const city = row[importMapping["city"]] || "";
                                const hasError = !name || !phone;

                                return (
                                  <TableRow key={idx} className={hasError ? "bg-red-50" : ""}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {normalizeText(name)}
                                        {!name && (
                                          <AlertCircle className="h-4 w-4 text-red-500" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>{email.toLowerCase()}</TableCell>
                                    <TableCell>{phone}</TableCell>
                                    <TableCell>{normalizeText(city)}</TableCell>
                                    <TableCell>
                                      {hasError ? (
                                        <Badge className="bg-red-100 text-red-700">Error</Badge>
                                      ) : (
                                        <Badge className="bg-green-100 text-green-700">OK</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                        {importData.length > 10 && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            Mostrando 10 de {importData.length} registros
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setImportStep("mapping")}>
                        Atrás
                      </Button>
                      <Button
                        className="bg-[#1E3A5F] hover:bg-[#2C4A6F]"
                        onClick={processImport}
                      >
                        Importar {importData.length} Clientes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Importing */}
                {importStep === "importing" && (
                  <div className="py-12 text-center">
                    <RefreshCw className="h-12 w-12 text-[#1E3A5F] mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Importando clientes...</h3>
                    <Progress value={importProgress} className="w-64 mx-auto h-2 mb-2" />
                    <p className="text-sm text-gray-500">
                      {imported} de {importData.length} registros procesados
                    </p>
                  </div>
                )}

                {/* Step 5: Done */}
                {importStep === "done" && (
                  <div className="py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">¡Importación Completada!</h3>
                    <p className="text-gray-500 mb-6">
                      {imported} clientes importados exitosamente
                    </p>
                    <Button
                      className="bg-[#1E3A5F] hover:bg-[#2C4A6F]"
                      onClick={() => {
                        setImportOpen(false);
                        setImportStep("upload");
                        setImportData([]);
                        setImportFile(null);
                      }}
                    >
                      Cerrar
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Tipo de Cliente</label>
                    <Select defaultValue="individual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Persona Natural</SelectItem>
                        <SelectItem value="company">Empresa/Organización</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nombre</label>
                    <Input placeholder="Nombre" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Apellido</label>
                    <Input placeholder="Apellido" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input type="email" placeholder="cliente@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Teléfono *</label>
                    <Input placeholder="+1 868-XXX-XXXX" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Dirección</label>
                  <Input placeholder="Dirección completa" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ciudad</label>
                    <Input placeholder="Port of Spain" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">País</label>
                    <Select defaultValue="tt">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tt">Trinidad & Tobago</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de ID</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national_id">Cédula/ID Nacional</SelectItem>
                        <SelectItem value="passport">Pasaporte</SelectItem>
                        <SelectItem value="tin">RIF/NIT</SelectItem>
                        <SelectItem value="registration_number">Registro Mercantil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Número de ID</label>
                    <Input placeholder="12345678" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de Facturación</label>
                    <Select defaultValue="hourly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Por Hora</SelectItem>
                        <SelectItem value="flat_fee">Tarifa Fija</SelectItem>
                        <SelectItem value="contingency">Honorario de Éxito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tarifa (TT$)</label>
                    <Input type="number" placeholder="850" />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setNewClientOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]" onClick={() => setNewClientOpen(false)}>
                    Guardar Cliente
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1E3A5F]/10 rounded-lg">
              <Users className="h-4 w-4 text-[#1E3A5F]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockClients.length}</p>
              <p className="text-xs text-gray-500">Total Clientes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockClients.filter((c) => c.clientType === "individual").length}</p>
              <p className="text-xs text-gray-500">Personas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockClients.filter((c) => c.clientType === "company").length}</p>
              <p className="text-xs text-gray-500">Empresas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockClients.reduce((sum, c) => sum + c.openCases, 0)}
              </p>
              <p className="text-xs text-gray-500">Casos Activos</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C4A35A]/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-[#C4A35A]" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                TT${(mockClients.reduce((sum, c) => sum + c.trustBalance, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500">En Trust</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Casos</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {client.clientType === "company" ? (
                          <Building className="h-5 w-5 text-gray-500" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {client.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{client.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {client.idType === "company" ? "Empresa" : client.idNumber}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{client.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        client.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{client.openCases}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#C4A35A]">
                      TT${client.trustBalance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">{client.lastActivity}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedClient.clientType === "company" ? (
                    <Building className="h-6 w-6 text-gray-500" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                  {selectedClient.fullName}
                </DialogTitle>
                <DialogDescription>
                  {selectedClient.clientType === "company" ? "Cliente Corporativo" : "Cliente Individual"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6 py-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedClient.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedClient.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {selectedClient.address}, {selectedClient.city}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Información Financiera
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Facturación:</span>
                      <span className="capitalize">{selectedClient.billingType.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tarifa:</span>
                      <span>TT${selectedClient.billingRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Balance Trust:</span>
                      <span className="text-[#C4A35A]">TT${selectedClient.trustBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Facturado:</span>
                      <span>TT${selectedClient.totalBilled.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Ver Casos ({selectedClient.openCases})
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </Button>
                <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Caso
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
