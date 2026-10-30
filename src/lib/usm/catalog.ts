import type { Person, TicketType } from "./types";

export interface Category {
  id: string;
  type: TicketType;
  name: string;
  description: string;
  team: TeamId;
}

export type TeamId = "mesa" | "academicos" | "infraestructura" | "plataforma";

export const TICKET_TYPES: {
  id: TicketType;
  name: string;
  description: string;
  examples: string;
}[] = [
  {
    id: "incidencia",
    name: "Incidencia",
    description: "Algo dejó de funcionar o funciona de forma incorrecta.",
    examples: "Una plataforma caída, un equipo dañado, una sala sin proyector.",
  },
  {
    id: "requerimiento",
    name: "Requerimiento",
    description: "Necesitas solicitar un servicio, acceso, recurso o cambio.",
    examples: "Instalar software, pedir una licencia, habilitar un acceso.",
  },
];

const inc = (slug: string, name: string, description: string, team: TeamId): Category => ({
  id: `inc-${slug}`,
  type: "incidencia",
  name,
  description,
  team,
});

const req = (slug: string, name: string, description: string, team: TeamId): Category => ({
  id: `req-${slug}`,
  type: "requerimiento",
  name,
  description,
  team,
});

export const CATEGORIES: Category[] = [
  inc("ansys", "Ansys", "Errores de ejecución, licencias que no responden o cierres inesperados.", "mesa"),
  inc("aula", "Aula", "Problemas para acceder a cursos, entregar tareas o ver contenidos.", "academicos"),
  inc("sala", "Sala de clases", "Proyector, audio, enchufes, mobiliario o climatización con fallas.", "infraestructura"),
  inc("laboratorio", "Laboratorio", "Equipos o instrumentos de laboratorio que no funcionan.", "infraestructura"),
  inc("matlab", "Matlab", "Errores de instalación, activación o ejecución.", "mesa"),
  inc("nube", "Nube", "Servicios de almacenamiento o máquinas virtuales no disponibles.", "mesa"),
  inc("office", "Office 365", "Correo, Teams, OneDrive u otras aplicaciones con fallas.", "mesa"),
  inc("pagos", "Portal de Pagos", "Pagos rechazados, montos incorrectos o portal no disponible.", "academicos"),
  inc("siga", "Siga", "Errores al consultar notas, inscribir asignaturas o ver horarios.", "academicos"),
  inc("sireb", "Sireb", "Problemas con préstamos, reservas o catálogo de biblioteca.", "academicos"),
  inc("so", "Sistemas Operativos", "Equipos institucionales que no inician o presentan errores.", "mesa"),
  inc("red", "Red y Wi-Fi", "Sin conexión, señal débil o problemas de autenticación en la red.", "infraestructura"),
  inc("impresion", "Impresión", "Impresoras sin servicio, atascos o cola de impresión detenida.", "infraestructura"),
  inc("otro", "Otro", "Cualquier otra falla que no aparezca en esta lista.", "mesa"),

  req("ansys", "Ansys", "Solicitud de licencia o instalación en un equipo.", "mesa"),
  req("aula", "Aula", "Creación de cursos, matrícula de participantes o cambios de rol.", "academicos"),
  req("sala", "Sala de clases", "Reserva de salas, equipamiento audiovisual o mobiliario adicional.", "infraestructura"),
  req("laboratorio", "Laboratorio", "Acceso a laboratorios, insumos o configuración de equipos.", "infraestructura"),
  req("matlab", "Matlab", "Solicitud de licencia, toolboxes o instalación.", "mesa"),
  req("nube", "Nube", "Nuevos espacios de almacenamiento o máquinas virtuales.", "mesa"),
  req("office", "Office 365", "Listas de distribución, grupos de Teams o licencias adicionales.", "mesa"),
  req("pagos", "Portal de Pagos", "Certificados de pago, convenios o cambios de datos de facturación.", "academicos"),
  req("siga", "Siga", "Certificados, actualización de datos o permisos de acceso.", "academicos"),
  req("sireb", "Sireb", "Adquisición de material bibliográfico o renovación especial.", "academicos"),
  req("so", "Sistemas Operativos", "Instalación o actualización del sistema operativo de un equipo.", "mesa"),
  req("software", "Software", "Instalación de software específico para docencia o investigación.", "mesa"),
  req("cuentas", "Cuentas y accesos", "Creación de cuentas, restablecimiento o permisos especiales.", "plataforma"),
  req("otro", "Otro", "Cualquier otra solicitud que no aparezca en esta lista.", "mesa"),
];

export function categoriesFor(type: TicketType | null): Category[] {
  if (!type) return [];
  return CATEGORIES.filter((c) => c.type === type);
}

export function getCategory(id: string | null | undefined): Category | undefined {
  if (!id) return undefined;
  return CATEGORIES.find((c) => c.id === id);
}

export const CAMPUSES = [
  "Casa Central Valparaíso",
  "Campus Santiago San Joaquín",
  "Campus Santiago Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
];

export interface Contact extends Person {
  role: string;
  team: TeamId;
}

export const TEAMS: { id: TeamId; name: string; description: string }[] = [
  {
    id: "plataforma",
    name: "Coordinación de la plataforma",
    description: "Administración de USM Denuncia, cuentas y criterios de atención.",
  },
  {
    id: "mesa",
    name: "Mesa de ayuda TI",
    description: "Software, licencias, Office 365, servicios en la nube y equipos.",
  },
  {
    id: "academicos",
    name: "Sistemas académicos",
    description: "Aula, Siga, Sireb y Portal de Pagos.",
  },
  {
    id: "infraestructura",
    name: "Infraestructura y operaciones",
    description: "Salas, laboratorios, red, impresión y mantención.",
  },
];

export const CONTACTS: Contact[] = [
  { name: "Carolina Fuentes Ibarra", email: "carolina.fuentes@usm.cl", role: "Coordinadora de la plataforma", team: "plataforma" },
  { name: "Matías Rojas Herrera", email: "matias.rojas@usm.cl", role: "Administrador de sistemas", team: "plataforma" },
  { name: "Daniela Soto Pizarro", email: "daniela.soto@usm.cl", role: "Jefa de mesa de ayuda", team: "mesa" },
  { name: "Felipe Araya Muñoz", email: "felipe.araya@usm.cl", role: "Analista de soporte TI", team: "mesa" },
  { name: "Javiera Contreras León", email: "javiera.contreras@usm.cl", role: "Analista de soporte TI", team: "mesa" },
  { name: "Ignacio Vergara Díaz", email: "ignacio.vergara@usm.cl", role: "Especialista en sistemas académicos", team: "academicos" },
  { name: "Valentina Morales Castro", email: "valentina.morales@usm.cl", role: "Analista de plataformas docentes", team: "academicos" },
  { name: "Rodrigo Espinoza Vidal", email: "rodrigo.espinoza@usm.cl", role: "Supervisor de infraestructura", team: "infraestructura" },
  { name: "Constanza Reyes Navarro", email: "constanza.reyes@usm.cl", role: "Técnica de laboratorios y salas", team: "infraestructura" },
  { name: "Sebastián Molina Tapia", email: "sebastian.molina@usm.cl", role: "Técnico de redes", team: "infraestructura" },
];

export const SUPPORT_EMAIL = "soporte.denuncia@usm.cl";
