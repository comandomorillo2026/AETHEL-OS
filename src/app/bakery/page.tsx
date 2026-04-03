"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BakeryDashboard } from "@/components/bakery/bakery-dashboard";
import { BakeryProducts } from "@/components/bakery/bakery-products";
import { BakeryOrders } from "@/components/bakery/bakery-orders";
import { BakeryCustomers } from "@/components/bakery/bakery-customers";
import { BakeryProduction } from "@/components/bakery/bakery-production";
import { BakeryInvoices } from "@/components/bakery/bakery-invoices";
import { BakeryReports } from "@/components/bakery/bakery-reports";
import { BakerySettings } from "@/components/bakery/bakery-settings";
import { BakeryPOS } from "@/components/bakery/bakery-pos";
import { BakeryCatalogSettings } from "@/components/bakery/bakery-catalog-settings";
import { CatalogAnalytics } from "@/components/bakery/bakery-catalog-analytics";
import { BakeryRoute } from "@/components/auth/protected-layout";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "pos", label: "Punto de Venta", icon: "ShoppingCart" },
  { id: "products", label: "Productos", icon: "Package" },
  { id: "orders", label: "Pedidos", icon: "ClipboardList" },
  { id: "production", label: "Produccion", icon: "ChefHat" },
  { id: "customers", label: "Clientes", icon: "Users" },
  { id: "invoices", label: "Facturas", icon: "FileText" },
  { id: "reports", label: "Reportes", icon: "BarChart3" },
  { id: "catalog", label: "Portal Productos", icon: "Store" },
  { id: "analytics", label: "Analytics", icon: "TrendingUp" },
  { id: "settings", label: "Configuracion", icon: "Settings" },
];

function BakeryPageContent() {
  const searchParams = useSearchParams();
  const [activeModule, setActiveModule] = useState("dashboard");

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && menuItems.some(item => item.id === tab)) {
      setActiveModule(tab);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return <BakeryDashboard />;
      case "pos":
        return <BakeryPOS tenantId="demo-tenant" />;
      case "products":
        return <BakeryProducts />;
      case "orders":
        return <BakeryOrders />;
      case "production":
        return <BakeryProduction />;
      case "customers":
        return <BakeryCustomers />;
      case "invoices":
        return <BakeryInvoices />;
      case "reports":
        return <BakeryReports />;
      case "catalog":
        return <BakeryCatalogSettings />;
      case "analytics":
        return <CatalogAnalytics />;
      case "settings":
        return <BakerySettings />;
      default:
        return <BakeryDashboard />;
    }
  };

  return (
    <DashboardLayout
      title="NexusOS Bakery"
      subtitle="Sistema de Gestion para Panaderias"
      menuItems={menuItems}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      primaryColor="#F97316"
      secondaryColor="#FBBF24"
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default function BakeryPage() {
  return (
    <BakeryRoute>
      <BakeryPageContent />
    </BakeryRoute>
  );
}
