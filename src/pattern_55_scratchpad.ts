/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 55 — SCRATCHPAD (BLOC DE NOTAS INTERNO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema complejo]
 *       │
 *       ▼
 *  [LLM con Scratchpad interno]
 *  ╔══════════════════════════════════════════╗
 *  ║ <scratchpad>                              ║
 *  ║   Paso 1: entender el problema...         ║
 *  ║   Hipótesis A: ...                        ║
 *  ║   Hipótesis B: ...                        ║
 *  ║   Verificar: A parece más correcta...     ║
 *  ║   Calcular: 5 × 12 = 60                   ║
 *  ║   Conclusión: ...                         ║
 *  ║ </scratchpad>                             ║
 *  ║                                           ║
 *  ║ RESPUESTA FINAL: [limpia y concisa]       ║
 *  ╚══════════════════════════════════════════╝
 *
 *  Idea: Dar al agente un "bloc de notas" interno para trabajo
 *  intermedio antes de emitir la respuesta final.
 *
 *  Ventajas:
 *  - Trabajo intermedio sin contaminar la respuesta
 *  - Mejor razonamiento en problemas complejos
 *  - Respuestas más limpias y concisas
 *  - Transparencia del proceso de pensamiento
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface ResultadoScratchpad {
  borrador: string;
  respuestaFinal: string;
  pasosDePensamiento: string[];
}

export class AgenteConScratchpad {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async resolver(problema: string): Promise<ResultadoScratchpad> {
    console.log(`\n   📝 Scratchpad activo para: "${problema.slice(0, 60)}..."`);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Resuelve el siguiente problema usando un scratchpad interno para tu razonamiento.

INSTRUCCIONES:
1. Escribe tu trabajo borrador entre etiquetas <scratchpad> y </scratchpad>
2. Usa el scratchpad para hipótesis, cálculos, verificaciones
3. Después escribe la respuesta final limpia con: RESPUESTA: [texto]

PROBLEMA: ${problema}`,
      input: "",
    });

    const texto = resp.output_text;
    const scratchpadMatch = texto.match(/<scratchpad>([\s\S]*?)<\/scratchpad>/i);
    const respuestaMatch = texto.match(/RESPUESTA:\s*([\s\S]+)/i);

    const borrador = scratchpadMatch?.[1]?.trim() ?? "(sin scratchpad)";
    const respuestaFinal = respuestaMatch?.[1]?.trim() ?? texto.replace(/<scratchpad>[\s\S]*?<\/scratchpad>/i, "").trim();

    const pasos = borrador.split("\n").filter((l) => l.trim().length > 10);

    console.log(`   📋 Pasos en scratchpad: ${pasos.length}`);
    console.log(`   ✅ Respuesta final extraída`);

    return { borrador, respuestaFinal, pasosDePensamiento: pasos };
  }

  async resolverMultiPaso(pasos: string[]): Promise<string[]> {
    console.log(`\n   📝 Scratchpad multi-paso (${pasos.length} pasos)`);
    const resultados: string[] = [];
    let contextoAcumulado = "";

    for (const [i, paso] of pasos.entries()) {
      console.log(`   Paso ${i + 1}: ${paso.slice(0, 50)}...`);
      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: `Contexto previo: ${contextoAcumulado || "Ninguno"}

Tarea actual: ${paso}

Usa <scratchpad> para trabajo intermedio, luego RESULTADO: [conclusión del paso]`,
        input: "",
      });

      const resultado = resp.output_text.match(/RESULTADO:\s*(.+)/)?.[1]?.trim() ?? resp.output_text.slice(-100);
      resultados.push(resultado);
      contextoAcumulado += `\nPaso ${i + 1}: ${resultado}`;
    }

    return resultados;
  }
}

export async function demostrarScratchpad(client: OpenAI = makeClient()): Promise<void> {
  paso("📝", "Demostrando Scratchpad Pattern");

  const agente = new AgenteConScratchpad(client);

  paso("1️⃣", "Problema matemático con scratchpad");
  const r1 = await agente.resolver(
    "Un proyecto tiene 5 fases. Cada fase dura el doble que la anterior. La primera dura 3 días. ¿Cuántos días total?",
  );
  console.log(`\n   Borrador (${r1.pasosDePensamiento.length} pasos):`);
  r1.pasosDePensamiento.slice(0, 3).forEach((p) => console.log(`   • ${p.slice(0, 80)}`));
  console.log(`   Respuesta final: "${r1.respuestaFinal.slice(0, 150)}"\n`);

  paso("2️⃣", "Razonamiento complejo con scratchpad");
  const r2 = await agente.resolver(
    "Analiza las ventajas y desventajas del patrón Singleton vs Pool de conexiones para gestionar acceso a una API externa.",
  );
  console.log(`   Respuesta: "${r2.respuestaFinal.slice(0, 200)}..."\n`);

  paso("3️⃣", "Pipeline multi-paso con scratchpad");
  const resultados = await agente.resolverMultiPaso([
    "Identificar los 3 patrones más importantes de la FASE 1",
    "Comparar su complejidad de implementación",
    "Recomendar cuál implementar primero",
  ]);
  resultados.forEach((r, i) => console.log(`   Paso ${i + 1}: ${r.slice(0, 80)}`));

  paso("✅", "Scratchpad mejorando razonamiento con espacio de trabajo interno");
}

async function main(): Promise<void> { await demostrarScratchpad(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
