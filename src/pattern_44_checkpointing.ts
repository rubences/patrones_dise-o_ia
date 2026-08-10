/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 44 — CHECKPOINTING (PUNTOS DE GUARDADO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Tarea larga]
 *       │
 *  ╔════╧════╗  ← Checkpoint 1
 *  ║ SAVE ✓  ║
 *  ╚════╤════╝
 *       │
 *  ╔════╧════╗  ← Checkpoint 2
 *  ║ SAVE ✓  ║
 *  ╚════╤════╝
 *       │
 *       ✗ FALLO
 *       │
 *       ▼
 *  [Recuperar desde Checkpoint 2]
 *  └─ Reanudar sin perder progreso
 *
 *  Idea: Guardar el estado del agente en puntos clave para
 *  reanudar desde ahí en caso de fallo, sin empezar de cero.
 *
 *  Ventajas:
 *  - Tolerancia a fallos en tareas largas
 *  - Reanudar progreso sin perder trabajo
 *  - Auditoría de progreso
 *  - Ahorro de tokens en re-ejecuciones
 */

import { isDirectRun, makeClient, paso } from "./common.js";
import OpenAI from "openai";
import { DEFAULT_MODEL } from "./common.js";

export interface Checkpoint {
  id: string;
  paso: number;
  timestamp: Date;
  estadoAgente: Record<string, unknown>;
  resultadosParciales: string[];
  completado: boolean;
}

export class GestorCheckpoints {
  private checkpoints: Map<string, Checkpoint> = new Map();
  private idActual: string = "";

  iniciar(tareaId: string): void {
    this.idActual = tareaId;
    console.log(`   📂 Tarea iniciada: ${tareaId}`);
  }

  guardar(paso: number, estado: Record<string, unknown>, resultados: string[]): Checkpoint {
    const cp: Checkpoint = {
      id: `${this.idActual}-cp${paso}`,
      paso,
      timestamp: new Date(),
      estadoAgente: JSON.parse(JSON.stringify(estado)),
      resultadosParciales: [...resultados],
      completado: false,
    };
    this.checkpoints.set(cp.id, cp);
    console.log(`   💾 Checkpoint ${paso} guardado (${resultados.length} resultados)`);
    return cp;
  }

  obtenerUltimo(): Checkpoint | null {
    const todos = Array.from(this.checkpoints.values()).sort(
      (a, b) => b.paso - a.paso,
    );
    return todos[0] ?? null;
  }

  marcarCompletado(id: string): void {
    const cp = this.checkpoints.get(id);
    if (cp) cp.completado = true;
  }

  listar(): Checkpoint[] {
    return Array.from(this.checkpoints.values()).sort((a, b) => a.paso - b.paso);
  }
}

export class AgenteConCheckpointing {
  private gestor: GestorCheckpoints;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.gestor = new GestorCheckpoints();
  }

  async ejecutarTareaLarga(
    tarea: string,
    pasos: string[],
    reanudarDesde?: Checkpoint,
  ): Promise<string[]> {
    const resultados: string[] = [];
    let estadoActual: Record<string, unknown> = { tarea, iniciado: new Date() };
    let pasoInicial = 0;

    this.gestor.iniciar(`tarea-${Date.now()}`);

    // Reanudar desde checkpoint si se proporciona
    if (reanudarDesde) {
      console.log(`\n   ↩️  Reanudando desde checkpoint ${reanudarDesde.paso}`);
      resultados.push(...reanudarDesde.resultadosParciales);
      estadoActual = reanudarDesde.estadoAgente;
      pasoInicial = reanudarDesde.paso;
    }

    for (let i = pasoInicial; i < pasos.length; i++) {
      const descripcionPaso = pasos[i];
      console.log(`\n   ⚙️  Paso ${i + 1}/${pasos.length}: ${descripcionPaso}`);

      // Simular fallo en paso 3 (para demostrar recuperación)
      if (i === 2 && !reanudarDesde) {
        console.log(`   ⚠️  Fallo simulado en paso ${i + 1}`);
        const cp = this.gestor.guardar(i, estadoActual, resultados);
        throw Object.assign(new Error(`Fallo simulado en paso ${i + 1}`), { checkpoint: cp });
      }

      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: `Ejecuta este paso de la tarea "${tarea}": ${descripcionPaso}. Responde en 1-2 oraciones.`,
        input: "",
      });

      resultados.push(`[Paso ${i + 1}] ${resp.output_text.slice(0, 100)}`);
      estadoActual = { ...estadoActual, ultimoPaso: i + 1, pasoDesc: descripcionPaso };

      // Guardar checkpoint cada 2 pasos
      if ((i + 1) % 2 === 0 || i === pasos.length - 1) {
        const cp = this.gestor.guardar(i + 1, estadoActual, resultados);
        if (i === pasos.length - 1) this.gestor.marcarCompletado(cp.id);
      }
    }

    return resultados;
  }

  obtenerGestor(): GestorCheckpoints {
    return this.gestor;
  }
}

export async function demostrarCheckpointing(client: OpenAI = makeClient()): Promise<void> {
  paso("💾", "Demostrando Checkpointing Pattern");

  const agente = new AgenteConCheckpointing(client);

  const pasos = [
    "Analizar requisitos del sistema",
    "Diseñar arquitectura inicial",
    "Implementar módulo core",
    "Añadir tests unitarios",
    "Desplegar en staging",
  ];

  paso("1️⃣", "Ejecutar tarea con fallo simulado");

  let checkpointRecuperacion: Checkpoint | undefined;

  try {
    await agente.ejecutarTareaLarga("Construir sistema agéntico", pasos);
  } catch (err: unknown) {
    if (err instanceof Error && "checkpoint" in err) {
      checkpointRecuperacion = (err as Error & { checkpoint: Checkpoint }).checkpoint;
      console.log(`\n   🔴 Fallo capturado. Último checkpoint: paso ${checkpointRecuperacion.paso}`);
    }
  }

  paso("2️⃣", "Reanudar desde último checkpoint");

  if (checkpointRecuperacion) {
    const agente2 = new AgenteConCheckpointing(client);
    const resultados = await agente2.ejecutarTareaLarga(
      "Construir sistema agéntico",
      pasos,
      checkpointRecuperacion,
    );
    console.log(`\n   ✅ Completado. ${resultados.length} pasos en total`);
    resultados.forEach((r) => console.log(`   ${r.slice(0, 80)}`));
  }

  paso("3️⃣", "Historial de checkpoints");

  agente.obtenerGestor().listar().forEach((cp) => {
    console.log(`   Checkpoint ${cp.paso}: ${cp.resultadosParciales.length} resultados | ${cp.completado ? "✅" : "⏸️"}`);
  });

  paso("✅", "Checkpointing garantizando tolerancia a fallos en tareas largas");
}

async function main(): Promise<void> {
  await demostrarCheckpointing();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
