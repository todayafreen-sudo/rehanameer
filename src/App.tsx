import React, { useState, useMemo, useEffect } from 'react';
import { Movie, TVShow, Person, AwardCeremony, NewsArticle, EarnGuide } from './types';
import { Navbar } from './components/Navbar';
import { SpotlightHero } from './components/SpotlightHero';
import { MovieCard, TVCard, PersonCard, AwardCard } from './components/Cards';
import { NewsSection } from './components/NewsSection';
import { EarnOnlineSection } from './components/EarnOnlineSection';
import { DetailModal } from './components/DetailModal';
import { AdBanner } from './components/AdBanner';
import { AutopilotConsole } from './components/AutopilotConsole';
import { ArticleView } from './components/ArticleView';

// Direct data imports from the repository JSON databases
import initialMovies from '../data/movies.json';
import initialTVShows from '../data/tvshows.json';
import initialPeople from '../data/people.json';
import initialAwards from '../data/awards.json';
import initialNews from '../data/news.json';
import initialEarnGuides from '../data/earn_guides.json';

import { Film, Tv, Users, Award, Newspaper, DollarSign, ChevronRight, Sparkles, TrendingUp, Filter } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'movie' | 'tv' | 'person' | 'award' | 'news' | 'earn' | null>(null);
  const [isDedicatedArticleView, setIsDedicatedArticleView] = useState<boolean>(false);

  // Live state permitting content updates
  const [movies, setMovies] = useState<Movie[]>(initialMovies as Movie[]);
  const [tvShows, setTVShows] = useState<TVShow[]>(initialTVShows as TVShow[]);
  const [people, setPeople] = useState<Person[]>(initialPeople as Person[]);
  const [awards, setAwards] = useState<AwardCeremony[]>(initialAwards as AwardCeremony[]);
  const [news, setNews] = useState<NewsArticle[]>(initialNews as NewsArticle[]);
  const [earnGuides] = useState<EarnGuide[]>(initialEarnGuides as EarnGuide[]);

  // Autopilot Console state (retained for GitHub Actions simulation via ?admin=autopilot query param)
  const [isAutopilotOpen, setIsAutopilotOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastSimulatedTitle, setLastSimulatedTitle] = useState<string | null>(null);

  // Parse URL query parameters to support opening any article/dossier in a new tab
  useEffect(() => {
    const handleUrlRoute = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const articleParam = params.get('article');
        const typeParam = params.get('type') as 'movie' | 'tv' | 'person' | 'award' | 'news' | 'earn' | null;
        const idParam = params.get('id');

        if (params.get('admin') === 'autopilot') {
          setIsAutopilotOpen(true);
        }

        if (articleParam) {
          const found = news.find((n) => n.id === articleParam || n.slug === articleParam);
          if (found) {
            setSelectedItem(found);
            setSelectedType('news');
            setIsDedicatedArticleView(true);
            return;
          }
        }

        if (idParam && typeParam) {
          let found: any = null;
          if (typeParam === 'news') found = news.find((n) => n.id === idParam || n.slug === idParam);
          else if (typeParam === 'movie') found = movies.find((m) => m.id === idParam);
          else if (typeParam === 'tv') found = tvShows.find((t) => t.id === idParam);
          else if (typeParam === 'person') found = people.find((p) => p.id === idParam);
          else if (typeParam === 'award') found = awards.find((a) => a.id === idParam);
          else if (typeParam === 'earn') found = earnGuides.find((e) => e.id === idParam || e.slug === idParam);

          if (found) {
            setSelectedItem(found);
            setSelectedType(typeParam);
            setIsDedicatedArticleView(true);
          }
        }
      } catch (err) {
        console.error('URL parse error:', err);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [news, movies, tvShows, people, awards, earnGuides]);

  // Filters for directories
  const [movieGenreFilter, setMovieGenreFilter] = useState<string>('all');
  const [movieRatingFilter, setMovieRatingFilter] = useState<number>(0);

  // Open modal handler
  const handleOpenDetail = (item: any, type: 'movie' | 'tv' | 'person' | 'award' | 'news' | 'earn') => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  const handleBackToPortal = () => {
    setIsDedicatedArticleView(false);
    setSelectedItem(null);
    setSelectedType(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Simulate an immediate news wire dispatch cycle
  const handleSimulateCycle = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const newStory: NewsArticle = {
        id: `news-${Date.now()}`,
        slug: `${today}-international-box-office-milestone`,
        title: "Venice Golden Lion Contenders Spark Global Bidding War Among Independent Distributors",
        country: "Italy",
        category: "Film Festivals",
        date: today,
        author: "David Alistair",
        author_title: "Festival Circuit & Indie Film Editor",
        read_time: "4 min read",
        featured_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        summary: "World cinema auteurs unveil daring narrative premieres along the Lido as studio buyers scramble to acquire theatrical distribution rights.",
        content: "<p class='lead'>VENICE — The Venice International Film Festival ignited with electrifying momentum this afternoon as competition entries drew standing ovations across the Sala Grande.</p><p>International sales agents report aggressive bids from North American independent labels, validating a growing market appetite for original cinematic vision.</p><blockquote>\"True cinema continues to thrive when artists are given complete creative freedom,\" commented the jury president during this morning's press conference.</blockquote><p>MovixWires correspondents will continue filing daily review scores and trade updates directly from the festival headquarters.</p>",
        tags: ["Venice", "Film Festivals", "World Cinema", "Distribution"]
      };

      setNews((prev) => [newStory, ...prev]);
      setLastSimulatedTitle(newStory.title);
      setIsSimulating(false);
    }, 900);
  };

  // Universal Live Search Filtering
  const query = searchQuery.toLowerCase().trim();

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchesQuery = !query ||
        m.title.toLowerCase().includes(query) ||
        m.director.toLowerCase().includes(query) ||
        m.cast.some((c) => c.toLowerCase().includes(query)) ||
        m.genres.some((g) => g.toLowerCase().includes(query));

      const matchesGenre = movieGenreFilter === 'all' || m.genres.includes(movieGenreFilter);
      const matchesRating = m.rating >= movieRatingFilter;

      return matchesQuery && matchesGenre && matchesRating;
    });
  }, [movies, query, movieGenreFilter, movieRatingFilter]);

  const filteredTV = useMemo(() => {
    return tvShows.filter((t) => {
      return !query ||
        t.name.toLowerCase().includes(query) ||
        t.network.toLowerCase().includes(query) ||
        t.cast.some((c) => c.toLowerCase().includes(query)) ||
        t.genres.some((g) => g.toLowerCase().includes(query));
    });
  }, [tvShows, query]);

  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      return !query ||
        p.name.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query) ||
        p.notable_works.some((w) => w.toLowerCase().includes(query));
    });
  }, [people, query]);

  const filteredAwards = useMemo(() => {
    return awards.filter((a) => {
      return !query ||
        a.ceremony.toLowerCase().includes(query) ||
        a.categories.some((c) => c.winner.toLowerCase().includes(query) || c.category.toLowerCase().includes(query));
    });
  }, [awards, query]);

  const filteredNews = useMemo(() => {
    return news.filter((n) => {
      return !query ||
        n.title.toLowerCase().includes(query) ||
        n.author.toLowerCase().includes(query) ||
        n.country.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query);
    });
  }, [news, query]);

  const spotlightMovie = movies[0];

  // If viewing standalone in a new tab
  if (isDedicatedArticleView && selectedItem && selectedType) {
    return (
      <ArticleView
        item={selectedItem}
        type={selectedType}
        onBackToPortal={handleBackToPortal}
        relatedNews={news}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* Search Results Notification Banner */}
        {searchQuery && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-center justify-between shadow-2xs">
            <div>
              <strong>Universal Search Active:</strong> Showing matches for "{searchQuery}" across all categories
              ({filteredMovies.length} films, {filteredTV.length} shows, {filteredPeople.length} talent profiles, {filteredNews.length} news wire articles)
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 bg-amber-200/70 hover:bg-amber-200 rounded font-semibold text-amber-900 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Header Display Editorial Syndicate Banner */}
        <AdBanner slot="header" onNavigateTab={(tab) => setActiveTab(tab)} />

        {/* HOME / SPOTLIGHT TAB */}
        {activeTab === 'home' && !searchQuery && (
          <>
            {/* Cinematic Spotlight Hero */}
            {spotlightMovie && (
              <SpotlightHero
                movie={spotlightMovie}
                onSelect={(m) => handleOpenDetail(m, 'movie')}
              />
            )}

            {/* Category Quick Routing Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('movies')}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-400 hover:shadow-md transition text-left flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl group-hover:scale-105 transition">
                  🎬
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Movies & Series</div>
                  <div className="text-xs text-slate-500">Box office & reviews</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('tvshows')}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-400 hover:shadow-md transition text-left flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl group-hover:scale-105 transition">
                  📺
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">TV Broadcasts</div>
                  <div className="text-xs text-slate-500">Episodic guides & dates</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('people')}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-400 hover:shadow-md transition text-left flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl group-hover:scale-105 transition">
                  🌟
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Talent Profiles</div>
                  <div className="text-xs text-slate-500">Actors & directors</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('awards')}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-amber-400 hover:shadow-md transition text-left flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl group-hover:scale-105 transition">
                  🏆
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Festival Honors</div>
                  <div className="text-xs text-slate-500">Oscars, Cannes & Globes</div>
                </div>
              </button>
            </section>

            {/* Trending Cinema Releases */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-0.5">
                    Theatrical & VOD Highlights
                  </div>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900">
                    Trending Cinema Masterworks
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('movies')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                >
                  <span>Explore Directory</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {movies.slice(0, 4).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={(m) => handleOpenDetail(m, 'movie')}
                  />
                ))}
              </div>
            </section>

            {/* Native In-Article Sponsor */}
            <AdBanner slot="in-article" />

            {/* Real-Time News Wire Section */}
            <NewsSection
              articles={news.slice(0, 3)}
              onSelectArticle={(a) => handleOpenDetail(a, 'news')}
            />

            {/* TV Shows Preview */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-0.5">
                    Broadcast Schedules
                  </div>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900">
                    Prestige Television Series
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('tvshows')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                >
                  <span>View All Shows</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {tvShows.slice(0, 4).map((show) => (
                  <TVCard
                    key={show.id}
                    show={show}
                    onSelect={(s) => handleOpenDetail(s, 'tv')}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* MOVIES TAB */}
        {activeTab === 'movies' && (
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                  Theatrical & Web Series Directory
                </div>
                <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Feature Films & Documentaries
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-serif-heading">
                  Verified guild reviews, box office tracking, and streaming distribution agreements.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {['all', 'Action', 'Sci-Fi', 'Drama', 'Animation'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setMovieGenreFilter(genre)}
                      className={`px-3 py-1 rounded-md font-medium transition ${
                        movieGenreFilter === genre
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {genre === 'all' ? 'All Genres' : genre}
                    </button>
                  ))}
                </div>

                <select
                  value={movieRatingFilter}
                  onChange={(e) => setMovieRatingFilter(Number(e.target.value))}
                  className="bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg font-medium shadow-2xs focus:outline-none focus:border-amber-500"
                >
                  <option value={0}>Any Score</option>
                  <option value={7.5}>★ 7.5+ Score</option>
                  <option value={8.0}>★ 8.0+ Critical Acclaim</option>
                  <option value={8.5}>★ 8.5+ Masterwork</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={(m) => handleOpenDetail(m, 'movie')}
                />
              ))}
            </div>
          </section>
        )}

        {/* TV SHOWS TAB */}
        {activeTab === 'tvshows' && (
          <section className="space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                Broadcast & Cable Networks
              </div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                Television Shows & Broadcasts
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-serif-heading">
                Weekly broadcast calendars, episodic review archives, and season renewals.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTV.map((show) => (
                <TVCard
                  key={show.id}
                  show={show}
                  onSelect={(s) => handleOpenDetail(s, 'tv')}
                />
              ))}
            </div>
          </section>
        )}

        {/* PEOPLE TAB */}
        {activeTab === 'people' && (
          <section className="space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                Guild & Talent Registries
              </div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                Popular People & Biographies
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-serif-heading">
                Biographical archives, filmographies, and festival honors for celebrated performers and auteurs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onSelect={(p) => handleOpenDetail(p, 'person')}
                />
              ))}
            </div>
          </section>
        )}

        {/* AWARDS TAB */}
        {activeTab === 'awards' && (
          <section className="space-y-8">
            <div className="border-b border-slate-200 pb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                Festival Juries & Guild Accolades
              </div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                Global Film Festivals & Honors
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-serif-heading">
                Official rosters and jury proceedings from the Academy Awards, Festival de Cannes, and Golden Globes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAwards.map((ceremony) => (
                <AwardCard
                  key={ceremony.id}
                  ceremony={ceremony}
                  onSelect={(a) => handleOpenDetail(a, 'award')}
                />
              ))}
            </div>
          </section>
        )}

        {/* NEWS WIRE TAB */}
        {activeTab === 'news' && (
          <NewsSection
            articles={filteredNews}
            onSelectArticle={(a) => handleOpenDetail(a, 'news')}
          />
        )}

        {/* EARN ONLINE MONETIZATION GUIDES TAB */}
        {activeTab === 'earn' && (
          <EarnOnlineSection guides={earnGuides} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-14 text-center text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              M
            </span>
            <span className="font-cinzel text-xl font-bold tracking-wider text-slate-900">
              MovixWires
            </span>
          </div>
          <p className="max-w-md mx-auto text-slate-500 mb-6 font-serif-heading">
            Accredited global entertainment database, festival archive, and real-time syndicated press wire.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-slate-600 font-medium">
            <button onClick={() => setActiveTab('movies')} className="hover:text-amber-600 transition">
              Movies
            </button>
            <button onClick={() => setActiveTab('tvshows')} className="hover:text-amber-600 transition">
              TV Shows
            </button>
            <button onClick={() => setActiveTab('people')} className="hover:text-amber-600 transition">
              People Directory
            </button>
            <button onClick={() => setActiveTab('awards')} className="hover:text-amber-600 transition">
              Festival Honors
            </button>
            <button onClick={() => setActiveTab('news')} className="hover:text-amber-600 transition">
              News Wire
            </button>
            <button onClick={() => setActiveTab('earn')} className="hover:text-amber-600 transition font-bold text-amber-700">
              EARN ONLINE
            </button>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} MovixWires Global Press Syndicate. All rights reserved. Real-time accredited press coverage.
          </p>
        </div>
      </footer>

      {/* Active Detail Modal */}
      <DetailModal
        item={selectedItem}
        type={selectedType}
        onClose={handleCloseDetail}
      />

      {/* Autopilot Operations Deck */}
      <AutopilotConsole
        isOpen={isAutopilotOpen}
        onClose={() => setIsAutopilotOpen(false)}
        onSimulateCycle={handleSimulateCycle}
        isSimulating={isSimulating}
        lastSimulatedTitle={lastSimulatedTitle}
      />
    </div>
  );
}
