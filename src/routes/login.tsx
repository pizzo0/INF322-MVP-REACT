import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Check, Headset, Loader2, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicrosoftLogo, Wordmark } from "@/components/usm/brand";
import { signInWithMicrosoft, useHydrated, useSession } from "@/lib/usm/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Ingresar · USM Denuncia" },
      { name: "description", content: "Ingresa con tu cuenta institucional para reportar y seguir tus tickets." },
      { property: "og:title", content: "Ingresar · USM Denuncia" },
      { property: "og:description", content: "Ingresa con tu cuenta institucional para reportar y seguir tus tickets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

type Portal = "comunidad" | "soporte";

function LoginPage() {
  const hydrated = useHydrated();
  const session = useSession();
  const navigate = useNavigate();
  const [portal, setPortal] = useState<Portal>("comunidad");
  const [loading, setLoading] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  useEffect(() => {
    if (hydrated && session && !loading) navigate({ to: "/", replace: true });
  }, [hydrated, session, loading, navigate]);

  const microsoft = () => {
    setLoading(true);
    window.setTimeout(() => {
      signInWithMicrosoft();
      navigate({ to: "/" });
    }, 900);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink-gradient text-ink-foreground lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" />
        <div className="relative flex flex-1 flex-col justify-between p-12">
          <Wordmark inverted />
          <div className="max-w-md">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-foreground/60">Plataforma institucional</p>
            <h1 className="font-display text-[44px] font-semibold leading-[1.05]">
              Reporta un problema.
              <br />
              <span className="text-ink-foreground/55">Sigue cada paso.</span>
            </h1>
            <p className="mt-5 text-ink-foreground/70">
              Incidencias y requerimientos de toda la universidad, con seguimiento en tiempo real y un responsable
              asignado para cada caso.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-ink-foreground/80">
            {["Seguimiento con línea de tiempo", "Comentarios con el responsable", "Notificaciones de cada cambio"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-ink-foreground/10">
                  <Check className="size-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex items-center justify-center bg-hero-gradient px-5 py-12 sm:px-10">
        <div className="w-full max-w-[440px] animate-rise">
          <div className="mb-10 lg:hidden">
            <Wordmark />
          </div>
          <h2 className="text-3xl font-semibold">Ingresar</h2>
          <p className="mt-2 text-muted-foreground">Selecciona cómo quieres acceder a la plataforma.</p>

          <div role="radiogroup" aria-label="Tipo de acceso" className="mt-8 grid gap-3">
            <PortalOption
              selected={portal === "comunidad"}
              onClick={() => setPortal("comunidad")}
              icon={<Users className="size-5" />}
              title="Comunidad USM"
              description="Estudiantes, docentes, funcionarios y toda persona con cuenta @usm.cl."
            />
            <PortalOption
              selected={portal === "soporte"}
              onClick={() => setPortal("soporte")}
              icon={<Headset className="size-5" />}
              title="Soporte y administración"
              description="Equipos de atención y administradores de la plataforma."
            />
          </div>

          <div className="mt-6">
            {portal === "comunidad" ? (
              <Button variant="microsoft" size="xl" className="w-full" onClick={microsoft} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <MicrosoftLogo />}
                {loading ? "Conectando con Microsoft 365…" : "Continuar con Microsoft 365"}
              </Button>
            ) : (
              <Button variant="hero" size="xl" className="w-full" onClick={() => setManualOpen(true)}>
                Ingresar manualmente <ArrowRight />
              </Button>
            )}
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            {portal === "comunidad"
              ? "Usarás tu cuenta institucional. No almacenamos tu contraseña."
              : "Acceso restringido al personal autorizado."}
          </p>
        </div>
      </main>

      <ManualLoginDialog open={manualOpen} onOpenChange={setManualOpen} />
    </div>
  );
}

function PortalOption({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-start gap-4 rounded-xl border bg-card p-4 text-left shadow-soft transition-all hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary ring-1 ring-primary",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-medium">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
      </span>
      <span
        className={cn(
          "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}

function ManualLoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(false);
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Soporte y administración</DialogTitle>
          <DialogDescription>Ingresa con las credenciales entregadas por la coordinación de la plataforma.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(false);
            setLoading(true);
            window.setTimeout(() => {
              setLoading(false);
              setError(true);
            }, 900);
          }}
        >
          {error && (
            <div className="flex gap-2 rounded-lg border border-destructive/30 bg-status-rejected-soft px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              No fue posible iniciar sesión. Verifica tu correo y contraseña.
            </div>
          )}
          <div>
            <Label htmlFor="admin-email">Correo</Label>
            <Input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@usm.cl" className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="admin-password">Contraseña</Label>
            <Input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <DialogFooter className="gap-2 pt-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Ingresar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
