/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 93 — SPECULATIVE EXECUTION (EJECUCIÓN ESPECULATIVA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Solicitud]
 *       ├──▶ [Draft rápido] ───────────────▶ mostrar provisionalmente
 *       └──▶ [Camino verificado] ─────────▶ confirmar/corregir
 *
 *  Ambos caminos se inician en paralelo desde t0. La latencia percibida
 *  es la del draft; la salida final se decide cuando concluye la ruta
 *  verificada.
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
  verificadoFn: () => Promise<T>,
  sonEquivalentes: (a: T, b: T) => boolean,
  onDraft?: (draft: T) => void,
): Promise<ResultadoSpeculativo<T>> {
  const inicio = Date.now();

  // Lanzar ambos caminos ANTES de esperar a cualquiera de ellos.
  const draftPromise = draftFn();
  const verificadoPromise = verificadoFn().then(
    (valor) => ({ ok: true as const, valor }),
    (error: unknown) => ({ ok: false as const, error }),
  );

  const draft = await draftPromise;
  const latenciaPercibidaMs = Date.now() - inicio;
  onDraft?.(draft);
  console.log(`   ⚡ Draft listo en ${latenciaPercibidaMs}ms — salida provisional: "${String(draft)}"`);

  const resultadoVerificacion = await verificadoPromise;
  const latenciaTotalMs = Date.now() - inicio;
  if (!resultadoVerificacion.ok) {
    throw resultadoVerificacion.error;
  }

  const verificado = resultadoVerificacion.valor;
  const corregido = !sonEquivalentes(draft, verificado);

  if (corregido) {
    console.log(`   🔁 Camino verificado (${latenciaTotalMs}ms totales) corrige el draft a: "${String(verificado)}"`);
  } else {
    console.log(`   ✅ Camino verificado (${latenciaTotalMs}ms totales) confirma el draft`);
  }

  return {
    resultadoFinal: corregido ? verificado : draft,
    fuenteFinal: corregido ? "verificado" : "draft",
    latenciaPercibidaMs,
    latenciaTotalMs,
    corregido,
  };
}

function draftRapido(respuesta: string, latenciaMs: number): () => Promise<string> {
  return async () => {
    await new Promise((r) => setTimeout(r, latenciaMs));
    return respuesta;
  };
}

function caminoVerificado(respuesta: string, latenciaMs: number): () => Promise<string> {
  return async () => {
    await new Promise((r) => setTimeout(r, latenciaMs));
    return respuesta;
  };
}

export async function demostrarSpeculativeExecution(): Promise<void> {
  paso("⚡", "Demostrando Speculative Execution Pattern");

  paso("1️⃣", "Draft y verificación arrancan en paralelo y coinciden");
  await ejecutarSpeculativo(
    draftRapido("París", 30),
    caminoVerificado("París", 200),
    (a, b) => a === b,
  );

  paso("2️⃣", "El draft provisional se corrige cuando difiere el camino preciso");
  await ejecutarSpeculativo(
    draftRapido("Unos 8 millones de habitantes", 30),
    caminoVerificado("Aproximadamente 2.1 millones en la ciudad, 12 millones en el área metropolitana", 200),
    (a, b) => a === b,
  );

  paso("✅", "Speculative Execution ejecutando realmente ambos caminos desde t0");
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
