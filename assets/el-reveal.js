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
      countUp(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // Count numbers up (e.g. "1,000 mg") when they come into view.
  function countUp(scope) {
    scope.querySelectorAll('.el-trust__title, .el-sci__stat strong, [data-countup]').forEach(function (el) {
      if (el.dataset.counted) return;
      var m = el.textContent.match(/^(\s*)([\d,]+)(.*)$/s);
      if (!m) return;
      var target = parseInt(m[2].replace(/,/g, ''), 10);
      if (!(target >= 10)) return;
      el.dataset.counted = '1';
      var start = null, dur = 1100, comma = m[2].indexOf(',') > -1;
      function step(ts) {
        if (!start) start = ts;
        var k = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - k, 3), v = Math.round(target * e);
        el.textContent = m[1] + (comma ? v.toLocaleString('en-GB') : v) + m[3];
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  function scan(scope) {
    (scope || document).querySelectorAll(SEL).forEach(function (el, i) {
      if (el.dataset.elReveal) return;
      if (el.closest('.el-hb, .el-s3d, .drawer, .el-satc')) return; // above the fold / sticky / overlays
      el.dataset.elReveal = '1';
      // stagger siblings in grids (goal tiles, cards)
      var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--el-delay', Math.min(idx, 4) * 70 + 'ms');
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) { el.classList.add('el-in'); countUp(el); return; } // already on screen
      io.observe(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); });
  else scan();
  document.addEventListener('shopify:section:load', function (e) { scan(e.target); }); // theme editor
})();

/* Read more: clamps [data-readmore] blocks to a few lines and adds a toggle when the text is longer.
   Without JavaScript the full text shows. Lines are set with the CSS variable --rm-lines. */
(function () {
  function setup(el) {
    if (el.dataset.rmReady) return;
    el.dataset.rmReady = '1';
    el.setAttribute('data-rm-state', 'closed');
    if (el.scrollHeight - el.clientHeight < 4) { el.removeAttribute('data-rm-state'); return; }
    if (!el.id) el.id = 'rm-' + Math.random().toString(36).slice(2, 8);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'el-rm__btn';
    btn.setAttribute('aria-controls', el.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Read more';
    btn.addEventListener('click', function () {
      var open = el.getAttribute('data-rm-state') === 'open';
      el.setAttribute('data-rm-state', open ? 'closed' : 'open');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.textContent = open ? 'Read more' : 'Read less';
    });
    el.insertAdjacentElement('afterend', btn);
  }
  function scan(root) { (root || document).querySelectorAll('[data-readmore]').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); });
  else scan();
  document.addEventListener('shopify:section:load', function (e) { scan(e.target); });
})();

/* Equal product cards: give every card's text area in a row the same height as the tallest,
   so prices, flavour rows and buttons line up (iOS Safari doesn't stretch these reliably with CSS alone). */
(function () {
  var raf;
  function equalise() {
    document.querySelectorAll('.product-grid').forEach(function (grid) {
      var infos = grid.querySelectorAll('.card__information');
      if (infos.length < 2) return;
      infos.forEach(function (el) { el.style.minHeight = ''; });
      var max = 0;
      infos.forEach(function (el) { max = Math.max(max, el.getBoundingClientRect().height); });
      infos.forEach(function (el) { el.style.minHeight = Math.ceil(max) + 'px'; });
    });
  }
  function queue() { cancelAnimationFrame(raf); raf = requestAnimationFrame(equalise); }
  function start() {
    queue();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    window.addEventListener('load', queue);
    window.addEventListener('resize', queue);
    // Collection filters and sorting replace the grid without a page load
    new MutationObserver(function (m) {
      for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].addedNodes.length; j++) {
          var n = m[i].addedNodes[j];
          if (n.nodeType === 1 && (n.matches('.product-grid, .grid__item') || n.querySelector('.product-grid'))) { queue(); return; }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  document.addEventListener('shopify:section:load', queue);
})();
