/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 67 — OUTPUT PARSERS (PARSERS DE SALIDA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [LLM Output: texto libre]
 *  "Los patrones son: 1. Factory 2. Singleton..."
 *       │
 *       ▼
 *  [Parser Registry]
 *  ├─ ListParser      → ["Factory", "Singleton", ...]
 *  ├─ TableParser     → [{nombre, tipo, uso}, ...]
 *  ├─ KeyValueParser  → {patron: "Factory", tipo: "Creacional"}
 *  ├─ MarkdownParser  → {headings, paragraphs, code}
 *  └─ CustomParser    → cualquier estructura
 *
 *  Idea: Transformar la salida de texto libre del LLM en
 *  estructuras de datos tipadas y utilizables directamente.
 *
 *  Diferencia vs Structured Output (59): Structured Output usa schemas
 *  Zod para forzar el formato desde el inicio; Output Parsers procesan
 *  texto libre ya generado.
 *
 *  Ventajas:
 *  - Compatible con cualquier LLM (sin structured outputs)
 *  - Parsers reutilizables
 *  - Fallback gracioso si el formato no es exacto
 *  - Transformación a tipos TypeScript
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Parser<T> {
  nombre: string;
  instruccionFormato: string;
  parsear(texto: string): T | null;
}

export class ListParser implements Parser<string[]> {
  nombre = "ListParser";
  instruccionFormato = "Responde con una lista, un ítem por línea comenzando con '- ' o número.";

  parsear(texto: string): string[] | null {
    const items = texto.split("\n")
      .map((l) => l.replace(/^[\-\*\d\.\s]+/, "").trim())
      .filter((l) => l.length > 2);
    return items.length > 0 ? items : null;
  }
}

export class KeyValueParser implements Parser<Record<string, string>> {
  nombre = "KeyValueParser";
  instruccionFormato = "Responde con pares clave: valor, uno por línea.";

  parsear(texto: string): Record<string, string> | null {
    const resultado: Record<string, string> = {};
    texto.split("\n").forEach((l) => {
      const match = l.match(/^(.+?):\s*(.+)$/);
      if (match) resultado[match[1].trim()] = match[2].trim();
    });
    return Object.keys(resultado).length > 0 ? resultado : null;
  }
}

export class TableParser implements Parser<Record<string, string>[]> {
  nombre = "TableParser";
  instruccionFormato = "Responde con una tabla Markdown con columnas separadas por |.";

  parsear(texto: string): Record<string, string>[] | null {
    const lineas = texto.split("\n").filter((l) => l.includes("|"));
    if (lineas.length < 2) return null;

    const headers = lineas[0].split("|").map((h) => h.trim()).filter(Boolean);
    const filas = lineas.slice(2).map((l) => {
      const celdas = l.split("|").map((c) => c.trim()).filter(Boolean);
      const fila: Record<string, string> = {};
      headers.forEach((h, i) => { fila[h] = celdas[i] ?? ""; });
      return fila;
    }).filter((f) => Object.values(f).some((v) => v.length > 0));

    return filas.length > 0 ? filas : null;
  }
}

export class MarkdownParser implements Parser<{ headings: string[]; paragraphs: string[]; codeBlocks: string[] }> {
  nombre = "MarkdownParser";
  instruccionFormato = "Responde con formato Markdown usando # para títulos y ``` para código.";

  parsear(texto: string): { headings: string[]; paragraphs: string[]; codeBlocks: string[] } | null {
    const headings = [...texto.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => m[1]);
    const codeBlocks = [...texto.matchAll(/```[\s\S]*?```/g)].map((m) => m[0]);
    const paragraphs = texto.split("\n\n").filter((p) => !p.startsWith("#") && !p.startsWith("```") && p.trim().length > 10);
    return { headings, paragraphs, codeBlocks };
  }
}

export class OutputParserRegistry {
  private parsers: Map<string, Parser<unknown>> = new Map();
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.registrar(new ListParser());
    this.registrar(new KeyValueParser());
    this.registrar(new TableParser());
    this.registrar(new MarkdownParser());
  }

  registrar<T>(parser: Parser<T>): void {
    this.parsers.set(parser.nombre, parser as Parser<unknown>);
    console.log(`   ✓ Parser registrado: ${parser.nombre}`);
  }

  async generar<T>(prompt: string, parserNombre: string): Promise<T | null> {
    const parser = this.parsers.get(parserNombre) as Parser<T> | undefined;
    if (!parser) throw new Error(`Parser no encontrado: ${parserNombre}`);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `${prompt}\n\nFORMATO REQUERIDO: ${parser.instruccionFormato}`,
      input: "",
    });

    return parser.parsear(resp.output_text);
  }
}

export async function demostrarOutputParsers(client: OpenAI = makeClient()): Promise<void> {
  paso("🔧", "Demostrando Output Parsers Pattern");

  const registry = new OutputParserRegistry(client);

  paso("1️⃣", "ListParser: extraer lista de patrones");
  const lista = await registry.generar<string[]>(
    "Lista los 5 patrones de diseño más importantes para sistemas agénticos",
    "ListParser",
  );
  console.log(`\n   Lista parseada (${lista?.length ?? 0} items):`);
  lista?.slice(0, 3).forEach((item) => console.log(`   • ${item}`));

  paso("2️⃣", "KeyValueParser: extraer propiedades");
  const kv = await registry.generar<Record<string, string>>(
    "Describe el patrón RAG con estas propiedades: Nombre, Tipo, Propósito, Impacto, Complejidad",
    "KeyValueParser",
  );
  console.log(`\n   Pares clave-valor:`);
  if (kv) Object.entries(kv).slice(0, 4).forEach(([k, v]) => console.log(`   ${k}: ${v}`));

  paso("3️⃣", "TableParser: tabla comparativa");
  const tabla = await registry.generar<Record<string, string>[]>(
    "Crea una tabla comparando 3 patrones (RAG, CoT, ReAct) con columnas: Patrón | Tipo | Ventaja Principal",
    "TableParser",
  );
  console.log(`\n   Tabla parseada (${tabla?.length ?? 0} filas):`);
  tabla?.forEach((fila) => console.log(`   ${JSON.stringify(fila)}`));

  paso("✅", "Output Parsers transformando texto libre a estructuras de datos tipadas");
}

async function main(): Promise<void> { await demostrarOutputParsers(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
