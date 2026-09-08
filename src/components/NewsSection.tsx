import React, { useState, useMemo } from 'react';
import { NewsArticle } from '../types';
import { Newspaper, Calendar, Globe, Clock, ChevronRight, Search, Filter, X, Tag } from 'lucide-react';

interface NewsSectionProps {
  articles: NewsArticle[];
  onSelectArticle?: (article: NewsArticle) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles, onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [wireSearch, setWireSearch] = useState<string>('');

  // Comprehensive category list
  const standardCategories = [
    'all',
    'Film Festivals',
    'Box Office',
    'Television',
    'Production',
    'Animation',
    'Independent Cinema',
    'Music & Scores',
    'Awards & Honors',
    'Technology',
    'Industry Trends'
  ];

  // Dynamic category compilation ensuring all categories in the dataset are included
  const categories = useMemo(() => {
    const articleCats = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
    const merged = Array.from(new Set(['all', ...standardCategories.slice(1), ...articleCats]));
    return merged;
  }, [articles]);

  // Comprehensive global country list
  const standardCountries = [
    'all',
    'United States',
    'United Kingdom',
    'France',
    'Italy',
    'Germany',
    'Japan',
    'South Korea',
    'India',
    'Canada',
    'Australia',
    'Spain',
    'Hungary',
    'Ireland',
    'Brazil',
    'Mexico'
  ];

  // Dynamic country compilation ensuring all countries in dataset are represented
  const countries = useMemo(() => {
    const articleCountries = Array.from(new Set(articles.map((a) => a.country).filter(Boolean)));
    const merged = Array.from(new Set(['all', ...standardCountries.slice(1), ...articleCountries]));
    return merged;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const query = wireSearch.toLowerCase().trim();
    return articles.filter((article) => {
      const matchCat = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchCountry = selectedCountry === 'all' || article.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchQuery =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.country.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(query)));

      return matchCat && matchCountry && matchQuery;
    });
  }, [articles, selectedCategory, selectedCountry, wireSearch]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedCountry !== 'all' || wireSearch.length > 0;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCountry('all');
    setWireSearch('');
  };

  return (
    <section id="news-wire-section" className="space-y-8">
      {/* Editorial Bureau Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Live Global Press Wire & Syndication Network
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">• Paris • Cannes • London • Tokyo • Seoul • Los Angeles</span>
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Real-Time Entertainment Wire
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl font-serif-heading">
          Accredited reporting, box office telemetry, international festival reviews, and studio infrastructure analysis.
        </p>

        {/* Global Search & All Country / All Category Filters */}
        <div className="mt-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                id="news-wire-search-input"
                type="text"
                value={wireSearch}
                onChange={(e) => setWireSearch(e.target.value)}
                placeholder="Search headlines, journalists, film festivals, or topics..."
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
              {wireSearch && (
                <button
                  onClick={() => setWireSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Country Filter (All Countries) */}
            <div className="md:col-span-3 relative">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  id="select-news-country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Countries & Bureaus</option>
                  {countries
                    .filter((c) => c !== 'all')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Category Filter (All Categories) */}
            <div className="md:col-span-3 relative">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  id="select-news-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories
                    .filter((cat) => cat !== 'all')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar py-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
                Quick Category:
              </span>
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition shrink-0"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Filter Telemetry */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredArticles.length}</strong> of <strong>{articles.length}</strong> dispatches
            {selectedCountry !== 'all' && ` • Bureau: ${selectedCountry}`}
            {selectedCategory !== 'all' && ` • Category: ${selectedCategory}`}
          </span>
          <span className="text-amber-700 font-medium">Click any article to open in a new tab ↗</span>
        </div>
      </div>

      {/* Wire Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-serif-heading text-lg font-bold text-slate-800">
            No Dispatches Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No news articles match your active filter criteria for "{wireSearch || selectedCountry || selectedCategory}".
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const articleUrl = `?type=news&id=${article.id}`;
            return (
              <a
                key={article.id}
                id={`news-item-${article.id}`}
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onSelectArticle) {
                    // Allows fallback if opened locally
                  }
                }}
                className="media-3d-card bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-amber-400 group transition duration-200 block text-left"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      {article.category}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-[10px] text-slate-200 font-medium px-2 py-0.5 rounded">
                      {article.country}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.read_time}
                      </span>
                    </div>

                    <h3 className="font-serif-heading text-lg font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug mb-2.5">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 font-serif-heading leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                        alt={article.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-slate-800 text-[11px]">{article.author}</span>
                  </div>
                  <span className="text-amber-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};
