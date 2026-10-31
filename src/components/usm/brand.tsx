import { cn } from "@/lib/utils";

/** Placeholder brand mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-lg bg-primary-gradient text-primary-foreground shadow-glow",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v8a6 6 0 0 0 12 0V4" />
        <path d="M12 9v4" opacity=".7" />
      </svg>
      <span className="absolute -right-1 -top-1 size-3 rounded-full bg-signal" />
    </span>
  );
}

export function Wordmark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* <LogoMark /> */}
      <span className={cn("font-display text-[17px] font-semibold tracking-tight", inverted ? "text-ink-foreground" : "text-foreground")}>
        USM Denuncia
      </span>
    </span>
  );
}

export function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={cn("size-4", className)} aria-hidden>
      <rect x="1" y="1" width="9" height="9" className="fill-ms-red" />
      <rect x="11" y="1" width="9" height="9" className="fill-ms-green" />
      <rect x="1" y="11" width="9" height="9" className="fill-ms-blue" />
      <rect x="11" y="11" width="9" height="9" className="fill-ms-yellow" />
    </svg>
  );
}
