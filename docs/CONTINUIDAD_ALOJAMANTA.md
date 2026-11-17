# AlojaManta: continuidad y acuerdos

Actualizado por autorización expresa del usuario: **16 de noviembre de 2026**.
Estado del producto: demostración frontend local; extracción modular y entregas de V0.2 implementadas parcialmente. V0.3 y producción pendientes.
Encargo vigente: **actualizar únicamente este documento para cambiar de chat**.

## 1. Prioridad inmediata y límites de esta actualización

El usuario pasará a otro chat para **desarrollar la siguiente entrega de V0.2: vencimiento de solicitudes y tratamiento de llegadas próximas**, según la decisión de la sección 4. Su última instrucción autoriza actualizar únicamente este documento para trasladar el contexto.

En esta conversación se organizó parte del proyecto y se acordaron las reglas. **El vencimiento y la restricción de solicitudes próximas todavía no están implementados.** Esta actualización no incluye desarrollo, cambios en otros documentos, reinicio de datos ni publicación.

Este archivo sigue actualizándose **solo por instrucción expresa**. Esta autorización no permite futuras actualizaciones automáticas ni cambios al resto de documentos.

Mensaje sugerido para abrir el nuevo chat:

> Lee docs/CONTINUIDAD_ALOJAMANTA.md y AGENTS.override.md. Desarrolla la siguiente entrega de V0.2 según la sección 4: solicitudes ordinarias con 24 horas para responder y objetivo de atención de 2 horas; vencimiento con liberación de cupo; para llegadas con menos de 24 horas, atención directa del hotel sin solicitud ni apartado automático desde el portal. Revisa primero cómo definir el horario de llegada por establecimiento, que sigue pendiente: no asumas uno universal. Conserva diseño, funcionalidades y datos de mis pruebas. Trabaja localmente, verifica la entrega y no publiques ni actualices documentación sin que te lo indique.

Este documento resume la conversación y apunta al código; no da acceso a otros chats ni garantiza que un nuevo agente lo lea automáticamente. Las instrucciones posteriores del usuario prevalecen.

## 2. Acuerdos que se deben conservar

| ID | Acuerdo vigente |
| --- | --- |
| A-01 | El prototipo es la base del producto: conservar diseño, pantallas y recorridos que le gustan al usuario. |
| A-02 | El producto incluye portal del huésped, gestión hotelera y administración general. |
| A-03 | El hotel acepta manualmente la solicitud. Solicitar no confirma ni cobra. |
| A-04 | La primera operación contempla pago presencial gestionado desde AlojaManta; integración real de tarjeta y pago desde el portal quedan para una versión posterior. |
| A-05 | Apartar el cupo solicitado por tipo de habitación y fechas mientras responde el hotel. |
| A-06 | Evolucionar por módulos y versiones, sin rehacer todo ni eliminar funciones del mapa del producto sin acordarlo. |
| A-07 | La prohibición inicial de desarrollar fue sustituida por la autorización posterior de comenzar y continuar por módulos. El encargo actual vuelve a estar limitado a este documento. |
| A-08 | Aprovechar el consolidado local como fuente de establecimientos; no se ha ejecutado una nueva importación ni la corrección de discrepancias descritas abajo. |
| A-09 | Conservar las imágenes del prototipo por ahora; son imágenes de ejemplo, no fotos verificadas de los hoteles. |
| A-10 | Actualizar documentación solo cuando el usuario lo indique. |
| A-11 | Pago completo, sin anticipos ni abonos parciales. |
| A-12 | Métodos acordados: efectivo y tarjeta. Recepción/portal son canales, no métodos. |
| A-13 | Reserva, cobro, comprobante y seguimiento deben quedar relacionados dentro de AlojaManta. |
| A-14 | Aplicar en la siguiente entrega la decisión de vencimiento y llegadas próximas de la sección 4; aún no está implementada. |

Trabajo local: sin commit, push, publicación, despliegue ni escritura en servicios externos sin instrucción explícita. Respetar cambios y eliminaciones existentes; no restaurar documentos borrados.

