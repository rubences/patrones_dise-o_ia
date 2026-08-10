/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 30 — PROTOTYPE (CREATIONAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente Original]
 *  ├─ nombre: "Expert-1"
 *  ├─ modelo: "gpt-4"
 *  ├─ temperatura: 0.7
 *  └─ sistem: "Expert System"
 *
 *       │
 *       ▼
 *  [clonar()]
 *
 *       │
 *       ▼
 *  [Nuevo Agente (Deep Copy)]
 *  ├─ nombre: "Expert-2"
 *  ├─ modelo: "gpt-4"  (heredado)
 *  ├─ temperatura: 0.5  (modificable)
 *  └─ sistema: "Expert System" (independiente)
 *
 *  Idea: Crear nuevos objetos clonando uno existente en lugar de
 *  crear desde cero.
 *
 *  Referencia: https://refactoring.guru/design-patterns/prototype
 *
 *  Ventajas:
 *  - Creación rápida de instancias
 *  - No necesita constructores complejos
 *  - Configuración heredada
 *  - Reducción de overhead
 */

import { isDirectRun, paso } from "./common.js";

// ── Configuración de agente ────────────────────────────────────────
export interface ConfigAgente {
  nombre: string;
  modelo: string;
  temperatura: number;
  maxTokens: number;
  systemPrompt: string;
}

// ── PROTOTYPE: Agente cloneable ────────────────────────────────────
export class AgentePrototype {
  private config: ConfigAgente;

  constructor(config: ConfigAgente) {
    this.config = JSON.parse(JSON.stringify(config)); // Deep copy
  }

  clone(): AgentePrototype {
    console.log(`   🔄 Clonando agente...`);
    return new AgentePrototype(this.config);
  }

  setNombre(nombre: string): void {
    this.config.nombre = nombre;
  }

  setTemperatura(temp: number): void {
    this.config.temperatura = temp;
  }

  setMaxTokens(tokens: number): void {
    this.config.maxTokens = tokens;
  }

  getConfig(): ConfigAgente {
    return { ...this.config };
  }

  mostrar(): void {
    console.log(`
   📋 Agente: ${this.config.nombre}
      Modelo: ${this.config.modelo}
      Temperatura: ${this.config.temperatura}
      Max Tokens: ${this.config.maxTokens}
      System: ${this.config.systemPrompt.slice(0, 50)}...
    `);
  }
}

// ── Registry de prototipos ─────────────────────────────────────────
export class RegistryPrototipos {
  private prototipos: Map<string, AgentePrototype> = new Map();

  registrar(nombre: string, agente: AgentePrototype): void {
    this.prototipos.set(nombre, agente);
    console.log(`   ✓ Prototipo "${nombre}" registrado`);
  }

  clonar(nombre: string): AgentePrototype | null {
    const prototipo = this.prototipos.get(nombre);
    if (!prototipo) {
      console.log(`   ✗ Prototipo "${nombre}" no encontrado`);
      return null;
    }

    return prototipo.clone();
  }

  listar(): string[] {
    return Array.from(this.prototipos.keys());
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarPrototype(): void {
  paso("🔄", "Demostrando Prototype Pattern");

  paso("1️⃣", "Crear prototipo original");

  const agenteOriginal = new AgentePrototype({
    nombre: "Expert-Base",
    modelo: "gpt-4",
    temperatura: 0.7,
    maxTokens: 2000,
    systemPrompt: "Eres un experto en patrones de diseño y sistemas IA",
  });

  console.log(`\n   Agente original:`);
  agenteOriginal.mostrar();

  paso("2️⃣", "Clonar y personalizar");

  const clon1 = agenteOriginal.clone();
  clon1.setNombre("Expert-Matemáticas");
  clon1.setTemperatura(0.3);

  const clon2 = agenteOriginal.clone();
  clon2.setNombre("Expert-Creatividad");
  clon2.setTemperatura(0.95);

  console.log(`\n   Clon 1:`);
  clon1.mostrar();

  console.log(`   Clon 2:`);
  clon2.mostrar();

  paso("3️⃣", "Registry de prototipos");

  const registry = new RegistryPrototipos();
  console.log(`\n   Registrando prototipos...`);

  registry.registrar("agente-base", agenteOriginal);
  registry.registrar("agente-especializado", clon1);

  console.log(`\n   Prototipos disponibles: ${registry.listar().join(", ")}`);

  console.log(`\n   Clonando desde registry...`);
  const nuevoDesdeRegistry = registry.clonar("agente-base");
  if (nuevoDesdeRegistry) {
    nuevoDesdeRegistry.setNombre("Expert-Nuevo");
    nuevoDesdeRegistry.mostrar();
  }

  paso("✅", "Prototype creando instancias rápidamente");
}

function main(): void {
  demostrarPrototype();
}

if (isDirectRun(import.meta.url)) {
  main();
}
