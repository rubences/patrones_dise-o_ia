# 🏛️ Patrones de Diseño para Sistemas Agénticos de IA

Una biblioteca exhaustiva de **24 patrones de diseño** clásicos y agénticos, todos adaptados y demostrados para trabajar con **agentes de IA** y **Large Language Models (LLMs)** usando **TypeScript** y **OpenAI API**.

## 📊 Visión General

Este repositorio proporciona implementaciones prácticas de patrones de diseño organizados en cuatro categorías:

1. **Patrones Agénticos (1-8)**: Flujos de trabajo especializados para sistemas de IA
2. **Patrones Estructurales Clásicos (9-14)**: Patrones de creación y estructura adaptados para agentes
3. **Patrones Estructurales Avanzados (15-19)**: Composición y acceso a objetos complejos
4. **Patrones de Comportamiento (20-24)**: Comunicación y algoritmos personalizables

---

## 🚀 Inicio Rápido

### Requisitos
- **Node.js 18+**
- **TypeScript 6.0.3**
- **OpenAI API Key** (variable de entorno `OPENAI_API_KEY`)

### Instalación

```bash
npm install
```

### Ejecutar un Patrón

```bash
# Ejecutar patrón 1 (Pipeline)
npm run pattern:1

# Ejecutar patrón 12 (Decorator)
npm run pattern:12

# Ejecutar patrón 24 (Template Method)
npm run pattern:24
```

---

## 📚 Catálogo Completo (24 Patrones)

### **Patrones Agénticos (1-8): Flujos de Trabajo Especializados**

Estos patrones definen flujos de trabajo específicos para sistemas de IA y agentes autónomos.

| # | Patrón | Propósito | Referencia |
|---|--------|----------|-----------|
| **1** | **Pipeline** | Transformación secuencial de datos a través de múltiples etapas LLM | AIMultiple Agentic Workflows |
| **2** | **Router** | Enrutamiento inteligente de mensajes a especialistas por tipo o confianza | AIMultiple, Microsoft |
| **3** | **Reflection** | Autoevaluación iterativa y mejora de respuestas | OpenAI Cookbook |
| **4** | **Evaluator/Optimizer** | Refinamiento iterativo con rúbricas de evaluación explícitas | Iterative Improvement Loop |
| **5** | **Tool Use** | Invocación dinámica de APIs y herramientas externas basada en decisiones del modelo | OpenAI Tool Use |
| **6** | **Planning** | Descomposición de objetivos complejos en planes de subtareas adaptables | Task Decomposition |
| **7** | **Multi-Agent** | Múltiples agentes especializados trabajando en paralelo con coordinación | Collaborative AI Systems |
| **8** | **Human-in-Loop** | Flujos con aprobación humana gestionada por niveles de riesgo | HITL Workflows |

---

### **Patrones Creacionales Clásicos (9-14): Creación y Estructura Flexible**

Adaptan los patrones Gang of Four para sistemas agénticos.

| # | Patrón | Propósito | Referencia GoF |
|---|--------|----------|---|
| **9** | **Factory** | Creación flexible de agentes especializados (Experto, Generalista, Auditor) | Factory Method |
| **10** | **Builder** | Construcción fluida de prompts complejos con componentes reutilizables | Builder |
| **11** | **Adapter** | Conversión de salidas LLM a múltiples formatos (JSON, CSV, XML, HTML, Markdown) | Adapter |
| **12** | **Decorator** | Apilamiento de capacidades transversales (logging, retry, cache, validación, timeout) | Decorator |
| **13** | **Strategy** | Estrategias de generación intercambiables (Directa, Reflexiva, Creativa, Analítica) | Strategy |
| **14** | **Chain of Responsibility** | Enrutamiento jerárquico a través de cadena de manejadores | Chain of Responsibility |

---

### **Patrones Estructurales Avanzados (15-19): Composición y Acceso**

Patrones para estructuras complejas y acceso controlado.

| # | Patrón | Propósito | Referencia GoF | Ventajas |
|---|--------|----------|---|---|
| **15** | **Singleton** | Instancias globales únicas para config y pools de conexiones | Singleton | Sincronización centralizada, gestión de recursos |
| **16** | **Facade** | Interfaz unificada sobre subsistemas agénticos complejos | Facade | Simplifica uso de sistemas complejos, desacoplamiento |
| **17** | **Composite** | Composición jerárquica de tareas simples y compuestas | Composite | Estructura natural, interfaz uniforme |
| **18** | **Observer** | Notificación reactiva de cambios de estado a múltiples observadores | Observer | Desacoplamiento, reactividad automática |
| **19** | **State** | Máquina de estados para ciclo de vida de agentes (Inicializado → Ejecutando → Pausado → Completado) | State | Comportamiento dependiente del estado, transiciones claras |

