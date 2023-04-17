import { Types } from 'mongoose'
import { Request } from 'express'

export interface IUser {
    username: string
    email: string
    password: string
    isActivated: boolean
    activationLink: string
    roles: Array<string>
}

export interface IUserRole {
    value: string
} 

export interface IUserDto {
    email: string
    id: Types.ObjectId
    isActivated: boolean
    roles: IUserRole[]
}

export interface IUserRegistrationResult {
    accessToken: string
    refreshToken: string
    user: IUserDto
}

export interface IUserTokenData {
    email: string
    id: string
    isActivated: boolean
    roles: IUserRole[]
    iat: number
    exp: number
} 

export interface IRegistrationRequest extends Request {
    body : {
        username: string
        email: string
        password: string
    }
}

export interface IActivateUserRequest extends Request {
    params: {
        link: string
    }
}

export interface IAuthMiddlewareRequest extends Request {
    headers: {
        authorization: string
    }
    user: any
}

export interface IUserRoleCreateRequest extends Request {
    params: {
        role: string
    }
}

export interface IUserLoginRequest extends Request {
    body: {
        username: string
        password: string
    }
}