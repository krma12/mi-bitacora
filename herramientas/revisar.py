"""
Revisión automática de la bitácora (la corre GitHub Actions en cada push).

Revisa lo que se rompe sin que uno se dé cuenta:
  1. Archivos locales: cada src, href, poster y foto de galería existe.
  2. Galerías: hay un pie de foto por foto, en español y en inglés.
  3. Traducción: cada data-i18n del HTML tiene su texto en en.js.
  4. Peso: fotos de hasta 700 KB y videos de hasta 6 MB (la página carga rápido en el celular).
  5. Privacidad: ninguna foto trae metadatos (GPS, modelo del celular, fecha)
     y ningún archivo publica un correo electrónico.
  6. Seguridad: los scripts y estilos externos llevan integrity (SRI) y cada página tiene CSP.
  7. Memorias: memorias-datos.js es JSON válido y cada álbum tiene sus datos, fotos y pies.

Uso:  python herramientas/revisar.py      (sale con error si algo falla)
"""
import json
import os
import re
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_FOTO_KB = 700
MAX_VIDEO_MB = 6
IMAGENES = (".jpg", ".jpeg", ".png", ".webp")
VIDEOS = (".mp4", ".mov", ".webm")

errores = []


def error(msg):
    errores.append(msg)


def leer(nombre):
    with open(os.path.join(RAIZ, nombre), encoding="utf-8") as f:
        return f.read()


def existe(ruta):
    return os.path.isfile(os.path.join(RAIZ, ruta))


PAGINAS = sorted(n for n in os.listdir(RAIZ) if n.endswith(".html"))
html = leer("index.html")
todas = {nombre: leer(nombre) for nombre in PAGINAS}

# 1. Archivos locales (en todas las páginas)
for nombre, contenido in todas.items():
    for ruta in re.findall(r'(?:src|href|poster)="([^"#:]+)', contenido):
        if not ruta.startswith(("http", "mailto", "//")) and not existe(ruta):
            error(f"{nombre}: no existe el archivo {ruta}")

# 2. Galerías
for etiqueta in re.findall(r'<div class="galeria"[^>]*>', html):
    carpeta = re.search(r'data-carpeta="([^"]+)"', etiqueta)
    fotos = re.search(r'data-fotos="(\d+)"', etiqueta)
    if not carpeta or not fotos:
        continue
    carpeta, total = carpeta.group(1), int(fotos.group(1))
    for i in range(1, total + 1):
        if not existe(f"{carpeta}/{i}.jpg"):
            error(f"Falta la foto {carpeta}/{i}.jpg (data-fotos={total})")
    for atributo in ("data-pies", "data-pies-en"):
        pies = re.search(atributo + r'="([^"]*)"', etiqueta)
        if total and pies and len(pies.group(1).split("|")) != total:
            error(f"{carpeta}: {atributo} tiene {len(pies.group(1).split('|'))} pies para {total} fotos")

# 3. Traducción
en = leer("en.js")
claves_en = set(re.findall(r'"([\w.-]+)"\s*:', en))
for nombre, contenido in todas.items():
    for clave in sorted(set(re.findall(r'data-i18n(?:-html)?="([^"]+)"', contenido))):
        if clave not in claves_en:
            error(f"{nombre}: falta la traducción de data-i18n=\"{clave}\" en en.js")

