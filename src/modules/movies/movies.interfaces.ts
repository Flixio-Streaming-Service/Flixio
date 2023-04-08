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
    plot: string
    year: string
    director: string
    actors: string[]
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