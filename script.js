// =========================================================
// BITÁCORA · interacciones pequeñas
// 1) barra de progreso  2) aparición al hacer scroll
// 3) capítulo activo en el menú + modo terminal  4) efecto de escritura
// =========================================================

// 1) Barra de progreso: qué porcentaje de la página llevas
const barra = document.getElementById("barra");
window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (window.scrollY / total) * 100 + "%";
});

// 2) Las entradas aparecen suavemente cuando entran a la pantalla.
//    Se activan en cuanto asoma cualquier parte (threshold 0): con un umbral más alto,
//    las entradas muy largas (galerías grandes en el celular) nunca llegaban al porcentaje
//    y se quedaban invisibles, por eso a veces la página se veía vacía.
function revelar(el) { el.classList.add("visible"); }

const observadorRevelar = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
            if (e.isIntersecting) {
                revelar(e.target);
                observadorRevelar.unobserve(e.target); // solo una vez
            }
        });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" })
    : null;

function prepararRevelado(el) {
    if (!observadorRevelar) return;          // navegador viejo: todo visible desde el inicio
    el.classList.add("revelar");
    observadorRevelar.observe(el);
}

document.querySelectorAll(".entrada, .cap-cabecera, .ventana").forEach(prepararRevelado);

// Red de seguridad: si por algo una entrada sigue oculta y ya pasó por la pantalla
// (por ejemplo al saltar con el menú), se muestra igual.
window.addEventListener("scroll", () => {
    document.querySelectorAll(".revelar:not(.visible)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) revelar(el);
    });
}, { passive: true });

// 3) Marca en el menú el capítulo que estás leyendo
//    y oscurece el menú cuando llegas a la parte "terminal"
const capitulos = document.querySelectorAll(".capitulo");
const enlaces = document.querySelectorAll(".indice a");

const observadorCapitulo = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;

        enlaces.forEach((a) => {
            const activo = a.getAttribute("href") === "#" + id;
            a.classList.toggle("activo", activo);
            // en celular, desliza el menú para que el capítulo activo quede al centro
            if (activo) {
                const menu = a.parentElement;
                menu.scrollTo({ left: a.offsetLeft - menu.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
            }
        });

        // Memorias también usa el menú oscuro, para no dar un salto de color
        const oscuro = e.target.classList.contains("terminal") || e.target.classList.contains("memorias");
        document.body.classList.toggle("modo-terminal", oscuro);
    });
}, { rootMargin: "-45% 0px -50% 0px" }); // cuenta como "activo" el que está a media pantalla

capitulos.forEach((c) => observadorCapitulo.observe(c));

// 4) Efecto de máquina de escribir en los comandos con la clase "escribiendo"
document.querySelectorAll(".escribiendo").forEach((el) => {
    const texto = (window.LANG === "en" && el.dataset.textoEn) || el.dataset.texto;
    let i = 0;
    const observador = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        const escribir = setInterval(() => {
            el.textContent = texto.slice(0, ++i);
            if (i >= texto.length) clearInterval(escribir);
        }, 55);
    });
    observador.observe(el);
});

// 5) Galerías automáticas: cada <div class="galeria" data-carpeta="img/xxx">
//    muestra 1.jpg, 2.jpg, 3.jpg… de esa carpeta como polaroids.
//    - Con data-fotos="N" las crea de inmediato (rápido en el celular).
//    - Sin data-fotos, las busca todas a la vez y se queda con las que existan.
const MAX_FOTOS = 30;

function existe(src) {
    return new Promise((ok) => {
        const prueba = new Image();
        prueba.onload = () => ok(true);
        prueba.onerror = () => ok(false);
        prueba.src = src;
    });
}

async function buscarFotos(carpeta) {
    const candidatas = Array.from({ length: MAX_FOTOS }, (_, i) => `${carpeta}/${i + 1}.jpg`);
    const hay = await Promise.all(candidatas.map(existe));
    const corte = hay.indexOf(false);
    return candidatas.slice(0, corte === -1 ? MAX_FOTOS : corte);
}

function armarGaleria(galeria, fotos) {
    const pies = ((window.LANG === "en" && galeria.dataset.piesEn) || galeria.dataset.pies || "").split("|");
    // Quita solo los recuadros grises; conserva lo fijo (por ejemplo, un video)
    galeria.querySelectorAll(".polaroid:not(.fija)").forEach((f) => f.remove());
    const primeraFija = galeria.querySelector(".fija");
    fotos.forEach((src, i) => {
        const figura = document.createElement("figure");
        figura.className = "polaroid";
        const img = document.createElement("img");
        img.src = src;
        img.alt = pies[i] || `${window.LANG === "en" ? "Photo" : "Foto"} ${i + 1}`;
        img.dataset.pie = pies[i] || "";
        img.loading = "lazy";
        img.decoding = "async";
        figura.appendChild(img);
        if (pies[i]) {
            const pie = document.createElement("figcaption");
            pie.textContent = pies[i];
            figura.appendChild(pie);
        }
        galeria.insertBefore(figura, primeraFija);
    });
}

document.querySelectorAll(".galeria[data-carpeta]").forEach(async (galeria) => {
    const carpeta = galeria.dataset.carpeta;
    // data-fotos="0" = todavía sin fotos (no las busca); sin data-fotos = las busca solas
    const total = parseInt(galeria.dataset.fotos, 10);
    const fotos = !Number.isNaN(total)
        ? Array.from({ length: total }, (_, i) => `${carpeta}/${i + 1}.jpg`)
        : await buscarFotos(carpeta);

    const grupo = galeria.closest(".memoria-grupo");
    if (fotos.length === 0) {
        if (grupo) grupo.hidden = true;     // álbum de Memorias sin fotos: se oculta
        actualizarMemorias();
        return;                             // en los capítulos se quedan los recuadros grises
    }
    armarGaleria(galeria, fotos);
    actualizarMemorias();
});

// Si ningún álbum de Memorias tiene fotos, muestra el aviso de "pronto"
function actualizarMemorias() {
    const aviso = document.querySelector(".memorias-vacio");
    if (!aviso) return;
    const visibles = [...document.querySelectorAll(".memoria-grupo")].some((g) => !g.hidden && g.querySelector("img"));
    aviso.hidden = visibles;
}

// 6) Visor: al hacer clic en una foto se ve completa (sin recorte)
const visor = document.getElementById("visor");
if (visor) {
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".galeria img");
        if (!img) return;
        visor.querySelector("img").src = img.src;
        visor.querySelector("img").alt = img.alt;
        visor.querySelector("p").textContent = img.dataset.pie || "";
        visor.showModal();
    });
    // se cierra con la X, con Esc o tocando fuera de la foto
    visor.addEventListener("click", (e) => {
        if (e.target === visor || e.target.closest("button")) visor.close();
    });
}


// 6) Botón "volver al mapa": aparece después de bajar dos pantallas
(function () {
    const volver = document.getElementById("volver");
    if (!volver) return;
    const revisar = () => { volver.hidden = window.scrollY < window.innerHeight * 2; };
    window.addEventListener("scroll", revisar, { passive: true });
    revisar();
})();
