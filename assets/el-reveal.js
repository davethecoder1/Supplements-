/* Electrolife: gentle fade-up of sections as they scroll into view.
   Content stays visible without JS, and for people who prefer reduced motion. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var SEL = [
    '.el-section:not(.el-s3d):not(.el-goals)', '.el-trust', '.el-goal', '.el-sci__ch', '.el-sci__calc',
    '.article-card-wrapper'
  ].join(',');
  var root = document.documentElement;
  root.classList.add('el-reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('el-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  function scan(scope) {
    (scope || document).querySelectorAll(SEL).forEach(function (el, i) {
      if (el.dataset.elReveal) return;
      if (el.closest('.el-hb, .el-s3d, .drawer, .el-satc')) return; // above the fold / sticky / overlays
      el.dataset.elReveal = '1';
      // stagger siblings in grids (goal tiles, cards)
      var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--el-delay', Math.min(idx, 4) * 70 + 'ms');
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) { el.classList.add('el-in'); return; } // already on screen
      io.observe(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); });
  else scan();
  document.addEventListener('shopify:section:load', function (e) { scan(e.target); }); // theme editor
})();
