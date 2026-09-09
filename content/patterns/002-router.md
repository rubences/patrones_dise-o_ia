---
patternId: 2
slug: router
title: Router
summary: Clasifica una solicitud y la dirige al especialista, modelo o flujo más apropiado, con una vía de escalado cuando la decisión no alcanza suficiente confianza.
family: agentic-workflows
legacyGroup: 1
level: workflow
difficulty: beginner
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_2_router.ts
tags:
  - routing
  - classification
  - specialists
  - escalation
related:
  - 13
  - 14
  - 38
  - 39
  - 40
combinesWith:
  - 5
  - 8
  - 53
  - 77
antiPatterns:
  - Forzar una ruta aunque la clasificación sea ambigua.
  - Utilizar un único prompt especialista para dominios con políticas incompatibles.
  - Confundir el score producido por el modelo con una probabilidad calibrada.
references: []
---

# Propósito

**Router** decide qué componente especializado debe atender una solicitud. Separa la decisión de encaminamiento de la ejecución especializada, permitiendo que cada destino tenga instrucciones, herramientas, políticas o modelos distintos.

## El problema

Un asistente generalista suele mezclar dominios y políticas. Cuando las solicitudes abarcan facturación, soporte técnico, devoluciones u otras áreas, una única configuración aumenta la superficie de error y dificulta asignar controles diferentes a cada caso.

## La solución

Introduce una fase ligera de clasificación antes de ejecutar el trabajo:

```text
Solicitud
   |
   v
+---------+
| Router  |
+----+----+
     |
  +--+-----------+------------+
  v              v            v
Especialista A  Especialista B  Humano
```

El router devuelve una ruta y metadatos suficientes para decidir si la clasificación es aceptable o debe escalarse.

## Implementación del repositorio

`src/pattern_2_router.ts` modela tres departamentos —facturación, técnico y devoluciones—. La decisión se obtiene mediante Structured Outputs con `departamento`, `confianza` y `motivo`. Si la confianza queda por debajo de un umbral configurable, el flujo deriva a un humano en lugar de activar un especialista.

## Aplicabilidad

Resulta útil cuando:

- existen dominios claramente diferenciados;
- cada dominio requiere prompts, herramientas o políticas propias;
- quieres optimizar costes usando modelos diferentes por ruta;
- una clasificación incierta debe detener o escalar el proceso.

## Cuándo no utilizarlo

Evítalo cuando todas las solicitudes requieren prácticamente el mismo tratamiento o cuando una petición necesita simultáneamente varios especialistas; en ese caso, Multi-Agent u Orchestrator-Workers puede representar mejor el problema.

## Failure modes

- **Misrouting:** una clasificación incorrecta activa el especialista equivocado.
- **Ambigüedad oculta:** el router devuelve una sola etiqueta aunque la solicitud abarque varias áreas.
- **Confianza no calibrada:** tratar un número generado por el LLM como una probabilidad estadística real.
- **Derivación circular:** varios routers se reenvían la petición sin resolverla.

## Seguridad

La decisión de routing no debe otorgar por sí sola permisos. La autorización de herramientas o datos debe realizarse después mediante controles explícitos como Access Control. También conviene limitar qué información sensible recibe cada especialista.

## Observabilidad

Registra distribución por rutas, tasa de escalado, errores de clasificación confirmados, latencia del router y resultados por destino. Una matriz de confusión construida con casos revisados es más informativa que la confianza declarada por el modelo.

## Coste y latencia

Añade una decisión previa, pero puede ahorrar coste global si permite usar especialistas más pequeños o ejecutar únicamente el componente necesario.

## Evaluación

Usa un conjunto etiquetado de solicitudes y mide precisión por clase, falsos negativos en rutas críticas, tasa de escalado y coste por decisión. Evalúa de forma específica los casos ambiguos y multietiqueta.

## Patrones relacionados

- **Strategy (13):** intercambia algoritmos dentro de un mismo contexto.
- **Chain of Responsibility (14):** prueba manejadores de forma encadenada.
- **Mixture of Experts (38):** selecciona expertos de forma más integrada.
- **Cascade (39):** escala entre modelos según coste o confianza.
- **Branching (40):** modela bifurcaciones condicionales dentro de un workflow.

## Estado editorial

La implementación demuestra routing tipado y fallback humano. El valor `confianza` procede del propio modelo y no debe presentarse como calibrado hasta que exista una evaluación empírica específica.
