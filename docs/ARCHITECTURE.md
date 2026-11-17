# Arquitectura y evolución

## Estado actual

`src/main.tsx` monta `App.tsx`. `App.tsx` concentra panel administrativo, selección de roles y vistas; `GuestPage.tsx` concentra portal y reservas. `hotelData.ts` y `mantaHotels.ts` aportan catálogos y simulaciones; `storage.ts` y `availability.ts` acceden a localStorage. Vite conserva plugins del origen Figma. No hay backend ni llamadas a una API propia.

El origen del navegador forma parte del almacenamiento: `localhost` y `127.0.0.1`, y puertos distintos, tendrán datos separados. No borrar localStorage esperando preservar reservas de demostración.

## Estructura propuesta (migración gradual)

```text
src/
  app/                 composición de pantallas, rutas y proveedores
  features/
    auth/              sesión y acceso
    hotels/            catálogo y configuración de hoteles
    reservations/      reservas y disponibilidad
    payments/          estado de cobros e integración futura
  shared/
    ui/                componentes reutilizables
    lib/               formatos, validadores y utilidades
    api/               cliente HTTP y contratos
  infrastructure/      adaptadores demo y almacenamiento
tests/e2e/             recorridos sobre la aplicación compilada
docs/                  requisitos, QA, decisiones y fuentes
deploy/                configuración del servidor estático
```

Es una propuesta: las carpetas de funcionalidades se crearán al extraer la primera funcionalidad. Mantener la aplicación ejecutable en cada cambio; no mover miles de líneas solo para cambiar rutas.

## Paso siguiente recomendado

Extraer primero reservas/disponibilidad detrás de un contrato de repositorio. Mantener un adaptador demo local y definir un contrato API antes de conectar servicios. Después separar autenticación y catálogo, conservando pruebas de integración de portal y panel.

Para el servidor se propone un monolito modular con PostgreSQL antes de considerar microservicios. Tecnología y proveedor quedan pendientes de decisión del usuario. El SQL `bd.txt` es una fuente de diseño, no una migración aprobada: no se ha ejecutado.

## Invariantes del sistema futuro

- Todas las operaciones llevan identidad y contexto hotelero verificado en servidor. Nunca aceptar `hotelId` del cliente como autorización.
- Disponibilidad por fecha/tipo de habitación y reserva atómica en transacción; dos clientes no pueden consumir el último cupo.
- Importes y reglas tributarias se calculan y validan en servidor, con vigencia y trazabilidad.
- Reservas y webhooks de pagos son idempotentes. Pago confirmado solo tras validación con el proveedor.
- Sesión segura con cookies HttpOnly/Secure y controles CSRF cuando corresponda; permisos denegados por defecto.
- Migraciones versionadas, respaldos y restauración comprobada antes de almacenar información real.
- Logs de servidor con actor, hotel, evento y correlación, sin contraseñas ni datos de tarjeta.

Las validaciones añadidas a `availability.ts` protegen la demo ante datos dañados y cantidades inválidas; no resuelven concurrencia, disponibilidad por fecha ni autorización.
