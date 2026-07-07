# aalok.uk — how this site works

A deliberately simple, **no-build** static site. Every page is plain HTML.
No Jekyll, no Node, no compile step, and no external template dependencies — the
long-form article template is our own. To publish, you just push the files.

## Preview locally

Pages use root-relative links (`/css/site.css`), so preview with a local server
from the site root (opening files with `file://` will break those links and the
page will look unstyled):

```bash
cd ~/code/aalok-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Folder layout

```
aalok-site/
  index.html              Homepage (about)
  research/
    index.html            Research — the paper cards listing
  css/
    site.css              Shared styling + the light/dark colour variables
    article.css           Long-form article template (TOC, maths, figures)
  js/
    site.js               Injects nav bar + footer, runs the theme toggle
    article.js            Renders KaTeX maths + contents scroll-spy
  assets/
    img/                  Profile photo, card thumbnails
    pdf/                  CV
  research/
    gbpplanner/           A research paper page (template to copy)
      index.html
      img/
  projects/
    index.html            Projects listing (explainers, guides, fun)
    lietheory/            A three.js interactive article (template to copy)
      index.html          (our own article template)
      demos/
```

## Edit-once, applies-everywhere

- **Colours / dark mode** — the two `:root` blocks at the top of `css/site.css`.
  The whole site re-themes from the `data-theme` attribute on `<html>`.
- **Nav links + your name** — `BRAND` and `NAV_LINKS` at the top of `js/site.js`.
  Current nav: Home · Research · Projects · CV.
- **Footer** — `buildFooter()` in `js/site.js`.

Every page includes: `<link rel="stylesheet" href="/css/site.css">`, the tiny
no-flicker theme `<script>` in `<head>`, and `<script src="/js/site.js" defer>`
just before `</body>`.

## Add a research paper (Research)

1. Copy `research/gbpplanner/` to `research/yourpaper/`; put images in its `img/`.
2. Edit its `index.html` (title, authors, buttons, media, BibTeX).
3. Add an entry to `research/index.html` — copy a `<div class="card card-paper">…</div>`
   block. Link `Page` to `/research/yourpaper/`, or link straight out to the paper.

## Add a project / explainer (Projects)

- **Standalone piece:** copy `projects/lietheory/` to `projects/yourpiece/`, replace
  the content and the `demos/`. Then add a `<a class="card">…</a>` to `projects/index.html`.
- **A series (nested):** make a folder with its own landing `index.html` that lists the
  parts, each part in a sub-folder:

  ```
  projects/
    my-series/
      index.html          (series landing → links to the parts)
      01-intro/index.html
      02-deep-dive/index.html
  ```

  URLs stay clean: `/projects/my-series/02-deep-dive/`.

## The article template

`projects/lietheory/index.html` is the reference. Key pieces:

- Structure: `<div class="doc"> <aside class="toc-col"><nav class="toc">…</nav></aside>
  <main class="body-col"> <header class="doc-header">…</header> …content… </main> </div>`
- **Contents sidebar** is pinned **below the nav banner** (`top: 80px` in `article.css`)
  and highlights the active section as you scroll. Its links (`#s1`, `#s2`, …) must
  match the `id`s on your `<h2>` headings.
- **Maths:** write inline maths as `<span class="math math-inline">\tau = \log(X)</span>`
  and display maths as `<div class="math math-block">…</div>`. `article.js` renders them
  with KaTeX (loaded from a CDN — the only external dependency, and only needed if you use maths).
- **Figures / demos:** `<figure class="fig"><iframe class="demo" src="demos/…"></iframe>
  <figcaption>…</figcaption></figure>`.
- Call-out boxes `.key` / `.note`, and the three-box `.triptych` diagram, are all
  theme-aware (defined in `article.css`).

## Embed an external page under your banner

`research/uareme/index.html` shows the pattern: a page with `<body class="embed">`
containing an `.embed-wrap` (a thin `.embed-bar` with an "Open original ↗" link, plus
a full-height `<iframe class="embed-frame">`). Your nav banner stays on top and the
external site fills the rest of the screen.

**Caveat:** this only works if the external site permits framing. GitHub Pages does;
many big sites (Medium, most news sites, etc.) send `X-Frame-Options: DENY` and will
show a blank frame — for those, link out normally instead.

## SEO

Since there's no Jekyll, the SEO tags that al-folio generates are written directly
into each page's `<head>`. What's in place:

- **Per page:** `<title>`, `<meta name="description">`, `<link rel="canonical">`,
  `author` + `keywords`, **Open Graph** (`og:*`) and **Twitter card** tags, and a
  **schema.org JSON-LD** block — `Person` on the homepage, `ScholarlyArticle` on the
  paper pages, `Article` on explainers, `WebPage` on listings.
- **Site-wide:** `sitemap.xml` (lists the public pages) and `robots.txt` (points to it).
- **Social preview image:** `assets/img/og-image.png` (1200×630). Re-generate or replace
  it to change the default share card.

To maintain it:

- **Base URL** is hard-coded as `https://aalok.uk` in the tags, the sitemap, and
  robots.txt. If the domain changes, find-and-replace that string across the repo.
- **New page?** Copy the whole `<!-- SEO -->` block from a similar page and update the
  `canonical`, `og:url`, `og:title`/`description`, `og:image`, and the JSON-LD. Then add
  a `<url>` entry to `sitemap.xml`.
- **Per-page share image:** point that page's `og:image` / `twitter:image` at a specific
  file (the paper pages already use their own gifs).
- **Search Console / Bing:** paste your verification `<meta>` into the placeholder near the
  top of `index.html`'s `<head>`, then submit `https://aalok.uk/sitemap.xml` in Google
  Search Console.
- Pages you want kept out of search (like `/fun/`) carry `<meta name="robots" content="noindex">`
  and are left out of the sitemap.

## Redirects (old URLs → new locations)

When a page moves, keep the old URL working with a small redirect stub so existing
links and search rankings carry over. A redirect is just a folder named after the
**old** path containing one `index.html`. Current stubs:

```
dancers/     → /research/dancers/
gbpstack/    → /research/gbpstack/
gbpplanner/  → /research/gbpplanner/
chameleon/   → /fun/chameleon/
assassin/    → /fun/assassin/
```

Each stub looks like this (destination appears in **three** places — change all three
to the same new target):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <link rel="canonical" href="https://aalok.uk/NEW/PATH/">   <!-- 1 (keep full https://aalok.uk) -->
  <meta http-equiv="refresh" content="0; url=/NEW/PATH/">    <!-- 2 -->
  <meta name="robots" content="noindex">
  <script>location.replace("/NEW/PATH/" + location.hash + location.search);</script>  <!-- 3 -->
</head>
<body>Redirecting to <a href="/NEW/PATH/">/NEW/PATH/</a>…</body>
</html>
```

- **Add one:** copy an existing stub folder, rename it to the old URL path (e.g. `theremin/`),
  and update the three targets (and the `<body>` fallback link).
- **Change one:** edit those three lines in that folder's `index.html`.
- **Remove one:** delete the folder.
- Keep the `noindex` line so the stub itself never appears in search, and **do not** add
  old paths to `sitemap.xml` — the sitemap should list only the real destination URLs.

## Notes

- Research entries for **DANCeRS** and **GBP-Stack** currently link to the old live
  pages (`aalpatya.github.io/…`). Port those into `research/` and switch the links
  to local `/research/…` paths when ready.
- `.nojekyll` tells GitHub Pages to serve files as-is (no Jekyll build).
