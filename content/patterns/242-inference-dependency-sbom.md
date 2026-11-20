---
patternId: 242
slug: inference-dependency-sbom
title: "Inference Dependency SBOM"
summary: "Contrato experimental de seguridad de la cadena de suministro de IA para inference dependency sbom y controles de integridad."
family: ai-supply-chain-security
legacyGroup: 42
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_242_inference_dependency_sbom.ts
tags: [supply-chain, integrity, model-security]
related: [98, 125, 149]
combinesWith: [77, 124]
antiPatterns:
  - Confundir un hash con prueba autenticada de procedencia.
references: []
---

## Problema y solución

Inference Dependency SBOM aporta un control de seguridad específico sobre artefactos, dependencias o licencias. Código: `src/pattern_242_inference_dependency_sbom.ts`.

## Pruebas y límites

`tests/p11_supply_chain_patterns.test.ts`. Las firmas exigen confianza en el firmante; los checks externos no constituyen atestación por sí solos. La revisión de licencias es jurídica.

## Evidencia

Estado `needs-review`. Exigir análisis de amenazas y validación externa.
