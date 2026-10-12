# Catálogo de Requisitos Funcionales y No Funcionales (SRS)
## Sistema de Gestión de Servicios Operativos, Reservas y Facturación SRI para Alojamientos del Cantón Manta, Ecuador

* **Código Único de Proyecto (CUP):** 91880000.0000.390820
* **Normativa de Referencia:** IEEE 830 / ISO/IEC 25010 / Normativa Tributaria SRI Ecuador (Art. 41 Ley de Turismo)
* **Ámbito Territorial:** Cantón Manta, Provincia de Manabí, Ecuador (Catastro de 118 establecimientos)
* **Fecha de Emisión:** Octubre 2026 (Versión 3.3 - Catálogos Maestros CRUD, Conmutador Rápido de IVA 8% y Operativa Hotelera Pura)

---

## 1. Identificación y Descripción de Actores del Sistema

El sistema identifica actores humanos (roles del sistema bajo esquema RBAC) y actores externos (sistemas automatizados y webservices integrados):

### 1.1 Actores Humanos (Roles del Sistema)

| Actor | Perfil / Rol | Responsabilidad y Ámbito de Operación |
| :--- | :--- | :--- |
| **ACT-01** | **Superadministrador (Superadmin Cantonal)** | Máxima autoridad de gobernanza a nivel del cantón Manta. Gestiona el catastro oficial de alojamientos (118 establecimientos: hostales, hoteles y hosterías), tipos de hotel, categorías por estrellas y roles; supervisa tableros consolidados cantonales (ocupación, flujo de turistas, divisas generadas); y emite alertas tributarias globales (activación sugerida de IVA 8% cantonal ante decreto presidencial de última hora). |
| **ACT-02** | **Administrador del Hotel (Admin Hotel)** | Responsable legal, comercial y fiscal de un establecimiento específico (aislamiento Multi-tenant). Configura datos tributarios ante el SRI (RUC, punto de emisión `001-001`), gestiona las habitaciones físicas y el personal de su hotel (usuarios con rol Recepcionista y Revenue Manager), y opera el **interruptor para activar o desactivar la tasa del 10% de servicio turístico** (Art. 41 Ley de Turismo). |
| **ACT-03** | **Encargado de Tarifas y Cupos (Revenue Manager)** | Responsable comercial y de ocupación del establecimiento. Administra los tipos de habitación, crea y ajusta temporadas, planes de tarifa (precios base definidos por su análisis de mercado), controla la apertura/cierre de cupos para evitar sobreventas (*overbooking*), gestiona internamente los bloqueos por mantenimiento y opera el **Conmutador Rápido de Emergencia de IVA al 8%** ante decretos presidenciales de última hora. |
| **ACT-04** | **Recepcionista (Front Desk)** | Personal operativo de mostrador. Gestiona la bandeja de reservas en tiempo real (notificaciones auditivas y visuales); ejecuta el **registro de Check-in presencial en mostrador** validando disponibilidad física y cédula/pasaporte; **asigna manualmente la habitación física concreta**; realiza el Check-out; genera enlaces de cobro digital (PayPhone/DeUna) y emite la factura electrónica autorizada ante el SRI. |
| **ACT-05** | **Cliente / Huésped (Usuario Público)** | Turista nacional o extranjero. Interactúa con el motor de reservas web: consulta disponibilidad por tipos de habitación, compara planes de tarifa, observa el desglose tributario transparente (IVA 15%/8% + 10% servicio si aplica), formaliza la reserva (con Google, correo o como invitado *Guest Checkout*) y obtiene su voucher digital con código QR. |

### 1.2 Actores Externos (Sistemas e Interfaces Integradas)

