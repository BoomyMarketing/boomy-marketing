(() => {
  const forms = Array.from(document.querySelectorAll('form')).filter((form) => {
    const action = form.getAttribute('action');
    return action === '/api/contact' || form.id === 'contactForm' || form.id === 'ctaForm';
  });
  if (!forms.length) return;

  const states = new Map();

  function submitWhenReady(form, state) {
    if (!state.pending) return;
    state.pending = false;
    form.requestSubmit();
  }

  function setStatus(state, message) {
    state.status.textContent = message;
    state.status.style.display = message ? 'block' : 'none';
  }

  forms.forEach((form) => {
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.style.cssText = 'display:none;width:100%;margin:8px 0;color:#fbbf24;font-size:13px;line-height:1.4;';

    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    form.insertBefore(status, button || null);

    const state = { ready: false, enabled: false, token: '', pending: false, status, widgetId: null };
    states.set(form, state);

    form.addEventListener('submit', (event) => {
      if (!state.ready || (state.enabled && !state.token)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        state.pending = true;
        setStatus(state, state.ready ? 'Please complete the security check.' : 'Preparing security checkâ€¦');
        return;
      }

      if (state.enabled) {
        setStatus(state, '');
        window.setTimeout(() => {
          state.token = '';
          if (state.widgetId != null && window.turnstile) window.turnstile.reset(state.widgetId);
        }, 500);
      }
    }, true);
  });

  fetch('/api/turnstile-config', { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then((response) => response.ok ? response.json() : { enabled: false })
    .then((config) => {
      if (!config.enabled || !config.siteKey) {
        states.forEach((state, form) => {
          state.ready = true;
          submitWhenReady(form, state);
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        states.forEach((state, form) => {
          const container = document.createElement('div');
          container.style.cssText = 'width:100%;margin:8px 0;';
          form.insertBefore(container, state.status);
          state.enabled = true;
          state.ready = true;
          state.widgetId = window.turnstile.render(container, {
            sitekey: config.siteKey,
            action: 'contact',
            appearance: 'interaction-only',
            size: 'flexible',
            theme: 'auto',
            callback(token) {
              state.token = token;
              setStatus(state, '');
              submitWhenReady(form, state);
            },
            'expired-callback'() {
              state.token = '';
            },
            'error-callback'() {
              state.token = '';
              setStatus(state, 'Security check could not load. Please try again.');
            },
          });
          submitWhenReady(form, state);
        });
      };
      script.onerror = () => {
        states.forEach((state, form) => {
          state.ready = true;
          submitWhenReady(form, state);
        });
      };
      document.head.appendChild(script);
    })
    .catch(() => {
      states.forEach((state, form) => {
        state.ready = true;
        submitWhenReady(form, state);
      });
    });
})();

