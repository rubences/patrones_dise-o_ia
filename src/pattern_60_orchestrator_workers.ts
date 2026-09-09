/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 60 — ORCHESTRATOR-WORKERS (ORQUESTADOR-TRABAJADORES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  El orquestador descompone un objetivo en un DAG de subtareas. Solo
 *  despacha nodos cuyas dependencias están completadas; si el plan se
 *  bloquea (ciclo o referencia imposible), falla de forma explícita.
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
  progreso: number;
}

export function parsearPlanOrquestador(texto: string): Subtarea[] {
  const subtareas: Subtarea[] = [];

  for (const linea of texto.split("\n")) {
    const matchId = linea.match(/^TAREA(\d+):\s*(.+)$/i);
    if (!matchId) continue;

    const numero = Number(matchId[1]);
    const partes = matchId[2].split("|").map((p) => p.trim());
    const descripcion = partes[0]?.trim() ?? "";
    const worker = partes.find((p) => /^WORKER:/i.test(p))?.replace(/^WORKER:\s*/i, "").trim();
    const depsRaw = partes.find((p) => /^DEPS:/i.test(p))?.replace(/^DEPS:\s*/i, "").trim() ?? "ninguna";

    if (!descripcion || !worker) continue;

    const dependencias = /^ninguna$/i.test(depsRaw)
      ? []
      : depsRaw
          .split(/[,;]+/)
          .map((d) => d.trim())
          .filter(Boolean)
          .map((d) => {
            const m = d.match(/^(?:TAREA|t)?\s*(\d+)$/i);
            return m ? `t${Number(m[1])}` : d;
          });

    subtareas.push({
      id: `t${numero}`,
      descripcion,
      worker,
      dependencias,
      estado: "pendiente",
    });
  }

  return subtareas;
}

export function dependenciasCompletadas(subtarea: Subtarea, subtareas: Subtarea[]): boolean {
  return subtarea.dependencias.every((depId) =>
    subtareas.some((s) => s.id === depId && s.estado === "completada"),
  );
}

export function subtareasListas(subtareas: Subtarea[]): Subtarea[] {
  return subtareas.filter(
    (s) => s.estado === "pendiente" && dependenciasCompletadas(s, subtareas),
  );
}

function validarReferenciasDependencias(subtareas: Subtarea[]): void {
  const ids = new Set(subtareas.map((s) => s.id));
  const desconocidas = subtareas.flatMap((s) =>
    s.dependencias.filter((d) => !ids.has(d)).map((d) => `${s.id} -> ${d}`),
  );
  if (desconocidas.length > 0) {
    throw new Error(`Plan inválido: dependencias desconocidas: ${desconocidas.join(", ")}`);
  }
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
      instructions: `Eres el worker especializado en ${this.especialidad}.\n\nContexto de tareas anteriores: ${contextoAnterior || "Ninguno"}\n\nTu tarea: ${subtarea.descripcion}\n\nResponde en 2-3 oraciones con tu resultado específico.`,
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
      instructions: `Descompón este objetivo en 3-4 subtareas concretas, asignando cada una al worker más apropiado.\nWorkers disponibles: investigador, analista, redactor, revisor\n\nObjetivo: ${objetivo}\n\nResponde exactamente en formato:\nTAREA1: [descripción] | WORKER: investigador | DEPS: ninguna\nTAREA2: [descripción] | WORKER: analista | DEPS: TAREA1\nTAREA3: [descripción] | WORKER: redactor | DEPS: TAREA1,TAREA2`,
      input: "",
    });

    const subtareas = parsearPlanOrquestador(resp.output_text);
    if (subtareas.length === 0) throw new Error("El orquestador no produjo un plan válido");
    validarReferenciasDependencias(subtareas);
    return subtareas;
  }

  async ejecutar(objetivo: string): Promise<{ plan: PlanOrquestador; resumen: string }> {
    console.log(`\n   🎯 Orquestador: "${objetivo.slice(0, 60)}..."`);

    const subtareas = await this.planificar(objetivo);
    console.log(`   📋 Plan generado: ${subtareas.length} subtareas`);

    const plan: PlanOrquestador = { objetivo, subtareas, progreso: 0 };
    const resultadosAnterior: Record<string, string> = {};

    while (subtareas.some((s) => s.estado === "pendiente")) {
      const listas = subtareasListas(subtareas);
      if (listas.length === 0) {
        const pendientes = subtareas.filter((s) => s.estado === "pendiente").map((s) => s.id);
        throw new Error(`Plan bloqueado: no hay subtareas ejecutables; posibles ciclos/dependencias: ${pendientes.join(", ")}`);
      }

      // Ejecutamos la ola lista en paralelo: por definición, ninguna depende de
      // otra dentro de la misma ola; todas dependen solo de resultados ya completos.
      await Promise.all(listas.map(async (subtarea) => {
        const worker = this.workers.get(subtarea.worker);
        if (!worker) {
          subtarea.estado = "fallida";
          throw new Error(`Worker no registrado: ${subtarea.worker} para ${subtarea.id}`);
        }

        subtarea.estado = "ejecutando";
        const contexto = Object.entries(resultadosAnterior)
          .map(([id, r]) => `${id}: ${r.slice(0, 80)}`)
          .join("\n");

        console.log(`   ⚙️  ${subtarea.id} → ${worker.nombre}: "${subtarea.descripcion.slice(0, 50)}..."`);
        try {
          subtarea.resultado = await worker.ejecutar(subtarea, contexto);
          subtarea.estado = "completada";
          resultadosAnterior[subtarea.id] = subtarea.resultado;
          console.log(`   ✅ ${subtarea.id} completada`);
        } catch (error) {
          subtarea.estado = "fallida";
          throw error;
        }
      }));

      plan.progreso = Math.round(
        (subtareas.filter((s) => s.estado === "completada").length / subtareas.length) * 100,
      );
      console.log(`   📈 Progreso: ${plan.progreso}%`);
    }

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
  const { plan, resumen } = await orquestador.ejecutar(
    "Crear un informe completo sobre la implementación de sistemas agénticos en empresas",
  );
  console.log(`\n   Subtareas ejecutadas: ${plan.subtareas.length}`);
  console.log(`   Progreso final: ${plan.progreso}%`);
  console.log(`\n   Resumen sintetizado: "${resumen.slice(0, 300)}..."`);
  paso("✅", "Orchestrator-Workers respetando dependencias reales del DAG");
}

async function main(): Promise<void> { await demostrarOrchestratorWorkers(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
