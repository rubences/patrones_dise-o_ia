/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 57 — TASK DELEGATION (DELEGACIÓN DINÁMICA DE TAREAS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Tarea entrante]
 *       │
 *       ▼
 *  [Gestor de Delegación]
 *  ├─ ¿Quién está disponible?
 *  ├─ ¿Quién tiene la habilidad?
 *  └─ ¿Quién tiene menor carga?
 *
 *       │
 *       ▼
 *  [Asignación óptima]
 *  ├─ Agente A: Tarea 1, 3, 5
 *  ├─ Agente B: Tarea 2, 4
 *  └─ Agente C: Tarea 6 (pendiente)
 *
 *  Idea: Asignar tareas dinámicamente a agentes según disponibilidad,
 *  habilidades y carga de trabajo actual.
 *
 *  Ventajas:
 *  - Balanceo de carga automático
 *  - Maximiza paralelismo
 *  - Adaptable a cambios de carga
 *  - Priorización dinámica
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface TareaDelegacion {
  id: string;
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  habilidadesRequeridas: string[];
  estado: "pendiente" | "asignada" | "completada";
  agenteAsignado?: string;
  resultado?: string;
}

export interface AgenteDelegacion {
  id: string;
  nombre: string;
  habilidades: string[];
  carga: number; // 0-100%
  disponible: boolean;
}

export class GestorDelegacion {
  private agentes: AgenteDelegacion[];
  private cola: TareaDelegacion[] = [];
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.agentes = [
      { id: "a1", nombre: "Analista", habilidades: ["análisis", "datos", "estadísticas"], carga: 20, disponible: true },
      { id: "a2", nombre: "Redactor", habilidades: ["redacción", "contenido", "documentación"], carga: 50, disponible: true },
      { id: "a3", nombre: "Desarrollador", habilidades: ["código", "implementación", "api"], carga: 80, disponible: true },
      { id: "a4", nombre: "Revisor", habilidades: ["revisión", "calidad", "testing"], carga: 30, disponible: true },
    ];
  }

  encolar(tarea: Omit<TareaDelegacion, "estado">): TareaDelegacion {
    const t = { ...tarea, estado: "pendiente" as const };
    this.cola.push(t);
    console.log(`   📥 Tarea encolada [${t.prioridad}]: "${t.descripcion.slice(0, 50)}..."`);
    return t;
  }

  private seleccionarAgente(tarea: TareaDelegacion): AgenteDelegacion | null {
    const candidatos = this.agentes
      .filter((a) => a.disponible && a.carga < 90)
      .filter((a) => tarea.habilidadesRequeridas.some((h) => a.habilidades.some((ah) => ah.includes(h))))
      .sort((a, b) => a.carga - b.carga); // Menor carga primero

    return candidatos[0] ?? null;
  }

  async ejecutarCola(): Promise<TareaDelegacion[]> {
    // Ordenar por prioridad
    this.cola.sort((a, b) => {
      const prioridades = { alta: 0, media: 1, baja: 2 };
      return prioridades[a.prioridad] - prioridades[b.prioridad];
    });

    const promesas: Promise<void>[] = [];

    for (const tarea of this.cola.filter((t) => t.estado === "pendiente")) {
      const agente = this.seleccionarAgente(tarea);

      if (!agente) {
        console.log(`   ⚠️  Sin agente disponible para: "${tarea.descripcion.slice(0, 40)}..."`);
        continue;
      }

      tarea.estado = "asignada";
      tarea.agenteAsignado = agente.nombre;
      agente.carga = Math.min(100, agente.carga + 20);

      console.log(`   ✅ Asignada "${tarea.descripcion.slice(0, 40)}..." → ${agente.nombre} (carga: ${agente.carga}%)`);

      promesas.push(
        this.ejecutarTarea(tarea, agente).then(() => {
          agente.carga = Math.max(0, agente.carga - 20);
        }),
      );
    }

    await Promise.all(promesas);
    return this.cola;
  }

  private async ejecutarTarea(tarea: TareaDelegacion, agente: AgenteDelegacion): Promise<void> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres ${agente.nombre}, especialista en ${agente.habilidades.join(", ")}.
Completa esta tarea en 1-2 oraciones: ${tarea.descripcion}`,
      input: "",
    });

    tarea.resultado = resp.output_text;
    tarea.estado = "completada";
  }
}

export async function demostrarTaskDelegation(client: OpenAI = makeClient()): Promise<void> {
  paso("📋", "Demostrando Task Delegation Pattern");

  const gestor = new GestorDelegacion(client);

  paso("1️⃣", "Encolar tareas con distintas prioridades y habilidades");
  gestor.encolar({ id: "t1", descripcion: "Analizar métricas de uso del sistema", prioridad: "alta", habilidadesRequeridas: ["análisis", "datos"] });
  gestor.encolar({ id: "t2", descripcion: "Redactar documentación del patrón RAG", prioridad: "media", habilidadesRequeridas: ["documentación"] });
  gestor.encolar({ id: "t3", descripcion: "Implementar endpoint REST para el agente", prioridad: "alta", habilidadesRequeridas: ["código", "api"] });
  gestor.encolar({ id: "t4", descripcion: "Revisar calidad de respuestas del LLM", prioridad: "baja", habilidadesRequeridas: ["revisión", "calidad"] });

  paso("2️⃣", "Ejecutar cola con delegación dinámica");
  const completadas = await gestor.ejecutarCola();

  paso("3️⃣", "Resultados de delegación");
  completadas.filter((t) => t.estado === "completada").forEach((t) => {
    console.log(`\n   [${t.prioridad.toUpperCase()}] ${t.descripcion.slice(0, 50)}`);
    console.log(`   Agente: ${t.agenteAsignado}`);
    console.log(`   Resultado: "${t.resultado?.slice(0, 80)}..."`);
  });

  paso("✅", "Task Delegation asignando trabajo óptimamente entre agentes especializados");
}

async function main(): Promise<void> { await demostrarTaskDelegation(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
