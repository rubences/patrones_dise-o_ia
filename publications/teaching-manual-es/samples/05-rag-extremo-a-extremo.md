# Módulo 5 — RAG de extremo a extremo

> **Capítulo muestra · borrador 0.1.** Enfoque docente orientado a reproducibilidad y evaluación. No se presentan porcentajes de mejora sin un experimento ejecutado y documentado.

## Resultados de aprendizaje

Al finalizar este módulo, el estudiante será capaz de:

- explicar por qué RAG separa recuperación y generación;
- construir una canalización mínima de ingestión, recuperación y respuesta;
- distinguir recuperación, ranking, construcción de contexto, grounding y atribución;
- diseñar un pequeño conjunto de evaluación;
- detectar fallos de recuperación, contexto obsoleto y respuestas no respaldadas;
- medir latencia y coste por etapa;
- justificar cuándo no utilizar RAG.

## 1. Problema de partida

Un modelo generativo puede responder con conocimiento aprendido durante su entrenamiento, pero una aplicación universitaria, empresarial o profesional suele necesitar información concreta, actualizable y trazable. RAG añade una capa de recuperación para aportar evidencia externa al proceso de generación.

El patrón no garantiza exactitud. Podemos recuperar documentos irrelevantes, dejar fuera el documento correcto, introducir información obsoleta o generar una afirmación que no está respaldada por el contexto recuperado. Por eso este laboratorio no termina cuando “el chatbot responde”: termina cuando podemos **evaluar la cadena completa**.

Trabajaremos principalmente los patrones:

- 25 — RAG;
- 41 — Retrieval Ranking;
- 52 — Grounding;
- 66 — Contextual Compression;
- 98 — Citation Attribution.

## 2. Arquitectura del laboratorio

```text
Documentos
   |
   v
Ingesta -> Fragmentación -> Índice
                         |
Pregunta ----------------+
   |
   v
Recuperación -> Ranking -> Context Builder
                            |
                            v
                           LLM
                            |
                            v
                 Respuesta + evidencias
                            |
                            v
                       Evaluación
```

El laboratorio utilizará un corpus pequeño y controlado para que el alumno pueda inspeccionar manualmente por qué el sistema recupera un fragmento.

## 3. Corpus docente

La práctica parte de documentos sintéticos o públicos preparados para clase, por ejemplo:

```text
corpus/
├── normativa_asignatura.md
├── calendario_evaluacion.md
├── guia_laboratorios.md
└── faq_estudiantes.md
```

No deben introducirse expedientes reales, correos de estudiantes ni documentación privada en servicios externos. Si se utiliza una API LLM, el corpus del laboratorio debe estar diseñado para poder compartirse con ese proveedor según las condiciones de la práctica.

## 4. Fragmentación

Una primera implementación puede ser deliberadamente simple:

```python
def chunk_text(text: str, chunk_size: int = 700, overlap: int = 100):
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = max(start + 1, end - overlap)
    return chunks
```

La actividad no pretende presentar esta función como un algoritmo óptimo. El estudiante deberá comparar al menos dos estrategias de fragmentación y explicar cómo afectan a la recuperación de una pregunta que necesite contexto situado cerca de un límite entre fragmentos.

## 5. Recuperación

Para evitar dependencias innecesarias, la versión base puede utilizar una representación TF-IDF o embeddings locales. La interfaz debe permanecer estable:

```python
from dataclasses import dataclass

@dataclass
class RetrievedChunk:
    document_id: str
    chunk_id: str
    text: str
    score: float

class Retriever:
    def search(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        ...
```

El objetivo arquitectónico es que el generador no conozca los detalles del índice. Esto permite sustituir después el recuperador sin reescribir todo el sistema.

## 6. Ranking

Recuperar `k` resultados no significa que deban llegar al modelo en el mismo orden. El módulo introduce una segunda fase de ranking:

```python
def rerank(query: str, chunks: list[RetrievedChunk]) -> list[RetrievedChunk]:
    # Implementación didáctica: combinar score inicial y reglas del dominio.
    return sorted(chunks, key=lambda item: item.score, reverse=True)
```

Como extensión, el alumnado puede comparar recuperación léxica, semántica e híbrida. La comparación debe hacerse con un conjunto fijo de preguntas, no únicamente “probando a mano” hasta obtener una respuesta convincente.

## 7. Construcción de contexto

El `Context Builder` decide qué evidencia se envía al modelo y en qué formato:

```python
def build_context(chunks: list[RetrievedChunk], max_chars: int = 5000) -> str:
    selected = []
    total = 0
    for chunk in chunks:
        block = f"[SOURCE {chunk.document_id}#{chunk.chunk_id}]\n{chunk.text}\n"
        if total + len(block) > max_chars:
            break
        selected.append(block)
        total += len(block)
    return "\n".join(selected)
```

El identificador de fuente se conserva para que la respuesta pueda atribuir afirmaciones posteriormente.

## 8. Grounding

Una plantilla mínima puede imponer tres reglas:

```text
Responde utilizando solo la evidencia incluida.
Si la evidencia no permite responder, indícalo de forma explícita.
Para cada afirmación verificable, conserva la referencia SOURCE utilizada.
```

El alumno debe comprender que una instrucción en el prompt **no garantiza** que el modelo cumpla. Por eso añadiremos validación posterior.

