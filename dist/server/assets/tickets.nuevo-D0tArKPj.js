import { f as useSession, o as createTicket, t as AppShell, w as emptyDraft } from "./app-shell-Cfw1d0h6.js";
import { t as TicketWizard } from "./ticket-wizard-T4kU-m9z.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
//#region src/routes/tickets.nuevo.tsx?tsr-split=component
function NewTicket() {
	const session = useSession();
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs("div", {
		className: "h-[calc(100dvh-4rem)] min-h-0 flex flex-col mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6",
		children: [/* @__PURE__ */ jsxs(Link, {
			to: "/tickets",
			className: "mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit",
			children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), " Mis tickets"]
		}), /* @__PURE__ */ jsx(TicketWizard, {
			mode: "crear",
			initial: emptyDraft(),
			limited: false,
			onCancel: () => navigate({ to: "/tickets" }),
			onSubmit: (d) => {
				if (!session) return;
				const t = createTicket(session, d);
				toast.success(`Ticket ${t.code} creado`, { description: "Será asignado en un mínimo de 5 minutos." });
				navigate({
					to: "/tickets",
					search: { ticket: t.id }
				});
			}
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(NewTicket, {}) });
//#endregion
export { SplitComponent as component };
