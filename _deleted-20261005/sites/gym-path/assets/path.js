/* "Signal path": one line through every [data-node] on the page, drawn as the reader scrolls. */
(() => {
  const track = document.querySelector('.track');
  const svg = track.querySelector('.line');
  const [base, halo, live] = ['.line-base', '.line-halo', '.line-live'].map((s) => svg.querySelector(s));
  const head = svg.querySelector('.line-head');
  const nodes = [...track.querySelectorAll('[data-node]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let total = 0, samples = [], points = [];

  const litTarget = (n) => (n.classList.contains('node') && n.parentElement.matches('li, .stop-n') ? n.parentElement : n);
  const formEl = document.getElementById('request');

  function layout() {
    const t = track.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${t.width} ${track.scrollHeight}`);
    points = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      // big blocks (pass, reader, cut, send): the line meets their left edge, not their middle
      const big = r.width > 40;
      return { n, x: (big ? r.left : r.left + r.width / 2) - t.left, y: r.top + r.height / 2 - t.top };
    }).filter((p) => p.y > 0);
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i], dy = b.y - a.y;
      if (Math.abs(dy) < 36) d += ` L ${b.x} ${b.y}`;
      else d += ` C ${a.x} ${a.y + dy * .55} ${b.x} ${b.y - dy * .55} ${b.x} ${b.y}`;
    }
    for (const p of [base, halo, live]) p.setAttribute('d', d);
    total = live.getTotalLength();
    samples = [];
    for (let l = 0; l <= total; l += 6) samples.push([l, live.getPointAtLength(l).y]);
    samples.push([total, live.getPointAtLength(total).y]);
    for (const p of [halo, live]) p.style.strokeDasharray = `${total} ${total}`;
    // length along the path at which each node is reached
    points.forEach((p) => { let best = 0, bd = Infinity; for (const [l, y] of samples) { const dd = Math.abs(y - p.y); if (dd < bd) { bd = dd; best = l; } } p.len = best; });
    draw();
  }

  function lengthAtY(y) {
    // first sample past y going down the page (the path only ever moves downwards between stops)
    let lo = 0;
    for (const [l, sy] of samples) { if (sy > y) break; lo = l; }
    return lo;
  }

  function draw() {
    if (!total) return;
    const t = track.getBoundingClientRect();
    const y = still ? Infinity : innerHeight * 0.66 - t.top;
    const len = still ? total : Math.min(total, lengthAtY(y));
    for (const p of [halo, live]) p.style.strokeDashoffset = total - len;
    const pt = live.getPointAtLength(len);
    head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
    head.style.opacity = len > 2 && len < total - 2 ? 1 : 0;
    for (const p of points) litTarget(p.n).classList.toggle('lit', p.len <= len + 1);
    if (formEl) formEl.classList.toggle('lit', len >= total - 2);
  }

  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
  addEventListener('scroll', onScroll, { passive: true });
  let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(layout, 120); };
  addEventListener('resize', onResize);
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(track);
  document.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', onResize));
  if (document.fonts) document.fonts.ready.then(layout);
  addEventListener('load', layout);
  layout();
})();
