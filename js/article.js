/* ==========================================================================
   article.js — powers our own long-form article template
   1. Renders maths written as  <span class="math math-inline">…</span>
      or  <div class="math math-block">…</div>  using KaTeX.
   2. Scroll-spy: highlights the current section in the .toc sidebar.
   Load this AFTER the KaTeX script (both with `defer`, KaTeX first).
   ========================================================================== */
(function () {

  function renderMath() {
    if (!window.katex) return;
    document.querySelectorAll(".math").forEach(function (el) {
      if (el.dataset.rendered) return;
      var block = el.classList.contains("math-block");
      try {
        katex.render(el.textContent, el, { displayMode: block, throwOnError: false });
        el.dataset.rendered = "1";
      } catch (e) { /* leave the raw TeX visible if it fails */ }
    });
  }

  function scrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) {
      var h = a.getAttribute("href");
      if (h && h.charAt(0) === "#") map[h.slice(1)] = a;
    });
    var sections = Object.keys(map)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    function onScroll() {
      var current = null;
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top < 130) current = sec.id;
      });
      links.forEach(function (a) { a.classList.remove("active"); });
      if (current && map[current]) map[current].classList.add("active");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function mobileToc() {
    var col = document.querySelector(".toc-col");
    var btn = col && col.querySelector(".toc-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = col.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // collapse again after picking a section on mobile
    col.querySelectorAll(".toc a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 999px)").matches) {
          col.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function init() { renderMath(); scrollSpy(); mobileToc(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
