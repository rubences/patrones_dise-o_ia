---
patternId: 164
slug: synthetic-data-quality-gate
title: "Synthetic Data Quality Gate"
summary: "Contrato de referencia experimental para synthetic data quality gate con validación y procedencia explícitas."
family: data-centric-ai
legacyGroup: 32
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_164_synthetic_data_quality_gate.ts
tags: [data, quality, lineage]
related: [25, 52, 107]
combinesWith: [77, 98, 109]
antiPatterns:
  - Asumir calidad de datos por existencia de un esquema.
references: []
---

## Propósito

Synthetic Data Quality Gate formaliza un mecanismo de control para ingeniería de datos de IA.

## Problema y fuerzas

La deriva, contaminación, falta de procedencia y cambios de esquema degradan la evaluación y la reproducibilidad.

## Solución

Exigir contratos verificables y registrar decisiones por dataset, versión, propietario y operación.

## Implementación del repositorio

Evalúa duplicados exactos y campos obligatorios; no garantiza realismo ni privacidad de datos sintéticos. Implementación TypeScript de referencia: `src/pattern_164_synthetic_data_quality_gate.ts`. Pruebas positivas y negativas: `tests/p9_data_quality_patterns.test.ts`. Los límites metodológicos deben conservarse al evaluar casos reales.


## Producción

Requiere métricas por dataset, monitorización y adaptadores de datos reales.

## Evidencia y alcance

`needs-review`: sin resultados empíricos propios.

## Relaciones

Patrones 25, 52, 77, 98 y 107–109.
