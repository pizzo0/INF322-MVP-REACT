import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/usm/app-shell";
import { StatusBadge } from "@/components/usm/status-badge";
import { TicketWizard } from "@/components/usm/ticket-wizard";
import { canReopen, draftFromTicket, editScope } from "@/lib/usm/rules";
import { reopenTicket, updateTicket, useSession, useTicket } from "@/lib/usm/store";
import type { Ticket } from "@/lib/usm/types";

export const Route = createFileRoute("/tickets/$ticketId/editar")({
  head: () => ({
    meta: [
      { title: "Editar ticket · USM Denuncia" },
      { name: "description", content: "Modifica o reabre uno de tus tickets." },
      { property: "og:title", content: "Editar ticket · USM Denuncia" },
      { property: "og:description", content: "Modifica o reabre uno de tus tickets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell>
      <EditPage />
    </AppShell>
  ),
});

function EditPage() {
  const { ticketId } = Route.useParams();
  const ticket = useTicket(ticketId);

  if (!ticket) {
    return (
      <Centered title="Ticket no encontrado" text="Es posible que haya sido eliminado." />
    );
  }
  if (ticket.status === "cerrada" && !canReopen(ticket)) {
    return (
      <Centered
        title="Este ticket ya fue reabierto"
        text={`Puedes seguir el caso en ${ticket.reopenedAs?.code}.`}
      />
    );
  }
  return <EditForm key={ticket.id} ticket={ticket} />;
}

function EditForm({ ticket }: { ticket: Ticket }) {
  const session = useSession();
  const navigate = useNavigate();
  // Freeze the mode when the page opens so a background status change doesn't reshape the wizard.
  const [mode] = useState(() => (ticket.status === "cerrada" ? "reabrir" : "editar") as "reabrir" | "editar");
  const [limited] = useState(() => mode === "reabrir" || editScope(ticket) === "limitada");
  const [initial] = useState(() => draftFromTicket(ticket));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Link to="/tickets" search={{ ticket: ticket.id }} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Volver al ticket
      </Link>
      <PageHeader
        eyebrow={ticket.code}
        title={mode === "reabrir" ? "Reabrir ticket" : "Editar ticket"}
        description={
          mode === "reabrir"
            ? "Se creará un nuevo ticket vinculado al anterior para retomar el caso."
            : "Los cambios quedarán registrados en el historial de modificaciones."
        }
        actions={<StatusBadge status={ticket.status} className="text-sm" />}
      />
      <TicketWizard
        mode={mode}
        initial={initial}
        limited={limited}
        onCancel={() => navigate({ to: "/tickets", search: { ticket: ticket.id } })}
        onSubmit={(d) => {
          if (!session) return;
          if (mode === "reabrir") {
            const next = reopenTicket(session, ticket.id, d);
            if (!next) return toast.error("No fue posible reabrir el ticket.");
            toast.success(`Ticket reabierto como ${next.code}`);
            navigate({ to: "/tickets", search: { ticket: next.id } });
            return;
          }
          const r = updateTicket(ticket.id, d);
          if (!r.ok) {
            toast.error("El ticket ya no puede modificarse.");
          } else if (r.limited && !limited) {
            toast.warning("El ticket fue asignado mientras editabas", {
              description: "Solo se guardaron el título, la descripción y los archivos.",
            });
          } else {
            toast.success(r.changes ? "Cambios guardados" : "No hubo cambios");
          }
          navigate({ to: "/tickets", search: { ticket: ticket.id } });
        }}
      />
    </div>
  );
}

function Centered({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <Link to="/tickets" className={`${buttonVariants({ variant: "outline" })} mt-6`}>
        Ir a mis tickets
      </Link>
    </div>
  );
}