| Actor Externo | Tipo de Interfaz | Función en el Ecosistema |
| :--- | :--- | :--- |
| **EXT-01: SRI (Servicio de Rentas Internas)** | Web Service SOAP / REST | Recepción de comprobantes electrónicos XML, validación de Clave de Acceso (49 dígitos Módulo 11), autorización tributaria y consulta de estado de facturas en línea (`cel.sri.gob.ec`). |
| **EXT-02: Pasarelas de Pago Digitales (PayPhone / DeUna / Kushki)** | API REST / Webhooks | Procesamiento de cobros digitales en USD mediante tarjetas de crédito/débito y transferencias directas, generación de códigos QR de cobro y retorno de confirmación de pago. |
| **EXT-03: Servicio de Notificaciones (WhatsApp API / Email SMTP)** | Web Service REST / SMTP | Despacho automático de notificaciones inmediatas: voucher de confirmación con QR al huésped, alertas sonoras/visuales de nuevas reservas a recepción y enlaces de cobro con tiempo de expiración. |

---

## 2. Requerimientos Funcionales (RF)

### Módulo 1: Motor de Reservas y Experiencia del Huésped (Portal Público)

* **RF-01 (Búsqueda y Cotización Dinámica):** El sistema debe permitir al huésped seleccionar rango de fechas (check-in / check-out), aforo (adultos, niños) y cantidad de habitaciones, recalculando instantáneamente la disponibilidad de tipos de habitación y tarifas vigentes.
* **RF-02 (Autenticación Flexible del Huésped):** El sistema debe permitir al usuario autenticarse mediante:
  * Cuenta de Google (OAuth 2.0).
  * Registro tradicional con correo electrónico y contraseña.
  * Modalidad de **Reserva como Invitado (*Guest Checkout*)** sin necesidad de registro previo para minimizar el abandono de compra.
* **RF-03 (Desglose Tributario Transparente y Adaptativo):** El motor de reservas debe presentar la cotización desglosada con total claridad:
  * Subtotal neto de alojamiento (Base imponible).
  * IVA aplicable: 15% en periodos ordinarios o **8% en feriados turísticos decretados**.
  * Tasa del 10% de Servicio Turístico (Propina legal Art. 41 Ley de Turismo) **únicamente si el hotel la tiene activada**. Si el hotel no la cobra, la cotización no debe reflejar ningún recargo por este concepto.
  * Total final a pagar en USD.
* **RF-04 (Selección de Planes de Tarifa):** El sistema debe permitir seleccionar modalidades de reserva: Solo Alojamiento vs. Con Desayuno Incluido; y Tarifa Flexible (con cancelación gratuita) vs. Tarifa No Reembolsable (con descuento promocional).
* **RF-05 (Ficha Técnica y Galería Multimedia por Tipo de Habitación):** El sistema debe exhibir por cada categoría: carrusel fotográfico HD, metraje en metros cuadrados ($m^2$), tipo y cantidad de camas, vista (al mar, a la ciudad, piscina) y badges de equipamiento (A/C, WiFi, TV cable, baño privado).
* **RF-06 (Servicios Complementarios de Alojamiento - Extras Opcionales):** El sistema debe permitir al hotel configurar servicios extra directamente asociados a la estancia:
  * *Transporte Aeropuerto de Manta $\leftrightarrow$ Hotel:* Configurable por el hotel como **gratuito (de cortesía)**, **con valor adicional en USD**, o **no disponible**.
  * *Adicionales de Hospedaje:* Cunas para bebés, camas supletorias o late check-out (sujeto a disponibilidad).
  * *(Se excluyen expresamente tours y paquetes turísticos ajenos al servicio de alojamiento).*
