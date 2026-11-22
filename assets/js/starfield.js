/* Paint the existing upward-drifting stars once per viewport size. CSS moves
   the repeated canvas on the compositor and pauses it for hidden tabs. */
(() => {
  if (document.querySelector('.site-starfield')) return;

  const field = document.createElement('div');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  field.className = 'site-starfield';
  field.setAttribute('aria-hidden', 'true');
  field.append(canvas);

  const base = getComputedStyle(document.body).backgroundColor;
  const rgb = base.match(/\brgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const light = rgb && (0.2126 * Number(rgb[1]) + 0.7152 * Number(rgb[2]) + 0.0722 * Number(rgb[3])) > 127.5;
  const opacity = light ? 0.86 : 0.72;
  const soften = (value) => value.replace(/\brgb\((\d+),\s*(\d+),\s*(\d+)\)/g, 'rgba($1, $2, $3, ' + opacity + ')');

  // Read all section colours before changing the cascade. Keep card surfaces
  // and foreground media intact, including decorative SVG background images.
  const surfaces = document.querySelectorAll('main, main > article, main > div, body > header, section, footer, .section, .hero, .site-wrapper');
  const backgrounds = Array.from(surfaces, (element) => {
    const { backgroundClip, backgroundColor, backgroundImage, position } = getComputedStyle(element);
    if (position === 'fixed' || position === 'sticky' || backgroundClip === 'text') return null;

    const color = backgroundColor === base ? 'transparent' : soften(backgroundColor);
    const image = !backgroundImage.includes('url(') ? soften(backgroundImage) : backgroundImage;
    return { element, color, image, backgroundColor, backgroundImage };
  });

  for (const panel of backgrounds) {
    if (!panel) continue;
    if (panel.color !== panel.backgroundColor) panel.element.style.backgroundColor = panel.color;
    if (panel.image !== panel.backgroundImage) panel.element.style.backgroundImage = panel.image;
  }

  document.body.classList.add('has-site-starfield');
  const legacyCanvas = document.querySelector('canvas#starfield');
  if (legacyCanvas) legacyCanvas.replaceWith(field);
  else document.body.prepend(field);

  function paint() {
    const { clientWidth: width, clientHeight: height } = field;
    if (!width || !height || (canvas.width === width && canvas.height === height * 2)) return;

    canvas.width = width;
    canvas.height = height * 2;
    field.style.setProperty('--starfield-duration', Math.max(30, height / 8) + 's');

    const count = width < 640 ? 55 : width < 960 ? 85 : 145;
    for (let index = 0; index < count; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 0.45 + Math.random() * (index % 8 === 0 ? 1.5 : 0.95);
      const alternate = index % 4 === 0;
      ctx.fillStyle = light && !alternate ? '#202247' : alternate ? '#c0cbff' : '#f5f3ff';
      ctx.globalAlpha = 0.22 + Math.random() * (light && !alternate ? 0.32 : 0.58);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.moveTo(x + radius, y + height);
      ctx.arc(x, y + height, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function syncVisibility() {
    field.toggleAttribute('data-paused', document.hidden);
  }

  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  paint();
  new ResizeObserver(paint).observe(field);
})();
