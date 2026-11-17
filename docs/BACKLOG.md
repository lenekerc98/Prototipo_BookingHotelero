# Pendientes y decisiones

## P0 · acordar requisitos antes de construir backend

- Fuentes contradictorias: `bd.txt` excluye PMS y facturación electrónica SRI; `modelo_base_de_datos_hotelera.md` incluye check-in/out y habitaciones físicas. Decidir alcance y actualizar una especificación principal.
- Cantidad y catálogo de hoteles: fuente SQL/documentación menciona 118 y frontend 116. Confirmar vigencia y criterio antes de consolidar datos.
- Incorporar requisitos, reglas comerciales y conversaciones relevantes de ChatGPT siguiendo `docs/sources/README.md`; revisar privacidad y versiones.
- Acordar escenarios de aceptación de reserva, cancelación, reembolso, cupos por fecha, roles y tributación. Confirmar vigencia de IVA/tasa de servicio con las fuentes responsables.

## P0 · plataforma con datos reales

- Backend de identidad/sesiones y autorización por hotel.
- PostgreSQL con migraciones revisadas y reserva atómica por fechas; pruebas de concurrencia.
- Checkout de proveedor, validación de importes/webhooks e idempotencia. Sustituir captura de tarjetas demo y afirmaciones no verificadas.
- Persistencia, auditoría de servidor y políticas de datos personales.

## P1 · evolución del prototipo

- Extraer reservas/disponibilidad desde App y GuestPage a funcionalidades y adaptadores.
- Reducir el bundle principal (la compilación inicial genera ~1 MB de JavaScript sin comprimir); evaluar carga diferida por vista al extraer funcionalidades. No elevar el umbral de advertencia para ocultarlo.
- Añadir E2E de reserva/cancelación, perfiles, recepción y permisos de interfaz.
- Revisar almacenamiento: hoy las cuotas se saturan a cero, pero no rechazan una reserva por cupo insuficiente; liberar no controla capacidad máxima. Resolver con reglas aprobadas y backend, no presentar la demo como control de sobreventa.
- Revisar accesibilidad, rutas, manejo de errores y estados de carga.
- Validar el contenedor en un equipo con Docker y luego automatizar QA en CI cuando el usuario decida usar el repositorio.
- Preparar CSP, HTTPS, límites de solicitudes y restauración de respaldos antes de publicar el servicio real.

## Completado localmente en esta preparación

- QA de tipos/lint/unitarias/build, prueba de navegador y audit.
- Corrección de dependencias vulnerables conocidas y validación de cantidades/datos locales en disponibilidad.
- Accesos T3 para desarrollo y QA, configuración de red local y despliegue manual preparado.
- Documentación de arquitectura, seguridad, despliegue y registro de fuentes.
