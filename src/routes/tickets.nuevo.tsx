import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Clock3 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/usm/app-shell";
import { TicketWizard } from "@/components/usm/ticket-wizard";
import { emptyDraft } from "@/lib/usm/rules";
import { createTicket, useSession } from "@/lib/usm/store";

export const Route = createFileRoute("/tickets/nuevo")({
  head: () => ({
    meta: [
      { title: "Crear ticket · USM Denuncia" },
      { name: "description", content: "Reporta una incidencia o realiza un requerimiento paso a paso." },
      { property: "og:title", content: "Crear ticket · USM Denuncia" },
      { property: "og:description", content: "Reporta una incidencia o realiza un requerimiento paso a paso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <NewTicket />
    </AppShell>
  ),
});

function NewTicket() {
  const session = useSession();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Link to="/tickets" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Mis tickets
      </Link>
      <PageHeader
        eyebrow="Nuevo ticket"
        title="Crear ticket"
        description="Completa los pasos para reportar tu caso. Puedes volver atrás en cualquier momento."
      />
      <div className="mb-8 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-soft">
        <Clock3 className="size-4 shrink-0 text-primary" />
        <span className="text-muted-foreground">
          Una vez creado, tu ticket será asignado a un responsable en un mínimo de 5 minutos.
        </span>
      </div>
      <TicketWizard
        mode="crear"
        initial={emptyDraft()}
        limited={false}
        onCancel={() => navigate({ to: "/tickets" })}
        onSubmit={(d) => {
          if (!session) return;
          const t = createTicket(session, d);
          toast.success(`Ticket ${t.code} creado`, { description: "Será asignado en un mínimo de 5 minutos." });
          navigate({ to: "/tickets", search: { ticket: t.id } });
        }}
      />
    </div>
  );
}
