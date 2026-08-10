/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 58 — ROLLBACK (REVERSIÓN DE ESTADO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Estado S0] → acción 1 → [S1] → acción 2 → [S2] → acción 3 → [S3]
 *                                                           │
 *                                                    ERROR detectado
 *                                                           │
 *                                                    rollbackTo(S1)
 *                                                           │
 *  [Estado S0]   [S1] ←── REVERTIDO ────────────────────────┘
 *
 *  Idea: Revertir múltiples cambios hasta un estado conocido-bueno,
 *  más completo que un simple undo del Memento.
 *
 *  Diferencia vs Memento: Memento guarda/restaura un snapshot;
 *  Rollback gestiona una pila de transacciones con compensaciones.
 *
 *  Ventajas:
 *  - Recuperación de errores multi-paso
 *  - Transacciones atómicas en agentes
 *  - Auditoría de qué se revirtió
 *  - Rollback parcial o total
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Transaccion {
  id: string;
  descripcion: string;
  estado: "pendiente" | "ejecutada" | "revertida" | "fallida";
  resultado?: string;
  compensacion?: () => Promise<void>;
}

export class GestorRollback {
  private historial: Transaccion[] = [];
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async ejecutar(
    descripcion: string,
    operacion: () => Promise<string>,
    compensacion?: () => Promise<void>,
  ): Promise<string> {
    const tx: Transaccion = {
      id: `tx-${this.historial.length + 1}`,
      descripcion,
      estado: "pendiente",
      compensacion,
    };

    this.historial.push(tx);

    try {
      console.log(`   ▶️  [${tx.id}] ${descripcion}`);
      tx.resultado = await operacion();
      tx.estado = "ejecutada";
      console.log(`   ✅ [${tx.id}] OK: "${tx.resultado?.slice(0, 60)}"`);
      return tx.resultado;
    } catch (error) {
      tx.estado = "fallida";
      console.log(`   ❌ [${tx.id}] FALLO: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  async rollback(hastaId?: string): Promise<number> {
    const ejecutadas = this.historial
      .filter((t) => t.estado === "ejecutada")
      .reverse();

    const aRevertir = hastaId
      ? ejecutadas.slice(0, ejecutadas.findIndex((t) => t.id === hastaId) + 1)
      : ejecutadas;

    console.log(`\n   ↩️  Rollback de ${aRevertir.length} transacciones...`);
    let revertidas = 0;

    for (const tx of aRevertir) {
      if (tx.compensacion) {
        await tx.compensacion();
        tx.estado = "revertida";
        console.log(`   ↩️  [${tx.id}] "${tx.descripcion}" revertida`);
        revertidas++;
      } else {
        console.log(`   ⚠️  [${tx.id}] Sin compensación, marcada como revertida`);
        tx.estado = "revertida";
        revertidas++;
      }
    }

    return revertidas;
  }

  obtenerHistorial(): Transaccion[] {
    return [...this.historial];
  }
}

export async function demostrarRollback(client: OpenAI = makeClient()): Promise<void> {
  paso("↩️", "Demostrando Rollback Pattern");

  const gestor = new GestorRollback(client);

  const estadoSimulado = { fase: 0, datos: [] as string[] };

  paso("1️⃣", "Ejecutar transacciones con compensaciones");

  try {
    await gestor.ejecutar(
      "Fase 1: Analizar requisitos",
      async () => {
        estadoSimulado.fase = 1;
        estadoSimulado.datos.push("requisitos");
        const r = await client.responses.create({ model: DEFAULT_MODEL, reasoning: { effort: "low" }, store: false, instructions: "Analiza brevemente los requisitos de un sistema RAG.", input: "" });
        return r.output_text.slice(0, 80);
      },
      async () => { estadoSimulado.fase = 0; estadoSimulado.datos = estadoSimulado.datos.filter((d) => d !== "requisitos"); },
    );

    await gestor.ejecutar(
      "Fase 2: Diseñar arquitectura",
      async () => {
        estadoSimulado.fase = 2;
        estadoSimulado.datos.push("arquitectura");
        const r = await client.responses.create({ model: DEFAULT_MODEL, reasoning: { effort: "low" }, store: false, instructions: "Diseña una arquitectura breve para RAG.", input: "" });
        return r.output_text.slice(0, 80);
      },
      async () => { estadoSimulado.fase = 1; estadoSimulado.datos = estadoSimulado.datos.filter((d) => d !== "arquitectura"); },
    );

    await gestor.ejecutar(
      "Fase 3: Implementar (falla simulada)",
      async () => {
        throw new Error("Error de integración en fase 3");
      },
      async () => { estadoSimulado.fase = 2; },
    );

  } catch {
    paso("2️⃣", "Error detectado → ejecutar rollback");
    const revertidas = await gestor.rollback();
    console.log(`\n   Transacciones revertidas: ${revertidas}`);
    console.log(`   Estado recuperado: fase=${estadoSimulado.fase}, datos=[${estadoSimulado.datos.join(", ")}]`);
  }

  paso("3️⃣", "Historial completo de transacciones");
  gestor.obtenerHistorial().forEach((t) => {
    const icon = { ejecutada: "✅", revertida: "↩️", fallida: "❌", pendiente: "⏳" }[t.estado];
    console.log(`   ${icon} [${t.id}] ${t.descripcion} → ${t.estado}`);
  });

  paso("✅", "Rollback recuperando estado consistente tras fallos multi-paso");
}

async function main(): Promise<void> { await demostrarRollback(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
