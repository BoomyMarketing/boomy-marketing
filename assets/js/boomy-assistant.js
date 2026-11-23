(() => {
  "use strict";

  const script = document.currentScript;
  const hostId = "boomy-site-assistant";
  const closeMs = 140;
  const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
  const styles = `
    :host {
      all: initial;
      --deep: #100930;
      --surface: #1a0f3e;
      --raised: #2d1b69;
      --line: #493762;
      --ink: #fbf7ff;
      --muted: #c9bfdd;
      --orange: #ff6b35;
      --yellow: #ffd23f;
      --action: linear-gradient(120deg, var(--orange), var(--yellow));
      --radius-sm: 8px;
      --radius: 16px;
      --radius-lg: 24px;
      --edge: 24px;
      color-scheme: dark;
      color: var(--ink);
      font: 400 16px/1.5 "Inter", system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    button:disabled { cursor: default; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible,
    .conversation:focus-visible, .lead-view:focus-visible {
      outline: 2px solid var(--yellow);
      outline-offset: 3px;
    }
    button, input, select, textarea { -webkit-tap-highlight-color: transparent; }
    p, h2, h3 { margin: 0; }
    svg { display: block; width: 20px; height: 20px; flex: none; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .launcher, .send, .primary {
      border: 0;
      background: var(--action);
      color: var(--deep);
      font-weight: 700;
    }
    .launcher {
      position: fixed;
      z-index: 2147483000;
      inset: auto max(var(--edge), env(safe-area-inset-right)) max(var(--edge), env(safe-area-inset-bottom)) auto;
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 56px;
      padding: 0 20px;
      border-radius: 100px;
      box-shadow: 0 8px 28px #10093075, 0 6px 24px #ff6b3538;
      animation: launcher-in 460ms cubic-bezier(.2, .75, .25, 1) backwards;
      transition: box-shadow 180ms, transform 180ms;
    }
    .launcher:hover { box-shadow: 0 9px 30px #10093085, 0 8px 32px #ff6b3553; transform: translateY(-2px); }
    .launcher:active { transform: translateY(1px); }
    .panel {
      position: fixed;
      inset: auto max(var(--edge), env(safe-area-inset-right)) max(var(--edge), env(safe-area-inset-bottom)) auto;
      width: 432px;
      max-width: calc(100% - 2 * var(--edge));
      height: min(604px, calc(100vh - 2 * var(--edge)));
      height: min(604px, calc(100dvh - 2 * var(--edge)));
      max-height: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      overscroll-behavior: contain;
      color: var(--ink);
      background: var(--deep);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 70px #10093085;
    }
    .panel[open] {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      animation: panel-in 220ms cubic-bezier(.2, .75, .25, 1) both;
    }
    .panel[data-closing] { animation: panel-out 140ms ease-in both; }
    .panel::backdrop { overflow: hidden; overscroll-behavior: contain; background: #10093038; }
    .header {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 14px 20px;
      border-bottom: 1px solid var(--line);
      background: var(--surface);
    }
    .mark {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      border-radius: 50%;
      background: var(--action);
      color: var(--deep);
    }
    .mark svg { width: 23px; height: 23px; }
    .title { font-size: 1rem; line-height: 1.1; flex: 1; min-width: 0; outline: none; }
    .brand { display: block; font: 400 29px/1 "Berkshire Swash", Georgia, serif; }
    .title small { display: block; margin-top: 4px; color: var(--muted); font: 500 12px/1.25 "Inter", system-ui, sans-serif; }
    .icon {
      display: grid;
      place-items: center;
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 50%;
      background: transparent;
      color: var(--ink);
      transition: background-color 140ms, border-color 140ms;
    }
    .icon:not(.send):hover { background-color: var(--raised); }
    .chat-view { display: grid; grid-template-rows: minmax(0, 1fr) auto; min-height: 0; }
    .conversation, .lead-view {
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-color: var(--line) transparent;
    }
    .conversation { padding: 20px; }
    .conversation:focus-visible, .lead-view:focus-visible { outline-offset: -4px; }
    .messages { display: grid; gap: 14px; }
    .message {
      width: fit-content;
      max-width: 90%;
      padding: 12px 14px;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: var(--radius) var(--radius) var(--radius) 4px;
      font-size: 16px;
      line-height: 1.55;
    }
    .message.user {
      justify-self: end;
      background: var(--raised);
      border-color: #604593;
      border-radius: var(--radius) var(--radius) 4px var(--radius);
    }
    .prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .prompt, .link {
      min-height: 44px;
      border: 1px solid transparent;
      color: var(--yellow);
      background: transparent;
      font-size: 13px;
      font-weight: 600;
    }
    .prompt {
      padding: 0 12px;
      border-color: var(--line);
      border-radius: 100px;
      color: var(--ink);
    }
    .prompt:hover { border-color: var(--orange); background: var(--surface); }
    .link { border-radius: var(--radius-sm); padding: 0 5px; text-decoration: underline; text-underline-offset: 3px; }
    .link:hover { color: var(--ink); }
    .typing { display: flex; align-items: center; gap: 5px; padding: 14px 2px 0; color: var(--muted); font-size: 13px; }
    .typing span { width: 5px; height: 5px; background: var(--orange); border-radius: 50%; animation: blink 950ms ease-in-out 4 alternate; }
    .typing span:nth-child(2) { animation-delay: 140ms; }
    .typing span:nth-child(3) { animation-delay: 280ms; margin-right: 4px; }
    .feedback { color: #ffd1c1; font-size: 13px; overflow-wrap: anywhere; white-space: pre-wrap; }
    .chat-feedback { margin-top: 12px; }
    .footer { padding: 12px 16px 8px; border-top: 1px solid var(--line); background: var(--surface); }
    .compose {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) 44px;
      align-items: end;
      gap: 6px;
      padding: 5px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--deep);
    }
    .composer {
      display: block;
      width: 100%;
      min-height: 44px;
      max-height: 112px;
      field-sizing: content;
      resize: none;
      border: 0;
      border-radius: var(--radius-sm);
      padding: 10px 5px;
      background: transparent;
      color: var(--ink);
      font-size: 16px;
      line-height: 1.35;
    }
    .composer::placeholder { color: var(--muted); }
    .mic { border-color: var(--line); }
    .mic[aria-pressed="true"] { color: var(--yellow); border-color: var(--orange); background: var(--raised); }
    .mic:disabled { opacity: .55; }
    .send { background: var(--action); color: var(--deep); }
    .send:not(:disabled):hover, .primary:not(:disabled):hover { filter: brightness(1.1); }
    .send:disabled { background: var(--raised); color: var(--muted); opacity: .8; }
    .footer-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 0 0 3px; }
    .notice { max-width: 24ch; color: var(--muted); font-size: 11px; line-height: 1.36; }
    .lead-action { flex-shrink: 0; }
    .voice { margin-top: 12px; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    .voice-text { color: var(--muted); font-size: 13px; overflow-wrap: anywhere; }
    .caption { margin-top: 5px; font-size: 14px; overflow-wrap: anywhere; white-space: pre-wrap; }
    .voice-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .lead-view { padding: 14px 20px 20px; }
    .lead-head { display: flex; align-items: center; gap: 7px; margin: 0 0 8px -6px; }
    .lead-head h3 { font-size: 18px; outline: none; }
    .lead-copy { margin: 0 0 14px; color: var(--muted); font-size: 14px; }
    .lead-fields { display: grid; gap: 10px; min-inline-size: 0; padding: 0; margin: 0; border: 0; }
    .field { display: grid; gap: 4px; color: var(--muted); font-size: 13px; }
    .field input, .field select, .field textarea {
      width: 100%;
      min-height: 44px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--ink);
      font-size: 16px;
    }
    .field textarea { resize: vertical; }
    .consent { display: flex; align-items: center; min-height: 44px; gap: 9px; color: var(--muted); font-size: 13px; }
    .consent input { width: 20px; height: 20px; flex: 0 0 20px; margin: 0; accent-color: var(--orange); }
    .primary { justify-self: start; min-height: 44px; padding: 8px 16px; border-radius: 100px; }
    .primary:disabled { opacity: .65; }
    .lead-feedback:not(:empty) { margin-top: 10px; }
    .receipt { padding: 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    .reference { margin-top: 6px; overflow-wrap: anywhere; color: var(--muted); font-size: 13px; }
    @keyframes launcher-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes panel-in { from { opacity: 0; transform: translateY(9px) scale(.985); } to { opacity: 1; transform: none; } }
    @keyframes panel-out { to { opacity: 0; transform: translateY(9px) scale(.985); } }
    @keyframes blink { from { opacity: .38; } to { opacity: 1; } }
    @media (max-width: 600px), (max-width: 950px) and (max-height: 500px) and (pointer: coarse) {
      :host { --edge: 16px; }
      .panel {
        inset: var(--viewport-top, 0px) 0 auto;
        width: 100%;
        max-width: none;
        height: 100vh;
        height: var(--viewport-height, 100dvh);
        border: 0;
        border-radius: 0;
      }
      .header { padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) 12px max(16px, env(safe-area-inset-left)); }
      .conversation, .lead-view { padding-inline: max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right)); }
      .footer { padding-inline: max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-right)); padding-bottom: max(8px, env(safe-area-inset-bottom)); }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
      .launcher:hover, .launcher:active { transform: none; }
    }
  `;

  const markup = `
    <button class="launcher" type="button" aria-haspopup="dialog" aria-controls="boomy-panel" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.5a7.9 7.9 0 0 1-8.3 7.5 9 9 0 0 1-3.1-.6L4 20l1.5-4.1a7 7 0 0 1-1.8-4.4A7.9 7.9 0 0 1 12 4a7.9 7.9 0 0 1 8.5 7.5Z"/><path d="M8.5 11.5h7"/></svg>
      Ask Boomy
    </button>
    <dialog class="panel" id="boomy-panel" aria-labelledby="boomy-title">
      <header class="header">
        <span class="mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 1.5 2.7 7.8 7.8 2.7-7.8 2.7-2.7 7.8-2.7-7.8L1.5 12l7.8-2.7Z"/></svg>
        </span>
        <h2 class="title" id="boomy-title" tabindex="-1" autofocus><span class="brand" lang="en">Boomy</span><small>AI sales assistant</small></h2>
        <button type="button" class="icon close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <div class="chat-view">
        <section class="conversation" tabindex="0" aria-label="Chat history">
          <div class="messages" role="log" aria-label="Messages" aria-live="off">
            <article class="opening">
              <p class="message"><span class="sr-only">Boomy: </span>Hi, I’m Boomy’s AI assistant. What would you like marketing to do for your business?</p>
              <div class="prompts">
                <button class="prompt" type="button" data-prompt="Which Boomy services could help my business?">Explore services</button>
                <button class="prompt" type="button" data-prompt="How would you help me get more qualified leads?">I need more leads</button>
              </div>
            </article>
          </div>
          <div class="typing" aria-hidden="true" hidden><span></span><span></span><span></span>Boomy is typing</div>
          <div class="chat-feedback" hidden>
            <p class="feedback"></p>
            <button type="button" class="link retry">Try again</button>
          </div>
          <div class="voice" hidden>
            <p class="voice-text"></p>
            <p class="caption" hidden></p>
            <div class="voice-actions">
              <button type="button" class="link stop" hidden>Stop voice</button>
              <button type="button" class="link play" hidden>Play audio</button>
            </div>
          </div>
        </section>
        <footer class="footer">
          <form class="compose">
            <button type="button" class="icon mic" aria-label="Microphone" aria-pressed="false" aria-describedby="boomy-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 10.5v1a6.5 6.5 0 0 0 13 0v-1M12 18v3m-3 0h6"/></svg>
            </button>
            <textarea rows="1" class="composer" maxlength="1200" aria-label="Message" placeholder="Write a message…" required></textarea>
            <button type="submit" class="icon send" aria-label="Send message" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-5 5 5-5 5 5"/></svg>
            </button>
          </form>
          <div class="footer-meta">
            <p class="notice" id="boomy-notice">This conversation is recorded for quality.</p>
            <button type="button" class="link lead-action">Request a callback</button>
          </div>
        </footer>
      </div>
      <section class="lead-view" aria-labelledby="boomy-lead-title" hidden>
        <div class="lead-head">
          <button type="button" class="icon back" aria-label="Back to chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6"/></svg>
          </button>
          <h3 id="boomy-lead-title" tabindex="-1">Request a callback</h3>
        </div>
        <form class="lead-form">
          <p class="lead-copy">Choose when our team can call to discuss your business.</p>
          <p class="lead-copy voice-disclosure" hidden>Your voice transcript will be included with this request.</p>
          <fieldset class="lead-fields">
            <label class="field">Name<input name="name" maxlength="80" autocomplete="name" required></label>
            <label class="field">Phone number<input type="tel" name="phone" maxlength="40" autocomplete="tel" required></label>
            <label class="field">Email address<input type="email" name="email" maxlength="160" autocomplete="email" required></label>
            <label class="field">Business<input name="businessType" maxlength="120" autocomplete="organization" required></label>
            <label class="field">Service you're interested in<input name="serviceInterest" maxlength="160" placeholder="e.g. SEO or Google Ads" required></label>
            <label class="field">What would you like to achieve?<textarea name="goal" maxlength="800" rows="2" required></textarea></label>
            <label class="field">Callback window (Toronto time)<select name="windowId" required><option value="">Choose a time</option></select></label>
            <button type="button" class="link refresh-windows" hidden>Refresh callback times</button>
            <details><summary>Location, budget or timing (optional)</summary>
              <label class="field">Service area<input name="location" maxlength="100"></label>
              <label class="field">Budget<input name="budget" maxlength="80"></label>
              <label class="field">Timeline<input name="timeline" maxlength="100"></label>
            </details>
            <label class="consent"><input type="checkbox" name="consent" required>I agree to share these details with Boomy and receive a call about this request.</label>
            <button class="primary" type="submit">Confirm callback request</button>
          </fieldset>
          <p class="feedback lead-feedback" role="status"></p>
        </form>
        <div class="receipt" hidden>
          <p>Your callback request has reached the Boomy team.</p>
          <p class="confirmed-window"></p>
          <p class="reference"></p>
        </div>
      </section>
      <p class="sr-only announcement" role="status" aria-atomic="true"></p>
      <audio class="remote-audio" autoplay playsinline hidden></audio>
    </dialog>
  `;

  // Runtime wiring is kept inside the shadow root of the single mounted widget.
  function mount() {
    if (document.getElementById(hostId)) return;
    const api = new URL(script?.dataset.apiBase || "/api/assistant", location.href);
    if (api.origin !== location.origin || api.search || api.hash || api.username || api.password) {
      throw new Error("Boomy assistant requires a same-origin API base URL without a query or fragment.");
    }

    const host = document.createElement("div");
    host.id = hostId;
    host.lang = "en";
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = markup;
    const style = document.createElement("style");
    if (script?.nonce) style.nonce = script.nonce;
    style.textContent = styles;
    root.prepend(style);
    document.body.append(host);

    const endpoint = api.href.replace(/\/+$/, "");
    startWidget(root, endpoint);
  }

  class VisitorError extends Error {}

  function visitorMessage(error, fallback) {
    return error instanceof VisitorError ? error.message : fallback;
  }

  function startWidget(root, endpoint) {
    const find = (selector) => root.querySelector(selector);
    const launcher = find(".launcher");
    const panel = find(".panel");
    const title = find(".title");
    const feed = find(".conversation");
    const announcement = find(".announcement");
    const viewport = window.visualViewport;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    async function post(path, payload, { accept = "application/json", timeoutMs = 30_000, keepalive = false } = {}) {
      const response = await fetch(endpoint + path, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        redirect: "error",
        keepalive,
        signal: keepalive ? undefined : AbortSignal.timeout(timeoutMs),
        headers: { "Content-Type": "application/json", Accept: accept },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        if (typeof error?.message === "string" && error.message.trim() && error.message.length <= 500) {
          if (error.error === "callback_only" && (path === "/chat" ||
              (path === "/voice-token" && ["issue", "connect"].includes(payload.action)))) {
            showCallbackOnly(error.message);
          }
          throw new VisitorError(error.message);
        }
        throw new Error("Unexpected HTTP status " + response.status);
      }
      return response;
    }

    const postJson = async (path, payload, options) => (await post(path, payload, options)).json();
    const announce = (message) => { announcement.textContent = message; };
    const scroll = () => { feed.scrollTop = feed.scrollHeight; };
    const isAtBottom = () => feed.scrollHeight - feed.scrollTop - feed.clientHeight < 64;
    setupChat(find, post, announce, scroll, isAtBottom);
    const voice = setupVoice(find, root, postJson, announce, scroll, isAtBottom);
    const showCallbackOnly = setupLead(find, postJson, voice, announce, endpoint);

    function syncViewport() {
      if (!viewport) return;
      panel.style.setProperty("--viewport-height", viewport.height + "px");
      panel.style.setProperty("--viewport-top", viewport.offsetTop + "px");
    }

    launcher.addEventListener("click", () => {
      if (panel.open) return;
      syncViewport();
      viewport?.addEventListener("resize", syncViewport);
      viewport?.addEventListener("scroll", syncViewport);
      panel.showModal();
      launcher.setAttribute("aria-expanded", "true");
      title.focus({ preventScroll: true });
    });

    function closePanel() {
      if (!panel.open || panel.hasAttribute("data-closing")) return;
      voice.stop();
      const finish = () => {
        panel.close();
        panel.removeAttribute("data-closing");
        launcher.setAttribute("aria-expanded", "false");
        viewport?.removeEventListener("resize", syncViewport);
        viewport?.removeEventListener("scroll", syncViewport);
        launcher.focus({ preventScroll: true });
      };
      if (reducedMotion.matches) {
        finish();
      } else {
        panel.setAttribute("data-closing", "");
        setTimeout(finish, closeMs);
      }
    }

    find(".close").addEventListener("click", closePanel);
    panel.addEventListener("cancel", (event) => {
      event.preventDefault();
      closePanel();
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
      const controls = Array.from(panel.querySelectorAll("button, input, select, textarea, summary, [tabindex]"))
        .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      const focused = root.activeElement;
      if (event.shiftKey && (focused === first || focused?.tabIndex === -1)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    window.addEventListener("pagehide", () => voice.stop());
  }

  function setupChat(find, post, announce, scroll, isAtBottom) {
    const form = find(".compose");
    const composer = find(".composer");
    const send = find(".send");
    const messages = find(".messages");
    const prompts = find(".prompts");
    const typing = find(".typing");
    const feedback = find(".chat-feedback");
    const retry = find(".retry");
    let pending = false;
    let failedTurn;

    function addMessage(sender, message) {
      const bubble = document.createElement("p");
      bubble.className = "message " + sender;
      const label = document.createElement("span");
      label.className = "sr-only";
      label.textContent = sender === "user" ? "You: " : "Boomy: ";
      const content = document.createTextNode(message);
      bubble.append(label, content);
      messages.append(bubble);
      return { bubble, content };
    }

    function updateSend() {
      send.disabled = pending || !composer.value.trim();
    }

    async function sendTurn(turn) {
      if (pending) return;
      pending = true;
      failedTurn = undefined;
      updateSend();
      feedback.hidden = true;
      typing.hidden = false;
      announce("Boomy is thinking.");
      scroll();

      let answer;
      function showReply(text) {
        const pinned = isAtBottom();
        typing.hidden = true;
        if (!answer) answer = addMessage("assistant", text);
        else answer.content.data = text;
        if (pinned) scroll();
      }

      try {
        const response = await post("/chat", turn, { accept: "application/json, text/event-stream" });
        const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";
        const reply = contentType.includes("text/event-stream")
          ? await readChatStream(response, showReply)
          : (await response.json())?.reply;
        if (typeof reply !== "string" || !reply.trim()) throw new Error("Missing reply");
        showReply(reply);
        announce("Boomy: " + reply);
      } catch (error) {
        answer?.bubble.remove();
        failedTurn = turn;
        const message = visitorMessage(error, "We couldn’t get a reply. You can try sending that message again.");
        feedback.querySelector("p").textContent = message;
        feedback.hidden = false;
        announce(message);
        scroll();
      } finally {
        typing.hidden = true;
        pending = false;
        updateSend();
      }
    }

    function submit(message) {
      message = message.trim();
      if (pending || !message || message.length > 1200) return;
      prompts.hidden = true;
      composer.value = "";
      composer.focus({ preventScroll: true });
      addMessage("user", message);
      sendTurn({ message, requestId: crypto.randomUUID() });
    }

    composer.addEventListener("input", updateSend);
    composer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        submit(composer.value);
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submit(composer.value);
    });
    prompts.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-prompt]");
      if (button) submit(button.dataset.prompt);
    });
    retry.addEventListener("click", () => {
      if (!failedTurn) return;
      composer.focus({ preventScroll: true });
      sendTurn(failedTurn);
    });
  }

  async function readChatStream(response, update) {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Missing chat stream");
    const decoder = new TextDecoder();
    let buffer = "";
    let reply = "";
    let complete = false;

    function readFrame(frame) {
      const data = frame.split(/\r?\n/).filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).replace(/^ /, "")).join("\n");
      if (!data) return;
      if (data === "[DONE]") {
        complete = true;
        return;
      }
      const event = JSON.parse(data);
      if (typeof event?.delta === "string") {
        reply += event.delta;
        if (reply.length > 32_000) throw new Error("Chat stream reply exceeds display limit");
        update(reply);
      }
    }

    try {
      while (!complete) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop();
        for (const frame of frames) {
          readFrame(frame);
          if (complete) break;
        }
        if (buffer.length > 65_536) throw new Error("Chat stream frame exceeds display limit");
        if (done) {
          if (!complete) readFrame(buffer);
          break;
        }
      }
    } finally {
      reader.cancel().catch(() => {});
      reader.releaseLock();
    }
    if (!complete || !reply.trim()) throw new Error("Incomplete chat stream");
    return reply;
  }

  function setupLead(find, postJson, voice, announce, endpoint) {
    const chatView = find(".chat-view");
    const leadView = find(".lead-view");
    const leadAction = find(".lead-action");
    const title = find("#boomy-lead-title");
    const form = find(".lead-form");
    const fields = find(".lead-fields");
    const feedback = find(".lead-feedback");
    const disclosure = find(".voice-disclosure");
    const windowField = form.elements.namedItem("windowId");
    const refresh = find(".refresh-windows");
    let windowRequest;
    let summaryToken;
    async function loadWindows() {
      if (windowRequest || received) return;
      const previous = windowField.value;
      windowRequest = true;
      try {
        const res = await fetch(endpoint + "/lead", { cache:"no-store", credentials:"same-origin", signal:AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error("Window lookup failed");
        const { windows, summaryToken: snapshot } = await res.json();
        if (!Array.isArray(windows) || windows.length !== 3 ||
            windows.some(w => typeof w.id !== "string" || typeof w.label !== "string") ||
            typeof snapshot !== "string") throw new Error("Invalid windows");
        summaryToken = snapshot;
        windowField.replaceChildren(new Option("Choose a time",""), ...windows.map(w => new Option(w.label,w.id)));
        windowField.value = windows.some(w => w.id === previous) ? previous : "";
        windowField.setCustomValidity("");
        refresh.hidden = true;
      } catch {
        feedback.textContent = "We couldn't load the callback times. Refresh them to continue.";
        refresh.hidden = false;
      } finally { windowRequest = false; }
    }
    refresh.addEventListener("click", loadWindows);
    let attempt;
    let pending = false;
    let received = false;

    function showLead() {
      voice.stop();
      disclosure.hidden = !voice.summary();
      chatView.hidden = true;
      leadView.hidden = false;
      title.focus({ preventScroll: true });
      loadWindows();
    }
    const back = find(".back");
    leadAction.addEventListener("click", showLead);
    back.addEventListener("click", () => {
      leadView.hidden = true;
      chatView.hidden = false;
      leadAction.focus({ preventScroll: true });
    });

    form.addEventListener("input", (event) => {
      event.target.setCustomValidity?.("");
      if (!pending) feedback.textContent = "";
    });
    form.addEventListener("invalid", (event) => {
      const field = event.target;
      if (!field.validity.valueMissing) return;
      field.setCustomValidity(field.type === "checkbox" ? "Please agree to share your details and receive a callback." : "Please complete this field.");
    }, true);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending || received) return;

      const details = {};
      for (const name of ["name", "phone", "email", "businessType", "serviceInterest", "goal", "windowId"]) {
        const input = form.elements.namedItem(name);
        const value = input.value.trim();
        if (!value) {
          input.setCustomValidity("Please complete this field.");
          input.reportValidity();
          return;
        }
        details[name] = value;
      }
      const digits = details.phone.replace(/\D/g,"");
      const validPhone = /^\+?[\d(). -]+$/.test(details.phone) &&
        (details.phone.startsWith("+") ? /^[1-9]\d{7,14}$/.test(digits) : /^(?:1\d{10}|\d{10})$/.test(digits));
      if (!validPhone || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(details.email)) {
        const input = form.elements.namedItem(validPhone ? "email" : "phone");
        input.setCustomValidity(validPhone ? "Enter a valid email address." : "Enter a ten-digit North American number or include your country code with +.");
        input.reportValidity();
        return;
      }
      for (const name of ["location","budget","timeline"]) {
        const value = form.elements.namedItem(name).value.trim();
        if (value) details[name] = value;
      }
      if (!form.elements.namedItem("consent").checked) return;

      const key = JSON.stringify(details);
      if (attempt?.key !== key) {
        const payload = { requestId: crypto.randomUUID(), ...details, summaryToken, consent: true };
        const summary = voice.summary();
        if (summary) payload.voiceSummary = summary;
        attempt = { key, payload };
      }

      pending = true;
      fields.disabled = true;
      feedback.textContent = "Sending your callback request…";
      try {
        const receipt = await postJson("/lead", attempt.payload);
        if (receipt?.status !== "received" || typeof receipt.reference !== "string" || !receipt.reference.trim() ||
            typeof receipt.window !== "string" || !receipt.window.trim()) {
          throw new Error("Missing lead receipt");
        }
        received = true;
        form.reset();
        form.hidden = true;
        title.textContent = "Callback request received";
        find(".reference").textContent = "Reference: " + receipt.reference;
        find(".confirmed-window").textContent = "Your requested call window is " + receipt.window + ".";
        find(".receipt").hidden = false;
        leadAction.textContent = "Callback status";
        attempt = undefined;
        if (!leadView.hidden) {
          leadView.scrollTop = 0;
          title.focus({ preventScroll: true });
        }
        announce("Callback request received for " + receipt.window + ".");
      } catch (error) {
        refresh.hidden = false;
        feedback.textContent = visitorMessage(error, "We couldn’t confirm the request. Your details are still in the form. You can try again.");
      } finally {
        pending = false;
        fields.disabled = false;
      }
    });
    return (message) => {
      back.hidden = true;
      showLead();
      feedback.textContent = message;
      announce(message);
    };
  }

  function setupVoice(find, root, postJson, announce, scroll, isAtBottom) {
    const mic = find(".mic");
    const box = find(".voice");
    const voiceText = find(".voice-text");
    const caption = find(".caption");
    const stopButton = find(".stop");
    const playButton = find(".play");
    const audio = find(".remote-audio");
    const captions = { input: "", output: "" };
    const labels = { input: "You", output: "Boomy" };
    let current;
    let connectPending = false;

    function message(text) {
      const pinned = isAtBottom();
      box.hidden = false;
      voiceText.textContent = text;
      announce(text);
      if (pinned) scroll();
    }

    function updateMic() {
      mic.setAttribute("aria-pressed", String(Boolean(current)));
      mic.disabled = !current && connectPending;
      stopButton.hidden = !current;
    }

    function release(session) {
      session.cancel.abort();
      clearTimeout(session.connectionTimer);
      clearTimeout(session.limitTimer);
      session.peer?.close();
      session.stream?.getTracks().forEach((track) => track.stop());
      if (session.callId && !session.stopSent) {
        session.stopSent = true;
        // Keep the cleanup request alive on navigation. The server also expires the call.
        postJson("/voice-token", { action: "stop", callId: session.callId }, { keepalive: true })
          .catch(() => {});
      }
    }

    function stop(text = "Voice is off.") {
      if (!current) return;
      const session = current;
      const returnFocus = root.activeElement === stopButton || root.activeElement === playButton;
      current = undefined;
      release(session);
      audio.pause();
      audio.srcObject = null;
      playButton.hidden = true;
      updateMic();
      if (returnFocus) (mic.disabled ? find(".composer") : mic).focus({ preventScroll: true });
      message(text);
    }

    async function playAudio(session) {
      try {
        await audio.play();
        if (current === session) playButton.hidden = true;
      } catch {
        if (current === session) {
          playButton.hidden = false;
          announce("Select Play audio to hear Boomy.");
        }
      }
    }

    function wirePeer(session) {
      const peer = new RTCPeerConnection();
      session.peer = peer;
      for (const track of session.stream.getAudioTracks()) {
        peer.addTrack(track, session.stream);
        track.addEventListener("ended", () => {
          if (current === session) stop("Your microphone is off. You can keep typing.");
        }, { once: true });
      }
      peer.addEventListener("track", (event) => {
        if (current !== session || event.track.kind !== "audio") return;
        audio.srcObject = event.streams[0] || new MediaStream([event.track]);
        playAudio(session);
      });
      peer.addEventListener("connectionstatechange", () => {
        if (current !== session) return;
        if (peer.connectionState === "connected") {
          clearTimeout(session.connectionTimer);
          message("Your microphone is on. Go ahead.");
        } else if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
          stop("Voice disconnected. You can keep typing.");
        }
      });
      const events = peer.createDataChannel("oai-events");
      events.addEventListener("message", (event) => {
        if (current !== session || typeof event.data !== "string") return;
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (data?.type === "error") {
          stop("The voice session ended. You can keep typing.");
          return;
        }
        const kind = data?.type === "session.input_transcript.delta" ? "input"
          : data?.type === "session.output_transcript.delta" ? "output" : null;
        if (!kind || typeof data.delta !== "string" || !data.delta) return;
        const pinned = isAtBottom();
        captions[kind] = (captions[kind] + data.delta).slice(-480);
        caption.textContent = labels[kind] + ": " + captions[kind];
        caption.hidden = false;
        if (pinned) scroll();
      });
      return peer;
    }

    async function start() {
      if (current || connectPending) return;
      if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection !== "function") {
        message("Voice is unavailable in this browser. You can type a message.");
        return;
      }
      const session = { cancel: new AbortController() };
      current = session;
      caption.hidden = true;
      updateMic();
      message("This conversation is recorded for quality. Allow microphone access to speak.");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false,
        });
        if (current !== session) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        session.stream = stream;
        if (!stream.getAudioTracks().length) throw new Error("No audio track");
        const peer = wirePeer(session);
        message("Connecting voice…");
        const ticket = await postJson("/voice-token", { action: "issue", requestId: crypto.randomUUID() }, { timeoutMs: 10_000 });
        if (current !== session) return;
        if (typeof ticket?.token !== "string" || !ticket.token || !Number.isFinite(ticket.maxSeconds) || ticket.maxSeconds <= 0) {
          throw new Error("Invalid voice ticket");
        }
        await peer.setLocalDescription(await peer.createOffer());
        await waitForIce(peer, session.cancel.signal);
        if (current !== session) return;

        const connectStarted = Date.now();
        session.connectionTimer = setTimeout(() => {
          if (current === session) stop("Voice took too long to connect. You can type a message.");
        }, 18_000);
        connectPending = true;
        let answer;
        try {
          // A late answer may contain the call ID needed to stop a cancelled call.
          answer = await postJson("/voice-token", {
            action: "connect",
            token: ticket.token,
            sdp: peer.localDescription.sdp,
          }, { timeoutMs: 25_000 });
          if (typeof answer?.callId === "string" && uuid.test(answer.callId)) session.callId = answer.callId;
        } finally {
          connectPending = false;
          updateMic();
        }
        if (current !== session) {
          release(session);
          return;
        }
        if (!session.callId || typeof answer.sdp !== "string" || !answer.sdp
          || !Number.isFinite(answer.maxSeconds) || answer.maxSeconds <= 0) {
          throw new Error("Invalid voice answer");
        }
        const limit = Math.min(360, ticket.maxSeconds, answer.maxSeconds) * 1000;
        session.limitTimer = setTimeout(() => {
          if (current === session) stop("The six-minute voice session has ended. You can keep typing.");
        }, Math.max(0, limit - (Date.now() - connectStarted)));
        await peer.setRemoteDescription({ type: "answer", sdp: answer.sdp });
      } catch (error) {
        if (current !== session) return;
        if (["NotAllowedError", "SecurityError"].includes(error.name)) {
          stop("Microphone access was declined. You can type a message.");
        } else {
          stop(visitorMessage(error, "Voice could not connect. You can type a message."));
        }
      }
    }

    mic.addEventListener("click", () => {
      if (current) stop();
      else start();
    });
    stopButton.addEventListener("click", () => stop());
    playButton.addEventListener("click", () => {
      if (current) playAudio(current);
    });

    return {
      stop,
      summary: () => Object.keys(captions).filter((kind) => captions[kind].trim())
        .map((kind) => labels[kind] + ": " + captions[kind].trim()).join("\n"),
    };
  }

  function waitForIce(peer, signal) {
    if (peer.iceGatheringState === "complete" || signal.aborted) return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(done, 4_000);
      function done() {
        clearTimeout(timer);
        peer.removeEventListener("icegatheringstatechange", onState);
        signal.removeEventListener("abort", done);
        resolve();
      }
      function onState() {
        if (peer.iceGatheringState === "complete") done();
      }
      peer.addEventListener("icegatheringstatechange", onState);
      signal.addEventListener("abort", done, { once: true });
    });
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();
