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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Search,
  Upload,
  Download,
  File,
  FilePlus,
  Copy,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Gavel,
  Building,
  Users,
  Scale,
  Briefcase,
  FileCheck,
  Clock,
  Folder,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  ExternalLink,
} from "lucide-react";

// Document templates
const documentTemplates = [
  {
    id: "1",
    name: "Demanda Civil - Cobro de Dinero",
    category: "pleading",
    practiceArea: "civil",
    jurisdiction: "Trinidad & Tobago",
    description: "Plantilla estándar para demandas de cobro de sumas de dinero en jurisdicción civil.",
    variables: ["cliente_nombre", "cliente_direccion", "demandado_nombre", "demandado_direccion", "monto", "fecha_contrato"],
    usageCount: 45,
    isSystem: true,
    lastUpdated: "2026-01-15",
  },
  {
    id: "2",
    name: "Contrato de Arrendamiento Comercial",
    category: "contract",
    practiceArea: "real_estate",
    jurisdiction: "Trinidad & Tobago",
    description: "Contrato de arrendamiento para locales comerciales con todas las cláusulas estándar.",
    variables: ["arrendador_nombre", "arrendatario_nombre", "direccion_inmueble", "canon_mensual", "duracion_meses"],
    usageCount: 89,
    isSystem: true,
    lastUpdated: "2026-02-20",
  },
  {
    id: "3",
    name: "Poder Notarial General",
    category: "deed",
    practiceArea: "civil",
    jurisdiction: "Trinidad & Tobago",
    description: "Poder notarial general para actos de administración y disposición.",
    variables: ["otorgante_nombre", "otorgante_cedula", "apoderado_nombre", "apoderado_cedula"],
    usageCount: 156,
    isSystem: true,
    lastUpdated: "2026-03-01",
  },
  {
    id: "4",
    name: "Solicitud de Divorcio",
    category: "pleading",
    practiceArea: "family",
    jurisdiction: "Trinidad & Tobago",
    description: "Solicitud de divorcio voluntario con petición de medidas provisionales.",
    variables: ["solicitante_nombre", "demandado_nombre", "fecha_matrimonio", "lugar_matrimonio", "hijos"],
    usageCount: 34,
    isSystem: true,
    lastUpdated: "2026-02-10",
  },
  {
    id: "5",
    name: "Contrato de Prestación de Servicios",
    category: "contract",
    practiceArea: "corporate",
    jurisdiction: "Trinidad & Tobago",
    description: "Contrato de prestación de servicios profesionales B2B.",
    variables: ["prestador_nombre", "cliente_nombre", "servicio_descripcion", "honorarios", "plazo"],
    usageCount: 78,
    isSystem: true,
    lastUpdated: "2026-01-28",
  },
  {
    id: "6",
    name: "Escrito de Apelación",
    category: "pleading",
    practiceArea: "civil",
    jurisdiction: "Trinidad & Tobago",
    description: "Modelo de escrito de apelación ante el Tribunal de Apelaciones.",
    variables: ["apelante_nombre", "recurrido_nombre", "sentencia_fecha", "tribunal_origen", "motivos"],
    usageCount: 23,
    isSystem: true,
    lastUpdated: "2026-03-05",
  },
  {
    id: "7",
    name: "Acta de Asamblea de Accionistas",
    category: "corporate",
    practiceArea: "corporate",
    jurisdiction: "Trinidad & Tobago",
    description: "Acta estándar para asambleas ordinarias de accionistas.",
    variables: ["empresa_nombre", "fecha_asamblea", "lugar", "asistentes", "acuerdos"],
    usageCount: 67,
    isSystem: true,
    lastUpdated: "2026-02-15",
  },
  {
    id: "8",
    name: "Testamento Abierto",
    category: "deed",
    practiceArea: "probate",
    jurisdiction: "Trinidad & Tobago",
    description: "Modelo de testamento abierto con designación de herederos y legados.",
    variables: ["testador_nombre", "testador_cedula", "herederos", "albacea_nombre"],
    usageCount: 45,
    isSystem: true,
    lastUpdated: "2026-01-20",
  },
];

// Legal references (laws, statutes)
const legalReferences = [
  {
    id: "1",
    type: "statute",
    title: "Supreme Court of Judicature Act",
    shortTitle: "SCJA",
    citation: "Ch. 4:01",
    jurisdiction: "Trinidad & Tobago",
    effectiveDate: "1962",
    description: "Ley que establece la estructura y jurisdicción de los tribunales superiores de Trinidad y Tobago.",
    category: "Civil Procedure",
  },
  {
    id: "2",
    type: "statute",
    title: "Companies Act",
    shortTitle: "Companies Act",
    citation: "Ch. 81:01",
    jurisdiction: "Trinidad & Tobago",
    effectiveDate: "1995",
    description: "Ley que regula la constitución, operación y disolución de compañías.",
    category: "Corporate",
  },
  {
    id: "3",
    type: "statute",
    title: "Matrimonial Proceedings and Property Act",
    shortTitle: "MPPA",
    citation: "Ch. 45:51",
    jurisdiction: "Trinidad & Tobago",
    effectiveDate: "1975",
    description: "Ley que regula los procedimientos matrimoniales y la división de bienes.",
    category: "Family",
  },
  {
    id: "4",
    type: "statute",
    title: "Real Property Act",
    shortTitle: "RPA",
    citation: "Ch. 56:02",
    jurisdiction: "Trinidad & Tobago",
    effectiveDate: "1946",
    description: "Ley que regula el registro de propiedades inmobiliarias.",
    category: "Real Estate",
  },
  {
    id: "5",
    type: "statute",
    title: "Criminal Procedure Act",
    shortTitle: "CPA",
    citation: "Ch. 12:02",
    jurisdiction: "Trinidad & Tobago",
    effectiveDate: "1925",
    description: "Ley que establece los procedimientos en materia penal.",
    category: "Criminal",
  },
  {
    id: "6",
    type: "case_law",
    title: "Ramnarace v Lutchman",
    citation: "[2001] UKPC 25",
    court: "Privy Council",
    dateDecided: "2001",
    jurisdiction: "Trinidad & Tobago",
    description: "Caso líder sobre construcción de testamentos y la regla de armamiento.",
    category: "Probate",
  },
  {
    id: "7",
    type: "case_law",
    title: "Boe v Boe",
    citation: "[2014] TTCA 12",
    court: "Court of Appeal Trinidad & Tobago",
    dateDecided: "2014",
    jurisdiction: "Trinidad & Tobago",
    description: "Autoridad sobre división de bienes matrimoniales.",
    category: "Family",
  },
];

