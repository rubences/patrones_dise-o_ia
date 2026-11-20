---
patternId: 179
slug: symbolic-proof-trace
title: "Symbolic Proof Trace"
summary: "Contrato experimental para symbolic proof trace con restricciones explícitas y evaluación reproducible."
family: causal-neurosymbolic-ai
legacyGroup: 36
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_179_symbolic_proof_trace.ts
tags: [causal, neuro-symbolic, planning]
related: [36, 37, 109]
combinesWith: [52, 77, 98]
antiPatterns:
  - Confundir correlación con causalidad identificada.
references: []
---

## Propósito

Symbolic Proof Trace delimita una estrategia de razonamiento causal o neuro-simbólico.

## Problema y fuerzas

Las relaciones observadas no demuestran efectos de intervención; restricciones y supuestos deben ser explícitos.

## Solución

Separar supuestos, datos, modelo, decisión y evidencia con trazabilidad.

## Implementación del repositorio

`src/pattern_179_symbolic_proof_trace.ts` es un contrato educativo, no estima modelos causales ni ejecuta simulación del mundo.

## Producción

Requiere validación de supuestos, identificación causal, datasets y pruebas especializadas.

## Evidencia y alcance

`needs-review`: sin resultados propios.

## Relaciones

Patrones 36, 37, 52, 77 y 109.
