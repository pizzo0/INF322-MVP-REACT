import { describe, expect, it } from "vitest";

import {
  ASSIGN_AFTER_MS,
  CLOSE_AFTER_MS,
  MINUTE,
  RESOLVE_AFTER_MS,
  advanceTicket,
  applyDraft,
  canCancel,
  canComment,
  canDelete,
  canReopen,
  diffDraft,
  draftFromTicket,
  editScope,
  emptyDraft,
  isValidEmail,
  selectCategory,
  selectType,
  simulatedOutcome,
  ticketCode,
  validateDraft,
} from "./rules";
import type { Ticket, TicketDraft } from "./types";

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

describe("draft validation (Meta 1: Creación guiada)", () => {
  function validDraft(): TicketDraft {
    return {
      type: "incidencia",
      categoryId: "inc-aula",
      location: { campus: "Campus San Joaquín", building: "Edificio F", room: "F203" },
      title: "Luz del fondo no funciona",
      description: "La luminaria del fondo de la sala parpadea y no enciende.",
      onBehalfOf: "",
      attachments: [],
    };
  }

  it("accepts a complete, valid draft without errors", () => {
    expect(validateDraft(validDraft())).toEqual({});
  });

  it("requires a problem type", () => {
    const d = { ...validDraft(), type: null };
    expect(validateDraft(d).type).toBe("Selecciona el tipo de problema.");
  });

  it("requires a valid category matching the type", () => {
    const d = { ...validDraft(), categoryId: null };
    expect(validateDraft(d).categoryId).toBe("Selecciona una categoría.");
  });

  it("requires a campus location", () => {
    const d = { ...validDraft(), location: { campus: "   ", building: "", room: "" } };
    expect(validateDraft(d).campus).toBe("El campus es obligatorio.");
  });

  it("enforces minimum title length of 5 characters", () => {
    const d = { ...validDraft(), title: "Falla" };
    expect(validateDraft(d).title).toBeUndefined();
    const short = { ...validDraft(), title: "Luz" };
    expect(validateDraft(short).title).toBe("El título debe tener al menos 5 caracteres.");
  });

  it("enforces minimum description length of 10 characters", () => {
    const short = { ...validDraft(), description: "No sirve" };
    expect(validateDraft(short).description).toBe(
      "Describe el problema con al menos 10 caracteres.",
    );
  });

  it("validates onBehalfOf email syntax when provided", () => {
    const validEmail = { ...validDraft(), onBehalfOf: "profesor@usm.cl" };
    expect(validateDraft(validEmail).onBehalfOf).toBeUndefined();

    const invalidEmail = { ...validDraft(), onBehalfOf: "correo-invalido" };
    expect(validateDraft(invalidEmail).onBehalfOf).toBe("Ingresa un correo válido.");
  });
});

describe("draft diff and audit history (Meta 2: Edición)", () => {
  it("detects changes in title and description", () => {
    const before = draftFromTicket(makeTicket());
    const after = {
      ...before,
      title: "Título modificado sala F202",
      description: "Descripción corregida con más detalles",
    };
    const diff = diffDraft(before, after, 1000);
    expect(diff).toHaveLength(2);
    expect(diff.map((e) => e.field)).toEqual(["Título", "Descripción"]);
    expect(diff.find((e) => e.field === "Título")?.to).toBe("Título modificado sala F202");
  });

  it("detects changes in location", () => {
    const before = draftFromTicket(makeTicket());
    const after = {
      ...before,
      location: { campus: "Campus San Joaquín", building: "Edificio F", room: "F202" },
    };
    const diff = diffDraft(before, after, 1000);
    const locEntry = diff.find((e) => e.field === "Ubicación");
    expect(locEntry).toBeDefined();
    expect(locEntry?.to).toBe("Campus San Joaquín · Edificio F · F202");
  });

  it("returns an empty diff when nothing changed", () => {
    const draft = draftFromTicket(makeTicket());
    expect(diffDraft(draft, draft, 1000)).toHaveLength(0);
  });
});

describe("comments and permissions (Meta 3: Ciclo de vida)", () => {
  it("allows comments for active tickets and forbids them when closed", () => {
    expect(canComment(makeTicket({ status: "nueva" }))).toBe(true);
    expect(canComment(makeTicket({ status: "asignada" }))).toBe(true);
    expect(canComment(makeTicket({ status: "resuelta" }))).toBe(true);
    expect(canComment(makeTicket({ status: "cerrada" }))).toBe(false);
  });

  it("determines predictable simulated outcomes based on seq", () => {
    expect(simulatedOutcome(1040)).toBe("rechazada");
    expect(simulatedOutcome(1041)).toBe("resuelta");
    expect(simulatedOutcome(1042)).toBe("resuelta");
    expect(simulatedOutcome(1043)).toBe("resuelta");
    expect(simulatedOutcome(1044)).toBe("rechazada");
  });

  it("validates email helper", () => {
    expect(isValidEmail("alumno@usm.cl")).toBe(true);
    expect(isValidEmail("docente@sansano.usm.cl")).toBe(true);
    expect(isValidEmail("sin-arroba.cl")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
