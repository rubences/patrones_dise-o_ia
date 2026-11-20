---
patternId: 197
slug: consent-aware-data-processing
title: "Consent-Aware Data Processing"
summary: "Contrato experimental de privacidad para consent-aware data processing, con controles explícitos, pruebas negativas y límites de seguridad documentados."
family: privacy-confidential-ai
legacyGroup: 36
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_197_consent_aware_data_processing.ts
tags: [privacy, governance, security]
related: [69, 72, 98]
combinesWith: [77, 124]
antiPatterns:
  - Confundir un contrato educativo con una garantía criptográfica o legal.
references: []
---

## Propósito y contexto

Consent-Aware Data Processing define un mecanismo diferenciado para controlar riesgos de privacidad en arquitecturas de IA.

## Solución e implementación

Implementación TypeScript de referencia en `src/pattern_197_consent_aware_data_processing.ts`, con pruebas en `tests/p10_privacy_patterns.test.ts` y documentación de amenazas en `research/p10/privacy/fichas/197-consent-aware-data-processing.md`.

## Limitaciones

El contrato es experimental. No acredita privacidad diferencial, anonimato, agregación criptográfica, atestación real ni cumplimiento regulatorio. Requiere integración con mecanismos reales y auditoría independiente.

## Evidencia y evaluación

Estado `needs-review`. Evaluar con pruebas negativas, modelo de amenazas y referencias primarias verificadas antes de atribuir resultados empíricos.
