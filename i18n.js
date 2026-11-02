// =========================================================
// IDIOMA (ES / EN)
// 1) Elige el idioma: ?lang=en en el link > lo que eligió antes > idioma del navegador
// 2) Si es inglés, cambia los textos marcados con data-i18n (ver en.js)
// 3) Crea el botón flotante ES / EN; al tocarlo recarga en el otro idioma
//    y regresa al mismo punto de la página
// =========================================================
(function () {
    const CLAVE = "bitacora-idioma";
    const guardar = (k, v, almacen) => { try { almacen.setItem(k, v); } catch (e) {} };
    const leer = (k, almacen) => { try { return almacen.getItem(k); } catch (e) { return null; } };

    const url = new URL(location.href);
    let lang = url.searchParams.get("lang") || leer(CLAVE, localStorage)
        || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
    lang = lang === "en" ? "en" : "es";
    window.LANG = lang;
    window.tr = (es, en) => (lang === "en" && en ? en : es);

    const D = window.I18N_EN;
    if (lang === "en" && D) {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const nuevo = D.textos[el.dataset.i18n];
            if (nuevo == null) return;
            el.innerHTML = nuevo;
            // el título con efecto glitch repite su texto en data-texto
            if (el.hasAttribute("data-texto") && !el.classList.contains("escribiendo")) el.dataset.texto = el.textContent.trim();
        });
        (D.atributos || []).forEach(([sel, attr, val]) =>
            document.querySelectorAll(sel).forEach((el) => el.setAttribute(attr, val)));
        document.documentElement.lang = "en";
        if (D.titulo) document.title = D.titulo;
        const desc = document.querySelector('meta[name="description"]');
        if (desc && D.descripcion) desc.content = D.descripcion;
    }

    // Botón flotante
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "idioma";
    boton.innerHTML = lang === "en"
        ? '<span class="idioma-activo">EN</span><span>ES</span>'
        : '<span class="idioma-activo">ES</span><span>EN</span>';
    boton.setAttribute("aria-label", lang === "en" ? "Ver en español" : "View in English");
    boton.addEventListener("click", () => {
        const otro = lang === "en" ? "es" : "en";
        guardar(CLAVE, otro, localStorage);
        guardar("bitacora-scroll", String(window.scrollY), sessionStorage);
        url.searchParams.set("lang", otro);
        location.replace(url.toString());
    });
    document.body.appendChild(boton);

    // Al volver de cambiar idioma, regresa al mismo punto
    const y = leer("bitacora-scroll", sessionStorage);
    if (y !== null) {
        try { sessionStorage.removeItem("bitacora-scroll"); } catch (e) {}
        window.addEventListener("load", () => window.scrollTo({ top: Number(y), behavior: "instant" }));
    }
    if (url.searchParams.get("lang")) guardar(CLAVE, lang, localStorage);
})();
