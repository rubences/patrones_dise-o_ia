/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 10 — BUILDER (PATRÓN DE CREACIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [PromptBuilder]
 *      │
 *      ├─ .conRol(rol)
 *      ├─ .conContexto(contexto)
 *      ├─ .conTarea(tarea)
 *      ├─ .conConstraints(constraints)
 *      ├─ .conEjemplos(ejemplos)
 *      └─ .construir() ──▶ Prompt completo
 *
 *  Idea: Construir objetos complejos paso a paso usando una interfaz
 *  fluida. Especialmente útil para prompts elaborados.
 *
 *  Referencia: https://refactoring.guru/design-patterns/builder
 *
 *  Ventajas:
 *  - Prompts complejos se construyen de forma legible
 *  - Orden flexible (puedo agregar contexto antes o después)
 *  - Reutilizable (puedo reutilizar templates)
 *  - Testeable (cada componente es independiente)
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Tipos para componentes del prompt ──────────────────────────
export interface ComponentePrompt {
  rol?: string;
  contexto?: string;
  tarea?: string;
  constraints?: string[];
  ejemplos?: Array<{ entrada: string; salida: string }>;
  instruccionesAdicionales?: string;
  formato?: string;
}

// ── El Builder en sí ───────────────────────────────────────────
export class ConstructorPrompt {
  private componentes: ComponentePrompt = {};

  conRol(rol: string): this {
    this.componentes.rol = rol;
    return this;
  }

  conContexto(contexto: string): this {
    this.componentes.contexto = contexto;
    return this;
  }

  conTarea(tarea: string): this {
    this.componentes.tarea = tarea;
    return this;
  }

  agregarConstraint(constraint: string): this {
    if (!this.componentes.constraints) {
      this.componentes.constraints = [];
    }
    this.componentes.constraints.push(constraint);
    return this;
  }

  conConstraints(constraints: string[]): this {
    this.componentes.constraints = constraints;
    return this;
  }

  agregarEjemplo(entrada: string, salida: string): this {
    if (!this.componentes.ejemplos) {
      this.componentes.ejemplos = [];
    }
    this.componentes.ejemplos.push({ entrada, salida });
    return this;
  }

  conEjemplos(ejemplos: Array<{ entrada: string; salida: string }>): this {
    this.componentes.ejemplos = ejemplos;
    return this;
  }

  conInstruccionesAdicionales(instrucciones: string): this {
    this.componentes.instruccionesAdicionales = instrucciones;
    return this;
  }

  conFormato(formato: string): this {
    this.componentes.formato = formato;
    return this;
  }

  // Construir el prompt final
  construir(): string {
    const partes: string[] = [];

    if (this.componentes.rol) {
      partes.push(`ROLE:\n${this.componentes.rol}`);
    }

    if (this.componentes.contexto) {
      partes.push(`\nCONTEXT:\n${this.componentes.contexto}`);
    }

    if (this.componentes.tarea) {
      partes.push(`\nTASK:\n${this.componentes.tarea}`);
    }

    if (this.componentes.constraints && this.componentes.constraints.length > 0) {
      const constraints = this.componentes.constraints
        .map((c) => `• ${c}`)
        .join("\n");
      partes.push(`\nCONSTRAINTS:\n${constraints}`);
    }

    if (this.componentes.ejemplos && this.componentes.ejemplos.length > 0) {
      const ejemplos = this.componentes.ejemplos
        .map(
          (e, i) =>
            `\nExample ${i + 1}:\nInput: ${e.entrada}\nOutput: ${e.salida}`,
        )
        .join("\n");
      partes.push(`\nEXAMPLES:${ejemplos}`);
    }

    if (this.componentes.formato) {
      partes.push(`\nOUTPUT FORMAT:\n${this.componentes.formato}`);
    }

    if (this.componentes.instruccionesAdicionales) {
      partes.push(
        `\nADDITIONAL INSTRUCTIONS:\n${this.componentes.instruccionesAdicionales}`,
      );
    }

    return partes.join("\n");
  }

  // Reset para reutilizar el builder
  reset(): this {
    this.componentes = {};
    return this;
  }
}

// ── Templates predefinidos ─────────────────────────────────────
export class TemplatesPrompt {
  static clasificador(): ConstructorPrompt {
    return new ConstructorPrompt()
      .conRol("Eres un clasificador experto")
      .conTarea("Clasifica el texto en una categoría")
      .conConstraints([
        "Sé conciso",
        "Proporciona confianza (0-1)",
        "Si no estás seguro, explica por qué",
      ]);
  }

  static generador(): ConstructorPrompt {
    return new ConstructorPrompt()
      .conRol("Eres un generador creativo")
      .conTarea("Genera contenido original y atractivo")
      .conConstraints([
        "Mantén el tono consistente",
        "Sé original",
        "Verifica la precisión",
      ]);
  }

  static analizador(): ConstructorPrompt {
    return new ConstructorPrompt()
      .conRol("Eres un analista detallista")
      .conTarea("Analiza información y extrae insights")
      .conConstraints([
        "Fundamenta tus análisis",
        "Identifica patrones",
        "Señala anomalías",
      ]);
  }

  static revisor(): ConstructorPrompt {
    return new ConstructorPrompt()
      .conRol("Eres un revisor crítico")
      .conTarea("Revisa contenido para mejorar su calidad")
      .conConstraints([
        "Sé constructivo",
        "Explica cada sugerencia",
        "Prioriza cambios importantes",
      ]);
  }
}

// ── Ejemplo de uso avanzado ────────────────────────────────────
export async function demostrarBuilder(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🔨", "Demostrando Builder Pattern");

  // Caso 1: Construir un clasificador personalizado
  paso("1️⃣", "Caso: Clasificador de sentimientos");

  const promptClasificador = new ConstructorPrompt()
    .conRol("Eres un experto en análisis de sentimientos")
    .conContexto(
      "Analizas opiniones de clientes sobre productos y servicios",
    )
    .conTarea("Clasifica el sentimiento: positivo, negativo, neutro")
    .agregarEjemplo("¡Este producto es excelente!", "positivo")
    .agregarEjemplo("No funcionó como esperaba", "negativo")
    .agregarEjemplo("El producto existe", "neutro")
    .conConstraints([
      "Proporciona puntuación de confianza 0.0-1.0",
      "Identifica palabras clave que soportan tu clasificación",
      "Si es ambiguo, explica la dificultad",
    ])
    .conFormato("JSON: {sentimiento, confianza, palabras_clave, explicacion}")
    .conInstruccionesAdicionales(
      "Si hay sarcasmo, tómalo en cuenta en tu análisis",
    );

  const textoClasificador = promptClasificador.construir();
  console.log(`\n📝 Prompt construido:\n${textoClasificador.slice(0, 200)}…`);

  const respuestaClasificador = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions: textoClasificador,
    input:
      "Este producto es genial, aunque el precio es un poco alto y el envío tardó mucho",
  });

  console.log(`✅ Respuesta: ${respuestaClasificador.output_text.slice(0, 150)}`);

  // Caso 2: Usar template predefinido
  paso("2️⃣", "Caso: Usando template de generador");

  const promptGenerador = TemplatesPrompt.generador()
    .conContexto("Estás escribiendo un blog de tecnología")
    .conTarea("Genera un título atractivo para artículo sobre IA")
    .agregarConstraint("Máximo 10 palabras")
    .agregarConstraint("Debe ser clickeable")
    .conFormato("Solo devuelve el título, sin explicación");

  const respuestaGenerador = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions: promptGenerador.construir(),
    input: "Articulo sobre LLMs y agentes",
  });

  console.log(
    `✅ Título generado: ${respuestaGenerador.output_text.slice(0, 150)}`,
  );

  // Caso 3: Reutilizar builder con reset
  paso("3️⃣", "Caso: Reutilizar builder");

  const builder = new ConstructorPrompt();

  // Usarlo para clasificador
  const promptClasificador2 = builder
    .conRol("Clasificador")
    .conTarea("Clasifica emails")
    .construir();

  // Reset y reutilizar para generador
  const promptGenerador2 = builder
    .reset()
    .conRol("Generador")
    .conTarea("Genera respuestas de email")
    .construir();

  console.log(`📦 Reutilización: Builder se limpió correctamente (reset)`);
  console.log(
    `   Prompt 1 comienza con: ${promptClasificador2.slice(0, 50)}…`,
  );
  console.log(
    `   Prompt 2 comienza con: ${promptGenerador2.slice(0, 50)}…`,
  );
}

async function main(): Promise<void> {
  await demostrarBuilder();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
