import { B as countdown, C as editScope, H as initials, J as buttonVariants, L as getCategory, O as typeLabel, T as nextMilestone, U as timeAgo, V as dateTime, W as useNow, Y as cn, a as cancelTicket, b as canDelete, f as useSession, i as addComment, p as useTicket, q as Button, s as deleteTicket, v as canCancel, x as canReopen, y as canComment, z as bytes } from "./app-shell-Cfw1d0h6.js";
import { n as StatusBadge, r as statusDotVariants, t as ReopenedBadge } from "./status-badge-D9X6QTw3.js";
import { n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-_9RsCzkG.js";
import { t as Textarea } from "./textarea-BCM7E4qZ.js";
import * as React from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowUpRight, Ban, CalendarClock, CheckCircle2, Clock3, FileText, History, MapPin, MessageSquare, Pencil, RotateCcw, Send, Trash2, UserRound, XCircle } from "lucide-react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
//#region src/components/usm/ticket-card.tsx
/** Only the date of the ticket's current stage: created, assigned, answered or closed. */
function ticketDates(t) {
	if (t.status === "cerrada" && t.closedAt) return [{
		label: "Cerrado",
		at: t.closedAt
	}];
	if ((t.status === "resuelta" || t.status === "rechazada") && t.resolution) return [{
		label: t.resolution.outcome === "resuelta" ? "Resuelto" : "Rechazado",
		at: t.resolution.at
	}];
	if (t.status === "asignada" && t.assignedAt) return [{
		label: "Asignado",
		at: t.assignedAt
	}];
	return [{
		label: "Creado",
		at: t.createdAt
	}];
}
function TicketRow({ ticket, onOpen, className }) {
	const category = getCategory(ticket.categoryId);
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: () => onOpen(ticket.id),
		className: cn("group grid w-full cursor-pointer grid-cols-1 gap-3 rounded-xl border bg-card p-4 text-left shadow-soft transition-all duration-200 hover:-translate-y-px hover:border-ring/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-5", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs font-medium text-muted-foreground",
							children: ticket.code
						}),
						/* @__PURE__ */ jsx(StatusBadge, { status: ticket.status }),
						ticket.reopenedFrom && /* @__PURE__ */ jsx(ReopenedBadge, {})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 truncate text-[15px] font-medium text-foreground",
					children: ticket.title
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-0.5 truncate text-xs text-muted-foreground",
					children: [
						typeLabel(ticket.type),
						" · ",
						category?.name ?? "Sin categoría",
						" · actualizado",
						" ",
						timeAgo(ticket.updatedAt)
					]
				}),
				/* @__PURE__ */ jsx("dl", {
					className: "mt-2 grid gap-0.5 text-xs text-muted-foreground",
					children: ticketDates(ticket).map((d) => /* @__PURE__ */ jsxs("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ jsx("dt", {
							className: "w-20 shrink-0",
							children: d.label
						}), /* @__PURE__ */ jsx("dd", {
							className: "tabular text-foreground/80",
							children: dateTime(d.at)
						})]
					}, d.label))
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-4 sm:justify-end",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ jsx("span", {
					className: cn("flex size-7 items-center justify-center rounded-full text-[11px] font-semibold", ticket.assignee ? "bg-accent text-accent-foreground" : "border border-dashed text-muted-foreground"),
					children: ticket.assignee ? ticket.assignee.name.split(" ").slice(0, 2).map((p) => p[0]).join("") : /* @__PURE__ */ jsx(UserRound, { className: "size-3.5" })
				}), /* @__PURE__ */ jsxs("span", {
					className: "flex flex-col leading-tight",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Responsable"
					}), /* @__PURE__ */ jsx("span", {
						className: cn("text-sm", !ticket.assignee && "text-muted-foreground"),
						children: ticket.assignee?.name ?? "Sin asignar"
					})]
				})]
			}), /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })]
		})]
	});
}
//#endregion
//#region src/components/ui/alert-dialog.tsx
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-overlay backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
//#endregion
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/components/usm/ticket-detail-dialog.tsx
var INCIDENT_LABEL = {
	creada: "Nueva incidencia",
	reabierta: "Ticket reabierto",
	asignada: "Incidencia asignada",
	resuelta: "Resuelta",
	rechazada: "Rechazada",
	cerrada: "Cerrada",
	cancelada: "Cerrada por el usuario"
};
var REQUEST_LABEL = {
	creada: "Nuevo requerimiento",
	reabierta: "Ticket reabierto",
	asignada: "Requerimiento asignado",
	resuelta: "Resuelto",
	rechazada: "Rechazado",
	cerrada: "Cerrado",
	cancelada: "Cerrado por el usuario"
};
function kindLabels(t) {
	return t.type === "requerimiento" ? REQUEST_LABEL : INCIDENT_LABEL;
}
function TicketDetailDialog({ ticketId, onClose, onOpenTicket }) {
	const ticket = useTicket(ticketId ?? void 0);
	return /* @__PURE__ */ jsx(Dialog, {
		open: !!ticketId && !!ticket,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ jsx(DialogContent, {
			className: "max-h-[92vh] max-w-4xl gap-0 overflow-y-auto p-0 sm:rounded-2xl",
			children: ticket && /* @__PURE__ */ jsx(DetailBody, {
				ticket,
				onClose,
				onOpenTicket
			})
		})
	});
}
function DetailBody({ ticket, onClose, onOpenTicket }) {
	const now = useNow(1e3);
	const category = getCategory(ticket.categoryId);
	const milestone = nextMilestone(ticket);
	const scope = editScope(ticket);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "border-b bg-hero-gradient px-6 pb-5 pt-6 sm:px-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 pr-8",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "rounded-md bg-card px-2 py-0.5 font-mono text-xs font-medium shadow-soft",
						children: ticket.code
					}),
					/* @__PURE__ */ jsx(StatusBadge, { status: ticket.status }),
					ticket.reopenedFrom && /* @__PURE__ */ jsx(ReopenedBadge, {})
				]
			}),
			/* @__PURE__ */ jsx(DialogTitle, {
				className: "mt-3 font-display text-2xl font-semibold leading-tight",
				children: ticket.title
			}),
			/* @__PURE__ */ jsxs(DialogDescription, {
				className: "mt-1 text-sm",
				children: [
					typeLabel(ticket.type),
					" · ",
					category?.name,
					" · creado ",
					timeAgo(ticket.createdAt)
				]
			}),
			milestone && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex items-center gap-3 rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ jsx(Clock3, { className: "size-4 shrink-0 text-primary" }),
					/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground",
						children: ticket.status === "nueva" ? "Tu ticket será asignado en un mínimo de 5 minutos. Mientras tanto, puedes editar todos sus datos." : `${milestone.label}:`
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ml-auto shrink-0 font-mono text-xs font-medium tabular",
						children: countdown(milestone.at - now)
					})
				]
			})
		]
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-0 md:grid-cols-[1fr_260px]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "min-w-0 px-6 py-5 sm:px-8",
			children: /* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "resumen",
				children: [
					/* @__PURE__ */ jsxs(TabsList, {
						className: "mb-5 w-full justify-start overflow-x-auto",
						children: [
							/* @__PURE__ */ jsx(TabsTrigger, {
								value: "resumen",
								children: "Resumen"
							}),
							/* @__PURE__ */ jsx(TabsTrigger, {
								value: "seguimiento",
								children: "Seguimiento"
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "comentarios",
								children: [
									"Comentarios",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "ml-1.5 text-xs text-muted-foreground tabular",
										children: ticket.comments.length
									})
								]
							}),
							/* @__PURE__ */ jsxs(TabsTrigger, {
								value: "historial",
								children: [
									"Historial",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "ml-1.5 text-xs text-muted-foreground tabular",
										children: ticket.history.length
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "resumen",
						className: "space-y-6",
						children: [
							ticket.reopenedFrom && /* @__PURE__ */ jsx(LinkedTicket, {
								label: "Reabierto a partir de",
								code: ticket.reopenedFrom.code,
								onClick: () => onOpenTicket(ticket.reopenedFrom.id)
							}),
							ticket.reopenedAs && /* @__PURE__ */ jsx(LinkedTicket, {
								label: "Este ticket fue reabierto como",
								code: ticket.reopenedAs.code,
								onClick: () => onOpenTicket(ticket.reopenedAs.id)
							}),
							/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx(SectionTitle, { children: "Descripción" }), /* @__PURE__ */ jsx("p", {
								className: "whitespace-pre-line text-[15px] leading-relaxed text-foreground/90",
								children: ticket.description
							})] }),
							/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx(SectionTitle, { children: "Archivos adjuntos" }), ticket.attachments.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground",
								children: "Sin archivos adjuntos."
							}) : /* @__PURE__ */ jsx("ul", {
								className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
								children: ticket.attachments.map((a) => /* @__PURE__ */ jsxs("li", {
									className: "flex min-w-0 items-center gap-3 rounded-lg border bg-card p-2",
									children: [a.dataUrl ? /* @__PURE__ */ jsx("img", {
										src: a.dataUrl,
										alt: a.name,
										className: "size-10 shrink-0 rounded-md object-cover"
									}) : /* @__PURE__ */ jsx("span", {
										className: "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted",
										children: /* @__PURE__ */ jsx(FileText, { className: "size-4 text-muted-foreground" })
									}), /* @__PURE__ */ jsxs("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block truncate text-sm",
											title: a.name,
											children: a.name
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted-foreground",
											children: bytes(a.size)
										})]
									})]
								}, a.id))
							})] }),
							/* @__PURE__ */ jsx(ResolutionBox, { ticket })
						]
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "seguimiento",
						children: /* @__PURE__ */ jsx(Timeline, { ticket })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "comentarios",
						children: /* @__PURE__ */ jsx(Comments, { ticket })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "historial",
						children: ticket.history.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, {
							icon: /* @__PURE__ */ jsx(History, { className: "size-4" }),
							text: "No se han realizado modificaciones."
						}) : /* @__PURE__ */ jsx("ul", {
							className: "space-y-3",
							children: ticket.history.map((h) => /* @__PURE__ */ jsxs("li", {
								className: "rounded-lg border bg-card p-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm font-medium",
										children: h.field
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: dateTime(h.at)
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-2 grid gap-1.5 text-sm sm:grid-cols-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "line-clamp-3 rounded-md bg-status-rejected-soft/60 px-2 py-1 text-muted-foreground line-through decoration-status-rejected/40",
										children: h.from
									}), /* @__PURE__ */ jsx("p", {
										className: "line-clamp-3 rounded-md bg-status-resolved-soft/70 px-2 py-1",
										children: h.to
									})]
								})]
							}, h.id))
						})
					})
				]
			})
		}), /* @__PURE__ */ jsxs("aside", {
			className: "space-y-5 border-t bg-muted/40 px-6 py-5 text-sm md:border-l md:border-t-0",
			children: [
				/* @__PURE__ */ jsx(Meta, {
					label: "Responsable",
					children: ticket.assignee ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground",
							children: initials(ticket.assignee.name)
						}), /* @__PURE__ */ jsxs("span", {
							className: "min-w-0 leading-tight",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "block truncate font-medium",
									children: ticket.assignee.name
								}),
								/* @__PURE__ */ jsx("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: ticket.assignee.role
								}),
								/* @__PURE__ */ jsx("a", {
									href: `mailto:${ticket.assignee.email}`,
									className: "block truncate text-xs text-primary hover:underline",
									children: ticket.assignee.email
								})
							]
						})]
					}) : /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ jsx(UserRound, { className: "size-4" }), " Sin asignar"]
					})
				}),
				/* @__PURE__ */ jsx(Meta, {
					label: "Estado actual",
					children: /* @__PURE__ */ jsx(StatusBadge, { status: ticket.status })
				}),
				/* @__PURE__ */ jsx(Meta, {
					label: "Ubicación",
					children: /* @__PURE__ */ jsxs("span", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [ticket.location.campus, (ticket.location.building || ticket.location.room) && /* @__PURE__ */ jsx("span", {
							className: "block text-xs text-muted-foreground",
							children: [ticket.location.building, ticket.location.room].filter(Boolean).join(" · ")
						})] })]
					})
				}),
				ticket.onBehalfOf && /* @__PURE__ */ jsx(Meta, {
					label: "En nombre de",
					children: ticket.onBehalfOf
				}),
				/* @__PURE__ */ jsx(Meta, {
					label: "Creado",
					children: dateTime(ticket.createdAt)
				}),
				/* @__PURE__ */ jsx(Meta, {
					label: "Última actualización",
					children: dateTime(ticket.updatedAt)
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2 border-t pt-5",
					children: [
						scope !== "ninguna" && /* @__PURE__ */ jsxs(Link, {
							to: "/tickets/$ticketId/editar",
							params: { ticketId: ticket.id },
							className: cn(buttonVariants({ variant: "outline" }), "w-full"),
							children: [/* @__PURE__ */ jsx(Pencil, {}), " Editar ticket"]
						}),
						scope === "limitada" && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Al estar asignado, solo puedes modificar título, descripción y archivos."
						}),
						canReopen(ticket) && /* @__PURE__ */ jsxs(Link, {
							to: "/tickets/$ticketId/editar",
							params: { ticketId: ticket.id },
							className: cn(buttonVariants({ variant: "hero" }), "w-full"),
							children: [/* @__PURE__ */ jsx(RotateCcw, {}), " Reabrir ticket"]
						}),
						canDelete(ticket) && /* @__PURE__ */ jsx(ConfirmAction, {
							trigger: /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								className: "w-full text-destructive hover:bg-status-rejected-soft hover:text-destructive",
								children: [/* @__PURE__ */ jsx(Trash2, {}), " Eliminar ticket"]
							}),
							title: "¿Eliminar este ticket?",
							description: "El ticket se eliminará de forma permanente. Esta acción no se puede deshacer.",
							confirm: "Eliminar",
							onConfirm: () => {
								if (deleteTicket(ticket.id)) {
									toast.success("Ticket eliminado");
									onClose();
								} else toast.error("El ticket ya fue asignado y no puede eliminarse.");
							}
						}),
						canCancel(ticket) && /* @__PURE__ */ jsx(ConfirmAction, {
							trigger: /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								className: "w-full text-destructive hover:bg-status-rejected-soft hover:text-destructive",
								children: [/* @__PURE__ */ jsx(Ban, {}), " Cancelar y cerrar"]
							}),
							title: "¿Cancelar este ticket?",
							description: "El ticket ya fue asignado, por lo que no puede eliminarse. Se cerrará y quedará registrado en tu historial. Podrás reabrirlo más adelante.",
							confirm: "Cancelar ticket",
							onConfirm: () => {
								cancelTicket(ticket.id);
								toast.success("Ticket cancelado y cerrado");
							}
						})
					]
				})
			]
		})]
	})] });
}
function SectionTitle({ children }) {
	return /* @__PURE__ */ jsx("h3", {
		className: "mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground",
		children
	});
}
function Meta({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
		className: "mb-1.5 text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("div", { children })] });
}
function EmptyNote({ icon, text }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground",
		children: [icon, text]
	});
}
function LinkedTicket({ label, code, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		className: "flex w-full cursor-pointer items-center gap-3 rounded-lg border border-status-reopened/30 bg-status-reopened-soft px-3 py-2.5 text-left text-sm transition-colors hover:border-status-reopened/60",
		children: [
			/* @__PURE__ */ jsx(RotateCcw, { className: "size-4 text-status-reopened" }),
			/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ jsx("span", {
				className: "font-mono font-medium text-status-reopened",
				children: code
			}),
			/* @__PURE__ */ jsx("span", {
				className: "ml-auto text-xs text-status-reopened",
				children: "Ver ticket"
			})
		]
	});
}
function ResolutionBox({ ticket }) {
	const r = ticket.resolution;
	if (!r && ticket.closedReason !== "cancelado") return null;
	if (!r) return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border bg-status-closed-soft p-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-sm font-medium",
			children: [/* @__PURE__ */ jsx(Ban, { className: "size-4" }), " Cancelado por el usuario"]
		}), /* @__PURE__ */ jsxs("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: [
				"Cerrado el ",
				dateTime(ticket.closedAt),
				"."
			]
		})]
	});
	const ok = r.outcome === "resuelta";
	return /* @__PURE__ */ jsxs("section", {
		className: cn("rounded-xl border p-4", ok ? "border-status-resolved/25 bg-status-resolved-soft" : "border-status-rejected/25 bg-status-rejected-soft"),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex items-center gap-2 text-sm font-semibold", ok ? "text-status-resolved" : "text-status-rejected"),
				children: [ok ? /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }) : /* @__PURE__ */ jsx(XCircle, { className: "size-4" }), ok ? "Información de la resolución" : "Motivo del rechazo"]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm leading-relaxed",
				children: r.summary
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					r.by.name,
					" · ",
					dateTime(r.at)
				]
			})
		]
	});
}
function Timeline({ ticket }) {
	const done = ticket.timeline;
	const labels = kindLabels(ticket);
	const isRequest = ticket.type === "requerimiento";
	const kinds = new Set(done.map((e) => e.kind));
	const pending = [];
	if (ticket.status !== "cerrada") {
		if (!kinds.has("asignada")) pending.push({
			kind: "asignada",
			label: labels.asignada
		});
		if (!kinds.has("resuelta") && !kinds.has("rechazada")) pending.push({
			kind: "resuelta",
			label: isRequest ? "Resuelto o rechazado" : "Resuelta o rechazada"
		});
		pending.push({
			kind: "cerrada",
			label: labels.cerrada
		});
	}
	return /* @__PURE__ */ jsxs("ol", {
		className: "relative ml-1",
		children: [done.map((e, i) => /* @__PURE__ */ jsxs("li", {
			className: "relative flex gap-4 pb-6",
			children: [
				(i < done.length - 1 || pending.length > 0) && /* @__PURE__ */ jsx("span", { className: "absolute left-[4px] top-4 h-full w-px bg-border" }),
				/* @__PURE__ */ jsx("span", { className: cn(statusDotVariants({ kind: e.kind }), "relative mt-1.5 shrink-0") }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: labels[e.kind]
					}),
					e.description && /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: e.description
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(CalendarClock, { className: "size-3" }),
							" ",
							dateTime(e.at)
						]
					})
				] })
			]
		}, e.id)), pending.map((p, i) => /* @__PURE__ */ jsxs("li", {
			className: "relative flex gap-4 pb-6 last:pb-0",
			children: [
				i < pending.length - 1 && /* @__PURE__ */ jsx("span", { className: "absolute left-[4px] top-4 h-full w-px border-l border-dashed" }),
				/* @__PURE__ */ jsx("span", { className: cn(statusDotVariants({ kind: "pendiente" }), "relative mt-1.5 shrink-0") }),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: p.label
				})
			]
		}, p.label))]
	});
}
function Comments({ ticket }) {
	const session = useSession();
	const [body, setBody] = useState("");
	const allowed = canComment(ticket);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [ticket.comments.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, {
			icon: /* @__PURE__ */ jsx(MessageSquare, { className: "size-4" }),
			text: "Aún no hay comentarios ni actualizaciones."
		}) : /* @__PURE__ */ jsx("ul", {
			className: "space-y-3",
			children: ticket.comments.map((c) => /* @__PURE__ */ jsxs("li", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold", c.fromStaff ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground ring-1 ring-border"),
					children: c.fromStaff ? initials(c.author.name) : /* @__PURE__ */ jsx(UserRound, { className: "size-4" })
				}), /* @__PURE__ */ jsxs("div", {
					className: cn("min-w-0 flex-1 rounded-xl border px-3.5 py-2.5", c.fromStaff ? "bg-card" : "bg-accent/40"),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-baseline gap-x-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium",
								children: c.author.name
							}),
							c.fromStaff && /* @__PURE__ */ jsx("span", {
								className: "text-xs text-primary",
								children: "Responsable"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "ml-auto text-xs text-muted-foreground",
								children: timeAgo(c.at)
							})
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 whitespace-pre-line text-sm leading-relaxed",
						children: c.body
					})]
				})]
			}, c.id))
		}), allowed && session ? /* @__PURE__ */ jsxs("form", {
			className: "rounded-xl border bg-card p-2 shadow-soft focus-within:border-ring/50",
			onSubmit: (e) => {
				e.preventDefault();
				if (!body.trim()) return;
				addComment(ticket.id, {
					name: session.name,
					email: session.email
				}, body);
				setBody("");
			},
			children: [/* @__PURE__ */ jsx(Textarea, {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "Escribe un comentario para el responsable…",
				className: "min-h-[72px] resize-none border-0 shadow-none focus-visible:ring-0"
			}), /* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsxs(Button, {
					type: "submit",
					size: "sm",
					disabled: !body.trim(),
					children: [/* @__PURE__ */ jsx(Send, {}), " Comentar"]
				})
			})]
		}) : /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: "Los tickets cerrados no admiten nuevos comentarios."
		})]
	});
}
function ConfirmAction({ trigger, title, description, confirm, onConfirm }) {
	return /* @__PURE__ */ jsxs(AlertDialog, { children: [/* @__PURE__ */ jsx(AlertDialogTrigger, {
		asChild: true,
		children: trigger
	}), /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: title }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: description })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Volver" }), /* @__PURE__ */ jsx(AlertDialogAction, {
		className: buttonVariants({ variant: "destructive" }),
		onClick: onConfirm,
		children: confirm
	})] })] })] });
}
//#endregion
export { TicketRow as n, TicketDetailDialog as t };
