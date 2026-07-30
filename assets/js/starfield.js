/* ================================================================
   STARFIELD — drifting star background for standalone (non-Astro) pages.
   Astro pages get the same effect from main.js; these local/guide/best/
   industry pages are self-contained and load this file instead.

   It also makes sections painted in the page's own base colour
   transparent, so the fixed canvas is visible for the full page height
   (sections with a DIFFERENT colour are left untouched, preserving the
   existing visual rhythm).
================================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var c = document.getElementById('starfield');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d');
  if (!ctx) return;

  /* --- let the fixed starfield show through the whole page --- */
  var base = getComputedStyle(document.body).backgroundColor;
  if (base && base !== 'rgba(0, 0, 0, 0)') {
    document.documentElement.style.backgroundColor = base;
    document.body.style.backgroundColor = 'transparent';
    var blocks = document.querySelectorAll('section, footer, div.section, .section');
    for (var i = 0; i < blocks.length; i++) {
      if (getComputedStyle(blocks[i]).backgroundColor === base) {
        blocks[i].style.backgroundColor = 'transparent';
      }
    }
  }

  var stars = [];
  var raf;

  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  function createStars(n) {
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.55 + 0.2,
        sp: Math.random() * 0.22 + 0.04,
        dr: (Math.random() - 0.5) * 0.07,
        td: Math.random() * 0.013 + 0.004,
        ti: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.a += s.td * s.ti;
      if (s.a > 0.82 || s.a < 0.1) s.ti *= -1;
      s.y -= s.sp;
      s.x += s.dr;
      if (s.y < -2) { s.y = c.height + 2; s.x = Math.random() * c.width; }
      if (s.x < -2) s.x = c.width + 2;
      if (s.x > c.width + 2) s.x = -2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(255,255,255,' + s.a.toFixed(3) + ')';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  createStars(150);
  draw();

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    resize();
    createStars(150);
    draw();
  });

  // Pause when the tab is hidden — save CPU/battery
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });
})();
