/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 59 — STRUCTURED OUTPUT VALIDATION (VALIDACIÓN ESTRUCTURADA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Prompt]
 *       │
 *       ▼
 *  [LLM]
 *       │
 *       ▼
 *  [Respuesta JSON/Schema]
 *       │
 *       ▼
 *  [Validador Zod/Schema]
 *  ├─ ¿Estructura correcta? ──SÍ──▶ Usar resultado
 *  └─ NO ──▶ [Bucle de Corrección]
 *             ├─ Enviar error al LLM
 *             └─ Pedir re-generación con schema
 *
 *  Idea: Garantizar que el LLM produce salidas que cumplen un schema
 *  estricto, con reintentos automáticos si falla la validación.
 *
 *  Ventajas:
 *  - Salidas garantizadas con tipos correctos
 *  - Integración directa con TypeScript
 *  - Auto-corrección de errores de formato
 *  - Cero errores de parsing en producción
 */

import { OpenAI } from "openai";
import { z } from "zod";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// Schemas de ejemplo
export const SchemaPlan = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  pasos: z.array(z.object({
    numero: z.number().int().positive(),
    accion: z.string().min(5),
    duracion: z.string(),
  })).min(1),
  prioridad: z.enum(["alta", "media", "baja"]),
  estimacion_dias: z.number().positive(),
});

export const SchemaAnalisis = z.object({
  tema: z.string(),
  ventajas: z.array(z.string()).min(1),
  desventajas: z.array(z.string()).min(1),
  recomendacion: z.string(),
  confianza: z.number().min(0).max(100),
});

export type Plan = z.infer<typeof SchemaPlan>;
export type Analisis = z.infer<typeof SchemaAnalisis>;

export class ValidadorEstructurado<T> {
  private client: OpenAI;
  private schema: z.ZodType<T>;
  private maxIntentos: number;

  constructor(schema: z.ZodType<T>, client: OpenAI = makeClient(), maxIntentos = 3) {
    this.schema = schema;
    this.client = client;
    this.maxIntentos = maxIntentos;
  }

  async generar(prompt: string): Promise<{ resultado: T; intentos: number }> {
    let ultimoError = "";

    for (let intento = 1; intento <= this.maxIntentos; intento++) {
      console.log(`   🔄 Intento ${intento}/${this.maxIntentos}`);

      const instrucciones = intento === 1
        ? `${prompt}\n\nResponde SOLO con JSON válido siguiendo exactamente esta estructura:\n${this.describir()}`
        : `El JSON anterior tenía errores: ${ultimoError}\n\nCorrige y devuelve JSON válido:\n${this.describir()}\n\nOriginal: ${prompt}`;

      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: instrucciones,
        input: "",
      });

      // Extraer JSON de la respuesta
      const jsonMatch = resp.output_text.match(/```json\n?([\s\S]+?)\n?```|(\{[\s\S]+\})/);
      const jsonStr = jsonMatch?.[1] ?? jsonMatch?.[2] ?? resp.output_text;

      try {
        const parsed = JSON.parse(jsonStr.trim());
        const validado = this.schema.parse(parsed);
        console.log(`   ✅ Validación exitosa en intento ${intento}`);
        return { resultado: validado, intentos: intento };
      } catch (err) {
        ultimoError = err instanceof Error ? err.message.slice(0, 200) : "Error desconocido";
        console.log(`   ⚠️  Intento ${intento} falló: ${ultimoError.slice(0, 80)}`);
      }
    }

    throw new Error(`No se pudo generar JSON válido en ${this.maxIntentos} intentos`);
  }

  private describir(): string {
    return JSON.stringify(this.schema.description ?? "Ver schema TypeScript", null, 2);
  }
}

export async function demostrarStructuredOutputValidation(client: OpenAI = makeClient()): Promise<void> {
  paso("📋", "Demostrando Structured Output Validation Pattern");

  paso("1️⃣", "Generar un Plan estructurado con validación");
  const generadorPlan = new ValidadorEstructurado(SchemaPlan, client);
  const { resultado: plan, intentos: i1 } = await generadorPlan.generar(
    "Crea un plan para implementar el patrón RAG en una empresa con 3 pasos claros.",
  );
  console.log(`\n   Plan generado en ${i1} intento(s):`);
  console.log(`   Título: ${plan.titulo}`);
  console.log(`   Pasos: ${plan.pasos.length} | Prioridad: ${plan.prioridad} | Estimación: ${plan.estimacion_dias} días\n`);

  paso("2️⃣", "Generar un Análisis estructurado");
  const generadorAnalisis = new ValidadorEstructurado(SchemaAnalisis, client);
  const { resultado: analisis, intentos: i2 } = await generadorAnalisis.generar(
    "Analiza las ventajas y desventajas del patrón Singleton en sistemas agénticos.",
  );
  console.log(`   Análisis en ${i2} intento(s):`);
  console.log(`   Tema: ${analisis.tema}`);
  console.log(`   Ventajas: ${analisis.ventajas.length} | Desventajas: ${analisis.desventajas.length}`);
  console.log(`   Confianza: ${analisis.confianza}%`);
  console.log(`   Recomendación: "${analisis.recomendacion.slice(0, 100)}..."\n`);

  paso("✅", "Structured Output Validation garantizando schemas correctos con auto-corrección");
}

async function main(): Promise<void> { await demostrarStructuredOutputValidation(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
