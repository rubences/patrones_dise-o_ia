/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 72 — ACCESS CONTROL FOR AGENTS (CONTROL DE ACCESO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente solicita recurso]
 *       │
 *       ▼
 *  [Motor ABAC/RBAC]
 *  ├─ Identidad del agente (quién es)
 *  ├─ Recurso solicitado (qué)
 *  ├─ Acción (leer/escribir/ejecutar)
 *  └─ Contexto (cuándo, desde dónde)
 *
 *       │
 *       ▼
 *  [Política de Autorización]
 *  ├─ Roles: admin, usuario, auditor, agente
 *  ├─ Permisos: CRUD por recurso
 *  └─ Reglas de negocio: horario, rate limits
 *
 *       │
 *       ▼
 *  [PERMITIDO / DENEGADO]
 *
 *  Ventajas:
 *  - Principio de mínimo privilegio para agentes
 *  - Auditoría de accesos completa
 *  - Integrable con sistemas IAM existentes
 *  - Control granular por recurso y acción
 */

import { isDirectRun, paso } from "./common.js";

export type Accion = "leer" | "escribir" | "ejecutar" | "eliminar" | "administrar";
export type Rol = "admin" | "agente_estandar" | "agente_auditor" | "agente_readonly";

export interface Politica {
  rol: Rol;
  recurso: string; // Puede usar wildcards: "datos.*", "tools.codigo"
  acciones: Accion[];
}

export interface SolicitudAcceso {
  agenteId: string;
  rol: Rol;
  recurso: string;
  accion: Accion;
  timestamp?: Date;
}

export interface ResultadoAcceso {
  permitido: boolean;
  razon: string;
  politicaAplicada?: Politica;
}

export class MotorControlAcceso {
  private politicas: Politica[] = [];
  private logAuditoria: (SolicitudAcceso & { permitido: boolean })[] = [];

  constructor() {
    // Políticas predefinidas para agentes
    this.agregarPolitica({ rol: "admin", recurso: "*", acciones: ["leer", "escribir", "ejecutar", "eliminar", "administrar"] });
    this.agregarPolitica({ rol: "agente_estandar", recurso: "datos.propios", acciones: ["leer", "escribir"] });
    this.agregarPolitica({ rol: "agente_estandar", recurso: "tools.*", acciones: ["ejecutar"] });
    this.agregarPolitica({ rol: "agente_estandar", recurso: "knowledge_base", acciones: ["leer"] });
    this.agregarPolitica({ rol: "agente_auditor", recurso: "logs.*", acciones: ["leer"] });
    this.agregarPolitica({ rol: "agente_auditor", recurso: "datos.*", acciones: ["leer"] });
    this.agregarPolitica({ rol: "agente_readonly", recurso: "*", acciones: ["leer"] });
  }

  agregarPolitica(politica: Politica): void {
    this.politicas.push(politica);
  }

  evaluar(solicitud: SolicitudAcceso): ResultadoAcceso {
    const politicasAplicables = this.politicas.filter((p) => {
      if (p.rol !== solicitud.rol) return false;

      // Matching de recursos (soporte wildcard)
      const recursoPattern = p.recurso.replace(".", "\\.").replace("*", ".*");
      return new RegExp(`^${recursoPattern}$`).test(solicitud.recurso);
    });

    for (const politica of politicasAplicables) {
      if (politica.acciones.includes(solicitud.accion)) {
        this.registrarAuditoria({ ...solicitud, permitido: true });
        return {
          permitido: true,
          razon: `Permitido por política: rol ${solicitud.rol} → ${solicitud.accion} en ${solicitud.recurso}`,
          politicaAplicada: politica,
        };
      }
    }

    this.registrarAuditoria({ ...solicitud, permitido: false });
    return {
      permitido: false,
      razon: `Denegado: rol ${solicitud.rol} no tiene permiso de ${solicitud.accion} en ${solicitud.recurso}`,
    };
  }

  private registrarAuditoria(entrada: SolicitudAcceso & { permitido: boolean }): void {
    this.logAuditoria.push({ ...entrada, timestamp: new Date() });
  }

  obtenerLog(): typeof this.logAuditoria {
    return [...this.logAuditoria];
  }
}

export async function demostrarAccessControl(): Promise<void> {
  paso("🔐", "Demostrando Access Control for Agents Pattern");

  const motor = new MotorControlAcceso();

  paso("1️⃣", "Evaluación de accesos por rol");

  const solicitudes: SolicitudAcceso[] = [
    { agenteId: "agente-1", rol: "agente_estandar", recurso: "datos.propios", accion: "leer" },
    { agenteId: "agente-1", rol: "agente_estandar", recurso: "datos.sensibles", accion: "leer" },
    { agenteId: "agente-1", rol: "agente_estandar", recurso: "tools.busqueda", accion: "ejecutar" },
    { agenteId: "agente-1", rol: "agente_estandar", recurso: "datos.propios", accion: "eliminar" },
    { agenteId: "auditor-1", rol: "agente_auditor", recurso: "logs.sistema", accion: "leer" },
    { agenteId: "auditor-1", rol: "agente_auditor", recurso: "datos.produccion", accion: "escribir" },
    { agenteId: "admin-1", rol: "admin", recurso: "datos.sensibles", accion: "eliminar" },
    { agenteId: "readonly-1", rol: "agente_readonly", recurso: "knowledge_base", accion: "leer" },
    { agenteId: "readonly-1", rol: "agente_readonly", recurso: "datos.propios", accion: "escribir" },
  ];

  for (const solicitud of solicitudes) {
    const resultado = motor.evaluar(solicitud);
    const icono = resultado.permitido ? "✅" : "🚫";
    console.log(`   ${icono} [${solicitud.rol}] ${solicitud.accion} ${solicitud.recurso}: ${resultado.razon.slice(0, 70)}`);
  }

  paso("2️⃣", "Log de auditoría");
  const log = motor.obtenerLog();
  const denegados = log.filter((e) => !e.permitido).length;
  console.log(`\n   Total accesos evaluados: ${log.length}`);
  console.log(`   Permitidos: ${log.length - denegados} | Denegados: ${denegados}`);

  paso("✅", "Access Control aplicando mínimo privilegio a agentes de IA");
}

function main(): void { demostrarAccessControl().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
if (isDirectRun(import.meta.url)) { main(); }
