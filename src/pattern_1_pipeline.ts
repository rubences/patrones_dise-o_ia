/**
 * ═══════════════════════════════════════════════════════════════
 *  PATRÓN 1 — PIPELINE (cadena de montaje)
 * ═══════════════════════════════════════════════════════════════
 *
 *            ┌─────────────┐   ┌──────────────┐   ┌────────────┐
 *   tema ──▶ │ 1. esquema  │──▶│ 2. borrador  │──▶│ 3. título  │
 *            └─────────────┘   └──────────────┘   └────────────┘
 *
 *  Idea clave: en vez de pedirle TODO al modelo de golpe, se
 *  divide el trabajo en pasos pequeños. La salida de cada paso
 *  es la entrada del siguiente, como en una cadena de montaje.
 *
 *  Ejemplo: escribir un post de blog en tres pasos.
 */

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// El esquema Zod obliga al modelo a devolver JSON con esta forma
// exacta: tres puntos, ni más ni menos (Structured Outputs).
export const EsquemaSchema = z.object({
  puntos: z.array(z.string()).length(3),
});

export type Esquema = z.infer<typeof EsquemaSchema>;

export interface Post {
  esquema: Esquema;
  borrador: string;
  titulo: string;
}

// ── Paso 1: de un tema a un esquema de tres puntos ─────────────
async function generarEsquema(client: OpenAI, tema: string): Promise<Esquema> {
  const respuesta = await client.responses.parse({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres redactor de un blog técnico. Resume el tema en " +
      "exactamente tres puntos clave, uno por frase.",
    input: `Tema del post: ${tema}`,
    text: { format: zodTextFormat(EsquemaSchema, "esquema") },
  });

  const esquema = respuesta.output_parsed;
  if (!esquema) throw new Error("El modelo no devolvió un esquema válido");
  return esquema;
}

// ── Paso 2: del esquema a un borrador ──────────────────────────
async function escribirBorrador(
  client: OpenAI,
  tema: string,
  esquema: Esquema,
): Promise<string> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Escribe un post de blog breve (unas 120 palabras) que " +
      "desarrolle los tres puntos del esquema, en ese orden.",
    input: `Tema: ${tema}\nEsquema: ${JSON.stringify(esquema.puntos)}`,
  });
  return respuesta.output_text;
}

// ── Paso 3: del borrador a un título llamativo ─────────────────
async function inventarTitulo(client: OpenAI, borrador: string): Promise<string> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Inventa un único título llamativo para este post. " +
      "Devuelve solo el título, sin comillas.",
    input: borrador,
  });
  return respuesta.output_text;
}

// ── El pipeline completo: paso 1 → paso 2 → paso 3 ─────────────
export async function escribirPost(
  tema: string,
  client: OpenAI = makeClient(),
): Promise<Post> {
  paso("📋", `Paso 1 de 3: generando esquema para «${tema}»`);
  const esquema = await generarEsquema(client, tema);
  esquema.puntos.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));

  paso("✍️", "Paso 2 de 3: escribiendo borrador a partir del esquema");
  const borrador = await escribirBorrador(client, tema, esquema);
  console.log(`   ${borrador.slice(0, 120)}…`);

  paso("💡", "Paso 3 de 3: inventando título a partir del borrador");
  const titulo = await inventarTitulo(client, borrador);
  console.log(`   ${titulo}`);

  return { esquema, borrador, titulo };
}

async function main(): Promise<void> {
  const post = await escribirPost("por qué todo dev debería aprender SQL");
  paso("✅", "Resultado final");
  console.log(`# ${post.titulo}\n\n${post.borrador}`);
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
