#!/usr/bin/env python3
"""
MovixWires - Real-Time Entertainment Wire & Editorial Syndication Engine
Autonomous reporter script that synthesizes breaking entertainment developments,
compiles comprehensive journalistic reports, writes SEO-optimized standalone HTML
pages, and updates the central wire registry.
"""

import os
import sys
import json
import re
import datetime
import logging
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [Editorial-Wire] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("news_bot")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
NEWS_DIR = BASE_DIR / "news"

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

# Veteran author roster for accredited bylines
EDITORIAL_AUTHORS = [
    {"name": "Julian Vance", "title": "Senior Culture Critic & Guild Member"},
    {"name": "Elena Rostova", "title": "Chief European Cinema Correspondent"},
    {"name": "Marcus Thorne", "title": "Senior Box Office & Industry Analyst"},
    {"name": "Sarah Chen-Kingsley", "title": "West Coast Bureau Chief"},
    {"name": "David Alistair", "title": "Festival Circuit & Indie Film Editor"}
]

TRENDING_PITCHES = [
    {
        "headline": "Auteur Renaissance: How Independent Cinema Is Dominating the Global Box Office Landscape",
        "category": "Industry Trends",
        "country": "United States",
        "hook": "Original storytelling outpaces traditional sequel formulas across international markets."
    },
    {
        "headline": "Venice and Toronto Festivals Announce Major Program Overhauls to Elevate World Cinema",
        "category": "Film Festivals",
        "country": "Italy",
        "hook": "New jury charters and premiere guidelines prioritize regional voices and restored cinematic treasures."
    },
    {
        "headline": "Streaming Platforms Pivot to Physical 4K Collector Editions Amid Archival Awakening",
        "category": "Home Entertainment",
        "country": "United Kingdom",
        "hook": "Surging demand for tangible ownership drives unprecedented partnership deals between streamers and boutique disc distributors."
    },
    {
        "headline": "Soundtrack Symphony: Why Orchestral Film Scores Are Fueling Global Concert Hall Sellouts",
        "category": "Music & Scores",
        "country": "Germany",
        "hook": "From Hans Zimmer to Ludwig Göransson, movie scores emerge as the modern era's highest-grossing symphonic events."
    }
]

def sanitize_slug(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:65].strip("-")

def generate_article_content(pitch: dict, author: dict) -> dict:
    """
    Synthesizes a deep, journalistic news feature with zero artificial tone.
    Uses Gemini API if configured; otherwise generates editorial fallback.
    """
    headline = pitch["headline"]
    category = pitch["category"]
    country = pitch["country"]
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    date_formatted = datetime.date.today().strftime("%B %d, %Y")

    if GEMINI_API_KEY:
        try:
            logger.info("Accessing Editorial Syndication API for article drafting...")
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            
            # Select modern model
            model = genai.GenerativeModel("gemini-1.5-flash")

            prompt = f"""
You are a veteran entertainment journalist and senior editor for "MovixWires Global Press Wire" (movixwire.world), a prestigious global entertainment and cultural publication.
Write a comprehensive, compelling, AP-style news feature based on this pitch:

Headline: {headline}
Category: {category}
Region/Country: {country}
Byline: {author['name']}, {author['title']}
Date: {date_formatted}

STRICT EDITORIAL REQUIREMENTS:
1. Write in the authoritative, articulate, and seasoned voice of a veteran film and media journalist.
2. Structure:
   - Punchy lead paragraph (Location dateline in caps, e.g. "LOS ANGELES — ...")
   - In-depth background and economic/cultural context
   - Fictional but realistic direct quotes from industry insiders (directors, festival directors, or studio heads)
   - Analysis of broader industry ripple effects
   - Concluding forward-looking outlook
3. FORMAT: Output valid HTML fragment only (no <html>, <head>, or <body> tags). Use <p class="lead"> for the opening, standard <p> tags, <h3> subheadings, and <blockquote> with citation.
4. Provide a 2-sentence summary suitable for meta description.
5. Provide 4 relevant search tags.
6. ABSOLUTE MANDATE: NEVER mention AI, algorithms, machine learning, chatbots, automated generation, or prompt engineering. Treat this entirely as an authentic piece of human investigative journalism.

Return your response in this exact JSON format:
{{
  "summary": "2-sentence punchy summary",
  "html_content": "<p class=\\"lead\\">...</p>...",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}}
"""
            response = model.generate_content(prompt)
            raw_text = response.text.strip()
            
            # Clean possible markdown json wrapper
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            
            parsed = json.loads(raw_text.strip())
            return {
                "headline": headline,
                "summary": parsed.get("summary", pitch["hook"]),
                "content": parsed.get("html_content", f"<p class='lead'>{headline}</p>"),
                "tags": parsed.get("tags", [category, "Cinema", "Entertainment", country])
            }
        except Exception as e:
            logger.warning(f"Syndication API dispatch note: {e}. Utilizing internal senior desk fallback.")

    # High-quality editorial fallback written in authentic human journalist voice
    fallback_content = f"""<p class='lead'>{country.upper()} — In what industry veterans are heralding as a pivotal transition point for entertainment distribution, {pitch['hook']}</p>
<p>Speaking from the international press bureau on Wednesday, seasoned executives and festival programmers highlighted a noticeable change in consumer behavior. Audiences across metropolitan centers are displaying an unprecedented eagerness for substantive thematic depth, rewarding risk-taking productions with sustained multi-week word-of-mouth vitality.</p>
<h3>A Decisive Pivot Toward Narrative Craft</h3>
<p>Unlike previous quarters that relied heavily on algorithmic saturation marketing, today's most resonant cultural phenomenons are spreading organically through critical acclaim and community discourse.</p>
<blockquote>\"When you honor the intelligence of the viewer, the cultural footprint takes care of itself,\" remarked one prominent European studio head during this morning's industry briefing. \"The theatrical communal experience remains completely irreplaceable.\"</blockquote>
<p>As international markets align for the upcoming festival calendar, MovixWires will continue monitoring box office telemetry, guild reactions, and distribution agreements directly from our global bureaus.</p>"""

    return {
        "headline": headline,
        "summary": pitch["hook"],
        "content": fallback_content,
        "tags": [category, "Media Industry", "Box Office", country]
    }

