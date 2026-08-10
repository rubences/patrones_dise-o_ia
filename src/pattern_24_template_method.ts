/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 24 — TEMPLATE METHOD (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Algoritmo Template]
 *       │
 *       ├─ paso1() ◄──────────────────── Concreto
 *       ├─ paso2() ◄────── Plantilla (definido en clase base)
 *       ├─ paso3_personalizado() ◄─── Gancho: implementación por subclases
 *       ├─ paso4() ◄──────────────────── Concreto
 *       └─ paso5_personalizado() ◄─── Gancho: implementación por subclases
 *
 *  Idea: Definir el esqueleto de un algoritmo en una clase base,
 *  dejando que las subclases implementen pasos específicos sin alterar
 *  la estructura del algoritmo.
 *
 *  Referencia: https://refactoring.guru/design-patterns/template-method
 *
 *  Ventajas:
 *  - Estructura común con variaciones
 *  - Evita duplicación de código
 *  - Personalización en puntos específicos
 *  - Fácil de mantener
 *
 *  Casos de uso:
 *  - Pipelines personalizables
 *  - Generadores de contenido
 *  - Procesadores de datos
 *  - Flujos de trabajo configurables
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── CLASE ABSTRACTA: Template Method ───────────────────────────
export abstract class GeneradorConTemplate {
  abstract nombre: string;

  // Plantilla del algoritmo (no se puede sobrescribir)
  async generarContenido(tema: string): Promise<string> {
    console.log(`\n   🔄 Iniciando: ${this.nombre}`);

    const paso1 = await this.pasoPrepararEntrada(tema);
    console.log(`   ✓ Entrada preparada`);

    const paso2 = await this.pasoGenerarContenido(paso1);
    console.log(`   ✓ Contenido generado`);

    const paso3 = await this.pasoPersonalizado(paso2);
    console.log(`   ✓ Paso personalizado completado`);

    const paso4 = await this.pasoValidar(paso3);
    console.log(`   ✓ Validado`);

    const paso5 = await this.pasoFormatear(paso4);
    console.log(`   ✓ Formateado`);

    return paso5;
  }

  // Pasos comunes (implementados en clase base)
  private async pasoPrepararEntrada(tema: string): Promise<string> {
    return `Preparado: ${tema}`;
  }

  private async pasoValidar(contenido: string): Promise<string> {
    return contenido.length > 0 ? contenido : "Contenido vacío";
  }

  // Pasos que deben ser personalizados por subclases
  protected abstract pasoGenerarContenido(
    entrada: string,
  ): Promise<string>;

  protected abstract pasoPersonalizado(contenido: string): Promise<string>;

  protected abstract pasoFormatear(contenido: string): Promise<string>;
}

// ── SUBCLASE 1: Generador de Blogs ────────────────────────────
export class GeneradorBlog extends GeneradorConTemplate {
  nombre = "Generador de Blog";
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected async pasoGenerarContenido(entrada: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions:
        "Genera un párrafo para un blog sobre: " + entrada,
      input: "",
    });

    return respuesta.output_text;
  }

  protected async pasoPersonalizado(contenido: string): Promise<string> {
    // Agregar estructura de blog
    return `**Introducción**\n${contenido.slice(0, 100)}...\n\n**Desarrollo**\n${contenido}`;
  }

  protected async pasoFormatear(contenido: string): Promise<string> {
    // Formatear como Markdown
    return `# Blog Post\n\n${contenido}`;
  }
}

// ── SUBCLASE 2: Generador de Resumen ──────────────────────────
export class GeneradorResumen extends GeneradorConTemplate {
  nombre = "Generador de Resumen";
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected async pasoGenerarContenido(entrada: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions:
        "Crea un resumen conciso (3-4 líneas) sobre: " + entrada,
      input: "",
    });

    return respuesta.output_text;
  }

  protected async pasoPersonalizado(contenido: string): Promise<string> {
    // Agregar puntos clave
    return `**Resumen Ejecutivo**\n${contenido}\n\n**Puntos Clave:**\n- Información importante`;
  }

  protected async pasoFormatear(contenido: string): Promise<string> {
    // Formatear compacto
    return contenido.toUpperCase();
  }
}

// ── SUBCLASE 3: Generador de Email ───────────────────────────
export class GeneradorEmail extends GeneradorConTemplate {
  nombre = "Generador de Email";
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected async pasoGenerarContenido(entrada: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions:
        "Redacta el cuerpo de un email profesional sobre: " + entrada,
      input: "",
    });

    return respuesta.output_text;
  }

  protected async pasoPersonalizado(contenido: string): Promise<string> {
    // Agregar estructura de email
    return `Estimado cliente,\n\n${contenido}\n\nAtentamente,\nEquipo de Soporte`;
  }

  protected async pasoFormatear(contenido: string): Promise<string> {
    // Formatear como email
    return `TO: usuario@example.com\nSUBJECT: Información Importante\n\n${contenido}`;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarTemplateMethod(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("📋", "Demostrando Template Method Pattern");

  const tema = "Importancia de los patrones de diseño en IA";

  paso("1️⃣", "Generador de Blog");

  const blog = new GeneradorBlog(client);
  const resultadoBlog = await blog.generarContenido(tema);
  console.log(`\n   Resultado Blog:\n${resultadoBlog.slice(0, 150)}…\n`);

  paso("2️⃣", "Generador de Resumen");

  const resumen = new GeneradorResumen(client);
  const resultadoResumen = await resumen.generarContenido(tema);
  console.log(`\n   Resultado Resumen:\n${resultadoResumen.slice(0, 150)}…\n`);

  paso("3️⃣", "Generador de Email");

  const email = new GeneradorEmail(client);
  const resultadoEmail = await email.generarContenido(tema);
  console.log(`\n   Resultado Email:\n${resultadoEmail.slice(0, 150)}…\n`);

  paso("✅", "Template Method reutilizando estructura común");
}

async function main(): Promise<void> {
  await demostrarTemplateMethod();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