Supabase, Vercel y PayPal fueron candidatos mencionados, **no elecciones aprobadas**. No hay proveedor de pasarela, backend ni arquitectura tecnológica definitiva seleccionados.

### Feedback reciente del usuario

- Pidió retirar el botón destacado «Acceso hotelero», eliminar operaciones precargadas y derivar reservas, huéspedes, cupos, vouchers, cobros y métricas de los datos ingresados.
- Autorizó explícitamente borrar **todas las operaciones de prueba y empezar de cero**. Ese reinicio fue puntual; no autoriza borrar las pruebas posteriores.
- Pidió dos accesos rápidos de huésped: Carlos Méndez y Laura Fernández, sin reservas cargadas.
- Confirmó haber probado **cancelar y rechazar**, y dijo que el flujo funciona.
- Señaló que **el panel de gestión ya no sigue suficientemente el modelo visual del prototipo**. Prefirió continuar funcionalidades por el momento. Recuperar esa fidelidad sigue pendiente; no dar por aprobado el rediseño actual ni eliminar sus referencias.

## 3. Funcionamiento implementado

Recorrido local actual:

1. Crear una solicitud desde el portal o desde la bandeja del hotel.
2. Guardarla como `pending`, con pago pendiente, y apartar cupo por noche.
3. El hotel puede aceptar (`confirmed`) o rechazar (`rejected`).
4. El huésped puede cancelar una solicitud pendiente (`cancelled`).
5. Recepción valida una reserva aceptada (`validated`), por código o desde su fila.
6. Desde una reserva validada, «Cobrar» abre el registro del importe completo.
7. Registrar efectivo o tarjeta externa **de prueba**, con fecha y responsable. Tarjeta exige referencia; no se capturan datos de tarjeta ni se mueve dinero.
8. Vincular el número y fecha del recibo o factura emitido por el hotel. Puede corregirse conservando historial y responsable.
9. Consultar el mismo registro desde bandeja, cobros, vouchers y portal; imprimir el resumen o guardar PDF mediante el diálogo de impresión del navegador.

**Aceptar, validar y registrar el cobro son eventos distintos.** Validar o pagar no completa la estancia ni ejecuta un check-in/out formal. AlojaManta no emite ni valida facturas tributarias. El enlace de pago real permanece deshabilitado.

### Reglas y persistencia compartidas

- Estados compartidos: `pending`, `confirmed`, `validated`, `completed`, `cancelled`, `rejected`. El legado `upcoming` se presenta como confirmado y conserva su compatibilidad de cancelación.
- Nuevas solicitudes: identificador UUID, `roomId`, `inventoryMode: "nightly"`, fecha de creación y datos ingresados del huésped.
- Apartados calculados con reservas activas por hotel/tipo y noches `[entrada, salida)`; se usa el pico de solapamiento, no la suma de estancias consecutivas.
- Rechazar o cancelar libera el apartado de esa solicitud sin incrementar artificialmente el cupo base.
- Fallar al guardar no anuncia éxito ni aplica la operación en memoria como si estuviera persistida.
- Se evita duplicar solicitudes y volver a registrar un cobro ya existente.
- El comprobante requiere el detalle de un cobro completo registrado. Las correcciones conservan `receiptHistory` y comprueban la revisión para detectar ediciones desactualizadas.
- Cambios compartidos entre vistas y pestañas del mismo origen. Es control local; no sustituye transacciones, concurrencia ni autorización de servidor.
- «Transferencia externa» se conserva como compatibilidad de registros antiguos, pero no es una opción para nuevos cobros.

### Pantallas y datos

