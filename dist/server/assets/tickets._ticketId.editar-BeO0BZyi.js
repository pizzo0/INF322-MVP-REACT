import { t as Route } from "./tickets._ticketId.editar-C-54TQgg.js";
import { C as editScope, J as buttonVariants, S as draftFromTicket, c as reopenTicket, f as useSession, n as PageHeader, p as useTicket, t as AppShell, u as updateTicket, x as canReopen } from "./app-shell-Cfw1d0h6.js";
import { n as StatusBadge } from "./status-badge-D9X6QTw3.js";
import { t as TicketWizard } from "./ticket-wizard-T4kU-m9z.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
//#region src/routes/tickets.$ticketId.editar.tsx?tsr-split=component
function EditPage() {
	const { ticketId } = Route.useParams();
	const ticket = useTicket(ticketId);
	if (!ticket) return /* @__PURE__ */ jsx(Centered, {
		title: "Ticket no encontrado",
		text: "Es posible que haya sido eliminado."
	});
	if (ticket.status === "cerrada" && !canReopen(ticket)) return /* @__PURE__ */ jsx(Centered, {
		title: "Este ticket ya fue reabierto",
		text: `Puedes seguir el caso en ${ticket.reopenedAs?.code}.`
	});
	return /* @__PURE__ */ jsx(EditForm, { ticket }, ticket.id);
}
function EditForm({ ticket }) {
	const session = useSession();
	const navigate = useNavigate();
	const [mode] = useState(() => ticket.status === "cerrada" ? "reabrir" : "editar");
	const [limited] = useState(() => mode === "reabrir" || editScope(ticket) === "limitada");
	const [initial] = useState(() => draftFromTicket(ticket));
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 pt-8 sm:px-6",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/tickets",
				search: { ticket: ticket.id },
				className: "mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), " Volver al ticket"]
			}),
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: ticket.code,
				title: mode === "reabrir" ? "Reabrir ticket" : "Editar ticket",
				description: mode === "reabrir" ? "Se creará un nuevo ticket vinculado al anterior para retomar el caso." : "Los cambios quedarán registrados en el historial de modificaciones.",
				actions: /* @__PURE__ */ jsx(StatusBadge, {
					status: ticket.status,
					className: "text-sm"
				})
			}),
			/* @__PURE__ */ jsx(TicketWizard, {
				mode,
				initial,
				limited,
				onCancel: () => navigate({
					to: "/tickets",
					search: { ticket: ticket.id }
				}),
				onSubmit: (d) => {
					if (!session) return;
					if (mode === "reabrir") {
						const next = reopenTicket(session, ticket.id, d);
						if (!next) {
							toast.error("No fue posible reabrir el ticket.");
							return;
						}
						toast.success(`Ticket reabierto como ${next.code}`);
						navigate({
							to: "/tickets",
							search: { ticket: next.id }
						});
						return;
					}
					const r = updateTicket(ticket.id, d);
					if (!r.ok) toast.error("El ticket ya no puede modificarse.");
					else if (r.limited && !limited) toast.warning("El ticket fue asignado mientras editabas", { description: "Solo se guardaron el título, la descripción y los archivos." });
					else toast.success(r.changes ? "Cambios guardados" : "No hubo cambios");
					navigate({
						to: "/tickets",
						search: { ticket: ticket.id }
					});
				}
			})
		]
	});
}
function Centered({ title, text }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-md px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-muted-foreground",
				children: text
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/tickets",
				className: `${buttonVariants({ variant: "outline" })} mt-6`,
				children: "Ir a mis tickets"
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(EditPage, {}) });
//#endregion
export { SplitComponent as component };
