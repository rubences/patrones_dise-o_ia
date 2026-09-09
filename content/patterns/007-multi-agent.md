---
patternId: 7
slug: multi-agent
title: Multi-Agent
summary: Coordina varios agentes especializados para analizar una misma tarea desde perspectivas distintas y sintetizar sus contribuciones en un resultado común.
family: multi-agent
legacyGroup: 1
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_7_multi_agent.ts
tags:
  - multi-agent
  - orchestration
  - specialization
  - synthesis
related:
  - 56
  - 57
  - 60
  - 63
  - 65
  - 87
combinesWith:
  - 44
  - 65
  - 77
antiPatterns:
  - Añadir agentes sin una responsabilidad diferenciada.
  - Sintetizar contribuciones sin conservar desacuerdos ni procedencia.
  - Usar más agentes como sustituto de una mejor descomposición del problema.
references: []
---

# Propósito

**Multi-Agent** distribuye una tarea entre varios agentes con roles diferenciados y utiliza un mecanismo de coordinación para combinar sus resultados. El objetivo es obtener especialización, paralelismo o diversidad de perspectivas que un único rol no ofrece de forma natural.

## El problema

Una sola instancia puede tener que investigar, diseñar, revisar y documentar al mismo tiempo. Esa mezcla de responsabilidades dificulta aplicar criterios específicos, aprovechar paralelismo y conservar desacuerdos útiles entre perspectivas.

## La solución

Separar especialistas y coordinación:

```text
                 +--> Investigador --+
Tarea -> fan-out +--> Desarrollador --+--> Orquestador -> Resultado
                 +--> Revisor --------+
                 +--> Documentador ---+
```

Los agentes deben tener roles explícitos, contratos de salida y un mecanismo para resolver duplicidades, contradicciones y dependencias.

## Implementación del repositorio

`src/pattern_7_multi_agent.ts` define cuatro roles: investigador, desarrollador, revisor y documentador. Los ejecuta en paralelo mediante `Promise.all` y un orquestador sintetiza las contribuciones.

La propiedad `confianza` de cada contribución se genera actualmente con `Math.random()` entre 0.6 y 1.0. Por tanto, el “consenso” calculado a partir de esa confianza es **una simulación pedagógica**, no una métrica de acuerdo real entre agentes.

## Aplicabilidad

Utiliza Multi-Agent cuando:

- existen responsabilidades realmente diferenciables;
- varias perspectivas pueden ejecutarse en paralelo;
- necesitas independencia entre producción y revisión;
- la tarea se beneficia de diversidad de estrategias o dominios;
- quieres asignar modelos, herramientas o permisos distintos por rol.

## Cuándo no utilizarlo

Evítalo cuando un solo agente con herramientas y un workflow claro resuelva la tarea. La multiplicación de agentes añade coste de coordinación, contexto y resolución de conflictos.

## Failure modes

- **Role collapse:** todos los agentes producen prácticamente lo mismo.
- **Coordination tax:** la síntesis cuesta más que el beneficio del paralelismo.
- **Error amplification:** el orquestador combina varias respuestas incorrectas.
- **False consensus:** una métrica superficial oculta contradicciones importantes.
- **Context explosion:** demasiadas contribuciones saturan el contexto del sintetizador.

## Seguridad

Aplica permisos por agente y herramienta. No todos los especialistas necesitan acceso a los mismos datos o capacidades. El orquestador tampoco debería poder elevar privilegios simplemente porque varios agentes recomienden una acción.

## Observabilidad

Conserva cada contribución por separado, rol, versión de prompt/modelo, tiempo, tokens y decisión final del orquestador. Registra también qué partes de la síntesis proceden de qué agentes y dónde hubo desacuerdo.

## Coste y latencia

El paralelismo puede reducir latencia de pared, pero aumenta el consumo total de inferencia y el tamaño de la síntesis. Limita el número de agentes a los que aporten información no redundante.

## Evaluación

Compara Multi-Agent con un baseline de agente único. Mide calidad final, diversidad útil, redundancia, coste, latencia, tasa de conflicto y contribución marginal de cada rol mediante ablaciones.

## Patrones relacionados

- **Agent Swarm (56):** coordinación más distribuida y emergente.
- **Task Delegation (57):** asigna subtareas concretas a especialistas.
- **Orchestrator-Workers (60):** formaliza el patrón coordinador/trabajadores.
- **Debate (63):** usa desacuerdo explícito como mecanismo de deliberación.
- **Agent Registry (65):** descubre y describe agentes disponibles.
- **Blackboard (87):** coordina agentes mediante un espacio de trabajo compartido.

## Estado editorial

La arquitectura de fan-out y síntesis está implementada, pero la confianza y el consenso de la demo son simulados. La edición publicada lo señala de forma explícita para impedir interpretar esos valores como evidencia experimental.
