import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  FileText,
  Lock,
  MapPin,
  Paperclip,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CAMPUSES, TICKET_TYPES, categoriesFor, getCategory } from "@/lib/usm/catalog";
import { bytes } from "@/lib/usm/format";
import {
  MAX_FILE_BYTES,
  selectCategory,
  selectType,
  typeLabel,
  uid,
  validateDraft,
  type DraftErrors,
} from "@/lib/usm/rules";
import type { Attachment, TicketDraft } from "@/lib/usm/types";
import { cn } from "@/lib/utils";

type StepId = "tipo" | "categoria" | "ubicacion" | "detalles" | "resumen";

const STEP_META: Record<StepId, { label: string; hint: string }> = {
  tipo: { label: "Tipo de problema", hint: "Incidencia o requerimiento" },
  categoria: { label: "Categoría", hint: "Área o servicio afectado" },
  ubicacion: { label: "Ubicación", hint: "Campus, edificio y sala" },
  detalles: { label: "Detalles", hint: "Título, descripción y archivos" },
  resumen: { label: "Resumen", hint: "Revisa y confirma" },
};

const STEP_ERRORS: Record<StepId, (keyof DraftErrors)[]> = {
  tipo: ["type"],
  categoria: ["categoryId"],
  ubicacion: ["campus"],
  detalles: ["title", "description", "onBehalfOf"],
  resumen: [],
};

export type WizardMode = "crear" | "editar" | "reabrir";

