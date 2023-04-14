import { Request, Response, NextFunction } from 'express'
import ApiAuthError from "../exceptions/api.error"
import { validateAccessToken } from '../service/token.service'
import { IAuthMiddlewareRequest } from '../types'

export const authMiddleware = (req: IAuthMiddlewareRequest, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(ApiAuthError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            return next(ApiAuthError.UnauthorizedError())
        } 

        const userData = validateAccessToken(accessToken)
        if(!userData){
            return next(ApiAuthError.UnauthorizedError())
        }
        req.user = userData
        next()
    } catch (error) {
        return next(ApiAuthError.UnauthorizedError())
    }
}

