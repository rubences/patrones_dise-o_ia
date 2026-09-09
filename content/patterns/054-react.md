---
patternId: 54
slug: react
title: ReAct
summary: Intercala deliberación, acciones de herramienta y observaciones externas para que el agente adapte su siguiente decisión a evidencia obtenida durante la ejecución.
family: reasoning
legacyGroup: 6
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_54_react.ts
tags: [reasoning, acting, tools, react, agents]
related: [27, 28, 55]
combinesWith: [53, 72, 77, 100, 101]
antiPatterns:
  - Exponer una traza de pensamiento libre como mecanismo de auditoría.
  - Parsear acciones sensibles desde texto libre mediante regex.
  - Ejecutar tools sin schema, autorización, límites e idempotencia.
references:
  - Yao et al. (2022), ReAct: Synergizing Reasoning and Acting in Language Models.
---
# Propósito
ReAct combina razonamiento y actuación en un bucle donde las observaciones del entorno modifican la siguiente decisión. Su valor de ingeniería es conectar deliberación con **evidencia externa real** en lugar de exigir al modelo resolver todo desde conocimiento interno.

## Problema
Un modelo puede necesitar buscar, calcular o consultar sistemas antes de responder. Un plan completo generado al inicio puede quedar obsoleto tras la primera observación.

## Solución

```text
estado
 -> decidir siguiente acción
 -> ejecutar tool
 -> observar resultado
 -> actualizar estado
 -> decidir de nuevo
 -> finish
```

La implementación de producción no necesita exponer literalmente `THOUGHT:`. Es preferible conservar estado estructurado: objetivo, acción propuesta, argumentos, observación, policy decision y resultado.

## Aplicabilidad
Útil para investigación, troubleshooting, navegación de herramientas y tareas multi-step. Para flujos predecibles, Pipeline suele ser más barato y verificable.

## Seguridad
ReAct aumenta la superficie de riesgo porque los resultados de tools vuelven al contexto. Debe combinarse con validación de tool calls, control de acceso, sanitización de outputs, límites de pasos y separación entre herramientas read-only y mutadoras.

## Implementación del repositorio
`src/pattern_54_react.ts` implementa un loop máximo de ocho pasos y parsea `THOUGHT`/`ACTION` mediante expresiones regulares. Las herramientas son simuladas; `calcular()` usa `eval()` tras un filtrado básico y `buscar()` contiene un diccionario estático.

Por tanto:
- no es un protocolo estructurado de tool calling;
- la búsqueda no representa información web actual;
- `eval()` debe sustituirse por un evaluador seguro;
- la traza visible no debe confundirse con telemetría fiable del proceso interno.

## Producción
Modela acciones como Commands validados, añade goal verification, max cost/time, no-progress detection y observabilidad por span. El historial enviado al modelo debe compactarse para evitar crecimiento indefinido.

## Relaciones
**Agentic Loop (27)** es la estructura general; **Function Calling (28)** aporta acciones estructuradas; **Tool Output Sanitization (100)** protege la observación; **Tool Call Validation (101)** protege el dispatch.