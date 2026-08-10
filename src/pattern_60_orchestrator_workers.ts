/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 60 — ORCHESTRATOR-WORKERS (ORQUESTADOR-TRABAJADORES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Tarea Compleja]
 *       │
 *       ▼
 *  [Orquestador LLM]
 *  └─ Descompone en subtareas
 *  └─ Asigna a workers especializados
 *  └─ Monitorea progreso
 *  └─ Sintetiza resultados
 *
 *       │
 *   ┌───┼───┬───┐
 *   ▼   ▼   ▼   ▼
 *  [W1][W2][W3][W4]  ← Workers especializados
 *   │   │   │   │
 *   └───┴───┴───┘
 *       │
 *       ▼
 *  [Orquestador sintetiza]
 *       │
 *       ▼
 *  [Resultado Final]
 *
 *  Idea: El orquestador planifica y coordina; los workers ejecutan.
 *  El orquestador adapta el plan según resultados intermedios.
 *
 *  Ventajas:
 *  - Separación de responsabilidades (planificación vs ejecución)
 *  - Adaptación dinámica del plan
 *  - Escalabilidad de workers
 *  - Visibilidad total del proceso
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Subtarea {
  id: string;
  descripcion: string;
  worker: string;
  dependencias: string[];
  estado: "pendiente" | "ejecutando" | "completada" | "fallida";
  resultado?: string;
}

export interface PlanOrquestador {
  objetivo: string;
  subtareas: Subtarea[];
  progreso: number; // 0-100
}

export class WorkerEspecializado {
  readonly nombre: string;
  readonly especialidad: string;
  private client: OpenAI;

  constructor(nombre: string, especialidad: string, client: OpenAI) {
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.client = client;
  }

  async ejecutar(subtarea: Subtarea, contextoAnterior: string): Promise<string> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres el worker especializado en ${this.especialidad}.
      
Contexto de tareas anteriores: ${contextoAnterior || "Ninguno"}

Tu tarea: ${subtarea.descripcion}

Responde en 2-3 oraciones con tu resultado específico.`,
      input: "",
    });
    return resp.output_text;
  }
}

export class Orquestador {
  private workers: Map<string, WorkerEspecializado>;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.workers = new Map([
      ["investigador", new WorkerEspecializado("Investigador", "investigación y recopilación de datos", client)],
      ["analista", new WorkerEspecializado("Analista", "análisis y síntesis de información", client)],
      ["redactor", new WorkerEspecializado("Redactor", "redacción y comunicación", client)],
      ["revisor", new WorkerEspecializado("Revisor", "revisión de calidad y coherencia", client)],
    ]);
  }

  private async planificar(objetivo: string): Promise<Subtarea[]> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Descompón este objetivo en 3-4 subtareas concretas, asignando cada una al worker más apropiado.
Workers disponibles: investigador, analista, redactor, revisor

Objetivo: ${objetivo}

Responde en formato:
TAREA1: [descripción] | WORKER: investigador | DEPS: ninguna
TAREA2: [descripción] | WORKER: analista | DEPS: TAREA1
...`,
      input: "",
    });

    return resp.output_text.split("\n")
      .filter((l) => l.match(/^TAREA\d+:/))
      .map((l, i) => {
        const partes = l.split("|");
        const desc = partes[0].replace(/^TAREA\d+:\s*/, "").trim();
        const worker = partes[1]?.match(/WORKER:\s*(\w+)/)?.[1] ?? "analista";
        const deps = partes[2]?.includes("ninguna") ? [] : [`t${i}`];
        return { id: `t${i + 1}`, descripcion: desc, worker, dependencias: deps, estado: "pendiente" as const };
      });
  }

  async ejecutar(objetivo: string): Promise<{ plan: PlanOrquestador; resumen: string }> {
    console.log(`\n   🎯 Orquestador: "${objetivo.slice(0, 60)}..."`);

    const subtareas = await this.planificar(objetivo);
    console.log(`   📋 Plan generado: ${subtareas.length} subtareas`);

    const plan: PlanOrquestador = { objetivo, subtareas, progreso: 0 };
    const resultadosAnterior: Record<string, string> = {};

    // Ejecutar respetando dependencias
    for (const subtarea of subtareas) {
      // Esperar dependencias
      const depsPendientes = subtarea.dependencias.filter(
        (d) => subtareas.find((s) => s.id === d)?.estado !== "completada",
      );
      if (depsPendientes.length > 0) {
        console.log(`   ⏳ ${subtarea.id} esperando: ${depsPendientes.join(", ")}`);
      }

      subtarea.estado = "ejecutando";
      const worker = this.workers.get(subtarea.worker) ?? this.workers.get("analista")!;
      const contexto = Object.entries(resultadosAnterior)
        .map(([id, r]) => `${id}: ${r.slice(0, 80)}`)
        .join("\n");

      console.log(`   ⚙️  ${subtarea.id} → ${worker.nombre}: "${subtarea.descripcion.slice(0, 50)}..."`);
      subtarea.resultado = await worker.ejecutar(subtarea, contexto);
      subtarea.estado = "completada";
      resultadosAnterior[subtarea.id] = subtarea.resultado;

      plan.progreso = Math.round(
        (subtareas.filter((s) => s.estado === "completada").length / subtareas.length) * 100,
      );
      console.log(`   ✅ ${subtarea.id} completada (progreso: ${plan.progreso}%)`);
    }

    // Síntesis final
    const todosResultados = subtareas
      .filter((s) => s.resultado)
      .map((s) => `[${s.worker}] ${s.resultado}`)
      .join("\n\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Sintetiza estos resultados de workers en una respuesta final cohesiva para: "${objetivo}"\n\n${todosResultados}`,
      input: "",
    });

    return { plan, resumen: resp.output_text };
  }
}

export async function demostrarOrchestratorWorkers(client: OpenAI = makeClient()): Promise<void> {
  paso("🎼", "Demostrando Orchestrator-Workers Pattern");

  const orquestador = new Orquestador(client);

  paso("1️⃣", "Tarea compleja con múltiples workers");
  const { plan, resumen } = await orquestador.ejecutar(
    "Crear un informe completo sobre la implementación de sistemas agénticos en empresas",
  );

  console.log(`\n   Subtareas ejecutadas: ${plan.subtareas.length}`);
  console.log(`   Progreso final: ${plan.progreso}%`);
  console.log(`\n   Resumen sintetizado:`);
  console.log(`   "${resumen.slice(0, 300)}..."`);

  paso("✅", "Orchestrator-Workers coordinando planificación y ejecución especializada");
}

async function main(): Promise<void> { await demostrarOrchestratorWorkers(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