| Área | Estado actual |
| --- | --- |
| Portal | Solicitud y revisión sin cobro ficticio, consulta de estados, cuenta y reservas filtradas por correo; accesos rápidos Carlos/Laura. |
| Bandeja | Solo reservas del hotel seleccionado; búsqueda, filtro, alta manual, aceptación/rechazo, validación, voucher y acceso a cobro/comprobante según perfil. |
| Habitaciones | Ofertas/cupos base de demostración configurables; precio base y cupo editados se reflejan en el portal. No permite reducir cupo total por debajo de los apartados activos. Cupo apartado no equivale a ocupación física. |
| Directorio/fichas | Derivados de las reservas por correo y hotel, con datos realmente ingresados; sin documentos, visitas ni gastos inventados. |
| Cobros y comprobantes | Mismo registro de reserva; cobro completo, saldo, documento del hotel, historial e impresión. |
| Indicadores | Reservas y cobros registrados en este navegador, filtrados por establecimiento. Confirmación o validación no cuenta como ingreso. |
| Temas | Contraste del pie del portal corregido en claro/oscuro; recepción y resumen comprobados también en móvil e inglés. |
| Auditoría | Registros locales de acciones; eliminadas semillas e IP inventada del recorrido actual. No es auditoría protegida de servidor. |

Se mantienen el catálogo, imágenes, tipos de habitación, tarifas y valoraciones de demostración. No convertir esos datos comerciales en hechos verificados. El módulo de tarifas por temporada, la edición general de hoteles y su integración completa con el portal todavía requieren evolución.

### Accesos y sesión

- Se retiró el botón destacado «Acceso hotelero» del encabezado.
- Entrada hotelera: «Iniciar sesión → Personal de Hotel / PMS → Abrir pantalla completa de acceso hotelero».
- Con huésped conectado, el menú de perfil permite acceder al personal o volver al panel si hay sesión hotelera activa.
- Cambiar panel ↔ portal conserva ambas identidades en memoria y la selección de hotel. **Recargar sigue reiniciando la sesión de acceso**, no las reservas persistidas.
- Carlos Admin supervisa todos los hoteles. Juan Recepción, Ana Administradora y María Revenue tienen asignados Voyager, MantaHost y El Náufrago en las cuentas de acceso demo; no Maria Jose.
- Para revisar una reserva de Maria Jose, usar Carlos Admin y seleccionar ese establecimiento. No recurrir a reservas de otros hoteles como respaldo.
- Revenue Manager consulta reservas/vouchers; no recibe acciones de cobro ni edición de comprobantes en la interfaz.
- Roles y acceso son una demostración de interfaz, no seguridad de producción.

## 4. Versiones y decisiones pendientes

| Etapa | Situación |
| --- | --- |
| V0.1: organización interna | Iniciada: reservas/disponibilidad, adaptadores, composición y componentes de recepción extraídos. No se ha modularizado toda la aplicación. |
| V0.2: recorrido coherente | Implementado el recorrido descrito arriba. **No está cerrada**: falta vencimiento automático y resolver reglas comerciales pendientes. |
| V0.3: persistencia e identidad | Pendiente: servicios reales, autorización por hotel, inventario transaccional, sesiones y base de datos. |
| V1.0: primera operación | Pendiente: verificaciones operativas, respaldos/restauración, errores, documentación y preparación para clientes reales. |
| Posteriores | Integración real de tarjeta y pago desde el portal, compartiendo el mismo registro de cobro. |

Pendientes que no deben resolverse inventando reglas:

1. Implementar la decisión de vencimiento y llegadas próximas descrita abajo. Falta definir cómo se configura y obtiene el horario de llegada por establecimiento; no asumir uno universal.
2. Cancelación después de aceptar, no presentación y tratamiento de planes llamados «no reembolsables».
3. Avisos al hotel/huésped y alcance de check-in/out formal.
4. Autoridad de publicación de hoteles y tratamiento de establecimientos pendientes de inspección.
5. Discrepancias del consolidado y validación de datos comerciales.
6. Proveedor de identidad, backend, base de datos, arquitectura concreta y pasarela.
7. Recuperar presentación y organización visual del panel del prototipo.
8. Integración completa de temporadas, planes, extras y catálogo editable; revisar alcance funcional pendiente antes de retirar pantallas.

### Decisión acordada: vencimiento y llegadas próximas

