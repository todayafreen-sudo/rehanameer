import React from 'react';
import { Movie, TVShow, Person, AwardCeremony } from '../types';
import { Star, Film, Tv, Award, ChevronRight, CheckCircle, Trophy } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const url = `?type=movie&id=${movie.id}`;
  return (
    <a
      id={`card-movie-${movie.id}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onSelect) {
          // Allow in-page preview fallback if handled
        }
      }}
      className="media-3d-card bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xs hover:border-amber-400 block text-left transition duration-200"
    >
      <div className="relative aspect-[2/3] bg-slate-100 overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{movie.rating}</span>
        </div>
        {movie.box_office && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[11px] text-slate-200 px-2 py-0.5 rounded-md font-medium">
            Box Office: {movie.box_office}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <span>{movie.release_year}</span>
            <span>•</span>
            <span>{movie.genres.slice(0, 2).join(', ')}</span>
          </div>
          <h3 className="font-serif-heading text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-serif-heading">
            {movie.overview}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[140px] font-medium text-slate-600">Dir: {movie.director}</span>
          <span className="text-amber-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition">
            Dossier <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};

interface TVCardProps {
  show: TVShow;
  onSelect?: (show: TVShow) => void;
}

export const TVCard: React.FC<TVCardProps> = ({ show, onSelect }) => {
  const url = `?type=tv&id=${show.id}`;
  return (
    <a
      id={`card-tv-${show.id}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onSelect) {
          // Allow in-page preview fallback if handled
        }
      }}
      className="media-3d-card bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xs hover:border-amber-400 block text-left transition duration-200"
    >
      <div className="relative aspect-[2/3] bg-slate-100 overflow-hidden">
        <img
          src={show.poster}
          alt={show.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{show.rating}</span>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[11px] text-slate-200 px-2 py-0.5 rounded-md font-medium">
          {show.network}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <span>Season {show.latest_season}</span>
            <span>•</span>
            <span>{show.episodes_count} Episodes</span>
          </div>
          <h3 className="font-serif-heading text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-1">
            {show.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-serif-heading">
            {show.overview}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-slate-600 font-medium">{show.status}</span>
          <span className="text-amber-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition">
            Schedule <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};

interface PersonCardProps {
  person: Person;
  onSelect?: (person: Person) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onSelect }) => {
  const url = `?type=person&id=${person.id}`;
  return (
    <a
      id={`card-person-${person.id}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onSelect) {
          // Allow in-page preview fallback if handled
        }
      }}
      className="media-3d-card bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xs hover:border-amber-400 block text-left transition duration-200"
    >
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-sm">
          <Trophy className="w-3 h-3" />
          <span>{person.awards_won} Awards</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
            {person.role}
          </div>
          <h3 className="font-serif-heading text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug">
            {person.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {person.biography}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[140px] text-slate-600">{person.place_of_birth}</span>
          <span className="text-amber-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition">
            Bio & Credits <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};

interface AwardCardProps {
  ceremony: AwardCeremony;
  onSelect?: (ceremony: AwardCeremony) => void;
}

export const AwardCard: React.FC<AwardCardProps> = ({ ceremony, onSelect }) => {
  const url = `?type=award&id=${ceremony.id}`;
  return (
    <a
      id={`card-award-${ceremony.id}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onSelect) {
          // Allow in-page preview fallback if handled
        }
      }}
      className="media-3d-card bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xs hover:border-amber-400 block text-left transition duration-200"
    >
      <div className="relative h-44 bg-slate-900 overflow-hidden">
        <img
          src={ceremony.banner}
          alt={ceremony.ceremony}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase rounded tracking-wider">
            {ceremony.year} Honors
          </span>
          <h3 className="font-serif-heading text-lg font-bold mt-1 text-white leading-tight">
            {ceremony.ceremony}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {ceremony.categories.slice(0, 3).map((cat, idx) => (
            <div key={idx} className="text-xs pb-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">{cat.category}</span>
              <span className="font-serif-heading font-bold text-amber-700">★ {cat.winner}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{ceremony.venue}</span>
          <span className="text-amber-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition">
            Full Results <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};
