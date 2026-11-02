import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, CheckCheck, ChevronDown, ExternalLink, LogOut, Menu, UserRound, X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Wordmark } from "@/components/usm/brand";
import { timeAgo } from "@/lib/usm/format";
import { NAVIGATION, isNavGroup, type NavItem, type NavLinkItem } from "@/lib/usm/navigation";
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
      <SiteHeader
        items={NAVIGATION}
        actions={
          <>
            <NotificationsMenu />
            <ProfileMenu name={session.name} email={session.email} />
          </>
        }
      />
      <main className="min-h-[calc(100dvh-70px)] [&>div:first-child]:w-full animate-rise flex flex-col">{children}</main>
      <footer className="mt-6 bg-surface w-full border-t border-border/70">
        <div className="flex justify-between items-center mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground sm:px-6 w-full gap-6">
          <span>
            © Universidad Técnica Federico Santa María <br />
            USM Denuncia · Plataforma de reportes y solicitudes de la comunidad universitaria
          </span>
          <a className="underline" href="mailto:soporte.denuncia@usm.cl">
            soporte.denuncia@usm.cl
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Shared top bar (desktop nav + mobile side menu), built from a navigation list. */
export function SiteHeader({ items, actions }: { items: NavItem[]; actions?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center gap-2 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <Link
            to="/"
            className="mr-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full flex justify-center items-center"
          >
            <Wordmark />
          </Link>
          <DesktopNav items={items} />

          {actions && <div className="ml-auto flex items-center gap-1.5">{actions}</div>}
        </div>
      </header>
      <MobileMenuPanel items={items} open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function NavAnchor({
  item,
  className,
  children,
  onNavigate,
}: {
  item: NavLinkItem;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  if (item.to === undefined) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: !!item.exact }}
      activeProps={{ "data-active": "true" }}
      className={className}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden h-full items-center gap-1 md:flex">
      {items.map((item) =>
        isNavGroup(item) ? (
          <DropdownMenu key={item.label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="nav"
                size="sm"
                className="gap-1 data-[state=open]:bg-accent data-[state=open]:text-foreground"
              >
                {item.label}
                <ChevronDown className="transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 p-1.5">
              {item.children.map((child) => {
                const Icon = child.icon;
                return (
                  <DropdownMenuItem
                    key={child.label}
                    asChild
                    className="cursor-pointer gap-3 rounded-md p-2.5"
                  >
                    <NavAnchor item={child}>
                      {Icon && (
                        <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                          <Icon className="size-4" />
                        </span>
                      )}
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{child.label}</span>
                        {child.description && (
                          <span className="text-xs text-muted-foreground">
                            {child.description}
                          </span>
                        )}
                      </span>
                    </NavAnchor>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button key={item.label} variant="nav" size="sm" asChild>
            <NavAnchor item={item}>{item.label}</NavAnchor>
          </Button>
        ),
      )}
    </nav>
  );
}

const mobileRow =
  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:bg-accent data-[active=true]:text-primary";

function MobileMenuPanel({
  items,
  open,
  onClose,
}: {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close when the route changes.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock page scroll, close on Escape and when the screen grows to desktop size.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const mql = window.matchMedia("(min-width: 768px)");
    const onMql = () => mql.matches && onClose();
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onMql);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onMql);
    };
  }, [open, onClose]);

  const activeGroups = items.filter(
    (item) =>
      isNavGroup(item) &&
      item.children.some((c) => c.to && (c.to === "/" ? pathname === "/" : pathname.startsWith(c.to))),
  ).map((g) => g.label);

  return (
    <div
      id="mobile-menu"
      inert={!open}
      aria-hidden={!open}
      className={cn(
        "fixed inset-x-0 bottom-0 top-[70px] z-30 transition-[visibility] duration-300 md:hidden",
        open ? "visible" : "invisible",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/25 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        aria-label="Navegación principal"
        className={cn(
          "absolute inset-y-0 left-0 flex w-full max-w-xs flex-col overflow-y-auto border-r border-border/70 bg-surface p-3 shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Accordion type="multiple" defaultValue={activeGroups} className="flex flex-col gap-0.5">
          {items.map((item) =>
            isNavGroup(item) ? (
              <AccordionItem key={item.label} value={item.label} className="border-b-0">
                <AccordionTrigger className={cn(mobileRow, "hover:no-underline")}>
                  {item.label}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <NavAnchor
                          key={child.label}
                          item={child}
                          onNavigate={onClose}
                          className={cn(mobileRow, "py-2.5 text-sm text-muted-foreground")}
                        >
                          {Icon && <Icon className="size-4 shrink-0" />}
                          <span className="flex-1">{child.label}</span>
                          {child.href && <ExternalLink className="size-3.5 opacity-60" />}
                        </NavAnchor>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <NavAnchor key={item.label} item={item} onNavigate={onClose} className={mobileRow}>
                {item.label}
              </NavAnchor>
            ),
          )}
        </Accordion>
      </nav>
    </div>
  );
}

function NotificationsMenu() {
  const notifications = useNotifications();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Notificaciones (${unread} sin leer)`}
        >
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
            <p className="text-xs text-muted-foreground">
              {unread ? `${unread} sin leer` : "Estás al día"}
            </p>
          </div>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllNotificationsRead}
              className="text-xs"
            >
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
          <div className="max-h-[420px] overflow-y-scroll">
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
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        n.read ? "bg-transparent" : "bg-primary",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium">{n.title}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {timeAgo(n.at)}
                        </span>
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                        {n.code}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {n.body}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border">
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
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold sm:text-[34px]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
