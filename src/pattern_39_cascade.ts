/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 39 — CASCADE (CASCADA DE MODELOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada]
 *       │
 *       ▼
 *  [Modelo 1: Rápido/Barato]
 *       │
 *  ¿Confianza alta? ──SÍ──▶ Respuesta directa ✓
 *       │
 *      NO
 *       │
 *       ▼
 *  [Modelo 2: Intermedio]
 *       │
 *  ¿Confianza alta? ──SÍ──▶ Respuesta ✓
 *       │
 *      NO
 *       │
 *       ▼
 *  [Modelo 3: Potente/Costoso]
 *       │
 *       ▼
 *  [Respuesta final] ✓
 *
 *  Idea: Escalar a modelos más potentes sólo cuando los más
 *  simples no tienen suficiente confianza. Optimiza costo/calidad.
 *
 *  Ventajas:
 *  - Hasta -80% en costos de API
 *  - Latencia baja para preguntas simples
 *  - Calidad alta para preguntas complejas
 *  - Equilibrio dinámico costo/precisión
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface NivelCascada {
  nombre: string;
  esfuerzo: "low" | "medium" | "high";
  umbralConfianza: number; // Si confianza < umbral, escalar al siguiente
  costo: number; // Relativo (1=bajo, 3=alto)
}

export interface ResultadoCascada {
  respuesta: string;
  nivelUsado: string;
  confianza: number;
  nivelesIntentados: number;
}

export class CascadaModelos {
  private niveles: NivelCascada[];
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;

    this.niveles = [
      { nombre: "Rápido", esfuerzo: "low", umbralConfianza: 70, costo: 1 },
      { nombre: "Intermedio", esfuerzo: "medium", umbralConfianza: 85, costo: 2 },
      { nombre: "Potente", esfuerzo: "high", umbralConfianza: 100, costo: 3 },
    ];
  }

  async procesar(pregunta: string): Promise<ResultadoCascada> {
    console.log(`\n   ⛲ Cascada iniciando: "${pregunta.slice(0, 50)}..."`);

    for (let i = 0; i < this.niveles.length; i++) {
      const nivel = this.niveles[i];
      console.log(`   Nivel ${i + 1}: ${nivel.nombre} (costo: ${nivel.costo}x)`);

      // Generar respuesta con este nivel
      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: nivel.esfuerzo },
        store: false,
        instructions: `Responde: ${pregunta}\n\nAl final indica tu confianza con: CONFIANZA: [0-100]`,
        input: "",
      });

      // Extraer confianza
      const match = resp.output_text.match(/CONFIANZA:\s*(\d+)/i);
      const confianza = match ? parseInt(match[1]) : 60 + i * 15;

      console.log(`   → Confianza reportada: ${confianza}%`);

      // Si confianza suficiente o es el último nivel, retornar
      if (confianza >= nivel.umbralConfianza || i === this.niveles.length - 1) {
        console.log(`   ✅ Respondido por nivel ${nivel.nombre}`);
        return {
          respuesta: resp.output_text.replace(/CONFIANZA:\s*\d+/i, "").trim(),
          nivelUsado: nivel.nombre,
          confianza,
          nivelesIntentados: i + 1,
        };
      }

      console.log(`   ↑ Confianza insuficiente, escalando al siguiente nivel...`);
    }

    throw new Error("Cascada agotada sin resultado");
  }
}

export async function demostrarCascade(client: OpenAI = makeClient()): Promise<void> {
  paso("⛲", "Demostrando Cascade Pattern");

  const cascada = new CascadaModelos(client);

  paso("1️⃣", "Pregunta simple (debería resolver en nivel 1)");
  const r1 = await cascada.procesar("¿Qué es 2 + 2?");
  console.log(`\n   Nivel usado: ${r1.nivelUsado} | Confianza: ${r1.confianza}%`);
  console.log(`   Intentos: ${r1.nivelesIntentados}\n`);

  paso("2️⃣", "Pregunta compleja (puede escalar)");
  const r2 = await cascada.procesar(
    "Diseña una arquitectura distribuida para un sistema de agentes IA con millones de usuarios concurrentes, considerando latencia, costo y fiabilidad.",
  );
  console.log(`\n   Nivel usado: ${r2.nivelUsado} | Confianza: ${r2.confianza}%`);
  console.log(`   Intentos: ${r2.nivelesIntentados}`);
  console.log(`   Respuesta: "${r2.respuesta.slice(0, 150)}..."\n`);

  paso("✅", "Cascade optimizando costo con escalado dinámico de modelos");
}

async function main(): Promise<void> {
  await demostrarCascade();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
