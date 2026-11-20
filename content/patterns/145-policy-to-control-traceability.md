---
patternId: 145
slug: policy-to-control-traceability
title: "Policy-to-Control Traceability"
summary: "Contrato experimental de gobierno de IA para policy-to-control traceability con revisión y evidencia de decisiones."
family: ai-governance-assurance
legacyGroup: 30
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_145_policy_to_control_traceability.ts
tags: [governance, assurance, risk]
related: [53, 72, 74]
combinesWith: [77, 98, 124]
antiPatterns:
  - Presentar una lista de controles como certificación regulatoria.
references: []
---

## Propósito

Policy-to-Control Traceability expresa una responsabilidad verificable de gobierno de IA.

## Problema y fuerzas

Las decisiones automatizadas necesitan atribución, evidencia, control humano y delimitación de responsabilidades.

## Solución

Separar registro de decisiones, autorización, evidencia y revisión independiente.

## Implementación del repositorio

Mapa de requisitos a controles y comprobación de cobertura. Implementación TypeScript determinista en `src/pattern_145_policy_to_control_traceability.ts`, con pruebas positivas y negativas en `tests/p9_governance_patterns.test.ts`. **No constituye certificación regulatoria ni validación jurídica.**


## Producción

Requiere evaluación jurídica y de riesgos, controles operativos y pruebas auditables.

## Evidencia y alcance

`needs-review`: diseño experimental sin certificación ni resultados empíricos.

## Relaciones

Patrones 53, 72, 74, 77 y 98.
