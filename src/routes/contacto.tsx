import { createFileRoute } from "@tanstack/react-router";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/usm/app-shell";
import { CONTACTS, SUPPORT_EMAIL, TEAMS } from "@/lib/usm/catalog";
import { initials } from "@/lib/usm/format";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · USM Denuncia" },
      { name: "description", content: "Equipos y personas responsables de atender los tickets de la plataforma." },
      { property: "og:title", content: "Contacto · USM Denuncia" },
      { property: "og:description", content: "Equipos y personas responsables de atender los tickets de la plataforma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <ContactPage />
    </AppShell>
  ),
});

function copy(email: string) {
  void navigator.clipboard?.writeText(email);
  toast.success("Correo copiado", { description: email });
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <PageHeader
        eyebrow="Contacto"
        title="Equipos de atención"
        description="Estas son las personas que pueden ser asignadas a tus tickets y quienes administran la plataforma."
      />

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="mb-10 flex flex-col gap-1 rounded-2xl bg-ink-gradient p-6 text-ink-foreground shadow-lift sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-display text-lg font-semibold">Canal general de soporte</p>
          <p className="text-sm text-ink-foreground/70">Para consultas sobre la plataforma que no correspondan a un ticket.</p>
        </div>
        <span className="mt-3 inline-flex items-center gap-2 font-mono text-sm sm:mt-0">
          <Mail className="size-4" /> {SUPPORT_EMAIL}
        </span>
      </a>

      <div className="space-y-10">
        {TEAMS.map((team) => (
          <section key={team.id} className="grid gap-4 lg:grid-cols-[260px_1fr]">
            <div>
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {CONTACTS.filter((c) => c.team === team.id).map((c) => (
                <li key={c.email} className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-soft">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                    <a href={`mailto:${c.email}`} className="mt-1 block truncate text-sm text-primary hover:underline">
                      {c.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(c.email)}
                    className="cursor-pointer rounded-md p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label={`Copiar correo de ${c.name}`}
                  >
                    <Copy className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
