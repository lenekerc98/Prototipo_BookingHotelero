# Especificación de Requisitos de Software (SRS)
## Sistema de Gestión, Administración y Reservas Hoteleras (Cantón Manta, Ecuador)

* **Código Único de Proyecto (CUP):** 91880000.0000.390820  
* **Objetivo del Sistema:** Plataforma digital integral para la gestión de servicios operativos, comercialización mediante motor de reservas online, administración de inventario/tarifas por roles y facturación electrónica autorizada ante el SRI para establecimientos de alojamiento del cantón Manta, Ecuador.  
* **Enfoque del Sistema:** Motor de Reservas Directo para Huéspedes + Panel Operativo Multihotel (Recepción, Revenue y Facturación SRI) + Plataforma Cantonal Superadmin.  
* **Normativa:** IEEE 830 / ISO/IEC 25010 / Normativa Tributaria SRI Ecuador (Art. 41 Ley de Turismo)  
* **Versión:** 3.1 (Ajuste a Operativa Hotelera Pura, Régimen de Servicio 10% Parametrizable y Catastro Manta 2026)

---

## 1. Definición del Alcance y Arquitectura Funcional

El sistema **NO** es un ERP hotelero de operaciones internas complejas pesadas (tipo Zeus u Opera con comandas de restaurante, lavandería industrial, minibar o gestión de almacenes). 

Su propósito central es resolver con máxima eficiencia la **comercialización directa, el control de inventario de habitaciones, la recepción ágil de reservas, los cobros digitales locales y la facturación electrónica ante el SRI** para los establecimientos de alojamiento del cantón Manta:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DEL SISTEMA                        │
└────────────────────────────────────────────────────────────────────────┘

  [ COMPONENTE 1: PORTAL PÚBLICO ]        [ COMPONENTE 2: PANEL DEL HOTEL ]
     (Motor de Reservas Huésped)             (Recepción, Revenue y Admin)
                  │                                         │
                  ▼                                         ▼
         • Búsqueda de fechas/aforo               • Bandeja de nuevas reservas
         • Catálogo de habitaciones               • Aceptar / Confirmar reserva
         • Cotización por temporadas              • Control de cupos y bloqueos
         • Desglose IVA 15% / 8%                  • Tarifas y temporadas (Revenue)
         • Desglose 10% Servicio (si aplica)      • Enlaces de pago (PayPhone/DeUna)
         • Pago online / Garantía                 • Factura Electrónica SRI
         • Voucher digital con QR                 • Configuración Tasa 10% Servicio
                  │                               • Parámetros fiscales RUC/SRI
                  └───────────────────┬─────────────────────┘
                                      │
                                      ▼
                        [ COMPONENTE 3: SUPERADMIN ]
                      (Coordinación Cantonal de Manta)
                        • Altas de Hoteles adscritos del Catastro
                        • Activación de Tasa 10% de Servicio por Hotel
                        • Consolidado de Reservas y Ocupación Cantonal
                        • Auditoría global y estadísticas turísticas
