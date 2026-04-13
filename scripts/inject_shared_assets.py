"""
inject_shared_assets.py
-----------------------
For each target HTML page:
  1. Add /assets/css/main.css  preload + link before </head>
  2. Add /assets/js/main.js    defer script   before </head>
  3. Replace the shared inline <script> with only page-specific code.
"""
import re, pathlib

BASE = pathlib.Path(__file__).parent.parent

INJECT = (
    '  <link rel="preload" href="/assets/css/main.css" as="style">\n'
    '  <link rel="stylesheet" href="/assets/css/main.css">\n'
    '  <script defer src="/assets/js/main.js"></script>\n'
)

# ---------------------------------------------------------------------------
# about.html — all inline JS is shared; remove entire <script> block
# ---------------------------------------------------------------------------
def process_about(html: str) -> str:
    # Remove the entire bottom <script>…</script> block
    html = re.sub(
        r'\n<script>\n  // Starfield.*?</script>',
        '',
        html, flags=re.DOTALL
    )
    return html

# ---------------------------------------------------------------------------
# contact.html — keep only the contact form submit handler
# ---------------------------------------------------------------------------
def process_contact(html: str) -> str:
    # Build the replacement: only the form handler
    form_handler = (
        '\n<script>\n'
        "  document.getElementById('contactForm').addEventListener('submit', async function(e) {\n"
        "    e.preventDefault();\n"
        "    var btn = this.querySelector('button[type=\"submit\"]');\n"
        "    var orig = btn.textContent;\n"
        "    btn.textContent = 'Sending...';\n"
        "    btn.disabled = true;\n"
        "\n"
        "    var data = {};\n"
        "    new FormData(this).forEach(function(v, k) { data[k] = v; });\n"
        "\n"
        "    try {\n"
        "      var res = await fetch('/api/contact', {\n"
        "        method: 'POST',\n"
        "        headers: { 'Content-Type': 'application/json' },\n"
        "        body: JSON.stringify(data)\n"
        "      });\n"
        "      if (res.ok) {\n"
        "        this.style.display = 'none';\n"
        "        var s = document.getElementById('successMsg');\n"
        "        if (s) { s.style.display = 'block'; s.classList.add('visible'); }\n"
        "        else { this.insertAdjacentHTML('afterend', '<p style=\"color:#4caf50;font-size:1.1rem;padding:20px 0\">Thank you! We will be in touch within 1 business day.</p>'); }\n"
        "      } else {\n"
        "        btn.textContent = 'Error — try again';\n"
        "        btn.disabled = false;\n"
        "      }\n"
        "    } catch(err) {\n"
        "      btn.textContent = 'Error — try again';\n"
        "      btn.disabled = false;\n"
        "    }\n"
        "  }.bind(document.getElementById('contactForm')));\n"
        '</script>'
    )
    html = re.sub(
        r'\n<script>\n  const canvas=document\.getElementById\(\'starfield\'\).*?</script>',
        form_handler,
        html, flags=re.DOTALL
    )
    return html

# ---------------------------------------------------------------------------
# services.html — all inline JS is shared; remove entire <script> block
# ---------------------------------------------------------------------------
def process_services(html: str) -> str:
    html = re.sub(
        r'\n<script>\n  const canvas=document\.getElementById\(\'starfield\'\).*?</script>',
        '',
        html, flags=re.DOTALL
    )
    return html

# ---------------------------------------------------------------------------
# pricing.html — keep only FAQ toggle
# ---------------------------------------------------------------------------
def process_pricing(html: str) -> str:
    faq_toggle = (
        "\n<script>\n"
        "  document.querySelectorAll('.faq-q').forEach(q=>{"
        "q.addEventListener('click',()=>{"
        "q.parentElement.classList.toggle('open')})});\n"
        "</script>"
    )
    html = re.sub(
        r'\n<script>\n  const canvas=document\.getElementById\(\'starfield\'\).*?</script>',
        faq_toggle,
        html, flags=re.DOTALL
    )
    return html

# ---------------------------------------------------------------------------
# Common: inject external CSS + JS before </head>
# ---------------------------------------------------------------------------
def inject_head(html: str) -> str:
    if '/assets/css/main.css' in html:
        return html  # already injected
    return html.replace('</head>', INJECT + '</head>', 1)

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Trust pages — all inline JS is shared; remove entire <script> block
# ---------------------------------------------------------------------------
def process_trust(html: str) -> str:
    # Pattern: <script>\n  const canvas = document.getElementById('starfield');...
    html = re.sub(
        r'\n<script>\n  const canvas = document\.getElementById\(\'starfield\'\).*?</script>',
        '',
        html, flags=re.DOTALL
    )
    return html

PAGES = {
    'about.html':          process_about,
    'contact.html':        process_contact,
    'services.html':       process_services,
    'pricing.html':        process_pricing,
    'privacy-policy.html': process_trust,
    'terms.html':          process_trust,
    'cookie-policy.html':  process_trust,
}

for filename, processor in PAGES.items():
    path = BASE / filename
    original = path.read_text(encoding='utf-8')
    result = inject_head(processor(original))
    if result == original:
        print(f'  SKIP (no change): {filename}')
    else:
        path.write_text(result, encoding='utf-8')
        orig_lines  = original.count('\n')
        result_lines = result.count('\n')
        print(f'  OK  {filename}: {orig_lines} -> {result_lines} lines')

print('Done.')
