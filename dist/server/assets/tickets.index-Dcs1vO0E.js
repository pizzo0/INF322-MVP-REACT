import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/tickets.index.tsx
var $$splitComponentImporter = () => import("./tickets.index-MXnYHslg.js");
var Route = createFileRoute("/tickets/")({
	validateSearch: (s) => typeof s["ticket"] === "string" ? { ticket: s["ticket"] } : {},
	head: () => ({ meta: [
		{ title: "Mis tickets | USM Denuncia" },
		{
			name: "description",
			content: "Revisa el estado, responsable y seguimiento de tus tickets."
		},
		{
			property: "og:title",
			content: "Mis tickets"
		},
		{
			property: "og:description",
			content: "Revisa el estado, responsable y seguimiento de tus tickets."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
