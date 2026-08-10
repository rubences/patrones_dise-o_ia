/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 31 — BRIDGE (STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Interfaz Agente]
 *       │
 *       ├─ Agente de Análisis
 *       │  │
 *       │  ├─ analizar() ──┐
 *       │  │                │
 *       │  └─ evaluar() ───┼──┐
 *       │                  │  │
 *       └─ Agente de Síntesis
 *          │                │  │
 *          ├─ sintetizar() ─┘  │
 *          │                   │
 *          └─ resumir() ───────┤
 *                               │
 *                               ▼
 *                      [Implementación LLM]
 *                      ┌──────────────────┐
 *                      │ GPT-4             │
 *                      │ GPT-3.5           │
 *                      │ Claude            │
 *                      │ LocalLLM          │
 *                      └──────────────────┘
 *
 *  Idea: Separar abstracción (tipo agente) de implementación
 *  (qué LLM usa), permitiendo variar ambas independientemente.
 *
 *  Referencia: https://refactoring.guru/design-patterns/bridge
 *
 *  Ventajas:
 *  - Desacoplamiento abstracción-implementación
 *  - Cambiar LLMs sin cambiar código de negocio
 *  - Nuevos tipos de agentes fácilmente
 *  - Composición en lugar de herencia
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── IMPLEMENTOR: Abstracción de LLM ────────────────────────────────
export interface ImplementorLLM {
  procesar(prompt: string): Promise<string>;
  obtenerNombre(): string;
}

class ImplementorGPT4 implements ImplementorLLM {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async procesar(prompt: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: prompt,
      input: "",
    });

    return respuesta.output_text;
  }

  obtenerNombre(): string {
    return "GPT-4";
  }
}

class ImplementorRapido implements ImplementorLLM {
  async procesar(prompt: string): Promise<string> {
    // Simular respuesta rápida
    await new Promise((r) => setTimeout(r, 100));
    return `[Respuesta Rápida] ${prompt.slice(0, 100)}...`;
  }

  obtenerNombre(): string {
    return "Modelo Rápido (Local)";
  }
}

// ── ABSTRACTION: Tipos de agentes ──────────────────────────────────
export abstract class AgenteAbstracto {
  protected implementor: ImplementorLLM;

  constructor(implementor: ImplementorLLM) {
    this.implementor = implementor;
  }

  abstract realizar(): Promise<string>;

  cambiarImplementor(implementor: ImplementorLLM): void {
    this.implementor = implementor;
    console.log(
      `   🔀 Cambiado a implementor: ${implementor.obtenerNombre()}`,
    );
  }
}

// ── REFINED ABSTRACTIONS: Tipos específicos de agentes ──────────────
export class AgenteAnalisis extends AgenteAbstracto {
  private tema: string;

  constructor(implementor: ImplementorLLM, tema: string) {
    super(implementor);
    this.tema = tema;
  }

  async realizar(): Promise<string> {
    const prompt = `Analiza profundamente: ${this.tema}. Proporciona análisis estructura`;

    const resultado = await this.implementor.procesar(prompt);
    return `[Análisis por ${this.implementor.obtenerNombre()}]\n${resultado}`;
  }
}

export class AgenteGenerador extends AgenteAbstracto {
  private tema: string;

  constructor(implementor: ImplementorLLM, tema: string) {
    super(implementor);
    this.tema = tema;
  }

  async realizar(): Promise<string> {
    const prompt = `Genera contenido creativo sobre: ${this.tema}`;

    const resultado = await this.implementor.procesar(prompt);
    return `[Generación por ${this.implementor.obtenerNombre()}]\n${resultado}`;
  }
}

export class AgenteOptimizador extends AgenteAbstracto {
  private codigo: string;

  constructor(implementor: ImplementorLLM, codigo: string) {
    super(implementor);
    this.codigo = codigo;
  }

  async realizar(): Promise<string> {
    const prompt = `Optimiza este código: ${this.codigo}`;

    const resultado = await this.implementor.procesar(prompt);
    return `[Optimización por ${this.implementor.obtenerNombre()}]\n${resultado}`;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarBridge(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🌉", "Demostrando Bridge Pattern");

  const implementorGPT = new ImplementorGPT4(client);
  const implementorRapido = new ImplementorRapido();

  paso("1️⃣", "Mismo tipo de agente, diferentes implementaciones");

  console.log(`\n   Agente de Análisis con GPT-4:`);
  const analisisGPT = new AgenteAnalisis(
    implementorGPT,
    "patrones de diseño",
  );
  const resultado1 = await analisisGPT.realizar();
  console.log(`   ${resultado1.slice(0, 100)}...`);

  console.log(`\n   Agente de Análisis con Modelo Rápido:`);
  const analisisRapido = new AgenteAnalisis(
    implementorRapido,
    "patrones de diseño",
  );
  const resultado2 = await analisisRapido.realizar();
  console.log(`   ${resultado2.slice(0, 100)}...`);

  paso("2️⃣", "Cambiar implementación en tiempo de ejecución");

  console.log(`\n   Agente de Generación comienza con GPT-4...`);
  const generador = new AgenteGenerador(implementorGPT, "un sistema agéntico");
  console.log(`   (Implementor: ${implementorGPT.obtenerNombre()})`);

  console.log(`\n   Cambiando a Modelo Rápido...`);
  generador.cambiarImplementor(implementorRapido);
  const resultado3 = await generador.realizar();
  console.log(`   ${resultado3.slice(0, 100)}...`);

  paso("3️⃣", "Diferentes tipos de agentes, mismo implementor");

  console.log(`\n   Con Modelo Rápido:`);

  const optimizador = new AgenteOptimizador(
    implementorRapido,
    "for(let i=0; i<arr.length; i++) { console.log(arr[i]); }",
  );
  const resultado4 = await optimizador.realizar();
  console.log(`   ${resultado4.slice(0, 100)}...`);

  paso("✅", "Bridge desacoplando abstracción de implementación");
}

async function main(): Promise<void> {
  await demostrarBridge();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
