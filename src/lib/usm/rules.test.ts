import { describe, expect, it } from "vitest";

import {
  ASSIGN_AFTER_MS,
  CLOSE_AFTER_MS,
  MINUTE,
  RESOLVE_AFTER_MS,
  advanceTicket,
  applyDraft,
  canCancel,
  canDelete,
  canReopen,
  draftFromTicket,
  editScope,
  emptyDraft,
  selectCategory,
  selectType,
  ticketCode,
} from "./rules";
import type { Ticket } from "./types";

function makeTicket(over: Partial<Ticket> = {}): Ticket {
  return {
    id: "t1",
    seq: 1041,
    year: 2026,
    code: ticketCode(2026, 1041),
    ownerEmail: "estudiante@usm.cl",
    type: "incidencia",
    categoryId: "inc-aula",
    location: { campus: "Casa Central Valparaíso", building: "", room: "" },
    title: "Título original",
    description: "Descripción original del problema",
    onBehalfOf: "",
    attachments: [],
    status: "nueva",
    createdAt: 0,
    updatedAt: 0,
    timeline: [],
    comments: [],
    history: [],
    ...over,
  };
}

describe("ticket identifier", () => {
  it("uses the INC {year}-{id} format", () => {
    expect(ticketCode(2026, 7)).toBe("INC 2026-0007");
  });
});

describe("category depends on problem type", () => {
  it("clears the category when switching from requerimiento to incidencia", () => {
    const d = selectCategory(selectType(emptyDraft(), "requerimiento"), "req-aula");
    expect(d.categoryId).toBe("req-aula");
    expect(selectType(d, "incidencia").categoryId).toBeNull();
  });

  it("rejects a category that belongs to the other type", () => {
    const d = selectType(emptyDraft(), "incidencia");
    expect(selectCategory(d, "req-aula").categoryId).toBeNull();
  });
});

describe("what the owner can do", () => {
  it("allows full edits and deletion before assignment", () => {
    const t = makeTicket({ status: "nueva" });
    expect(editScope(t)).toBe("completa");
    expect(canDelete(t)).toBe(true);
    expect(canCancel(t)).toBe(false);
  });

  it("after assignment only title, description and files change, and it can be cancelled but not deleted", () => {
    const t = makeTicket({ status: "asignada" });
    expect(canDelete(t)).toBe(false);
    expect(canCancel(t)).toBe(true);
    const attempt = {
      ...draftFromTicket(t),
      type: "requerimiento" as const,
      categoryId: "req-matlab",
      location: { campus: "Sede Concepción", building: "B", room: "1" },
      title: "Nuevo título",
      description: "Nueva descripción del problema",
    };
    const applied = applyDraft(t, attempt);
    expect(applied.type).toBe("incidencia");
    expect(applied.categoryId).toBe("inc-aula");
    expect(applied.location.campus).toBe("Casa Central Valparaíso");
    expect(applied.title).toBe("Nuevo título");
    expect(applied.description).toBe("Nueva descripción del problema");
  });

  it("closed tickets can be reopened once", () => {
    expect(canReopen(makeTicket({ status: "cerrada" }))).toBe(true);
    expect(
      canReopen(makeTicket({ status: "cerrada", reopenedAs: { id: "x", code: "INC 2026-1050" } })),
    ).toBe(false);
  });
});

describe("simulated workflow timing", () => {
  it("stays new before 5 minutes", () => {
    expect(advanceTicket(makeTicket(), 4 * MINUTE).ticket.status).toBe("nueva");
  });

  it("is assigned at 5 minutes", () => {
    const r = advanceTicket(makeTicket(), ASSIGN_AFTER_MS);
    expect(r.ticket.status).toBe("asignada");
    expect(r.ticket.assignee).toBeDefined();
  });

  it("is resolved or rejected 10 minutes after assignment", () => {
    const t = advanceTicket(makeTicket(), ASSIGN_AFTER_MS + RESOLVE_AFTER_MS - 1).ticket;
    expect(t.status).toBe("asignada");
    const r = advanceTicket(makeTicket(), ASSIGN_AFTER_MS + RESOLVE_AFTER_MS).ticket;
    expect(["resuelta", "rechazada"]).toContain(r.status);
  });

  it("closes 5 minutes after the resolution", () => {
    const end = ASSIGN_AFTER_MS + RESOLVE_AFTER_MS + CLOSE_AFTER_MS;
    expect(advanceTicket(makeTicket(), end - 1).ticket.status).not.toBe("cerrada");
    expect(advanceTicket(makeTicket(), end).ticket.status).toBe("cerrada");
  });
});
