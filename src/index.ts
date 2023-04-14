import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import 'dotenv/config'

import authRouter from './modules/auth/router'
import streamRouter from './modules/stream/stream.controller'
import contentRouter from './modules/content/content.controller'
import moviesRouter from './modules/movies/movies.controller'

import { errorMiddleware } from './modules/auth/middlewares/error.middleware'

 const app = express()

 app.use(express.json())
 app.use(cookieParser())
 app.use(logger('dev'))
 app.use(cors())

 app.use('/auth', authRouter)
 app.use('/stream', streamRouter)
 app.use('/content', contentRouter)
 app.use('/movies', moviesRouter)


 app.use(errorMiddleware)

 const PORT = process.env.PORT || 8080

 const start = async () => {
   try {
      await mongoose.connect(process.env.MONGO_CONECTION_STRING)
      app.listen(PORT, () => {
         console.log('Starting Flixio...')
         console.log(`http://localhost:${PORT}`)
      })  
   } catch (error) {
      console.warn('Starting Flixio Server Error', error)
   }
 }   

 start()
 