---
patternId: 337
slug: data-contract-breaking-change-detector
title: "Data Contract Breaking Change Detector"
summary: "Contrato experimental de semántica e interoperabilidad para data contract breaking change detector, con validaciones de esquema y trazabilidad."
family: ai-data-contracts
legacyGroup: 52
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_337_data_contract_breaking_change_detector.ts
tags: [data-contracts, semantics, interoperability]
related: [98, 149, 331]
combinesWith: [77, 124]
antiPatterns:
  - Confundir coincidencia de tipos o nombres con equivalencia semántica demostrada.
references: []
---

## Problema y solución

Data Contract Breaking Change Detector define un mecanismo delimitado de contrato, versionado, compatibilidad o linaje de datos para sistemas de IA. Código: `src/pattern_337_data_contract_breaking_change_detector.ts`.

## Pruebas y límites

`tests/p12_data_contracts_patterns.test.ts`. Los atributos y permisos requieren validación externa; la correspondencia declarativa de esquemas no garantiza interoperabilidad real ni cumplimiento jurídico.

## Evidencia

Estado `needs-review`; pendiente de pruebas con datos reales y fuentes primarias.
