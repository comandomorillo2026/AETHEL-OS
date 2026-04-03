"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantityInStock: number;
  reorderLevel?: number;
  unitOfMeasure: string;
  imageUrl?: string;
  isCustomizable: boolean;
  variants?: ProductVariant[];
  isActive: boolean;
  allergens?: string;
  shelfLife?: number;
}

interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  sku?: string;
}

interface Category {
  name: string;
  count: number;
}

// ============================================
// DATOS DE DEMOSTRACIÓN - PANADERÍA TRINIDAD
// Panadería realista con productos locales
// ============================================
const DEMO_PRODUCTS: Product[] = [
  // === PANES ===
  {
    id: '1',
    sku: 'PAN-001',
    name: 'Pan de Agua',
    description: 'Pan tradicional crujiente por fuera, suave por dentro. Perfecto para sándwiches o para acompañar comidas. Horneado diario con harina de trigo de primera calidad.',
    category: 'Panes',
    costPrice: 4.50,
    sellingPrice: 8.00,
    quantityInStock: 45,
    reorderLevel: 15,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    shelfLife: 2
  },
  {
    id: '2',
    sku: 'PAN-002',
    name: 'Pan de Jamón',
    description: 'Tradicional pan navideño relleno de jamón, pasas y aceitunas. Disponible todo el año. El favorito para fiestas y reuniones familiares.',
    category: 'Panes',
    costPrice: 35.00,
    sellingPrice: 65.00,
    quantityInStock: 8,
    reorderLevel: 5,
    unitOfMeasure: 'unidad',
    isCustomizable: true,
    isActive: true,
    shelfLife: 3
  },
  {
    id: '3',
    sku: 'PAN-003',
    name: 'Coconut Bake',
    description: 'Pan dulce de coco tradicional del Caribe. Perfecto para el desayuno con mantequilla o queso. Hecho con coco fresco rallado.',
    category: 'Panes',
    costPrice: 12.00,
    sellingPrice: 22.00,
    quantityInStock: 20,
    reorderLevel: 8,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    shelfLife: 2
  },
  {
    id: '4',
    sku: 'PAN-004',
    name: 'Fry Bake (Aloo Pie)',
    description: 'Pan frito relleno de papas especiadas. Bocado tradicional trinitense con curry suave y hierbas frescas.',
    category: 'Panes',
    costPrice: 6.00,
    sellingPrice: 12.00,
    quantityInStock: 30,
    reorderLevel: 10,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    shelfLife: 1
  },
  {
    id: '5',
    sku: 'PAN-005',
    name: 'Doubles Bread (Bara)',
    description: 'Pan plano suave para doubles. El base perfecto para el famoso street food de Trinidad. Venta por docena.',
    category: 'Panes',
    costPrice: 15.00,
    sellingPrice: 28.00,
    quantityInStock: 25,
    reorderLevel: 10,
    unitOfMeasure: 'docena',
    isCustomizable: false,
    isActive: true,
    shelfLife: 1
  },
  
  // === TORTAS Y PASTELES ===
  {
    id: '6',
    sku: 'TORT-001',
    name: 'Torta de Chocolate Belga',
    description: 'Exquisita torta de tres capas con chocolate belga 70% cacao. Relleno de ganache y cobertura espejo. Ideal para cumpleaños y celebraciones especiales.',
    category: 'Tortas',
    costPrice: 85.00,
    sellingPrice: 180.00,
    quantityInStock: 3,
    reorderLevel: 2,
    unitOfMeasure: 'unidad',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos'
  },
  {
    id: '7',
    sku: 'TORT-002',
    name: 'Torta Tres Leches',
    description: 'Clásica torta latinoamericana empapada en leche condensada, evaporada y crema. Súper húmeda y deliciosa. Decorada con merengue tostado.',
    category: 'Tortas',
    costPrice: 55.00,
    sellingPrice: 120.00,
    quantityInStock: 4,
    reorderLevel: 2,
    unitOfMeasure: 'unidad',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos'
  },
  {
    id: '8',
    sku: 'TORT-003',
    name: 'Pastel de Bodas Elegante',
    description: 'Torta premium para bodas. Diseño personalizado con flores de azúcar. Precios desde 10 porciones hasta 200. Cita previa requerida para diseño.',
    category: 'Tortas',
    costPrice: 400.00,
    sellingPrice: 950.00,
    quantityInStock: 0,
    reorderLevel: 0,
    unitOfMeasure: 'unidad',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos'
  },
  {
    id: '9',
    sku: 'TORT-004',
    name: 'Black Cake Trinidad',
    description: 'Tradicional black cake de Trinidad con frutas maceradas en ron durante meses. El clásico para bodas y Navidad. Encargo con 2 semanas de anticipación.',
    category: 'Tortas',
    costPrice: 120.00,
    sellingPrice: 280.00,
    quantityInStock: 2,
    reorderLevel: 1,
    unitOfMeasure: 'libra',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos, Frutos secos'
  },
  
  // === DULCES ===
  {
    id: '10',
    sku: 'DUL-001',
    name: 'Donas Glaseadas x6',
    description: 'Media docena de donas frescas con glaseado de vainilla. Suaves y esponjosas, hechas cada mañana. También disponibles con chocolate o azúcar.',
    category: 'Dulces',
    costPrice: 15.00,
    sellingPrice: 30.00,
    quantityInStock: 15,
    reorderLevel: 5,
    unitOfMeasure: 'paquete',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos'
  },
  {
    id: '11',
    sku: 'DUL-002',
    name: 'Cupcakes Especiales x6',
    description: 'Cupcakes gourmet en sabores variados: Red Velvet, Guayaba, Coconut Rum, y Mango. Decoración personalizada para eventos.',
    category: 'Dulces',
    costPrice: 28.00,
    sellingPrice: 55.00,
    quantityInStock: 8,
    reorderLevel: 3,
    unitOfMeasure: 'paquete',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Huevos, Lácteos'
  },
  {
    id: '12',
    sku: 'DUL-003',
    name: 'Sweet Bread (Pan Dulce)',
    description: 'Pan dulce trinitense con coco, pasas y especias. Perfecto para la merienda con una taza de té. Tradición caribeña.',
    category: 'Dulces',
    costPrice: 10.00,
    sellingPrice: 18.00,
    quantityInStock: 22,
    reorderLevel: 8,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten, Lácteos'
  },
  
  // === SALADOS ===
  {
    id: '13',
    sku: 'SAL-001',
    name: 'Beef Patty Jamaicano',
    description: 'Empanada de carne con corteza amarilla y relleno picante de carne molida sazonada con especias jamaicanas. El más vendido.',
    category: 'Salados',
    costPrice: 8.00,
    sellingPrice: 15.00,
    quantityInStock: 35,
    reorderLevel: 15,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten'
  },
  {
    id: '14',
    sku: 'SAL-002',
    name: 'Empanadas de Pollo x6',
    description: 'Media docena de empanadas crujientes rellenas de pollo guisado con cebolla, pimiento y especias criollas.',
    category: 'Salados',
    costPrice: 25.00,
    sellingPrice: 45.00,
    quantityInStock: 12,
    reorderLevel: 5,
    unitOfMeasure: 'paquete',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten'
  },
  {
    id: '15',
    sku: 'SAL-003',
    name: 'Pizza Bread',
    description: 'Pan de pizza con salsa de tomate casera, queso mozzarella y pepperoni. Perfecto para compartir. 8 porciones.',
    category: 'Salados',
    costPrice: 22.00,
    sellingPrice: 42.00,
    quantityInStock: 6,
    reorderLevel: 3,
    unitOfMeasure: 'unidad',
    isCustomizable: true,
    isActive: true,
    allergens: 'Gluten, Lácteos'
  },
  
  // === ESPECIALES ===
  {
    id: '16',
    sku: 'ESP-001',
    name: 'Pastelitos de Guayaba',
    description: 'Hojaldre crujiente relleno de pasta de guayaba. Dulce tradicional del Caribe. Empaque de 12 unidades.',
    category: 'Especiales',
    costPrice: 18.00,
    sellingPrice: 35.00,
    quantityInStock: 10,
    reorderLevel: 4,
    unitOfMeasure: 'paquete',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten'
  },
  {
    id: '17',
    sku: 'ESP-002',
    name: 'Roti Skins (Dhalpuri)',
    description: 'Roti tradicional trinitense con dhal (lentejas) dentro. Perfecto para hacer roti con curry. Venta por unidad.',
    category: 'Especiales',
    costPrice: 5.00,
    sellingPrice: 10.00,
    quantityInStock: 40,
    reorderLevel: 15,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true,
    allergens: 'Gluten'
  },
  
  // === BEBIDAS ===
  {
    id: '18',
    sku: 'BEB-001',
    name: 'Mauby Casero',
    description: 'Bebida refrescante tradicional hecha de corteza de mauby. Sabor único del Caribe. Botella de 500ml.',
    category: 'Bebidas',
    costPrice: 4.00,
    sellingPrice: 8.00,
    quantityInStock: 24,
    reorderLevel: 10,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true
  },
  {
    id: '19',
    sku: 'BEB-002',
    name: 'Sorrel Drink',
    description: 'Bebida de flor de Jamaica con jengibre y especias. Refrescante y tradicional, especialmente en temporada navideña.',
    category: 'Bebidas',
    costPrice: 5.00,
    sellingPrice: 10.00,
    quantityInStock: 18,
    reorderLevel: 8,
    unitOfMeasure: 'unidad',
    isCustomizable: false,
    isActive: true
  }
];

