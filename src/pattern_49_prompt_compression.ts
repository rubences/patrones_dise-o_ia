/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 49 — PROMPT COMPRESSION (COMPRESIÓN DE CONTEXTO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Contexto largo: 50.000 tokens]
 *  ├─ Documento 1 (3.000 tokens)
 *  ├─ Conversación anterior (20.000 tokens)
 *  ├─ Documento 2 (5.000 tokens)
 *  └─ Historial (22.000 tokens)
 *
 *       │
 *       ▼
 *  [Compresor]
 *  ├─ Extractive: seleccionar fragmentos clave
 *  ├─ Abstractive: resumir con LLM
 *  └─ Hybrid: extractive + abstractive
 *
 *       │
 *       ▼
 *  [Contexto comprimido: 3.000 tokens]
 *  └─ Misma información, menos tokens
 *
 *  Idea: Comprimir contextos largos antes de enviarlos al LLM
 *  para reducir costos y latencia sin perder información clave.
 *
 *  Ventajas:
 *  - -60-80% reducción de tokens
 *  - Menor costo por llamada
 *  - Menor latencia
 *  - Permite contextos más largos que el límite del modelo
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type MetodoCompresion = "extractive" | "abstractive" | "hybrid";

export interface ResultadoCompresion {
  textoOriginal: string;
  textoComprimido: string;
  tokensOriginales: number;
  tokensComprimidos: number;
  ratio: number;
  metodo: MetodoCompresion;
}

export class CompresorContexto {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  // Estimación simple de tokens
  private estimarTokens(texto: string): number {
    return Math.ceil(texto.split(/\s+/).length * 1.3);
  }

  // Extractive: seleccionar las oraciones más importantes
  compresionExtractiva(texto: string, fraccion = 0.3): ResultadoComprimido {
    const oraciones = texto.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    const nSeleccionar = Math.max(1, Math.floor(oraciones.length * fraccion));

    // Heurística: priorizar oraciones con palabras clave
    const scored = oraciones.map((o) => ({
      oracion: o.trim(),
      score: ["importante", "clave", "principal", "destacar", "crítico", "fundamental"]
        .filter((w) => o.toLowerCase().includes(w)).length + o.length / 200,
    }));

    const seleccionadas = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, nSeleccionar)
      .map((s) => s.oracion);

    return { texto: seleccionadas.join(". ") + "." };
  }

  // Abstractive: resumir con LLM
  async compresionAbstractiva(texto: string, maxTokensObjetivo = 500): Promise<ResultadoComprimido> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Resume el siguiente texto preservando TODA la información importante en máximo ${maxTokensObjetivo} palabras:

${texto}

Resume de forma densa y concisa, eliminando redundancias pero manteniendo hechos clave.`,
      input: "",
    });

    return { texto: resp.output_text };
  }

  async comprimir(
    texto: string,
    metodo: MetodoCompresion = "hybrid",
    objetivo = 0.3,
  ): Promise<ResultadoCompresion> {
    const tokensOriginales = this.estimarTokens(texto);
    let textoComprimido: string;

    if (metodo === "extractive") {
      textoComprimido = this.compresionExtractiva(texto, objetivo).texto;
    } else if (metodo === "abstractive") {
      const maxTokens = Math.floor(tokensOriginales * objetivo);
      textoComprimido = (await this.compresionAbstractiva(texto, maxTokens)).texto;
    } else {
      // Hybrid: extractive primero para reducir, luego abstractive para refinar
      const preComprimido = this.compresionExtractiva(texto, 0.5).texto;
      const maxTokens = Math.floor(tokensOriginales * objetivo);
      textoComprimido = (await this.compresionAbstractiva(preComprimido, maxTokens)).texto;
    }

    const tokensComprimidos = this.estimarTokens(textoComprimido);

    return {
      textoOriginal: texto,
      textoComprimido,
      tokensOriginales,
      tokensComprimidos,
      ratio: tokensComprimidos / tokensOriginales,
      metodo,
    };
  }
}

interface ResultadoComprimido {
  texto: string;
}

export async function demostrarPromptCompression(client: OpenAI = makeClient()): Promise<void> {
  paso("📦", "Demostrando Prompt Compression Pattern");

  const compresor = new CompresorContexto(client);

  const textoLargo = `Los sistemas de inteligencia artificial modernos han transformado radicalmente la manera en que interactuamos con la tecnología. Los Large Language Models, o LLMs, son modelos de lenguaje entrenados en enormes corpus de texto que les permiten generar texto coherente y relevante. Estos modelos han demostrado capacidades sorprendentes en tareas como traducción, resumen, programación y razonamiento. Sin embargo, presentan importantes limitaciones como las alucinaciones, donde generan información falsa con alta confianza. Los patrones de diseño para sistemas agénticos buscan mitigar estas limitaciones mediante arquitecturas más robustas. Por ejemplo, el patrón RAG (Retrieval-Augmented Generation) combina la recuperación de documentos relevantes con la generación del LLM, reduciendo significativamente las alucinaciones. El patrón Chain of Thought mejora el razonamiento al pedir al modelo que explique su proceso de pensamiento paso a paso. Los sistemas multi-agente distribuyen tareas entre agentes especializados que colaboran para resolver problemas complejos. La aplicación de estos patrones en producción requiere consideraciones adicionales de escalabilidad, latencia, costo y fiabilidad.`;

  console.log(`\n   Texto original: ${textoLargo.split(" ").length} palabras (~${Math.ceil(textoLargo.split(" ").length * 1.3)} tokens)\n`);

  paso("1️⃣", "Compresión Extractiva (sin LLM)");
  const r1 = await compresor.comprimir(textoLargo, "extractive", 0.3);
  console.log(`   Original: ${r1.tokensOriginales} tokens`);
  console.log(`   Comprimido: ${r1.tokensComprimidos} tokens (ratio: ${(r1.ratio * 100).toFixed(0)}%)`);
  console.log(`   Texto: "${r1.textoComprimido.slice(0, 120)}..."\n`);

  paso("2️⃣", "Compresión Abstractiva (con LLM)");
  const r2 = await compresor.comprimir(textoLargo, "abstractive", 0.25);
  console.log(`   Original: ${r2.tokensOriginales} tokens`);
  console.log(`   Comprimido: ${r2.tokensComprimidos} tokens (ratio: ${(r2.ratio * 100).toFixed(0)}%)`);
  console.log(`   Texto: "${r2.textoComprimido.slice(0, 120)}..."\n`);

  paso("3️⃣", "Compresión Híbrida (extractive + abstractive)");
  const r3 = await compresor.comprimir(textoLargo, "hybrid", 0.2);
  console.log(`   Original: ${r3.tokensOriginales} tokens`);
  console.log(`   Comprimido: ${r3.tokensComprimidos} tokens (ratio: ${(r3.ratio * 100).toFixed(0)}%)`);
  console.log(`   Ahorro estimado: ${((1 - r3.ratio) * 100).toFixed(0)}% de tokens\n`);

  paso("✅", "Prompt Compression reduciendo tokens sin perder información esencial");
}

async function main(): Promise<void> {
  await demostrarPromptCompression();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
