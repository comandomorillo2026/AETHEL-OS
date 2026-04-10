'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Bell,
  Plus,
  Search,
  Megaphone,
  Vote,
  AlertCircle,
  Info,
  Calendar,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AuroraBackground, CondoHeader, StatCard, StatusBadge, PageLoader, EmptyState } from '@/components/condo';

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || 'default';

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [propertyId]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#050410]">
      <AuroraBackground />
      
      <CondoHeader 
        title="Comunicaciones" 
        subtitle="Anuncios y votaciones"
        rightContent={
          <div className="flex gap-2">
            <Button variant="outline" className="border-[rgba(167,139,250,0.2)] text-[#9D7BEA]">
              <Vote className="w-4 h-4 mr-2" />
              Nueva Votación
            </Button>
            <Button className="btn-nexus">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anuncio
            </Button>
          </div>
        }
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Anuncios" value={0} icon={Megaphone} color="violet" />
          <StatCard title="Urgentes" value={0} icon={AlertCircle} color="red" />
          <StatCard title="Votaciones Activas" value={0} icon={Vote} color="cyan" />
          <StatCard title="Próximas" value={0} icon={Clock} color="gold" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#0A0820] border border-[rgba(167,139,250,0.2)] mb-6">
            <TabsTrigger value="announcements">
              <Megaphone className="w-4 h-4 mr-2" />
              Anuncios
            </TabsTrigger>
            <TabsTrigger value="votes">
              <Vote className="w-4 h-4 mr-2" />
              Votaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D7BEA]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar anuncios..."
                className="pl-10 bg-[#0A0820] border-[rgba(167,139,250,0.2)] text-[#EDE9FE]"
              />
            </div>
            <EmptyState
              icon={Megaphone}
              title="No hay anuncios"
              description="Crea un nuevo anuncio para comunicarte con los residentes"
            />
          </TabsContent>

          <TabsContent value="votes">
            <EmptyState
              icon={Vote}
              title="No hay votaciones"
              description="Crea una nueva votación para obtener la opinión de los residentes"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CommunicationsContent />
    </Suspense>
  );
}
