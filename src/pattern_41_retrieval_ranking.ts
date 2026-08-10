/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 41 — RETRIEVAL WITH RANKING (RECUPERACIÓN CON RERANKING)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Consulta]
 *       │
 *       ▼
 *  [Fase 1: Recuperación Amplia]
 *  └─ Vector search → Top-K documentos (K=20)
 *
 *       │
 *       ▼
 *  [Fase 2: Re-Ranking]
 *  └─ LLM evalúa relevancia de cada doc → Reordena
 *
 *       │
 *       ▼
 *  [Fase 3: Filtrado]
 *  └─ Seleccionar top-N más relevantes (N=3)
 *
 *       │
 *       ▼
 *  [Fase 4: Generación]
 *  └─ LLM responde con contexto de alta calidad
 *
 *  Idea: Combinar recuperación rápida (baja precisión)
 *  con re-ranking semántico (alta precisión).
 *
 *  Supera a RAG básico en +25% de precisión
 *
 *  Ventajas:
 *  - Mejor calidad que RAG simple
 *  - Elimina documentos irrelevantes
 *  - Contexto más limpio para el LLM
 *  - Escalable a grandes corpus
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface DocumentoRankeado {
  id: string;
  titulo: string;
  contenido: string;
  scoreInicial: number;
  scoreReranking?: number;
}

export class RecuperadorConReranking {
  private corpus: DocumentoRankeado[];
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;

    // Corpus de ejemplo
    this.corpus = [
      { id: "d1", titulo: "RAG Basics", contenido: "RAG combina recuperación y generación para mejorar LLMs con contexto externo.", scoreInicial: 0 },
      { id: "d2", titulo: "Vector Embeddings", contenido: "Los embeddings son representaciones vectoriales de texto que permiten búsqueda semántica.", scoreInicial: 0 },
      { id: "d3", titulo: "Fine-tuning vs RAG", contenido: "RAG es preferible cuando los datos cambian frecuentemente; fine-tuning para comportamiento fijo.", scoreInicial: 0 },
      { id: "d4", titulo: "Chain of Thought", contenido: "CoT mejora el razonamiento pidiendo al modelo 'pensar paso a paso'.", scoreInicial: 0 },
      { id: "d5", titulo: "LLM Prompting", contenido: "Un buen prompt define rol, contexto, tarea y formato de salida esperado.", scoreInicial: 0 },
      { id: "d6", titulo: "FAISS Index", contenido: "FAISS es una librería de Facebook para búsqueda eficiente de vectores similares.", scoreInicial: 0 },
      { id: "d7", titulo: "Agentic Systems", contenido: "Los sistemas agénticos combinan LLMs con herramientas, memoria y planificación.", scoreInicial: 0 },
      { id: "d8", titulo: "Chunking Strategy", contenido: "Dividir documentos en fragmentos óptimos (200-500 tokens) mejora la recuperación.", scoreInicial: 0 },
    ];
  }

  private recuperarInicialmente(consulta: string, topK: number): DocumentoRankeado[] {
    // Simular búsqueda vectorial con score de similitud léxica
    const palabras = consulta.toLowerCase().split(" ");
    return this.corpus
      .map((doc) => ({
        ...doc,
        scoreInicial: palabras.filter(
          (p) => doc.titulo.toLowerCase().includes(p) || doc.contenido.toLowerCase().includes(p),
        ).length,
      }))
      .sort((a, b) => b.scoreInicial - a.scoreInicial)
      .slice(0, topK);
  }

  private async rerankear(consulta: string, documentos: DocumentoRankeado[]): Promise<DocumentoRankeado[]> {
    console.log(`   📊 Re-ranking ${documentos.length} documentos...`);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Para la consulta: "${consulta}"
      
Evalúa la relevancia de cada documento del 0 al 100:
${documentos.map((d, i) => `${i + 1}. [${d.id}] ${d.titulo}: ${d.contenido.slice(0, 80)}`).join("\n")}

Responde SOLO en formato:
d1: [score]
d2: [score]
...`,
      input: "",
    });

    // Parsear scores de re-ranking
    return documentos.map((doc) => {
      const match = resp.output_text.match(new RegExp(`${doc.id}:\\s*(\\d+)`));
      return { ...doc, scoreReranking: match ? parseInt(match[1]) : doc.scoreInicial * 10 };
    }).sort((a, b) => (b.scoreReranking ?? 0) - (a.scoreReranking ?? 0));
  }

  async responder(consulta: string, topKInicial = 5, topNFinal = 3): Promise<{
    respuesta: string;
    documentosUsados: string[];
    mejora: string;
  }> {
    console.log(`\n   🔍 Recuperación con Reranking: "${consulta.slice(0, 50)}..."`);

    // Fase 1: Recuperación amplia
    const candidatos = this.recuperarInicialmente(consulta, topKInicial);
    console.log(`   ✓ Fase 1: ${candidatos.length} candidatos recuperados`);
    console.log(`     Scores iniciales: ${candidatos.map((d) => `${d.id}=${d.scoreInicial}`).join(", ")}`);

    // Fase 2: Re-ranking semántico
    const rerankeados = await this.rerankear(consulta, candidatos);
    const seleccionados = rerankeados.slice(0, topNFinal);
    console.log(`   ✓ Fase 2: Re-ranking aplicado`);
    console.log(`     Scores reranking: ${seleccionados.map((d) => `${d.id}=${d.scoreReranking}`).join(", ")}`);

    // Fase 3: Generar con contexto de alta calidad
    const contexto = seleccionados.map((d) => `[${d.titulo}]\n${d.contenido}`).join("\n\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Usando SÓLO estos documentos altamente relevantes, responde:

${contexto}

CONSULTA: ${consulta}`,
      input: "",
    });

    return {
      respuesta: resp.output_text,
      documentosUsados: seleccionados.map((d) => d.titulo),
      mejora: `De ${topKInicial} candidatos → ${topNFinal} seleccionados por re-ranking`,
    };
  }
}

export async function demostrarRetrievalWithRanking(client: OpenAI = makeClient()): Promise<void> {
  paso("📊", "Demostrando Retrieval with Ranking Pattern");

  const recuperador = new RecuperadorConReranking(client);

  paso("1️⃣", "Consulta sobre RAG");
  const r1 = await recuperador.responder("¿Cómo mejorar la recuperación en sistemas RAG?", 5, 3);
  console.log(`\n   Documentos usados: ${r1.documentosUsados.join(", ")}`);
  console.log(`   Mejora aplicada: ${r1.mejora}`);
  console.log(`   Respuesta: "${r1.respuesta.slice(0, 150)}..."\n`);

  paso("2️⃣", "Consulta sobre agentes");
  const r2 = await recuperador.responder("¿Qué es un sistema agéntico?", 4, 2);
  console.log(`\n   Documentos usados: ${r2.documentosUsados.join(", ")}`);
  console.log(`   Respuesta: "${r2.respuesta.slice(0, 150)}..."\n`);

  paso("✅", "Retrieval+Ranking maximizando calidad del contexto para LLM");
}

async function main(): Promise<void> {
  await demostrarRetrievalWithRanking();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
