import { ArrowUpRight, UserRound } from "lucide-react";

import { ReopenedBadge, StatusBadge } from "@/components/usm/status-badge";
import { getCategory } from "@/lib/usm/catalog";
import { timeAgo } from "@/lib/usm/format";
import { typeLabel } from "@/lib/usm/rules";
import type { Ticket } from "@/lib/usm/types";
import { cn } from "@/lib/utils";

export function TicketRow({
  ticket,
  onOpen,
  className,
}: {
  ticket: Ticket;
  onOpen: (id: string) => void;
  className?: string;
}) {
  const category = getCategory(ticket.categoryId);
  return (
    <button
      type="button"
      onClick={() => onOpen(ticket.id)}
      className={cn(
        "group grid w-full cursor-pointer grid-cols-1 gap-3 rounded-xl border bg-card p-4 text-left shadow-soft transition-all duration-200 hover:-translate-y-px hover:border-ring/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium text-muted-foreground">{ticket.code}</span>
          <StatusBadge status={ticket.status} />
          {ticket.reopenedFrom && <ReopenedBadge />}
        </div>
        <p className="mt-1.5 truncate text-[15px] font-medium text-foreground">{ticket.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {typeLabel(ticket.type)} · {category?.name ?? "Sin categoría"} · actualizado{" "}
          {timeAgo(ticket.updatedAt)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-[11px] font-semibold",
              ticket.assignee
                ? "bg-accent text-accent-foreground"
                : "border border-dashed text-muted-foreground",
            )}
          >
            {ticket.assignee ? (
              ticket.assignee.name
                .split(" ")
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
            ) : (
              <UserRound className="size-3.5" />
            )}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] text-muted-foreground">Responsable</span>
            <span className={cn("text-sm", !ticket.assignee && "text-muted-foreground")}>
              {ticket.assignee?.name ?? "Sin asignar"}
            </span>
          </span>
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </button>
  );
}
