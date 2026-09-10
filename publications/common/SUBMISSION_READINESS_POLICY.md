# Política de Submission Readiness

## Objetivo

Evitar que una propuesta se etiquete como lista para enviar por mera percepción editorial. El estado se deriva de evidencia verificable y se valida en CI.

## Estados

`proposal-development` → contenido y posicionamiento todavía en construcción.

`editor-contact-ready` → existe un paquete coherente para iniciar conversación con un editor, pero quedan hechos, derechos o compromisos por cerrar.

`submission-ready` → el paquete puede entregarse por la ruta editorial seleccionada: no existe ningún blocker crítico abierto, los campos públicos obligatorios están completos, los assets del paquete tienen derechos documentados y los requisitos de la editorial han sido reverificados.

`submitted` → existe constancia explícita de un envío externo autorizado. CI nunca realiza esta transición por sí solo.

`contracted` → existe acuerdo editorial formal. Los términos de derechos deben pasar por `CONTRACT_RIGHTS_GATE.md`.

`published` → la obra dispone de publicación e identificadores verificables.

## Invariantes fail-closed

Una obra **no puede** declarar `submission-ready` mientras exista un blocker `critical/open` asociado a ella. Tampoco puede hacerlo si faltan el mapa de campos del formulario, el ledger de figuras, el perfil público controlado o el paquete específico de la editorial.

Los campos `manual-private` no se almacenan en el repositorio público. Su ausencia en Git no impide que un paquete alcance `submission-ready`, pero deben estar identificados como `manual-entry` y completarse en el formulario externo durante un envío expresamente autorizado.

Una transición a `submitted` requiere un registro de envío separado con editorial, fecha, ruta y evidencia. El pipeline no navega formularios ni envía propuestas automáticamente.

## Regla de derechos

Para `submission-ready`, toda figura que se incluya materialmente en el paquete debe estar `cleared`. Las figuras todavía `planned` pueden permanecer en el roadmap del manuscrito, pero no deben adjuntarse como si sus derechos estuvieran resueltos.

## Regla de actualidad

Los requisitos editoriales se reverifican en la fecha de envío. Un paquete generado con requisitos caducados vuelve a `editor-contact-ready` hasta completar esa revisión.

## Regla de privacidad

Los paquetes producidos por CI son `public-safe`: no contienen teléfono, dirección postal, firmas, credenciales, documentos de identidad, datos bancarios ni información contractual privada.
