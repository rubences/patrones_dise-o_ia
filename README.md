# 🤖 14 Patrones de Diseño para Sistemas Agénticos con IA

Una colección profesional y exhaustiva de **patrones de diseño** para construir flujos de trabajo agénticos robustos: 8 patrones específicos para agentic workflows + 6 patrones de diseño clásicos (Gang of Four) **adaptados al contexto de sistemas de IA**.

**Fusión de:**
- 🎯 **Agentic Workflows** (AIMultiple + Microsoft Azure)
- 🏛️ **Design Patterns Clásicos** (refactoring.guru - Gang of Four)
- 💻 **TypeScript + OpenAI SDK v6** (implementación moderna)

---

## 📚 Tabla de Contenidos

1. [¿Por qué estos patrones?](#por-qué-estos-patrones)
2. [Grupo 1: Patrones Agénticos (1-8)](#grupo-1-patrones-agénticos-1-8)
3. [Grupo 2: Patrones Clásicos Adaptados (9-14)](#grupo-2-patrones-clásicos-adaptados-9-14)
4. [Comparativa Completa](#comparativa-completa)
5. [Instalación](#instalación)
6. [Uso](#uso)
7. [Archirectura y Combinaciones](#arquitectura-y-combinaciones)
8. [Casos de Uso Avanzados](#casos-de-uso-avanzados)

---

## ¿Por qué estos patrones?

### El Problema
Los sistemas de IA modernos requieren arquitecturas **más flexibles y sofisticadas** que los sistemas tradicionales:

| Problema | Solución |
|----------|----------|
| Respuestas no estructuradas del LLM | **Structured Outputs** + **Adapter** |
| Lógica compleja con múltiples puntos de decisión | **Router** + **Chain of Responsibility** |
| Tareas complejas que requieren descomposición | **Planning** + **Builder** |
| Necesidad de diferentes estilos de respuesta | **Strategy** (directa, reflexiva, creativa) |
| Falta de herramientas reutilizables | **Factory** (crear agentes especializados) |
| Comportamientos transversales (logging, retry, cache) | **Decorator** |
| Supervisión humana en decisiones críticas | **Human-in-the-Loop** |
| Colaboración entre agentes especializados | **Multi-Agent** + **Fan-out/Fan-in** |

---

## GRUPO 1: Patrones Agénticos (1-8)

Patrones específicos para construir flujos de trabajo impulsados por IA donde agentes toman decisiones autónomas.

### **Pattern 1: PIPELINE** — Cadena de Montaje Secuencial
```
Input → [Paso 1] → [Paso 2] → [Paso 3] → Output
```

**Uso:** Procesamiento secuencial con transformaciones en cada paso
- Generación de contenido (tema → esquema → borrador → título)
- ETL de datos
- Validación progresiva

**Ejecución:** `npm run pattern:1`

---

### **Pattern 2: ROUTER** — Clasificación y Enrutamiento
```
Entrada → [Clasificar] → ¿Qué tipo es? → [Especialista 1 / 2 / Humano]
```

**Uso:** Dirigir solicitudes al manejador apropiado
- Soporte técnico multicanal
- Clasificación de tickets
- Enrutamiento de cargas de trabajo

**Ejecución:** `npm run pattern:2`

---

### **Pattern 3: REFLECTION** — Auto-Evaluación e Iteración
```
v1 → [Evalúa críticamente] → Encuentra errores → [Mejora] → v2 (mejor)
```

**Uso:** Mejora iterativa mediante autocrítica
- Control de calidad de contenido
- Detección de inconsistencias
- Refinamiento automático

**Ejecución:** `npm run pattern:3`

---

### **Pattern 4: EVALUATOR-OPTIMIZER** — Escritor y Crítico
```
Borrador → [Rubric] → Puntuación → [¿Aprobado?] → Sí: Fin | No: Refina
```

**Uso:** Garantizar calidad final mediante evaluación explícita
- Documentación de alto valor
- Copywriting profesional
- Revisión de código

**Ejecución:** `npm run pattern:4`

---

### **Pattern 5: TOOL-USE** — Acceso a Recursos Externos
```
Pregunta → [¿Necesito herramientas?] → Sí → [Invoca API/búsqueda/BD] → [Integra] → Respuesta
```

**Uso:** Enriquecer respuestas con datos externos en tiempo real
- Consultas con información actual
- Acceso a APIs y bases de datos
- Búsqueda en internet

**Ejecución:** `npm run pattern:5`

---

### **Pattern 6: PLANNING** — Descomposición de Objetivos
```
Objetivo → [Descompone] → Subtareas → [Ordena] → [Evalúa] → [Refina] → Plan ejecutable
```

**Uso:** Resolver problemas complejos mediante planificación adaptativa
- Desarrollo de software
- Investigación
- Proyectos multifase

**Ejecución:** `npm run pattern:6`

---

### **Pattern 7: MULTI-AGENT** — Orquestación de Especialistas
```
         ┌─ Agente 1 (Investigador) ─┐
Tarea ──┤─ Agente 2 (Desarrollador) ─┼─▶ [Orquestador sintetiza] ─▶ Resultado
         └─ Agente 3 (Revisor) ──────┘
```

**Uso:** Análisis desde múltiples perspectivas en paralelo
- Decisiones complejas (técnica, finanzas, legal)
- Desarrollo en equipo virtual
- Evaluaciones multidisciplinarias

**Ejecución:** `npm run pattern:7`

---

### **Pattern 8: HUMAN-IN-THE-LOOP (HITL)** — Supervisión Humana
```
Propuesta IA → [Evalúa riesgo] → ¿Requiere aprobación? → Sí → [Humano decide]
                                   ↓ No
                               [Ejecuta automático]
```

**Uso:** Garantizar precisión y seguridad en decisiones críticas
- Transacciones financieras
- Cambios de configuración crítica
- Decisiones médicas/legales
- Eliminación de datos

**Ejecución:** `npm run pattern:8`

---

## GRUPO 2: Patrones Clásicos Adaptados (9-14)

Patrones de diseño probados del catálogo Gang of Four, **adaptados específicamente para sistemas de IA**.

### **Pattern 9: FACTORY** — Creación Flexible de Agentes ⚙️
```
[Fábrica de Agentes]
    │
    ├─ crearAgente("experto", "ML") ──▶ AgenteExperto
    ├─ crearAgente("generalista") ──▶ AgenteGeneralista
    ├─ crearAgente("supervisor") ──▶ AgenteSupervisor
    └─ crearEquipo([...]) ──▶ Equipo de agentes
```

**Referencia:** [Factory Method](https://refactoring.guru/design-patterns/factory-method)

**Problema:** Crear diferentes tipos de agentes (experto, generalista, supervisor) sin acoplamiento

**Solución:** Interfaz común `Agente` + Implementaciones concretas + `FabricaAgentes` centralizada

**Ventajas:**
- Desacoplamiento entre cliente y tipos de agentes
- Fácil agregar nuevas especializaciones
- Lógica de creación centralizada
- Facilita testing con mocks

**Ejemplo:**
```typescript
const fabrica = new FabricaAgentes();
const experto = fabrica.crearAgente({
  tipo: "experto",
  especializacion: "Arquitectura de Sistemas"
});
const equipo = fabrica.crearEquipo([
  { tipo: "experto", especializacion: "DevOps" },
  { tipo: "supervisor" }
]);
```

**Ejecución:** `npm run pattern:9`

---

### **Pattern 10: BUILDER** — Construcción de Prompts Fluida 🔨
```
new ConstructorPrompt()
  .conRol("Eres un experto")
  .conContexto("Trabajas en fintech")
  .conTarea("Analiza riesgo")
  .agregarConstraint("Sé conciso")
  .agregarEjemplo("entrada", "salida")
  .conFormato("JSON")
  .construir() ──▶ Prompt completo estructurado
```

**Referencia:** [Builder](https://refactoring.guru/design-patterns/builder)

**Problema:** Construir prompts complejos con múltiples componentes (rol, contexto, tarea, constraints, ejemplos, formato)

**Solución:** Interfaz fluida que permite composición paso a paso + Templates predefinidos

**Ventajas:**
- Prompts legibles y componibles
- Orden flexible
- Reutilización (templates)
- Testeable

**Ejemplo:**
```typescript
const promptClasificador = new ConstructorPrompt()
  .conRol("Clasificador de sentimientos")
  .conContexto("Opiniones de clientes")
  .conTarea("Clasifica: positivo/negativo/neutro")
  .agregarEjemplo("¡Excelente!", "positivo")
  .conFormato("JSON: {sentimiento, confianza}");

// O usar template
const prompt = TemplatesPrompt.analizador()
  .conContexto("Reporte financiero")
  .construir();
```

**Ejecución:** `npm run pattern:10`

---

### **Pattern 11: ADAPTER** — Conversión de Formatos 🔌
```
[Respuesta LLM (texto natural)]
         │
         ├─ AdapterJSON ──▶ {"respuesta": "..."}
         ├─ AdapterCSV ──▶ "respuesta_1", "respuesta_2"
         ├─ AdapterXML ──▶ <respuesta>...</respuesta>
         ├─ AdapterMarkdown ──▶ # Respuesta\n...
         └─ AdapterHTML ──▶ <html>...</html>
```

**Referencia:** [Adapter](https://refactoring.guru/design-patterns/adapter)

**Problema:** El LLM devuelve texto. Los sistemas downstream necesitan JSON, CSV, XML, HTML, etc.

**Solución:** Cadena de adaptadores que transforman la salida del LLM a múltiples formatos

**Ventajas:**
- LLM desacoplado de sistemas downstream
- Agregar nuevos formatos sin tocar LLM
- Conversión automática y consistente
- Manejo de errores centralizado

**Ejemplo:**
```typescript
const respuestaLLM = { contenido: "...", metadata: {} };

const gestor = new GestorAdaptadores();
gestor.registrarAdaptador("json", new AdapterJSON());
gestor.registrarAdaptador("xml", new AdapterXML());

const json = gestor.adaptar(respuestaLLM, "json");
const xml = gestor.adaptar(respuestaLLM, "xml");
```

**Ejecución:** `npm run pattern:11`

---

### **Pattern 12: DECORATOR** — Comportamientos Transversales 🎁
```
[Agente Base]
    ↓
[Decorator: Validación] ──▶ Verifica entrada/salida
    ↓
[Decorator: Caché] ──▶ Evita consultas repetidas
    ↓
[Decorator: Retry] ──▶ Reintentos con backoff
    ↓
[Decorator: Logging] ──▶ Traza ejecución
    ↓
[Agente decorado completo]
```

**Referencia:** [Decorator](https://refactoring.guru/design-patterns/decorator)

**Problema:** Agregar funcionalidad (logging, retry, caché, validación) sin modificar agentes

**Solución:** Stack de decoradores que envuelven el agente, cada uno agregando un comportamiento

**Ventajas:**
- Composición flexible (puedo stackear decoradores)
- Responsabilidad única (cada decorador hace una cosa)
- Testeable (pruebo cada decorador independientemente)
- Reutilizable

**Decoradores disponibles:**
- `DecoradorLogging`: Registra entrada/salida y duración
- `DecoradorRetry`: Reintentos exponenciales
- `DecoradorCache`: Cachéing con hash de entrada
- `DecoradorValidacion`: Valida entrada/salida
- `DecoradorTimeout`: Límite de tiempo de ejecución

**Ejemplo:**
```typescript
let agente = new AgenteSimple("Especialista", client);
agente = new DecoradorValidacion(agente);    // Valida entrada
agente = new DecoradorCache(agente);         // Cachea resultado
agente = new DecoradorRetry(agente, 3);      // 3 reintentos
agente = new DecoradorLogging(agente);       // Registra todo

// Usa como si fuera el agente original
await agente.procesar("pregunta");
```

**Ejecución:** `npm run pattern:12`

---

### **Pattern 13: STRATEGY** — Estrategias de Prompting 🎯
```
[Generador con Estrategia]
    │
    ├─ .setStrategy(StrategyDirecta) ──▶ Rápida, concisa
    ├─ .setStrategy(StrategyReflexiva) ──▶ Razonada, nuanceada
    ├─ .setStrategy(StrategyCreativa) ──▶ Innovadora, divergente
    ├─ .setStrategy(StrategyAnalítica) ──▶ Profunda, estructurada
    └─ .setStrategy(StrategySocrática) ──▶ Preguntas guía

    Todos con la misma interfaz `.generar(pregunta)`
```

**Referencia:** [Strategy](https://refactoring.guru/design-patterns/strategy)

**Problema:** Diferentes preguntas requieren diferentes estilos de respuesta (directa, reflexiva, creativa, analítica)

**Solución:** Familia de estrategias intercambiables, seleccionables en runtime

**Ventajas:**
- Cambiar comportamiento sin modificar cliente
- A/B testing de estrategias
- Encapsulación de lógica de prompting
- Fácil agregar nuevas estrategias

**Estrategias disponibles:**
1. **Directa:** Respuesta rápida, concisa
2. **Reflexiva:** Análisis profundo con múltiples perspectivas
3. **Creativa:** Ideas innovadoras y ángulos inesperados
4. **Analítica:** Rigor, descomposición, patrones
5. **Socrática:** Preguntas guía en lugar de respuestas

**Ejemplo:**
```typescript
const generador = new GeneradorConEstrategia(
  new EstrategiaDirecta()
);

// Cambiar estrategia en runtime
generador.cambiarEstrategia(new EstrategiaReflexiva());
const resultado = await generador.generar("Mi pregunta");

// Probar múltiples estrategias
for (const estrategia of [
  new EstrategiaDirecta(),
  new EstrategiaReflexiva(),
  new EstrategiaCreativa()
]) {
  generador.cambiarEstrategia(estrategia);
  await generador.generar("pregunta");
}
```

**Ejecución:** `npm run pattern:13`

---

### **Pattern 14: CHAIN OF RESPONSIBILITY** — Enrutamiento Jerárquico ⛓️
```
[Solicitud]
    │
    ▼
[Manejador Nivel 1: Soporte Simple]
    ¿Puedo manejar? ──▶ NO ──▶ siguiente
    
[Manejador Técnico]
    ¿Puedo manejar? ──▶ NO ──▶ siguiente
    
[Manejador Facturación]
    ¿Puedo manejar? ──▶ NO ──▶ siguiente
    
[Manejador Legal]
    ¿Puedo manejar? ──▶ NO ──▶ siguiente
    
[Manejador Supervisor]
    ¿Puedo manejar? ──▶ SÍ (última instancia) ──▶ Resuelve
```

**Referencia:** [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility)

**Problema:** Una solicitud puede necesitar diferentes tipos de procesamiento. No sabemos de antemano quién puede manejarla.

**Solución:** Cadena de manejadores. Cada uno decide si procesa o pasa al siguiente.

**Ventajas:**
- Desacoplamiento entre emisor y receptores
- Orden dinámico de manejadores
- Fácil agregar/remover manejadores
- Encadenamiento en runtime

**Manejadores disponibles:**
1. **Nivel 1:** Problemas simples/FAQ
2. **Técnico:** Problemas técnicos complejos
3. **Facturación:** Solicitudes de facturación
4. **Legal:** Asuntos legales
5. **Supervisor:** Última instancia

**Ejemplo:**
```typescript
const cadena = CadenaSoporteFactory.crearCadenaEstandar(client);

const solicitud = {
  contenido: "El sistema devuelve error 500",
  prioridad: "alta",
  campo: "soporte",
  intentos: 1
};

// Procesa automáticamente a través de la cadena
const respuesta = await cadena.manejar(solicitud);
// → Detecta que es problema técnico alto
// → Manejador Técnico lo maneja
```

**Ejecución:** `npm run pattern:14`

---

## Comparativa Completa

### Patrones Agénticos vs Clásicos

| # | Patrón | Categoría | Complejidad | Velocidad | Precisión | Mejor Para |
|---|--------|-----------|-------------|-----------|-----------|-----------|
| 1 | Pipeline | Agéntico | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Procesamiento secuencial |
| 2 | Router | Agéntico | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | Clasificación y enrutamiento |
| 3 | Reflection | Agéntico | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Control de calidad |
| 4 | Evaluator | Agéntico | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | Contenido de alto valor |
| 5 | Tool-Use | Agéntico | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Datos en tiempo real |
| 6 | Planning | Agéntico | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | Proyectos complejos |
| 7 | Multi-Agent | Agéntico | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Análisis multifacético |
| 8 | HITL | Agéntico | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | Decisiones críticas |
| 9 | Factory | Creational | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Crear agentes especializados |
| 10 | Builder | Creational | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Prompts complejos |
| 11 | Adapter | Structural | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Conversión de formatos |
| 12 | Decorator | Structural | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Funcionalidad transversal |
| 13 | Strategy | Behavioral | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Diferentes estilos de respuesta |
| 14 | Chain | Behavioral | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Enrutamiento jerárquico |

---

## 🚀 Instalación

### Requisitos
- Node.js 18+
- TypeScript 6+
- API key de OpenAI

### Setup

```bash
# Clonar repositorio
git clone https://github.com/rubences/patrones_dise-o_ia.git
cd patrones_dise-o_ia

# Instalar dependencias
npm install

# Configurar API key
export OPENAI_API_KEY="sk-..."
```

---

## 📖 Uso

### Ejecutar un patrón individual

```bash
npm run pattern:1   # Pipeline
npm run pattern:9   # Factory
npm run pattern:14  # Chain of Responsibility
```

### En tu código

```typescript
// Importar funciones de los patrones
import { escribirPost } from "./src/pattern_1_pipeline.js";
import { FabricaAgentes } from "./src/pattern_9_factory.js";
import { DecoradorRetry } from "./src/pattern_12_decorator.js";

// Usar patrón 1: Pipeline
const post = await escribirPost("Topic de IA");
console.log(`# ${post.titulo}\n\n${post.borrador}`);

// Usar patrón 9: Factory
const agente = FabricaAgentes.crearAgente({
  tipo: "experto",
  especializacion: "Machine Learning"
});

// Usar patrón 12: Decorator
let procesador = agente;
procesador = new DecoradorRetry(procesador, 3);
procesador = new DecoradorCache(procesador);
await procesador.procesarTarea(tarea, client);
```

---

## 📁 Estructura

```
src/
├── common.ts                              # Utilidades compartidas
│
├── PATRONES AGÉNTICOS (1-8)
├── pattern_1_pipeline.ts                  # Sequential transformation
├── pattern_2_router.ts                    # Classification & routing
├── pattern_3_reflection.ts                # Self-evaluation
├── pattern_4_evaluator_optimizer.ts       # Quality assurance loop
├── pattern_5_tool_use.ts                  # External tool invocation
├── pattern_6_planning.ts                  # Task decomposition
├── pattern_7_multi_agent.ts               # Specialist collaboration
├── pattern_8_human_in_loop.ts             # Human approval gating
│
├── PATRONES CLÁSICOS ADAPTADOS (9-14)
├── pattern_9_factory.ts                   # Flexible agent creation
├── pattern_10_builder.ts                  # Fluent prompt construction
├── pattern_11_adapter.ts                  # Format conversion
├── pattern_12_decorator.ts                # Cross-cutting concerns
├── pattern_13_strategy.ts                 # Pluggable prompting styles
└── pattern_14_chain.ts                    # Hierarchical routing
```

---

## Arquitectura y Combinaciones

### Combinación 1: Content Generation Pipeline
```
Pattern 1 (Pipeline)
  └─ Pattern 10 (Builder para cada prompt)
      └─ Pattern 12 (Decorator: validación + logging)
```

**Resultado:** Generador de contenido robusto con prompts flexibles y logging

### Combinación 2: Intelligent Support System
```
Pattern 2 (Router)
  └─ Pattern 14 (Chain of Responsibility)
      └─ Pattern 9 (Factory para crear agentes especializados)
          └─ Pattern 12 (Decorator: retry + cache)
```

**Resultado:** Sistema de soporte multicapa con escalamiento automático

### Combinación 3: Enterprise Decision Making
```
Pattern 7 (Multi-Agent)
  ├─ Pattern 13 (Strategy: cada agente con su estrategia)
  ├─ Pattern 5 (Tool-Use: acceso a datos externos)
  ├─ Pattern 3 (Reflection: auto-evaluación)
  └─ Pattern 8 (HITL: aprobación humana)
```

**Resultado:** Sistema de decisión empresarial completo y auditado

### Combinación 4: Adaptive Research System
```
Pattern 6 (Planning)
  └─ Pattern 7 (Multi-Agent: investigadores)
      └─ Pattern 13 (Strategy: reflexiva + analítica)
          └─ Pattern 11 (Adapter: salida estructurada)
```

**Resultado:** Sistema de investigación que genera reportes en múltiples formatos

---

## Casos de Uso Avanzados

### 1. Sistema de Generación de Contenido Profesional
```typescript
// Combina: Factory + Builder + Decorator + Pipeline
const fabrica = new FabricaAgentes();
const escritor = fabrica.crearAgente({
  tipo: "experto",
  especializacion: "Escritura Profesional"
});

let pipeline = new EscrituraDecorada(escritor);
pipeline = new DecoradorValidacion(pipeline);
pipeline = new DecoradorCache(pipeline);

const post = await pipeline.generarArticulo("IA y Futuro del Trabajo");
```

### 2. Soporte Técnico Inteligente Multicanal
```typescript
// Combina: Router + Chain + Factory + Decorator
const cadena = CadenaSoporteFactory.crearCadenaEstandar();
const manejador = new DecoradorRetry(cadena);

const ticket = {
  contenido: "Error 500 en producción",
  prioridad: "alta",
  campo: "soporte"
};

const resultado = await manejador.manejar(ticket);
// Automáticamente escalará a experto técnico si es necesario
```

### 3. Análisis de Decisión Ejecutiva
```typescript
// Combina: Multi-Agent + Strategy + Tool-Use + HITL
const equipo = FabricaAgentes.crearEquipo([
  { tipo: "experto", especializacion: "Finanzas" },
  { tipo: "experto", especializacion: "Legal" },
  { tipo: "experto", especializacion: "Operaciones" }
]);

const analisis = await procesarMultiAgent(
  "¿Invertir en adquisición de startup?"
);

// Resultado: análisis multidisciplinario
// Siguiente: HITL para aprobación ejecutiva
const aprobacion = await procesarConAprobacionHumana(
  analisis.sintesis
);
```

---

## 🔐 Seguridad y Mejores Prácticas

✅ **Recomendado:**
- Variables de entorno para API keys
- Validación con Zod en todos los inputs
- Timeouts en todas las llamadas
- Logging y auditoría completa
- HITL para decisiones críticas
- Caché para evitar llamadas innecesarias

❌ **Evitar:**
- API keys en código
- Confiar en formato de respuesta sin validar
- Sin límites de iteración (infinitos loops)
- Sin manejo de errores
- Decisiones financieras/legales sin humano

---

## 📚 Referencias

- [Refactoring.guru Design Patterns Catalog](https://refactoring.guru/design-patterns/catalog)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Microsoft Azure AI Agent Patterns](https://learn.microsoft.com/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [AIMultiple Agentic Workflows](https://aimultiple.com/agentic-workflows/)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)

---

**Versión:** 3.0.0  
**Estado:** ✅ 14 patrones listos para producción  
**Última actualización:** Agosto 2026  
**Autor:** rubences  
**Licencia:** MIT
