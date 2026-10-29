# Catálogo de Requisitos Funcionales y No Funcionales (SRS)
## Sistema de Gestión de Reservas Hoteleras, Cupos Web y Vouchers Digitales (Cantón Manta, Ecuador)

* **Código Único de Proyecto (CUP):** 91880000.0000.390820
* **Normativa de Referencia:** IEEE 830 / ISO/IEC 25010 / Art. 41 Ley de Turismo de Ecuador (Tasa de Servicio 10%) / LOPDP
* **Ámbito Territorial:** Cantón Manta, Provincia de Manabí, Ecuador (Catastro Oficial de 116 establecimientos activos)
* **Fecha de Emisión:** Octubre 2026 (Versión 4.0 - Modelo Extranet y Motor de Reservas Puro sin PMS)
* **Propósito del Sistema:** Motor de reservas y cotización online por tipos de habitación y cupos, confirmación de abonos con pasarelas digitales locales (PayPhone, DeUna, Kushki), validación/canje de vouchers digitales con código QR, gestión dinámica de tarifas/temporadas (conmutador IVA 15% / 8% por Decreto) y gobernanza cantonal multi-tenant para los alojamientos de Manta.
* **Delimitación Conceptual (No-PMS):** El sistema **NO es un PMS interno** (no incluye procesos de *check-in/check-out* de habitaciones físicas numeradas, entrega de llaves, estados de limpieza/aseo ni mantenimiento operativo), ni emite facturas electrónicas del SRI (proceso contable interno de cada hotel).

---

## 1. Identificación y Descripción de Actores del Sistema

### 1.1 Actores Humanos (Roles bajo esquema RBAC)

| Actor | Perfil / Rol | Responsabilidad y Ámbito de Operación |
| :--- | :--- | :--- |
| **ACT-01** | **Superadministrador (Superadmin Cantonal)** | Máxima autoridad de gobernanza turística cantonal. Gestiona el catastro oficial de alojamientos de Manta (116 establecimientos activos: 76 hostales, 39 hoteles y 1 hostería), modalidades, categorías por estrellas y roles; supervisa tableros consolidados de reservas y activa decretos globales de IVA al 8% en feriados turísticos. |
| **ACT-02** | **Administrador del Hotel (Admin Hotel)** | Responsable comercial y administrativo del establecimiento. Configura datos comerciales de su hotel, personal interno (encargados de reservas y revenue managers) y opera el interruptor para activar o desactivar la tasa del 10% de servicio turístico en la cotización web (Art. 41 Ley de Turismo). |
| **ACT-03** | **Encargado de Tarifas y Cupos (Revenue Manager)** | Responsable comercial de disponibilidad. Administra tipos de habitación ofertados, cupos disponibles para venta web, temporadas, planes tarifarios y el conmutador rápido de emergencia para cotizaciones con IVA al 8% ante decretos presidenciales de última hora. |
| **ACT-04** | **Operador de Reservas / Recepción** | Personal encargado de la bandeja de reservas del hotel. Recibe reservas entrantes en tiempo real con alertas visuales y sonoras; confirma reservas en 1 clic; **valida y canjea el Voucher Digital con código QR** cuando el huésped hace efectiva su reserva; genera enlaces de cobro digital (PayPhone/DeUna) y registra el número de recibo interno del hotel para conciliación. |
| **ACT-05** | **Cliente / Huésped (Usuario Público)** | Turista nacional o extranjero. Consulta disponibilidad por tipos de habitación, selecciona fechas de entrada y salida, compara planes de tarifa y servicios adicionales, observa el desglose transparente (IVA 15%/8% + 10% servicio si aplica), reserva como invitado (*Guest Checkout*) o con cuenta y descarga su Voucher Digital con código QR. |

### 1.2 Actores Externos (Sistemas e Interfaces Integradas)

| Actor Externo | Tipo de Interfaz | Función en el Ecosistema |
| :--- | :--- | :--- |
| **EXT-01: Pasarelas de Pago Digitales (PayPhone / DeUna / Kushki)** | API REST / Webhooks | Procesamiento de cobros digitales en USD mediante tarjetas de crédito/débito y transferencias directas con código QR, retornando confirmación inmediata de pago. |
| **EXT-02: Servicio de Notificaciones (WhatsApp API / Email SMTP)** | Web Service REST / SMTP | Despacho automático de vouchers de confirmación con código QR al huésped y enlaces de cobro. |

