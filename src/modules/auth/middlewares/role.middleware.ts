import { NextFunction, Request, Response } from "express";
import { IAuthMiddlewareRequest, IUserRole } from "../types";
import ApiAuthError from "../exceptions/api.error";
import { validateAccessToken } from "../service/token.service";

export const roleMiddleware = (roles: Array<string>) => {
    return function (req: IAuthMiddlewareRequest, res: Response, next: NextFunction) {
        if(req.method === 'OPTIONS'){
            next()
        }

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

            const { roles: userRoles } = userData
            let hasRole = false
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole){
                return next(ApiAuthError.NoAccessRights())
            }

            req.user = userData
            next()
        } catch (error) {
            return next(ApiAuthError.UnauthorizedError())
        }
    }
}