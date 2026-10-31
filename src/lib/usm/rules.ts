import { CONTACTS, getCategory, type Contact } from "./catalog";
import type {
  AppNotification,
  HistoryEntry,
  Person,
  Ticket,
  TicketDraft,
  TicketStatus,
  TicketType,
} from "./types";

export const MINUTE = 60_000;
/** Simulated workflow: assign after 5 min, resolve/reject 10 min later, close 5 min after that. */
export const ASSIGN_AFTER_MS = 5 * MINUTE;
export const RESOLVE_AFTER_MS = 10 * MINUTE;
export const CLOSE_AFTER_MS = 5 * MINUTE;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

let counter = 0;
export function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function ticketCode(year: number, seq: number): string {
  return `INC ${year}-${String(seq).padStart(4, "0")}`;
}

export function emptyDraft(): TicketDraft {
  return {
    type: null,
    categoryId: null,
    location: { campus: "", building: "", room: "" },
    title: "",
    description: "",
    onBehalfOf: "",
    attachments: [],
  };
}

export function draftFromTicket(t: Ticket): TicketDraft {
  return {
    type: t.type,
    categoryId: t.categoryId,
    location: { ...t.location },
    title: t.title,
    description: t.description,
    onBehalfOf: t.onBehalfOf,
    attachments: [...t.attachments],
  };
}

/**
 * Categories belong to a specific type, even when they share a name.
 * Switching type must always clear the chosen category.
 */
export function selectType(draft: TicketDraft, type: TicketType): TicketDraft {
  if (draft.type === type) return draft;
  return { ...draft, type, categoryId: null };
}

