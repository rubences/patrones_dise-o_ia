---
patternId: 193
slug: private-retrieval-policy
title: "Private Retrieval Policy"
summary: "Contrato experimental de privacidad para private retrieval policy, con controles explícitos, pruebas negativas y límites de seguridad documentados."
family: privacy-confidential-ai
legacyGroup: 36
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_193_private_retrieval_policy.ts
tags: [privacy, governance, security]
related: [69, 72, 98]
combinesWith: [77, 124]
antiPatterns:
  - Confundir un contrato educativo con una garantía criptográfica o legal.
references: []
---

## Propósito y contexto

Private Retrieval Policy define un mecanismo diferenciado para controlar riesgos de privacidad en arquitecturas de IA.

## Solución e implementación

Implementación TypeScript de referencia en `src/pattern_193_private_retrieval_policy.ts`, con pruebas en `tests/p10_privacy_patterns.test.ts` y documentación de amenazas en `research/p10/privacy/fichas/193-private-retrieval-policy.md`.

## Limitaciones

El contrato es experimental. No acredita privacidad diferencial, anonimato, agregación criptográfica, atestación real ni cumplimiento regulatorio. Requiere integración con mecanismos reales y auditoría independiente.

## Evidencia y evaluación

Estado `needs-review`. Evaluar con pruebas negativas, modelo de amenazas y referencias primarias verificadas antes de atribuir resultados empíricos.
