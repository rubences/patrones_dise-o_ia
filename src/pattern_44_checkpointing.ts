/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 44 — CHECKPOINTING (PUNTOS DE GUARDADO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  El gestor separa la lógica de checkpoint de su almacenamiento. La demo
 *  puede usar memoria; producción puede inyectar un store durable. Se incluye
 *  un JsonFileCheckpointStore para demostrar recuperación tras reinicio.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Checkpoint {
  id: string;
  tareaId: string;
  paso: number;
  timestamp: Date;
  estadoAgente: Record<string, unknown>;
  resultadosParciales: string[];
  completado: boolean;
}

export interface CheckpointStore {
  guardar(checkpoint: Checkpoint): void;
  listar(tareaId: string): Checkpoint[];
}

export class MemoryCheckpointStore implements CheckpointStore {
  private checkpoints = new Map<string, Checkpoint>();

  guardar(checkpoint: Checkpoint): void {
    this.checkpoints.set(checkpoint.id, structuredClone(checkpoint));
  }

  listar(tareaId: string): Checkpoint[] {
    return Array.from(this.checkpoints.values())
      .filter((cp) => cp.tareaId === tareaId)
      .map((cp) => structuredClone(cp));
  }
}

interface CheckpointSerializado extends Omit<Checkpoint, "timestamp"> {
  timestamp: string;
}

export class JsonFileCheckpointStore implements CheckpointStore {
  constructor(private ruta: string) {
    mkdirSync(dirname(ruta), { recursive: true });
  }

  private cargarTodos(): CheckpointSerializado[] {
    if (!existsSync(this.ruta)) return [];
    const texto = readFileSync(this.ruta, "utf8").trim();
    if (!texto) return [];
    const datos = JSON.parse(texto) as CheckpointSerializado[];
    if (!Array.isArray(datos)) throw new Error("Checkpoint store inválido: se esperaba un array JSON");
    return datos;
  }

  guardar(checkpoint: Checkpoint): void {
    const todos = this.cargarTodos();
    const serializado: CheckpointSerializado = {
      ...checkpoint,
      timestamp: checkpoint.timestamp.toISOString(),
    };
    const indice = todos.findIndex((cp) => cp.id === checkpoint.id);
    if (indice >= 0) todos[indice] = serializado;
    else todos.push(serializado);

    const temporal = `${this.ruta}.tmp`;
    writeFileSync(temporal, JSON.stringify(todos, null, 2), "utf8");
    renameSync(temporal, this.ruta);
  }

  listar(tareaId: string): Checkpoint[] {
    return this.cargarTodos()
      .filter((cp) => cp.tareaId === tareaId)
      .map((cp) => ({ ...cp, timestamp: new Date(cp.timestamp) }));
  }
}

export class GestorCheckpoints {
  private tareaIdActual = "";

  constructor(private store: CheckpointStore = new MemoryCheckpointStore()) {}

  iniciar(tareaId: string): void {
    this.tareaIdActual = tareaId;
    console.log(`   📂 Tarea iniciada: ${tareaId}`);
  }

  guardar(paso: number, estado: Record<string, unknown>, resultados: string[]): Checkpoint {
    if (!this.tareaIdActual) throw new Error("Debe iniciar una tarea antes de guardar checkpoints");
    const cp: Checkpoint = {
      id: `${this.tareaIdActual}-cp${paso}`,
      tareaId: this.tareaIdActual,
      paso,
      timestamp: new Date(),
      estadoAgente: structuredClone(estado),
      resultadosParciales: [...resultados],
      completado: false,
    };
    this.store.guardar(cp);
    console.log(`   💾 Checkpoint ${paso} guardado (${resultados.length} resultados)`);
    return cp;
  }

  obtenerUltimo(tareaId: string = this.tareaIdActual): Checkpoint | null {
    const todos = this.store.listar(tareaId).sort((a, b) => b.paso - a.paso);
    return todos[0] ?? null;
  }

  marcarCompletado(id: string): void {
    const tareaId = id.replace(/-cp\d+$/, "");
    const cp = this.store.listar(tareaId).find((item) => item.id === id);
    if (!cp) throw new Error(`Checkpoint no encontrado: ${id}`);
    cp.completado = true;
    this.store.guardar(cp);
  }

  listar(tareaId: string = this.tareaIdActual): Checkpoint[] {
    return this.store.listar(tareaId).sort((a, b) => a.paso - b.paso);
  }
}

export class AgenteConCheckpointing {
  private gestor: GestorCheckpoints;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient(), store: CheckpointStore = new MemoryCheckpointStore()) {
    this.client = client;
    this.gestor = new GestorCheckpoints(store);
  }

  async ejecutarTareaLarga(
    tarea: string,
    pasos: string[],
    reanudarDesde?: Checkpoint,
  ): Promise<string[]> {
    const resultados: string[] = [];
    let estadoActual: Record<string, unknown> = { tarea, iniciado: new Date().toISOString() };
    let pasoInicial = 0;
    const tareaId = reanudarDesde?.tareaId ?? `tarea-${Date.now()}`;
    this.gestor.iniciar(tareaId);

    if (reanudarDesde) {
      console.log(`\n   ↩️  Reanudando desde checkpoint ${reanudarDesde.paso}`);
      resultados.push(...reanudarDesde.resultadosParciales);
      estadoActual = structuredClone(reanudarDesde.estadoAgente);
      pasoInicial = reanudarDesde.paso;
    }

    for (let i = pasoInicial; i < pasos.length; i++) {
      const descripcionPaso = pasos[i];
      console.log(`\n   ⚙️  Paso ${i + 1}/${pasos.length}: ${descripcionPaso}`);

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

  let checkpointRecuperacion: Checkpoint | undefined;
  try {
    await agente.ejecutarTareaLarga("Construir sistema agéntico", pasos);
  } catch (err: unknown) {
    if (err instanceof Error && "checkpoint" in err) {
      checkpointRecuperacion = (err as Error & { checkpoint: Checkpoint }).checkpoint;
      console.log(`\n   🔴 Fallo capturado. Último checkpoint: paso ${checkpointRecuperacion.paso}`);
    }
  }

  if (checkpointRecuperacion) {
    const agente2 = new AgenteConCheckpointing(client);
    const resultados = await agente2.ejecutarTareaLarga("Construir sistema agéntico", pasos, checkpointRecuperacion);
    console.log(`\n   ✅ Completado. ${resultados.length} pasos en total`);
  }

  paso("✅", "Checkpointing con store inyectable y recuperación durable opcional");
}

async function main(): Promise<void> { await demostrarCheckpointing(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
