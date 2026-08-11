/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 15 — SINGLETON (CREATIONAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente 1] ──┐
 *                │
 *  [Cliente 2] ──┼──▶ GestorAgentes (única instancia)
 *                │
 *  [Cliente 3] ──┘
 *
 *  Idea: Garantizar que una clase tenga una única instancia y proporcionar
 *  un punto de acceso global a ella. Útil para gestores de configuración,
 *  pools de conexiones, registros de agentes.
 *
 *  Referencia: https://refactoring.guru/design-patterns/singleton
 *
 *  Ventajas:
 *  - Una única instancia en toda la aplicación
 *  - Punto de acceso global
 *  - Control centralizado
 *  - Inicialización lazy (perezosa)
 *
 *  Casos de uso:
 *  - Gestor global de agentes
 *  - Pool de conexiones a LLM
 *  - Configuración centralizada
 *  - Registro de eventos
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── SINGLETON: Gestor global de agentes ────────────────────────
export interface RegistroAgente {
  id: string;
  nombre: string;
  tipo: string;
  activo: boolean;
  ultimoAcceso: Date;
}

export class GestorAgentesGlobal {
  private static instancia: GestorAgentesGlobal;
  private agentes: Map<string, RegistroAgente> = new Map();
  private contadoAccesos: number = 0;
  private inicioSesion: Date = new Date();

  // Constructor privado impide instanciación
  private constructor() {
    console.log("🔒 GestorAgentesGlobal inicializado (singleton)");
  }

  // Punto de acceso único
  static obtenerInstancia(): GestorAgentesGlobal {
    if (!GestorAgentesGlobal.instancia) {
      GestorAgentesGlobal.instancia = new GestorAgentesGlobal();
    }
    return GestorAgentesGlobal.instancia;
  }

  registrarAgente(id: string, nombre: string, tipo: string): void {
    this.agentes.set(id, {
      id,
      nombre,
      tipo,
      activo: true,
      ultimoAcceso: new Date(),
    });
    console.log(`✅ Agente registrado: ${nombre}`);
  }

  obtenerAgente(id: string): RegistroAgente | undefined {
    const agente = this.agentes.get(id);
    if (agente) {
      agente.ultimoAcceso = new Date();
      this.contadoAccesos++;
    }
    return agente;
  }

  listarAgentes(): RegistroAgente[] {
    return Array.from(this.agentes.values());
  }

  obtenerEstadisticas() {
    return {
      totalAgentes: this.agentes.size,
      totalAccesos: this.contadoAccesos,
      tiempoSesion: new Date().getTime() - this.inicioSesion.getTime(),
      agentes: this.listarAgentes(),
    };
  }
}

// ── SINGLETON: Pool de conexiones a LLM ────────────────────────
export class PoolConexionesLLM {
  private static instancia: PoolConexionesLLM;
  private conexiones: OpenAI[] = [];
  private maxConexiones: number;
  private conexionesActivas: number = 0;

  private constructor(maxConexiones = 5) {
    this.maxConexiones = maxConexiones;
    console.log(`🔌 Pool de LLM inicializado (max: ${maxConexiones})`);
    this.inicializarConexiones();
  }

  static obtenerInstancia(maxConexiones = 5): PoolConexionesLLM {
    if (!PoolConexionesLLM.instancia) {
      PoolConexionesLLM.instancia = new PoolConexionesLLM(maxConexiones);
    }
    return PoolConexionesLLM.instancia;
  }

  private inicializarConexiones(): void {
    for (let i = 0; i < this.maxConexiones; i++) {
      this.conexiones.push(makeClient());
    }
  }

  obtenerConexion(): OpenAI {
    if (this.conexionesActivas < this.conexiones.length) {
      this.conexionesActivas++;
      return this.conexiones[this.conexionesActivas - 1];
    }
    // Reutilizar la más antigua
    return this.conexiones[0];
  }

  liberarConexion(): void {
    if (this.conexionesActivas > 0) {
      this.conexionesActivas--;
    }
  }

  obtenerEstado() {
    return {
      conexionesActivas: this.conexionesActivas,
      conexionesTotal: this.conexiones.length,
      disponibles: this.conexiones.length - this.conexionesActivas,
    };
  }
}

