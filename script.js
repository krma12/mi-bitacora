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

// 2) Las entradas aparecen suavemente cuando entran a la pantalla
const elementos = document.querySelectorAll(".entrada, .cap-cabecera, .ventana, .polaroid");
elementos.forEach((el) => el.classList.add("revelar"));

const observadorRevelar = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add("visible");
            observadorRevelar.unobserve(e.target); // solo una vez
        }
    });
}, { threshold: 0.15 });

elementos.forEach((el) => observadorRevelar.observe(el));

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

        document.body.classList.toggle("modo-terminal", e.target.classList.contains("terminal"));
    });
}, { rootMargin: "-45% 0px -50% 0px" }); // cuenta como "activo" el que está a media pantalla

capitulos.forEach((c) => observadorCapitulo.observe(c));

// 4) Efecto de máquina de escribir en los comandos con la clase "escribiendo"
document.querySelectorAll(".escribiendo").forEach((el) => {
    const texto = el.dataset.texto;
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
//    busca 1.jpg, 2.jpg, 3.jpg… en esa carpeta y crea una polaroid por cada foto.
//    Se detiene en el primer número que no exista. Acepta .jpg .jpeg .png .webp
const EXTENSIONES = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG"];
const MAX_FOTOS = 20;

function existe(src) {
    return new Promise((ok) => {
        const prueba = new Image();
        prueba.onload = () => ok(true);
        prueba.onerror = () => ok(false);
        prueba.src = src;
    });
}

async function buscarFoto(carpeta, numero) {
    for (const ext of EXTENSIONES) {
        const src = `${carpeta}/${numero}.${ext}`;
        if (await existe(src)) return src;
    }
    return null;
}

document.querySelectorAll(".galeria[data-carpeta]").forEach(async (galeria) => {
    const carpeta = galeria.dataset.carpeta;
    const pies = (galeria.dataset.pies || "").split("|");
    const fotos = [];

    for (let n = 1; n <= MAX_FOTOS; n++) {
        const src = await buscarFoto(carpeta, n);
        if (!src) break;
        fotos.push(src);
    }
    if (fotos.length === 0) return; // carpeta vacía: se quedan los recuadros grises

    // Quita solo los recuadros grises; conserva lo fijo (por ejemplo, un video)
    galeria.querySelectorAll(".polaroid:not(.fija)").forEach((f) => f.remove());
    const primeraFija = galeria.querySelector(".fija");
    fotos.forEach((src, i) => {
        const figura = document.createElement("figure");
        figura.className = "polaroid";
        const img = document.createElement("img");
        img.src = src;
        img.alt = pies[i] || `Foto ${i + 1}`;
        img.loading = "lazy";
        figura.appendChild(img);
        if (pies[i]) {
            const pie = document.createElement("figcaption");
            pie.textContent = pies[i];
            figura.appendChild(pie);
        }
        galeria.insertBefore(figura, primeraFija);
    });
});

// 6) Visor: al hacer clic en una foto se ve completa (sin recorte)
const visor = document.getElementById("visor");
if (visor) {
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".galeria img");
        if (!img) return;
        visor.querySelector("img").src = img.src;
        visor.querySelector("img").alt = img.alt;
        visor.querySelector("p").textContent = img.alt.startsWith("Foto ") ? "" : img.alt;
        visor.showModal();
    });
    // se cierra con la X, con Esc o tocando fuera de la foto
    visor.addEventListener("click", (e) => {
        if (e.target === visor || e.target.closest("button")) visor.close();
    });
}
