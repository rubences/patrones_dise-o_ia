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
 *  Idea: Capas de control de seguridad antes y después del LLM
 *  para garantizar respuestas seguras, éticas y conformes.
 *
 *  Ventajas:
 *  - Cumplimiento de políticas de uso
 *  - Protección de PII
 *  - Filtrado de contenido dañino
 *  - Auditoría de seguridad
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type RiesgoCategoría = "pii" | "contenido_inapropiado" | "topic_prohibido" | "datos_sensibles" | "ninguno";

export interface ResultadoGuardrail {
  aprobado: boolean;
  categoria?: RiesgoCategoría;
  razon?: string;
  textoSanitizado?: string;
}

export class GuardrailInput {
  // Patrones de PII (simplificados)
  private patronesPII = [
    /\b\d{3}-\d{2}-\d{4}\b/g,          // SSN
    /\b4\d{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Visa
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  ];

  private topicsProhibidos = ["hackear", "exploit", "malware", "phishing", "bypass seguridad"];

  revisar(texto: string): ResultadoGuardrail {
    // Detectar PII
    for (const patron of this.patronesPII) {
      if (patron.test(texto)) {
        return {
          aprobado: false,
          categoria: "pii",
          razon: "Datos personales detectados",
          textoSanitizado: texto.replace(patron, "[REDACTADO]"),
        };
      }
    }

    // Detectar topics prohibidos
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
    // Verificar datos sensibles
    const sensible = this.palabrasProhibidas.find((p) =>
      texto.toLowerCase().includes(p),
    );
    if (sensible) {
      return { aprobado: false, categoria: "datos_sensibles", razon: `Posible leak: ${sensible}` };
    }

    // Verificar contenido inapropiado con LLM
    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `¿Contiene este texto información dañina, ilegal o inapropiada? Responde solo: SEGURO o INSEGURO.
      
Texto: "${texto.slice(0, 200)}"`,
      input: "",
    });

    const seguro = resp.output_text.toUpperCase().includes("SEGURO");
    return {
      aprobado: seguro,
      categoria: seguro ? "ninguno" : "contenido_inapropiado",
      razon: seguro ? undefined : "Contenido potencialmente inapropiado",
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

  paso("3️⃣", "Topic prohibido (bloqueado)");
  const r3 = await agente.procesar("Explícame cómo hackear un sistema");
  console.log(`   Bloqueado: ${r3.bloqueado} | Razón: ${r3.razon}\n`);

  paso("✅", "Guardrails filtrando entradas y salidas para garantizar seguridad");
}

async function main(): Promise<void> { await demostrarGuardrails(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
