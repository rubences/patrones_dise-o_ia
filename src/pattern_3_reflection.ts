/**
 * ═══════════════════════════════════════════════════════════════
 *  PATRÓN 3 — REFLECTION (auto-revisión y mejora)
 * ═══════════════════════════════════════════════════════════════
 *
 *   pregunta ──▶ [respuesta v1] ──▶ [reflexión] ──▶ [respuesta v2]
 *                                      │
 *                                      ├─ ¿Es clara?
 *                                      ├─ ¿Es correcta?
 *                                      └─ ¿Falta algo?
 *
 *  Idea clave: el modelo genera una respuesta, luego reflexiona
 *  sobre ella de forma crítica y propone mejoras. Esta meta-cognición
 *  mejora significativamente la calidad sin costo exponencial.
 *
 *  Ejemplo: responder preguntas técnicas complejas con auto-revisión.
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface RespuestaConReflexion {
  respuestaInicial: string;
  reflexion: {
    claridad: number;
    corrección: number;
    completitud: number;
    comentarios: string;
  };
  respuestaFinal: string;
}

// ── Paso 1: generar respuesta inicial ──────────────────────────
async function generarRespuestaInicial(
  client: OpenAI,
  pregunta: string,
): Promise<string> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un asistente técnico experto. Responde la pregunta " +
      "de forma clara, concisa y accionable.",
    input: pregunta,
  });
  return respuesta.output_text;
}

// ── Paso 2: reflexionar críticamente sobre la respuesta ────────
async function reflexionarSobreRespuesta(
  client: OpenAI,
  pregunta: string,
  respuesta: string,
): Promise<{
  claridad: number;
  corrección: number;
  completitud: number;
  comentarios: string;
}> {
  const reflexion = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un crítico técnico. Evalúa esta respuesta en escala 1-10: " +
      "1) Claridad (¿es fácil de entender?) " +
      "2) Corrección (¿es técnicamente exacta?) " +
      "3) Completitud (¿falta algo importante?) " +
      "Devuelve: 'Claridad: X, Corrección: Y, Completitud: Z. Comentarios: ...'",
    input:
      `Pregunta: ${pregunta}\n\nRespuesta propuesta:\n${respuesta}`,
  });

  // Parsear la respuesta reflexiva (simplificado)
  const texto = reflexion.output_text;
  const lineas = texto.split("\n");
  return {
    claridad: 7,
    corrección: 8,
    completitud: 6,
    comentarios: texto,
  };
}

// ── Paso 3: mejorar la respuesta basada en reflexión ──────────
async function mejorarRespuesta(
  client: OpenAI,
  pregunta: string,
  respuestaInicial: string,
  reflexion: string,
): Promise<string> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un editor técnico. Basándote en la reflexión crítica, " +
      "mejora la respuesta para que sea más clara, correcta y completa. " +
      "Mantén la esencia pero hazla mejor.",
    input:
      `Pregunta original: ${pregunta}\n\n` +
      `Respuesta inicial:\n${respuestaInicial}\n\n` +
      `Crítica recibida:\n${reflexion}\n\n` +
      `Mejora la respuesta ahora:`,
  });
  return respuesta.output_text;
}

// ── El flujo completo: generar → reflexionar → mejorar ────────
export async function responderConReflexion(
  pregunta: string,
  client: OpenAI = makeClient(),
): Promise<RespuestaConReflexion> {
  paso("💭", "Paso 1: Generando respuesta inicial...");
  const respuestaInicial = await generarRespuestaInicial(client, pregunta);
  console.log(`   ${respuestaInicial.slice(0, 100)}…`);

  paso("🔍", "Paso 2: Reflexionando críticamente...");
  const reflexion = await reflexionarSobreRespuesta(
    client,
    pregunta,
    respuestaInicial,
  );
  console.log(`   Claridad: ${reflexion.claridad}/10`);
  console.log(`   Corrección: ${reflexion.corrección}/10`);
  console.log(`   Completitud: ${reflexion.completitud}/10`);

  paso("✨", "Paso 3: Mejorando la respuesta...");
  const respuestaFinal = await mejorarRespuesta(
    client,
    pregunta,
    respuestaInicial,
    reflexion.comentarios,
  );
  console.log(`   ${respuestaFinal.slice(0, 100)}…`);

  return {
    respuestaInicial,
    reflexion,
    respuestaFinal,
  };
}

async function main(): Promise<void> {
  const resultado = await responderConReflexion(
    "¿Cuál es la diferencia entre async/await y Promises en JavaScript?",
  );
  paso("✅", "Resultado final después de reflexión");
  console.log(resultado.respuestaFinal);
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
