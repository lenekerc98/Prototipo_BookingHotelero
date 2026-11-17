# Contexto del proyecto

Objetivo: convertir el prototipo AlojaManta en una plataforma de reservas hoteleras con aislamiento por establecimiento, disponibilidad confiable y operaciones verificables.

Estado al 2026-11-13: frontend funcional de demostración, sin servidor API, sesiones seguras ni base de datos conectada. Esta preparación aporta un entorno local reproducible, verificaciones y una ruta de evolución; no constituye una plataforma lista para operar con clientes reales.

## Leer al comenzar una tarea

1. `README.md`: comandos y entorno.
2. `docs/ARCHITECTURE.md`: límites y estructura prevista.
3. `docs/sources/README.md`: fuentes disponibles y su autoridad.
4. `docs/BACKLOG.md`: decisiones abiertas y prioridades.
5. `docs/SECURITY.md` y `docs/QA.md`: riesgos y verificación.

`AGENTS.override.md` contiene acuerdos que Codex descubre como instrucciones del proyecto. Se creó un archivo de override para conservar la eliminación previa de `AGENTS.md`, sin restaurar sus instrucciones antiguas de Figma.

## Acuerdos

- Trabajar localmente; el usuario decide commits, publicación y despliegue.
- Registrar las decisiones aceptadas en `docs/decisions/` con fecha, contexto, alternativas, decisión y consecuencias. Las propuestas no cuentan como decisiones aceptadas.
- Relacionar cada requisito implementado con su fuente y una verificación observable.
- Documentos privados y fuentes públicas se distinguen en `docs/sources/README.md`.
- No convertir una captura, un texto generado por IA o una cuenta demo en prueba de cumplimiento normativo.
