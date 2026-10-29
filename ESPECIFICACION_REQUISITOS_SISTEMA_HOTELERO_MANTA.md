# Especificación de Requisitos de Software (SRS)
## Sistema de Gestión, Comercialización y Reservas Hoteleras (Cantón Manta, Ecuador)

* **Código Único de Proyecto (CUP):** 91880000.0000.390820  
* **Objetivo del Sistema:** Plataforma digital integral para la comercialización directa mediante motor de reservas online por tipos de habitación y cupos, administración de tarifas/temporadas por roles, validación de vouchers digitales por código único de confirmación y gestión de cobros digitales para los establecimientos de alojamiento del cantón Manta, Ecuador.  
* **Enfoque del Sistema:** Motor de Reservas Directo para Huéspedes + Extranet Operativa Multihotel (Bandeja de Reservas, Validación de Vouchers por Código, Revenue y Cobros Digitales) + Plataforma Cantonal Superadmin.  
* **Normativa:** IEEE 830 / ISO/IEC 25010 / Art. 41 Ley de Turismo de Ecuador (Régimen de Servicio 10%) / Ley Orgánica de Protección de Datos Personales (LOPDP).  
* **Versión:** 4.0 (Modelo de Reservas y Extranet Pura sin PMS, Conmutador IVA 8% por Decreto, Tasa 10% Parametrizable y Catastro Oficial Manta 2026 de 116 Establecimientos).

---

## 1. Definición del Alcance y Delimitación Conceptual (No-PMS)

El sistema **NO es un PMS (Property Management System) ni un ERP hotelero interno**:
* **No incluye procesos de *check-in* ni *check-out* físico**, entrega de llaves, asignación de números de habitaciones físicas (`101`, `204`), ni control de estados de limpieza/aseo o mantenimiento de cuartos.
* **No incluye emisión de facturas electrónicas del SRI**, ya que cada establecimiento emite su propio comprobante contable en su sistema externo y únicamente registra el número de recibo en la plataforma como referencia de liquidación.

Su propósito central es resolver con máxima eficiencia la **comercialización directa sin comisiones de OTAs, el control de cupos web por tipo de habitación, la recepción y confirmación ágil de reservas, la validación de Vouchers Digitales por código y los cobros digitales locales (PayPhone / DeUna / Kushki)** para los alojamientos del cantón Manta:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DEL SISTEMA                        │
└────────────────────────────────────────────────────────────────────────┘

  [ COMPONENTE 1: PORTAL PÚBLICO ]        [ COMPONENTE 2: EXTRANET HOTEL ]
     (Motor de Reservas Huésped)            (Reservas, Vouchers y Revenue)
                  │                                         │
                  ▼                                         ▼
         • Búsqueda de fechas/aforo               • Bandeja de nuevas reservas
         • Catálogo por Tipo de Habitación        • Confirmar reserva en 1 clic
         • Planes de tarifa y Extras              • Validar Voucher por Código
         • Desglose IVA 15% / 8% Decreto          • Control de cupos de venta web
         • Desglose 10% Servicio (si aplica)      • Tarifas, temporadas e IVA 8%
         • Guest Checkout o con Cuenta            • Enlaces de pago (PayPhone/DeUna)
         • Voucher digital de confirmación        • Switch 10% Servicio Turístico
                  │                                         │
                  └───────────────────┬─────────────────────┘
                                      │
                                      ▼
                        [ COMPONENTE 3: SUPERADMIN ]
                      (Coordinación Cantonal de Manta)
                        • Catastro Oficial (116 Alojamientos)
                        • Conmutador Cantonal IVA 8% Feriados
                        • Activación Tasa 10% Servicio por Hotel
                        • Consolidado de Reservas y Bitácora LOPDP
