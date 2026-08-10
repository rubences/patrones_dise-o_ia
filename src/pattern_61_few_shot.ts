/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 61 — FEW-SHOT PROMPTING (EJEMPLOS EN EL PROMPT)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Zero-shot:          Few-shot:
 *  [Tarea]             [Ejemplo 1 → Resultado 1]
 *  → Alta varianza     [Ejemplo 2 → Resultado 2]
 *                      [Ejemplo 3 → Resultado 3]
 *                      [Tarea] → Resultado consistente
 *
 *  Idea: Incluir ejemplos (shots) en el prompt para demostrar
 *  el formato y comportamiento esperado del LLM.
 *
 *  Ventajas:
 *  - Sin entrenamiento adicional
 *  - Adaptable a cualquier tarea en tiempo de ejecución
 *  - Controla formato de salida con ejemplos
 *  - Base de muchas técnicas de prompting avanzadas
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Ejemplo {
  entrada: string;
  salida: string;
}

export class FewShotPrompter {
  private client: OpenAI;
  private ejemplos: Ejemplo[] = [];
  private instruccionBase: string;

  constructor(instruccionBase: string, client: OpenAI = makeClient()) {
    this.instruccionBase = instruccionBase;
    this.client = client;
  }

  agregarEjemplo(entrada: string, salida: string): void {
    this.ejemplos.push({ entrada, salida });
  }

  private construirPrompt(entrada: string): string {
    const ejemplosStr = this.ejemplos
      .map((e, i) => `Ejemplo ${i + 1}:\nEntrada: ${e.entrada}\nSalida: ${e.salida}`)
      .join("\n\n");

    return `${this.instruccionBase}

${ejemplosStr ? `EJEMPLOS:\n${ejemplosStr}\n\n` : ""}Entrada: ${entrada}
Salida:`;
  }

  async generar(entrada: string): Promise<string> {
    const prompt = this.construirPrompt(entrada);
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: prompt,
      input: "",
    });
    return resp.output_text.trim();
  }
}

export async function demostrarFewShot(client: OpenAI = makeClient()): Promise<void> {
  paso("🎯", "Demostrando Few-Shot Prompting Pattern");

  paso("1️⃣", "Clasificador de sentimiento con 3 ejemplos");
  const clasificador = new FewShotPrompter("Clasifica el sentimiento de la frase como: POSITIVO, NEGATIVO o NEUTRO.", client);
  clasificador.agregarEjemplo("Me encanta este producto, es increíble", "POSITIVO");
  clasificador.agregarEjemplo("El servicio fue horrible y tardaron horas", "NEGATIVO");
  clasificador.agregarEjemplo("El paquete llegó en la fecha estimada", "NEUTRO");

  const frases = [
    "La IA está transformando el mundo de forma maravillosa",
    "El sistema falló tres veces esta semana",
    "El informe tiene 42 páginas",
  ];

  for (const frase of frases) {
    const resultado = await clasificador.generar(frase);
    console.log(`   "${frase.slice(0, 50)}" → ${resultado}`);
  }

  paso("2️⃣", "Extractor de entidades con ejemplos");
  const extractor = new FewShotPrompter("Extrae las entidades (personas, lugares, tecnologías) de la frase en formato JSON.", client);
  extractor.agregarEjemplo(
    "Elon Musk fundó OpenAI en San Francisco",
    '{"personas": ["Elon Musk"], "lugares": ["San Francisco"], "organizaciones": ["OpenAI"]}',
  );
  extractor.agregarEjemplo(
    "TypeScript fue creado por Microsoft en Redmond",
    '{"personas": [], "lugares": ["Redmond"], "organizaciones": ["Microsoft"], "tecnologías": ["TypeScript"]}',
  );

  const r = await extractor.generar("Sam Altman lidera OpenAI desde San Francisco usando GPT-4");
  console.log(`\n   Entidades extraídas: ${r.slice(0, 150)}`);

  paso("✅", "Few-Shot guiando al LLM con ejemplos para resultados consistentes");
}

async function main(): Promise<void> { await demostrarFewShot(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
