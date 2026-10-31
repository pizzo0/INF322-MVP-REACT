export type TicketType = "requerimiento" | "incidencia";

export type TicketStatus = "nueva" | "asignada" | "resuelta" | "rechazada" | "cerrada";

export type TimelineKind =
  | "creada"
  | "reabierta"
  | "asignada"
  | "resuelta"
  | "rechazada"
  | "cerrada"
  | "cancelada";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mime: string;
  /** Only kept for small images so they can be previewed. */
  dataUrl?: string;
}

export interface TicketLocation {
  campus: string;
  building: string;
  room: string;
}

export interface Person {
  name: string;
  email: string;
  role?: string;
}

export interface TimelineEvent {
  id: string;
  kind: TimelineKind;
  at: number;
  description?: string;
}

export interface Comment {
  id: string;
  at: number;
  author: Person;
  fromStaff: boolean;
  body: string;
}

export interface HistoryEntry {
  id: string;
  at: number;
  field: string;
  from: string;
  to: string;
}

export interface Resolution {
  outcome: "resuelta" | "rechazada";
  summary: string;
  at: number;
  by: Person;
}

export interface TicketRef {
  id: string;
  code: string;
}

export interface Ticket {
  id: string;
  seq: number;
  year: number;
  code: string;
  ownerEmail: string;
  type: TicketType;
  categoryId: string;
  location: TicketLocation;
  title: string;
  description: string;
  onBehalfOf: string;
  attachments: Attachment[];
  status: TicketStatus;
  createdAt: number;
  updatedAt: number;
  assignee?: Person;
  assignedAt?: number;
  resolution?: Resolution;
  closedAt?: number;
  closedReason?: "automatico" | "cancelado";
  reopenedFrom?: TicketRef;
  reopenedAs?: TicketRef;
  timeline: TimelineEvent[];
  comments: Comment[];
  history: HistoryEntry[];
}

/** The editable fields captured by the wizard. */
export interface TicketDraft {
  type: TicketType | null;
  categoryId: string | null;
  location: TicketLocation;
  title: string;
  description: string;
  onBehalfOf: string;
  attachments: Attachment[];
}

export interface AppNotification {
  id: string;
  ticketId: string;
  code: string;
  title: string;
  body: string;
  at: number;
  read: boolean;
}

export interface Session {
  name: string;
  email: string;
}
