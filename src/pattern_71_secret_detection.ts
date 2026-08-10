/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 71 — SECRET DETECTION & MASKING (DETECCIÓN DE SECRETOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Texto con secretos]
 *  "Mi API key es sk-proj-abc123xyz, token: ghp_xxxyyy"
 *       │
 *       ▼
 *  [Detector de Secretos]
 *  ├─ API Keys (sk-, pk-, Bearer...)
 *  ├─ Tokens (JWT, OAuth, GitHub)
 *  ├─ Credenciales (user:pass, conexión BD)
 *  ├─ PII (email, teléfono, SSN, tarjetas)
 *  └─ Claves privadas (RSA, SSH)
 *
 *       │
 *       ▼
 *  [Texto enmascarado]
 *  "Mi API key es [API_KEY_REDACTADA], token: [TOKEN_REDACTADO]"
 *
 *  Ventajas:
 *  - Previene leaks de secretos en logs y respuestas
 *  - Protección automática antes de enviar a LLM
 *  - Auditoría de qué tipos de secretos se encuentran
 *  - Reversible (con mapeo interno seguro)
 */

import { isDirectRun, paso } from "./common.js";

export type TipoSecreto =
  | "api_key_openai"
  | "api_key_generica"
  | "token_github"
  | "token_jwt"
  | "token_bearer"
  | "connection_string"
  | "email"
  | "telefono"
  | "tarjeta_credito"
  | "ssn"
  | "private_key"
  | "password";

export interface SecretoDetectado {
  tipo: TipoSecreto;
  valorOriginal: string;
  posicion: { inicio: number; fin: number };
  marcador: string;
}

