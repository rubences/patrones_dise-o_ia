/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 35 — VISITOR (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Árbol de Tareas]
 *  ├─ TareaSimple (A)
 *  ├─ TareaCompuesta (B)
 *  │  ├─ TareaSimple (B1)
 *  │  └─ TareaSimple (B2)
 *  └─ TareaSimple (C)
 *
 *       │
 *       ▼
 *  [Visitor: Contador]
 *  visitar(TareaSimple) → contar++
 *  visitar(TareaCompuesta) → contar suma de hijos
 *  Resultado: 4 tareas
 *
 *       │
 *       ▼
 *  [Visitor: Estimador de Tiempo]
 *  visitar(TareaSimple) → 1 hora
 *  visitar(TareaCompuesta) → suma de hijos
 *  Resultado: 3 horas totales
 *
 *  Idea: Representar una operación a ejecutar sobre elementos
 *  de una estructura compleja sin cambiar sus clases.
 *
 *  Referencia: https://refactoring.guru/design-patterns/visitor
 *
 *  Ventajas:
 *  - Agregar operaciones sin cambiar elementos
 *  - Centralizar lógica de operaciones complejas
 *  - Fácil agregar nuevas operaciones
 *  - Operaciones complejas desglosadas
 */

import { isDirectRun, paso } from "./common.js";

// ── Elementos visitables ───────────────────────────────────────────
export interface Elemento {
  aceptar(visitor: Visitor): unknown;
}

// ── VISITOR: Interfaz de operaciones ───────────────────────────────
export interface Visitor {
  visitarTareaSimple(tarea: TareaSimple): unknown;
  visitarTareaCompuesta(tarea: TareaCompuesta): unknown;
}

// ── Elementos concretos ────────────────────────────────────────────
export class TareaSimple implements Elemento {
  nombre: string;
  duracion: number; // en horas

  constructor(nombre: string, duracion: number) {
    this.nombre = nombre;
    this.duracion = duracion;
  }

  aceptar(visitor: Visitor): unknown {
    return visitor.visitarTareaSimple(this);
  }
}

export class TareaCompuesta implements Elemento {
  nombre: string;
  subtareas: Elemento[] = [];

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  agregarSubtarea(tarea: Elemento): void {
    this.subtareas.push(tarea);
  }

  aceptar(visitor: Visitor): unknown {
    return visitor.visitarTareaCompuesta(this);
  }
}

// ── VISITORS concretos ─────────────────────────────────────────────
export class VisitorContador implements Visitor {
  visitarTareaSimple(): number {
    return 1;
  }

  visitarTareaCompuesta(tarea: TareaCompuesta): number {
    let total = 1; // La tarea compuesta misma

    for (const subtarea of tarea.subtareas) {
      total += subtarea.aceptar(this) as number;
    }

    return total;
  }
}

export class VisitorEstimador implements Visitor {
  visitarTareaSimple(tarea: TareaSimple): number {
    console.log(`      Tarea: ${tarea.nombre} → ${tarea.duracion}h`);
    return tarea.duracion;
  }

  visitarTareaCompuesta(tarea: TareaCompuesta): number {
    console.log(`    📦 Tarea compuesta: ${tarea.nombre}`);

    let total = 0;

    for (const subtarea of tarea.subtareas) {
      total += subtarea.aceptar(this) as number;
    }

    return total;
  }
}

export class VisitorDescriptor implements Visitor {
  private nivel: number = 0;

  visitarTareaSimple(tarea: TareaSimple): string {
    const indent = "  ".repeat(this.nivel);
    return `${indent}✓ ${tarea.nombre}`;
  }

  visitarTareaCompuesta(tarea: TareaCompuesta): string {
    const indent = "  ".repeat(this.nivel);
    let resultado = `${indent}📦 ${tarea.nombre}\n`;

    this.nivel++;

    for (const subtarea of tarea.subtareas) {
      resultado += subtarea.aceptar(this) + "\n";
    }

    this.nivel--;

    return resultado;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarVisitor(): void {
  paso("👁️", "Demostrando Visitor Pattern");

  paso("1️⃣", "Crear estructura de tareas");

  const proyecto = new TareaCompuesta("Proyecto IA Completo");

  const fase1 = new TareaCompuesta("Fase 1: Diseño");
  fase1.agregarSubtarea(new TareaSimple("Definir requisitos", 2));
  fase1.agregarSubtarea(new TareaSimple("Arquitectura", 3));

  const fase2 = new TareaCompuesta("Fase 2: Implementación");
  fase2.agregarSubtarea(new TareaSimple("Coding", 8));
  fase2.agregarSubtarea(new TareaSimple("Testing", 4));
  fase2.agregarSubtarea(new TareaSimple("Documentación", 2));

  proyecto.agregarSubtarea(fase1);
  proyecto.agregarSubtarea(fase2);
  proyecto.agregarSubtarea(new TareaSimple("Deploy", 1));

  paso("2️⃣", "Visitor 1: Contar tareas");

  console.log(`\n   Contando todas las tareas...`);
  const contador = new VisitorContador();
  const totalTareas = proyecto.aceptar(contador) as number;
  console.log(`   ✓ Total: ${totalTareas} tareas`);

  paso("3️⃣", "Visitor 2: Estimar duración");

  console.log(`\n   Estimando duración total...`);
  const estimador = new VisitorEstimador();
  const duracionTotal = proyecto.aceptar(estimador) as number;
  console.log(`   ✓ Duración total: ${duracionTotal} horas`);

  paso("4️⃣", "Visitor 3: Describir estructura");

  console.log(`\n   Estructura del proyecto:`);
  const descriptor = new VisitorDescriptor();
  const descripcion = proyecto.aceptar(descriptor) as string;
  console.log(descripcion);

  paso("✅", "Visitor ejecutando operaciones complejas transparentemente");
}

function main(): void {
  demostrarVisitor();
}

if (isDirectRun(import.meta.url)) {
  main();
}