// ── SINGLETON: Configuración global ────────────────────────────
export interface ConfiguracionGlobal {
  modelo: string;
  temperatura: number;
  topP: number;
  maxTokens: number;
  timeoutMs: number;
  reintentos: number;
  cacheable: boolean;
  verbose: boolean;
}

export class ConfiguracionSingleton {
  private static instancia: ConfiguracionSingleton;
  private config: ConfiguracionGlobal = {
    modelo: DEFAULT_MODEL,
    temperatura: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    timeoutMs: 30000,
    reintentos: 3,
    cacheable: true,
    verbose: false,
  };

  private constructor() {
    console.log("⚙️  Configuración global inicializada (singleton)");
  }

  static obtenerInstancia(): ConfiguracionSingleton {
    if (!ConfiguracionSingleton.instancia) {
      ConfiguracionSingleton.instancia = new ConfiguracionSingleton();
    }
    return ConfiguracionSingleton.instancia;
  }

  actualizar(parcial: Partial<ConfiguracionGlobal>): void {
    this.config = { ...this.config, ...parcial };
    console.log("🔧 Configuración actualizada");
  }

  obtener(): ConfiguracionGlobal {
    return { ...this.config };
  }

  obtenerValor<K extends keyof ConfiguracionGlobal>(
    clave: K,
  ): ConfiguracionGlobal[K] {
    return this.config[clave];
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarSingleton(): Promise<void> {
  paso("🔒", "Demostrando Singleton Pattern");

  paso("1️⃣", "Gestor Global de Agentes");

  // Obtener instancia (la crea si no existe)
  const gestor1 = GestorAgentesGlobal.obtenerInstancia();
  gestor1.registrarAgente("a1", "Especialista ML", "experto");
  gestor1.registrarAgente("a2", "Revisor", "supervisor");

  // Obtener la misma instancia (no crea una nueva)
  const gestor2 = GestorAgentesGlobal.obtenerInstancia();
  console.log(`   ¿Misma instancia? ${gestor1 === gestor2 ? "✅ SÍ" : "❌ NO"}`);

  // Acceder desde otro "cliente"
  const gestor3 = GestorAgentesGlobal.obtenerInstancia();
  const agentes = gestor3.listarAgentes();
  console.log(`   Agentes registrados: ${agentes.length}`);

  paso("2️⃣", "Pool de Conexiones LLM");

  const pool1 = PoolConexionesLLM.obtenerInstancia(3);
  const conn1 = pool1.obtenerConexion();
  console.log(`   Conexión obtenida: ${conn1 instanceof OpenAI ? "cliente OpenAI válido" : "inválida"}`);
  console.log(`   Estado: ${JSON.stringify(pool1.obtenerEstado())}`);

  // Otra "referencia" obtiene la misma instancia
  const pool2 = PoolConexionesLLM.obtenerInstancia();
  console.log(`   ¿Mismo pool? ${pool1 === pool2 ? "✅ SÍ" : "❌ NO"}`);

  paso("3️⃣", "Configuración Global Centralizada");

  const config1 = ConfiguracionSingleton.obtenerInstancia();
  console.log(
    `   Configuración inicial: modelo=${config1.obtenerValor("modelo")}`,
  );

  // Cambiar desde un "lugar"
  config1.actualizar({ temperatura: 0.9, verbose: true });

  // Leer desde otro "lugar" - ¡obtiene los cambios!
  const config2 = ConfiguracionSingleton.obtenerInstancia();
  console.log(`   Temperatura leída después: ${config2.obtenerValor("temperatura")}`);
  console.log(`   ¿Misma configuración? ${config1 === config2 ? "✅ SÍ" : "❌ NO"}`);

  paso("📊", "Estadísticas Finales");

  const estadisticas = GestorAgentesGlobal.obtenerInstancia()
    .obtenerEstadisticas();
  console.log(`
   Total agentes: ${estadisticas.totalAgentes}
   Total accesos: ${estadisticas.totalAccesos}
   Tiempo de sesión: ${estadisticas.tiempoSesion}ms
  `);
}

async function main(): Promise<void> {
  await demostrarSingleton();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
