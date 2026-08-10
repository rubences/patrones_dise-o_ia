/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 33 — INTERPRETER (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada: DSL Workflow]
 *  "agente(tipo:experto) → consultar(db) → analizar() → responder()"
 *
 *       │
 *       ▼
 *  [Lexer: Tokenizar]
 *  ["agente", "(tipo:experto)", "→", "consultar", ...]
 *
 *       │
 *       ▼
 *  [Parser: Construir AST]
 *  PipelineExpression(
 *    AgentExpression(tipo="experto"),
 *    QueryExpression(source="db"),
 *    AnalysisExpression(),
 *    ResponseExpression()
 *  )
 *
 *       │
 *       ▼
 *  [Interpreter: Ejecutar]
 *  1. Crear agente
 *  2. Consultar
 *  3. Analizar
 *  4. Responder
 *
 *  Idea: Interpretar un lenguaje específico del dominio (DSL)
 *  permitiendo definir workflows sin código.
 *
 *  Referencia: https://refactoring.guru/design-patterns/interpreter
 *
 *  Ventajas:
 *  - DSL para workflows agénticos
 *  - Configuración legible por humanos
 *  - Fácil crear variaciones
 *  - Extensible
 */

import { isDirectRun, paso } from "./common.js";

// ── Interfaz para expresiones ──────────────────────────────────────
export interface Expresion {
  interpretar(): Promise<string>;
}

// ── Expresiones terminales ─────────────────────────────────────────
export class ExpresionAgente implements Expresion {
  private tipo: string;

  constructor(tipo: string) {
    this.tipo = tipo;
  }

  async interpretar(): Promise<string> {
    return `[Agente: ${this.tipo}]`;
  }
}

export class ExpresionConsultar implements Expresion {
  private fuente: string;

  constructor(fuente: string) {
    this.fuente = fuente;
  }

  async interpretar(): Promise<string> {
    return `[Consultar: ${this.fuente}]`;
  }
}

export class ExpresionAnalizar implements Expresion {
  async interpretar(): Promise<string> {
    return `[Analizar resultado]`;
  }
}

export class ExpresionResponder implements Expresion {
  async interpretar(): Promise<string> {
    return `[Responder al usuario]`;
  }
}

// ── Expresión de composición (no-terminal) ─────────────────────────
export class ExpresionPipeline implements Expresion {
  private expresiones: Expresion[];

  constructor(...expresiones: Expresion[]) {
    this.expresiones = expresiones;
  }

  async interpretar(): Promise<string> {
    const resultados: string[] = [];

    for (const exp of this.expresiones) {
      const resultado = await exp.interpretar();
      resultados.push(resultado);
    }

    return resultados.join(" → ");
  }
}

// ── Parser de DSL ──────────────────────────────────────────────────
export class ParserDSL {
  parse(dsl: string): Expresion {
    console.log(`   📖 Parseando DSL: "${dsl}"`);

    // Casos de uso simple (parser muy básico para demostración)
    if (dsl.includes("agente") && dsl.includes("consultar")) {
      return new ExpresionPipeline(
        new ExpresionAgente("experto"),
        new ExpresionConsultar("base de datos"),
        new ExpresionAnalizar(),
        new ExpresionResponder(),
      );
    } else if (dsl.includes("analizar")) {
      return new ExpresionPipeline(
        new ExpresionConsultar("fuente"),
        new ExpresionAnalizar(),
      );
    }

    // Default
    return new ExpresionAgente("genérico");
  }
}

// ── Intérprete de workflow ─────────────────────────────────────────
export class InterpreteWorkflow {
  private parser: ParserDSL;

  constructor() {
    this.parser = new ParserDSL();
  }

  async ejecutar(dsl: string): Promise<string> {
    console.log(`\n   🎯 Ejecutando DSL workflow...`);

    const expresion = this.parser.parse(dsl);
    const resultado = await expresion.interpretar();

    return resultado;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarInterpreter(): Promise<void> {
  paso("📝", "Demostrando Interpreter Pattern");

  const interprete = new InterpreteWorkflow();

  paso("1️⃣", "Workflow DSL: Análisis completo");

  const dsl1 =
    "agente(tipo:experto) → consultar(db:usuarios) → analizar() → responder()";
  const resultado1 = await interprete.ejecutar(dsl1);
  console.log(`\n   Resultado: ${resultado1}`);

  paso("2️⃣", "Workflow DSL: Solo análisis");

  const dsl2 = "consultar(fuente:logs) → analizar()";
  const resultado2 = await interprete.ejecutar(dsl2);
  console.log(`\n   Resultado: ${resultado2}`);

  paso("3️⃣", "Composición manual de expresiones");

  console.log(`\n   Creando pipeline manual...`);
  const pipeline = new ExpresionPipeline(
    new ExpresionAgente("creatividad"),
    new ExpresionAnalizar(),
    new ExpresionResponder(),
  );

  const resultado3 = await pipeline.interpretar();
  console.log(`   Resultado: ${resultado3}`);

  paso("✅", "Interpreter ejecutando DSL de workflows agénticos");
}

async function main(): Promise<void> {
  await demostrarInterpreter();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
