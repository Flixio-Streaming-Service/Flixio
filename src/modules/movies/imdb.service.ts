import axios from 'axios'
import { stringify } from 'qs'

import { IMDB_SEARCH_URL } from './movies.constants'

export const searchInImdb = async (query) => {
    const queryParams = stringify({
        language: 'ru',
        api_key: process.env.TMDB_API_KEY,
        query
    })
    const {data: { results } } = await axios.get(`${IMDB_SEARCH_URL}/search/movie?${queryParams}`)

    const [ movie ] = results
    return movie
}

export const getMovieFromIMDB = async (IMDBId: string) => {
    const queryParams = stringify({
        language: 'ru',
        api_key: process.env.TMDB_API_KEY,
    })
    const result = await axios.get(`${IMDB_SEARCH_URL}/movie/${IMDBId}?${queryParams}`)

    return result.data
}