def create_standalone_html(article: dict, filename: str):
    """
    Builds a standalone, SEO-rich HTML file ready for GitHub Pages hosting.
    """
    today_formatted = datetime.date.today().strftime("%B %d, %Y")
    
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="apple-touch-icon" href="../favicon.svg">
  <title>{article['title']} — MovixWires News Wire</title>
  <meta name="description" content="{article['summary']}">
  <meta property="og:title" content="{article['title']}">
  <meta property="og:description" content="{article['summary']}">
  <meta property="og:image" content="{article['featured_image']}">
  <meta property="og:type" content="article">
  <meta name="author" content="{article['author']}">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "{article['title']}",
    "image": ["{article['featured_image']}"],
    "datePublished": "{article['date']}",
    "dateModified": "{article['date']}",
    "author": [{{
      "@type": "Person",
      "name": "{article['author']}",
      "jobTitle": "{article['author_title']}"
    }}],
    "publisher": {{
      "@type": "Organization",
      "name": "MovixWires",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80"
      }}
    }},
    "description": "{article['summary']}"
  }}
  </script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <a href="../index.html" class="flex items-center gap-2.5 text-left group">
        <span class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-sans font-bold text-sm shadow-sm">M</span>
        <div>
          <span class="font-cinzel text-xl font-bold tracking-wider text-slate-900 block leading-none">MovixWires</span>
          <span class="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">Global Press Wire</span>
        </div>
      </a>
      <nav class="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="../movies.html" class="hover:text-amber-600 transition">Movies</a>
        <a href="../tvshows.html" class="hover:text-amber-600 transition">TV Shows</a>
        <a href="../people.html" class="hover:text-amber-600 transition">People</a>
        <a href="../awards.html" class="hover:text-amber-600 transition">Awards</a>
        <a href="../news.html" class="text-amber-600 font-semibold">News Wire</a>
        <a href="../earn-online.html" class="hover:text-amber-600 transition">Guides</a>
      </nav>
      <a href="../news.html" class="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full font-medium hover:bg-slate-800 transition">
        ← Back to Wire
      </a>
    </div>
  </header>

  <!-- Top Banner Ad Placement Slot -->
  <div class="max-w-4xl mx-auto my-6 px-4">
    <div id="mediadb-ad-header" class="border border-dashed border-slate-300 bg-slate-100/70 rounded-xl p-4 text-center text-xs text-slate-500">
      <span class="uppercase tracking-widest text-[10px] font-semibold text-slate-400 block mb-1">Advertisement</span>
      <div class="h-20 flex items-center justify-center font-medium text-slate-600">
        MovixWires Partner Network — High Performance Display Slot (728x90)
      </div>
    </div>
  </div>

  <main class="max-w-3xl mx-auto px-4 py-8">
    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-3">
      <span>{article['category']}</span>
      <span>•</span>
      <span>{article['country']}</span>
      <span>•</span>
      <span>{article['read_time']}</span>
    </div>

    <h1 class="font-serif text-3xl sm:text-4xl font-bold leading-tight text-slate-900 mb-4">
      {article['title']}
    </h1>

    <div class="flex items-center gap-3 py-4 my-6 border-y border-slate-200">
      <div class="w-11 h-11 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="{article['author']}" class="w-full h-full object-cover">
      </div>
      <div>
        <div class="font-semibold text-sm text-slate-900">{article['author']}</div>
        <div class="text-xs text-slate-500">{article['author_title']} • Dispatched {today_formatted}</div>
      </div>
    </div>

    <div class="rounded-2xl overflow-hidden mb-8 shadow-sm border border-slate-200">
      <img src="{article['featured_image']}" alt="{article['title']}" class="w-full h-80 sm:h-96 object-cover">
    </div>

    <article class="prose prose-lg max-w-none text-slate-700 leading-relaxed font-serif text-lg space-y-5">
      {article['content']}
    </article>

    <!-- In-Article Banner Ad -->
    <div class="my-10 border border-dashed border-slate-300 bg-slate-50 rounded-xl p-4 text-center">
      <span class="uppercase tracking-widest text-[10px] font-semibold text-slate-400 block mb-1">Sponsored Content</span>
      <div class="p-6 bg-white rounded-lg shadow-sm text-sm text-slate-600 font-sans">
        Support Independent Film & Entertainment Journalism — Subscribe to the MovixWires Morning Wire.
      </div>
    </div>

    <div class="border-t border-slate-200 pt-6 mt-8">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Filed Under</div>
      <div class="flex flex-wrap gap-2">
        {" ".join([f'<span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-sans font-medium">#{tag}</span>' for tag in article['tags']])}
      </div>
    </div>
  </main>

  <footer class="mt-20 border-t border-slate-200 bg-white py-12 text-center text-xs text-slate-500">
    <p>© {datetime.date.today().year} MovixWires Global Press Network. All rights reserved.</p>
    <p class="mt-1">Accredited entertainment journalism, box office archives, and festival correspondence.</p>
  </footer>
  <script src="../ads-config.js"></script>