* **RF-07 (Localización y Puntos de Interés en Manta):** El sistema debe presentar la ubicación geográfica del hotel dentro de su parroquia (Manta, Tarqui, Barbasquillo, Santa Marianita, San Lorenzo, etc.) con distancias y tiempos a playas, terminal y aeropuerto.
* **RF-08 (Reseñas y Calificaciones Verificadas):** El sistema debe mostrar la puntuación promedio (escala 1 a 10) y opiniones de huéspedes reales desglosadas por: Limpieza, Ubicación, Personal y Conectividad.
* **RF-09 (Voucher Digital de Reserva con Código QR):**
  * *Definición de Voucher Digital:* Es el **comprobante oficial de confirmación de reserva** que se genera al completarse el proceso. Contiene el código alfanumérico único (ej. `#RES-CS-201`), fechas de entrada y salida, tipo de habitación contratada, número de huéspedes, desglose de valores pagados/pendientes y un **código QR escaneable**.
  * *Uso Operativo:* El huésped lo porta en formato digital (PDF o pantalla del smartphone) y lo presenta en la recepción del hotel al momento de su llegada, permitiendo al recepcionista escanear el QR o ingresar el código para validar la reserva de inmediato sin necesidad de imprimir papel. Se despacha copia automática por correo electrónico y WhatsApp.

---

### Módulo 2: Recepción y Operación de Mostrador (Front Desk)

* **RF-10 (Bandeja de Reservas Entrantes en Tiempo Real):** El sistema debe contar con una pantalla operativa de recepción que liste las reservas clasificadas por estado: `Nueva / Por Confirmar`, `Confirmada`, `En Casa (Check-in)`, `Finalizada (Check-out)` y `Cancelada`.
* **RF-11 (Sistema de Alertas Inmediatas):** Al generarse una nueva reserva desde el motor web, el sistema debe emitir una alerta visual destacada y un aviso sonoro audible en el panel del recepcionista.
* **RF-12 (Confirmación Ágil de Reserva):** El recepcionista debe poder consultar el detalle de cualquier reserva entrante y confirmarla con un solo clic.
* **RF-13 (Registro de Check-in en Mostrador - Sujeto a Disponibilidad Física):**
  * El check-in **no es automático ni desatendido**: depende estrictamente de la llegada presencial del huésped y de la disponibilidad física de habitaciones listas, limpias e inspeccionadas por el hotel (respetando la hora oficial de ingreso del establecimiento, ej. 14:00 o 15:00).
  * El recepcionista verifica la identidad del huésped (Cédula ecuatoriana o Pasaporte), registra la hora de ingreso en el sistema y hace entrega de la llave o tarjeta física.
* **RF-14 (Asignación Manual de la Habitación Física por Recepción):**
  * El motor de reservas público **nunca vende ni promete un número de habitación físico específico** (ej. "Habitación 204"); únicamente vende un **Tipo de Habitación** (categoría y capacidad) con base en los cupos disponibles.
  * La **asignación del número de habitación física concreta** es potestad exclusiva del personal del hotel (Recepción), quien asigna manualmente la habitación libre y lista al momento de preparar la llegada o durante el Check-in.
* **RF-15 (Generación de Links de Cobro Digital):** Para reservas garantizadas sin cobro previo o con saldos pendientes, el recepcionista debe poder generar un enlace de pago seguro (PayPhone / DeUna) con código QR en pantalla y enviarlo por WhatsApp al cliente.
* **RF-16 (Check-out y Cierre de Cuenta):** El recepcionista debe poder registrar la salida del huésped, verificar que el saldo esté en cero, liquidar consumos extras y liberar la habitación en el sistema para posterior limpieza.
* **RF-17 (Búsqueda Rápida en Directorio de Huéspedes):** El sistema debe permitir consultar registros previos de huéspedes por número de cédula o apellido para autocompletar recepciones frecuentes.

---

### Módulo 3: Revenue Management, Tarifas y Régimen Tributario Dinámico

