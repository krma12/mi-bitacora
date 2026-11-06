// =========================================================
// MEMORIAS
// - En index.html: muestra los 3 álbumes más recientes (#memorias-recientes)
// - En memorias.html: cuadrícula con filtro por año y, al tocar un álbum,
//   su vista completa (memorias.html#id-del-album)
// Los álbumes vienen de memorias-datos.js. Todo se arma con textContent.
// =========================================================
(function () {
    const ALBUMES = (window.MEMORIAS || []).slice().sort((a, b) => b.fecha.localeCompare(a.fecha)); // recientes primero
    const en = window.LANG === "en";
    const tx = (a, campo) => (en && a[campo + "_en"]) || a[campo + "_es"];

    function el(tag, clase, texto) {
        const n = document.createElement(tag);
        if (clase) n.className = clase;
        if (texto != null) n.textContent = texto;
        return n;
    }
    const foto = (a, i) => `${a.carpeta}/${i}.jpg`;

    // Tarjeta de un álbum: polaroid con la portada + fecha + título
    function tarjeta(a, href) {
        const t = el("a", "album-tarjeta");
        t.href = href;
        t.dataset.anio = a.fecha.slice(0, 4);
        const fig = el("figure", "polaroid");
        const img = el("img");
        img.src = foto(a, 1);
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        fig.append(img);
        const n = a.pies_es.length;
        fig.append(el("figcaption", "", n === 1 ? (en ? "1 photo" : "1 foto") : `${n} ${en ? "photos" : "fotos"}`));
        t.append(fig, el("p", "album-fecha", tx(a, "fecha")), el("h3", "", tx(a, "titulo")));
        return t;
    }

    // ---------- index.html: adelanto ----------
    const recientes = document.getElementById("memorias-recientes");
    if (recientes) {
        recientes.replaceChildren(...ALBUMES.slice(0, 3).map((a) => tarjeta(a, `memorias.html#${a.id}`)));
        const total = document.getElementById("memorias-total");
        if (total) total.textContent = `(${ALBUMES.length})`;
        return;
    }

    // ---------- memorias.html ----------
    const cuadricula = document.getElementById("album-grid");
    const vista = document.getElementById("album-vista");
    const filtros = document.getElementById("filtros");
    const portada = document.getElementById("memorias-portada");
    if (!cuadricula || !vista) return;

    document.title = en ? "Memories · Hugo Maldonado" : "Memorias · Hugo Maldonado";

    // Cuadrícula + filtro por año
    cuadricula.replaceChildren(...ALBUMES.map((a) => tarjeta(a, `#${a.id}`)));
    const anios = [...new Set(ALBUMES.map((a) => a.fecha.slice(0, 4)))];
    const botones = [["todos", en ? "All" : "Todas"], ...anios.map((y) => [y, y])].map(([valor, texto]) => {
        const b = el("button", "filtro", texto);
        b.type = "button";
        b.dataset.valor = valor;
        b.setAttribute("aria-pressed", valor === "todos");
        b.addEventListener("click", () => filtrar(valor));
        return b;
    });
    filtros.replaceChildren(...botones);
    function filtrar(valor) {
        botones.forEach((b) => b.setAttribute("aria-pressed", b.dataset.valor === valor));
        cuadricula.querySelectorAll(".album-tarjeta").forEach((t) => {
            t.hidden = valor !== "todos" && t.dataset.anio !== valor;
        });
    }

    // Vista de un álbum
    function mostrarAlbum(a) {
        const i = ALBUMES.indexOf(a);
        const contenido = [el("p", "album-fecha", tx(a, "fecha")), el("h2", "", tx(a, "titulo"))];
        (en ? a.texto_en : a.texto_es).forEach((p) => contenido.push(el("p", "album-texto", p)));
        if (a.cita) {
            const q = el("blockquote", "cita");
            const cite = el("cite", "", (en ? a.cita.autor_en : a.cita.autor_es) + ", ");
            cite.append(el("i", "", en ? a.cita.obra_en : a.cita.obra_es));
            q.append(el("p", "", en ? a.cita.en : a.cita.es), cite);
            contenido.push(q);
        }
        const galeria = el("div", "galeria");
        const pies = en ? a.pies_en : a.pies_es;
        pies.forEach((pie, k) => {
            const fig = el("figure", "polaroid");
            const img = el("img");
            img.src = foto(a, k + 1);
            img.alt = pie || `${en ? "Photo" : "Foto"} ${k + 1}`;
            img.dataset.pie = pie || "";
            img.decoding = "async";
            fig.append(img);
            if (pie) fig.append(el("figcaption", "", pie));
            galeria.append(fig);
        });
        contenido.push(galeria);

        // Navegación: más reciente / más antiguo
        const nav = el("nav", "album-nav");
        const vecino = (b, etiqueta, lado) => {
            const l = el("a", "album-vecino " + lado);
            l.href = `#${b.id}`;
            l.append(el("span", "", etiqueta), el("strong", "", tx(b, "titulo")));
            return l;
        };
        if (ALBUMES[i - 1]) nav.append(vecino(ALBUMES[i - 1], en ? "← Newer" : "← Más reciente", "izq"));
        if (ALBUMES[i + 1]) nav.append(vecino(ALBUMES[i + 1], en ? "Older →" : "Más antiguo →", "der"));
        contenido.push(nav);

        vista.querySelector(".album-cuerpo").replaceChildren(...contenido);
        document.title = `${tx(a, "titulo")} · ${en ? "Memories" : "Memorias"}`;
    }

    function enrutar() {
        const a = ALBUMES.find((x) => `#${x.id}` === location.hash);
        vista.hidden = !a;
        portada.hidden = !!a;
        if (a) { mostrarAlbum(a); window.scrollTo({ top: 0, behavior: "instant" }); }
        else document.title = en ? "Memories · Hugo Maldonado" : "Memorias · Hugo Maldonado";
    }
    window.addEventListener("hashchange", enrutar);
    enrutar();

    // Visor: al tocar una foto se ve completa
    const visor = document.getElementById("visor");
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".album-vista .galeria img");
        if (!img || !visor) return;
        visor.querySelector("img").src = img.src;
        visor.querySelector("img").alt = img.alt;
        visor.querySelector("p").textContent = img.dataset.pie || "";
        visor.showModal();
    });
    if (visor) visor.addEventListener("click", (e) => {
        if (e.target === visor || e.target.closest("button")) visor.close();
    });
})();
