import { f as useSession, m as useTickets, t as AppShell } from "./app-shell-Cfw1d0h6.js";
import { n as TicketRow, t as TicketDetailDialog } from "./ticket-detail-dialog-B2NSciiO.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, FilePlus2, Inbox } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Home() {
	const session = useSession();
	const tickets = useTickets();
	const [open, setOpen] = useState(null);
	const mine = tickets.filter((t) => t.ownerEmail === session?.email);
	const active = mine.filter((t) => t.status === "asignada").length;
	const answered = mine.filter((t) => t.status === "resuelta").length;
	const rejected = mine.filter((t) => t.status === "rechazada").length;
	const closed = mine.filter((t) => t.status === "cerrada").length;
	const recent = [...mine].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("section", {
			className: "border-b bg-hero-gradient",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-muted-foreground",
						children: ["Hola, ", session?.name]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-1 max-w-2xl text-4xl font-semibold leading-[1.1] sm:text-[44px]",
						children: "¿Qué necesitas reportar hoy?"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/tickets/nuevo",
							className: "group flex flex-col overflow-hidden rounded-2xl bg-ink-gradient p-6 text-ink-foreground shadow-lift transition-transform duration-200 hover:-translate-y-0.5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "flex size-11 items-center justify-center rounded-xl bg-ink-foreground/10",
									children: /* @__PURE__ */ jsx(FilePlus2, { className: "size-5" })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-auto pt-6 font-display text-2xl font-semibold",
									children: "Crear ticket"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-ink-foreground/70",
									children: "Reporta una incidencia o realiza un requerimiento en pocos pasos."
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "mt-5 inline-flex items-center gap-1.5 text-sm font-medium",
									children: [
										"Comenzar",
										" ",
										/* @__PURE__ */ jsx(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-1" })
									]
								})
							]
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/tickets",
							className: "group flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground",
									children: /* @__PURE__ */ jsx(Inbox, { className: "size-5" })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-auto pt-6 font-display text-2xl font-semibold",
									children: "Mis tickets"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4",
									children: [
										/* @__PURE__ */ jsx(Stat, {
											value: active,
											label: "Asignados",
											tone: "text-status-assigned"
										}),
										/* @__PURE__ */ jsx(Stat, {
											value: answered,
											label: "Resueltos",
											tone: "text-status-resolved"
										}),
										/* @__PURE__ */ jsx(Stat, {
											value: rejected,
											label: "Rechazados",
											tone: "text-status-rejected"
										}),
										/* @__PURE__ */ jsx(Stat, {
											value: closed,
											label: "Cerrados",
											tone: "text-status-closed"
										})
									]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary",
									children: [
										"Ver todos",
										" ",
										/* @__PURE__ */ jsx(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-1" })
									]
								})
							]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 w-full",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-semibold",
					children: "Actividad reciente"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Tus tickets con cambios más recientes."
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/tickets",
					className: "text-sm font-medium text-primary hover:underline",
					children: "Ver todos"
				})]
			}), recent.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-dashed bg-card px-6 py-12 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium",
					children: "Aún no has creado tickets"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Cuando reportes un problema, podrás seguirlo desde aquí."
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-2.5",
				children: recent.map((t) => /* @__PURE__ */ jsx(TicketRow, {
					ticket: t,
					onOpen: setOpen
				}, t.id))
			})]
		}),
		/* @__PURE__ */ jsx(TicketDetailDialog, {
			ticketId: open,
			onClose: () => setOpen(null),
			onOpenTicket: setOpen
		})
	] });
}
function Stat({ value, label, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl bg-muted/60 px-3 py-2.5",
		children: [/* @__PURE__ */ jsx("p", {
			className: `font-display text-2xl font-semibold tabular ${tone}`,
			children: value
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: label
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(Home, {}) });
//#endregion
export { SplitComponent as component };
