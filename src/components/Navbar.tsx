import React from 'react';
import { Search, Film, Tv, Users, Award, Newspaper, DollarSign } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAutopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const navItems = [
    { id: 'home', label: 'Spotlight', icon: Film },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tvshows', label: 'TV Shows', icon: Tv },
    { id: 'people', label: 'People', icon: Users },
    { id: 'awards', label: 'Awards', icon: Award },
    { id: 'news', label: 'News Wire', icon: Newspaper },
    { id: 'earn', label: 'EARN ONLINE', icon: DollarSign },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 border-b border-slate-200/80 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition">
              M
            </div>
            <div>
              <span className="font-cinzel text-xl font-bold tracking-wider text-slate-900 block leading-none">
                MovixWires
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                Global Press Wire
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-44 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog & wire..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-full transition ${
              activeTab === item.id
                ? 'bg-amber-500 text-white font-semibold'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