---

### **Patrones de Comportamiento (20-24): Comunicación y Algoritmos**

Patrones avanzados para lógica de interacción y procesamiento.

| # | Patrón | Propósito | Referencia GoF | Casos de Uso |
|---|--------|----------|---|---|
| **20** | **Command** | Encapsulación de operaciones como objetos para encolado, undo/redo, macros | Command | Colas de tareas, auditoría, scripting |
| **21** | **Proxy** | Control de acceso, rate limiting, lazy loading, caching de agentes | Proxy | Autorización, protección, optimización |
| **22** | **Memento** | Snapshots del estado para undo/redo e historial de conversaciones | Memento | Historial, rollback, análisis de evolución |
| **23** | **Mediator** | Hub central que coordina comunicación entre múltiples agentes | Mediator | Orquestación, desacoplamiento, escalabilidad |
| **24** | **Template Method** | Esqueleto de algoritmo personalizable en pasos específicos | Template Method | Reutilización de estructura con variaciones |

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── common.ts                          # Utilidades compartidas
│   ├── DEFAULT_MODEL (GPT-5.6)
│   ├── makeClient() - OpenAI instance
│   ├── paso() - Banner printing
│   └── isDirectRun() - Script detection
│
├── pattern_1_pipeline.ts              # Transformación secuencial
├── pattern_2_router.ts                # Enrutamiento inteligente
├── pattern_3_reflection.ts            # Autoevaluación
├── pattern_4_evaluator_optimizer.ts   # Refinamiento iterativo
├── pattern_5_tool_use.ts              # Invocación de herramientas
├── pattern_6_planning.ts              # Descomposición de tareas
├── pattern_7_multi_agent.ts           # Agentes paralelos
├── pattern_8_human_in_loop.ts         # Aprobación humana
│
├── pattern_9_factory.ts               # Creación de agentes
├── pattern_10_builder.ts              # Construcción de prompts
├── pattern_11_adapter.ts              # Conversión de formatos
├── pattern_12_decorator.ts            # Capacidades transversales
├── pattern_13_strategy.ts             # Estrategias intercambiables
├── pattern_14_chain.ts                # Cadena de manejadores
│
├── pattern_15_singleton.ts            # Instancias globales
├── pattern_16_facade.ts               # Interfaz unificada
├── pattern_17_composite.ts            # Composición jerárquica
├── pattern_18_observer.ts             # Notificación reactiva
├── pattern_19_state.ts                # Máquina de estados
│
├── pattern_20_command.ts              # Encapsulación de operaciones
├── pattern_21_proxy.ts                # Control de acceso
├── pattern_22_memento.ts              # Snapshots de estado
├── pattern_23_mediator.ts             # Coordinación central
└── pattern_24_template_method.ts      # Personalización de algoritmos
```

---

## 🔧 Configuración

### Variables de Entorno

```bash
# API Key de OpenAI (requerido)
export OPENAI_API_KEY=sk-...

# Modelo opcional (por defecto: gpt-5.6)
export OPENAI_MODEL=gpt-4-turbo
```

---

## 📖 Ejemplos de Uso por Categoría

### Patrón 1: Pipeline (Transformación Secuencial)
```typescript
// tema → esquema → borrador → título
const post = await escribirPost("Patrones de IA");
console.log(post.titulo);
```

### Patrón 2: Router (Enrutamiento Inteligente)
```typescript
// Clasifica y enruta consulta al especialista
const atencion = await atenderConsulta("¿Cómo funciona el aprendizaje?");
console.log(atencion.departamento); // "Educación"
```

### Patrón 3: Reflection (Autoevaluación)
```typescript
// Genera → Critica → Mejora
const respuesta = await responderConReflexion("Pregunta compleja");
```

### Patrón 5: Tool Use (Herramientas)
```typescript
// Modelo decide qué herramienta usar
const resultado = await responderConHerramientas("¿Qué tiempo hace?");
// Internamente puede: buscar_web(), acceder_api(), recuperar_bd(), etc.
```

### Patrón 7: Multi-Agent (Paralelo)
```typescript
// Investigador, Desarrollador, Revisor trabajan en paralelo
const resultados = await procesarMultiAgent("Tarea compleja");
```

### Patrón 9: Factory (Creación)
```typescript
const experto = FabricaAgentes.crearAgente({ 
  tipo: "experto", 
  dominio: "fisica" 
});
```

### Patrón 10: Builder (Construcción de Prompts)
```typescript
const prompt = new ConstructorPrompt()
  .conRol("Matemático experto")
  .conContexto("Tutoría de estudiantes")
  .conTarea("Explicar integrales")
  .agregarEjemplo("Integral definida")
  .conFormato("paso a paso")
  .construir();
