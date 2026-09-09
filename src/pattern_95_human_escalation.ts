/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 95 — HUMAN ESCALATION / HANDOFF
 * ═══════════════════════════════════════════════════════════════════
 */

import { isDirectRun, paso } from "./common.js";

export interface MensajeHistorial {
  rol: "usuario" | "agente";
  texto: string;
}

export type PrioridadHandoff = "baja" | "media" | "alta" | "critica";
export type EstadoHandoff = "queued" | "accepted" | "resolved";

export interface PaqueteHandoff {
  id: string;
  resumen: string;
  intentos: number;
  categoria: string;
  prioridad: PrioridadHandoff;
  historial: MensajeHistorial[];
  estado: EstadoHandoff;
  owner?: string;
  creadoEn: number;
  aceptadoEn?: number;
  resueltoEn?: number;
}

export interface ConfigEscalacion {
  maxIntentos: number;
  categoriasEscalacion: string[];
  prioridadPorCategoria?: Record<string, PrioridadHandoff>;
}

const PESO_PRIORIDAD: Record<PrioridadHandoff, number> = { baja: 0, media: 1, alta: 2, critica: 3 };

function prioridadMaxima(a: PrioridadHandoff, b: PrioridadHandoff): PrioridadHandoff {
  return PESO_PRIORIDAD[a] >= PESO_PRIORIDAD[b] ? a : b;
}

export class PoliticaEscalacion {
  constructor(private config: ConfigEscalacion) {}

  debeEscalar(mensaje: string, intentosFallidos: number, categoria: string): { escalar: boolean; razon?: string } {
    if (/\b(humano|persona|agente real|operador|supervisor)\b/i.test(mensaje)) {
      return { escalar: true, razon: "solicitud explícita del usuario" };
    }
    if (this.config.categoriasEscalacion.includes(categoria)) {
      return { escalar: true, razon: `categoría ${categoria} requiere atención humana` };
    }
    if (intentosFallidos >= this.config.maxIntentos) {
      return { escalar: true, razon: `${intentosFallidos} intentos automáticos fallidos` };
    }
    return { escalar: false };
  }

  prioridad(intentosFallidos: number, categoria: string): PrioridadHandoff {
    const porIntentos: PrioridadHandoff = intentosFallidos >= 5 ? "alta" : intentosFallidos >= 2 ? "media" : "baja";
    const porCategoria = this.config.prioridadPorCategoria?.[categoria] ?? "baja";
    return prioridadMaxima(porIntentos, porCategoria);
  }
}

export class GestorHandoff {
  private casos = new Map<string, PaqueteHandoff>();

  encolar(paquete: Omit<PaqueteHandoff, "id" | "estado" | "creadoEn">): PaqueteHandoff {
    const id = `handoff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const caso: PaqueteHandoff = { ...paquete, id, estado: "queued", creadoEn: Date.now() };
    this.casos.set(id, caso);
    return structuredClone(caso);
  }

  aceptar(id: string, owner: string): PaqueteHandoff {
    const caso = this.casos.get(id);
    if (!caso) throw new Error(`Handoff no encontrado: ${id}`);
    if (caso.estado !== "queued") throw new Error(`Solo un handoff queued puede aceptarse; estado actual: ${caso.estado}`);
    caso.estado = "accepted";
    caso.owner = owner;
    caso.aceptadoEn = Date.now();
    return structuredClone(caso);
  }

  resolver(id: string): PaqueteHandoff {
    const caso = this.casos.get(id);
    if (!caso) throw new Error(`Handoff no encontrado: ${id}`);
    if (caso.estado !== "accepted") throw new Error(`Solo un handoff accepted puede resolverse; estado actual: ${caso.estado}`);
    caso.estado = "resolved";
    caso.resueltoEn = Date.now();
    return structuredClone(caso);
  }

  obtener(id: string): PaqueteHandoff | null {
    const caso = this.casos.get(id);
    return caso ? structuredClone(caso) : null;
  }
}

export class AgenteConHandoff {
  private intentosFallidos = 0;
  private historial: MensajeHistorial[] = [];

  constructor(
    private politica: PoliticaEscalacion,
    private gestor: GestorHandoff = new GestorHandoff(),
  ) {}

  async procesar(mensaje: string, categoria: string, simularFallo = false): Promise<{ respuesta?: string; handoff?: PaqueteHandoff }> {
    this.historial.push({ rol: "usuario", texto: mensaje });

    if (simularFallo) this.intentosFallidos++;
    const decision = this.politica.debeEscalar(mensaje, this.intentosFallidos, categoria);

    if (decision.escalar) {
      const historialRelevante = this.historial.slice(-6);
      const resumen = historialRelevante
        .slice(-3)
        .map((m) => `${m.rol}: ${m.texto}`)
        .join(" | ");

      const handoff = this.gestor.encolar({
        resumen,
        intentos: this.intentosFallidos,
        categoria,
        prioridad: this.politica.prioridad(this.intentosFallidos, categoria),
        historial: historialRelevante,
      });
      return { handoff };
    }

    const respuesta = simularFallo
      ? "No he podido resolverlo todavía."
      : "Solicitud procesada automáticamente.";
    this.historial.push({ rol: "agente", texto: respuesta });
    return { respuesta };
  }

  obtenerGestor(): GestorHandoff {
    return this.gestor;
  }
}

export async function demostrarHumanEscalation(): Promise<void> {
  paso("🤝", "Demostrando Human Escalation / Handoff Pattern");
  const politica = new PoliticaEscalacion({
    maxIntentos: 3,
    categoriasEscalacion: ["fraude", "legal"],
    prioridadPorCategoria: { fraude: "critica", legal: "alta" },
  });
  const gestor = new GestorHandoff();
  const agente = new AgenteConHandoff(politica, gestor);

  const resultado = await agente.procesar("He detectado cargos que no reconozco", "fraude");
  if (resultado.handoff) {
    console.log(`   Handoff ${resultado.handoff.id}: ${resultado.handoff.prioridad} / ${resultado.handoff.estado}`);
    const aceptado = gestor.aceptar(resultado.handoff.id, "operador-42");
    console.log(`   Aceptado por ${aceptado.owner}`);
  }

  paso("✅", "Handoff con lifecycle explícito queued → accepted → resolved");
}

async function main(): Promise<void> { await demostrarHumanEscalation(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
