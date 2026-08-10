/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 51 — LONG-TERM MEMORY (MEMORIA A LARGO PLAZO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Sesión 1]                [Sesión 2]                [Sesión N]
 *  Conversación ──guardar──▶ [Memoria LT] ──recuperar──▶ Contexto
 *                            ├─ Perfil usuario
 *                            ├─ Preferencias
 *                            ├─ Historial relevante
 *                            └─ Hechos aprendidos
 *
 *  Idea: Mantener memoria persistente entre sesiones, aprendiendo
 *  del usuario y del dominio para personalizar respuestas futuras.
 *
 *  Diferencia vs RAG: RAG recupera documentos; LTM recupera
 *  experiencias y preferencias del usuario/agente.
 *
 *  Ventajas:
 *  - Personalización entre sesiones
 *  - Aprendizaje continuo sin re-entrenamiento
 *  - Contexto enriquecido automáticamente
 *  - Evita preguntas repetitivas
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Recuerdo {
  id: string;
  tipo: "hecho" | "preferencia" | "historial" | "perfil";
  contenido: string;
  relevancia: number; // 0-1
  timestamp: Date;
  accesos: number;
}

export class MemoriaLargoPlazo {
  private recuerdos: Recuerdo[] = [];
  private maxRecuerdos = 1000;

  guardar(tipo: Recuerdo["tipo"], contenido: string, relevancia = 0.5): Recuerdo {
    const r: Recuerdo = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tipo,
      contenido,
      relevancia,
      timestamp: new Date(),
      accesos: 0,
    };

    this.recuerdos.push(r);

    // Descartar los menos relevantes si excedemos límite
    if (this.recuerdos.length > this.maxRecuerdos) {
      this.recuerdos.sort((a, b) => b.relevancia - a.relevancia);
      this.recuerdos = this.recuerdos.slice(0, this.maxRecuerdos);
    }

    console.log(`   💾 Guardado [${tipo}]: "${contenido.slice(0, 60)}..."`);
    return r;
  }

  recuperar(consulta: string, topK = 5): Recuerdo[] {
    const palabrasClave = consulta.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

    const scored = this.recuerdos.map((r) => {
      const coincidencias = palabrasClave.filter((p) =>
        r.contenido.toLowerCase().includes(p),
      ).length;
      const score = coincidencias * 0.6 + r.relevancia * 0.3 + (r.accesos / 10) * 0.1;
      return { recuerdo: r, score };
    });

    const resultado = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((s) => {
        s.recuerdo.accesos++;
        return s.recuerdo;
      });

    console.log(`   🔍 Recuperados ${resultado.length} recuerdos relevantes`);
    return resultado;
  }

  obtenerPerfil(): Recuerdo[] {
    return this.recuerdos.filter((r) => r.tipo === "perfil" || r.tipo === "preferencia");
  }

  consolidar(): void {
    // Aumentar relevancia de los recuerdos más accedidos
    this.recuerdos.forEach((r) => {
      if (r.accesos > 5) r.relevancia = Math.min(1, r.relevancia + 0.1);
    });
    console.log(`   🔄 Memoria consolidada (${this.recuerdos.length} recuerdos)`);
  }
}

export class AgenteConMemoriaLP {
  private memoria: MemoriaLargoPlazo;
  private client: OpenAI;
  private usuarioId: string;

  constructor(usuarioId: string, client: OpenAI = makeClient()) {
    this.usuarioId = usuarioId;
    this.client = client;
    this.memoria = new MemoriaLargoPlazo();
    this.inicializarPerfil();
  }

  private inicializarPerfil(): void {
    // Simular memoria preexistente de sesiones anteriores
    this.memoria.guardar("perfil", `Usuario ${this.usuarioId} prefiere respuestas concisas`, 0.9);
    this.memoria.guardar("preferencia", "Prefiere ejemplos de código en TypeScript", 0.8);
    this.memoria.guardar("hecho", "Ha trabajado con patrones Factory y Singleton", 0.7);
    this.memoria.guardar("historial", "En sesiones anteriores preguntó sobre RAG y CoT", 0.6);
  }

  async responder(consulta: string): Promise<string> {
    console.log(`\n   🧠 Recuperando memoria relevante...`);
    const recuerdos = this.memoria.recuperar(consulta, 3);
    const perfil = this.memoria.obtenerPerfil();

    const contextoMemoria = [...perfil, ...recuerdos]
      .map((r) => `[${r.tipo}] ${r.contenido}`)
      .join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres un asistente con memoria de sesiones anteriores.

MEMORIA DEL USUARIO:
${contextoMemoria || "Sin memoria previa"}

CONSULTA ACTUAL: ${consulta}

Usa la memoria para personalizar tu respuesta.`,
      input: "",
    });

    // Aprender de esta interacción
    this.memoria.guardar("historial", `Preguntó: "${consulta.slice(0, 80)}"`, 0.5);

    return resp.output_text;
  }
}

export async function demostrarLongTermMemory(client: OpenAI = makeClient()): Promise<void> {
  paso("🧠", "Demostrando Long-Term Memory Pattern");

  const agente = new AgenteConMemoriaLP("user-rubences", client);

  paso("1️⃣", "Respuesta personalizada con memoria de sesiones anteriores");
  const r1 = await agente.responder("¿Qué patrón me recomiendas para gestionar conexiones?");
  console.log(`\n   Respuesta: "${r1.slice(0, 200)}..."\n`);

  paso("2️⃣", "Segunda consulta (usa historial acumulado)");
  const r2 = await agente.responder("¿Cómo combino RAG con patrones que ya conozco?");
  console.log(`\n   Respuesta: "${r2.slice(0, 200)}..."\n`);

  paso("✅", "Long-Term Memory personalizando respuestas entre sesiones");
}

async function main(): Promise<void> { await demostrarLongTermMemory(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
