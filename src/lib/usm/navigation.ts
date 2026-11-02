import { FilePlus2, Inbox, type LucideIcon } from "lucide-react";

/** Internal pages that can appear in the navigation. */
export type NavRoute = "/" | "/tickets" | "/tickets/nuevo" | "/contacto";

export type NavLinkItem = {
  label: string;
  description?: string;
  icon?: LucideIcon;
  /** Exact match for the active state (use for "/"). */
  exact?: boolean;
} & ({ to: NavRoute; href?: never } | { href: string; to?: never });

export type NavGroupItem = {
  label: string;
  children: NavLinkItem[];
};

export type NavItem = NavLinkItem | NavGroupItem;

export const isNavGroup = (item: NavItem): item is NavGroupItem => "children" in item;

/**
 * Single source of truth for the header navigation and the mobile side menu.
 * Add, remove or reorder entries here and both menus update.
 */
export const NAVIGATION: NavItem[] = [
  { label: "Inicio", to: "/", exact: true },
  {
    label: "Tickets",
    children: [
      { label: "Mis tickets", description: "Estado y seguimiento", icon: Inbox, to: "/tickets" },
      {
        label: "Crear ticket",
        description: "Reporta un problema",
        icon: FilePlus2,
        to: "/tickets/nuevo",
      },
    ],
  },
  {
    label: "Sitios de Interés",
    children: [
      { label: "Sitios Académicos", href: "https://usm.cl/sitios-academicos/" },
      { label: "Sitios Administrativos", href: "https://usm.cl/sitios-administrativos/" },
    ],
  },
  { label: "Contacto", to: "/contacto" },
];
