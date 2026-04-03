"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Building,
  Clock,
  ArrowRight,
  Command,
} from "lucide-react";

// Mock data for global search
const searchableData = {
  cases: [
    { id: "1", type: "case", title: "Smith vs. Johnson Holdings", client: "Robert Smith", number: "CAS-2026-001", status: "in_progress", practiceArea: "Civil" },
    { id: "2", type: "case", title: "Estate of Williams", client: "Maria Williams", number: "CAS-2026-002", status: "open", practiceArea: "Probate" },
    { id: "3", type: "case", title: "TT Corp Contract Dispute", client: "TT Corporation Ltd.", number: "CAS-2026-003", status: "discovery", practiceArea: "Corporate" },
    { id: "4", type: "case", title: "Garcia - Divorce Proceedings", client: "Ana Garcia", number: "CAS-2026-004", status: "pending", practiceArea: "Family" },
    { id: "5", type: "case", title: "R. Singh - Criminal Defense", client: "Rajesh Singh", number: "CAS-2026-005", status: "in_progress", practiceArea: "Criminal" },
  ],
  clients: [
    { id: "1", type: "client", name: "Robert Smith", email: "robert.smith@email.com", phone: "+1 868-689-1234", clientType: "individual", cases: 1 },
    { id: "2", type: "client", name: "Maria Williams", email: "m.williams@email.com", phone: "+1 868-345-6789", clientType: "individual", cases: 1 },
    { id: "3", type: "client", name: "TT Corporation Ltd.", email: "legal@ttcorp.com", phone: "+1 868-623-4567", clientType: "company", cases: 1 },
    { id: "4", type: "client", name: "Ana Garcia", email: "ana.garcia@email.com", phone: "+1 868-789-0123", clientType: "individual", cases: 1 },
    { id: "5", type: "client", name: "Rajesh Singh", email: "r.singh@email.com", phone: "+1 868-456-7890", clientType: "individual", cases: 1 },
  ],
  documents: [
    { id: "1", type: "document", title: "Civil Claim - Smith vs Johnson", case: "Smith vs. Johnson Holdings", date: "2026-03-15", category: "Pleading" },
    { id: "2", type: "document", title: "Probate Application - Williams", case: "Estate of Williams", date: "2026-03-20", category: "Form" },
    { id: "3", type: "document", title: "Settlement Agreement Draft", case: "TT Corp Contract Dispute", date: "2026-03-25", category: "Contract" },
    { id: "4", type: "document", title: "Divorce Petition", case: "Garcia - Divorce Proceedings", date: "2026-03-01", category: "Pleading" },
  ],
  invoices: [
    { id: "1", type: "invoice", number: "INV-2026-001", client: "TT Corporation Ltd.", total: 94200, status: "partial", date: "2026-03-15" },
    { id: "2", type: "invoice", number: "INV-2026-002", client: "Robert Smith", total: 38675, status: "sent", date: "2026-03-20" },
    { id: "3", type: "invoice", number: "INV-2026-003", client: "Rajesh Singh", total: 49400, status: "paid", date: "2026-03-01" },
  ],
  events: [
    { id: "1", type: "event", title: "Hearing - Smith vs Johnson", date: "2026-03-28", time: "09:00", eventType: "court" },
    { id: "2", type: "event", title: "Client Meeting - TT Corp", date: "2026-03-29", time: "14:00", eventType: "meeting" },
    { id: "3", type: "event", title: "Filing Deadline - Garcia", date: "2026-03-30", time: "16:00", eventType: "deadline" },
  ],
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LawGlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    cases: typeof searchableData.cases;
    clients: typeof searchableData.clients;
    documents: typeof searchableData.documents;
    invoices: typeof searchableData.invoices;
    events: typeof searchableData.events;
  }>({
    cases: [],
    clients: [],
    documents: [],
    invoices: [],
    events: [],
  });

  // Normalize text for smart search
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s]/g, "") // Remove special chars
      .trim();
  };

  // Smart search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ cases: [], clients: [], documents: [], invoices: [], events: [] });
      return;
    }

    const normalizedQuery = normalizeText(searchQuery);
    const queryWords = normalizedQuery.split(/\s+/);

    const matchesSearch = (text: string) => {
      const normalizedText = normalizeText(text);
      // Match if any word from query is found (partial match)
      return queryWords.some(word => normalizedText.includes(word));
    };

    const searchedCases = searchableData.cases.filter((c) =>
      matchesSearch(c.title) ||
      matchesSearch(c.client) ||
      matchesSearch(c.number) ||
      matchesSearch(c.practiceArea)
    );

    const searchedClients = searchableData.clients.filter((c) =>
      matchesSearch(c.name) ||
      matchesSearch(c.email) ||
      matchesSearch(c.phone)
    );

    const searchedDocuments = searchableData.documents.filter((d) =>
      matchesSearch(d.title) ||
      matchesSearch(d.case) ||
      matchesSearch(d.category)
    );

    const searchedInvoices = searchableData.invoices.filter((i) =>
      matchesSearch(i.number) ||
      matchesSearch(i.client) ||
      matchesSearch(i.status)
    );

    const searchedEvents = searchableData.events.filter((e) =>
      matchesSearch(e.title) ||
      matchesSearch(e.eventType)
    );

    setResults({
      cases: searchedCases,
      clients: searchedClients,
      documents: searchedDocuments,
      invoices: searchedInvoices,
      events: searchedEvents,
    });
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const totalResults =
    results.cases.length +
    results.clients.length +
    results.documents.length +
    results.invoices.length +
    results.events.length;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-700",
      in_progress: "bg-green-100 text-green-700",
      discovery: "bg-purple-100 text-purple-700",
      pending: "bg-yellow-100 text-yellow-700",
      partial: "bg-orange-100 text-orange-700",
      sent: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Búsqueda Global</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar casos, clientes, documentos, facturas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-20 h-12 text-lg border-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">⌘</kbd>
              <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">K</kbd>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium">Búsqueda Global</p>
              <p className="text-sm">
                Escribe para buscar en toda la firma
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline">Casos</Badge>
                <Badge variant="outline">Clientes</Badge>
                <Badge variant="outline">Documentos</Badge>
                <Badge variant="outline">Facturas</Badge>
                <Badge variant="outline">Eventos</Badge>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">Sin resultados</p>
              <p className="text-sm">No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            <div className="p-2">
              {/* Cases */}
              {results.cases.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500">
                    <Briefcase className="h-4 w-4" />
                    Casos ({results.cases.length})
                  </div>
                  {results.cases.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#1E3A5F]/10 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-[#1E3A5F]" />
                        </div>
                        <div>
                          <p className="font-medium">{c.title}</p>
                          <p className="text-sm text-gray-500">
                            {c.number} • {c.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Clients */}
              {results.clients.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500">
                    <Users className="h-4 w-4" />
                    Clientes ({results.clients.length})
                  </div>
                  {results.clients.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#C4A35A]/10 flex items-center justify-center">
                          {c.clientType === "company" ? (
                            <Building className="h-4 w-4 text-[#C4A35A]" />
                          ) : (
                            <Users className="h-4 w-4 text-[#C4A35A]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{c.cases} caso(s)</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {results.documents.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500">
                    <FileText className="h-4 w-4" />
                    Documentos ({results.documents.length})
                  </div>
                  {results.documents.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{d.title}</p>
                          <p className="text-sm text-gray-500">{d.case}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{d.category}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {results.invoices.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    Facturas ({results.invoices.length})
                  </div>
                  {results.invoices.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{i.number}</p>
                          <p className="text-sm text-gray-500">{i.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">TT${i.total.toLocaleString()}</span>
                        <Badge className={getStatusColor(i.status)}>{i.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Eventos ({results.events.length})
                  </div>
                  {results.events.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{e.title}</p>
                          <p className="text-sm text-gray-500">{e.date} • {e.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{e.eventType}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white rounded border mr-1">↵</kbd>
              Seleccionar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white rounded border mr-1">↑↓</kbd>
              Navegar
            </span>
          </div>
          <span>{totalResults} resultado{totalResults !== 1 ? "s" : ""}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
