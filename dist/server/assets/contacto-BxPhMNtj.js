import { H as initials, M as CONTACTS, N as SUPPORT_EMAIL, P as TEAMS, n as PageHeader, t as AppShell } from "./app-shell-Cfw1d0h6.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Copy, Mail } from "lucide-react";
//#region src/routes/contacto.tsx?tsr-split=component
function copy(email) {
	navigator.clipboard?.writeText(email);
	toast.success("Correo copiado", { description: email });
}
function ContactPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 pt-10 sm:px-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: "Contacto",
				title: "Equipos de atención",
				description: "Estas son las personas que pueden ser asignadas a tus tickets y quienes administran la plataforma."
			}),
			/* @__PURE__ */ jsxs("a", {
				href: `mailto:${SUPPORT_EMAIL}`,
				className: "mb-10 flex flex-col gap-1 rounded-2xl bg-ink-gradient p-6 text-ink-foreground shadow-lift sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "font-display text-lg font-semibold",
					children: "Canal general de soporte"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-ink-foreground/70",
					children: "Para consultas sobre la plataforma que no correspondan a un ticket."
				})] }), /* @__PURE__ */ jsxs("span", {
					className: "mt-3 inline-flex items-center gap-2 font-mono text-sm sm:mt-0",
					children: [
						/* @__PURE__ */ jsx(Mail, { className: "size-4" }),
						" ",
						SUPPORT_EMAIL
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-10",
				children: TEAMS.map((team) => /* @__PURE__ */ jsxs("section", {
					className: "grid gap-4 lg:grid-cols-[260px_1fr]",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: team.name
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: team.description
					})] }), /* @__PURE__ */ jsx("ul", {
						className: "grid gap-2.5 sm:grid-cols-2",
						children: CONTACTS.filter((c) => c.team === team.id).map((c) => /* @__PURE__ */ jsxs("li", {
							className: "group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-soft",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground",
									children: initials(c.name)
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "truncate font-medium",
											children: c.name
										}),
										/* @__PURE__ */ jsx("p", {
											className: "truncate text-xs text-muted-foreground",
											children: c.role
										}),
										/* @__PURE__ */ jsx("a", {
											href: `mailto:${c.email}`,
											className: "mt-1 block truncate text-sm text-primary hover:underline",
											children: c.email
										})
									]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => copy(c.email),
									className: "cursor-pointer rounded-md p-2 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100",
									"aria-label": `Copiar correo de ${c.name}`,
									children: /* @__PURE__ */ jsx(Copy, { className: "size-4" })
								})
							]
						}, c.email))
					})]
				}, team.id))
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(ContactPage, {}) });
//#endregion
export { SplitComponent as component };