* **RF-18 (Control Dinámico de Cupos por Tipo de Habitación):** El Revenue Manager debe poder abrir o cerrar la disponibilidad de cupos por categoría de habitación en fechas determinadas para prevenir sobreventas (*overbooking*). Para el huésped externo, el sistema solo exhibe la cantidad de cupos disponibles y el tipo de habitación disponible.
* **RF-19 (Gestión Operativa Interna de Bloqueos por Mantenimiento):** Función de uso estrictamente interno del hotel que permite dar de baja temporalmente habitaciones del inventario activo por daños o reparaciones. Esta acción descuenta automáticamente los cupos disponibles hacia el motor público sin exponer motivos técnicos ni detalles operativos al reservador externo.
* **RF-20 (Administración de Tarifas Base y Planes por el Revenue):** El Revenue Manager define las tarifas base por noche de cada tipo de habitación, márgenes por aforo adicional y recargos por planes de desayuno según la oferta comercial del establecimiento.
* **RF-21 (Conmutador Rápido de Emergencia - IVA al 8% por Decreto Presidencial de Última Hora):**
  * *Contexto Operativo:* En Ecuador, la reducción del IVA al 8% durante feriados turísticos (Ley Orgánica de Desarrollo Económico) es potestad del Presidente de la República mediante Decreto Ejecutivo. En la práctica, **dichos decretos se emiten frecuentemente con escasa antelación (de un día para otro o 24-48 horas antes del asueto)**.
  * *Requerimiento:* El sistema debe proveer un **conmutador inmediato de un solo clic ("Activar Régimen Feriado IVA 8% por Decreto")** tanto en el panel del Revenue Manager como en el panel de configuración del hotel.
  * *Impacto en Tiempo Real:* Al activarse el conmutador:
    1. Las nuevas cotizaciones y reservas en el motor web aplican inmediatamente la tasa del 8% de IVA en lugar del 15% ordinario.
    2. Las facturas electrónicas generadas a partir de ese momento aplican el código de porcentaje y tarifa 8% del SRI.
    3. Si el decreto incluye un rango de fechas de vigencia inmediata (ej. desde las 00:00 del viernes hasta las 23:59 del domingo), el sistema debe permitir ingresar dichas fechas para encendido y apagado automático programado, o mantener el modo forzado manual de emergencia.

---

### Módulo 4: Facturación Electrónica SRI Ecuador

* **RF-22 (Cálculo Oficial de Clave de Acceso de 49 Dígitos):** El sistema debe generar la Clave de Acceso reglamentaria del SRI utilizando el algoritmo ponderado Módulo 11 (ponderadores 2 al 7 de derecha a izquierda sobre los primeros 48 dígitos).
* **RF-23 (Estructuración del Comprobante XML v1.1.0):** El sistema debe construir el archivo XML de la Factura conforme a las fichas técnicas del SRI, incorporando:
  * Datos del emisor (RUC, Razón Social, Dir. Matriz, Establecimiento `001`, Punto de Emisión `001`).
  * Datos del comprador (Tipo de identificación, Cédula/RUC/Pasaporte o Consumidor Final).
  * Desglose exacto de impuestos: Código de impuesto 2 (IVA) con código de porcentaje según corresponda: tarifa 15% ordinaria o tarifa 8% feriado.
* **RF-24 (Liquidación de la Tasa del 10% de Servicio Turístico en Factura SRI):**
  * Si el establecimiento tiene **activada** la tasa del 10%: El sistema debe calcular el 10% sobre la base imponible neta y colocar el valor resultante en la etiqueta reglamentaria `<propina>` del XML y del RIDE.
  * Si el establecimiento tiene **desactivada** la tasa del 10%: El sistema debe colocar de forma explícita `<propina>0.00</propina>`, garantizando que no se cobre ni tribute propina indebida.
* **RF-25 (Generación de RIDE en PDF y Validación):** El sistema debe emitir la representación gráfica (RIDE) con código de barras de la clave de acceso, desglose tributario y opción de envío automático por correo electrónico al huésped.

---

### Módulo 5: Gestión de Catálogos Maestros y Operaciones CRUD

Este módulo formaliza las operaciones fundamentales de persistencia (Crear, Consultar, Actualizar, Inactivar / Baja Lógica) para las entidades del modelo de dominio:

