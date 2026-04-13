"""
inject_service_pages.py
-----------------------
For each service/*.html page:
  1. Add /assets/css/main.css  preload + link before </head>
  2. Add /assets/js/main.js    defer script   before </head>
  3. Replace the shared inline <script> with only the toggleFaq function
     (all starfield/nav/hamburger code is now in main.js)
"""
import re, pathlib

BASE = pathlib.Path(__file__).parent.parent
SERVICES_DIR = BASE / 'services'

INJECT = (
    '  <link rel="preload" href="/assets/css/main.css" as="style">\n'
    '  <link rel="stylesheet" href="/assets/css/main.css">\n'
    '  <script defer src="/assets/js/main.js"></script>\n'
)

# The only page-specific JS in service pages is the toggleFaq accordion
FAQ_SCRIPT = (
    '\n<script>\n'
    '  function toggleFaq(btn) {\n'
    '    const a = btn.nextElementSibling;\n'
    '    const isOpen = a.classList.contains(\'open\');\n'
    '    document.querySelectorAll(\'.faq-a.open\').forEach(el => el.classList.remove(\'open\'));\n'
    '    document.querySelectorAll(\'.faq-q.open\').forEach(el => el.classList.remove(\'open\'));\n'
    '    if (!isOpen) { a.classList.add(\'open\'); btn.classList.add(\'open\'); }\n'
    '  }\n'
    '</script>'
)

def process(html: str) -> str:
    # 1. Inject external assets before </head>
    if '/assets/css/main.css' not in html:
        html = html.replace('</head>', INJECT + '</head>', 1)

    # 2. Replace entire bottom <script>...</script> with just toggleFaq
    #    The block starts with either "// Starfield" or "const canvas="
    html = re.sub(
        r'\n<script>\n  // Starfield.*?</script>',
        FAQ_SCRIPT,
        html, flags=re.DOTALL
    )
    # Some pages use a slightly different opening line
    html = re.sub(
        r'\n<script>\n  const canvas=document\.getElementById\(\'starfield\'\).*?</script>',
        FAQ_SCRIPT,
        html, flags=re.DOTALL
    )

    return html

changed = 0
for path in sorted(SERVICES_DIR.glob('*.html')):
    original = path.read_text(encoding='utf-8')
    result = process(original)
    if result != original:
        path.write_text(result, encoding='utf-8')
        orig_lines  = original.count('\n')
        result_lines = result.count('\n')
        print(f'  OK  {path.name}: {orig_lines} -> {result_lines} lines')
        changed += 1
    else:
        print(f'  SKIP {path.name}')

print(f'\nDone. {changed} files updated.')
