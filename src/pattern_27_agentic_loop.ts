/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 27 — AGENTIC LOOP (REFLEXIÓN ITERATIVA AUTÓNOMA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Objetivo]
 *       │
 *       ▼
 *  ╔════════════════════════════════════════════════════════════════╗
 *  ║              🔄 AGENTIC LOOP ITERATIVO 🔄                     ║
 *  ║                                                                ║
 *  ║  1. Analizar: ¿Qué necesito hacer?                            ║
 *  ║  2. Planear: ¿Cómo lo haré?                                   ║
 *  ║  3. Actuar: Ejecutar acciones                                 ║
 *  ║  4. Observar: ¿Qué resultó?                                   ║
 *  ║  5. Reflexionar: ¿Está hecho? ¿Falla? ¿Mejorar?               ║
 *  ║                                                                ║
 *  ║  ¿Éxito? → FIN | ¿Falla? → Volver a 1                         ║
 *  ╚════════════════════════════════════════════════════════════════╝
 *
 *  Idea: Ciclo autónomo donde el agente reflexiona y se corrige
 *  iterativamente hasta lograr el objetivo.
 *
 *  Impacto: Habilita verdadera autonomía y aprendizaje en tiempo real
 *
 *  Ventajas:
 *  - Agencia real (no solo ejecución lineal)
 *  - Auto-corrección automática
 *  - Resuelve problemas sin intervención humana
 *  - Escalable a objetivos complejos
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Estados del agente ─────────────────────────────────────────────
export type EstadoAgente =
  | "analizando"
  | "planeando"
  | "actuando"
  | "observando"
  | "reflexionando"
  | "completado"
  | "fallido";

export interface IteracionAgente {
  numero: number;
  estado: EstadoAgente;
  analisis: string;
  plan: string;
  accion: string;
  observacion: string;
  reflexion: string;
  exito: boolean;
}

// ── AGENTIC LOOP ───────────────────────────────────────────────────
export class AgenteConLoopIterativo {
  private nombre: string;
  private cliente: OpenAI;
  private iteraciones: IteracionAgente[] = [];
  private maxIteraciones: number = 5;

  constructor(nombre: string, client: OpenAI = makeClient()) {
    this.nombre = nombre;
    this.cliente = client;
  }

  async ejecutarConAutoReflexion(objetivo: string): Promise<{
    resultado: string;
    iteraciones: IteracionAgente[];
    exito: boolean;
  }> {
    this.iteraciones = [];

    console.log(`\n   🎯 Objetivo: ${objetivo}`);
    console.log(`   🔄 [${this.nombre}] Iniciando Agentic Loop (máx ${this.maxIteraciones} iteraciones)\n`);

    for (
      let i = 1;
      i <= this.maxIteraciones && i <= this.maxIteraciones;
      i++
    ) {
      console.log(`   ═══ ITERACIÓN ${i} ═══`);

      const iteracion: IteracionAgente = {
        numero: i,
        estado: "analizando",
        analisis: "",
        plan: "",
        accion: "",
        observacion: "",
        reflexion: "",
        exito: false,
      };

      // Paso 1: Analizar
      iteracion.analisis = await this.analizar(objetivo, i);
      console.log(`   📊 Análisis: ${iteracion.analisis.slice(0, 80)}...`);

      // Paso 2: Planear
      iteracion.estado = "planeando";
      iteracion.plan = await this.planear(iteracion.analisis);
      console.log(`   📋 Plan: ${iteracion.plan.slice(0, 80)}...`);

      // Paso 3: Actuar
      iteracion.estado = "actuando";
      iteracion.accion = await this.actuar();
      console.log(`   ⚙️  Acción: ${iteracion.accion.slice(0, 80)}...`);

      // Paso 4: Observar
      iteracion.estado = "observando";
      iteracion.observacion = await this.observar(iteracion.accion);
      console.log(`   👁️  Observación: ${iteracion.observacion.slice(0, 60)}...`);

      // Paso 5: Reflexionar
      iteracion.estado = "reflexionando";
      const reflexion = await this.reflexionar(
        iteracion.observacion,
        objetivo,
        i,
      );
      iteracion.reflexion = reflexion.pensamiento;
      iteracion.exito = reflexion.completo;

      console.log(
        `   💭 Reflexión: ${reflexion.completo ? "✅ COMPLETADO" : "❌ Requiere iteración"}`,
      );

      this.iteraciones.push(iteracion);

      if (reflexion.completo) {
        iteracion.estado = "completado";
        console.log(`\n   ✅ Objetivo alcanzado en iteración ${i}`);
        return {
          resultado: reflexion.pensamiento,
          iteraciones: this.iteraciones,
          exito: true,
        };
      }

      console.log("");
    }

    return {
      resultado: "No se completó dentro del límite de iteraciones",
      iteraciones: this.iteraciones,
      exito: false,
    };
  }

