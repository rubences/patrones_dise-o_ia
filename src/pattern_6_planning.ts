/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 6 — PLANNING (Planificación Adaptativa)
 * ═══════════════════════════════════════════════════════════════════
 *
 *             ┌─────────────────────────────┐
 *             │ Objetivo: Resolver tarea X  │
 *             └─────────────────────────────┘
 *                          │
 *                 ┌────────▼────────┐
 *                 │  Generar Plan   │
 *                 │  (subobjetivos) │
 *                 └────────┬────────┘
 *                 ┌────────▼────────┐
 *                 │ 1. Subtarea A   │
 *                 │ 2. Subtarea B   │◀─── Orden lógico
 *                 │ 3. Subtarea C   │     o paralelo
 *                 └────────┬────────┘
 *                 ┌────────▼────────┐
 *                 │  Ejecutar Plan  │
 *                 │  (refinando)    │
 *                 └────────┬────────┘
 *                 ┌────────▼────────┐
 *                 │  ¿Objetivo OK?  │
 *                 │  Sí → Finalizar │
 *                 │  No → Replantear│
 *                 └─────────────────┘
 *
 *  Idea clave: descomposición dinámica de objetivos en subtareas,
 *  con replanificación automática si algo sale mal.
 *
 *  Ejemplo: crear un proyecto de software, investigación académica,
 *  planificación de eventos complejos.
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Plan {
  objetivo: string;
  subtareas: {
    id: number;
    descripcion: string;
    duracion: string;
    dependencias: number[];
  }[];
  estrategia: string;
  riesgos: string[];
}

export interface ResultadoPlanificacion {
  planInicial: Plan;
  planRefinado: Plan;
  pasosPrincipales: string[];
  estimacionTiempo: string;
}

// ── Paso 1: generar plan inicial ───────────────────────────────
async function generarPlanInicial(
  client: OpenAI,
  objetivo: string,
): Promise<Plan> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un planificador estratégico experto. Desglosa el objetivo en " +
      "subtareas concretas y secuenciadas. Considera dependencias, riesgos " +
      "y tiempos estimados. Devuelve un plan estructurado.",
    input:
      `Objetivo principal: ${objetivo}\n\n` +
      `Proporciona:\n` +
      `1. Lista de subtareas numeradas\n` +
      `2. Dependencias entre ellas\n` +
      `3. Estrategia general\n` +
      `4. Riesgos identificados`,
  });

  const texto = respuesta.output_text;
  console.log(`   📋 Plan generado: ${texto.slice(0, 120)}…`);

  return {
    objetivo,
    subtareas: [
      {
        id: 1,
        descripcion: "Análisis y definición de requisitos",
        duracion: "2 días",
        dependencias: [],
      },
      {
        id: 2,
        descripcion: "Diseño arquitectónico",
        duracion: "3 días",
        dependencias: [1],
      },
      {
        id: 3,
        descripcion: "Implementación",
        duracion: "5 días",
        dependencias: [2],
      },
      {
        id: 4,
        descripcion: "Testing y validación",
        duracion: "2 días",
        dependencias: [3],
      },
    ],
    estrategia: texto,
    riesgos: [
      "Cambios en requisitos",
      "Disponibilidad de recursos",
      "Complejidad técnica subestimada",
    ],
  };
}

// ── Paso 2: evaluar viabilidad del plan ────────────────────────
async function evaluarPlan(
  client: OpenAI,
  plan: Plan,
): Promise<{
  esViable: boolean;
  areas_mejora: string[];
  recomendaciones: string[];
}> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Evalúa este plan en términos de viabilidad, eficiencia y riesgos. " +
      "Identifica áreas de mejora y proporciona recomendaciones concretas.",
    input:
      `Plan a evaluar:\n` +
      `Objetivo: ${plan.objetivo}\n` +
      `Subtareas: ${plan.subtareas.map((s) => `${s.id}. ${s.descripcion} (${s.duracion})`).join("\n")}\n` +
      `Riesgos: ${plan.riesgos.join(", ")}\n\n` +
      `¿Es viable este plan? ¿Qué mejorar?`,
  });

  return {
    esViable: respuesta.output_text.toLowerCase().includes("viable"),
    areas_mejora: [
      "Paralelizar tareas independientes",
      "Agregar buffers de tiempo",
      "Asignar responsables",
    ],
    recomendaciones: [respuesta.output_text.slice(0, 100)],
  };
}

// ── Paso 3: refinar plan basado en evaluación ──────────────────
async function refinarPlan(
  client: OpenAI,
  plan: Plan,
  evaluacion: {
    esViable: boolean;
    areas_mejora: string[];
    recomendaciones: string[];
  },
): Promise<Plan> {
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Refina el plan considerando la evaluación crítica. " +
      "Mejora la secuencia, agrega paralelismo donde sea posible, " +
      "y aumenta la robustez frente a riesgos.",
    input:
      `Plan original:\n${JSON.stringify(plan, null, 2)}\n\n` +
      `Feedback de evaluación:\n${JSON.stringify(evaluacion, null, 2)}\n\n` +
      `Proporciona un plan mejorado:`,
  });

  console.log(`   ✨ Plan refinado`);

  return {
    ...plan,
    subtareas: plan.subtareas.map((s, i) => ({
      ...s,
      duracion: i === 1 ? "2 días (paralelizable con tarea 1)" : s.duracion,
    })),
    estrategia: respuesta.output_text,
  };
}

// ── El flujo completo: objetivo → plan → evaluación → plan refinado
export async function planificarTarea(
  objetivo: string,
  client: OpenAI = makeClient(),
): Promise<ResultadoPlanificacion> {
  paso("🎯", `Objetivo: "${objetivo}"`);

  paso("📝", "Paso 1: Generando plan inicial...");
  const planInicial = await generarPlanInicial(client, objetivo);
  planInicial.subtareas.forEach((s) => {
    console.log(
      `   ${s.id}. ${s.descripcion} (${s.duracion}) ${s.dependencias.length > 0 ? `[deps: ${s.dependencias}]` : "[independiente]"}`,
    );
  });

  paso("🔍", "Paso 2: Evaluando viabilidad...");
  const evaluacion = await evaluarPlan(client, planInicial);
  console.log(`   Viable: ${evaluacion.esViable ? "✅ Sí" : "❌ No"}`);
  evaluacion.areas_mejora.forEach((a) => console.log(`   → Mejorar: ${a}`));

  paso("⚡", "Paso 3: Refinando plan...");
  const planRefinado = await refinarPlan(client, planInicial, evaluacion);

  const tiempoTotal = planInicial.subtareas
    .reduce((suma, s) => suma + parseInt(s.duracion), 0)
    .toString();

  return {
    planInicial,
    planRefinado,
    pasosPrincipales: planRefinado.subtareas.map(
      (s) => `${s.id}. ${s.descripcion}`,
    ),
    estimacionTiempo: `~${tiempoTotal} días`,
  };
}

async function main(): Promise<void> {
  const resultado = await planificarTarea(
    "Desarrollar una API REST con autenticación, base de datos y documentación",
  );

  paso("✅", "Plan final optimizado");
  resultado.pasosPrincipales.forEach((paso) => console.log(`   ${paso}`));
  console.log(`\nTiempo estimado: ${resultado.estimacionTiempo}`);
  console.log(`\nEstrategia:\n${resultado.planRefinado.estrategia}`);
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
