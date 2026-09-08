import React from 'react';
import { Movie } from '../types';
import { Star, Play, Info, Calendar, Clock, Award } from 'lucide-react';

interface SpotlightHeroProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({ movie, onSelect }) => {
  return (
    <section id="cinematic-spotlight-hero" className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800/10 bg-slate-950 text-white min-h-[440px] sm:min-h-[480px] flex items-end">
      {/* Backdrop image */}
      <img
        src={movie.backdrop || movie.poster}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 filter saturate-110"
      />

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden sm:block"></div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
          <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
            Cinematic Spotlight
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
            <span className="text-slate-400 font-normal">/10</span>
          </div>
          <span className="text-xs text-slate-300 flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Calendar className="w-3 h-3 text-slate-400" />
            {movie.release_year}
          </span>
          <span className="text-xs text-slate-300 flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3 text-slate-400" />
            {movie.runtime}
          </span>
          {movie.critic_score && (
            <span className="text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
              {movie.critic_score}% Critics
            </span>
          )}
        </div>

        <h1 className="font-serif-heading text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-3">
          {movie.title}
        </h1>

        <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-serif-heading line-clamp-3 max-w-2xl drop-shadow-sm">
          {movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            id={`spotlight-inspect-btn-${movie.id}`}
            href={`?type=movie&id=${movie.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (onSelect) {
                // allow callback if handled
              }
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg flex items-center gap-2 group inline-flex"
          >
            <Info className="w-4 h-4 text-slate-950" />
            <span>Examine Production Dossier & Reviews</span>
            <span className="group-hover:translate-x-0.5 transition">→</span>
          </a>

          {movie.streaming && movie.streaming.length > 0 && (
            <div className="text-xs text-slate-300 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-amber-400 font-semibold">Available:</span>
              <span>{movie.streaming.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