* **RF-26 (CRUD de Hoteles / Alojamientos del Catastro):**
  * *Actor:* Superadmin Cantonal.
  * *Crear:* Registrar un nuevo establecimiento vinculando RUC (13 dígitos), razón social, nombre comercial, dirección matriz y sucursal, parroquia de Manta (Tarqui, Barbasquillo, Manta Centro, etc.), tipo de alojamiento, categoría de estrellas, teléfonos de contacto y switch inicial del 10% de servicio.
  * *Consultar:* Búsqueda y listado paginado con filtros combinados por parroquia, categoría de estrellas, tipo de hotel y estado (activo/inactivo).
  * *Actualizar:* Modificar datos comerciales, fiscales, direcciones o contactos.
  * *Inactivar (Baja lógica):* Suspender un establecimiento (`activo = false`) para retirarlo de la oferta pública, preservando íntegro su historial contable y de reservas.
* **RF-27 (CRUD de Tipos de Hotel):**
  * *Actor:* Superadmin Cantonal.
  * *Crear:* Registrar modalidades oficiales de alojamiento turístico según la normativa del Ministerio de Turismo (`HOSTAL`, `HOTEL`, `HOSTERÍA`).
  * *Consultar:* Listar modalidades activas en el sistema con sus descripciones normativas.
  * *Actualizar:* Modificar nombres o descripciones del catálogo.
  * *Inactivar:* Deshabilitar modalidades que dejen de tener vigencia legal.
* **RF-28 (CRUD de Categorías de Hotel por Estrellas):**
  * *Actor:* Superadmin Cantonal.
  * *Crear:* Registrar categorías de categorización oficial (`1 Estrella`, `2 Estrellas`, `3 Estrellas`, `4 Estrellas`, `5 Estrellas / Lujo`).
  * *Consultar:* Listar las categorías vigentes con sus especificaciones de servicio.
  * *Actualizar:* Modificar descripciones o criterios de evaluación.
  * *Inactivar:* Suspender una categoría en caso de actualización reglamentaria.
* **RF-29 (CRUD de Roles y Permisos del Sistema - RBAC):**
  * *Actor:* Superadmin Cantonal.
  * *Crear / Definir:* Roles predeterminados del sistema (`Superadmin Cantonal`, `Admin Hotel`, `Revenue Manager`, `Recepcionista`, `Huésped`).
  * *Consultar:* Visualizar la matriz de permisos asociados a cada rol.
  * *Actualizar:* Asignar o revocar privilegios específicos sobre módulos del sistema.
* **RF-30 (CRUD de Usuarios del Sistema y Asignación de Roles):**
  * *Actor:* Superadmin (usuarios globales y Admin Hotel) y Admin Hotel (personal interno de su hotel).
  * *Crear:* Registrar nuevos colaboradores con correo electrónico único institucional, contraseña cifrada (BCrypt/Argon2), número de cédula/pasaporte, nombres, apellidos y teléfono. **Obligatoriamente se asocia a un establecimiento (`HotelId`) y a un rol (`RolId`)**.
  * *Consultar:* Directorio de usuarios con filtros por establecimiento, rol y estado.
  * *Actualizar:* Modificar datos de perfil, reasignar rol o restablecer contraseña.
  * *Bloquear / Inactivar:* Revocar el acceso de un colaborador ante cese laboral (bloqueo lógico sin borrado físico).
* **RF-31 (CRUD de Tipos de Habitación - Categorías Comerciales):**
  * *Actor:* Admin Hotel / Revenue Manager.
  * *Crear:* Registrar una categoría de habitación para comercialización (nombre ej: *"Matrimonial Superior"*, *"Doble Twin"*, *"Suite Ejecutiva"*; capacidad máxima de adultos y niños; metraje en $m^2$; carrusel fotográfico HD; configuración de camas; vistas al mar/ciudad/piscina; e insignias de amenidades).
  * *Consultar:* Listar tipos de habitación del hotel con vistas de galería y ficha técnica.
  * *Actualizar:* Editar fotos, textos promocionales, capacidad o equipamiento.
  * *Inactivar:* Dar de baja temporalmente una categoría para que no sea ofertable en la web.
