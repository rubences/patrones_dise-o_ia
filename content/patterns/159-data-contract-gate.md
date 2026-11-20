---
patternId: 159
slug: data-contract-gate
title: "Data Contract Gate"
summary: "Contrato de referencia experimental para data contract gate con validación y procedencia explícitas."
family: data-centric-ai
legacyGroup: 32
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_159_data_contract_gate.ts
tags: [data, quality, lineage]
related: [25, 52, 107]
combinesWith: [77, 98, 109]
antiPatterns:
  - Asumir calidad de datos por existencia de un esquema.
references: []
---

## Propósito

Data Contract Gate formaliza un mecanismo de control para ingeniería de datos de IA.

## Problema y fuerzas

La deriva, contaminación, falta de procedencia y cambios de esquema degradan la evaluación y la reproducibilidad.

## Solución

Exigir contratos verificables y registrar decisiones por dataset, versión, propietario y operación.

## Implementación del repositorio

Valida campos requeridos, tipos y atributos desconocidos. Implementación TypeScript de referencia: `src/pattern_159_data_contract_gate.ts`. Pruebas positivas y negativas: `tests/p9_data_quality_patterns.test.ts`. Los límites metodológicos deben conservarse al evaluar casos reales.


## Producción

Requiere métricas por dataset, monitorización y adaptadores de datos reales.

## Evidencia y alcance

`needs-review`: sin resultados empíricos propios.

## Relaciones

Patrones 25, 52, 77, 98 y 107–109.
