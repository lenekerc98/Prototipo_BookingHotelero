import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

TARGET_PATH = r"C:\Users\leneker\OneDrive\Neil\FRPB-DAS-PLANTILLA-ESPECIFICACION-DISENO_MODIFICADO.docx"

def update_document():
    if not os.path.exists(TARGET_PATH):
        print(f"Error: {TARGET_PATH} does not exist.")
        return

    doc = docx.Document(TARGET_PATH)
    print("Document loaded. Total paragraphs:", len(doc.paragraphs), "Total tables:", len(doc.tables))

    # Paleta de colores
    COLOR_PRIMARY = RGBColor(15, 76, 129)    # #0F4C81
    COLOR_DARK = RGBColor(33, 37, 41)        # #212529

    def format_run(run, font_name="Calibri", font_size=11, bold=False, italic=False, color=COLOR_DARK):
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = color

    # =========================================================================
    # 1. ACTUALIZACIÓN DE SECCIÓN 1: REQUISITOS FUNCIONALES (P119-P154)
    # =========================================================================
    print("Actualizando Requisitos Funcionales en texto...")
    
    # Encontrar el índice de 'Funcionales' (Heading 2)
    idx_func = -1
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip() == "Funcionales" and "Heading" in p.style.name:
            idx_func = i
            break
            
    idx_nofunc = -1
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip() == "No funcionales" and "Heading" in p.style.name:
            idx_nofunc = i
            break

    print(f"Indice Funcionales: {idx_func}, Indice No funcionales: {idx_nofunc}")

    # Lista estructurada de Requerimientos Funcionales
    rf_items = [
        # MODULO 1
        ("Módulo 1: Motor de Reservas y Experiencia del Huésped (Portal Público)", [
            ("RF-01 (Búsqueda y Cotización Dinámica)", "Selector interactivo de fechas (check-in / check-out), aforo (adultos, niños) y habitaciones, recalculando instantáneamente la disponibilidad de tipos de habitación y tarifas vigentes."),
            ("RF-02 (Autenticación Flexible del Huésped)", "Acceso con Google OAuth 2.0, registro con correo/contraseña y modalidad Guest Checkout (reserva como invitado) sin registro previo obligatorio para reducir abandono."),
            ("RF-03 (Desglose Tributario Transparente y Adaptativo)", "Visualización transparente de Subtotal Neto, IVA aplicable (15% ordinario u 8% en feriados decretados), Tasa del 10% de Servicio Turístico (únicamente si el hotel la tiene activa) y Total en USD."),
            ("RF-04 (Selección de Planes de Tarifa - Rate Plans)", "Opciones de reserva: Solo Alojamiento vs. Con Desayuno Incluido; y Tarifa Flexible (cancelación gratuita) vs. Tarifa No Reembolsable (con descuento promocional)."),
            ("RF-05 (Ficha Técnica y Galería Multimedia por Tipo de Habitación)", "Carrusel fotográfico HD, metraje en m², camas, vistas (mar, ciudad, piscina) e insignias de amenidades (A/C, WiFi, TV cable, baño privado)."),
            ("RF-06 (Servicios Complementarios de Alojamiento - Extras Opcionales)", "Extras directos de hospedaje: Transporte Aeropuerto Manta <-> Hotel (configurable por el hotel como gratis de cortesía, con costo en USD, o no disponible), cunas para bebés, camas supletorias o late check-out. Se excluyen tours."),
            ("RF-07 (Localización y Puntos de Interés en Manta)", "Ubicación geográfica en su parroquia (Manta, Tarqui, Barbasquillo, Santa Marianita, San Lorenzo) y tiempos a atractivos (Playa El Murciélago, Mall del Pacífico, Terminal, Aeropuerto)."),
            ("RF-08 (Reseñas y Calificaciones Verificadas)", "Puntuación de 1 a 10 y opiniones de huéspedes reales desglosadas por: Limpieza, Ubicación, Personal y Conectividad."),
            ("RF-09 (Voucher Digital de Reserva con Código QR)", "Comprobante oficial de confirmación con código alfanumérico único (ej. #RES-CS-201), fechas, tipo de habitación, desglose de pagos y código QR escaneable para validación inmediata en mostrador.")
        ]),
        # MODULO 2
        ("Módulo 2: Recepción y Operación de Mostrador (Front Desk)", [
            ("RF-10 (Bandeja de Reservas Entrantes en Tiempo Real)", "Pantalla operativa de recepción con reservas clasificadas por estado: Nueva/Por Confirmar, Confirmada, En Casa (Check-in), Finalizada (Check-out) y Cancelada."),
            ("RF-11 (Sistema de Alertas Inmediatas)", "Alertas visuales destacadas y avisos sonoros audibles en el panel del recepcionista al recibirse una nueva reserva desde el motor web."),
            ("RF-12 (Confirmación Ágil de Reserva)", "Apertura de ficha de reserva con verificación de servicios, notas del huésped y confirmación operativa en 1 clic."),
            ("RF-13 (Registro de Check-in en Mostrador - Sujeto a Disponibilidad Física)", "El check-in no es automático ni desatendido: depende de la llegada presencial del huésped y de la disponibilidad física de habitaciones listas, limpias e inspeccionadas por el hotel. Recepción valida cédula/pasaporte y entrega llaves físicas."),
            ("RF-14 (Asignación Manual de la Habitación Física por Recepción)", "El motor público solo vende Tipos de Habitación y cupos disponibles; jamás asigna un número físico. La asignación del número de habitación física concreta (ej. Habitación 204) la realiza manualmente recepción al preparar el arribo."),
            ("RF-15 (Generación de Links de Cobro Digital)", "Generación de enlaces de pago seguro (PayPhone/DeUna) con código QR en pantalla y envío por WhatsApp para saldos pendientes."),
            ("RF-16 (Check-out y Cierre de Cuenta)", "Registro de salida del huésped, verificación de saldo cero, liquidación de extras y liberación de la habitación física para limpieza."),
            ("RF-17 (Búsqueda Rápida en Directorio de Huéspedes)", "Búsqueda en mostrador por cédula o apellido para autocompletar recepciones y check-ins frecuentes.")
        ]),
        # MODULO 3
        ("Módulo 3: Revenue Management, Tarifas y Régimen Tributario Dinámico", [
            ("RF-18 (Control Dinámico de Cupos por Tipo de Habitación)", "Apertura y cierre de cupos por categoría en fechas determinadas para prevenir sobreventas (overbooking). El huésped solo ve cupos disponibles de la categoría."),
            ("RF-19 (Gestión Operativa Interna de Bloqueos por Mantenimiento)", "Baja temporal interna de habitaciones del inventario activo por daños o reparaciones, descontando cupos públicos de forma transparente sin exponer causas operativas al cliente."),
            ("RF-20 (Administración de Tarifas Base y Planes por el Revenue)", "El Revenue Manager define las tarifas base por noche de cada tipo de habitación, márgenes por aforo adicional y recargos por planes de desayuno."),
            ("RF-21 (Conmutador Rápido de Emergencia - IVA al 8% por Decreto Presidencial de Última Hora)", "Conmutador inmediato de 1 clic ('Activar Régimen Feriado IVA 8% por Decreto') disponible para el Revenue Manager y Admin Hotel ante decretos presidenciales emitidos de un día para otro, impactando al instante en cotizaciones web y facturación SRI.")
        ]),
        # MODULO 4
        ("Módulo 4: Facturación Electrónica SRI Ecuador", [
            ("RF-22 (Cálculo Oficial de Clave de Acceso de 49 Dígitos)", "Construcción matemática reglamentaria del SRI con algoritmo ponderado Módulo 11 (ponderadores 2 al 7 de derecha a izquierda)."),
            ("RF-23 (Estructuración del Comprobante XML v1.1.0)", "Generación del XML conforme a fichas técnicas del SRI con datos del emisor, comprador (Cédula/RUC/Pasaporte) y código de impuesto IVA (15% u 8%)."),
            ("RF-24 (Liquidación de la Tasa del 10% de Servicio Turístico en Factura SRI)", "Si el hotel tiene activa la tasa, se calcula el 10% sobre la base imponible y se coloca en la etiqueta <propina>; si está inactiva, se emite explícitamente en <propina>0.00</propina>."),
            ("RF-25 (Generación de RIDE en PDF y Validación)", "Emisión de la representación gráfica RIDE con código de barras de la clave de acceso, desglose tributario y envío por correo electrónico.")
        ]),
        # MODULO 5
        ("Módulo 5: Gestión de Catálogos Maestros y Operaciones CRUD", [
            ("RF-26 (CRUD de Hoteles / Alojamientos del Catastro)", "Superadmin registra, consulta con filtros (parroquia/categoría), modifica y aplica baja lógica a establecimientos del Catastro de Manta (118 alojamientos)."),
            ("RF-27 (CRUD de Tipos de Hotel)", "Superadmin administra modalidades oficiales según MINTUR: Hostal, Hotel, Hostería."),
            ("RF-28 (CRUD de Categorías de Hotel por Estrellas)", "Superadmin gestiona clasificación oficial de 1 a 5 estrellas con sus requisitos de calidad."),
            ("RF-29 (CRUD de Roles y Permisos del Sistema - RBAC)", "Superadmin define roles (Superadmin, Admin Hotel, Revenue Manager, Recepcionista, Huésped) y privilegios por módulo."),
            ("RF-30 (CRUD de Usuarios del Sistema y Asignación)", "Superadmin y Admin Hotel crean colaboradores con correo institucional único, contraseña cifrada (BCrypt), asociándolos obligatoriamente a un HotelId y RolId. Bloqueo lógico por cese laboral."),
            ("RF-31 (CRUD de Tipos de Habitación - Categorías Comerciales)", "Admin Hotel y Revenue Manager crean categorías comerciales (Matrimonial Superior, Suite, Doble Twin, capacidad máx, metraje m², fotos HD, camas y amenidades)."),
            ("RF-32 (CRUD de Habitaciones Físicas - Unidades de Inventario)", "Admin Hotel y Recepción crean unidades individuales (número ej. 101, piso/bloque, tipo asignado y estados: Disponible, Ocupada, Limpieza, Mantenimiento)."),
            ("RF-33 (CRUD de Temporadas y Tarifas por Plan - Pricing)", "El Revenue Manager define precios: temporadas (Alta, Baja, Feriados), planes (con/sin desayuno, flexible/no reembolsable) y tarifas por noche en USD."),
            ("RF-34 (CRUD de Huéspedes - Directorio y Perfil SRI)", "Recepción gestiona directorio con Cédula/Pasaporte, nombres, WhatsApp y datos de facturación SRI. Archivo/anonimización según LOPDP tras 7 años legales sin borrado físico contable."),
            ("RF-35 (CRUD de Parámetros Fiscales y 10% de Servicio)", "Admin Hotel configura RUC (13 dígitos), establecimiento 001, punto emisión 001, cuentas bancarias y el switch booleano de la tasa del 10% de servicio turístico.")
        ]),
        # MODULO 6
        ("Módulo 6: Superadministración y Gobernanza Cantonal de Manta", [
            ("RF-36 (Tablero Consolidado Turístico Cantonal)", "Métricas agregadas del cantón Manta: ocupación global, volumen de reservas, ingresos turísticos en USD y distribución por parroquias."),
            ("RF-37 (Alerta Cantonal Global de Decreto de IVA 8%)", "Herramienta cantonal para conmutar o alertar sugeridamente la activación del 8% de IVA ante decretos presidenciales imprevistos."),
            ("RF-38 (Aislamiento Lógico de Datos Multi-Tenant)", "Garantía de aislamiento lógico estricto donde ningún hotel puede consultar ni alterar datos o reservas de otro establecimiento."),
            ("RF-39 (Auditoría Global y Trazabilidad de Accesos)", "Bitácora inalterable (Audit Logs) con fecha, hora, usuario e IP de cada operación crítica y consulta de datos personales de huéspedes.")
        ])
    ]

    # Reemplazar párrafos vacíos entre idx_func e idx_nofunc
    if idx_func != -1 and idx_nofunc != -1:
        # Usaremos los párrafos existentes entre idx_func+1 e idx_nofunc
        available_slots = idx_nofunc - (idx_func + 1)
        print(f"Párrafos disponibles para RF: {available_slots}")
        
        # Flatten all items to lines
        content_lines = []
        for mod_title, items in rf_items:
            content_lines.append(("MOD", mod_title))
            for rf_code, rf_desc in items:
                content_lines.append(("ITEM", rf_code, rf_desc))
                
        # Llenar párrafos disponibles
        p_curr = idx_func + 1
        for item in content_lines:
            if p_curr < idx_nofunc:
                p = doc.paragraphs[p_curr]
                p.text = ""
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.line_spacing = 1.15
                
                if item[0] == "MOD":
                    p.paragraph_format.space_before = Pt(10)
                    r = p.add_run(item[1])
                    format_run(r, font_size=11, bold=True, color=COLOR_PRIMARY)
                else:
                    r1 = p.add_run(f"• {item[1]}: ")
                    format_run(r1, font_size=10.5, bold=True, color=COLOR_DARK)
                    r2 = p.add_run(item[2])
                    format_run(r2, font_size=10.5, bold=False, color=COLOR_DARK)
                p_curr += 1
            else:
                # Si se acaban los slots, insertar párrafos
                p = doc.paragraphs[idx_nofunc].insert_paragraph_before()
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.line_spacing = 1.15
                if item[0] == "MOD":
                    p.paragraph_format.space_before = Pt(10)
                    r = p.add_run(item[1])
                    format_run(r, font_size=11, bold=True, color=COLOR_PRIMARY)
                else:
                    r1 = p.add_run(f"• {item[1]}: ")
                    format_run(r1, font_size=10.5, bold=True, color=COLOR_DARK)
                    r2 = p.add_run(item[2])
                    format_run(r2, font_size=10.5, bold=False, color=COLOR_DARK)

    # =========================================================================
    # 2. ACTUALIZACIÓN DE SECCIÓN 2: REQUISITOS NO FUNCIONALES (P155-P174)
    # =========================================================================
    print("Actualizando Requisitos No Funcionales en texto...")
    rnf_items = [
        ("RNF-01 (Tiempo de Respuesta en Cotizaciones)", "El motor de búsqueda y cotización dinámica debe responder en menos de 1.0 segundo bajo condiciones estándar de conexión de banda ancha."),
        ("RNF-02 (Concurrencia en Temporadas Altas)", "Soporte garantizado para al menos 150 usuarios concurrentes simultáneos realizando consultas y reservas durante festividades y feriados de Manta."),
        ("RNF-03 (Usabilidad Operativa de Mostrador)", "El recepcionista debe poder recibir, validar la reserva y ejecutar el check-in en mostrador en no más de 2 clics para evitar esperas."),
        ("RNF-04 (Diseño Responsivo Multidispositivo)", "Interfaz del huésped 100% responsiva para pantallas móviles (360px a 430px de ancho) y panel operativo diseñado para computadoras de mostrador y tablets."),
        ("RNF-05 (Seguridad Criptográfica y Cifrado)", "Comunicaciones bajo protocolo seguro HTTPS / TLS 1.3, credenciales hasheadas con Argon2id o BCrypt con salt, y cifrado en reposo AES-256."),
        ("RNF-06 (Tokenización y Cumplimiento PCI-DSS)", "Enlaces de cobro digital implementados con tokens SHA-256 de un solo uso con expiración temporal. El sistema jamás almacena números de tarjeta ni códigos CVV."),
        ("RNF-07 (Protección de Datos Personales - LOPDP Ecuador)", "Cumplimiento integral de la Ley Orgánica de Protección de Datos Personales (R.O. Suplemento 459, 2021): consentimiento explícito, principio de finalidad estricta para reservas y SRI, atención de derechos ARCO, conservación tributaria por 7 años y bitácora inalterable de auditoría."),
        ("RNF-08 (Disponibilidad Continua y Resiliencia)", "Disponibilidad del servicio de al menos 99.5% de uptime anual, con alta tolerancia a fallos en fines de semana y feriados turísticos."),
        ("RNF-09 (Integridad Transaccional ACID)", "Procesamiento de reservas bajo transacciones atómicas con bloqueo de registros (pessimistic/optimistic locking) para erradicar cualquier posibilidad de sobreventa (overbooking)."),
        ("RNF-10 (Conformidad con Esquemas XSD del SRI)", "Comprobantes electrónicos XML conformes con la ficha técnica v1.1.0 del SRI y generación verificada de Clave de Acceso de 49 dígitos con algoritmo Módulo 11."),
        ("RNF-11 (Aislamiento de Información Multi-Tenant)", "Aislamiento lógico estricto a nivel de consultas SQL y middleware de sesión que impide de forma absoluta la fuga de datos o reservas entre hoteles distintos."),
        ("RNF-12 (Mantenibilidad y Arquitectura Modular)", "Backend estructurado en ASP.NET Core (.NET 8/9 Web API) y Frontend en React (TypeScript) + Tailwind CSS, desacoplados mediante APIs RESTful y tipado estricto.")
    ]

    # Encontrar párrafos de no funcionales
    for i, p in enumerate(doc.paragraphs):
        t = p.text.strip()
        if t == "No funcionales" and "Heading" in p.style.name:
            # Llenar párrafos siguientes
            for idx_rnf, (rnf_code, rnf_desc) in enumerate(rnf_items):
                target_p = doc.paragraphs[i + 1 + idx_rnf] if (i + 1 + idx_rnf) < len(doc.paragraphs) else doc.add_paragraph()
                target_p.text = ""
                target_p.paragraph_format.space_before = Pt(3)
                target_p.paragraph_format.space_after = Pt(3)
                r1 = target_p.add_run(f"• {rnf_code}: ")
                format_run(r1, font_size=10.5, bold=True, color=COLOR_DARK)
                r2 = target_p.add_run(rnf_desc)
                format_run(r2, font_size=10.5, bold=False, color=COLOR_DARK)
            break

    # Reemplazar placeholders en Tamaño y Rendimiento, Calidad y Otros
    for p in doc.paragraphs:
        t = p.text.strip()
        if "<En esta sección se describen las características volumétricas" in t:
            p.text = (
                "El sistema está dimensionado para dar cobertura a la planta turística formal del cantón Manta (universo oficial de 118 establecimientos: "
                "77 hostales, 40 hoteles y 1 hostería) registrados en el Catastro del Ministerio de Turismo 2026. "
                "En términos de rendimiento, el motor de reservas responde cotizaciones y disponibilidad en un tiempo medio inferior a 1.0 segundo. "
                "Soporta un volumen de concurrencia simultánea de 150 usuarios en picos de alta demanda (Carnaval, Feriado de Difuntos, Fiestas de Manta) "
                "con una utilización optimizada de recursos de memoria y almacenamiento en bases de datos relacionales PostgreSQL / SQL Server."
            )
        elif "<Contiene las dimensiones de calidad clave del sistema" in t:
            p.text = (
                "Conforme a la norma ISO/IEC 25010, la plataforma garantiza un nivel de disponibilidad y continuidad operativa del 99.5% de tiempo de actividad (uptime), "
                "reduciendo a cero los tiempos de inactividad no planificados durante asuetos turísticos. "
                "Asegura integridad transaccional estricta bajo propiedades ACID en la asignación de cupos de habitaciones para erradicar totalmente el overbooking. "
                "La arquitectura es adaptable y portable, permitiendo su despliegue en entornos Windows Server / Linux mediante contenedores Docker y servicios cloud."
            )
        elif "<Describe como la arquitectura da soporte a cualquier otro requisito" in t:
            p.text = (
                "La arquitectura implementa cumplimiento regulatorio estricto con la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP), "
                "incorporando consentimiento explícito, atención al ejercicio de derechos ARCO y conservación de registros de facturación durante el periodo legal "
                "obligatorio de 7 años dictaminado por el Código Tributario del SRI. "
                "Asimismo, garantiza aislamiento lógico multi-tenant nativo a nivel de capa de datos y middleware, tokenización de cobros digitales bajo estándar PCI-DSS "
                "y validación automática de comprobantes XML autorizados por el SRI."
            )

    # =========================================================================
    # 3. ACTUALIZACIÓN DE SECCIÓN 3: ACTORES DEL SISTEMA (P177)
    # =========================================================================
    print("Actualizando Actores del Sistema en texto...")
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip() == "Actores" and "Heading" in p.style.name:
            # Llenar párrafos 178, 179, 180, 181
            p1 = doc.paragraphs[i+1]
            p1.text = "El sistema articula la interacción de actores humanos (roles del sistema con control de acceso basado en roles - RBAC) y actores externos:"
            p1.paragraph_format.space_after = Pt(6)
            
            p2 = doc.paragraphs[i+2]
            p2.text = ""
            r_act1 = p2.add_run(
                "1. Superadministrador (Superadmin Cantonal): Administra el catastro general de los 118 alojamientos de Manta, tipos de hotel, categorías y roles; "
                "supervisa tableros consolidados de ocupación y volumen turístico cantonal; y emite alertas globales (conmutación sugerida de IVA al 8% ante decreto presidencial).\n"
                "2. Administrador del Hotel (Admin Hotel): Responsable legal y fiscal de su establecimiento; configura RUC, punto de emisión 001-001 ante el SRI; "
                "activa o desactiva la tasa del 10% de servicio turístico (propina legal Art. 41 Ley Turismo); y crea los usuarios internos (recepcionistas y revenue managers).\n"
                "3. Encargado de Tarifas y Cupos (Revenue Manager): Controla la apertura/cierre de cupos para evitar sobreventas; administra tarifas base y planes comerciales; "
                "ejecuta bloqueos internos por mantenimiento; y activa el Conmutador Rápido de Emergencia de IVA al 8% ante decretos presidenciales de última hora.\n"
                "4. Recepcionista (Front Desk): Gestiona la bandeja de reservas entrantes en tiempo real con alertas sonoras; registra el Check-in presencial en mostrador "
                "(sujeto a disponibilidad física de habitaciones listas); asigna manualmente el número de habitación física concreta; genera enlaces de cobro digital (PayPhone/DeUna) "
                "y emite la factura electrónica autorizada ante el SRI.\n"
                "5. Huésped / Turista (Usuario Público): Consulta disponibilidad por tipos de habitación en el portal web; cotiza con desglose transparente (IVA 15%/8% + 10% servicio si aplica); "
                "reserva con Google OAuth o como invitado (Guest Checkout); y obtiene su voucher digital con código QR."
            )
            format_run(r_act1, font_size=10, color=COLOR_DARK)
            
            p3 = doc.paragraphs[i+3]
            p3.text = ""
            r_act2 = p3.add_run(
                "Actores Externos del Ecosistema:\n"
                "• EXT-01: Servicio de Rentas Internas (SRI): Web Service de comprobantes electrónicos para recepción, validación de clave de acceso (49 dígitos Módulo 11) y autorización de facturas XML.\n"
                "• EXT-02: Pasarelas de Pago Digitales (PayPhone / DeUna / Kushki): Procesamiento de transacciones en USD, generación de códigos QR de cobro y webhooks de confirmación.\n"
                "• EXT-03: Servicio de Notificaciones (WhatsApp API / Email SMTP): Despacho automático de vouchers digitales con QR al huésped y avisos de cobro."
            )
            format_run(r_act2, font_size=10, color=COLOR_DARK)
            break

    # =========================================================================
    # 4. ACTUALIZACIÓN DE TABLAS DE REQUISITOS FUNCIONALES (TABLAS 3 A 32)
    # =========================================================================
    print("Actualizando Tablas 3 a 32 (Fichas de Requisitos Funcionales)...")
    
    rf_table_data = [
        ("RF-1", "Búsqueda interactiva de habitaciones por fechas y aforo", "El sistema dispondrá de una barra superior con selectores de fechas (check-in/check-out) y aforo de personas, recalculando la disponibilidad en tiempo real.", "Funcional - Motor Reservas", "Validación de fechas coherentes, aforo de adultos y niños, recálculo dinámico instantáneo.", "Alta"),
        ("RF-2", "Matriz interactiva de disponibilidad y habitaciones", "Presentación de la oferta de habitaciones en una matriz comparativa con columnas estándar de la industria hotelera.", "Funcional - Interfaz Huésped", "Columnas: Tipo de Habitación, Capacidad, Precio total con desglose, Tus Opciones, Selector numérico y botón Reservaré.", "Alta"),
        ("RF-3", "Desglose tributario flexible y tasa del 10% de servicio", "Visualización transparente del Subtotal Neto, IVA (15% u 8%) y Tasa del 10% de Servicio Turístico si el hotel lo tiene activo.", "Funcional - Cotización y Tarifas", "Si el hotel grava 10%: +25% ordinario o +18% feriado. Si el hotel no grava servicio: +15% ordinario o +8% feriado.", "Alta"),
        ("RF-4", "Autenticación de huésped y reserva como invitado", "Acceso mediante Google OAuth 2.0, registro correo/contraseña y modo Guest Checkout sin registro previo obligatorio.", "Funcional - Seguridad Huésped", "Permite completar reserva en menos de 2 minutos y ofrece creación opcional de cuenta al finalizar el voucher.", "Alta"),
        ("RF-5", "Selección de paquetes de reserva y Rate Plans", "Configuración de opciones comerciales: con desayuno vs solo habitación, tarifa flexible vs no reembolsable con descuento.", "Funcional - Planes de Tarifa", "Permite elegir entre pagar ahora con descuento digital o pagar al llegar al establecimiento.", "Alta"),
        ("RF-6", "Ficha técnica y galería multimedia por habitación", "Apertura de galería HD, metraje exacto en m², tipo de vista (al mar, ciudad, piscina), camas y amenidades.", "Funcional - Catálogo", "Visualización responsiva en carrusel fotográfico con etiquetas descriptivas claras.", "Media"),
        ("RF-7", "Servicios adicionales de alojamiento (Transporte opcional)", "Extras directos de estancia: traslados Aeropuerto de Manta <-> Hotel (configurable por el hotel como gratis, con valor en USD, o no disponible), cunas o late check-out. Se excluyen tours.", "Funcional - Servicios Extras", "Suma automática de rubros extras a la cotización final según configuración comercial del hotel.", "Media"),
        ("RF-8", "Geolocalización y mapa interactivo de Manta", "Ubicación geográfica exacta del hotel en su parroquia (Manta, Tarqui, Los Esteros, etc.) e indicadores de distancia a atractivos.", "Funcional - Geolocalización", "Muestra distancias en minutos a Playa El Murciélago, Mall del Pacífico, Terminal Terrestre y Aeropuerto Eloy Alfaro.", "Media"),
        ("RF-9", "Comentarios y calificaciones de huéspedes verificados", "Puntuación de 1 a 10 con total de opiniones, desglose por criterios (limpieza, ubicación, atención, WiFi) y reseñas reales.", "Funcional - Reputación Online", "Solo pueden calificar huéspedes que hayan completado una estancia real con check-out verificado.", "Media"),
        ("RF-10", "Emisión de voucher digital de reserva con código QR", "Comprobante oficial de confirmación con código alfanumérico (ej: RES-CS-201) y QR que el cliente presenta en recepción al llegar.", "Funcional - Comprobante Reserva", "Código QR escaneable por el recepcionista para confirmación inmediata en mostrador sin imprimir papel.", "Alta"),
        ("RF-11", "Bandeja de reservas entrantes en tiempo real para recepción", "Vista centralizada con nuevas reservas clasificadas por: Nueva, Confirmada, En Casa (Check-in), Finalizada y Cancelada.", "Funcional - Recepción Operativa", "Actualización en tiempo real con alertas sonoras/visuales al ingresar una nueva reserva.", "Alta"),
        ("RF-12", "Confirmación y apertura de detalle de reserva recibida", "Ficha operativa completa de la reserva con datos del huésped, fechas, paquetes elegidos, pagos y botón de confirmación en 1 clic.", "Funcional - Recepción", "Permite confirmar, registrar notas operativas o denegar con motivo documentado.", "Alta"),
        ("RF-13", "Registro de Check-in en mostrador (Sujeto a Disponibilidad Física)", "El check-in se ejecuta presencialmente en mostrador según disponibilidad de habitaciones limpias e inspeccionadas. Recepción valida cédula/pasaporte y entrega llaves.", "Funcional - Check-in Mostrador", "Operación ágil en 2 clics validando identidad y asignación física.", "Alta"),
        ("RF-14", "Asignación manual de habitación física por recepción", "El cliente solo reserva por Tipo de Habitación; la asignación del número de habitación física concreta (ej. 204) la realiza recepción manualmente.", "Funcional - Asignación Inventario", "Recepción asigna la unidad física disponible y desocupada al preparar la llegada del huésped.", "Alta"),
        ("RF-15", "Generación de enlaces de cobro seguro (PayPhone/DeUna)", "Generación de link seguro con token hash y código QR para que el cliente liquide saldos desde su teléfono móvil.", "Funcional - Pagos Digitales", "Tokens de un solo uso con tiempo de caducidad configurable (24h/48h).", "Alta"),
        ("RF-16", "Check-out y liquidación final de la reserva", "Cierre de cuenta, verificación de pagos totales, entrega de habitación y liberación automática para limpieza.", "Funcional - Check-out", "Desencadena automáticamente la emisión de la factura electrónica autorizada ante el SRI.", "Alta"),
        ("RF-17", "Directorio y búsqueda ágil de huéspedes", "Búsqueda rápida de clientes anteriores por número de cédula o apellido para agilizar recepciones frecuentes.", "Funcional - CRM Huéspedes", "Historial de visitas pasadas, preferencias registradas y datos fiscales SRI.", "Media"),
        ("RF-18", "Control dinámico de cupos por tipo de habitación", "El Revenue Manager abre o cierra cupos por categoría en fechas determinadas para prevenir sobreventas (overbooking).", "Funcional - Revenue Cupos", "Para el huésped externo solo se muestran cupos disponibles de la categoría.", "Alta"),
        ("RF-19", "Gestión operativa interna de bloqueos por mantenimiento", "Baja temporal de unidades por averías o reparaciones que descuenta cupos públicos de forma transparente sin exponer detalles operativos.", "Funcional - Mantenimiento Interno", "No altera reservas históricas ni reportes contables pasados.", "Media"),
        ("RF-20", "Administración de tarifas base y planes por el Revenue", "El Revenue Manager define las tarifas base por noche en USD de cada tipo de habitación y márgenes por persona extra o desayuno.", "Funcional - Revenue Pricing", "Precios determinados por análisis comercial y estrategia de ocupación del hotel.", "Alta"),
        ("RF-21", "Conmutador rápido de emergencia - IVA 8% por Decreto Presidencial", "Interruptor ágil de 1 clic para aplicar inmediatamente el 8% de IVA ante Decretos Presidenciales emitidos de un día para otro.", "Funcional - Temporada IVA 8%", "Ajusta en tiempo real cotizaciones web, vouchers y facturación electrónica SRI.", "Alta"),
        ("RF-22", "Generación matemática de Clave de Acceso SRI (49 dígitos)", "Construcción algorítmica ponderada Módulo 11 del código numérico de 49 dígitos exigido por el SRI.", "Funcional - SRI Criptográfico", "Cumple estrictamente con la ficha técnica oficial del SRI Ecuador.", "Alta"),
        ("RF-23", "Liquidación tributaria flexible y tasa del 10% de servicio", "Emisión de factura electrónica con desglose exacto de Subtotal 15%/8%, IVA, Propina 10% (si aplica) y Total en USD.", "Funcional - Facturación SRI", "Si el hotel tiene 10% activo se asigna en <propina>; si no, se emite en 0.00.", "Alta"),
        ("RF-24", "Emisión de comprobante RIDE en PDF y XML firmado", "Generación de factura con código de barras y envío automático del PDF y XML autorizado al correo del huésped.", "Funcional - Comprobantes SRI", "Descarga directa de RIDE y validación de estado AUTORIZADO ante el SRI.", "Alta"),
        ("RF-25", "Configuración de Tasa de Servicio del 10% por Hotel", "Conmutador independiente por establecimiento para activar o desactivar el cobro del 10% de propina legal (Art. 41 Ley Turismo).", "Funcional - Configuración Fiscal Hotel", "Permite que hostales operen sin recargo y hoteles de mayor gama cobren el 10% reglamentario.", "Alta"),
        ("RF-26", "CRUD de Hoteles y Catastro de Manta (118 Establecimientos)", "Superadmin gestiona altas, consultas con filtros por parroquia, edición y baja lógica de la planta hotelera cantonal.", "Funcional - Catastro Hoteles", "Aislamiento multi-tenant y trazabilidad con Catastro Nacional de Alojamientos 2026.", "Alta"),
        ("RF-27", "CRUD de Tipos de Hotel y Categorías por Estrellas", "Superadmin administra catálogos oficiales de modalidades (Hostal, Hotel, Hostería) y categorías (1 a 5 estrellas).", "Funcional - Catálogos MINTUR", "Normalización según estándares turísticos cantonales.", "Media"),
        ("RF-28", "CRUD de Usuarios del Sistema y Asignación de Roles (RBAC)", "Superadmin y Admin Hotel gestionan usuarios vinculándolos obligatoriamente a un HotelId y RolId. Bloqueo lógico por cese laboral.", "Funcional - RBAC Usuarios", "Contraseñas cifradas con BCrypt/Argon2 y control estricto de privilegios.", "Alta"),
        ("RF-29", "CRUD de Tipos de Habitación e Inventario Físico", "Admin Hotel y Revenue administran categorías comerciales y unidades físicas (número ej. 101, piso, estados: disponible, ocupada, limpieza).", "Funcional - Inventario Habitaciones", "Asignación de fotos HD, camas, metraje y amenidades.", "Alta"),
        ("RF-30", "CRUD de Huéspedes y Parámetros Fiscales del Hotel", "Recepción gestiona directorio de clientes con datos de facturación SRI; Admin Hotel configura RUC (13 dígitos) y punto de emisión 001.", "Funcional - CRM y Datos Fiscales", "Cumplimiento con LOPDP y retención legal tributaria por 7 años sin borrado físico.", "Alta"),
    ]

    for idx, rf in enumerate(rf_table_data):
        t_idx = idx + 3
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            if len(tbl.rows) >= 7:
                tbl.rows[0].cells[1].text = rf[0]
                tbl.rows[1].cells[1].text = rf[1]
                tbl.rows[2].cells[1].text = rf[2]
                tbl.rows[3].cells[1].text = rf[3]
                tbl.rows[4].cells[1].text = rf[4]
                tbl.rows[5].cells[1].text = "Octubre 2026 Versión 3.3"
                tbl.rows[6].cells[1].text = rf[5]

    # =========================================================================
    # 5. ACTUALIZACIÓN DE TABLA 46 (LISTA DE CASOS DE USO)
    # =========================================================================
    print("Actualizando Tabla 46 (Lista de Casos de Uso)...")
    if 46 < len(doc.tables):
        tbl46 = doc.tables[46]
        for idx, rf in enumerate(rf_table_data):
            row_idx = idx + 1
            if row_idx < len(tbl46.rows):
                row = tbl46.rows[row_idx]
                row.cells[0].text = f"CU-{idx+1}"
                row.cells[1].text = rf[1]
                row.cells[2].text = "Media" if idx % 2 == 0 else "Alta"
                row.cells[3].text = "Alta"
                row.cells[4].text = "Alta"

    # =========================================================================
    # 6. ACTUALIZACIÓN DE FICHAS DE CASOS DE USO (TABLAS 47 A 76)
    # =========================================================================
    print("Actualizando Tablas 47 a 76 (Fichas de Casos de Uso)...")
    actor_mapping = [
        "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista",
        "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista", "Huésped / Turista",
        "Recepcionista", "Recepcionista", "Recepcionista", "Recepcionista", "Recepcionista",
        "Recepcionista", "Recepcionista", "Revenue Manager", "Revenue Manager", "Revenue Manager",
        "Revenue Manager", "Recepcionista / Admin", "Recepcionista", "Recepcionista", "Admin Hotel",
        "Superadmin Cantonal", "Superadmin Cantonal", "Superadmin / Admin Hotel", "Admin Hotel / Revenue", "Recepcionista / Admin Hotel"
    ]

    for idx, rf in enumerate(rf_table_data):
        t_idx = idx + 47
        if t_idx < len(doc.tables):
            tbl = doc.tables[t_idx]
            cu_num = f"CU-{idx+1}"
            rf_num = f"RF-{idx+1}"
            cu_name = rf[1]
            cu_actor = actor_mapping[idx] if idx < len(actor_mapping) else "Usuario del Sistema"
            
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
                        cell.text = f"DESCRIPCIÓN: El actor {cu_actor} ejecuta {cu_name.lower()} conforme a los flujos operativos de alojamiento en Manta."
                elif len(row.cells) >= 2 and row.cells[0].text.startswith("ES-"):
                    row.cells[1].text = f"DESCRIPCIÓN: {cu_actor} completa satisfactoriamente {cu_name.lower()}. RESULTADOS: El sistema valida permisos RBAC, actualiza la base de datos y emite respuesta en tiempo real."

    # Guardar documento
    doc.save(TARGET_PATH)
    print(f"Documento guardado exitosamente en: {TARGET_PATH}")

if __name__ == "__main__":
    update_document()
