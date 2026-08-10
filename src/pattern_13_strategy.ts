/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 13 — STRATEGY (PATRÓN BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema a resolver]
 *       │
 *       ▼
 *  [Contexto: Generador]
 *       │
 *       ├─ .conEstrategia(StrategyDirecta) ──▶ Respuesta rápida
 *       │
 *       ├─ .conEstrategia(StrategyReflexiva) ──▶ Respuesta reflexionada
 *       │
 *       ├─ .conEstrategia(StrategyCreativa) ──▶ Respuesta creativa
 *       │
 *       └─ .conEstrategia(StrategyAnalistica) ──▶ Análisis profundo
 *
 *  Idea: Definir una familia de estrategias, encapsular cada una,
 *  e intercambiarlas en runtime sin cambiar el cliente.
 *
 *  Referencia: https://refactoring.guru/design-patterns/strategy
 *
 *  Ventajas:
 *  - Cambiar comportamiento sin modificar código cliente
 *  - Encapsular diferentes algoritmos de prompting
 *  - Fácil agregar nuevas estrategias
 *  - Permite A/B testing de estrategias
 *
 *  Casos de uso:
 *  - Diferentes estrategias de prompting (directa, reflexiva, creativa)
 *  - Diferentes niveles de reasoning (low, medium)
 *  - Diferentes configuraciones de temperatura/top_p
 *  - Diferentes formatos de output
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz de estrategia ─────────────────────────────────────
export interface EstrategiaPrompting {
  nombre: string;
  generarPrompt(pregunta: string): string;
  configuracionLLM(): {
    reasoning?: { effort: "low" | "medium" };
  };
}

// ── ESTRATEGIA 1: Directa (rápida y concisa) ───────────────────
export class EstrategiaDirecta implements EstrategiaPrompting {
  nombre = "Directa";

  generarPrompt(pregunta: string): string {
    return `Responde brevemente y directamente.

Pregunta: ${pregunta}

Respuesta:`;
  }

  configuracionLLM() {
    return { reasoning: { effort: "low" as const } };
  }
}

// ── ESTRATEGIA 2: Reflexiva (análisis y reflexión) ──────────────
export class EstrategiaReflexiva implements EstrategiaPrompting {
  nombre = "Reflexiva";

  generarPrompt(pregunta: string): string {
    return `Analiza la pregunta cuidadosamente. Reflexiona sobre múltiples perspectivas.
Proporciona una respuesta fundamentada y nuanceada.

Pregunta: ${pregunta}

Proceso de pensamiento:
1. ¿Cuáles son los aspectos clave?
2. ¿Qué supuestos subyacentes hay?
3. ¿Cuáles son las implicaciones?

Respuesta reflexionada:`;
  }

  configuracionLLM() {
    return { reasoning: { effort: "medium" as const } };
  }
}

// ── ESTRATEGIA 3: Creativa (exploración de ideas) ──────────────
export class EstrategiaCreativa implements EstrategiaPrompting {
  nombre = "Creativa";

  generarPrompt(pregunta: string): string {
    return `Eres un pensador creativo. Explora la pregunta desde ángulos inesperados.
Proporciona ideas innovadoras, metáforas útiles y perspectivas nuevas.

Pregunta: ${pregunta}

Enfoques creativos:
- Analogías con otros dominios
- Escenarios contrafácticos
- Síntesis de ideas aparentemente dispares

Respuesta creativa:`;
  }

  configuracionLLM() {
    return { reasoning: { effort: "medium" as const } };
  }
}

// ── ESTRATEGIA 4: Analítica (profundidad y rigor) ───────────────
export class EstrategiaAnalitica implements EstrategiaPrompting {
  nombre = "Analítica";

  generarPrompt(pregunta: string): string {
    return `Proporciona un análisis riguroso y estructurado.
Descompón el problema, identifica patrones y proporciona evidencia.

Pregunta: ${pregunta}

Análisis:
1. **Desglose del problema**
2. **Componentes clave**
3. **Relaciones y dependencias**
4. **Conclusiones basadas en evidencia**

Respuesta analítica:`;
  }

  configuracionLLM() {
    return { reasoning: { effort: "medium" as const } };
  }
}

// ── ESTRATEGIA 5: Socràtica (preguntas y aprendizaje) ──────────
export class EstrategiaSocratica implements EstrategiaPrompting {
  nombre = "Socrática";

