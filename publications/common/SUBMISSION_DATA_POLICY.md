# Política de datos para propuestas editoriales

El repositorio `patrones_dise-o_ia` es público. Los materiales de adquisición generados por CI deben poder compartirse sin revelar datos privados o contractuales.

## Permitido en el repositorio

- nombre profesional del autor ya utilizado públicamente en el proyecto;
- biografía profesional aprobada;
- títulos, índices, sinopsis y muestras de capítulo;
- identificadores públicos únicamente cuando hayan sido aprobados expresamente para el paquete;
- metadatos bibliográficos y enlaces públicos;
- estados de readiness y blockers descritos sin datos sensibles;
- información sobre derechos en forma de estado (`planned`, `cleared`, `permission-required`).

## Introducción manual en la plataforma editorial

No se versionan en GitHub:

- teléfono personal;
- dirección postal;
- firmas manuscritas o digitales;
- documentos de identidad;
- credenciales o tokens;
- datos bancarios o fiscales;
- cláusulas contractuales privadas no destinadas a publicación;
- datos de contacto privados que una editorial solicite en su formulario.

Esos campos se representan en los mapas de formulario como `manual-entry` + `manual-private`.

## Prohibición de inferencia

No se completa un campo personal porque pueda encontrarse en un CV, una web institucional, una memoria previa o una cuenta conectada. La fuente de verdad para el envío es la aprobación explícita del autor y, cuando proceda, la interfaz de la editorial.

## Automatización permitida

CI puede ensamblar, validar, renderizar, calcular hashes y comprobar límites de tamaño. CI **no puede enviar** una propuesta editorial, aceptar términos contractuales ni rellenar campos privados en nombre del autor sin una instrucción explícita y una herramienta autorizada para esa acción.