**Acordada el 16/11/2026; pendiente de implementación.** El usuario confirmó «mantengamos la propuesta» para las 24 horas y el objetivo de 2 horas. Después delegó al asistente la decisión sobre llegadas próximas y pidió registrar el resultado para desarrollarlo en otro chat.

- **Con 24 horas o más de anticipación respecto a la llegada:** solicitud ordinaria, aceptación manual del hotel y apartado por tipo de habitación y fechas. El hotel dispone de **24 horas desde la creación de la solicitud** para responder.
- **Objetivo de atención: 2 horas.** Superarlo no cancela ni vence la solicitud; es una meta operativa, no otro plazo de caducidad.
- **Al cumplirse las 24 horas sin respuesta:** la solicitud pasa a **vencida** y libera su apartado. No puede aceptarse después; el huésped debe crear otra, sujeta a disponibilidad y a las reglas de anticipación vigentes.
- **Con menos de 24 horas de anticipación:** el portal informa que se requiere atención directa del hotel y no genera una solicitud ni aparta cupo automáticamente. El personal puede revisar disponibilidad y registrar la reserva desde AlojaManta cuando confirme que puede recibir al huésped. No se ha elegido un nuevo canal de contacto ni autorizado integrar servicios externos para ello.
- **Sin aceptación del hotel no existe reserva confirmada ni cobro.** Mantener separados aceptación, validación y registro del pago completo presencial en efectivo o tarjeta externa de prueba.

La decisión evita imponer un plazo urgente de respuesta sin conocer los horarios ni la capacidad de atención de cada hotel. El criterio se mide en horas: no equivale automáticamente a bloquear todo «hoy» o todo «mañana».

**Pendiente antes de completar la regla de anticipación:** definir cómo se configura y obtiene el horario de llegada de cada establecimiento. No asumir una hora universal ni interpretar la fecha como medianoche. Tampoco se acordó vencer una solicitud ordinaria ya creada solo porque después entre en la ventana de menos de 24 horas: conserva el plazo desde su creación.

### Alcance de la siguiente entrega de V0.2

1. Incorporar vencimiento en estados, persistencia y disponibilidad, sin liberar dos veces ni alterar reservas aceptadas, canceladas, rechazadas o cobradas.
2. Mostrar el límite de respuesta y el estado vencido de forma coherente en portal y panel. Resolver el tratamiento de registros antiguos sin fecha de creación utilizable sin inventarles una.
3. Aplicar la regla del portal una vez resuelto el horario de llegada; conservar el registro asistido del hotel con comprobación de disponibilidad.
4. Probar los límites de 24 horas, la diferencia con el objetivo de 2 horas, liberación de cupo, bloqueo de aceptación tardía, recarga y sincronización entre pestañas; conservar la regresión de recepción.
5. Ejecutar QA y E2E apropiadas. En la demo, no prometer vencimiento autónomo con el navegador cerrado: debe reflejarse al consultar o reabrir la aplicación. La ejecución autónoma en servidor corresponde a V0.3.

Esta entrega no cierra toda V0.2. Cancelación después de aceptar, no presentación, avisos y los demás pendientes siguen abiertos. No elegir backend, pasarela ni ampliar a check-in/out formal dentro de esta entrega.

Antecedente histórico: la consulta a Airbnb Help Center del 14/11/2026 sirvió como referencia para la propuesta de 24 horas. La regla actual es una decisión de producto de AlojaManta, no una norma universal para hoteles.

## 5. Entorno local y cuidado de los datos

- Workspace: `C:\Users\angel\Desktop\Prototipo_BookingHotelero`.
- React, TypeScript, Vite, Tailwind y Leaflet. Navegación por estado de React; no hay API propia ni base de datos conectada.
- Node 22 (>=22.12), npm y `package-lock.json` como referencia. En PowerShell usar `npm.cmd`; no cambiar ExecutionPolicy.
- Instalación cuando sea necesaria: `npm.cmd ci`. Desarrollo: `npm.cmd run dev`.
- URL habitual: `http://127.0.0.1:8443/`. No asumir que un servidor de la conversación anterior sigue activo.
- `localhost`, `127.0.0.1`, puertos y perfiles de navegador diferentes tienen almacenes separados.
- Usar datos ficticios. No guardar secretos en `VITE_*`, código, fixtures ni documentación. Fuentes privadas: `docs/sources/private/`.

