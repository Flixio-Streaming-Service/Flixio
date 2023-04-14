import ApiError from "../exceptions/api.error"
import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (err, req, res:Response, next: NextFunction) => {
    console.log(err)
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
 
    return res.status(500).json({message: 'Непредвиденная ошибка'})
}