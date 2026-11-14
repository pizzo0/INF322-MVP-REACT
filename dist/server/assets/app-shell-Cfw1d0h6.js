import * as React from "react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bell, Check, CheckCheck, ChevronDown, ChevronRight, Circle, FilePlus2, Inbox, LogOut, Menu, UserRound, X } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/accordion.tsx
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, {
	className: "flex",
	children: /* @__PURE__ */ jsxs(AccordionPrimitive.Trigger, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Content, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ jsx("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-normal text-center break-words min-w-0 max-w-full rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		size: {
			default: "min-h-9 px-4 py-2",
			sm: "min-h-8 rounded-md px-3 py-1.5 text-xs",
			lg: "min-h-10 rounded-md px-8 py-2",
			xl: "min-h-12 rounded-lg px-6 py-2.5 text-[15px] leading-snug",
			icon: "h-9 w-9"
		},
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			hero: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
			microsoft: "border border-input bg-card text-foreground shadow-soft hover:bg-accent hover:border-ring/40",
			nav: "text-muted-foreground hover:bg-accent hover:text-foreground data-[active=true]:text-foreground data-[active=true]:font-bold h-full rounded-none",
			soft: "bg-accent text-accent-foreground hover:bg-accent/70"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/ui/popover.tsx
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(PopoverPrimitive.Content, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
//#endregion
//#region src/components/usm/brand.tsx
function Wordmark({ className, inverted }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: /* @__PURE__ */ jsx("span", {
			className: cn("font-display text-[17px] font-semibold tracking-tight", inverted ? "text-ink-foreground" : "text-foreground"),
			children: "USM Denuncia"
		})
	});
}
function MicrosoftLogo({ className }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 21 21",
		className: cn("size-4", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ jsx("rect", {
				x: "1",
				y: "1",
				width: "9",
				height: "9",
				className: "fill-ms-red"
			}),
			/* @__PURE__ */ jsx("rect", {
				x: "11",
				y: "1",
				width: "9",
				height: "9",
				className: "fill-ms-green"
			}),
			/* @__PURE__ */ jsx("rect", {
				x: "1",
				y: "11",
				width: "9",
				height: "9",
				className: "fill-ms-blue"
			}),
			/* @__PURE__ */ jsx("rect", {
				x: "11",
				y: "11",
				width: "9",
				height: "9",
				className: "fill-ms-yellow"
			})
		]
	});
}
//#endregion
//#region src/lib/usm/format.ts
function timeAgo(at) {
	return formatDistanceToNowStrict(at, {
		addSuffix: true,
		locale: es
	});
}
function dateTime(at) {
	return format(at, "d MMM yyyy, HH:mm", { locale: es });
}
function bytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
	return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}
