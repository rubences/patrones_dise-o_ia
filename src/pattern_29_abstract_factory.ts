/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 29 — ABSTRACT FACTORY (CREATIONAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente solicita familia de agentes]
 *       │
 *       ▼
 *  [AbstractFactory]
 *       │
 *       ├─ FabricaAgentesML
 *       │  ├─ crearClasificador() → ClasificadorML
 *       │  ├─ crearGenerador() → GeneradorML
 *       │  └─ crearAnalizador() → AnalizadorML
 *       │
 *       └─ FabricaAgentesRules
 *          ├─ crearClasificador() → ClasificadorRules
 *          ├─ crearGenerador() → GeneradorRules
 *          └─ crearAnalizador() → AnalizadorRules
 *
 *  Idea: Crear familias de objetos relacionados sin especificar
 *  sus clases concretas.
 *
 *  Referencia: https://refactoring.guru/design-patterns/abstract-factory
 *
 *  Ventajas:
 *  - Familias completas de objetos
 *  - Intercambiabilidad de familias
 *  - Consistencia entre objetos
 *  - Fácil agregar nuevas familias
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaces para la familia de agentes ──────────────────────────
export interface Clasificador {
  clasificar(entrada: string): Promise<string>;
}

export interface Generador {
  generar(tema: string): Promise<string>;
}

export interface Analizador {
  analizar(contenido: string): Promise<string>;
}

// ── FAMILIA 1: Agentes basados en LLM ──────────────────────────────
class ClasificadorLLM implements Clasificador {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async clasificar(entrada: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Clasifica: ${entrada}`,
      input: "",
    });
    return `[LLM] Clasificación: ${respuesta.output_text}`;
  }
}

class GeneradorLLM implements Generador {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async generar(tema: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Genera contenido sobre: ${tema}`,
      input: "",
    });
    return `[LLM] Generado: ${respuesta.output_text.slice(0, 100)}...`;
  }
}

class AnalizadorLLM implements Analizador {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  async analizar(contenido: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Analiza: ${contenido}`,
      input: "",
    });
    return `[LLM] Análisis: ${respuesta.output_text.slice(0, 100)}...`;
  }
}

// ── FAMILIA 2: Agentes basados en reglas ───────────────────────────
class ClasificadorReglas implements Clasificador {
  async clasificar(entrada: string): Promise<string> {
    if (entrada.length < 10) return "[Rules] Clasificado como: Corto";
    if (entrada.length > 100) return "[Rules] Clasificado como: Largo";
    return "[Rules] Clasificado como: Medio";
  }
}

class GeneradorReglas implements Generador {
  async generar(tema: string): Promise<string> {
    return `[Rules] Generado para tema ${tema}: Contenido determinista basado en reglas`;
  }
}

class AnalizadorReglas implements Analizador {
  async analizar(contenido: string): Promise<string> {
    const palabras = contenido.split(" ").length;
    return `[Rules] Análisis: ${palabras} palabras detectadas`;
  }
}

// ── ABSTRACT FACTORY ───────────────────────────────────────────────
export interface FabricaAgentes {
  crearClasificador(): Clasificador;
  crearGenerador(): Generador;
  crearAnalizador(): Analizador;
}

export class FabricaAgentesLLM implements FabricaAgentes {
  private client: OpenAI;

  constructor(client: OpenAI) {
    this.client = client;
  }

  crearClasificador(): Clasificador {
    return new ClasificadorLLM(this.client);
  }

  crearGenerador(): Generador {
    return new GeneradorLLM(this.client);
  }

  crearAnalizador(): Analizador {
    return new AnalizadorLLM(this.client);
  }
}

export class FabricaAgentesReglas implements FabricaAgentes {
  crearClasificador(): Clasificador {
    return new ClasificadorReglas();
  }

  crearGenerador(): Generador {
    return new GeneradorReglas();
  }

  crearAnalizador(): Analizador {
    return new AnalizadorReglas();
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarAbstractFactory(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🏭", "Demostrando Abstract Factory Pattern");

  paso("1️⃣", "Familia de Agentes LLM");

  const fabrica1: FabricaAgentes = new FabricaAgentesLLM(client);
  const clasificador1 = fabrica1.crearClasificador();
  const generador1 = fabrica1.crearGenerador();

  console.log(`\n   Usando Familia LLM:`);
  console.log(`   - ${await clasificador1.clasificar("hola")}`);
  console.log(`   - ${await generador1.generar("patrones")}`);

  paso("2️⃣", "Familia de Agentes basados en Reglas");

  const fabrica2: FabricaAgentes = new FabricaAgentesReglas();
  const clasificador2 = fabrica2.crearClasificador();
  const analizador2 = fabrica2.crearAnalizador();

  console.log(`\n   Usando Familia Rules:`);
  console.log(`   - ${await clasificador2.clasificar("esto es una prueba")}`);
  console.log(`   - ${await analizador2.analizar("texto de análisis de ejemplo")}`);

  paso("3️⃣", "Intercambiabilidad de familias");

  console.log(`\n   Las dos familias implementan la misma interfaz`);
  console.log(`   Se pueden cambiar en tiempo de ejecución sin cambiar código cliente`);

  paso("✅", "Abstract Factory creando familias coherentes");
}

async function main(): Promise<void> {
  await demostrarAbstractFactory();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
