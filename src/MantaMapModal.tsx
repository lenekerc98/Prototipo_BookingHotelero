import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Hotel } from "./mantaHotels";

interface ParishSector {
  id: string;
  name: string;
  query: string;
  type: "Parroquia Urbana" | "Parroquia Rural";
  lat: number;
  lng: number;
  zoom: number;
  hotels: number;
  icon: string;
  badge: string;
  desc: string;
  highlights: string[];
}

export const MANTA_OFFICIAL_SECTORS: ParishSector[] = [
  {
    id: "manta",
    name: "Manta (Matriz)",
    query: "Manta",
    type: "Parroquia Urbana",
    lat: -0.9490,
    lng: -80.7320,
    zoom: 14,
    hotels: 40,
    icon: "🏙️",
    badge: "Urbana · Barbasquillo & Murciélago",
    desc: "Epicentro hotelero y financiero de Manta. Alberga la zona de alta gama de Barbasquillo, el Malecón Escénico, la Playa El Murciélago y la mejor oferta gastronómica marina.",
    highlights: ["Barbasquillo", "Playa El Murciélago", "Malecón Escénico", "Centro"],
  },
  {
    id: "tarqui",
    name: "Tarqui",
    query: "Tarqui",
    type: "Parroquia Urbana",
    lat: -0.9530,
    lng: -80.7050,
    zoom: 14,
    hotels: 38,
    icon: "⛵",
    badge: "Urbana · Playa & Gastronomía",
    desc: "Zona comercial y hotelera tradicional del cantón. Destaca por la Playa de Tarqui, el astillero artesanal de barcos de madera y los famosos puestos de mariscos frescos.",
    highlights: ["Playa Tarqui", "Astillero Artesanal", "Comercio Tradicional"],
  },
  {
    id: "los-esteros",
    name: "Los Esteros",
    query: "Los Esteros",
    type: "Parroquia Urbana",
    lat: -0.9480,
    lng: -80.6850,
    zoom: 14,
    hotels: 15,
    icon: "🌊",
    badge: "Urbana · Hoteles Costeros",
    desc: "Sector costero al norte de la bahía. Concentra hoteles frente al mar con vista panorámica a la rada portuaria y conexión inmediata al Aeropuerto Eloy Alfaro.",
    highlights: ["Hoteles Frente al Mar", "Playas del Norte", "Cerca al Aeropuerto"],
  },
  {
    id: "san-mateo",
    name: "San Mateo",
    query: "San Mateo",
    type: "Parroquia Urbana",
    lat: -0.9850,
    lng: -80.8120,
    zoom: 14,
    hotels: 8,
    icon: "🏄",
    badge: "Urbana · Puerto & Surf",
    desc: "Pintoresco puerto pesquero artesanal sobre acantilados. Famoso en toda Sudamérica por su rompiente de olas derechas perfectas para el surf y su gastronomía típica.",
    highlights: ["Puerto Pesquero", "Olas para Surf", "Acantilados y Miradores"],
  },
  {
    id: "santa-marianita",
    name: "Santa Marianita",
    query: "Santa Marianita",
    type: "Parroquia Rural",
    lat: -1.0250,
    lng: -80.8400,
    zoom: 13,
    hotels: 9,
    icon: "🪁",
    badge: "Rural · Capital del Kitesurf",
    desc: "Reconocida internacionalmente como la capital del kitesurf del Ecuador. Playa amplia de mar abierto con viento constante durante todo el año, hosterías de playa y ambiente relajado.",
    highlights: ["Escuelas de Kitesurf", "Playa Abierta", "Atardeceres Únicos"],
  },
  {
    id: "san-lorenzo",
    name: "San Lorenzo",
    query: "San Lorenzo",
    type: "Parroquia Rural",
    lat: -1.0650,
    lng: -80.9100,
    zoom: 12,
    hotels: 4,
    icon: "🌿",
    badge: "Rural · Reserva Pacoche & Faro",
    desc: "El corazón ecológico del cantón. Alberga la Reserva Marina y el Bosque Húmedo de Pacoche (avistamiento de monos aulladores), el histórico Faro de San Lorenzo y playas vírgenes como Ligüiqui.",
    highlights: ["Bosque de Pacoche", "El Faro", "Playas Vírgenes", "Senderismo"],
  },
  {
    id: "eloy-alfaro",
    name: "Eloy Alfaro",
    query: "Eloy Alfaro",
    type: "Parroquia Urbana",
    lat: -0.9750,
    lng: -80.6900,
    zoom: 14,
    hotels: 2,
    icon: "🏘️",
    badge: "Urbana · Comercial e Interior",
    desc: "Parroquia urbana residencial y comercial ubicada hacia el interior del cantón, conectada con las principales arterias viales y la terminal terrestre.",
    highlights: ["Conectividad Vial", "Zona Comercial", "Sector Residencial"],
  },
];

