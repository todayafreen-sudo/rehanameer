import React from 'react';
import { Movie, TVShow, Person, AwardCeremony, NewsArticle } from '../types';
import { X, Star, Calendar, Clock, DollarSign, Award, Tv, ExternalLink, Bookmark, Share2 } from 'lucide-react';

interface DetailModalProps {
  item: Movie | TVShow | Person | AwardCeremony | NewsArticle | null;
  type: 'movie' | 'tv' | 'person' | 'award' | 'news' | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, type, onClose }) => {
  if (!item || !type) return null;

  const isMovie = type === 'movie';
  const isTV = type === 'tv';
  const isPerson = type === 'person';
  const isAward = type === 'award';
  const isNews = type === 'news';

  const movie = isMovie ? (item as Movie) : null;
  const tv = isTV ? (item as TVShow) : null;
  const person = isPerson ? (item as Person) : null;
  const award = isAward ? (item as AwardCeremony) : null;
  const news = isNews ? (item as NewsArticle) : null;

  const title = movie?.title || tv?.name || person?.name || award?.ceremony || news?.title || '';
  const image = movie?.backdrop || movie?.poster || tv?.backdrop || tv?.poster || person?.photo || award?.banner || news?.featured_image;

  return (
    <div
      id="detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        {/* Modal Banner Header */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-65 filter saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition z-20 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-6 right-6 text-white z-10">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded inline-block mb-2">
              {type.toUpperCase()} ARCHIVE DOSSIER
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
              {title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
            {(movie || tv) && (
              <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{movie?.rating || tv?.rating} / 10</span>
                <span className="text-slate-400 font-normal">({movie?.votes || tv?.votes} votes)</span>
              </div>
            )}

            {movie?.release_year && (
              <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                Year: {movie.release_year}
              </span>
            )}

            {movie?.runtime && (
              <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                Runtime: {movie.runtime}
              </span>
            )}

            {movie?.certification && (
              <span className="border border-slate-300 px-2 py-0.5 rounded font-bold text-slate-700">
                {movie.certification}
              </span>
            )}

            {movie?.box_office && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                Box Office: {movie.box_office}
              </span>
            )}

            {tv && (
              <>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  {tv.seasons_count} Seasons ({tv.episodes_count} Episodes)
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  Network: {tv.network}
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-semibold">
                  Air Schedule: {tv.schedule}
                </span>
              </>
            )}

            {person && (
              <>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  Born: {person.birthday} ({person.place_of_birth})
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-bold">
                  Accolades: {person.awards_won} Awards Won
                </span>
              </>
            )}

            {news && (
              <>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  Category: {news.category}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                  Dateline: {news.country} ({news.date})
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-semibold">
                  Byline: {news.author} ({news.author_title})
                </span>
              </>
            )}
          </div>

          {/* Synopsis / Article Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {news ? 'Journalistic Report' : 'Overview & Narrative Synopsis'}
            </h4>
            {news ? (
              <div
                className="font-serif-heading text-slate-700 leading-relaxed text-base space-y-4"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            ) : (
              <p className="font-serif-heading text-slate-700 leading-relaxed text-base sm:text-lg">
                {movie?.overview || tv?.overview || person?.biography || 'Complete historical database entry.'}
              </p>
            )}
          </div>

          {/* Cast & Credits */}
          {(movie?.cast || tv?.cast) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Principal Cast & Credits
              </h4>
              <div className="flex flex-wrap gap-2">
                {(movie?.cast || tv?.cast || []).map((actor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Streaming Platform availability */}
          {movie?.streaming && movie.streaming.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified Theatrical & Streaming Platforms</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.streaming.map((platform, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-md shadow-2xs"
                  >
                    ✓ {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Person Notable Works */}
          {person?.notable_works && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Filmography & Masterworks
              </h4>
              <div className="flex flex-wrap gap-2">
                {person.notable_works.map((work, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                  >
                    {work}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Award Ceremony details */}
          {award && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Category Winners & Nominees
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {award.categories.map((cat, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {cat.category}
                    </div>
                    <div className="font-serif-heading font-bold text-amber-800 text-sm">
                      ★ Winner: {cat.winner}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Nominees: {cat.nominees.slice(0, 4).join(', ')}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Catalog ID: {item.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
