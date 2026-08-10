/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 5 — TOOL USE (Uso de Herramientas)
 * ═══════════════════════════════════════════════════════════════════
 *
 *   pregunta ──▶ [LLM] ──▶ {¿necesita herramienta?} 
 *                    │          │
 *                    └──► [Sí] ─┴─▶ [invocar API/herramienta]
 *                         [No]     │
 *                                  ├─▶ [procesar resultado]
 *                                  │
 *                    ┌─────────────┘
 *                    ▼
 *              [respuesta final]
 *
 *  Idea clave: el modelo decide dinámicamente si necesita acceder a
 *  herramientas externas (APIs, búsqueda, bases de datos) para
 *  enriquecer su respuesta con información en tiempo real.
 *
 *  Ejemplo: responder preguntas usando búsqueda web, acceso a APIs,
 *  ejecución de scripts, recuperación de datos específicos.
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// Definir las herramientas disponibles para el modelo
export const HERRAMIENTAS = {
  buscar_web: {
    nombre: "buscar_web",
    descripcion:
      "Busca información en internet en tiempo real. Útil para hechos actuales, noticias, precios.",
    parametros: {
      consulta: "string - Qué buscar",
    },
  },
  acceder_api: {
    nombre: "acceder_api",
    descripcion:
      "Accede a una API externa para obtener datos estructurados (clima, tipo de cambio, etc.)",
    parametros: {
      endpoint: "string - URL de la API",
      parametros: "object - Parámetros de consulta",
    },
  },
  recuperar_bd: {
    nombre: "recuperar_bd",
    descripcion: "Recupera datos de una base de datos interna",
    parametros: {
      tabla: "string - Nombre de la tabla",
      filtro: "string - Condición SQL",
    },
  },
  ejecutar_script: {
    nombre: "ejecutar_script",
    descripcion:
      "Ejecuta un script de análisis de datos o cálculos complejos",
    parametros: {
      tipo: "string - Lenguaje (python, sql, bash)",
      codigo: "string - Código a ejecutar",
    },
  },
} as const;

export interface ResultadoToolUse {
  pregunta: string;
  herramientasUsadas: string[];
  respuestaFinal: string;
  razonamientoInterno: string;
}

// ── Simular la invocación de una herramienta ────────────────────
async function invocarHerramienta(
  nombre: string,
  parametros: Record<string, unknown>,
): Promise<string> {
  // En producción, aquí se llamaría a APIs reales
  console.log(
    `   🔧 Invocando ${nombre} con parámetros: ${JSON.stringify(parametros)}`,
  );

  const respuestas: Record<string, string> = {
    buscar_web: "Resultado de búsqueda en tiempo real...",
    acceder_api: "Datos de API: temperatura 22°C, humedad 65%...",
    recuperar_bd: "Registro encontrado en base de datos...",
    ejecutar_script: "Script ejecutado. Resultado: análisis completado...",
  };

  return respuestas[nombre] || "Herramienta no reconocida";
}

// ── El flujo completo: pregunta → decisión → herramientas → respuesta
export async function responderConHerramientas(
  pregunta: string,
  client: OpenAI = makeClient(),
): Promise<ResultadoToolUse> {
  paso("🛠️", "Paso 1: Analizando si se necesitan herramientas externas...");

  // Primera llamada: el modelo decide qué herramientas usar
  const herramientasUsadas: string[] = [];
  let respuestaFinal = "";
  let razonamientoInterno = "";

  // Simulamos el proceso de tool-use
  const respuesta = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Eres un asistente que puede usar herramientas externas. " +
      "Si la pregunta requiere información en tiempo real o datos específicos, " +
      "decide qué herramientas necesitas. " +
      "Responde con: 1) Tu razonamiento, 2) Herramientas a usar, 3) Respuesta final.",
    input: `Pregunta: ${pregunta}`,
  });

  razonamientoInterno = respuesta.output_text;
  console.log(`   📋 Razonamiento: ${razonamientoInterno.slice(0, 80)}…`);

  // Simular que se invocan herramientas basadas en la respuesta
  if (razonamientoInterno.toLowerCase().includes("buscar")) {
    herramientasUsadas.push("buscar_web");
    paso("🔍", "Paso 2: Ejecutando búsqueda web...");
    const resultadoBusqueda = await invocarHerramienta("buscar_web", {
      consulta: pregunta,
    });
    console.log(`   ✔ Búsqueda completada`);

    // Segunda llamada: procesar resultado de herramienta
    const respuestaFinal2 = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions:
        "Integra los datos obtenidos de herramientas externas en una respuesta clara y útil.",
      input:
        `Pregunta original: ${pregunta}\n\n` +
        `Datos obtenidos de herramientas:\n${resultadoBusqueda}\n\n` +
        `Proporciona una respuesta final integrada:`,
    });

    respuestaFinal = respuestaFinal2.output_text;
  } else {
    respuestaFinal = razonamientoInterno;
  }

  paso("✅", `Herramientas usadas: ${herramientasUsadas.join(", ") || "ninguna"}`);

  return {
    pregunta,
    herramientasUsadas,
    respuestaFinal,
    razonamientoInterno,
  };
}

async function main(): Promise<void> {
  const resultado = await responderConHerramientas(
    "¿Cuál es el precio actual del Bitcoin en USD?",
  );
  paso("💬", "Respuesta final con datos en tiempo real");
  console.log(resultado.respuestaFinal);
  if (resultado.herramientasUsadas.length > 0) {
    console.log(`\nHerramientas utilizadas: ${resultado.herramientasUsadas.join(", ")}`);
  }
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