```

---

## 2. Roles del Sistema y Matriz de Permisos (RBAC)

De acuerdo con la operativa comercial del sector hotelero en Manta, el sistema define **5 perfiles de usuario**:

### 2.1 Definición de Roles

1. **Superadministrador (Superadmin - Plataforma Cantonal):**
   * **Alcance:** Acceso global a los 116 establecimientos adscritos del Catastro Turístico de Manta.
   * **Responsabilidades:** Gestiona altas, bajas y edición de hoteles, hostales y hosterías; administra usuarios globales; activa el conmutador cantonal de IVA al 8% en feriados decretados; audita la bitácora LOPDP y supervisa métricas consolidadas de reservas e ingresos turísticos del cantón.
2. **Administrador del Hotel (Admin Hotel):**
   * **Alcance:** Acceso restringido exclusivamente a **su establecimiento**.
   * **Responsabilidades:** Configura los datos comerciales de su hotel (RUC, razón social, dirección, teléfono); **activa o desactiva la aplicación de la tasa del 10% de servicio turístico (Art. 41 Ley de Turismo)** según la política de su negocio; gestiona las cuentas de su personal y supervisa los comprobantes de pago y liquidaciones.
3. **Encargado de Tarifas y Cupos (Revenue Manager):**
   * **Alcance:** Operación comercial y de disponibilidad web de **su hotel**.
   * **Responsabilidades:** Gestiona el catálogo de **Tipos de Habitación ofertados en la web**; ajusta los **cupos disponibles para venta online**; configura tarifas base por noche y multiplicadores por temporada (Baja, Media, Alta); y opera el **conmutador rápido de emergencia IVA 8%** ante decretos presidenciales de feriados turísticos.
4. **Operador de Reservas / Recepción:**
   * **Alcance:** Atención de la bandeja de reservas y validación de vouchers de **su hotel**.
   * **Responsabilidades:** Recibe las reservas entrantes en tiempo real con alertas visuales y sonoras; verifica datos del cliente y peticiones especiales; **confirma la reserva en 1 clic**; **valida el Voucher Digital por código de reserva** cuando el turista se presenta a efectivizar su estadía; genera enlaces de cobro (PayPhone/DeUna) para saldos pendientes; y registra el número de recibo emitido por el hotel para conciliar la estancia.
5. **Cliente / Huésped (Usuario Público):**
   * **Alcance:** Portal web de reservas directas.
   * **Responsabilidades:** Consulta tipos de habitación disponibles por fechas de entrada y salida; elige planes de tarifa (flexible vs. no reembolsable, con/sin desayuno) y servicios adicionales (traslado aeropuerto, cama supletoria, cuna, salida extendida); visualiza el desglose transparente de impuestos (IVA 15% u 8% + 10% servicio si aplica); reserva como invitado (*Guest Checkout*) o con cuenta; y descarga su Voucher Digital con código de confirmación.

---

### 2.2 Matriz de Control de Acceso (RBAC)

| Módulo / Funcionalidad | Superadmin | Admin Hotel | Revenue Manager | Operador Reservas | Cliente |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Buscar y Cotizar Tipos de Habitación** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Crear Reserva Online (Cuenta o Guest Checkout)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Bandeja de Reservas Entrantes y Alertas (Tiempo Real)** | ✅ (Todos) | ✅ (Su hotel) | 👁️ (Lectura) | ✅ (Operativo) | ❌ |
| **Confirmar / Cancelar Reserva en 1 Clic** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Validar Voucher Digital por Código de Reserva** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Apertura/Ajuste de Cupos de Venta Web por Tipo** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Configuración de Tarifas, Temporadas y Decreto IVA 8%** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Generar Link de Cobro Digital (PayPhone/DeUna)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Conciliar Comprobante de Pago y Recibo del Hotel** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Configurar Tasa 10% Servicio (Activar/Desactivar)**| ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **Gestión de Usuarios del Hotel y Bitácora LOPDP** | ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **Alta / Edición de Hoteles del Catastro de Manta** | ✅ | ❌ | ❌ | ❌ | ❌ |

> **Regla de Integridad Multi-Tenant:** Ningún usuario con rol de `Admin Hotel`, `Revenue Manager` u `Operador de Reservas` puede consultar, modificar ni acceder a información de reservas, ingresos ni clientes pertenecientes a otro establecimiento.

---

## 3. Estudio del Catastro de Alojamientos del Cantón Manta (2026)

Con base en el registro oficial del **Catastro Turístico del Cantón Manta**, la plataforma integra los **116 establecimientos activos** de hospedaje formal distribuidos en las 7 parroquias del cantón:

### 3.1 Universo de Establecimientos por Modalidad

| Modalidad de Alojamiento | Cantidad de Establecimientos | Porcentaje (%) | Política Típica de 10% Servicio (Art. 41 Ley de Turismo) |
| :--- | :---: | :---: | :--- |
| **HOSTAL** | 76 | 65.5% | Mayoritariamente **NO gravan** el 10% de servicio (tarifas netas más IVA). |
| **HOTEL** | 39 | 33.6% | Hoteles de 3, 4 y 5 estrellas **habitualmente gravan** el 10% de servicio. |
| **HOSTERÍA** | 1 | 0.9% | Según régimen comercial del establecimiento. |
| **TOTAL ALOJAMIENTOS MANTA** | **116** | **100.0%** | **Universo activo en el motor de reservas y catastro cantonal.** |

### 3.2 Distribución Territorial por Parroquias de Manta

| Parroquia / Zona | Tipo | Establecimientos | Vocación Turística y Perfil de Alojamiento |
| :--- | :---: | :---: | :--- |
| **Manta (Matriz: Barbasquillo, Murciélago, Centro)** | Urbana | 40 | Malecón Escénico, playa El Murciélago y zona hotelera de Barbasquillo. |
| **Tarqui** | Urbana | 38 | Zona tradicional hotelera y comercial frente al mar. |
| **Los Esteros** | Urbana | 15 | Sector costero norte cercano al aeropuerto Eloy Alfaro. |
| **Santa Marianita** | Rural | 9 | Capital del *Kitesurf* del Ecuador; hoteles y hostales de playa. |
| **San Mateo** | Urbana | 8 | Puerto pesquero artesanal, miradores y playa de surf. |
| **San Lorenzo** | Rural | 4 | Reserva Marina de Pacoche, El Faro y anidación de tortugas. |
| **Eloy Alfaro** | Urbana | 2 | Alojamiento urbano comercial y de paso. |
| **TOTAL** | | **116** | |

---

## 4. Catálogo de Requisitos Funcionales (RF)

### 4.1 Módulo 1: Motor de Reservas y Experiencia del Huésped (Portal Público)
* **RF-01 (Barra de Búsqueda y Cotización Dinámica):** Selector de parroquia/sector de Manta, fecha de entrada, fecha de salida y número de huéspedes, recalculando cupos disponibles e importes al instante.
* **RF-02 (Autenticación del Huésped y Reserva como Invitado - Guest Checkout):** Inicio de sesión con Google, correo/contraseña o botón directo **"Continuar como Invitado (Guest Checkout)"** sin registro obligatorio, además del centro de cuenta *"Mis Reservas"*.
* **RF-03 (Desglose Tributario Transparente - IVA 15%/8% y 10% Servicio):** Presentación clara de:
  * *Subtotal Neto de Hospedaje (+ Extras si aplica).*
  * *+ IVA vigente:* **15% en régimen ordinario** u **8% en feriados turísticos por Decreto Presidencial**.
  * *+ 10% de Servicio Turístico (Art. 41 Ley de Turismo):* Calculado estrictamente sobre el subtotal neto **solo si el hotel tiene activado el recargo**.
* **RF-04 (Planes de Tarifa):** Selección entre *Tarifa Estándar Flexible (Cancelación gratuita)* vs. *Tarifa No Reembolsable (-10% descuento)* y opción de *Desayuno Incluido*.
* **RF-05 (Galería Multimedia y Ficha Técnica por Tipo de Habitación):** Fotos HD, metraje ($m^2$), configuración de camas, capacidad máxima, amenidades y alerta de escasez de cupos.
* **RF-06 (Servicios Complementarios de Alojamiento - Extras):** Selección opcional en el checkout de: *Traslado Aeropuerto Eloy Alfaro $\leftrightarrow$ Hotel*, *Cama supletoria*, *Cuna para bebé* y *Salida extendida*.
* **RF-07 (Mapa Geográfico Cantonal y Tiempos de Traslado):** Mapa interactivo Leaflet de las 7 parroquias de Manta y cuadro de distancias/tiempos hacia Playa El Murciélago, Mall del Pacífico, Terminal Terrestre y Aeropuerto Eloy Alfaro.
* **RF-08 (Reseñas y Valoraciones Verificadas):** Calificación general y barras de puntuación (1 a 10) por subcriterios: *Limpieza, Ubicación, Atención del Personal, Relación Calidad-Precio y Conectividad WiFi*.
* **RF-09 (Voucher Digital con Código de Confirmación):** Emisión automática de comprobante digital con código único (`#RES-XXXX`), desglose pagado, PIN de verificación y datos de reserva para validación en el establecimiento.

