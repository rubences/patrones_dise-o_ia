/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 8 — HUMAN-IN-THE-LOOP (HITL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *   Tarea
 *     │
 *     ▼
 *   [IA procesa]
 *     │
 *     ▼
 * ┌──────────────────────────────┐
 * │ ¿Requiere aprobación humana? │
 *  └──────────────────────────────┘
 *     │                    │
 *  Sí │                    │ No
 *     │                    │
 *     ▼                    ▼
 * [Espera humano]      [Ejecuta]
 *     │                    │
 *     ▼                    ▼
 * ┌──────────────────┐ [Resultado]
 * │ Humano revisa    │
 * │ - Aprueba        │
 * │ - Rechaza        │
 * │ - Solicita cambios
 * └────┬─────────────┘
 *      │
 *      ├─▶ Aprobado ──▶ [Ejecuta acción]
 *      │
 *      ├─▶ Rechazado ──▶ [Escala o reinicia]
 *      │
 *      └─▶ Cambios ──▶ [IA refina]
 *
 *  Idea clave: combinar autonomía de IA con supervisión humana
 *  en puntos críticos, para garantizar precisión y seguridad.
 *
 *  Ejemplo: aprobación de transacciones financieras, eliminación de datos,
 *  cambios de configuración, decisiones médicas, aprobaciones legales.
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type NivelRiesgo = "bajo" | "medio" | "alto" | "crítico";
export type DecisionHumana = "aprobado" | "rechazado" | "solicita_cambios";

export interface ProcesoHITL {
  tarea: string;
  proposalIa: string;
  riesgoEstimado: NivelRiesgo;
  requiereAprobacion: boolean;
  decisionHumana?: DecisionHumana;
  comentariosHumano?: string;
  resultadoFinal?: string;
}

// ── IA genera propuesta inicial ────────────────────────────────
async function generarProposal(
  client: OpenAI,
  tarea: string,
): Promise<{
  proposal: string;
  riesgo: NivelRiesgo;
}> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un asistente de alto valor. Genera una propuesta clara, " +
      "detallada y accionable. Sé específico. Al final, evalúa el nivel de riesgo.",
    input:
      `Tarea: ${tarea}\n\n` +
      `Proporciona:\n` +
      `1. Propuesta de acción detallada\n` +
      `2. Evaluación de riesgo (bajo/medio/alto/crítico)\n` +
      `3. Impacto potencial`,
  });

  const texto = respuesta.output_text;

  // Detectar nivel de riesgo mencionado
  let riesgo: NivelRiesgo = "bajo";
  if (texto.toLowerCase().includes("crítico"))
    riesgo = "crítico";
  else if (texto.toLowerCase().includes("alto")) riesgo = "alto";
  else if (texto.toLowerCase().includes("medio")) riesgo = "medio";

  return {
    proposal: texto,
    riesgo,
  };
}

// ── Determinar si requiere aprobación humana ───────────────────
function requiereAprobacionHumana(riesgo: NivelRiesgo): boolean {
  const niveles: Record<NivelRiesgo, boolean> = {
    bajo: false,
    medio: true,
    alto: true,
    crítico: true,
  };
  return niveles[riesgo];
}

// ── Simular aprobación/rechazo humano ──────────────────────────
async function obtenerAprobacionHumana(
  proposal: string,
  riesgo: NivelRiesgo,
): Promise<{
  decision: DecisionHumana;
  comentarios: string;
}> {
  // En producción, esto sería input real del usuario
  console.log(`\n   📋 PROPUESTA PENDIENTE DE REVISIÓN (Riesgo: ${riesgo})`);
  console.log(`   ${proposal.slice(0, 150)}…\n`);

  // Simular decisión humana
  const decisiones: DecisionHumana[] = [
    "aprobado",
    "rechazado",
    "solicita_cambios",
  ];
  const decision = decisiones[Math.floor(Math.random() * decisiones.length)];

  const comentarios: Record<DecisionHumana, string> = {
    aprobado: "✅ Aprobado. Proceder con implementación.",
    rechazado: "❌ Rechazado. Los riesgos superan los beneficios.",
    solicita_cambios:
      "⚠️ Requiere ajustes. Por favor, mitiga los riesgos identificados.",
  };

  console.log(`   👤 Decisión humana: ${comentarios[decision]}`);

  return {
    decision,
    comentarios: comentarios[decision],
  };
}

