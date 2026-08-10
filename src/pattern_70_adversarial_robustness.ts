/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 70 — ADVERSARIAL ROBUSTNESS (ROBUSTEZ ADVERSARIAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente en prueba]
 *       │
 *       ▼
 *  [Generador Adversarial]
 *  ├─ Entradas perturbadas (typos, reformulaciones)
 *  ├─ Casos límite (vacío, muy largo, caracteres especiales)
 *  ├─ Entradas engañosas (negaciones, ambigüedades)
 *  └─ Ataques de evasión (frases ambiguas)
 *
 *       │
 *       ▼
 *  [Evaluador de Robustez]
 *  ├─ ¿Respuesta consistente bajo perturbaciones?
 *  ├─ ¿Resistente a casos límite?
 *  └─ Score de robustez 0-100
 *
 *  Ventajas:
 *  - Identifica debilidades antes de producción
 *  - Mejora fiabilidad en condiciones reales
 *  - Auditoría de seguridad automatizada
 *  - Score cuantificable de robustez
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type TipoPerturbacion =
  | "typos"
  | "reformulacion"
  | "negacion"
  | "caso_limite"
  | "caracteres_especiales"
  | "longitud_extrema";

export interface CasoAdversarial {
  entrada: string;
  tipo: TipoPerturbacion;
  descripcion: string;
}

export interface ResultadoRobustez {
  agente: string;
  casosProbados: number;
  casosEstables: number;
  scoreFinal: number;
  vulnerabilidades: { tipo: TipoPerturbacion; descripcion: string }[];
}

export class GeneradorAdversarial {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  generarCasos(entradaBase: string): CasoAdversarial[] {
    return [
      // Typos
      {
        entrada: entradaBase.replace(/[aeiou]/i, (c) => c + c),
        tipo: "typos",
        descripcion: "Typos por duplicación de vocales",
      },
      // Reformulación
      {
        entrada: `En otras palabras, ${entradaBase.toLowerCase()}`,
        tipo: "reformulacion",
        descripcion: "Reformulación con prefijo",
      },
      // Negación
      {
        entrada: `¿Es incorrecto decir que ${entradaBase.toLowerCase()}?`,
        tipo: "negacion",
        descripcion: "Pregunta con negación implícita",
      },
      // Caso límite vacío
      {
        entrada: "",
        tipo: "caso_limite",
        descripcion: "Entrada vacía",
      },
      // Caracteres especiales
      {
        entrada: `${entradaBase} 🤖 <script>alert(1)</script> \x00 ñ`,
        tipo: "caracteres_especiales",
        descripcion: "Inyección de caracteres especiales y HTML",
      },
      // Longitud extrema
      {
        entrada: entradaBase.repeat(50).slice(0, 500),
        tipo: "longitud_extrema",
        descripcion: "Entrada muy larga (repetida)",
      },
    ];
  }

  async generarAdversarialesConLLM(entradaBase: string): Promise<CasoAdversarial[]> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Genera 3 variaciones adversariales de esta entrada para probar la robustez de un agente:
"${entradaBase}"

Las variaciones deben ser: ambiguas, engañosas, o con información contradictoria.
Formato: VARIACION: [texto] | TIPO: [descripción del desafío]`,
      input: "",
    });

    return resp.output_text.split("\n")
      .filter((l) => l.includes("VARIACION:"))
      .map((l) => {
        const partes = l.split("|");
        return {
          entrada: partes[0].replace("VARIACION:", "").trim(),
          tipo: "reformulacion" as TipoPerturbacion,
          descripcion: partes[1]?.replace("TIPO:", "").trim() ?? "Adversarial generado",
        };
      });
  }
}

export class EvaluadorRobustez {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async evaluarPar(respuestaBase: string, respuestaAdversarial: string): Promise<{
    estable: boolean;
    similitud: number;
  }> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Compara estas dos respuestas y evalúa si son semánticamente equivalentes (ignora diferencias menores de wording):

RESPUESTA BASE: "${respuestaBase.slice(0, 150)}"
RESPUESTA ADVERSARIAL: "${respuestaAdversarial.slice(0, 150)}"

SIMILITUD: [0-100] (100 = idénticas semánticamente)
ESTABLE: [SÍ/NO]`,
      input: "",
    });

    const similitud = parseInt(resp.output_text.match(/SIMILITUD:\s*(\d+)/)?.[1] ?? "50");
    const estable = resp.output_text.toUpperCase().includes("ESTABLE: SÍ");
    return { estable, similitud };
  }
}

