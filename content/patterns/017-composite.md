---
patternId: 17
slug: composite
title: Composite
summary: Representa tareas simples y composiciones jerárquicas con la misma interfaz para construir árboles de trabajo agéntico de forma uniforme.
family: foundations
legacyGroup: 3
level: component
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_17_composite.ts
tags: [gof, structural, composite, task-tree]
related: [6, 35, 60]
combinesWith: [27, 57, 77]
antiPatterns:
  - Tratar nodos heterogéneos como equivalentes cuando tienen invariantes distintas.
  - Permitir recursión sin límites de profundidad o presupuesto.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Composite modela objetos individuales y grupos mediante un contrato uniforme. Para agentes, una tarea puede contener subtareas que a su vez contienen más tareas.

## Problema
Los workflows jerárquicos se complican si hojas y grupos requieren APIs completamente distintas.

## Solución
Define una abstracción común y permite que un Composite gestione hijos del mismo tipo conceptual.

```text
Task
 |- Leaf
 |- Composite
     |- Leaf
     |- Composite
```

## Aplicabilidad
Útil para planes, árboles de ejecución y descomposición recursiva. Añade límites de profundidad, tiempo y coste en sistemas autónomos.

## Observabilidad
Cada nodo debe tener identidad, estado y relación padre/hijo para poder reconstruir la ejecución.

## Implementación del repositorio
`src/pattern_17_composite.ts` muestra composición jerárquica de tareas.

## Relaciones
**Visitor (35)** aplica operaciones sobre el árbol; **Planning (6)** puede producirlo; **Orchestrator-Workers (60)** puede ejecutarlo.