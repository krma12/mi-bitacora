// =========================================================
// MAPA DEL RECORRIDO + FRANJA "EN NÚMEROS"
// Usa Leaflet (librería de mapas) y los datos de mapa-datos.js
// =========================================================

// ---------- 1. Franja "En números" ----------
// Cada número tiene data-contar: un número fijo o una palabra que se calcula aquí
const lugaresUnicos = [...new Set(LUGARES.map((l) => l.nombre))];
const CALCULADOS = {
    anios: new Date().getFullYear() - 2018,                     // años desde que empezó la historia
    lugares: lugaresUnicos.length,                              // lugares distintos en el mapa
    capitulos: document.querySelectorAll(".capitulo:not(.prologo):not(.carta)").length,
};

document.querySelectorAll("[data-contar]").forEach((el) => {
    const valor = CALCULADOS[el.dataset.contar] ?? Number(el.dataset.contar);
    el.textContent = "0";
    const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const duracion = 1400;
        const paso = (t) => {
            const avance = Math.min((t - inicio) / duracion, 1);
            const suave = 1 - Math.pow(1 - avance, 3);              // empieza rápido, termina lento
            el.textContent = Math.round(valor * suave);
            if (avance < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
    }, { threshold: 0.6 });
    obs.observe(el);
});

// ---------- 2. Mapa ----------
const contenedor = document.getElementById("mapa");

if (!window.L) {
    // Sin internet no carga Leaflet: mostramos un aviso en lugar del mapa
    contenedor.innerHTML = '<p class="mapa-aviso">El mapa necesita conexión a internet para cargarse.</p>';
} else {
    iniciarMapa();
}

