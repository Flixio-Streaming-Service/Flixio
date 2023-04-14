import { Request } from "express"

export interface ISearchRequest extends Request {
    query: {
        searchTerm: string
    }
}

export interface ICreateMovieRequest extends Request {
    body: IMovie
}

export interface IUpdateMovieRequest extends Request {
    body: Partial<IMovie>
    params: {
        id: string
    }
}

export interface IDeleteMovieRequest extends Request {
    params: {
        id: string
    }
}

export interface IGetMovieRequest extends Request {
    params: {
        id: string
    }
}

export interface IMovie {
    title: string
    magnet: string
    fileName: string
    sourceUrl: string
    plot: string
    year: string
    director: string
    actors: string[]
    backDrop: string
    poster: string
    trailer: string
    _id?: string
    boxOffice: string
    released: string
    writer: string
    runtime: string
    ratingImdb: string
    imdbId: string
    rated: string
    genres: string[]
}

export interface IMDBMovie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: IBelongsToCollection;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface IGenre {
  id: number;
  name: string;
}

interface IBelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface ICrewMember {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path?: any
  credit_id: string
  cast_id?: string
  character?: string 
  department: string
  job: string
  order?: number
}

export interface IGetCreditsResponse {
  id: number
  cast: ICrewMember[]
  crew: ICrewMember[]
}

export interface ISearchMoviesResponse {
  page: number
  results: Partial<IMDBMovie>[]
  total_pages: number
  total_results: number
}

export interface IGetVideosResponse {
  id: number
  results: IMDBTrailer[]
}

export interface IMDBTrailer {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}