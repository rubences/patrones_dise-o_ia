/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 65 — AGENT REGISTRY (REGISTRO CENTRALIZADO DE AGENTES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Registry Central]
 *  ├─ Agente-A: {nombre, habilidades, estado, endpoint}
 *  ├─ Agente-B: {nombre, habilidades, estado, endpoint}
 *  └─ Agente-C: {nombre, habilidades, estado, endpoint}
 *
 *  [Solicitud de servicio]
 *       │
 *       ▼
 *  [Discovery]
 *  ├─ ¿Quién puede hacer X?
 *  └─ Seleccionar el mejor disponible
 *
 *  Diferencia vs Factory: Factory crea agentes; Registry descubre
 *  y localiza agentes ya existentes en ejecución.
 *
 *  Ventajas:
 *  - Descubrimiento dinámico de agentes
 *  - Sin hardcoding de dependencias
 *  - Health monitoring
 *  - Balanceo de carga por capacidades
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type EstadoAgente = "activo" | "ocupado" | "inactivo" | "error";

export interface RegistroEntrada {
  id: string;
  nombre: string;
  habilidades: string[];
  estado: EstadoAgente;
  carga: number; // 0-100
  llamadasTotales: number;
  ultimaActividad: Date;
  handler: (entrada: string, client: OpenAI) => Promise<string>;
}

export class AgentRegistry {
  private agentes: Map<string, RegistroEntrada> = new Map();

  registrar(entrada: Omit<RegistroEntrada, "llamadasTotales" | "ultimaActividad">): void {
    this.agentes.set(entrada.id, {
      ...entrada,
      llamadasTotales: 0,
      ultimaActividad: new Date(),
    });
    console.log(`   ✓ Registrado: ${entrada.nombre} [${entrada.habilidades.join(", ")}]`);
  }

  descubrir(habilidadRequerida: string): RegistroEntrada | null {
    const candidatos = Array.from(this.agentes.values())
      .filter((a) => a.estado === "activo")
      .filter((a) => a.habilidades.some((h) => h.toLowerCase().includes(habilidadRequerida.toLowerCase())))
      .sort((a, b) => a.carga - b.carga);

    return candidatos[0] ?? null;
  }

  async invocar(habilidad: string, entrada: string, client: OpenAI): Promise<{ resultado: string; agente: string }> {
    const agente = this.descubrir(habilidad);
    if (!agente) throw new Error(`Sin agente disponible para: ${habilidad}`);

    agente.estado = "ocupado";
    agente.carga = Math.min(100, agente.carga + 20);

    try {
      console.log(`   📡 Invocando ${agente.nombre} para "${habilidad}"`);
      const resultado = await agente.handler(entrada, client);
      agente.llamadasTotales++;
      agente.ultimaActividad = new Date();
      return { resultado, agente: agente.nombre };
    } finally {
      agente.estado = "activo";
      agente.carga = Math.max(0, agente.carga - 20);
    }
  }

  listar(): RegistroEntrada[] {
    return Array.from(this.agentes.values());
  }

  ping(id: string): boolean {
    const agente = this.agentes.get(id);
    return agente?.estado !== "inactivo" && agente?.estado !== "error";
  }

  obtenerEstadisticas(): { total: number; activos: number; llamadasTotales: number } {
    const todos = Array.from(this.agentes.values());
    return {
      total: todos.length,
      activos: todos.filter((a) => a.estado === "activo").length,
      llamadasTotales: todos.reduce((s, a) => s + a.llamadasTotales, 0),
    };
  }
}

export async function demostrarAgentRegistry(client: OpenAI = makeClient()): Promise<void> {
  paso("📋", "Demostrando Agent Registry Pattern");

  const registry = new AgentRegistry();

  paso("1️⃣", "Registrar agentes especializados");
  registry.registrar({
    id: "analista-1",
    nombre: "Analista Principal",
    habilidades: ["análisis", "datos", "estadísticas"],
    estado: "activo",
    carga: 20,
    handler: async (entrada, c) => {
      const r = await c.responses.create({ model: DEFAULT_MODEL, reasoning: { effort: "low" }, store: false, instructions: `Analiza brevemente: ${entrada}`, input: "" });
      return r.output_text;
    },
  });

  registry.registrar({
    id: "redactor-1",
    nombre: "Redactor Técnico",
    habilidades: ["redacción", "documentación", "contenido"],
    estado: "activo",
    carga: 10,
    handler: async (entrada, c) => {
      const r = await c.responses.create({ model: DEFAULT_MODEL, reasoning: { effort: "low" }, store: false, instructions: `Redacta brevemente: ${entrada}`, input: "" });
      return r.output_text;
    },
  });

  registry.registrar({
    id: "coder-1",
    nombre: "Experto en Código",
    habilidades: ["código", "typescript", "api", "implementación"],
    estado: "activo",
    carga: 60,
    handler: async (entrada, c) => {
      const r = await c.responses.create({ model: DEFAULT_MODEL, reasoning: { effort: "medium" }, store: false, instructions: `Da una solución de código para: ${entrada}`, input: "" });
      return r.output_text;
    },
  });

  paso("2️⃣", "Descubrir y invocar agentes por habilidad");
  const tasks = [
    { habilidad: "análisis", tarea: "Analiza las tendencias de los LLMs en 2026" },
    { habilidad: "documentación", tarea: "Documenta el patrón RAG en 2 párrafos" },
    { habilidad: "typescript", tarea: "Muestra cómo crear un decorador en TypeScript" },
  ];

  for (const { habilidad, tarea } of tasks) {
    const { resultado, agente } = await registry.invocar(habilidad, tarea, client);
    console.log(`\n   [${agente}] "${resultado.slice(0, 100)}..."`);
  }

  paso("3️⃣", "Estadísticas del registry");
  const stats = registry.obtenerEstadisticas();
  console.log(`\n   Total agentes: ${stats.total} | Activos: ${stats.activos} | Llamadas: ${stats.llamadasTotales}`);
  registry.listar().forEach((a) => {
    console.log(`   ${a.nombre}: carga=${a.carga}% | llamadas=${a.llamadasTotales}`);
  });

  paso("✅", "Agent Registry habilitando descubrimiento dinámico de agentes");
}

async function main(): Promise<void> { await demostrarAgentRegistry(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
