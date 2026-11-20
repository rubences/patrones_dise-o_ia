---
patternId: 334
slug: data-usage-purpose-contract
title: "Data Usage Purpose Contract"
summary: "Contrato experimental de semántica e interoperabilidad para data usage purpose contract, con validaciones de esquema y trazabilidad."
family: ai-data-contracts
legacyGroup: 52
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_334_data_usage_purpose_contract.ts
tags: [data-contracts, semantics, interoperability]
related: [98, 149, 331]
combinesWith: [77, 124]
antiPatterns:
  - Confundir coincidencia de tipos o nombres con equivalencia semántica demostrada.
references: []
---

## Problema y solución

Data Usage Purpose Contract define un mecanismo delimitado de contrato, versionado, compatibilidad o linaje de datos para sistemas de IA. Código: `src/pattern_334_data_usage_purpose_contract.ts`.

## Pruebas y límites

`tests/p12_data_contracts_patterns.test.ts`. Los atributos y permisos requieren validación externa; la correspondencia declarativa de esquemas no garantiza interoperabilidad real ni cumplimiento jurídico.

## Evidencia

Estado `needs-review`; pendiente de pruebas con datos reales y fuentes primarias.
