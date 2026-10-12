import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()

    # Page setup - Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    COLOR_PRIMARY = RGBColor(15, 76, 129)     # Deep Classic Blue #0F4C81
    COLOR_SECONDARY = RGBColor(30, 115, 190)  # Blue #1E73BE
    COLOR_DARK = RGBColor(33, 37, 41)         # Off Black #212529
    COLOR_MUTED = RGBColor(108, 117, 125)     # Gray #6C757D
    COLOR_SUCCESS = RGBColor(25, 135, 84)     # Green #198754

    def style_heading(p, font_size, color, bold=True, space_before=12, space_after=6):
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        for r in p.runs:
            r.font.name = 'Calibri'
            r.font.size = Pt(font_size)
            r.font.color.rgb = color
            r.font.bold = bold

    def add_p(text, bold_prefix="", space_after=4, bullet=False):
        if bullet:
            p = doc.add_paragraph(style='List Bullet')
        else:
            p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.font.name = 'Calibri'
            r_b.font.size = Pt(11)
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_DARK
        if text:
            r_t = p.add_run(text)
            r_t.font.name = 'Calibri'
            r_t.font.size = Pt(11)
            r_t.font.color.rgb = COLOR_DARK
        return p

    def add_callout(text, title="NOTA IMPORTANTE:"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        
        # Border left only (accent)
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            r'<w:tcBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            r'<w:top w:val="none"/>'
            r'<w:left w:val="single" w:sz="36" w:space="0" w:color="0F4C81"/>'
            r'<w:bottom w:val="none"/>'
            r'<w:right w:val="none"/>'
            r'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        # Background shading light blue/gray
        shading = parse_xml(r'<w:shd {} w:fill="F0F4F8"/>'.format(nsdecls('w')))
        tcPr.append(shading)

        # Padding
        mar = parse_xml(
            r'<w:tcMar xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            r'<w:top w:w="120" w:type="dxa"/>'
            r'<w:left w:w="180" w:type="dxa"/>'
            r'<w:bottom w:w="120" w:type="dxa"/>'
            r'<w:right w:w="180" w:type="dxa"/>'
            r'</w:tcMar>'
        )
        tcPr.append(mar)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        
        r_title = p.add_run(title + " ")
        r_title.bold = True
        r_title.font.name = 'Calibri'
        r_title.font.size = Pt(10.5)
        r_title.font.color.rgb = COLOR_PRIMARY
        
        r_text = p.add_run(text)
        r_text.font.name = 'Calibri'
        r_text.font.size = Pt(10.5)
        r_text.font.color.rgb = COLOR_DARK
        
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def set_cell_background(cell, hex_color):
        tcPr = cell._tc.get_or_add_tcPr()
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        tcPr.append(shading)

    def format_table(tbl, col_widths, is_header=True):
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        for row_idx, row in enumerate(tbl.rows):
            # CantSplit
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
            
            # Header repeat
            if row_idx == 0 and is_header:
                trPr.append(parse_xml(r'<w:tblHeader xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))

            for col_idx, cell in enumerate(row.cells):
                cell.width = col_widths[col_idx]
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                tcPr = cell._tc.get_or_add_tcPr()
                
                # Borders
                b_color = "CCCCCC"
                borders = parse_xml(
                    f'<w:tcBorders {nsdecls("w")}>'
                    f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{b_color}"/>'
                    f'<w:left w:val="none"/>'
                    f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{b_color}"/>'
                    f'<w:right w:val="none"/>'
                    f'</w:tcBorders>'
                )
                tcPr.append(borders)
                
                # Margins
                mar = parse_xml(
                    f'<w:tcMar {nsdecls("w")}>'
                    f'<w:top w:w="100" w:type="dxa"/>'
                    f'<w:left w:w="120" w:type="dxa"/>'
                    f'<w:bottom w:w="100" w:type="dxa"/>'
                    f'<w:right w:w="120" w:type="dxa"/>'
                    f'</w:tcMar>'
                )
                tcPr.append(mar)

                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    p.paragraph_format.line_spacing = 1.05
                    for r in p.runs:
                        r.font.name = 'Calibri'
                        if row_idx == 0 and is_header:
                            r.font.bold = True
                            r.font.size = Pt(9.5)
                            r.font.color.rgb = RGBColor(255, 255, 255)
                        else:
                            r.font.size = Pt(9.5)
                            r.font.color.rgb = COLOR_DARK
                
                if row_idx == 0 and is_header:
                    set_cell_background(cell, "0F4C81")
                elif row_idx % 2 == 1:
                    set_cell_background(cell, "FFFFFF")
                else:
                    set_cell_background(cell, "F8F9FA")

    # ==========================================
    # PORTADA Y ENCABEZADOS DEL DOCUMENTO
    # ==========================================
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (SRS)")
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(22)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(2)
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Sistema de Gestión, Administración y Reservas Hoteleras del Cantón Manta, Ecuador")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(14)
    r_sub.font.color.rgb = COLOR_SECONDARY

    # Metadata table
    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_data = [
        ("Entregable Contractual:", "Producto 1 — Documento de Especificaciones Funcionales y No Funcionales"),
        ("Ámbito Geográfico:", "Cantón Manta, Provincia de Manabí, República del Ecuador"),
        ("Estándares de Ingeniería:", "IEEE 830 / ISO/IEC 25010 / Normativa SRI Ecuador / Ley de Turismo Art. 41"),
        ("Fecha de Emisión / Versión:", "Octubre 2026 — Versión 3.1 (Operativa Hotelera Pura, 10% Servicio Parametrizable y Catastro Manta)")
    ]
    for row_idx, (k, v) in enumerate(meta_data):
        c0, c1 = meta_tbl.rows[row_idx].cells
        c0.text = k
        c1.text = v
        c0.paragraphs[0].runs[0].bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(9.5)
        c0.paragraphs[0].runs[0].font.color.rgb = COLOR_PRIMARY
        c1.paragraphs[0].runs[0].font.size = Pt(9.5)
        c1.paragraphs[0].runs[0].font.color.rgb = COLOR_DARK
        set_cell_background(c0, "F0F4F8")
        set_cell_background(c1, "FFFFFF")
    format_table(meta_tbl, [Inches(2.2), Inches(4.3)])
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ==========================================
    # SECCIÓN 1: INTRODUCCIÓN Y ALCANCE
    # ==========================================
    h1 = doc.add_heading("1. Introducción y Alcance del Sistema", level=1)
    style_heading(h1, 16, COLOR_PRIMARY, space_before=16)

    add_p("El presente documento define la especificación integral de requisitos funcionales y no funcionales, reglas de negocio tributarias ecuatorianas, arquitectura modular y el estudio del universo de establecimientos para el desarrollo del Sistema de Gestión de Servicios Operativos, Motor de Reservas y Facturación Electrónica en Establecimientos de Alojamiento del Cantón Manta, Ecuador (CUP: 91880000.0000.390820).")

    add_callout(
        "El sistema no constituye un ERP hotelero tradicional de gestión interna pesada (tipo Zeus u Opera con comandas de restaurante, lavandería industrial o turnos de camareras). Su arquitectura se enfoca con precisión en: (1) Motor de Reservas y Portal Web del Huésped de alta conversión, (2) Panel de Recepción y Control de Reservas para el Hotel, articulado con el Sistema de Facturación Electrónica del SRI, y (3) Parámetros comerciales y configuración de la tasa del 10% de servicio turístico por establecimiento.",
        title="ENFOQUE ESTRATÉGICO DEL SISTEMA:"
    )

    # ==========================================
    # SECCIÓN 2: ROLES DEL SISTEMA Y MATRIZ RBAC
    # ==========================================
    h2 = doc.add_heading("2. Actores del Sistema y Matriz de Control de Acceso (RBAC)", level=1)
    style_heading(h2, 16, COLOR_PRIMARY, space_before=16)

    add_p("El sistema implementa un modelo de seguridad basado en roles (Role-Based Access Control) estructurado en cinco perfiles diferenciados:")

    add_p(" Acceso global y sin restricciones a todos los establecimientos de Manta. Da de alta hoteles adscritos a partir del Catastro Oficial, genera usuarios administradores de hotel, parametriza políticas globales del sistema y visualiza el tablero consolidado cantonal de reservas, ocupación e ingresos turísticos.", bold_prefix="1. Superadministrador (Superadmin Cantonal):", bullet=True)
    add_p(" Acceso restringido exclusivamente a su establecimiento. Configura datos comerciales y fiscales ante el SRI (RUC, establecimiento, punto de emisión), activa o desactiva la aplicación de la tasa del 10% de servicio turístico de su hotel, gestiona su equipo de recepcionistas y revenue managers, visualiza reportes financieros y autoriza notas de crédito.", bold_prefix="2. Administrador del Hotel (Admin Hotel):", bullet=True)
    add_p(" Responsable del control de inventario y comercialización de su hotel. Indica y modifica la disponibilidad de habitaciones, abre y cierra cupos en el calendario para evitar sobreventas (overbooking), ejecuta bloqueos por mantenimiento, configura tarifas base, planes de tarifa y programa temporadas con multiplicadores.", bold_prefix="3. Encargado de Tarifas y Disponibilidad (Revenue Manager):", bullet=True)
    add_p(" Operador en mostrador. Recibe en tiempo real las reservas generadas desde el portal público, revisa solicitudes, confirma estancias, efectúa el check-in express y check-out, genera enlaces de cobro (PayPhone/DeUna) y emite la factura electrónica autorizada por el SRI con desglose de IVA (15% u 8%) y servicio del 10% si aplica.", bold_prefix="4. Recepcionista (Front Desk):", bullet=True)
    add_p(" Usuario final que accede al portal web. Consulta disponibilidad, compara tipos de habitación en una matriz de tarifas transparente, selecciona planes con o sin desayuno, efectúa el pago o garantía digital y descarga su voucher con código QR.", bold_prefix="5. Cliente / Huésped (Usuario Web):", bullet=True)

    add_p("A continuación se resume la matriz de privilegios y accesos del sistema:")

    rbac_matrix_data = [
        ("Buscar, cotizar y seleccionar habitaciones", "Sí", "Sí", "Sí", "Sí", "Sí"),
        ("Crear reserva online y pago digital", "Sí", "Sí", "No", "No", "Sí"),
        ("Bandeja de reservas entrantes (Tiempo real)", "Todos", "Su Hotel", "Solo Lectura", "Operativo", "No"),
        ("Confirmar o rechazar reserva recibida", "Sí", "Sí", "No", "Sí", "No"),
        ("Apertura/Cierre de cupos y disponibilidad", "Sí", "Sí", "Sí", "No", "No"),
        ("Bloqueo operativo por mantenimiento", "Sí", "Sí", "Sí", "No", "No"),
        ("Configurar tarifas base y temporadas", "Sí", "Sí", "Sí", "No", "No"),
        ("Check-in y Check-out de huéspedes", "Sí", "Sí", "No", "Sí", "No"),
        ("Generar enlaces de cobro (PayPhone/DeUna)", "Sí", "Sí", "No", "Sí", "No"),
        ("Emisión de Factura Electrónica SRI (IVA 15%/8%)", "Sí", "Sí", "No", "Sí", "No"),
        ("Configurar Tasa 10% de Servicio (Activar/Desactivar)", "Sí", "Sí", "No", "No", "No"),
        ("Gestión de usuarios y accesos del hotel", "Sí", "Su Hotel", "No", "No", "No"),
        ("Alta y baja de hoteles del Catastro de Manta", "Sí", "No", "No", "No", "No"),
        ("Dashboard consolidado macro del Cantón Manta", "Sí", "No", "No", "No", "No"),
    ]

    rbac_tbl = doc.add_table(rows=len(rbac_matrix_data) + 1, cols=6)
    rbac_headers = ["Módulo / Funcionalidad Operativa", "Superadmin", "Admin Hotel", "Revenue", "Recepción", "Cliente"]
    for idx, text in enumerate(rbac_headers):
        rbac_tbl.rows[0].cells[idx].text = text
    for row_idx, row_values in enumerate(rbac_matrix_data):
        for col_idx, cell_value in enumerate(row_values):
            rbac_tbl.rows[row_idx + 1].cells[col_idx].text = cell_value

    format_table(rbac_tbl, [Inches(2.5), Inches(0.8), Inches(0.8), Inches(0.8), Inches(0.8), Inches(0.8)])

    add_callout(
        "Principio de Aislamiento Multi-Tenant: El sistema garantiza a nivel lógico y de base de datos que ningún usuario perteneciente a un establecimiento hotelero pueda acceder, consultar o modificar reservas, registros de huéspedes o datos financieros de otro hotel de Manta.",
        title="REGLA DE SEGURIDAD ESTRICTA:"
    )

    # ==========================================
    # SECCIÓN 3: ESTUDIO DEL CATASTRO MANTA 2026
    # ==========================================
    h3 = doc.add_heading("3. Estudio Técnico y Diagnóstico del Catastro de Alojamientos (Cantón Manta 2026)", level=1)
    style_heading(h3, 16, COLOR_PRIMARY, space_before=16)

    add_p("A partir de la base oficial del Catastro Turístico Nacional del Ministerio de Turismo del Ecuador (archivo oficial Consolidado-Nacional-2026-publico-8.xlsx), se realizó la extracción y análisis cuantitativo de los establecimientos turísticos registrados en el Cantón Manta.")

    add_p("De un total de 659 establecimientos turísticos en el cantón, exactamente 118 corresponden a las tres modalidades de alojamiento turístico sobre las cuales opera la solución:")

    # Table Modalidades
    tbl_mod = doc.add_table(rows=5, cols=4)
    tbl_mod_headers = ["Modalidad Oficial MINTUR", "N° Establecimientos", "Participación (%)", "Perfil en el Sistema"]
    for idx, text in enumerate(tbl_mod_headers):
        tbl_mod.rows[0].cells[idx].text = text

    mod_data = [
        ("HOSTAL", "77", "65.3%", "Establecimientos de 10 a 25 habitaciones; operan típicamente sin recargo de servicio (10% desactivado)."),
        ("HOTEL", "40", "33.9%", "Hoteles urbanos y de playa de media y alta capacidad; comúnmente gravan el 10% de servicio turístico."),
        ("HOSTERÍA", "1", "0.8%", "Establecimiento campestre con enfoque de descanso y turismo vacacional."),
        ("TOTAL CANTONAL", "118", "100.0%", "Universo objetivo total para la digitalización y gestión hotelera en Manta.")
    ]
    for row_idx, row_values in enumerate(mod_data):
        for col_idx, cell_value in enumerate(row_values):
            tbl_mod.rows[row_idx + 1].cells[col_idx].text = cell_value
    format_table(tbl_mod, [Inches(1.8), Inches(1.1), Inches(1.1), Inches(2.5)])

    add_p("Segmentación por Categoría Oficial de Estrellas:")
    tbl_cat = doc.add_table(rows=7, cols=4)
    tbl_cat_headers = ["Categoría Oficial", "Cantidad", "Porcentaje", "Justificación Estratégica en el Proyecto"]
    for idx, text in enumerate(tbl_cat_headers):
        tbl_cat.rows[0].cells[idx].text = text

    cat_data = [
        ("1 Estrella", "34", "28.8%", "Pequeños hostales familiares sin sistema informático propio; operan sin recargo de servicio (10% desactivado)."),
        ("2 Estrellas", "41", "34.7%", "Segmento mayoritario; hostales familiares que cobran precio neto directo sin recargo de servicio."),
        ("3 Estrellas", "30", "25.4%", "Núcleo de hoteles intermedios de Manta; aplican el 10% de servicio según su modelo tributario."),
        ("4 Estrellas", "7", "5.9%", "Hoteles corporativos y turísticos de alta gama; gravan el 10% de servicio reglamentario."),
        ("5 Estrellas / Lujo", "6", "5.1%", "Cadenas hoteleras del puerto y Barbasquillo; gravan estrictamente el 10% de servicio turístico."),
        ("TOTAL", "118", "100.0%", "El 89.0% (105 establecimientos) corresponden a las categorías 1, 2 y 3 estrellas.")
    ]
    for row_idx, row_values in enumerate(cat_data):
        for col_idx, cell_value in enumerate(row_values):
            tbl_cat.rows[row_idx + 1].cells[col_idx].text = cell_value
    format_table(tbl_cat, [Inches(1.5), Inches(0.9), Inches(1.0), Inches(3.1)])

    add_callout(
        "El 89.0% de los alojamientos en Manta son establecimientos de 1, 2 y 3 estrellas. La enorme diversidad entre hostales pequeños (que cobran precios netos directos) y hoteles de mayor categoría (que cobran el 10% de servicio) valida la exigencia técnica de que el sistema permita activar o desactivar la tasa del 10% de servicio de manera individual para cada hotel.",
        title="HALLAZGO CUANTITATIVO CLAVE:"
    )

    add_p("Distribución Territorial por Parroquias Urbanas y Rurales:")
    tbl_parr = doc.add_table(rows=9, cols=4)
    tbl_parr_headers = ["Parroquia", "Tipo", "Establecimientos", "Vocación Turística y Perfil de Demanda"]
    for idx, text in enumerate(tbl_parr_headers):
        tbl_parr.rows[0].cells[idx].text = text

    parr_data = [
        ("Manta (Urbana)", "Urbana", "69", "Centro comercial, Malecón Escénico, playa Murciélago y Barbasquillo. Hoteles ejecutivos y de playa."),
        ("Los Esteros", "Urbana", "21", "Cercanía al Aeropuerto Eloy Alfaro y polo atunero. Alojamientos corporativos."),
        ("Tarqui", "Urbana", "16", "Zona tradicional pesquera y hotelera frente al mar. Hostales familiares en reactivación."),
        ("Santa Marianita", "Rural", "7", "Playa mundial del Kitesurf. Hostales de playa y cabañas frente al mar."),
        ("San Lorenzo", "Rural", "2", "Zona de acantilados, reserva de Pacoche y anidación de tortugas. Hostales y hostería rural."),
        ("San Mateo", "Rural", "2", "Puerto pesquero artesanal y surf. Alojamientos turísticos costeros."),
        ("Eloy Alfaro", "Urbana", "1", "Alojamiento urbano de tránsito."),
        ("TOTAL CANTONAL", "-", "118", "107 establecimientos urbanos (90.7%) y 11 establecimientos rurales (9.3%).")
    ]
    for row_idx, row_values in enumerate(parr_data):
        for col_idx, cell_value in enumerate(row_values):
            tbl_parr.rows[row_idx + 1].cells[col_idx].text = cell_value
    format_table(tbl_parr, [Inches(1.5), Inches(0.9), Inches(1.1), Inches(3.0)])

    # ==========================================
    # SECCIÓN 4: CATÁLOGO DE REQUISITOS FUNCIONALES
    # ==========================================
    h4 = doc.add_heading("4. Catálogo Detallado de Requisitos Funcionales (RF)", level=1)
    style_heading(h4, 16, COLOR_PRIMARY, space_before=16)

    # 4.1 Motor del Huésped
    h41 = doc.add_heading("4.1 Módulo A: Motor de Reservas y Experiencia del Huésped (Estándar de Comercio Electrónico)", level=2)
    style_heading(h41, 13, COLOR_SECONDARY, space_before=12)

    add_p(" El sistema dispondrá de una barra superior interactiva con selectores de rango de fechas (check-in / check-out), selector de ocupación (adultos, niños y número de habitaciones requeridas) y botón interactivo 'Modificar búsqueda', recalculando la disponibilidad en tiempo real.", bold_prefix="RF-01 (Barra de Búsqueda y Modificación Dinámica):", bullet=True)
    add_p(" Soporte para inicio de sesión en un clic con Google (Google OAuth 2.0), registro tradicional mediante correo y contraseña, y la modalidad de 'Reserva como Invitado' (Guest Checkout) para completar la reserva sin fricción previa.", bold_prefix="RF-02 (Autenticación del Huésped y Perfil de Usuario):", bullet=True)
    add_p(" Presentación de la oferta de habitaciones en una matriz interactiva con 6 columnas: Tipo de Habitación con badge de escasez (ej. '🔴 Nos quedan solo 2 habitaciones'), capacidad en personas (íconos), precio total de la estancia con desglose transparente y visible de: Subtotal Neto de Alojamiento + IVA (15% ordinario u 8% especial en feriados) + 10% de Servicio Turístico / Propina (Art. 41 Ley de Turismo) si el hotel tiene activada la tasa. El recargo combinado es del +25% en días ordinarios (+18% en feriados) cuando el 10% está activo, o del +15% ordinario (+8% en feriados) cuando el hotel no grava servicio, columna 'Tus Opciones', selector numérico de habitaciones y botón 'Reservaré'.", bold_prefix="RF-03 (Matriz de Disponibilidad y Desglose Tributario Flexible):", bullet=True)
    add_p(" Cada habitación ofrecerá combinaciones comerciales: (a) Desayuno incluido vs. Desayuno opcional (+US$ 15), (b) Cancelación gratuita hasta fecha límite vs. Tarifa No Reembolsable con descuento, (c) Sin pago por adelantado (pagarás en el alojamiento) vs. Pago digital anticipado con pasarela local.", bold_prefix="RF-04 (Paquetes de Reserva y Planes de Tarifa - Rate Plans):", bullet=True)
    add_p(" Al seleccionar el nombre de la habitación se desplegará una ventana interactiva con carrusel de fotos HD, descripción técnica, metraje en m² (ej. 28 m², 45 m²), vistas (mar Murciélago, ciudad, piscina), tipo de camas (King extragrande, dobles) e insignias de equipamiento (A/C, WiFi, cafetera, baño privado).", bold_prefix="RF-05 (Galería Multimedia y Ficha Técnica por Habitación):", bullet=True)
    add_p(" El huésped podrá añadir servicios adicionales durante la reserva: traslado privado Aeropuerto Eloy Alfaro de Manta <-> Hotel, desayuno buffet manabita, early check-in, late check-out hasta las 15:00, cama adicional y tours guiados (Pacoche o avistamiento de ballenas).", bold_prefix="RF-06 (Servicios Agregados y Adicionales - Add-ons):", bullet=True)
    add_p(" Mapa interactivo con la ubicación exacta del establecimiento en Manta, dirección, parroquia e indicadores de distancia en minutos a puntos clave: Playa El Murciélago (200 m), Mall del Pacífico (5 min), Terminal Terrestre (10 min) y Aeropuerto Eloy Alfaro (12 min).", bold_prefix="RF-07 (Módulo de Ubicación Geográfica y Atractivos de Manta):", bullet=True)
    add_p(" Puntuación media en escala de 1 a 10 con el total de reseñas, desglose por criterios (limpieza, ubicación, atención, relación calidad-precio y WiFi) y comentarios de huéspedes verificados.", bold_prefix="RF-08 (Comentarios y Calificaciones de Huéspedes Verificados):", bullet=True)
    add_p(" Formulario para registrar hora estimada de llegada, requerimientos de accesibilidad, camas separadas o notas operativas para el equipo de recepción del hotel.", bold_prefix="RF-09 (Preferencias de Estancia y Solicitudes Especiales del Huésped):", bullet=True)
    add_p(" Generación instantánea de voucher con código alfanumérico único (ej. RES-CS-201), despacho de confirmación al WhatsApp y correo electrónico del huésped, y voucher descargable con código QR.", bold_prefix="RF-10 (Emisión de Voucher Digital con Código QR):", bullet=True)

    # 4.2 Recepción
    h42 = doc.add_heading("4.2 Módulo B: Recepción y Gestión de Reservas (Panel del Recepcionista)", level=2)
    style_heading(h42, 13, COLOR_SECONDARY, space_before=12)

    add_p(" Vista centralizada con las nuevas reservas generadas desde el portal público, clasificadas por estado: Nueva / Por Confirmar, Confirmada, En Casa (Check-in), Finalizada (Check-out) y Cancelada.", bold_prefix="RF-11 (Bandeja de Reservas Entrantes en Tiempo Real):", bullet=True)
    add_p(" El recepcionista puede abrir la reserva, verificar los paquetes elegidos por el huésped (desayuno, extras, modalidad de pago) y marcarla como 'Confirmada' con un clic.", bold_prefix="RF-12 (Confirmación y Detalle de Reserva):", bullet=True)
    add_p(" Al presentarse el cliente, el recepcionista valida la identidad (Cédula/Pasaporte) y pulsa 'Check-in', activando la estancia y registrando la hora de llegada.", bold_prefix="RF-13 (Check-in Express y Registro de Huésped):", bullet=True)
    add_p(" Si la reserva seleccionó 'Pagarás en el alojamiento' o adeuda consumos extras, el recepcionista puede generar en 1 clic un enlace seguro con código QR de PayPhone/DeUna para que el cliente pague desde su teléfono móvil.", bold_prefix="RF-14 (Generación de Links de Pago para Saldos Pendientes):", bullet=True)
    add_p(" Al culminar la estancia, el recepcionista pulsa 'Check-out', cerrando la cuenta y liberando el cupo para futuras reservas.", bold_prefix="RF-15 (Check-out y Liquidación de la Reserva):", bullet=True)
    add_p(" Consulta rápida de clientes frecuentes con historial de visitas previas para agilizar futuras atenciones.", bold_prefix="RF-16 (Directorio Histórico de Huéspedes):", bullet=True)

    # 4.3 Revenue Manager
    h43 = doc.add_heading("4.3 Módulo C: Disponibilidad, Tarifas y Temporadas (Panel del Revenue Manager)", level=2)
    style_heading(h43, 13, COLOR_SECONDARY, space_before=12)

    add_p(" Calendario visual donde el Revenue Manager puede abrir o cerrar cupos de cada tipo de habitación por fecha para evitar sobreventas.", bold_prefix="RF-17 (Control de Disponibilidad y Cupos por Fecha):", bullet=True)
    add_p(" El Revenue Manager define qué planes comerciales ofrecer para cada categoría: Tarifa Estándar, Tarifa con Desayuno, Tarifa Flexible (cancelación gratis) o Tarifa No Reembolsable con descuento.", bold_prefix="RF-18 (Configuración de Paquetes de Tarifa - Rate Plans):", bullet=True)
    add_p(" Módulo para subir imágenes HD, especificar metros cuadrados (m²), vistas y amenidades de cada categoría de habitación.", bold_prefix="RF-19 (Gestión de Galerías, Metraje y Fotos de Habitaciones):", bullet=True)
    add_p(" Catálogo de extras opcionales (traslados, desayunos, late check-out) con sus precios unitarios en USD.", bold_prefix="RF-20 (Administración de Servicios Adicionales - Add-ons):", bullet=True)
    add_p(" Configuración de temporadas con conmutador ágil de un clic para alternar entre Régimen Ordinario (IVA 15%) y Feriados Turísticos Nacionales (IVA reducido al 8%), adaptándose inmediatamente a si el hotel tiene activo o desactivado el 10% de servicio.", bold_prefix="RF-21 (Programación de Temporadas y Conmutador Rápido de IVA 15% / 8%):", bullet=True)

    # 4.4 Facturación SRI
    h44 = doc.add_heading("4.4 Módulo D: Facturación Electrónica SRI Ecuador", level=2)
    style_heading(h44, 13, COLOR_SECONDARY, space_before=12)

    add_p(" Construcción de la clave oficial de 49 dígitos requerida por el Servicio de Rentas Internas mediante el algoritmo oficial ponderado Módulo 11.", bold_prefix="RF-22 (Generación de Clave de Acceso de 49 Dígitos):", bullet=True)
    add_p(" Emisión de factura electrónica con desglose exacto: Subtotal Base Imponible (tarifa 15% u 8% en feriados), Subtotal 0%, Monto de IVA liquidado, 10% de Servicio Turístico / Propina (calculado únicamente si el hotel lo tiene activo, o 0.00 en caso contrario) y Valor Total a pagar en USD.", bold_prefix="RF-23 (Liquidación Tributaria Flexible y Tasa de Servicio del 10%):", bullet=True)
    add_p(" Generación de la factura digital RIDE en PDF con código de barras y envío automático del XML firmado y comprobante al correo del huésped.", bold_prefix="RF-24 (Emisión de Comprobante RIDE en PDF y XML SRI):", bullet=True)

    # 4.5 Parámetros Comerciales y Configuración de Hoteles
    h45 = doc.add_heading("4.5 Módulo E: Parámetros Comerciales y Configuración Fiscal del Hotel", level=2)
    style_heading(h45, 13, COLOR_SECONDARY, space_before=12)

    add_p(" Selector y conmutador independiente para cada establecimiento que permite activar o desactivar la tasa del 10% de servicio turístico (propina legal). El cambio actualiza al instante la cotización web, los enlaces de pago y la emisión de comprobantes electrónicos del SRI (asignando el valor calculado o 0.00 en el casillero de propina).", bold_prefix="RF-25 (Configuración de Tasa de Servicio del 10% por Hotel):", bullet=True)
    add_p(" Formulario para registrar RUC (13 dígitos), razón social, nombre comercial, dirección matriz y sucursal, número de establecimiento (001), punto de emisión (001), régimen tributario (General, RIMPE Emprendedor, Negocio Popular) y condición de obligado a llevar contabilidad.", bold_prefix="RF-26 (Configuración Fiscal SRI por Establecimiento):", bullet=True)
    add_p(" Configuración de métodos y pasarelas de pago admitidas por el establecimiento: PayPhone Ecuador, Kushki, Datafast, transferencias directas DeUna / Produbanco / Banco Pichincha.", bold_prefix="RF-27 (Control de Métodos de Cobro y Pasarelas Locales):", bullet=True)
    add_p(" Función de bloqueo operativo temporal de habitaciones por mantenimiento, averías o remodelación, retirando la unidad de la disponibilidad pública sin afectar el histórico contable ni las reservas pasadas.", bold_prefix="RF-28 (Bloqueo Operativo de Habitaciones por Mantenimiento):", bullet=True)

    # 4.6 Administración
    h46 = doc.add_heading("4.6 Módulo F: Administración de Hotel y Superadmin Cantonal", level=2)
    style_heading(h46, 13, COLOR_SECONDARY, space_before=12)

    add_p(" El Administrador del Hotel solo tiene acceso a las finanzas, usuarios y reservas de su establecimiento.", bold_prefix="RF-29 (Aislamiento de Información por Hotel - Multi-tenant):", bullet=True)
    add_p(" El Administrador del Hotel puede crear y gestionar accesos para sus recepcionistas y revenue managers.", bold_prefix="RF-30 (Gestión de Usuarios del Hotel):", bullet=True)
    add_p(" El Superadministrador puede registrar nuevos hoteles, hostales u hosterías en el sistema vinculando sus datos del Catastro Nacional (RUC, Parroquia, Categoría) y definiendo si inicialmente gravan o no el 10% de servicio.", bold_prefix="RF-31 (Alta de Hoteles del Catastro de Manta):", bullet=True)
    add_p(" El Superadministrador puede visualizar métricas macro de ocupación del cantón, volumen consolidado de reservas por temporada, ingresos turísticos generados y tarifa promedio por parroquia.", bold_prefix="RF-32 (Tablero Consolidado de Reservas Cantonal):", bullet=True)

    # ==========================================
    # SECCIÓN 5: REQUISITOS NO FUNCIONALES (RNF)
    # ==========================================
    h5 = doc.add_heading("5. Catálogo de Requisitos No Funcionales (RNF)", level=1)
    style_heading(h5, 16, COLOR_PRIMARY, space_before=16)

    rnf_tbl = doc.add_table(rows=10, cols=4)
    rnf_headers = ["Código", "Criterio ISO 25010", "Especificación Técnica", "Métrica de Aceptación"]
    for idx, text in enumerate(rnf_headers):
        rnf_tbl.rows[0].cells[idx].text = text

    rnf_data = [
        ("RNF-01", "Rendimiento y Eficiencia", "Tiempo de respuesta en consulta de disponibilidad y cotización dinámica.", "<= 1.0 segundo con conexiones banda ancha estándar."),
        ("RNF-02", "Usabilidad Operativa", "Recepción, validación y confirmación de una reserva entrante por recepción.", "<= 2 clics por parte del recepcionista."),
        ("RNF-03", "Seguridad Criptográfica", "Cifrado integral cliente-servidor, credenciales en reposo y tokens de cobro.", "HTTPS / TLS 1.3, AES-256 y tokens hash SHA-256 de un solo uso."),
        ("RNF-04", "Protección de Datos (LOPDP)", "Cumplimiento obligatorio de la Ley Orgánica de Protección de Datos Personales del Ecuador (R.O. 459, 2021).", "Consentimiento explícito, principio de finalidad estricta, derechos ARCO, auditoría de accesos y conservación legal 7 años."),
        ("RNF-05", "Portabilidad y Responsividad", "Adaptabilidad a dispositivos móviles (huéspedes) y computadoras de recepción.", "Diseño 100% responsivo adaptable a pantallas de 360px a 4K."),
        ("RNF-06", "Cumplimiento Normativo SRI", "Validez estricta de comprobantes electrónicos generados y algoritmo Módulo 11.", "Esquema XML versión 1.1.0/2.1.0 validado ante el SRI Ecuador."),
        ("RNF-07", "Disponibilidad y Resiliencia", "Disponibilidad continua del motor de reservas para evitar pérdida de ventas.", "99.5% de tiempo de actividad en horarios comerciales y feriados."),
        ("RNF-08", "Integridad Transaccional", "Procesamiento de reservas y asignación bajo transacciones atómicas ACID.", "Control estricto de concurrencia y prevención total de sobreventas."),
        ("RNF-09", "Confidencialidad Multi-Tenant", "Aislamiento lógico de datos entre diferentes establecimientos hoteleros.", "Filtrado estricto por hotel_id en cada consulta y contexto de sesión.")
    ]
    for row_idx, row_values in enumerate(rnf_data):
        for col_idx, cell_value in enumerate(row_values):
            rnf_tbl.rows[row_idx + 1].cells[col_idx].text = cell_value
    format_table(rnf_tbl, [Inches(1.0), Inches(1.8), Inches(2.2), Inches(1.5)])

    # ==========================================
    # SECCIÓN 6: REGLAS DE NEGOCIO OFICIALES
    # ==========================================
    h6 = doc.add_heading("6. Reglas de Negocio Oficiales (SRI y Operativa Hotelera Manta)", level=1)
    style_heading(h6, 16, COLOR_PRIMARY, space_before=16)

    add_p("Cálculo de la Clave de Acceso SRI (49 dígitos):", bold_prefix="RN-SRI-01:", bullet=True)
    add_p("La clave de acceso del comprobante electrónico se calcula aplicando el algoritmo de Módulo 11 con factores de ponderación cíclicos [2, 3, 4, 5, 6, 7] aplicados de derecha a izquierda sobre los primeros 48 dígitos. Si el residuo es 11 el dígito verificador es 0; si el residuo es 10 el dígito verificador es 1.")

    add_p("Tarifa de IVA Ordinaria (15%) y Tarifa Especial en Feriados Turísticos (8%):", bold_prefix="RN-SRI-02:", bullet=True)
    add_p("De acuerdo con la reforma tributaria vigente en el Ecuador, la tarifa general del IVA es del 15%. No obstante, al amparo de la Ley Orgánica para el Desarrollo Turístico, el Ejecutivo emite Decretos Ejecutivos que reducen el IVA al 8% durante los feriados nacionales para prestadores de servicios turísticos registrados en Manta. El sistema cuenta con un conmutador ágil que permite alternar la tasa de liquidación con un solo clic, actualizando cotizaciones y códigos del SRI.")

    add_p("Parametrización de la Tasa de Servicio Turístico del 10% por Establecimiento:", bold_prefix="RN-HOT-01:", bullet=True)
    add_p("De conformidad con el Art. 41 de la Ley de Turismo del Ecuador, los establecimientos de alojamiento turístico legalmente registrados pueden incorporar el 10% de propina o servicio turístico sobre el subtotal neto sin impuestos. El sistema reconoce que no todos los establecimientos de Manta cobran este rubro (la mayoría de hostales operan a precio neto directo sin servicio, mientras que hoteles de 3, 4 y 5 estrellas sí lo gravan). Por ello, el sistema dispone de un parámetro booleano por hotel (grava_servicio_10): (a) Cuando está ACTIVO: Subtotal + 15% IVA + 10% Servicio = Subtotal x 1.25 (+25% ordinario) o Subtotal + 8% IVA + 10% Servicio = Subtotal x 1.18 (+18% en feriados). La factura electrónica del SRI desglosa el valor en el campo <propina>. (b) Cuando está DESACTIVADO: Subtotal + 15% IVA = Subtotal x 1.15 (+15% ordinario) o Subtotal + 8% IVA = Subtotal x 1.08 (+8% en feriados). El campo <propina> se liquida en 0.00 y no se muestra recargo de servicio al huésped.")

    # Guardar en directorio del proyecto
    workspace_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_path = os.path.join(workspace_dir, "ESPECIFICACION_REQUISITOS_SISTEMA_HOTELERO_MANTA.docx")
    doc.save(workspace_path)
    print(f"Documento Word guardado exitosamente en: {workspace_path}")

    # Si existe la ruta alternativa de descargas, guardar también allí
    alt_dir = r"c:\Users\leneker\Downloads\Sistema de reservas hoteleras"
    if os.path.exists(alt_dir):
        alt_path = os.path.join(alt_dir, "ESPECIFICACION_REQUISITOS_SISTEMA_HOTELERO_MANTA.docx")
        doc.save(alt_path)
        print(f"Copia guardada en: {alt_path}")

if __name__ == '__main__':
    create_document()