### 4.2 Módulo 2: Bandeja de Reservas y Validación de Vouchers (Extranet Hotel)
* **RF-10 (Bandeja de Reservas Entrantes):** Gestión de reservas por estados: `Por Confirmar`, `Confirmada`, `Validada`, `Liquidada` y `Cancelada`.
* **RF-11 (Alertas Visuales y Sonoras en Tiempo Real):** Notificación sonora y banner visual inmediato cuando ingresa una nueva reserva desde el portal web.
* **RF-12 (Confirmación de Reserva en 1 Clic):** Aprobación inmediata de reservas pendientes con descuento automático de cupo web.
* **RF-13 (Validación de Reserva por Código):** Verificación en 1 clic del código `#RES-XXXX` del turista para marcar la reserva como `Validada` (efectivizada), reemplazando cualquier proceso pesado de check-in/check-out de PMS.
* **RF-14 (Conciliación con Recibo del Hotel):** Copiado rápido de datos del titular y registro del número de recibo emitido por el hotel en su sistema contable.
* **RF-15 (Generación de Links de Cobro Digital):** Creación de enlaces PayPhone / DeUna y envío por WhatsApp/correo.
* **RF-16 (Reposición de Cupos por Cancelación):** Reintegro automático del cupo web cuando una reserva pasa a estado `Cancelada`.
* **RF-17 (Directorio de Clientes de Reserva):** Historial y buscador de clientes por documento, nombre o correo.

