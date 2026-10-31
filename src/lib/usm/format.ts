import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

export function timeAgo(at: number): string {
  return formatDistanceToNowStrict(at, { addSuffix: true, locale: es });
}

export function dateTime(at: number): string {
  return format(at, "d MMM yyyy, HH:mm", { locale: es });
}

export function shortDate(at: number): string {
  return format(at, "d MMM", { locale: es });
}

export function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function countdown(ms: number): string {
  if (ms <= 0) return "en instantes";
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")} min`;
}

/** Re-renders every `interval` ms with the current time. */
export function useNow(interval = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}
