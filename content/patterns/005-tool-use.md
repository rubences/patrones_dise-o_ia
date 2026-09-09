---
patternId: 5
slug: tool-use
title: Tool Use
summary: Permite que el modelo decida cuándo necesita una capacidad externa, invoque una herramienta y utilice su resultado para completar una tarea.
family: agentic-workflows
legacyGroup: 1
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_5_tool_use.ts
tags:
  - tools
  - api
  - function-calling
  - external-data
related:
  - 28
  - 72
  - 83
  - 101
combinesWith:
  - 2
  - 53
  - 69
  - 72
  - 100
  - 101
antiPatterns:
  - Permitir que el modelo ejecute herramientas sin validación de argumentos.
  - Confiar en el contenido devuelto por una herramienta como si fueran instrucciones de sistema.
  - Dar acceso a más herramientas o permisos de los necesarios.
references: []
---

# Propósito

**Tool Use** extiende al LLM con capacidades que no posee por sí mismo: consultar APIs, recuperar datos, ejecutar cálculos o interactuar con sistemas externos.

## El problema

El modelo puede razonar sobre información disponible en su contexto, pero no debe inventar datos actuales ni ejecutar acciones reales sin una interfaz explícita. Además, mezclar decisión, ejecución y resultados sin separación dificulta controlar permisos y errores.

## La solución

Introduce un ciclo de decisión y ejecución:

```text
Pregunta -> LLM -> ¿herramienta?
                  | sí
                  v
              Tool Gateway
                  |
                  v
              Resultado
                  |
                  +------> LLM -> Respuesta
```

La herramienta debe exponer un contrato definido; el sistema valida la llamada, ejecuta fuera del modelo y devuelve el resultado como datos no confiables.

## Implementación del repositorio

`src/pattern_5_tool_use.ts` define un catálogo demostrativo de búsqueda web, acceso API, base de datos y ejecución de scripts. La demo infiere de forma textual si el razonamiento contiene la palabra “buscar” y simula las herramientas con respuestas locales.

Por tanto, el ejemplo representa el **flujo conceptual**, pero no usa todavía function calling estructurado ni ejecutores reales. Para producción, el patrón 28 y el patrón 101 proporcionan una base más contractual.

## Aplicabilidad

Utilízalo cuando una tarea requiera:

- datos actuales o privados;
- cálculos o validaciones deterministas;
- interacción con APIs y servicios;
- lectura o escritura en sistemas externos;
- ejecución de acciones con trazabilidad.

## Cuándo no utilizarlo

No añadas herramientas si el modelo puede resolver la tarea de forma autosuficiente y el acceso externo no aporta valor. Cada tool aumenta superficie de fallo, seguridad y observabilidad.

## Failure modes

- **Tool hallucination:** el modelo intenta invocar herramientas inexistentes.
- **Argumentos inválidos:** parámetros incompletos o fuera de rango.
- **Indirect prompt injection:** datos externos incluyen instrucciones maliciosas.
- **Acciones repetidas:** un reintento duplica una operación con efectos laterales.
- **Privilege escalation:** una herramienta permite más de lo necesario.

## Seguridad

Combínalo con mínimo privilegio, allowlists, validación de argumentos y sanitización de salidas. Las operaciones destructivas o de alto impacto requieren autorización independiente del texto generado por el modelo.

## Observabilidad

Registra tool seleccionada, argumentos validados, identidad/autorización, resultado, latencia, errores, reintentos y correlación con la decisión que originó la llamada. Evita almacenar secretos o PII sin política explícita.

## Coste y latencia

Las llamadas externas pueden dominar la latencia total. El coste LLM puede crecer si cada resultado requiere una segunda llamada, aunque a cambio se reduce la necesidad de que el modelo improvise información no disponible.

## Evaluación

Mide precisión de selección de herramientas, validez de argumentos, tasa de éxito, acciones innecesarias, repetición accidental y calidad de la respuesta tras integrar el resultado.

## Patrones relacionados

- **Function Calling (28):** formaliza selección y argumentos mediante contratos estructurados.
- **Dynamic Tool Discovery (83):** descubre herramientas disponibles dinámicamente.
- **Access Control (72):** autoriza quién puede usar cada capacidad.
- **Tool-Output Sanitization (100):** trata la salida externa como datos potencialmente hostiles.
- **Tool Call Validation Gate (101):** valida la llamada antes de ejecutar.

## Estado editorial

La implementación actual es deliberadamente pedagógica: las herramientas y su detección están simuladas. La ficha separa esa simplificación de los requisitos de una implementación productiva.