interface MantaMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: string) => void;
  hotels?: Hotel[];
}

export default function MantaMapModal({
  isOpen,
  onClose,
  onSelectDestination,
  hotels = [],
}: MantaMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [selectedSector, setSelectedSector] = useState<ParishSector>(MANTA_OFFICIAL_SECTORS[0]);
  const [filterType, setFilterType] = useState<"todos" | "urbanas" | "rurales">("todos");
  const [mapLayer, setMapLayer] = useState<"streets" | "satellite">("streets");

  // Función para cambiar capa de mapa
  function switchLayer(layer: "streets" | "satellite") {
    setMapLayer(layer);
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      layer === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: layer === "satellite" ? "© Esri Satellite" : "© OpenStreetMap",
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destruir mapa previo si existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializar mapa Leaflet centrado en Cantón Manta
    const map = L.map(mapContainerRef.current, {
      center: [-0.995, -80.78],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Añadir mapa base OpenStreetMap (100% libre, sin requerir API key)
    const initialTileUrl =
      mapLayer === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileLayer = L.tileLayer(initialTileUrl, {
      maxZoom: 19,
      attribution: mapLayer === "satellite" ? "© Esri" : "© OpenStreetMap",
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Crear marcadores personalizados para las 7 parroquias
    MANTA_OFFICIAL_SECTORS.forEach(sec => {
      const isRural = sec.type.includes("Rural");
      const html = `
        <div class="group cursor-pointer select-none" style="transform: translate(-50%, -50%);">
          <div class="px-3 py-1.5 rounded-full ${
            isRural
              ? "bg-emerald-950 text-white border-2 border-emerald-400"
              : "bg-slate-950 text-white border-2 border-amber-400"
          } shadow-2xl flex items-center gap-1.5 transition-all hover:scale-110 font-sans">
            <span class="text-sm">${sec.icon}</span>
            <span class="font-bold text-xs whitespace-nowrap">${sec.name}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              isRural ? "bg-emerald-400 text-emerald-950" : "bg-amber-400 text-slate-950"
            }">${sec.hotels} hot.</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      const marker = L.marker([sec.lat, sec.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedSector(sec);
        map.flyTo([sec.lat, sec.lng], sec.zoom, { duration: 0.8 });
      });
    });

    // Timeout para recalcular tamaño una vez visible
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSelectSector(sector: ParishSector) {
    setSelectedSector(sector);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([sector.lat, sector.lng], sector.zoom, { duration: 0.8 });
    }
  }

  function handleFilterClick(type: "todos" | "urbanas" | "rurales") {
    setFilterType(type);
    if (!mapInstanceRef.current) return;

    if (type === "urbanas") {
      mapInstanceRef.current.flyTo([-0.955, -80.71], 13, { duration: 0.8 });
    } else if (type === "rurales") {
      mapInstanceRef.current.flyTo([-1.045, -80.87], 12, { duration: 0.8 });
    } else {
      mapInstanceRef.current.flyTo([-0.995, -80.78], 11, { duration: 0.8 });
    }
  }

  function handleConfirmSelection() {
    onSelectDestination(selectedSector.query);
    onClose();
  }

  const displayedSectors = MANTA_OFFICIAL_SECTORS.filter(s => {
    if (filterType === "urbanas") return s.type.includes("Urbana");
    if (filterType === "rurales") return s.type.includes("Rural");
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden border border-slate-200">
        {/* ─── Encabezado del Modal ─── */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-xs">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Sectorización Geográfica del Cantón Manta
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600">
                  7 Parroquias Oficiales · 116 Alojamientos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explora las zonas y playas en el mapa real para elegir dónde hospedarte
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm"
            title="Cerrar mapa"
          >
            ✕
          </button>
        </div>

        {/* ─── Barra de Filtros Rápidos y Selector de Capa ─── */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500 text-[11px] mr-1">Filtrar por:</span>
            <button
              type="button"
              onClick={() => handleFilterClick("todos")}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                filterType === "todos"
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Todas (7)
            </button>
            <button
              type="button"
              onClick={() => handleFilterClick("urbanas")}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1 ${
                filterType === "urbanas"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <span>🏙️</span> 5 Urbanas
            </button>
            <button
              type="button"
              onClick={() => handleFilterClick("rurales")}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1 ${
                filterType === "rurales"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <span>🌿</span> 2 Rurales (Kitesurf & Pacoche)
            </button>
          </div>

          {/* Selector de Capa: Mapa Callejero vs Satélite Real */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-slate-200 text-[11px] font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => switchLayer("streets")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                mapLayer === "streets"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🗺️</span>
              <span>Callejero</span>
            </button>
            <button
              type="button"
              onClick={() => switchLayer("satellite")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                mapLayer === "satellite"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🛰️</span>
              <span>Satélite Real</span>
            </button>
          </div>
        </div>

        {/* ─── Cuerpo Principal: Mapa + Panel de Parroquias ─── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
          {/* Contenedor del Mapa Leaflet */}
          <div className="flex-1 min-h-[300px] relative bg-slate-100">
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "350px" }} />

            {/* Leyenda flotante sobre el mapa */}
            <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-[10px] text-slate-700 space-y-1 select-none pointer-events-auto">
              <p className="font-bold text-slate-900 text-[11px]">Simbología de Sectores</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-400"></span>
                <span>Parroquia Urbana (Tarqui, Manta, Esteros, San Mateo, Eloy)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-900 border border-emerald-400"></span>
                <span>Parroquia Rural (Santa Marianita, San Lorenzo)</span>
              </div>
            </div>
          </div>

          {/* Panel Lateral: Detalle del Sector Seleccionado y Lista */}
          <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
            {/* Tarjeta Destacada del Sector Activo */}
            <div className="p-4 bg-gradient-to-b from-amber-50/70 to-white border-b border-slate-200 shrink-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center text-2xl shadow-xs border border-amber-200 shrink-0">
                    {selectedSector.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                      {selectedSector.name}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        selectedSector.type.includes("Rural")
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-blue-100 text-blue-900 border border-blue-300"
                      }`}
                    >
                      {selectedSector.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 inline-block">
                    {selectedSector.hotels} hoteles
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                {selectedSector.desc}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {selectedSector.highlights.map(h => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmSelection}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>Buscar hoteles en {selectedSector.name}</span>
                <span>→</span>
              </button>
            </div>

            {/* Lista Desplazable de las Parroquias */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Seleccionar otra parroquia oficial
              </p>
              {displayedSectors.map(sec => {
                const isSelected = selectedSector.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSelectSector(sec)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? "bg-amber-50 border-amber-300 shadow-xs"
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{sec.icon}</span>
                      <div className="min-w-0">
                        <p className={`font-bold text-xs truncate ${isSelected ? "text-amber-950" : "text-slate-800"}`}>
                          {sec.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {sec.highlights.join(" · ")}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                      {sec.hotels} hot.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
