// =========================================================
// PROYECTOS EN VIVO (capítulo 09)
// La lista de "ls proyectos/" se lee de la API de mi portfolio, así
// nunca queda vieja. Si el portfolio no responde en 5 segundos, se
// queda la lista escrita a mano en index.html.
// Todo se arma con textContent: el texto de la API nunca se ejecuta como HTML.
// =========================================================
(function () {
    const API = "https://hugoportfolio.pythonanywhere.com/proyectos";
    const contenedor = document.querySelector("#cap-9 .proyectos");
    if (!contenedor || !window.fetch) return;
    const tr = window.tr || ((es) => es);

    const control = new AbortController();
    const espera = setTimeout(() => control.abort(), 5000);

    fetch(API, { signal: control.signal, headers: { Accept: "application/json" } })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((datos) => {
            const lista = Array.isArray(datos) ? datos : datos.proyectos;
            if (!Array.isArray(lista) || !lista.length) return;
            contenedor.replaceChildren(...lista.map(tarjeta));
            const nota = document.createElement("p");
            nota.className = "proyectos-nota";
            nota.textContent = tr(
                `${lista.length} proyectos · en vivo desde la API de mi portfolio`,
                `${lista.length} projects · live from my portfolio's API`
            );
            contenedor.before(nota);
        })
        .catch(() => {})            // sin conexión o API caída: queda la lista guardada
        .finally(() => clearTimeout(espera));

    function tarjeta(p) {
        const enlace = document.createElement("a");
        enlace.className = "proyecto";
        const url = String(p.repo_url || p.demo_url || "");
        if (url.startsWith("https://")) { enlace.href = url; enlace.target = "_blank"; enlace.rel = "noopener"; }

        const etiquetas = (p.tecnologias || []).slice(0, 3).map((t) => String(t).toLowerCase());
        if (p.demo_url) etiquetas.push(tr("★ en vivo", "★ live"));
        if (p.es_fork) etiquetas.push("fork");

        enlace.append(
            parrafo("proyecto-tag", etiquetas.join(" · ")),
            elemento("h3", p.titulo),
            parrafo("", tr(p.descripcion_es || p.descripcion, p.descripcion) || ""),
            elemento("span", url ? tr("ver repositorio →", "view repository →") : "", "proyecto-ver")
        );
        return enlace;
    }

    function elemento(tag, texto, clase) {
        const el = document.createElement(tag);
        if (clase) el.className = clase;
        el.textContent = texto || "";
        return el;
    }
    function parrafo(clase, texto) { return elemento("p", texto, clase); }
})();
