/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 79 — STREAMING (RESPUESTAS EN TIEMPO REAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Sin Streaming:
 *  Cliente ──────────── espera 3s ────────────▶ Respuesta completa
 *
 *  Con Streaming:
 *  Cliente ──▶ token1 ──▶ token2 ──▶ token3 ──▶ ... ──▶ FIN
 *              (50ms)    (50ms)    (50ms)
 *
 *  Pipeline de Streaming:
 *  [Fuente Stream]
 *       │ tokens
 *       ▼
 *  [Transformadores]
 *  ├─ Filtrar tokens vacíos
 *  ├─ Detectar marcadores especiales
 *  └─ Acumular para parseo
 *       │
 *       ▼
 *  [Consumidores]
 *  ├─ UI: renderizar en tiempo real
 *  ├─ Logger: guardar tokens
 *  └─ Detector: buscar patterns
 *
 *  Ventajas:
 *  - Percepción de respuesta instantánea
 *  - Menor latencia percibida
 *  - Interrupción temprana si detecta problemas
 *  - Procesamiento incremental
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type TransformadorStream = (token: string, acumulado: string) => string | null;
export type ConsumidorStream = (token: string, acumulado: string) => void;

export interface ConfigStream {
  onToken?: ConsumidorStream;
  onCompletado?: (texto: string) => void;
  onError?: (error: Error) => void;
  transformadores?: TransformadorStream[];
  maxTokens?: number;
}

export class StreamProcessor {
  private config: ConfigStream;
  private acumulado: string = "";
  private tokenCount: number = 0;

  constructor(config: ConfigStream = {}) {
    this.config = config;
  }

  procesarToken(token: string): boolean {
    if (!token) return true;

    // Aplicar transformadores
    let tokenTransformado: string | null = token;
    for (const transformador of (this.config.transformadores ?? [])) {
      if (tokenTransformado === null) break;
      tokenTransformado = transformador(tokenTransformado, this.acumulado);
    }

    if (tokenTransformado === null) return true; // Token filtrado

    this.acumulado += tokenTransformado;
    this.tokenCount++;

    // Notificar consumidores
    this.config.onToken?.(tokenTransformado, this.acumulado);

    // Verificar límite de tokens
    if (this.config.maxTokens && this.tokenCount >= this.config.maxTokens) {
      return false; // Señal de parar
    }

    return true; // Continuar
  }

  completar(): void {
    this.config.onCompletado?.(this.acumulado);
  }

  obtenerAcumulado(): string {
    return this.acumulado;
  }

  reiniciar(): void {
    this.acumulado = "";
    this.tokenCount = 0;
  }
}

// Transformadores reutilizables
export const TRANSFORMADORES = {
  filtrarVacios: (): TransformadorStream =>
    (token) => token.trim() === "" ? null : token,

  detectarMarcador: (marcador: string, callback: () => void): TransformadorStream =>
    (token, acumulado) => {
      if ((acumulado + token).includes(marcador)) callback();
      return token;
    },

  limitarLineas: (maxLineas: number): TransformadorStream =>
    (token, acumulado) => {
      const lineas = acumulado.split("\n").length;
      return lineas > maxLineas ? null : token;
    },
};

export class AgenteConStreaming {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async responderStreaming(
    prompt: string,
    config: ConfigStream = {},
  ): Promise<string> {
    const processor = new StreamProcessor(config);

    // Simular streaming dividiendo la respuesta en tokens
    // (La API real de OpenAI soporta streaming nativo con stream: true)
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: prompt,
      input: "",
    });

    const textoCompleto = resp.output_text;

    // Simular entrega token por token con delay
    const palabras = textoCompleto.split(" ");
    for (const palabra of palabras) {
      const continuar = processor.procesarToken(palabra + " ");
      if (!continuar) {
        console.log(`\n   [Stream interrumpido por límite]`);
        break;
      }
      // Pequeña pausa para simular streaming real
      await new Promise((r) => setTimeout(r, 10));
    }

    processor.completar();
    return processor.obtenerAcumulado();
  }

  async responderStreamingConPipeline(prompt: string): Promise<{
    texto: string;
    tokensRecibidos: number;
    marcadoresDetectados: string[];
  }> {
    const marcadoresDetectados: string[] = [];
    let tokensRecibidos = 0;

    const texto = await this.responderStreaming(prompt, {
      onToken: () => {
        tokensRecibidos++;
        // Mostrar progreso cada 5 tokens
        if (tokensRecibidos % 5 === 0) {
          process.stdout.write(".");
        }
      },
      onCompletado: (textoFinal) => {
        console.log(`\n   [Stream completado: ${textoFinal.split(" ").length} palabras]`);
      },
      transformadores: [
        TRANSFORMADORES.detectarMarcador("patrón", () => marcadoresDetectados.push("mención-de-patrón")),
        TRANSFORMADORES.detectarMarcador("importante", () => marcadoresDetectados.push("contenido-importante")),
      ],
    });

    return { texto, tokensRecibidos, marcadoresDetectados };
  }
}

export async function demostrarStreaming(client: OpenAI = makeClient()): Promise<void> {
  paso("📡", "Demostrando Streaming Pattern");

  const agente = new AgenteConStreaming(client);

  paso("1️⃣", "Streaming básico con callback por token");

  let tokensMostrados = 0;
  process.stdout.write("   Tokens: ");

  await agente.responderStreaming("Explica brevemente el patrón Observer en 3 oraciones.", {
    onToken: (token) => {
      if (tokensMostrados < 8) {
        process.stdout.write(`[${token.trim()}]`);
        tokensMostrados++;
      } else if (tokensMostrados === 8) {
        process.stdout.write("...");
        tokensMostrados++;
      }
    },
    onCompletado: (texto) => {
      console.log(`\n   Completo (${texto.split(" ").length} palabras)`);
    },
  });

  paso("2️⃣", "Streaming con pipeline (transformadores + detección de marcadores)");

  const { texto, tokensRecibidos, marcadoresDetectados } =
    await agente.responderStreamingConPipeline(
      "Explica el patrón Observer y por qué es importante en sistemas de IA",
    );

  console.log(`\n   Texto recibido: "${texto.trim().slice(0, 100)}..."`);
  console.log(`   Tokens recibidos: ${tokensRecibidos}`);
  console.log(`   Marcadores detectados: ${marcadoresDetectados.length > 0 ? marcadoresDetectados.join(", ") : "ninguno"}`);

  paso("3️⃣", "Streaming con límite de tokens (interrupción temprana)");

  const textoLimitado = await agente.responderStreaming(
    "Escribe un ensayo largo sobre los patrones de diseño",
    { maxTokens: 15, onToken: (t) => process.stdout.write(t) },
  );
  console.log(`\n   Texto recibido (limitado): "${textoLimitado.trim().slice(0, 100)}..."`);

  paso("✅", "Streaming entregando tokens en tiempo real con pipeline configurable");
}

async function main(): Promise<void> { await demostrarStreaming(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
