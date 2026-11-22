(() => {
  const forms = Array.from(document.querySelectorAll('form')).filter((form) => {
    const action = form.getAttribute('action');
    return action === '/api/contact' || form.id === 'contactForm' || form.id === 'ctaForm';
  });
  if (!forms.length) return;

  const states = new Map();

  function addDisclosure(form) {
    const disclosure = document.createElement('p');
    disclosure.className = 'recaptcha-disclosure';

    const privacy = document.createElement('a');
    privacy.href = 'https://policies.google.com/privacy';
    privacy.textContent = 'Privacy Policy';

    const terms = document.createElement('a');
    terms.href = 'https://policies.google.com/terms';
    terms.textContent = 'Terms of Service';

    for (const link of [privacy, terms]) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }

    disclosure.append('This site is protected by reCAPTCHA and the Google ', privacy, ' and ', terms, ' apply.');
    form.after(disclosure);
  }

  function setStatus(state, message) {
    state.status.textContent = message;
    state.status.style.display = message ? 'block' : 'none';
  }

  function setToken(form, state, token) {
    let input = form.querySelector('input[name="g-recaptcha-response"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'g-recaptcha-response';
      form.appendChild(input);
    }
    input.value = token;
    state.token = token;
  }

  function runChallenge(form, state) {
    if (state.executing || !window.grecaptcha?.enterprise) return;
    state.executing = true;
    setStatus(state, 'Checking your submission…');

    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.execute(state.siteKey, { action: 'contact' })
        .then((token) => {
          state.executing = false;
          setToken(form, state, token);
          setStatus(state, '');
          if (state.pending) {
            state.pending = false;
            form.requestSubmit();
          }
        })
        .catch(() => {
          state.executing = false;
          setStatus(state, 'Security check could not load. Please try again.');
        });
    });
  }

  forms.forEach((form) => {
    addDisclosure(form);
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.style.cssText = 'display:none;width:100%;margin:8px 0;color:#fbbf24;font-size:13px;line-height:1.4;';

    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    form.insertBefore(status, button || null);

    const state = {
      ready: false,
      enabled: false,
      executing: false,
      pending: false,
      siteKey: '',
      token: '',
      status,
    };
    states.set(form, state);

    form.addEventListener('submit', (event) => {
      if (!state.ready || (state.enabled && !state.token)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        state.pending = true;
        setStatus(state, state.ready ? 'Checking your submission…' : 'Preparing security check…');
        if (state.ready) runChallenge(form, state);
        return;
      }

      if (state.enabled) {
        setStatus(state, '');
        window.setTimeout(() => setToken(form, state, ''), 0);
      }
    }, true);
  });

  fetch('/api/recaptcha-config', { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then((response) => response.ok ? response.json() : { enabled: false })
    .then((config) => {
      if (!config.enabled || !config.siteKey) {
        states.forEach((state, form) => {
          state.ready = true;
          if (state.pending) {
            state.pending = false;
            form.requestSubmit();
          }
        });
        return;
      }

      const script = document.createElement('script');
      document.documentElement.classList.add('has-recaptcha-disclosure');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(config.siteKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        states.forEach((state, form) => {
          state.enabled = true;
          state.ready = true;
          state.siteKey = config.siteKey;
          if (state.pending) runChallenge(form, state);
        });
      };
      script.onerror = () => {
        states.forEach((state) => {
          state.ready = true;
          state.enabled = true;
          setStatus(state, 'Security check could not load. Please try again.');
        });
      };
      document.head.appendChild(script);
    })
    .catch(() => {
      states.forEach((state, form) => {
        state.ready = true;
        if (state.pending) {
          state.pending = false;
          form.requestSubmit();
        }
      });
    });
})();