```

---

## 2. Roles del Sistema y Matriz de Permisos (RBAC)

De acuerdo con la operativa real del sector hotelero en Manta, el sistema define **5 perfiles de usuario** claramente delimitados:

### 2.1 Definición de Roles

1. **Superadministrador (Superadmin - Plataforma Cantonal):**
   * **Alcance:** Acceso global a todos los establecimientos adscritos de Manta.
   * **Responsabilidades:** Da de alta nuevos hoteles y hostales basados en el Catastro Turístico oficial de Manta; crea usuarios administradores de hotel; parametriza políticas globales; audita transacciones; y visualiza los tableros consolidados de reservas, volumen de huéspedes e ingresos turísticos de todo el cantón.
2. **Administrador del Hotel (Admin Hotel):**
   * **Alcance:** Acceso restringido exclusivamente a **su establecimiento**.
   * **Responsabilidades:** Configura los datos comerciales y fiscales de su hotel (RUC, razón social, establecimiento, punto de emisión ante el SRI, cuentas bancarias); **activa o desactiva la aplicación de la tasa del 10% de servicio turístico (propina legal)** según la política de su establecimiento; gestiona el personal interno (crea recepcionistas y revenue managers); visualiza estados de cuenta financieros y autoriza notas de crédito.
3. **Encargado de Tarifas y Cupos (Revenue Manager):**
   * **Alcance:** Operación comercial y de disponibilidad de **su hotel**.
   * **Responsabilidades:** Gestiona el inventario de habitaciones; indica y modifica la **disponibilidad de cupos** (abre o cierra fechas para evitar sobreventas); configura tarifas base por tipo de habitación; programa temporadas (baja, media, alta y feriados locales de Manta con IVA reducido al 8%); ejecuta bloqueos de habitaciones por mantenimiento; y define multiplicadores de precios.
4. **Recepcionista (Front Desk):**
   * **Alcance:** Atención y gestión operativa de reservas de **su hotel**.
   * **Responsabilidades:** **Recibe las reservas entrantes en tiempo real**; verifica datos del huésped y requerimientos especiales; confirma la reserva; registra el ingreso (*Check-in*) y salida (*Check-out*); genera enlaces de pago (PayPhone/DeUna) para saldos pendientes; y emite la factura electrónica autorizada ante el SRI con desglose automático de IVA (15% u 8%) y del 10% de servicio turístico si el hotel lo grava.
5. **Cliente / Huésped (Usuario Público):**
   * **Alcance:** Portal web de reservas de alta conversión.
   * **Responsabilidades:** Consulta habitaciones disponibles por fechas y número de personas; compara planes de tarifa (con/sin desayuno, reembolsable/no reembolsable); visualiza el desglose transparente de impuestos y servicios; efectúa el pago o registro de garantía digital; y descarga su voucher digital con código QR.

---

### 2.2 Matriz de Control de Acceso (RBAC)

| Módulo / Funcionalidad | Superadmin | Admin Hotel | Revenue Manager | Recepcionista | Cliente |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Buscar y Cotizar Habitaciones** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Crear Reserva Online y Pago** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Bandeja de Reservas Entrantes (Tiempo Real)** | ✅ (Todos) | ✅ (Su hotel) | 👁️ (Solo lectura) | ✅ (Operativo) | ❌ |
| **Confirmar / Rechazar Reserva** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Apertura/Cierre de Cupos y Disponibilidad** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Bloqueo Operativo por Mantenimiento** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Configuración de Tarifas y Temporadas (IVA 15%/8%)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Check-in / Check-out de Huéspedes** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Generar Link de Cobro (PayPhone/DeUna)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Emisión Factura SRI (IVA 15%/8% + Propina)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Configurar Tasa 10% Servicio (Activar/Desactivar)**| ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **Gestión de Usuarios del Hotel** | ✅ | ✅ (Su hotel) | ❌ | ❌ | ❌ |
| **Alta / Baja de Hoteles del Catastro de Manta** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Dashboard Consolidado Cantonal (Reservas/Ocupación)**| ✅ | ❌ | ❌ | ❌ | ❌ |

> **Regla de Integridad Multi-Tenant:** Ningún usuario con rol de `Admin Hotel`, `Revenue Manager` o `Recepcionista` puede consultar, modificar ni acceder a información de reservas, ingresos ni huéspedes pertenecientes a otro establecimiento.

---

### 2.3 Puntos Clave Integrados en el Flujo Operativo

Para garantizar una operación hotelera fluida sin fricciones:

1. **Módulo de Notificaciones Automáticas en Tiempo Real:**
   * Al momento de completarse una reserva en la web, el sistema dispara:
     * Alerta visual e indicador sonoro en la pantalla del **Recepcionista** ("Nueva reserva recibida: #RES-XXX").
     * Envío automático de confirmación por correo y WhatsApp al **Cliente** con voucher digital y código QR.
     * Recordatorio con enlace de cobro seguro con tiempo de expiración si la reserva quedó pendiente de pago.
104: 2. **Flujo de Bloqueo por Mantenimiento Operativo:**
105:    * El **Revenue Manager** o el **Admin** pueden marcar cualquier habitación en estado `"Mantenimiento / Fuera de Servicio"` (por ejemplo por reparaciones o averías imprevistas), descontando de forma inmediata ese cupo del motor de reservas público sin alterar el historial contable.
106: 3. **Parametrización Dinámica del 10% de Servicio por Hotel:**
107:    * El sistema reconoce que no todos los establecimientos de alojamiento de Manta gravan el 10% de servicio turístico. Por tanto, cada hotel dispone de una configuración independiente para activar o desactivar este recargo legal, reflejándose al instante en la cotización web, en el voucher y en el comprobante electrónico del SRI.
108: 
109: ---
110: 
111: ## 3. Estudio del Catastro de Alojamientos del Cantón Manta (2026)
112: 
113: Con base en el registro oficial del **Catastro Nacional Turístico del Ministerio de Turismo del Ecuador (`Consolidado-Nacional-2026-publico-8.xlsx`)**, se presenta el diagnóstico cuantitativo del universo hotelero en el cual se implementa el sistema.
114: 
115: ### 3.1 Universo de Establecimientos en el Cantón Manta
116: 
117: En el cantón Manta existen **659 establecimientos turísticos registrados** en el Catastro Nacional. De ellos, exactamente **118 corresponden a las tres modalidades de alojamiento turístico** objeto de este sistema:
118: 
119: | Modalidad de Alojamiento | Cantidad de Establecimientos | Porcentaje (%) | Política Típica de 10% Servicio |
120: | :--- | :---: | :---: | :--- |
121: | **HOSTAL** | 77 | 65.3% | Mayoritariamente **NO gravan** el 10% de servicio (tarifas netas directas). |
122: | **HOTEL** | 40 | 33.9% | Hoteles de 3, 4 y 5 estrellas **habitualmente gravan** el 10% de servicio. |
123: | **HOSTERÍA** | 1 | 0.8% | Según régimen y modelo tarifario del establecimiento. |
124: | **TOTAL ALOJAMIENTOS MANTA** | **118** | **100.0%** | **Universo objetivo de gestión y reservas en Manta.** |
125: 
126: ---
127: 
128: ### 3.2 Distribución por Categorización de Estrellas
129: 
130: El desglose por categoría oficial demuestra la estructura del mercado hotelero de Manta:
131: 
132: | Categoría Oficial | Cantidad | % del Total | Justificación y Aplicación del 10% de Servicio |
133: | :--- | :---: | :---: | :--- |
134: | **1 Estrella** | 34 | 28.8% | Establecimientos pequeños que no cuentan con software de reservas ni facturación integrada; operan sin recargo de servicio (10% desactivado). |
135: | **2 Estrellas** | 41 | 34.7% | Segmento mayoritario; hostales familiares gestionados manualmente. Mayoritariamente no cobran el 10% de servicio turístico. |
136: | **3 Estrellas** | 30 | 25.4% | Núcleo de hoteles intermedios de Manta; ofrecen servicios completos y aplican indistintamente el 10% según su modelo contable. |
137: | **4 Estrellas** | 7 | 5.9% | Hoteles corporativos y turísticos de alta gama; aplican el 10% de propina legal reglamentaria sobre el subtotal neto. |
138: | **5 Estrellas / Lujo** | 6 | 5.1% | Cadenas hoteleras del puerto y Barbasquillo; gravan estrictamente el 10% de servicio turístico (Art. 41 Ley de Turismo). |
139: | **TOTAL** | **118** | **100.0%** | **El 89.0% (105 establecimientos) son de categoría 1, 2 y 3 estrellas.** |
140: 
141: > **Hallazgo Estratégico:** Nueve de cada diez alojamientos en Manta son categorías 1, 2 y 3 estrellas. La enorme diversidad entre hostales pequeños (que cobran precios netos directos) y hoteles de mayor categoría (que cobran el 10% de servicio) valida la exigencia técnica de que **el sistema permita activar o desactivar la tasa del 10% de servicio de manera individual para cada hotel**.
142: 
143: ---
144: 
145: ### 3.3 Distribución Territorial por Parroquias
146: 
147: | Parroquia | Tipo | Establecimientos | Vocación Turística y Perfil de Alojamiento |
148: | :--- | :---: | :---: | :--- |
149: | **Manta (Urbana)** | Urbana | 69 | Centro comercial, Malecón Escénico, playa El Murciélago y Barbasquillo. Predominio de Hoteles y Hostales ejecutivos. |
150: | **Los Esteros** | Urbana | 21 | Cercana al aeropuerto y polo pesquero-industrial. Alojamientos corporativos y de paso. |
151: | **Tarqui** | Urbana | 16 | Zona tradicional hotelera frente al mar. Hostales familiares en proceso de reactivación comercial. |
152: | **Santa Marianita** | Rural | 7 | Playa internacional de *Kitesurf*. Hostales de playa y cabañas costeras. |
153: | **San Lorenzo** | Rural | 2 | Zona de acantilados, reserva de Pacoche y anidación de tortugas. Hostales y hostería rural. |
154: | **San Mateo** | Rural | 2 | Puerto pesquero y surfistas. Hostales costeros familiares. |
155: | **Eloy Alfaro** | Urbana | 1 | Alojamiento urbano de paso. |
156: | **TOTAL** | | **118** | |
157: 
158: ---
159: 
160: ### 3.4 Conclusiones del Estudio del Catastro para el Desarrollo del Sistema
161: 
162: 1. **Adaptabilidad a Hostales (65.3% del mercado):** El sistema debe ser sumamente intuitivo y ágil, permitiendo que un hostal de 10 o 15 habitaciones en Tarqui o Los Esteros pueda recibir una reserva, registrar el check-in y emitir la factura electrónica en menos de 2 minutos sin requerir capacitación compleja.
163: 2. **Flexibilidad Tributaria (10% de Servicio Configurable):** Dado que la gran mayoría de hostales no aplican el 10% de propina legal mientras que los hoteles de Barbasquillo sí lo hacen, la plataforma debe permitir activar o desactivar este recargo con un solo switch por establecimiento.
164: 3. **Reducción de Costos de Intermediación:** Al dotar a estos 118 alojamientos de un motor de reservas directo con pasarelas locales (PayPhone, DeUna, transferencias), los hoteleros de Manta retienen entre un 15% y 18% de margen que antes perdían en comisiones de OTAs internacionales.

---

## 4. Catálogo de Requisitos Funcionales (RF)

### 4.1 Módulo A: Motor de Reservas y Experiencia del Huésped

* **RF-01 (Barra de Búsqueda y Modificación Dinámica):** Selector interactivo superior con rango de fechas (check-in / check-out), aforo (adultos, niños y habitaciones) y botón *"Modificar búsqueda"*, recalculando disponibilidad instantáneamente.
* **RF-02 (Autenticación del Huésped y Perfil):**
  * Inicio de sesión rápido con cuenta de **Google (OAuth 2.0)**.
  * Registro e inicio de sesión con **Correo electrónico y Contraseña**.
  * Modalidad de **Reserva como Invitado (*Guest Checkout*)** sin fricción previa.
  * Panel *"Mis Reservas"* para consultar vouchers activos y gestionar cancelaciones.
* **RF-03 (Tabla de Disponibilidad y Desglose Tributario Flexible):** Matriz interactiva de disponibilidad con 6 columnas estándar:
  1. *Tipo de Habitación:* Nombre, badge de escasez (ej. *"🔴 ¡Nos quedan solo 2 habitaciones!"*), tipo de camas, metraje ($m^2$), vistas y etiquetas de amenidades.
  2. *Capacidad:* Íconos de adultos y niños según capacidad máxima.
  3. *Precio Total con Desglose Transparente:*
     * *Subtotal Neto de Alojamiento (Base Imponible)*
     * *+ IVA vigencia ordinaria (15%) o IVA reducido en feriados turísticos (8%)*
     * *+ 10% de Servicio Turístico / Propina (Art. 41 Ley de Turismo)* — **únicamente si el hotel tiene activada la tasa**.
     * *Total en USD.*
     * *Regla de cálculo:*
       * Si el hotel tiene **10% de servicio ACTIVO**: Recargo total de **+25% en días ordinarios** (15% IVA + 10% servicio) o **+18% en feriados turísticos** (8% IVA + 10% servicio).
       * Si el hotel tiene **10% de servicio DESACTIVADO**: Recargo total de **+15% en días ordinarios** (15% IVA + 0% servicio) o **+8% en feriados turísticos** (8% IVA + 0% servicio).
  4. *Tus Opciones (Planes de Tarifa):* Desglose de condiciones de desayuno, pago y cancelación (ver RF-04).
  5. *Selector de Habitaciones:* Cantidad a reservar (`0`, `1`, `2`...).
  6. *Botón de Acción 'Reservaré':* Acceso inmediato al checkout con sellos de confianza.
* **RF-04 (Paquetes de Reserva y Planes de Tarifa):**
  * *Opciones de Desayuno:* Desayuno incluido vs opcional con costo adicional.
  * *Políticas de Cancelación:* Cancelación gratuita flexible vs Tarifa No Reembolsable con descuento.
  * *Modalidades de Pago:* Pagar en el alojamiento vs Paga ahora online con pasarela local.
* **RF-05 (Galería Multimedia y Ficha Técnica por Habitación):** Carrusel de fotos en alta definición, metraje ($m^2$), vistas (al mar, a la piscina, a la ciudad), configuración de camas e insignias de equipamiento (A/C, WiFi, TV cable, baño privado).
* **RF-06 (Servicios Adicionales - Add-ons):** Selección opcional de: traslados privados Aeropuerto Manta $\leftrightarrow$ Hotel, camas supletorias, early check-in / late check-out y tours locales (Pacoche, avistamiento de ballenas).
* **RF-07 (Módulo de Ubicación Geográfica en Manta):** Mapa interactivo con dirección exacta en la parroquia correspondiente (Manta, Tarqui, Barbasquillo, Santa Marianita, San Lorenzo) y tiempos de traslado a atractivos (Playa El Murciélago, Mall del Pacífico, Terminal Terrestre, Aeropuerto).
* **RF-08 (Comentarios y Valoraciones de Clientes Verificados):** Calificación en escala de 1 a 10 con número de reseñas y desglose por subcriterios: Limpieza, Ubicación, Personal y Atención, Relación Calidad-Precio y Conexión WiFi.
* **RF-09 (Preferencias de Estancia y Solicitudes Especiales):** Formulario para registrar hora estimada de llegada, requerimientos de accesibilidad, camas separadas o notas operativas para recepción.
* **RF-10 (Emisión de Voucher Digital con Código QR):** Confirmación inmediata de reserva con código alfanumérico único (ej: `RES-CS-201`), envío automático a correo/WhatsApp y descarga de voucher con QR para presentación en recepción.

---

### 4.2 Módulo B: Recepción y Gestión Operativa (Panel del Recepcionista)

* **RF-11 (Bandeja de Reservas Entrantes en Tiempo Real):** Vista centralizada de reservas organizadas por estados: `Nueva / Por Confirmar`, `Confirmada`, `En Casa (Check-in)`, `Finalizada (Check-out)` y `Cancelada`.
* **RF-12 (Confirmación y Detalle de Reserva):** Apertura de ficha completa de la reserva, verificación de servicios contratados, notas del huésped y confirmación en 1 clic.
* **RF-13 (Check-in Express y Registro de Huésped):** Validación de identidad (Cédula/Pasaporte) al arribo del huésped y activación de la estancia con registro de hora de ingreso.
* **RF-14 (Generación de Links de Pago para Saldos Pendientes):** Generación de enlace de cobro seguro con código QR de PayPhone/DeUna para reservas con cobro pendiente o consumos adicionales.
* **RF-15 (Check-out y Liquidación de Cuenta):** Cierre de estancia, verificación de saldo pagado y liberación automática del cupo en el inventario.
* **RF-16 (Directorio Histórico de Huéspedes):** Búsqueda ágil de huéspedes habituales por cédula o nombre para agilizar recepciones futuras.

---

### 4.3 Módulo C: Disponibilidad, Tarifas y Temporadas (Panel del Revenue Manager)

* **RF-17 (Control de Cupos y Disponibilidad por Fecha):** Calendario visual para abrir o cerrar cupos de cada tipo de habitación en fechas específicas, evitando sobreventas.
* **RF-18 (Configuración de Planes de Tarifa):** Parametrización de precios base, políticas flexibles vs no reembolsables y habilitación del cobro presencial.
* **RF-19 (Gestión de Galerías, Metraje y Fotos de Habitaciones):** Administración de fotos, metraje ($m^2$), vistas y amenidades por tipo de habitación.
* **RF-20 (Administración de Extras y Servicios Adicionales):** Catálogo de servicios adicionales (traslados, desayunos, late check-out) con precios unitarios en USD.
* **RF-21 (Conmutador Rápido de Emergencia - IVA 15% / 8% por Decreto Presidencial de Última Hora):**
  * *Realidad Operativa Nacional:* En el Ecuador, la reducción del IVA al 8% para el sector turístico en feriados (Ley Orgánica de Desarrollo Económico) depende de Decretos Ejecutivos de la Presidencia que, frecuentemente, **se publican con escasa antelación (de un día para otro o 24-48 horas antes del asueto)**.
  * *Funcionalidad:* El sistema incluye un **conmutador inmediato de un solo clic** (toggle de emergencia) disponible para el Revenue Manager, el Admin Hotel y con alerta sugerida desde el Superadmin. Al activarse, aplica de inmediato la tarifa del 8% en nuevas cotizaciones del motor de reservas, vouchers y comprobantes del SRI, permitiendo también fijar la fecha/hora de vigencia si el decreto especifica un corte temporal exacto.
  * *Régimen Ordinario vs Feriado:*
    * *Régimen Ordinario:* **IVA al 15%** (si grava servicio: 15% IVA + 10% Servicio = 25% total; si no grava servicio: 15% IVA total).
    * *Feriados Turísticos:* **IVA reducido al 8%** (si grava servicio: 8% IVA + 10% Servicio = 18% total; si no grava servicio: 8% IVA total).

---

### 4.4 Módulo D: Facturación Electrónica SRI Ecuador

* **RF-22 (Generación de Clave de Acceso de 49 Dígitos):** Cálculo matemático oficial con algoritmo ponderado Módulo 11 del SRI.
* **RF-23 (Liquidación Tributaria Flexible y Tasa de Servicio del 10%):** Emisión de factura electrónica con desglose exacto:
  * *Subtotal Base Imponible (tarifa 15% u 8% en feriados)* con sus códigos respectivos del SRI.
  * *Subtotal 0%* (para rubros o conceptos exentos).
  * *Monto del IVA liquidado (15% u 8%)*.
  * *Propina / Servicio Turístico del 10%:* Calculado sobre el subtotal neto sin impuestos **exclusivamente si el hotel tiene activada la tasa**. En caso contrario, el campo se emite en `$0.00`.
  * *Valor Total en USD:* Total = Subtotal + IVA + (10% Servicio si está activo).
* **RF-24 (Emisión de Comprobante RIDE en PDF y XML Autorizado):** Generación de la factura digital con código de barras / código QR, validación de estado SRI y descarga de XML firmado.

---

### 4.5 Módulo E: Parámetros Comerciales y Configuración Fiscal del Hotel

* **RF-25 (Configuración de Tasa de Servicio del 10% por Hotel):** Selector / conmutador independiente para cada establecimiento que permite **activar o desactivar el cobro del 10% de servicio turístico** (propina legal). El cambio actualiza al instante:
  * El motor de reservas web del hotel (desglosando o suprimiendo la línea de servicio).
  * Los enlaces de cobro digital (PayPhone/DeUna).
  * La emisión de comprobantes electrónicos del SRI (asignando el valor calculado o 0.00 en `<propina>`).
* **RF-26 (Configuración Fiscal SRI por Establecimiento):** Formulario para registrar RUC (13 dígitos), razón social, nombre comercial, dirección matriz y sucursal, número de establecimiento (`001`), punto de emisión (`001`), régimen tributario (General, RIMPE Emprendedor, RIMPE Negocio Popular) y condición de obligado a llevar contabilidad.
* **RF-27 (Control de Métodos de Cobro y Pasarelas de Pago):** Configuración de canales de cobro admitidos por el hotel (PayPhone Ecuador, Kushki, Datafast, transferencias directas DeUna / Produbanco / Banco Pichincha).
* **RF-28 (Bloqueo Operativo de Habitaciones por Mantenimiento):** Función de bloqueo temporal de unidades por daños, reparaciones o pintura, retirando la unidad de la disponibilidad pública sin eliminar registros históricos.

---

### 4.6 Módulo F: Administración de Hotel y Superadmin Cantonal

* **RF-29 (Aislamiento de Información por Hotel - Multi-tenant):** Seguridad estricta por roles donde el Administrador del Hotel solo tiene acceso a las finanzas, reservas y habitaciones de su establecimiento.
* **RF-30 (Gestión de Usuarios del Hotel):** Creación y administración de cuentas para recepcionistas y revenue managers de cada establecimiento.
* **RF-31 (Alta de Hoteles del Catastro de Manta):** Registro de nuevos hoteles, hostales u hosterías de la planta turística cantonal con asignación de parroquia, categoría y configuración inicial de tasa de servicio.
* **RF-32 (Tablero Consolidado de Reservas Cantonal):** Métricas macro para la administración cantonal: tasa global de ocupación de Manta, volumen consolidado de reservas por temporada, ingresos turísticos generados y tarifa promedio por parroquia.

---

## 5. Requisitos No Funcionales (RNF)

* **RNF-01 (Rendimiento y Tiempo de Respuesta):** Tiempo de respuesta en consultas de disponibilidad y cotización dinámica menor a **1 segundo** en condiciones de red estándar.
* **RNF-02 (Usabilidad Operativa de Mostrador):** El recepcionista debe poder recibir, validar y confirmar una reserva en no más de **2 clics**.
* **RNF-03 (Seguridad Criptográfica y Tokenización):** Comunicaciones protegidas bajo protocolo seguro **HTTPS / TLS 1.3**, almacenamiento de credenciales con hash robusto y cifrado en reposo **AES-256**. Generación de enlaces de cobro con tokens hash SHA-256 de un solo uso con expiración configurada. Integración con pasarelas de pago certificadas bajo el estándar **PCI-DSS** (PayPhone, DeUna, Kushki), garantizando que el sistema jamás almacene números completos de tarjetas de crédito ni códigos CVV en sus bases de datos.
* **RNF-04 (Protección de Datos Personales - LOPDP del Ecuador):** Cumplimiento estricto e integral de la **Ley Orgánica de Protección de Datos Personales del Ecuador (Registro Oficial Suplemento 459 de 26-may.-2021)**:
  * *Consentimiento Explícito e Informado:* El portal web de reservas y el módulo de recepción deben recabar el consentimiento activo y documentado del huésped mediante aceptación de la Política de Privacidad y Tratamiento de Datos Personales previo a la confirmación de la reserva y procesamiento de pagos.
  * *Principio de Finalidad y Proporcionalidad:* Los datos personales recolectados (nombres completos, cédula/pasaporte, correo electrónico, teléfono y requerimientos de estancia) se tratan única y exclusivamente para los fines indispensables de: formalización de la reserva, registro de recepción (*check-in/check-out*), emisión de comprobantes electrónicos autorizados ante el SRI y reporte reglamentario de alojamiento turístico. Queda expresamente prohibida la comercialización, cesión o transferencia no autorizada de datos personales a terceros.
  * *Ejercicio de Derechos ARCO:* Mecanismos operativos para atender oportunamente solicitudes de los huéspedes relativas al ejercicio de sus derechos de Acceso, Rectificación, Cancelación y Oposición respecto a su información personal registrada.
  * *Trazabilidad y Auditoría de Accesos:* Registro cronológico inalterable (audit logs) con marcas de tiempo, usuario y dirección IP para toda consulta, modificación, exportación o descarga de datos personales de huéspedes por parte del personal del hotel (recepcionistas, administradores), garantizando el principio de responsabilidad proactiva (*accountability*).
  * *Plazo de Conservación y Supresión Segura:* Los datos asociados a transacciones tributarias se conservarán durante el plazo legal obligatorio de 7 años exigido por el Código Tributario del SRI, procediéndose posteriormente a su disociación o anonimización definitiva.
* **RNF-05 (Diseño Adaptable y Responsivo Multidispositivo):** Interfaz del huésped 100% responsiva para pantallas móviles (smartphones de 360px a 430px); panel operativo optimizado para computadoras de escritorio de recepción y tablets.
* **RNF-06 (Cumplimiento Legal y Tributario SRI):** Archivos XML generados conformes 100% con los esquemas XSD vigentes del Servicio de Rentas Internas del Ecuador, con cálculo ponderado de Clave de Acceso Módulo 11 (49 dígitos), liquidación de IVA ordinario (15%) o feriado (8%), y registro condicional de la tasa del 10% de servicio turístico en la etiqueta `<propina>`.
* **RNF-07 (Confiabilidad y Disponibilidad Continua):** Nivel de disponibilidad del servicio del 99.5% de uptime durante los periodos de mayor afluencia turística en Manta (Carnaval, Feriados Nacionales, Fiestas de Comercio y Cantonización de Manta).
* **RNF-08 (Integridad Transaccional y Control de Concurrencia):** Control de transacciones atómicas bajo propiedades ACID en la base de datos, con bloqueo pesimista/optimista a nivel de registro para garantizar que ninguna habitación sea sobrevendida (*overbooking*) ante reservas concurrentes simultáneas.
* **RNF-09 (Aislamiento de Información Multi-Tenant):** Mecanismos de seguridad lógica a nivel de consultas y contexto de sesión que impiden de forma absoluta que usuarios de un establecimiento puedan visualizar, consultar o modificar datos, reservas, ingresos o huéspedes de otro hotel.

---

## 6. Reglas de Negocio Oficiales (SRI y Operativa Hotelera Manta)

### RN-SRI-01: Algoritmo de la Clave de Acceso SRI (49 Dígitos)
La clave de acceso del comprobante electrónico se genera aplicando el algoritmo ponderado Módulo 11 con ponderadores cíclicos `[2, 3, 4, 5, 6, 7]` de derecha a izquierda sobre los primeros 48 dígitos. Si el residuo es 11 el dígito verificador es `0`; si el residuo es 10 el dígito verificador es `1`.

### RN-SRI-02: Conmutador de IVA Ordinario (15%) y Feriados Turísticos (8%) por Decreto
La tarifa general de IVA vigente en el Ecuador es del 15%. Durante feriados nacionales turísticos, la Presidencia de la República dispone la reducción de tarifa al 8% mediante Decreto Ejecutivo, el cual muchas veces es anunciado de un día para otro. Por ello, el sistema dispone de un conmutador rápido de emergencia que permite conmutar la tasa del 15% al 8% en tiempo real, impactando de inmediato en el motor de reservas, el RIDE y el código de porcentaje SRI de los comprobantes electrónicos generados.

### RN-HOT-01: Parametrización del 10% de Servicio Turístico por Hotel
De conformidad con el Art. 41 de la Ley de Turismo del Ecuador:
1. Los establecimientos turísticos pueden cobrar el 10% por concepto de propina/servicio para sus trabajadores sobre el valor de los servicios de alojamiento.
2. **Este recargo no es obligatorio para todos los establecimientos**: la mayoría de hostales (categorías 1 y 2 estrellas) no aplican esta tasa y cobran el valor neto, mientras que los hoteles de mayor categoría sí la facturan.
3. El sistema incorpora un parámetro booleano por hotel (`grava_servicio_10`):
   * **Cuando está ACTIVADO:**
     * En periodo ordinario: $\text{Total} = \text{Subtotal} + (15\% \times \text{Subtotal}) + (10\% \times \text{Subtotal}) = \text{Subtotal} \times 1.25$ (+25% total).
     * En feriado con IVA al 8%: $\text{Total} = \text{Subtotal} + (8\% \times \text{Subtotal}) + (10\% \times \text{Subtotal}) = \text{Subtotal} \times 1.18$ (+18% total).
     * La tasa del 10% se calcula estrictamente sobre el Subtotal neto sin impuestos (no genera IVA sobre la propina).
     * El comprobante del SRI incluye el valor en el campo `<propina>`.
   * **Cuando está DESACTIVADO:**
     * En periodo ordinario: $\text{Total} = \text{Subtotal} + (15\% \times \text{Subtotal}) = \text{Subtotal} \times 1.15$ (+15% total).
     * En feriado con IVA al 8%: $\text{Total} = \text{Subtotal} + (8\% \times \text{Subtotal}) = \text{Subtotal} \times 1.08$ (+8% total).
     * El comprobante del SRI emite el campo `<propina>0.00</propina>`.
     * El portal web del huésped no muestra ningún recargo de servicio.
