"""Daily sitemap updater — only includes local pages with datePublished <= today."""
import glob, re, os, sys
from datetime import date

TODAY = date.today().isoformat()
DOMAIN = "https://boomymarketing.com"
LOCAL_DIR = "local"

CORE_PAGES = [
    ("", 1.0), ("about", 0.9), ("services", 0.9), ("pricing", 0.8), ("contact", 0.8),
    ("services/seo", 0.8), ("services/geo", 0.8), ("services/google-ads", 0.8),
    ("services/meta-ads", 0.8), ("services/ai-automations", 0.8),
    ("services/ai-development", 0.8), ("services/web-design", 0.8),
    ("services/saas-products", 0.8), ("services/voice-ai", 0.8),
    ("services/email-marketing", 0.8), ("services/ai-outbound", 0.8),
    ("services/social-media", 0.8), ("services/content-marketing", 0.8),
    ("services/ppc", 0.8),
]

lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

for slug, pri in CORE_PAGES:
    if slug == "":
        candidates = ["index.html"]
    else:
        base = os.path.join(*slug.split("/"))
        candidates = [base + ".html", os.path.join(base, "index.html")]
    for c in candidates:
        if os.path.isfile(c):
            break
    else:
        continue
    loc = f"{DOMAIN}/{slug}" if slug else f"{DOMAIN}/"
    lines += [f"  <url>", f"    <loc>{loc}</loc>", f"    <priority>{pri}</priority>", f"    <lastmod>{TODAY}</lastmod>", f"  </url>"]

count = 0
for html_file in sorted(glob.glob(f"{LOCAL_DIR}/**/*.html", recursive=True)):
    with open(html_file, encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'"datePublished"\s*:\s*"([\d\-]+)"', content)
    pub = m.group(1)[:10] if m else TODAY
    if pub > TODAY:
        continue
    slug_name = os.path.relpath(html_file, LOCAL_DIR).replace(os.sep, "/")
    slug_name = slug_name[:-len("/index.html")] if slug_name.endswith("/index.html") else slug_name.replace(".html", "")
    lines += [f"  <url>", f"    <loc>{DOMAIN}/local/{slug_name}</loc>", f"    <priority>0.7</priority>", f"    <lastmod>{pub}</lastmod>", f"  </url>"]
    count += 1

lines.append("</urlset>")
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
print(f"sitemap.xml written: {count} local + core pages (today={TODAY})")
