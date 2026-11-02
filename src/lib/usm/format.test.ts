import { describe, expect, it } from "vitest";

import { bytes, countdown, initials, shortDate } from "./format";

describe("format utilities", () => {
  describe("bytes", () => {
    it("formats bytes under 1 KB", () => {
      expect(bytes(0)).toBe("0 B");
      expect(bytes(512)).toBe("512 B");
      expect(bytes(1023)).toBe("1023 B");
    });

    it("formats kilobytes", () => {
      expect(bytes(1024)).toBe("1 KB");
      expect(bytes(2048)).toBe("2 KB");
      expect(bytes(500 * 1024)).toBe("500 KB");
    });

    it("formats megabytes with one decimal place", () => {
      expect(bytes(1024 * 1024)).toBe("1.0 MB");
      expect(bytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
      expect(bytes(10 * 1024 * 1024)).toBe("10.0 MB");
    });
  });

  describe("initials", () => {
    it("extracts two uppercase initials from full names", () => {
      expect(initials("Diego Pérez")).toBe("DP");
      expect(initials("Alejandro Cáceres")).toBe("AC");
      expect(initials("Cristóbal Barahona")).toBe("CB");
      expect(initials("Benjamín Caro")).toBe("BC");
    });

    it("handles single names and extra spaces", () => {
      expect(initials("Lucas")).toBe("L");
      expect(initials("   Paula   Vergara  ")).toBe("PV");
      expect(initials("")).toBe("");
    });
  });

  describe("countdown", () => {
    it("returns 'en instantes' for zero or negative milliseconds", () => {
      expect(countdown(0)).toBe("en instantes");
      expect(countdown(-1000)).toBe("en instantes");
    });

    it("formats minutes and padded seconds", () => {
      expect(countdown(60_000)).toBe("1:00 min");
      expect(countdown(65_000)).toBe("1:05 min");
      expect(countdown(300_000)).toBe("5:00 min");
      expect(countdown(15_000)).toBe("0:15 min");
    });
  });

  describe("shortDate", () => {
    it("formats a timestamp with day and short month", () => {
      // 15 de marzo de 2026 a las 12:00 UTC
      const date = new Date(2026, 2, 15, 12, 0).getTime();
      const formatted = shortDate(date);
      expect(formatted).toMatch(/15\s+mar/i);
    });
  });
});
