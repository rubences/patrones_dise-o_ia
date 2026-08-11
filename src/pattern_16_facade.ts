/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 16 — FACADE (STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente Simple]
 *       │
 *       ▼
 *  [Facade: SistemaAgenticoCompleto]
 *       │
 *   ┌───┴───┬─────────┬──────────┐
 *   │       │         │          │
 *   ▼       ▼         ▼          ▼
 * [Router][Multi-Agent][HITL][Tool-Use]
 *
 *  Idea: Proporcionar una interfaz unificada a un conjunto de interfaces
 *  complejas. Simplifica el uso de subsistemas complicados.
 *
 *  Referencia: https://refactoring.guru/design-patterns/facade
 *
 *  Ventajas:
 *  - Interfaz simple para sistemas complejos
 *  - Desacoplamiento cliente-subsistemas
 *  - Facilita reutilización
 *  - Reduce complejidad aparente
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Subsistemas complejos ──────────────────────────────────────
export interface ComponenteSubsistema {
  procesar(entrada: string): Promise<string>;
}

class ComponenteRouter implements ComponenteSubsistema {
  async procesar(entrada: string): Promise<string> {
    console.log("  [Router] Clasificando solicitud...");
    return `Solicitud clasificada como: ${entrada.substring(0, 20)}...`;
  }
}

class ComponenteAnalisis implements ComponenteSubsistema {
  async procesar(entrada: string): Promise<string> {
    console.log("  [Análisis] Analizando contenido...");
    return `Análisis completado: ${entrada.length} caracteres`;
  }
}

class ComponenteValidacion implements ComponenteSubsistema {
  async procesar(_entrada: string): Promise<string> {
    console.log("  [Validación] Verificando datos...");
    return `✅ Datos validados correctamente`;
  }
}

class ComponenteAlmacenamiento implements ComponenteSubsistema {
  async procesar(_entrada: string): Promise<string> {
    console.log("  [Almacenamiento] Guardando en BD...");
    return `Guardado con ID: ${Math.random().toString(36).substring(7)}`;
  }
}

// ── FACADE: Interfaz simplificada ──────────────────────────────
export class SistemaAgenticoCompleto {
  private router: ComponenteRouter;
  private analisis: ComponenteAnalisis;
  private validacion: ComponenteValidacion;
  private almacenamiento: ComponenteAlmacenamiento;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.router = new ComponenteRouter();
    this.analisis = new ComponenteAnalisis();
    this.validacion = new ComponenteValidacion();
    this.almacenamiento = new ComponenteAlmacenamiento();
    this.client = client;
  }

  // ── Métodos complejos simplificados ────────────────────────
  async procesarSolicitudCompleta(solicitud: string): Promise<string> {
    console.log("📋 Iniciando procesamiento completo...\n");

    // Paso 1: Rutear
    const clasificacion = await this.router.procesar(solicitud);
    console.log(`   ✓ ${clasificacion}`);

    // Paso 2: Validar
    const validacion = await this.validacion.procesar(solicitud);
    console.log(`   ✓ ${validacion}`);

    // Paso 3: Analizar
    const analisis = await this.analisis.procesar(solicitud);
    console.log(`   ✓ ${analisis}`);

    // Paso 4: Almacenar
    const resultado = await this.almacenamiento.procesar(solicitud);
    console.log(`   ✓ ${resultado}`);

    return resultado;
  }

  async generarReporte(tema: string): Promise<string> {
    console.log(`📊 Generando reporte sobre: ${tema}\n`);

    // Internamente orquesta múltiples subsistemas
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Genera un breve reporte ejecutivo sobre: ${tema}`,
      input: "",
    });

    // Luego lo valida, almacena, etc.
    await this.validacion.procesar(respuesta.output_text);
    const almacenado = await this.almacenamiento.procesar(
      respuesta.output_text,
    );

    return `Reporte generado y almacenado: ${almacenado}`;
  }

  async ejecutarFlujoCompleto(
    entrada: string,
  ): Promise<{
    clasificacion: string;
    analisis: string;
    validacion: string;
    almacenamiento: string;
  }> {
    console.log("🔄 Ejecutando flujo completo...\n");

    return {
      clasificacion: await this.router.procesar(entrada),
      analisis: await this.analisis.procesar(entrada),
      validacion: await this.validacion.procesar(entrada),
      almacenamiento: await this.almacenamiento.procesar(entrada),
    };
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarFacade(): Promise<void> {
  paso("🏢", "Demostrando Facade Pattern");

  const sistema = new SistemaAgenticoCompleto();

  paso("1️⃣", "Procesamiento simple (sin conocer subsistemas)");
  const resultado1 = await sistema.procesarSolicitudCompleta(
    "Solicitud de soporte técnico urgente",
  );
  console.log(`\n   Resultado final: ${resultado1}\n`);

  paso("2️⃣", "Generación de reporte");
  const resultado2 = await sistema.generarReporte("Tendencias en IA 2026");
  console.log(`   ${resultado2}\n`);

  paso("3️⃣", "Flujo completo desglosado");
  const flujo = await sistema.ejecutarFlujoCompleto(
    "Nueva solicitud de cliente",
  );
  console.log(`
   Resultado desglosado:
   - Clasificación: ${flujo.clasificacion}
   - Análisis: ${flujo.analisis}
   - Validación: ${flujo.validacion}
   - Almacenamiento: ${flujo.almacenamiento}
  `);
}

async function main(): Promise<void> {
  await demostrarFacade();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
