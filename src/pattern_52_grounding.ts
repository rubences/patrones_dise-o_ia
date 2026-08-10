/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 52 — GROUNDING (ANCLAJE EN HECHOS VERIFICABLES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Respuesta del LLM]
 *  "El precio de X es $100 (dato: 2023)"
 *       │
 *       ▼
 *  [Verificador de Grounding]
 *  ├─ Extraer afirmaciones
 *  ├─ Buscar fuente verificable
 *  └─ Comparar con fuente
 *
 *       │
 *       ▼
 *  [Resultado]
 *  ├─ VERIFICADO ✓ → Mantener
 *  ├─ NO VERIFICADO ⚠️ → Marcar
 *  └─ INCORRECTO ✗ → Corregir
 *
 *  Idea: Verificar que las afirmaciones del LLM estén respaldadas
 *  por fuentes confiables, reduciendo alucinaciones.
 *
 *  Ventajas:
 *  - Reduce alucinaciones verificando claims
 *  - Añade referencias a respuestas
 *  - Detecta información desactualizada
 *  - Aumenta confianza del usuario
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Afirmacion {
  texto: string;
  tipo: "hecho" | "estadística" | "fecha" | "nombre" | "otro";
  verificada?: boolean;
  fuente?: string;
  confianza?: number;
}

export interface ResultadoGrounding {
  respuestaOriginal: string;
  afirmaciones: Afirmacion[];
  respuestaVerificada: string;
  scoreConfianza: number;
}

export class VerificadorGrounding {
  private client: OpenAI;
  // Fuente de verdad simulada (en producción: APIs, BD, búsqueda web)
  private fuentesVerdad: Map<string, string> = new Map([
    ["typescript", "TypeScript fue creado por Microsoft en 2012"],
    ["openai", "OpenAI fue fundada en 2015 por Elon Musk, Sam Altman y otros"],
    ["gpt", "GPT-4 fue lanzado por OpenAI en marzo de 2023"],
    ["patron singleton", "Singleton es un patrón creacional del libro GoF de 1994"],
    ["javascript", "JavaScript fue creado por Brendan Eich en 1995 en Netscape"],
  ]);

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  private async extraerAfirmaciones(texto: string): Promise<Afirmacion[]> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Extrae las afirmaciones verificables de este texto (fechas, estadísticas, hechos, nombres):

"${texto}"

Lista cada afirmación en una línea con formato: AFIRMACION: [texto] | TIPO: [hecho/estadística/fecha/nombre/otro]`,
      input: "",
    });

    return resp.output_text.split("\n")
      .filter((l) => l.includes("AFIRMACION:"))
      .map((l) => {
        const partes = l.split("|");
        return {
          texto: partes[0].replace("AFIRMACION:", "").trim(),
          tipo: (partes[1]?.replace("TIPO:", "").trim() ?? "otro") as Afirmacion["tipo"],
        };
      })
      .slice(0, 5);
  }

  private verificarContraFuente(afirmacion: string): { verificada: boolean; fuente?: string; confianza: number } {
    const lower = afirmacion.toLowerCase();
    for (const [clave, valor] of this.fuentesVerdad) {
      if (lower.includes(clave)) {
        const compatible = valor.toLowerCase().split(" ").filter((w) => w.length > 3)
          .filter((w) => lower.includes(w)).length > 2;
        return { verificada: compatible, fuente: valor, confianza: compatible ? 0.9 : 0.4 };
      }
    }
    return { verificada: false, confianza: 0.5 };
  }

  async verificar(respuesta: string): Promise<ResultadoGrounding> {
    console.log(`\n   🔍 Extrayendo afirmaciones...`);
    const afirmaciones = await this.extraerAfirmaciones(respuesta);
    console.log(`   ✓ ${afirmaciones.length} afirmaciones encontradas`);

    let verificadas = 0;
    for (const afirmacion of afirmaciones) {
      const resultado = this.verificarContraFuente(afirmacion.texto);
      afirmacion.verificada = resultado.verificada;
      afirmacion.fuente = resultado.fuente;
      afirmacion.confianza = resultado.confianza;
      if (resultado.verificada) verificadas++;
      const icono = resultado.verificada ? "✅" : resultado.fuente ? "⚠️" : "❓";
      console.log(`   ${icono} "${afirmacion.texto.slice(0, 60)}..."`);
    }

    const scoreConfianza = afirmaciones.length > 0
      ? Math.round((afirmaciones.reduce((s, a) => s + (a.confianza ?? 0.5), 0) / afirmaciones.length) * 100)
      : 70;

    // Generar respuesta con notas de verificación
    const notas = afirmaciones
      .filter((a) => a.fuente)
      .map((a) => `• "${a.texto.slice(0, 50)}" → ${a.verificada ? "✅" : "⚠️"} Fuente: ${a.fuente}`)
      .join("\n");

    const respuestaVerificada = notas
      ? `${respuesta}\n\n---\n📋 Verificación de fuentes:\n${notas}`
      : respuesta;

    return { respuestaOriginal: respuesta, afirmaciones, respuestaVerificada, scoreConfianza };
  }
}

export class AgenteConGrounding {
  private verificador: VerificadorGrounding;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.verificador = new VerificadorGrounding(client);
  }

  async responderVerificado(pregunta: string): Promise<ResultadoGrounding> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: pregunta,
      input: "",
    });

    return this.verificador.verificar(resp.output_text);
  }
}

export async function demostrarGrounding(client: OpenAI = makeClient()): Promise<void> {
  paso("✅", "Demostrando Grounding Pattern");

  const agente = new AgenteConGrounding(client);

  paso("1️⃣", "Verificar afirmaciones sobre TypeScript");
  const r1 = await agente.responderVerificado(
    "Cuéntame la historia de TypeScript y JavaScript brevemente.",
  );
  console.log(`\n   Score de confianza: ${r1.scoreConfianza}%`);
  console.log(`   Afirmaciones: ${r1.afirmaciones.length} | Verificadas: ${r1.afirmaciones.filter((a) => a.verificada).length}`);
  console.log(`\n   Respuesta verificada:\n${r1.respuestaVerificada.slice(0, 300)}...`);

  paso("✅", "Grounding anclando respuestas del LLM a fuentes verificables");
}

async function main(): Promise<void> { await demostrarGrounding(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