</body>
</html>
"""
    file_path = NEWS_DIR / filename
    file_path.write_text(html_template, encoding="utf-8")
    logger.info(f"Generated standalone article page: {file_path}")

def run_news_cycle():
    logger.info("=== MovixWires Autonomous News Wire Dispatch Initiated ===")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    NEWS_DIR.mkdir(parents=True, exist_ok=True)

    news_file = DATA_DIR / "news.json"
    articles = []
    if news_file.exists():
        try:
            with open(news_file, "r", encoding="utf-8") as f:
                articles = json.load(f)
        except Exception as e:
            logger.error(f"Error reading {news_file}: {e}")

    # Pick a pitch based on current minute/hour rotation
    idx = int(datetime.datetime.now().strftime("%M")) % len(TRENDING_PITCHES)
    pitch = TRENDING_PITCHES[idx]
    author = EDITORIAL_AUTHORS[idx % len(EDITORIAL_AUTHORS)]

    slug_text = sanitize_slug(pitch["headline"])
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    clean_slug = f"{today_str}-{slug_text}"
    filename = f"{clean_slug}.html"

    # Verify if article already exists for today's slug
    if any(a.get("slug") == clean_slug for a in articles):
        logger.info(f"Article for slug {clean_slug} already dispatched today. Cycle complete.")
        return

    logger.info(f"Drafting story: '{pitch['headline']}' by {author['name']}")
    draft = generate_article_content(pitch, author)

    featured_images = [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80"
    ]

    new_article = {
        "id": f"news-{clean_slug}",
        "slug": clean_slug,
        "title": draft["headline"],
        "country": pitch["country"],
        "category": pitch["category"],
        "date": today_str,
        "author": author["name"],
        "author_title": author["title"],
        "read_time": "5 min read",
        "featured_image": featured_images[idx % len(featured_images)],
        "summary": draft["summary"],
        "content": draft["content"],
        "tags": draft["tags"]
    }

    # Generate standalone static HTML file
    create_standalone_html(new_article, filename)

    # Prepend to list and retain top 50 articles
    articles = [new_article] + articles
    articles = articles[:50]

    with open(news_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    logger.info(f"Successfully registered news item into {news_file.name}")
    logger.info("=== MovixWires News Wire Dispatch Completed Successfully ===")

if __name__ == "__main__":
    run_news_cycle()
