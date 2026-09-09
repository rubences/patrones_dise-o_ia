---
patternId: 28
slug: function-calling
title: Function Calling
summary: Permite que un modelo proponga llamadas estructuradas a funciones, separando la selección semántica de herramientas de su validación y ejecución real.
family: agentic-workflows
legacyGroup: 5
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_28_function_calling.ts
tags: [tools, function-calling, structured-actions, agents]
related: [5, 20, 83, 101]
combinesWith: [8, 53, 72, 77, 100]
antiPatterns:
  - Ejecutar directamente una llamada porque el LLM la propuso.
  - Usar parsing heurístico de texto como sustituto de un protocolo estructurado.
  - Exponer herramientas con permisos más amplios que los necesarios.
references: []
---
# Propósito
Function Calling establece un puente entre lenguaje natural y operaciones estructuradas. El modelo puede **proponer** una función y argumentos; el runtime conserva la responsabilidad de validar, autorizar, ejecutar y devolver el resultado.

## Problema
Pedir al modelo que describa en texto qué acción realizar es frágil: nombres, argumentos y tipos pueden ser ambiguos. Al mismo tiempo, permitir que texto generado invoque directamente backends crea un límite de seguridad peligroso.

## Solución
Publica un catálogo de tools con schemas y separa claramente las fases:

```text
User request
   -> Model selects tool + arguments
   -> Schema validation
   -> Authorization / policy
   -> Execute tool
   -> Sanitize result
   -> Model integrates observation
```

El modelo decide semánticamente **qué le gustaría hacer**; el sistema decide **qué está permitido hacer realmente**.

## Aplicabilidad
Es la base de agentes que consultan APIs, bases de datos, calendarios, correo, sistemas empresariales o herramientas de desarrollo. Si solo necesitas generar texto, no añade valor.

## Seguridad
Cada llamada debe considerar:
- schema estricto y campos requeridos;
- allowlist de tools por identidad/rol;
- validación semántica de argumentos;
- límites de recursos;
- confirmación para operaciones sensibles;
- idempotency key cuando corresponda;
- sanitización de tool output antes de reinyectarlo en contexto;
- auditoría de propuesta, decisión y resultado.

## Implementación del repositorio
`src/pattern_28_function_calling.ts` contiene un registry de funciones y schemas descriptivos, pero la demo **no utiliza un mecanismo nativo de tool calling**: pide al LLM texto con formato `FUNCIÓN | PARÁMETROS` y luego decide qué ejecutar buscando palabras como `clima`, `calcular` o `consultar`. Los argumentos reales también están codificados en la demo.

Además, la función `calcular` usa `eval()` después de un filtrado básico. Aunque el ejemplo restringe caracteres, una implementación de producción debería sustituirlo por un parser/evaluador matemático seguro y nunca generalizar este enfoque a ejecución de código.

## Mejoras para producción
1. Usar llamadas de herramienta estructuradas del runtime/proveedor.
2. Validar argumentos con JSON Schema/Zod antes del dispatch.
3. Encadenar **Access Control (72)** y **Tool Call Validation (101)**.
4. Sanitizar resultados con **Tool Output Sanitization (100)**.
5. Registrar tool name, arguments hash, actor, policy decision y resultado.
6. Distinguir tools read-only de tools con efectos.

## Relaciones
**Tool Use (5)** expresa la capacidad general; **Command (20)** encapsula acciones; **Dynamic Tool Discovery (83)** descubre herramientas; **Tool Call Validation (101)** valida llamadas concretas; **HITL (8)** controla operaciones de alto riesgo.