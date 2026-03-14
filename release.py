"""
release.py — Daily publish schedule for boomy (https://boomymarketing.com)
Runs via GitHub Actions (.github/workflows/daily-release.yml)

Logic:
  - Schedule start: 14 days before TODAY (gives initial batch published)
  - 5 pages/day after that
  - Updates robots.txt (Allow published pages, Disallow /local/ for rest)
  - Updates sitemap.xml (only published pages listed)
  - HTML files are NOT modified
"""

import json
import os
import re
import subprocess
import urllib.request
from datetime import date, timedelta
from pathlib import Path

TODAY = date.today()
PAGES_PER_DAY = 5
LAUNCH_DATE  = date(2026, 2, 26)  # fixed — DO NOT change after first run
DOMAIN = "https://boomymarketing.com"
SITE_ROOT = Path(__file__).parent.resolve()
INDEXNOW_KEY = "0af09ac783bf4a66a867cf66d3f7f01a"


def get_local_pages():
    pages = []
    local_dir = SITE_ROOT / "local"
    for root, dirs, files in os.walk(local_dir):
        dirs.sort()
        for fname in sorted(files):
            if fname.endswith(".html"):
                pages.append(Path(root) / fname)
    return sorted(pages)


def assign_dates(pages):
    start = LAUNCH_DATE
    schedule = {}
    for i, page in enumerate(pages):
        day_offset = i // PAGES_PER_DAY
        schedule[page] = start + timedelta(days=day_offset)
    return schedule


def update_robots(schedule):
    published = {p: d for p, d in schedule.items() if d <= TODAY}

    allowed_paths = set()
    for page in published:
        rel = page.relative_to(SITE_ROOT).as_posix().replace("\\", "/")
        parts = rel.split("/")
        if len(parts) >= 3:
            allowed_paths.add("/" + "/".join(parts[:-1]) + "/")

    lines = [
        "User-agent: *",
        "# Published local pages — Allow before Disallow",
    ]
    for path in sorted(allowed_paths):
        lines.append(f"Allow: {path}")
    lines += [
        "",
        "# Block unpublished local pages",
        "Disallow: /local/",
        "Disallow: /admin/",
        "Disallow: /private/",
        "",
        "# AI crawlers",
        "User-agent: GPTBot",
        "Allow: /",
        "",
        "User-agent: ClaudeBot",
        "Allow: /",
        "",
        "User-agent: Google-Extended",
        "Allow: /",
        "",
        "User-agent: PerplexityBot",
        "Allow: /",
        "",
        "User-agent: anthropic-ai",
        "Allow: /",
        "",
        f"Sitemap: {DOMAIN}/sitemap.xml",
    ]

    with open(SITE_ROOT / "robots.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    return len(allowed_paths)


def get_core_url_blocks():
    sitemap_path = SITE_ROOT / "sitemap.xml"
    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()
    blocks = re.findall(r"<url>.*?</url>", content, re.DOTALL)
    return [b for b in blocks if "/local/" not in b]


def update_sitemap(schedule):
    published = {p: d for p, d in schedule.items() if d <= TODAY}
    core_blocks = get_core_url_blocks()

    local_blocks = []
    for page, pub_date in sorted(published.items(), key=lambda x: x[1]):
        rel = page.relative_to(SITE_ROOT).as_posix().replace("\\", "/")
        url_path = rel.replace("/index.html", "")
        url = f"{DOMAIN}/{url_path}"
        local_blocks.append(f"""  <url>
    <loc>{url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>{pub_date.isoformat()}</lastmod>
  </url>""")

    sitemap = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Core Pages -->
'''
    sitemap += "\n".join(core_blocks)
    sitemap += "\n\n  <!-- Published Local Pages -->\n"
    sitemap += "\n".join(local_blocks)
    sitemap += "\n</urlset>\n"

    with open(SITE_ROOT / "sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    return len(local_blocks)


if __name__ == "__main__":
    pages = get_local_pages()
    schedule = assign_dates(pages)
    published = {p: d for p, d in schedule.items() if d <= TODAY}
    future = {p: d for p, d in schedule.items() if d > TODAY}

    print(f"Date: {TODAY} | Pages/day: {PAGES_PER_DAY}")
    print(f"Local pages: {len(pages)} total | {len(published)} live | {len(future)} queued")

    allowed = update_robots(schedule)
    print(f"robots.txt: {allowed} paths allowed")

    in_sitemap = update_sitemap(schedule)
    print(f"sitemap.xml: {in_sitemap} local URLs")

    # IndexNow — notify Bing of newly published pages
    yesterday = TODAY - timedelta(days=1)
    new_today = [p for p, d in schedule.items() if d == TODAY]
    if new_today:
        urls = []
        for page in new_today:
            rel = page.relative_to(SITE_ROOT).as_posix().replace("\\", "/")
            url_path = rel.replace("/index.html", "")
            urls.append(f"{DOMAIN}/{url_path}")
        payload = {
            "host": DOMAIN.replace("https://", ""),
            "key": INDEXNOW_KEY,
            "keyLocation": f"{DOMAIN}/{INDEXNOW_KEY}.txt",
            "urlList": urls
        }
        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                "https://www.bing.com/indexnow",
                data=data,
                headers={"Content-Type": "application/json; charset=utf-8"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                print(f"IndexNow: submitted {len(urls)} URLs (HTTP {resp.status})")
        except Exception as ex:
            print(f"IndexNow: error — {ex}")

    # Commit if anything changed
    result = subprocess.run(
        ["git", "diff", "--quiet", "robots.txt", "sitemap.xml"],
        cwd=str(SITE_ROOT)
    )
    if result.returncode != 0:
        subprocess.run(["git", "add", "robots.txt", "sitemap.xml"], cwd=str(SITE_ROOT), check=True)
        subprocess.run(
            ["git", "commit", "-m",
             f"seo: release {len(published)} pages live ({TODAY}, {PAGES_PER_DAY}/day)"],
            cwd=str(SITE_ROOT), check=True
        )
        print("Committed changes.")
    else:
        print("No changes to commit.")
