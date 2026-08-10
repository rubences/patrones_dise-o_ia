/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 89 — PII REDACTION / ANONYMIZATION (ANONIMIZACIÓN DE PII)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Texto con datos personales]
 *  "Juan Pérez (juan@mail.com) llamó desde 84.23.11.5 el 15/03/1990"
 *       │
 *       ▼
 *  [Anonimizador] ── modo "tokenizar" (reversible) ──▶ [PERSONA_1] ([EMAIL_1])
 *                                                       llamó desde [IP_1] el [FECHA_1]
 *       │
 *       └── modo "redactar" (irreversible) ──▶ [PERSONA_REDACTADA] ([EMAIL_REDACTADO])
 *                                               llamó desde [IP_REDACTADA] el [FECHA_REDACTADA]
 *
 *  Idea: antes de enviar texto de usuario a un LLM (proveedor externo),
 *  reemplazar datos personales por marcadores. En modo "tokenizar" el
 *  mismo dato produce SIEMPRE el mismo token dentro de una sesión
 *  (juan@mail.com → [EMAIL_1] la primera vez y todas las siguientes),
 *  lo que mantiene la conversación coherente sin exponer el dato real
 *  — y permite reidentificar más tarde solo a sistemas autorizados.
 *
 *  Diferencia vs Patrón 71 (Secret Detection): 71 se centra en
 *  CREDENCIALES (API keys, tokens, connection strings) y trata un par
 *  de categorías de PII como algo secundario, con enmascarado siempre
 *  irreversible pese a documentarlo como "reversible". Este patrón
 *  SÍ implementa la tokenización reversible de verdad (mapeo
 *  bidireccional en memoria) y cubre categorías de PII que 71 no
 *  toca: nombre completo, IP, fecha de nacimiento.
 *
 *  Diferencia vs Patrón 53 (Guardrails): Guardrails usa la detección
 *  de PII solo como un motivo de RECHAZO binario de la entrada. Este
 *  patrón es un módulo de transformación reutilizable (anonimizar →
 *  procesar → reidentificar), no un guardrail de aprobar/rechazar.
 *
 *  Ventajas:
 *  - Tokenización consistente: mismo dato → mismo token en la sesión
 *  - Reversible bajo control (solo quien tiene el `AnonimizadorPII`
 *    original puede reidentificar — el LLM externo nunca lo tiene)
 *  - Modo "redactar" para cuando ni siquiera se necesita reidentificar
 *  - Reduce superficie de exposición de datos personales a proveedores externos
 */

import { isDirectRun, paso } from "./common.js";

export type CategoriaPII = "nombre" | "email" | "telefono" | "tarjeta_credito" | "ip" | "fecha_nacimiento";

export interface HallazgoPII {
  categoria: CategoriaPII;
  valorOriginal: string;
  token: string;
}

export type ModoAnonimizacion = "redactar" | "tokenizar";

const PATRONES: { regex: RegExp; categoria: CategoriaPII }[] = [
  { regex: /\b[A-ZÁÉÍÓÚ][a-záéíóú]+\s[A-ZÁÉÍÓÚ][a-záéíóú]+\b/g, categoria: "nombre" },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, categoria: "email" },
  { regex: /\b(?:\+34\s?)?[6-9]\d{8}\b/g, categoria: "telefono" },
  { regex: /\b4[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, categoria: "tarjeta_credito" },
  { regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, categoria: "ip" },
  { regex: /\b\d{2}\/\d{2}\/\d{4}\b/g, categoria: "fecha_nacimiento" },
];

export class AnonimizadorPII {
  private tokenPorValor = new Map<string, string>();
  private valorPorToken = new Map<string, string>();
  private contadores: Partial<Record<CategoriaPII, number>> = {};

  private tokenPara(categoria: CategoriaPII, valorOriginal: string): string {
    const existente = this.tokenPorValor.get(valorOriginal);
    if (existente) return existente;

    this.contadores[categoria] = (this.contadores[categoria] ?? 0) + 1;
    const token = `[${categoria.toUpperCase()}_${this.contadores[categoria]}]`;
    this.tokenPorValor.set(valorOriginal, token);
    this.valorPorToken.set(token, valorOriginal);
    return token;
  }

  anonimizar(texto: string, modo: ModoAnonimizacion = "tokenizar"): { textoAnonimizado: string; hallazgos: HallazgoPII[] } {
    let resultado = texto;
    const hallazgos: HallazgoPII[] = [];

    for (const { regex, categoria } of PATRONES) {
      regex.lastIndex = 0;
      resultado = resultado.replace(regex, (valorOriginal) => {
        const marcador = modo === "tokenizar" ? this.tokenPara(categoria, valorOriginal) : `[${categoria.toUpperCase()}_REDACTADO]`;
        hallazgos.push({ categoria, valorOriginal, token: marcador });
        return marcador;
      });
    }

    return { textoAnonimizado: resultado, hallazgos };
  }

  // Solo tiene sentido en modo "tokenizar" — requiere el mismo AnonimizadorPII
  // que hizo la anonimización original (su mapeo vive en memoria del proceso).
  reidentificar(textoAnonimizado: string): string {
    let resultado = textoAnonimizado;
    for (const [token, valorOriginal] of this.valorPorToken) {
      resultado = resultado.split(token).join(valorOriginal);
    }
    return resultado;
  }
}

export async function demostrarPIIRedaction(): Promise<void> {
  paso("🕵️", "Demostrando PII Redaction / Anonymization Pattern");

  const texto = "Juan Pérez (juan.perez@empresa.com, tel 612345678) reportó el problema desde IP 84.23.11.5, nacido el 15/03/1990.";

  paso("1️⃣", "Modo 'redactar': irreversible, para cuando no hace falta recuperar el dato");
  const anonimizadorRedact = new AnonimizadorPII();
  const rRedact = anonimizadorRedact.anonimizar(texto, "redactar");
  console.log(`   Original:    "${texto}"`);
  console.log(`   Redactado:   "${rRedact.textoAnonimizado}"`);
  console.log(`   Categorías detectadas: ${[...new Set(rRedact.hallazgos.map((h) => h.categoria))].join(", ")}`);

  paso("2️⃣", "Modo 'tokenizar': reversible y consistente dentro de la sesión");
  const anonimizador = new AnonimizadorPII();
  const r1 = anonimizador.anonimizar(texto, "tokenizar");
  console.log(`   Tokenizado:  "${r1.textoAnonimizado}"`);

  const segundoMensaje = "Contactar de nuevo a juan.perez@empresa.com para seguimiento.";
  const r2 = anonimizador.anonimizar(segundoMensaje, "tokenizar");
  console.log(`\n   Segundo mensaje: "${segundoMensaje}"`);
  console.log(`   Tokenizado:      "${r2.textoAnonimizado}" ← mismo [EMAIL_1] que antes, no [EMAIL_2]`);

  paso("3️⃣", "Reidentificación — solo posible con el AnonimizadorPII original");
  const textoConToken = `Resumen: [NOMBRE_1] fue contactado en [EMAIL_1].`;
  console.log(`   Texto con tokens (lo que ve el LLM externo): "${textoConToken}"`);
  console.log(`   Reidentificado (solo backend autorizado):    "${anonimizador.reidentificar(textoConToken)}"`);

  paso("✅", "PII Redaction protegiendo datos personales sin perder coherencia conversacional");
}

async function main(): Promise<void> {
  await demostrarPIIRedaction();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
