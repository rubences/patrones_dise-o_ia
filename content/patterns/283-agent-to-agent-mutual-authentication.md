---
patternId: 283
slug: agent-to-agent-mutual-authentication
title: "Agent-to-Agent Mutual Authentication"
summary: "Contrato experimental de identidad y confianza delegada para agent-to-agent mutual authentication, con restricciones y pruebas adversariales."
family: agent-identity-trust
legacyGroup: 47
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_283_agent_to_agent_mutual_authentication.ts
tags: [identity, delegated-trust, security]
related: [98, 149, 281]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar atributos de identidad declarados como autenticación criptográfica real.
references: []
---

## Problema y solución

Agent-to-Agent Mutual Authentication establece un control delimitado de identidad, delegación o aislamiento entre agentes. Código: `src/pattern_283_agent_to_agent_mutual_authentication.ts`.

## Pruebas y límites

`tests/p12_identity_patterns.test.ts`. Los contratos no emiten credenciales ni sustituyen IAM, OAuth o SPIFFE/SPIRE. La identidad de agentes debe verificarse externamente.

## Evidencia

Estado `needs-review`; requiere análisis de amenazas y validación con infraestructura de identidad real.
