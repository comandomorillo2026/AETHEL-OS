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
  Scissors,
  Plus,
  Search,
  Clock,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";

const serviceCategories = [
  { id: "hair", name: "Cabello", icon: "💇‍♀️" },
  { id: "nails", name: "Uñas", icon: "💅" },
  { id: "skin", name: "Piel", icon: "✨" },
  { id: "makeup", name: "Maquillaje", icon: "💄" },
  { id: "spa", name: "Spa", icon: "🧖‍♀️" },
  { id: "barber", name: "Barbería", icon: "🪒" },
  { id: "bridal", name: "Novias", icon: "👰" },
];

const mockServices = [
  {
    id: "1",
    name: "Corte Dama",
    category: "hair",
    description: "Corte de cabello para damas con lavado y secado",
    price: 150,
    duration: 45,
    commission: 20,
    gender: "female",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "2",
    name: "Corte Caballero",
    category: "hair",
    description: "Corte de cabello para caballeros con lavado",
    price: 80,
    duration: 30,
    commission: 20,
    gender: "male",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "3",
    name: "Tinte Completo",
    category: "hair",
    description: "Aplicación de tinte en todo el cabello",
    price: 350,
    duration: 90,
    commission: 20,
    gender: "all",
    requiresDeposit: true,
    depositAmount: 100,
    active: true,
  },
  {
    id: "4",
    name: "Mechas",
    category: "hair",
    description: "Mechas con decoloración y tono",
    price: 500,
    duration: 120,
    commission: 25,
    gender: "all",
    requiresDeposit: true,
    depositAmount: 150,
    active: true,
  },
  {
    id: "5",
    name: "Manicure Básico",
    category: "nails",
    description: "Manicure con esmaltado tradicional",
    price: 120,
    duration: 45,
    commission: 25,
    gender: "all",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "6",
    name: "Uñas Acrílicas",
    category: "nails",
    description: "Aplicación de uñas acrílicas con diseño",
    price: 350,
    duration: 90,
    commission: 25,
    gender: "all",
    requiresDeposit: true,
    depositAmount: 100,
    active: true,
  },
  {
    id: "7",
    name: "Pedicure Spa",
    category: "nails",
    description: "Pedicure completo con spa y esmaltado",
    price: 180,
    duration: 60,
    commission: 25,
    gender: "all",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "8",
    name: "Tratamiento Facial",
    category: "skin",
    description: "Limpieza facial profunda con mascarilla",
    price: 280,
    duration: 60,
    commission: 20,
    gender: "all",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "9",
    name: "Barba + Corte",
    category: "barber",
    description: "Corte de cabello y arreglo de barba",
    price: 120,
    duration: 45,
    commission: 20,
    gender: "male",
    requiresDeposit: false,
    active: true,
  },
  {
    id: "10",
    name: "Maquillaje Social",
    category: "makeup",
    description: "Maquillaje para eventos sociales",
    price: 250,
    duration: 60,
    commission: 25,
    gender: "female",
    requiresDeposit: false,
    active: true,
  },
];

export function BeautyServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newServiceOpen, setNewServiceOpen] = useState(false);

  const getCategoryInfo = (categoryId: string) => {
    return serviceCategories.find((c) => c.id === categoryId) || serviceCategories[0];
  };

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof mockServices>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Scissors className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-gray-500">Servicios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">60 min</p>
                <p className="text-sm text-gray-500">Duración Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">TT$248</p>
                <p className="text-sm text-gray-500">Precio Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-lg">📁</span>
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-gray-500">Categorías</p>
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
              placeholder="Buscar servicio..."
              className="w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {serviceCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={newServiceOpen} onOpenChange={setNewServiceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nombre del Servicio
                </label>
                <Input placeholder="Ej: Corte Dama" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categoría
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Descripción
                </label>
                <Input placeholder="Descripción del servicio" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Precio (TT$)
                  </label>
                  <Input type="number" placeholder="150" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Duración (min)
                  </label>
                  <Input type="number" placeholder="45" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Comisión (%)
                  </label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Género
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="male">Caballeros</SelectItem>
                      <SelectItem value="female">Damas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setNewServiceOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                  onClick={() => setNewServiceOpen(false)}
                >
                  Crear Servicio
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services by Category */}
      {filterCategory === "all" ? (
        <div className="space-y-6">
          {Object.entries(groupedServices).map(([category, services]) => {
            const categoryInfo = getCategoryInfo(category);
            return (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">{categoryInfo.icon}</span>
                    {categoryInfo.name}
                    <Badge variant="outline" className="ml-2">
                      {services.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {service.name}
                          </h4>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {service.requiresDeposit && (
                              <Badge
                                variant="outline"
                                className="text-xs border-yellow-300 text-yellow-700"
                              >
                                Depósito
                              </Badge>
                            )}
                            <span className="font-bold text-pink-600">
                              TT${service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{service.duration} min</span>
                    </div>
                    <span className="font-bold text-pink-600">
                      TT${service.price}
                    </span>
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