export class TestadorRobustez {
  private generador: GeneradorAdversarial;
  private evaluador: EvaluadorRobustez;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.generador = new GeneradorAdversarial(client);
    this.evaluador = new EvaluadorRobustez(client);
  }

  async testear(
    nombreAgente: string,
    handler: (entrada: string) => Promise<string>,
    entradaBase: string,
  ): Promise<ResultadoRobustez> {
    console.log(`\n   🛡️  Testeando robustez de: ${nombreAgente}`);

    // Respuesta base
    const respuestaBase = await handler(entradaBase);
    console.log(`   ✓ Respuesta base obtenida`);

    // Generar casos adversariales
    const casos = this.generador.generarCasos(entradaBase).slice(0, 4); // Limitar para demo
    const vulnerabilidades: ResultadoRobustez["vulnerabilidades"] = [];
    let casosEstables = 0;

    for (const caso of casos) {
      if (!caso.entrada.trim()) {
        // Caso vacío: comprobar que no falla
        try {
          await handler(caso.entrada);
          casosEstables++;
          console.log(`   ✅ [${caso.tipo}] Maneja entrada vacía`);
        } catch {
          vulnerabilidades.push({ tipo: caso.tipo, descripcion: caso.descripcion });
          console.log(`   ⚠️  [${caso.tipo}] Falla con entrada vacía`);
        }
        continue;
      }

      try {
        const respuestaAdversarial = await handler(caso.entrada);
        const { estable } = await this.evaluador.evaluarPar(respuestaBase, respuestaAdversarial);

        if (estable) {
          casosEstables++;
          console.log(`   ✅ [${caso.tipo}] Estable`);
        } else {
          vulnerabilidades.push({ tipo: caso.tipo, descripcion: caso.descripcion });
          console.log(`   ⚠️  [${caso.tipo}] Inestable: ${caso.descripcion}`);
        }
      } catch {
        vulnerabilidades.push({ tipo: caso.tipo, descripcion: `Error en ${caso.descripcion}` });
        console.log(`   ❌ [${caso.tipo}] Excepción no manejada`);
      }
    }

    const scoreFinal = Math.round((casosEstables / casos.length) * 100);

    return { agente: nombreAgente, casosProbados: casos.length, casosEstables, scoreFinal, vulnerabilidades };
  }
}

export async function demostrarAdversarialRobustness(client: OpenAI = makeClient()): Promise<void> {
  paso("🛡️", "Demostrando Adversarial Robustness Pattern");

  const testador = new TestadorRobustez(client);

  // Agente bajo prueba
  const agenteHandler = async (entrada: string): Promise<string> => {
    if (!entrada.trim()) return "Por favor proporciona una pregunta.";
    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Responde brevemente: ${entrada}`,
      input: "",
    });
    return resp.output_text;
  };

  paso("1️⃣", "Prueba de robustez con casos adversariales");
  const resultado = await testador.testear(
    "Agente-Clasificador",
    agenteHandler,
    "¿Cuáles son los patrones de diseño más importantes?",
  );

  console.log(`\n   📊 Resultados de Robustez:`);
  console.log(`   Agente: ${resultado.agente}`);
  console.log(`   Casos probados: ${resultado.casosProbados}`);
  console.log(`   Casos estables: ${resultado.casosEstables}`);
  console.log(`   Score de robustez: ${resultado.scoreFinal}%`);

  if (resultado.vulnerabilidades.length > 0) {
    console.log(`\n   ⚠️  Vulnerabilidades encontradas:`);
    resultado.vulnerabilidades.forEach((v) => {
      console.log(`      - [${v.tipo}] ${v.descripcion}`);
    });
  }

  paso("✅", "Adversarial Robustness cuantificando resistencia a entradas hostiles");
}

async function main(): Promise<void> { await demostrarAdversarialRobustness(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
