/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 34 — ITERATOR (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Colección de resultados/logs de agentes]
 *  ├─ Resultado 1
 *  ├─ Resultado 2
 *  ├─ Resultado 3
 *  ├─ Resultado 4
 *  └─ Resultado 5
 *
 *       │
 *       ▼
 *  [Iterator]
 *  while (iterator.tieneProximo()) {
 *    const actual = iterator.siguiente();
 *    procesar(actual);
 *  }
 *
 *  Idea: Acceder secuencialmente a elementos de una colección
 *  sin exponer su estructura interna.
 *
 *  Referencia: https://refactoring.guru/design-patterns/iterator
 *
 *  Ventajas:
 *  - Recorrer colecciones sin conocer estructura
 *  - Soporta múltiples iteradores simultáneamente
 *  - Fácil filtrar/transformar
 *  - Lazy evaluation posible
 */

import { isDirectRun, paso } from "./common.js";

// ── Elementos a iterar ────────────────────────────────────────────
export interface ResultadoAgente {
  id: number;
  timestamp: Date;
  tipo: string;
  contenido: string;
  calidad: number;
}

// ── ITERATOR ───────────────────────────────────────────────────────
export interface Iterator<T> {
  tieneProximo(): boolean;
  siguiente(): T;
  reiniciar(): void;
}

// ── ITERABLE ───────────────────────────────────────────────────────
export interface Iterable<T> {
  crearIterator(): Iterator<T>;
}

// ── Implementación de Iterator para resultados ─────────────────────
export class IteradorResultados implements Iterator<ResultadoAgente> {
  private resultados: ResultadoAgente[];
  private indice: number = 0;

  constructor(resultados: ResultadoAgente[]) {
    this.resultados = resultados;
  }

  tieneProximo(): boolean {
    return this.indice < this.resultados.length;
  }

  siguiente(): ResultadoAgente {
    if (!this.tieneProximo()) {
      throw new Error("No hay más elementos");
    }

    return this.resultados[this.indice++];
  }

  reiniciar(): void {
    this.indice = 0;
  }
}

// ── Iterator con filtro ────────────────────────────────────────────
export class IteradorFiltrado implements Iterator<ResultadoAgente> {
  private resultados: ResultadoAgente[];
  private indice: number = 0;
  private filtro: (r: ResultadoAgente) => boolean;

  constructor(
    resultados: ResultadoAgente[],
    filtro: (r: ResultadoAgente) => boolean,
  ) {
    this.resultados = resultados;
    this.filtro = filtro;
  }

  tieneProximo(): boolean {
    while (this.indice < this.resultados.length) {
      if (this.filtro(this.resultados[this.indice])) {
        return true;
      }
      this.indice++;
    }
    return false;
  }

  siguiente(): ResultadoAgente {
    if (!this.tieneProximo()) {
      throw new Error("No hay más elementos");
    }

    return this.resultados[this.indice++];
  }

  reiniciar(): void {
    this.indice = 0;
  }
}

// ── Colección: Historial de agentes ────────────────────────────────
export class HistorialResultados implements Iterable<ResultadoAgente> {
  private resultados: ResultadoAgente[] = [];

  agregar(resultado: ResultadoAgente): void {
    this.resultados.push(resultado);
  }

  obtenerTodos(): ResultadoAgente[] {
    return [...this.resultados];
  }

  crearIterator(): Iterator<ResultadoAgente> {
    return new IteradorResultados(this.resultados);
  }

  crearIteratorFiltrado(
    filtro: (r: ResultadoAgente) => boolean,
  ): Iterator<ResultadoAgente> {
    return new IteradorFiltrado(this.resultados, filtro);
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarIterator(): void {
  paso("🔄", "Demostrando Iterator Pattern");

  paso("1️⃣", "Crear historial de resultados");

  const historial = new HistorialResultados();

  console.log(`\n   Agregando resultados...`);
  for (let i = 1; i <= 5; i++) {
    historial.agregar({
      id: i,
      timestamp: new Date(),
      tipo: i % 2 === 0 ? "análisis" : "generación",
      contenido: `Resultado ${i}`,
      calidad: 50 + i * 10,
    });
  }

  console.log(`   ✓ ${historial.obtenerTodos().length} resultados agregados`);

  paso("2️⃣", "Iterar todos los resultados");

  console.log(`\n   Usando Iterator estándar:`);
  const iterator = historial.crearIterator();

  let contador = 0;
  while (iterator.tieneProximo()) {
    const resultado = iterator.siguiente();
    console.log(`   ${contador + 1}. [${resultado.tipo}] ${resultado.contenido} (calidad: ${resultado.calidad}%)`);
    contador++;
  }

  paso("3️⃣", "Iterar con filtro");

  console.log(`\n   Solo resultados de análisis con calidad > 60%:`);
  const iteradorFiltrado = historial.crearIteratorFiltrado(
    (r) => r.tipo === "análisis" && r.calidad > 60,
  );

  contador = 0;
  while (iteradorFiltrado.tieneProximo()) {
    const resultado = iteradorFiltrado.siguiente();
    console.log(`   ${contador + 1}. ${resultado.contenido} (${resultado.calidad}%)`);
    contador++;
  }

  paso("✅", "Iterator recorriendo colecciones transparentemente");
}

function main(): void {
  demostrarIterator();
}

if (isDirectRun(import.meta.url)) {
  main();
}