---

## 2. Requerimientos Funcionales (RF)

### Módulo 1: Motor de Reservas y Experiencia del Huésped (Portal Público)

* **RF-01 (Búsqueda y Cotización Dinámica por Cupos):** El sistema debe permitir al huésped seleccionar parroquia/sector de Manta, rango de fechas (fecha de entrada y fecha de salida), aforo (adultos, niños) y recalcular instantáneamente los tipos de habitación con cupos web disponibles y sus tarifas vigentes en USD.
* **RF-02 (Autenticación Flexible y Reserva como Invitado - Guest Checkout):** El sistema debe permitir al turista autenticarse mediante cuenta de Google (OAuth 2.0), correo/contraseña o realizar una **Reserva Rápida como Invitado (*Guest Checkout*)** sin obligarlo a crear una cuenta previa.
* **RF-03 (Desglose Tributario Transparente y Adaptativo):** La cotización debe presentar con total transparencia: Subtotal neto de alojamiento (y extras seleccionados), IVA aplicable (**15% régimen ordinario** u **8% en feriados turísticos decretados**), Tasa del **10% de Servicio Turístico** (calculada estrictamente sobre el subtotal neto únicamente si el hotel la tiene activada) y Total final en USD.
* **RF-04 (Selección de Planes de Tarifa):** El sistema debe permitir seleccionar modalidades de tarifa al reservar: *Tarifa Estándar Flexible (Reembolsable)* vs. *Tarifa No Reembolsable (con descuento promocional)*; y opción de *Solo Alojamiento* vs. *Con Desayuno Incluido*.
* **RF-05 (Ficha Técnica y Galería Multimedia por Tipo de Habitación):** Exhibición por tipo de habitación: fotografía HD, metraje en $m^2$, configuración de camas, capacidad máxima, cupos restantes y etiquetas de amenidades (A/C, WiFi, Smart TV, baño privado).
* **RF-06 (Servicios Complementarios de Alojamiento - Extras Opcionales):** Selección opcional de servicios asociados a la reserva: *Traslado Aeropuerto Eloy Alfaro de Manta $\leftrightarrow$ Hotel*, *Cama supletoria*, *Cuna para bebé* o *Salida extendida*. Se excluyen tours o paquetes externos al hospedaje.
* **RF-07 (Localización Geográfica Cantonal y Puntos de Interés de Manta):** Mapa interactivo con ubicación en las 7 parroquias de Manta (Manta Matriz, Tarqui, Los Esteros, San Mateo, Eloy Alfaro, Santa Marianita y San Lorenzo) y tiempos estimados de traslado hacia atractivos clave (Aeropuerto Eloy Alfaro, Terminal Terrestre, Playa El Murciélago y Mall del Pacífico).
* **RF-08 (Reseñas y Calificaciones Verificadas por Subcriterios):** Puntuación del alojamiento y desglose de valoraciones de huéspedes verificados en escala de 1 a 10 por: *Limpieza, Ubicación, Atención del Personal, Relación Calidad-Precio y Conectividad WiFi*.
* **RF-09 (Emisión de Voucher Digital de Reserva con Código QR):** Generación inmediata del comprobante oficial de reserva y pago con código único (`#RES-XXXX`), desglose económico, estado de acreditación y código QR escaneable para validación en el hotel.

---

### Módulo 2: Bandeja de Reservas del Hotel y Validación de Vouchers (Extranet No-PMS)

