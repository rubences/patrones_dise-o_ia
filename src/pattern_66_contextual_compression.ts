/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 66 — CONTEXTUAL COMPRESSION (COMPRESIÓN CONTEXTUAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  RAG básico:
 *  Consulta + Documento completo (500 tokens) → LLM
 *  (80% del documento puede ser irrelevante)
 *
 *  RAG + Contextual Compression:
 *  Consulta + Fragmentos extraídos (50 tokens) → LLM
 *  (100% relevante para la consulta)
 *
 *  Idea: Comprimir documentos recuperados extrayendo SÓLO
 *  los fragmentos directamente relevantes para la consulta.
 *
 *  Diferencia vs Prompt Compression (49): Prompt Compression comprime
 *  el contexto general; este patrón comprime documentos recuperados
 *  para retener sólo la información relevante a la consulta.
 *
 *  Ventajas:
 *  - -80% tokens en el contexto de RAG
 *  - Mayor precisión (sin ruido irrelevante)
 *  - Más documentos caben en el contexto
 *  - Mejora calidad de respuestas RAG
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface DocumentoCompleto {
  id: string;
  titulo: string;
  contenido: string;
}

export interface FragmentoComprimido {
  documentoId: string;
  fragmento: string;
  tokensOriginales: number;
  tokensComprimidos: number;
}

export class CompresorContextual {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async comprimir(consulta: string, documento: DocumentoCompleto): Promise<FragmentoComprimido | null> {
    const tokensOriginales = Math.ceil(documento.contenido.split(" ").length * 1.3);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Dada esta consulta: "${consulta}"

Del siguiente documento, extrae SÓLO las oraciones directamente relevantes.
Si el documento no contiene información relevante, responde: IRRELEVANTE

Documento (${documento.titulo}):
${documento.contenido}

Extrae sólo lo relevante (o escribe IRRELEVANTE):`,
      input: "",
    });

    const fragmento = resp.output_text.trim();
    if (fragmento.toUpperCase() === "IRRELEVANTE" || fragmento.length < 10) return null;

    return {
      documentoId: documento.id,
      fragmento,
      tokensOriginales,
      tokensComprimidos: Math.ceil(fragmento.split(" ").length * 1.3),
    };
  }

  async comprimirMultiple(consulta: string, documentos: DocumentoCompleto[]): Promise<{
    fragmentos: FragmentoComprimido[];
    tokensTotalesOriginales: number;
    tokensTotalesComprimidos: number;
  }> {
    console.log(`\n   🗜️  Comprimiendo ${documentos.length} documentos para: "${consulta.slice(0, 50)}..."`);
    const promesas = documentos.map((d) => this.comprimir(consulta, d));
    const resultados = await Promise.all(promesas);

    const fragmentos = resultados.filter((r): r is FragmentoComprimido => r !== null);
    const originales = documentos.reduce((s, d) => s + Math.ceil(d.contenido.split(" ").length * 1.3), 0);
    const comprimidos = fragmentos.reduce((s, f) => s + f.tokensComprimidos, 0);

    console.log(`   ✓ ${fragmentos.length}/${documentos.length} documentos con fragmentos relevantes`);
    console.log(`   ✓ Tokens: ${originales} → ${comprimidos} (${Math.round((1 - comprimidos / originales) * 100)}% reducción)`);

    return { fragmentos, tokensTotalesOriginales: originales, tokensTotalesComprimidos: comprimidos };
  }

  async responderConCompresion(consulta: string, documentos: DocumentoCompleto[]): Promise<string> {
    const { fragmentos } = await this.comprimirMultiple(consulta, documentos);

    if (fragmentos.length === 0) {
      return "No encontré información relevante en los documentos.";
    }

    const contexto = fragmentos.map((f) => f.fragmento).join("\n\n");
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Responde la consulta usando SÓLO esta información comprimida y relevante:

${contexto}

CONSULTA: ${consulta}`,
      input: "",
    });

    return resp.output_text;
  }
}

export async function demostrarContextualCompression(client: OpenAI = makeClient()): Promise<void> {
  paso("🗜️", "Demostrando Contextual Compression Pattern");

  const compresor = new CompresorContextual(client);

  const documentos: DocumentoCompleto[] = [
    {
      id: "d1",
      titulo: "Historia de los Patrones de Diseño",
      contenido: "Los patrones de diseño fueron popularizados por el libro 'Design Patterns' de 1994. El libro fue escrito por Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides, conocidos como la 'Gang of Four'. Define 23 patrones organizados en creacionales, estructurales y de comportamiento. El patrón Singleton asegura una única instancia de una clase. Factory Method define una interfaz para crear objetos. El libro ha vendido más de 500.000 copias y es referencia obligada.",
    },
    {
      id: "d2",
      titulo: "Cómo usar RAG en producción",
      contenido: "RAG (Retrieval-Augmented Generation) es una arquitectura que combina búsqueda vectorial con generación de LLMs. Para producción se recomienda usar bases de datos vectoriales como Pinecone, Weaviate o Chroma. El chunking óptimo es de 200-500 tokens por fragmento con overlap del 10-20%. El re-ranking mejora la calidad significativamente. Los embeddings de OpenAI text-embedding-3-large ofrecen alta precisión.",
    },
    {
      id: "d3",
      titulo: "Recetas de cocina italiana",
      contenido: "La pasta carbonara requiere huevos, pecorino, guanciale y pimienta. La pizza napolitana usa harina tipo 00 y tomate San Marzano. El tiramisú lleva mascarpone, espresso y savoiardi. La clave de la cocina italiana es usar ingredientes frescos y de alta calidad. El parmigiano reggiano es el queso más utilizado.",
    },
  ];

  paso("1️⃣", "Compresión contextual para consulta sobre Singleton");
  const consulta1 = "¿Qué es el patrón Singleton y cuándo se creó?";
  const { fragmentos: f1, tokensTotalesOriginales: to1, tokensTotalesComprimidos: tc1 } =
    await compresor.comprimirMultiple(consulta1, documentos);

  console.log(`\n   Tokens originales: ${to1} | Comprimidos: ${tc1} | Ahorro: ${Math.round((1 - tc1 / to1) * 100)}%`);
  f1.forEach((f) => console.log(`   Fragmento: "${f.fragmento.slice(0, 80)}..."`));

  paso("2️⃣", "Respuesta RAG con compresión contextual");
  const respuesta = await compresor.responderConCompresion(
    "¿Cómo implemento RAG con re-ranking?",
    documentos,
  );
  console.log(`\n   Respuesta: "${respuesta.slice(0, 200)}..."\n`);

  paso("✅", "Contextual Compression extrayendo sólo lo relevante para máxima eficiencia");
}

async function main(): Promise<void> { await demostrarContextualCompression(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
