---
patternId: 166
slug: distribution-shift-monitor
title: "Distribution Shift Monitor"
summary: "Contrato de referencia experimental para distribution shift monitor con validación y procedencia explícitas."
family: data-centric-ai
legacyGroup: 34
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

`src/pattern_166_distribution_shift_monitor.ts` es un contrato educativo de registros; no ejecuta detección estadística ni entrenamiento.

## Producción

Requiere métricas por dataset, monitorización y adaptadores de datos reales.

## Evidencia y alcance

`needs-review`: sin resultados empíricos propios.

## Relaciones

Patrones 25, 52, 77, 98 y 107–109.
