---
patternId: 195
slug: pii-minimization-pipeline
title: "PII Minimization Pipeline"
summary: "Contrato experimental de privacidad para pii minimization pipeline, con controles explícitos, pruebas negativas y límites de seguridad documentados."
family: privacy-confidential-ai
legacyGroup: 36
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_195_pii_minimization_pipeline.ts
tags: [privacy, governance, security]
related: [69, 72, 98]
combinesWith: [77, 124]
antiPatterns:
  - Confundir un contrato educativo con una garantía criptográfica o legal.
references: []
---

## Propósito y contexto

PII Minimization Pipeline define un mecanismo diferenciado para controlar riesgos de privacidad en arquitecturas de IA.

## Solución e implementación

Implementación TypeScript de referencia en `src/pattern_195_pii_minimization_pipeline.ts`, con pruebas en `tests/p10_privacy_patterns.test.ts` y documentación de amenazas en `research/p10/privacy/fichas/195-pii-minimization-pipeline.md`.

## Limitaciones

El contrato es experimental. No acredita privacidad diferencial, anonimato, agregación criptográfica, atestación real ni cumplimiento regulatorio. Requiere integración con mecanismos reales y auditoría independiente.

## Evidencia y evaluación

Estado `needs-review`. Evaluar con pruebas negativas, modelo de amenazas y referencias primarias verificadas antes de atribuir resultados empíricos.