* **RF-32 (CRUD de Habitaciones Físicas - Unidades de Inventario):**
  * *Actor:* Admin Hotel / Recepción.
  * *Crear:* Registrar unidades habitacionales físicas individuales (número o código ej. `101`, `102`, `204`; piso o bloque arquitectónico; vinculación a su respectivo `Tipo de Habitación`; y estado operativo inicial: `DISPONIBLE`, `OCUPADA`, `LIMPIEZA`, `MANTENIMIENTO`).
  * *Consultar:* Matriz visual de inventario físico del hotel con filtros por piso, estado operativo y tipo de habitación.
  * *Actualizar:* Cambiar número de habitación, tipo asignado o conmutar su estado operativo diario (ej. pasar de *"Limpieza"* a *"Disponible"* tras inspección de camarera).
  * *Inactivar:* Deshabilitar una unidad física por reformas mayores.
* **RF-33 (CRUD de Temporadas y Tarifas por Plan - Pricing):**
  * *Actor:* Revenue Manager.
  * *Crear Temporadas:* Definir temporadas del hotel (nombre: Alta, Baja, Feriado Local; rango de fechas inicio/fin; y multiplicador o tarifa base).
  * *Crear Planes de Tarifa:* Configurar modalidades comerciales (Solo Alojamiento, Con Desayuno Incluido; Tarifa Flexible con cancelación gratuita, Tarifa No Reembolsable con descuento).
  * *Consultar:* Matriz de tarifas cruzada por temporada, tipo de habitación y plan.
  * *Actualizar Tarifas:* **El precio es determinado por el análisis del Revenue Manager**: modificar tarifas base por noche en USD, costos por persona adicional y recargos por planes especiales.
  * *Cerrar / Inactivar:* Deshabilitar temporadas o planes que hayan caducado.
* **RF-34 (CRUD de Huéspedes - Directorio y Perfil SRI):**
  * *Actor:* Recepcionista / Front Desk (y autoservicio vía Checkout).
  * *Crear:* Registrar nuevo huésped con tipo de documento (Cédula ecuatoriana, RUC o Pasaporte), número de documento, nombres completos, nacionalidad, teléfono con código de país para WhatsApp, correo electrónico y dirección.
  * *Consultar:* Búsqueda ágil y autocompletado en mostrador por número de identificación o apellidos para agilizar check-ins recurrentes.
  * *Actualizar:* Corregir datos personales, teléfono de contacto o razón social y RUC para la factura electrónica del SRI.
  * *Archivar / Anonimizar:* En cumplimiento de la LOPDP y del Código Tributario del SRI, los huéspedes no se eliminan físicamente; se archivan o anonimizan una vez cumplido el plazo legal de 7 años de retención fiscal.
* **RF-35 (CRUD de Parámetros Fiscales y Comerciales del Hotel):**
  * *Actor:* Admin Hotel.
  * *Crear / Configurar:* Registro de parámetros tributarios (RUC de 13 dígitos, razón social, nombre comercial, dirección matriz/sucursal, código de establecimiento `001`, punto de emisión `001`, régimen tributario: General, RIMPE Emprendedor o RIMPE Negocio Popular, condición de obligado a llevar contabilidad, cuentas bancarias oficiales y **switch booleano de la tasa del 10% de servicio turístico**).
  * *Consultar:* Ficha de configuración fiscal y operativa del establecimiento.
  * *Actualizar:* Editar datos comerciales, cuentas o conmutar la tasa del 10% de servicio turístico.

---

### Módulo 6: Superadministración y Gobernanza Cantonal de Manta

