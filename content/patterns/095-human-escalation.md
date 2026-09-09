---
patternId: 95
slug: human-escalation
title: Human Escalation / Handoff
summary: Transfiere una conversación a una persona cuando la política, el usuario o los fallos acumulados lo requieren, entregando contexto accionable y ownership explícito.
family: human-experience
legacyGroup: 22
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_95_human_escalation.ts
tags: [handoff, escalation, human, support]
related: [8, 44, 96]
combinesWith: [53, 72, 77]
antiPatterns:
  - Escalar una categoría sensible pero asignarle prioridad solo por número de intentos fallidos.
  - Transferir historial completo sin filtrar secretos o PII innecesaria.
  - Crear un paquete de handoff sin cola, ownership ni estado de aceptación humana.
references: []
---
# Propósito
Human Escalation transfiere ownership cuando el agente no debe o no puede continuar, evitando que el usuario tenga que reconstruir el caso desde cero.

## Implementación del repositorio
`src/pattern_95_human_escalation.ts` escala si el usuario lo pide, si la categoría está en una allowlist de escalada obligatoria o si se alcanza un umbral de intentos fallidos. Construye un paquete con resumen, intentos, categoría, prioridad e historial.

La prioridad se calcula solo a partir de intentos fallidos. Por ello una categoría sensible que escala inmediatamente, como `fraude`, puede terminar con prioridad `media` aunque la política de negocio requiera prioridad alta. El resumen es una concatenación de los últimos tres turnos y no existe una cola real ni confirmación de que un humano haya aceptado el caso.

## Producción
Modela estados `requested/queued/accepted/owned/resolved`, SLA y routing por categoría. Sanitiza el contexto antes del handoff y conserva artefactos útiles sin transferir datos innecesarios.

## Relaciones
**Human-in-Loop (8)** aprueba una acción puntual; Handoff transfiere la sesión. **Clarification Loop (96)** intenta resolver ambigüedad antes de escalar.