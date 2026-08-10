/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 50 — MULTI-MODAL (PROCESAMIENTO MULTI-MODAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada Multi-Modal]
 *  ├─ Texto: "Analiza esta imagen"
 *  ├─ Código: function foo() { ... }
 *  ├─ Datos estructurados: { "precio": 42.5 }
 *  └─ (Imagen — vía URL o base64)
 *
 *       │
 *       ▼
 *  [Router Multi-Modal]
 *  └─ Detectar tipos de contenido
 *
 *       │
 *   ┌───┼───┬───┐
 *   ▼   ▼   ▼   ▼
 *  [T] [C] [D] [I]  ← Procesadores especializados por modalidad
 *   │   │   │   │
 *   └───┴───┴───┘
 *       │
 *       ▼
 *  [Síntesis unificada]
 *
 *  Idea: Procesar múltiples tipos de contenido (texto, código,
 *  datos, imágenes) en un pipeline unificado.
 *
 *  Ventajas:
 *  - Un solo agente maneja todo tipo de entrada
 *  - Procesamiento especializado por modalidad
 *  - Síntesis coherente de múltiples tipos
 *  - Extensible a nuevas modalidades
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type Modalidad = "texto" | "codigo" | "datos" | "url" | "markdown";

export interface EntradaModal {
  tipo: Modalidad;
  contenido: string;
  metadatos?: Record<string, string>;
}

export interface ResultadoModal {
  modalidad: Modalidad;
  analisis: string;
  confianza: number;
}

export class ProcesadorMultiModal {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  // Detectar automáticamente la modalidad
  detectarModalidad(contenido: string): Modalidad {
    if (/^https?:\/\//.test(contenido)) return "url";
    if (/^#{1,6}\s|^\*\*|^-\s/.test(contenido)) return "markdown";
    if (/function\s+\w+|const\s+\w+\s*=|class\s+\w+|import\s+/.test(contenido)) return "codigo";
    if (/^\s*[\[{]/.test(contenido) || /^\s*\w+:\s/.test(contenido)) return "datos";
    return "texto";
  }

  private async procesarTexto(contenido: string): Promise<ResultadoModal> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Analiza este texto y extrae: tema principal, puntos clave (máx 3) y sentiment.\n\n${contenido}`,
      input: "",
    });
    return { modalidad: "texto", analisis: resp.output_text, confianza: 90 };
  }

  private async procesarCodigo(contenido: string): Promise<ResultadoModal> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Analiza este código: detecta lenguaje, propósito, complejidad y posibles mejoras.\n\n\`\`\`\n${contenido}\n\`\`\``,
      input: "",
    });
    return { modalidad: "codigo", analisis: resp.output_text, confianza: 88 };
  }

  private async procesarDatos(contenido: string): Promise<ResultadoModal> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Analiza estos datos estructurados: identifica estructura, valores notables y posibles insights.\n\n${contenido}`,
      input: "",
    });
    return { modalidad: "datos", analisis: resp.output_text, confianza: 85 };
  }

  private async procesarURL(url: string): Promise<ResultadoModal> {
    // Simular análisis de URL (en producción haría fetch)
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Basándote en esta URL, describe qué tipo de recurso podría ser y cómo procesarlo: ${url}`,
      input: "",
    });
    return { modalidad: "url", analisis: resp.output_text, confianza: 70 };
  }

  private async procesarMarkdown(contenido: string): Promise<ResultadoModal> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Extrae la estructura (secciones, puntos clave) de este documento Markdown:\n\n${contenido}`,
      input: "",
    });
    return { modalidad: "markdown", analisis: resp.output_text, confianza: 92 };
  }

  async procesar(entrada: EntradaModal): Promise<ResultadoModal> {
    const modalidad = entrada.metadatos?.tipo as Modalidad ?? this.detectarModalidad(entrada.contenido);
    console.log(`   🔍 Modalidad detectada: ${modalidad}`);

    switch (modalidad) {
      case "codigo": return this.procesarCodigo(entrada.contenido);
      case "datos": return this.procesarDatos(entrada.contenido);
      case "url": return this.procesarURL(entrada.contenido);
      case "markdown": return this.procesarMarkdown(entrada.contenido);
      default: return this.procesarTexto(entrada.contenido);
    }
  }

  async procesarMultiple(entradas: EntradaModal[]): Promise<{
    resultados: ResultadoModal[];
    sintesis: string;
  }> {
    console.log(`\n   📥 Procesando ${entradas.length} entradas multi-modal...`);

    const resultados = await Promise.all(entradas.map((e) => this.procesar(e)));

    // Sintetizar resultados de todas las modalidades
    const contexto = resultados
      .map((r) => `[${r.modalidad.toUpperCase()}]\n${r.analisis}`)
      .join("\n\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Sintetiza estos análisis de diferentes tipos de contenido en una conclusión unificada:\n\n${contexto}`,
      input: "",
    });

    return { resultados, sintesis: resp.output_text };
  }
}

export async function demostrarMultiModal(client: OpenAI = makeClient()): Promise<void> {
  paso("🎨", "Demostrando Multi-Modal Pattern");

  const procesador = new ProcesadorMultiModal(client);

  paso("1️⃣", "Detección automática de modalidades");
  const muestras = [
    "Los patrones de diseño mejoran la mantenibilidad del código.",
    "function calcular(a: number, b: number): number { return a + b; }",
    '{ "patron": "RAG", "impacto": "alto", "tokens_ahorro": 0.4 }',
    "https://refactoring.guru/design-patterns",
    "## Título\n- Punto 1\n- **Punto 2**",
  ];

  muestras.forEach((m) => {
    const mod = procesador.detectarModalidad(m);
    console.log(`   "${m.slice(0, 45)}..." → ${mod}`);
  });

  paso("2️⃣", "Procesamiento de cada modalidad");

  const entradas: EntradaModal[] = [
    { tipo: "texto", contenido: "Los sistemas agénticos son el futuro de la IA empresarial." },
    { tipo: "codigo", contenido: "const suma = (a: number, b: number) => a + b;" },
    { tipo: "datos", contenido: '{ "patrones": 50, "cobertura": "70%", "fase": 3 }' },
  ];

  for (const entrada of entradas) {
    console.log(`\n   Procesando [${entrada.tipo}]...`);
    const resultado = await procesador.procesar(entrada);
    console.log(`   Análisis: "${resultado.analisis.slice(0, 100)}..." (confianza: ${resultado.confianza}%)`);
  }

  paso("3️⃣", "Síntesis multi-modal");
  const { sintesis } = await procesador.procesarMultiple(entradas);
  console.log(`\n   Síntesis unificada: "${sintesis.slice(0, 200)}..."`);

  paso("✅", "Multi-Modal procesando y sintetizando distintos tipos de contenido");
}

async function main(): Promise<void> {
  await demostrarMultiModal();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
