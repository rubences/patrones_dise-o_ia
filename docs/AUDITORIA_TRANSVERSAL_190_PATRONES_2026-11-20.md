# Auditoría transversal del catálogo — v19.0.0

Fecha: 2026-11-20. Alcance: revisión estática de inventario completo (190 registros), taxonomía, registro de evidencia, esquema Astro, validadores y muestras de código P8/P9. **No** se ha ejecutado una auditoría dinámica de los 190 módulos ni se ha confirmado CI verde.

## Inventario comprobado

- 190 registros; 190 IDs distintos; sin slugs duplicados en el inventario.
- 22 macrofamilias; 35 grupos históricos.
- 54 asociaciones de evidencia primaria/oficial en `catalog/pattern-evidence.json`; baseline P7.0 de 54 patrones / 51 referencias.
- Metadatos del catálogo: 170 `needs-review`, 20 `partially-verified`, 0 `verified`. El campo `evidenceStatus` **no es equivalente** al registro de evidencia primaria: reconciliar semántica y estados sin elevarlos artificialmente.
- 56 IDs P9 (135–190). Se han diferenciado los contratos de memoria (135–142) y gobierno (143–150). Los 24 IDs 159–182 siguen siendo abstracciones genéricas de registros, no implementaciones de las técnicas que nombran.

## Hallazgos prioritarios

### A1 — Implementaciones P9 no específicas (alta)

Los IDs 159–182 incluyen ingeniería de datos, edge y razonamiento causal. En los módulos examinados (159, 175), la clase solo guarda y recupera strings por actor. No detecta drift, no calcula causalidad ni ejecuta inferencia edge. Deben reescribirse con contratos específicos, pruebas negativas y benchmarks por dominio. **No** declarar capacidades que no ejecutan.

### A2 — Desalineación de evidencia (alta)

`catalog/pattern-evidence.json` contiene 54 entradas, mientras `catalog/patterns.json` etiqueta 170 registros `needs-review`. Son indicadores distintos: la cobertura de fuentes no garantiza evidencia empírica de implementación. Introducir estado dual (sourceCoverage y implementationValidation) o una vista derivada para no confundirlos; preservar scope notes y baseline fail-closed.

### A3 — Defensa MCP insuficiente (alta)

El ID 132 utiliza expresiones regulares contra unas pocas cadenas inglesas. No es un detector robusto de tool poisoning. Necesita casos adversarios multilingües, aislamiento de instrucciones no confiables, políticas de efectos y controles por argumentos. No utilizar como único control de seguridad.

### A4 — Ledger no inmutable (media-alta)

El ID 149 almacena digests y una referencia al digest anterior, pero no calcula ni verifica hashes encadenados de contenido, ni firma, ni persistencia WORM. No describirlo como prueba de integridad resistente a manipulaciones. Añadir cadena criptográfica, test de alteración y control de acceso.

### A5 — Esquema editorial laxo (media)

`web/src/content.config.ts` admite `legacyGroup` hasta 37 cuando la taxonomía contiene 35. Derivar límites y familias de `catalog/taxonomy.json` o ajustar el límite actual, y verificar integridad referencial.

### A6 — Calidad y cobertura de pruebas (media)

Los tests actuales P8/P9 comprueban contratos puntuales y estructura, pero no certifican comportamiento de protocolo, seguridad completa ni ejecución real. Incorporar tests de propiedades, fuzzing, aislamiento entre tenants, fallos, límites y regresión por patrón.

### A7 — CI y artefactos no verificados (bloqueante de release)

No se dispone en esta auditoría de una ejecución confirmada y satisfactoria de los gates editoriales, evidencia, TypeScript, hardening, Astro, Quarto y paquetes de publicación. Mantener la versión como **catálogo integrado, release no verificada**.

## Plan de corrección

1. **P9.2:** implementar contratos diferenciados 159–166 (datos) con pruebas reales de schema, linaje, drift, contaminación y versionado.
2. **P9.3:** implementar 167–174 (edge) con presupuestos, disponibilidad, partición y degradación.
3. **P9.4:** implementar 175–182 (causal/neuro-simbólico) con grafos dirigidos, supuestos, intervenciones y validación de restricciones.
4. **P8 hardening:** mejorar 132, 124, 125 y 149; pruebas de inyección y manipulación.
5. **Reconciliación editorial:** alinear metadatos de evidencia y normalizar grupos/familias; comprobar solapamientos semánticos.
6. **Cierre:** ejecutar gates y publicar resultados reproducibles antes de etiquetar una release como validada.

## Criterio de cierre por patrón

Una ficha no es suficiente: se exige contrato específico, casos positivos/negativos, riesgos, límites, referencias con scope note, trazabilidad a tests y comportamiento demostrable. Las implementaciones pedagógicas deben declararse como tales. No aumentar el baseline de evidencia por la mera existencia de una referencia.

## Alcance de esta revisión

Se ha inspeccionado el inventario completo y sus metadatos, pero **no se ha leído línea a línea ni ejecutado cada uno de los 190 archivos fuente**. Los hallazgos sobre calidad de implementación se apoyan en módulos concretos inspeccionados y en el historial de generación de P9. Se requiere auditoría dinámica adicional para afirmar conformidad global.
