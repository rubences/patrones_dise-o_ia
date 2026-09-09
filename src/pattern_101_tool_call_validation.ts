/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 101 — TOOL CALL VALIDATION GATE
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Valida de forma determinista una tool call antes de tocar el backend:
 *  existencia de tool, parámetros requeridos, tipos, argumentos extra y
 *  precondiciones de secuencia. La autorización de identidad corresponde
 *  a una puerta separada (Patrón 72).
 */

import { isDirectRun, paso } from "./common.js";

export type TipoParametro = "string" | "number" | "boolean";

export interface EsquemaParametro {
  nombre: string;
  tipo: TipoParametro;
  requerido: boolean;
}

export interface DefinicionHerramienta {
  nombre: string;
  parametros: EsquemaParametro[];
  debeSeguirA?: string[];
}

export interface LlamadaHerramienta {
  nombre: string;
  argumentos: Record<string, unknown>;
}

export interface ResultadoValidacion {
  llamada: string;
  valida: boolean;
  errores: string[];
}

function tipoDe(valor: unknown): TipoParametro | "desconocido" {
  if (typeof valor === "string") return "string";
  if (typeof valor === "number" && Number.isFinite(valor)) return "number";
  if (typeof valor === "boolean") return "boolean";
  return "desconocido";
}

export class ValidadorLlamadasHerramienta {
  private herramientas = new Map<string, DefinicionHerramienta>();
  private historialEjecutadas: string[] = [];

  constructor(herramientas: DefinicionHerramienta[]) {
    herramientas.forEach((h) => this.herramientas.set(h.nombre, h));
  }

  validar(llamada: LlamadaHerramienta): ResultadoValidacion {
    const errores: string[] = [];
    const herramienta = this.herramientas.get(llamada.nombre);

    if (!herramienta) {
      return { llamada: llamada.nombre, valida: false, errores: ["herramienta no existe en el schema"] };
    }

    const parametrosPermitidos = new Set(herramienta.parametros.map((p) => p.nombre));

    // Fail closed frente a parámetros alucinados o inyectados. Equivale a
    // `additionalProperties: false` para este schema pedagógico.
    for (const nombreArgumento of Object.keys(llamada.argumentos)) {
      if (!parametrosPermitidos.has(nombreArgumento)) {
        errores.push(`parámetro desconocido "${nombreArgumento}"`);
      }
    }

    for (const param of herramienta.parametros) {
      const valor = llamada.argumentos[param.nombre];
      if (param.requerido && valor === undefined) {
        errores.push(`falta parámetro requerido "${param.nombre}" (tipo ${param.tipo})`);
        continue;
      }
      if (valor !== undefined && tipoDe(valor) !== param.tipo) {
        errores.push(`"${param.nombre}" debe ser ${param.tipo}, llegó ${tipoDe(valor)}`);
      }
    }

    if (herramienta.debeSeguirA && herramienta.debeSeguirA.length > 0) {
      const prerequisitoCumplido = herramienta.debeSeguirA.some((req) => this.historialEjecutadas.includes(req));
      if (!prerequisitoCumplido) {
        errores.push(
          `secuencia inválida: requiere haber ejecutado antes una de [${herramienta.debeSeguirA.join(", ")}]`,
        );
      }
    }

    return { llamada: llamada.nombre, valida: errores.length === 0, errores };
  }

  // Solo se registra tras una ejecución REAL confirmada por el backend.
  registrarEjecutada(nombreHerramienta: string): void {
    if (!this.herramientas.has(nombreHerramienta)) {
      throw new Error(`No se puede registrar una herramienta desconocida: ${nombreHerramienta}`);
    }
    this.historialEjecutadas.push(nombreHerramienta);
  }
}

export async function demostrarToolCallValidation(): Promise<void> {
  paso("🚧", "Demostrando Tool Call Validation Gate Pattern");

  const herramientas: DefinicionHerramienta[] = [
    {
      nombre: "volcar_cache",
      parametros: [{ nombre: "servicio", tipo: "string", requerido: true }],
    },
    {
      nombre: "reiniciar_servicio",
      parametros: [
        { nombre: "servicio", tipo: "string", requerido: true },
        { nombre: "confirmar", tipo: "boolean", requerido: true },
      ],
      debeSeguirA: ["volcar_cache"],
    },
  ];

  const validador = new ValidadorLlamadasHerramienta(herramientas);

  const llamadas: LlamadaHerramienta[] = [
    { nombre: "volcar_cache", argumentos: { servicio: "telemetria" } },
    { nombre: "reiniciar_servicio", argumentos: { servicio: "telemetria" } },
    { nombre: "reiniciar_servicio", argumentos: { servicio: "telemetria", confirmar: "sí" } },
    { nombre: "volcar_cache", argumentos: { servicio: "telemetria", force: true } },
  ];

  console.log("\n   Intento 1: validar SIN haber ejecutado nada aún");
  for (const llamada of llamadas) {
    const r = validador.validar(llamada);
    console.log(`   ${r.valida ? "✅" : "🚫"} ${llamada.nombre}(${JSON.stringify(llamada.argumentos)})`);
    if (!r.valida) r.errores.forEach((e) => console.log(`      • ${e}`));
  }

  paso("2️⃣", "Ejecutar volcar_cache de verdad y registrar en el historial");
  validador.registrarEjecutada("volcar_cache");

  const llamadaBienFormada: LlamadaHerramienta = {
    nombre: "reiniciar_servicio",
    argumentos: { servicio: "telemetria", confirmar: true },
  };
  const resultadoFinal = validador.validar(llamadaBienFormada);
  console.log(
    `   ${resultadoFinal.valida ? "✅" : "🚫"} ${llamadaBienFormada.nombre}(${JSON.stringify(llamadaBienFormada.argumentos)}) — ` +
      `ahora ${resultadoFinal.valida ? "pasa" : "sigue fallando"} (prerrequisito ya cumplido)`,
  );

  paso("✅", "Tool Call Validation Gate rechazando argumentos desconocidos, tipos inválidos y secuencias peligrosas");
}

async function main(): Promise<void> {
  await demostrarToolCallValidation();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
