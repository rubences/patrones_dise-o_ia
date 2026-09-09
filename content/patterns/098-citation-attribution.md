---
patternId: 98
slug: citation-attribution
title: Citation / Source Attribution
summary: Vincula afirmaciones con fuentes concretas y mide cobertura de atribución, manteniendo separada la existencia de una cita de la verificación de que la fuente realmente respalda el claim.
family: human-experience
legacyGroup: 22
level: component
difficulty: intermediate
maturity: established
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_98_citation_attribution.ts
tags: [citations, attribution, provenance, sources]
related: [25, 52, 66]
combinesWith: [73, 77]
antiPatterns:
  - Tratar cobertura de citas del 100% como factualidad del 100%.
  - Añadir una fuente que no respalda realmente la afirmación.
  - Citar solo el documento sin localizador suficiente cuando el usuario necesita verificar el claim.
references: []
---
# Propósito
Citation Attribution hace trazable cada claim hasta una fuente identificable y permite detectar afirmaciones huérfanas.

## Implementación del repositorio
`src/pattern_98_citation_attribution.ts` recibe afirmaciones que ya contienen `fuenteId`, asigna números por fuente única, inserta `[n]`, genera referencias y calcula `cobertura = claims citados / claims totales`.

El gestor **no comprueba si la fuente respalda el contenido de la afirmación**. Una cita incorrecta cuenta igual para cobertura que una correcta. Por ello la métrica mide atribución, no groundedness ni factualidad.

Cuando un `fuenteId` no existe en `fuentesDisponibles`, la afirmación queda correctamente marcada como sin citar. La descripción de fuente puede incluir sección, pero no existe contrato específico para página, fragmento, URL estable o hash.

## Producción
Conserva source ID, locator y provenance desde retrieval; valida entailment/grounding antes de publicar y diferencia citas de hechos frente a inferencias. Evita generar referencias que no fueron realmente consultadas.

## Relaciones
**Grounding (52)** verifica soporte; **RAG (25)** recupera evidencia; Citation Attribution la presenta de forma verificable al usuario.