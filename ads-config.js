/**
 * MovixWires - Centralized Monetization & Advertising Management Module
 * Orchestrates programmatic ad slots, responsive unit sizing, sponsor fallback networks,
 * and lazy-rendering across all portal and individual news article views.
 */

const MovixWiresAds = (function () {
  const config = {
    enabled: true,
    publisherId: "ca-pub-0000000000000000", // Replace with approved AdSense or SSP publisher ID
    network: "AdSense / Programmatic Header Bidding",
    debug: false,
    slots: {
      headerBanner: {
        id: "mediadb-ad-header",
        size: [[728, 90], [320, 50], [970, 90]],
        label: "Leaderboard Banner",
        type: "display"
      },
      sidebarRail: {
        id: "mediadb-ad-sidebar",
        size: [[300, 250], [300, 600]],
        label: "Sidebar Companion Rectangle",
        type: "display"
      },
      inArticleMid: {
        id: "mediadb-ad-in-article",
        size: [[728, 90], [300, 250]],
        label: "In-Article Native Sponsor Unit",
        type: "native-sponsor"
      },
      footerAnchor: {
        id: "mediadb-ad-footer",
        size: [[728, 90], [970, 90]],
        label: "Footer Showcase Banner",
        type: "display"
      }
    }
  };

  function renderAdSlot(slotKey) {
    const slot = config.slots[slotKey];
    if (!slot) return;

    const el = document.getElementById(slot.id);
    if (!el) return;

    // Check if real AdSense script is available, otherwise render certified responsive sponsor placeholder
    if (window.adsbygoogle && config.publisherId !== "ca-pub-0000000000000000") {
      el.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="auto"
             data-ad-client="${config.publisherId}"
             data-ad-slot="1234567890"></ins>
      `;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        if (config.debug) console.warn("[MovixWires-Ads] Error pushing ad unit:", e);
      }
    } else {
      // Responsive Sponsor Placement Display
      el.innerHTML = `
        <div class="mediadb-sponsor-slot bg-gradient-to-r from-slate-100 to-amber-50/40 border border-slate-200/80 rounded-xl p-4 text-center text-xs text-slate-500 shadow-sm transition-all hover:border-amber-300">
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-1.5 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">Sponsored Partner</span>
            <span class="text-[10px] text-slate-400 font-mono">${slot.label}</span>
          </div>
          <div class="py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div class="text-sm font-semibold text-slate-800">MovixWires Press Syndicate & Cinematic Database</div>
              <div class="text-xs text-slate-500 mt-0.5">Explore real-time festival dispatches, box office analytics, and verified archival filmographies on movixwire.world.</div>
            </div>
            <a href="news.html" class="shrink-0 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition shadow-sm">
              Read Wire Dispatches →
            </a>
          </div>
        </div>
      `;
    }
  }

  function init() {
    if (!config.enabled) return;
    Object.keys(config.slots).forEach(renderAdSlot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    config,
    renderAdSlot,
    refreshAll: init
  };
})();

if (typeof window !== "undefined") {
  window.MovixWiresAds = MovixWiresAds;
  window.MediaDBAds = MovixWiresAds;
}
