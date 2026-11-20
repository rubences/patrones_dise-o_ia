---
patternId: 285
slug: cross-tenant-delegation-boundary
title: "Cross-Tenant Delegation Boundary"
summary: "Contrato experimental de identidad y confianza delegada para cross-tenant delegation boundary, con restricciones y pruebas adversariales."
family: agent-identity-trust
legacyGroup: 47
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_285_cross_tenant_delegation_boundary.ts
tags: [identity, delegated-trust, security]
related: [98, 149, 281]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar atributos de identidad declarados como autenticación criptográfica real.
references: []
---

## Problema y solución

Cross-Tenant Delegation Boundary establece un control delimitado de identidad, delegación o aislamiento entre agentes. Código: `src/pattern_285_cross_tenant_delegation_boundary.ts`.

## Pruebas y límites

`tests/p12_identity_patterns.test.ts`. Los contratos no emiten credenciales ni sustituyen IAM, OAuth o SPIFFE/SPIRE. La identidad de agentes debe verificarse externamente.

## Evidencia

Estado `needs-review`; requiere análisis de amenazas y validación con infraestructura de identidad real.
