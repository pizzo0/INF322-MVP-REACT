import { useSyncExternalStore } from "react";

import {
  advanceTicket,
  applyDraft,
  canCancel,
  canDelete,
  canReopen,
  diffDraft,
  draftFromTicket,
  editScope,
  ticketCode,
  uid,
  MINUTE,
} from "./rules";
import type { AppNotification, Attachment, Person, Session, Ticket, TicketDraft } from "./types";

const DATA_KEY = "usm-denuncia:data:v1";
const SESSION_KEY = "usm-denuncia:session:v1";
const SEQ_BASE = 1040;

interface DataState {
  tickets: Ticket[];
  notifications: AppNotification[];
  seq: number;
  seeded: boolean;
}

const EMPTY: DataState = { tickets: [], notifications: [], seq: SEQ_BASE, seeded: false };

/* ------------------------------------------------------------------ */
/* Tiny external store with localStorage persistence                   */
/* ------------------------------------------------------------------ */

function createPersisted<T>(key: string, fallback: T) {
  let state = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      state = fallback;
    }
  };

  const persist = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full: drop image previews and retry once.
      try {
        const stripped = JSON.parse(
          JSON.stringify(state, (k, v) => (k === "dataUrl" ? undefined : v)),
        );
        window.localStorage.setItem(key, JSON.stringify(stripped));
      } catch {
        /* give up silently; state stays in memory */
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      loaded = false;
      load();
      listeners.forEach((l) => l());
    });
  }

  return {
    get: () => {
      load();
      return state;
    },
    server: () => fallback,
    set: (next: T | ((prev: T) => T)) => {
      load();
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      persist();
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const data = createPersisted<DataState>(DATA_KEY, EMPTY);
const session = createPersisted<Session | null>(SESSION_KEY, null);

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

export function useData(): DataState {
  return useSyncExternalStore(data.subscribe, data.get, data.server);
}

export function useTickets(): Ticket[] {
  return useData().tickets;
}

export function useTicket(id: string | undefined): Ticket | undefined {
  const tickets = useTickets();
  return id ? tickets.find((t) => t.id === id) : undefined;
}

export function useNotifications(): AppNotification[] {
  return useData().notifications;
}

export function useSession(): Session | null {
  return useSyncExternalStore(session.subscribe, session.get, session.server);
}

const noopSubscribe = () => () => {};
/** False during SSR and the hydration render, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Session                                                            */
/* ------------------------------------------------------------------ */

export const DEFAULT_PROFILE: Session = { name: "Estudiante", email: "estudiante@usm.cl" };

export function signInWithMicrosoft(): Session {
  session.set(DEFAULT_PROFILE);
  seedIfEmpty(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

export function signOut() {
  session.set(null);
}

/* ------------------------------------------------------------------ */
/* Ticket actions                                                     */
/* ------------------------------------------------------------------ */

function note(t: Ticket, title: string, body: string, at = Date.now()): AppNotification {
  return { id: uid("n"), ticketId: t.id, code: t.code, title, body, at, read: false };
}

function buildTicket(seq: number, owner: Session, d: TicketDraft, at: number): Ticket {
  const year = new Date(at).getFullYear();
  return {
    id: uid("t"),
    seq,
    year,
    code: ticketCode(year, seq),
    ownerEmail: owner.email,
    type: d.type!,
    categoryId: d.categoryId!,
    location: { ...d.location },
    title: d.title.trim(),
    description: d.description.trim(),
    onBehalfOf: d.onBehalfOf.trim(),
    attachments: d.attachments,
    status: "nueva",
    createdAt: at,
    updatedAt: at,
    timeline: [
      { id: uid("e"), kind: "creada", at, description: "Ticket ingresado por el usuario." },
    ],
    comments: [],
    history: [],
  };
}

export function createTicket(owner: Session, d: TicketDraft): Ticket {
  const now = Date.now();
  let created!: Ticket;
  data.set((s) => {
    const seq = s.seq + 1;
    created = buildTicket(seq, owner, d, now);
    return {
      ...s,
      seq,
      tickets: [created, ...s.tickets],
      notifications: [
        note(
          created,
          "Ticket creado",
          "Será asignado a un responsable en un mínimo de 5 minutos.",
          now,
        ),
        ...s.notifications,
      ],
    };
  });
  return created;
}

export interface UpdateResult {
  ok: boolean;
  limited: boolean;
  changes: number;
}

export function updateTicket(id: string, d: TicketDraft): UpdateResult {
  const now = Date.now();
  let result: UpdateResult = { ok: false, limited: false, changes: 0 };
  data.set((s) => ({
    ...s,
    tickets: s.tickets.map((t) => {
      if (t.id !== id) return t;
      const scope = editScope(t);
      if (scope === "ninguna") return t;
      const before = draftFromTicket(t);
      const allowed = applyDraft(t, d);
      const entries = diffDraft(before, allowed, now);
      result = { ok: true, limited: scope === "limitada", changes: entries.length };
      if (!entries.length) return t;
      return {
        ...t,
        type: allowed.type!,
        categoryId: allowed.categoryId!,
        location: { ...allowed.location },
        title: allowed.title.trim(),
        description: allowed.description.trim(),
        onBehalfOf: allowed.onBehalfOf.trim(),
        attachments: allowed.attachments,
        updatedAt: now,
        history: [...entries, ...t.history],
      };
    }),
  }));
  return result;
}

export function deleteTicket(id: string): boolean {
  let ok = false;
  data.set((s) => {
    const t = s.tickets.find((x) => x.id === id);
    if (!t || !canDelete(t)) return s;
    ok = true;
    return {
      ...s,
      tickets: s.tickets.filter((x) => x.id !== id),
      notifications: s.notifications.filter((n) => n.ticketId !== id),
    };
  });
  return ok;
}

export function cancelTicket(id: string): boolean {
  const now = Date.now();
  let ok = false;
  data.set((s) => ({
    ...s,
    tickets: s.tickets.map((t) => {
      if (t.id !== id || !canCancel(t)) return t;
      ok = true;
      return {
        ...t,
        status: "cerrada",
        closedAt: now,
        closedReason: "cancelado",
        updatedAt: now,
        timeline: [
          ...t.timeline,
          { id: uid("e"), kind: "cancelada", at: now, description: "Cerrado por el usuario." },
        ],
      };
    }),
  }));
  return ok;
}

export function reopenTicket(owner: Session, id: string, d: TicketDraft): Ticket | null {
  const now = Date.now();
  let created: Ticket | null = null;
  data.set((s) => {
    const old = s.tickets.find((t) => t.id === id);
    if (!old || !canReopen(old)) return s;
    const seq = s.seq + 1;
    const base = draftFromTicket(old);
    const next = buildTicket(
      seq,
      owner,
      { ...base, title: d.title, description: d.description, attachments: d.attachments },
      now,
    );
    next.reopenedFrom = { id: old.id, code: old.code };
    next.timeline = [
      {
        id: uid("e"),
        kind: "reabierta",
        at: now,
        description: `Reabierto a partir de ${old.code}.`,
      },
    ];
    next.history = diffDraft(base, draftFromTicket(next), now);
    created = next;
    return {
      ...s,
      seq,
      tickets: [
        next,
        ...s.tickets.map((t) =>
          t.id === old.id
            ? { ...t, reopenedAs: { id: next.id, code: next.code }, updatedAt: now }
            : t,
        ),
      ],
      notifications: [
        note(next, "Ticket reabierto", `Se creó ${next.code} a partir de ${old.code}.`, now),
        ...s.notifications,
      ],
    };
  });
  return created;
}

export function addComment(id: string, author: Person, body: string) {
  const now = Date.now();
  data.set((s) => ({
    ...s,
    tickets: s.tickets.map((t) =>
      t.id === id
        ? {
            ...t,
            updatedAt: now,
            comments: [
              ...t.comments,
              { id: uid("c"), at: now, author, fromStaff: false, body: body.trim() },
            ],
          }
        : t,
    ),
  }));
}

export function markNotificationRead(id: string) {
  data.set((s) => ({
    ...s,
    notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  }));
}

export function markAllNotificationsRead() {
  data.set((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
}

/** Advances every ticket in the simulated workflow. Returns new notifications. */
export function tick(now = Date.now()): AppNotification[] {
  const current = data.get();
  const fresh: AppNotification[] = [];
  let changed = false;
  const tickets = current.tickets.map((t) => {
    const r = advanceTicket(t, now);
    if (r.ticket !== t) changed = true;
    fresh.push(...r.notifications);
    return r.ticket;
  });
  if (!changed) return [];
  data.set((s) => ({
    ...s,
    tickets,
    notifications: [...fresh.sort((a, b) => b.at - a.at), ...s.notifications],
  }));
  return fresh;
}

/* ------------------------------------------------------------------ */
/* Example data for the first sign-in                                 */
/* ------------------------------------------------------------------ */

function seedIfEmpty(owner: Session) {
  const s = data.get();
  if (s.seeded) return;
  const now = Date.now();
  const noFiles: Attachment[] = [];

  const closedAt = now - 3 * 24 * 60 * MINUTE;
  const closed = advanceTicket(
    buildTicket(
      SEQ_BASE + 1,
      owner,
      {
        type: "incidencia",
        categoryId: "inc-red",
        location: { campus: "Casa Central Valparaíso", building: "Edificio C", room: "C-210" },
        title: "Sin conexión a la red Wi-Fi en el edificio C",
        description:
          "Desde la mañana la red institucional no permite autenticarse en el segundo piso del edificio C. Afecta a varios estudiantes durante las clases.",
        onBehalfOf: "",
        attachments: noFiles,
      },
      closedAt,
    ),
    now,
  );

  const assignedAt = now - 8 * MINUTE;
  const assigned = advanceTicket(
    buildTicket(
      SEQ_BASE + 2,
      owner,
      {
        type: "requerimiento",
        categoryId: "req-matlab",
        location: { campus: "Campus Santiago San Joaquín", building: "Edificio A", room: "" },
        title: "Licencia de Matlab para curso de métodos numéricos",
        description:
          "Necesito activar la licencia institucional de Matlab con el toolbox de optimización para el curso de métodos numéricos de este semestre.",
        onBehalfOf: "",
        attachments: noFiles,
      },
      assignedAt,
    ),
    now,
  );

  data.set({
    tickets: [assigned.ticket, closed.ticket],
    notifications: [
      ...assigned.notifications.map((n) => ({ ...n, read: false })),
      ...closed.notifications.map((n) => ({ ...n, read: true })),
    ].sort((a, b) => b.at - a.at),
    seq: SEQ_BASE + 2,
    seeded: true,
  });
}
