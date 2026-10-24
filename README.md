#  Mi bitácora

**De la veterinaria a la inteligencia artificial: el camino, entrada por entrada.**

🔗 **Ver la página:** [krma12.github.io/mi-bitacora](https://krma12.github.io/mi-bitacora)

Bitácora digital de mi vida de 2018 a hoy: la veterinaria, la pandemia, el Caribe, Nueva York, un restaurante, la ingeniería en IA y todo lo que sigue. La hice a mano con HTML, CSS y JavaScript como proyecto de la materia **Fundamentos de Desarrollo Web** en Hybridge Education.

> *A digital logbook of my journey from veterinary school to AI engineering. It's handmade with HTML, CSS and JavaScript, and its design turns from a paper diary into a terminal.*

---

##  La idea

La página empieza como un **diario de papel**, con hojas de cuaderno, polaroids y notas escritas a mano. Conforme avanza la historia hacia la tecnología, el diseño **se transforma en una terminal**. El cambio visual cuenta la misma transición que el texto.

Al final la historia vuelve al papel, con una carta a mi yo de 2018.

##  Capítulos

| # | Capítulo | Años | Estilo |
|---|---|---|---|
| 00 | El mapa | 2018 — hoy | papel |
| 01 | La bata blanca | 2018 — 2020 | papel |
| 02 | Rumbo al Caribe | 2020 — 2021 | papel |
| 03 | Nueva York | 2021 — 2024 | papel |
| 04 | Emprender | 2024 — 2025 | papel |
| 05 | Las palabras | 2025 — hoy | papel |
| 06 | Volver a estudiar | 2025 — hoy | **transición** |
| 07 | Hacer con las manos | 2026 — hoy | terminal |
| 08 | Disciplina | 2024 — hoy | terminal |
| 09 | Construir | hoy | terminal |
| 10 | Lo que viene | mañana | terminal |
| ✉ | Carta a mi yo de 2018 | — | papel |

##  Qué tiene

- **Mapa interactivo** ([Leaflet](https://leafletjs.com/)): la ruta CDMX → Caribe → Nueva York → CDMX se dibuja sola, con botones para hacer zoom a cada etapa. Al hacer clic en un lugar, su nota dice si ahí viví, si lo visité o si ahí tengo amigos.
- **Galerías automáticas**: cada sección lee sus fotos de una carpeta, sin tocar el HTML.
- **Contadores animados**: algunos números se calculan solos, como los años, los lugares del mapa y los capítulos.
- **Menú que sigue tu lectura**: marca el capítulo actual y se oscurece al llegar a la parte de terminal.
- **Animaciones al hacer scroll**, barra de progreso, efecto *glitch* y máquina de escribir.
- **Diseño responsive**, pensado primero para celular.
- **Vista previa al compartir**: etiquetas Open Graph con imagen, título y descripción para que el link se vea bien en WhatsApp, LinkedIn, Facebook y X.
- **Ícono propio** en la pestaña del navegador (`favicon.svg`).
- **Accesibilidad básica**: se respeta `prefers-reduced-motion`, los botones tienen foco visible y las fotos llevan texto alternativo.

**Tecnologías:** HTML5 · CSS3 (variables, grid, flexbox, animaciones) · JavaScript (IntersectionObserver, promesas) · Leaflet

##  Estructura

```
mi-bitacora/
├── index.html        → todo el contenido de la bitácora
├── style.css         → estilos (papel, transición, terminal)
├── script.js         → animaciones, menú y galerías automáticas
├── mapa.js           → lógica del mapa y de los contadores
├── mapa-datos.js     → lugares del mapa (aquí se agregan nuevos)
├── favicon.svg       → ícono de la pestaña
├── vista-previa.jpg  → imagen que aparece al compartir el link (1200 × 630)
└── img/              → una carpeta de fotos por sección
    ├── veterinaria/
    ├── playa_del_carmen/
    ├── tulum/
    ├── new_york/
    ├── restaurante/
    ├── cdmx_carrera/
    ├── impresion_3d/
    ├── gimnasio/
    └── arqueria/
```

##  Cómo actualizarla

**Agregar fotos:** ponlas en la carpeta de su sección con los nombres `1.jpg`, `2.jpg`, `3.jpg`… y la página las muestra sola. Acepta `.jpg`, `.jpeg`, `.png` y `.webp`. Los pies de foto van en `data-pies="Primero|Segundo|…"` de cada galería, en `index.html`.

**Agregar un lugar al mapa:** en `mapa-datos.js`, copia una línea y cambia el nombre y las coordenadas. El orden de la lista es el orden en que se dibuja la ruta.

```js
{ nombre: "Nuevo lugar", etapa: "nuevayork", lat: 40.75, lng: -73.98, nota: "Lo que pasó aquí", zona: "nyc" },
```

**Marcar una meta cumplida:** en el capítulo 10, cambia `[ ]` por `[✓]`.

**Cambiar la vista previa del link:** reemplaza `vista-previa.jpg` por otra imagen de 1200 × 630 px con el mismo nombre. El título y la descripción están en las etiquetas `og:` del `<head>` de `index.html`. Para comprobar cómo se ve, usa [opengraph.xyz](https://www.opengraph.xyz/) o el [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/). WhatsApp guarda la vista previa anterior por un tiempo, así que puede tardar en actualizarse.

## 💻 Verla en tu computadora

No necesita instalar nada: abre `index.html` con doble clic. El mapa necesita conexión a internet para cargarse.

##  Créditos

- Mapas: [Leaflet](https://leafletjs.com/) · teselas de [Esri](https://www.esri.com/) y [OpenStreetMap](https://www.openstreetmap.org/copyright)
- Tipografías: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Caveat](https://fonts.google.com/specimen/Caveat) y [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Google Fonts)

---

**Hugo Maldonado** · Estudiante de Ingeniería en Inteligencia Artificial

[GitHub](https://github.com/krma12) · [LinkedIn](https://www.linkedin.com/in/hugo-maldonado-a20445201/) · [Impresiones 3D @vxlmexico](https://www.instagram.com/vxlmexico/)

*La bitácora sigue abierta.* ▋