* **RF-36 (Tablero Consolidado Turístico Cantonal):** El Superadministrador debe visualizar métricas agregadas del cantón: tasa global de ocupación de Manta, total de reservas realizadas, ingresos turísticos generados en USD y distribución de la demanda por parroquia (Catastro de 118 establecimientos).
* **RF-37 (Alerta Cantonal Global de Decreto de IVA 8%):** El Superadministrador debe contar con una herramienta para emitir un aviso o conmutar de manera sugerida la bandera de IVA al 8% para todos los hoteles adscritos de Manta ante la promulgación imprevista de un Decreto Ejecutivo de feriado.
* **RF-38 (Aislamiento Lógico de Datos Multi-Tenant):** La arquitectura debe restringir las consultas y operaciones de manera que ningún usuario con rol de Administrador, Recepcionista o Revenue Manager pueda acceder a datos, habitaciones, reservas o facturas de otro hotel.
* **RF-39 (Auditoría Global y Trazabilidad de Accesos):** El sistema debe registrar una bitácora inalterable (*Audit Logs*) con fecha, hora, usuario e IP de cada creación, modificación o consulta sensible de datos personales o transacciones financieras.

---

## 3. Requerimientos No Funcionales (RNF)

Estructurados bajo el estándar internacional de calidad **ISO/IEC 25010**:

### 3.1 Eficiencia de Desempeño
* **RNF-01 (Tiempo de Respuesta en Cotizaciones):** La consulta de disponibilidad y cálculo de tarifas con desglose de impuestos debe responder en **menos de 1.0 segundo** bajo condiciones estándar de conexión a Internet.
* **RNF-02 (Concurrencia en Temporadas Altas):** El motor de reservas debe soportar un mínimo de **150 usuarios concurrentes simultáneos** consultando tarifas y realizando reservas durante picos turísticos (Carnaval, Feriado de Difuntos, Fiestas del Comercio de Manta) sin degradación del servicio.

### 3.2 Usabilidad y Experiencia de Usuario (UX)
* **RNF-03 (Operatividad de Mostrador en 2 Clics):** El flujo de recepción para confirmar una reserva entrante o registrar un check-in en mostrador debe completarse en un máximo de **2 clics**, evitando esperas al recibir al huésped físico.
* **RNF-04 (Diseño Responsivo Multidispositivo):**
  * El portal del huésped debe estar 100% optimizado para pantallas móviles (smartphones de 360px a 430px de ancho).
  * El panel operativo de recepción y revenue debe estar diseñado para pantallas de escritorio (1080p) y tablets de mostrador.

### 3.3 Seguridad y Criptografía
* **RNF-05 (Comunicaciones Seguras y Cifrado):** Todas las comunicaciones deben viajar cifradas bajo protocolo **HTTPS / TLS 1.3**. Las contraseñas deben almacenarse con hashing unidireccional robusto (Argon2id o BCrypt con salt).
* **RNF-06 (Tokenización y Cumplimiento PCI-DSS):** Los links de pago para PayPhone/DeUna deben implementarse mediante tokens SHA-256 de un solo uso con vigencia de expiración temporal. El sistema **no debe almacenar bajo ninguna circunstancia** números completos de tarjeta de crédito (PAN) ni códigos de seguridad CVV.

### 3.4 Protección de Datos Personales (Normativa LOPDP Ecuador)
* **RNF-07 (Cumplimiento de la Ley Orgánica de Protección de Datos Personales):**
  * *Consentimiento:* El portal de reservas debe incluir checkbox obligatorio de aceptación de la Política de Privacidad antes de formalizar la compra.
  * *Finalidad y Proporcionalidad:* Los datos recopilados (cédula/pasaporte, nombres, teléfono, correo) se usarán exclusivamente para la reserva, recepción y facturación tributaria SRI.
  * *Trazabilidad de Accesos:* Todo acceso o consulta a información de huéspedes por parte de recepcionistas o administradores debe quedar registrado en una bitácora inalterable de auditoría (*Audit Logs*).
  * *Retención de Datos:* Los datos vinculados a facturación electrónica se conservarán durante los 7 años reglamentarios exigidos por el Código Tributario ecuatoriano.

### 3.5 Fiabilidad, Concurrencia e Integridad Transaccional
* **RNF-08 (Disponibilidad y Uptime):** La plataforma debe garantizar una disponibilidad del **99.5% de tiempo de actividad** anual, con alta tolerancia a fallos durante fines de semana y feriados.
* **RNF-09 (Integridad ACID y Prevención de Overbooking):** El proceso de bloqueo y asignación de habitaciones durante una reserva debe ejecutarse mediante transacciones atómicas con bloqueo de registros (*pessimistic / optimistic locking*) para imposibilitar la doble reserva simultánea de una misma habitación.