  generarPrompt(pregunta: string): string {
    return `Eres un maestro socrático. En lugar de responder directamente,
formula preguntas perspicaces que guíen al estudiante hacia sus propias conclusiones.

Pregunta inicial: ${pregunta}

Preguntas guía:`;
  }

  configuracionLLM() {
    return { reasoning: { effort: "medium" as const } };
  }
}

// ── CONTEXTO: Generador que usa estrategias ────────────────────
export interface ResultadoGeneracion {
  pregunta: string;
  estrategia: string;
  respuesta: string;
  duracion: number;
}

export class GeneradorConEstrategia {
  private estrategia: EstrategiaPrompting;
  private client: OpenAI;

  constructor(
    estrategia: EstrategiaPrompting,
    client: OpenAI = makeClient(),
  ) {
    this.estrategia = estrategia;
    this.client = client;
  }

  cambiarEstrategia(estrategia: EstrategiaPrompting): void {
    this.estrategia = estrategia;
  }

  async generar(pregunta: string): Promise<ResultadoGeneracion> {
    const inicio = Date.now();

    const prompt = this.estrategia.generarPrompt(pregunta);
    const config = this.estrategia.configuracionLLM();

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      ...(config.reasoning && { reasoning: config.reasoning }),
      store: false,
      instructions: prompt,
      input: "",
    });

    const duracion = Date.now() - inicio;

    return {
      pregunta,
      estrategia: this.estrategia.nombre,
      respuesta: respuesta.output_text,
      duracion,
    };
  }

  obtenerEstrategiaActual(): string {
    return this.estrategia.nombre;
  }
}

// ── Ejemplo de uso ─────────────────────────────────────────────
export async function demostrarStrategy(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🎯", "Demostrando Strategy Pattern");

  const pregunta =
    "¿Cuál es el impacto de la IA en el empleo en los próximos 10 años?";

  // Crear generador con estrategia inicial
  const generador = new GeneradorConEstrategia(
    new EstrategiaDirecta(),
    client,
  );

  paso("1️⃣", "Estrategia Directa");
  console.log(`   Estrategia actual: ${generador.obtenerEstrategiaActual()}`);
  const resultado1 = await generador.generar(pregunta);
  console.log(`   Respuesta: ${resultado1.respuesta.slice(0, 100)}…`);
  console.log(`   ⏱️  Duracion: ${resultado1.duracion}ms`);

  // Cambiar a estrategia reflexiva
  paso("2️⃣", "Estrategia Reflexiva");
  generador.cambiarEstrategia(new EstrategiaReflexiva());
  console.log(`   Estrategia actual: ${generador.obtenerEstrategiaActual()}`);
  const resultado2 = await generador.generar(pregunta);
  console.log(`   Respuesta: ${resultado2.respuesta.slice(0, 100)}…`);
  console.log(`   ⏱️  Duracion: ${resultado2.duracion}ms`);

  // Cambiar a estrategia creativa
  paso("3️⃣", "Estrategia Creativa");
  generador.cambiarEstrategia(new EstrategiaCreativa());
  console.log(`   Estrategia actual: ${generador.obtenerEstrategiaActual()}`);
  const resultado3 = await generador.generar(pregunta);
  console.log(`   Respuesta: ${resultado3.respuesta.slice(0, 100)}…`);
  console.log(`   ⏱️  Duracion: ${resultado3.duracion}ms`);

  // Cambiar a estrategia analítica
  paso("4️⃣", "Estrategia Analítica");
  generador.cambiarEstrategia(new EstrategiaAnalitica());
  console.log(`   Estrategia actual: ${generador.obtenerEstrategiaActual()}`);
  const resultado4 = await generador.generar(pregunta);
  console.log(`   Respuesta: ${resultado4.respuesta.slice(0, 100)}…`);
  console.log(`   ⏱️  Duracion: ${resultado4.duracion}ms`);

  // Comparativa de duraciones
  paso("📊", "Comparativa de Estrategias");
  console.log(`
   Estrategia Directa:   ${resultado1.duracion}ms
   Estrategia Reflexiva: ${resultado2.duracion}ms
   Estrategia Creativa:  ${resultado3.duracion}ms
   Estrategia Analítica: ${resultado4.duracion}ms
  `);

  const estrategiasMasRapida =
    resultado1.duracion < resultado2.duracion ? "Directa" : "Reflexiva";
  console.log(`   🏃 Estrategia más rápida: ${estrategiasMasRapida}`);
}

async function main(): Promise<void> {
  await demostrarStrategy();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
