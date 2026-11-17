# QA local

## Comandos y alcance

| Comando | Comprueba |
| --- | --- |
| `npm.cmd run typecheck` | Tipos de aplicación, configuración y pruebas |
| `npm.cmd run lint` | Reglas estáticas de oxlint; advertencias bloquean QA |
| `npm.cmd test` | Disponibilidad: aislamiento por hotel, consumo, liberación, datos dañados y cantidades inválidas |
| `npm.cmd run build` | Artefacto frontend en `dist/` |
| `npm.cmd run test:e2e` | Renderizado e inicio del acceso de huéspedes sin errores JS; necesita build previo |
| `npm.cmd run security:audit` | Avisos conocidos de dependencias; bloquea severidad alta/crítica |
| `npm.cmd run qa:full` | Todo lo anterior en orden |

Los tests E2E abren Chromium mediante Playwright, arrancan temporalmente `vite preview` en 127.0.0.1:4173 y lo detienen al terminar. No usan servicios externos de QA. No debe haber otro servidor en ese puerto. Imágenes, mapas y fuentes del prototipo sí dependen de servicios de terceros; trabajo local no implica funcionamiento sin Internet.

## Revisión manual por cambio funcional

- Probar escritorio y móvil, idioma español/inglés, tema claro/oscuro y navegación con teclado.
- Reservas: fechas inválidas, cupo agotado, cancelación, repetición del envío y coherencia portal/panel.
- Roles: revisar las vistas de cada cuenta demo. Esto solo verifica interfaz, no seguridad del servidor.
- Aislamiento: cambiar hotel y confirmar que listas y acciones usan el hotel seleccionado.
- Revisar mensajes de error y consola sin registrar datos personales.

## Condiciones antes de una versión con datos reales

Además del QA frontend: pruebas API de autenticación/roles, aislamiento entre hoteles, acceso a recursos ajenos, concurrencia del último cupo, importes manipulados, webhooks falsos/repetidos, restauración de respaldos y accesibilidad. Probar límites, fallos de proveedor y red. Estas comprobaciones están pendientes porque el backend aún no existe.

Cada hallazgo debe incluir severidad, pasos para reproducir, resultado esperado/real, archivo o endpoint, evidencia sin secretos, corrección y prueba de cierre. Guardar decisiones en docs/decisions/ y pendientes en docs/BACKLOG.md. Auditoría de paquetes y lint son capas parciales; no equivalen a un pentest.