### Limpieza puntual ya autorizada

Existe `.env.local`, ignorado por Git, con `VITE_LOCAL_OPERATIONS_RESET_ID=2026-11-15-inicio-limpio-autorizado`. No es una credencial. `src/main.tsx` lo aplica solo en desarrollo y en un host local, **una sola vez por navegador/origen**.

- Marca aplicada: `alojamanta.applied_local_reset`.
- Copia local previa: `alojamanta_operations_backup`.
- Reinicia reservas, antiguos registros operativos, disponibilidad heredada y auditoría; conserva catálogo, ofertas configuradas, perfiles y accesos.
- Si ese navegador aún no abrió la versión, el reinicio puede seguir pendiente hasta su próxima carga. No afirmar que se inspeccionó o limpió el navegador habitual del usuario.
- No cambiar el identificador, eliminar su marca ni repetir el reinicio para «preparar» otro chat: se perderían pruebas nuevas.
- La limpieza de documentación no requiere borrar localStorage, modificar este mecanismo ni arrancar la app.
- Hay además reinicio explícito desde «Carlos Admin → Panel general → Pruebas locales», con confirmación escrita y copia previa.

La fuente actual es `alojamanta_guest_reservations`; se mantiene lectura compatible de `hoteldirekt_guest_reservations` y de reservas manuales antiguas del panel, filtrando ejemplos conocidos. Las ofertas se guardan en `hoteldirekt.<hotelId>.room_offers`. Los registros heredados no deben borrarse indiscriminadamente.

## 6. Mapa mínimo para retomar sin releer todo

| Necesidad | Archivos principales |
| --- | --- |
| Acuerdos y contexto actual | Este documento; `AGENTS.override.md`. |
| Arranque y comandos | `README.md`, `package.json`; `docs/README.md` como índice, pendiente de actualización. |
| Arquitectura y fuentes | `docs/ARCHITECTURE.md`, `docs/sources/README.md`, `docs/BACKLOG.md`. Contienen instantáneas anteriores; no tratarlas como estado actualizado de implementación. |
| Reglas y persistencia de reservas | `src/features/reservations/types.ts`, `status.ts`, `workflow.ts`, `repositories.ts`, `availability.ts`; adaptadores de `src/infrastructure/`. |
| Composición y sincronización | `src/app/reservations.ts`, `useGuestReservations.ts`, `roomCatalog.ts`. |
| Panel operativo y métricas | `src/features/reservations/OperationsViews.tsx`, `operations.ts`. |
| Cobros/comprobantes | `src/features/payments/ReceptionModal.tsx`, `ReceptionForms.tsx`, `receipts.ts`; escritura vinculada en `workflow.ts`. |
| Voucher e impresión | `src/features/reservations/ReservationSummary.tsx`, `ReservationDialog.tsx`, estilos de impresión en `src/index.css`. |
| Portal, acceso y composición general | `src/GuestPage.tsx`, `src/AuthPage.tsx`, `src/App.tsx`. |
| Catálogos/configuración | `src/mantaHotels.ts`, `src/hotelData.ts`. |
| Compatibilidad y limpieza local | `src/storage.ts`, `src/availability.ts`, `src/infrastructure/resetLocalOperations.ts`, `src/main.tsx`. |
| Verificación | Unitarias junto a módulos; `tests/e2e/portal.spec.ts`, `tests/e2e/reservations.spec.ts`. |

`src/PaymentLinkModal.tsx` y `src/SriInvoiceModal.tsx` conservan referencias del prototipo anterior. Sus simulaciones no describen el recorrido actual de recepción. No eliminarlos como «sobrantes» sin considerar la recuperación visual pendiente. La limpieza documental no implica limpiar código.

