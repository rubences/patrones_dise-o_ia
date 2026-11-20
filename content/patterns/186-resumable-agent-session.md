---
patternId: 186
slug: resumable-agent-session
title: "Resumable Agent Session"
summary: "Patrón de referencia para resumable agent session con contratos explícitos, comprobaciones negativas y límites de ejecución."
family: agent-runtime-harness
legacyGroup: 30
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_186_resumable_agent_session.ts
tags: [agent, harness, engineering, governance]
related: [27, 44, 72, 103]
combinesWith: [53, 77, 98, 134]
antiPatterns:
  - Ejecutar efectos sin autorización independiente.
  - Confundir contrato pedagógico con conformidad o despliegue real.
references: []
---

## Propósito

Resumable Agent Session permite expresar un control arquitectónico verificable en el ciclo de vida de agentes de software.

## Problema y fuerzas

Los agentes de larga duración deben equilibrar autonomía, recuperación, calidad, presupuesto y seguridad. Sin un contrato explícito aparecen ejecuciones no acotadas, cambios no revisados y estados difíciles de reproducir.

## Solución

Separar propuesta, validación y autorización de cualquier efecto externo. Cada operación debe identificar precondiciones, actor, límite y resultado observable.

## Estructura

Una implementación tipada independiente del proveedor, con adaptadores externos para herramientas, persistencia y políticas.

## Flujo

1. Validar entrada e identidad.
2. Comprobar límites y estado anterior.
3. Evaluar la transición o decisión.
4. Devolver resultado tipado o denegación.
5. Registrar evidencia de pruebas y errores.

## Implementación del repositorio

`src/pattern_186_resumable_agent_session.ts` ofrece el contrato de referencia. **No ejecuta comandos, despliegues ni operaciones remotas reales.** Las pruebas deben incluir casos negativos antes de considerarlo apto para integración.

## Cuándo utilizarlo

Cuando exista una preocupación recurrente de fiabilidad, seguridad o trazabilidad que no se resuelva mediante una llamada aislada al modelo.

## Cuándo no utilizarlo

Cuando no exista el mecanismo de autorización o supervisión necesario para materializar efectos, o la complejidad supere los beneficios.

## Fallos, seguridad y gobierno

Comprobar acceso entre identidades, reintentos, entradas inválidas, estados finales y decisiones denegadas. En producción se necesitan adaptadores seguros y controles independientes.

## Observabilidad y evaluación

Registrar transiciones correctas e inválidas, errores, presupuesto, latencia y cobertura de pruebas con versiones de runtime y dataset.

## Evidencia y alcance

`needs-review`: fuentes y estudios están reunidos en `research/P9_SEVEN_MACROFAMILIES_56_PATTERNS.md`. El código es una propuesta pedagógica y no reproduce benchmarks ni garantías de los artículos.

## Producción

Requiere integración con sandbox, autorización, telemetría, control de secretos y revisión humana según el efecto.

## Relaciones

Relacionado con patrones 27, 44, 72 y 103; composición con 53, 77, 98 y 134.
