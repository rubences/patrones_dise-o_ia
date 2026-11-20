---
patternId: 166
slug: distribution-shift-monitor
title: "Distribution Shift Monitor"
summary: "Contrato de referencia experimental para distribution shift monitor con validación y procedencia explícitas."
family: data-centric-ai
legacyGroup: 32
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_166_distribution_shift_monitor.ts
tags: [data, quality, lineage]
related: [25, 52, 107]
combinesWith: [77, 98, 109]
antiPatterns:
  - Asumir calidad de datos por existencia de un esquema.
references: []
---

## Propósito

Distribution Shift Monitor formaliza un mecanismo de control para ingeniería de datos de IA.

## Problema y fuerzas

La deriva, contaminación, falta de procedencia y cambios de esquema degradan la evaluación y la reproducibilidad.

## Solución

Exigir contratos verificables y registrar decisiones por dataset, versión, propietario y operación.

## Implementación del repositorio

Compara medias de muestras con umbral explícito; no equivale a una prueba estadística de drift multivariante. Implementación TypeScript de referencia: `src/pattern_166_distribution_shift_monitor.ts`. Pruebas positivas y negativas: `tests/p9_data_quality_patterns.test.ts`. Los límites metodológicos deben conservarse al evaluar casos reales.


## Producción

Requiere métricas por dataset, monitorización y adaptadores de datos reales.

## Evidencia y alcance

`needs-review`: sin resultados empíricos propios.

## Relaciones

Patrones 25, 52, 77, 98 y 107–109.
