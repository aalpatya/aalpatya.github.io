/* ==========================================================================
   aalok.uk — shared site chrome
   Injects the top nav bar + footer into every page and runs the dark-mode
   toggle. Links are ROOT-RELATIVE ("/research/") so they work from any
   depth (e.g. /projects/gbpplanner/) as long as the site is served from the
   domain root. For local preview run a server at the site root:
       cd ~/code/aalok-site && python3 -m http.server
   ==========================================================================

   TO EDIT THE NAV: change BRAND / NAV_LINKS below. That's it.
*/

const BRAND = "Aalok Patwardhan";

const NAV_LINKS = [
  // { label: "Home",     href: "/" },
  { label: "Research", href: "/research/" },
  { label: "Projects", href: "/projects/" },
  // { label: "CV",       href: "/cv/" },
];

/* ---- inline icons ---- */
const ICON_MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const ICON_SUN  = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

/* ---- active-link detection ---- */
function isActive(href) {
  let path = location.pathname.replace(/index\.html$/, "");
  if (path === "") path = "/";
  if (href === "/") return path === "/";
  if (href.endsWith(".pdf")) return false;
  return path === href || path === href.replace(/\.html$/, "") ||
         path.startsWith(href.replace(/\.html$/, "") + "/");
}

/* ---- build & inject nav ---- */
function buildNav() {
  const nav = document.createElement("header");
  nav.id = "topnav";
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ""}>${l.label}</a>`
  ).join("");
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="/">${BRAND}</a>
      <nav class="nav-links">
        ${links}
        <button id="theme-toggle" title="Toggle light / dark" aria-label="Toggle theme">
          ${ICON_MOON}${ICON_SUN}
        </button>
      </nav>
    </div>`;
  document.body.prepend(nav);
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
}

/* ---- build & inject footer ---- */
function buildFooter() {
  const foot = document.createElement("footer");
  foot.id = "footer";
  const year = new Date().getFullYear();
  foot.innerHTML = `
    <div class="foot-inner">
      <span>© ${year} Aalok Patwardhan</span>
    </div>`;
  document.body.appendChild(foot);
}

/* ---- theme toggle (state is set pre-paint by the inline snippet in <head>) ---- */
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  window.setTimeout(() => root.classList.remove("theme-transition"), 400);
}

/* ---- go ---- */
function init() { buildNav(); buildFooter(); }
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
