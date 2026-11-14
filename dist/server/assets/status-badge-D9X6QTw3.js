import { Y as cn, g as STATUS_LABEL } from "./app-shell-Cfw1d0h6.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
//#region src/components/usm/status-badge.tsx
var statusVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", { variants: { status: {
	nueva: "bg-status-new-soft text-status-new",
	asignada: "bg-status-assigned-soft text-status-assigned",
	resuelta: "bg-status-resolved-soft text-status-resolved",
	rechazada: "bg-status-rejected-soft text-status-rejected",
	cerrada: "bg-status-closed-soft text-status-closed",
	reabierta: "bg-status-reopened-soft text-status-reopened"
} } });
function StatusBadge({ status, className }) {
	const live = status === "nueva" || status === "asignada";
	return /* @__PURE__ */ jsxs("span", {
		className: cn(statusVariants({ status }), className),
		children: [/* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full bg-current", live && "animate-pulse-dot") }), STATUS_LABEL[status]]
	});
}
function ReopenedBadge({ className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn(statusVariants({ status: "reabierta" }), className),
		children: "Reabierto"
	});
}
var statusDotVariants = cva("size-2.5 rounded-full ring-4", { variants: { kind: {
	creada: "bg-status-new ring-status-new-soft",
	reabierta: "bg-status-reopened ring-status-reopened-soft",
	asignada: "bg-status-assigned ring-status-assigned-soft",
	resuelta: "bg-status-resolved ring-status-resolved-soft",
	rechazada: "bg-status-rejected ring-status-rejected-soft",
	cerrada: "bg-status-closed ring-status-closed-soft",
	cancelada: "bg-status-closed ring-status-closed-soft",
	pendiente: "bg-border ring-muted"
} } });
//#endregion
export { StatusBadge as n, statusDotVariants as r, ReopenedBadge as t };