export function BakeryProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    costPrice: 0,
    sellingPrice: 0,
    quantityInStock: 0,
    reorderLevel: 5,
    unitOfMeasure: "unidad",
    isCustomizable: false,
  });

  useEffect(() => {
    loadDemoProducts();
  }, [selectedCategory, showLowStock, search]);

  // Cargar productos de demostración
  const loadDemoProducts = () => {
    setLoading(true);
    
    // Simular delay de red
    setTimeout(() => {
      let filtered = [...DEMO_PRODUCTS];
      
      // Filtrar por categoría
      if (selectedCategory !== "all") {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      
      // Filtrar por stock bajo
      if (showLowStock) {
        filtered = filtered.filter(p => 
          p.reorderLevel && p.quantityInStock <= p.reorderLevel
        );
      }
      
      // Filtrar por búsqueda
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }
      
      setProducts(filtered);
      
      // Calcular categorías
      const categoryMap = new Map<string, number>();
      DEMO_PRODUCTS.forEach(p => {
        if (p.isActive) {
          categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
        }
      });
      setCategories(Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })));
      
      setLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    loadDemoProducts();
  };

  // Auto-generate code from name
  const generateCode = (name: string) => {
    if (!name) return "";
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}-${random}`;
  };

  const handleAddProduct = () => {
    // Crear nuevo producto con datos del formulario
    const newProduct: Product = {
      id: `new-${Date.now()}`,
      sku: formData.sku || generateCode(formData.name),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: formData.costPrice,
      sellingPrice: formData.sellingPrice,
      quantityInStock: formData.quantityInStock,
      reorderLevel: formData.reorderLevel,
      unitOfMeasure: formData.unitOfMeasure,
      isCustomizable: formData.isCustomizable,
      isActive: true
    };
    
    // Agregar a la lista de demostración
    DEMO_PRODUCTS.push(newProduct);
    setProducts(prev => [...prev, newProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      costPrice: 0,
      sellingPrice: 0,
      quantityInStock: 0,
      reorderLevel: 5,
      unitOfMeasure: "unidad",
      isCustomizable: false,
    });
  };

  const formatCurrency = (amount: number) => {
    return `TT$${amount.toFixed(2)}`;
  };

  const getStockStatus = (product: Product) => {
    if (product.quantityInStock === 0) {
      return { label: "Sin Stock", color: "bg-red-100 text-red-700" };
    }
    if (product.reorderLevel && product.quantityInStock <= product.reorderLevel) {
      return { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "En Stock", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-gray-500">Gestiona tu inventario de panaderia</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#F97316] hover:bg-[#EA580C]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar producto o SKU..."
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={() => setShowLowStock(!showLowStock)}
              className={showLowStock ? "bg-[#F97316] hover:bg-[#EA580C]" : ""}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Stock Bajo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="h-12 w-12 mb-4 text-gray-300" />
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">
                          {product.sku}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-[#F97316]" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              {product.isCustomizable && (
                                <p className="text-xs text-gray-500">
                                  Personalizable
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right font-bold text-[#F97316]">
                          {formatCurrency(product.sellingPrice)}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.quantityInStock} {product.unitOfMeasure}
                        </TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Auto-generado"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nombre del producto"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descripcion</label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripcion del producto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Categoria *</label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="ej. Panes, Pasteles"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unidad</label>
                <Select
                  value={formData.unitOfMeasure}
                  onValueChange={(value) =>
                    setFormData({ ...formData, unitOfMeasure: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="kg">Kilogramo</SelectItem>
                    <SelectItem value="lb">Libra</SelectItem>
                    <SelectItem value="docena">Docena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Costo</label>
                <Input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costPrice: parseFloat(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Precio Venta *</label>
                <Input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingPrice: parseFloat(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Stock Inicial</label>
                <Input
                  type="number"
                  value={formData.quantityInStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantityInStock: parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nivel Reorden</label>
                <Input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reorderLevel: parseInt(e.target.value),
                    })
                  }
                  placeholder="5"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddProduct}
              className="bg-[#F97316] hover:bg-[#EA580C]"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
