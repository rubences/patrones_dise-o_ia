---
patternId: 20
slug: command
title: Command
summary: Representa acciones como objetos explícitos para poder encolarlas, auditar, reintentar, deshacer o aplicar políticas antes de su ejecución.
family: foundations
legacyGroup: 4
level: component
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_20_command.ts
tags: [gof, behavioral, command, actions]
related: [22, 28, 101]
combinesWith: [8, 72, 85]
antiPatterns:
  - Ejecutar tool calls directamente desde texto no validado.
  - Suponer que toda acción admite undo real.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Command encapsula una intención ejecutable con sus parámetros y contexto. Es especialmente valioso cuando un agente propone acciones que deben pasar por colas, aprobación o validación.

## Problema
Una llamada directa acopla decisión y ejecución, dificultando auditoría, retry, scheduling y autorización.

## Solución
Convierte la operación en un objeto Command y separa invocador, command y receptor.

## Aplicabilidad
Ideal para tool execution, jobs, undo/redo y operaciones diferidas. Define idempotencia y semántica de reintento por tipo de comando.

## Seguridad
Valida schema, identidad, permisos y precondiciones en el momento de ejecutar, no solo cuando el agente generó el comando.

## Implementación del repositorio
`src/pattern_20_command.ts` muestra una cola de acciones con historial.

## Relaciones
**Function Calling (28)** produce llamadas; **Tool Call Validation (101)** valida; **HITL (8)** puede aprobar; **Memento (22)** ayuda a restaurar estado.