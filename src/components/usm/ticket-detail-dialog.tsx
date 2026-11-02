import { Link } from "@tanstack/react-router";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  MapPin,
  MessageSquare,
  Pencil,
  RotateCcw,
  Send,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ReopenedBadge, StatusBadge, statusDotVariants } from "@/components/usm/status-badge";
import { getCategory } from "@/lib/usm/catalog";
import { bytes, countdown, dateTime, initials, timeAgo, useNow } from "@/lib/usm/format";
import {
  canCancel,
  canComment,
  canDelete,
  canReopen,
  editScope,
  nextMilestone,
  typeLabel,
} from "@/lib/usm/rules";
import { addComment, cancelTicket, deleteTicket, useSession, useTicket } from "@/lib/usm/store";
import type { Ticket, TimelineKind } from "@/lib/usm/types";
import { cn } from "@/lib/utils";

const INCIDENT_LABEL: Record<TimelineKind, string> = {
  creada: "Nueva incidencia",
  reabierta: "Ticket reabierto",
  asignada: "Incidencia asignada",
  resuelta: "Resuelta",
  rechazada: "Rechazada",
  cerrada: "Cerrada",
  cancelada: "Cerrada por el usuario",
};

const REQUEST_LABEL: Record<TimelineKind, string> = {
  creada: "Nuevo requerimiento",
  reabierta: "Ticket reabierto",
  asignada: "Requerimiento asignado",
  resuelta: "Resuelto",
  rechazada: "Rechazado",
  cerrada: "Cerrado",
  cancelada: "Cerrado por el usuario",
};

function kindLabels(t: Pick<Ticket, "type">): Record<TimelineKind, string> {
  return t.type === "requerimiento" ? REQUEST_LABEL : INCIDENT_LABEL;
}

