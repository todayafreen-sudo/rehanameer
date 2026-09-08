import React, { useState, useMemo } from 'react';
import { EarnGuide } from '../types';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Wrench,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

interface EarnOnlineSectionProps {
  guides: EarnGuide[];
}

export const EarnOnlineSection: React.FC<EarnOnlineSectionProps> = ({ guides }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Extract unique categories and counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [guides]);

  // Filter guides
  const filteredGuides = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return guides.filter((g) => {
      const matchCategory = selectedCategory === 'all' || g.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'all' || g.difficulty === selectedDifficulty;
      const matchQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        (g.tools && g.tools.some((t) => t.toLowerCase().includes(q))) ||
        (g.requirements && g.requirements.some((r) => r.toLowerCase().includes(q))) ||
        g.category.toLowerCase().includes(q);

      return matchCategory && matchDifficulty && matchQuery;
    });
  }, [guides, searchQuery, selectedCategory, selectedDifficulty]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredGuides.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedGuides = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredGuides.slice(start, start + itemsPerPage);
  }, [filteredGuides, safePage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('earn-online-directory');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setCurrentPage(1);
  };

  return (
    <section id="earn-online-section" className="space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-4xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/90 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200/80 shadow-2xs">
          <DollarSign className="w-3.5 h-3.5 text-amber-700" />
          <span>{guides.length.toLocaleString()}+ Real & Verified Online Income Blueprints</span>
        </div>
        <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
          EARN ONLINE
        </h1>
        <p className="text-slate-600 text-base sm:text-lg font-serif-heading leading-relaxed max-w-2xl mx-auto">
          Deep, actionable, real-world methodologies for generating sustainable remote revenue across freelancing, micro-SaaS, digital products, high-yield affiliate systems, and productized operations.
        </p>

        {/* Global Statistics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8 text-left">
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Blueprints
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold text-slate-900 font-sans">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{guides.length.toLocaleString()}+</span>
            </div>
            <span className="text-[11px] text-slate-500">100% Real, Deep Details</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Industry Sectors
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold text-slate-900 font-sans">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{categoriesWithCounts.length} Niches</span>
            </div>
            <span className="text-[11px] text-slate-500">From Code to Content</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tooling & Stacks
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold text-slate-900 font-sans">
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Verified</span>
            </div>
            <span className="text-[11px] text-slate-500">Exact software & APIs</span>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Execution Format
            </span>
            <div className="flex items-center gap-1.5 text-xl font-extrabold text-slate-900 font-sans">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Step-by-Step</span>
            </div>
            <span className="text-[11px] text-slate-500">100% Practical Roadmaps</span>
          </div>
        </div>
      </div>

      {/* Directory & Filters Anchor */}
      <div id="earn-online-directory" className="space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search 1,000+ real methods (e.g. React, Notion, Affiliate, SaaS, Video Editing)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="all">All Categories ({guides.length})</option>
                {categoriesWithCounts.map(([cat, count]) => (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                <option value="all">All Experience Levels</option>
                <option value="Beginner">Beginner Friendly</option>
                <option value="Intermediate">Intermediate Practitioner</option>
                <option value="Advanced">Advanced / Technical</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pill Row */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
              Quick Filter:
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Niches ({guides.length})
            </button>
            {categoriesWithCounts.slice(0, 5).map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            ))}
            {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="ml-auto text-amber-700 font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <strong className="text-slate-800 font-bold">{filteredGuides.length}</strong> of{' '}
            <strong>{guides.length.toLocaleString()}</strong> verified earning blueprints
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
          <div>
            Page <strong className="text-slate-800 font-bold">{safePage}</strong> of{' '}
            <strong>{totalPages}</strong>
          </div>
        </div>

        {/* Guides Grid */}
        {paginatedGuides.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 text-base">No online earning methods matched your search criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or resetting filters to browse all 1,000+ posts.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGuides.map((guide) => (
              <article
                key={guide.id}
                id={`guide-card-${guide.id}`}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Potential Header */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-md text-[11px] truncate max-w-[180px]">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px] shrink-0">
                      <TrendingUp className="w-3 h-3" />
                      {guide.income_potential}
                    </span>
                  </div>

                  {/* Title linking to new tab */}
                  <h3 className="font-serif-heading text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition">
                    <a
                      href={`index.html?type=earn&id=${guide.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1"
                    >
                      <span>{guide.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 mt-1" />
                    </a>
                  </h3>

                  {/* Operational Summary */}
                  <p className="text-xs text-slate-600 font-serif-heading leading-relaxed line-clamp-3 mb-4">
                    {guide.summary}
                  </p>

                  {/* Key Execution Steps Preview */}
                  <div className="space-y-2 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Action Blueprint Steps
                    </span>
                    {guide.steps.slice(0, 2).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium line-clamp-1">{step.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Required Tooling Tags */}
                  {guide.tools && guide.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {guide.tools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                      {guide.tools.length > 3 && (
                        <span className="text-[10px] text-slate-400 py-0.5">
                          +{guide.tools.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Meta & Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-medium text-slate-700">{guide.difficulty}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {guide.read_time}
                    </span>
                  </div>

                  <a
                    href={`index.html?type=earn&id=${guide.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition"
                  >
                    <span>Read Full Blueprint</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Jump Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1 text-xs font-medium">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 7) {
                  if (safePage > 4 && safePage < totalPages - 3) {
                    p = safePage - 3 + i;
                  } else if (safePage >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  }
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                      safePage === p
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 7 && safePage < totalPages - 3 && (
                <>
                  <span className="text-slate-400 px-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <div className="text-xs text-slate-500">
              Showing page <strong>{safePage}</strong> of <strong>{totalPages}</strong> (
              {filteredGuides.length} matching)
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