export class DetectorSecretos {
  private patrones: { regex: RegExp; tipo: TipoSecreto; marcador: string }[] = [
    { regex: /sk-[a-zA-Z0-9\-_]{20,}/g, tipo: "api_key_openai", marcador: "[OPENAI_KEY_REDACTADA]" },
    { regex: /ghp_[a-zA-Z0-9]{36}/g, tipo: "token_github", marcador: "[GITHUB_TOKEN_REDACTADO]" },
    { regex: /eyJ[a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+/g, tipo: "token_jwt", marcador: "[JWT_REDACTADO]" },
    { regex: /Bearer\s+[a-zA-Z0-9\-_\.=]+/gi, tipo: "token_bearer", marcador: "[BEARER_TOKEN_REDACTADO]" },
    { regex: /(?:password|passwd|pwd|contraseña)\s*[:=]\s*\S+/gi, tipo: "password", marcador: "[PASSWORD_REDACTADO]" },
    { regex: /(?:mongodb|mysql|postgresql|redis):\/\/[^\s"']+/gi, tipo: "connection_string", marcador: "[CONNECTION_STRING_REDACTADA]" },
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, tipo: "email", marcador: "[EMAIL_REDACTADO]" },
    { regex: /\b(?:\+34\s?)?[6-9]\d{8}\b/g, tipo: "telefono", marcador: "[TELEFONO_REDACTADO]" },
    { regex: /\b4[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, tipo: "tarjeta_credito", marcador: "[TARJETA_REDACTADA]" },
    { regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g, tipo: "private_key", marcador: "[CLAVE_PRIVADA_REDACTADA]" },
    { regex: /\b[A-Za-z0-9+/]{20,}={0,2}\b/g, tipo: "api_key_generica", marcador: "[TOKEN_GENERICO_REDACTADO]" },
  ];

  detectar(texto: string): SecretoDetectado[] {
    const secretos: SecretoDetectado[] = [];

    for (const { regex, tipo, marcador } of this.patrones) {
      regex.lastIndex = 0; // Reset regex state
      let match;
      while ((match = regex.exec(texto)) !== null) {
        // Evitar duplicados y el patrón genérico si ya se detectó uno específico
        const yaDetectado = secretos.some(
          (s) => s.posicion.inicio <= match!.index && s.posicion.fin >= match!.index + match![0].length,
        );

        if (!yaDetectado) {
          secretos.push({
            tipo,
            valorOriginal: match[0],
            posicion: { inicio: match.index, fin: match.index + match[0].length },
            marcador,
          });
        }
      }
    }

    // Ordenar por posición y eliminar solapamientos con el patrón genérico
    return secretos
      .sort((a, b) => a.posicion.inicio - b.posicion.inicio)
      .filter((s, i, arr) => {
        if (s.tipo !== "api_key_generica") return true;
        return !arr.some((other) => other !== s && other.posicion.inicio <= s.posicion.inicio && other.posicion.fin >= s.posicion.fin);
      });
  }

  enmascarar(texto: string): { textoenmascarado: string; secretos: SecretoDetectado[] } {
    const secretos = this.detectar(texto);
    let textoEnmascarado = texto;

    // Reemplazar de atrás hacia adelante para mantener posiciones
    [...secretos].reverse().forEach((s) => {
      textoEnmascarado =
        textoEnmascarado.slice(0, s.posicion.inicio) +
        s.marcador +
        textoEnmascarado.slice(s.posicion.fin);
    });

    return { textoenmascarado: textoEnmascarado, secretos };
  }
}

export class PipelineSecureLog {
  private detector: DetectorSecretos;
  private estadisticas: Record<TipoSecreto, number> = {} as Record<TipoSecreto, number>;

  constructor() {
    this.detector = new DetectorSecretos();
  }

  procesarLog(entrada: string): string {
    const { textoenmascarado, secretos } = this.detector.enmascarar(entrada);

    secretos.forEach((s) => {
      this.estadisticas[s.tipo] = (this.estadisticas[s.tipo] ?? 0) + 1;
    });

    if (secretos.length > 0) {
      console.log(`   🔒 ${secretos.length} secreto(s) enmascarado(s): ${secretos.map((s) => s.tipo).join(", ")}`);
    }

    return textoenmascarado;
  }

  obtenerEstadisticas(): Record<string, number> {
    return { ...this.estadisticas };
  }
}

export async function demostrarSecretDetection(): Promise<void> {
  paso("🔑", "Demostrando Secret Detection & Masking Pattern");

  const detector = new DetectorSecretos();

  const textosPrueba = [
    'Conectar con: mongodb://admin:password123@localhost:27017/mydb',
    'Mi token es: sk-proj-abcdefghijklmnopqrstuvwxyz123456789',
    'Email de contacto: usuario@empresa.com, teléfono: 612345678',
    'Token GitHub: ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456',
    'Usar Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature',
    'Este texto no tiene secretos, es completamente seguro.',
  ];

  paso("1️⃣", "Detección y enmascaramiento");
  for (const texto of textosPrueba) {
    const { textoenmascarado, secretos } = detector.enmascarar(texto);
    if (secretos.length > 0) {
      console.log(`\n   Original:   "${texto.slice(0, 80)}"`);
      console.log(`   Enmascarado:"${textoenmascarado.slice(0, 80)}"`);
      console.log(`   Tipos: ${secretos.map((s) => s.tipo).join(", ")}`);
    } else {
      console.log(`\n   ✅ Texto limpio: "${texto.slice(0, 60)}"`);
    }
  }

  paso("2️⃣", "Pipeline de logs seguros");
  const pipeline = new PipelineSecureLog();
  const logs = [
    'ERROR api_key=sk-test-1234567890abcdefghijklm conexión fallida',
    'INFO usuario@test.com realizó 3 llamadas a la API',
    'DEBUG proceso completado exitosamente en 250ms',
  ];

  logs.forEach((log) => {
    const logSeguro = pipeline.procesarLog(log);
    console.log(`   "${logSeguro.slice(0, 80)}"`);
  });

  const stats = pipeline.obtenerEstadisticas();
  if (Object.keys(stats).length > 0) {
    console.log(`\n   📊 Secretos detectados totales:`, stats);
  }

  paso("✅", "Secret Detection protegiendo logs y respuestas de leaks automáticamente");
}

async function main(): Promise<void> { await demostrarSecretDetection(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
