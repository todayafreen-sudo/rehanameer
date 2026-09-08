import React from 'react';
import { NewsArticle, Movie, TVShow, Person, AwardCeremony, EarnGuide } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Share2,
  Bookmark,
  Star,
  Tv,
  Trophy,
  Check,
  Film,
  Newspaper,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface StandaloneViewProps {
  item: NewsArticle | Movie | TVShow | Person | AwardCeremony | EarnGuide;
  type: 'news' | 'movie' | 'tv' | 'person' | 'award' | 'earn';
  onBackToPortal: () => void;
  relatedNews?: NewsArticle[];
}

export const ArticleView: React.FC<StandaloneViewProps> = ({
  item,
  type,
  onBackToPortal,
  relatedNews = []
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (type === 'news') {
    const article = item as NewsArticle;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-cinzel font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-sans font-bold text-xs shadow-xs">
                M
              </span>
              <span>MovixWires News Wire</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
              title="Copy Article Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Article Reader Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-4">
            <span className="bg-amber-100/80 text-amber-900 px-2.5 py-1 rounded-md">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Globe className="w-3 h-3 text-slate-400" />
              {article.country} Bureau
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 font-normal">
              <Clock className="w-3 h-3" />
              {article.read_time}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Journalist Byline Box */}
          <div className="flex items-center justify-between gap-4 py-4 my-6 border-y border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt={article.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{article.author}</div>
                <div className="text-xs text-slate-500">{article.author_title}</div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Filed on {article.date}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm border border-slate-200 bg-slate-950">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
            <div className="p-3 bg-slate-900/90 text-slate-400 text-[11px] flex items-center justify-between">
              <span>MovixWires Press Syndicate Archive • Accredited Press Dispatch</span>
              <span>{article.country}</span>
            </div>
          </div>

          {/* Article Summary Lead */}
          <div className="p-4 sm:p-5 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl text-slate-800 font-serif-heading text-base sm:text-lg italic leading-relaxed mb-8">
            "{article.summary}"
          </div>

          {/* Article Body Content */}
          <article
            className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-serif text-lg space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                Filed Under:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Internal Editorial Syndicate Banner */}
          <div className="my-12 p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                MovixWires Global Syndicate
              </div>
              <div className="font-serif-heading text-lg font-bold">
                Daily Accredited Entertainment Reporting & Box Office Intel
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Verified filmographies, festival juries, and box office telemetry.
              </div>
            </div>
            <button
              onClick={onBackToPortal}
              className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Explore Entire Catalog
            </button>
          </div>

          {/* Related Articles in Wire */}
          {relatedNews.length > 0 && (
            <section className="space-y-6 mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-heading text-2xl font-bold text-slate-900">
                  More From the Press Wire
                </h3>
                <button
                  onClick={onBackToPortal}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  View All Dispatches →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedNews
                  .filter((n) => n.id !== article.id)
                  .slice(0, 3)
                  .map((rel) => (
                    <a
                      key={rel.id}
                      href={`?type=news&id=${rel.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-amber-400 transition shadow-2xs group flex flex-col justify-between"
                    >
                      <div className="h-32 bg-slate-100 overflow-hidden">
                        <img
                          src={rel.featured_image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                            {rel.category} • {rel.country}
                          </div>
                          <h4 className="font-serif-heading text-xs font-bold text-slate-900 group-hover:text-amber-600 line-clamp-2">
                            {rel.title}
                          </h4>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">{rel.date}</div>
                      </div>
                    </a>
                  ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 mt-16">
          <p>© {new Date().getFullYear()} MovixWires Global Press Syndicate. All verified journalistic reports reserved.</p>
        </footer>
      </div>
    );
  }

  // Movie Dossier View
  if (type === 'movie') {
    const movie = item as Movie;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>
            <div className="font-cinzel font-bold text-lg text-slate-900">MovixWires Film Dossier</div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-950">
            <img src={movie.backdrop || movie.poster} alt={movie.title} className="w-full h-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded inline-block mb-2">
                Theatrical Cinema Release
              </span>
              <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.rating} / 10 ({movie.votes} votes)
                </span>
                <span>•</span>
                <span>{movie.release_year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>Dir: {movie.director}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Narrative Synopsis</h3>
              <p className="font-serif-heading text-slate-700 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Principal Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {movie.streaming && movie.streaming.length > 0 && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-700" />
                  <span>Verified Availability</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {movie.streaming.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-md">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // TV Show Dossier View
  if (type === 'tv') {
    const show = item as TVShow;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button onClick={onBackToPortal} className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition">
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>
            <div className="font-cinzel font-bold text-lg text-slate-900">MovixWires Television Dossier</div>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-950">
            <img src={show.backdrop || show.poster} alt={show.name} className="w-full h-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded inline-block mb-2">
                Broadcast & Streaming Serial
              </span>
              <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {show.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {show.rating} / 10 ({show.votes} votes)
                </span>
                <span>•</span>
                <span>{show.network}</span>
                <span>•</span>
                <span>{show.seasons_count} Seasons ({show.episodes_count} Episodes)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Series Overview</h3>
              <p className="font-serif-heading text-slate-700 text-lg leading-relaxed">{show.overview}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cast & Ensemble</h3>
              <div className="flex flex-wrap gap-2">
                {show.cast.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Person Dossier View
  if (type === 'person') {
    const person = item as Person;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button onClick={onBackToPortal} className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition">
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>
            <div className="font-cinzel font-bold text-lg text-slate-900">MovixWires Talent Biography</div>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-36 h-48 rounded-xl overflow-hidden shrink-0 bg-slate-200 shadow-sm border border-slate-300">
              <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold uppercase rounded inline-block">
                {person.role}
              </span>
              <h1 className="font-serif-heading text-3xl font-extrabold text-slate-900">{person.name}</h1>
              <div className="text-xs text-slate-500">
                Born: {person.birthday} • {person.place_of_birth} • {person.awards_won} Awards Won
              </div>
              <p className="font-serif-heading text-slate-700 text-sm leading-relaxed pt-2">{person.biography}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Award Ceremony View
  if (type === 'award') {
    const award = item as AwardCeremony;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button onClick={onBackToPortal} className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition">
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>
            <div className="font-cinzel font-bold text-lg text-slate-900">MovixWires Festival Honors</div>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-slate-950">
            <img src={award.banner} alt={award.ceremony} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded inline-block mb-2">
                {award.year} Official Honors
              </span>
              <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {award.ceremony}
              </h1>
              <div className="text-xs text-slate-300 mt-2 font-medium">
                Venue: {award.venue} • {award.date}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {award.categories.map((cat, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {cat.category}
                </div>
                <div className="font-serif-heading font-bold text-amber-800 text-base">★ {cat.winner}</div>
                <div className="text-xs text-slate-500 mt-1">Nominees: {cat.nominees.join(', ')}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (type === 'earn') {
    const guide = item as EarnGuide;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-amber-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to MovixWires Portal</span>
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-cinzel font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-sans font-bold text-xs shadow-xs">
                M
              </span>
              <span>EARN ONLINE Desk</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
              title="Copy Blueprint Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Blueprint</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Blueprint Reader Canvas */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold uppercase tracking-wider rounded-lg">
              {guide.category}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Potential: {guide.income_potential}
            </span>
            <span className="px-2.5 py-1 bg-slate-200/80 text-slate-700 font-medium rounded-lg">
              Difficulty: {guide.difficulty}
            </span>
            {guide.time_to_first_dollar && (
              <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-medium rounded-lg border border-blue-200">
                First Dollar: {guide.time_to_first_dollar}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {guide.title}
          </h1>

          {/* Author Byline & Date */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {guide.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{guide.author}</div>
                <div className="text-xs text-slate-500">{guide.author_role}</div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5" />
                <span>{guide.read_time}</span>
              </div>
              <div>Verified: {guide.updated_at}</div>
            </div>
          </div>

          {/* Executive Summary Callout */}
          <div className="bg-amber-50/80 border-l-4 border-amber-500 p-5 rounded-r-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
              Executive Strategic Overview
            </h2>
            <p className="text-sm text-amber-950 font-serif-heading leading-relaxed">
              {guide.summary}
            </p>
          </div>

          {/* Step-by-Step Tactical Blueprint */}
          <div className="space-y-4">
            <h2 className="font-serif-heading text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Step-by-Step Execution Plan</span>
            </h2>

            <div className="space-y-4">
              {guide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 hover:border-amber-300 transition"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-sans shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-serif-heading leading-relaxed pl-8">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Tooling & Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Tooling Stack */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Verified Tooling & Platform Stack</span>
              </div>
              <p className="text-xs text-slate-500">
                Exact software, APIs, and services required to execute this methodology:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(guide.tools || ['Stripe', 'Wise', 'Google Workspace', 'Notion']).map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-mono font-medium border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Foundational Requirements</span>
              </div>
              <p className="text-xs text-slate-500">
                Baseline skills and assets needed before launching outreach:
              </p>
              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {(guide.requirements || ['Basic English fluency', 'Stable internet connection', 'Payment receipt account']).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pros & Cons / Realistic Trade-Offs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                Direct Advantages
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-950 font-serif-heading">
                {(guide.pros || ['Rapid cash-flow realization', '100% digital profit margins']).map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-slate-100/90 border border-slate-200 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Honest Trade-Offs & Friction
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 font-serif-heading">
                {(guide.cons || ['Requires disciplined daily prospecting', 'Subject to platform policy changes']).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer Callout */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Ready to execute this blueprint?
              </h3>
              <p className="text-xs text-slate-300 font-serif-heading">
                Explore over 1,025+ other verified real online earning methods in our global directory.
              </p>
            </div>
            <button
              onClick={onBackToPortal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition shrink-0"
            >
              Browse All 1,000+ Blueprints →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
};
