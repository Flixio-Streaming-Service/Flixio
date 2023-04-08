import { Router } from 'express'

import { ISearchRequest, ICreateMovieRequest } from './movies.interfaces'
import * as MovieService from './movies.service'
import { getMovieFromIMDB, searchInImdb } from './imdb.service'

const router = Router()



router.get('/search', async (req: ISearchRequest, res) => {
    try {
        const results = await MovieService.movieSearch(req.query.searchTerm)
        res.status(200).send(results)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/', async (req : ICreateMovieRequest, res) => {
  try {
    const result = await MovieService.create(req.body)
    res.status(200).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/imdb-search', async ({ query: { searchTerm } }, res) => {
    try {
        const result = await searchInImdb(searchTerm)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('imdb/:imdbId', async ({ params: { imdbId } }, res) => {
    try {
        const result = await getMovieFromIMDB(imdbId)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router

