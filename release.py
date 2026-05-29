"""
release.py — Sitemap + robots maintenance for boomy (https://boomymarketing.com)
Runs via GitHub Actions (.github/workflows/daily-release.yml)

POST-MIGRATION behavior (URL structure is now /{service}/{city}/, not /local/):
  - All pages are already published (datePublished set in each page's schema).
  - This script is IDEMPOTENT: it preserves the existing sitemap.xml URL set,
    drops any stray /local/ URLs, refreshes <lastmod> from each page's
    datePublished, and rewrites a clean robots.txt (Allow: /).
  - It NEVER adds /local/ URLs back. HTML files are not modified.
  - Pings IndexNow + GSC for pages whose datePublished == today (usually none).
"""

import json
import os
import re
import subprocess
import urllib.request
from datetime import date, timedelta
from pathlib import Path

TODAY = date.today()
DOMAIN = "https://boomymarketing.com"
SITE_ROOT = Path(__file__).parent.resolve()
INDEXNOW_KEY = "0af09ac783bf4a66a867cf66d3f7f01a"

ROBOTS = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: {domain}/sitemap.xml
"""


def url_to_html(url):
    """Map a sitemap URL to its HTML file path on disk (clean-URL aware)."""
    path = url.replace(DOMAIN, "").strip("/")
    if not path:
        candidates = [SITE_ROOT / "index.html"]
    else:
        candidates = [SITE_ROOT / path / "index.html", SITE_ROOT / (path + ".html")]
    for c in candidates:
        if c.exists():
            return c
    return None


def read_date(html_path):
    try:
        html = html_path.read_text(encoding="utf-8")
        m = re.search(r'"datePublished":\s*"(\d{4}-\d{2}-\d{2})"', html)
        if m:
            return m.group(1)
    except Exception:
        pass
    return None


def refresh_sitemap():
    """Preserve existing URL set, drop /local/, refresh lastmod from HTML."""
    sm_path = SITE_ROOT / "sitemap.xml"
    content = sm_path.read_text(encoding="utf-8")
    blocks = re.findall(r"<url>.*?</url>", content, re.DOTALL)

    kept = []
    today_urls = []
    for b in blocks:
        loc_m = re.search(r"<loc>([^<]+)</loc>", b)
        if not loc_m:
            continue
        url = loc_m.group(1).strip()
        if "/local/" in url:          # never keep legacy URLs
            continue
        html_path = url_to_html(url)
        if html_path:
            d = read_date(html_path)
            if d:
                if "<lastmod>" in b:
                    b = re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{d}</lastmod>", b)
                else:
                    b = b.replace("</url>", f"  <lastmod>{d}</lastmod>\n  </url>")
                if d == TODAY.isoformat():
                    today_urls.append(url)
        kept.append(b)

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'
        + "\n".join(kept)
        + "\n</urlset>\n"
    )
    sm_path.write_text(sitemap, encoding="utf-8")
    return len(kept), today_urls


if __name__ == "__main__":
    (SITE_ROOT / "robots.txt").write_text(ROBOTS.format(domain=DOMAIN), encoding="utf-8")
    print("robots.txt: clean Allow: /")

    count, new_today = refresh_sitemap()
    print(f"sitemap.xml: {count} URLs (0 /local/)")

    # IndexNow — notify Bing of pages published today (usually none post-migration)
    if new_today:
        payload = {
            "host": DOMAIN.replace("https://", ""),
            "key": INDEXNOW_KEY,
            "keyLocation": f"{DOMAIN}/{INDEXNOW_KEY}.txt",
            "urlList": new_today,
        }
        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                "https://www.bing.com/indexnow",
                data=data,
                headers={"Content-Type": "application/json; charset=utf-8"},
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                print(f"IndexNow: submitted {len(new_today)} URLs (HTTP {resp.status})")
        except Exception as ex:
            print(f"IndexNow: error — {ex}")

    # GSC Sitemaps API — resubmit sitemap to Google (CI only, needs secret)
    gsc_key_env = os.environ.get("GSC_SERVICE_ACCOUNT_KEY")
    gsc_key_file = SITE_ROOT / "gsc-key.json"
    if gsc_key_env:
        gsc_key_file.write_text(gsc_key_env, encoding="utf-8")
    if gsc_key_file.exists():
        try:
            from google.oauth2 import service_account
            import google.auth.transport.requests as google_requests
            import urllib.parse
            creds = service_account.Credentials.from_service_account_file(
                str(gsc_key_file),
                scopes=["https://www.googleapis.com/auth/webmasters"],
            )
            creds.refresh(google_requests.Request())
            token = creds.token
            site_url = urllib.parse.quote(DOMAIN + "/", safe="")
            sitemap_url = urllib.parse.quote(f"{DOMAIN}/sitemap.xml", safe="")
            api_url = f"https://www.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps/{sitemap_url}"
            req = urllib.request.Request(api_url, data=b"", method="PUT")
            req.add_header("Authorization", f"Bearer {token}")
            req.add_header("Content-Length", "0")
            with urllib.request.urlopen(req, timeout=15) as resp:
                print(f"GSC sitemap submit: HTTP {resp.status}")
        except ImportError:
            print("GSC: google-auth not installed, skipping")
        except Exception as ex:
            print(f"GSC sitemap submit error: {ex}")
        finally:
            if gsc_key_env and gsc_key_file.exists():
                gsc_key_file.unlink()

    # Commit only inside CI (local runs leave commits to the developer)
    if os.environ.get("GITHUB_ACTIONS"):
        result = subprocess.run(
            ["git", "diff", "--quiet", "robots.txt", "sitemap.xml"], cwd=str(SITE_ROOT)
        )
        if result.returncode != 0:
            subprocess.run(["git", "add", "robots.txt", "sitemap.xml"], cwd=str(SITE_ROOT), check=True)
            subprocess.run(
                ["git", "commit", "-m", f"seo: refresh sitemap + robots ({TODAY})"],
                cwd=str(SITE_ROOT), check=True,
            )
            print("Committed changes.")
        else:
            print("No changes to commit.")
