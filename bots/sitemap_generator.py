#!/usr/bin/env python3
"""
MovixWires - Autonomous Search Engine Sitemap & Indexing Rebuilder
Scans all root HTML pages, generated news articles, and catalog JSON files to generate
a strictly compliant sitemap.xml and sitemap.html with absolute URLs for instant Google
Search Console indexing.
"""

import os
import sys
import json
import datetime
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [Sitemap-Bot] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("sitemap_generator")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
NEWS_DIR = BASE_DIR / "news"

def get_base_url() -> str:
    """
    Computes absolute URL based on canonical custom domain movixwire.world
    or environment override.
    """
    custom_url = os.environ.get("SITE_URL", "").strip().rstrip("/")
    if custom_url:
        return custom_url

    # Canonical primary production domain requested by publisher
    return "https://movixwire.world"

def build_sitemaps():
    logger.info("=== MovixWires Autonomous Sitemap Generation Initiated ===")
    base_url = get_base_url()
    logger.info(f"Targeting Canonical Absolute Base URL: {base_url}")

    today_str = datetime.date.today().strftime("%Y-%m-%d")

    # Core portal entrypoints
    core_pages = [
        {"loc": f"{base_url}/", "changefreq": "daily", "priority": "1.0", "title": "Home — MovixWire Global Portal"},
        {"loc": f"{base_url}/movies.html", "changefreq": "daily", "priority": "0.9", "title": "Movies & Web Series Directory"},
        {"loc": f"{base_url}/tvshows.html", "changefreq": "daily", "priority": "0.9", "title": "Television Shows & Broadcasts"},
        {"loc": f"{base_url}/people.html", "changefreq": "weekly", "priority": "0.8", "title": "Actors, Directors & Creators"},
        {"loc": f"{base_url}/awards.html", "changefreq": "weekly", "priority": "0.8", "title": "Oscars, Cannes & Film Festivals"},
        {"loc": f"{base_url}/news.html", "changefreq": "hourly", "priority": "1.0", "title": "Real-Time Entertainment News Wire"},
        {"loc": f"{base_url}/earn-online.html", "changefreq": "daily", "priority": "1.0", "title": "EARN ONLINE — 1000+ Verified Blueprints"}
    ]

    # Discover generated news articles in news/
    article_pages = []
    if NEWS_DIR.exists():
        for html_file in sorted(NEWS_DIR.glob("*.html"), reverse=True):
            fname = html_file.name
            clean_title = fname.replace(".html", "").replace("-", " ").title()
            article_pages.append({
                "loc": f"{base_url}/news/{fname}",
                "changefreq": "monthly",
                "priority": "0.7",
                "title": clean_title,
                "lastmod": today_str
            })

    # Read news from data/news.json if present
    news_json_path = DATA_DIR / "news.json"
    if news_json_path.exists():
        try:
            with open(news_json_path, "r", encoding="utf-8") as f:
                news_items = json.load(f)
                for item in news_items:
                    slug = item.get("slug")
                    date = item.get("date", today_str)
                    if slug:
                        url = f"{base_url}/news/{slug}.html"
                        if not any(p["loc"] == url for p in article_pages):
                            article_pages.append({
                                "loc": url,
                                "changefreq": "monthly",
                                "priority": "0.7",
                                "title": item.get("title", slug),
                                "lastmod": date
                            })
        except Exception as e:
            logger.error(f"Error reading {news_json_path}: {e}")

    # Index all 1000+ Earn Online guides from data/earn_guides.json
    earn_pages = []
    earn_json_path = DATA_DIR / "earn_guides.json"
    if earn_json_path.exists():
        try:
            with open(earn_json_path, "r", encoding="utf-8") as f:
                earn_items = json.load(f)
                for g in earn_items:
                    guide_id = g.get("id")
                    slug = g.get("slug", guide_id)
                    title = g.get("title", "Earn Online Blueprint")
                    earn_pages.append({
                        "loc": f"{base_url}/index.html?type=earn&amp;id={guide_id}",
                        "changefreq": "weekly",
                        "priority": "0.85",
                        "title": f"EARN ONLINE: {title}",
                        "lastmod": today_str
                    })
        except Exception as e:
            logger.error(f"Error reading {earn_json_path}: {e}")

    total_urls = core_pages + article_pages + earn_pages
    logger.info(f"Total indexing targets identified: {len(total_urls)} ({len(earn_pages)} Earn Online blueprints)")

    # 1. Generate XML Sitemap
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for page in total_urls:
        lastmod = page.get("lastmod", today_str)
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{page['loc']}</loc>")
        xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
        xml_lines.append(f"    <changefreq>{page['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{page['priority']}</priority>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")

    xml_content = "\n".join(xml_lines)
    sitemap_xml_path = BASE_DIR / "sitemap.xml"
    sitemap_xml_path.write_text(xml_content, encoding="utf-8")
    logger.info(f"Successfully generated {sitemap_xml_path.name}")

    # 2. Generate Human-Readable HTML Sitemap
    html_lines = [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '  <link rel="icon" type="image/svg+xml" href="favicon.svg">',
        '  <link rel="apple-touch-icon" href="favicon.svg">',
        "  <title>Sitemap & Directory Index — MovixWires Global Press Wire</title>",
        '  <meta name="robots" content="index, follow">',
        '  <link rel="stylesheet" href="assets/css/style.css">',
        "</head>",
        '<body class="bg-slate-50 text-slate-900 font-sans">',
        '  <header class="border-b border-slate-200 bg-white px-6 py-4">',
        '    <div class="max-w-4xl mx-auto flex items-center justify-between">',
        '      <a href="index.html" class="text-xl font-bold font-serif">MovixWires Sitemap Index</a>',
        f'      <span class="text-xs text-slate-500">Updated: {today_str}</span>',
        "    </div>",
        "  </header>",
        '  <main class="max-w-4xl mx-auto px-6 py-8">',
        '    <h1 class="text-2xl font-bold font-serif mb-6">Complete Portal Registry</h1>',
        '    <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Core Sections</h2>',
        '    <ul class="space-y-2 mb-8">'
    ]

    for p in core_pages:
        html_lines.append(f'      <li><a href="{p["loc"]}" class="text-amber-600 hover:underline font-medium">{p["title"]}</a> <span class="text-xs text-slate-400">({p["loc"]})</span></li>')

    html_lines.append('    </ul>')
    html_lines.append('    <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">News & Wire Dispatches</h2>')
    html_lines.append('    <ul class="space-y-2">')

    for p in article_pages:
        html_lines.append(f'      <li><a href="{p["loc"]}" class="text-slate-700 hover:text-amber-600 hover:underline">{p["title"]}</a> <span class="text-xs text-slate-400">({p["lastmod"]})</span></li>')

    html_lines.extend([
        "    </ul>",
        "  </main>",
        '  <footer class="border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">',
        f"    <p>© {datetime.date.today().year} MovixWires Global Press Wire. Automated Search Engine Sitemap Protocol 0.9</p>",
        "  </footer>",
        "</body>",
        "</html>"
    ])

    html_content = "\n".join(html_lines)
    sitemap_html_path = BASE_DIR / "sitemap.html"
    sitemap_html_path.write_text(html_content, encoding="utf-8")
    logger.info(f"Successfully generated {sitemap_html_path.name}")
    logger.info("=== MovixWires Autonomous Sitemap Generation Completed ===")

if __name__ == "__main__":
    build_sitemaps()
