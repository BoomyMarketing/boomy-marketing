/* ================================================================
   BOOMY MARKETING — Shared JavaScript
   Version: 3.0 | 2026-04-14 | ES2022+
   Covers: navbar, progress bar, hamburger, magnetic
           buttons and GSAP reveals
   Note: body scroll-lock on menu open handled by CSS :has()
================================================================ */

/* ================================================================
   2. NAVBAR — glass blur on scroll
================================================================ */
const initNavbar = () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
};

/* ================================================================
   3. SCROLL PROGRESS BAR
================================================================ */
const initProgressBar = () => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${pct.toFixed(1)}%`;
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
};

/* ================================================================
   4. HAMBURGER MENU
================================================================ */
const initHamburger = () => {
  const btn  = document.querySelector('.nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  // Use :has() for scroll lock if supported, else JS fallback
  const hasSupport = CSS.supports('selector(body:has(a))');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (!hasSupport) document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (!hasSupport) document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
      if (!hasSupport) document.body.style.overflow = '';
    }
  });

  // Close on outside click
  document.addEventListener('click', ({ target }) => {
    if (!menu.contains(target) && !btn.contains(target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (!hasSupport) document.body.style.overflow = '';
    }
  });
};

/* ================================================================
   5. MAGNETIC CTA BUTTONS
================================================================ */
const initMagneticButtons = () => {
  const PULL = 0.34;
  document.querySelectorAll('.magnetic-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * PULL;
      const dy = (e.clientY - (r.top  + r.height / 2)) * PULL;
      el.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
};

/* ================================================================
   6. GSAP SCROLL REVEALS (generic — used on every page)
================================================================ */
const initRevealAnimations = () => {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const revealConfig = (from) => ({
    opacity: 1,
    ...from,
    duration: 0.72,
    ease: 'power2.out',
  });

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 38 },
      { ...revealConfig({ y: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      { ...revealConfig({ x: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      { ...revealConfig({ x: 0 }),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // :not(.reveal) is required — cards that ALSO carry .reveal were animated by two
  // competing tweens, which left them stuck at partial opacity (e.g. 0.11).
  gsap.utils.toArray(
    '.service-card:not(.reveal), .team-card:not(.reveal), .value-card:not(.reveal), .bento-card:not(.reveal)'
  ).forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 42, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out',
        delay: (i % 3) * 0.08, overwrite: 'auto',
        scrollTrigger: { trigger: card, start: 'top 91%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Safety net — content must never stay invisible.
     ScrollTrigger caches element positions, so a fast jump (anchor link, restored
     scroll position, browser find, late-loading fonts/images shifting layout) can
     leave a reveal un-fired at opacity 0. Anything that has been on screen for
     ~900ms and is still faded gets snapped to its final state. The delay is longer
     than the 0.72s reveal, so normal animations are never cut short. */
  const REVEAL_SEL = '.reveal, .reveal-left, .reveal-right, .service-card, .team-card, .value-card, .bento-card';
  const unstick = () => {
    document.querySelectorAll(REVEAL_SEL).forEach(el => {
      if (parseFloat(getComputedStyle(el).opacity) >= 0.95) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' });
      }
    });
  };

  let unstickTimer;
  const scheduleUnstick = () => {
    clearTimeout(unstickTimer);
    unstickTimer = setTimeout(unstick, 900);
  };

  window.addEventListener('scroll', scheduleUnstick, { passive: true });
  window.addEventListener('resize', scheduleUnstick, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleUnstick(); });
  window.addEventListener('load', () => {
    // re-measure triggers once everything that affects layout has settled
    ScrollTrigger.refresh();
    scheduleUnstick();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
};

/* ================================================================
   7. TOAST NOTIFICATIONS
================================================================ */
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  // Styles injected once
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed; bottom: 24px; right: 24px;
        padding: 14px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 9999;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 360px;
      }
      .toast--visible { opacity: 1; transform: translateY(0); }
      .toast--success { background: #22c55e; color: #fff; }
      .toast--error   { background: #ef4444; color: #fff; }
      .toast--info    { background: #3b82f6; color: #fff; }
      @media (max-width: 480px) {
        .toast { left: 16px; right: 16px; max-width: none; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
};

/* ================================================================
   8. FAQ ACCORDION
================================================================ */
const initFaqAccordion = () => {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
};

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initHamburger();
  initMagneticButtons();
  initFaqAccordion();
  
  // DEBUG: Track all link clicks
  document.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      const link = e.target.closest('a');
      console.log('🔗 Link clicked:', {
        href: link.href,
        text: link.textContent.trim(),
        target: link
      });
    }
  });
});

window.addEventListener('load', initRevealAnimations);

// Expose toast globally for inline handlers
window.showToast = showToast;
