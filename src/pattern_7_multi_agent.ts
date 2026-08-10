/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 7 — MULTI-AGENT (Orquestación Multiagente)
 * ═══════════════════════════════════════════════════════════════════
 *
 *                  ┌──── Agente Investigador ────┐
 *                  │ (recopila información)      │
 *                  └──────────────┬───────────────┘
 *                                 │
 *   Tarea ──▶ ┌──────────────────┼────────────────────┐
 *             │                  │                    │
 *      ┌──────▼────────┐  ┌──────▼────────┐  ┌──────▼────────┐
 *      │  Agente Dev   │  │ Agente Review │  │ Agente Docs   │
 *      │  (código)     │  │  (pruebas)    │  │ (documentación)
 *      └──────┬────────┘  └──────┬────────┘  └──────┬────────┘
 *             │                  │                    │
 *             └──────────────────┼────────────────────┘
 *                                │
 *                    ┌───────────▼────────────┐
 *                    │ Agente Orquestador     │
 *                    │ (coordina y sintetiza) │
 *                    └───────────┬────────────┘
 *                                │
 *                            Resultado
 *
 *  Idea clave: múltiples agentes especializados trabajan colaborativamente,
 *  cada uno con su dominio, coordinados por un orquestador central.
 *
 *  Ejemplo: desarrollo de software en equipo (dev, QA, docs), análisis
 *  multidisciplinario (técnico, financiero, legal), creación de contenido
 *  (redactor, diseñador, editor).
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// Definir roles especializados
export const ROLES_AGENTES = {
  investigador:
    "Eres un investigador experto. Recopila información, identifica " +
    "patrones, y proporciona contexto. Sé exhaustivo pero conciso.",
  desarrollador:
    "Eres un ingeniero senior. Diseña soluciones técnicas, propones " +
    "arquitecturas, evalúa viabilidad. Sé práctico y pragmático.",
  revisor:
    "Eres un QA riguroso. Identifica debilidades, riesgos, casos edge. " +
    "Sé crítico constructivo y proporciona soluciones.",
  documentador:
    "Eres un escritor técnico. Explica conceptos complejos claramente, " +
    "documentas procesos. Sé didáctico y accesible.",
} as const;

export type RolAgente = keyof typeof ROLES_AGENTES;

export interface ContribucionAgente {
  rol: RolAgente;
  analisis: string;
  recomendaciones: string[];
  confianza: number;
}

export interface ResultadoMultiAgent {
  tarea: string;
  contribuciones: ContribucionAgente[];
  sintesis_orquestador: string;
  consenso: string;
}

// ── Agente especializado procesa la tarea desde su perspectiva ──
async function procesarConAgente(
  client: OpenAI,
  rol: RolAgente,
  tarea: string,
  contextoOtrosAgentes?: string,
): Promise<ContribucionAgente> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions: ROLES_AGENTES[rol],
    input:
      `Tarea: ${tarea}\n` +
      (contextoOtrosAgentes ? `\nContexto de otros agentes:\n${contextoOtrosAgentes}\n` : "") +
      `\nProporciona tu análisis y recomendaciones desde tu perspectiva. Sé conciso.`,
  });

  const texto = respuesta.output_text;
  const confianza = Math.random() * 0.4 + 0.6; // 0.6 - 1.0

  return {
    rol,
    analisis: texto,
    recomendaciones: [texto.split(".").slice(0, 2).join(".")],
    confianza: Math.round(confianza * 100) / 100,
  };
}

// ── Orquestador recopila contribuciones y sintetiza ───────────
async function sintetizarContribuciones(
  client: OpenAI,
  tarea: string,
  contribuciones: ContribucionAgente[],
): Promise<string> {
  const contexto = contribuciones
    .map((c) => `[${c.rol.toUpperCase()}]\n${c.analisis}\nConfianza: ${c.confianza}`)
    .join("\n\n");

  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres el orquestador de un equipo multidisciplinario. Tu rol es " +
      "integrar perspectivas diversas en una conclusión coherente y accionable. " +
      "Destaca consensos, desacuerdos y próximos pasos.",
    input:
      `Tarea original: ${tarea}\n\n` +
      `Análisis de agentes especializados:\n${contexto}\n\n` +
      `Sintetiza estos aportes en una recomendación unificada:`,
  });

  return respuesta.output_text;
}

// ── El flujo completo: tarea → agentes en paralelo → síntesis
export async function procesarMultiAgent(
  tarea: string,
  client: OpenAI = makeClient(),
): Promise<ResultadoMultiAgent> {
  paso("🤝", "Activando equipo multidisciplinario...");

  // Lanzar todos los agentes en paralelo (Promise.all)
  paso("⚡", "Paso 1: Procesando con agentes especializados (en paralelo)...");

  const agentesActivos = Object.keys(ROLES_AGENTES) as RolAgente[];
  const contribuciones = await Promise.all(
    agentesActivos.map((rol) => procesarConAgente(client, rol, tarea)),
  );

  // Mostrar contribuciones
  contribuciones.forEach((c) => {
    console.log(`   ✔ ${c.rol}: confianza ${(c.confianza * 100).toFixed(0)}%`);
  });

  // Orquestador sintetiza
  paso("🧠", "Paso 2: Orquestador sintetizando perspectivas...");
  const sintesis = await sintetizarContribuciones(client, tarea, contribuciones);
  console.log(`   ${sintesis.slice(0, 100)}…`);

  // Detectar consenso
  const confianzaPromedio =
    contribuciones.reduce((sum, c) => sum + c.confianza, 0) /
    contribuciones.length;
  const consenso =
    confianzaPromedio > 0.8
      ? "✅ Alto consenso entre agentes"
      : confianzaPromedio > 0.6
        ? "⚠️ Consenso moderado (revisar desacuerdos)"
        : "❌ Bajo consenso (se requiere más análisis)";

  return {
    tarea,
    contribuciones,
    sintesis_orquestador: sintesis,
    consenso,
  };
}

async function main(): Promise<void> {
  const resultado = await procesarMultiAgent(
    "¿Deberíamos migrar nuestro monolito a microservicios?",
  );

  paso("✅", "Análisis multiagente completado");
  console.log(`\n${resultado.consenso}`);
  console.log(`\nRecomendación sintetizada:\n${resultado.sintesis_orquestador}`);
  console.log("\nDetalle de contribuciones:");
  resultado.contribuciones.forEach((c) => {
    console.log(`\n  🤖 ${c.rol} (confianza: ${(c.confianza * 100).toFixed(0)}%)`);
    console.log(`     ${c.recomendaciones[0]}`);
  });
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
