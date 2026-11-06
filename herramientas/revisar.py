"""
Revisión automática de la bitácora (la corre GitHub Actions en cada push).

Revisa lo que se rompe sin que uno se dé cuenta:
  1. Archivos locales: cada src, href, poster y foto de galería existe.
  2. Galerías: hay un pie de foto por foto, en español y en inglés.
  3. Traducción: cada data-i18n del HTML tiene su texto en en.js.
  4. Peso: fotos de hasta 700 KB y videos de hasta 6 MB (la página carga rápido en el celular).
  5. Privacidad: ninguna foto trae metadatos (GPS, modelo del celular, fecha)
     y ningún archivo publica un correo electrónico.
  6. Seguridad: los scripts y estilos externos llevan integrity (SRI) y la página tiene CSP.

Uso:  python herramientas/revisar.py      (sale con error si algo falla)
"""
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


html = leer("index.html")

# 1. Archivos locales
for ruta in re.findall(r'(?:src|href|poster)="([^"#:]+)"', html):
    if not ruta.startswith(("http", "mailto", "//")) and not existe(ruta):
        error(f"No existe el archivo: {ruta}")

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
for clave in sorted(set(re.findall(r'data-i18n(?:-html)?="([^"]+)"', html))):
    if clave not in claves_en:
        error(f"Falta la traducción de data-i18n=\"{clave}\" en en.js")

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
for etiqueta in re.findall(r'<(?:script|link)[^>]+(?:src|href)="https://[^"]+\.(?:js|css)"[^>]*>', html):
    if "fonts.googleapis.com" in etiqueta:
        continue  # Google Fonts cambia su CSS según el navegador: no admite integrity
    if "integrity=" not in etiqueta:
        error(f"Falta integrity (SRI) en: {etiqueta[:90]}…")
if 'http-equiv="Content-Security-Policy"' not in html:
    error("Falta la política de seguridad (CSP) en index.html")

if errores:
    print(f"✗ {len(errores)} problema(s):")
    for e in errores:
        print("  -", e)
    sys.exit(1)
print("✓ Todo en orden: archivos, galerías, traducción, peso, privacidad y seguridad.")