### 4.3 Módulo 3: Disponibilidad de Cupos, Tarifas y Decreto IVA 8% (Revenue)
* **RF-18 (Ajuste Dinámico de Cupos de Venta Web):** Control `+` / `-` de cupos disponibles por tipo de habitación para la venta online.
* **RF-19 (Edición de Tarifas Base):** Configuración de precios base por noche en USD.
* **RF-20 (Temporadas y Multiplicadores):** Configuración de temporadas (Baja, Media, Alta) y comparativa de comisiones por canal.
* **RF-21 (Conmutador Rápido de Emergencia - IVA 15% / 8% por Decreto Presidencial):** Botón de 1 clic para activar o desactivar el régimen de feriado turístico con **IVA reducido al 8%**, impactando en tiempo real en las cotizaciones del portal web y en los comprobantes generados.

### 4.4 Módulo 4: Cobros Digitales y Pasarelas de Pago
* **RF-22 (Pasarelas de Pago con Tarjeta):** Integración con PayPhone, Kushki, Datafast y Stripe.
* **RF-23 (Cobros Móviles y Transferencias):** Integración con DeUna (Banco Pichincha) y transferencias bancarias.
* **RF-24 (Simulación y Conciliación Inmediata):** Confirmación instantánea del pago y actualización del comprobante de reserva.

### 4.5 Módulo 5: Catálogos Maestros y Configuración Multi-Tenant
* **RF-25 (Switch del 10% de Servicio Turístico por Hotel):** Conmutador individual por establecimiento (Art. 41 Ley de Turismo).
* **RF-26 (CRUD del Catastro de 116 Alojamientos de Manta):** Gestión completa del directorio oficial cantonal.
* **RF-27 (Filtros por Modalidad y Estrellas):** Clasificación en Hotel, Hostal y Hostería de 1 a 5 estrellas.
* **RF-28 (Gestión de Usuarios RBAC):** Administración de accesos por rol y establecimiento.
* **RF-29 (Catálogo de Tipos de Habitación Web):** Alta y edición de tipos de habitación ofertados por cada hotel.

### 4.6 Módulo 6: Gobernanza Cantonal y Bitácora LOPDP
* **RF-30 (Bitácora Inalterable de Auditoría LOPDP):** Registro cronológico de acciones críticas (confirmaciones, validación de vouchers, cambio de IVA 8%, switch 10% servicio, accesos a datos de clientes) con fecha/hora, usuario, rol e IP.

---

## 5. Reglas de Negocio Oficiales

### RN-01: Conmutador de IVA Ordinario (15%) y Feriados Turísticos (8%) por Decreto
La tarifa general de IVA en Ecuador es del **15%**. Durante feriados nacionales o locales decretados por el Ejecutivo, el IVA turístico se reduce al **8%**. El conmutador de emergencia aplica de inmediato la tasa seleccionada sobre la base imponible (alojamiento + servicios adicionales).

### RN-02: Parametrización del 10% de Servicio Turístico por Hotel (Art. 41 Ley de Turismo)
1. Cada establecimiento dispone del parámetro booleano `gravaServicio10`.
2. **Cuando está ACTIVADO:**
   * Con IVA ordinario (15%): $\text{Total} = \text{Subtotal} + (15\% \times \text{Subtotal}) + (10\% \times \text{Subtotal}) = \text{Subtotal} \times 1.25$ (+25% total).
   * En feriado con IVA reducido (8%): $\text{Total} = \text{Subtotal} + (8\% \times \text{Subtotal}) + (10\% \times \text{Subtotal}) = \text{Subtotal} \times 1.18$ (+18% total).
   * La tasa del 10% se calcula estrictamente sobre el Subtotal neto antes de impuestos.
3. **Cuando está DESACTIVADO:**
   * Con IVA ordinario (15%): $\text{Total} = \text{Subtotal} \times 1.15$ (+15% total).
   * En feriado con IVA reducido (8%): $\text{Total} = \text{Subtotal} \times 1.08$ (+8% total).
