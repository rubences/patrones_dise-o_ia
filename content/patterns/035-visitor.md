---
patternId: 35
slug: visitor
title: Visitor
summary: Añade nuevas operaciones sobre una estructura estable de objetos sin modificar las clases de cada elemento, separando datos y operaciones transversales.
family: foundations
legacyGroup: 4
level: component
difficulty: advanced
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_35_visitor.ts
tags: [gof, behavioral, visitor, task-tree]
related: [17, 33, 34]
combinesWith: [6, 77, 92]
antiPatterns:
  - Usar Visitor cuando la jerarquía de elementos cambia constantemente.
  - Introducir casting inseguro para sortear el contrato de visita.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Visitor permite aplicar operaciones diferentes sobre una estructura de tipos relativamente estable. En árboles de tareas puede calcular coste, validar seguridad, generar explicación o recolectar métricas.

## Problema
Añadir una nueva operación a cada clase del árbol contamina el modelo y obliga a cambiar todas las clases aunque la estructura no varíe.

## Solución
Cada elemento acepta un Visitor; el visitor contiene la lógica específica por tipo.

## Aplicabilidad
Adecuado cuando hay muchas operaciones y una jerarquía estable. Si aparecen nuevos tipos de nodo continuamente, Visitor aumenta el coste de evolución.

## IA y gobernanza
Visitors deterministas son útiles para validar un plan generado por LLM antes de ejecutarlo: coste estimado, tools permitidas, profundidad o PII.

## Implementación del repositorio
`src/pattern_35_visitor.ts` aplica operaciones sobre árboles de tareas.

## Relaciones
**Composite (17)** aporta la estructura; **Iterator (34)** recorre; **Visitor** encapsula operaciones sobre cada tipo.