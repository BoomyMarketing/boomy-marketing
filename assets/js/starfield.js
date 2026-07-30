/* ================================================================
   STARFIELD — drifting particle background, theme aware.

   Used by the standalone (non-Astro) pages; boomy's Astro pages get the
   same effect from main.js. One implementation is shared by all four
   sites, so the particle colour is derived from the page itself:
     dark background  -> white stars   (boomy #100930, lumo #0D0D14)
     light background -> soft dark dust (bambino #F9F9F5, vora #FFFFFF)

   It also lets the fixed canvas show through the full page height:
   panels painted in the page's own base colour become transparent, and
   opaque gradient stops are given a high alpha (hue/direction kept), so
   the design reads the same with the particles drifting behind it.
================================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var c = document.getElementById('starfield');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d');
  if (!ctx) return;

  var ALPHA = 0.78; // opacity given to otherwise-opaque panels

  /* ---------- read the page's base colour ---------- */
  var base = getComputedStyle(document.body).backgroundColor;
  var rgb = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(base);
  // relative luminance (sRGB coefficients) decides light vs dark theme
  var lum = rgb ? (0.2126 * +rgb[1] + 0.7152 * +rgb[2] + 0.0722 * +rgb[3]) / 255 : 0;
  var isLight = lum > 0.5;
  // light pages need dark particles to be visible at all; a soft blue-grey
  // reads as gentle dust on both cream and pure white
  var TINT = isLight ? '20,22,60' : '255,255,255';
  var ALPHA_SCALE = isLight ? 0.5 : 1;   // dark dots on light bg carry further

  /* ---------- let the fixed canvas show through the whole page ---------- */
  if (base && base !== 'rgba(0, 0, 0, 0)') {
    document.documentElement.style.backgroundColor = base;
    document.body.style.backgroundColor = 'transparent';
  }
  var blocks = document.querySelectorAll('section, footer, div.section, .section');
  for (var i = 0; i < blocks.length; i++) {
    var el = blocks[i], cs = getComputedStyle(el);
    if (cs.backgroundColor === base) {
      el.style.backgroundColor = 'transparent';
    } else if (/^rgb\(/.test(cs.backgroundColor)) {
      el.style.backgroundColor = cs.backgroundColor.replace(
        /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/, 'rgba($1,$2,$3,' + ALPHA + ')');
    }
    // only fully-opaque rgb() stops are softened — rgba() stops are already
    // translucent design accents and are left exactly as they are
    if (cs.backgroundImage && cs.backgroundImage !== 'none' && /rgb\(/.test(cs.backgroundImage)) {
      el.style.backgroundImage = cs.backgroundImage.replace(
        /rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, 'rgba($1,$2,$3,' + ALPHA + ')');
    }
  }

  /* ---------- the particles ---------- */
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
        a: (Math.random() * 0.55 + 0.2) * ALPHA_SCALE,
        sp: Math.random() * 0.22 + 0.04,
        dr: (Math.random() - 0.5) * 0.07,
        td: (Math.random() * 0.013 + 0.004) * ALPHA_SCALE,
        ti: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  var aMax = 0.82 * ALPHA_SCALE;
  var aMin = 0.1 * ALPHA_SCALE;

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.a += s.td * s.ti;
      if (s.a > aMax || s.a < aMin) s.ti *= -1;
      s.y -= s.sp;
      s.x += s.dr;
      if (s.y < -2) { s.y = c.height + 2; s.x = Math.random() * c.width; }
      if (s.x < -2) s.x = c.width + 2;
      if (s.x > c.width + 2) s.x = -2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + TINT + ',' + s.a.toFixed(3) + ')';
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
