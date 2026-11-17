# Fuentes y contexto de ChatGPT

Esta sesión puede leer archivos del proyecto y las herramientas conectadas disponibles; no dispone de una conexión que permita leer automáticamente tus proyectos, archivos o conversaciones de ChatGPT. No se ha importado contenido desde tu cuenta.

## Incorporación recomendada

1. Desde tu proyecto de ChatGPT, guarda las fuentes originales relevantes en el equipo: requisitos, diseños, decisiones y reglas de negocio. Copia solo los fragmentos de conversación que aporten decisiones o contexto necesario.
2. Coloca los archivos sensibles en `docs/sources/private/`, excluida de Git. Los documentos que revises y autorices para versionar pueden colocarse después en `docs/sources/public/`. La carpeta pública no existe hasta incorporar la primera fuente autorizada.
3. Para cada fuente registra título, archivo, origen, fecha/versión, responsable, estado (borrador/aprobado), privacidad y qué requisitos respalda. No copies secretos en el registro.
4. Conserva el original. Crea una versión Markdown legible cuando haga falta para búsqueda/citas; verifica tablas y reglas contra el original, especialmente en DOCX/PDF/XLSX.
5. Consolida requisitos en documentos breves con identificadores, criterios de aceptación y referencia a fuente/sección. Registra contradicciones antes de elegir una interpretación.

Un enlace a una conversación privada sirve como referencia para ti, pero no garantiza que el agente pueda leerla. Tener la misma cuenta tampoco implica compartir contexto automáticamente. Compartir/copiar un subconjunto de fuentes permite controlar qué se incorpora.

## Fuentes ya presentes (sin validación de autoridad)

| Fuente | Uso posible | Estado |
| --- | --- | --- |
| `bd.txt` | Propuesta SQL PostgreSQL y alcance | Pendiente de revisión, no ejecutada |
| `modelo_base_de_datos_hotelera.md` | Modelo y relaciones | Contiene diferencias de alcance con SQL |
| `Consolidado-Nacional-2026-publico-8.xlsx` | Posible fuente del catálogo hotelero | Contenido y correspondencia con catálogo pendientes de verificar |
| `src/mantaHotels.ts` | Catálogo usado por el prototipo | No es fuente normativa |

El estado inicial de Git ya mostraba documentos de requisitos y plantillas eliminados. Se conservaron esas eliminaciones; no se recuperaron ni se asumen como fuentes activas. Los scripts Python existentes pueden depender de esos documentos: revisar entradas y salidas antes de ejecutarlos.

## Registro de nuevas fuentes

| Identificador | Título / archivo | Origen | Fecha / versión | Responsable | Estado | Privacidad | Requisitos |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pendiente | | | | | | | |

## Instrucciones para el agente

Codex admite instrucciones de proyecto mediante `AGENTS.md` y `AGENTS.override.md`; este proyecto usa el segundo para enlazar el contexto. Los archivos no se convierten todos en contexto automáticamente: indicar qué fuente y sección corresponde a cada tarea y mantener este índice actualizado.

Referencia oficial consultada: https://developers.openai.com/codex/guides/agents-md/
