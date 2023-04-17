import { Response, Request, NextFunction } from 'express'
import { activateUser, getAllUsers, loginUser, logoutUser, refreshUser, userRegistration, createRole } from '../service/user.service'
import { IActivateUserRequest, IRegistrationRequest, IUserLoginRequest, IUserRoleCreateRequest } from '../types'
import { validationResult } from 'express-validator'
import ApiAuthError from '../exceptions/api.error'

export const registration = async (req: IRegistrationRequest, res: Response, next:NextFunction) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return next(ApiAuthError.BadRequest('Ошибка валидации', errors.array()))
        }
        const { username, email, password } = req.body
        const userData = await userRegistration(username, email, password)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    } catch (error) {
        next(error)
    }
}


export const login = async (req:IUserLoginRequest, res:Response, next:NextFunction) => {
    try {
        const { username, password } = req.body
        const userData = await loginUser(username, password)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res:Response, next) => {
    try {
        const { refreshToken } = req.cookies
        const token = await logoutUser(refreshToken)
        res.clearCookie('refreshToken')
        res.status(200).json(token)
    } catch (error) {
        next(error)
    }
}

export const activate = async (req: IActivateUserRequest, res: Response, next) => {
    try {
        const activationLink = req.params.link
        await activateUser(activationLink)
        return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
        next(error)
    }
}

export const refresh = async (req: Request, res, next) => {
    try {
        const { refreshToken } = req.cookies
        const userData = await refreshUser(refreshToken)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    } catch (error) {
       next(error) 
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers()
        return res.json(users)
    } catch (error) {
       next(error) 
    }
}

export const roleCreate = async (req: IUserRoleCreateRequest, res: Response, next: NextFunction) => {
    try {
        const role =  await createRole(req.params.role)
        return res.json(role)
    } catch (error) {
        next(error)
    }
}