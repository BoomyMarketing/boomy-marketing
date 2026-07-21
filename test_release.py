import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch

import release


class SitemapReleaseTests(unittest.TestCase):
    def test_refresh_normalizes_deduplicates_and_filters_noncanonical_urls(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "page").mkdir()
            (root / "page" / "index.html").write_text(
                '<script type="application/ld+json">'
                '{"datePublished":"2026-01-02"}</script>',
                encoding="utf-8",
            )
            (root / "vercel.json").write_text(
                '{"redirects":[{"source":"/old","destination":"/page"}]}',
                encoding="utf-8",
            )
            (root / "sitemap.xml").write_text(
                """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://boomymarketing.com/page/</loc><lastmod>2020-01-01</lastmod></url>
<url><loc>https://boomymarketing.com/page</loc><lastmod>2020-01-01</lastmod></url>
<url><loc>https://boomymarketing.com/old</loc><lastmod>2020-01-01</lastmod></url>
<url><loc>https://boomymarketing.com/unpublished</loc><lastmod>2020-01-01</lastmod></url>
</urlset>
""",
                encoding="utf-8",
            )

            with (
                patch.object(release, "SITE_ROOT", root),
                patch.object(release, "UNPUBLISHED_PATHS", {"/unpublished"}),
                patch.object(
                    release,
                    "REQUIRED_SITEMAP_PATHS",
                    {"/required": "2026-02-03"},
                ),
            ):
                count, today_urls = release.refresh_sitemap()

            tree = ET.parse(root / "sitemap.xml")
            namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            entries = {
                item.findtext("s:loc", namespaces=namespace): item.findtext(
                    "s:lastmod", namespaces=namespace
                )
                for item in tree.getroot().findall("s:url", namespace)
            }

            self.assertEqual(count, 2)
            self.assertEqual(today_urls, [])
            self.assertEqual(
                entries,
                {
                    "https://boomymarketing.com/page": "2026-01-02",
                    "https://boomymarketing.com/required": "2026-02-03",
                },
            )


if __name__ == "__main__":
    unittest.main()
