DOCUMENTO DE DISEÑO DETALLADO DE SOFTWARE

1. Sistema de Gestión, Administración y Reservas Hoteleras del Cantón Manta, Ecuador

Plantilla inspirada en el estándar IEEE 1016-2009

Tabla de contenido

Contenido

[1. Introducción 3](#_Toc239881757)

[1.1. Objetivo 3](#_Toc239881758)

[1.2. Definiciones, Acrónimos y Abreviaturas 3](#_Toc239881759)

[1.3. Audiencia 4](#_Toc239881760)

[1.4. Alcance 5](#_Toc239881761)

[2. Presentación del Producto 6](#_Toc239881762)

[2.1. Propósito del Sistema 6](#_Toc239881763)

[2.2.1. Planteamiento del problema 6](#_Toc239881764)

[2.2.2. Objetivo 6](#_Toc239881765)

[2.2.3. Alcance 6](#_Toc239881766)

[2.2.4. El Sistema no contempla 6](#_Toc239881767)

[2.2. Riesgos 6](#_Toc239881768)

[3. Descripción General 8](#_Toc239881769)

[3.1. Contexto del Producto 8](#_Toc239881770)

[3.2. Perspectivas futuras del producto 8](#_Toc239881771)

[3.3. Reglas y Funciones de Negocio 8](#_Toc239881772)

[4. REQUISITOS 10](#_Toc239881773)

[4.1. Funcionales 10](#_Toc239881774)

[4.2. No funcionales 33](#_Toc239881775)

[4.2.1. Tamaño y rendimiento 38](#_Toc239881776)

[4.2.2. Calidad 38](#_Toc239881777)

[4.2.3. Otros 38](#_Toc239881778)

[5. Arquitectura del Producto/Sistema 38](#_Toc239881779)

[5.1. Vista de Casos de Uso 38](#_Toc239881780)

[5.1.1. Actores 38](#_Toc239881781)

[5.1.2. Modelo de casos de Uso 39](#_Toc239881782)

[5.1.3. Lista de casos de Uso 41](#_Toc239881783)

[5.1.4. Descripción de los Casos de Uso 42](#_Toc239881784)

[5.2. Vista Funcional 71](#_Toc239881785)

[5.2.1. Modelo de Análisis 71](#_Toc239881786)

[5.2.2. Interfaces con el usuario 87](#_Toc239881787)

[5.3. Vista Lógica 98](#_Toc239881788)

[5.3.1. Descripción 98](#_Toc239881789)

[5.3.2. Paquetes de Diseño Arquitectónicamente Significativos 99](#_Toc239881790)

[5.3.3. Vista de Implementación - Componentes 100](#_Toc239881791)

[5.4. Vista de Despliegue - Ambiente Físico 100](#_Toc239881792)

[5.5. Vista de Datos 101](#_Toc239881793)

[5.5.1. Definiciones 101](#_Toc239881794)

[5.5.2. Diseño de Base de Datos 103](#_Toc239881795)

[5.6. Requisitos de Software/Hardware 104](#_Toc239881796)

[6. Calidad 105](#_Toc239881797)

[7. Observaciones 105](#_Toc239881798)

# Introducción

## Objetivo

El presente documento tiene como objetivo definir, analizar y formalizar la arquitectura de software, las especificaciones funcionales y el diseño técnico del 'Sistema de Gestión de Servicios Operativos, Motor de Reservas y Cobros Digitales en Establecimientos de Alojamiento del Cantón Manta, Ecuador' (CUP: 91880000.0000.390820). Esta propuesta técnica articula los patrones de integración comercial multihotel, esquemas de disponibilidad de habitaciones, pasarelas de cobro digitales locales (PayPhone/DeUna), procesamiento de cobros digitales con desglose flexible de IVA (15% u 8%) y la parametrización de la tasa del 10% de servicio turístico por establecimiento según el Art. 41 de la Ley de Turismo del Ecuador; mitigando la brecha digital en la planta hotelera del cantón Manta, provincia de Manabí.

## Definiciones, Acrónimos y Abreviaturas

|  |  |  |  |
| --- | --- | --- | --- |
| **Término** | **Definición** | **Alias** | **Abreviatura** |
| Check-in | Registro de ingreso formal del huésped al hotel y asignación de habitación. | Ingreso / Entrada | In |
| Check-out | Liquidación de cuenta, cobro de saldos y entrega de habitación por salida. | Salida / Egreso | Out |
| Overbooking | Sobreventa de habitaciones por encima de la capacidad física disponible. | Sobreventa | Overbk |
| API REST | Interfaz de programación de aplicaciones para integración de pagos y mensajería. | Web Service | REST API |
| Voucher QR | Comprobante digital de confirmación de reserva con código QR escaneable. | Voucher Digital | Comprobante |
| Código Reserva | Identificador alfanumérico único para validación de la estancia en mostrador. | ID Reserva | Reserva Code |
| Token SHA-256 | Hash criptográfico de un solo uso para enlaces seguros de cobro digital temporal. | Token Pago | Hash Token |
| Tasa Servicio 10% | Recargo legal de servicio/propina (Art. 41 Ley de Turismo), configurable por hotel. | Propina Legal 10% | Serv10 |
| IVA Turístico 8% | Tarifa reducida de IVA para feriados nacionales por Decreto Ejecutivo. | IVA Feriado | IVA 8% |
| Base Imponible | Subtotal neto gravado del hospedaje sin impuestos ni servicios adicionales. | Subtotal Neto | Base |
| Rate Plan | Plan de tarifa comercial (Con desayuno, Sin desayuno, No reembolsable, Flexible). | Paquete Tarifario | RP |
| Multi-tenant | Arquitectura donde múltiples hoteles operan con aislamiento estricto de datos. | Multihotel | MT |
| Catastro Manta | Registro oficial del Ministerio de Turismo de alojamientos en Manta 2026. | Catastro Turístico | Cat |
| Revenue Manager | Especialista o módulo de optimización de precios, cupos y temporadas. | Gestión Tarifas | Rev |
| Voucher QR | Comprobante digital de reserva con código QR para presentación en la recepción. | Cupón Digital | QR |
| PayPhone / DeUna | Pasarelas de cobro digital ecuatorianas para tarjetas y transferencias bancarias. | Pasarelas Locales | Pay |
| LOPDP | Ley Orgánica de Protección de Datos Personales del Ecuador (R.O. Suplemento 459, 2021). | Ley Datos Personales | LOPDP |
| Derechos ARCO | Derechos de Acceso, Rectificación, Cancelación y Oposición del titular de datos. | Protección Datos | ARCO |

## Audiencia

|  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| **Stakeholder** | **Rol** | **Responsa-bilidad** | **Intereses** | **Criterios de éxito** | **Preocupación** | **Competencias técnicas/ Relación de ambiente de trabajo** |
| Admin Hotel | Usuario directo | Configurar datos comerciales/fiscales, activar/desactivar tasa 10% de servicio y crear usuarios. | Garantizar la rentabilidad y cumplimiento fiscal del establecimiento. | Aumento de reservas directas y cobros digitales y confirmación de estancias sin fricción. | Tiempos de capacitación y fallas de conexión. | Manejo de computadoras y paneles de administración. |
| Recepcionista | Usuario directo | Recibir reservas, confirmar estancias, check-in, check-out, links de cobro y gestionar cobros digitales y entregar vouchers QR. | Atención ágil al huésped sin fricciones en mostrador. | Procesar check-in y confirmación de cobro en menos de 2 minutos. | Caídas de red y sobreventa de habitaciones. | Manejo ágil de navegadores web y pasarelas de pago. |
| Revenue Manager | Usuario directo | Configurar tarifas base, apertura/cierre de cupos, temporadas y bloqueos por mantenimiento. | Maximizar ingresos y ocupación hotelera evitando sobreventas. | Optimización tarifaria en feriados con conmutador IVA 8%. | Pérdida de competitividad y fechas cerradas por error. | Manejo de calendarios tarifarios y hojas de cálculo. |
| Huésped / Turista | Usuario directo web | Buscar disponibilidad, comparar opciones con desglose claro de impuestos, pagar y obtener voucher. | Reservar alojamiento de forma transparente, rápida y segura en Manta. | Confirmación inmediata con código QR y sin cargos ocultos. | Cobros indebidos o habitación no disponible al llegar. | Uso de teléfonos inteligentes y pagos digitales. |

## Alcance

*El Documento de Arquitectura abarca la definición de la arquitectura del producto a través de las vistas de casos de uso, lógica (análisis y diseño), despliegue e implementación, también define los procedimientos del usuario a los que deberá dar soporte y el manejo que se realizará a los datos, así como la definición de requerimientos funcionales y no funcionales, definición de otros aspectos del producto, incluidos los objetivos del producto, restricciones, lo que el sistema no contempla, riesgos, contexto del producto, reglas y funciones de negocio.*

# Presentación del Producto

## Propósito del Sistema

### Planteamiento del problema

En la ciudad de Manta, provincia de Manabí, el sector de alojamiento turístico presenta una marcada fragmentación y heterogeneidad en sus métodos de comercialización y gestión de reservas. A pesar de la relevancia turística y corporativa de la ciudad, no existe una plataforma tecnológica común y accesible que estandarice e integre los procesos de reserva para toda la planta hotelera sin importar su categoría.

Esta situación genera una brecha operativa evidente: mientras los establecimientos de menor categoría dependen casi en su totalidad de métodos manuales o canales de mensajería (como WhatsApp y redes sociales) con alto riesgo de desatención y sobreventa (*overbooking*), los hoteles de mayor categoría suelen utilizar herramientas cerradas o costosas que no fomentan una sinergia en la oferta turística local. Como consecuencia, se dificulta la auditoría del flujo real de huéspedes, se incrementan los costos operativos y se limita la experiencia del usuario, quien carece de un medio centralizado, ágil y transparente para consultar y reservar hospedaje en la ciudad.

Entre los principales impactos y problemáticas detectadas se encuentran:

* **Brecha y desbalance operativo en el sector:** Disparidad en la capacidad técnica para gestionar reservas entre establecimientos de distintas categorías, afectando la competitividad global del destino.
* **Dependencia de canales no automatizados o aislados:** Elevada concentración de solicitudes en canales informales (WhatsApp, llamadas y redes sociales), lo que provoca tiempos lentos de respuesta, errores humanos y pérdida potencial de clientes.
* **Riesgo de errores en la disponibilidad y sobreventa:** Dificultad para mantener un control sincronizado de habitaciones y tarifas en tiempo real.
* **Falta de centralización y reportería estratégica:** Inexistencia de un entorno común que permita registrar y auditar el historial de estancias, comportamiento de huéspedes e indicadores de ocupación aplicables a toda la oferta hotelera de Manta.

### Objetivo

Desarrollar e implementar una plataforma digital integral multihotel que centralice la comercialización mediante un motor de reservas web directo, optimice la operativa de recepción y control de cupos, y automatice la emisión de vouchers digitales y confirmación de cobros en línea, cerrando la brecha digital en los establecimientos de alojamiento del cantón Manta y reduciendo la dependencia de OTAs internacionales.

### Alcance

*Una solución satisfactoria permitirá:*

* Gestionar el catálogo hotelero: Permitir a los establecimientos hoteleros registrar y mantener actualizado los perfiles, tipos de habitaciones, modicidades, capacidades máximas y la disponibilidad en tiempo real.
* **Administrar esquemas de tarifas dinámicas:** Configurar precios diferenciados por temporadas (alta, baja), fines de semana y feriados locales o nacionales.
* **Consultar disponibilidad y procesar reservas en línea:** Proveer un motor de búsqueda público donde los turistas puedan filtrar hoteles por fechas, número de huéspedes y ubicación, generando solicitudes de reserva sin riesgo de sobreventa (*overbooking*).
* **Controlar el estado de las reservaciones y bloqueos:** Monitorear el flujo del ciclo de vida de la reserva (confirmada, pendiente, cancelada, completada).
* **Centralizar métricas y analítica turística:** Generar reportes automáticos sobre tasas de ocupación, procedencia de visitantes y comportamiento de la demanda para el sector turístico de Manta y la administración general.

### El Sistema no contempla

* El sistema no incluye módulos ERP de operación interna (comandas de restaurante, lavandería industrial, minibar o almacenes).
* El sistema no incluye apartados sobre planes turísticos, ya que se asocian con hospedajes en hoteles, hostales y hosterias.

## Riesgos

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Factor de riesgo** | **Probabilidad** | **Impacto** | **Estrategia de mitigación** | **Responsable** |
| Intermitencia en pasarelas de pago externas durante picos de demanda | Media | Alta | Cola asíncrona de reintentos y generación de clave de acceso Módulo 11 en modo contingencia. | Equipo de Desarrollo / Arquitecto |
| Sobreventa (overbooking) en temporadas de feriados en Manta | Media | Alta | Control transaccional atómico ACID en la base de datos con descuento inmediato de inventario. | Líder Técnico / DB Admin |
| Resistencia inicial de propietarios de hostales pequeños al uso del software | Alta | Media | Diseño de interfaz ultra-intuitiva (<= 2 clics) y programa de capacitación simplificado. | Coordinador de Implantación |
| Error en la aplicación indebida del 10% de servicio en hostales no gravados | Baja | Alta | Parámetro booleano rígido por hotel (grava\_servicio\_10) con bloqueo automático de cálculo. | Analista Funcional / QA |
| Interrupción de internet en recepción durante el check-in de huéspedes | Media | Media | Soporte de caché local PWA en navegador para registro de arribos y posterior sincronización. | Equipo de Desarrollo Frontend |
| Riesgo de sanciones por infracción a la Ley de Protección de Datos (LOPDP) | Baja | Alta | Consentimiento informado obligatorio, tokenización PCI-DSS y auditoría estricta de accesos. | Oficial de Cumplimiento / Seguridad |

# Descripción General

## Contexto del Producto

A diferencia de la gestión manual, la plataforma permite a los establecimientos hoteleros de Manta automatizar su inventario en tiempo real, cobrar con pasarelas locales y retener el 100% de su margen operativo.

## Perspectivas futuras del producto

* App móvil con la cual se podrá manejar los mismos datos que la versión de escritorio.

## Reglas y Funciones de Negocio

**Diagrama AS-IS**

El siguiente diagrama modela el flujo actual de reservas y operativa de mostrador en los establecimientos de Manta, evidenciando los canales manuales desconectados (WhatsApp, cuadernos de notas, Excel borrador y transferencias bancarias manuales) con sus puntos críticos de sobreventa y comisiones de OTAs:

![](data:image/png;base64...)

**Diagrama TO-BE**

El siguiente diagrama modela el flujo futuro implementado por la plataforma tecnológica centralizada, donde el motor de reservas online en React 19, la base de datos PostgreSQL 16+ con control transaccional ACID y las pasarelas locales (PayPhone y DeUna) automatizan la disponibilidad, cobranza y check-in express mediante Voucher con código QR:

![](data:image/png;base64...)

# REQUISITOS

## Funcionales

|  |  |
| --- | --- |
| Número: | RF-1 |
| Título: | Búsqueda dinámica y cotización de habitaciones por fechas y aforo |
| Texto: | El sistema dispondrá de una barra superior con selectores de fechas (check-in/check-out), aforo de personas (adultos y niños) y cantidad de habitaciones, recalculando la disponibilidad y tarifas en tiempo real. |
| Tipo: | Funcional - Motor de Reservas |
| Detalles de requisitos y restricciones: | Validación cronológica de fechas, control de aforo por capacidad máxima y recálculo instantáneo en USD. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-2 |
| Título: | Matriz comparativa de disponibilidad y tipos de habitación |
| Texto: | Presentación de la oferta de habitaciones en una matriz comparativa organizada con columnas de estándar hotelero: Tipo de Habitación, Capacidad, Precio total con desglose, Opciones y selector numérico. |
| Tipo: | Funcional - Catálogo de Alojamiento |
| Detalles de requisitos y restricciones: | Solo expone categorías con cupos abiertos para las fechas seleccionadas; el huésped no reserva números físicos concretos. |
| Fecha de revisión y versión: | Noviembre 2026 Versión 5.0 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-3 |
| Título: | Desglose tributario adaptativo |
| Texto: | Visualización transparente del Subtotal Neto, IVA (15% ordinario u 8% feriado decretado), Tasa del 10% de Servicio Turístico (únicamente si el hotel la tiene activa) y Total en USD. |
| Tipo: | Funcional - Cotización y Tarifas |
| Detalles de requisitos y restricciones: | Cumplimiento del Art. 41 Ley de Turismo. Si el hotel no cobra servicio se muestra en $0.00 sin recargos ocultos. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-4 |
| Título: | Autenticación flexible, Guest Checkout y Consentimiento LOPDP |
| Texto: | Acceso mediante cuenta de Google (OAuth 2.0), registro tradicional con correo/contraseña y modo Guest Checkout (reserva rápida como invitado) sin registro previo obligatorio para reducir abandono de reserva. |
| Tipo: | Funcional - Seguridad, Acceso y Cumplimiento Legal |
| Detalles de requisitos y restricciones: | Exige de forma obligatoria el marcado de dos casillas de verificación independientes al registrarse o reservar: 1) Aceptación de Términos y Condiciones de Uso del portal AlojaManta; 2) Consentimiento previo, expreso e informado para el tratamiento de datos personales conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP Ecuador), disponiendo de enlaces directos para consultar el modal legal informativo con los derechos ARCO. |
| Fecha de revisión y versión: | Noviembre 2026 Versión 5.0 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-5 |
| Título: | Selección de planes de tarifa (Rate Plans) |
| Texto: | Configuración de modalidades comerciales por habitación: Solo Alojamiento vs. Con Desayuno Incluido; y Tarifa Flexible (cancelación gratuita) vs. Tarifa No Reembolsable (con descuento promocional). |
| Tipo: | Funcional - Planes de Tarifa |
| Detalles de requisitos y restricciones: | Ajuste automático de la tarifa base pactada según los multiplicadores o valores fijos del plan comercial. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-6 |
| Título: | Ficha técnica y galería multimedia por tipo de habitación |
| Texto: | Apertura de galería fotográfica HD, metraje exacto en m², tipo de vista (mar, ciudad, piscina), configuración de camas e insignias de amenidades (A/C, WiFi, TV, baño privado). |
| Tipo: | Funcional - Experiencia de Usuario |
| Detalles de requisitos y restricciones: | Diseño responsivo optimizado para carga ágil en smartphones móviles de 360px a 430px de ancho. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-7 |
| Título: | Servicios complementarios de alojamiento (Extras opcionales) |
| Texto: | Servicios adicionales directamente vinculados a la estancia: Traslado Aeropuerto Manta <-> Hotel (configurable por el hotel como gratis, con costo en USD, o no disponible), cunas o late check-out. Se excluyen tours. |
| Tipo: | Funcional - Servicios Extras |
| Detalles de requisitos y restricciones: | Suma automática de costos extras al subtotal de la reserva según la política comercial de cada hotel. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-8 |
| Título: | Geolocalización cantonal y puntos de interés de Manta |
| Texto: | Ubicación geográfica exacta del hotel en su parroquia (Manta, Tarqui, Barbasquillo, San Mateo, Santa Marianita, San Lorenzo) e indicadores de tiempo a playas y terminales. |
| Tipo: | Funcional - Geolocalización |
| Detalles de requisitos y restricciones: | Muestra distancias y tiempos a Playa El Murciélago, Mall del Pacífico, Terminal Terrestre y Aeropuerto Eloy Alfaro. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-9 |
| Título: | Comentarios y calificaciones de huéspedes verificados |
| Texto: | Puntuación de 1 a 10 con total de opiniones, desglose por criterios (limpieza, ubicación, personal, conectividad) y reseñas reales de clientes. |
| Tipo: | Funcional - Reputación Online |
| Detalles de requisitos y restricciones: | Solo pueden calificar huéspedes que hayan completado una estancia real con check-out registrado. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-10 |
| Título: | Emisión de voucher digital de reserva con código QR |
| Texto: | Comprobante oficial de confirmación con código alfanumérico único (ej. #RES-CS-201), fechas, tipo de habitación contratada, desglose de pagos y código QR escaneable para recepción. |
| Tipo: | Funcional - Comprobante de Reserva |
| Detalles de requisitos y restricciones: | Código QR escaneable por el recepcionista para confirmación inmediata en mostrador sin requerir impresión en papel. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-11 |
| Título: | Bandeja de reservas entrantes en tiempo real para Front Desk |
| Texto: | Vista operativa centralizada en recepción con nuevas reservas clasificadas por: Nueva/Por Confirmar, Confirmada, En Casa (Check-in), Finalizada y Cancelada, con avisos sonoros y visuales. |
| Tipo: | Funcional - Recepción Operativa |
| Detalles de requisitos y restricciones: | Actualización en tiempo real mediante WebSockets o SSE al ingresar una nueva reserva desde el motor web. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-12 |
| Título: | Confirmación ágil de reservas entrantes en mostrador |
| Texto: | Apertura del expediente operativo de la reserva para verificar notas del cliente, fechas y ejecutar la confirmación en 1 solo clic. |
| Tipo: | Funcional - Recepción |
| Detalles de requisitos y restricciones: | Registro del recepcionista que confirma y cambio de estado a CONFIRMADA con trazabilidad horaria. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-13 |
| Título: | Registro de Check-in en mostrador (Sujeto a Disponibilidad Física) |
| Texto: | El check-in no es automático: depende de la llegada presencial del huésped y de la disponibilidad física de habitaciones listas, limpias e inspeccionadas. Recepción valida cédula/pasaporte y entrega llaves. |
| Tipo: | Funcional - Check-in Mostrador |
| Detalles de requisitos y restricciones: | Validación de identidad oficial y respeto de la hora oficial de ingreso del establecimiento (ej. 14:00). |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-14 |
| Título: | Asignación manual de habitación física por recepción |
| Texto: | El cliente solo reserva por Tipo de Habitación; la asignación del número de habitación física concreta (ej. 204) la realiza recepción manualmente al preparar el arribo o durante el Check-in. |
| Tipo: | Funcional - Asignación de Inventario |
| Detalles de requisitos y restricciones: | Recepción asigna una unidad física en estado DISPONIBLE que coincida con la categoría contratada. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-15 |
| Título: | Generación de enlaces de cobro seguro (PayPhone / DeUna) |
| Texto: | Generación de link de pago seguro con token hash y código QR en pantalla para que el cliente liquide saldos desde su teléfono móvil. |
| Tipo: | Funcional - Cobros Digitales |
| Detalles de requisitos y restricciones: | Tokens SHA-256 de un solo uso con tiempo de caducidad configurable (24h/48h) enviados por WhatsApp. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-16 |
| Título: | Check-out, balance de cuenta y liberación de habitación |
| Texto: | Cierre de cuenta, verificación de saldo cero, liquidación de consumos extras, entrega de llaves y liberación de la habitación a estado LIMPIEZA para camareras. |
| Tipo: | Funcional - Check-out Mostrador |
| Detalles de requisitos y restricciones: | Conmutación automática de la unidad física a estado LIMPIEZA para que no pueda ser reasignada hasta su inspección. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-17 |
| Título: | Directorio y búsqueda ágil de huéspedes frecuentes |
| Texto: | Búsqueda rápida en mostrador por número de cédula o apellido para autocompletar fichas de clientes recurrentes y agilizar recepciones. |
| Tipo: | Funcional - CRM de Huéspedes |
| Detalles de requisitos y restricciones: | Historial de visitas pasadas, preferencias registradas y datos de contacto. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-18 |
| Título: | Control dinámico de cupos por tipo de habitación |
| Texto: | El Revenue Manager abre o cierra cupos por categoría en fechas determinadas para maximizar la ocupación y prevenir sobreventas (overbooking). |
| Tipo: | Funcional - Revenue Management |
| Detalles de requisitos y restricciones: | Para el huésped externo solo se exhiben los cupos disponibles de la categoría comercial. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-19 |
| Título: | Administración analítica de tarifas base por Revenue |
| Texto: | El Revenue Manager define las tarifas base por noche en USD de cada tipo de habitación, márgenes por aforo adicional y recargos por planes comerciales. |
| Tipo: | Funcional - Fijación de Tarifas |
| Detalles de requisitos y restricciones: | Precios determinados por análisis comercial y estrategia de ocupación del establecimiento. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-20 |
| Título: | Configuración de temporadas y planes de descuento/recargo |
| Texto: | Creación y calendarización de temporadas (Alta, Baja, Regular) con multiplicadores de tarifa y definición de planes tarifarios asociados a cada categoría. |
| Tipo: | Funcional - Pricing Estratégico |
| Detalles de requisitos y restricciones: | Ajuste automático de la matriz de precios por categoría comercial y rango de fechas. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-21 |
| Título: | Conmutador rápido de emergencia - IVA al 8% por Decreto Presidencial |
| Texto: | Interruptor ágil de 1 solo clic ('Activar Régimen Feriado IVA 8% por Decreto') para aplicar inmediatamente el 8% de IVA ante Decretos Presidenciales emitidos de un día para otro. |
| Tipo: | Funcional - Régimen Tributario Dinámico |
| Detalles de requisitos y restricciones: | Ajusta en tiempo real cotizaciones web, comprobantes de pago y vouchers de reserva. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-22 |
| Título: | Procesamiento de pagos digitales locales (PayPhone / Kushki) |
| Texto: | Procesamiento de cobros directos en USD mediante tarjetas de crédito/débito locales e internacionales integradas vía API/Webhooks. |
| Tipo: | Funcional - Pasarelas de Pago |
| Detalles de requisitos y restricciones: | Confirmación criptográfica del abono a la cuenta del hotel sin almacenar datos sensibles de tarjetas. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-23 |
| Título: | Cobro inmediato con transferencias directas y QR (DeUna) |
| Texto: | Integración con la pasarela DeUna de Banco Pichincha para cobro instantáneo mediante lectura de código QR y confirmación bancaria inmediata. |
| Tipo: | Funcional - Pagos con Código QR |
| Detalles de requisitos y restricciones: | Generación dinámica del QR en la pantalla del motor web y en el mostrador de recepción. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-24 |
| Título: | Conciliación automática de reservas vía webhooks |
| Texto: | Recepción de webhooks autenticados de las pasarelas que actualiza el estado de la reserva a CONFIRMADA y el saldo pendiente sin intervención manual. |
| Tipo: | Funcional - Conciliación Financiera |
| Detalles de requisitos y restricciones: | Notificación automática al huésped y al recepcionista tras el éxito de la transacción. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-25 |
| Título: | Configuración de Tasa de Servicio del 10% por Hotel |
| Texto: | Conmutador independiente por establecimiento para activar o desactivar el cobro de la tasa del 10% de propina legal (Art. 41 Ley de Turismo) en la cotización de estancia. |
| Tipo: | Funcional - Parámetros Comerciales |
| Detalles de requisitos y restricciones: | Permite que hostales operen sin recargo y hoteles de mayor gama apliquen el 10% reglamentario. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-26 |
| Título: | CRUD de Hoteles y Catastro Cantonal de Manta (116 Establecimientos) |
| Texto: | Superadmin gestiona altas, consultas con filtros por las 7 parroquias oficiales (Manta, Los Esteros, Tarqui, Santa Marianita, San Lorenzo, San Mateo y Eloy Alfaro), edición y estado operativo de los 116 alojamientos catastrados. |
| Tipo: | Funcional - Catastro Cantonal |
| Detalles de requisitos y restricciones: | Georreferenciación 100% verificada en tierra firme; clasificación oficial por modalidades (Hotel, Hostal, Hostería) y estrellas. |
| Fecha de revisión y versión: | Noviembre 2026 Versión 5.0 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-27 |
| Título: | CRUD de Tipos de Hotel y Categorías por Estrellas |
| Texto: | El Superadmin administra catálogos maestros de modalidades (Hostal, Hotel, Hostería) y categorías oficiales de 1 a 5 estrellas. |
| Tipo: | Funcional - Catálogos Normativos |
| Detalles de requisitos y restricciones: | Normalización cantonal de estándares turísticos según regulaciones del Ministerio de Turismo. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Media |

|  |  |
| --- | --- |
| Número: | RF-28 |
| Título: | CRUD de Roles del Sistema (RBAC) y Usuarios |
| Texto: | Superadmin y Admin Hotel gestionan usuarios vinculándolos obligatoriamente a un id\_hotel y un id\_rol. Contraseñas con BCrypt/Argon2 y bloqueo por cese laboral. |
| Tipo: | Funcional - Seguridad y RBAC |
| Detalles de requisitos y restricciones: | Aislamiento de sesiones y permisos estrictos por módulo para recepcionistas y revenue managers. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-29 |
| Título: | CRUD de Tipos de Habitación e Inventario Físico |
| Texto: | Admin Hotel y Revenue administran categorías comerciales y unidades físicas numeradas (número ej. 101, piso, estados: Disponible, Ocupada, Limpieza). |
| Tipo: | Funcional - Inventario de Habitaciones |
| Detalles de requisitos y restricciones: | Asignación de fotos HD, metraje, camas, vistas y control operativo de limpieza diaria. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

|  |  |
| --- | --- |
| Número: | RF-30 |
| Título: | Mensajería transaccional y supervisión cantonal de ocupación |
| Texto: | Despacho automatizado de comprobantes y vouchers con QR vía WhatsApp y correo, auditoría de accesos LOPDP y tablero agregado de ocupación turística cantonal. |
| Tipo: | Funcional - Gobernanza y Notificaciones |
| Detalles de requisitos y restricciones: | Métricas consolidadas de demanda hotelera en Manta y bitácora inalterable de auditoría. |
| Fecha de revisión y versión: | Octubre 2026 Versión 3.3 |
| Prioridad: | Alta |

## No funcionales

|  |  |
| --- | --- |
| *Número:* | RN-1 |
| *Título:* | Rendimiento y tiempo de respuesta en cotizaciones dinámicas |
| *Texto:* | La consulta de disponibilidad y cálculo de tarifas con desglose de impuestos debe responder en menos de 1.0 segundo bajo condiciones estándar de conexión de banda ancha. |
| *Tipo:* | No Funcional - Rendimiento |
| *Detalles de requisitos y restricciones:* | Optimización de consultas SQL, indexación por fechas y aforo, y caché en memoria para tipos de habitación. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-01 (Tiempo de Respuesta en Cotizaciones Dinámicas):** La consulta de disponibilidad y cálculo de tarifas con desglose de impuestos debe responder en menos de 1.0 segundo bajo condiciones estándar de conexión de banda ancha.

|  |  |
| --- | --- |
| *Número:* | RN-2 |
| *Título:* | Concurrencia y tolerancia a picos en temporadas altas y feriados |
| *Texto:* | Capacidad para soportar al menos 150 usuarios concurrentes simultáneos realizando consultas y reservas durante feriados de Manta (Carnaval, Difuntos, Fiestas del Comercio) sin degradación. |
| *Tipo:* | No Funcional - Escalabilidad |
| *Detalles de requisitos y restricciones:* | Arquitectura desacoplada, balanceo de carga y optimización de conexiones de base de datos. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-02 (Concurrencia en Temporadas Altas y Feriados):** Soporte garantizado para al menos 150 usuarios concurrentes simultáneos realizando consultas y reservas durante festividades y feriados de Manta (Carnaval, Difuntos, Fiestas del Comercio) sin degradación.

|  |  |
| --- | --- |
| *Número:* | RN-3 |
| *Título:* | Usabilidad y eficiencia operativa de mostrador (Front Desk) |
| *Texto:* | El recepcionista debe poder recibir, validar la reserva y ejecutar el check-in o confirmación en un máximo de 2 clics para evitar esperas y aglomeraciones. |
| *Tipo:* | No Funcional - Usabilidad (UX) |
| *Detalles de requisitos y restricciones:* | Diseño optimizado para pantallas de escritorio (1080p) y tablets táctiles de recepción. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

• RNF-03 (Latencia en Generación de Vouchers Digitales): La confirmación de la reserva y generación del voucher digital con código QR debe completarse en menos de 1.5 segundos.

|  |  |
| --- | --- |
| *Número:* | RN-4 |
| *Título:* | Diseño responsivo multidispositivo Mobile-First |
| *Texto:* | La interfaz del portal del huésped debe estar 100% optimizada para dispositivos móviles (smartphones de 360px a 430px de ancho) con controles táctiles amigables. |
| *Tipo:* | No Funcional - Portabilidad y UX |
| *Detalles de requisitos y restricciones:* | Layout responsivo adaptable desde pantallas móviles hasta monitores de alta resolución 4K. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-04 (Usabilidad y Eficiencia Operativa en Recepción):** El recepcionista debe poder recibir, validar la reserva y ejecutar el check-in en mostrador en no más de 2 clics para evitar esperas y aglomeraciones.

|  |  |
| --- | --- |
| *Número:* | RN-5 |
| *Título:* | Seguridad criptográfica en comunicaciones y credenciales |
| *Texto:* | Todas las comunicaciones deben viajar cifradas bajo protocolo HTTPS / TLS 1.3. Las credenciales de usuarios se almacenan con hashing unidireccional robusto (Argon2id o BCrypt con salt criptográfico). |
| *Tipo:* | No Funcional - Seguridad |
| *Detalles de requisitos y restricciones:* | Cifrado en reposo para datos sensibles y protección contra inyecciones SQL y ataques XSS/CSRF. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-05 (Diseño Responsivo Multidispositivo Mobile-First):** Interfaz del huésped 100% responsiva para pantallas móviles (smartphones de 360px a 430px de ancho) y panel operativo diseñado para computadoras de escritorio (1080p) y tablets de mostrador.

|  |  |
| --- | --- |
| *Número:* | RN-6 |
| *Título:* | Tokenización de cobros digitales y cumplimiento PCI-DSS |
| *Texto:* | Los enlaces de cobro para PayPhone/DeUna deben implementarse mediante tokens SHA-256 de un solo uso con expiración temporal. El sistema jamás almacena números de tarjeta (PAN) ni códigos CVV. |
| *Tipo:* | No Funcional - Seguridad Financiera |
| *Detalles de requisitos y restricciones:* | Delegación del procesamiento a pasarelas de pago certificadas bajo estándar PCI-DSS Nivel 1. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-06 (Seguridad Criptográfica y Cifrado en Reposo/Tránsito):** Comunicaciones obligatorias bajo protocolo seguro HTTPS / TLS 1.3, credenciales de usuarios con hashing robusto (Argon2id o BCrypt con salt criptográfico) y cifrado de datos sensibles.

|  |  |
| --- | --- |
| *Número:* | RN-7 |
| *Título:* | Protección de datos personales (LOPDP Ecuador) y retención fiscal |
| *Texto:* | Cumplimiento de la Ley Orgánica de Protección de Datos Personales (LOPDP): consentimiento explícito previo, principio de finalidad estricta para reservas y confirmación de reserva, atención a derechos ARCO y retención legal de 7 años según el Código Tributario. |
| *Tipo:* | No Funcional - Privacidad y Cumplimiento Legal |
| *Detalles de requisitos y restricciones:* | Bitácora inalterable de auditoría para todo acceso a datos de huéspedes y proceso de archivo/anonimización tras el periodo legal. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-07 (Tokenización y Cumplimiento PCI-DSS):** Enlaces de cobro digital implementados con tokens SHA-256 de un solo uso con expiración temporal. El sistema jamás almacena números de tarjeta (PAN) ni códigos de seguridad CVV.

|  |  |
| --- | --- |
| *Número:* | RN-8 |
| *Título:* | Disponibilidad continua y resiliencia de servicio (Uptime) |
| *Texto:* | Nivel de disponibilidad del servicio de al menos 99.5% de tiempo de actividad anual, garantizando continuidad operativa crítica durante fines de semana y feriados turísticos. |
| *Tipo:* | No Funcional - Fiabilidad |
| *Detalles de requisitos y restricciones:* | Tolerancia a fallos, monitoreo de salud del sistema y copias de seguridad automáticas diarias. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

• RNF-08 (Protección de Datos Personales - LOPDP Ecuador): Cumplimiento de la Ley Orgánica de Protección de Datos Personales (LOPDP): consentimiento explícito previo, principio de finalidad estricta para la formalización de la reserva y el registro de hospedaje, atención a derechos ARCO, conservación tributaria por 7 años (Código Tributario) y bitácora inalterable de auditoría.

|  |  |
| --- | --- |
| *Número:* | RN-9 |
| *Título:* | Integridad transaccional ACID y prevención absoluta de Overbooking |
| *Texto:* | El proceso de reserva, bloqueo y asignación de habitaciones debe ejecutarse bajo transacciones atómicas con bloqueo de registros (pessimistic locking / exclusión de rangos) para imposibilitar la sobreventa simultánea. |
| *Tipo:* | No Funcional - Confiabilidad Transaccional |
| *Detalles de requisitos y restricciones:* | Mecanismos de concurrencia a nivel de base de datos relacional para consistencia inmediata de cupos. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-09 (Disponibilidad Continua y Uptime Anual):** Disponibilidad del servicio de al menos 99.5% de tiempo de actividad anual, con alta tolerancia a fallos en fines de semana y feriados turísticos.

|  |  |
| --- | --- |
| *Número:* | RN-10 |
| *Título:* | Aislamiento de datos en arquitectura Multi-Tenant (Row-Level Security) |
| *Texto:* | La persistencia debe garantizar mediante políticas de Row-Level Security (RLS) en el motor de base de datos que ningún establecimiento pueda consultar ni alterar registros o clientes de otro hotel adscrito. |
| *Tipo:* | No Funcional - Confidencialidad y Aislamiento |
| *Detalles de requisitos y restricciones:* | Aislamiento lógico inviolable basado en el discriminador hotel\_id verificado a nivel de motor de base de datos. |
| *Fecha de revisión y versión:* | Octubre 2026 Versión 3.3 |
| *Prioridad:* | Alta |

**• RNF-10 (Integridad Transaccional ACID y Prevención de Overbooking):** Procesamiento de reservas bajo transacciones atómicas con bloqueo de registros (pessimistic locking / exclusión de rangos tsrange) para imposibilitar la doble reserva simultánea de una misma habitación.

### Tamaño y rendimiento

El sistema está dimensionado para dar cobertura a la planta turística formal del cantón Manta (universo oficial de 118 establecimientos: 77 hostales, 40 hoteles y 1 hostería) registrados en el Catastro del Ministerio de Turismo 2026. En términos de rendimiento, el motor de reservas responde cotizaciones y disponibilidad en un tiempo medio inferior a 1.0 segundo. Soporta un volumen de concurrencia simultánea de 150 usuarios en picos de alta demanda (Carnaval, Feriado de Difuntos, Fiestas de Manta) con una utilización optimizada de recursos de memoria y almacenamiento en bases de datos relacionales PostgreSQL / SQL Server.

### Calidad

Conforme a la norma ISO/IEC 25010, la plataforma garantiza un nivel de disponibilidad y continuidad operativa del 99.5% de tiempo de actividad (uptime), reduciendo a cero los tiempos de inactividad no planificados durante asuetos turísticos. Asegura integridad transaccional estricta bajo propiedades ACID en la asignación de cupos de habitaciones para erradicar totalmente el overbooking. La arquitectura es adaptable y portable, permitiendo su despliegue en entornos Windows Server / Linux mediante contenedores Docker y servicios cloud.

### Otros

La arquitectura implementa cumplimiento regulatorio estricto con la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP), incorporando consentimiento explícito, atención al ejercicio de derechos ARCO y conservación de registros de transacciones y auditoría durante el periodo legal obligatorio de 7 años dictaminado por el marco regulatorio vigente. Asimismo, garantiza aislamiento lógico multi-tenant nativo a nivel de capa de datos y middleware, tokenización de cobros digitales bajo estándar PCI-DSS y validación automática de transacciones digitales y emisión de vouchers QR.

# Arquitectura del Producto/Sistema

## Vista de Casos de Uso

### Actores

El sistema articula la interacción de actores humanos (roles del sistema con control de acceso basado en roles - RBAC) y actores externos:

|  |  |
| --- | --- |
| *Número:* | ACT-1 |
| *Actor:* | Administrador del Hotel (Admin Hotel) |
| *Descripción:* | Persona a cargo de la gestión general y tributaria de su establecimiento hotelero en Manta. |
| *Responabilidades:* | Configura datos fiscales del hotel (RUC, establecimiento, punto de emisión), activa o desactiva la tasa del 10% de servicio turístico, administra usuarios internos (recepcionistas y revenue managers) y revisa reportes financieros. |
| *Fuentes:* | Establecimiento Hotelero de Manta |

1. Superadministrador (Superadmin Cantonal): Administra el catastro general de los 118 alojamientos de Manta, tipos de hotel, categorías y roles; supervisa tableros consolidados de ocupación y volumen turístico cantonal; y emite alertas globales (conmutación sugerida de IVA al 8% ante decreto presidencial).
2. Administrador del Hotel (Admin Hotel): Responsable legal y fiscal de su establecimiento; configura RUC, políticas de estancia; activa o desactiva la tasa del 10% de servicio turístico (propina legal Art. 41 Ley Turismo); y crea los usuarios internos (recepcionistas y revenue managers).
3. Encargado de Tarifas y Cupos (Revenue Manager): Controla la apertura/cierre de cupos para evitar sobreventas; administra tarifas base y planes comerciales; ejecuta bloqueos internos por mantenimiento; y activa el Conmutador Rápido de Emergencia de IVA al 8% ante decretos presidenciales de última hora.
4. Recepcionista (Front Desk): Gestiona la bandeja de reservas entrantes en tiempo real con alertas sonoras; registra el Check-in presencial en mostrador (sujeto a disponibilidad física de habitaciones listas); asigna manualmente el número de habitación física concreta; genera enlaces de cobro digital (PayPhone/DeUna) y gestiona los pagos digitales.
5. Huésped / Turista (Usuario Público): Consulta disponibilidad por tipos de habitación en el portal web; cotiza con desglose transparente (IVA 15%/8% + 10% servicio si aplica); reserva con Google OAuth o como invitado (Guest Checkout); y obtiene su voucher digital con código QR.

|  |  |
| --- | --- |
| *Número:* | ACT-2 |
| *Actor:* | Recepcionista (Front Desk) |
| *Descripción:* | Operador en mostrador encargado de la atención presencial y digital de reservas. |
| *Responabilidades:* | Recibe reservas entrantes en tiempo real, verifica huéspedes, confirma estancias, ejecuta check-in y check-out, genera enlaces de cobro digital (PayPhone/DeUna) y gestiona los enlaces de cobro digital. |
| *Fuentes:* | Recepción del Hotel |

Actores Externos del Ecosistema:
• EXT-01: Pasarelas de Pago Digitales (PayPhone / DeUna / Kushki): Procesamiento de transacciones en USD mediante tarjetas de crédito/débito y transferencias directas con código QR, retornando confirmación inmediata de pago.
• EXT-02: Servicio de Notificaciones (WhatsApp API / Email SMTP): Despacho automático de vouchers de confirmación con código QR al huésped y avisos de cobro.

|  |  |
| --- | --- |
| *Número:* | ACT-3 |
| *Actor:* | Encargado de Tarifas (Revenue Manager) |
| *Descripción:* | Especialista comercial encargado de optimizar precios y disponibilidad de habitaciones. |
| *Responabilidades:* | Abre y cierra cupos en el calendario para evitar sobreventas, configura tarifas base, planes comerciales (Rate Plans), temporadas con conmutador IVA 15%/8% y bloqueos por mantenimiento. |
| *Fuentes:* | Dirección Comercial del Hotel |

### Modelo de casos de Uso

### Lista de casos de Uso

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Id** | **Caso de Uso** | **Complejidad** | **Prioridad del cliente** | **Prioridad Técnica** |
| CU-1 | Búsqueda dinámica y cotización de habitaciones por fechas y aforo | Media | Alta | Alta |
| CU-2 | Matriz comparativa de disponibilidad y tipos de habitación | Alta | Alta | Alta |
| CU-3 | Desglose tributario adaptativo y switch del 10% de servicio | Media | Alta | Alta |
| CU-4 | Autenticación flexible del huésped y Guest Checkout | Alta | Alta | Alta |
| CU-5 | Selección de planes de tarifa (Rate Plans) | Media | Alta | Alta |
| CU-6 | Ficha técnica y galería multimedia por tipo de habitación | Alta | Alta | Alta |
| CU-7 | Servicios complementarios de alojamiento (Extras opcionales) | Media | Alta | Alta |
| CU-8 | Geolocalización cantonal y puntos de interés de Manta | Alta | Alta | Alta |
| CU-9 | Comentarios y calificaciones de huéspedes verificados | Media | Alta | Alta |
| CU-10 | Emisión de voucher digital de reserva con código QR | Alta | Alta | Alta |
| CU-11 | Bandeja de reservas entrantes en tiempo real para Front Desk | Media | Alta | Alta |
| CU-12 | Confirmación ágil de reservas entrantes en mostrador | Alta | Alta | Alta |
| CU-13 | Registro de Check-in en mostrador (Sujeto a Disponibilidad Física) | Media | Alta | Alta |
| CU-14 | Asignación manual de habitación física por recepción | Alta | Alta | Alta |
| CU-15 | Generación de enlaces de cobro seguro (PayPhone / DeUna) | Media | Alta | Alta |
| CU-16 | Check-out, balance de cuenta y liberación de habitación | Alta | Alta | Alta |
| CU-17 | Directorio y búsqueda ágil de huéspedes frecuentes | Media | Alta | Alta |
| CU-18 | Control dinámico de cupos por tipo de habitación | Alta | Alta | Alta |
| CU-19 | Administración analítica de tarifas base por Revenue | Media | Alta | Alta |
| CU-20 | Configuración de temporadas y planes de descuento/recargo | Alta | Alta | Alta |
| CU-21 | Conmutador rápido de emergencia - IVA al 8% por Decreto Presidencial | Media | Alta | Alta |
| CU-22 | Procesamiento de pagos digitales locales (PayPhone / Kushki) | Alta | Alta | Alta |
| CU-23 | Cobro inmediato con transferencias directas y QR (DeUna) | Media | Alta | Alta |
| CU-24 | Conciliación automática de reservas vía webhooks | Alta | Alta | Alta |
| CU-25 | Configuración de Tasa de Servicio del 10% por Hotel | Media | Alta | Alta |
| CU-26 | CRUD de Hoteles y Catastro de Manta (118 Establecimientos) | Alta | Alta | Alta |
| CU-27 | CRUD de Tipos de Hotel y Categorías por Estrellas | Media | Alta | Alta |
| CU-28 | CRUD de Roles del Sistema (RBAC) y Usuarios | Alta | Alta | Alta |
| CU-29 | CRUD de Tipos de Habitación e Inventario Físico | Media | Alta | Alta |
| CU-30 | Mensajería transaccional y supervisión cantonal de ocupación | Alta | Alta | Alta |

### Descripción de los Casos de Uso

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-1 | NOMBRE: Búsqueda dinámica y cotización de habitaciones por fechas y aforo | | IDENTIFICADOR: CU-1 | NOMBRE: Búsqueda dinámica y cotización de habitaciones por fechas y aforo | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-1 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  CU- ac | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta búsqueda dinámica y cotización de habitaciones por fechas y aforo conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-1 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de búsqueda interactiva de habitaciones por fechas y aforo se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-1.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente búsqueda dinámica y cotización de habitaciones por fechas y aforo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-1.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente búsqueda dinámica y cotización de habitaciones por fechas y aforo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-1.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente búsqueda dinámica y cotización de habitaciones por fechas y aforo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-2 | NOMBRE: Matriz comparativa de disponibilidad y tipos de habitación | | IDENTIFICADOR: CU-2 | NOMBRE: Matriz comparativa de disponibilidad y tipos de habitación | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-2 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  CU- | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta matriz comparativa de disponibilidad y tipos de habitación conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-2 se valida mediante permisos del rol correspondiente y reglas de negocio y políticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de matriz interactiva de disponibilidad y habitaciones se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-2.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente matriz comparativa de disponibilidad y tipos de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-2.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente matriz comparativa de disponibilidad y tipos de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-2.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente matriz comparativa de disponibilidad y tipos de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-3 | NOMBRE: Desglose tributario adaptativo y switch del 10% de servicio | | IDENTIFICADOR: CU-3 | NOMBRE: Desglose tributario adaptativo y switch del 10% de servicio | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-3 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-: | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta desglose tributario adaptativo y switch del 10% de servicio conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-3 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIN: La operacin de desglose de tarifa transparente (Base + IVA 15%/8% + 10% de Servicio si aplica) se completa con xito y muestra el total en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-3.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente desglose tributario adaptativo y switch del 10% de servicio. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-3.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente desglose tributario adaptativo y switch del 10% de servicio. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-3.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente desglose tributario adaptativo y switch del 10% de servicio. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-4 | NOMBRE: Autenticación flexible del huésped y Guest Checkout | | IDENTIFICADOR: CU-4 | NOMBRE: Autenticación flexible del huésped y Guest Checkout | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alto |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-4 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-1, CU-3, CU-5 | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta autenticación flexible del huésped y guest checkout conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-4 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de autenticación de huésped y reserva como invitado se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-4.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente autenticación flexible del huésped y guest checkout. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-4.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente autenticación flexible del huésped y guest checkout. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-4.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente autenticación flexible del huésped y guest checkout. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-5 | NOMBRE: Selección de planes de tarifa (Rate Plans) | | IDENTIFICADOR: CU-5 | NOMBRE: Selección de planes de tarifa (Rate Plans) | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-5 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-4 | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta selección de planes de tarifa (rate plans) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-5 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de selección de paquetes de reserva y rate plans se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-5.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente selección de planes de tarifa (rate plans). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-5.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente selección de planes de tarifa (rate plans). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-5.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente selección de planes de tarifa (rate plans). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-6 | NOMBRE: Ficha técnica y galería multimedia por tipo de habitación | | IDENTIFICADOR: CU-6 | NOMBRE: Ficha técnica y galería multimedia por tipo de habitación | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-6 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  No Aplica | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta ficha técnica y galería multimedia por tipo de habitación conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-6 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de ficha técnica y galería multimedia por habitación se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-6.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente ficha técnica y galería multimedia por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-6.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente ficha técnica y galería multimedia por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-6.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente ficha técnica y galería multimedia por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-7 | NOMBRE: Servicios complementarios de alojamiento (Extras opcionales) | | IDENTIFICADOR: CU-7 | NOMBRE: Servicios complementarios de alojamiento (Extras opcionales) | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Baja |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-7 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  No aplica | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta servicios complementarios de alojamiento (extras opcionales) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-7 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de selección de servicios agregados y adicionales (add-ons) se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-7.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente servicios complementarios de alojamiento (extras opcionales). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-7.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente servicios complementarios de alojamiento (extras opcionales). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-7.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente servicios complementarios de alojamiento (extras opcionales). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-8 | NOMBRE: Geolocalización cantonal y puntos de interés de Manta | | IDENTIFICADOR: CU-8 | NOMBRE: Geolocalización cantonal y puntos de interés de Manta | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Baja |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-8 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  No Aplica | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta geolocalización cantonal y puntos de interés de manta conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-8 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de geolocalización y mapa interactivo de manta se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-8.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente geolocalización cantonal y puntos de interés de manta. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-8.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente geolocalización cantonal y puntos de interés de manta. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-8.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente geolocalización cantonal y puntos de interés de manta. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-9 | NOMBRE: Comentarios y calificaciones de huéspedes verificados | | IDENTIFICADOR: CU-9 | NOMBRE: Comentarios y calificaciones de huéspedes verificados | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-9 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  No Aplica | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta comentarios y calificaciones de huéspedes verificados conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-9 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de comentarios y calificaciones de huéspedes verificados se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-9.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente comentarios y calificaciones de huéspedes verificados. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-9.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente comentarios y calificaciones de huéspedes verificados. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-9.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente comentarios y calificaciones de huéspedes verificados. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-10 | NOMBRE: Emisión de voucher digital de reserva con código QR | | IDENTIFICADOR: CU-10 | NOMBRE: Emisión de voucher digital de reserva con código QR | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Baja |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-10 | | | |
| ACTORES: Huésped / Turista | | | |
| **CASOS DE USO ASOCIADOS:**  No Aplica | | | |
| DESCRIPCIÓN: El actor Huésped / Turista ejecuta emisión de voucher digital de reserva con código qr conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-10 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de emisión de voucher digital con código qr único se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-10.1 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente emisión de voucher digital de reserva con código qr. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-10.2 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente emisión de voucher digital de reserva con código qr. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-10.3 | DESCRIPCIÓN: Huésped / Turista completa satisfactoriamente emisión de voucher digital de reserva con código qr. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-11 | NOMBRE: Bandeja de reservas entrantes en tiempo real para Front Desk | | IDENTIFICADOR: CU-11 | NOMBRE: Bandeja de reservas entrantes en tiempo real para Front Desk | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Baja |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-11 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  No Aplica | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta bandeja de reservas entrantes en tiempo real para front desk conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-11 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de bandeja de reservas entrantes en tiempo real para recepción se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-11.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente bandeja de reservas entrantes en tiempo real para front desk. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-11.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente bandeja de reservas entrantes en tiempo real para front desk. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-11.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente bandeja de reservas entrantes en tiempo real para front desk. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-12 | NOMBRE: Confirmación ágil de reservas entrantes en mostrador | | IDENTIFICADOR: CU-12 | NOMBRE: Confirmación ágil de reservas entrantes en mostrador | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-12 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-1, CU-5, CU-4 | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta confirmación ágil de reservas entrantes en mostrador conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-12 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de confirmación y apertura de detalle de reserva recibida se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-12.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente confirmación ágil de reservas entrantes en mostrador. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-12.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente confirmación ágil de reservas entrantes en mostrador. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-12.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente confirmación ágil de reservas entrantes en mostrador. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-13 | NOMBRE: Registro de Check-in en mostrador (Sujeto a Disponibilidad Física) | | IDENTIFICADOR: CU-13 | NOMBRE: Registro de Check-in en mostrador (Sujeto a Disponibilidad Física) | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-13 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-3 | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta registro de check-in en mostrador (sujeto a disponibilidad física) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-13 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de check-in express y registro de identidad de huéspedes se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-13.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente registro de check-in en mostrador (sujeto a disponibilidad física). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-13.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente registro de check-in en mostrador (sujeto a disponibilidad física). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-13.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente registro de check-in en mostrador (sujeto a disponibilidad física). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-14 | NOMBRE: Asignación manual de habitación física por recepción | | IDENTIFICADOR: CU-14 | NOMBRE: Asignación manual de habitación física por recepción | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-14 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-1 | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta asignación manual de habitación física por recepción conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-14 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de generación de enlaces de cobro seguro (payphone/deuna) se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-14.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente asignación manual de habitación física por recepción. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-14.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente asignación manual de habitación física por recepción. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-14.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente asignación manual de habitación física por recepción. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-15 | NOMBRE: Generación de enlaces de cobro seguro (PayPhone / DeUna) | | IDENTIFICADOR: CU-15 | NOMBRE: Generación de enlaces de cobro seguro (PayPhone / DeUna) | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-15 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-2 | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta generación de enlaces de cobro seguro (payphone / deuna) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-15 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de check-out y liquidación final de la reserva se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-15.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente generación de enlaces de cobro seguro (payphone / deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-15.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente generación de enlaces de cobro seguro (payphone / deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-15.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente generación de enlaces de cobro seguro (payphone / deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-16 | NOMBRE: Check-out, balance de cuenta y liberación de habitación | | IDENTIFICADOR: CU-16 | NOMBRE: Check-out, balance de cuenta y liberación de habitación | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-16 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU- 3 | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta check-out, balance de cuenta y liberación de habitación conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-16 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de directorio histórico de huéspedes frecuentes se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-16.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente check-out, balance de cuenta y liberación de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-16.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente check-out, balance de cuenta y liberación de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-16.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente check-out, balance de cuenta y liberación de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-17 | NOMBRE: Directorio y búsqueda ágil de huéspedes frecuentes | | IDENTIFICADOR: CU-17 | NOMBRE: Directorio y búsqueda ágil de huéspedes frecuentes | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-17 | | | |
| ACTORES: Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-: | | | |
| DESCRIPCIÓN: El actor Recepcionista ejecuta directorio y búsqueda ágil de huéspedes frecuentes conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-17 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de control de disponibilidad y cupos por fecha (revenue) se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-17.1 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente directorio y búsqueda ágil de huéspedes frecuentes. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-17.2 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente directorio y búsqueda ágil de huéspedes frecuentes. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-17.3 | DESCRIPCIÓN: Recepcionista completa satisfactoriamente directorio y búsqueda ágil de huéspedes frecuentes. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-18 | NOMBRE: Control dinámico de cupos por tipo de habitación | | IDENTIFICADOR: CU-18 | NOMBRE: Control dinámico de cupos por tipo de habitación | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-18 | | | |
| ACTORES: Revenue Manager | | | |
| **CASOS DE USO ASOCIADOS:**  CU-18 | | | |
| DESCRIPCIÓN: El actor Revenue Manager ejecuta control dinámico de cupos por tipo de habitación conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-18 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de configuración de planes de tarifa (rate plans) se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-18.1 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente control dinámico de cupos por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-18.2 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente control dinámico de cupos por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-18.3 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente control dinámico de cupos por tipo de habitación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-19 | NOMBRE: Administración analítica de tarifas base por Revenue | | IDENTIFICADOR: CU-19 | NOMBRE: Administración analítica de tarifas base por Revenue | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-19 | | | |
| ACTORES: Revenue Manager | | | |
| **CASOS DE USO ASOCIADOS:**  CU-: | | | |
| DESCRIPCIÓN: El actor Revenue Manager ejecuta administración analítica de tarifas base por revenue conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-19 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de gestión de catálogo, fotos y metraje de habitaciones se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-19.1 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente administración analítica de tarifas base por revenue. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-19.2 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente administración analítica de tarifas base por revenue. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-19.3 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente administración analítica de tarifas base por revenue. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-20 | NOMBRE: Configuración de temporadas y planes de descuento/recargo | | IDENTIFICADOR: CU-20 | NOMBRE: Configuración de temporadas y planes de descuento/recargo | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-20 | | | |
| ACTORES: Revenue Manager | | | |
| **CASOS DE USO ASOCIADOS:**  CU-: | | | |
| DESCRIPCIÓN: El actor Revenue Manager ejecuta configuración de temporadas y planes de descuento/recargo conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-20 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de catálogo de servicios extras y adicionales se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-20.1 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente configuración de temporadas y planes de descuento/recargo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-20.2 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente configuración de temporadas y planes de descuento/recargo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-20.3 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente configuración de temporadas y planes de descuento/recargo. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-21 | NOMBRE: Conmutador rápido de emergencia - IVA al 8% por Decreto Presidencial | | IDENTIFICADOR: CU-21 | NOMBRE: Conmutador rápido de emergencia - IVA al 8% por Decreto Presidencial | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-21 | | | |
| ACTORES: Revenue Manager | | | |
| **CASOS DE USO ASOCIADOS:**  CU-1, CU-2, CU-3, CU-6 | | | |
| DESCRIPCIÓN: El actor Revenue Manager ejecuta conmutador rápido de emergencia - iva al 8% por decreto presidencial conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-21 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de conmutador rápido de temporadas e iva 15% / 8% se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-21.1 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente conmutador rápido de emergencia - iva al 8% por decreto presidencial. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-21.2 | DESCRIPCIÓN: Revenue Manager completa satisfactoriamente conmutador rápido de emergencia - iva al 8% por decreto presidencial. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-22 | NOMBRE: Procesamiento de pagos digitales locales (PayPhone / Kushki) | | IDENTIFICADOR: CU-22 | NOMBRE: Procesamiento de pagos digitales locales (PayPhone / Kushki) | |
| **COMPLEJIDAD:** Baja | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-22 | | | |
| ACTORES: Huésped / Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-11. | | | |
| DESCRIPCIÓN: El actor Huésped / Recepcionista ejecuta procesamiento de pagos digitales locales (payphone / kushki) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-22 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de generación matemática de token seguro de confirmación se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-22.1 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente procesamiento de pagos digitales locales (payphone / kushki). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-22.2 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente procesamiento de pagos digitales locales (payphone / kushki). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-22.3 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente procesamiento de pagos digitales locales (payphone / kushki). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-23 | NOMBRE: Cobro inmediato con transferencias directas y QR (DeUna) | | IDENTIFICADOR: CU-23 | NOMBRE: Cobro inmediato con transferencias directas y QR (DeUna) | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-23 | | | |
| ACTORES: Huésped / Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-22 | | | |
| DESCRIPCIÓN: El actor Huésped / Recepcionista ejecuta cobro inmediato con transferencias directas y qr (deuna) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-23 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIN: La operacin de cobro directo mediante cdigo QR y dbito bancario DeUna se completa con xito y emite el comprobante de pago digital en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-23.1 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente cobro inmediato con transferencias directas y qr (deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-23.2 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente cobro inmediato con transferencias directas y qr (deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-23.3 | DESCRIPCIÓN: Huésped / Recepcionista completa satisfactoriamente cobro inmediato con transferencias directas y qr (deuna). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-24 | NOMBRE: Conciliación automática de reservas vía webhooks | | IDENTIFICADOR: CU-24 | NOMBRE: Conciliación automática de reservas vía webhooks | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Media |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-24 | | | |
| ACTORES: Sistema / Pasarela | | | |
| **CASOS DE USO ASOCIADOS:**  CU-18 | | | |
| DESCRIPCIÓN: El actor Sistema / Pasarela ejecuta conciliación automática de reservas vía webhooks conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-24 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIN: La operacin de conciliacin automtica de reservas va webhooks de pasarela se completa con xito y actualiza el saldo de la reserva en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-24.1 | DESCRIPCIÓN: Sistema / Pasarela completa satisfactoriamente conciliación automática de reservas vía webhooks. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-24.2 | DESCRIPCIÓN: Sistema / Pasarela completa satisfactoriamente conciliación automática de reservas vía webhooks. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-24.3 | DESCRIPCIÓN: Sistema / Pasarela completa satisfactoriamente conciliación automática de reservas vía webhooks. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-25 | NOMBRE: Configuración de Tasa de Servicio del 10% por Hotel | | IDENTIFICADOR: CU-25 | NOMBRE: Configuración de Tasa de Servicio del 10% por Hotel | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-25 | | | |
| ACTORES: Admin Hotel | | | |
| **CASOS DE USO ASOCIADOS:**  CU-22, CU-23, CU-30. | | | |
| DESCRIPCIÓN: El actor Admin Hotel ejecuta configuración de tasa de servicio del 10% por hotel conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-25 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de configuración de tasa de servicio del 10% por hotel se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-25.1 | DESCRIPCIÓN: Admin Hotel completa satisfactoriamente configuración de tasa de servicio del 10% por hotel. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-25.2 | DESCRIPCIÓN: Admin Hotel completa satisfactoriamente configuración de tasa de servicio del 10% por hotel. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-25.3 | DESCRIPCIÓN: Admin Hotel completa satisfactoriamente configuración de tasa de servicio del 10% por hotel. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-26 | NOMBRE: CRUD de Hoteles y Catastro de Manta (118 Establecimientos) | | IDENTIFICADOR: CU-26 | NOMBRE: CRUD de Hoteles y Catastro de Manta (118 Establecimientos) | |
| **COMPLEJIDAD: Baja** | | | **PRIORIDAD: Media** |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-26 | | | |
| ACTORES: Superadmin Cantonal | | | |
| **CASOS DE USO ASOCIADOS:**  CU-21 | | | |
| DESCRIPCIÓN: El actor Superadmin Cantonal ejecuta crud de hoteles y catastro de manta (118 establecimientos) conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-26 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de configuración comercial del establecimiento se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-26.1 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de hoteles y catastro de manta (118 establecimientos). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-26.2 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de hoteles y catastro de manta (118 establecimientos). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-26.3 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de hoteles y catastro de manta (118 establecimientos). RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-27 | NOMBRE: CRUD de Tipos de Hotel y Categorías por Estrellas | | IDENTIFICADOR: CU-27 | NOMBRE: CRUD de Tipos de Hotel y Categorías por Estrellas | |
| **COMPLEJIDAD: Alta** | | | **PRIORIDAD: Media** |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-27 | | | |
| ACTORES: Superadmin Cantonal | | | |
| **CASOS DE USO ASOCIADOS:**  CU-12, CU-14, CU-15 | | | |
| DESCRIPCIÓN: El actor Superadmin Cantonal ejecuta crud de tipos de hotel y categorías por estrellas conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-27 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de control de pasarelas y métodos de cobro locales se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-27.1 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de tipos de hotel y categorías por estrellas. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-27.2 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de tipos de hotel y categorías por estrellas. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-27.3 | DESCRIPCIÓN: Superadmin Cantonal completa satisfactoriamente crud de tipos de hotel y categorías por estrellas. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-28 | NOMBRE: CRUD de Roles del Sistema (RBAC) y Usuarios | | IDENTIFICADOR: CU-28 | NOMBRE: CRUD de Roles del Sistema (RBAC) y Usuarios | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD: Media** |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-28 | | | |
| ACTORES: Superadmin / Admin Hotel | | | |
| **CASOS DE USO ASOCIADOS:**  CU-20, CU-26 | | | |
| DESCRIPCIÓN: El actor Superadmin / Admin Hotel ejecuta crud de roles del sistema (rbac) y usuarios conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-28 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIN: La administracin de roles RBAC y asignacin de usuarios del hotel se completa con xito y registra los cambios en la bitcora de auditora en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-28.1 | DESCRIPCIÓN: Superadmin / Admin Hotel completa satisfactoriamente crud de roles del sistema (rbac) y usuarios. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-28.2 | DESCRIPCIÓN: Superadmin / Admin Hotel completa satisfactoriamente crud de roles del sistema (rbac) y usuarios. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-28.3 | DESCRIPCIÓN: Superadmin / Admin Hotel completa satisfactoriamente crud de roles del sistema (rbac) y usuarios. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-29 | NOMBRE: CRUD de Tipos de Habitación e Inventario Físico | | IDENTIFICADOR: CU-29 | NOMBRE: CRUD de Tipos de Habitación e Inventario Físico | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD: Media** |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-29 | | | |
| ACTORES: Admin Hotel / Revenue | | | |
| **CASOS DE USO ASOCIADOS:**  CU-18, CU-21 | | | |
| DESCRIPCIÓN: El actor Admin Hotel / Revenue ejecuta crud de tipos de habitación e inventario físico conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-29 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de aislamiento multi-tenant estricto por hotel se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-29.1 | DESCRIPCIÓN: Admin Hotel / Revenue completa satisfactoriamente crud de tipos de habitación e inventario físico. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-29.2 | DESCRIPCIÓN: Admin Hotel / Revenue completa satisfactoriamente crud de tipos de habitación e inventario físico. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-29.3 | DESCRIPCIÓN: Admin Hotel / Revenue completa satisfactoriamente crud de tipos de habitación e inventario físico. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| IDENTIFICADOR: CU-30 | NOMBRE: Mensajería transaccional y supervisión cantonal de ocupación | | IDENTIFICADOR: CU-30 | NOMBRE: Mensajería transaccional y supervisión cantonal de ocupación | |
| **COMPLEJIDAD:** Media | | | **PRIORIDAD:** Alta |
| REQUERIMIENTO FUNCIONAL ASOCIADO: RF-30 | | | |
| ACTORES: Superadmin / Recepcionista | | | |
| **CASOS DE USO ASOCIADOS:**  CU-21, CU-26, CU-28 | | | |
| DESCRIPCIÓN: El actor Superadmin / Recepcionista ejecuta mensajería transaccional y supervisión cantonal de ocupación conforme al flujo de reservas y alojamiento hotelero. | | | |
| NOTAS: La ejecución de CU-30 se valida mediante permisos del rol correspondiente y reglas de negocio y polticas del establecimiento hotelero. | | | |
| CRITERIOS DE ACEPTACIÓN: La operación de gestión de usuarios y accesos del personal del hotel se completa con éxito y actualiza el estado en tiempo real. | | | |
| **ESCENARIOS:** | | | |
| ES-30.1 | DESCRIPCIÓN: Superadmin / Recepcionista completa satisfactoriamente mensajería transaccional y supervisión cantonal de ocupación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-30.2 | DESCRIPCIÓN: Superadmin / Recepcionista completa satisfactoriamente mensajería transaccional y supervisión cantonal de ocupación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| ES-30.3 | DESCRIPCIÓN: Superadmin / Recepcionista completa satisfactoriamente mensajería transaccional y supervisión cantonal de ocupación. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite confirmación inmediata. | | |
| RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red. | | | |

## Vista Funcional

### Modelo de Análisis

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-1 |
| ***Descripción:*** | Búsqueda exitosa de habitaciones por fechas y aforo |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente búsqueda exitosa de habitaciones por fechas y aforo a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-1* |
| ***Esc. Asociados:*** | *ES-1.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-2 |
| ***Descripción:*** | Consulta exitosa de matriz de disponibilidad y tarifas |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente consulta exitosa de matriz de disponibilidad y tarifas a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-2* |
| ***Esc. Asociados:*** | *ES-2.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-3 |
| ***Descripción:*** | Desglose tarifario transparente (Base + IVA + 10% Servicio si aplica) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente desglose tarifario transparente (base + iva + 10% servicio si aplica) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-3* |
| ***Esc. Asociados:*** | *ES-3.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-4 |
| ***Descripción:*** | Registro y autenticación de huésped (OAuth o Guest Checkout) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente registro y autenticación de huésped (oauth o guest checkout) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-4* |
| ***Esc. Asociados:*** | *ES-4.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-5 |
| ***Descripción:*** | Selección de planes de tarifa comercial (Rate Plans) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente selección de planes de tarifa comercial (rate plans) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-5* |
| ***Esc. Asociados:*** | *ES-5.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-6 |
| ***Descripción:*** | Visualización de ficha técnica y galería HD de habitación |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente visualización de ficha técnica y galería hd de habitación a través de la plataforma hotelera. |
| ***CU asociados:*** | *No aplica* |
| ***Esc. Asociados:*** | *ES-6.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-7 |
| ***Descripción:*** | Selección de servicios adicionales (traslados, late check-out, tours) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente selección de servicios adicionales (traslados, late check-out, tours) a través de la plataforma hotelera. |
| ***CU asociados:*** | *No aplica* |
| ***Esc. Asociados:*** | *ES-7.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-8 |
| ***Descripción:*** | Geolocalización del hotel y cálculo de distancias en Manta |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente geolocalización del hotel y cálculo de distancias en manta a través de la plataforma hotelera. |
| ***CU asociados:*** | *No aplica* |
| ***Esc. Asociados:*** | *ES-8.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-9 |
| ***Descripción:*** | Publicación y consulta de opiniones de huéspedes verificados |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente publicación y consulta de opiniones de huéspedes verificados a través de la plataforma hotelera. |
| ***CU asociados:*** | *No aplica* |
| ***Esc. Asociados:*** | *ES-9.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-10 |
| ***Descripción:*** | Generación y descarga de voucher digital con código QR |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente generación y descarga de voucher digital con código qr a través de la plataforma hotelera. |
| ***CU asociados:*** | *No aplica.* |
| ***Esc. Asociados:*** | *ES-10.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-11 |
| ***Descripción:*** | Recepción de nueva reserva entrante en tiempo real |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente recepción de nueva reserva entrante en tiempo real a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-11* |
| ***Esc. Asociados:*** | *ES-11.1* |

![](data:image/jpeg;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-12 |
| ***Descripción:*** | Confirmación y apertura de detalle de reserva por recepcionista |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente confirmación y apertura de detalle de reserva por recepcionista a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-12* |
| ***Esc. Asociados:*** | *ES-12.3* |

![](data:image/jpeg;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-13 |
| ***Descripción:*** | Ejecución exitosa de check-in express y registro de huéspedes |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente ejecución exitosa de check-in express y registro de huéspedes a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-13* |
| ***Esc. Asociados:*** | *ES-13.1* |

![](data:image/jpeg;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-14 |
| ***Descripción:*** | Generación y envío de enlace de cobro seguro (PayPhone/DeUna) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente generación y envío de enlace de cobro seguro (payphone/deuna) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-14* |
| ***Esc. Asociados:*** | *ES-14.1* |

![](data:image/jpeg;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-15 |
| ***Descripción:*** | Check-out exitoso, cierre de estancia y liberación de habitación |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente check-out exitoso, cierre de estancia y liberación de habitación a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-15* |
| ***Esc. Asociados:*** | *ES-15.1* |

![](data:image/jpeg;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-16 |
| ***Descripción:*** | Consulta del directorio de huéspedes frecuentes |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente consulta del directorio de huéspedes frecuentes a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-16* |
| ***Esc. Asociados:*** | *ES-16.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-17 |
| ***Descripción:*** | Apertura y cierre de cupos en el calendario de Revenue |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente apertura y cierre de cupos en el calendario de revenue a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-17* |
| ***Esc. Asociados:*** | *ES-17.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-18 |
| ***Descripción:*** | Configuración de paquetes de tarifa y políticas de cancelación |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente configuración de paquetes de tarifa y políticas de cancelación a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-18* |
| ***Esc. Asociados:*** | *ES-18.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-19 |
| ***Descripción:*** | Gestión de catálogo, fotos y metraje de habitaciones |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente gestión de catálogo, fotos y metraje de habitaciones a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-19* |
| ***Esc. Asociados:*** | *ES-19.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-20 |
| ***Descripción:*** | Administración del catálogo de servicios adicionales (add-ons) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente administración del catálogo de servicios adicionales (add-ons) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-20* |
| ***Esc. Asociados:*** | *ES-20.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-21 |
| ***Descripción:*** | Conmutación de temporadas y alternancia de IVA (15% u 8%) |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente conmutación de temporadas y alternancia de iva (15% u 8%) a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-1, CU-2, CU-3, CU-6* |
| ***Esc. Asociados:*** | *ES-21.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-22 |
| ***Descripción:*** | Procesamiento de pagos digitales con pasarela PayPhone |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente el pago digital mediante tarjeta con confirmación instantánea vía webhook. |
| ***CU asociados:*** | *CU-11* |
| ***Esc. Asociados:*** | *ES-22.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-23 |
| ***Descripción:*** | Cobro directo e instantáneo con código QR DeUna |
| ***Reqs. asociados:*** | El actor realiza el cobro mediante lectura de código QR dinámico de Banco Pichincha con acreditación inmediata. |
| ***CU asociados:*** | *CU-22* |
| ***Esc. Asociados:*** | *ES-23.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-24 |
| ***Descripción:*** | Conciliacin automtica y actualizacin de saldo de reserva va Webhooks |
| ***Reqs. asociados:*** | El sistema concilia asncronamente el cobro digital recibido desde la pasarela (PayPhone/DeUna) y actualiza el saldo de la reserva a confirmado. |
| ***CU asociados:*** | *CU-18* |
| ***Esc. Asociados:*** | *ES-24.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-25 |
| ***Descripción:*** | Activación o desactivación de la tasa del 10% de servicio por hotel |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente activación o desactivación de la tasa del 10% de servicio por hotel a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-22, CU-23, CU-30.* |
| ***Esc. Asociados:*** | *ES-25.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-26 |
| ***Descripción:*** | Configuración de parámetros comerciales y tasa de servicio del hotel |
| ***Reqs. asociados:*** | El actor configura los datos comerciales del establecimiento y conmuta la tasa del 10% de servicio turístico. |
| ***CU asociados:*** | *CU-21* |
| ***Esc. Asociados:*** | *ES-26.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-27 |
| ***Descripción:*** | Configuración de pasarelas de pago y cuentas bancarias locales |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente configuración de pasarelas de pago y cuentas bancarias locales a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-12, CU-14 y CU-15* |
| ***Esc. Asociados:*** | *ES-27.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-28 |
| ***Descripción:*** | Supervisin y gestin de estado operativo de habitaciones (Disponible, Ocupada, Limpieza) |
| ***Reqs. asociados:*** | El actor consulta y actualiza el estado operativo de limpieza de las unidades fsicas para liberarlas a recepcin. |
| ***CU asociados:*** | CU-20 y CU-29 |
| ***Esc. Asociados:*** | *ES-28.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-29 |
| ***Descripción:*** | Aislamiento multi-tenant entre establecimientos hoteleros |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente aislamiento multi-tenant entre establecimientos hoteleros a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-18 y CU-21* |
| ***Esc. Asociados:*** | *ES-29.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | DG-30 |
| ***Descripción:*** | Creación y asignación de roles a usuarios del hotel |
| ***Reqs. asociados:*** | El actor ejecuta exitosamente creación y asignación de roles a usuarios del hotel a través de la plataforma hotelera. |
| ***CU asociados:*** | *CU-21, CU-26 Y CU-28* |
| ***Esc. Asociados:*** | *ES-30.1* |

![](data:image/png;base64...)

![](data:image/png;base64...)

![](data:image/png;base64...)

### Interfaces con el usuario

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-01 |
| ***Descripción:*** | Portal Huésped - Barra de Búsqueda y Filtros de Fechas |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para portal huésped - barra de búsqueda y filtros de fechas. |
| ***CU asociados:*** | *CU-9* |
| ***Esc. Asociados:*** | *ES-9.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-02 |
| ***Descripción:*** | Portal Huésped - Matriz de Disponibilidad y Tarifas |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para portal huésped - matriz de disponibilidad y tarifas. |
| ***CU asociados:*** | *CU-13* |
| ***Esc. Asociados:*** | *ES-13.1* |

![](data:image/png;base64...)

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-03 |
| ***Descripción:*** | Portal Huésped - Ficha Técnica y Galería de Habitación |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para portal huésped - ficha técnica y galería de habitación. |
| ***CU asociados:*** | *CU-3* |
| ***Esc. Asociados:*** | *ES-3.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-04 |
| ***Descripción:*** | Portal Huésped - Checkout y Resumen de Reserva |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para portal huésped - checkout y resumen de reserva. |
| ***CU asociados:*** | *CU-1* |
| ***Esc. Asociados:*** | *ES-1.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-05 |
| ***Descripción:*** | Portal Huésped - Voucher Digital con Código QR |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para portal huésped - voucher digital con código qr. |
| ***CU asociados:*** | *CU-1, CU-12, CU-14* |
| ***Esc. Asociados:*** | *ES-1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-06 |
| ***Descripción:*** | Panel Recepción - Bandeja de Reservas Entrantes en Tiempo Real |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para panel recepción - bandeja de reservas entrantes en tiempo real. |
| ***CU asociados:*** | *CU-14* |
| ***Esc. Asociados:*** | *ES-14.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-07 |
| ***Descripción:*** | Panel Recepción - Ficha de Reserva, Check-in y Check-out |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para panel recepción - ficha de reserva, check-in y check-out. |
| ***CU asociados:*** | *CU-2* |
| ***Esc. Asociados:*** | *ES-2.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-08 |
| ***Descripción:*** | Panel Recepción - Generador de Enlaces de Cobro Seguro |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para panel recepción - generador de enlaces de cobro seguro. |
| ***CU asociados:*** | *CU-2, CU-15* |
| ***Esc. Asociados:*** | *ES-2.1, ES-15.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-09 |
| ***Descripción:*** | Panel Pagos y Cobranzas - Transacciones y Enlaces de Pago |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite al recepcionista generar enlaces de cobro y consultar el estado de pagos en tiempo real. |
| ***CU asociados:*** | *CU-18, CU-23, CU-28, CU-29, CU-30* |
| ***Esc. Asociados:*** | *ES-18.1, ES-23.1, ES-28.1, ES-29.1, ES-30.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-10 |
| ***Descripción:*** | Panel Revenue - Calendario de Cupos y Disponibilidad |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para panel revenue - calendario de cupos y disponibilidad. |
| ***CU asociados:*** | *CU-8, CU-19* |
| ***Esc. Asociados:*** | *ES-8.1, ES-19.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-11 |
| ***Descripción:*** | Panel Revenue - Conmutador de Temporadas e IVA (15%/8%) |
| ***Reqs. asociados:*** | Interfaz interactiva del sistema que permite la interacción del usuario para panel revenue - conmutador de temporadas e iva (15%/8%). |
| ***CU asociados:*** | *CU-18* |
| ***Esc. Asociados:*** | *ES-18.1* |

![](data:image/png;base64...)

|  |  |
| --- | --- |
| ***ID Ref:*** | UI-12 |
| ***Descripción:*** | Panel Hotel - Switch de Tasa 10% de Servicio y Parámetros Comerciales |
| ***Reqs. asociados:*** | Interfaz interactiva que permite al administrador activar o desactivar la tasa del 10% de servicio turístico y gestionar políticas comerciales. |
| ***CU asociados:*** | *CU-23* |
| ***Esc. Asociados:*** | *ES-23.1* |

![](data:image/png;base64...)

![](data:image/png;base64...)

## Vista Lógica

### Descripción

*El diseño del sistema respeta el Modelo MVC (Model, View, Controller)*

***Capa de Base de Datos (Model)****, se encarga de almacenar toda la información, y tenerla disponible para cualquier aplicación.*

***Capa de Aplicaciones (View y Controller)****, Escucha requerimientos de los usuarios, y responde, con una página Web sencilla que se conecta a la base de datos para consultas y/o modificaciones.*

***Capa de usuario (View)****, no requiere equipos grandes, únicamente requiere tener un explorador de Internet, desde el cual se conecta al servidor de aplicaciones para hacer consultas y transacciones a la BD mediante los sistemas desarrollados.*

*La ventaja de este tipo de arquitecturas es que las aplicaciones están en un sólo punto, lo que permite que los administradores sólo hagan cambios en el servidor de aplicaciones y no así en cada uno de los equipos clientes. Asegura la escalabilidad y alta disponibilidad.*

![](data:image/png;base64...)

### Paquetes de Diseño Arquitectónicamente Significativos

![](data:image/png;base64...)

### Vista de Implementación - Componentes

![](data:image/jpeg;base64...)

## Vista de Despliegue - Ambiente Físico

![](data:image/jpeg;base64...)

## Vista de Datos

### Definiciones

Tabla: hotel (Entidad central multi-tenant con id\_hotel, RUC y switch aplica\_servicio\_10)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_hotel | VARCHAR(50) | Sí | Sí | Identificador único del establecimiento hotelero |  |  |  |  |
| FK | id\_parroquia | INT | Sí | No | Relación con la parroquia cantonal de Manta |  |  |  |  |
| FK | id\_tipo\_hotel | VARCHAR(30) | Sí | No | Relación con la modalidad turística (Hotel/Hostal) |  |  |  |  |
| FK | id\_categoria | VARCHAR(30) | Sí | No | Relación con la categoría de estrellas |  |  |  |  |

Tabla: tipo\_habitacion (Categorías comerciales con id\_tipo\_habitacion, id\_hotel y precios base)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_tipo\_habitacion | UUID | Sí | Sí | Identificador único de la categoría comercial |  |  |  |  |
| FK | id\_hotel | VARCHAR(50) | Sí | No | Relación con el hotel propietario |  |  |  |  |
|  | codigo\_interno | VARCHAR(30) | Sí | No | Código interno comercial (ej: MAT-SUP) |  |  |  |  |
|  | nombre | VARCHAR(100) | Sí | No | Nombre de la categoría (Matrimonial Superior) |  |  |  |  |
|  | precio\_base\_estandar | NUMERIC(10,2) | Sí | No | Tarifa base en USD para temporada regular |  |  |  |  |

Tabla: habitacion (Unidades físicas con id\_habitacion, id\_tipo\_habitacion y estados: DISPONIBLE, OCUPADA, LIMPIEZA)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_habitacion | UUID | Sí | Sí | Identificador único de la unidad física |  |  |  |  |
| FK | id\_hotel | VARCHAR(50) | Sí | No | Relación con el hotel propietario |  |  |  |  |
| FK | id\_tipo\_habitacion | UUID | Sí | No | Relación con la categoría de habitación |  |  |  |  |
|  | numero\_habitacion | VARCHAR(15) | Sí | No | Número o identificador visible (ej: 101, 204) |  |  |  |  |
|  | estado\_operativo | VARCHAR(20) | Sí | No | Estado: DISPONIBLE, OCUPADA, LIMPIEZA |  |  |  |  |

Tabla: huesped (Directorio de clientes con id\_huesped, cédula/pasaporte y consentimiento LOPDP)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_huesped | UUID | Sí | Sí | Identificador único del cliente/huésped |  |  |  |  |
|  | tipo\_documento | VARCHAR(15) | Sí | No | Tipo de documento: CEDULA, RUC o PASAPORTE |  |  |  |  |

Tabla: reserva (Control de estancias con id\_reserva, id\_hotel, id\_huesped, fechas y voucher QR)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_reserva | VARCHAR(35) | Sí | Sí | Identificador alfanumérico único de la reserva |  |  |  |  |
| FK | id\_hotel | VARCHAR(50) | Sí | No | Establecimiento donde se reserva la estancia |  |  |  |  |
| FK | id\_huesped | UUID | Sí | No | Huésped titular de la reserva |  |  |  |  |

Tabla: temporada (Gestión de temporadas con id\_temporada, id\_hotel, fechas y multiplicadores)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_temporada | UUID | Sí | Sí | Identificador único de la temporada comercial |  |  |  |  |
| FK | id\_hotel | VARCHAR(50) | Sí | No | Hotel que define la temporada |  |  |  |  |
|  | nombre | VARCHAR(100) | Sí | No | Nombre: Temporada Alta, Carnaval, Baja |  |  |  |  |
|  | multiplicador | NUMERIC(4,2) | Sí | No | Multiplicador tarifario (ej: 1.25) |  |  |  |  |

Tabla: pago (Transacciones con id\_pago, id\_reserva, id\_metodo\_pago: PayPhone / DeUna / Efectivo)

|  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **PK** | **Nombre** | **Tipo** | **No Nulo** | **Único** | **Longitud** | **Precisión** | **Escala** | **Inicial** | **Notas** |
| PK | id\_pago | VARCHAR(40) | Sí | Sí | Identificador único del registro de pago |  |  |  |  |
| FK | id\_reserva | VARCHAR(35) | Sí | No | Reserva asociada a la liquidación |  |  |  |  |
| FK | id\_hotel | VARCHAR(50) | Sí | No | Hotel receptor del cobro |  |  |  |  |
| FK | id\_metodo\_pago | VARCHAR(40) | Sí | No | Método: PAYPHONE\_EC, DEUNA\_PICHINCHA, etc. |  |  |  |  |
|  | monto\_usd | NUMERIC(12,2) | Sí | No | Monto liquidado en USD |  |  |  |  |

Relaciones:

| **Columnas** | **Asociación** | **Notas** |
| --- | --- | --- |
| hotel y habitacion | id\_hotel -> id\_habitacion (1:N) | Un hotel posee de 1 a N habitaciones físicas registradas. |
| reserva y pago | id\_reserva -> id\_pago (1:N) | Una reserva genera uno o más pagos digitales (PayPhone, DeUna, efectivo). |

### Diseño de Base de Datos

**Diagrama Entidad Relación en Draw.Io**

![](data:image/jpeg;base64...)

## Requisitos de Software/Hardware

*<Especifique las estimaciones de capacidad iniciales de recursos computacionales críticos.>*

*Equipamiento y Configuración:*

*Servidor de Aplicaciones*

* *Sistema Operativo Linux, tenemos el RedHat Enterprise Linux Server 5.4*
* *Servidor de Aplicaciones Jboss As 6.0.0.final*
* *JDK 1.6.0\_23 o superior*
* *Intel Xeon x5570 de 2 procesadores*
* *Memoria 8 GB, 4 GB reservado*
* *Disco 30 GB]*

# Calidad

*<Una descripción de como la arquitectura del software contribuye con todas las capacidades del sistema (además de la funcionalidad): extensibilidad, confiabilidad, portabilidad, etc.>*

*Texto sugerido:*

*Dado a la estructura relativamente simple del sistema, principalmente son extraer e ingresar entidades en la Base de Datos, este no debería presentar fallas al momento de ejecutar de los diversos servicios que ofrece. La calidad del sistema dependería principalmente de la funcionabilidad del servidor web, del manejador de Base de Datos y su comunicación entre ellos.*

# Observaciones

*<Esta sección permite incorporar cualquier información que se considera de importancia, que no haya sido especificada con anterioridad>*