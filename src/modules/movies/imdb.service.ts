import { IMDBMovie, IMovie  } from './movies.interfaces'
import { IMBRRequests, convertMovie } from './helpers/imdb.helper'

const { searchMovie, getMovie } = IMBRRequests()

export const searchInImdb = async (query) :Promise<Partial<IMDBMovie>> => {
   
    const {data: { results } } = await searchMovie(query)

    const [ movie ] = results
    return movie
}

export const getMovieFromIMDB = async (IMDBId: number): Promise<Partial<IMovie>> => {
    const { data } = await getMovie(IMDBId)
    return convertMovie(data)
}