// Practice areas for filter
const practiceAreas = [
  { value: "all", label: "Todas las Áreas" },
  { value: "civil", label: "Civil" },
  { value: "corporate", label: "Corporativo" },
  { value: "family", label: "Familia" },
  { value: "criminal", label: "Penal" },
  { value: "probate", label: "Sucesiones" },
  { value: "real_estate", label: "Inmobiliario" },
];

export function LawDocuments() {
  const [activeTab, setActiveTab] = useState<"templates" | "documents" | "library">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof documentTemplates[0] | null>(null);
  const [newDocOpen, setNewDocOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pleading":
        return <Scale className="h-4 w-4" />;
      case "contract":
        return <FileCheck className="h-4 w-4" />;
      case "corporate":
        return <Building className="h-4 w-4" />;
      case "deed":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "pleading":
        return "bg-blue-100 text-blue-700";
      case "contract":
        return "bg-green-100 text-green-700";
      case "corporate":
        return "bg-purple-100 text-purple-700";
      case "deed":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTemplates = documentTemplates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = filterArea === "all" || t.practiceArea === filterArea;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesArea && matchesCategory;
  });

  const filteredReferences = legalReferences.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos, plantillas, leyes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              {practiceAreas.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Subir Documento
          </Button>
          <Button className="bg-[#1E3A5F] hover:bg-[#2C4A6F]">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo desde Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="templates">
            <FilePlus className="h-4 w-4 mr-2" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Folder className="h-4 w-4 mr-2" />
            Mis Documentos
          </TabsTrigger>
          <TabsTrigger value="library">
            <BookOpen className="h-4 w-4 mr-2" />
            Biblioteca Legal
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1E3A5F]/10 rounded-lg">
                  <FilePlus className="h-4 w-4 text-[#1E3A5F]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documentTemplates.length}</p>
                  <p className="text-xs text-gray-500">Plantillas Disponibles</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {documentTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Documentos Generados</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gavel className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2026</p>
                  <p className="text-xs text-gray-500">Plantillas Actualizadas</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getCategoryIcon(template.category)}
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {template.name}
                  </h4>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Usado {template.usageCount} veces</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {template.practiceArea}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Mis Documentos
              </h3>
              <p className="text-gray-500 mb-4">
                Aquí se mostrarán los documentos generados y subidos a cada caso.
              </p>
              <p className="text-sm text-gray-400">
                Los documentos se organizan automáticamente por caso y cliente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Library Tab */}
        <TabsContent value="library" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2C4A6F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Biblioteca Legal de Trinidad & Tobago</h3>
                  <p className="text-white/80">
                    Leyes, reglamentos y jurisprudencia actualizados para tu investigación
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* References List */}
          <div className="space-y-3">
            {filteredReferences.map((ref) => (
              <Card key={ref.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        ref.type === "statute" ? "bg-blue-100" : "bg-purple-100"
                      }`}>
                        {ref.type === "statute" ? (
                          <Gavel className={`h-5 w-5 ${
                            ref.type === "statute" ? "text-blue-600" : "text-purple-600"
                          }`} />
                        ) : (
                          <Scale className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{ref.title}</h4>
                          {ref.shortTitle && (
                            <Badge variant="outline" className="text-xs">
                              {ref.shortTitle}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-mono">{ref.citation}</span>
                          {ref.court && <span> • {ref.court}</span>}
                          {ref.effectiveDate && <span> • Vigente desde {ref.effectiveDate}</span>}
                          {ref.dateDecided && <span> • {ref.dateDecided}</span>}
                        </p>
                        <p className="text-sm text-gray-600">{ref.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="capitalize">{ref.category}</Badge>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCategoryIcon(selectedTemplate.category)}
                  </div>
                  <div>
                    <DialogTitle>{selectedTemplate.name}</DialogTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(selectedTemplate.category)}>
                        {selectedTemplate.category}
                      </Badge>
                      <span className="capitalize">{selectedTemplate.practiceArea}</span>
                      <span>•</span>
                      <span>{selectedTemplate.jurisdiction}</span>
                    </CardDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Descripción</h4>
                  <p className="text-gray-700">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Variables del Documento</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((v) => (
                      <Badge key={v} variant="outline" className="font-mono text-xs">
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Última actualización:</span>
                        <span className="font-medium">{selectedTemplate.lastUpdated}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileCheck className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Veces usado:</span>
                        <span className="font-medium">{selectedTemplate.usageCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button className="flex-1 bg-[#1E3A5F] hover:bg-[#2C4A6F]">
                    <FilePlus className="h-4 w-4 mr-2" />
                    Generar Documento
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
