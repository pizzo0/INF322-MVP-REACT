import { G as MicrosoftLogo, K as Wordmark, R as PUBLIC_NAVIGATION, d as useHydrated, f as useSession, l as signInWithMicrosoft, q as Button, r as SiteHeader } from "./app-shell-Cfw1d0h6.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-_9RsCzkG.js";
import { t as Input } from "./input-B_vZaZ-C.js";
import { t as Label } from "./label-IYvXt-po.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Eye, EyeOff, Headset, Loader2, ShieldCheck, Users } from "lucide-react";
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const hydrated = useHydrated();
	const session = useSession();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [manualOpen, setManualOpen] = useState(false);
	useEffect(() => {
		if (hydrated && session && !loading) navigate({
			to: "/",
			replace: true
		});
	}, [
		hydrated,
		session,
		loading,
		navigate
	]);
	const microsoft = () => {
		setLoading(true);
		window.setTimeout(() => {
			signInWithMicrosoft();
			navigate({ to: "/" });
		}, 900);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col min-h-screen",
		children: [
			/* @__PURE__ */ jsx(SiteHeader, {
				items: PUBLIC_NAVIGATION,
				brand: /* @__PURE__ */ jsx("img", {
					src: `/INF322-MVP-REACT/logo-usm.svg`,
					alt: "Universidad Técnica Federico Santa María",
					className: "h-12 w-auto"
				}),
				brandLinkTo: "https://usm.cl/"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col items-center min-h-[calc(100dvh-70px)] mx-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-6xl rounded-xl border overflow-hidden my-8 flex-1 grid lg:grid-cols-[1.05fr_1fr]",
					children: [/* @__PURE__ */ jsxs("aside", {
						className: "relative hidden overflow-hidden bg-ink-gradient text-ink-foreground lg:flex lg:flex-col",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" }), /* @__PURE__ */ jsxs("div", {
							className: "relative flex flex-1 flex-col justify-between p-12",
							children: [
								/* @__PURE__ */ jsx("div", {}),
								/* @__PURE__ */ jsx("div", {}),
								/* @__PURE__ */ jsxs("div", {
									className: "max-w-md",
									children: [
										/* @__PURE__ */ jsx(Wordmark, {
											inverted: true,
											className: "mb-5"
										}),
										/* @__PURE__ */ jsxs("h1", {
											className: "font-display text-[44px] leading-[1.05]",
											children: [
												"Comunica, solicita",
												/* @__PURE__ */ jsx("br", {}),
												/* @__PURE__ */ jsx("span", {
													className: "font-bold",
													children: " y contribuye al cambio."
												})
											]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-5 text-ink-foreground/70",
											children: "Informa problemas, realiza requerimientos y haz seguimiento a tus solicitudes dentro de la universidad, de manera fácil y desde cualquier dispositivo."
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ jsx("main", {
						className: "flex items-center justify-center bg-hero-gradient px-5 py-8 sm:px-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "w-full max-w-[440px] animate-rise",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mb-8 lg:hidden",
									children: /* @__PURE__ */ jsx(Wordmark, {})
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl font-semibold",
									children: "Ingresa a la plataforma"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-muted-foreground",
									children: "Elige la forma de acceso que corresponda a tu perfil."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 grid gap-4",
									children: [/* @__PURE__ */ jsx(PortalCard, {
										icon: /* @__PURE__ */ jsx(Users, { className: "size-5" }),
										title: "Comunidad USM",
										description: "Estudiantes, docentes, funcionarios y toda persona con cuenta @usm.cl.",
										children: /* @__PURE__ */ jsxs(Button, {
											variant: "default",
											size: "xl",
											className: "w-full",
											onClick: microsoft,
											disabled: loading,
											children: [loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ jsx(MicrosoftLogo, {}), loading ? "Conectando con Microsoft 365…" : "Continuar con Microsoft 365"]
										})
									}), /* @__PURE__ */ jsx(PortalCard, {
										icon: /* @__PURE__ */ jsx(Headset, { className: "size-5" }),
										title: "Soporte y administración",
										description: "Equipos de atención y administradores de la plataforma.",
										children: /* @__PURE__ */ jsx(Button, {
											variant: "secondary",
											size: "xl",
											className: "w-full",
											onClick: () => setManualOpen(true),
											children: "Ingresar manualmente"
										})
									})]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "bg-surface w-full border-t border-border/70",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-center mx-auto max-w-6xl px-4 py-10 text-xs text-muted-foreground gap-6 sm:px-6 w-full",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"© Universidad Técnica Federico Santa María ",
						/* @__PURE__ */ jsx("br", {}),
						"USM Denuncia · Plataforma de reportes y solicitudes de la comunidad universitaria"
					] }), /* @__PURE__ */ jsx("a", {
						className: "underline",
						href: "mailto:soporte.denuncia@usm.cl",
						children: "soporte.denuncia@usm.cl"
					})]
				})
			}),
			/* @__PURE__ */ jsx(ManualLoginDialog, {
				open: manualOpen,
				onOpenChange: setManualOpen
			})
		]
	});
}
function PortalCard({ icon, title, description, note, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border bg-card p-4 shadow-soft",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground",
					children: icon
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-sans text-base font-medium tracking-normal",
						children: title
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: description
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4",
				children
			}),
			note && /* @__PURE__ */ jsxs("p", {
				className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(ShieldCheck, { className: "size-3.5" }),
					" ",
					note
				]
			})
		]
	});
}
function ManualLoginDialog({ open, onOpenChange }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	useEffect(() => {
		if (!open) {
			setPassword("");
			setError(false);
			setLoading(false);
			setShowPassword(false);
		}
	}, [open]);
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "sm:max-w-[420px] sm:rounded-2xl",
			children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, {
				className: "font-display text-xl",
				children: "Ingreso con cuenta manual"
			}), /* @__PURE__ */ jsx(DialogDescription, { children: "Exclusivo para personal de soporte y administración." })] }), /* @__PURE__ */ jsxs("form", {
				className: "space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					setError(false);
					setLoading(true);
					window.setTimeout(() => {
						setLoading(false);
						setError(true);
					}, 900);
				},
				children: [
					error && /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 rounded-lg border border-destructive/30 bg-status-rejected-soft px-3 py-2.5 text-sm text-destructive",
						children: [/* @__PURE__ */ jsx(AlertCircle, { className: "mt-0.5 size-4 shrink-0" }), "No fue posible iniciar sesión. Verifica tu correo y contraseña."]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "admin-email",
						children: "Correo"
					}), /* @__PURE__ */ jsx(Input, {
						id: "admin-email",
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "mt-1.5 h-11"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx(Label, {
							htmlFor: "admin-password",
							children: "Contraseña"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative mt-1.5",
							children: [/* @__PURE__ */ jsx(Input, {
								id: "admin-password",
								type: showPassword ? "text" : "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "h-11 pr-11",
								"aria-describedby": "admin-password-help"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowPassword((v) => !v),
								"aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña",
								className: "absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							id: "admin-password-help",
							className: "mt-1.5 text-xs text-muted-foreground",
							children: "La contraseña distingue entre mayúsculas y minúsculas."
						})
					] }),
					/* @__PURE__ */ jsxs(DialogFooter, {
						className: "gap-2 pt-2 sm:gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancelar"
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: loading,
							children: [loading && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }), " Ingresar"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
