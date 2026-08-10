/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 26 — CHAIN OF THOUGHT (COT)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema Complejo]
 *       │
 *       ▼
 *  [1. Descomponer]
 *  └─ Dividir en pasos
 *
 *       │
 *       ▼
 *  [2. Razonar Paso a Paso]
 *  ├─ Paso 1: ...
 *  ├─ Paso 2: ...
 *  └─ Paso N: ...
 *
 *       │
 *       ▼
 *  [3. Conclusión]
 *  └─ Respuesta final del razonamiento
 *
 *  Idea: Prompting que pide al LLM "pensar paso a paso",
 *  mejorando significativamente la calidad de razonamiento.
 *
 *  Impacto: +30-40% precisión en tareas de razonamiento
 *
 *  Ventajas:
 *  - Transparencia en el razonamiento
 *  - Mejora en problemas matemáticos/lógicos
 *  - Fácil de depurar
 *  - Bajo costo (sin fine-tuning)
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Estructura de razonamiento ─────────────────────────────────────
export interface Razonamiento {
  pregunta: string;
  pasos: string[];
  conclusion: string;
  confianza: number;
}

// ── PATRÓN CHAIN OF THOUGHT ───────────────────────────────────────
export class GeneradorChainOfThought {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async razonarPasoAPaso(pregunta: string): Promise<Razonamiento> {
    console.log(`\n   🔗 Chain of Thought: "${pregunta}"`);

    const prompt = `Resuelve este problema razonando PASO A PASO.

PROBLEMA: ${pregunta}

Formato de respuesta:
PASO 1: [primer paso del razonamiento]
PASO 2: [segundo paso]
PASO 3: [tercer paso si es necesario]
...
CONCLUSIÓN: [respuesta final basada en los pasos anteriores]
CONFIANZA: [número del 0-100 indicando tu confianza]`;

    console.log(`   ▶️  Generando razonamiento paso a paso...`);

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: prompt,
      input: "",
    });

    // Parsear respuesta
    const contenido = respuesta.output_text;
    const pasos: string[] = [];
    let conclusion = "";
    let confianza = 75;

    const lineas = contenido.split("\n");
    for (const linea of lineas) {
      if (linea.startsWith("PASO")) {
        pasos.push(linea);
      } else if (linea.startsWith("CONCLUSIÓN")) {
        conclusion = linea.replace("CONCLUSIÓN:", "").trim();
      } else if (linea.startsWith("CONFIANZA")) {
        const match = linea.match(/(\d+)/);
        if (match) confianza = parseInt(match[1]);
      }
    }

    console.log(`   ✓ ${pasos.length} pasos de razonamiento generados`);

    return {
      pregunta,
      pasos: pasos.length > 0 ? pasos : [contenido],
      conclusion:
        conclusion ||
        "Respuesta generada a través de razonamiento paso a paso",
      confianza,
    };
  }

  async compararConSinCoT(pregunta: string): Promise<{
    sin_cot: string;
    con_cot: Razonamiento;
  }> {
    console.log(`\n   🔄 Comparación: Sin CoT vs Con CoT`);

    // Sin CoT
    console.log(`   ▶️  Generando respuesta directa (sin CoT)...`);
    const respuestaSinCoT = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Responde brevemente: ${pregunta}`,
      input: "",
    });

    console.log(`   ✓ Respuesta directa completada`);

    // Con CoT
    const respuestaConCoT = await this.razonarPasoAPaso(pregunta);

    return {
      sin_cot: respuestaSinCoT.output_text,
      con_cot: respuestaConCoT,
    };
  }

  async razonamientoIntermedio(pregunta: string): Promise<Razonamiento> {
    console.log(`\n   🧠 Razonamiento Intermedio (Few-Shot CoT)`);

    const prompt = `Resuelve este problema mostrando tu razonamiento intermedio.

EJEMPLOS:
Q: Si un tren viaja a 60km/h durante 2 horas, ¿cuánta distancia recorre?
RAZONAMIENTO: Distancia = Velocidad × Tiempo = 60 × 2 = 120 km
A: 120 kilómetros

---

AHORA TÚ:
PROBLEMA: ${pregunta}

Formato: RAZONAMIENTO: [tu proceso] | RESPUESTA: [resultado]`;

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: prompt,
      input: "",
    });

    const lineas = respuesta.output_text.split("|");
    const razonamiento = lineas[0] || "";
    const respuestaFinal = lineas[1]?.replace("RESPUESTA:", "").trim() || "";

    return {
      pregunta,
      pasos: [razonamiento],
      conclusion: respuestaFinal,
      confianza: 80,
    };
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarChainOfThought(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🔗", "Demostrando Chain of Thought Pattern");

  const cot = new GeneradorChainOfThought(client);

  paso("1️⃣", "Razonamiento paso a paso");

  const resultado1 = await cot.razonarPasoAPaso(
    "¿Cuál es el mejor patrón de diseño para implementar un sistema de caché?",
  );
  console.log(`
   Pasos:
   ${resultado1.pasos.slice(0, 2).join("\n   ")}
   
   Conclusión: ${resultado1.conclusion.slice(0, 100)}...
   Confianza: ${resultado1.confianza}%
  `);

  paso("2️⃣", "Comparación: Sin CoT vs Con CoT");

  const comparacion = await cot.compararConSinCoT(
    "¿Cómo combinarías RAG con Chain of Thought?",
  );
  console.log(`
   Sin CoT (directo):
   "${comparacion.sin_cot.slice(0, 100)}..."
   
   Con CoT (razonado):
   ${comparacion.con_cot.pasos[0]}...
   → ${comparacion.con_cot.conclusion.slice(0, 80)}...
  `);

  paso("3️⃣", "Razonamiento intermedio (Few-Shot)");

  const resultado3 = await cot.razonamientoIntermedio(
    "Si implementas 5 patrones nuevos y cada uno toma 2 horas, ¿cuánto tiempo total?",
  );
  console.log(`
   Razonamiento: ${resultado3.pasos[0]}
   Respuesta: ${resultado3.conclusion}
  `);

  paso("✅", "Chain of Thought mejorando razonamiento LLM");
}

async function main(): Promise<void> {
  await demostrarChainOfThought();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
