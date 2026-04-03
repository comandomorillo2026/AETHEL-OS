"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ChefHat,
  Globe,
  ExternalLink,
  Eye,
  Store,
} from "lucide-react";
import Link from "next/link";

interface DashboardMetrics {
  todaySales: number;
  yesterdaySales: number;
  salesChange: string;
  productsSoldToday: number;
  pendingOrders: number;
  customersToday: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  quantityInStock: number;
  reorderLevel: number | null;
  category: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    totalPrice: number;
  }>;
}

interface SalesChartData {
  date: string;
  totalSales: number;
  orderCount: number;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change}
                </span>
                <span className="text-sm text-gray-400">vs ayer</span>
              </div>
            )}
          </div>
          <div
            className="p-3 rounded-xl text-white"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BakeryDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesChart, setSalesChart] = useState<SalesChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/bakery/dashboard");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setLowStockProducts(data.lowStockProducts);
        setRecentOrders(data.recentOrders);
        setSalesChart(data.salesChart);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `TT$${amount.toLocaleString("en-TT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      preparing: "bg-blue-100 text-blue-700",
      ready: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      preparing: "Preparando",
      ready: "Listo",
      completed: "Completado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
      </div>
    );
  }

  const salesChangeNum = metrics ? parseFloat(metrics.salesChange) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas del Dia"
          value={formatCurrency(metrics?.todaySales || 0)}
          change={`${Math.abs(salesChangeNum).toFixed(1)}%`}
          trend={salesChangeNum >= 0 ? "up" : "down"}
          icon={<DollarSign className="h-6 w-6" />}
          color="#F97316"
        />
        <StatCard
          title="Productos Vendidos"
          value={metrics?.productsSoldToday?.toString() || "0"}
          icon={<Package className="h-6 w-6" />}
          color="#FBBF24"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={metrics?.pendingOrders?.toString() || "0"}
          icon={<Clock className="h-6 w-6" />}
          color="#3B82F6"
        />
        <StatCard
          title="Clientes Hoy"
          value={metrics?.customersToday?.toString() || "0"}
          icon={<Users className="h-6 w-6" />}
          color="#10B981"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#F97316]" />
              Pedidos Recientes
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay pedidos recientes
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <ChefHat className="h-5 w-5 text-[#F97316]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName} - {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#F97316]">
                        {formatCurrency(order.total)}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay productos con stock bajo
              </p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-[#F97316]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-orange-600">
                        Quedan {product.quantityInStock} unidades
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#F97316] hover:bg-[#EA580C]">
                    Reordenar
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#F97316]" />
            Ventas - Ultimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesChart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay datos de ventas
            </p>
          ) : (
            <div className="space-y-4">
              {salesChart.map((day, index) => {
                const maxSales = Math.max(...salesChart.map((d) => d.totalSales));
                const percentage = maxSales > 0 ? (day.totalSales / maxSales) * 100 : 0;
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
                const formattedDate = date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {dayName} {formattedDate}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          {day.orderCount} pedidos
                        </span>
                        <span className="font-bold text-[#F97316]">
                          {formatCurrency(day.totalSales)}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2 bg-gray-200 [&>div]:bg-[#F97316]"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Public Portal Card */}
      <Card className="bg-gradient-to-r from-[#F97316]/10 to-[#FBBF24]/10 border-[#F97316]/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-lg">
                <Store className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tu Portal de Productos</h3>
                <p className="text-sm text-gray-600">
                  Tu catálogo público donde los clientes pueden ver productos y contactarte
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/bakery/mi-panaderia/catalog"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#F97316]/30 text-[#F97316] hover:bg-[#F97316]/5 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Ver Portal
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="/bakery?tab=catalog"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors"
              >
                <Globe className="h-4 w-4" />
                Configurar
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-[#F97316]" />
              Produccion de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Plan de produccion disponible</p>
              <p className="text-sm mt-2">Modulo de Produccion para planificar horneados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-700">
                  Inventario vence pronto
                </p>
                <p className="text-sm text-red-600">
                  3 productos proximos a vencer
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-700"
              >
                Ver
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-700">
                  Pedidos sin procesar
                </p>
                <p className="text-sm text-yellow-600">
                  {metrics?.pendingOrders || 0} pedidos pendientes
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-200 text-yellow-700"
              >
                Procesar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-700">
                  Recordatorio de produccion
                </p>
                <p className="text-sm text-blue-600">
                  Revisar plan de manana
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