```

### Patrón 12: Decorator (Capacidades Transversales)
```typescript
// Apila: Logging → Retry → Cache → Validation
const agente = new DecoradorLogging(
  new DecoradorRetry(
    new DecoradorCache(nuevoAgente)
  )
);
```

### Patrón 15: Singleton (Instancia Global)
```typescript
const gestor = GestorAgentesGlobal.getInstance();
```

### Patrón 17: Composite (Jerarquía de Tareas)
```typescript
const proyecto = new TareaCompuesta("Proyecto IA");
proyecto.agregarSubtarea(new TareaSimple("Diseño"));
proyecto.agregarSubtarea(new TareaSimple("Implementación"));
await proyecto.ejecutar(client);
```

### Patrón 20: Command (Cola de Tareas)
```typescript
const cola = new ColaComandos();
cola.encolar(new ComandoGenerarTexto(client, "prompt"));
cola.encolar(new ComandoClasificar(client, "entrada"));
await cola.ejecutarTodos();
```

### Patrón 22: Memento (Historial)
```typescript
const memento = agente.crearMemento("Paso 1");
historial.guardarEstado(memento, "Estado inicial");
// ... cambios ...
agente.restaurarDesdeMemento(memento); // Volver atrás
```

### Patrón 24: Template Method (Personalización)
```typescript
const blog = new GeneradorBlog(client);
const contenido = await blog.generarContenido("tema");
// Internamente: prepara → genera → personaliza → valida → formatea
```

---

## 📊 Tabla Comparativa de Patrones

| Categoría | Patrón | Complejidad | Interacción LLM | Escalabilidad | Uso Principal |
|-----------|--------|-------------|-----------------|---------------|---------------|
| Agéntico | Pipeline | ⭐⭐ | Secuencial | Media | Transformación encadenada |
| Agéntico | Router | ⭐⭐⭐ | Clasificación | Alta | Enrutamiento inteligente |
| Agéntico | Reflection | ⭐⭐⭐ | Iterativa | Media | Mejora de calidad |
| Agéntico | Multi-Agent | ⭐⭐⭐⭐ | Paralela | Alta | Problemas complejos |
| Creacional | Factory | ⭐ | Ninguna | Alta | Flexibilidad de creación |
| Creacional | Builder | ⭐⭐ | Ninguna | Alta | Construcción compleja |
| Estructural | Adapter | ⭐ | Ninguna | Media | Conversión de formatos |
| Estructural | Decorator | ⭐⭐ | Envolvente | Muy Alta | Capacidades adicionales |
| Estructural | Facade | ⭐ | Coordinada | Alta | Simplificación de interfaz |
| Estructural | Composite | ⭐⭐ | Recursiva | Alta | Estructuras jerárquicas |
| Comportamiento | Command | ⭐⭐ | Ninguna | Alta | Encolado y auditoría |
| Comportamiento | Proxy | ⭐⭐ | Controlada | Alta | Seguridad y optimización |
| Comportamiento | Memento | ⭐⭐ | Histórica | Media | Undo/Redo |
| Comportamiento | Mediator | ⭐⭐⭐ | Coordinada | Alta | Orquestación |
| Comportamiento | Template Method | ⭐⭐ | Mixta | Media | Algoritmos personalizables |

---

## 🎯 Selección de Patrón por Caso de Uso

### ❓ "Necesito transformar datos paso a paso"
→ **Pattern 1 (Pipeline)** o **Pattern 24 (Template Method)**

### ❓ "Necesito enrutar a especialistas según el tipo de tarea"
→ **Pattern 2 (Router)** o **Pattern 14 (Chain of Responsibility)**

### ❓ "Necesito mejorar la calidad iterativamente"
→ **Pattern 3 (Reflection)** o **Pattern 4 (Evaluator)**

### ❓ "Necesito que el modelo use herramientas externas"
→ **Pattern 5 (Tool Use)**

### ❓ "Necesito múltiples agentes trabajando en paralelo"
→ **Pattern 7 (Multi-Agent)**

### ❓ "Necesito aprobación humana en ciertos puntos"
→ **Pattern 8 (Human-in-Loop)**

### ❓ "Necesito crear agentes de diferentes tipos"
→ **Pattern 9 (Factory)**

### ❓ "Necesito construir prompts complejos"
→ **Pattern 10 (Builder)**

### ❓ "Necesito múltiples formatos de salida"
→ **Pattern 11 (Adapter)**

### ❓ "Necesito agregar logging, retry, cache, etc."
→ **Pattern 12 (Decorator)**

### ❓ "Necesito cambiar estrategias de prompting en tiempo real"
→ **Pattern 13 (Strategy)**

### ❓ "Necesito control centralizado de instancias"
→ **Pattern 15 (Singleton)**

### ❓ "Necesito tareas jerárquicas anidadas"
→ **Pattern 17 (Composite)**

### ❓ "Necesito reaccionar a cambios de estado"
→ **Pattern 18 (Observer)** o **Pattern 19 (State)**

### ❓ "Necesito encolar operaciones para ejecución posterior"
→ **Pattern 20 (Command)**

### ❓ "Necesito control de acceso y rate limiting"
→ **Pattern 21 (Proxy)**

### ❓ "Necesito historial y undo/redo"
→ **Pattern 22 (Memento)**

### ❓ "Necesito coordinar múltiples agentes comunicándose"
→ **Pattern 23 (Mediator)**

---

## 🧪 Ejecución de Todos los Patrones

Para verificar que todos funcionan correctamente:

```bash
for i in {1..24}; do
  echo "━━━ Patrón $i ━━━"
  npm run pattern:$i
  echo ""