export function TicketDetailDialog({
  ticketId,
  onClose,
  onOpenTicket,
}: {
  ticketId: string | null;
  onClose: () => void;
  onOpenTicket: (id: string) => void;
}) {
  const ticket = useTicket(ticketId ?? undefined);
  return (
    <Dialog open={!!ticketId && !!ticket} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl gap-0 overflow-y-auto p-0 sm:rounded-2xl">
        {ticket && <DetailBody ticket={ticket} onClose={onClose} onOpenTicket={onOpenTicket} />}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({
  ticket,
  onClose,
  onOpenTicket,
}: {
  ticket: Ticket;
  onClose: () => void;
  onOpenTicket: (id: string) => void;
}) {
  const now = useNow(1000);
  const category = getCategory(ticket.categoryId);
  const milestone = nextMilestone(ticket);
  const scope = editScope(ticket);

  return (
    <>
      <div className="border-b bg-hero-gradient px-6 pb-5 pt-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <span className="rounded-md bg-card px-2 py-0.5 font-mono text-xs font-medium shadow-soft">
            {ticket.code}
          </span>
          <StatusBadge status={ticket.status} />
          {ticket.reopenedFrom && <ReopenedBadge />}
        </div>
        <DialogTitle className="mt-3 font-display text-2xl font-semibold leading-tight">
          {ticket.title}
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm">
          {typeLabel(ticket.type)} · {category?.name} · creado {timeAgo(ticket.createdAt)}
        </DialogDescription>

        {milestone && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-sm">
            <Clock3 className="size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">
              {ticket.status === "nueva"
                ? "Tu ticket será asignado en un mínimo de 5 minutos. Mientras tanto, puedes editar todos sus datos."
                : `${milestone.label}:`}
            </span>
            <span className="ml-auto shrink-0 font-mono text-xs font-medium tabular">
              {countdown(milestone.at - now)}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_260px]">
        <div className="min-w-0 px-6 py-5 sm:px-8">
          <Tabs defaultValue="resumen">
            <TabsList className="mb-5 w-full justify-start overflow-x-auto">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              <TabsTrigger value="comentarios">
                Comentarios{" "}
                <span className="ml-1.5 text-xs text-muted-foreground tabular">
                  {ticket.comments.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="historial">
                Historial{" "}
                <span className="ml-1.5 text-xs text-muted-foreground tabular">
                  {ticket.history.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-6">
              {ticket.reopenedFrom && (
                <LinkedTicket
                  label="Reabierto a partir de"
                  code={ticket.reopenedFrom.code}
                  onClick={() => onOpenTicket(ticket.reopenedFrom!.id)}
                />
              )}
              {ticket.reopenedAs && (
                <LinkedTicket
                  label="Este ticket fue reabierto como"
                  code={ticket.reopenedAs.code}
                  onClick={() => onOpenTicket(ticket.reopenedAs!.id)}
                />
              )}
              <section>
                <SectionTitle>Descripción</SectionTitle>
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                  {ticket.description}
                </p>
              </section>
              <section>
                <SectionTitle>Archivos adjuntos</SectionTitle>
                {ticket.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin archivos adjuntos.</p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {ticket.attachments.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 rounded-lg border bg-card p-2"
                      >
                        {a.dataUrl ? (
                          <img
                            src={a.dataUrl}
                            alt={a.name}
                            className="size-10 rounded-md object-cover"
                          />
                        ) : (
                          <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                            <FileText className="size-4 text-muted-foreground" />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm">{a.name}</span>
                          <span className="text-xs text-muted-foreground">{bytes(a.size)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <ResolutionBox ticket={ticket} />
            </TabsContent>

            <TabsContent value="seguimiento">
              <Timeline ticket={ticket} />
            </TabsContent>

            <TabsContent value="comentarios">
              <Comments ticket={ticket} />
            </TabsContent>

            <TabsContent value="historial">
              {ticket.history.length === 0 ? (
                <EmptyNote
                  icon={<History className="size-4" />}
                  text="No se han realizado modificaciones."
                />
              ) : (
                <ul className="space-y-3">
                  {ticket.history.map((h) => (
                    <li key={h.id} className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{h.field}</span>
                        <span className="text-xs text-muted-foreground">{dateTime(h.at)}</span>
                      </div>
                      <div className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
                        <p className="line-clamp-3 rounded-md bg-status-rejected-soft/60 px-2 py-1 text-muted-foreground line-through decoration-status-rejected/40">
                          {h.from}
                        </p>
                        <p className="line-clamp-3 rounded-md bg-status-resolved-soft/70 px-2 py-1">
                          {h.to}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-5 border-t bg-muted/40 px-6 py-5 text-sm md:border-l md:border-t-0">
          <Meta label="Responsable">
            {ticket.assignee ? (
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {initials(ticket.assignee.name)}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-medium">{ticket.assignee.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {ticket.assignee.role}
                  </span>
                  <a
                    href={`mailto:${ticket.assignee.email}`}
                    className="block truncate text-xs text-primary hover:underline"
                  >
                    {ticket.assignee.email}
                  </a>
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="size-4" /> Sin asignar
              </span>
            )}
          </Meta>
          <Meta label="Estado actual">
            <StatusBadge status={ticket.status} />
          </Meta>
          <Meta label="Ubicación">
            <span className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {ticket.location.campus}
                {(ticket.location.building || ticket.location.room) && (
                  <span className="block text-xs text-muted-foreground">
                    {[ticket.location.building, ticket.location.room].filter(Boolean).join(" · ")}
                  </span>
                )}
              </span>
            </span>
          </Meta>
          {ticket.onBehalfOf && <Meta label="En nombre de">{ticket.onBehalfOf}</Meta>}
          <Meta label="Creado">{dateTime(ticket.createdAt)}</Meta>
          <Meta label="Última actualización">{dateTime(ticket.updatedAt)}</Meta>

          <div className="space-y-2 border-t pt-5">
            {scope !== "ninguna" && (
              <Link
                to="/tickets/$ticketId/editar"
                params={{ ticketId: ticket.id }}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                <Pencil /> Editar ticket
              </Link>
            )}
            {scope === "limitada" && (
              <p className="text-xs text-muted-foreground">
                Al estar asignado, solo puedes modificar título, descripción y archivos.
              </p>
            )}
            {canReopen(ticket) && (
              <Link
                to="/tickets/$ticketId/editar"
                params={{ ticketId: ticket.id }}
                className={cn(buttonVariants({ variant: "hero" }), "w-full")}
              >
                <RotateCcw /> Reabrir ticket
              </Link>
            )}
            {canDelete(ticket) && (
              <ConfirmAction
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-status-rejected-soft hover:text-destructive"
                  >
                    <Trash2 /> Eliminar ticket
                  </Button>
                }
                title="¿Eliminar este ticket?"
                description="El ticket se eliminará de forma permanente. Esta acción no se puede deshacer."
                confirm="Eliminar"
                onConfirm={() => {
                  if (deleteTicket(ticket.id)) {
                    toast.success("Ticket eliminado");
                    onClose();
                  } else toast.error("El ticket ya fue asignado y no puede eliminarse.");
                }}
              />
            )}
            {canCancel(ticket) && (
              <ConfirmAction
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:bg-status-rejected-soft hover:text-destructive"
                  >
                    <Ban /> Cancelar y cerrar
                  </Button>
                }
                title="¿Cancelar este ticket?"
                description="El ticket ya fue asignado, por lo que no puede eliminarse. Se cerrará y quedará registrado en tu historial. Podrás reabrirlo más adelante."
                confirm="Cancelar ticket"
                onConfirm={() => {
                  cancelTicket(ticket.id);
                  toast.success("Ticket cancelado y cerrado");
                }}
              />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </h3>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function EmptyNote({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
      {icon}
      {text}
    </div>
  );
}

function LinkedTicket({
  label,
  code,
  onClick,
}: {
  label: string;
  code: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-status-reopened/30 bg-status-reopened-soft px-3 py-2.5 text-left text-sm transition-colors hover:border-status-reopened/60"
    >
      <RotateCcw className="size-4 text-status-reopened" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-status-reopened">{code}</span>
      <span className="ml-auto text-xs text-status-reopened">Ver ticket</span>
    </button>
  );
}

function ResolutionBox({ ticket }: { ticket: Ticket }) {
  const r = ticket.resolution;
  if (!r && ticket.closedReason !== "cancelado") return null;
  if (!r) {
    return (
      <section className="rounded-xl border bg-status-closed-soft p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Ban className="size-4" /> Cancelado por el usuario
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cerrado el {dateTime(ticket.closedAt!)}.
        </p>
      </section>
    );
  }
  const ok = r.outcome === "resuelta";
  return (
    <section
      className={cn(
        "rounded-xl border p-4",
        ok
          ? "border-status-resolved/25 bg-status-resolved-soft"
          : "border-status-rejected/25 bg-status-rejected-soft",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          ok ? "text-status-resolved" : "text-status-rejected",
        )}
      >
        {ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
        {ok ? "Información de la resolución" : "Motivo del rechazo"}
      </div>
      <p className="mt-2 text-sm leading-relaxed">{r.summary}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {r.by.name} · {dateTime(r.at)}
      </p>
    </section>
  );
}

function Timeline({ ticket }: { ticket: Ticket }) {
  const done = ticket.timeline;
  const labels = kindLabels(ticket);
  const isRequest = ticket.type === "requerimiento";
  const kinds = new Set(done.map((e) => e.kind));
  const pending: { kind: TimelineKind; label: string }[] = [];
  if (ticket.status !== "cerrada") {
    if (!kinds.has("asignada")) pending.push({ kind: "asignada", label: labels.asignada });
    if (!kinds.has("resuelta") && !kinds.has("rechazada"))
      pending.push({
        kind: "resuelta",
        label: isRequest ? "Resuelto o rechazado" : "Resuelta o rechazada",
      });
    pending.push({ kind: "cerrada", label: labels.cerrada });
  }
  return (
    <ol className="relative ml-1">
      {done.map((e, i) => (
        <li key={e.id} className="relative flex gap-4 pb-6">
          {(i < done.length - 1 || pending.length > 0) && (
            <span className="absolute left-[4px] top-4 h-full w-px bg-border" />
          )}
          <span className={cn(statusDotVariants({ kind: e.kind }), "relative mt-1.5 shrink-0")} />
          <div>
            <p className="text-sm font-medium">{labels[e.kind]}</p>
            {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3" /> {dateTime(e.at)}
            </p>
          </div>
        </li>
      ))}
      {pending.map((p, i) => (
        <li key={p.label} className="relative flex gap-4 pb-6 last:pb-0">
          {i < pending.length - 1 && (
            <span className="absolute left-[4px] top-4 h-full w-px border-l border-dashed" />
          )}
          <span
            className={cn(statusDotVariants({ kind: "pendiente" }), "relative mt-1.5 shrink-0")}
          />
          <p className="text-sm text-muted-foreground">{p.label}</p>
        </li>
      ))}
    </ol>
  );
}

function Comments({ ticket }: { ticket: Ticket }) {
  const session = useSession();
  const [body, setBody] = useState("");
  const allowed = canComment(ticket);
  return (
    <div className="space-y-4">
      {ticket.comments.length === 0 ? (
        <EmptyNote
          icon={<MessageSquare className="size-4" />}
          text="Aún no hay comentarios ni actualizaciones."
        />
      ) : (
        <ul className="space-y-3">
          {ticket.comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  c.fromStaff
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground ring-1 ring-border",
                )}
              >
                {c.fromStaff ? initials(c.author.name) : <UserRound className="size-4" />}
              </span>
              <div
                className={cn(
                  "min-w-0 flex-1 rounded-xl border px-3.5 py-2.5",
                  c.fromStaff ? "bg-card" : "bg-accent/40",
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-medium">{c.author.name}</span>
                  {c.fromStaff && <span className="text-xs text-primary">Responsable</span>}
                  <span className="ml-auto text-xs text-muted-foreground">{timeAgo(c.at)}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {allowed && session ? (
        <form
          className="rounded-xl border bg-card p-2 shadow-soft focus-within:border-ring/50"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim()) return;
            addComment(ticket.id, { name: session.name, email: session.email }, body);
            setBody("");
          }}
        >
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe un comentario para el responsable…"
            className="min-h-[72px] resize-none border-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!body.trim()}>
              <Send /> Comentar
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground">
          Los tickets cerrados no admiten nuevos comentarios.
        </p>
      )}
    </div>
  );
}

function ConfirmAction({
  trigger,
  title,
  description,
  confirm,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirm: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={onConfirm}
          >
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
