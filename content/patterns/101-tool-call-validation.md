---
patternId: 101
slug: tool-call-validation
title: Tool Call Validation Gate
summary: Valida de forma determinista que una llamada propuesta corresponde a una herramienta conocida, cumple su schema y respeta precondiciones antes de tocar el backend.
family: safety-security
legacyGroup: 23
level: component
difficulty: advanced
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_101_tool_call_validation.ts
tags: [tool-validation, schema, sequencing, safety]
related: [28, 72, 83]
combinesWith: [85, 100, 77]
antiPatterns:
  - Validar parámetros requeridos pero aceptar silenciosamente argumentos desconocidos.
  - Confundir validez del schema con autorización del principal.
  - Usar historial global para precondiciones que deberían estar aisladas por sesión o workflow.
references: []
---
# Propósito
Tool Call Validation Gate convierte una tool call generada por modelo en una solicitud validada antes del dispatch.

## Implementación del repositorio
`src/pattern_101_tool_call_validation.ts` comprueba que la herramienta exista, que estén presentes parámetros requeridos, que sus tipos sean `string/number/boolean` y que se haya ejecutado al menos uno de los prerrequisitos de secuencia.

Hay un hallazgo importante: el validador recorre únicamente los parámetros declarados y **no rechaza argumentos extra desconocidos**. Tampoco valida enums, rangos, formatos, relaciones entre campos o que `confirmar=true` tenga significado de autorización humana.

El historial de herramientas ejecutadas vive dentro de la instancia del validador. En un servicio compartido debe aislarse explícitamente por workflow/tenant para que un prerrequisito de una sesión no habilite otra.

## Producción
Usa JSON Schema/Zod completo con `additionalProperties=false` cuando corresponda, validación semántica, policy de autorización y precondiciones consultadas desde estado durable. Registra un decision ID y solo añade al historial tras confirmación real del backend.

## Relaciones
**Access Control (72)** responde quién puede; **Tool Call Validation (101)** responde si esta llamada concreta es válida; **Idempotency Keys (85)** protege el efecto frente a retries.