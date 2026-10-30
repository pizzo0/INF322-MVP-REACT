import { cva } from "class-variance-authority";

import { STATUS_LABEL } from "@/lib/usm/rules";
import type { TicketStatus } from "@/lib/usm/types";
import { cn } from "@/lib/utils";

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      status: {
        nueva: "bg-status-new-soft text-status-new",
        asignada: "bg-status-assigned-soft text-status-assigned",
        resuelta: "bg-status-resolved-soft text-status-resolved",
        rechazada: "bg-status-rejected-soft text-status-rejected",
        cerrada: "bg-status-closed-soft text-status-closed",
        reabierta: "bg-status-reopened-soft text-status-reopened",
      },
    },
  },
);

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
  const live = status === "nueva" || status === "asignada";
  return (
    <span className={cn(statusVariants({ status }), className)}>
      <span className={cn("size-1.5 rounded-full bg-current", live && "animate-pulse-dot")} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ReopenedBadge({ className }: { className?: string }) {
  return <span className={cn(statusVariants({ status: "reabierta" }), className)}>Reabierto</span>;
}

export const statusDotVariants = cva("size-2.5 rounded-full ring-4", {
  variants: {
    kind: {
      creada: "bg-status-new ring-status-new-soft",
      reabierta: "bg-status-reopened ring-status-reopened-soft",
      asignada: "bg-status-assigned ring-status-assigned-soft",
      resuelta: "bg-status-resolved ring-status-resolved-soft",
      rechazada: "bg-status-rejected ring-status-rejected-soft",
      cerrada: "bg-status-closed ring-status-closed-soft",
      cancelada: "bg-status-closed ring-status-closed-soft",
      pendiente: "bg-border ring-muted",
    },
  },
});
