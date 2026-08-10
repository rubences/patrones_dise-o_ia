/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 93 — SPECULATIVE EXECUTION (EJECUCIÓN ESPECULATIVA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Solicitud]
 *       │
 *       ├──▶ [Draft rápido/barato] ──listo──▶ Mostrar al usuario YA
 *       │                                          │
 *       └──▶ [Verificación lenta/precisa] ──────────┤ (en paralelo)
 *                                                    ▼
 *                                    ¿Coincide con el draft?
 *                                    ├─ SÍ → sin cambios visibles
 *                                    └─ NO → reemplazar silenciosamente
 *
 *  Idea: en vez de esperar al resultado más lento/preciso antes de
 *  responder, se lanza un draft rápido EN PARALELO con la verificación
 *  y se muestra el draft de inmediato — la latencia PERCIBIDA por el
 *  usuario es la del draft, no la de la verificación. Si la
 *  verificación difiere, se corrige (típicamente de forma discreta,
 *  p.ej. en una UI de streaming).
 *
 *  Diferencia vs Patrón 39 (Cascade): Cascade ejecuta niveles de
 *  forma SECUENCIAL, escalando solo si la confianza del nivel actual
 *  es baja — nunca ejecuta dos niveles en paralelo, y el usuario
 *  espera al nivel que finalmente responde. Speculative Execution
 *  lanza AMBOS en paralelo desde el inicio y el usuario ve el rápido
 *  primero, sin esperar a saber si el lento lo habría hecho mejor.
 *
 *  Ventajas:
 *  - Latencia percibida = la del camino rápido, no la del preciso
 *  - El camino preciso sigue verificando en segundo plano
 *  - Corrección solo cuando realmente hace falta (caso común: coincide)
 *  - Aplicable a: autocompletado, respuestas de chat, sugerencias de código
 */

import { isDirectRun, paso } from "./common.js";

export interface ResultadoSpeculativo<T> {
  resultadoFinal: T;
  fuenteFinal: "draft" | "verificado";
  latenciaPercibidaMs: number;
  latenciaTotalMs: number;
  corregido: boolean;
}

export async function ejecutarSpeculativo<T>(
  draftFn: () => Promise<T>,
  verificarFn: (draft: T) => Promise<T>,
  sonEquivalentes: (a: T, b: T) => boolean,
): Promise<ResultadoSpeculativo<T>> {
  const inicio = Date.now();

  const draft = await draftFn();
  const latenciaPercibidaMs = Date.now() - inicio;
  console.log(`   ⚡ Draft listo en ${latenciaPercibidaMs}ms — se muestra al usuario de inmediato: "${String(draft)}"`);

  const verificado = await verificarFn(draft);
  const latenciaTotalMs = Date.now() - inicio;
  const corregido = !sonEquivalentes(draft, verificado);

  if (corregido) {
    console.log(`   🔁 Verificación (${latenciaTotalMs}ms totales) difiere del draft — se corrige a: "${String(verificado)}"`);
  } else {
    console.log(`   ✅ Verificación (${latenciaTotalMs}ms totales) confirma el draft — sin cambios visibles para el usuario`);
  }

  return {
    resultadoFinal: corregido ? verificado : draft,
    fuenteFinal: corregido ? "verificado" : "draft",
    latenciaPercibidaMs,
    latenciaTotalMs,
    corregido,
  };
}

// ── Draft rápido (modelo pequeño) y verificación lenta (modelo grande) simulados ──
function draftRapido(respuesta: string, latenciaMs: number): () => Promise<string> {
  return async () => {
    await new Promise((r) => setTimeout(r, latenciaMs));
    return respuesta;
  };
}

function verificacionLenta(respuestaVerificada: string, latenciaMs: number): (draft: string) => Promise<string> {
  return async () => {
    await new Promise((r) => setTimeout(r, latenciaMs));
    return respuestaVerificada;
  };
}

export async function demostrarSpeculativeExecution(): Promise<void> {
  paso("⚡", "Demostrando Speculative Execution Pattern");

  paso("1️⃣", "Caso común: el draft rápido coincide con la verificación lenta");
  await ejecutarSpeculativo(
    draftRapido("París", 30),
    verificacionLenta("París", 200),
    (a, b) => a === b,
  );

  paso("2️⃣", "Caso raro: el draft era impreciso, la verificación lo corrige");
  await ejecutarSpeculativo(
    draftRapido("Unos 8 millones de habitantes", 30),
    verificacionLenta("Aproximadamente 2.1 millones en la ciudad, 12 millones en el área metropolitana", 200),
    (a, b) => a === b,
  );

  paso("✅", "Speculative Execution reduciendo la latencia percibida sin sacrificar precisión final");
}

async function main(): Promise<void> {
  await demostrarSpeculativeExecution();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
