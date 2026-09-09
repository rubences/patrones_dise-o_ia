---
patternId: 8
slug: human-in-loop
title: Human-in-the-Loop (HITL)
summary: Inserta aprobación o intervención humana en puntos de riesgo definidos, preservando automatización para tareas de bajo impacto y control para acciones sensibles.
family: human-experience
legacyGroup: 1
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_8_human_in_loop.ts
tags:
  - human-in-the-loop
  - approval
  - governance
  - risk
related:
  - 72
  - 95
  - 96
combinesWith:
  - 5
  - 6
  - 53
  - 72
  - 77
antiPatterns:
  - Solicitar aprobación humana para todas las acciones sin discriminar riesgo.
  - Permitir que el propio modelo decida y autorice una acción crítica.
  - Pedir aprobación sin mostrar contexto, impacto y alternativa de rechazo.
references: []
---

# Propósito

**Human-in-the-Loop (HITL)** introduce intervención humana explícita en decisiones o acciones que superan un umbral de riesgo. Mantiene la automatización donde resulta razonable y crea una frontera de responsabilidad donde la autonomía no es suficiente.

## El problema

Los agentes pueden proponer o ejecutar acciones con impacto financiero, legal, operativo o de seguridad. Una arquitectura completamente autónoma puede convertir un error probabilístico en un efecto irreversible; una arquitectura que exige revisión para todo elimina gran parte del valor de la automatización.

## La solución

Clasificar riesgo y definir puntos de aprobación:

```text
Tarea -> Propuesta IA -> Riesgo
                         |
                 +-------+-------+
                 |               |
              bajo            medio/alto
                 |               |
                 v               v
              ejecutar       revisión humana
                                 |
                       aprobar / rechazar / cambiar
```

La aprobación debe ser una decisión separada, autenticada y auditable.

## Implementación del repositorio

`src/pattern_8_human_in_loop.ts` genera una propuesta y extrae un nivel de riesgo buscando términos como `crítico`, `alto` o `medio` en la respuesta. Los niveles medio, alto y crítico requieren revisión.

La decisión humana está **simulada aleatoriamente** entre aprobar, rechazar o solicitar cambios. Esto permite demostrar las ramas del flujo, pero no representa una integración de aprobación real. Además, la clasificación de riesgo por búsqueda textual es una simplificación que debe sustituirse en producción por reglas, salida estructurada y política de riesgo explícita.

## Aplicabilidad

Utiliza HITL para:

- operaciones financieras o contractuales;
- borrado o modificación irreversible de datos;
- cambios de seguridad o infraestructura;
- acciones con efectos sobre terceros;
- casos de baja confianza o fuera de política;
- excepciones que requieren criterio experto.

## Cuándo no utilizarlo

No debe convertirse en una cola manual para tareas rutinarias de bajo riesgo. Diseña umbrales y políticas para que el humano intervenga donde su juicio cambia materialmente el nivel de seguridad o calidad.

## Failure modes

- **Approval fatigue:** demasiadas solicitudes reducen la calidad de revisión.
- **Rubber stamping:** el revisor aprueba por defecto sin evaluar.
- **Context deficit:** el humano no recibe información suficiente para decidir.
- **Bypass:** una ruta alternativa permite ejecutar sin pasar por aprobación.
- **Stale approval:** se ejecuta una acción distinta de la que fue aprobada.

## Seguridad

La aprobación debe vincularse criptográfica o lógicamente a la acción concreta, sus parámetros y su versión. Verifica identidad, autorización, expiración y separación de funciones. Una modificación posterior de parámetros debería invalidar la aprobación anterior.

## Observabilidad

Registra propuesta, clasificación de riesgo, política aplicada, revisor, decisión, timestamp, comentarios, acción finalmente ejecutada y cualquier cambio entre propuesta y ejecución. Estos eventos deben formar una cadena de auditoría consultable.

## Coste y latencia

HITL introduce latencia humana y coste operativo. El objetivo no es minimizar revisiones a cualquier precio, sino asignarlas de acuerdo con impacto y probabilidad de error. Métricas de cola y tiempo de decisión son esenciales para diseñar el umbral.

## Evaluación

Mide tasa de escalado, tiempo hasta decisión, porcentaje de rechazos/cambios, incidentes evitados, falsos positivos de riesgo y acciones críticas que llegaron a ejecución sin revisión.

## Patrones relacionados

- **Access Control (72):** determina quién está autorizado a aprobar o ejecutar.
- **Human Escalation / Handoff (95):** transfiere el caso completo cuando el agente deja de ser el actor principal.
- **Clarification Loop (96):** solicita información antes de decidir cuando la intención es ambigua.
- **Guardrails (53):** bloquea categorías de salida o acción antes del punto de aprobación.

## Estado editorial

La demo representa correctamente las ramas HITL, pero la decisión humana y parte de la clasificación de riesgo están simuladas. La ficha lo diferencia de una arquitectura productiva con identidad, autorización, políticas y auditoría reales.