function iniciarMapa() {
    const mapa = L.map(contenedor, {
        scrollWheelZoom: false,   // para que la rueda del mouse siga bajando la página
        zoomControl: true,
        attributionControl: true,
    });

    // Fondo del mapa: Esri World Street Map. Funciona aunque abras la página
    // como archivo (doble clic). Si fallara, cambia a OpenStreetMap, que sí
    // funciona cuando la página ya está publicada en internet.
    const fondo = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Mapa &copy; Esri, HERE, Garmin, &copy; OpenStreetMap",
        maxZoom: 18,
    }).addTo(mapa);

    let errores = 0;
    fondo.on("tileerror", () => {
        if (++errores !== 4) return;   // al 4.º error, cambia de proveedor (una sola vez)
        mapa.removeLayer(fondo);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(mapa);
    });

    const todos = L.latLngBounds(LUGARES.map((l) => [l.lat, l.lng]));
    mapa.fitBounds(todos, { padding: [30, 30] });

    // --- Marcadores numerados (un número por lugar distinto) ---
    const marcadores = {};
    lugaresUnicos.forEach((nombre, i) => {
        const l = LUGARES.find((x) => x.nombre === nombre);
        const icono = L.divIcon({
            className: "",
            html: `<span class="pin" style="--c:${ETAPAS[l.etapa].color}">${i + 1}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
        });
        const notas = LUGARES.filter((x) => x.nombre === nombre && x.nota).map((x) => x.nota);
        marcadores[nombre] = L.marker([l.lat, l.lng], { icon: icono, opacity: 0 })
            .bindPopup(`<strong>${nombre}</strong>${notas.map((n) => `<br><small>${n}</small>`).join("")}`)
            .addTo(mapa);
    });

    // --- Tramos entre lugares: recto si es cerca, en arco (vuelo) si es lejos ---
    function distanciaKm(a, b) {
        return mapa.distance([a.lat, a.lng], [b.lat, b.lng]) / 1000;
    }
    function puntosTramo(a, b) {
        const lejos = distanciaKm(a, b) > 300;
        const n = lejos ? 60 : 15;
        // punto de control para la curva: a medio camino, desplazado hacia un lado
        const medio = { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
        const curva = lejos ? 0.25 : 0;
        const ctrl = { lat: medio.lat + (b.lng - a.lng) * curva, lng: medio.lng - (b.lat - a.lat) * curva };
        const pts = [];
        for (let i = 0; i <= n; i++) {
            const t = i / n;
            pts.push([
                (1 - t) ** 2 * a.lat + 2 * (1 - t) * t * ctrl.lat + t ** 2 * b.lat,
                (1 - t) ** 2 * a.lng + 2 * (1 - t) * t * ctrl.lng + t ** 2 * b.lng,
            ]);
        }
        return { pts, lejos };
    }

    const tramos = [];
    for (let i = 1; i < LUGARES.length; i++) {
        const a = LUGARES[i - 1], b = LUGARES[i];
        const { pts, lejos } = puntosTramo(a, b);
        tramos.push({ pts, lejos, color: ETAPAS[b.etapa].color, destino: b.nombre });
    }

    // --- Animación: la línea se va dibujando tramo por tramo ---
    let capaRuta = L.layerGroup().addTo(mapa);
    let animando = false;

    function dibujarRuta() {
        if (animando) return;
        animando = true;
        capaRuta.clearLayers();
        Object.values(marcadores).forEach((m) => m.setOpacity(0));
        marcadores[LUGARES[0].nombre].setOpacity(1);

        let t = 0;
        const siguiente = () => {
            if (t >= tramos.length) { animando = false; return; }
            const tramo = tramos[t++];
            const linea = L.polyline([], {
                color: tramo.color,
                weight: tramo.lejos ? 2.5 : 3.5,
                dashArray: tramo.lejos ? "6 8" : null,
                opacity: 0.9,
            }).addTo(capaRuta);
            let k = 0;
            const paso = () => {
                k += tramo.lejos ? 2 : 1;
                linea.setLatLngs(tramo.pts.slice(0, k + 1));
                if (k < tramo.pts.length - 1) requestAnimationFrame(paso);
                else { marcadores[tramo.destino].setOpacity(1); setTimeout(siguiente, 120); }
            };
            requestAnimationFrame(paso);
        };
        siguiente();
    }

    // Empieza a dibujar cuando el mapa aparece en pantalla
    const obsMapa = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { obsMapa.disconnect(); dibujarRuta(); }
    }, { threshold: 0.4 });
    obsMapa.observe(contenedor);

    // --- Botones para enfocar cada etapa ---
    document.querySelectorAll("[data-enfocar]").forEach((boton) => {
        boton.addEventListener("click", () => {
            document.querySelectorAll("[data-enfocar]").forEach((b) => b.classList.remove("activo"));
            boton.classList.add("activo");
            const etapa = boton.dataset.enfocar;
            if (etapa === "repetir") { mapa.flyToBounds(todos, { padding: [30, 30] }); dibujarRuta(); return; }
            // "todo" = todos; si no, los lugares de esa etapa o de esa zona (ver mapa-datos.js)
            const puntos = etapa === "todo" ? LUGARES : LUGARES.filter((l) => l.etapa === etapa || l.zona === etapa);
            mapa.flyToBounds(L.latLngBounds(puntos.map((l) => [l.lat, l.lng])), { padding: [40, 40], maxZoom: 14, duration: 1.2 });
        });
    });

    // --- Lista de lugares debajo del mapa (se genera sola) ---
    const lista = document.getElementById("mapa-lista");
    Object.entries(ETAPAS).forEach(([clave, etapa]) => {
        const nombres = lugaresUnicos.filter((n) => LUGARES.find((l) => l.nombre === n).etapa === clave);
        const grupo = document.createElement("div");
        grupo.className = "mapa-grupo";
        grupo.style.setProperty("--c", etapa.color);
        grupo.innerHTML = `<h3>${etapa.nombre}</h3>`;
        const ol = document.createElement("ol");
        nombres.forEach((nombre) => {
            const li = document.createElement("li");
            li.innerHTML = `<button type="button"><span>${lugaresUnicos.indexOf(nombre) + 1}</span>${nombre}</button>`;
            li.querySelector("button").addEventListener("click", () => {
                const m = marcadores[nombre];
                m.setOpacity(1);
                mapa.flyTo(m.getLatLng(), 11, { duration: 1.2 });
                setTimeout(() => m.openPopup(), 1250);
                contenedor.scrollIntoView({ behavior: "smooth", block: "center" });
            });
            ol.appendChild(li);
        });
        grupo.appendChild(ol);
        lista.appendChild(grupo);
    });
}
