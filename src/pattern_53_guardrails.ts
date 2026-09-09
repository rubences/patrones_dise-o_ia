/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 53 — GUARDRAILS (BARRERAS DE SEGURIDAD)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada]           [Salida LLM]
 *       │                    │
 *       ▼                    ▼
 *  [Input Guardrail]  [Output Guardrail]
 *  ├─ Detectar PII    ├─ Revisar contenido
 *  ├─ Filtrar temas   ├─ Validar formato
 *  ├─ Rate limiting   ├─ Eliminar datos sensibles
 *  └─ Sanitizar       └─ Verificar policy
 *       │                    │
 *       ▼                    ▼
 *  [LLM]           [Respuesta segura]
 *
 *  Idea: Capas de control de seguridad antes y después del LLM.
 *  Los clasificadores generativos son una señal, no una frontera de
 *  autorización: las acciones sensibles requieren controles deterministas.
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type RiesgoCategoría = "pii" | "contenido_inapropiado" | "topic_prohibido" | "datos_sensibles" | "ninguno";
export type VeredictoSeguridad = "seguro" | "inseguro" | "invalido";

export interface ResultadoGuardrail {
  aprobado: boolean;
  categoria?: RiesgoCategoría;
  razon?: string;
  textoSanitizado?: string;
}

/**
 * Interpreta únicamente etiquetas exactas. Nunca usa `includes("SEGURO")`:
 * `INSEGURO` contiene esa subcadena y produciría un fail-open crítico.
 */
export function interpretarVeredictoSeguridad(texto: string): VeredictoSeguridad {
  const normalizado = texto.trim().toUpperCase().replace(/[.!]+$/g, "").trim();
  if (normalizado === "SEGURO") return "seguro";
  if (normalizado === "INSEGURO") return "inseguro";
  return "invalido";
}

export class GuardrailInput {
  // Patrones de PII simplificados para la demo. Conservan `g` para redactar
  // todas las apariciones, pero reseteamos lastIndex antes y después de `.test()`.
  private patronesPII = [
    /\b\d{3}-\d{2}-\d{4}\b/g,
    /\b4\d{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ];

  // Lista pedagógica. En producción, la policy debe evaluar intención/contexto
  // y no bloquear investigación defensiva por mera coincidencia léxica.
  private topicsProhibidos = ["hackear", "exploit", "malware", "phishing", "bypass seguridad"];

  revisar(texto: string): ResultadoGuardrail {
    for (const patron of this.patronesPII) {
      patron.lastIndex = 0;
      const detectado = patron.test(texto);
      patron.lastIndex = 0;

      if (detectado) {
        const textoSanitizado = texto.replace(patron, "[REDACTADO]");
        patron.lastIndex = 0;
        return {
          aprobado: false,
          categoria: "pii",
          razon: "Datos personales detectados",
          textoSanitizado,
        };
      }
    }

    const topicDetectado = this.topicsProhibidos.find((t) =>
      texto.toLowerCase().includes(t),
    );
    if (topicDetectado) {
      return {
        aprobado: false,
        categoria: "topic_prohibido",
        razon: `Tema no permitido: ${topicDetectado}`,
      };
    }

    return { aprobado: true };
  }
}

export class GuardrailOutput {
  private palabrasProhibidas = ["contraseña:", "password:", "api_key:", "secret:"];

  async revisar(texto: string, client: OpenAI): Promise<ResultadoGuardrail> {
    const sensible = this.palabrasProhibidas.find((p) =>
      texto.toLowerCase().includes(p),
    );
    if (sensible) {
      return { aprobado: false, categoria: "datos_sensibles", razon: `Posible leak: ${sensible}` };
    }

    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Clasifica el siguiente texto según la policy de seguridad.\n\nTexto: "${texto.slice(0, 200)}"\n\nResponde únicamente con una etiqueta exacta: SEGURO o INSEGURO.`,
      input: "",
    });

    const veredicto = interpretarVeredictoSeguridad(resp.output_text);
    if (veredicto === "seguro") {
      return { aprobado: true, categoria: "ninguno" };
    }
    if (veredicto === "inseguro") {
      return {
        aprobado: false,
        categoria: "contenido_inapropiado",
        razon: "Contenido potencialmente inapropiado",
      };
    }

    // Fail closed ante formato inesperado: un fallo del clasificador nunca se
    // convierte silenciosamente en aprobación.
    return {
      aprobado: false,
      categoria: "contenido_inapropiado",
      razon: "Veredicto de seguridad inválido",
    };
  }
}

export class AgenteConGuardrails {
  private inputGuardrail: GuardrailInput;
  private outputGuardrail: GuardrailOutput;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.inputGuardrail = new GuardrailInput();
    this.outputGuardrail = new GuardrailOutput();
  }

  async procesar(entrada: string): Promise<{ respuesta: string; bloqueado: boolean; razon?: string }> {
    console.log(`\n   🛡️  Input Guardrail...`);
    const checkInput = this.inputGuardrail.revisar(entrada);

    if (!checkInput.aprobado) {
      console.log(`   🔴 Input bloqueado: ${checkInput.razon}`);
      if (checkInput.textoSanitizado) {
        console.log(`   🔧 Usando versión sanitizada`);
        entrada = checkInput.textoSanitizado;
      } else {
        return { respuesta: `No puedo procesar esta solicitud: ${checkInput.razon}`, bloqueado: true, razon: checkInput.razon };
      }
    }

    console.log(`   ✅ Input aprobado → LLM`);
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: entrada,
      input: "",
    });

    console.log(`   🛡️  Output Guardrail...`);
    const checkOutput = await this.outputGuardrail.revisar(resp.output_text, this.client);

    if (!checkOutput.aprobado) {
      console.log(`   🔴 Output bloqueado: ${checkOutput.razon}`);
      return { respuesta: "La respuesta generada no cumple las políticas de seguridad.", bloqueado: true, razon: checkOutput.razon };
    }

    console.log(`   ✅ Output aprobado`);
    return { respuesta: resp.output_text, bloqueado: false };
  }
}

export async function demostrarGuardrails(client: OpenAI = makeClient()): Promise<void> {
  paso("🛡️", "Demostrando Guardrails Pattern");

  const agente = new AgenteConGuardrails(client);

  paso("1️⃣", "Entrada normal (aprobada)");
  const r1 = await agente.procesar("¿Qué es el patrón Circuit Breaker?");
  console.log(`   Bloqueado: ${r1.bloqueado} | Respuesta: "${r1.respuesta.slice(0, 100)}..."\n`);

  paso("2️⃣", "Entrada con PII (sanitizada)");
  const r2 = await agente.procesar("Mi email es user@example.com. ¿Qué es RAG?");
  console.log(`   Bloqueado: ${r2.bloqueado} | Respuesta: "${r2.respuesta.slice(0, 100)}..."\n`);

  paso("3️⃣", "Topic prohibido (bloqueado por la policy pedagógica)");
  const r3 = await agente.procesar("Explícame cómo hackear un sistema");
  console.log(`   Bloqueado: ${r3.bloqueado} | Razón: ${r3.razon}\n`);

  paso("✅", "Guardrails filtrando entradas y salidas con parsing fail-closed");
}

async function main(): Promise<void> { await demostrarGuardrails(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
