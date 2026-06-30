# SQ Creative Studio — Sitio web

Sitio web one-page de **SQ Creative Studio** *(by Stephania)*, agencia de marketing digital especializada en gestión de redes sociales, contenido audiovisual, videos UGC, automatización con IA y campañas publicitarias.

Construido con **Astro** + **Tailwind CSS**.

- **Repositorio:** https://github.com/Agencia-Marketing/sq-creative-studio
- **Contacto:** ugc.bystephania@gmail.com · WhatsApp +1 (954) 478 7920 · [@sqcreative.studio](https://instagram.com/sqcreative.studio)

---

## 🎨 Identidad de marca

El sitio aplica el **Manual de Identidad Corporativa** de SQ Creative Studio (estilo *oscuro elegante*).

### Paleta de colores

| Rol | HEX | Uso |
| :-- | :-- | :-- |
| Marrón vino oscuro | `#2B1F1F` | Fondo base del sitio |
| Vino corporativo | `#6A1F2B` | Banda de stats, tarjetas destacadas, acentos |
| Dorado | `#C7A36A` | Acento principal (botones, iconos, highlights) |
| Crema | `#F5ECE6` | Texto principal y banda de "valor" |
| Rosa suave | `#D7B7B0` | Detalles |

Las variables CSS viven en [`src/styles/global.css`](src/styles/global.css) (`:root`).

### Tipografías

Cargadas localmente como `@font-face` desde [`public/fonts/`](public/fonts):

- **Keira** (Serif + Slant para itálicas) → títulos / display (`--font-display`)
- **Asap** (variable) → cuerpo de texto (`--font-body`)

### Logo

- `public/logo-blanco.png` — imagotipo completo (nav y footer)
- `public/isotipo-blanco.png` — isotipo SQ (hero y favicon)

---

## 📝 Edición de contenido

**Todo el contenido del sitio** (textos, servicios, precios, FAQ, contacto, testimonios) se gestiona desde un único archivo:

```
src/content/site.json
```

Las páginas Astro lo importan directamente, así que para cambiar cualquier texto o precio basta con editar ese JSON y recompilar.

### Servicios y precios

Los planes provienen del **Catálogo 2026** (precios en USD) y están en `site.json` bajo `servicios.tabs[]`. Pestañas actuales:

| Servicio | Desde |
| :-- | :-- |
| Redes Sociales | $550 / mes |
| Creadores UGC | Cotización · $100/video |
| Diseño Gráfico | $30 – $300 |
| Desarrollo Web | $500 – $1,200 |
| Video Marketing | $40 – $500 |
| Publicidad (Google / Meta / TikTok) | $50 – $220 |
| Automatización con IA | $130 / mes |

---

## 🗂️ Estructura del proyecto

```text
/
├── public/
│   ├── fonts/                 # Keira + Asap (usadas por el sitio)
│   ├── logo-blanco.png
│   └── isotipo-blanco.png
├── src/
│   ├── content/site.json      # ← Contenido editable del sitio
│   ├── layouts/Layout.astro   # Nav, footer, scripts, <head>
│   ├── pages/
│   │   ├── index.astro        # Home one-page
│   │   ├── privacidad/
│   │   └── terminos/
│   └── styles/global.css      # Paleta, tipografías y estilos
└── package.json
```

> **Nota:** Los archivos de origen del rebranding (PDFs del manual y catálogo, y la carpeta `Tipografías/` con todas las variantes de fuente) están excluidos del repositorio vía `.gitignore` para mantenerlo ligero. Las fuentes que el sitio necesita ya están en `public/fonts/`.

---

## 🧞 Comandos

Todos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| :-- | :-- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Compila el sitio a `./dist/` |
| `npm run preview` | Previsualiza la build de producción |

---

© 2026 SQ Creative Studio · by Stephania. Todos los derechos reservados.