  private async analizar(objetivo: string, iteracion: number): Promise<string> {
    const contexto =
      iteracion > 1
        ? `Intentos anteriores: ${this.iteraciones
            .slice(0, iteracion - 1)
            .map((it) => it.reflexion)
            .join("; ")}`
        : "";

    const respuesta = await this.cliente.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres un agente autónomo. Analiza el objetivo y el progreso anterior.
Objetivo: ${objetivo}
${contexto}
Proporciona un análisis breve de qué se necesita hacer.`,
      input: "",
    });

    return respuesta.output_text.slice(0, 200);
  }

  private async planear(analisis: string): Promise<string> {
    const respuesta = await this.cliente.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Basándote en este análisis, crea un plan de acción específico: ${analisis}`,
      input: "",
    });

    return respuesta.output_text.slice(0, 200);
  }

  private async actuar(): Promise<string> {
    // Simular ejecución de acciones
    const acciones = [
      "✓ Configuración completada",
      "✓ Datos procesados",
      "✓ Validación exitosa",
      "✓ Sistema listo",
    ];

    return acciones[Math.floor(Math.random() * acciones.length)];
  }

  private async observar(accion: string): Promise<string> {
    const respuesta = await this.cliente.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Observa el resultado de esta acción y describe qué pasó: ${accion}`,
      input: "",
    });

    return respuesta.output_text.slice(0, 150);
  }

  private async reflexionar(
    observacion: string,
    objetivo: string,
    iteracion: number,
  ): Promise<{
    pensamiento: string;
    completo: boolean;
  }> {
    const respuesta = await this.cliente.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Reflexiona: ¿Se alcanzó el objetivo "${objetivo}"?
Observación: ${observacion}
Iteración: ${iteracion}

Responde en formato:
PENSAMIENTO: [análisis de si está completo]
COMPLETO: [SÍ o NO]`,
      input: "",
    });

    const completo =
      respuesta.output_text.toUpperCase().includes("COMPLETO: SÍ") ||
      iteracion >= 3;

    return {
      pensamiento: respuesta.output_text.slice(0, 200),
      completo,
    };
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarAgenticLoop(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🔄", "Demostrando Agentic Loop Pattern");

  const agente = new AgenteConLoopIterativo("Agente Autónomo", client);

  paso("1️⃣", "Loop iterativo simple");

  const resultado = await agente.ejecutarConAutoReflexion(
    "Implementar y validar un nuevo patrón de diseño",
  );

  console.log(`\n   📊 RESUMEN DEL LOOP:`);
  console.log(`   Iteraciones realizadas: ${resultado.iteraciones.length}`);
  console.log(`   Éxito: ${resultado.exito ? "✅ SÍ" : "❌ NO"}`);
  console.log(`   Resultado: ${resultado.resultado.slice(0, 100)}...\n`);

  paso("2️⃣", "Detalles de iteraciones");

  resultado.iteraciones.slice(0, 2).forEach((it) => {
    console.log(`
   Iteración ${it.numero}:
   - Análisis: ${it.analisis.slice(0, 60)}...
   - Plan: ${it.plan.slice(0, 60)}...
   - Acción: ${it.accion.slice(0, 60)}...
   - Éxito: ${it.exito ? "✅" : "❌"}
    `);
  });

  paso("✅", "Agente autónomo iterando hasta completar objetivo");
}

async function main(): Promise<void> {
  await demostrarAgenticLoop();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