## 7. Consolidado de establecimientos: evidencia que debe preservarse

Revisión realizada el 14/11/2026, sin modificar ni importar el Excel. Fuente local existente: `docs/Consolidado-Nacional-2026-publico-8.xlsx`, hoja `Hoja2`, rango A1:K117: encabezado y **116 establecimientos**.

Columnas: RUC, Nombre Comercial, Número de Registro, Actividad/Modalidad, Clasificación, Categoría, Razón Social/Propietario, Provincia, Cantón, Parroquia y Estado Registro.

- 39 hoteles, 76 hostales y 1 hostería.
- Estrellas: 33 de 1; 42 de 2; 30 de 3; 6 de 4; 5 de 5.
- Parroquias: Manta 66; Los Esteros 21; Tarqui 16; Santa Marianita 7; San Lorenzo 3; San Mateo 2; Eloy Alfaro 1.
- 111 RATIFICADO y 5 PENDIENTE DE INSPECCIÓN.
- Sin celdas vacías en los 11 campos. 116 números de registro distintos; 5 grupos de RUC repetido que abarcan 10 establecimientos. RUC no debe ser clave única.
- Los RUC tienen 13 dígitos: comprobación de formato, no validación tributaria.

Cruce histórico con `src/mantaHotels.ts`: 116 coincidencias por número de registro, sin establecimientos sin correspondencia; 348 ofertas de habitación, que no proceden del Excel. Coincidencias normalizadas: RUC/registro/clasificación/propietario 116/116; nombre/categoría 114/116; parroquia 115/116.

| ID del prototipo | Campo | Excel | Prototipo revisado |
| --- | --- | --- | --- |
| hosteria-el-bosque | Nombre | BOSQUE EL | Hostería el Bosque |
| hotel-sail-plaza-manta | Nombre | FIDEICOMISO HOTEL SAIL PLAZA MANTA ECUADOR | Hotel Sail Plaza Manta |
| jordan | Categoría | 1 Estrella | 2 Estrellas |
| jordan | Parroquia | TARQUI | MANTA |
| manta-mar-hotel | Categoría | 3 Estrellas | 2 Estrellas |

Los nombres podrían ser abreviaciones de presentación; no calificarlos automáticamente como errores. Usar el número de registro para cruzar datos y preservar IDs actuales, RUC/registro como texto y la distinción entre estado administrativo y estado operativo/publicación.

El Excel no aporta fotografías, precios, habitaciones, inventario, teléfonos, dirección de calle, coordenadas ni reseñas. No acredita esos datos comerciales ni la vigencia actual del registro. Sigue pendiente decidir tratamiento de los cinco establecimientos pendientes de inspección y qué datos de propietario/RUC deben hacerse públicos.

## 8. Verificación registrada y límites

Última verificación en esta conversación, después de organizar fuentes y regenerar dependencias, antes de esta edición documental:

- `npm.cmd run qa`: tipos, lint, **96 pruebas unitarias** y compilación correctos.
- `npm.cmd run test:e2e`: **28 pruebas de navegador** correctas.
- `npm.cmd run security:audit`: 0 vulnerabilidades conocidas en esa ejecución.
- `git diff --check`: sin errores.

Cobertura: solicitud, aceptación, cancelación/rechazo, cupos, validación, aislamiento de vistas por hotel, navegación panel/portal, inicio vacío, inventario compartido, alta manual, registro de cobro, comprobante/historial, edición desactualizada entre pestañas, fallo de almacenamiento, restricciones de interfaz de Revenue Manager, impresión y recepción en móvil/inglés/oscuro.

Las E2E usan un navegador aislado y `vite preview` en el puerto 4173; no son pruebas sobre las reservas del navegador habitual del usuario. El usuario confirmó manualmente cancelar y rechazar, no todo el alcance de la entrega posterior de comprobantes.