export function selectCategory(draft: TicketDraft, categoryId: string): TicketDraft {
  const category = getCategory(categoryId);
  if (!category || category.type !== draft.type) return draft;
  return { ...draft, categoryId };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export type DraftErrors = Partial<Record<"type" | "categoryId" | "campus" | "title" | "description" | "onBehalfOf", string>>;

export function validateDraft(d: TicketDraft): DraftErrors {
  const e: DraftErrors = {};
  if (!d.type) e.type = "Selecciona el tipo de problema.";
  if (!d.categoryId || getCategory(d.categoryId)?.type !== d.type) e.categoryId = "Selecciona una categoría.";
  if (!d.location.campus.trim()) e.campus = "El campus es obligatorio.";
  if (d.title.trim().length < 5) e.title = "El título debe tener al menos 5 caracteres.";
  if (d.description.trim().length < 10) e.description = "Describe el problema con al menos 10 caracteres.";
  if (d.onBehalfOf.trim() && !isValidEmail(d.onBehalfOf)) e.onBehalfOf = "Ingresa un correo válido.";
  return e;
}

export type EditScope = "completa" | "limitada" | "ninguna";

/**
 * Before assignment everything is editable. Once assigned (and until closed)
 * only title, description and attachments may change. Closed tickets are
 * re-opened instead of edited.
 */
export function editScope(t: Pick<Ticket, "status">): EditScope {
  if (t.status === "nueva") return "completa";
  if (t.status === "cerrada") return "ninguna";
  return "limitada";
}

export function canDelete(t: Pick<Ticket, "status">): boolean {
  return t.status === "nueva";
}

export function canCancel(t: Pick<Ticket, "status">): boolean {
  return t.status === "asignada" || t.status === "resuelta" || t.status === "rechazada";
}

export function canReopen(t: Pick<Ticket, "status" | "reopenedAs">): boolean {
  return t.status === "cerrada" && !t.reopenedAs;
}

export function canComment(t: Pick<Ticket, "status">): boolean {
  return t.status !== "cerrada";
}

/** Applies only the fields allowed by the ticket's current edit scope. */
export function applyDraft(t: Ticket, d: TicketDraft): TicketDraft {
  const scope = editScope(t);
  if (scope === "completa") return d;
  const base = draftFromTicket(t);
  if (scope === "limitada") {
    return { ...base, title: d.title, description: d.description, attachments: d.attachments };
  }
  return base;
}

function fmtLocation(l: TicketDraft["location"]): string {
  return [l.campus, l.building, l.room].filter(Boolean).join(" · ") || "—";
}

export function diffDraft(before: TicketDraft, after: TicketDraft, at: number): HistoryEntry[] {
  const out: HistoryEntry[] = [];
  const push = (field: string, from: string, to: string) => {
    if (from !== to) out.push({ id: uid("h"), at, field, from: from || "—", to: to || "—" });
  };
  push("Tipo de problema", typeLabel(before.type), typeLabel(after.type));
  push("Categoría", getCategory(before.categoryId)?.name ?? "", getCategory(after.categoryId)?.name ?? "");
  push("Ubicación", fmtLocation(before.location), fmtLocation(after.location));
  push("Título", before.title, after.title);
  push("Descripción", before.description, after.description);
  push("Notificar en nombre de", before.onBehalfOf, after.onBehalfOf);
  const names = (d: TicketDraft) => d.attachments.map((a) => a.name).join(", ");
  push("Archivos adjuntos", names(before), names(after));
  return out;
}

export function typeLabel(t: TicketType | null | undefined): string {
  if (t === "incidencia") return "Incidencia";
  if (t === "requerimiento") return "Requerimiento";
  return "";
}

export const STATUS_LABEL: Record<TicketStatus, string> = {
  nueva: "Nueva",
  asignada: "Asignada",
  resuelta: "Resuelta",
  rechazada: "Rechazada",
  cerrada: "Cerrada",
};

export const STATUS_ORDER: TicketStatus[] = ["nueva", "asignada", "resuelta", "rechazada", "cerrada"];

export function pickAssignee(t: Pick<Ticket, "categoryId" | "seq">): Contact {
  const team = getCategory(t.categoryId)?.team ?? "mesa";
  const pool = CONTACTS.filter((c) => c.team === team && !c.role.startsWith("Jefa") && !c.role.startsWith("Coordinadora"));
  const list = pool.length ? pool : CONTACTS;
  return list[t.seq % list.length] ?? CONTACTS[0]!;
}

/** Deterministic outcome: roughly one in four simulated tickets is rejected. */
export function simulatedOutcome(seq: number): "resuelta" | "rechazada" {
  return seq % 4 === 0 ? "rechazada" : "resuelta";
}

function asPerson(c: Contact): Person {
  return { name: c.name, email: c.email, role: c.role };
}

export interface AdvanceResult {
  ticket: Ticket;
  notifications: AppNotification[];
}

/** Moves a ticket through the simulated workflow according to elapsed time. */
export function advanceTicket(input: Ticket, now: number): AdvanceResult {
  let t = input;
  const notes: AppNotification[] = [];
  const notify = (at: number, title: string, body: string) =>
    notes.push({ id: uid("n"), ticketId: t.id, code: t.code, title, body, at, read: false });

  for (let guard = 0; guard < 4; guard++) {
    if (t.status === "nueva" && now >= t.createdAt + ASSIGN_AFTER_MS) {
      const at = t.createdAt + ASSIGN_AFTER_MS;
      const who = asPerson(pickAssignee(t));
      t = {
        ...t,
        status: "asignada",
        assignee: who,
        assignedAt: at,
        updatedAt: at,
        timeline: [...t.timeline, { id: uid("e"), kind: "asignada", at, description: `Asignado a ${who.name}.` }],
        comments: [
          ...t.comments,
          {
            id: uid("c"),
            at: at + 1000,
            author: who,
            fromStaff: true,
            body: `Hola, he tomado tu ${t.type === "incidencia" ? "incidencia" : "solicitud"}. Estoy revisando la información y te mantendré al tanto por este medio.`,
          },
        ],
      };
      notify(at, "Ticket asignado", `${who.name} está a cargo de “${t.title}”.`);
      notify(at + 1000, "Nuevo comentario", `${who.name} comentó en tu ticket.`);
      continue;
    }
    if (t.status === "asignada" && t.assignedAt && now >= t.assignedAt + RESOLVE_AFTER_MS) {
      const at = t.assignedAt + RESOLVE_AFTER_MS;
      const outcome = simulatedOutcome(t.seq);
      const by = t.assignee!;
      const summary =
        outcome === "resuelta"
          ? "Se revisó el caso y se aplicó la corrección correspondiente. Si el problema persiste, puedes reabrir el ticket una vez cerrado."
          : "La solicitud no corresponde a los servicios atendidos por esta área o no cuenta con la información necesaria. Puedes reabrir el ticket con más detalles.";
      t = {
        ...t,
        status: outcome,
        resolution: { outcome, summary, at, by },
        updatedAt: at,
        timeline: [
          ...t.timeline,
          {
            id: uid("e"),
            kind: outcome,
            at,
            description: outcome === "resuelta" ? "El responsable marcó el ticket como resuelto." : "El responsable rechazó el ticket.",
          },
        ],
      };
      notify(at, outcome === "resuelta" ? "Ticket resuelto" : "Ticket rechazado", `“${t.title}” fue ${outcome}.`);
      continue;
    }
    if ((t.status === "resuelta" || t.status === "rechazada") && t.resolution && now >= t.resolution.at + CLOSE_AFTER_MS) {
      const at = t.resolution.at + CLOSE_AFTER_MS;
      t = {
        ...t,
        status: "cerrada",
        closedAt: at,
        closedReason: "automatico",
        updatedAt: at,
        timeline: [...t.timeline, { id: uid("e"), kind: "cerrada", at, description: "El ticket se cerró automáticamente." }],
      };
      notify(at, "Ticket cerrado", `“${t.title}” fue cerrado. Puedes reabrirlo si lo necesitas.`);
      continue;
    }
    break;
  }
  return { ticket: t, notifications: notes };
}

/** Next simulated milestone for a ticket, if any. */
export function nextMilestone(t: Ticket): { label: string; at: number } | null {
  if (t.status === "nueva") return { label: "Asignación estimada", at: t.createdAt + ASSIGN_AFTER_MS };
  if (t.status === "asignada" && t.assignedAt) return { label: "Respuesta estimada", at: t.assignedAt + RESOLVE_AFTER_MS };
  if ((t.status === "resuelta" || t.status === "rechazada") && t.resolution)
    return { label: "Cierre automático", at: t.resolution.at + CLOSE_AFTER_MS };
  return null;
}
