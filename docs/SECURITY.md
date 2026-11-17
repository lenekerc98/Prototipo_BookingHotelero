# Revisión inicial de seguridad

Fecha: 2026-11-13. Alcance: lectura del código local, configuración y auditoría npm. No es un pentest ni una certificación. No se han probado sistemas externos.

## Riesgos que bloquean producción

| Prioridad | Evidencia | Impacto y corrección pendiente |
| --- | --- | --- |
| P0 | `src/AuthPage.tsx`: ADMIN_ACCOUNTS y handleGuestSubmit; `src/GuestPage.tsx`: GuestLoginModal | Contraseñas demo en el bundle y acceso de huésped simulado. Implementar identidad, hash de contraseñas y sesiones en servidor; probar rechazos y expiración. Ocultar claves del frontend no basta. |
| P0 | `src/App.tsx`: allowedHotels y visibleStaff | El navegador filtra permisos/hoteles. Un cliente modificado puede cambiarlo. Validar cada operación y acceso a objetos en el backend; añadir pruebas negativas entre hoteles. |
| P0 | `src/availability.ts`, `src/storage.ts`, `src/GuestPage.tsx` | Reservas y disponibilidad modificables en localStorage, sin transacciones ni protección entre clientes. Implementar persistencia y reserva atómica por fecha; probar concurrencia e idempotencia. |
| P0 | `src/GuestPage.tsx`: campos cardCvv y mensaje PCI-DSS; `src/PaymentLinkModal.tsx`: enlace generado | Flujo de pago simulado y afirmaciones de seguridad sin evidencia técnica. Antes de operar, sustituir por checkout del proveedor, validar webhooks y retirar afirmaciones no sustentadas. No introducir tarjetas reales en el prototipo. |
| P1 | `src/hotelData.ts`: addAuditLog | Auditoría e IP simuladas en el cliente. Trasladar eventos a servidor, proteger integridad y definir retención y acceso. |
| P1 | `vite.config.ts`: customScripts de site.json | Inserción deliberada de HTML/scripts de configuración. Tratar esa configuración como código confiable y revisado; no permitir que usuarios la editen. |
| P1 | Documentación tributaria y fuentes divergentes | Confirmar alcance y normativa de protección de datos, pagos y tributos; no asumir que comprobantes demo son facturas autorizadas. |

## Mejoras de esta preparación

- Desarrollo y preview enlazados a 127.0.0.1 en lugar de todas las interfaces.
- Publicación de GitHub Pages pasa a activación manual en la copia local.
- Actualización compatible de dependencias para corregir los avisos de Vite y source-map-js detectados inicialmente.
- QA reproducible, pruebas de disponibilidad y datos inválidos; auditoría npm disponible como comando.
- Exclusión de archivos de entorno, fuentes privadas y trazas de navegador de Git; ejemplos sin secretos.
- Configuración Nginx para contenedor sin usuario root y cabeceras básicas. Su ejecución requiere Docker y queda pendiente de validación en este equipo.

## Pendiente para despliegue real

HTTPS, política CSP compatible con mapas/fuentes e integración de pagos, gestión de secretos del servidor, análisis de vulnerabilidades de imagen, políticas de respaldo, límites de solicitudes y procedimientos de incidentes. No habilitar HSTS antes de configurar HTTPS correctamente. Revisar dependencias al preparar cada versión: un resultado sin avisos conocidos no garantiza ausencia de vulnerabilidades.