done
```

---

## 🔍 Estructura de un Patrón

Cada archivo de patrón sigue la siguiente estructura estándar:

```typescript
// 1. Diagrama ASCII explicativo
// 2. Importaciones
// 3. Interfaces/Tipos
// 4. Implementación de clases
// 5. Ejemplo demo
// 6. main() function
// 7. Export con isDirectRun check
```

---

## 📚 Referencias

### Patrones Agénticos
- [AIMultiple: Agentic Workflows](https://www.aimultiple.com/agentic-workflows/)
- [Microsoft: Agentic Design Patterns](https://microsoft.com/research/agents)
- [OpenAI: Cookbook Examples](https://github.com/openai/openai-cookbook)

### Patrones Clásicos
- [Refactoring Guru: Design Patterns](https://refactoring.guru/design-patterns)
- [Gang of Four: Design Patterns (1994)](https://en.wikipedia.org/wiki/Design_Patterns)

### Herramientas
- **OpenAI API**: https://platform.openai.com/docs/
- **Zod**: Validación de esquemas TypeScript
- **TypeScript**: Tipado estricto para JavaScript

---

## 📈 Historial de Versiones

### v4.0.0 (Actual) - 🎉 Lanzamiento Completo
- ✅ 24 patrones implementados y documentados
- ✅ Scripts npm para cada patrón
- ✅ Documentación exhaustiva
- ✅ Ejemplos de uso completos
- ✅ Tabla comparativa de patrones
- ✅ Guía de selección por caso de uso

### v3.0.0
- 14 patrones (8 agénticos + 6 clásicos)

### v2.0.0
- 8 patrones agénticos iniciales

### v1.0.0
- Estructura base

---

## 💡 Consejos de Uso

1. **Comienza con Patrones 1-8** si eres nuevo en sistemas agénticos
2. **Patrones 9-14** son esenciales para proyectos grandes
3. **Patrones 15-19** se usan para estructuras complejas
4. **Patrones 20-24** son herramientas avanzadas de orquestación
5. Combina patrones: un Router (2) puede usar Tool Use (5) internamente
6. Usa Decorator (12) para agregar capacidades sin modificar código original
7. Template Method (24) es perfecto para crear familias de generadores

---

## 🚨 Troubleshooting

### Error: "OPENAI_API_KEY no está definido"
```bash
export OPENAI_API_KEY=sk-...
```

### Error: "ts-node: command not found"
```bash
npm install -g ts-node
```

### Error: "Cannot find module"
```bash
npm install
```

### Timeout en llamadas a API
Aumenta el timeout en `common.ts` o usa `Pattern 12 (Decorator)` con DecoradorTimeout

---

## 📝 Licencia

MIT License - Libre para uso comercial y personal

---

## 👤 Autor

**rubences** - Desarrollo de patrones de diseño para sistemas agénticos de IA

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nuevo-patron`)
3. Commit cambios (`git commit -am 'Agregar nuevo patrón'`)
4. Push a la rama (`git push origin feature/nuevo-patron`)
5. Abre un Pull Request

---

## ⭐ Si te es útil, ¡marca con una estrella!

```
      ⭐
    ⭐   ⭐
  ⭐  🏛️   ⭐
    ⭐   ⭐
      ⭐
```

**Patrones de Diseño para IA** - Haciendo sistemas inteligentes y mantenibles

---

Última actualización: 2026 | Versión 4.0.0 | Patrones Implementados: 24/24 ✅
