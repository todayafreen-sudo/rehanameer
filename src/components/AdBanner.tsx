import React from 'react';
import { Newspaper, Film, ArrowRight, Award } from 'lucide-react';

interface AdBannerProps {
  slot: 'header' | 'in-article' | 'footer' | 'sidebar';
  onNavigateTab?: (tab: string) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, onNavigateTab }) => {
  if (slot === 'header') {
    return (
      <div className="w-full my-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded">
              MovixWires Editorial Showcase
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Global Syndicate</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <div className="text-sm sm:text-base font-bold text-white font-serif-heading">
                International Film Festival Dispatches & Box Office Intelligence
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Accredited coverage filed daily from Cannes, Venice, London, Tokyo, and Los Angeles bureaus.
              </div>
            </div>
            {onNavigateTab ? (
              <button
                onClick={() => onNavigateTab('news')}
                className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Explore Live Wire</span>
              </button>
            ) : (
              <a
                href="#news-wire-section"
                className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Explore Live Wire</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (slot === 'in-article') {
    return (
      <div className="my-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-center">
          <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400 block mb-1">
            MovixWires Archive Spotlight
          </span>
          <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="font-bold text-sm text-slate-900 font-serif-heading">
                Complete Theatrical Catalog & Historic Festival Honors
              </div>
              <div className="text-xs text-slate-500">
                Over 10,000 verified cinematic filmographies, festival jury outcomes, and critical consensus scores.
              </div>
            </div>
            {onNavigateTab ? (
              <button
                onClick={() => onNavigateTab('movies')}
                className="shrink-0 px-3.5 py-1.5 bg-slate-900 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Browse Catalog</span>
              </button>
            ) : (
              <a
                href="#catalog"
                className="shrink-0 px-3.5 py-1.5 bg-slate-900 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Browse Catalog</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
