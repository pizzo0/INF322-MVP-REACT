import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Headset, Loader2, ShieldCheck, Users } from "lucide-react";
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


function LoginPage() {
  const hydrated = useHydrated();
  const session = useSession();
  const navigate = useNavigate();
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
          <p className="mt-2 text-muted-foreground">Elige la forma de acceso que corresponda a tu cuenta.</p>

          <div className="mt-8 grid gap-4">
            <PortalCard
              icon={<Users className="size-5" />}
              title="Comunidad USM"
              description="Estudiantes, docentes, funcionarios y toda persona con cuenta @usm.cl."
              note="Usarás tu cuenta institucional. No almacenamos tu contraseña."
            >
              <Button variant="microsoft" size="xl" className="w-full" onClick={microsoft} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <MicrosoftLogo />}
                {loading ? "Conectando con Microsoft 365…" : "Continuar con Microsoft 365"}
              </Button>
            </PortalCard>
            <PortalCard
              icon={<Headset className="size-5" />}
              title="Soporte y administración"
              description="Equipos de atención y administradores de la plataforma."
              note="Acceso restringido al personal autorizado."
            >
              <Button variant="hero" size="xl" className="w-full" onClick={() => setManualOpen(true)}>
                Ingresar manualmente <ArrowRight />
              </Button>
            </PortalCard>
          </div>
        </div>
      </main>

      <ManualLoginDialog open={manualOpen} onOpenChange={setManualOpen} />
    </div>
  );
}

function PortalCard({
  icon,
  title,
  description,
  note,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-sans text-base font-medium tracking-normal">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> {note}
      </p>
    </section>
  );
}

function ManualLoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(false);
      setLoading(false);
      setShowPassword(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Ingreso con cuenta manual</DialogTitle>
          <DialogDescription>Exclusivo para personal de soporte y administración.</DialogDescription>
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
            <Input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="admin-password">Contraseña</Label>
            <div className="relative mt-1.5">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pr-11"
                aria-describedby="admin-password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p id="admin-password-help" className="mt-1.5 text-xs text-muted-foreground">
              La contraseña distingue entre mayúsculas y minúsculas.
            </p>
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