## 9. Atribución

La respuesta estructurada puede pedir:

```json
{
  "answer": "...",
  "citations": ["normativa_asignatura.md#3"],
  "insufficient_evidence": false
}
```

Después, el programa valida que cada identificador citado pertenezca realmente al contexto suministrado. Una cita inventada debe hacer fallar la respuesta, aunque el texto parezca correcto.

## 10. Conjunto de evaluación

El laboratorio incluye un archivo `evaluation.jsonl`:

```json
{"id":"q01","question":"¿Cuál es el porcentaje mínimo de asistencia indicado?","expected_source":"normativa_asignatura.md"}
{"id":"q02","question":"¿Qué fecha tiene la recuperación?","expected_source":"calendario_evaluacion.md"}
{"id":"q03","question":"¿Quién ganó el premio de la facultad en 2021?","expected_source":null}
```

La tercera pregunta es intencionadamente imposible de responder con el corpus. Un buen sistema debe reconocer ausencia de evidencia en lugar de completar la información.

## 11. Métricas por capa

### Recuperación

- `hit@k`: ¿aparece la fuente esperada entre los `k` resultados?
- ranking de la fuente esperada;
- consultas sin ninguna fuente pertinente.

### Generación

- respuesta respaldada por el contexto;
- citas válidas;
- detección de evidencia insuficiente;
- errores factuales respecto al corpus controlado.

### Sistema

- latencia de recuperación;
- latencia de generación;
- tamaño del contexto;
- tokens enviados/recibidos cuando el proveedor los exponga;
- coste estimado de la llamada, si procede.

## 12. Registro de una ejecución

```python
@dataclass
class RagTrace:
    question_id: str
    retrieved_ids: list[str]
    context_chars: int
    answer_citations: list[str]
    retrieval_ms: float
    generation_ms: float
```

La traza permite comparar configuraciones sin depender de impresiones subjetivas.

## 13. Fallos que el alumno debe provocar

La práctica exige producir deliberadamente al menos cuatro fallos:

### F1 — Retrieval miss

La fuente correcta no aparece en `top-k`.

**Pregunta:** ¿falló el modelo o falló antes el sistema?

### F2 — Context overload

Se envían demasiados fragmentos y aumenta el ruido.

**Pregunta:** ¿más contexto implica necesariamente mejor respuesta?

### F3 — Evidencia obsoleta

Dos documentos contienen versiones distintas de una norma.

**Pregunta:** ¿cómo debería representar el sistema fecha, versión o vigencia?

### F4 — Citation mismatch

El modelo produce una cita que no respalda la frase.

**Pregunta:** ¿qué parte puede validarse automáticamente y qué parte necesita una evaluación semántica?

## 14. Compresión contextual

Como extensión se implementará una etapa que reduzca los fragmentos antes de llamar al modelo. La actividad debe medir dos efectos al mismo tiempo:

- reducción del contexto;
- pérdida potencial de evidencia necesaria.

No se aceptará una conclusión del tipo “la compresión mejora el sistema” sin mostrar el conjunto de preguntas y los resultados obtenidos.

## 15. Cuándo no usar RAG

El estudiante debe proponer una arquitectura alternativa para al menos dos escenarios:

- datos estructurados que pueden resolverse con una consulta SQL determinista;
- una operación transaccional donde el objetivo principal no es recuperar texto;
- una base de conocimiento tan pequeña y estable que una solución más simple sea suficiente;
- una tarea en la que la latencia del pipeline de recuperación sea incompatible con el requisito.

La elección de RAG debe justificarse por necesidad de conocimiento externo y trazabilidad, no por popularidad.

## 16. Entrega

La entrega contendrá:

1. código reproducible;
2. corpus de práctica;
3. `evaluation.jsonl` con un mínimo de 12 preguntas;
4. resultados de al menos dos configuraciones;
5. tabla de fallos observados;
6. traza de latencia y contexto;
7. breve informe de decisiones.

## 17. Rúbrica

| Criterio | Peso | Excelente | Insuficiente |
|---|---:|---|---|
| Ingesta y recuperación | 20% | Pipeline reproducible y evaluación hit@k | Solo prueba manual |
| Ranking/contexto | 15% | Decisiones justificadas y medibles | Contexto arbitrario |
| Grounding | 15% | Maneja ausencia de evidencia | Siempre intenta responder |
| Atribución | 15% | Citas trazables y validadas | Citas decorativas |
| Evaluación | 20% | Dataset fijo, comparación y análisis | Sin conjunto de prueba |
| Observabilidad | 10% | Latencia/contexto registrados | No hay trazas |
| Reflexión | 5% | Identifica límites y alternativas | Conclusiones genéricas |

## 18. Relación con el catálogo y la monografía internacional

La ficha canónica 25 documenta RAG como patrón de arquitectura y el Evidence Pack registra la referencia primaria de Lewis et al. (NeurIPS 2020). Este capítulo, en cambio, enseña a construir y evaluar un sistema RAG en un contexto formativo.

La monografía internacional utilizará RAG para discutir propiedades arquitectónicas, evidencia y composición con otros patrones. El manual español utiliza un corpus docente, ejercicios, pruebas y rúbrica. La diferencia de finalidad, estructura y material es deliberada: compartir una referencia técnica no convierte una obra en traducción de la otra.
