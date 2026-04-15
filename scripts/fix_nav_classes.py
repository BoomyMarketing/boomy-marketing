#!/usr/bin/env python3
"""Fix nav CSS/JS class mismatches in all local pages."""
from pathlib import Path

ROOT = Path(__file__).parent.parent / "local"

replacements = [
    # CSS
    ('.site-nav {', '.navbar {'),
    ('.site-nav.scrolled {', '.navbar.scrolled {'),
    ('.nav-toggle {', '.nav-hamburger {'),
    ('.nav-toggle span {', '.nav-hamburger span {'),
    ('.nav-toggle.open span:nth-child(1)', '.nav-hamburger.open span:nth-child(1)'),
    ('.nav-toggle.open span:nth-child(2)', '.nav-hamburger.open span:nth-child(2)'),
    ('.nav-toggle.open span:nth-child(3)', '.nav-hamburger.open span:nth-child(3)'),
    ('.mobile-nav {', '.mobile-menu {'),
    ('.mobile-nav.open {', '.mobile-menu.open {'),
    ('.mobile-nav a {', '.mobile-menu a {'),
    ('.mobile-nav a:last-child {', '.mobile-menu a:last-child {'),
    ('.mobile-nav a:hover {', '.mobile-menu a:hover {'),
    ('.nav-toggle { display: flex; }', '.nav-hamburger { display: flex; }'),
    # JS
    ("getElementById('siteNav')", "getElementById('navbar')"),
    ("getElementById('navToggle')", "querySelector('.nav-hamburger')"),
    ("getElementById('mobileNav')", "getElementById('mobile-menu')"),
]

fixed = 0
for html_file in ROOT.rglob('index.html'):
    content = html_file.read_text(encoding='utf-8')
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        html_file.write_text(content, encoding='utf-8')
        fixed += 1

print(f"Fixed: {fixed} files")