Persiste advertencia de bundle principal cercano a 1 MB sin comprimir. Es distinta del consumo de contexto al leer documentación. No se han demostrado seguridad de producción, cumplimiento PCI/SRI/legal ni resultados de pentest.

**No se repitió QA para esta actualización exclusivamente documental.**

## 9. Organización realizada y cuidados para retomar

El usuario autorizó organizar y depurar el proyecto, conservando expresamente `docs/Consolidado-Nacional-2026-publico-8.xlsx`. Se realizaron estos cambios locales:

- Se agruparon sin cambiar contenido `bd.txt`, `modelo_base_de_datos_hotelera.md`, `FRPB-DAS-PLANTILLA-ESPECIFICACION-DISENO_MODIFICADO.md` e `INFORME DE NECESIDAD.md` en **`docs/sources/design/`**. Otros documentos pueden conservar las rutas anteriores; no se actualizó su contenido.
- Se retiraron `adapt_das_template.py` y `update_das_document.py`, generadores obsoletos con entradas ausentes y rutas de otro equipo. No se ejecutaron.
- Se ejecutaron `npm.cmd ci` y `npm.cmd prune` sin cambiar `package.json` ni `package-lock.json`. No se borraron manualmente los paquetes opcionales que npm sigue marcando como `extraneous`.
- Se conservaron `.figma/`, `.mise.toml` y `pnpm-lock.yaml` por sus referencias activas de origen. **Vite importa `.figma/make/site.json`: no borrar esa carpeta sin adaptar la configuración.** El entorno local sigue usando npm.
- La revisión automática bloqueó eliminar `dist/`, `playwright-report/` y `test-results/`; permanecen. El intento posterior específico sobre `test-results/` también fue bloqueado. Son resultados regenerables; no retomar su eliminación como parte del desarrollo funcional.
- Se verificaron por SHA-256 268 archivos protegidos, teniendo en cuenta los traslados, sin cambios de contenido: incluidos Excel, fuentes, código, imágenes y configuración local. No se alteró el almacenamiento del navegador.

No se reestructuró todo el código ni se eliminaron todas las fuentes históricas. Los documentos de diseño contienen diferencias de alcance pendientes de conciliación; no son migraciones ni requisitos automáticamente aprobados. No ejecutar su SQL.

El workspace conserva modificaciones, eliminaciones y archivos sin seguimiento previos. **Sin seguimiento no significa desechable.** No restaurar documentos borrados ni eliminar referencias visuales o pruebas del usuario. No asumir acceso a conversaciones privadas de ChatGPT.

## 10. Registro de continuidad

- **14/11/2026:** creación de la instantánea de planificación, revisión del Excel y actualización autorizada del flujo de cobro.
- **Después:** el usuario autorizó desarrollo incremental. Se implementaron reservas/disponibilidad compartidas, limpieza de ejemplos, pantallas derivadas de operaciones y recepción/comprobantes; la documentación permaneció sin cambios por su restricción expresa.
- **16/11/2026:** por la instrucción «SOLO ESO QUIERO», se actualizó **únicamente este archivo** con el estado real y el objetivo del próximo chat. No se organizaron ni eliminaron otros documentos, no se cambió código ni datos y no se hizo commit, push ni despliegue.

- **16/11/2026, continuación:** organización local y regeneración de dependencias autorizadas; cambios y límites en sección 9. QA, 96 pruebas unitarias, 28 E2E y auditoría correctas. No se implementó el vencimiento ni se publicaron cambios.
- **16/11/2026, decisión de producto:** el usuario confirmó el plazo de 24 horas y el objetivo de 2 horas, delegó la decisión sobre llegadas próximas y autorizó registrar el resultado para desarrollar la siguiente entrega en otro chat. Se actualizó únicamente este documento, sin cambiar código ni repetir pruebas para esta edición documental.

Esta autorización queda limitada a esta actualización documental. El objetivo del siguiente chat es desarrollar el alcance de la sección 4 cuando el usuario lo solicite; no autoriza publicación ni actualizaciones automáticas de documentación.
