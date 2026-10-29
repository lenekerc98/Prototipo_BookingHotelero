// ─── Catálogo Oficial Completo de Alojamientos de Manta (Consolidado 2026) ─────────────
// 116 establecimientos registrados oficialmente ante el Ministerio de Turismo y GAD Manta

export interface RoomOffer {
  id: string;
  type: string; // Tipo de Habitación (Ej: "1 Cama King Size Frente al Mar", "1 Cama Queen Matrimonial")
  beds: string; // Especificación de camas (Ej: "1 Cama King Size (2x2m)", "2 Camas Twin")
  capacity: number;
  size: number;
  pricePerNight: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  available: number;
  breakfastIncluded?: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  classification?: string; // "HOTEL" | "HOSTAL" | "HOSTERÍA"
  category?: string; // "5 Estrellas", "4 Estrellas", "3 Estrellas", "2 Estrellas", "1 Estrella"
  parroquia?: string;
  parish?: string;
  city: string;
  address: string;
  image: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  tags: string[];
  amenities: string[];
  description: string;
  distance: string;
  gravaServicio10?: boolean;
  phone: string;
  taxId: string;
  owner?: string;
  regNumber?: string;
  rooms: RoomOffer[];
}

export interface MyReservation {
  id: string;
  hotel: string;
  hotelId: string;
  city: string;
  room: string; // Tipo de habitación reservada
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: "upcoming" | "completed" | "cancelled";
  image: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  payMethod?: string;
}

