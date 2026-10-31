import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck, ChevronDown, FilePlus2, Inbox, LogOut, Menu, UserRound } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wordmark } from "@/components/usm/brand";
import { timeAgo } from "@/lib/usm/format";
import {
  markAllNotificationsRead,
  markNotificationRead,
  signOut,
  tick,
  useHydrated,
  useNotifications,
  useSession,
} from "@/lib/usm/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !session) navigate({ to: "/login", replace: true });
  }, [hydrated, session, navigate]);

  useEffect(() => {
    if (!session) return;
    const run = () => {
      const fresh = tick();
      fresh.slice(0, 3).forEach((n) => toast(n.title, { description: `${n.code} · ${n.body}` }));
    };
    tick();
    const id = window.setInterval(run, 3000);
    return () => window.clearInterval(id);
  }, [session]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
          <MobileNav />
          <Link to="/" className="mr-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="nav" size="sm" asChild>
              <Link to="/" activeOptions={{ exact: true }} activeProps={{ "data-active": "true" }}>
                Inicio
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="nav" size="sm" className="gap-1 data-[state=open]:bg-accent data-[state=open]:text-foreground">
                  Tickets
                  <ChevronDown className="transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 p-1.5">
                <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-md p-2.5">
                  <Link to="/tickets">
                    <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <Inbox className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">Mis tickets</span>
                      <span className="text-xs text-muted-foreground">Estado y seguimiento</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-md p-2.5">
                  <Link to="/tickets/nuevo">
                    <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <FilePlus2 className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">Crear ticket</span>
                      <span className="text-xs text-muted-foreground">Reporta un problema</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="nav" size="sm" asChild>
              <Link to="/contacto" activeProps={{ "data-active": "true" }}>
                Contacto
              </Link>
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <NotificationsMenu />
            <ProfileMenu name={session.name} email={session.email} />
          </div>
        </div>
      </header>
      <main className="animate-rise">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground sm:px-6">
        USM Denuncia · Plataforma de reportes y solicitudes de la comunidad universitaria
      </footer>
    </div>
  );
}

function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/">Inicio</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Tickets</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/tickets">Mis tickets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tickets/nuevo">Crear ticket</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/contacto">Contacto</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsMenu() {
  const notifications = useNotifications();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notificaciones (${unread} sin leer)`}>
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold leading-4 text-signal-foreground tabular">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notificaciones</p>
            <p className="text-xs text-muted-foreground">{unread ? `${unread} sin leer` : "Estás al día"}</p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="text-xs">
              <CheckCheck /> Marcar todo
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <Bell className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Aún no tienes notificaciones.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <ul className="divide-y">
              {notifications.slice(0, 40).map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(n.id);
                      navigate({ to: "/tickets", search: { ticket: n.ticketId } });
                    }}
                    className={cn(
                      "flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                      !n.read && "bg-accent/40",
                    )}
                  >
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium">{n.title}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(n.at)}</span>
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{n.code}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{n.body}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}

function ProfileMenu({ name, email }: { name: string; email: string }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent py-1 pl-1 pr-2.5 transition-colors hover:border-border hover:bg-card data-[state=open]:border-border data-[state=open]:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Abrir menú de perfil"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border">
            <UserRound className="size-4" />
          </span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2.5 font-normal">
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border">
            <UserRound className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{name}</span>
            <span className="block truncate text-xs text-muted-foreground">{email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onSelect={() => {
            signOut();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold sm:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
