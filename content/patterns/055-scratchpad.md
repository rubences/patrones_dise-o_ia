---
patternId: 55
slug: scratchpad
title: Scratchpad
summary: Proporciona un espacio de trabajo intermedio para acumular cálculos, hipótesis o estado parcial sin mezclarlo necesariamente con la respuesta final destinada al usuario.
family: reasoning
legacyGroup: 6
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_55_scratchpad.ts
tags: [reasoning, scratchpad, working-memory, intermediate-state]
related: [26, 51, 86]
combinesWith: [6, 27, 44]
antiPatterns:
  - Persistir borradores internos con secretos o PII sin necesidad.
  - Exigir que el modelo revele todo su razonamiento interno al usuario.
  - Usar texto libre acumulado como estado de workflow sin esquema ni límites.
references:
  - Nye et al. (2021), Show Your Work: Scratchpads for Intermediate Computation with Language Models.
---
# Propósito
Scratchpad separa el trabajo intermedio de la salida final. En ingeniería de agentes puede ser una memoria temporal para cálculos, hechos recuperados, hipótesis o resultados parciales.

## Problema
Las tareas multi-step necesitan conservar contexto entre pasos. Si todo se mezcla con la conversación final, aumenta el ruido, el coste y el riesgo de exponer información que solo era necesaria internamente.

## Solución
Mantén un espacio de trabajo con lifecycle y alcance claros. Preferiblemente utiliza artefactos estructurados cuando el contenido vaya a controlar acciones posteriores.

```text
input -> working state / scratchpad -> verifier -> final output
```

## Scratchpad vs razonamiento oculto
Un scratchpad de producto no debería depender de revelar la cadena de pensamiento privada del modelo. Puede almacenar resultados verificables: ecuaciones, documentos usados, decisiones, IDs de herramientas o checkpoints.

## Aplicabilidad
Útil en análisis multi-paso y workflows largos. Para memoria entre sesiones usa Long-Term Memory; para reducir contexto histórico usa Context Compaction.

## Implementación del repositorio
`src/pattern_55_scratchpad.ts` pide explícitamente etiquetas `<scratchpad>` y devuelve ese borrador al código, además de una respuesta final. También incluye una variante multi-paso que concatena resultados previos como texto.

La demo es pedagógica, pero en producción:
- no conviene depender de la revelación de razonamiento interno;
- el scratchpad necesita límites de tamaño y retención;
- resultados importantes deberían tener schema;
- información sensible debe redactarse o no persistirse.

## Observabilidad
Registra metadata del proceso sin registrar indiscriminadamente el borrador: tamaño, pasos, herramientas, hashes/referencias de evidencia y resultado de verificaciones.

## Relaciones
**Long-Term Memory (51)** persiste conocimiento; **Context Compaction (86)** reduce historial; **Checkpointing (44)** persiste estado recuperable; Scratchpad es memoria de trabajo temporal.