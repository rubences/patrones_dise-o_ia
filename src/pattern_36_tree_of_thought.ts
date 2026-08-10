/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 36 — TREE OF THOUGHT (TOT)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema]
 *       │
 *       ▼
 *  ╔══════════════════════════════╗
 *  ║       Raíz del árbol         ║
 *  ╚══════════════════════════════╝
 *       │
 *   ┌───┼───┐
 *   ▼   ▼   ▼
 *  [A] [B] [C]   ← Ramas de pensamiento
 *   │   │   │
 *  [A1][B1][C1]  ← Evaluación de cada rama
 *   │   │   │
 *  🥇  ✗   ✗   ← Selección de la mejor
 *   │
 *  [Respuesta óptima]
 *
 *  Idea: Explorar múltiples caminos de razonamiento en paralelo,
 *  evaluar cada uno y seleccionar el mejor para continuar.
 *
 *  Supera a Chain of Thought en problemas complejos (+70% precisión)
 *
 *  Ventajas:
 *  - Explora múltiples hipótesis simultáneamente
 *  - Evita callejones sin salida
 *  - Mejor para problemas con múltiples soluciones posibles
 *  - Auto-evaluación de ramas
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Rama {
  id: string;
  pensamiento: string;
  evaluacion: number; // 0-100
  hijos: Rama[];
}

export class TreeOfThought {
  private client: OpenAI;
  private anchura: number; // ramas por nivel
  private profundidad: number; // niveles del árbol

  constructor(client: OpenAI = makeClient(), anchura = 3, profundidad = 2) {
    this.client = client;
    this.anchura = anchura;
    this.profundidad = profundidad;
  }

  async resolver(problema: string): Promise<{ respuesta: string; arbol: Rama }> {
    console.log(`\n   🌳 Tree of Thought: "${problema.slice(0, 50)}..."`);
    console.log(`   Anchura: ${this.anchura} | Profundidad: ${this.profundidad}\n`);

    const raiz: Rama = {
      id: "raiz",
      pensamiento: problema,
      evaluacion: 100,
      hijos: [],
    };

    // Expandir árbol de pensamiento
    await this.expandir(raiz, problema, 0);

    // Seleccionar la mejor rama
    const mejorRama = this.seleccionarMejor(raiz);
    console.log(`\n   ✅ Mejor rama seleccionada (score: ${mejorRama.evaluacion})`);

    // Generar respuesta final con la mejor rama
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Basándote en este razonamiento:\n\n${mejorRama.pensamiento}\n\nProporciona la respuesta final y concisa al problema: ${problema}`,
      input: "",
    });

    return { respuesta: respuesta.output_text, arbol: raiz };
  }

  private async expandir(nodo: Rama, problema: string, nivel: number): Promise<void> {
    if (nivel >= this.profundidad) return;

    console.log(`   ${"  ".repeat(nivel)}📍 Nivel ${nivel + 1}: generando ${this.anchura} ramas...`);

    // Generar múltiples pensamientos en paralelo
    const promesas = Array.from({ length: this.anchura }, (_, i) =>
      this.generarPensamiento(problema, nodo.pensamiento, i + 1),
    );

    const pensamientos = await Promise.all(promesas);

    // Evaluar cada pensamiento
    for (const [i, p] of pensamientos.entries()) {
      const evaluacion = await this.evaluarPensamiento(p, problema);
      const rama: Rama = {
        id: `${nodo.id}-${i + 1}`,
        pensamiento: p,
        evaluacion,
        hijos: [],
      };

      nodo.hijos.push(rama);
      console.log(`   ${"  ".repeat(nivel)}  ├─ Rama ${i + 1}: score=${evaluacion}`);

      // Sólo expandir las ramas prometedoras (score > 60)
      if (evaluacion > 60 && nivel + 1 < this.profundidad) {
        await this.expandir(rama, problema, nivel + 1);
      }
    }
  }

  private async generarPensamiento(problema: string, contexto: string, variante: number): Promise<string> {
    const angulos = ["Desde un enfoque técnico", "Desde un enfoque práctico", "Desde un enfoque innovador"];
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `${angulos[(variante - 1) % 3]}, proporciona un camino de razonamiento (2-3 oraciones) para: ${problema}`,
      input: "",
    });
    return resp.output_text;
  }

  private async evaluarPensamiento(pensamiento: string, problema: string): Promise<number> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Evalúa del 0 al 100 cuán prometedor es este razonamiento para resolver "${problema.slice(0, 50)}":
"${pensamiento.slice(0, 100)}"
Responde SOLO con un número entre 0 y 100.`,
      input: "",
    });
    const match = resp.output_text.match(/\d+/);
    return match ? Math.min(100, parseInt(match[0])) : 50;
  }

  private seleccionarMejor(nodo: Rama): Rama {
    if (nodo.hijos.length === 0) return nodo;
    const mejorHijo = nodo.hijos.reduce((a, b) => (a.evaluacion > b.evaluacion ? a : b));
    return this.seleccionarMejor(mejorHijo);
  }
}

export async function demostrarTreeOfThought(client: OpenAI = makeClient()): Promise<void> {
  paso("🌳", "Demostrando Tree of Thought Pattern");

  const tot = new TreeOfThought(client, 3, 2);

  paso("1️⃣", "Problema complejo con múltiples soluciones posibles");
  const { respuesta, arbol } = await tot.resolver(
    "¿Cuál es la mejor estrategia para implementar un sistema RAG en producción?",
  );
  console.log(`\n   Respuesta final:\n   "${respuesta.slice(0, 200)}..."`);
  console.log(`\n   Árbol explorado: ${arbol.hijos.length} ramas principales`);

  paso("2️⃣", "Comparación vs respuesta directa");
  const resp = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions: "Responde directamente: ¿Cuál es la mejor estrategia para implementar un sistema RAG en producción?",
    input: "",
  });
  console.log(`\n   Respuesta directa:\n   "${resp.output_text.slice(0, 150)}..."`);
  console.log(`\n   → Tree of Thought ofrece razonamiento más profundo y fundamentado`);

  paso("✅", "Tree of Thought explorando múltiples caminos de razonamiento");
}

async function main(): Promise<void> {
  await demostrarTreeOfThought();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
