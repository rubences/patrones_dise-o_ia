/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 40 — BRANCHING (RAMIFICACIÓN CONDICIONAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada]
 *       │
 *       ▼
 *  [Evaluador de Condición]
 *       │
 *   ┌───┼───┐
 *   │   │   │
 *   ▼   ▼   ▼
 *  [A] [B] [C]   ← Ramas paralelas o alternativas
 *   │   │   │
 *   └───┴───┘
 *       │
 *   ¿Merge? ──SÍ──▶ [Combinar resultados]
 *       │
 *      NO
 *       │
 *       ▼
 *  [Rama seleccionada como salida]
 *
 *  Idea: Ejecutar caminos diferentes según condiciones evaluadas
 *  dinámicamente, permitiendo flujos no lineales.
 *
 *  Ventajas:
 *  - Flujos condicionales complejos
 *  - Paralelismo selectivo
 *  - Mejor que un router simple (puede combinar)
 *  - Manejo de casos edge
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type Condicion = (entrada: string) => Promise<boolean>;

export interface Rama {
  nombre: string;
  condicion: Condicion;
  procesar: (entrada: string, client: OpenAI) => Promise<string>;
}

export interface ConfigBranching {
  modo: "primera" | "todas" | "paralelo-mejor";
}

export class SistemaBranching {
  private ramas: Rama[];
  private client: OpenAI;
  private config: ConfigBranching;

  constructor(client: OpenAI = makeClient(), config: ConfigBranching = { modo: "primera" }) {
    this.client = client;
    this.config = config;
    this.ramas = this.definirRamas();
  }

  private definirRamas(): Rama[] {
    return [
      {
        nombre: "Pregunta-Técnica",
        condicion: async (entrada) => {
          const tecnicas = ["código", "función", "algoritmo", "bug", "error", "implementar", "api"];
          return tecnicas.some((t) => entrada.toLowerCase().includes(t));
        },
        procesar: async (entrada, client) => {
          const r = await client.responses.create({
            model: DEFAULT_MODEL,
            reasoning: { effort: "medium" },
            store: false,
            instructions: `Como experto técnico, responde con código o detalles técnicos precisos: ${entrada}`,
            input: "",
          });
          return `[Rama Técnica] ${r.output_text}`;
        },
      },
      {
        nombre: "Pregunta-Creativa",
        condicion: async (entrada) => {
          const creativas = ["idea", "crea", "diseña", "inventa", "imagina", "propón"];
          return creativas.some((t) => entrada.toLowerCase().includes(t));
        },
        procesar: async (entrada, client) => {
          const r = await client.responses.create({
            model: DEFAULT_MODEL,
            reasoning: { effort: "low" },
            store: false,
            instructions: `Responde de forma creativa e innovadora: ${entrada}`,
            input: "",
          });
          return `[Rama Creativa] ${r.output_text}`;
        },
      },
      {
        nombre: "Pregunta-Analítica",
        condicion: async (entrada) => {
          const analiticas = ["analiza", "compara", "evalúa", "ventajas", "desventajas", "pros", "contras"];
          return analiticas.some((t) => entrada.toLowerCase().includes(t));
        },
        procesar: async (entrada, client) => {
          const r = await client.responses.create({
            model: DEFAULT_MODEL,
            reasoning: { effort: "medium" },
            store: false,
            instructions: `Realiza un análisis estructurado con pros y contras: ${entrada}`,
            input: "",
          });
          return `[Rama Analítica] ${r.output_text}`;
        },
      },
      {
        nombre: "Rama-Default",
        condicion: async () => true, // siempre aplica
        procesar: async (entrada, client) => {
          const r = await client.responses.create({
            model: DEFAULT_MODEL,
            reasoning: { effort: "low" },
            store: false,
            instructions: entrada,
            input: "",
          });
          return `[Rama Default] ${r.output_text}`;
        },
      },
    ];
  }

  async procesar(entrada: string): Promise<{ resultado: string; ramasActivadas: string[] }> {
    console.log(`\n   🔀 Branching: "${entrada.slice(0, 50)}..." | modo: ${this.config.modo}`);

    const ramasActivadas: string[] = [];
    const resultados: string[] = [];

    if (this.config.modo === "primera") {
      for (const rama of this.ramas) {
        if (await rama.condicion(entrada)) {
          console.log(`   ✓ Rama activada: ${rama.nombre}`);
          const resultado = await rama.procesar(entrada, this.client);
          return { resultado, ramasActivadas: [rama.nombre] };
        }
      }
    } else if (this.config.modo === "todas") {
      for (const rama of this.ramas) {
        if (await rama.condicion(entrada)) {
          console.log(`   ✓ Rama activada: ${rama.nombre}`);
          ramasActivadas.push(rama.nombre);
          resultados.push(await rama.procesar(entrada, this.client));
        }
      }
      return { resultado: resultados.join("\n\n"), ramasActivadas };
    } else if (this.config.modo === "paralelo-mejor") {
      const promesas = this.ramas
        .filter((_) => true) // evalúa todas
        .map(async (rama) => {
          const activa = await rama.condicion(entrada);
          if (!activa) return null;
          const res = await rama.procesar(entrada, this.client);
          return { nombre: rama.nombre, resultado: res };
        });

      const todos = (await Promise.all(promesas)).filter(Boolean) as { nombre: string; resultado: string }[];
      if (todos.length > 0) {
        console.log(`   ✓ ${todos.length} ramas ejecutadas en paralelo`);
        ramasActivadas.push(...todos.map((t) => t.nombre));
        return { resultado: todos[0].resultado, ramasActivadas };
      }
    }

    return { resultado: "Sin ramas aplicables", ramasActivadas: [] };
  }
}

export async function demostrarBranching(client: OpenAI = makeClient()): Promise<void> {
  paso("🔀", "Demostrando Branching Pattern");

  paso("1️⃣", "Pregunta técnica → Rama Técnica");
  const tecnico = new SistemaBranching(client, { modo: "primera" });
  const r1 = await tecnico.procesar("¿Cómo implementar un algoritmo de búsqueda binaria?");
  console.log(`   Ramas activadas: ${r1.ramasActivadas.join(", ")}`);
  console.log(`   Resultado: "${r1.resultado.slice(0, 120)}..."\n`);

  paso("2️⃣", "Pregunta creativa → Rama Creativa");
  const r2 = await tecnico.procesar("Crea una idea innovadora para un agente de IA");
  console.log(`   Ramas activadas: ${r2.ramasActivadas.join(", ")}`);
  console.log(`   Resultado: "${r2.resultado.slice(0, 120)}..."\n`);

  paso("3️⃣", "Modo todas las ramas aplicables");
  const multiRama = new SistemaBranching(client, { modo: "todas" });
  const r3 = await multiRama.procesar("Analiza e implementa las ventajas del patrón RAG");
  console.log(`   Ramas activadas: ${r3.ramasActivadas.join(", ")}`);
  console.log(`   Ramas ejecutadas: ${r3.ramasActivadas.length}\n`);

  paso("✅", "Branching enrutando condicionalmente a flujos especializados");
}

async function main(): Promise<void> {
  await demostrarBranching();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
