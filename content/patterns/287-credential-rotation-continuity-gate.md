---
patternId: 287
slug: credential-rotation-continuity-gate
title: "Credential Rotation Continuity Gate"
summary: "Contrato experimental de identidad y confianza delegada para credential rotation continuity gate, con restricciones y pruebas adversariales."
family: agent-identity-trust
legacyGroup: 47
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_287_credential_rotation_continuity_gate.ts
tags: [identity, delegated-trust, security]
related: [98, 149, 281]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar atributos de identidad declarados como autenticación criptográfica real.
references: []
---

## Problema y solución

Credential Rotation Continuity Gate establece un control delimitado de identidad, delegación o aislamiento entre agentes. Código: `src/pattern_287_credential_rotation_continuity_gate.ts`.

## Pruebas y límites

`tests/p12_identity_patterns.test.ts`. Los contratos no emiten credenciales ni sustituyen IAM, OAuth o SPIFFE/SPIRE. La identidad de agentes debe verificarse externamente.

## Evidencia

Estado `needs-review`; requiere análisis de amenazas y validación con infraestructura de identidad real.