export function TicketWizard({
  mode,
  initial,
  limited,
  onSubmit,
  onCancel,
}: {
  mode: WizardMode;
  initial: TicketDraft;
  limited: boolean;
  onSubmit: (draft: TicketDraft) => void;
  onCancel: () => void;
}) {
  const steps: StepId[] = limited
    ? ["detalles", "resumen"]
    : ["tipo", "categoria", "ubicacion", "detalles", "resumen"];
  const [draft, setDraft] = useState<TicketDraft>(initial);
  const [index, setIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const errors = validateDraft(draft);
  const step: StepId = steps[index] ?? "resumen";

  const stepValid = (s: StepId) => STEP_ERRORS[s].every((k) => !errors[k]);
  const reachable = (i: number) => steps.slice(0, i).every(stepValid);

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
  const jumpTo = (s: StepId) => {
    const i = steps.indexOf(s);
    if (i >= 0 && reachable(i)) {
      setShowErrors(false);
      setIndex(i);
    }
  };

  const confirmLabel =
    mode === "crear"
      ? "Confirmar ticket"
      : mode === "editar"
        ? "Guardar cambios"
        : "Reabrir ticket";
  const err = (k: keyof DraftErrors) => (showErrors ? errors[k] : undefined);

  return (
    <div className="grid grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[240px_1fr] gap-8 min-h-0 my-auto pb-9">
      <ol className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start">
        {steps.map((s, i) => {
          const active = i === index;
          const done = i < index;
          const canGo = reachable(i);
          return (
            <li key={s} className="shrink-0">
              <button
                type="button"
                disabled={!canGo}
                onClick={() => jumpTo(s)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed",
                  active
                    ? "bg-card shadow-soft ring-1 ring-border"
                    : "hover:bg-accent/60 disabled:hover:bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    active && "bg-primary text-primary-foreground",
                    done && "bg-status-resolved-soft text-status-resolved",
                    !active && !done && "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className="hidden flex-col sm:flex">
                  <span className={cn("text-sm font-medium", !active && "text-muted-foreground")}>
                    {STEP_META[s].label}
                  </span>
                  <span className="text-xs text-muted-foreground">{STEP_META[s].hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div className="shrink-0 border-b px-6 py-5 sm:px-8">
            <p className="text-xs font-medium text-muted-foreground">
              Paso {index + 1} de {steps.length}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{STEP_META[step].label}</h2>
          </div>

          <div key={step} className="min-h-0 flex-1 overflow-y-auto animate-rise px-6 py-6 sm:px-8">
            {limited && step === "detalles" && (
              <Notice icon={<Lock className="size-4" />}>
                {mode === "reabrir"
                  ? "Al reabrir, se creará un nuevo ticket con el mismo tipo, categoría y ubicación. Puedes actualizar el título, la descripción y los archivos."
                  : "Este ticket ya fue asignado. Solo puedes modificar el título, la descripción y los archivos adjuntos."}
              </Notice>
            )}

            {step === "tipo" && (
              <TypeStep
                value={draft.type}
                error={err("type")}
                onChange={(type) => {
                  const next = selectType(draft, type);
                  if (draft.categoryId && next.categoryId === null) {
                    toast.info("Se reinició la categoría", {
                      description:
                        "Las categorías dependen del tipo de problema. Vuelve a seleccionar una.",
                    });
                  }
                  setDraft(next);
                }}
              />
            )}
            {step === "categoria" && (
              <CategoryStep
                draft={draft}
                error={err("categoryId")}
                onChange={(id) => setDraft(selectCategory(draft, id))}
              />
            )}
            {step === "ubicacion" && (
              <LocationStep draft={draft} error={err("campus")} onChange={setDraft} />
            )}
            {step === "detalles" && (
              <DetailsStep draft={draft} errors={showErrors ? errors : {}} onChange={setDraft} />
            )}
            {step === "resumen" && <SummaryStep draft={draft} limited={limited} onEdit={jumpTo} />}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-muted/30 px-6 py-4 sm:px-8">
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft /> {index === 0 ? "Cancelar" : "Atrás"}
            </Button>
            {step === "resumen" ? (
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  if (Object.keys(errors).length) {
                    setShowErrors(true);
                    const first = steps.find((s) => !stepValid(s));
                    if (first) setIndex(steps.indexOf(first));
                    return;
                  }
                  onSubmit(draft);
                }}
              >
                <Check /> {confirmLabel}
              </Button>
            ) : (
              <Button size="lg" onClick={goNext}>
                Continuar <ArrowRight />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Notice({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-status-assigned/25 bg-status-assigned-soft px-4 py-3 text-sm">
      <span className="mt-0.5 text-status-assigned">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

function FieldError({ children }: { children?: string | undefined }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{children}</p>;
}

function OptionCard({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "relative w-full cursor-pointer rounded-xl border bg-card p-4 text-left transition-all duration-150 hover:border-ring/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected &&
          "border-primary bg-accent/50 ring-1 ring-primary hover:border-primary hover:bg-accent/50",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border transition-colors",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}

function TypeStep({
  value,
  error,
  onChange,
}: {
  value: TicketDraft["type"];
  error?: string | undefined;
  onChange: (t: NonNullable<TicketDraft["type"]>) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Tipo de problema">
      <p className="mb-5 text-sm text-muted-foreground">
        Selecciona la opción que mejor describe tu caso.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {TICKET_TYPES.map((t) => {
          const Icon = t.id === "incidencia" ? AlertTriangle : ClipboardList;
          return (
            <OptionCard
              key={t.id}
              selected={value === t.id}
              onClick={() => onChange(t.id)}
              className="p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold">{t.name}</p>
              <p className="mt-1 text-sm text-foreground/80">{t.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">Ej.: {t.examples}</p>
            </OptionCard>
          );
        })}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

function CategoryStep({
  draft,
  error,
  onChange,
}: {
  draft: TicketDraft;
  error?: string | undefined;
  onChange: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const all = categoriesFor(draft.type);
    const term = q.trim().toLowerCase();
    return term
      ? all.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(term))
      : all;
  }, [draft.type, q]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Categorías disponibles para{" "}
          <span className="font-medium text-foreground">{typeLabel(draft.type).toLowerCase()}</span>
          .
        </p>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar categoría"
            className="pl-9 text-sm"
          />
        </div>
      </div>
      <div role="radiogroup" aria-label="Categoría" className="grid gap-2.5 sm:grid-cols-2">
        {list.map((c) => (
          <OptionCard
            key={c.id}
            selected={draft.categoryId === c.id}
            onClick={() => onChange(c.id)}
            className="py-3.5 pr-12"
          >
            <p className="text-sm font-semibold">{c.name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
          </OptionCard>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay categorías que coincidan con tu búsqueda.
          </p>
        )}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

function LocationStep({
  draft,
  error,
  onChange,
}: {
  draft: TicketDraft;
  error?: string | undefined;
  onChange: (d: TicketDraft) => void;
}) {
  const set = (k: keyof TicketDraft["location"], v: string) =>
    onChange({ ...draft, location: { ...draft.location, [k]: v } });
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Indica dónde ocurre el problema. Solo el campus es obligatorio.
      </p>
      <div>
        <Label htmlFor="campus">
          Campus o sede <span className="text-destructive">*</span>
        </Label>
        <Select
          {...(draft.location.campus ? { value: draft.location.campus } : {})}
          onValueChange={(v) => set("campus", v)}
        >
          <SelectTrigger id="campus" className={cn("mt-1.5 h-11", error && "border-destructive")}>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Selecciona un campus" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {CAMPUSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1.5 text-xs text-muted-foreground">Sede o campus donde se encuentra el problema.</p>
        <FieldError>{error}</FieldError>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="building">
            Edificio <span className="font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="building"
            value={draft.location.building}
            onChange={(e) => set("building", e.target.value)}
            placeholder="Ej.: Edificio C"
            className="mt-1.5 h-11"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Nombre o letra del edificio, si aplica.</p>
        </div>
        <div>
          <Label htmlFor="room">
            Sala <span className="font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="room"
            value={draft.location.room}
            onChange={(e) => set("room", e.target.value)}
            placeholder="Ej.: C-210"
            className="mt-1.5 h-11"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Sala, oficina o espacio específico, si aplica.</p>
        </div>
      </div>
    </div>
  );
}

function readFile(file: File): Promise<Attachment> {
  return new Promise((resolve) => {
    const base: Attachment = { id: uid("f"), name: file.name, size: file.size, mime: file.type };
    if (!file.type.startsWith("image/") || file.size > 1.5 * 1024 * 1024) return resolve(base);
    const reader = new FileReader();
    reader.onload = () => resolve({ ...base, dataUrl: String(reader.result) });
    reader.onerror = () => resolve(base);
    reader.readAsDataURL(file);
  });
}

function DetailsStep({
  draft,
  errors,
  onChange,
}: {
  draft: TicketDraft;
  errors: DraftErrors;
  onChange: (d: TicketDraft) => void;
}) {
  const [onBehalf, setOnBehalf] = useState(!!draft.onBehalfOf);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => {
      if (f.size > MAX_FILE_BYTES) {
        toast.error(`${f.name} supera el máximo de 10 MB`);
        return false;
      }
      return true;
    });
    const room = 6 - draft.attachments.length;
    if (valid.length > room) toast.error("Puedes adjuntar hasta 6 archivos.");
    const read = await Promise.all(valid.slice(0, Math.max(room, 0)).map(readFile));
    onChange({ ...draft, attachments: [...draft.attachments, ...read] });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground tabular">{draft.title.length}/120</span>
        </div>
        <Input
          id="title"
          maxLength={120}
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          placeholder="Resume el problema en una frase"
          className={cn("mt-1.5 h-11", errors.title && "border-destructive")}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">Un título breve y claro ayuda a clasificar tu ticket más rápido.</p>
        <FieldError>{errors.title}</FieldError>
      </div>
      <div>
        <Label htmlFor="description">
          Descripción <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          placeholder="¿Qué ocurrió? ¿Desde cuándo? ¿A quiénes afecta? Incluye cualquier detalle que ayude a resolverlo."
          className={cn("mt-1.5 min-h-[140px]", errors.description && "border-destructive")}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">Describe el problema con el mayor detalle posible.</p>
        <FieldError>{errors.description}</FieldError>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Label htmlFor="behalf-switch" className="text-sm">
              Notificar en nombre de otra persona
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              La persona indicada recibirá las actualizaciones del ticket.
            </p>
          </div>
          <Switch
            id="behalf-switch"
            checked={onBehalf}
            onCheckedChange={(v) => {
              setOnBehalf(v);
              if (!v) onChange({ ...draft, onBehalfOf: "" });
            }}
          />
        </div>
        {onBehalf && (
          <div className="mt-4">
            <Input
              type="email"
              value={draft.onBehalfOf}
              onChange={(e) => onChange({ ...draft, onBehalfOf: e.target.value })}
              placeholder="nombre.apellido@usm.cl"
              className={cn("h-11", errors.onBehalfOf && "border-destructive")}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">Debe ser un correo institucional @usm.cl.</p>
            <FieldError>{errors.onBehalfOf}</FieldError>
          </div>
        )}
      </div>

      <div>
        <Label>
          Fotos o archivos <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-dots px-6 py-8 text-center transition-colors hover:border-ring/50",
            dragging && "border-primary bg-accent/50",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <UploadCloud className="size-5" />
          </span>
          <p className="text-sm font-medium">
            Arrastra archivos aquí o haz clic para seleccionarlos
          </p>
          <p className="text-xs text-muted-foreground">
            Imágenes, PDF o documentos · hasta 10 MB cada uno · máximo 6
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
            className="hidden"
            onChange={(e) => {
              void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {draft.attachments.length > 0 && (
          <AttachmentList
            items={draft.attachments}
            onRemove={(id) =>
              onChange({ ...draft, attachments: draft.attachments.filter((a) => a.id !== id) })
            }
          />
        )}
      </div>
    </div>
  );
}

function AttachmentList({
  items,
  onRemove,
}: {
  items: Attachment[];
  onRemove?: (id: string) => void;
}) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((a) => (
        <li key={a.id} className="flex min-w-0 items-center gap-3 rounded-lg border bg-card p-2">
          {a.dataUrl ? (
            <img src={a.dataUrl} alt={a.name} className="size-10 shrink-0 rounded-md object-cover" />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="size-4 text-muted-foreground" />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">{a.name}</span>
            <span className="text-xs text-muted-foreground">{bytes(a.size)}</span>
          </span>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onRemove(a.id)}
              aria-label={`Quitar ${a.name}`}
            >
              <X />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

function SummaryStep({
  draft,
  limited,
  onEdit,
}: {
  draft: TicketDraft;
  limited: boolean;
  onEdit: (s: StepId) => void;
}) {
  const category = getCategory(draft.categoryId);
  const loc = draft.location;
  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm text-muted-foreground">
        Revisa que la información sea correcta antes de confirmar.
      </p>
      <dl className="divide-y rounded-xl border">
        <Row label="Tipo de problema" locked={limited} onEdit={() => onEdit("tipo")}>
          {typeLabel(draft.type)}
        </Row>
        <Row label="Categoría" locked={limited} onEdit={() => onEdit("categoria")}>
          {category?.name}
        </Row>
        <Row label="Ubicación" locked={limited} onEdit={() => onEdit("ubicacion")}>
          {loc.campus}
          {(loc.building || loc.room) && (
            <span className="block text-muted-foreground">
              {[loc.building, loc.room].filter(Boolean).join(" · ")}
            </span>
          )}
        </Row>
        <Row label="Título" onEdit={() => onEdit("detalles")}>
          {draft.title}
        </Row>
        <Row label="Descripción" onEdit={() => onEdit("detalles")}>
          <span className="whitespace-pre-line">{draft.description}</span>
        </Row>
        <Row label="En nombre de" locked={limited} onEdit={() => onEdit("detalles")}>
          {draft.onBehalfOf || <span className="text-muted-foreground">No aplica</span>}
        </Row>
        <Row label="Archivos" onEdit={() => onEdit("detalles")}>
          {draft.attachments.length ? (
            <span className="flex min-w-0 flex-wrap gap-1.5">
              {draft.attachments.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
                  title={a.name}
                >
                  <Paperclip className="size-3 shrink-0" /> <span className="truncate">{a.name}</span>
                </span>
              ))}
            </span>
          ) : (
            <span className="text-muted-foreground">Sin archivos</span>
          )}
        </Row>
      </dl>
    </div>
  );
}

function Row({
  label,
  children,
  onEdit,
  locked,
}: {
  label: string;
  children: ReactNode;
  onEdit: () => void;
  locked?: boolean;
}) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr_auto] sm:items-start sm:gap-4">
      <dt className="text-xs font-medium text-muted-foreground sm:pt-0.5">{label}</dt>
      <dd className="min-w-0 text-sm">{children}</dd>
      <div className="sm:text-right">
        {locked ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Bloqueado
          </span>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer text-xs font-medium text-primary hover:underline"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