* **RF-10 (Bandeja de Reservas Entrantes en Tiempo Real):** Pantalla centralizada del hotel que clasifica las reservas según su ciclo comercial: `Por Confirmar`, `Confirmada`, `Voucher Validado`, `Liquidada / Completada` y `Cancelada`.
* **RF-11 (Sistema de Alertas Visuales y Sonoras Inmediatas):** Notificación visual destacada y alerta sonora en el panel del operador del hotel al ingresar una nueva reserva desde el motor público web.
* **RF-12 (Confirmación Ágil de Reserva en 1 Clic):** Verificación de los datos de la reserva entrante y confirmación inmediata en 1 solo clic, descontando automáticamente el cupo web del tipo de habitación contratado.
* **RF-13 (Validación y Canje de Voucher Digital con Código QR):** Buscador y validador rápido de códigos de reserva/QR (`#RES-XXXX`) para que el hotel registre en 1 clic que el huésped presentó su voucher y **efectivizó su reserva** (`Voucher Validado`), sin requerir procesos de check-in/check-out físico ni asignación de número de cuarto.
* **RF-14 (Conciliación con Recibo Externo del Establecimiento):** Ficha de liquidación donde el hotel puede copiar en 1 clic los datos fiscales del titular y registrar el número de comprobante/recibo emitido en su propio sistema contable externo.
* **RF-15 (Generación de Links de Cobro Digital):** Creación de enlaces de pago seguro (PayPhone / DeUna / Kushki) con código QR y envío directo por WhatsApp o correo para reservas con pago pendiente.
* **RF-16 (Liberación Automática de Cupos por Cancelación):** Al marcarse una reserva como `Cancelada` (por el huésped dentro del plazo flexible o por el hotel ante falta de pago), el sistema reintegra automáticamente el cupo al inventario de venta web.
* **RF-17 (Directorio Histórico de Clientes de Reserva):** Registro y búsqueda rápida de titulares de reservas por cédula/pasaporte, nombre o correo electrónico, mostrando cantidad de reservas acumuladas e inversión total.

---

### Módulo 3: Revenue Management, Cupos Web, Tarifas y Régimen de Feriados

* **RF-18 (Control Dinámico de Cupos Web por Tipo de Habitación):** Ajuste ágil (`+` / `-`) de la cantidad de cupos disponibles para la venta online en cada tipo de habitación, previniendo sobreventas (*overbooking*).
* **RF-19 (Administración de Tarifas Base por Tipo de Habitación):** Configuración y edición de tarifas base por noche en USD para cada categoría de habitación ofertada por el hotel.
* **RF-20 (Configuración de Temporadas y Multiplicadores Comerciales):** Gestión de temporadas (Baja, Media, Alta / Feriados) con multiplicadores automáticos sobre la tarifa base y comparativa de ahorro frente a comisiones de OTAs internacionales.
* **RF-21 (Conmutador Rápido de Emergencia - IVA al 8% por Decreto Presidencial):** Interruptor inmediato de 1 clic (*"Activar Régimen Feriado IVA 8% por Decreto"*) disponible para Superadmin, Admin Hotel y Revenue Manager que conmuta al instante el cálculo de IVA del **15% al 8%** en todo el motor de reservas web, desgloses de precios y vouchers digitales.

---

### Módulo 4: Cobros Digitales y Pasarelas de Pago

* **RF-22 (Procesamiento de Pagos Digitales Locales e Internacionales):** Cobro directo en USD mediante tarjetas de crédito/débito (PayPhone, Kushki, Datafast, Stripe).
* **RF-23 (Cobro Inmediato con Código QR y Transferencias):** Cobro instantáneo mediante código QR y transferencia bancaria con DeUna (Banco Pichincha).
* **RF-24 (Conciliación Automática vía Webhooks / Simulación en Vivo):** Actualización inmediata del estado del pago (`Completado`) y acreditación automática en el comprobante de la reserva.

---

### Módulo 5: Catálogos Maestros y Configuración Multi-Tenant

* **RF-25 (Configuración de Tasa de Servicio del 10% por Hotel):** Interruptor independiente por establecimiento para activar o desactivar el cobro del 10% de servicio turístico (Art. 41 Ley de Turismo), actualizando al instante las cotizaciones web y vouchers de ese hotel.
* **RF-26 (CRUD del Catastro Oficial de Alojamientos de Manta):** Administración, filtrado por parroquia/sector y edición de los **116 establecimientos activos** del Catastro Turístico de Manta (76 hostales, 39 hoteles y 1 hostería).
* **RF-27 (Clasificación por Modalidad y Categoría de Estrellas):** Filtros y catalogación por modalidad oficial (*Hotel, Hostal, Hostería*) y categoría (*1 a 5 Estrellas*).
* **RF-28 (Gestión de Roles RBAC y Usuarios por Establecimiento):** Administración de cuentas de personal vinculadas a cada hotel bajo los roles `SUPERADMIN`, `ADMIN_HOTEL`, `REVENUE_MANAGER` y `RECEPCIONISTA` (Operador de Reservas), además del perfil `HUESPED`.
* **RF-29 (Catálogo de Tipos de Habitación en Oferta Web):** Creación y edición de tipos de habitación comercializados en el portal público (nombre, configuración de camas, capacidad, metraje $m^2$, tarifa por noche, amenidades y cupos web).

