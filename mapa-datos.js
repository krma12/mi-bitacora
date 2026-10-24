// =========================================================
// DATOS DEL MAPA · aquí agregas o quitas lugares
// ---------------------------------------------------------
// Cada lugar: { nombre, etapa, lat, lng, nota, zona? }
//  - etapa: "cdmx" | "caribe" | "nuevayork"  (define el color)
//  - lat/lng: búscalo en Google Maps → clic derecho sobre el lugar → copia los números
//  - zona (opcional): "nyc" lo incluye en el botón "Manhattan y Bronx"
//  - El ORDEN de la lista es el orden en que se dibuja la línea del recorrido.
//  - Para agregar un lugar nuevo, copia una línea y pégala donde va en la historia.
// =========================================================

const ETAPAS = {
    cdmx:      { nombre: "Ciudad de México", color: "#5b7f5a" },
    caribe:    { nombre: "Riviera Maya y Yucatán", color: "#1f8a8a" },
    nuevayork: { nombre: "Nueva York y Nueva Jersey", color: "#a63d6b" },
};

const LUGARES = [
    // ---- Inicio: Ciudad de México (2018 – 2020) ----
    { nombre: "Ciudad de México", etapa: "cdmx", lat: 19.4326, lng: -99.1332, nota: "Veterinaria en la UVM · 2018 – 2020" },

    // ---- Caribe (2020 – 2021) ----
    { nombre: "Playa del Carmen", etapa: "caribe", lat: 20.6296, lng: -87.0739, nota: "Donde mi vida cambió · 2020" },
    { nombre: "Cancún",           etapa: "caribe", lat: 21.1619, lng: -86.8515, nota: "" },
    { nombre: "Puerto Aventuras", etapa: "caribe", lat: 20.4993, lng: -87.2271, nota: "" },
    { nombre: "Puerto Morelos",   etapa: "caribe", lat: 20.8478, lng: -86.8755, nota: "" },
    { nombre: "Tulum",            etapa: "caribe", lat: 20.2114, lng: -87.4654, nota: "Fotos frente a la playa con mi familia y una amiga de NY" },
    { nombre: "Mérida",           etapa: "caribe", lat: 20.9674, lng: -89.5926, nota: "" },

    // ---- Nueva York (2021 – 2024) ----
    { nombre: "Rochester, NY",       etapa: "nuevayork", lat: 43.1566, lng: -77.6088, nota: "Primera parada · 2021<br>Trabajo en construcción y mi primer invierno" },
    { nombre: "Harrison, NY",        etapa: "nuevayork", lat: 40.9690, lng: -73.7126, nota: "" },
    { nombre: "New Rochelle, NY",    etapa: "nuevayork", lat: 40.9115, lng: -73.7824, nota: "" },
    { nombre: "Brewster, NY",        etapa: "nuevayork", lat: 41.3973, lng: -73.6171, nota: "" },
    { nombre: "Wingdale, NY",        etapa: "nuevayork", lat: 41.6462, lng: -73.5609, nota: "" },
    { nombre: "White Plains, NY",    etapa: "nuevayork", lat: 41.0340, lng: -73.7629, nota: "" },
    { nombre: "Elmhurst · Eastchester, NY", etapa: "nuevayork", lat: 40.9584, lng: -73.8132, nota: "" },
    { nombre: "City College of New York",   etapa: "nuevayork", lat: 40.8200, lng: -73.9493, nota: "Iba a buscar a una amiga que estudiaba aquí", zona: "nyc" },
    { nombre: "The Bronx",           etapa: "nuevayork", lat: 40.8448, lng: -73.8648, nota: "Explorando la ciudad con amigos", zona: "nyc" },
    { nombre: "Harlem",              etapa: "nuevayork", lat: 40.8116, lng: -73.9465, nota: "Su cultura, su gente, su historia", zona: "nyc" },
    { nombre: "125th Street · Apollo Theater", etapa: "nuevayork", lat: 40.8100, lng: -73.9500, nota: "Mi lugar favorito de Nueva York", zona: "nyc" },
    { nombre: "Manhattan",           etapa: "nuevayork", lat: 40.7580, lng: -73.9855, nota: "", zona: "nyc" },
    { nombre: "Little Italy",        etapa: "nuevayork", lat: 40.7191, lng: -73.9973, nota: "Lower Manhattan", zona: "nyc" },
    // ✎ aquí puedes agregar más zonas de Manhattan (con zona: "nyc")
    { nombre: "Edison, NJ",          etapa: "nuevayork", lat: 40.5187, lng: -74.4121, nota: "" },

    // ---- Regreso: Ciudad de México (2024 – hoy) ----
    { nombre: "Ciudad de México",    etapa: "cdmx", lat: 19.4326, lng: -99.1332, nota: "De regreso · 2024 – hoy<br><i>Uno siempre regresa a donde fue feliz</i><br>Restaurante La Nueva Atlántida · 2024 – 2025<br>Hybridge · 2025 – hoy" },
];
