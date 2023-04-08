import axios from 'axios'
import * as cheerio from 'cheerio'
import { SITE_URL, BASE_SEARCH_URL } from './movies.constants'
import { extractMagnetFromQuery } from './movies.utils'
import MovieEntity from './movies.model'
import { IMovie } from './movies.interfaces'


export const movieSearch = async(searchTerm: string) => {
    const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
    const $ = cheerio.load(searchResult.data)

    const data = $('#index tr').toArray()

    return data.map(item => {
        const [_, magnetTag, title] = $(item).find('a').toArray()
        
        const magnetLink = $(magnetTag).attr('href')      
        const torrentUrl = `${SITE_URL}${$(title).attr('href')}`

        return {
            magnet: extractMagnetFromQuery(magnetLink),
            title: $(title).text(),
            torrentUrl
        }
    }).filter(item => item.title)
}


export const create = async (input: IMovie) => {
    const item = new MovieEntity(input)
    await item.save()
    return item
}

export const update = async (input: Partial<IMovie>, id: string) => {
    return await MovieEntity.findByIdAndUpdate(id, input, {new: true})
}

export const findOne = async (id: string) => {
    return await MovieEntity.findById(id)
}

export const findAll = async () => {
    return await MovieEntity.find()
}

export const deleteMovie = async (id: string) => {
    return MovieEntity.findByIdAndRemove(id)
}
