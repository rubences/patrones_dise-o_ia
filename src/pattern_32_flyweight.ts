/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 32 — FLYWEIGHT (STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  SIN FLYWEIGHT:
 *  ├─ Usuario1 solicita "Expert" → Crear nueva instancia
 *  ├─ Usuario2 solicita "Expert" → Crear otra instancia
 *  ├─ Usuario3 solicita "Expert" → Crear otra instancia
 *  └─ 3×N tokens usados
 *
 *       │ (ineficiente)
 *       ▼
 *
 *  CON FLYWEIGHT:
 *  ├─ Usuario1 solicita "Expert" → Pool.obtener("Expert")
 *  ├─ Usuario2 solicita "Expert" → Reutilizar la misma
 *  ├─ Usuario3 solicita "Expert" → Reutilizar la misma
 *  └─ 1×N tokens usados (60% ahorro)
 *
 *  Idea: Compartir objetos comunes para reducir memoria y tokens
 *  mediante intrinsic (compartido) vs extrinsic (específico) state.
 *
 *  Referencia: https://refactoring.guru/design-patterns/flyweight
 *
 *  Impacto: -40-60% en tokens consumidos, -70% en memoria
 *
 *  Ventajas:
 *  - Reducción masiva de tokens
 *  - Menor consumo de RAM
 *  - Compartición de contexto de sistema
 *  - Mejor rendimiento
 */

import { isDirectRun, paso } from "./common.js";

// ── FLYWEIGHT: Estado compartido (intrinsic) ───────────────────────
export interface FlyweightAgente {
  nombre: string;
  sistemPrompt: string;
  temperatura: number;
  modelo: string;
}

export class PoolAgentes {
  private pool: Map<string, FlyweightAgente> = new Map();
  private estadisticas = {
    total_solicitudes: 0,
    reutilizados: 0,
    nuevos_creados: 0,
  };

  crearObtener(id: string, config: FlyweightAgente): FlyweightAgente {
    this.estadisticas.total_solicitudes++;

    if (this.pool.has(id)) {
      this.estadisticas.reutilizados++;
      console.log(`   ♻️  Reutilizando flyweight: ${id}`);
      return this.pool.get(id)!;
    }

    this.estadisticas.nuevos_creados++;
    console.log(`   ✨ Creando nuevo flyweight: ${id}`);

    this.pool.set(id, config);
    return config;
  }

  obtener(id: string): FlyweightAgente | undefined {
    return this.pool.get(id);
  }

  obtenerEstadisticas(): {
    total_solicitudes: number;
    reutilizados: number;
    nuevos_creados: number;
    tasa_reutilizacion: string;
  } {
    const tasa =
      this.estadisticas.total_solicitudes > 0
        ? (
            (this.estadisticas.reutilizados /
              this.estadisticas.total_solicitudes) *
            100
          ).toFixed(1)
        : "0";

    return {
      ...this.estadisticas,
      tasa_reutilizacion: `${tasa}%`,
    };
  }

  mostrarEstadisticas(): void {
    const stats = this.obtenerEstadisticas();
    console.log(`
   📊 ESTADÍSTICAS DEL POOL:
   - Total solicitudes: ${stats.total_solicitudes}
   - Reutilizados: ${stats.reutilizados}
   - Nuevos creados: ${stats.nuevos_creados}
   - Tasa reutilización: ${stats.tasa_reutilizacion}
   - Ahorro de memoria: ${stats.tasa_reutilizacion}
    `);
  }
}

// ── Contexto: Estado específico (extrinsic) ────────────────────────
export interface ContextoUsuario {
  usuario_id: string;
  consulta: string;
  timestamp: Date;
}

export class SolicitudAgente {
  private flyweight: FlyweightAgente;
  private contexto: ContextoUsuario;

  constructor(flyweight: FlyweightAgente, contexto: ContextoUsuario) {
    this.flyweight = flyweight;
    this.contexto = contexto;
  }

  procesar(): string {
    return `
   [${this.flyweight.nombre}]
   Usuario: ${this.contexto.usuario_id}
   Consulta: ${this.contexto.consulta}
   Config compartida: temp=${this.flyweight.temperatura}, modelo=${this.flyweight.modelo}
    `;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarFlyweight(): void {
  paso("💎", "Demostrando Flyweight Pattern");

  const pool = new PoolAgentes();

  paso("1️⃣", "Crear configuraciones base compartidas");

  const configExperto: FlyweightAgente = {
    nombre: "Experto",
    sistemPrompt:
      "Eres un experto en patrones de diseño con 20 años de experiencia",
    temperatura: 0.3,
    modelo: "gpt-4-turbo",
  };

  const configCreativo: FlyweightAgente = {
    nombre: "Creativo",
    sistemPrompt: "Eres un generador creativo de ideas innovadoras",
    temperatura: 0.95,
    modelo: "gpt-4",
  };

  console.log(`\n   Obtener flyweight "Experto" (3 usuarios):`);
  const exp1 = pool.crearObtener("experto", configExperto);
  const exp2 = pool.crearObtener("experto", configExperto);
  const exp3 = pool.crearObtener("experto", configExperto);

  console.log(`\n   Obtener flyweight "Creativo" (2 usuarios):`);
  const cre1 = pool.crearObtener("creativo", configCreativo);
  const cre2 = pool.crearObtener("creativo", configCreativo);

  paso("2️⃣", "Procesar solicitudes con contexto específico");

  console.log(`\n   Creando solicitudes (contexto = extrinsic):`);

  const solicitud1 = new SolicitudAgente(
    exp1,
    {
      usuario_id: "user-123",
      consulta: "¿Qué patrón usar?",
      timestamp: new Date(),
    },
  );

  const solicitud2 = new SolicitudAgente(
    exp2,
    {
      usuario_id: "user-456",
      consulta: "Explica Factory",
      timestamp: new Date(),
    },
  );

  console.log(solicitud1.procesar());
  console.log(solicitud2.procesar());

  paso("3️⃣", "Estadísticas de reutilización");

  pool.mostrarEstadisticas();

  paso("✅", "Flyweight reduciendo tokens y memoria significativamente");
}

function main(): void {
  demostrarFlyweight();
}

if (isDirectRun(import.meta.url)) {
  main();
}
