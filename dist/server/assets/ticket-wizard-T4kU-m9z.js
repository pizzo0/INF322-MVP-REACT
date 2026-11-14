import { A as validateDraft, D as selectType, E as selectCategory, F as TICKET_TYPES, I as categoriesFor, L as getCategory, O as typeLabel, Y as cn, j as CAMPUSES, k as uid, q as Button, z as bytes } from "./app-shell-Cfw1d0h6.js";
import { t as Textarea } from "./textarea-BCM7E4qZ.js";
import { t as Input } from "./input-B_vZaZ-C.js";
import { t as Label } from "./label-IYvXt-po.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DL7u3cSj.js";
import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardList, FileText, Lock, MapPin, Paperclip, Search, UploadCloud, X } from "lucide-react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region src/components/ui/switch.tsx
var Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
//#region src/components/usm/ticket-wizard.tsx
var STEP_META = {
	tipo: {
		label: "Tipo de problema",
		hint: "Incidencia o requerimiento"
	},
	categoria: {
		label: "Categoría",
		hint: "Área o servicio afectado"
	},
	ubicacion: {
		label: "Ubicación",
		hint: "Campus, edificio y sala"
	},
	detalles: {
		label: "Detalles",
		hint: "Título, descripción y archivos"
	},
	resumen: {
		label: "Resumen",
		hint: "Revisa y confirma"
	}
};
var STEP_ERRORS = {
	tipo: ["type"],
	categoria: ["categoryId"],
	ubicacion: ["campus"],
	detalles: [
		"title",
		"description",
		"onBehalfOf"
	],
	resumen: []
};
function TicketWizard({ mode, initial, limited, onSubmit, onCancel }) {
	const steps = limited ? ["detalles", "resumen"] : [
		"tipo",
		"categoria",
		"ubicacion",
		"detalles",
		"resumen"
	];
	const [draft, setDraft] = useState(initial);
	const [index, setIndex] = useState(0);
	const [showErrors, setShowErrors] = useState(false);
	const errors = validateDraft(draft);
	const step = steps[index] ?? "resumen";
	const stepValid = (s) => STEP_ERRORS[s].every((k) => !errors[k]);
	const reachable = (i) => steps.slice(0, i).every(stepValid);
	const goNext = () => {
		if (!stepValid(step)) {
			setShowErrors(true);
			return;
		}
		setShowErrors(false);
		setIndex((i) => Math.min(i + 1, steps.length - 1));
	};
	const goBack = () => {
		setShowErrors(false);
		if (index === 0) onCancel();
		else setIndex((i) => i - 1);
	};
	const jumpTo = (s) => {
		const i = steps.indexOf(s);
		if (i >= 0 && reachable(i)) {
			setShowErrors(false);
			setIndex(i);
		}
	};
	const confirmLabel = mode === "crear" ? "Confirmar ticket" : mode === "editar" ? "Guardar cambios" : "Reabrir ticket";
	const err = (k) => showErrors ? errors[k] : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[240px_1fr] gap-8 min-h-0 my-auto pb-9",
		children: [/* @__PURE__ */ jsx("ol", {
			className: "flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start",
			children: steps.map((s, i) => {
				const active = i === index;
				const done = i < index;
				const canGo = reachable(i);
				return /* @__PURE__ */ jsx("li", {
					className: "shrink-0",
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: !canGo,
						onClick: () => jumpTo(s),
						className: cn("flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed", active ? "bg-card shadow-soft ring-1 ring-border" : "hover:bg-accent/60 disabled:hover:bg-transparent"),
						children: [/* @__PURE__ */ jsx("span", {
							className: cn("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors", active && "bg-primary text-primary-foreground", done && "bg-status-resolved-soft text-status-resolved", !active && !done && "bg-muted text-muted-foreground"),
							children: done ? /* @__PURE__ */ jsx(Check, { className: "size-3.5" }) : i + 1
						}), /* @__PURE__ */ jsxs("span", {
							className: "hidden flex-col sm:flex",
							children: [/* @__PURE__ */ jsx("span", {
								className: cn("text-sm font-medium", !active && "text-muted-foreground"),
								children: STEP_META[s].label
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: STEP_META[s].hint
							})]
						})]
					})
				}, s);
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-soft",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "shrink-0 border-b px-6 py-5 sm:px-8",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: [
								"Paso ",
								index + 1,
								" de ",
								steps.length
							]
						}), /* @__PURE__ */ jsx("h2", {
							className: "mt-1 text-xl font-semibold",
							children: STEP_META[step].label
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "min-h-0 flex-1 overflow-y-auto animate-rise px-6 py-6 sm:px-8",
						children: [
							limited && step === "detalles" && /* @__PURE__ */ jsx(Notice, {
								icon: /* @__PURE__ */ jsx(Lock, { className: "size-4" }),
								children: mode === "reabrir" ? "Al reabrir, se creará un nuevo ticket con el mismo tipo, categoría y ubicación. Puedes actualizar el título, la descripción y los archivos." : "Este ticket ya fue asignado. Solo puedes modificar el título, la descripción y los archivos adjuntos."
							}),
							step === "tipo" && /* @__PURE__ */ jsx(TypeStep, {
								value: draft.type,
								error: err("type"),
								onChange: (type) => {
									const next = selectType(draft, type);
									if (draft.categoryId && next.categoryId === null) toast.info("Se reinició la categoría", { description: "Las categorías dependen del tipo de problema. Vuelve a seleccionar una." });
									setDraft(next);
								}
							}),
							step === "categoria" && /* @__PURE__ */ jsx(CategoryStep, {
								draft,
								error: err("categoryId"),
								onChange: (id) => setDraft(selectCategory(draft, id))
							}),
							step === "ubicacion" && /* @__PURE__ */ jsx(LocationStep, {
								draft,
								error: err("campus"),
								onChange: setDraft
							}),
							step === "detalles" && /* @__PURE__ */ jsx(DetailsStep, {
								draft,
								errors: showErrors ? errors : {},
								onChange: setDraft
							}),
							step === "resumen" && /* @__PURE__ */ jsx(SummaryStep, {
								draft,
								limited,
								onEdit: jumpTo
							})
						]
					}, step),
					/* @__PURE__ */ jsxs("div", {
						className: "flex shrink-0 items-center justify-between gap-3 border-t bg-muted/30 px-6 py-4 sm:px-8",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							onClick: goBack,
							children: [
								/* @__PURE__ */ jsx(ArrowLeft, {}),
								" ",
								index === 0 ? "Cancelar" : "Atrás"
							]
						}), step === "resumen" ? /* @__PURE__ */ jsxs(Button, {
							variant: "hero",
							size: "lg",
							onClick: () => {
								if (Object.keys(errors).length) {
									setShowErrors(true);
									const first = steps.find((s) => !stepValid(s));
									if (first) setIndex(steps.indexOf(first));
									return;
								}
								onSubmit(draft);
							},
							children: [
								/* @__PURE__ */ jsx(Check, {}),
								" ",
								confirmLabel
							]
						}) : /* @__PURE__ */ jsxs(Button, {
							size: "lg",
							onClick: goNext,
							children: ["Continuar ", /* @__PURE__ */ jsx(ArrowRight, {})]
						})]
					})
				]
			})
		})]
	});
}
function Notice({ icon, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-6 flex gap-3 rounded-xl border border-status-assigned/25 bg-status-assigned-soft px-4 py-3 text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mt-0.5 text-status-assigned",
			children: icon
		}), /* @__PURE__ */ jsx("p", { children })]
	});
}
function FieldError({ children }) {
	if (!children) return null;
	return /* @__PURE__ */ jsx("p", {
		className: "mt-1.5 text-xs font-medium text-destructive",
		children
	});
}
function OptionCard({ selected, onClick, children, className }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		role: "radio",
		"aria-checked": selected,
		onClick,
		className: cn("relative w-full cursor-pointer rounded-xl border bg-card p-4 text-left transition-all duration-150 hover:border-ring/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected && "border-primary bg-accent/50 ring-1 ring-primary hover:border-primary hover:bg-accent/50", className),
		children: [children, /* @__PURE__ */ jsx("span", {
			className: cn("absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border transition-colors", selected ? "border-primary bg-primary text-primary-foreground" : "border-input"),
			children: selected && /* @__PURE__ */ jsx(Check, { className: "size-3" })
		})]
	});
}
function TypeStep({ value, error, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		role: "radiogroup",
		"aria-label": "Tipo de problema",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "mb-5 text-sm text-muted-foreground",
				children: "Selecciona la opción que mejor describe tu caso."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: TICKET_TYPES.map((t) => {
					const Icon = t.id === "incidencia" ? AlertTriangle : ClipboardList;
					return /* @__PURE__ */ jsxs(OptionCard, {
						selected: value === t.id,
						onClick: () => onChange(t.id),
						className: "p-5",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground",
								children: /* @__PURE__ */ jsx(Icon, { className: "size-5" })
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-4 font-display text-lg font-semibold",
								children: t.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-foreground/80",
								children: t.description
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: ["Ej.: ", t.examples]
							})
						]
					}, t.id);
				})
			}),
			/* @__PURE__ */ jsx(FieldError, { children: error })
		]
	});
}
function CategoryStep({ draft, error, onChange }) {
	const [q, setQ] = useState("");
	const list = useMemo(() => {
		const all = categoriesFor(draft.type);
		const term = q.trim().toLowerCase();
		return term ? all.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(term)) : all;
	}, [draft.type, q]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ jsxs("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Categorías disponibles para",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-foreground",
						children: typeLabel(draft.type).toLowerCase()
					}),
					"."
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative sm:w-64",
				children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Buscar categoría",
					className: "pl-9 text-sm"
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			role: "radiogroup",
			"aria-label": "Categoría",
			className: "grid gap-2.5 sm:grid-cols-2",
			children: [list.map((c) => /* @__PURE__ */ jsxs(OptionCard, {
				selected: draft.categoryId === c.id,
				onClick: () => onChange(c.id),
				className: "py-3.5 pr-12",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold",
					children: c.name
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
					children: c.description
				})]
			}, c.id)), list.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "No hay categorías que coincidan con tu búsqueda."
			})]
		}),
		/* @__PURE__ */ jsx(FieldError, { children: error })
	] });
}
function LocationStep({ draft, error, onChange }) {
	const set = (k, v) => onChange({
		...draft,
		location: {
			...draft.location,
			[k]: v
		}
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Indica dónde ocurre el problema. Solo el campus es obligatorio."
			}),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs(Label, {
					htmlFor: "campus",
					children: ["Campus o sede ", /* @__PURE__ */ jsx("span", {
						className: "text-destructive",
						children: "*"
					})]
				}),
				/* @__PURE__ */ jsxs(Select, {
					...draft.location.campus ? { value: draft.location.campus } : {},
					onValueChange: (v) => set("campus", v),
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						id: "campus",
						className: cn("mt-1.5 h-11", error && "border-destructive"),
						children: /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona un campus" })]
						})
					}), /* @__PURE__ */ jsx(SelectContent, { children: CAMPUSES.map((c) => /* @__PURE__ */ jsx(SelectItem, {
						value: c,
						children: c
					}, c)) })]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-xs text-muted-foreground",
					children: "Sede o campus donde se encuentra el problema."
				}),
				/* @__PURE__ */ jsx(FieldError, { children: error })
			] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs(Label, {
						htmlFor: "building",
						children: ["Edificio ", /* @__PURE__ */ jsx("span", {
							className: "font-normal text-muted-foreground",
							children: "(opcional)"
						})]
					}),
					/* @__PURE__ */ jsx(Input, {
						id: "building",
						value: draft.location.building,
						onChange: (e) => set("building", e.target.value),
						placeholder: "Ej.: Edificio C",
						className: "mt-1.5 h-11"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: "Nombre o letra del edificio, si aplica."
					})
				] }), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs(Label, {
						htmlFor: "room",
						children: ["Sala ", /* @__PURE__ */ jsx("span", {
							className: "font-normal text-muted-foreground",
							children: "(opcional)"
						})]
					}),
					/* @__PURE__ */ jsx(Input, {
						id: "room",
						value: draft.location.room,
						onChange: (e) => set("room", e.target.value),
						placeholder: "Ej.: C-210",
						className: "mt-1.5 h-11"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: "Sala, oficina o espacio específico, si aplica."
					})
				] })]
			})
		]
	});
}
function readFile(file) {
	return new Promise((resolve) => {
		const base = {
			id: uid("f"),
			name: file.name,
			size: file.size,
			mime: file.type
		};
		if (!file.type.startsWith("image/") || file.size > 1572864) return resolve(base);
		const reader = new FileReader();
		reader.onload = () => resolve({
			...base,
			dataUrl: String(reader.result)
		});
		reader.onerror = () => resolve(base);
		reader.readAsDataURL(file);
	});
}
function DetailsStep({ draft, errors, onChange }) {
	const [onBehalf, setOnBehalf] = useState(!!draft.onBehalfOf);
	const [dragging, setDragging] = useState(false);
	const inputRef = useRef(null);
	const addFiles = async (files) => {
		if (!files?.length) return;
		const valid = Array.from(files).filter((f) => {
			if (f.size > 10485760) {
				toast.error(`${f.name} supera el máximo de 10 MB`);
				return false;
			}
			return true;
		});
		const room = 6 - draft.attachments.length;
		if (valid.length > room) toast.error("Puedes adjuntar hasta 6 archivos.");
		const read = await Promise.all(valid.slice(0, Math.max(room, 0)).map(readFile));
		onChange({
			...draft,
			attachments: [...draft.attachments, ...read]
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ jsxs(Label, {
						htmlFor: "title",
						children: ["Título ", /* @__PURE__ */ jsx("span", {
							className: "text-destructive",
							children: "*"
						})]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-muted-foreground tabular",
						children: [draft.title.length, "/120"]
					})]
				}),
				/* @__PURE__ */ jsx(Input, {
					id: "title",
					maxLength: 120,
					value: draft.title,
					onChange: (e) => onChange({
						...draft,
						title: e.target.value
					}),
					placeholder: "Resume el problema en una frase",
					className: cn("mt-1.5 h-11", errors.title && "border-destructive")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-xs text-muted-foreground",
					children: "Un título breve y claro ayuda a clasificar tu ticket más rápido."
				}),
				/* @__PURE__ */ jsx(FieldError, { children: errors.title })
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs(Label, {
					htmlFor: "description",
					children: ["Descripción ", /* @__PURE__ */ jsx("span", {
						className: "text-destructive",
						children: "*"
					})]
				}),
				/* @__PURE__ */ jsx(Textarea, {
					id: "description",
					value: draft.description,
					onChange: (e) => onChange({
						...draft,
						description: e.target.value
					}),
					placeholder: "¿Qué ocurrió? ¿Desde cuándo? ¿A quiénes afecta? Incluye cualquier detalle que ayude a resolverlo.",
					className: cn("mt-1.5 min-h-[140px]", errors.description && "border-destructive")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-xs text-muted-foreground",
					children: "Describe el problema con el mayor detalle posible."
				}),
				/* @__PURE__ */ jsx(FieldError, { children: errors.description })
			] }),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "behalf-switch",
						className: "text-sm",
						children: "Notificar en nombre de otra persona"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "La persona indicada recibirá las actualizaciones del ticket."
					})] }), /* @__PURE__ */ jsx(Switch, {
						id: "behalf-switch",
						checked: onBehalf,
						onCheckedChange: (v) => {
							setOnBehalf(v);
							if (!v) onChange({
								...draft,
								onBehalfOf: ""
							});
						}
					})]
				}), onBehalf && /* @__PURE__ */ jsxs("div", {
					className: "mt-4",
					children: [
						/* @__PURE__ */ jsx(Input, {
							type: "email",
							value: draft.onBehalfOf,
							onChange: (e) => onChange({
								...draft,
								onBehalfOf: e.target.value
							}),
							placeholder: "nombre.apellido@usm.cl",
							className: cn("h-11", errors.onBehalfOf && "border-destructive")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1.5 text-xs text-muted-foreground",
							children: "Ingresa el correo de la persona que recibirá las actualizaciones."
						}),
						/* @__PURE__ */ jsx(FieldError, { children: errors.onBehalfOf })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs(Label, { children: ["Fotos o archivos ", /* @__PURE__ */ jsx("span", {
					className: "font-normal text-muted-foreground",
					children: "(opcional)"
				})] }),
				/* @__PURE__ */ jsxs("div", {
					onDragOver: (e) => {
						e.preventDefault();
						setDragging(true);
					},
					onDragLeave: () => setDragging(false),
					onDrop: (e) => {
						e.preventDefault();
						setDragging(false);
						addFiles(e.dataTransfer.files);
					},
					onClick: () => inputRef.current?.click(),
					className: cn("mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-dots px-6 py-8 text-center transition-colors hover:border-ring/50", dragging && "border-primary bg-accent/50"),
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground",
							children: /* @__PURE__ */ jsx(UploadCloud, { className: "size-5" })
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium",
							children: "Arrastra archivos aquí o haz clic para seleccionarlos"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Imágenes, PDF o documentos · hasta 10 MB cada uno · máximo 6"
						}),
						/* @__PURE__ */ jsx("input", {
							ref: inputRef,
							type: "file",
							multiple: true,
							accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip",
							className: "hidden",
							onChange: (e) => {
								addFiles(e.target.files);
								e.target.value = "";
							}
						})
					]
				}),
				draft.attachments.length > 0 && /* @__PURE__ */ jsx(AttachmentList, {
					items: draft.attachments,
					onRemove: (id) => onChange({
						...draft,
						attachments: draft.attachments.filter((a) => a.id !== id)
					})
				})
			] })
		]
	});
}
function AttachmentList({ items, onRemove }) {
	return /* @__PURE__ */ jsx("ul", {
		className: "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2",
		children: items.map((a) => /* @__PURE__ */ jsxs("li", {
			className: "flex min-w-0 items-center gap-3 rounded-lg border bg-card p-2",
			children: [
				a.dataUrl ? /* @__PURE__ */ jsx("img", {
					src: a.dataUrl,
					alt: a.name,
					className: "size-10 shrink-0 rounded-md object-cover"
				}) : /* @__PURE__ */ jsx("span", {
					className: "flex size-10 shrink-0 items-center justify-center rounded-md bg-muted",
					children: /* @__PURE__ */ jsx(FileText, { className: "size-4 text-muted-foreground" })
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block truncate text-sm",
						children: a.name
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: bytes(a.size)
					})]
				}),
				onRemove && /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "size-8",
					onClick: () => onRemove(a.id),
					"aria-label": `Quitar ${a.name}`,
					children: /* @__PURE__ */ jsx(X, {})
				})
			]
		}, a.id))
	});
}
function SummaryStep({ draft, limited, onEdit }) {
	const category = getCategory(draft.categoryId);
	const loc = draft.location;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ jsx("p", {
			className: "mb-4 text-sm text-muted-foreground",
			children: "Revisa que la información sea correcta antes de confirmar."
		}), /* @__PURE__ */ jsxs("dl", {
			className: "divide-y rounded-xl border",
			children: [
				/* @__PURE__ */ jsx(Row, {
					label: "Tipo de problema",
					locked: limited,
					onEdit: () => onEdit("tipo"),
					children: typeLabel(draft.type)
				}),
				/* @__PURE__ */ jsx(Row, {
					label: "Categoría",
					locked: limited,
					onEdit: () => onEdit("categoria"),
					children: category?.name
				}),
				/* @__PURE__ */ jsxs(Row, {
					label: "Ubicación",
					locked: limited,
					onEdit: () => onEdit("ubicacion"),
					children: [loc.campus, (loc.building || loc.room) && /* @__PURE__ */ jsx("span", {
						className: "block text-muted-foreground",
						children: [loc.building, loc.room].filter(Boolean).join(" · ")
					})]
				}),
				/* @__PURE__ */ jsx(Row, {
					label: "Título",
					onEdit: () => onEdit("detalles"),
					children: draft.title
				}),
				/* @__PURE__ */ jsx(Row, {
					label: "Descripción",
					onEdit: () => onEdit("detalles"),
					children: /* @__PURE__ */ jsx("span", {
						className: "whitespace-pre-line",
						children: draft.description
					})
				}),
				/* @__PURE__ */ jsx(Row, {
					label: "En nombre de",
					locked: limited,
					onEdit: () => onEdit("detalles"),
					children: draft.onBehalfOf || /* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground",
						children: "No aplica"
					})
				}),
				/* @__PURE__ */ jsx(Row, {
					label: "Archivos",
					onEdit: () => onEdit("detalles"),
					children: draft.attachments.length ? /* @__PURE__ */ jsx("span", {
						className: "flex min-w-0 flex-wrap gap-1.5",
						children: draft.attachments.map((a) => /* @__PURE__ */ jsxs("span", {
							className: "inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs",
							title: a.name,
							children: [
								/* @__PURE__ */ jsx(Paperclip, { className: "size-3 shrink-0" }),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: a.name
								})
							]
						}, a.id))
					}) : /* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground",
						children: "Sin archivos"
					})
				})
			]
		})]
	});
}
function Row({ label, children, onEdit, locked }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr_auto] sm:items-start sm:gap-4",
		children: [
			/* @__PURE__ */ jsx("dt", {
				className: "text-xs font-medium text-muted-foreground sm:pt-0.5",
				children: label
			}),
			/* @__PURE__ */ jsx("dd", {
				className: "min-w-0 text-sm",
				children
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sm:text-right",
				children: locked ? /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Lock, { className: "size-3" }), " Bloqueado"]
				}) : /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onEdit,
					className: "cursor-pointer text-xs font-medium text-primary hover:underline",
					children: "Editar"
				})
			})
		]
	});
}
//#endregion
export { TicketWizard as t };
