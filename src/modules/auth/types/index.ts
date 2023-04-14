import { Types } from 'mongoose'
import { Request } from 'express'

export interface IUser {
    email: string
    password: string
    isActivated: boolean
    activationLink: string
}

export interface IUserDto {
    email: string
    id: Types.ObjectId
    isActivated: boolean
}

export interface IUserRegistrationResult {
    accessToken: string
    refreshToken: string
    user: IUserDto
}

export interface IRegistrationRequest extends Request {
    body : {
        email: string
        password: string
    }
}

export interface IActivateUserRequest extends Request {
    params: {
        link: string
    }
}