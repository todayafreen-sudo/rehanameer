import React, { useState } from 'react';
import { Terminal, CheckCircle2, Clock, GitBranch, Play, Copy, Check, ExternalLink, ShieldCheck, FileCode, RefreshCw } from 'lucide-react';

interface AutopilotConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateCycle: () => void;
  isSimulating: boolean;
  lastSimulatedTitle: string | null;
}

export const AutopilotConsole: React.FC<AutopilotConsoleProps> = ({
  isOpen,
  onClose,
  onSimulateCycle,
  isSimulating,
  lastSimulatedTitle
}) => {
  const [selectedFile, setSelectedFile] = useState('workflow');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileContents: Record<string, { name: string; lang: string; code: string; desc: string }> = {
    workflow: {
      name: '.github/workflows/autopilot.yml',
      lang: 'yaml',
      desc: 'Master GitHub Actions workflow triggered via Cron every 30 mins and daily at 1:00 AM UTC.',
      code: `name: MovixWires Autonomous Engine & Autopilot Sync

on:
  schedule:
    - cron: '*/30 * * * *'  # Dispatches news wire & sitemaps every 30 minutes
    - cron: '0 1 * * *'     # Daily TMDb catalog full synchronization
  workflow_dispatch:        # Allows manual one-click runs from GitHub UI

permissions:
  contents: write
  pages: write

jobs:
  autopilot-cycle:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - run: pip install requests beautifulsoup4 google-generativeai

      - name: Run TMDb Sync
        env:
          TMDB_API_KEY: \${{ secrets.TMDB_API_KEY }}
        run: python bots/tmdb_sync.py

      - name: Run News Wire Dispatch
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
        run: python bots/news_bot.py

      - name: Rebuild Sitemaps
        env:
          GITHUB_REPOSITORY: \${{ github.repository }}
        run: python bots/sitemap_generator.py

      - name: Commit and Push Autopilot Updates
        run: |
          git config --global user.name "GitHub Actions Bot"
          git config --global user.email "action@github.com"
          git add data/ news/ sitemap.xml sitemap.html
          git commit -m "Editorial & Wire Dispatch: \$(date -u) [skip ci]" || exit 0
          git push origin main`
    },
    tmdb: {
      name: 'bots/tmdb_sync.py',
      lang: 'python',
      desc: 'Autonomous TMDb scraper that updates movies.json & tvshows.json with ratings, posters, and releases.',
      code: `#!/usr/bin/env python3
# MovixWires - Autonomous TMDb Database Sync
import os, json, datetime, requests
from pathlib import Path

TMDB_API_KEY = os.environ.get("TMDB_API_KEY", "")
DATA_DIR = Path("data")

def sync():
    if not TMDB_API_KEY:
        print("Running in autonomous maintenance mode.")
        return
    url = "https://api.themoviedb.org/3/trending/movie/week"
    r = requests.get(url, params={"api_key": TMDB_API_KEY}, timeout=15)
    # Merges and saves to data/movies.json safely...`
    },
    news: {
      name: 'bots/news_bot.py',
      lang: 'python',
      desc: 'Editorial wire bot using os.environ.get("GEMINI_API_KEY") to write authentic AP-style articles and HTML pages.',
      code: `#!/usr/bin/env python3
# MovixWires - Real-Time Entertainment Wire & Editorial Dispatch
import os, json, datetime, google.generativeai as genai
from pathlib import Path

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
# Synthesizes deep human-journalist prose, creates standalone HTML in news/
# and updates data/news.json with zero AI references.`
    },
    sitemap: {
      name: 'bots/sitemap_generator.py',
      lang: 'python',
      desc: 'Scans all JSON records and standalone HTML news pages to output absolute-URL sitemap.xml for Google Search Console.',
      code: `#!/usr/bin/env python3
# MovixWires - Autonomous Sitemap & Google Indexing Engine
import os, glob, datetime
from pathlib import Path

# Generates sitemap.xml and sitemap.html with absolute URLs based on GITHUB_REPOSITORY`
    },
    ads: {
      name: 'ads-config.js',
      lang: 'javascript',
      desc: 'Centralized monetization orchestrator managing header, footer, and native in-article ad slots.',
      code: `// MovixWires Centralized Monetization Engine
const MovixWiresAds = {
  publisherId: "ca-pub-0000000000000000",
  slots: {
    headerBanner: { id: "mediadb-ad-header", size: [[728, 90]] },
    inArticleMid: { id: "mediadb-ad-in-article", size: [[728, 90], [300, 250]] }
  }
};`
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContents[selectedFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Autonomous Operations Deck</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  100% Autopilot
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                GitHub Actions scheduled routines, Python syndication bots, and zero-maintenance workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Live Simulator Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Scheduled Cadence: <strong>Every 30 Minutes</strong> (News & Sitemap) • <strong>1:00 AM UTC</strong> (TMDb Catalog)</span>
          </div>
          <button
            onClick={onSimulateCycle}
            disabled={isSimulating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition disabled:opacity-50 shrink-0"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Article & Updating Sitemap...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Immediate News Wire Dispatch</span>
              </>
            )}
          </button>
        </div>

        {lastSimulatedTitle && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Dispatched Wire:</strong> "{lastSimulatedTitle}" added to live registry!
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">news.json + sitemap.xml synced</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-4 pt-2 gap-2 overflow-x-auto text-xs font-medium">
          {Object.entries(fileContents).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedFile(key)}
              className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                selectedFile === key
                  ? 'border-amber-600 text-amber-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Code & Inspector */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950 text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between mb-3 text-slate-400 border-b border-slate-800 pb-2">
            <div>
              <span className="text-amber-400 font-bold">{fileContents[selectedFile].name}</span>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">{fileContents[selectedFile].desc}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">
            {fileContents[selectedFile].code}
          </pre>
        </div>

        {/* GitHub Quick Deployment Guide */}
        <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-600">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-amber-600" />
            <span>GitHub Zero-Maintenance Deployment Checklist:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Push the entire repository code to your GitHub repo (e.g. <code>username/movixwires</code>).</li>
            <li>In repo <strong>Settings → Pages</strong>, set source to <code>main</code> branch root (<code>/</code>).</li>
            <li>In repo <strong>Settings → Secrets and variables → Actions</strong>, add secrets: <code>TMDB_API_KEY</code> and <code>GEMINI_API_KEY</code>.</li>
            <li>GitHub Actions handles all automatic scraping, journalistic writing, sitemap generation, and git commits on 100% autopilot!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
