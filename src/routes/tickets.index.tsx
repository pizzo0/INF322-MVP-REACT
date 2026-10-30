import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppShell, PageHeader } from "@/components/usm/app-shell";
import { TicketRow } from "@/components/usm/ticket-card";
import { TicketDetailDialog } from "@/components/usm/ticket-detail-dialog";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/usm/rules";
import { useSession, useTickets } from "@/lib/usm/store";
import type { TicketStatus, TicketType } from "@/lib/usm/types";
import { cn } from "@/lib/utils";

interface TicketsSearch {
  ticket?: string;
}

export const Route = createFileRoute("/tickets/")({
  validateSearch: (s: Record<string, unknown>): TicketsSearch => ({
    ticket: typeof s.ticket === "string" ? s.ticket : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Mis tickets · USM Denuncia" },
      { name: "description", content: "Revisa el estado, responsable y seguimiento de tus tickets." },
      { property: "og:title", content: "Mis tickets · USM Denuncia" },
      { property: "og:description", content: "Revisa el estado, responsable y seguimiento de tus tickets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <TicketsPage />
    </AppShell>
  ),
});

type Sort = "recientes" | "antiguos" | "actualizados" | "estado" | "titulo";

function TicketsPage() {
  const { ticket: openId } = Route.useSearch();
  const navigate = useNavigate({ from: "/tickets/" });
  const session = useSession();
  const all = useTickets();
  const mine = useMemo(() => all.filter((t) => t.ownerEmail === session?.email), [all, session]);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "todos">("todos");
  const [type, setType] = useState<TicketType | "todos">("todos");
  const [assignee, setAssignee] = useState<string>("todos");
  const [sort, setSort] = useState<Sort>("recientes");

  const assignees = useMemo(
    () => Array.from(new Set(mine.map((t) => t.assignee?.name).filter(Boolean) as string[])).sort(),
    [mine],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: mine.length };
    STATUS_ORDER.forEach((s) => (c[s] = mine.filter((t) => t.status === s).length));
    return c;
  }, [mine]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = mine.filter((t) => {
      if (status !== "todos" && t.status !== status) return false;
      if (type !== "todos" && t.type !== type) return false;
      if (assignee === "sin-asignar" && t.assignee) return false;
      if (assignee !== "todos" && assignee !== "sin-asignar" && t.assignee?.name !== assignee) return false;
      if (term && !`${t.title} ${t.code} ${t.assignee?.name ?? ""}`.toLowerCase().includes(term)) return false;
      return true;
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sort) {
        case "antiguos":
          return a.createdAt - b.createdAt;
        case "actualizados":
          return b.updatedAt - a.updatedAt;
        case "estado":
          return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.createdAt - a.createdAt;
        case "titulo":
          return a.title.localeCompare(b.title, "es");
        default:
          return b.createdAt - a.createdAt;
      }
    });
    return sorted;
  }, [mine, q, status, type, assignee, sort]);

  const filtersOn = q || status !== "todos" || type !== "todos" || assignee !== "todos";
  const open = (id: string | null) => navigate({ search: id ? { ticket: id } : {}, replace: !id });

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <PageHeader
        eyebrow="Tickets"
        title="Mis tickets"
        description="Revisa el estado de tus incidencias y requerimientos, quién está a cargo y su seguimiento."
        actions={
          <Link to="/tickets/nuevo" className={buttonVariants({ variant: "hero" })}>
            <FilePlus2 /> Crear ticket
          </Link>
        }
      />

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {(["todos", ...STATUS_ORDER] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              status === s ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "todos" ? "Todos" : STATUS_LABEL[s]}
            <span className={cn("text-xs tabular", status === s ? "text-primary-foreground/70" : "text-muted-foreground")}>{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-2 rounded-2xl border bg-card p-2 shadow-soft md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título, código o responsable" className="h-10 border-0 pl-9 shadow-none focus-visible:ring-0" />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as TicketType | "todos")}>
          <SelectTrigger className="h-10 md:w-44" aria-label="Filtrar por tipo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="incidencia">Incidencias</SelectItem>
            <SelectItem value="requerimiento">Requerimientos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="h-10 md:w-52" aria-label="Filtrar por responsable">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los responsables</SelectItem>
            <SelectItem value="sin-asignar">Sin asignar</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="h-10 md:w-48" aria-label="Ordenar">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recientes">Más recientes</SelectItem>
            <SelectItem value="antiguos">Más antiguos</SelectItem>
            <SelectItem value="actualizados">Última actualización</SelectItem>
            <SelectItem value="estado">Por estado</SelectItem>
            <SelectItem value="titulo">Título (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {list.length} {list.length === 1 ? "ticket" : "tickets"}
        </span>
        {filtersOn && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              setStatus("todos");
              setType("todos");
              setAssignee("todos");
            }}
          >
            <X /> Limpiar filtros
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
          <p className="font-medium">{mine.length ? "No hay tickets que coincidan" : "Aún no has creado tickets"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {mine.length ? "Prueba con otros filtros o términos de búsqueda." : "Crea tu primer ticket para comenzar a darle seguimiento."}
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {list.map((t) => (
            <TicketRow key={t.id} ticket={t} onOpen={open} />
          ))}
        </div>
      )}

      <TicketDetailDialog ticketId={openId ?? null} onClose={() => open(null)} onOpenTicket={(id) => open(id)} />
    </div>
  );
}