export const MANTA_HOTELS: Hotel[] = [
  {
    "id": "hotel-voyager-manta",
    "name": "Hotel Voyager Manta",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 10",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&auto=format",
    "rating": 4.0,
    "reviews": 80,
    "priceFrom": 45,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261000",
    "taxId": "0103405833001",
    "owner": "De Cian Opitz Robert",
    "regNumber": "0103405833001.001.2002132",
    "rooms": [
      {
    "id": "hotel-voyager-manta-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-voyager-manta-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-voyager-manta-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-el-naufrago",
    "name": "Hostal el Naufrago",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 52,
    "priceFrom": 31,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261027",
    "taxId": "0200508570001",
    "owner": "Gavilanes Gutierrez Luis Alberto",
    "regNumber": "0200508570001.001.2011200",
    "rooms": [
      {
    "id": "hostal-el-naufrago-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-el-naufrago-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-el-naufrago-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-el-naufrago-2",
    "name": "Hostal el Naufrago 2",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 69,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261054",
    "taxId": "0200508570001",
    "owner": "Gavilanes Gutierrez Luis Alberto",
    "regNumber": "0200508570001.002.2011539",
    "rooms": [
      {
    "id": "hostal-el-naufrago-2-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-el-naufrago-2-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-el-naufrago-2-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "mare-s-m-hostal",
    "name": "Mare S&M Hostal",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. 4 de Noviembre y Calle 103",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 149,
    "priceFrom": 60,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261081",
    "taxId": "0603073776001",
    "owner": "Santamaria Philco Alex Andres",
    "regNumber": "0603073776001.001.2000581",
    "rooms": [
      {
    "id": "mare-s-m-hostal-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "mare-s-m-hostal-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "mare-s-m-hostal-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-la-gran-familia",
    "name": "Hostal la Gran Familia",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Playa El Murciélago, Malecón Escénico Local 5",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 103,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261108",
    "taxId": "0700777592001",
    "owner": "Coronel Valarezo Fanny Rosa Aurora",
    "regNumber": "0700777592001.008.2015132",
    "rooms": [
      {
    "id": "hostal-la-gran-familia-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-la-gran-familia-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-la-gran-familia-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "black-white",
    "name": "Black & White",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 17, Los Esteros",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 120,
    "priceFrom": 18,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261135",
    "taxId": "0802757294001",
    "owner": "Zambrano Quiroz Freddy Jhonny",
    "regNumber": "0802757294001.007.5000119",
    "rooms": [
      {
    "id": "black-white-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "black-white-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "black-white-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-zambayas",
    "name": "Hostal Zambayas",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 16",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 137,
    "priceFrom": 20,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261162",
    "taxId": "0802757294001",
    "owner": "Zambrano Quiroz Freddy Jhonny",
    "regNumber": "0802757294001.008.2014586",
    "rooms": [
      {
    "id": "hostal-zambayas-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-zambayas-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-zambayas-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 21,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-los-esteros",
    "name": "Hostal los Esteros",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 154,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261189",
    "taxId": "0803059245001",
    "owner": "Cabeza Bazan Yolanda Emerita",
    "regNumber": "0803059245001.002.2011540",
    "rooms": [
      {
    "id": "hostal-los-esteros-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-los-esteros-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-los-esteros-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-premier-inn",
    "name": "Hostal Premier Inn",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 171,
    "priceFrom": 24,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261216",
    "taxId": "0904994795001",
    "owner": "Mantuano Anchundia Carmen Bernaldina",
    "regNumber": "0904994795001.001.2011196",
    "rooms": [
      {
    "id": "hostal-premier-inn-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-premier-inn-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-premier-inn-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "pikeiro-blue",
    "name": "Pikeiro Blue",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 109",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 188,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261243",
    "taxId": "0913279089001",
    "owner": "Mendoza Cedeño Edison Antonio",
    "regNumber": "0913279089001.001.2003235",
    "rooms": [
      {
    "id": "pikeiro-blue-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "pikeiro-blue-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "pikeiro-blue-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-san-lorenzo",
    "name": "Hostal San Lorenzo",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "SAN LORENZO",
    "parish": "San Lorenzo","city": "Manta - San Lorenzo (Faro y Reserva)",
    "address": "Playa El Murciélago, Malecón Escénico Local 11",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 205,
    "priceFrom": 18,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - San Lorenzo (Faro y Reserva), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector San lorenzo · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261270",
    "taxId": "0921306098001",
    "owner": "Montalvan Acosta Pedro Isidoro",
    "regNumber": "0921306098001.002.2011092",
    "rooms": [
      {
    "id": "hostal-san-lorenzo-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-san-lorenzo-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-san-lorenzo-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hosteria-el-bosque",
    "name": "Hostería el Bosque",
    "stars": 3,
    "classification": "Hostería",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 13, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 83,
    "priceFrom": 50,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostería - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261297",
    "taxId": "0927852277001",
    "owner": "Cerda Castillo Rolando Guillermo",
    "regNumber": "0927852277001.001.7002579",
    "rooms": [
      {
    "id": "hosteria-el-bosque-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hosteria-el-bosque-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hosteria-el-bosque-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-marina-breeze",
    "name": "Hotel Marina Breeze",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 22",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 106,
    "priceFrom": 55,
    "tags": [
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261324",
    "taxId": "0950683375001",
    "owner": "Hidalgo Velasquez Edy Eduardo",
    "regNumber": "0950683375001.002.2015111",
    "rooms": [
      {
    "id": "hotel-marina-breeze-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 55,
        "originalPrice": 64,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-marina-breeze-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 41,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-marina-breeze-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 74,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "the-lookout-hostel",
    "name": "The Lookout Hostel",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "SAN LORENZO",
    "parish": "San Lorenzo","city": "Manta - San Lorenzo (Faro y Reserva)",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format",
    "rating": 4.2,
    "reviews": 129,
    "priceFrom": 60,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - San Lorenzo (Faro y Reserva), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector San lorenzo · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261351",
    "taxId": "0959920927001",
    "owner": "Armstrong George",
    "regNumber": "0959920927001.001.2003064",
    "rooms": [
      {
    "id": "the-lookout-hostel-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "the-lookout-hostel-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "the-lookout-hostel-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-la-gaviota-dorada-de-manta",
    "name": "Hostal la Gaviota Dorada de Manta",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 93,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261378",
    "taxId": "0961914934001",
    "owner": "Oliveira Macias Jhonny Albino",
    "regNumber": "0961914934001.002.2001842",
    "rooms": [
      {
    "id": "hostal-la-gaviota-dorada-de-manta-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-la-gaviota-dorada-de-manta-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-la-gaviota-dorada-de-manta-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-malania",
    "name": "Hostal Malania",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 100",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.5,
    "reviews": 175,
    "priceFrom": 45,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261405",
    "taxId": "0963198379001",
    "owner": "Marquez Marquez Massiel Katherine",
    "regNumber": "0963198379001.001.2001820",
    "rooms": [
      {
    "id": "hostal-malania-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-malania-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-malania-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-canarias",
    "name": "Hostal Canarias",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 17",
    "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&auto=format",
    "rating": 4.3,
    "reviews": 198,
    "priceFrom": 50,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261432",
    "taxId": "0963925045001",
    "owner": "Muentes Mera Victor Yandry",
    "regNumber": "0963925045001.001.2001911",
    "rooms": [
      {
    "id": "hostal-canarias-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hostal-canarias-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-canarias-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-intiquilla",
    "name": "Hostal Intiquilla",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Vía Costanera Sur Km 19, Santa Marianita (Playa Kite)",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 221,
    "priceFrom": 55,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261459",
    "taxId": "0964994115001",
    "owner": "Mamane Naomi",
    "regNumber": "0964994115001.001.2002928",
    "rooms": [
      {
    "id": "hostal-intiquilla-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 55,
        "originalPrice": 64,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-intiquilla-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 41,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-intiquilla-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 74,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "mantahost-hotel",
    "name": "Mantahost Hotel",
    "stars": 5,
    "classification": "Hotel",
    "category": "5 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 28",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop&auto=format",
    "rating": 4.5,
    "reviews": 366,
    "priceFrom": 145,
    "tags": [
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h",
      "Gimnasio & Spa",
      "Acceso directo a playa",
      "Salones de eventos",
      "Concierge"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 5 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261486",
    "taxId": "0991429360001",
    "owner": "Manhost S.A.",
    "regNumber": "0991429360001.002.2000384",
    "rooms": [
      {
    "id": "mantahost-hotel-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 58,
        "pricePerNight": 145,
        "originalPrice": 166,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "mantahost-hotel-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 43,
        "pricePerNight": 123,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "mantahost-hotel-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 45,
        "pricePerNight": 127,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-porto-velho",
    "name": "Hotel Porto Velho",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 178,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261513",
    "taxId": "0992669780001",
    "owner": "Servicios E Inmobiliaria Ata&far S.A.",
    "regNumber": "0992669780001.002.7002570",
    "rooms": [
      {
    "id": "hotel-porto-velho-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-porto-velho-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-porto-velho-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-sail-plaza-manta",
    "name": "Hotel Sail Plaza Manta",
    "stars": 5,
    "classification": "Hotel",
    "category": "5 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 440,
    "priceFrom": 175,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h",
      "Gimnasio & Spa",
      "Acceso directo a playa",
      "Salones de eventos",
      "Concierge"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 5 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261540",
    "taxId": "0992855592001",
    "owner": "Fideicomiso Mercantil Hotel Sail Plaza Manta Ecuador",
    "regNumber": "0992855592001.002.2001345",
    "rooms": [
      {
    "id": "hotel-sail-plaza-manta-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 58,
        "pricePerNight": 175,
        "originalPrice": 201,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-sail-plaza-manta-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 43,
        "pricePerNight": 148,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-sail-plaza-manta-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 45,
        "pricePerNight": 154,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "goldenmar",
    "name": "Goldenmar",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 106",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.0,
    "reviews": 313,
    "priceFrom": 50,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261567",
    "taxId": "1002180394001",
    "owner": "Miño Jativa Mario Javier",
    "regNumber": "1002180394001.001.2011087",
    "rooms": [
      {
    "id": "goldenmar-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "goldenmar-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "goldenmar-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "pacifico",
    "name": "Pacifico",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 23",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 49,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261594",
    "taxId": "1300071402001",
    "owner": "Vallejo Escobar Pedro Vicente",
    "regNumber": "1300071402001.001.7002568",
    "rooms": [
      {
    "id": "pacifico-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "pacifico-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "pacifico-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "maria-jose",
    "name": "Maria Jose",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 15, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.3,
    "reviews": 109,
    "priceFrom": 60,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261621",
    "taxId": "1300165410001",
    "owner": "Espinoza Barcia Marcos Eduardo",
    "regNumber": "1300165410001.001.7008805",
    "rooms": [
      {
    "id": "maria-jose-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "maria-jose-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "maria-jose-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "jacintita",
    "name": "Jacintita",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 14",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 83,
    "priceFrom": 26,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261648",
    "taxId": "1300414156001",
    "owner": "Palma Franco Edith Yolanda",
    "regNumber": "1300414156001.002.2000964",
    "rooms": [
      {
    "id": "jacintita-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "jacintita-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "jacintita-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "leo-hotel",
    "name": "Leo Hotel",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 100,
    "priceFrom": 28,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261675",
    "taxId": "1300630330001",
    "owner": "Guanoluisa Guanoluisa Leonidas",
    "regNumber": "1300630330001.004.7008806",
    "rooms": [
      {
    "id": "leo-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "leo-hotel-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "leo-hotel-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-torres-del-norte",
    "name": "Hotel Torres del Norte",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 117,
    "priceFrom": 31,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261702",
    "taxId": "1301845341001",
    "owner": "Mendoza Pinargote Ramon Vicente",
    "regNumber": "1301845341001.001.2001834",
    "rooms": [
      {
    "id": "hotel-torres-del-norte-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-torres-del-norte-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-torres-del-norte-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-la-tortuga",
    "name": "Hostal la Tortuga",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "SAN LORENZO",
    "parish": "San Lorenzo","city": "Manta - San Lorenzo (Faro y Reserva)",
    "address": "Av. 4 de Noviembre y Calle 112",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 134,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - San Lorenzo (Faro y Reserva), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector San lorenzo · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261729",
    "taxId": "1302014756001",
    "owner": "Triviño Montalvan Digna Landi",
    "regNumber": "1302014756001.002.2011118",
    "rooms": [
      {
    "id": "hostal-la-tortuga-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-la-tortuga-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-la-tortuga-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-perlamar",
    "name": "Hostal Perlamar",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 29",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 151,
    "priceFrom": 24,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261756",
    "taxId": "1302486046001",
    "owner": "Paredes Saltos Jenny Monserrate",
    "regNumber": "1302486046001.002.5000199",
    "rooms": [
      {
    "id": "hostal-perlamar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-perlamar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-perlamar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-los-cactus",
    "name": "Hostal los Cactus",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 21, Los Esteros",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 168,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261783",
    "taxId": "1302606627001",
    "owner": "Bravo Moreira Nexar Antonio",
    "regNumber": "1302606627001.001.2001391",
    "rooms": [
      {
    "id": "hostal-los-cactus-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-los-cactus-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-los-cactus-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "maryormar",
    "name": "Maryormar",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 20",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 185,
    "priceFrom": 18,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261810",
    "taxId": "1303415739001",
    "owner": "Mendoza Moreira Marcelina",
    "regNumber": "1303415739001.001.7001535",
    "rooms": [
      {
    "id": "maryormar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "maryormar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "maryormar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-hamilton",
    "name": "Hotel Hamilton",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 397,
    "priceFrom": 82,
    "tags": [
      "WiFi Alta Velocidad",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261837",
    "taxId": "1303479826001",
    "owner": "Lopez Alonzo Hamilton Nery",
    "regNumber": "1303479826001.001.7007718",
    "rooms": [
      {
    "id": "hotel-hamilton-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 82,
        "originalPrice": 94,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-hamilton-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 69,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-hamilton-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 72,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "mar-y-tierra",
    "name": "Mar y Tierra",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 316,
    "priceFrom": 55,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 261864",
    "taxId": "1303501033001",
    "owner": "Peña Hidalgo Narcisa Clara",
    "regNumber": "1303501033001.001.7007229",
    "rooms": [
      {
    "id": "mar-y-tierra-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 55,
        "originalPrice": 64,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "mar-y-tierra-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 41,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "mar-y-tierra-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 74,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "maria-fernanda",
    "name": "Maria Fernanda",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 103",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 56,
    "priceFrom": 37,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261891",
    "taxId": "1303591422001",
    "owner": "Alvia Reyes Antonio Eduardo",
    "regNumber": "1303591422001.001.7008801",
    "rooms": [
      {
    "id": "maria-fernanda-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "maria-fernanda-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "maria-fernanda-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "playa-murcielago",
    "name": "Playa Murcielago",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 35",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 73,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261918",
    "taxId": "1303652547001",
    "owner": "Alava Avila Mercy Morayma Jazmine",
    "regNumber": "1303652547001.001.7001530",
    "rooms": [
      {
    "id": "playa-murcielago-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "playa-murcielago-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "playa-murcielago-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-plata-de-mar",
    "name": "Hostal Plata de Mar",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 17, Los Esteros",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.0,
    "reviews": 135,
    "priceFrom": 45,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261945",
    "taxId": "1303756934001",
    "owner": "Soledispa Mero Pastora Soledad",
    "regNumber": "1303756934001.002.2011056",
    "rooms": [
      {
    "id": "hostal-plata-de-mar-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-plata-de-mar-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-plata-de-mar-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-mi-kasa",
    "name": "Hostal Mi Kasa",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 26",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 107,
    "priceFrom": 31,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261972",
    "taxId": "1304035684001",
    "owner": "Loor Cevallos Patricia Asuncion",
    "regNumber": "1304035684001.001.7008803",
    "rooms": [
      {
    "id": "hostal-mi-kasa-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-mi-kasa-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-mi-kasa-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "del-mar",
    "name": "Del Mar",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 124,
    "priceFrom": 22,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 261999",
    "taxId": "1304309915001",
    "owner": "Gonzembach Pinoargote Grace Gina",
    "regNumber": "1304309915001.002.7008808",
    "rooms": [
      {
    "id": "del-mar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "del-mar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "del-mar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "rosa-mar",
    "name": "Rosa Mar",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 141,
    "priceFrom": 24,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262026",
    "taxId": "1304572165001",
    "owner": "Arteaga Zambrano Rosa Teresa",
    "regNumber": "1304572165001.001.7001522",
    "rooms": [
      {
    "id": "rosa-mar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "rosa-mar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "rosa-mar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "avellan",
    "name": "Avellan",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. 4 de Noviembre y Calle 109",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 158,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262053",
    "taxId": "1304923038001",
    "owner": "Avellan Zambrano Jorge Luis",
    "regNumber": "1304923038001.002.7007245",
    "rooms": [
      {
    "id": "avellan-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "avellan-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "avellan-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "cabanas-las-velas",
    "name": "Cabañas las Velas",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Playa El Murciélago, Malecón Escénico Local 41",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 175,
    "priceFrom": 28,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262080",
    "taxId": "1304989526001",
    "owner": "Cedeño Vega Laura Jessenia",
    "regNumber": "1304989526001.001.2010917",
    "rooms": [
      {
    "id": "cabanas-las-velas-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "cabanas-las-velas-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "cabanas-las-velas-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-oceanik",
    "name": "Hotel Oceanik",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Vía Costanera Sur Km 13, El Murciélago",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 192,
    "priceFrom": 31,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262107",
    "taxId": "1305272187001",
    "owner": "Cevallos Cedeño Amantilia Monserrate",
    "regNumber": "1305272187001.004.2015221",
    "rooms": [
      {
    "id": "hotel-oceanik-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-oceanik-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-oceanik-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-manakin",
    "name": "Hostal Manakin",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 12",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 209,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262134",
    "taxId": "1305966838001",
    "owner": "Vera Marchan Eddie Fernando",
    "regNumber": "1305966838001.002.2014932",
    "rooms": [
      {
    "id": "hostal-manakin-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-manakin-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-manakin-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-malecon-blue",
    "name": "Hostal Malecon Blue",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 46,
    "priceFrom": 24,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262161",
    "taxId": "1306112101001",
    "owner": "Flores Franco Carmen Maritza",
    "regNumber": "1306112101001.001.2011108",
    "rooms": [
      {
    "id": "hostal-malecon-blue-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-malecon-blue-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-malecon-blue-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-manakin-45",
    "name": "Hostal Manakin",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&auto=format",
    "rating": 4.3,
    "reviews": 92,
    "priceFrom": 65,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 262188",
    "taxId": "1306112911001",
    "owner": "Vera Marchan Eduardo Antonio",
    "regNumber": "1306112911001.001.2011465",
    "rooms": [
      {
    "id": "hostal-manakin-45-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 65,
        "originalPrice": 76,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hostal-manakin-45-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 48,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-manakin-45-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 87,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "manta-airport-hotel",
    "name": "Manta Airport Hotel",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 100",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 115,
    "priceFrom": 45,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262215",
    "taxId": "1306375682001",
    "owner": "Velez Velez Lady Elizabeth",
    "regNumber": "1306375682001.001.2001272",
    "rooms": [
      {
    "id": "manta-airport-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "manta-airport-hotel-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "manta-airport-hotel-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "dorita",
    "name": "Dorita",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Playa El Murciélago, Malecón Escénico Local 47",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 97,
    "priceFrom": 20,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262242",
    "taxId": "1306882463001",
    "owner": "Garcia Monge Doris Edith",
    "regNumber": "1306882463001.001.7009733",
    "rooms": [
      {
    "id": "dorita-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "dorita-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "dorita-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 21,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-sisu",
    "name": "Hostal Sisu",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 19, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 114,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262269",
    "taxId": "1306887868001",
    "owner": "Cuaces Oviedo Rosa Elvira",
    "regNumber": "1306887868001.001.5000053",
    "rooms": [
      {
    "id": "hostal-sisu-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-sisu-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-sisu-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-paris",
    "name": "Hostal Paris",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 18",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 131,
    "priceFrom": 37,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262296",
    "taxId": "1307112332001",
    "owner": "Zambrano Macias Kenia Marisol",
    "regNumber": "1307112332001.002.2011047",
    "rooms": [
      {
    "id": "hostal-paris-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-paris-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-paris-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "playa-imperial-hostal",
    "name": "Playa Imperial Hostal",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 148,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262323",
    "taxId": "1307382224001",
    "owner": "Lopez Feiz Magaly Guadalupe",
    "regNumber": "1307382224001.001.2014028",
    "rooms": [
      {
    "id": "playa-imperial-hostal-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "playa-imperial-hostal-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "playa-imperial-hostal-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-la-caida-del-sol",
    "name": "Hostal la Caida del Sol",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 165,
    "priceFrom": 18,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262350",
    "taxId": "1307426682001",
    "owner": "Holguin Muentes Carmen Piedad",
    "regNumber": "1307426682001.002.2002913",
    "rooms": [
      {
    "id": "hostal-la-caida-del-sol-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-la-caida-del-sol-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-la-caida-del-sol-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-baumer",
    "name": "Hostal Baumer",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 106",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 182,
    "priceFrom": 31,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262377",
    "taxId": "1307763712001",
    "owner": "Garcia Mero Walter Ecuador",
    "regNumber": "1307763712001.006.2001957",
    "rooms": [
      {
    "id": "hostal-baumer-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-baumer-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-baumer-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "casa-umina",
    "name": "Casa Umiña",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 53",
    "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 276,
    "priceFrom": 55,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 262404",
    "taxId": "1307983179001",
    "owner": "Zambrano Arteaga Maria Magdalena",
    "regNumber": "1307983179001.001.7009762",
    "rooms": [
      {
    "id": "casa-umina-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 55,
        "originalPrice": 64,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "casa-umina-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 41,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "casa-umina-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 74,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-mayita",
    "name": "Hotel Mayita",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Vía Costanera Sur Km 15, Tarqui",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 36,
    "priceFrom": 37,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262431",
    "taxId": "1308127222001",
    "owner": "Orama Quijije Jenny Mayra",
    "regNumber": "1308127222001.001.5000174",
    "rooms": [
      {
    "id": "hotel-mayita-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-mayita-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-mayita-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-brisas-del-pacifico-m-s",
    "name": "Hostal Brisas del Pacifico m.s.",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 24",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 53,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262458",
    "taxId": "1308360138001",
    "owner": "Lopez Tumbaco Silvia Alexandra",
    "regNumber": "1308360138001.004.2014192",
    "rooms": [
      {
    "id": "hostal-brisas-del-pacifico-m-s-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-brisas-del-pacifico-m-s-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-brisas-del-pacifico-m-s-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "jordan",
    "name": "Jordan",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Tarqui",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 70,
    "priceFrom": 18,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262485",
    "taxId": "1308444916001",
    "owner": "De la Cruz Mendoza Jorge Luis",
    "regNumber": "1308444916001.002.7008907",
    "rooms": [
      {
    "id": "jordan-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "jordan-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "jordan-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-jordan-ii",
    "name": "Hostal Jordan II",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 87,
    "priceFrom": 31,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262512",
    "taxId": "1308444916001",
    "owner": "De la Cruz Mendoza Jorge Luis",
    "regNumber": "1308444916001.004.2000298",
    "rooms": [
      {
    "id": "hostal-jordan-ii-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-jordan-ii-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-jordan-ii-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "veranera-hostal",
    "name": "Veranera Hostal",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 112",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 104,
    "priceFrom": 22,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262539",
    "taxId": "1308660941001",
    "owner": "Vallejo Zambrano Maria Angelica",
    "regNumber": "1308660941001.002.2001733",
    "rooms": [
      {
    "id": "veranera-hostal-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "veranera-hostal-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "veranera-hostal-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-los-mantas-i",
    "name": "Hostal los Mantas I",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 59",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 121,
    "priceFrom": 24,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262566",
    "taxId": "1308853553001",
    "owner": "Loor Achong Silvia Vanessa",
    "regNumber": "1308853553001.001.2011139",
    "rooms": [
      {
    "id": "hostal-los-mantas-i-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-los-mantas-i-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-los-mantas-i-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-costa-verde",
    "name": "Hostal Costa Verde",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 21, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 138,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262593",
    "taxId": "1308853553001",
    "owner": "Loor Achong Silvia Vanessa",
    "regNumber": "1308853553001.004.2001336",
    "rooms": [
      {
    "id": "hostal-costa-verde-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-costa-verde-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-costa-verde-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-blue-pacific",
    "name": "Hostal Blue Pacific",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 10",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 155,
    "priceFrom": 28,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262620",
    "taxId": "1309064481001",
    "owner": "Davalos Andrade Nanci Cecilia",
    "regNumber": "1309064481001.001.7007242",
    "rooms": [
      {
    "id": "hostal-blue-pacific-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-blue-pacific-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-blue-pacific-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-araguaney",
    "name": "Hotel Araguaney",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 172,
    "priceFrom": 31,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262647",
    "taxId": "1309661054001",
    "owner": "Macias Arauz Gustavo Junior",
    "regNumber": "1309661054001.002.2001028",
    "rooms": [
      {
    "id": "hotel-araguaney-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-araguaney-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-araguaney-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-boulevard-1",
    "name": "Hotel Boulevard 1",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 189,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262674",
    "taxId": "1309661112001",
    "owner": "Hermida Intriago Cristhian Enrique",
    "regNumber": "1309661112001.004.2015173",
    "rooms": [
      {
    "id": "hotel-boulevard-1-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-boulevard-1-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-boulevard-1-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "tepools",
    "name": "Tepools",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. 4 de Noviembre y Calle 103",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.0,
    "reviews": 279,
    "priceFrom": 60,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262701",
    "taxId": "1309702288001",
    "owner": "Quiroz Ponce Celso Nazario",
    "regNumber": "1309702288001.005.2015209",
    "rooms": [
      {
    "id": "tepools-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "tepools-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "tepools-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "minotauro",
    "name": "Minotauro",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 65",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 43,
    "priceFrom": 40,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262728",
    "taxId": "1309902771001",
    "owner": "Pico Arteaga Fabricio Daniel",
    "regNumber": "1309902771001.999.7008811",
    "rooms": [
      {
    "id": "minotauro-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "minotauro-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "minotauro-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-piazolla",
    "name": "Hostal Piazolla",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 17, Los Esteros",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 60,
    "priceFrom": 28,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262755",
    "taxId": "1310227275001",
    "owner": "De la Cruz Carreño Viviana Alexandra",
    "regNumber": "1310227275001.004.2013350",
    "rooms": [
      {
    "id": "hostal-piazolla-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-piazolla-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-piazolla-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-old-navy",
    "name": "Hotel Old Navy",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 16",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 77,
    "priceFrom": 31,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262782",
    "taxId": "1310314057001",
    "owner": "Mendoza Guanoluisa Evelyn Carolina",
    "regNumber": "1310314057001.003.2015481",
    "rooms": [
      {
    "id": "hotel-old-navy-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-old-navy-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-old-navy-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "san-roque-hostal",
    "name": "San Roque Hostal",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 94,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262809",
    "taxId": "1310355944001",
    "owner": "Cedeño Bermudez Roque Ivan",
    "regNumber": "1310355944001.003.2002352",
    "rooms": [
      {
    "id": "san-roque-hostal-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "san-roque-hostal-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "san-roque-hostal-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-yormari",
    "name": "Hotel Yormari",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 144,
    "priceFrom": 60,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 262836",
    "taxId": "1310412935001",
    "owner": "Merchan Ponce Roberto Carlos",
    "regNumber": "1310412935001.001.7001586",
    "rooms": [
      {
    "id": "hotel-yormari-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-yormari-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-yormari-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-internacional-del-pacifico",
    "name": "Hostal Internacional del Pacifico",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. 4 de Noviembre y Calle 109",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 128,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262863",
    "taxId": "1311435018001",
    "owner": "Vallejo Calderon Pedro Vicente",
    "regNumber": "1311435018001.001.2013339",
    "rooms": [
      {
    "id": "hostal-internacional-del-pacifico-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-internacional-del-pacifico-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-internacional-del-pacifico-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-porto-alegre",
    "name": "Hostal Porto Alegre",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 71",
    "image": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 145,
    "priceFrom": 18,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262890",
    "taxId": "1311772139001",
    "owner": "Cañarte Mero Maria Jasmin",
    "regNumber": "1311772139001.001.7001567",
    "rooms": [
      {
    "id": "hostal-porto-alegre-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-porto-alegre-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-porto-alegre-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "habitaciones-sky",
    "name": "Habitaciones Sky",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 13, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.5,
    "reviews": 213,
    "priceFrom": 50,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262917",
    "taxId": "1311847907001",
    "owner": "Lara Ponce Karla Ximena",
    "regNumber": "1311847907001.001.2015426",
    "rooms": [
      {
    "id": "habitaciones-sky-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "habitaciones-sky-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "habitaciones-sky-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "luz-de-aurora-hotel",
    "name": "Luz de Aurora Hotel",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "ELOY ALFARO",
    "parish": "Eloy Alfaro","city": "Manta - Eloy Alfaro",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 22",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 179,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Eloy Alfaro, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Eloy alfaro · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262944",
    "taxId": "1313413013001",
    "owner": "Loor Cedeño Marlon Ariolfo",
    "regNumber": "1313413013001.001.5000017",
    "rooms": [
      {
    "id": "luz-de-aurora-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "luz-de-aurora-hotel-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "luz-de-aurora-hotel-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostalcabana-punta-la-barca",
    "name": "Hostalcabaña Punta la Barca",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 196,
    "priceFrom": 24,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262971",
    "taxId": "1313591370001",
    "owner": "Vera Delgado Juan Andres",
    "regNumber": "1313591370001.001.2013080",
    "rooms": [
      {
    "id": "hostalcabana-punta-la-barca-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostalcabana-punta-la-barca-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostalcabana-punta-la-barca-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-la-pinta",
    "name": "Hostal la Pinta",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 213,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 262998",
    "taxId": "1314685171001",
    "owner": "Macias Peñarrieta Michelle Jamilet",
    "regNumber": "1314685171001.003.2014330",
    "rooms": [
      {
    "id": "hostal-la-pinta-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-la-pinta-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-la-pinta-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-amelia-de-la-rosa",
    "name": "Hostal Amelia de la Rosa",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 100",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 305,
    "priceFrom": 45,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263025",
    "taxId": "1315075885001",
    "owner": "Macias Arauz Gustavo Adolfo",
    "regNumber": "1315075885001.002.2011013",
    "rooms": [
      {
    "id": "hostal-amelia-de-la-rosa-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-amelia-de-la-rosa-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-amelia-de-la-rosa-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-las-orquideas",
    "name": "Hostal las Orquideas",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Playa El Murciélago, Malecón Escénico Local 77",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 67,
    "priceFrom": 20,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263052",
    "taxId": "1315728533001",
    "owner": "Cahuasqui Arauz Mario Fabian",
    "regNumber": "1315728533001.002.2015148",
    "rooms": [
      {
    "id": "hostal-las-orquideas-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-las-orquideas-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-las-orquideas-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 21,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-los-tres-reyes",
    "name": "Hostal los Tres Reyes",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 19, Los Esteros",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 84,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263079",
    "taxId": "1315728905001",
    "owner": "De la Cruz Alarcon Nataly Yuleisy",
    "regNumber": "1315728905001.002.2015471",
    "rooms": [
      {
    "id": "hostal-los-tres-reyes-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-los-tres-reyes-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-los-tres-reyes-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-porlamar",
    "name": "Hostal Porlamar",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 28",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 101,
    "priceFrom": 37,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263106",
    "taxId": "1350113237001",
    "owner": "Muentes Cañarte Luz Jazmin",
    "regNumber": "1350113237001.001.2014084",
    "rooms": [
      {
    "id": "hostal-porlamar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-porlamar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-porlamar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-oromar",
    "name": "Hostal Oromar",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format",
    "rating": 4.3,
    "reviews": 147,
    "priceFrom": 65,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263133",
    "taxId": "1351080062001",
    "owner": "Muñoz Machacury Bianca Jhulley",
    "regNumber": "1351080062001.003.2015682",
    "rooms": [
      {
    "id": "hostal-oromar-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 65,
        "originalPrice": 76,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-oromar-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 48,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-oromar-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 87,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-oro-verde",
    "name": "Hotel Oro Verde",
    "stars": 5,
    "classification": "Hotel",
    "category": "5 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 410,
    "priceFrom": 165,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h",
      "Gimnasio & Spa",
      "Acceso directo a playa",
      "Salones de eventos",
      "Concierge"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 5 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263160",
    "taxId": "1390142389001",
    "owner": "Mantaoro Hotelera Manta S.A.",
    "regNumber": "1390142389001.001.2000206",
    "rooms": [
      {
    "id": "hotel-oro-verde-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 58,
        "pricePerNight": 165,
        "originalPrice": 189,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-oro-verde-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 43,
        "pricePerNight": 140,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-oro-verde-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 45,
        "pricePerNight": 145,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-perla-spondylus",
    "name": "Hotel Perla Spondylus",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 106",
    "image": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 447,
    "priceFrom": 82,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263187",
    "taxId": "1391739680001",
    "owner": "Joima S. A.",
    "regNumber": "1391739680001.002.7008798",
    "rooms": [
      {
    "id": "hotel-perla-spondylus-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 82,
        "originalPrice": 94,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-perla-spondylus-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 69,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-perla-spondylus-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 72,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "balandra-hotel",
    "name": "Balandra Hotel",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 83",
    "image": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.8,
    "reviews": 484,
    "priceFrom": 89,
    "tags": [
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263214",
    "taxId": "1391764944001",
    "owner": "Hotel Cabañas Balandra S.A.",
    "regNumber": "1391764944001.001.2000220",
    "rooms": [
      {
    "id": "balandra-hotel-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 89,
        "originalPrice": 102,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "balandra-hotel-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 75,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "balandra-hotel-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 78,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-villakite",
    "name": "Hotel Villakite",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Vía Costanera Sur Km 15, Santa Marianita (Playa Kite)",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.2,
    "reviews": 239,
    "priceFrom": 60,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263241",
    "taxId": "1391765983001",
    "owner": "Ecuadorkitesurf S.A.",
    "regNumber": "1391765983001.001.7009701",
    "rooms": [
      {
    "id": "hotel-villakite-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hotel-villakite-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-villakite-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-aquamarina",
    "name": "Hotel Aquamarina",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 14",
    "image": "https://images.unsplash.com/photo-1563629986-97c92e385f66?w=800&h=500&fit=crop&auto=format",
    "rating": 4.7,
    "reviews": 558,
    "priceFrom": 103,
    "tags": [
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263268",
    "taxId": "1391837879001",
    "owner": "Fishturismo S.A.",
    "regNumber": "1391837879001.001.7010862",
    "rooms": [
      {
    "id": "hotel-aquamarina-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 103,
        "originalPrice": 118,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-aquamarina-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 87,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-aquamarina-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 90,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-poseidon",
    "name": "Hotel Poseidon",
    "stars": 5,
    "classification": "Hotel",
    "category": "5 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 595,
    "priceFrom": 175,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h",
      "Gimnasio & Spa",
      "Acceso directo a playa",
      "Salones de eventos",
      "Concierge"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 5 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263295",
    "taxId": "1391844697001",
    "owner": "Fiallo & Fiallo Servicios Hoteleros Fhs S.A.",
    "regNumber": "1391844697001.001.2014233",
    "rooms": [
      {
    "id": "hotel-poseidon-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 58,
        "pricePerNight": 175,
        "originalPrice": 201,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-poseidon-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 43,
        "pricePerNight": 148,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-poseidon-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 45,
        "pricePerNight": 154,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "navio-hotel",
    "name": "Navio Hotel",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 182,
    "priceFrom": 82,
    "tags": [
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263322",
    "taxId": "1391883714001",
    "owner": "Nefamavi S.A.",
    "regNumber": "1391883714001.001.2001996",
    "rooms": [
      {
    "id": "navio-hotel-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 82,
        "originalPrice": 94,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "navio-hotel-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 69,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "navio-hotel-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 72,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "manta-mar-hotel",
    "name": "Manta Mar Hotel",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. 4 de Noviembre y Calle 112",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 81,
    "priceFrom": 55,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263349",
    "taxId": "1391922914001",
    "owner": "Hoteleria y Turismo del Ecuador, Turiscuador S.A.",
    "regNumber": "1391922914001.001.2001558",
    "rooms": [
      {
    "id": "manta-mar-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 55,
        "originalPrice": 64,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "manta-mar-hotel-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 41,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "manta-mar-hotel-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 74,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "playa-mar-hotel",
    "name": "Playa Mar Hotel",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 89",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 91,
    "priceFrom": 37,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263376",
    "taxId": "1391922914001",
    "owner": "Hoteleria y Turismo del Ecuador, Turiscuador S.A.",
    "regNumber": "1391922914001.002.2011640",
    "rooms": [
      {
    "id": "playa-mar-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "playa-mar-hotel-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "playa-mar-hotel-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-internacional",
    "name": "Hostal Internacional",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía Costanera Sur Km 21, Los Esteros",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 108,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263403",
    "taxId": "1391931923001",
    "owner": "Interdelacruz S.A.",
    "regNumber": "1391931923001.001.5000114",
    "rooms": [
      {
    "id": "hostal-internacional-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-internacional-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-internacional-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "stella-blu",
    "name": "Stella Blu",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 20",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 125,
    "priceFrom": 28,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263430",
    "taxId": "1391932704001",
    "owner": "Stellablu S.A.S.",
    "regNumber": "1391932704001.001.2013369",
    "rooms": [
      {
    "id": "stella-blu-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "stella-blu-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "stella-blu-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "puerto-manta-hostal",
    "name": "Puerto Manta Hostal",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 142,
    "priceFrom": 31,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263457",
    "taxId": "1391935426001",
    "owner": "Mantaportcruz S.A.S.",
    "regNumber": "1391935426001.001.2013379",
    "rooms": [
      {
    "id": "puerto-manta-hostal-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "puerto-manta-hostal-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "puerto-manta-hostal-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-santa-fe",
    "name": "Hotel Santa Fe",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 159,
    "priceFrom": 34,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263484",
    "taxId": "1391935852001",
    "owner": "Santa Fe Hotel Servicios y Alojamiento S.A.S.",
    "regNumber": "1391935852001.001.2014137",
    "rooms": [
      {
    "id": "hotel-santa-fe-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-santa-fe-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-santa-fe-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "manta-surf-hotel",
    "name": "Manta Surf Hotel",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 103",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.3,
    "reviews": 219,
    "priceFrom": 60,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263511",
    "taxId": "1391935987001",
    "owner": "Surf Hotel S.A.S.",
    "regNumber": "1391935987001.001.2013356",
    "rooms": [
      {
    "id": "manta-surf-hotel-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "manta-surf-hotel-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "manta-surf-hotel-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "soga-corp",
    "name": "Soga Corp",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Playa El Murciélago, Malecón Escénico Local 95",
    "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 242,
    "priceFrom": 65,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263538",
    "taxId": "1391936408001",
    "owner": "Soga Corp S.A.S.",
    "regNumber": "1391936408001.001.2014921",
    "rooms": [
      {
    "id": "soga-corp-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 65,
        "originalPrice": 76,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "soga-corp-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 48,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "soga-corp-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 87,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "d-marv",
    "name": "D'marv",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "SAN MATEO",
    "parish": "San Mateo","city": "Manta - San Mateo (Puerto y Playas)",
    "address": "Vía Costanera Sur Km 17, San Mateo (Puerto y Playas)",
    "image": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop&auto=format",
    "rating": 4.6,
    "reviews": 265,
    "priceFrom": 45,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - San Mateo (Puerto y Playas), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector San mateo · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263565",
    "taxId": "1391936934001",
    "owner": "Oasismanaba S.A.S.",
    "regNumber": "1391936934001.002.2014348",
    "rooms": [
      {
    "id": "d-marv-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "d-marv-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "d-marv-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-mar-azul",
    "name": "Hotel Mar Azul",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 26",
    "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 288,
    "priceFrom": 50,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263592",
    "taxId": "1391937207001",
    "owner": "Marazulmanta S.A.S.",
    "regNumber": "1391937207001.001.2014310",
    "rooms": [
      {
    "id": "hotel-mar-azul-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-mar-azul-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-mar-azul-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-dsh",
    "name": "Hotel DSH",
    "stars": 4,
    "classification": "Hotel",
    "category": "4 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=800&h=500&fit=crop&auto=format",
    "rating": 4.8,
    "reviews": 589,
    "priceFrom": 89,
    "tags": [
      "Cerca de la Playa",
      "WiFi Alta Velocidad",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 4 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263619",
    "taxId": "1391938892001",
    "owner": "Servicios Hoteleros Select",
    "regNumber": "1391938892001.001.2015252",
    "rooms": [
      {
    "id": "hotel-dsh-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 54,
        "pricePerNight": 89,
        "originalPrice": 102,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-dsh-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 40,
        "pricePerNight": 75,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-dsh-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 42,
        "pricePerNight": 78,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-rishuo",
    "name": "Hotel Rishuo",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&auto=format",
    "rating": 4.0,
    "reviews": 84,
    "priceFrom": 60,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263646",
    "taxId": "1704444544001",
    "owner": "Ulloa Garcia Jaime Cristobal",
    "regNumber": "1704444544001.004.2001799",
    "rooms": [
      {
    "id": "hotel-rishuo-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 60,
        "originalPrice": 70,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "hotel-rishuo-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 45,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-rishuo-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 81,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-d-marios",
    "name": "Hostal D'marios",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Av. 4 de Noviembre y Calle 109",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 98,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263673",
    "taxId": "1704768330001",
    "owner": "Cahuasqui Tapia Mario Giovanny",
    "regNumber": "1704768330001.001.2003243",
    "rooms": [
      {
    "id": "hostal-d-marios-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-d-marios-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-d-marios-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hoteles-manta-real",
    "name": "Hoteles Manta Real",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 101",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 115,
    "priceFrom": 28,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263700",
    "taxId": "1706464748001",
    "owner": "Mosquera Mackenzie Fernando Eduardo",
    "regNumber": "1706464748001.002.2000830",
    "rooms": [
      {
    "id": "hoteles-manta-real-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hoteles-manta-real-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hoteles-manta-real-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-antares",
    "name": "Hostal Antares",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Vía Costanera Sur Km 13, El Murciélago",
    "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 132,
    "priceFrom": 31,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263727",
    "taxId": "1706520267001",
    "owner": "Montenegro Ayora Claudia Gissel",
    "regNumber": "1706520267001.002.2003094",
    "rooms": [
      {
    "id": "hostal-antares-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 31,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-antares-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-antares-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 32,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-oro-y-mar",
    "name": "Hostal Oro y Mar",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 12",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 149,
    "priceFrom": 22,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263754",
    "taxId": "1708156672001",
    "owner": "Cadena Morán Pamela René",
    "regNumber": "1708156672001.999.7008816",
    "rooms": [
      {
    "id": "hostal-oro-y-mar-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 22,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-oro-y-mar-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-oro-y-mar-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 23,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-timon-del-shaddai",
    "name": "Hostal Timon del Shaddai",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 28",
    "image": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 166,
    "priceFrom": 24,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263781",
    "taxId": "1708283302001",
    "owner": "Tinitana Ludeña Meri Janet",
    "regNumber": "1708283302001.006.2014413",
    "rooms": [
      {
    "id": "hostal-timon-del-shaddai-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-timon-del-shaddai-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 17,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-timon-del-shaddai-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 25,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "blanjop",
    "name": "Blanjop",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "LOS ESTEROS",
    "parish": "Los Esteros","city": "Manta - Los Esteros",
    "address": "Vía a Barbasquillo Km 1.5",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 183,
    "priceFrom": 26,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Los Esteros, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Los esteros · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263808",
    "taxId": "1711443182001",
    "owner": "Paredes Mieles Jose Miguel",
    "regNumber": "1711443182001.001.2011100",
    "rooms": [
      {
    "id": "blanjop-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "blanjop-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "blanjop-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-stockholm-suites",
    "name": "Hostal Stockholm Suites.",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Av. 4 de Noviembre y Calle 100",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 200,
    "priceFrom": 28,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263835",
    "taxId": "1711555399001",
    "owner": "Zambrano Alcivar Cielo Dineis",
    "regNumber": "1711555399001.002.2014608",
    "rooms": [
      {
    "id": "hostal-stockholm-suites-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-stockholm-suites-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-stockholm-suites-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 29,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-jireh",
    "name": "Hostal Jireh",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Centro Comercial",
    "address": "Playa El Murciélago, Malecón Escénico Local 107",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 37,
    "priceFrom": 20,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - Centro Comercial, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263862",
    "taxId": "1715202634001",
    "owner": "Sandoval Tinitana Stefany Scarleth",
    "regNumber": "1715202634001.001.2001717",
    "rooms": [
      {
    "id": "hostal-jireh-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 20,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-jireh-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 15,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-jireh-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 21,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-milan",
    "name": "Hostal Milan",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Vía Costanera Sur Km 19, Malecón Escénico",
    "image": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 54,
    "priceFrom": 34,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263889",
    "taxId": "1723341366001",
    "owner": "Jimenez Gomez Esther Elizabeth",
    "regNumber": "1723341366001.001.2015359",
    "rooms": [
      {
    "id": "hostal-milan-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 34,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-milan-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 24,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-milan-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 35,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "san-marino",
    "name": "San Marino",
    "stars": 2,
    "classification": "Hostal",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 18",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 71,
    "priceFrom": 37,
    "tags": [
      "Frente al Mar",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 2 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263916",
    "taxId": "1724866957001",
    "owner": "Gavilanes Tamayo Joel Israel",
    "regNumber": "1724866957001.003.2014572",
    "rooms": [
      {
    "id": "san-marino-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "san-marino-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "san-marino-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-san-mateo",
    "name": "Hostal San Mateo",
    "stars": 1,
    "classification": "Hostal",
    "category": "1 Estrella",
    "parroquia": "SAN MATEO",
    "parish": "San Mateo","city": "Manta - San Mateo (Puerto y Playas)",
    "address": "Av. Flavio Reyes y Calle 16",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 88,
    "priceFrom": 26,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 1 Estrella). Ubicado en Manta - San Mateo (Puerto y Playas), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector San mateo · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263943",
    "taxId": "1727132308001",
    "owner": "Lopez Lopez Miriam Juanita",
    "regNumber": "1727132308001.002.2003112",
    "rooms": [
      {
    "id": "hostal-san-mateo-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hostal-san-mateo-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 18,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hostal-san-mateo-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 27,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "villaluna",
    "name": "Villaluna",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "SANTA MARIANITA",
    "parish": "Santa Marianita","city": "Manta - Santa Marianita (Playa Kite)",
    "address": "Vía a Barbasquillo Km 3.5",
    "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop&auto=format",
    "rating": 4.4,
    "reviews": 110,
    "priceFrom": 45,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Santa Marianita (Playa Kite), ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Santa marianita · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 263970",
    "taxId": "1727926618001",
    "owner": "Diaz Barrios Marco Antonio",
    "regNumber": "1727926618001.004.2011421",
    "rooms": [
      {
    "id": "villaluna-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "villaluna-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "villaluna-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-vista-al-mar",
    "name": "Hotel Vista Al Mar",
    "stars": 3,
    "classification": "Hotel",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. 4 de Noviembre y Calle 106",
    "image": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format",
    "rating": 4.2,
    "reviews": 133,
    "priceFrom": 50,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 263997",
    "taxId": "1792177022001",
    "owner": "Orangefuture S.A.",
    "regNumber": "1792177022001.002.2013364",
    "rooms": [
      {
    "id": "hotel-vista-al-mar-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 50,
        "originalPrice": 59,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hotel-vista-al-mar-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hotel-vista-al-mar-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 67,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "poseidon",
    "name": "Poseidon",
    "stars": 5,
    "classification": "Hotel",
    "category": "5 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Barbasquillo",
    "address": "Playa El Murciélago, Malecón Escénico Local 113",
    "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop&auto=format",
    "rating": 4.8,
    "reviews": 244,
    "priceFrom": 190,
    "tags": [
      "Frente al Mar",
      "Piscina",
      "10% Servicio Turístico"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero",
      "Piscina exterior",
      "Restaurante gourmet",
      "Bar / Lounge",
      "Room Service 24h",
      "Gimnasio & Spa",
      "Acceso directo a playa",
      "Salones de eventos",
      "Concierge"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 5 Estrellas). Ubicado en Manta - Barbasquillo, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": true,
    "phone": "+593 5 264024",
    "taxId": "1792433622001",
    "owner": "Fabrica Ecuatoriana Ecuavau S.a",
    "regNumber": "1792433622001.002.7009760",
    "rooms": [
      {
    "id": "poseidon-cama-king",
        "type": "Habitación King Premium con Vista al Mar",
        "beds": "1 Cama King Size (2x2m)",
        "capacity": 2,
        "size": 58,
        "pricePerNight": 190,
        "originalPrice": 218,
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Vista panorámica al mar",
          "Caja fuerte"
        ],
        "available": 4,
        "breakfastIncluded": true
      },
      {
        "id": "poseidon-cama-queen",
        "type": "Habitación Matrimonial Deluxe",
        "beds": "1 Cama Queen (1.60x2m)",
        "capacity": 2,
        "size": 43,
        "pricePerNight": 161,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "A/C climatizado",
          "Balcón privado"
        ],
        "available": 5,
        "breakfastIncluded": true
      },
      {
        "id": "poseidon-camas-twin",
        "type": "Habitación Doble Ejecutiva",
        "beds": "2 Camas Individuales Twin (1.05x1.90m)",
        "capacity": 2,
        "size": 45,
        "pricePerNight": 167,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi alta velocidad",
          "Smart TV",
          "A/C climatizado",
          "Mesa de trabajo"
        ],
        "available": 3,
        "breakfastIncluded": true
      }
    ]
  },
  {
    "id": "hotel-agata",
    "name": "Hotel Agata",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - El Murciélago",
    "address": "Vía Costanera Sur Km 15, El Murciélago",
    "image": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 156,
    "priceFrom": 37,
    "tags": [
      "Cerca de la Playa",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - El Murciélago, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 264051",
    "taxId": "1805747449001",
    "owner": "Andagana Andagana Joel Alexander",
    "regNumber": "1805747449001.002.2015467",
    "rooms": [
      {
    "id": "hotel-agata-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 37,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-agata-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 26,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-agata-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 38,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hotel-brisas-del-pacifico",
    "name": "Hotel Brisas del Pacifico",
    "stars": 2,
    "classification": "Hotel",
    "category": "2 Estrellas",
    "parroquia": "TARQUI",
    "parish": "Tarqui","city": "Manta - Tarqui",
    "address": "Av. Malecón Jaime Chávez Gutiérrez y Calle 24",
    "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format",
    "rating": 3.7,
    "reviews": 173,
    "priceFrom": 40,
    "tags": [
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hotel - 2 Estrellas). Ubicado en Manta - Tarqui, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Tarqui · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 264078",
    "taxId": "1900715473001",
    "owner": "Morocho Remachi Melania Esperanza",
    "regNumber": "1900715473001.002.2015649",
    "rooms": [
      {
    "id": "hotel-brisas-del-pacifico-cama-matrimonial",
        "type": "Habitación Matrimonial Confort",
        "beds": "1 Cama Matrimonial (2 plazas)",
        "capacity": 2,
        "size": 18,
        "pricePerNight": 40,
        "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Ventilador o A/C",
          "Baño privado",
          "Agua caliente"
        ],
        "available": 4
      },
      {
        "id": "hotel-brisas-del-pacifico-cama-individual",
        "type": "Habitación Individual Económica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 13,
        "pricePerNight": 28,
        "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador"
        ],
        "available": 3
      },
      {
        "id": "hotel-brisas-del-pacifico-camas-twin",
        "type": "Habitación Doble Twin",
        "beds": "2 Camas Individuales separadas",
        "capacity": 2,
        "size": 19,
        "pricePerNight": 42,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi gratis",
          "Baño privado",
          "Ventilador / A/C"
        ],
        "available": 2
      }
    ]
  },
  {
    "id": "hostal-casa-latina",
    "name": "Hostal Casa Latina",
    "stars": 3,
    "classification": "Hostal",
    "category": "3 Estrellas",
    "parroquia": "MANTA",
    "parish": "Manta",
    "city": "Manta - Malecón Escénico",
    "address": "Av. Flavio Reyes y Calle 22",
    "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format",
    "rating": 4.1,
    "reviews": 225,
    "priceFrom": 45,
    "tags": [
      "WiFi Alta Velocidad",
      "Tarifa Neta Hospedaje"
    ],
    "amenities": [
      "WiFi gratis",
      "Aire acondicionado",
      "Recepción",
      "TV Smart con cable",
      "Desayuno disponible",
      "Parqueadero"
    ],
    "description": "Establecimiento oficial de hospedaje adscrito al Catastro Turístico de Manta (Hostal - 3 Estrellas). Ubicado en Manta - Malecón Escénico, ofrece atención cordial, excelente conectividad y tarifas directas garantizadas con confirmación de reserva inmediata.",
    "distance": "Sector Manta · Manta",
    "gravaServicio10": false,
    "phone": "+593 5 264105",
    "taxId": "2300692122001",
    "owner": "Lozano Quijije Emily Liz",
    "regNumber": "2300692122001.002.2015350",
    "rooms": [
      {
        "id": "hostal-casa-latina-cama-matrimonial",
        "type": "Habitación Matrimonial Queen",
        "beds": "1 Cama Queen o Matrimonial",
        "capacity": 2,
        "size": 22,
        "pricePerNight": 45,
        "originalPrice": 53,
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV con cable",
          "A/C",
          "Baño privado"
        ],
        "available": 4,
        "breakfastIncluded": false
      },
      {
        "id": "hostal-casa-latina-cama-individual",
        "type": "Habitación Individual Clásica",
        "beds": "1 Cama Individual (1 plaza)",
        "capacity": 1,
        "size": 16,
        "pricePerNight": 33,
        "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV",
          "A/C",
          "Baño privado"
        ],
        "available": 5
      },
      {
        "id": "hostal-casa-latina-cama-triple",
        "type": "Habitación Triple (Queen + Twin)",
        "beds": "1 Cama Matrimonial + 1 Cama Individual",
        "capacity": 3,
        "size": 28,
        "pricePerNight": 60,
        "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=380&fit=crop&auto=format",
        "amenities": [
          "WiFi",
          "TV Smart",
          "A/C",
          "Baño privado amplio"
        ],
        "available": 2
      }
    ]
  }
];

export const INITIAL_DEMO_RESERVATIONS: MyReservation[] = [
  {
    id: "RES-4821",
    hotel: "MantaHost Hotel",
    hotelId: "mantahost-hotel",
    city: "Manta - Barbasquillo",
    room: "Habitación King Premium con Vista al Mar",
    checkIn: "2026-10-20",
    checkOut: "2026-10-23",
    nights: 3,
    total: 465.75,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&auto=format",
    guestName: "Carlos Méndez",
    guestEmail: "cmendez@gmail.com",
    guestPhone: "+593 98 421 8890",
    payMethod: "Transferencia DeUna",
  },
  {
    id: "RES-7720",
    hotel: "Hotel Oro Verde",
    hotelId: "hotel-oro-verde",
    city: "Manta - El Murciélago",
    room: "Habitación Matrimonial Deluxe",
    checkIn: "2026-10-24",
    checkOut: "2026-10-27",
    nights: 3,
    total: 390.00,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop&auto=format",
    guestName: "Laura Fernández",
    guestEmail: "lfernandez@hotmail.com",
    guestPhone: "+593 99 334 1122",
    payMethod: "PayPhone Ecuador",
  },
  {
    id: "RES-8941",
    hotel: "Hotel Voyager Manta",
    hotelId: "hotel-voyager-manta",
    city: "Manta - Centro Comercial",
    room: "Habitación Matrimonial Queen",
    checkIn: "2026-11-01",
    checkOut: "2026-11-04",
    nights: 3,
    total: 195.00,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=250&fit=crop&auto=format",
    guestName: "Miguel Torres",
    guestEmail: "mtorres@gmail.com",
    guestPhone: "+593 98 123 4567",
    payMethod: "Tarjeta de Crédito",
  },
  {
    id: "RES-9210",
    hotel: "Hostal El Náufrago",
    hotelId: "hostal-el-naufrago",
    city: "Manta - Tarqui",
    room: "Habitación Doble Twin",
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
    nights: 2,
    total: 64.40,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=250&fit=crop&auto=format",
    guestName: "Andrea Salazar",
    guestEmail: "asalazar@yahoo.com",
    guestPhone: "+593 99 876 5432",
    payMethod: "Efectivo Recepción",
  }
];
