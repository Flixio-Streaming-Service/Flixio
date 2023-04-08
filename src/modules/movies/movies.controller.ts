import { Router } from 'express'


import { ISearchRequest } from './movies.interfaces'
import { movieSearch } from './movies.service'

const router = Router()



router.get('/search', async (req: ISearchRequest, res) => {
    try {
        const results = await movieSearch(req.query.searchTerm)
        res.status(200).send(results)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router

