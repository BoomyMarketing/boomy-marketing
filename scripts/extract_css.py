"""
Extract page-specific CSS from index.html, replacing shared styles with main.css reference.
"""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_style = '''  <style>
    /* ================================================================
       INDEX.HTML — Page-specific CSS only
       Shared styles are in /assets/css/main.css
    ================================================================ */

    /* HERO */
    .hero { min-height: 100vh; min-height: 100dvh; padding: var(--nav-h) 5% 80px; display: flex; align-items: center; position: relative; overflow: hidden; }
    .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; max-width: 1200px; margin: 0 auto; width: 100%; }

    #heroBadge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,210,63,.12); border: 1px solid rgba(255,210,63,.3); border-radius: 100px; padding: 6px 16px; font-size: .78rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--accent-yellow); margin-bottom: 24px; }
    #heroBadge span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-yellow); animation: pulseGreen 2s ease-in-out infinite; }
    @keyframes pulseGreen { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }

    #hero-heading { font-size: clamp(2.6rem, 6vw, 5.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -.03em; margin-bottom: 8px; }

    .booming-word { font-family: "Berkshire Swash", cursive; font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 400; line-height: 1; background: linear-gradient(90deg, var(--accent-orange) 0%, var(--accent-yellow) 40%, var(--accent-orange) 80%, var(--accent-yellow) 100%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: sweepGradient 3s linear infinite; display: block; margin-bottom: 22px; }
    @keyframes sweepGradient { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

    .hero-sub { font-size: 1.1rem; color: var(--text-sec); line-height: 1.75; margin-bottom: 40px; max-width: 500px; }
    .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }

    .hero-visual { position: relative; display: flex; align-items: center; justify-content: center; height: 520px; }
    .planet { width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #b06aff 0%, var(--bg-deep) 28%, var(--accent-orange) 62%, var(--accent-yellow) 100%); box-shadow: 0 0 60px rgba(255,107,53,.5),0 0 120px rgba(255,107,53,.2),inset 0 0 40px rgba(124,58,237,.4); position: relative; z-index: 5; animation: planetPulse 5s ease-in-out infinite; }
    @keyframes planetPulse { 0%,100%{box-shadow:0 0 60px rgba(255,107,53,.5),0 0 120px rgba(255,107,53,.2),inset 0 0 40px rgba(124,58,237,.4)} 50%{box-shadow:0 0 85px rgba(255,107,53,.72),0 0 165px rgba(255,107,53,.3),inset 0 0 60px rgba(124,58,237,.55)} }
    .orbit-ring { position: absolute; border-radius: 50%; }
    .orbit-1 { width: 280px; height: 280px; border: 1.5px solid rgba(255,107,53,.3); }
    .orbit-2 { width: 380px; height: 380px; border: 1.5px solid rgba(255,210,63,.2); }
    .orbit-3 { width: 480px; height: 480px; border: 1.5px solid rgba(124,58,237,.15); }
    .orbit-1-wrap { position: absolute; width: 280px; height: 280px; border-radius: 50%; animation: orbitSpin  8s linear infinite; }
    .orbit-2-wrap { position: absolute; width: 380px; height: 380px; border-radius: 50%; animation: orbitSpin 14s linear infinite reverse; }
    .orbit-3-wrap { position: absolute; width: 480px; height: 480px; border-radius: 50%; animation: orbitSpin 20s linear infinite; }
    @keyframes orbitSpin { to { transform: rotate(360deg); } }
    .ring-dot { position: absolute; border-radius: 50%; top: 50%; left: 50%; }
    .orbit-1-wrap .ring-dot { width: 34px; height: 34px; background: radial-gradient(circle at 35% 35%, #FFD23F, #FF6B35); box-shadow: 0 0 16px rgba(255,210,63,.85); transform: translate(-50%,-140px); }
    .orbit-2-wrap .ring-dot { width: 20px; height: 20px; background: radial-gradient(circle at 35% 35%, #a78bfa, #7C3AED); box-shadow: 0 0 12px rgba(124,58,237,.85); transform: translate(-50%,-190px); }
    .orbit-3-wrap .ring-dot { width: 13px; height: 13px; background: radial-gradient(circle at 35% 35%, #fff, #e2e8f0); box-shadow: 0 0 8px rgba(255,255,255,.9); transform: translate(-50%,-240px); }
    .float-tag { position: absolute; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(8px); border-radius: 12px; padding: 10px 16px; font-size: .78rem; font-weight: 600; white-space: nowrap; z-index: 6; }
    .float-tag-1 { top: 10%; right: 2%; animation: floatTag 4s ease-in-out infinite; }
    .float-tag-2 { bottom: 15%; right: 0%; animation: floatTag 4s ease-in-out 1.5s infinite; }
    .float-tag-3 { bottom: 28%; left: 0%; animation: floatTag 4s ease-in-out .8s infinite; }
    @keyframes floatTag { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

    /* SERVICES */
    .services { background: linear-gradient(180deg, var(--bg-darkest) 0%, var(--bg-deep) 50%, var(--bg-darkest) 100%); }
    .services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 1200px; margin: 0 auto; }
    .service-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--r-lg); padding: 36px 28px; transition: transform var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base); position: relative; overflow: hidden; backdrop-filter: blur(8px); }
    .service-card::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(255,107,53,.06),rgba(255,210,63,.03)); opacity: 0; transition: opacity .3s; border-radius: inherit; }
    .service-card::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,var(--accent-orange),var(--accent-yellow)); opacity: 0; transition: opacity .3s; }
    .service-card:hover { border-color: rgba(255,107,53,.35); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(255,107,53,.15); }
    .service-card:hover::before,.service-card:hover::after { opacity: 1; }
    .service-icon { font-size: 2.6rem; margin-bottom: 20px; display: block; line-height: 1; }
    .service-name { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
    .service-desc { font-size: .9rem; color: var(--text-sec); line-height: 1.7; }
    .service-more { display: inline-flex; align-items: center; gap: 6px; margin-top: 20px; font-size: .85rem; font-weight: 600; color: var(--accent-orange); transition: gap .2s ease; }
    .service-more:hover { gap: 10px; }

    /* WHY BOOMY */
    .why-boomy { background: var(--bg-darkest); overflow: hidden; }
    .why-inner { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
    .why-left h2 { font-size: clamp(2.8rem,5.5vw,5rem); font-weight: 900; line-height: 1; letter-spacing: -.03em; }
    .why-left h2 .line-2 { background: linear-gradient(135deg,var(--accent-orange),var(--accent-yellow)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .why-left p { margin-top: 24px; color: var(--text-sec); line-height: 1.75; }
    .why-accent-bar { width: 60px; height: 4px; background: linear-gradient(90deg,var(--accent-orange),var(--accent-yellow)); border-radius: 2px; margin-top: 28px; }
    .why-bullets { display: flex; flex-direction: column; gap: 18px; }
    .why-bullet { display: flex; gap: 18px; align-items: flex-start; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--r-md); padding: 22px 24px; transition: border-color .3s ease,background .3s ease; }
    .why-bullet:hover { border-color: rgba(255,107,53,.3); background: rgba(255,107,53,.06); }
    .why-check { width: 28px; height: 28px; min-width: 28px; background: linear-gradient(135deg,var(--accent-orange),var(--accent-yellow)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .8rem; color: var(--bg-darkest); font-weight: 900; margin-top: 2px; }
    .why-bullet-content h3 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .why-bullet-content p { font-size: .88rem; color: var(--text-sec); line-height: 1.65; }

    /* BENTO GRID */
    .results { background: linear-gradient(180deg,var(--bg-darkest),var(--bg-deep)); }
    .bento-grid { display: grid; grid-template-columns: repeat(12,1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
    .bento-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--r-lg); padding: 36px; position: relative; overflow: hidden; transition: transform var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base); }
    .bento-card:hover { border-color: rgba(255,107,53,.3); transform: translateY(-4px); box-shadow: 0 16px 50px rgba(255,107,53,.12); }
    .bento-1 { grid-column: span 7; } .bento-2 { grid-column: span 5; } .bento-3,.bento-4,.bento-5 { grid-column: span 4; }
    .bento-label { font-size: .75rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
    .bento-metric { font-size: clamp(3rem,5vw,5rem); font-weight: 900; background: linear-gradient(135deg,var(--accent-orange),var(--accent-yellow)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; letter-spacing: -.03em; }
    .bento-desc { font-size: .9rem; color: var(--text-sec); margin-top: 10px; line-height: 1.65; }
    .bento-tag { display: inline-block; background: rgba(255,107,53,.15); border: 1px solid rgba(255,107,53,.25); color: var(--accent-orange); font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 4px 12px; border-radius: 100px; margin-top: 16px; }
    .bento-glow { position: absolute; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle,rgba(255,107,53,.2),transparent 70%); bottom: -35px; right: -35px; pointer-events: none; }

    /* PROCESS */
    .process { background: var(--bg-darkest); }
    .process-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; max-width: 1200px; margin: 0 auto; position: relative; }
    .process-steps::before { content: ""; position: absolute; top: 38px; left: calc(12.5% + 28px); right: calc(12.5% + 28px); height: 2px; background: linear-gradient(90deg,var(--accent-orange),var(--accent-yellow),var(--accent-orange)); z-index: 0; }
    .process-step { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 20px; position: relative; z-index: 1; }
    .step-number { width: 76px; height: 76px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,var(--accent-orange),var(--accent-yellow)); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 24px; box-shadow: 0 8px 30px rgba(255,107,53,.4); }
    .step-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }
    .step-desc { font-size: .87rem; color: var(--text-sec); line-height: 1.65; }

    /* CTA FORM (homepage only) */
    .btn-cta { background: linear-gradient(135deg,var(--accent-orange),var(--accent-yellow)); color: var(--bg-darkest); font-size: 1.05rem; padding: 17px 38px; box-shadow: 0 12px 40px rgba(255,107,53,.45); }
    .btn-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 22px 62px rgba(255,107,53,.6); }
    .cta-form { display: flex; gap: 12px; max-width: 520px; margin: 0 auto 12px; }
    .cta-input { flex: 1; padding: 16px 22px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); border-radius: 100px; color: #fff; font-size: .95rem; font-family: "Inter",sans-serif; outline: none; transition: border-color .2s ease,background .2s ease; }
    .cta-input::placeholder { color: rgba(255,255,255,.5); }
    .cta-input:focus { border-color: rgba(255,255,255,.65); background: rgba(255,255,255,.17); }
    .cta-note { font-size: .8rem; color: rgba(255,255,255,.55); margin-top: 8px; }
    .cta-trust { display: flex; align-items: center; justify-content: center; gap: 28px; margin-top: 44px; flex-wrap: wrap; }
    .cta-trust-item { display: flex; align-items: center; gap: 8px; font-size: .85rem; color: rgba(255,255,255,.7); }
    .cta-trust-icon { color: var(--accent-yellow); font-size: 1.1rem; }

    /* INTERNAL LINKS */
    .internal-links-section { padding: 60px 5%; background: var(--bg-darkest); border-top: 1px solid rgba(255,255,255,.06); }
    .internal-links-inner { max-width: 1200px; margin: 0 auto; }
    .internal-links-inner h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 20px; color: var(--text-sec); }
    .internal-links-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .internal-link { display: inline-block; padding: 8px 16px; border: 1px solid rgba(255,255,255,.12); border-radius: 100px; font-size: .85rem; color: rgba(255,255,255,.65); text-decoration: none; transition: border-color .2s,color .2s; }
    .internal-link:hover { border-color: var(--accent-orange); color: var(--accent-orange); }

    /* PAGE-SPECIFIC RESPONSIVE */
    @media (max-width: 1024px) {
      .services-grid { grid-template-columns: repeat(2,1fr); }
      .bento-1,.bento-2 { grid-column: span 12; }
      .bento-3,.bento-4,.bento-5 { grid-column: span 4; }
    }
    @media (max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 40px; }
      .hero-visual { height: 360px; order: -1; }
      .hero-sub { margin: 0 auto 40px; }
      .hero-buttons { justify-content: center; }
      .orbit-1-wrap,.orbit-ring.orbit-1 { width: 200px; height: 200px; }
      .orbit-2-wrap,.orbit-ring.orbit-2 { width: 280px; height: 280px; }
      .orbit-3-wrap,.orbit-ring.orbit-3 { width: 340px; height: 340px; }
      .orbit-1-wrap .ring-dot { transform: translate(-50%,-100px); }
      .orbit-2-wrap .ring-dot { transform: translate(-50%,-140px); }
      .orbit-3-wrap .ring-dot { transform: translate(-50%,-170px); }
      .planet { width: 130px; height: 130px; }
      .float-tag-3 { display: none; }
      .services-grid { grid-template-columns: 1fr; }
      .why-inner { grid-template-columns: 1fr; gap: 48px; }
      .why-left { text-align: center; }
      .why-accent-bar { margin: 28px auto 0; }
      .bento-3,.bento-4,.bento-5 { grid-column: span 12; }
      .process-steps { grid-template-columns: 1fr 1fr; gap: 36px; }
      .process-steps::before { display: none; }
      .cta-form { flex-direction: column; }
      .cta-input { border-radius: var(--r-md); }
      .btn-cta { border-radius: var(--r-md); width: 100%; justify-content: center; }
    }
    @media (max-width: 480px) {
      .process-steps { grid-template-columns: 1fr; }
      .cta-trust { gap: 16px; }
      .float-tag-1,.float-tag-2 { display: none; }
    }
  </style>'''

# Replace the entire <style>...</style> block
content = re.sub(
    r'  <style>.*?  </style>',
    new_style,
    content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done: index.html inline style reduced to page-specific CSS only')
