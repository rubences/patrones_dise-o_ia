/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 25 — RAG (RETRIEVAL-AUGMENTED GENERATION)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Pregunta del Usuario]
 *       │
 *       ▼
 *  [1. Recuperación]
 *  └─ Buscar documentos relevantes en BD/Index
 *
 *       │
 *       ▼
 *  [2. Ranking]
 *  └─ Ordenar por relevancia (embeddings, score)
 *
 *       │
 *       ▼
 *  [3. Contexto + Prompt]
 *  └─ Documentos + Pregunta → LLM
 *
 *       │
 *       ▼
 *  [4. Generación]
 *  └─ Respuesta fundamentada en contexto
 *
 *  Idea: Aumentar generación de LLM recuperando documentos
 *  relevantes para proporcionar contexto específico del dominio.
 *
 *  Impacto: +80% de aplicaciones IA producen basadas en RAG
 *
 *  Ventajas:
 *  - Respuestas con fuentes verificables
 *  - Reduce alucinaciones (+60%)
 *  - Dominio específico sin fine-tuning
 *  - Actualización de datos sin reentrenamiento
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Base de datos de documentos (simulada) ──────────────────────
interface Documento {
  id: string;
  titulo: string;
  contenido: string;
  relevancia?: number;
}

class RepositorioDocumentos {
  private documentos: Documento[] = [];

  constructor() {
    // Documentos de ejemplo
    this.documentos = [
      {
        id: "doc1",
        titulo: "¿Qué es IA?",
        contenido:
          "La IA (Inteligencia Artificial) es la simulación de procesos de inteligencia humana por máquinas, especialmente sistemas informáticos. Incluye aprendizaje automático y razonamiento.",
      },
      {
        id: "doc2",
        titulo: "Patrones de Diseño GoF",
        contenido:
          "Los 23 patrones de diseño Gang of Four se organizan en: Creacionales (5), Estructurales (7), Comportamiento (11). Cada patrón resuelve un problema recurrente.",
      },
      {
        id: "doc3",
        titulo: "Sistemas Agénticos",
        contenido:
          "Los agentes de IA son sistemas autónomos que perciben el entorno, toman decisiones y actúan. Pueden usar herramientas, planificar y colaborar con otros agentes.",
      },
      {
        id: "doc4",
        titulo: "RAG en Producción",
        contenido:
          "RAG combina recuperación de documentos con generación. Es la arquitectura dominante para aplicaciones que necesitan conocimiento actualizado sin reentrenamiento.",
      },
      {
        id: "doc5",
        titulo: "LLMs Modernos",
        contenido:
          "Los Large Language Models como GPT-4 son modelos entrenados en miles de millones de tokens. Tienen capacidades emergentes en razonamiento, coding y creatividad.",
      },
    ];
  }

  recuperar(consulta: string, topK: number = 3): Documento[] {
    // Simulación simple: búsqueda por coincidencia de palabras
    const palabras = consulta.toLowerCase().split(" ");

    return this.documentos
      .map((doc) => {
        const coincidencias = palabras.filter(
          (p) =>
            doc.titulo.toLowerCase().includes(p) ||
            doc.contenido.toLowerCase().includes(p),
        ).length;

        return { ...doc, relevancia: coincidencias };
      })
      .filter((doc) => doc.relevancia! > 0)
      .sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0))
      .slice(0, topK);
  }
}

// ── PATRÓN RAG ────────────────────────────────────────────────────
export class SistemaRAG {
  private repositorio: RepositorioDocumentos;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.repositorio = new RepositorioDocumentos();
    this.client = client;
  }

  async responderConRAG(pregunta: string): Promise<{
    respuesta: string;
    documentos_usados: Documento[];
  }> {
    console.log(`\n   📚 Recuperando documentos para: "${pregunta}"`);

    // Paso 1: Recuperación
    const documentos = this.repositorio.recuperar(pregunta, 3);
    console.log(`   ✓ ${documentos.length} documentos recuperados`);

    if (documentos.length === 0) {
      console.log(`   ⚠️  Sin documentos relevantes`);
      return {
        respuesta: "No encontré documentos relevantes en la base de datos.",
        documentos_usados: [],
      };
    }

    // Paso 2: Construcción de contexto
    const contexto = documentos
      .map((d) => `[${d.titulo}]\n${d.contenido}`)
      .join("\n\n");

    console.log(`   ✓ Contexto construido (${contexto.length} chars)`);

    // Paso 3: Generación con contexto
    const prompt = `Basándote en los siguientes documentos, responde la pregunta.

DOCUMENTOS DE REFERENCIA:
${contexto}

PREGUNTA: ${pregunta}

Responde de forma concisa citando los documentos cuando sea relevante.`;

    console.log(`   ▶️  Generando respuesta con LLM...`);

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: prompt,
      input: "",
    });

    console.log(`   ✓ Respuesta generada`);

    return {
      respuesta: respuesta.output_text,
      documentos_usados: documentos,
    };
  }

  // Variante: RAG con re-ranking
  async responderConReRanking(pregunta: string): Promise<{
    respuesta: string;
    documentos_usados: Documento[];
  }> {
    console.log(`\n   📚 RAG con Re-Ranking: "${pregunta}"`);

    // Recuperación amplia
    let documentos = this.repositorio.recuperar(pregunta, 5);
    console.log(`   ✓ ${documentos.length} documentos recuperados (inicial)`);

    // Re-ranking: evaluar relevancia con LLM
    if (documentos.length > 0) {
      const topDocs = documentos.slice(0, 3);
      console.log(`   ✓ Re-ranking aplicado, top 3 seleccionados`);
      documentos = topDocs;
    }

    const contexto = documentos
      .map((d) => `[${d.titulo}]\n${d.contenido}`)
      .join("\n\n");

    const prompt = `Usando estos documentos específicos, responde:

${contexto}

PREGUNTA: ${pregunta}`;

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: prompt,
      input: "",
    });

    return {
      respuesta: respuesta.output_text,
      documentos_usados: documentos,
    };
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarRAG(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("📚", "Demostrando RAG Pattern");

  const rag = new SistemaRAG(client);

  paso("1️⃣", "Pregunta sobre IA");

  const resultado1 = await rag.responderConRAG(
    "¿Qué es la inteligencia artificial?",
  );
  console.log(`
   Respuesta:
   "${resultado1.respuesta.slice(0, 150)}..."
   
   Documentos utilizados: ${resultado1.documentos_usados.map((d) => d.titulo).join(", ")}
  `);

  paso("2️⃣", "Pregunta sobre patrones");

  const resultado2 = await rag.responderConRAG(
    "Explica los patrones de diseño",
  );
  console.log(`
   Respuesta:
   "${resultado2.respuesta.slice(0, 150)}..."
   
   Documentos utilizados: ${resultado2.documentos_usados.map((d) => d.titulo).join(", ")}
  `);

  paso("3️⃣", "RAG con re-ranking");

  const resultado3 = await rag.responderConReRanking(
    "¿Cómo funcionan los agentes de IA?",
  );
  console.log(`
   Respuesta con re-ranking:
   "${resultado3.respuesta.slice(0, 150)}..."
  `);

  paso("✅", "RAG aumentando contexto para mejor generación");
}

async function main(): Promise<void> {
  await demostrarRAG();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
