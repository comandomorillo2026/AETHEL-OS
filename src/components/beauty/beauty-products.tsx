"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Package,
  Plus,
  Search,
  Edit,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const productCategories = [
  { id: "hair_care", name: "Cuidado del Cabello" },
  { id: "skin_care", name: "Cuidado de la Piel" },
  { id: "nail_care", name: "Cuidado de Uñas" },
  { id: "makeup", name: "Maquillaje" },
  { id: "tools", name: "Herramientas" },
  { id: "accessories", name: "Accesorios" },
];

const mockProducts = [
  {
    id: "1",
    name: "Shampoo Profesional 1L",
    sku: "SHP-001",
    category: "hair_care",
    brand: "L'Oréal Professional",
    costPrice: 85,
    sellingPrice: 150,
    stock: 2,
    minStock: 5,
    sold: 28,
  },
  {
    id: "2",
    name: "Acondicionador 1L",
    sku: "ACD-001",
    category: "hair_care",
    brand: "L'Oréal Professional",
    costPrice: 90,
    sellingPrice: 160,
    stock: 8,
    minStock: 5,
    sold: 22,
  },
  {
    id: "3",
    name: "Tinte Rubio Ceniza 9.1",
    sku: "TIN-091",
    category: "hair_care",
    brand: "Koleston",
    costPrice: 45,
    sellingPrice: 95,
    stock: 3,
    minStock: 10,
    sold: 45,
  },
  {
    id: "4",
    name: "Serum Capilar Anti-Frizz",
    sku: "SRM-001",
    category: "hair_care",
    brand: "Moroccanoil",
    costPrice: 120,
    sellingPrice: 220,
    stock: 6,
    minStock: 3,
    sold: 15,
  },
  {
    id: "5",
    name: "Aceite para Barba 30ml",
    sku: "ACB-001",
    category: "hair_care",
    brand: "Beard Brand",
    costPrice: 55,
    sellingPrice: 120,
    stock: 15,
    minStock: 5,
    sold: 18,
  },
  {
    id: "6",
    name: "Esmalte Rojo Classic",
    sku: "ESM-RED",
    category: "nail_care",
    brand: "OPI",
    costPrice: 25,
    sellingPrice: 55,
    stock: 5,
    minStock: 8,
    sold: 32,
  },
  {
    id: "7",
    name: "Crema Facial Hidratante",
    sku: "CRF-001",
    category: "skin_care",
    brand: "CeraVe",
    costPrice: 75,
    sellingPrice: 145,
    stock: 10,
    minStock: 5,
    sold: 12,
  },
  {
    id: "8",
    name: "Protector Solar FPS 50",
    sku: "SUN-001",
    category: "skin_care",
    brand: "La Roche-Posay",
    costPrice: 95,
    sellingPrice: 180,
    stock: 7,
    minStock: 5,
    sold: 20,
  },
];

export function BeautyProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newProductOpen, setNewProductOpen] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = mockProducts.filter((p) => p.stock <= p.minStock);
  const totalInventoryValue = mockProducts.reduce(
    (sum, p) => sum + p.costPrice * p.stock,
    0
  );
  const totalRetailValue = mockProducts.reduce(
    (sum, p) => sum + p.sellingPrice * p.stock,
    0
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Package className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-500">Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
                <p className="text-sm text-gray-500">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  TT${totalInventoryValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Valor Inventario</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  TT${(totalRetailValue - totalInventoryValue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Ganancia Potencial</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-700">
                      {product.stock} unidades
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Mín: {product.minStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar producto o SKU..."
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
              {productCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nombre del Producto
                </label>
                <Input placeholder="Ej: Shampoo Profesional 1L" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    SKU
                  </label>
                  <Input placeholder="SHP-001" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Marca
                  </label>
                  <Input placeholder="L'Oréal" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categoría
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Precio Costo (TT$)
                  </label>
                  <Input type="number" placeholder="85" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Precio Venta (TT$)
                  </label>
                  <Input type="number" placeholder="150" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Stock Inicial
                  </label>
                  <Input type="number" placeholder="10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Stock Mínimo
                  </label>
                  <Input type="number" placeholder="5" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setNewProductOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                  onClick={() => setNewProductOpen(false)}
                >
                  Crear Producto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Producto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Categoría
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Stock
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Costo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Precio
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Margen
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Vendidos
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const margin = (
                    ((product.sellingPrice - product.costPrice) /
                      product.costPrice) *
                    100
                  ).toFixed(0);
                  const isLowStock = product.stock <= product.minStock;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.sku} • {product.brand}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {productCategories.find((c) => c.id === product.category)?.name}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <p
                            className={`font-medium ${
                              isLowStock ? "text-red-600" : ""
                            }`}
                          >
                            {product.stock}
                          </p>
                          <Progress
                            value={(product.stock / (product.minStock * 2)) * 100}
                            className="h-1.5 mt-1"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        TT${product.costPrice}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-pink-600">
                        TT${product.sellingPrice}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          className={
                            Number(margin) >= 50
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {margin}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {product.sold}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
