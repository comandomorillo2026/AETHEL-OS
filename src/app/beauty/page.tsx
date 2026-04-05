"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BeautyDashboard } from "@/components/beauty/beauty-dashboard";
import { BeautyAppointments } from "@/components/beauty/beauty-appointments";
import { BeautyClients } from "@/components/beauty/beauty-clients";
import { BeautyStaff } from "@/components/beauty/beauty-staff";
import { BeautyServices } from "@/components/beauty/beauty-services";
import { BeautyPOS } from "@/components/beauty/beauty-pos";
import { BeautyProducts } from "@/components/beauty/beauty-products";
import { BeautyFinances } from "@/components/beauty/beauty-finances";
import { BeautyReports } from "@/components/beauty/beauty-reports";
import { BeautySettings } from "@/components/beauty/beauty-settings";
import { BeautyAccounting } from "@/components/beauty/beauty-accounting";
import { BeautyBranches } from "@/components/beauty/beauty-branches";
import { BeautyRoute } from "@/components/auth/protected-layout";
import { useAppTranslation } from "@/hooks/use-app-translation";

// Beauty-specific translations
const beautyTranslations = {
  es: {
    title: "AETHEL OS Beauty",
    subtitle: "Sistema de Gestión para Salones",
  },
  en: {
    title: "AETHEL OS Beauty",
    subtitle: "Salon Management System",
  },
};

function BeautyPageContent() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const { getSection, language } = useAppTranslation();
  const t = getSection("navigation");
  const beautyT = beautyTranslations[language];

  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: "LayoutDashboard" },
    { id: "branches", label: t.branches, icon: "Building2" },
    { id: "appointments", label: t.appointments, icon: "Calendar" },
    { id: "pos", label: t.pos, icon: "ShoppingCart" },
    { id: "clients", label: t.clients, icon: "Users" },
    { id: "staff", label: t.staff, icon: "UserCircle" },
    { id: "services", label: t.services, icon: "Scissors" },
    { id: "products", label: t.products, icon: "Package" },
    { id: "finances", label: t.finances, icon: "DollarSign" },
    { id: "accounting", label: t.accounting, icon: "BookOpen" },
    { id: "reports", label: t.reports, icon: "BarChart3" },
    { id: "settings", label: t.settings, icon: "Settings" },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return <BeautyDashboard />;
      case "branches":
        return <BeautyBranches />;
      case "appointments":
        return <BeautyAppointments />;
      case "pos":
        return <BeautyPOS />;
      case "clients":
        return <BeautyClients />;
      case "staff":
        return <BeautyStaff />;
      case "services":
        return <BeautyServices />;
      case "products":
        return <BeautyProducts />;
      case "finances":
        return <BeautyFinances />;
      case "accounting":
        return <BeautyAccounting />;
      case "reports":
        return <BeautyReports />;
      case "settings":
        return <BeautySettings />;
      default:
        return <BeautyDashboard />;
    }
  };

  return (
    <DashboardLayout
      title={beautyT.title}
      subtitle={beautyT.subtitle}
      menuItems={menuItems}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      primaryColor="#EC4899"
      secondaryColor="#8B5CF6"
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default function BeautyPage() {
  return (
    <BeautyRoute>
      <BeautyPageContent />
    </BeautyRoute>
  );
}