function countdown(ms) {
	if (ms <= 0) return "en instantes";
	const total = Math.ceil(ms / 1e3);
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, "0")} min`;
}
/** Re-renders every `interval` ms with the current time. */
function useNow(interval = 1e3) {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const id = window.setInterval(() => setNow(Date.now()), interval);
		return () => window.clearInterval(id);
	}, [interval]);
	return now;
}
//#endregion
//#region src/lib/usm/navigation.ts
var isNavGroup = (item) => "children" in item;
/**
* Single source of truth for the header navigation and the mobile side menu.
* Add, remove or reorder entries here and both menus update.
*/
var NAVIGATION = [
	{
		label: "Inicio",
		to: "/",
		exact: true
	},
	{
		label: "Tickets",
		children: [{
			label: "Mis tickets",
			icon: Inbox,
			to: "/tickets"
		}, {
			label: "Crear ticket",
			icon: FilePlus2,
			to: "/tickets/nuevo"
		}]
	},
	{
		label: "Sitios de Interés",
		children: [{
			label: "Sitios Académicos",
			href: "https://usm.cl/sitios-academicos/"
		}, {
			label: "Sitios Administrativos",
			href: "https://usm.cl/sitios-administrativos/"
		}]
	},
	{
		label: "Contacto",
		to: "/contacto"
	}
];
/** Navigation shown to signed-out visitors (login page). */
var PUBLIC_NAVIGATION = NAVIGATION.filter((item) => item.label === "Sitios de Interés");
//#endregion
//#region src/lib/usm/catalog.ts
var TICKET_TYPES = [{
	id: "incidencia",
	name: "Incidencia",
	description: "Algo dejó de funcionar o funciona de forma incorrecta.",
	examples: "Una plataforma caída, un equipo dañado, una sala sin proyector."
}, {
	id: "requerimiento",
	name: "Requerimiento",
	description: "Necesitas solicitar un servicio, acceso, recurso o cambio.",
	examples: "Instalar software, pedir una licencia, habilitar un acceso."
}];
var inc = (slug, name, description, team) => ({
	id: `inc-${slug}`,
	type: "incidencia",
	name,
	description,
	team
});
var req = (slug, name, description, team) => ({
	id: `req-${slug}`,
	type: "requerimiento",
	name,
	description,
	team
});
var CATEGORIES = [
	inc("ansys", "Ansys", "Errores de ejecución, licencias que no responden o cierres inesperados.", "mesa"),
	inc("aula", "Aula", "Problemas para acceder a cursos, entregar tareas o ver contenidos.", "academicos"),
	inc("sala", "Sala de clases", "Proyector, audio, enchufes, mobiliario o climatización con fallas.", "infraestructura"),
	inc("laboratorio", "Laboratorio", "Equipos o instrumentos de laboratorio que no funcionan.", "infraestructura"),
	inc("matlab", "Matlab", "Errores de instalación, activación o ejecución.", "mesa"),
	inc("nube", "Nube", "Servicios de almacenamiento o máquinas virtuales no disponibles.", "mesa"),
	inc("office", "Office 365", "Correo, Teams, OneDrive u otras aplicaciones con fallas.", "mesa"),
	inc("pagos", "Portal de Pagos", "Pagos rechazados, montos incorrectos o portal no disponible.", "academicos"),
	inc("siga", "Siga", "Errores al consultar notas, inscribir asignaturas o ver horarios.", "academicos"),
	inc("sireb", "Sireb", "Problemas con préstamos, reservas o catálogo de biblioteca.", "academicos"),
	inc("so", "Sistemas Operativos", "Equipos institucionales que no inician o presentan errores.", "mesa"),
	inc("red", "Red y Wi-Fi", "Sin conexión, señal débil o problemas de autenticación en la red.", "infraestructura"),
	inc("impresion", "Impresión", "Impresoras sin servicio, atascos o cola de impresión detenida.", "infraestructura"),
	inc("otro", "Otro", "Cualquier otra falla que no aparezca en esta lista.", "mesa"),
	req("ansys", "Ansys", "Solicitud de licencia o instalación en un equipo.", "mesa"),
	req("aula", "Aula", "Creación de cursos, matrícula de participantes o cambios de rol.", "academicos"),
	req("sala", "Sala de clases", "Reserva de salas, equipamiento audiovisual o mobiliario adicional.", "infraestructura"),
	req("laboratorio", "Laboratorio", "Acceso a laboratorios, insumos o configuración de equipos.", "infraestructura"),
	req("matlab", "Matlab", "Solicitud de licencia, toolboxes o instalación.", "mesa"),
	req("nube", "Nube", "Nuevos espacios de almacenamiento o máquinas virtuales.", "mesa"),
	req("office", "Office 365", "Listas de distribución, grupos de Teams o licencias adicionales.", "mesa"),
	req("pagos", "Portal de Pagos", "Certificados de pago, convenios o cambios de datos de facturación.", "academicos"),
	req("siga", "Siga", "Certificados, actualización de datos o permisos de acceso.", "academicos"),
	req("sireb", "Sireb", "Adquisición de material bibliográfico o renovación especial.", "academicos"),
	req("so", "Sistemas Operativos", "Instalación o actualización del sistema operativo de un equipo.", "mesa"),
	req("software", "Software", "Instalación de software específico para docencia o investigación.", "mesa"),
	req("cuentas", "Cuentas y accesos", "Creación de cuentas, restablecimiento o permisos especiales.", "plataforma"),
	req("otro", "Otro", "Cualquier otra solicitud que no aparezca en esta lista.", "mesa")
];
function categoriesFor(type) {
	if (!type) return [];
	return CATEGORIES.filter((c) => c.type === type);
}
function getCategory(id) {
	if (!id) return void 0;
	return CATEGORIES.find((c) => c.id === id);
}
var CAMPUSES = [
	"Casa Central Valparaíso",
	"Campus Santiago San Joaquín",
	"Campus Santiago Vitacura",
	"Sede Viña del Mar",
	"Sede Concepción"
];
var TEAMS = [
	{
		id: "plataforma",
		name: "Coordinación de la plataforma",
		description: "Administración de USM Denuncia, cuentas y criterios de atención."
	},
	{
		id: "mesa",
		name: "Mesa de ayuda TI",
		description: "Software, licencias, Office 365, servicios en la nube y equipos."
	},
	{
		id: "academicos",
		name: "Sistemas académicos",
		description: "Aula, Siga, Sireb y Portal de Pagos."
	},
	{
		id: "infraestructura",
		name: "Infraestructura y operaciones",
		description: "Salas, laboratorios, red, impresión y mantención."
	}
];
var CONTACTS = [
	{
		name: "Carolina Fuentes Ibarra",
		email: "carolina.fuentes@usm.cl",
		role: "Coordinadora de la plataforma",
		team: "plataforma"
	},
	{
		name: "Matías Rojas Herrera",
		email: "matias.rojas@usm.cl",
		role: "Administrador de sistemas",
		team: "plataforma"
	},
	{
		name: "Daniela Soto Pizarro",
		email: "daniela.soto@usm.cl",
		role: "Jefa de mesa de ayuda",
		team: "mesa"
	},
	{
		name: "Felipe Araya Muñoz",
		email: "felipe.araya@usm.cl",
		role: "Analista de soporte TI",
		team: "mesa"
	},
	{
		name: "Javiera Contreras León",
		email: "javiera.contreras@usm.cl",
		role: "Analista de soporte TI",
		team: "mesa"
	},
	{
		name: "Ignacio Vergara Díaz",
		email: "ignacio.vergara@usm.cl",
		role: "Especialista en sistemas académicos",
		team: "academicos"
	},
	{
		name: "Valentina Morales Castro",
		email: "valentina.morales@usm.cl",
		role: "Analista de plataformas docentes",
		team: "academicos"
	},
	{
		name: "Rodrigo Espinoza Vidal",
		email: "rodrigo.espinoza@usm.cl",
		role: "Supervisor de infraestructura",
		team: "infraestructura"
	},
	{
		name: "Constanza Reyes Navarro",
		email: "constanza.reyes@usm.cl",
		role: "Técnica de laboratorios y salas",
		team: "infraestructura"
	},
	{
		name: "Sebastián Molina Tapia",
		email: "sebastian.molina@usm.cl",
		role: "Técnico de redes",
		team: "infraestructura"
	}
];
var SUPPORT_EMAIL = "soporte.denuncia@usm.cl";
//#endregion
//#region src/lib/usm/rules.ts
var MINUTE = 6e4;
/** Simulated workflow: assign after 5 min, resolve/reject 10 min later, close 5 min after that. */
var ASSIGN_AFTER_MS = 5 * MINUTE;
var RESOLVE_AFTER_MS = 10 * MINUTE;
var CLOSE_AFTER_MS = 5 * MINUTE;
var MAX_FILE_BYTES = 10485760;
var counter = 0;
function uid(prefix = "id") {
	counter += 1;
	return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
function ticketCode(year, seq) {
	return `INC ${year}-${String(seq).padStart(4, "0")}`;
}
function emptyDraft() {
	return {
		type: null,
		categoryId: null,
		location: {
			campus: "",
			building: "",
			room: ""
		},
		title: "",
		description: "",
		onBehalfOf: "",
		attachments: []
	};
}
function draftFromTicket(t) {
	return {
		type: t.type,
		categoryId: t.categoryId,
		location: { ...t.location },
		title: t.title,
		description: t.description,
		onBehalfOf: t.onBehalfOf,
		attachments: [...t.attachments]
	};
}
/**
* Categories belong to a specific type, even when they share a name.
* Switching type must always clear the chosen category.
*/
function selectType(draft, type) {
	if (draft.type === type) return draft;
	return {
		...draft,
		type,
		categoryId: null
	};
}
function selectCategory(draft, categoryId) {
	const category = getCategory(categoryId);
	if (!category || category.type !== draft.type) return draft;
	return {
		...draft,
		categoryId
	};
}
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value) {
	return EMAIL_RE.test(value.trim());
}
function validateDraft(d) {
	const e = {};
	if (!d.type) e.type = "Selecciona el tipo de problema.";
	if (!d.categoryId || getCategory(d.categoryId)?.type !== d.type) e.categoryId = "Selecciona una categoría.";
	if (!d.location.campus.trim()) e.campus = "El campus es obligatorio.";
	if (d.title.trim().length < 5) e.title = "El título debe tener al menos 5 caracteres.";
	if (d.description.trim().length < 10) e.description = "Describe el problema con al menos 10 caracteres.";
	if (d.onBehalfOf.trim() && !isValidEmail(d.onBehalfOf)) e.onBehalfOf = "Ingresa un correo válido.";
	return e;
}
/**
* Before assignment everything is editable. Once assigned (and until closed)
* only title, description and attachments may change. Closed tickets are
* re-opened instead of edited.
*/
function editScope(t) {
	if (t.status === "nueva") return "completa";
	if (t.status === "cerrada") return "ninguna";
	return "limitada";
}
function canDelete(t) {
	return t.status === "nueva";
}
function canCancel(t) {
	return t.status === "asignada" || t.status === "resuelta" || t.status === "rechazada";
}
function canReopen(t) {
	return t.status === "cerrada" && !t.reopenedAs;
}
function canComment(t) {
	return t.status !== "cerrada";
}
/** Applies only the fields allowed by the ticket's current edit scope. */
function applyDraft(t, d) {
	const scope = editScope(t);
	if (scope === "completa") return d;
	const base = draftFromTicket(t);
	if (scope === "limitada") return {
		...base,
		title: d.title,
		description: d.description,
		attachments: d.attachments
	};
	return base;
}
function fmtLocation(l) {
	return [
		l.campus,
		l.building,
		l.room
	].filter(Boolean).join(" · ") || "—";
}
function diffDraft(before, after, at) {
	const out = [];
	const push = (field, from, to) => {
		if (from !== to) out.push({
			id: uid("h"),
			at,
			field,
			from: from || "—",
			to: to || "—"
		});
	};
	push("Tipo de problema", typeLabel(before.type), typeLabel(after.type));
	push("Categoría", getCategory(before.categoryId)?.name ?? "", getCategory(after.categoryId)?.name ?? "");
	push("Ubicación", fmtLocation(before.location), fmtLocation(after.location));
	push("Título", before.title, after.title);
	push("Descripción", before.description, after.description);
	push("Notificar en nombre de", before.onBehalfOf, after.onBehalfOf);
	const names = (d) => d.attachments.map((a) => a.name).join(", ");
	push("Archivos adjuntos", names(before), names(after));
	return out;
}
function typeLabel(t) {
	if (t === "incidencia") return "Incidencia";
	if (t === "requerimiento") return "Requerimiento";
	return "";
}
var STATUS_LABEL = {
	nueva: "Nuevo",
	asignada: "Asignado",
	resuelta: "Resuelto",
	rechazada: "Rechazado",
	cerrada: "Cerrado"
};
var STATUS_ORDER = [
	"nueva",
	"asignada",
	"resuelta",
	"rechazada",
	"cerrada"
];
function pickAssignee(t) {
	const team = getCategory(t.categoryId)?.team ?? "mesa";
	const pool = CONTACTS.filter((c) => c.team === team && !c.role.startsWith("Jefa") && !c.role.startsWith("Coordinadora"));
	const list = pool.length ? pool : CONTACTS;
	return list[t.seq % list.length] ?? CONTACTS[0];
}
/** Deterministic outcome: roughly one in four simulated tickets is rejected. */
function simulatedOutcome(seq) {
	return seq % 4 === 0 ? "rechazada" : "resuelta";
}
function asPerson(c) {
	return {
		name: c.name,
		email: c.email,
		role: c.role
	};
}
/** Moves a ticket through the simulated workflow according to elapsed time. */
function advanceTicket(input, now) {
	let t = input;
	const notes = [];
	const notify = (at, title, body) => notes.push({
		id: uid("n"),
		ticketId: t.id,
		code: t.code,
		title,
		body,
		at,
		read: false
	});
	for (let guard = 0; guard < 4; guard++) {
		if (t.status === "nueva" && now >= t.createdAt + 3e5) {
			const at = t.createdAt + ASSIGN_AFTER_MS;
			const who = asPerson(pickAssignee(t));
			t = {
				...t,
				status: "asignada",
				assignee: who,
				assignedAt: at,
				updatedAt: at,
				timeline: [...t.timeline, {
					id: uid("e"),
					kind: "asignada",
					at,
					description: `Asignado a ${who.name}.`
				}],
				comments: [...t.comments, {
					id: uid("c"),
					at: at + 1e3,
					author: who,
					fromStaff: true,
					body: `Hola, he tomado tu ${t.type === "incidencia" ? "incidencia" : "solicitud"}. Estoy revisando la información y te mantendré al tanto por este medio.`
				}]
			};
			notify(at, "Ticket asignado", `${who.name} está a cargo de “${t.title}”.`);
			notify(at + 1e3, "Nuevo comentario", `${who.name} comentó en tu ticket.`);
			continue;
		}
		if (t.status === "asignada" && t.assignedAt && now >= t.assignedAt + 6e5) {
			const at = t.assignedAt + RESOLVE_AFTER_MS;
			const outcome = simulatedOutcome(t.seq);
			const by = t.assignee;
			const summary = outcome === "resuelta" ? "Se revisó el caso y se aplicó la corrección correspondiente. Si el problema persiste, puedes reabrir el ticket una vez cerrado." : "La solicitud no corresponde a los servicios atendidos por esta área o no cuenta con la información necesaria. Puedes reabrir el ticket con más detalles.";
			t = {
				...t,
				status: outcome,
				resolution: {
					outcome,
					summary,
					at,
					by
				},
				updatedAt: at,
				timeline: [...t.timeline, {
					id: uid("e"),
					kind: outcome,
					at,
					description: outcome === "resuelta" ? "El responsable marcó el ticket como resuelto." : "El responsable rechazó el ticket."
				}]
			};
			notify(at, outcome === "resuelta" ? "Ticket resuelto" : "Ticket rechazado", `“${t.title}” fue ${outcome}.`);
			continue;
		}
		if ((t.status === "resuelta" || t.status === "rechazada") && t.resolution && now >= t.resolution.at + 3e5) {
			const at = t.resolution.at + CLOSE_AFTER_MS;
			t = {
				...t,
				status: "cerrada",
				closedAt: at,
				closedReason: "automatico",
				updatedAt: at,
				timeline: [...t.timeline, {
					id: uid("e"),
					kind: "cerrada",
					at,
					description: "El ticket se cerró automáticamente."
				}]
			};
			notify(at, "Ticket cerrado", `“${t.title}” fue cerrado. Puedes reabrirlo si lo necesitas.`);
			continue;
		}
		break;
	}
	return {
		ticket: t,
		notifications: notes
	};
}
/** Next simulated milestone for a ticket, if any. */
function nextMilestone(t) {
	if (t.status === "nueva") return {
		label: "Asignación estimada",
		at: t.createdAt + ASSIGN_AFTER_MS
	};
	if (t.status === "asignada" && t.assignedAt) return {
		label: "Respuesta estimada",
		at: t.assignedAt + RESOLVE_AFTER_MS
	};
	if ((t.status === "resuelta" || t.status === "rechazada") && t.resolution) return {
		label: "Cierre automático",
		at: t.resolution.at + CLOSE_AFTER_MS
	};
	return null;
}
//#endregion
//#region src/lib/usm/store.ts
var DATA_KEY = "usm-denuncia:data:v1";
var SESSION_KEY = "usm-denuncia:session:v1";
var EMPTY = {
	tickets: [],
	notifications: [],
	seq: 1040,
	seeded: false
};
function createPersisted(key, fallback) {
	let state = fallback;
	let loaded = false;
	const listeners = /* @__PURE__ */ new Set();
	const load = () => {
		if (loaded || typeof window === "undefined") return;
		loaded = true;
		try {
			const raw = window.localStorage.getItem(key);
			if (raw) state = JSON.parse(raw);
		} catch {
			state = fallback;
		}
	};
	const persist = () => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(key, JSON.stringify(state));
		} catch {
			try {
				const stripped = JSON.parse(JSON.stringify(state, (k, v) => k === "dataUrl" ? void 0 : v));
				window.localStorage.setItem(key, JSON.stringify(stripped));
			} catch {}
		}
	};
	if (typeof window !== "undefined") window.addEventListener("storage", (e) => {
		if (e.key !== key) return;
		loaded = false;
		load();
		listeners.forEach((l) => l());
	});
	return {
		get: () => {
			load();
			return state;
		},
		server: () => fallback,
		set: (next) => {
			load();
			state = typeof next === "function" ? next(state) : next;
			persist();
			listeners.forEach((l) => l());
		},
		subscribe: (l) => {
			listeners.add(l);
			return () => listeners.delete(l);
		}
	};
}
var data = createPersisted(DATA_KEY, EMPTY);
var session = createPersisted(SESSION_KEY, null);
function useData() {
	return useSyncExternalStore(data.subscribe, data.get, data.server);
}
function useTickets() {
	return useData().tickets;
}
function useTicket(id) {
	const tickets = useTickets();
	return id ? tickets.find((t) => t.id === id) : void 0;
}
function useNotifications() {
	return useData().notifications;
}
function useSession() {
	return useSyncExternalStore(session.subscribe, session.get, session.server);
}
var noopSubscribe = () => () => {};
/** False during SSR and the hydration render, true afterwards. */
function useHydrated() {
	return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
var DEFAULT_PROFILE = {
	name: "Estudiante",
	email: "estudiante@usm.cl"
};
function signInWithMicrosoft() {
	session.set(DEFAULT_PROFILE);
	seedIfEmpty(DEFAULT_PROFILE);
	return DEFAULT_PROFILE;
}
function signOut() {
	session.set(null);
}
function note(t, title, body, at = Date.now()) {
	return {
		id: uid("n"),
		ticketId: t.id,
		code: t.code,
		title,
		body,
		at,
		read: false
	};
}
function buildTicket(seq, owner, d, at) {
	const year = new Date(at).getFullYear();
	return {
		id: uid("t"),
		seq,
		year,
		code: ticketCode(year, seq),
		ownerEmail: owner.email,
		type: d.type,
		categoryId: d.categoryId,
		location: { ...d.location },
		title: d.title.trim(),
		description: d.description.trim(),
		onBehalfOf: d.onBehalfOf.trim(),
		attachments: d.attachments,
		status: "nueva",
		createdAt: at,
		updatedAt: at,
		timeline: [{
			id: uid("e"),
			kind: "creada",
			at,
			description: "Ticket ingresado por el usuario."
		}],
		comments: [],
		history: []
	};
}
function createTicket(owner, d) {
	const now = Date.now();
	let created;
	data.set((s) => {
		const seq = s.seq + 1;
		created = buildTicket(seq, owner, d, now);
		return {
			...s,
			seq,
			tickets: [created, ...s.tickets],
			notifications: [note(created, "Ticket creado", "Será asignado a un responsable en un mínimo de 5 minutos.", now), ...s.notifications]
		};
	});
	return created;
}
function updateTicket(id, d) {
	const now = Date.now();
	let result = {
		ok: false,
		limited: false,
		changes: 0
	};
	data.set((s) => ({
		...s,
		tickets: s.tickets.map((t) => {
			if (t.id !== id) return t;
			const scope = editScope(t);
			if (scope === "ninguna") return t;
			const before = draftFromTicket(t);
			const allowed = applyDraft(t, d);
			const entries = diffDraft(before, allowed, now);
			result = {
				ok: true,
				limited: scope === "limitada",
				changes: entries.length
			};
			if (!entries.length) return t;
			return {
				...t,
				type: allowed.type,
				categoryId: allowed.categoryId,
				location: { ...allowed.location },
				title: allowed.title.trim(),
				description: allowed.description.trim(),
				onBehalfOf: allowed.onBehalfOf.trim(),
				attachments: allowed.attachments,
				updatedAt: now,
				history: [...entries, ...t.history]
			};
		})
	}));
	return result;
}
function deleteTicket(id) {
	let ok = false;
	data.set((s) => {
		const t = s.tickets.find((x) => x.id === id);
		if (!t || !canDelete(t)) return s;
		ok = true;
		return {
			...s,
			tickets: s.tickets.filter((x) => x.id !== id),
			notifications: s.notifications.filter((n) => n.ticketId !== id)
		};
	});
	return ok;
}
function cancelTicket(id) {
	const now = Date.now();
	let ok = false;
	data.set((s) => ({
		...s,
		tickets: s.tickets.map((t) => {
			if (t.id !== id || !canCancel(t)) return t;
			ok = true;
			return {
				...t,
				status: "cerrada",
				closedAt: now,
				closedReason: "cancelado",
				updatedAt: now,
				timeline: [...t.timeline, {
					id: uid("e"),
					kind: "cancelada",
					at: now,
					description: "Cerrado por el usuario."
				}]
			};
		})
	}));
	return ok;
}
function reopenTicket(owner, id, d) {
	const now = Date.now();
	let created = null;
	data.set((s) => {
		const old = s.tickets.find((t) => t.id === id);
		if (!old || !canReopen(old)) return s;
		const seq = s.seq + 1;
		const base = draftFromTicket(old);
		const next = buildTicket(seq, owner, {
			...base,
			title: d.title,
			description: d.description,
			attachments: d.attachments
		}, now);
		next.reopenedFrom = {
			id: old.id,
			code: old.code
		};
		next.timeline = [{
			id: uid("e"),
			kind: "reabierta",
			at: now,
			description: `Reabierto a partir de ${old.code}.`
		}];
		next.history = diffDraft(base, draftFromTicket(next), now);
		created = next;
		return {
			...s,
			seq,
			tickets: [next, ...s.tickets.map((t) => t.id === old.id ? {
				...t,
				reopenedAs: {
					id: next.id,
					code: next.code
				},
				updatedAt: now
			} : t)],
			notifications: [note(next, "Ticket reabierto", `Se creó ${next.code} a partir de ${old.code}.`, now), ...s.notifications]
		};
	});
	return created;
}
function addComment(id, author, body) {
	const now = Date.now();
	data.set((s) => ({
		...s,
		tickets: s.tickets.map((t) => t.id === id ? {
			...t,
			updatedAt: now,
			comments: [...t.comments, {
				id: uid("c"),
				at: now,
				author,
				fromStaff: false,
				body: body.trim()
			}]
		} : t)
	}));
}
function markNotificationRead(id) {
	data.set((s) => ({
		...s,
		notifications: s.notifications.map((n) => n.id === id ? {
			...n,
			read: true
		} : n)
	}));
}
function markAllNotificationsRead() {
	data.set((s) => ({
		...s,
		notifications: s.notifications.map((n) => ({
			...n,
			read: true
		}))
	}));
}
/** Advances every ticket in the simulated workflow. Returns new notifications. */
function tick(now = Date.now()) {
	const current = data.get();
	const fresh = [];
	let changed = false;
	const tickets = current.tickets.map((t) => {
		const r = advanceTicket(t, now);
		if (r.ticket !== t) changed = true;
		fresh.push(...r.notifications);
		return r.ticket;
	});
	if (!changed) return [];
	data.set((s) => ({
		...s,
		tickets,
		notifications: [...fresh.sort((a, b) => b.at - a.at), ...s.notifications]
	}));
	return fresh;
}
function seedIfEmpty(owner) {
	if (data.get().seeded) return;
	const now = Date.now();
	const noFiles = [];
	const closedAt = now - 4320 * MINUTE;
	const closed = advanceTicket(buildTicket(1041, owner, {
		type: "incidencia",
		categoryId: "inc-red",
		location: {
			campus: "Casa Central Valparaíso",
			building: "Edificio C",
			room: "C-210"
		},
		title: "Sin conexión a la red Wi-Fi en el edificio C",
		description: "Desde la mañana la red institucional no permite autenticarse en el segundo piso del edificio C. Afecta a varios estudiantes durante las clases.",
		onBehalfOf: "",
		attachments: noFiles
	}, closedAt), now);
	const assignedAt = now - 8 * MINUTE;
	const assigned = advanceTicket(buildTicket(1042, owner, {
		type: "requerimiento",
		categoryId: "req-matlab",
		location: {
			campus: "Campus Santiago San Joaquín",
			building: "Edificio A",
			room: ""
		},
		title: "Licencia de Matlab para curso de métodos numéricos",
		description: "Necesito activar la licencia institucional de Matlab con el toolbox de optimización para el curso de métodos numéricos de este semestre.",
		onBehalfOf: "",
		attachments: noFiles
	}, assignedAt), now);
	data.set({
		tickets: [assigned.ticket, closed.ticket],
		notifications: [...assigned.notifications.map((n) => ({
			...n,
			read: false
		})), ...closed.notifications.map((n) => ({
			...n,
			read: true
		}))].sort((a, b) => b.at - a.at),
		seq: 1042,
		seeded: true
	});
}
//#endregion
//#region src/components/usm/app-shell.tsx
function AppShell({ children }) {
	const hydrated = useHydrated();
	const session = useSession();
	const navigate = useNavigate();
	useEffect(() => {
		if (hydrated && !session) navigate({
			to: "/login",
			replace: true
		});
	}, [
		hydrated,
		session,
		navigate
	]);
	useEffect(() => {
		if (!session) return;
		const run = () => {
			tick().slice(0, 3).forEach((n) => toast(n.title, { description: `${n.code} · ${n.body}` }));
		};
		tick();
		const id = window.setInterval(run, 3e3);
		return () => window.clearInterval(id);
	}, [session]);
	if (!hydrated || !session) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ jsx("div", { className: "size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(SiteHeader, {
				items: NAVIGATION,
				actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(NotificationsMenu, {}), /* @__PURE__ */ jsx(ProfileMenu, {
					name: session.name,
					email: session.email
				})] })
			}),
			/* @__PURE__ */ jsx("main", {
				className: "min-h-[calc(100dvh-70px)] [&>div:first-child]:w-full animate-rise flex flex-col",
				children
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "mt-6 bg-surface w-full border-t border-border/70",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-center mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground sm:px-6 w-full gap-6",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"© Universidad Técnica Federico Santa María ",
						/* @__PURE__ */ jsx("br", {}),
						"USM Denuncia · Plataforma de reportes y solicitudes de la comunidad universitaria"
					] }), /* @__PURE__ */ jsx("a", {
						className: "underline",
						href: "mailto:soporte.denuncia@usm.cl",
						children: "soporte.denuncia@usm.cl"
					})]
				})
			})
		]
	});
}
/** Shared top bar (desktop nav + mobile side menu), built from a navigation list. */
function SiteHeader({ items, actions, brand, brandLinkTo }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = useCallback(() => setMenuOpen(false), []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-surface",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-[70px] max-w-6xl items-center gap-2 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					className: "md:hidden",
					"aria-label": menuOpen ? "Cerrar menú" : "Abrir menú",
					"aria-expanded": menuOpen,
					"aria-controls": "mobile-menu",
					onClick: () => setMenuOpen((o) => !o),
					children: menuOpen ? /* @__PURE__ */ jsx(X, {}) : /* @__PURE__ */ jsx(Menu, {})
				}),
				/* @__PURE__ */ jsx(Link, {
					to: brandLinkTo ?? "/",
					className: "mr-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full flex justify-center items-center",
					children: brand ?? /* @__PURE__ */ jsx(Wordmark, {})
				}),
				/* @__PURE__ */ jsx(DesktopNav, { items }),
				actions && /* @__PURE__ */ jsx("div", {
					className: "ml-auto flex items-center gap-1.5",
					children: actions
				})
			]
		})
	}), /* @__PURE__ */ jsx(MobileMenuPanel, {
		items,
		open: menuOpen,
		onClose: closeMenu
	})] });
}
function NavAnchor({ item, className, children, onNavigate }) {
	if (item.to === void 0) return /* @__PURE__ */ jsx("a", {
		href: item.href,
		target: "_blank",
		rel: "noreferrer",
		className,
		onClick: onNavigate,
		children
	});
	return /* @__PURE__ */ jsx(Link, {
		to: item.to,
		activeOptions: { exact: !!item.exact },
		activeProps: { "data-active": "true" },
		className,
		onClick: onNavigate,
		children
	});
}
function DesktopNav({ items }) {
	return /* @__PURE__ */ jsx("nav", {
		className: "hidden h-full items-center gap-1 md:flex",
		children: items.map((item) => isNavGroup(item) ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "nav",
				size: "sm",
				className: "gap-1 data-[state=open]:bg-accent data-[state=open]:text-foreground",
				children: [item.label, /* @__PURE__ */ jsx(ChevronDown, { className: "transition-transform duration-200 [[data-state=open]>&]:rotate-180" })]
			})
		}), /* @__PURE__ */ jsx(DropdownMenuContent, {
			align: "start",
			className: "w-60 p-1.5",
			children: item.children.map((child) => {
				const Icon = child.icon;
				return /* @__PURE__ */ jsx(DropdownMenuItem, {
					asChild: true,
					className: "cursor-pointer gap-3 rounded-md p-2.5",
					children: /* @__PURE__ */ jsxs(NavAnchor, {
						item: child,
						children: [Icon && /* @__PURE__ */ jsx(Icon, { className: "size-4" }), /* @__PURE__ */ jsxs("span", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium",
								children: child.label
							}), child.description && /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: child.description
							})]
						})]
					})
				}, child.label);
			})
		})] }, item.label) : /* @__PURE__ */ jsx(Button, {
			variant: "nav",
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ jsx(NavAnchor, {
				item,
				children: item.label
			})
		}, item.label))
	});
}
var mobileRow = "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:bg-accent data-[active=true]:text-primary";
function MobileMenuPanel({ items, open, onClose }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	useEffect(() => {
		onClose();
	}, [pathname, onClose]);
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e) => e.key === "Escape" && onClose();
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
	const activeGroups = items.filter((item) => isNavGroup(item) && item.children.some((c) => c.to && (c.to === "/" ? pathname === "/" : pathname.startsWith(c.to)))).map((g) => g.label);
	return /* @__PURE__ */ jsxs("div", {
		id: "mobile-menu",
		inert: !open,
		"aria-hidden": !open,
		className: cn("fixed inset-x-0 bottom-0 top-[70px] z-30 transition-[visibility] duration-300 md:hidden", open ? "visible" : "invisible"),
		children: [/* @__PURE__ */ jsx("div", {
			onClick: onClose,
			className: cn("absolute inset-0 bg-foreground/25 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")
		}), /* @__PURE__ */ jsx("nav", {
			"aria-label": "Navegación principal",
			className: cn("absolute inset-y-0 left-0 flex w-full max-w-xs flex-col overflow-y-auto border-r border-border/70 bg-surface p-3 shadow-xl transition-transform duration-300 ease-out", open ? "translate-x-0" : "-translate-x-full"),
			children: /* @__PURE__ */ jsx(Accordion, {
				type: "multiple",
				defaultValue: activeGroups,
				className: "flex flex-col gap-0.5",
				children: items.map((item) => isNavGroup(item) ? /* @__PURE__ */ jsxs(AccordionItem, {
					value: item.label,
					className: "border-b-0",
					children: [/* @__PURE__ */ jsx(AccordionTrigger, {
						className: cn(mobileRow, "hover:no-underline"),
						children: item.label
					}), /* @__PURE__ */ jsx(AccordionContent, {
						className: "pb-1",
						children: /* @__PURE__ */ jsx("div", {
							className: "ml-4 flex flex-col gap-0.5 border-l border-border pl-2",
							children: item.children.map((child) => {
								const Icon = child.icon;
								return /* @__PURE__ */ jsxs(NavAnchor, {
									item: child,
									onNavigate: onClose,
									className: cn(mobileRow, "py-2.5 text-sm text-muted-foreground"),
									children: [Icon && /* @__PURE__ */ jsx(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
										className: "flex-1",
										children: child.label
									})]
								}, child.label);
							})
						})
					})]
				}, item.label) : /* @__PURE__ */ jsx(NavAnchor, {
					item,
					onNavigate: onClose,
					className: mobileRow,
					children: item.label
				}, item.label))
			})
		})]
	});
}
function NotificationsMenu() {
	const notifications = useNotifications();
	const navigate = useNavigate();
	const unread = notifications.filter((n) => !n.read).length;
	return /* @__PURE__ */ jsxs(Popover, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(Button, {
			variant: "ghost",
			size: "icon",
			className: "relative rounded-full",
			"aria-label": `Notificaciones (${unread} sin leer)`,
			children: [/* @__PURE__ */ jsx(Bell, { className: "size-[18px]" }), unread > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold leading-4 text-signal-foreground tabular",
				children: unread > 9 ? "9+" : unread
			})]
		})
	}), /* @__PURE__ */ jsxs(PopoverContent, {
		align: "end",
		className: "w-[360px] p-0",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b px-4 py-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm font-semibold",
				children: "Notificaciones"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: unread ? `${unread} sin leer` : "Estás al día"
			})] }), unread > 0 && /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				onClick: markAllNotificationsRead,
				className: "text-xs",
				children: [/* @__PURE__ */ jsx(CheckCheck, {}), " Marcar todo"]
			})]
		}), notifications.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-2 px-6 py-10 text-center",
			children: [/* @__PURE__ */ jsx(Bell, { className: "size-5 text-muted-foreground" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Aún no tienes notificaciones."
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "max-h-[420px] overflow-y-scroll",
			children: /* @__PURE__ */ jsx("ul", {
				className: "divide-y",
				children: notifications.slice(0, 40).map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						markNotificationRead(n.id);
						navigate({
							to: "/tickets",
							search: { ticket: n.ticketId }
						});
					},
					className: cn("flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60", !n.read && "bg-accent/40"),
					children: [/* @__PURE__ */ jsx("span", { className: cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary") }), /* @__PURE__ */ jsxs("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "truncate text-sm font-medium",
									children: n.title
								}), /* @__PURE__ */ jsx("span", {
									className: "shrink-0 text-[11px] text-muted-foreground",
									children: timeAgo(n.at)
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-0.5 block font-mono text-[11px] text-muted-foreground",
								children: n.code
							}),
							/* @__PURE__ */ jsx("span", {
								className: "mt-0.5 line-clamp-2 block text-xs text-muted-foreground",
								children: n.body
							})
						]
					})]
				}) }, n.id))
			})
		})]
	})] });
}
function ProfileMenu({ name, email }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "group flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent py-1 pl-1 pr-2.5 transition-colors hover:border-border hover:bg-card data-[state=open]:border-border data-[state=open]:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			"aria-label": "Abrir menú de perfil",
			children: [/* @__PURE__ */ jsx("span", {
				className: "flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border",
				children: /* @__PURE__ */ jsx(UserRound, { className: "size-4" })
			}), /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" })]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		className: "w-64",
		children: [
			/* @__PURE__ */ jsxs(DropdownMenuLabel, {
				className: "flex items-center gap-3 py-2.5 font-normal",
				children: [/* @__PURE__ */ jsx("span", {
					className: "flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-1 ring-border",
					children: /* @__PURE__ */ jsx(UserRound, { className: "size-5" })
				}), /* @__PURE__ */ jsxs("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block truncate text-sm font-semibold",
						children: name
					}), /* @__PURE__ */ jsx("span", {
						className: "block truncate text-xs text-muted-foreground",
						children: email
					})]
				})]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "cursor-pointer text-destructive focus:text-destructive",
				onSelect: () => {
					signOut();
					navigate({ to: "/login" });
				},
				children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), " Cerrar sesión"]
			})
		]
	})] });
}
function PageHeader({ eyebrow, title, description, actions }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			eyebrow && /* @__PURE__ */ jsx("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-semibold sm:text-[34px]",
				children: title
			}),
			description && /* @__PURE__ */ jsx("p", {
				className: "mt-2 max-w-xl text-muted-foreground",
				children: description
			})
		] }), actions && /* @__PURE__ */ jsx("div", {
			className: "flex shrink-0 gap-2",
			children: actions
		})]
	});
}
//#endregion
export { validateDraft as A, countdown as B, editScope as C, selectType as D, selectCategory as E, TICKET_TYPES as F, MicrosoftLogo as G, initials as H, categoriesFor as I, buttonVariants as J, Wordmark as K, getCategory as L, CONTACTS as M, SUPPORT_EMAIL as N, typeLabel as O, TEAMS as P, PUBLIC_NAVIGATION as R, draftFromTicket as S, nextMilestone as T, timeAgo as U, dateTime as V, useNow as W, cn as Y, STATUS_ORDER as _, cancelTicket as a, canDelete as b, reopenTicket as c, useHydrated as d, useSession as f, STATUS_LABEL as g, MAX_FILE_BYTES as h, addComment as i, CAMPUSES as j, uid as k, signInWithMicrosoft as l, useTickets as m, PageHeader as n, createTicket as o, useTicket as p, Button as q, SiteHeader as r, deleteTicket as s, AppShell as t, updateTicket as u, canCancel as v, emptyDraft as w, canReopen as x, canComment as y, bytes as z };
