"""
inject_hub_pages.py
-------------------
For hub pages (marketing-services, seo-pricing, booking, projects, thank-you):
  1. Add /assets/css/main.css preload + link before </head>
  2. Add /assets/js/main.js defer before </head>
  3. Remove the shared inline hamburger <script> (now in main.js)
"""
import re, pathlib

BASE = pathlib.Path(__file__).parent.parent

INJECT = (
    '\n  <link rel="preload" href="/assets/css/main.css" as="style">\n'
    '  <link rel="stylesheet" href="/assets/css/main.css">\n'
    '  <script defer src="/assets/js/main.js"></script>'
)

PAGES = [
    'marketing-services/index.html',
    'seo-pricing/index.html',
    'booking/index.html',
    'projects/index.html',
    'thank-you/index.html',
    'about-us/index.html',
    'sitemap/index.html',
]

changed = 0
for rel in PAGES:
    path = BASE / rel
    if not path.exists():
        print(f'  MISS {rel}')
        continue

    original = path.read_text(encoding='utf-8')
    result = original

    # 1. Inject before </head>
    if '/assets/css/main.css' not in result:
        result = result.replace('</head>', INJECT + '\n</head>', 1)

    # 2. Remove shared inline hamburger IIFE script
    result = re.sub(
        r'<script>\n\(function\(\)\{.*?\}(?:\(\)|\.call\(this\))\);\n</script>',
        '',
        result, flags=re.DOTALL
    )
    # Also handle on one line
    result = re.sub(
        r'<script>\(function\(\)\{.*?\}\(\)\);</script>',
        '',
        result, flags=re.DOTALL
    )

    if result != original:
        path.write_text(result, encoding='utf-8')
        orig_lines   = original.count('\n')
        result_lines = result.count('\n')
        print(f'  OK  {rel}: {orig_lines} -> {result_lines} lines')
        changed += 1
    else:
        print(f'  SKIP {rel}')

print(f'\nDone. {changed} files updated.')
