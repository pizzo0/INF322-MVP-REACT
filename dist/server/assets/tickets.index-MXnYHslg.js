import { t as Route } from "./tickets.index-Dcs1vO0E.js";
import { J as buttonVariants, Y as cn, _ as STATUS_ORDER, f as useSession, g as STATUS_LABEL, m as useTickets, n as PageHeader, q as Button, t as AppShell } from "./app-shell-Cfw1d0h6.js";
import { n as TicketRow, t as TicketDetailDialog } from "./ticket-detail-dialog-B2NSciiO.js";
import { t as Input } from "./input-B_vZaZ-C.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DL7u3cSj.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, FilePlus2, Search, SlidersHorizontal, X } from "lucide-react";
//#region src/routes/tickets.index.tsx?tsr-split=component
function TicketsPage() {
	const { ticket: openId } = Route.useSearch();
	const navigate = useNavigate({ from: "/tickets/" });
	const session = useSession();
	const all = useTickets();
	const mine = useMemo(() => all.filter((t) => t.ownerEmail === session?.email), [all, session]);
	const [q, setQ] = useState("");
	const [status, setStatus] = useState("todos");
	const [reopened, setReopened] = useState(false);
	const [type, setType] = useState("todos");
	const [assignee, setAssignee] = useState("todos");
	const [sort, setSort] = useState("recientes");
	const assignees = useMemo(() => Array.from(new Set(mine.map((t) => t.assignee?.name).filter(Boolean))).sort(), [mine]);
	const counts = useMemo(() => {
		const c = {
			todos: mine.length,
			reabierto: mine.filter((t) => t.reopenedFrom).length
		};
		STATUS_ORDER.forEach((s) => c[s] = mine.filter((t) => t.status === s).length);
		return c;
	}, [mine]);
	const list = useMemo(() => {
		const term = q.trim().toLowerCase();
		const sorted = [...mine.filter((t) => {
			if (status !== "todos" && t.status !== status) return false;
			if (reopened && !t.reopenedFrom) return false;
			if (type !== "todos" && t.type !== type) return false;
			if (assignee === "sin-asignar" && t.assignee) return false;
			if (assignee !== "todos" && assignee !== "sin-asignar" && t.assignee?.name !== assignee) return false;
			if (term && !`${t.title} ${t.code} ${t.assignee?.name ?? ""}`.toLowerCase().includes(term)) return false;
			return true;
		})];
		sorted.sort((a, b) => {
			switch (sort) {
				case "antiguos": return a.createdAt - b.createdAt;
				case "actualizados": return b.updatedAt - a.updatedAt;
				case "estado": return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.createdAt - a.createdAt;
				case "titulo": return a.title.localeCompare(b.title, "es");
				default: return b.createdAt - a.createdAt;
			}
		});
		return sorted;
	}, [
		mine,
		q,
		status,
		reopened,
		type,
		assignee,
		sort
	]);
	const [page, setPage] = useState(1);
	const [PAGE_SIZE, setPageSize] = useState(10);
	const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
	const safePage = Math.min(page, pages);
	useEffect(() => setPage(1), [
		q,
		status,
		reopened,
		type,
		assignee,
		sort,
		PAGE_SIZE
	]);
	const filtersOn = q || status !== "todos" || reopened || type !== "todos" || assignee !== "todos";
	const open = (id) => navigate({
		search: id ? { ticket: id } : {},
		replace: !id
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 pt-10 sm:px-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: "Tickets",
				title: "Mis tickets",
				description: "Revisa el estado de tus incidencias y requerimientos, quién está a cargo y su seguimiento.",
				actions: /* @__PURE__ */ jsxs(Link, {
					to: "/tickets/nuevo",
					className: buttonVariants({ variant: "hero" }),
					children: [/* @__PURE__ */ jsx(FilePlus2, {}), " Crear ticket"]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mb-4 flex gap-1.5 overflow-x-auto pb-1",
				children: [
					"todos",
					...STATUS_ORDER,
					"reabierto"
				].map((s) => {
					const active = s === "todos" ? status === "todos" && !reopened : s === "reabierto" ? reopened : status === s;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						"aria-pressed": active,
						onClick: () => {
							if (s === "todos") {
								setStatus("todos");
								setReopened(false);
							} else if (s === "reabierto") setReopened((r) => !r);
							else setStatus(status === s ? "todos" : s);
						},
						className: cn("inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"),
						children: [s === "todos" ? "Todos" : s === "reabierto" ? "Reabierto" : STATUS_LABEL[s], /* @__PURE__ */ jsx("span", {
							className: cn("text-xs tabular", active ? "text-primary-foreground/70" : "text-muted-foreground"),
							children: counts[s]
						})]
					}, s);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-4 grid gap-2 rounded-2xl border bg-card p-2 shadow-soft md:grid-cols-[1fr_auto_auto_auto]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Buscar por título, código o responsable",
							className: "h-10 border-0 pl-9 shadow-none focus-visible:ring-0"
						})]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: type,
						onValueChange: (v) => setType(v),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							className: "h-10 md:w-44",
							"aria-label": "Filtrar por tipo",
							children: /* @__PURE__ */ jsx(SelectValue, {})
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "todos",
								children: "Todos los tipos"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "incidencia",
								children: "Incidencias"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "requerimiento",
								children: "Requerimientos"
							})
						] })]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: assignee,
						onValueChange: setAssignee,
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							className: "h-10 md:w-52",
							"aria-label": "Filtrar por responsable",
							children: /* @__PURE__ */ jsx(SelectValue, {})
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "todos",
								children: "Todos los responsables"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "sin-asignar",
								children: "Sin asignar"
							}),
							assignees.map((a) => /* @__PURE__ */ jsx(SelectItem, {
								value: a,
								children: a
							}, a))
						] })]
					}),
					/* @__PURE__ */ jsxs(Select, {
						value: sort,
						onValueChange: (v) => setSort(v),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							className: "h-10 md:w-48",
							"aria-label": "Ordenar",
							children: /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ jsx(SelectValue, {})]
							})
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "recientes",
								children: "Más recientes"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "antiguos",
								children: "Más antiguos"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "actualizados",
								children: "Última actualización"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "estado",
								children: "Por estado"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "titulo",
								children: "Título (A–Z)"
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-center justify-between text-sm text-muted-foreground",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					list.length,
					" ",
					list.length === 1 ? "ticket" : "tickets"
				] }), filtersOn && /* @__PURE__ */ jsxs(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => {
						setQ("");
						setStatus("todos");
						setReopened(false);
						setType("todos");
						setAssignee("todos");
					},
					children: [/* @__PURE__ */ jsx(X, {}), " Limpiar filtros"]
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-dashed bg-card px-6 py-14 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium",
					children: mine.length ? "No hay tickets que coincidan" : "Aún no has creado tickets"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: mine.length ? "Prueba con otros filtros o términos de búsqueda." : "Crea tu primer ticket para comenzar a darle seguimiento."
				})]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsxs("nav", {
					"aria-label": "Paginación",
					className: "my-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: Array.from({ length: pages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx(Button, {
							variant: n === safePage ? "default" : "ghost",
							size: "sm",
							className: "w-9 tabular",
							"aria-current": n === safePage ? "page" : void 0,
							onClick: () => setPage(n),
							children: n
						}, n))
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs(Select, {
							value: String(PAGE_SIZE),
							onValueChange: (v) => setPageSize(Number(v)),
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "h-9 w-20",
								"aria-label": "Tickets por página",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsx(SelectContent, { children: [
								5,
								10,
								15,
								20
							].map((n) => /* @__PURE__ */ jsx(SelectItem, {
								value: String(n),
								children: n
							}, n)) })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								className: "size-9",
								"aria-label": "Página anterior",
								disabled: safePage === 1,
								onClick: () => setPage(safePage - 1),
								children: /* @__PURE__ */ jsx(ChevronLeft, {})
							}), /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								className: "size-9",
								"aria-label": "Página siguiente",
								disabled: safePage === pages,
								onClick: () => setPage(safePage + 1),
								children: /* @__PURE__ */ jsx(ChevronRight, {})
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid gap-2.5",
					children: list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE).map((t) => /* @__PURE__ */ jsx(TicketRow, {
						ticket: t,
						onOpen: open
					}, t.id))
				}),
				/* @__PURE__ */ jsxs("nav", {
					"aria-label": "Paginación",
					className: "mt-6 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: Array.from({ length: pages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx(Button, {
							variant: n === safePage ? "default" : "ghost",
							size: "sm",
							className: "w-9 tabular",
							"aria-current": n === safePage ? "page" : void 0,
							onClick: () => setPage(n),
							children: n
						}, n))
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs(Select, {
							value: String(PAGE_SIZE),
							onValueChange: (v) => setPageSize(Number(v)),
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "h-9 w-20",
								"aria-label": "Tickets por página",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsx(SelectContent, { children: [
								5,
								10,
								15,
								20
							].map((n) => /* @__PURE__ */ jsx(SelectItem, {
								value: String(n),
								children: n
							}, n)) })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								className: "size-9",
								"aria-label": "Página anterior",
								disabled: safePage === 1,
								onClick: () => setPage(safePage - 1),
								children: /* @__PURE__ */ jsx(ChevronLeft, {})
							}), /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon",
								className: "size-9",
								"aria-label": "Página siguiente",
								disabled: safePage === pages,
								onClick: () => setPage(safePage + 1),
								children: /* @__PURE__ */ jsx(ChevronRight, {})
							})]
						})]
					})]
				})
			] }),
			/* @__PURE__ */ jsx(TicketDetailDialog, {
				ticketId: openId ?? null,
				onClose: () => open(null),
				onOpenTicket: (id) => open(id)
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(TicketsPage, {}) });
//#endregion
export { SplitComponent as component };
