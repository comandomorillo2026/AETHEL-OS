"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  User,
  Percent,
  X,
} from "lucide-react";

const mockServices = [
  { id: "1", name: "Corte Dama", price: 150, duration: 45, category: "hair" },
  { id: "2", name: "Corte Caballero", price: 80, duration: 30, category: "hair" },
  { id: "3", name: "Tinte", price: 350, duration: 90, category: "hair" },
  { id: "4", name: "Mechas", price: 500, duration: 120, category: "hair" },
  { id: "5", name: "Manicure", price: 120, duration: 45, category: "nails" },
  { id: "6", name: "Pedicure", price: 150, duration: 60, category: "nails" },
  { id: "7", name: "Uñas Acrílicas", price: 350, duration: 90, category: "nails" },
  { id: "8", name: "Facial", price: 280, duration: 60, category: "skin" },
  { id: "9", name: "Barba", price: 60, duration: 30, category: "barber" },
  { id: "10", name: "Maquillaje", price: 250, duration: 60, category: "makeup" },
];

const mockProducts = [
  { id: "p1", name: "Shampoo Profesional 500ml", price: 120, sku: "SHP-001", stock: 15 },
  { id: "p2", name: "Acondicionador 500ml", price: 130, sku: "ACD-001", stock: 12 },
  { id: "p3", name: "Serum Capilar", price: 180, sku: "SRM-001", stock: 8 },
  { id: "p4", name: "Aceite para Barba", price: 95, sku: "ACB-001", stock: 20 },
  { id: "p5", name: "Crema Facial", price: 150, sku: "CRF-001", stock: 10 },
];

const staffMembers = [
  { id: "1", name: "Ana García", commission: 20 },
  { id: "2", name: "Pedro López", commission: 20 },
  { id: "3", name: "Sofía Martínez", commission: 25 },
  { id: "4", name: "Carmen Ruiz", commission: 20 },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "service" | "product";
  staffId?: string;
  staffName?: string;
}

export function BeautyPOS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"services" | "products">("services");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const filteredItems =
    activeTab === "services"
      ? mockServices.filter((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : mockProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const addToCart = (item: typeof mockServices[0] | typeof mockProducts[0], type: "service" | "product") => {
    const existing = cart.find((c) => c.id === item.id && c.type === type);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id && c.type === type
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          type,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, type: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string, type: string) => {
    setCart(cart.filter((item) => !(item.id === id && item.type === type)));
  };

  const assignStaff = (itemId: string, staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    setCart(
      cart.map((item) =>
        item.id === itemId && item.type === "service"
          ? { ...item, staffId, staffName: staff?.name }
          : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount =
    discountType === "percentage"
      ? (subtotal * discount) / 100
      : discount;
  const tax = (subtotal - discountAmount) * 0.125; // 12.5% VAT Trinidad
  const total = subtotal - discountAmount + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Products/Services Catalog */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Buscar ${activeTab === "services" ? "servicios" : "productos"}...`}
                className="w-64 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "services" ? "default" : "outline"}
              onClick={() => setActiveTab("services")}
              className={activeTab === "services" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              Servicios
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "outline"}
              onClick={() => setActiveTab("products")}
              className={activeTab === "products" ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              Productos
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item, activeTab === "services" ? "service" : "product")}
                  className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50/50 transition-all text-left"
                >
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-3">
                    {activeTab === "services" ? (
                      <span className="text-3xl">✂️</span>
                    ) : (
                      <span className="text-3xl">🧴</span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-pink-600 font-bold mt-1">
                    TT${item.price}
                  </p>
                  {activeTab === "services" && "duration" in item && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.duration} min
                    </p>
                  )}
                  {activeTab === "products" && "stock" in item && (
                    <p className="text-xs text-gray-500 mt-1">
                      Stock: {item.stock}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Venta Actual</CardTitle>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Client Selection */}
          <div className="mb-4">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ Nuevo Cliente</SelectItem>
                <SelectItem value="1">María González</SelectItem>
                <SelectItem value="2">Carlos Pérez</SelectItem>
                <SelectItem value="3">Ana Martínez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                <p>Carrito vacío</p>
                <p className="text-sm">Agrega servicios o productos</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.id}-${item.type}`}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            item.type === "service"
                              ? "border-pink-300 text-pink-600"
                              : "border-purple-300 text-purple-600"
                          }
                        >
                          {item.type === "service" ? "Servicio" : "Producto"}
                        </Badge>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <p className="text-pink-600 font-bold mt-1">
                        TT${item.price}
                      </p>

                      {item.type === "service" && (
                        <Select
                          value={item.staffId || ""}
                          onValueChange={(value) => assignStaff(item.id, value)}
                        >
                          <SelectTrigger className="h-8 mt-2 text-xs">
                            <SelectValue placeholder="Asignar estilista" />
                          </SelectTrigger>
                          <SelectContent>
                            {staffMembers.map((staff) => (
                              <SelectItem key={staff.id} value={staff.id}>
                                {staff.name} ({staff.commission}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.type, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.type, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => removeFromCart(item.id, item.type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount */}
          {cart.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                placeholder="Descuento"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="flex-1"
              />
              <Select
                value={discountType}
                onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">TT$</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>TT${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento</span>
                <span>-TT${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IVA (12.5%)</span>
              <span>TT${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-pink-600">TT${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          {cart.length > 0 && (
            <div className="mt-4 space-y-2">
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 h-12"
                onClick={() => setShowPaymentDialog(true)}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Procesar Pago - TT${total.toFixed(2)}
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setPaymentMethod("cash");
                    setShowPaymentDialog(true);
                  }}
                >
                  <Banknote className="h-4 w-4 mr-1" />
                  Efectivo
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setPaymentMethod("card");
                    setShowPaymentDialog(true);
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Tarjeta
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setPaymentMethod("transfer");
                    setShowPaymentDialog(true);
                  }}
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Transfer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
