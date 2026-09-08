export interface Movie {
  id: string;
  tmdb_id?: number;
  title: string;
  original_title?: string;
  release_year: number;
  release_date: string;
  runtime: string;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
  votes: string;
  box_office: string;
  poster: string;
  backdrop: string;
  overview: string;
  critic_score: number;
  certification: string;
  streaming: string[];
  tagline: string;
  status: string;
  trending: boolean;
}

export interface TVShow {
  id: string;
  tmdb_id?: number;
  name: string;
  first_air_date: string;
  seasons_count: number;
  episodes_count: number;
  genres: string[];
  network: string;
  creators: string[];
  cast: string[];
  rating: number;
  votes: string;
  poster: string;
  backdrop: string;
  overview: string;
  critic_score: number;
  status: string;
  schedule: string;
  latest_season: number;
  trending: boolean;
}

export interface Person {
  id: string;
  tmdb_id?: number;
  name: string;
  known_for_department: string;
  birthday: string;
  place_of_birth: string;
  biography: string;
  photo: string;
  notable_works: string[];
  awards_won: number;
  role: string;
  trending: boolean;
}

export interface AwardCategory {
  category: string;
  winner: string;
  nominees: string[];
}

export interface AwardCeremony {
  id: string;
  ceremony: string;
  year: number;
  date: string;
  venue: string;
  host: string;
  banner: string;
  categories: AwardCategory[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  country: string;
  category: string;
  date: string;
  author: string;
  author_title: string;
  read_time: string;
  featured_image: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface EarnGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  read_time: string;
  difficulty: string;
  income_potential: string;
  time_to_first_dollar?: string;
  updated_at: string;
  author: string;
  author_role: string;
  summary: string;
  steps: {
    title: string;
    detail: string;
  }[];
  tools?: string[];
  requirements?: string[];
  pros?: string[];
  cons?: string[];
  content?: string;
}
