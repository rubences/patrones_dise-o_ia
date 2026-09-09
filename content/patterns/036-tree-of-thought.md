---
patternId: 36
slug: tree-of-thought
title: Tree of Thought
summary: Explora varias ramas de solución, las evalúa y selecciona caminos prometedores cuando un único recorrido de razonamiento puede quedar atrapado en una decisión temprana.
family: reasoning
legacyGroup: 6
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_36_tree_of_thought.ts
tags: [reasoning, search, tree-of-thought, deliberation]
related: [26, 42, 55]
combinesWith: [4, 73, 78]
antiPatterns:
  - Publicar una mejora porcentual como si fuera universal a cualquier tarea o modelo.
  - Usar la puntuación del mismo modelo como verificador único de verdad.
  - Expandir el árbol sin presupuesto de anchura, profundidad, tokens o tiempo.
references:
  - "Yao et al. (2023), Tree of Thoughts: Deliberate Problem Solving with Large Language Models."
---
# Propósito
Tree of Thought (ToT) trata una tarea compleja como un problema de búsqueda: genera varias alternativas, evalúa su potencial y continúa por las ramas más prometedoras. Resulta útil cuando una decisión temprana puede llevar a un callejón sin salida y existe valor en comparar hipótesis.

## Problema
Chain of Thought suele producir un recorrido principalmente lineal. Si un paso inicial es incorrecto, los siguientes pueden construir sobre ese error. Para puzzles, planificación, diseño o problemas combinatorios puede ser útil explorar más de una posibilidad.

## Solución
Representa los candidatos como un árbol o grafo de estados:

```text
          problema
        /    |     \
      A      B      C
     / \           / \
   A1  A2         C1 C2
       |             |
   evaluación -> selección
```

Un controlador define:
- generación de candidatos;
- función de evaluación;
- política de poda;
- anchura/profundidad;
- criterio de terminación;
- presupuesto máximo.

## Aplicabilidad
Adecuado cuando hay múltiples rutas plausibles y la calidad de una ruta puede evaluarse parcialmente antes de completarla. No conviene para consultas simples: multiplica llamadas, coste y latencia.

## Evaluación
La ventaja de ToT depende de tarea, modelo, estrategia de búsqueda y función de scoring. El comentario `+70% precisión` de la demo no debe publicarse como una mejora general; cualquier cifra debe conservar el benchmark y configuración de origen.

## Implementación del repositorio
`src/pattern_36_tree_of_thought.ts` usa anchura y profundidad configurables, genera ramas en paralelo y pide al LLM una puntuación 0–100. Solo expande ramas con score superior a 60 y después sigue recursivamente el mejor hijo.

Limitaciones demostrativas:
- el score del LLM no está calibrado;
- la misma familia de modelo genera y juzga;
- la política final es esencialmente greedy sobre la mejor rama local;
- no existe diversidad semántica explícita entre candidatos;
- no hay budget de tokens/coste aparte de profundidad y anchura.

## Producción
Añade jueces independientes o verificadores deterministas cuando existan; registra branching factor, nodos evaluados, coste, latencia y razón de poda. Para dominios críticos, una rama con score alto no debe saltarse políticas o validación externa.

## Relaciones
**CoT (26)** es el recorrido lineal básico; **Self-Consistency (42)** agrega respuestas completas independientes; **Evaluator-Optimizer (4)** refina una solución; ToT explora un espacio de soluciones.