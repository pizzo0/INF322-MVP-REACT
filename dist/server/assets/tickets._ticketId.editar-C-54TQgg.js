import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/tickets.$ticketId.editar.tsx
var $$splitComponentImporter = () => import("./tickets._ticketId.editar-BeO0BZyi.js");
var Route = createFileRoute("/tickets/$ticketId/editar")({
	head: () => ({ meta: [
		{ title: "Editar ticket | USM Denuncia" },
		{
			name: "description",
			content: "Modifica o reabre uno de tus tickets."
		},
		{
			property: "og:title",
			content: "Editar ticket"
		},
		{
			property: "og:description",
			content: "Modifica o reabre uno de tus tickets."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
