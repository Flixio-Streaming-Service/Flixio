import jwt from 'jsonwebtoken'
import tokenModel from '../models/token.model'
import { Types } from 'mongoose'
import { IUserTokenData } from '../types'

export const validateAccessToken = (token: string): IUserTokenData => {
    try {
        const userData = jwt.verify<IUserTokenData>(token, process.env.JWT_ACCESS_SECRET)
        return userData
    } catch (error) {
        return null
    }
}

export const validateRefreshToken = (token: string): IUserTokenData => {
    try {
        const userData = jwt.verify<IUserTokenData>(token, process.env.JWT_REFRESH_SECRET)
        return userData
    } catch (error) {
        return null
    }
}


export const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

    return {
        accessToken,
        refreshToken
    }
}

export const saveToken = async (userId: Types.ObjectId, refreshToken: string) => {
    const tokenData = await tokenModel.findOne({user: userId})

    if(tokenData) {
        tokenData.refreshToken = refreshToken
        return tokenData.save()
    }

    const token = await tokenModel.create({user: userId, refreshToken})

    return token
}

export const removeToken = async (refreshToken: string) => {
    const tokenData = await tokenModel.deleteOne({refreshToken})
    return tokenData
}

export const findToken = async (refreshToken: string) => {
    const tokenData = await tokenModel.findOne({refreshToken})
    return tokenData
}

