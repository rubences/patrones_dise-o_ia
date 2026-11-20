# Investigación 2026 — Patrones de segunda generación

**Corte:** 20-11-2026 · **Decisión:** IDs 103–122, sin renumerar 1–102.

## Clasificación

La ampliación distingue cuatro niveles: plataformas (AI Factory/Cognitive Core), desarrollo gobernado (SDD/GDD), datos-grafos-retrieval (Open Lakehouse, metadata fabric, typed graph, GraphRAG) y adaptación de modelos (LoRA/PEFT).

## AI Factory y Brains

AI Factory se incorpora como patrón de plataforma: lifecycle gobernado, registries, evaluación, serving, observabilidad y promoción. Cognitive Core formaliza «brain» como arquitectura modular de monitorización, predicción, evaluación, descomposición y coordinación; no como antropomorfismo.

## SDD y GDD

SDD trata la especificación como source of truth. GDD es una extensión **propia y experimental**: un grafo tipado de requisitos, decisiones, artefactos, tests y evidencias actúa como estructura de navegación y validación. No se afirma que «GDD» sea hoy una metodología académica estandarizada.

## Open Data Lakehouse

Iceberg aporta snapshots y tablas abiertas; federación de metadatos evita copiar contenidos y aplica tags/policies; una arquitectura open/borderless lakehouse puede servir analytics y agentes sobre una base gobernada. Esto formaliza lo explorado en SOLISS: lakehouse + AI Factory + contexto de grafo + trazabilidad.

## Grafos tipados

GQL aporta un estándar de property graph; SHACL valida RDF graphs con shapes; TGS 0.6 es una especificación comunitaria reciente para tipos, propiedades y links. El patrón Typed Knowledge Graph exige validación antes de usar el grafo como memoria, RAG o fuente de decisiones.

## RGA / GraphRAG

No se encontró «RGA» como acrónimo normalizado de una única técnica. El catálogo usa **GraphRAG / Graph-Augmented Generation** y conserva RGA solo como abreviatura informal de trabajo. Se añaden GraphRAG, Adaptive GraphRAG, RAPTOR, Self-RAG y CRAG.

## LoRA y derivados

LoRA, QLoRA, AdaLoRA, DoRA, PiSSA, LoRA+, rsLoRA y LoftQ se modelan como patrones distintos porque cambian dimensiones diferentes: cuantización, presupuesto de rank, descomposición, inicialización, learning rates y scaling. Las demos TypeScript describen configuración e invariantes; no simulan entrenamiento tensorial.

## Medium como señal secundaria

La revisión de Medium identificó señales convergentes: Thoughtworks sobre SDD; next-token sobre AI Factory y data foundation; Google Cloud Community sobre Open Lakehouse; Graph Praxis sobre retrieval composable; y artículos recientes de PEFT sobre LoRA/QLoRA/DoRA. **Medium no entra en el baseline de evidencia primaria**: sirve para adopción, vocabulario y problemas operativos.

## Resultado

El catálogo pasa conceptualmente a **122 patrones / 14 macrofamilias**, añadiendo AI Platforms & Factories, Development & Governance, Data & Graph Foundations y Model Adaptation & PEFT. GDD queda fuera del mínimo de evidencia primaria hasta disponer de evidencia directa o una formalización propia publicada y evaluada.
