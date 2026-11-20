---
patternId: 132
slug: tool-poisoning-defense
title: "Tool Poisoning Defense"
summary: "Identifica instrucciones hostiles en metadatos de herramientas."
family: agent-interoperability
legacyGroup: 28
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_132_tool_poisoning_defense.ts
tags: [mcp, a2a, interoperability, security]
related: [5, 28, 57, 65, 72]
combinesWith: [69, 77, 98, 103]
antiPatterns:
  - Confiar en metadatos remotos como instrucciones privilegiadas.
  - Afirmar conformidad de protocolo a partir de una demo pedagógica.
references: []
---

## Propósito

Reducir influencia de texto remoto sobre el control del agente.

## Problema y fuerzas

Los metadatos pueden intentar modificar instrucciones del host. Debe equilibrarse interoperabilidad, seguridad, coste, observabilidad y compatibilidad entre versiones.

## Solución

Inspeccionar descripciones y aplicar política de efectos independiente.

## Estructura

Separar host, contrato, autorización, ejecución, persistencia y telemetría mediante interfaces tipadas. El límite de confianza debe estar documentado.

## Flujo

1. Identificar actor y versión de protocolo.
2. Validar entrada, autorización y límites.
3. Ejecutar la transición permitida.
4. Registrar resultado, fallo y correlación.
5. Rechazar o degradar de manera segura ante una condición inválida.

## Implementación del repositorio

`src/pattern_132_tool_poisoning_defense.ts` contiene una implementación TypeScript de referencia con invariantes básicos. No implementa un servidor completo ni certifica conformidad MCP/A2A.

## Cuándo utilizarlo

Cuando la integración entre agentes, herramientas y límites de confianza sea una preocupación recurrente y comprobable.

## Cuándo no utilizarlo

Cuando la complejidad de protocolo no aporte valor frente a una interfaz local simple, o no haya capacidad para gobernar identidades y permisos.

## Fallos, seguridad y gobierno

Inyección, instrucciones ocultas y falsos negativos. Requiere pruebas negativas, control de identidad y registro de decisiones. No confiar únicamente en heurísticas textuales de detección.

## Observabilidad y evaluación

Tasa de ataques detectados y falsos positivos. Documentar versiones, corpus de pruebas, entorno y falsos positivos/negativos.

## Evidencia y alcance

Patrón arquitectónico propuesto por el proyecto. `needs-review`: la bibliografía normativa y académica está recopilada en `research/INTEROPERABILIDAD_AGENTES_MCP_A2A_2026.md`, pero todavía no se ha promovido a evidencia primaria por patrón con `scopeNote`. No atribuir resultados experimentales a este código.

## Producción

Requiere adaptadores reales, pruebas de conformidad, aislamiento de secretos, políticas de autorización y mecanismos de recuperación antes de despliegue.

## Relaciones

Relacionado con 5, 28, 57, 65 y 72. Se combina con 69, 77, 98 y 103.
