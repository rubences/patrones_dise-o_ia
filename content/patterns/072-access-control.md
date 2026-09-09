---
patternId: 72
slug: access-control
title: Access Control
summary: Autoriza acciones de agentes contra recursos mediante identidad verificada y políticas de mínimo privilegio, independientemente de lo que el modelo solicite o declare sobre su propio rol.
family: safety-security
legacyGroup: 16
level: architecture
difficulty: advanced
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_72_access_control.ts
tags: [authorization, rbac, abac, least-privilege]
related: [65, 83, 101]
combinesWith: [77, 85, 94]
antiPatterns:
  - Confiar en un rol incluido por el propio llamador sin autenticar identidad.
  - Autorizar una tool solo porque fue descubierta o registrada.
  - Usar permisos globales cuando el recurso requiere aislamiento por tenant u objeto.
references: []
---
# Propósito
Access Control decide si una identidad autenticada puede realizar una acción concreta sobre un recurso en un contexto determinado.

## Implementación del repositorio
`src/pattern_72_access_control.ts` define políticas RBAC simples con recursos y wildcards. La evaluación recibe `agenteId` y `rol`, pero **no verifica que ese rol pertenezca realmente al agente**; el rol es un dato suministrado por la propia solicitud. El campo `timestamp` tampoco participa en ninguna regla contextual.

El motor registra permit/deny en un array en memoria y aplica una política allow si rol, recurso y acción coinciden. No hay políticas deny explícitas, tenant scope, ownership ni integración IAM.

## Producción
Obtén identidad y claims de un mecanismo autenticado, no del texto/modelo. Evalúa subject, action, resource y context con policy versionada y default-deny. Mantén separación entre autenticación, autorización y validación de parámetros.

## Auditoría
Registra principal verificado, policy/version, recurso, acción y decision ID, evitando payloads sensibles. Las decisiones deben poder correlacionarse con la tool call real.

## Relaciones
**Agent Registry (65)** y **Dynamic Tool Discovery (83)** informan disponibilidad; Access Control decide permiso. **Tool Call Validation (101)** valida después la llamada concreta.