# 4 y 5. Peso y metadatos de fotos y videos
for carpeta, _, archivos in os.walk(RAIZ):
    if any(parte.startswith(".") for parte in os.path.relpath(carpeta, RAIZ).split(os.sep) if parte != "."):
        continue
    for nombre in archivos:
        ruta = os.path.join(carpeta, nombre)
        rel = os.path.relpath(ruta, RAIZ)
        ext = os.path.splitext(nombre)[1].lower()
        tam = os.path.getsize(ruta)
        if ext in IMAGENES:
            if tam > MAX_FOTO_KB * 1024 and rel != "vista-previa.jpg":
                error(f"{rel} pesa {tam // 1024} KB (máximo {MAX_FOTO_KB} KB)")
            with Image.open(ruta) as im:
                exif = im.getexif()
                if exif.get_ifd(0x8825):
                    error(f"{rel} trae ubicación GPS: quítasela antes de subirla")
                elif len(exif):
                    error(f"{rel} trae metadatos EXIF (celular, fecha…): quítaselos")
        elif ext in VIDEOS and tam > MAX_VIDEO_MB * 1024 * 1024:
            error(f"{rel} pesa {tam // (1024 * 1024)} MB (máximo {MAX_VIDEO_MB} MB)")

# 5. Ningún correo publicado en el código de la página
CORREO = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
for nombre in os.listdir(RAIZ):
    if nombre.endswith((".html", ".js", ".css")):
        for correo in CORREO.findall(leer(nombre)):
            error(f"{nombre} publica un correo ({correo[:3]}…): mejor un enlace a LinkedIn o al portfolio")

# 6. Seguridad
for nombre, contenido in todas.items():
    for etiqueta in re.findall(r'<(?:script|link)[^>]+(?:src|href)="https://[^"]+\.(?:js|css)"[^>]*>', contenido):
        if "fonts.googleapis.com" in etiqueta:
            continue  # Google Fonts cambia su CSS según el navegador: no admite integrity
        if "integrity=" not in etiqueta:
            error(f"{nombre}: falta integrity (SRI) en {etiqueta[:90]}…")
    if 'http-equiv="Content-Security-Policy"' not in contenido:
        error(f"Falta la política de seguridad (CSP) en {nombre}")

# 7. Memorias
fuente = leer("memorias-datos.js")
try:
    albumes = json.loads(fuente.split("window.MEMORIAS =", 1)[1].strip().rstrip(";"))
except (IndexError, ValueError) as e:
    albumes = []
    error(f"memorias-datos.js no es JSON válido ({e}): revisa comillas dobles y comas")
OBLIGATORIOS = ["id", "fecha", "fecha_es", "fecha_en", "titulo_es", "titulo_en",
                "texto_es", "texto_en", "carpeta", "pies_es", "pies_en"]
vistos = set()
for a in albumes:
    nombre = a.get("id", "¿sin id?")
    faltan = [c for c in OBLIGATORIOS if c not in a]
    if faltan:
        error(f"Álbum {nombre}: faltan los campos {', '.join(faltan)}")
        continue
    if nombre in vistos:
        error(f"Álbum {nombre}: el id está repetido")
    vistos.add(nombre)
    if not re.fullmatch(r"[a-z0-9-]+", nombre):
        error(f"Álbum {nombre}: el id solo puede llevar minúsculas, números y guiones")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a["fecha"]):
        error(f"Álbum {nombre}: la fecha debe ser AAAA-MM-DD")
    if len(a["texto_es"]) != len(a["texto_en"]):
        error(f"Álbum {nombre}: texto_es y texto_en tienen distinto número de párrafos")
    if len(a["pies_es"]) != len(a["pies_en"]):
        error(f"Álbum {nombre}: pies_es y pies_en tienen distinto número de pies")
    for i in range(1, len(a["pies_es"]) + 1):
        if not existe(f"{a['carpeta']}/{i}.jpg"):
            error(f"Álbum {nombre}: falta la foto {a['carpeta']}/{i}.jpg")
    if "cita" in a and not all(k in a["cita"] for k in ("es", "en", "autor_es", "autor_en")):
        error(f"Álbum {nombre}: a la cita le falta el texto o el autor en algún idioma")

if errores:
    print(f"✗ {len(errores)} problema(s):")
    for e in errores:
        print("  -", e)
    sys.exit(1)
print("✓ Todo en orden: archivos, galerías, traducción, peso, privacidad y seguridad.")
