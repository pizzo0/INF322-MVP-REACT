import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, Inbox } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/usm/app-shell";
import { TicketRow } from "@/components/usm/ticket-card";
import { TicketDetailDialog } from "@/components/usm/ticket-detail-dialog";
import { useSession, useTickets } from "@/lib/usm/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Página Principal | USM Denuncia" },
      {
        name: "description",
        content: "Crea un ticket y revisa el estado de tus incidencias y requerimientos.",
      },
      { property: "og:title", content: "Página Principal" },
      {
        property: "og:description",
        content: "Crea un ticket y revisa el estado de tus incidencias y requerimientos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <Home />
    </AppShell>
  ),
});

function Home() {
  const session = useSession();
  const tickets = useTickets();
  const [open, setOpen] = useState<string | null>(null);
  const mine = tickets.filter((t) => t.ownerEmail === session?.email);
  const active = mine.filter((t) => t.status === "asignada").length;
  const answered = mine.filter((t) => t.status === "resuelta").length;
  const rejected = mine.filter((t) => t.status === "rechazada").length;
  const closed = mine.filter((t) => t.status === "cerrada").length;
  const recent = [...mine].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);

  return (
    <>
      <section className="border-b bg-hero-gradient">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6">
          <p className="text-sm text-muted-foreground">Hola, {session?.name}</p>
          <h1 className="mt-1 max-w-2xl text-4xl font-semibold leading-[1.1] sm:text-[44px]">
            ¿Qué necesitas reportar hoy?
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              to="/tickets/nuevo"
              className="group relative overflow-hidden rounded-2xl bg-ink-gradient p-6 text-ink-foreground shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
              <div className="relative">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink-foreground/10">
                  <FilePlus2 className="size-5" />
                </span>
                <p className="mt-6 font-display text-2xl font-semibold">Crear ticket</p>
                <p className="mt-1 text-sm text-ink-foreground/70">
                  Reporta una incidencia o realiza un requerimiento en pocos pasos.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                  Comenzar{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
            <Link
              to="/tickets"
              className="group rounded-2xl border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Inbox className="size-5" />
              </span>
              <p className="mt-6 font-display text-2xl font-semibold">Mis tickets</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat value={active} label="Asignados" tone="text-status-assigned" />
                <Stat value={answered} label="Resueltos" tone="text-status-resolved" />
                <Stat value={rejected} label="Rechazados" tone="text-status-rejected" />
                <Stat value={closed} label="Cerrados" tone="text-status-closed" />
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Ver todos{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 w-full">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Actividad reciente</h2>
            <p className="text-sm text-muted-foreground">Tus tickets con cambios más recientes.</p>
          </div>
          <Link to="/tickets" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
            <p className="font-medium">Aún no has creado tickets</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando reportes un problema, podrás seguirlo desde aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {recent.map((t) => (
              <TicketRow key={t.id} ticket={t} onOpen={setOpen} />
            ))}
          </div>
        )}
      </section>

      <TicketDetailDialog ticketId={open} onClose={() => setOpen(null)} onOpenTicket={setOpen} />
    </>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2.5">
      <p className={`font-display text-2xl font-semibold tabular ${tone}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
