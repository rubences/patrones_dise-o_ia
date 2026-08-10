/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 54 — REACT (REASONING + ACTING)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Problema]
 *       │
 *       ▼
 *  ╔══════════════════════════════════════════════╗
 *  ║  THOUGHT: "Necesito buscar información..."   ║
 *  ║  ACTION: buscar("término")                   ║
 *  ║  OBSERVATION: "Resultado de la búsqueda..."  ║
 *  ║                                              ║
 *  ║  THOUGHT: "Con esto puedo calcular..."       ║
 *  ║  ACTION: calcular("2 + 2")                   ║
 *  ║  OBSERVATION: "4"                            ║
 *  ║                                              ║
 *  ║  THOUGHT: "Tengo suficiente para responder"  ║
 *  ║  ACTION: responder("La respuesta es...")     ║
 *  ╚══════════════════════════════════════════════╝
 *
 *  Idea: Interleavar razonamiento (Thought) con acciones (Act)
 *  y observaciones (Observe) en un ciclo hasta resolver el problema.
 *
 *  Ventajas:
 *  - Razonamiento trazable paso a paso
 *  - Uso dinámico de herramientas
 *  - Auto-corrección basada en observaciones
 *  - Base de muchos frameworks agénticos (LangChain, etc.)
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type TipoAccion = "buscar" | "calcular" | "consultar_bd" | "responder";

export interface Paso {
  tipo: "thought" | "action" | "observation";
  contenido: string;
  accion?: TipoAccion;
  parametros?: string;
}

export class HerramientasREACT {
  async buscar(termino: string): Promise<string> {
    const resultados: Record<string, string> = {
      typescript: "TypeScript: lenguaje de Microsoft, superset tipado de JavaScript (2012).",
      react: "React: biblioteca de UI de Meta para aplicaciones web componentes (2013).",
      "patrones diseño": "23 patrones GoF organizados en Creacional, Estructural y Comportamiento.",
      openai: "OpenAI: empresa de IA fundada en 2015, creadora de GPT y DALL-E.",
    };
    const clave = Object.keys(resultados).find((k) => termino.toLowerCase().includes(k));
    return clave ? resultados[clave] : `Sin resultados para "${termino}"`;
  }

  calcular(expresion: string): string {
    try {
      const segura = expresion.replace(/[^0-9+\-*/().%\s]/g, "");
      return `${segura} = ${eval(segura)}`;
    } catch {
      return "Error en cálculo";
    }
  }

  consultarBD(tabla: string): string {
    const datos: Record<string, unknown[]> = {
      patrones: [{ id: 1, nombre: "Singleton" }, { id: 2, nombre: "Factory" }],
      usuarios: [{ id: 1, nombre: "Alice" }, { id: 2, nombre: "Bob" }],
    };
    return JSON.stringify(datos[tabla] ?? "Tabla no encontrada");
  }
}

export class AgenteREACT {
  private client: OpenAI;
  private herramientas: HerramientasREACT;
  private maxPasos = 8;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.herramientas = new HerramientasREACT();
  }

  async resolver(problema: string): Promise<{ respuesta: string; traza: Paso[] }> {
    console.log(`\n   🤔 REACT iniciando: "${problema.slice(0, 60)}..."`);
    const traza: Paso[] = [];
    let historial = "";

    for (let i = 0; i < this.maxPasos; i++) {
      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: `Resuelve el problema usando este formato REACT:
THOUGHT: [tu razonamiento]
ACTION: [buscar|calcular|consultar_bd|responder]("[parámetros]")

Problema: ${problema}

Historial:
${historial || "(inicio)"}

Continúa desde donde quedaste. Si tienes suficiente información usa ACTION: responder("respuesta final").`,
        input: "",
      });

      const texto = resp.output_text;
      const thought = texto.match(/THOUGHT:\s*(.+)/)?.[1]?.trim();
      const action = texto.match(/ACTION:\s*(\w+)\("([^"]*)"\)/);

      if (thought) {
        traza.push({ tipo: "thought", contenido: thought });
        console.log(`   💭 THOUGHT: ${thought.slice(0, 80)}`);
        historial += `\nTHOUGHT: ${thought}`;
      }

      if (action) {
        const tipoAccion = action[1] as TipoAccion;
        const params = action[2];
        traza.push({ tipo: "action", contenido: `${tipoAccion}("${params}")`, accion: tipoAccion, parametros: params });
        console.log(`   ⚙️  ACTION: ${tipoAccion}("${params.slice(0, 40)}")`);

        if (tipoAccion === "responder") {
          console.log(`   ✅ RESPUESTA FINAL`);
          return { respuesta: params, traza };
        }

        // Ejecutar acción
        let observacion: string;
        if (tipoAccion === "buscar") observacion = await this.herramientas.buscar(params);
        else if (tipoAccion === "calcular") observacion = this.herramientas.calcular(params);
        else if (tipoAccion === "consultar_bd") observacion = this.herramientas.consultarBD(params);
        else observacion = "Acción desconocida";

        traza.push({ tipo: "observation", contenido: observacion });
        console.log(`   👁️  OBS: ${observacion.slice(0, 80)}`);
        historial += `\nACTION: ${tipoAccion}("${params}")\nOBSERVATION: ${observacion}`;
      }
    }

    return { respuesta: "Límite de pasos alcanzado", traza };
  }
}

export async function demostrarREACT(client: OpenAI = makeClient()): Promise<void> {
  paso("⚡", "Demostrando REACT Pattern (Reasoning + Acting)");

  const agente = new AgenteREACT(client);

  paso("1️⃣", "Problema que requiere búsqueda y cálculo");
  const { respuesta, traza } = await agente.resolver(
    "¿Cuántos años tiene TypeScript y cuántos patrones de diseño existen?",
  );
  console.log(`\n   Pasos ejecutados: ${traza.length}`);
  console.log(`   Respuesta: "${respuesta.slice(0, 150)}"\n`);

  paso("2️⃣", "Consulta simple");
  const r2 = await agente.resolver("Busca información sobre OpenAI.");
  console.log(`\n   Pasos: ${r2.traza.length} | Respuesta: "${r2.respuesta.slice(0, 100)}..."`);

  paso("✅", "REACT intercalando razonamiento y acciones para resolver problemas");
}

async function main(): Promise<void> { await demostrarREACT(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