### 3.6 Cumplimiento Legal y Tributario
* **RNF-10 (Conformidad con Esquemas XSD del SRI):** Todos los comprobantes electrónicos generados deben validar exitosamente contra los esquemas XSD v1.1.0 del SRI para facturas electrónicas, incluyendo el cálculo verificado de la Clave de Acceso Módulo 11.
* **RNF-11 (Aislamiento de Información Multi-Tenant):** La arquitectura de base de datos y la capa de lógica de negocio deben garantizar de manera inviolable que ningún establecimiento pueda visualizar registros contables, reservas o datos de clientes de otro establecimiento adscrito.

### 3.7 Mantenibilidad y Portabilidad
* **RNF-12 (Arquitectura Modular y Estándares Web):** El código frontend y backend debe estar modularizado por componentes desacoplados, documentado y tipado estrictamente (TypeScript / C# / SQL), permitiendo su despliegue en entornos contenerizados (Docker) o arquitecturas serverless en la nube.

---

## 4. Matriz de Trazabilidad: Actores vs. Requerimientos Funcionales

| Módulo / Funcionalidad | Superadmin | Admin Hotel | Revenue Manager | Recepcionista | Huésped |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Buscar habitaciones y cotizar tarifas (RF-01 al RF-08)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Crear Reserva Online y Voucher QR (RF-09)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Bandeja de Reservas en Tiempo Real (RF-10, RF-11)** | ✅ (Todo Manta) | ✅ (Su hotel) | 👁️ (Lectura) | ✅ (Operativo) | ❌ |
| **Confirmar Reserva, Check-in y Check-out (RF-12, RF-13, RF-16)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Asignación Manual de Habitación Física (RF-14)** | ✅ | ✅ | ❌ | ✅ (Operativo) | ❌ |
| **Generar Link de Cobro PayPhone / DeUna (RF-15)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Directorio Rápido de Huéspedes en Mostrador (RF-17)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Control Dinámico de Cupos por Tipo (RF-18)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Bloqueo Interno por Mantenimiento (RF-19)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Administración de Tarifas Base por Revenue (RF-20)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Conmutador Inmediato IVA 8% de Última Hora (RF-21)** | ✅ (Alerta Cantonal) | ✅ (Su hotel) | ✅ (Su hotel) | ❌ | ❌ |
| **Emisión Factura SRI con Desglose 10% Propina (RF-22 al RF-25)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **CRUD de Hoteles / Catastro Cantonal (RF-26)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CRUD de Tipos de Hotel y Categorías (RF-27, RF-28)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CRUD de Roles del Sistema - RBAC (RF-29)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CRUD de Usuarios del Sistema y Asignación (RF-30)** | ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **CRUD de Tipos de Habitación (RF-31)** | ✅ | ✅ (Su hotel) | ✅ (Su hotel) | ❌ | ❌ |
| **CRUD de Habitaciones Físicas e Inventario (RF-32)**| ✅ | ✅ (Su hotel) | ❌ | ✅ (Estados) | ❌ |
| **CRUD de Temporadas y Tarifas por Plan (RF-33)** | ✅ | ✅ (Su hotel) | ✅ (Su hotel) | ❌ | ❌ |
| **CRUD de Huéspedes y Perfil SRI (RF-34)** | ✅ | ✅ | ❌ | ✅ | ✅ (Auto-registro) |
| **CRUD de Parámetros Fiscales y 10% Servicio (RF-35)**| ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **Tablero Consolidado Cantonal de Manta (RF-36)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Alerta Cantonal Global Decreto IVA 8% (RF-37)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Aislamiento Multi-Tenant y Auditoría (RF-38, RF-39)**| ✅ | ✅ | ✅ | ✅ | ❌ |
