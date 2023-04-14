import { stringify } from "qs";
import { ICrewMember, IGetCreditsResponse, IGetVideosResponse, IMDBMovie, IMovie, ISearchMoviesResponse } from "../movies.interfaces";
import { IMDB_SEARCH_URL } from '../movies.constants'
import axios from "axios";

const findCrewMember = (crew: ICrewMember[], memberJob: string) => crew.find(({ job }) => job == memberJob).name || ""  

export const IMBRRequests = () => {
    const queryParams = stringify({
        language: 'ru',
        api_key: process.env.TMDB_API_KEY,
    })
    const MOVIE_URL = `${IMDB_SEARCH_URL}/movie`

    return ({
        getMovie: async (IMDBId: number) => await axios.get<IMDBMovie>(`${MOVIE_URL}/${IMDBId}?${queryParams}`),
        getMovieCredits: async (IMDBId: number) => await axios.get<IGetCreditsResponse>(`${MOVIE_URL}/${IMDBId}/credits?${queryParams}`),
        searchMovie: async (query: string) => await axios.get<ISearchMoviesResponse>(`${MOVIE_URL}/search/movie?${queryParams}&query=${query}`),
        getVideos: async (IMDBId: number) => await axios.get<IGetVideosResponse>(`${MOVIE_URL}/${IMDBId}/videos?${queryParams}`),
    })
}

const { getMovieCredits, getVideos } = IMBRRequests()

export const MovieCredits = async (IMBRId: number) => {
    try {
        const { data: { crew, cast } } = await getMovieCredits(IMBRId)

        const actors = cast.map(item => item.name)
          
        return {
            actors,
            director: findCrewMember(crew, "Director"),
            writer: findCrewMember(crew, "Writer")
        }
        
    } catch (error) {
        console.warn(error)
        return {
            actors: [],
            director: '',
            writer: ''
        }
    }
}

export const getTrailer = async (IMBRId: number) => {
    try {
        const { data: { results } } = await getVideos(IMBRId)
        const { key } = results.find(({ type }) => type == 'Trailer')
        return `http://www.themoviedb.org/video/play?key=${key}`
    } catch (error) {
        console.warn(error)
        return ''
    }
   
}


export const convertMovie = async (IMDB: IMDBMovie): Promise<Partial<IMovie>> => {
   const { actors, director, writer } = await MovieCredits(IMDB.id)
    return({
        title: IMDB.title,
        plot: IMDB.overview,
        year: new Date(IMDB.release_date).getFullYear().toString(),
        director,
        actors,
        poster: `https://image.tmdb.org/t/p/w1280${IMDB.poster_path}`,
        backDrop: `https://image.tmdb.org/t/p/w1280${IMDB.backdrop_path}`,
        trailer: await getTrailer(IMDB.id),
        boxOffice: String(IMDB.revenue),
        released: IMDB.release_date,
        writer,
        runtime: String(IMDB.runtime),
        ratingImdb: String(IMDB.vote_average),
        imdbId: IMDB.imdb_id,
        rated: '',
        genres: IMDB.genres.map(({ name }) => name),
        
    })
}