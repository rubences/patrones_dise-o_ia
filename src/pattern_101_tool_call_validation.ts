/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 101 — TOOL CALL VALIDATION GATE (VALIDACIÓN DE LLAMADAS A HERRAMIENTAS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [LLM decide invocar: reiniciar_servicio({ confirmar: "sí" })]
 *       │
 *       ▼
 *  [Puerta de Validación]
 *  ├─ ¿Existen todos los parámetros REQUERIDOS por el schema? ────┐
 *  ├─ ¿El tipo de cada parámetro coincide con el schema?          ├─ alucinación de parámetros
 *  └─ ¿Ya se ejecutó el prerrequisito de secuencia?  ─────────────┘  fallo de secuenciación
 *       │
 *       ▼
 *  [Ejecutar contra el backend real] / [Rechazar con motivo explícito]
 *
 *  Idea: un LLM en un bucle ReAct puede inventar un parámetro que no
 *  existe en el schema de la función, omitir uno requerido, o pedir
 *  ejecutar una acción en el orden equivocado (reiniciar un servicio
 *  ANTES de volcar su caché a disco). Ninguno de estos fallos es un
 *  ataque — es alucinación operativa — pero el efecto en producción
 *  es el mismo: una llamada que no debería ejecutarse tal cual llega
 *  al backend real. Esta puerta valida forma (schema) y orden
 *  (secuencia) ANTES de despachar, sin necesidad de que el LLM
 *  "razone mejor" la próxima vez.
 *
 *  Diferencia vs Patrón 83 (Dynamic Tool Discovery): 83 construye el
 *  schema de function-calling en runtime descubriendo qué herramientas
 *  existen. Este patrón usa ese schema (ya construido, por descubrimiento
 *  o declarado a mano) para VALIDAR que una llamada concreta lo cumple
 *  antes de ejecutarla — son etapas distintas: descubrir el contrato,
 *  luego hacerlo cumplir.
 *
 *  Diferencia vs Patrón 72 (Access Control for Agents): 72 decide SI
 *  el rol del agente tiene permiso para invocar esa herramienta o
 *  recurso en absoluto (RBAC/ABAC). Este patrón asume que sí tiene
 *  permiso y valida que LA LLAMADA CONCRETA (sus argumentos y su
 *  posición en la secuencia) está bien formada — ambas puertas se
 *  aplican en cadena, una tras otra, antes de tocar el backend real:
 *  primero autorización de identidad (72), luego validez de la llamada (101).
 *
 *  Ventajas:
 *  - Detecta alucinación de parámetros antes de que rompa el backend
 *  - Previene secuencias peligrosas (reiniciar antes de volcar caché)
 *  - Mensaje de rechazo explícito que el agente puede usar para reintentar bien
 *  - No requiere una segunda llamada al LLM: validación determinista y barata
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
  // Esta herramienta solo es válida si al menos una de estas ya se ejecutó antes
  // en la misma sesión (prerrequisito de secuencia).
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
  if (typeof valor === "number") return "number";
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

    // 1. Validación de forma: parámetros requeridos presentes y con el tipo correcto
    //    (alucinación de parámetros: el LLM inventó un nombre o un tipo que no coincide).
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

    // 2. Validación de secuencia: el prerrequisito ya se ejecutó en esta sesión.
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

  // Se llama solo tras una ejecución REAL contra el backend, no tras la validación.
  registrarEjecutada(nombreHerramienta: string): void {
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
    { nombre: "volcar_cache", argumentos: { servicio: "telemetria" } }, // válida: forma correcta
    { nombre: "reiniciar_servicio", argumentos: { servicio: "telemetria" } }, // inválida: falta "confirmar" (alucinación de parámetro)
    { nombre: "reiniciar_servicio", argumentos: { servicio: "telemetria", confirmar: "sí" } }, // inválida: "confirmar" debe ser boolean, no string
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

  paso("✅", "Tool Call Validation Gate deteniendo alucinación de parámetros y secuencias peligrosas antes del backend real");
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
