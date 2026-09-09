---
patternId: 40
slug: branching
title: Branching
summary: Selecciona o ejecuta múltiples caminos de workflow en función de condiciones explícitas, permitiendo flujos no lineales y combinables.
family: agentic-workflows
legacyGroup: 8
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_40_branching.ts
tags: [branching, routing, workflow, conditional]
related: [2, 13, 14]
combinesWith: [4, 43, 77]
antiPatterns:
  - Ocultar condiciones de routing críticas en prompts no testeados.
  - Ejecutar ramas costosas en paralelo y elegir la primera sin compararlas.
  - Mantener una rama default que haga acciones sensibles sin policy específica.
references: []
---
# Propósito
Branching introduce bifurcaciones controladas en un workflow. Una entrada puede activar una rama, varias ramas o ejecución paralela seguida de selección/merge.

## Implementación del repositorio
`src/pattern_40_branching.ts` define ramas Técnica, Creativa, Analítica y Default mediante keywords. Soporta modos `primera`, `todas` y `paralelo-mejor`.

En `paralelo-mejor` la demo ejecuta todas las ramas aplicables pero devuelve **el primer resultado**, sin un criterio real para determinar cuál es mejor. Esto debe sustituirse por scoring/aggregation explícito en producción.

## Producción
Versiona condiciones, mide distribución entre ramas, define política de merge y prueba casos de solapamiento. Las decisiones con impacto de seguridad deben usar reglas deterministas o policy engines cuando sea posible.

## Relaciones
**Router (2)** suele elegir un especialista; Branching modela caminos completos y puede ejecutar más de uno. **Strategy (13)** cambia algoritmo dentro de una etapa.