// ── Refinar propuesta según feedback humano ────────────────────
async function refinarProposal(
  client: OpenAI,
  proposalOriginal: string,
  feedbackHumano: string,
): Promise<string> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Refina la propuesta basándote en el feedback humano. " +
      "Mantén lo bueno, mitiga riesgos, y mejora.",
    input:
      `Propuesta original:\n${proposalOriginal}\n\n` +
      `Feedback del revisor:\n${feedbackHumano}\n\n` +
      `Proporciona la propuesta mejorada:`,
  });

  return respuesta.output_text;
}

// ── El flujo completo HITL: tarea → propuesta → aprobación → ejecución
export async function procesarConAprobacionHumana(
  tarea: string,
  client: OpenAI = makeClient(),
): Promise<ProcesoHITL> {
  paso("🤖", "Generando propuesta de IA...");
  const { proposal, riesgo } = await generarProposal(client, tarea);
  console.log(`   Riesgo estimado: ${riesgo.toUpperCase()}`);
  console.log(`   ${proposal.slice(0, 80)}…`);

  const requiereAprobacion = requiereAprobacionHumana(riesgo);
  console.log(
    `   Requiere aprobación: ${requiereAprobacion ? "SÍ ⚠️" : "NO ✅"}`,
  );

  let procesoDenominado = "En espera de aprobación";
  let decisionHumana: DecisionHumana | undefined;
  let comentariosHumano: string | undefined;
  let resultadoFinal: string | undefined;

  if (requiereAprobacion) {
    paso("👤", "Paso 2: Solicitud de aprobación humana...");
    const { decision, comentarios } = await obtenerAprobacionHumana(
      proposal,
      riesgo,
    );
    decisionHumana = decision;
    comentariosHumano = comentarios;

    if (decision === "aprobado") {
      paso("✅", "Propuesta aprobada. Ejecutando...");
      resultadoFinal = `Acción completada: ${proposal.slice(0, 100)}`;
      procesoDenominado = "Completado";
    } else if (decision === "rechazado") {
      paso("❌", "Propuesta rechazada. Escalando a supervisor...");
      resultadoFinal = "Caso escalado a supervisor humano";
      procesoDenominado = "Rechazado";
    } else {
      paso("🔄", "Refinando propuesta según feedback...");
      const proposalMejorada = await refinarProposal(
        client,
        proposal,
        comentarios,
      );
      console.log(`   Propuesta mejorada: ${proposalMejorada.slice(0, 80)}…`);
      resultadoFinal = proposalMejorada;
      procesoDenominado = "Refinado y ejecutado";
    }
  } else {
    paso("⚡", "Riesgo bajo: ejecutando automáticamente...");
    resultadoFinal = `Ejecutado automáticamente: ${proposal.slice(0, 100)}`;
    procesoDenominado = "Completado (automático)";
  }

  paso("✅", procesoDenominado);

  return {
    tarea,
    proposalIa: proposal,
    riesgoEstimado: riesgo,
    requiereAprobacion,
    decisionHumana,
    comentariosHumano,
    resultadoFinal,
  };
}

async function main(): Promise<void> {
  const resultado = await procesarConAprobacionHumana(
    "Autorizar transferencia de $50,000 a cuenta proveedora",
  );

  paso("📊", "Resumen del proceso HITL");
  console.log(`
  Tarea: ${resultado.tarea}
  Riesgo: ${resultado.riesgoEstimado.toUpperCase()}
  Requería aprobación: ${resultado.requiereAprobacion ? "Sí" : "No"}
  ${resultado.decisionHumana ? `Decisión: ${resultado.decisionHumana}` : ""}
  
  Resultado final:
  ${resultado.resultadoFinal}
  `);
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
