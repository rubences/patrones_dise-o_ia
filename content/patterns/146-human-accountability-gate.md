---
patternId: 146
slug: human-accountability-gate
title: "Human Accountability Gate"
summary: "Contrato experimental de gobierno de IA para human accountability gate con revisión y evidencia de decisiones."
family: ai-governance-assurance
legacyGroup: 30
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_146_human_accountability_gate.ts
tags: [governance, assurance, risk]
related: [53, 72, 74]
combinesWith: [77, 98, 124]
antiPatterns:
  - Presentar una lista de controles como certificación regulatoria.
references: []
---

## Propósito

Human Accountability Gate expresa una responsabilidad verificable de gobierno de IA.

## Problema y fuerzas

Las decisiones automatizadas necesitan atribución, evidencia, control humano y delimitación de responsabilidades.

## Solución

Separar registro de decisiones, autorización, evidencia y revisión independiente.

## Implementación del repositorio

Puerta de aprobación humana que exige separación entre solicitante y revisor. Implementación TypeScript determinista en `src/pattern_146_human_accountability_gate.ts`, con pruebas positivas y negativas en `tests/p9_governance_patterns.test.ts`. **No constituye certificación regulatoria ni validación jurídica.**


## Producción

Requiere evaluación jurídica y de riesgos, controles operativos y pruebas auditables.

## Evidencia y alcance

`needs-review`: diseño experimental sin certificación ni resultados empíricos.

## Relaciones

Patrones 53, 72, 74, 77 y 98.
