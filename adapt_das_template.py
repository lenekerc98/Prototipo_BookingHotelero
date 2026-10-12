import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def adapt_document():
    workspace_dir = os.path.dirname(os.path.abspath(__file__))
    src_copy = os.path.join(workspace_dir, "template_copy.docx")
    
    if not os.path.exists(src_copy):
        print(f"Error: {src_copy} not found.")
        return

    doc = docx.Document(src_copy)
    print("Document loaded successfully. Transforming sections...")

    # =========================================================================
    # 1. PORTADA Y ENCABEZADOS PRINCIPALES
    # =========================================================================
    if len(doc.paragraphs) > 17:
        doc.paragraphs[16].text = "DOCUMENTO DE DISEÑO DETALLADO DE SOFTWARE"
        doc.paragraphs[17].text = "Sistema de Gestión, Administración y Reservas Hoteleras del Cantón Manta, Ecuador"
        if len(doc.paragraphs) > 18:
            doc.paragraphs[18].text = "Plantilla inspirada en el estándar IEEE 1016-2009 y adaptada a las necesidades del curso de Diseño y Arquitectura de Software\n(Plantilla compilada por Ph.D. Franklin Parrales B.)"

    # =========================================================================
    # 2. INTRODUCCIÓN Y OBJETIVOS
    # =========================================================================
    for i, p in enumerate(doc.paragraphs):
        t = p.text.strip()
        if "El presente documento tiene como objetivo definir" in t:
            p.text = (
                "El presente documento tiene como objetivo definir, analizar y formalizar la arquitectura de software, "
                "las especificaciones funcionales y el diseño técnico del 'Sistema de Gestión de Servicios Operativos, Motor de Reservas "
                "y Facturación Electrónica en Establecimientos de Alojamiento del Cantón Manta, Ecuador' (CUP: 91880000.0000.390820). "
                "Esta propuesta técnica articula los patrones de integración comercial multihotel, esquemas de disponibilidad de habitaciones, "
                "pasarelas de cobro digitales locales (PayPhone/DeUna), emisión de facturación electrónica autorizada ante el SRI con desglose "
                "flexible de IVA (15% u 8%) y la parametrización de la tasa del 10% de servicio turístico por establecimiento según el Art. 41 de la "
                "Ley de Turismo del Ecuador; mitigando la brecha digital en la planta hotelera del cantón Manta, provincia de Manabí."
            )
        elif "Para la secretaría de la empresa CAMIONCITOS" in t:
            p.text = (
                "Para los establecimientos de alojamiento turístico del cantón Manta (hoteles, hostales y hosterías), "
                "el sistema es una plataforma web integral que centraliza la comercialización mediante un motor de reservas directo, "
                "agiliza la recepción operativa con check-in y check-out en tiempo real, administra cupos y temporadas con conmutador de IVA (15%/8%), "
                "y emite comprobantes electrónicos autorizados ante el SRI incorporando la activación o desactivación de la tasa del 10% de servicio turístico."
            )
        elif "A diferencia del proceso actual a seguir, en el que la secretaría tiene dificultades" in t:
            p.text = (
                "A diferencia de la gestión manual actual (cuadernos de notas y chats de WhatsApp con alto riesgo de sobreventa y comisiones de OTAs del 18%), "
                "la plataforma permite a los establecimientos hoteleros de Manta automatizar su inventario en tiempo real, cobrar con pasarelas locales y retener el 100% de su margen operativo."
            )
        elif "El sistema no cuenta con una aplicación móvil." in t or "El sistema no cuenta con una aplicación web." in t:
            p.text = "1. El sistema no incluye módulos ERP pesados de operación interna (comandas de restaurante, lavandería industrial, minibar o almacenes)."
        elif "El sistema no contempla una interacción directa entre la secretaría y los choferes." in t:
            p.text = "2. El sistema no contempla mediciones de huella de carbono, planillas de consumo de agua/electricidad ni semáforos ambientales GAD."
        elif "Cada usuario podrá generar un listado de sus viajes de entrega" in t:
            p.text = "Integración con cerraduras inteligentes (Smart Locks) con código generado automáticamente para el huésped."
        elif "La aplicación tendrá una ventana de chat con un Bot" in t:
            p.text = "Asistente virtual de hospitalidad vía WhatsApp para consultas del huésped sobre su reserva y atractivos turísticos de Manta."

    # Eliminar párrafos vacíos o residuales que mencionen camioncitos o choferes
    for p in doc.paragraphs:
        if "CAMIONCITOS" in p.text.upper() or "CHOFER" in p.text.upper() or "KILOMETRAJE" in p.text.upper():
            p.text = p.text.replace("CAMIONCITOS S.A", "Sector Hotelero de Manta").replace("Camioncitos S.A", "Sector Hotelero de Manta").replace("choferes", "huéspedes").replace("chofer", "huésped").replace("vehículos", "habitaciones").replace("vehículo", "habitación").replace("rutas", "reservas").replace("ruta", "reserva")

    # =========================================================================
    # 3. TABLA 0: DEFINICIONES, ACRÓNIMOS Y ABREVIATURAS
    # =========================================================================
    print("Updating Table 0 (Definiciones)...")
    tbl0 = doc.tables[0]
    hotel_defs = [
        ("Check-in", "Registro de ingreso formal del huésped al hotel y asignación de habitación.", "Ingreso / Entrada", "In"),
        ("Check-out", "Liquidación de cuenta, cobro de saldos y entrega de habitación por salida.", "Salida / Egreso", "Out"),
        ("Overbooking", "Sobreventa de habitaciones por encima de la capacidad física disponible.", "Sobreventa", "Overbk"),
        ("SRI", "Servicio de Rentas Internas del Ecuador, entidad tributaria oficial.", "Adm. Tributaria", "SRI"),
        ("RIDE", "Representación Impresa del Documento Electrónico según normativa SRI.", "Factura PDF", "RIDE"),
        ("Clave de Acceso", "Código numérico de 49 dígitos generado con Módulo 11 que identifica la factura.", "Clave SRI", "CA"),
        ("Módulo 11", "Algoritmo matemático oficial para el cálculo del dígito verificador del SRI.", "Algoritmo SRI", "Mod11"),
        ("Tasa Servicio 10%", "Recargo legal de servicio/propina (Art. 41 Ley de Turismo), configurable por hotel.", "Propina Legal 10%", "Serv10"),
        ("IVA Turístico 8%", "Tarifa reducida de IVA para feriados nacionales por Decreto Ejecutivo.", "IVA Feriado", "IVA 8%"),
        ("Base Imponible", "Subtotal neto gravado del hospedaje sin impuestos ni servicios adicionales.", "Subtotal Neto", "Base"),
        ("Rate Plan", "Plan de tarifa comercial (Con desayuno, Sin desayuno, No reembolsable, Flexible).", "Paquete Tarifario", "RP"),
        ("Multi-tenant", "Arquitectura donde múltiples hoteles operan con aislamiento estricto de datos.", "Multihotel", "MT"),
        ("Catastro Manta", "Registro oficial del Ministerio de Turismo de alojamientos en Manta 2026.", "Catastro Turístico", "Cat"),
        ("Revenue Manager", "Especialista o módulo de optimización de precios, cupos y temporadas.", "Gestión Tarifas", "Rev"),
        ("Voucher QR", "Comprobante digital de reserva con código QR para presentación en recepción.", "Cupón Digital", "QR"),
        ("PayPhone / DeUna", "Pasarelas de cobro digital ecuatorianas para tarjetas y transferencias bancarias.", "Pasarelas Locales", "Pay"),
        ("LOPDP", "Ley Orgánica de Protección de Datos Personales del Ecuador (R.O. Suplemento 459, 2021).", "Ley Datos Personales", "LOPDP"),
        ("Derechos ARCO", "Derechos de Acceso, Rectificación, Cancelación y Oposición del titular de datos.", "Protección Datos", "ARCO"),
    ]

    for idx, d in enumerate(hotel_defs):
        if idx + 1 < len(tbl0.rows):
            row = tbl0.rows[idx + 1]
            row.cells[0].text = d[0]
            row.cells[1].text = d[1]
            row.cells[2].text = d[2]
            row.cells[3].text = d[3]

    # =========================================================================
    # 4. TABLA 1: AUDIENCIA / STAKEHOLDERS
    # =========================================================================
    print("Updating Table 1 (Audiencia)...")
    tbl1 = doc.tables[1]
    stakeholders_data = [
        ("Admin Hotel", "Usuario directo", "Configurar datos comerciales/fiscales, activar/desactivar tasa 10% de servicio y crear usuarios.", "Garantizar la rentabilidad y cumplimiento fiscal del establecimiento.", "Aumento de reservas directas y facturación SRI sin errores.", "Tiempos de capacitación y fallas de conexión.", "Manejo de computadoras y paneles de administración."),
        ("Recepcionista", "Usuario directo", "Recibir reservas, confirmar estancias, check-in, check-out, links de cobro y emitir factura SRI.", "Atención ágil al huésped sin fricciones en mostrador.", "Procesar check-in y facturación en menos de 2 minutos.", "Caídas de red y sobreventa de habitaciones.", "Manejo ágil de navegadores web y pasarelas de pago."),
        ("Revenue Manager", "Usuario directo", "Configurar tarifas base, apertura/cierre de cupos, temporadas y bloqueos por mantenimiento.", "Maximizar ingresos y ocupación hotelera evitando sobreventas.", "Optimización tarifaria en feriados con conmutador IVA 8%.", "Pérdida de competitividad y fechas cerradas por error.", "Manejo de calendarios tarifarios y hojas de cálculo."),
        ("Huésped / Turista", "Usuario directo web", "Buscar disponibilidad, comparar opciones con desglose claro de impuestos, pagar y obtener voucher.", "Reservar alojamiento de forma transparente, rápida y segura en Manta.", "Confirmación inmediata con código QR y sin cargos ocultos.", "Cobros indebidos o habitación no disponible al llegar.", "Uso de teléfonos inteligentes y pagos digitales."),
    ]
    for idx, s in enumerate(stakeholders_data):
        if idx + 1 < len(tbl1.rows):
            row = tbl1.rows[idx + 1]
            for c_idx, val in enumerate(s):
                if c_idx < len(row.cells):
                    row.cells[c_idx].text = val

    # =========================================================================
    # 5. TABLA 2: RIESGOS Y MITIGACIÓN
    # =========================================================================
    print("Updating Table 2 (Riesgos)...")
    tbl2 = doc.tables[2]
    riesgos_data = [
        ("Indisponibilidad del Web Service del SRI durante alta demanda", "Media", "Alta", "Cola asíncrona de reintentos y generación de clave de acceso Módulo 11 en modo contingencia.", "Equipo de Desarrollo / Arquitecto"),
        ("Sobreventa (overbooking) en temporadas de feriados en Manta", "Media", "Alta", "Control transaccional atómico ACID en la base de datos con descuento inmediato de inventario.", "Líder Técnico / DB Admin"),
        ("Resistencia inicial de propietarios de hostales pequeños al uso del software", "Alta", "Media", "Diseño de interfaz ultra-intuitiva (<= 2 clics) y programa de capacitación simplificado.", "Coordinador de Implantación"),
        ("Error en la aplicación indebida del 10% de servicio en hostales no gravados", "Baja", "Alta", "Parámetro booleano rígido por hotel (grava_servicio_10) con bloqueo automático de cálculo.", "Analista Funcional / QA"),
        ("Interrupción de internet en recepción durante el check-in de huéspedes", "Media", "Media", "Soporte de caché local PWA en navegador para registro de arribos y posterior sincronización.", "Equipo de Desarrollo Frontend"),
        ("Riesgo de sanciones por infracción a la Ley de Protección de Datos (LOPDP)", "Baja", "Alta", "Consentimiento informado obligatorio, tokenización PCI-DSS y auditoría estricta de accesos.", "Oficial de Cumplimiento / Seguridad"),
    ]
    for idx, r in enumerate(riesgos_data):
        if idx + 1 < len(tbl2.rows):
            row = tbl2.rows[idx + 1]
            for c_idx, val in enumerate(r):
                if c_idx < len(row.cells):
                    row.cells[c_idx].text = val

    # =========================================================================
    # 6. TABLAS 3 A 32: REQUISITOS FUNCIONALES (RF-1 A RF-30)
    # =========================================================================
    print("Updating Tables 3-32 (Requisitos Funcionales)...")
    rf_list = [
        ("RF-1", "Búsqueda interactiva de habitaciones por fechas y aforo", "El sistema dispondrá de una barra superior con selectores de fechas (check-in/check-out) y aforo de personas, recalculando la disponibilidad en tiempo real.", "Funcional - Motor Reservas", "Validación de fechas coherentes (check-out posterior a check-in), aforo de adultos y niños, recalculo dinámico instantáneo.", "Alta"),
        ("RF-2", "Matriz interactiva de disponibilidad y habitaciones", "Presentación de la oferta de habitaciones en una matriz comparativa con 6 columnas estándar de la industria hotelera.", "Funcional - Interfaz Huésped", "Columnas: Tipo de Habitación, Capacidad, Precio total con desglose, Tus Opciones, Selector numérico y botón Reservaré.", "Alta"),
        ("RF-3", "Desglose tributario flexible y tasa del 10% de servicio", "Visualización transparente del Subtotal Neto, IVA (15% u 8%) y Tasa del 10% de Servicio Turístico si el hotel lo tiene activo.", "Funcional - Cotización y Tarifas", "Si el hotel grava 10%: +25% ordinario o +18% feriado. Si el hotel no grava servicio: +15% ordinario o +8% feriado.", "Alta"),
        ("RF-4", "Autenticación de huésped y reserva como invitado", "Acceso mediante Google OAuth 2.0, registro correo/contraseña y modo Guest Checkout sin registro previo obligatorio.", "Funcional - Seguridad Huésped", "Permite completar reserva en menos de 2 minutos y ofrece creación opcional de cuenta al finalizar el voucher.", "Alta"),
        ("RF-5", "Selección de paquetes de reserva y Rate Plans", "Configuración de opciones comerciales: con desayuno vs solo habitación, tarifa flexible vs no reembolsable con descuento.", "Funcional - Planes de Tarifa", "Permite elegir entre pagar ahora con descuento digital o pagar al llegar al establecimiento.", "Alta"),
        ("RF-6", "Ficha técnica y galería multimedia por habitación", "Apertura de galería HD, metraje exacto en m², tipo de vista (al mar, ciudad, piscina), camas y amenidades.", "Funcional - Catálogo", "Visualización responsiva en carrusel fotográfico con etiquetas descriptivas claras.", "Media"),
        ("RF-7", "Selección de servicios agregados y adicionales (Add-ons)", "Catálogo de extras opcionales: traslados Aeropuerto Manta <-> Hotel, late check-out, desayunos y tours locales.", "Funcional - Ventas Cruzadas", "Suma automática de rubros extras a la base imponible de la cotización final.", "Media"),
        ("RF-8", "Geolocalización y mapa interactivo de Manta", "Ubicación geográfica exacta del hotel en su parroquia (Manta, Tarqui, Los Esteros, etc.) e indicadores de distancia a atractivos.", "Funcional - Geolocalización", "Muestra distancias en minutos a Playa El Murciélago, Mall del Pacífico, Terminal Terrestre y Aeropuerto Eloy Alfaro.", "Media"),
        ("RF-9", "Comentarios y calificaciones de huéspedes verificados", "Puntuación de 1 a 10 con total de opiniones, desglose por criterios (limpieza, ubicación, atención, WiFi) y reseñas reales.", "Funcional - Reputación Online", "Solo pueden calificar huéspedes que hayan completado una estancia real con check-out verificado.", "Media"),
        ("RF-10", "Emisión de voucher digital con código QR único", "Generación instantánea de voucher alfanumérico (ej: RES-CS-201) con código QR y envío automático a correo y WhatsApp.", "Funcional - Comprobante Reserva", "Código QR escaneable por el recepcionista para confirmación inmediata en mostrador.", "Alta"),
        ("RF-11", "Bandeja de reservas entrantes en tiempo real para recepción", "Vista centralizada con nuevas reservas clasificadas por: Nueva, Confirmada, En Casa (Check-in), Finalizada y Cancelada.", "Funcional - Recepción Operativa", "Actualización en tiempo real con alertas sonoras/visuales al ingresar una nueva reserva.", "Alta"),
        ("RF-12", "Confirmación y apertura de detalle de reserva recibida", "Ficha operativa completa de la reserva con datos del huésped, fechas, paquetes elegidos, pagos y botón de confirmación en 1 clic.", "Funcional - Recepción", "Permite confirmar, registrar notas operativas o denegar con motivo documentado.", "Alta"),
        ("RF-13", "Check-in express y registro de identidad de huéspedes", "Validación de cédula/pasaporte del huésped al arribo y activación formal de la estancia con registro de hora.", "Funcional - Check-in", "Operación en 2 clics para no generar filas en recepción.", "Alta"),
        ("RF-14", "Generación de enlaces de cobro seguro (PayPhone/DeUna)", "Generación de link seguro con token hash y código QR para que el cliente liquide saldos desde su teléfono móvil.", "Funcional - Pagos Digitales", "Tokens de un solo uso con tiempo de caducidad configurable (24h/48h).", "Alta"),
        ("RF-15", "Check-out y liquidación final de la reserva", "Cierre de cuenta, verificación de pagos totales, liberación del cupo de habitación en el inventario vendible.", "Funcional - Check-out", "Desencadena automáticamente la emisión de la factura electrónica autorizada ante el SRI.", "Alta"),
        ("RF-16", "Directorio histórico de huéspedes frecuentes", "Búsqueda ágil de clientes anteriores por número de cédula o nombre para agilizar recepciones futuras.", "Funcional - CRM Huéspedes", "Historial de visitas pasadas, preferencias registradas y notas de servicio.", "Media"),
        ("RF-17", "Control de disponibilidad y cupos por fecha (Revenue)", "Calendario visual donde el Revenue Manager abre o cierra cupos de cada tipo de habitación para evitar sobreventas.", "Funcional - Revenue", "Sincronización instantánea con el motor de reservas público.", "Alta"),
        ("RF-18", "Configuración de planes de tarifa (Rate Plans)", "Parametrización de precios base, políticas flexibles vs no reembolsables y modalidades de pago.", "Funcional - Tarifas", "Multiplicadores automáticos según temporada y tipo de plan seleccionado.", "Alta"),
        ("RF-19", "Gestión de catálogo, fotos y metraje de habitaciones", "Administración de fotos HD, metros cuadrados (m²), tipos de cama y amenidades por tipo de habitación.", "Funcional - Inventario", "Subida de imágenes con compresión web y ordenamiento dinámico.", "Media"),
        ("RF-20", "Catálogo de servicios extras y adicionales", "Administración del catálogo de add-ons (traslados, desayunos, late check-out) con precios unitarios en USD.", "Funcional - Servicios Extras", "Precios en dólares americanos con indicación de gravamen tributario.", "Media"),
        ("RF-21", "Conmutador rápido de temporadas e IVA 15% / 8%", "Interruptor ágil de 1 clic para alternar entre régimen ordinario (IVA 15%) y feriados turísticos oficiales (IVA 8%).", "Funcional - Temporadas Tributarias", "Ajusta inmediatamente el motor de reservas, vouchers y parámetros de facturación electrónica.", "Alta"),
        ("RF-22", "Generación matemática de Clave de Acceso SRI (49 dígitos)", "Construcción algorítmica ponderada Módulo 11 del código numérico de 49 dígitos exigido por el SRI.", "Funcional - SRI Criptográfico", "Cumple estrictamente con la ficha técnica oficial del SRI Ecuador.", "Alta"),
        ("RF-23", "Liquidación tributaria flexible y tasa del 10% de servicio", "Emisión de factura electrónica con desglose exacto de Subtotal 15%/8%, IVA, Propina 10% (si aplica) y Total en USD.", "Funcional - Facturación SRI", "Si el hotel tiene 10% activo se asigna en <propina>; si no, se emite en 0.00.", "Alta"),
        ("RF-24", "Emisión de comprobante RIDE en PDF y XML firmado", "Generación de factura con código de barras y envío automático del PDF y XML autorizado al correo del huésped.", "Funcional - Comprobantes SRI", "Descarga directa de RIDE y validación de estado AUTORIZADO ante el SRI.", "Alta"),
        ("RF-25", "Configuración de Tasa de Servicio del 10% por Hotel", "Conmutador independiente por establecimiento para activar o desactivar el cobro del 10% de propina legal (Art. 41 Ley Turismo).", "Funcional - Configuración Fiscal Hotel", "Permite que hostales operen sin recargo y hoteles de mayor gama cobren el 10% reglamentario.", "Alta"),
        ("RF-26", "Configuración fiscal SRI del establecimiento", "Registro de RUC (13 dígitos), razón social, nombre comercial, establecimiento (001), punto emisión (001) y régimen.", "Funcional - Datos Fiscales", "Configuración por establecimiento con validación de obligatoriedad contable.", "Alta"),
        ("RF-27", "Control de pasarelas y métodos de cobro locales", "Activación y configuración de pasarelas locales: PayPhone, DeUna, transferencias directas bancarias y efectivo.", "Funcional - Medios de Cobro", "Soporte para cobros móviles inmediatos mediante QR en recepción.", "Alta"),
        ("RF-28", "Bloqueo operativo de habitaciones por mantenimiento", "Función para marcar habitaciones en estado 'Mantenimiento / Fuera de Servicio', descontando cupos públicos.", "Funcional - Mantenimiento", "No altera reservas históricas ni reportes contables pasados.", "Media"),
        ("RF-29", "Aislamiento multi-tenant estricto por hotel", "Mecanismo de seguridad donde administradores y recepcionistas solo acceden a información de su propio hotel.", "Funcional - Multi-tenant", "Validación rígida a nivel de sesión, consultas SQL y lógica de negocio.", "Alta"),
        ("RF-30", "Gestión de usuarios y accesos del personal del hotel", "El Admin Hotel crea y administra cuentas de usuario para sus recepcionistas y revenue managers.", "Funcional - RBAC Usuarios", "Control de estados de usuario (activo, invitado, suspendido) y auditoría de último acceso.", "Alta"),
    ]

    for idx, rf in enumerate(rf_list):
        t_idx = idx + 3
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 7:
                tbl.rows[0].cells[1].text = rf[0]
                tbl.rows[1].cells[1].text = rf[1]
                tbl.rows[2].cells[1].text = rf[2]
                tbl.rows[3].cells[1].text = rf[3]
                tbl.rows[4].cells[1].text = rf[4]
                tbl.rows[5].cells[1].text = "Octubre 2026 Versión 3.1"
                tbl.rows[6].cells[1].text = rf[5]

    # =========================================================================
    # 7. TABLAS 33 A 42: REQUISITOS NO FUNCIONALES (RN-1 A RN-10)
    # =========================================================================
    print("Updating Tables 33-42 (Requisitos No Funcionales)...")
    rnf_list = [
        ("RN-1", "Compatibilidad con navegadores web modernos", "El sistema debe ejecutarse de forma óptima en Google Chrome, Mozilla Firefox, Microsoft Edge y Safari.", "No Funcional - Compatibilidad", "Soporte completo HTML5, CSS3 y JavaScript moderno en escritorio y móvil.", "Alta"),
        ("RN-2", "Rendimiento y tiempo de respuesta en cotización", "El motor de búsqueda debe responder en menos de 1.0 segundo bajo condiciones de conexión banda ancha estándar.", "No Funcional - Rendimiento", "Optimización de consultas SQL, indexación por fechas y caché de catálogo.", "Alta"),
        ("RN-3", "Usabilidad y eficiencia operativa en recepción", "El recepcionista debe poder recibir, validar y confirmar una reserva en no más de 2 clics.", "No Funcional - Usabilidad", "Interfaz ágil de mostrador diseñada para reducir fricciones y evitar filas.", "Alta"),
        ("RN-4", "Seguridad criptográfica y tokenización PCI-DSS", "Comunicaciones bajo protocolo HTTPS / TLS 1.3, cifrado AES-256 en reposo y tokens de cobro con hash SHA-256.", "No Funcional - Seguridad", "Cifrado integral de credenciales y no almacenamiento de datos sensibles de tarjetas de crédito.", "Alta"),
        ("RN-5", "Cumplimiento de la Ley de Protección de Datos Personales (LOPDP Ecuador)", "El sistema debe implementar los mandatos de la LOPDP (R.O. Suplemento 459, 2021): consentimiento explícito previo al pago, principio de finalidad y proporcionalidad estricta para reservas y SRI, derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), conservación legal por 7 años y auditoría inalterable de accesos a datos de huéspedes.", "No Funcional - Privacidad y Protección de Datos", "Aceptación obligatoria de políticas en reservas web, tokenización de pagos PCI-DSS sin almacenar tarjetas, registro de auditoría de accesos de recepción y atención a derechos ARCO.", "Alta"),
        ("RN-6", "Cumplimiento normativo y validación con esquema SRI", "Los archivos XML generados deben cumplir estrictamente con los esquemas XSD 1.1.0/2.1.0 del SRI Ecuador.", "No Funcional - Cumplimiento Legal", "Validación previa de estructura XML antes del envío al Web Service del SRI.", "Alta"),
        ("RN-7", "Diseño adaptable y responsivo multidispositivo", "La interfaz debe ser 100% responsiva para pantallas móviles (huéspedes en 360px a 430px) y escritorios (recepción).", "No Funcional - Portabilidad", "Diseño adaptativo de 360px a monitores 4K con controles táctiles amigables.", "Alta"),
        ("RN-8", "Disponibilidad continua y alta concurrencia", "Nivel de servicio mínimo del 99.5% de uptime durante feriados turísticos y festividades de Manta.", "No Funcional - Disponibilidad", "Arquitectura en la nube con escalabilidad automática ante picos de demanda.", "Alta"),
        ("RN-9", "Integridad transaccional y prevención de sobreventas", "Las reservas deben procesarse bajo transacciones atómicas ACID para garantizar consistencia de cupos.", "No Funcional - Confiabilidad", "Bloqueo a nivel de base de datos durante el proceso de reserva para evitar overbooking.", "Alta"),
        ("RN-10", "Aislamiento de datos en arquitectura multi-tenant", "Ningún establecimiento puede consultar ni modificar información de reservas de otro hotel.", "No Funcional - Confidencialidad", "Aislamiento estricto por hotel_id en cada consulta y sesión autenticada.", "Alta"),
    ]

    for idx, rn in enumerate(rnf_list):
        t_idx = idx + 33
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 7:
                tbl.rows[0].cells[1].text = rn[0]
                tbl.rows[1].cells[1].text = rn[1]
                tbl.rows[2].cells[1].text = rn[2]
                tbl.rows[3].cells[1].text = rn[3]
                tbl.rows[4].cells[1].text = rn[4]
                tbl.rows[5].cells[1].text = "Octubre 2026 Versión 3.1"
                tbl.rows[6].cells[1].text = rn[5]

    # =========================================================================
    # 8. TABLAS 43 A 45: ACTORES DEL SISTEMA (ACT-1 A ACT-3)
    # =========================================================================
    print("Updating Tables 43-45 (Actores)...")
    actors_info = [
        ("ACT-1", "Administrador del Hotel (Admin Hotel)", "Persona a cargo de la gestión general y tributaria de su establecimiento hotelero en Manta.", "Configura datos fiscales del hotel (RUC, establecimiento, punto de emisión), activa o desactiva la tasa del 10% de servicio turístico, administra usuarios internos (recepcionistas y revenue managers) y revisa reportes financieros.", "Establecimiento Hotelero de Manta"),
        ("ACT-2", "Recepcionista (Front Desk)", "Operador en mostrador encargado de la atención presencial y digital de reservas.", "Recibe reservas entrantes en tiempo real, verifica huéspedes, confirma estancias, ejecuta check-in y check-out, genera enlaces de cobro digital (PayPhone/DeUna) y emite la factura electrónica SRI.", "Recepción del Hotel"),
        ("ACT-3", "Encargado de Tarifas (Revenue Manager)", "Especialista comercial encargado de optimizar precios y disponibilidad de habitaciones.", "Abre y cierra cupos en el calendario para evitar sobreventas, configura tarifas base, planes comerciales (Rate Plans), temporadas con conmutador IVA 15%/8% y bloqueos por mantenimiento.", "Dirección Comercial del Hotel"),
    ]

    for idx, act in enumerate(actors_info):
        t_idx = idx + 43
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 5:
                tbl.rows[0].cells[1].text = act[0]
                tbl.rows[1].cells[1].text = act[1]
                tbl.rows[2].cells[1].text = act[2]
                tbl.rows[3].cells[1].text = act[3]
                tbl.rows[4].cells[1].text = act[4]

    # =========================================================================
    # 9. TABLA 46: LISTA DE CASOS DE USO
    # =========================================================================
    print("Updating Table 46 (Lista de Casos de Uso)...")
    tbl46 = doc.tables[46]
    for idx, rf in enumerate(rf_list):
        row_idx = idx + 1
        if row_idx < len(tbl46.rows):
            row = tbl46.rows[row_idx]
            row.cells[0].text = f"CU-{idx+1}"
            row.cells[1].text = rf[1]
            row.cells[2].text = "Media" if idx % 2 == 0 else "Alta"
            row.cells[3].text = "Alta"
            row.cells[4].text = "Alta"

    # =========================================================================
    # 10. TABLAS 47 A 76: FICHAS DE CASOS DE USO (CU-1 A CU-30)
    # =========================================================================
    print("Updating Tables 47-76 (Fichas de Casos de Uso)...")
    actor_names = ["Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Recepcionista", "Recepcionista", "Recepcionista", "Recepcionista", "Recepcionista", "Recepcionista", "Revenue Manager", "Revenue Manager", "Revenue Manager", "Revenue Manager", "Revenue Manager", "Recepcionista / Admin", "Recepcionista", "Recepcionista", "Admin Hotel", "Admin Hotel", "Admin Hotel", "Revenue Manager", "Admin Hotel", "Admin Hotel"]
    
    for idx, rf in enumerate(rf_list):
        t_idx = idx + 47
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            cu_num = f"CU-{idx+1}"
            rf_num = f"RF-{idx+1}"
            cu_name = rf[1]
            cu_actor = actor_names[idx] if idx < len(actor_names) else "Usuario del Sistema"
            
            for row in tbl.rows:
                c0_txt = row.cells[0].text.strip()
                if "IDENTIFICADOR" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"IDENTIFICADOR: {cu_num} | NOMBRE: {cu_name}"
                elif "REQUERIMIENTO FUNCIONAL" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"REQUERIMIENTO FUNCIONAL ASOCIADO: {rf_num}"
                elif "ACTORES:" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"ACTORES: {cu_actor}"
                elif "DESCRIPCIÓN:" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"DESCRIPCIÓN: El actor {cu_actor} ejecuta la función de {cu_name.lower()} en el sistema hotelero de Manta."
                elif "NOTAS:" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"NOTAS: La ejecución de {cu_num} se valida mediante permisos del rol correspondiente y reglas tributarias ecuatorianas."
                elif "CRITERIOS DE ACEPTACIÓN:" in c0_txt:
                    for cell in row.cells:
                        cell.text = f"CRITERIOS DE ACEPTACIÓN: La operación de {cu_name.lower()} se completa con éxito y actualiza el estado en tiempo real."
                elif "RIESGOS:" in c0_txt:
                    for cell in row.cells:
                        cell.text = "RIESGOS: Pérdida temporal de conexión a la base de datos o latencia de red."
                elif len(row.cells) >= 2 and row.cells[0].text.startswith("ES-"):
                    row.cells[1].text = f"DESCRIPCIÓN: {cu_actor} completa {cu_name.lower()} satisfactoriamente. RESULTADOS: El sistema actualiza la base de datos y emite respuesta inmediata."

    # =========================================================================
    # 11. TABLAS 79 A 110: DIAGRAMAS DE ANÁLISIS (DG-1 A DG-30)
    # =========================================================================
    print("Updating Tables 79-110 (Diagramas de Análisis DG)...")
    dg_titles = [
        ("DG-1", "Búsqueda exitosa de habitaciones por fechas y aforo"),
        ("DG-2", "Consulta exitosa de matriz de disponibilidad y tarifas"),
        ("DG-3", "Desglose tarifario transparente (Base + IVA + 10% Servicio si aplica)"),
        ("DG-4", "Registro y autenticación de huésped (OAuth o Guest Checkout)"),
        ("DG-5", "Selección de planes de tarifa comercial (Rate Plans)"),
        ("DG-6", "Visualización de ficha técnica y galería HD de habitación"),
        ("DG-7", "Selección de servicios adicionales (traslados, late check-out, tours)"),
        ("DG-8", "Geolocalización del hotel y cálculo de distancias en Manta"),
        ("DG-9", "Publicación y consulta de opiniones de huéspedes verificados"),
        ("DG-10", "Generación y descarga de voucher digital con código QR"),
        ("DG-11", "Recepción de nueva reserva entrante en tiempo real"),
        ("DG-12", "Confirmación y apertura de detalle de reserva por recepcionista"),
        ("DG-13", "Ejecución exitosa de check-in express y registro de huéspedes"),
        ("DG-14", "Generación y envío de enlace de cobro seguro (PayPhone/DeUna)"),
        ("DG-15", "Check-out exitoso, cierre de estancia y liberación de habitación"),
        ("DG-16", "Consulta del directorio de huéspedes frecuentes"),
        ("DG-17", "Apertura y cierre de cupos en el calendario de Revenue"),
        ("DG-18", "Configuración de paquetes de tarifa y políticas de cancelación"),
        ("DG-19", "Gestión de catálogo, fotos y metraje de habitaciones"),
        ("DG-20", "Administración del catálogo de servicios adicionales (add-ons)"),
        ("DG-21", "Conmutación de temporadas y alternancia de IVA (15% u 8%)"),
        ("DG-22", "Generación algorítmica de Clave de Acceso SRI (49 dígitos)"),
        ("DG-23", "Emisión exitosa de factura electrónica SRI con desglose legal"),
        ("DG-24", "Generación y descarga de comprobante RIDE en PDF y XML firmado"),
        ("DG-25", "Activación o desactivación de la tasa del 10% de servicio por hotel"),
        ("DG-26", "Registro y actualización de datos fiscales SRI del hotel"),
        ("DG-27", "Configuración de pasarelas de pago y cuentas bancarias locales"),
        ("DG-28", "Bloqueo operativo de habitación por mantenimiento"),
        ("DG-29", "Aislamiento multi-tenant entre establecimientos hoteleros"),
        ("DG-30", "Creación y asignación de roles a usuarios del hotel"),
    ]
    for idx, (dg_id, dg_title) in enumerate(dg_titles):
        t_idx = 79 + idx
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 2:
                tbl.rows[0].cells[1].text = dg_id
                tbl.rows[1].cells[1].text = dg_title
                if len(tbl.rows) >= 4:
                    tbl.rows[2].cells[1].text = f"El actor ejecuta exitosamente {dg_title.lower()} a través de la plataforma hotelera."

    # =========================================================================
    # 12. TABLAS 111 A 123: INTERFACES DE USUARIO (UI-01 A UI-12)
    # =========================================================================
    print("Updating Tables 111-123 (Interfaces de Usuario UI)...")
    ui_titles = [
        ("UI-01", "Portal Huésped - Barra de Búsqueda y Filtros de Fechas"),
        ("UI-02", "Portal Huésped - Matriz de Disponibilidad y Tarifas"),
        ("UI-03", "Portal Huésped - Ficha Técnica y Galería de Habitación"),
        ("UI-04", "Portal Huésped - Checkout y Resumen de Reserva"),
        ("UI-05", "Portal Huésped - Voucher Digital con Código QR"),
        ("UI-06", "Panel Recepción - Bandeja de Reservas Entrantes en Tiempo Real"),
        ("UI-07", "Panel Recepción - Ficha de Reserva, Check-in y Check-out"),
        ("UI-08", "Panel Recepción - Generador de Enlaces de Cobro Seguro"),
        ("UI-09", "Panel Facturación - Emisión de Factura SRI y Visor RIDE"),
        ("UI-10", "Panel Revenue - Calendario de Cupos y Disponibilidad"),
        ("UI-11", "Panel Revenue - Conmutador de Temporadas e IVA (15%/8%)"),
        ("UI-12", "Panel Hotel - Switch de Tasa 10% de Servicio y Datos Fiscales SRI"),
    ]
    for idx, (ui_id, ui_title) in enumerate(ui_titles):
        t_idx = 111 + idx
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 2:
                tbl.rows[0].cells[1].text = ui_id
                tbl.rows[1].cells[1].text = ui_title
                if len(tbl.rows) >= 4:
                    tbl.rows[2].cells[1].text = f"Interfaz interactiva del sistema que permite la interacción del usuario para {ui_title.lower()}."

    # =========================================================================
    # 13. PÁRRAFOS DE DEFINICIÓN DE ENTIDADES DE BASE DE DATOS
    # =========================================================================
    for p in doc.paragraphs:
        t = p.text.strip()
        if "Columna: Cliente" in t:
            p.text = "Tabla: Hotel (Entidad Central y Datos Fiscales con switch grava_servicio_10)"
        elif "Columna: Entregas" in t:
            p.text = "Tabla: Tipo_Habitacion (Catálogo de Tipos y Precios Base)"
        elif "Columna: Factura" in t:
            p.text = "Tabla: Habitacion (Unidades Físicas e Inventario Operativo)"
        elif "Columna: Ruta" in t:
            p.text = "Tabla: Huesped (Directorio de Clientes y Turistas)"
        elif "Columna: Secretaria" in t:
            p.text = "Tabla: Reserva (Control de Estadías, Check-in y Check-out)"
        elif "Columna: Vehículo" in t or "Columna: Vehculo" in t:
            p.text = "Tabla: Factura_SRI (Facturación Electrónica SRI con IVA y Propina)"
        elif "Columna: Choferes" in t:
            p.text = "Tabla: Pago (Transacciones Digitales PayPhone, DeUna y Transferencias)"
        elif "Secretaria y Ruta" in t:
            p.text = "Hotel y Habitaciones"
        elif "Chofer_Vehículo" in t or "Chofer_Vehculo" in t:
            p.text = "Huésped y Reserva"

    # =========================================================================
    # 14. TABLAS 124 A 131: DICCIONARIO DE DATOS Y BASE DE DATOS
    # =========================================================================
    print("Updating Tables 124-131 (Diccionario de Datos)...")
    data_dict_tables = [
        # Table 124: hotel
        [
            ("PK", "hotel_id", "VARCHAR(50)", "Sí", "Sí", "Identificador único del establecimiento hotelero"),
            ("", "nombre_comercial", "VARCHAR(150)", "Sí", "No", "Nombre comercial público del hotel o hostal"),
            ("", "razon_social", "VARCHAR(150)", "Sí", "No", "Razón social jurídica inscrita en el SRI"),
            ("", "ruc", "CHAR(13)", "Sí", "Sí", "Registro Único de Contribuyentes oficial de 13 dígitos"),
            ("", "grava_servicio_10", "BOOLEAN", "Sí", "No", "Art. 41 Ley Turismo: TRUE si cobra 10% propina, FALSE si exento"),
        ],
        # Table 125: tipo_habitacion
        [
            ("PK", "tipo_habitacion_id", "UUID", "Sí", "Sí", "Identificador único de la categoría de habitación"),
            ("FK", "hotel_id", "VARCHAR(50)", "Sí", "No", "Relación con la tabla hotel"),
            ("", "codigo", "VARCHAR(30)", "Sí", "No", "Código de categoría (ej: IND-01, DOB-02)"),
            ("", "nombre", "VARCHAR(100)", "Sí", "No", "Nombre descriptivo (Doble Estándar Balcón)"),
            ("", "precio_base", "NUMERIC(10,2)", "Sí", "No", "Tarifa base en USD para temporada regular"),
        ],
        # Table 126: habitacion
        [
            ("PK", "habitacion_id", "UUID", "Sí", "Sí", "Identificador único de la habitación física"),
            ("FK", "hotel_id", "VARCHAR(50)", "Sí", "No", "Relación con el hotel propietario"),
            ("FK", "tipo_habitacion_id", "UUID", "Sí", "No", "Relación con el tipo de habitación"),
            ("", "numero", "VARCHAR(10)", "Sí", "No", "Número o identificador visible de la habitación"),
            ("", "estado", "VARCHAR(20)", "Sí", "No", "Estado: disponible, ocupada, mantenimiento, limpieza"),
        ],
        # Table 127: huesped
        [
            ("PK", "huesped_id", "UUID", "Sí", "Sí", "Identificador único del cliente/huésped"),
            ("", "tipo_identificacion", "VARCHAR(10)", "Sí", "No", "Cédula (05), RUC (04) o Pasaporte (06)"),
            ("", "identificacion", "VARCHAR(20)", "Sí", "Sí", "Número de documento de identidad del huésped"),
            ("", "nombres", "VARCHAR(100)", "Sí", "No", "Nombres completos del huésped"),
            ("", "email", "VARCHAR(120)", "Sí", "No", "Correo electrónico para envío de voucher y factura SRI"),
        ],
        # Table 128: reserva
        [
            ("PK", "reserva_id", "UUID", "Sí", "Sí", "Identificador único de la reserva"),
            ("", "codigo_reserva", "VARCHAR(30)", "Sí", "Sí", "Código único alfanumérico visible (RES-CS-101)"),
            ("FK", "hotel_id", "VARCHAR(50)", "Sí", "No", "Hotel donde se realiza la estancia"),
            ("FK", "huesped_id", "UUID", "Sí", "No", "Huésped titular de la reserva"),
            ("", "total_usd", "NUMERIC(12,2)", "Sí", "No", "Monto total liquidado con impuestos y servicio"),
        ],
        # Table 129: factura_sri
        [
            ("PK", "factura_id", "UUID", "Sí", "Sí", "Identificador de la factura electrónica"),
            ("", "numero_factura", "VARCHAR(20)", "Sí", "Sí", "Formato secuencial SRI: 001-002-000000001"),
            ("", "clave_acceso", "CHAR(49)", "Sí", "Sí", "Clave oficial SRI de 49 dígitos con Módulo 11"),
            ("", "subtotal_15", "NUMERIC(12,2)", "Sí", "No", "Base imponible de alojamiento"),
            ("", "propina_servicio", "NUMERIC(12,2)", "Sí", "No", "10% de propina si hotel tiene grava_servicio_10=TRUE"),
        ],
        # Table 130: pago
        [
            ("PK", "pago_id", "UUID", "Sí", "Sí", "Identificador de la transacción de pago"),
            ("FK", "reserva_id", "UUID", "Sí", "No", "Reserva asociada al cobro"),
            ("", "metodo_pago", "VARCHAR(50)", "Sí", "No", "PayPhone, DeUna, Tarjeta Datafast, Efectivo"),
            ("", "monto_usd", "NUMERIC(12,2)", "Sí", "No", "Valor pagado en dólares americanos"),
            ("", "estado", "VARCHAR(20)", "Sí", "No", "Estado del pago: completed, pending, failed"),
        ],
    ]

    for tbl_offset, table_data in enumerate(data_dict_tables):
        t_idx = 124 + tbl_offset
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            for row_idx, r_data in enumerate(table_data):
                t_row_idx = row_idx + 1
                if t_row_idx < len(tbl.rows):
                    row = tbl.rows[t_row_idx]
                    for col_idx, val in enumerate(r_data):
                        if col_idx < len(row.cells):
                            row.cells[col_idx].text = val

    # Table 131: Asociaciones de Base de Datos
    if 131 < len(doc.tables):
        tbl131 = doc.tables[131]
        asoc_data = [
            ("Hotel y Habitaciones", "Poseer / Administrar", "Un hotel posee de 1 a N habitaciones e inventario."),
            ("Hotel y Factura_SRI", "Emitir", "Un hotel emite N facturas electrónicas autorizadas ante el SRI."),
            ("Huésped y Reserva", "Solicitar", "Un huésped solicita 1 a N reservas de hospedaje."),
        ]
        for row_idx, r_data in enumerate(asoc_data):
            t_row_idx = row_idx + 1
            if t_row_idx < len(tbl131.rows):
                row = tbl131.rows[t_row_idx]
                for col_idx, val in enumerate(r_data):
                    if col_idx < len(row.cells):
                        row.cells[col_idx].text = val

    # Guardar documento modificado
    out_workspace = os.path.join(workspace_dir, "FRPB-DAS-PLANTILLA-ESPECIFICACION-DISENO.docx")
    doc.save(out_workspace)
    print(f"Document saved to workspace: {out_workspace}")

    out_neil_mod = r"C:\Users\leneker\OneDrive\Neil\FRPB-DAS-PLANTILLA-ESPECIFICACION-DISENO_MODIFICADO.docx"
    try:
        doc.save(out_neil_mod)
        print(f"Document saved to Neil folder: {out_neil_mod}")
    except Exception as e:
        print(f"Notice saving to Neil folder: {e}")

    # Intentar sobrescribir el archivo original si no está bloqueado
    orig_path = r"C:\Users\leneker\OneDrive\Neil\FRPB-DAS-PLANTILLA-ESPECIFICACION-DISENO.docx"
    try:
        doc.save(orig_path)
        print(f"Original file successfully overwritten: {orig_path}")
    except Exception as e:
        print(f"Original file is currently open in Word (locked). Saved to {out_neil_mod} for immediate access.")

if __name__ == '__main__':
    adapt_document()
