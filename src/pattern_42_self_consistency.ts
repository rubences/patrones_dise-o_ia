/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 42 — SELF-CONSISTENCY (CONSISTENCIA POR VOTACIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema]
 *       │
 *       ├──────────────────────────────┐
 *       │                              │
 *   Run 1 (CoT)          Run N (CoT)   ... (N ejecuciones)
 *       │                              │
 *   Respuesta A          Respuesta B
 *
 *       │
 *       ▼
 *  [Votación / Agregación]
 *  ├─ Respuesta A: 7 votos  ← ✓ Ganadora
 *  ├─ Respuesta B: 2 votos
 *  └─ Respuesta C: 1 voto
 *
 *  Idea: Ejecutar el mismo problema múltiples veces con razonamiento
 *  estocástico y seleccionar la respuesta más frecuente (mayoría).
 *
 *  Supera a una sola ejecución en +18-35% en tareas de razonamiento
 *
 *  Ventajas:
 *  - Reduce errores estocásticos del LLM
 *  - Mayor consistencia en razonamiento
 *  - Confianza medible (% de acuerdo)
 *  - Detecta preguntas ambiguas (alta divergencia)
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface ResultadoConsistencia {
  respuestaFinal: string;
  confianza: number; // % de votos para la respuesta ganadora
  totalEjecuciones: number;
  distribucionVotos: Record<string, number>;
  convergencia: "alta" | "media" | "baja";
}

export class SelfConsistency {
  private client: OpenAI;
  private nEjecuciones: number;

  constructor(client: OpenAI = makeClient(), nEjecuciones = 5) {
    this.client = client;
    this.nEjecuciones = nEjecuciones;
  }

  async resolver(problema: string): Promise<ResultadoConsistencia> {
    console.log(`\n   🗳️  Self-Consistency: ${this.nEjecuciones} ejecuciones paralelas`);
    console.log(`   Problema: "${problema.slice(0, 60)}..."\n`);

    // Ejecutar N veces en paralelo con CoT
    const promesas = Array.from({ length: this.nEjecuciones }, (_, i) =>
      this.ejecutarConCoT(problema, i + 1),
    );

    const respuestas = await Promise.all(promesas);

    // Normalizar y contar votos
    const votos: Record<string, number> = {};
    for (const resp of respuestas) {
      const clave = this.normalizar(resp);
      votos[clave] = (votos[clave] || 0) + 1;
    }

    // Seleccionar respuesta con más votos
    const ganadora = Object.entries(votos).sort((a, b) => b[1] - a[1])[0];
    const confianza = Math.round((ganadora[1] / this.nEjecuciones) * 100);

    const convergencia: "alta" | "media" | "baja" =
      confianza >= 70 ? "alta" : confianza >= 50 ? "media" : "baja";

    console.log(`   📊 Distribución de votos:`);
    Object.entries(votos).forEach(([k, v]) => {
      console.log(`      "${k.slice(0, 50)}...": ${v} votos`);
    });

    return {
      respuestaFinal: ganadora[0],
      confianza,
      totalEjecuciones: this.nEjecuciones,
      distribucionVotos: votos,
      convergencia,
    };
  }

  private async ejecutarConCoT(problema: string, intento: number): Promise<string> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Resuelve paso a paso: ${problema}

Muestra tu razonamiento y al final escribe:
RESPUESTA FINAL: [tu respuesta concisa]`,
      input: "",
    });

    // Extraer respuesta final
    const match = resp.output_text.match(/RESPUESTA FINAL:\s*(.+)/i);
    const respuesta = match ? match[1].trim() : resp.output_text.split("\n").pop() || resp.output_text;
    console.log(`   Ejecución ${intento}: "${respuesta.slice(0, 60)}..."`);
    return respuesta;
  }

  private normalizar(texto: string): string {
    // Normalización simple para agrupar respuestas similares
    return texto.toLowerCase().trim().slice(0, 100);
  }
}

export async function demostrarSelfConsistency(client: OpenAI = makeClient()): Promise<void> {
  paso("🗳️", "Demostrando Self-Consistency Pattern");

  const sc = new SelfConsistency(client, 3); // 3 para demo rápida

  paso("1️⃣", "Problema de razonamiento lógico");
  const r1 = await sc.resolver(
    "Un tren sale de Madrid a las 9:00 a 120 km/h. Otro sale de Barcelona (600 km) a las 10:00 a 100 km/h. ¿A qué hora se encuentran?",
  );
  console.log(`
   Respuesta final: ${r1.respuestaFinal.slice(0, 100)}
   Confianza: ${r1.confianza}% (${r1.convergencia} convergencia)
   Ejecuciones: ${r1.totalEjecuciones}
  `);

  paso("2️⃣", "Pregunta de razonamiento sobre patrones");
  const r2 = await sc.resolver(
    "¿Cuándo usarías Flyweight en lugar de Singleton para gestionar recursos compartidos?",
  );
  console.log(`
   Respuesta final: ${r2.respuestaFinal.slice(0, 120)}...
   Confianza: ${r2.confianza}% (${r2.convergencia} convergencia)
  `);

  paso("✅", "Self-Consistency aumentando fiabilidad por votación de múltiples ejecuciones");
}

async function main(): Promise<void> {
  await demostrarSelfConsistency();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
