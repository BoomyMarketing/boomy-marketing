/* Mount one decorative layer; CSS repeats and moves the pre-rendered stars. */
(() => {
  if (document.querySelector('.site-starfield')) return;

  const field = document.createElement('div');
  field.className = 'site-starfield';
  field.setAttribute('aria-hidden', 'true');

  document.body.classList.add('has-site-starfield');
  const legacyCanvas = document.querySelector('canvas#starfield');
  if (legacyCanvas) legacyCanvas.replaceWith(field);
  else document.body.prepend(field);

  function softenSections() {
    const base = getComputedStyle(document.body).backgroundColor;
    const rgb = base.match(/\brgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const light = Boolean(rgb && (0.2126 * Number(rgb[1]) + 0.7152 * Number(rgb[2]) + 0.0722 * Number(rgb[3])) > 127.5);
    const opacity = light ? 0.86 : 0.72;
    const soften = (value) => value.replace(/\brgb\((\d+),\s*(\d+),\s*(\d+)\)/g, 'rgba($1, $2, $3, ' + opacity + ')');
    field.toggleAttribute('data-light', light);

    // Read before writing so adjacent sections share one style calculation.
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
  }

  function scheduleSections() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(softenSections, { timeout: 1200 });
    else window.setTimeout(softenSections, 0);
  }

  function syncVisibility() {
    field.toggleAttribute('data-paused', document.hidden);
  }

  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  if (document.readyState === 'complete') scheduleSections();
  else window.addEventListener('load', scheduleSections, { once: true });
})();