---

### Módulo 6: Gobernanza Cantonal y Auditoría LOPDP

* **RF-30 (Tablero Consolidado Cantonal y Bitácora de Auditoría LOPDP):** Supervisión macro de reservas e ingresos turísticos del cantón Manta y registro inalterable de auditoría (*Audit Logs* con fecha/hora, usuario, rol, módulo, acción e IP) en cumplimiento de la Ley Orgánica de Protección de Datos Personales del Ecuador.

---

## 3. Requerimientos No Funcionales (RNF) según ISO/IEC 25010

* **RNF-01 (Tiempo de Respuesta en Cotizaciones):** La búsqueda de disponibilidad de cupos y desglose tributario debe responder en **menos de 1.0 segundo**.
* **RNF-02 (Concurrencia en Temporadas Altas):** Capacidad para soportar al menos **150 usuarios concurrentes simultáneos** durante feriados nacionales y eventos en Manta.
* **RNF-03 (Usabilidad en Gestión de Reservas):** La confirmación de una reserva o la validación de un Voucher QR debe completarse en **máximo 2 clics**.
* **RNF-04 (Diseño Responsivo Multidispositivo y Temas Claro/Oscuro):** Portal público mobile-first (360px a 430px) y panel extranet adaptable con soporte de modo claro y oscuro.
* **RNF-05 (Seguridad Criptográfica):** Comunicaciones bajo **HTTPS / TLS 1.3** y contraseñas almacenadas con **Argon2id o BCrypt**.
* **RNF-06 (Tokenización y Cumplimiento PCI-DSS):** Enlaces de cobro con tokens únicos y expiración temporal; el sistema jamás almacena códigos CVV ni datos sensibles de tarjetas.
* **RNF-07 (Protección de Datos Personales - LOPDP Ecuador):** Consentimiento explícito e informado en el checkout, finalidad exclusiva para la gestión de la reserva y trazabilidad en la bitácora de auditoría.
* **RNF-08 (Disponibilidad Continua):** Nivel de servicio (SLA) del **99.5% de uptime** anual.
* **RNF-09 (Integridad Transaccional ACID y Prevención de Overbooking de Cupos):** Control atómico de descuento de cupos por tipo de habitación para impedir sobreventas simultáneas.
* **RNF-10 (Aislamiento Multi-Tenant con Row-Level Security):** Políticas RLS en PostgreSQL que garantizan que cada hotel únicamente pueda visualizar y gestionar sus propias reservas, tarifas, cupos y pagos.

---

## 4. Matriz de Trazabilidad: Actores vs. Requisitos

| Módulo / Funcionalidad | Superadmin | Admin Hotel | Revenue Manager | Operador Reservas / Recepción | Huésped |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Buscar habitaciones, cotizar y elegir planes/extras (RF-01 al RF-08)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Reservar (con Cuenta o Guest Checkout) y Voucher QR (RF-02, RF-09)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Bandeja de Reservas y Alertas en Tiempo Real (RF-10, RF-11)** | ✅ (Todo Manta) | ✅ (Su hotel) | 👁️ (Lectura) | ✅ (Operativo) | ❌ |
| **Confirmar Reserva y Validar Voucher QR en 1 clic (RF-12, RF-13, RF-16)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Conciliar Recibo Externo y Copiar Ficha Cliente (RF-14)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Generar Link de Cobro Digital y Simular/Conciliar Pago (RF-15, RF-22..24)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Directorio de Clientes de Reserva (RF-17)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Control Dinámico de Cupos Web y Tipos de Habitación (RF-18, RF-29)** | ✅ | ✅ | ✅ | 👁️ (Consulta) | ❌ |
| **Administración de Tarifas y Temporadas (RF-19, RF-20)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Conmutador Rápido de Emergencia IVA 8% Feriado (RF-21)** | ✅ (Global Cantonal) | ✅ (Su hotel) | ✅ (Su hotel) | ❌ | ❌ |
| **Configuración Switch 10% Servicio Turístico (RF-25)** | ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **CRUD del Catastro Cantonal (116 Alojamientos) (RF-26, RF-27)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CRUD de Usuarios RBAC y Bitácora de Auditoría LOPDP (RF-28, RF-30)** | ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
