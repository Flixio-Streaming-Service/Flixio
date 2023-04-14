import userModel from "../models/user.model"
import { sendActivationMail } from "./mail.service"
import { generateTokens, saveToken, removeToken, validateRefreshToken, findToken } from './token.service'
import { UserDto } from "../dtos/user.dto"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { IUserRegistrationResult } from "../types"
import ApiError from "../exceptions/api.error"

export const userRegistration = async (email: string, password: string): Promise<IUserRegistrationResult> => {
    const candidate = await userModel.findOne({email})
    if(candidate){
        throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()
    const user = await userModel.create({email, password: hashPassword, activationLink})

    await sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)

    const userDto = UserDto(user)
    const tokens = generateTokens({...userDto})

    await saveToken(userDto.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userDto
    }
}

export const activateUser = async (activationLink: string) => {
    const user = await userModel.findOne({activationLink})
    if(!user){
        throw ApiError.BadRequest('Неккоректная ссылка активации!')
    }
    user.isActivated = true
    await user.save()
}

export const loginUser = async (email: string, password: string) => {
    const user = await userModel.findOne({email})
    if(!user){
        throw ApiError.BadRequest('Пользователь с таким email не найден')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals){
        throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = UserDto(user)
    const tokens = generateTokens({...userDto})

    await saveToken(userDto.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userDto
    }
}

export const logoutUser = async (refreshToken: string) => {
    const token = await removeToken(refreshToken)
    return token
}

export const refreshUser = async (refreshToken: string) => {
    if(!refreshToken){
        throw ApiError.UnauthorizedError()
    } 

    const userData = validateRefreshToken(refreshToken)
    const tokenFromDb = findToken(refreshToken)
    
    if(!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError()
    }

    const user = await userModel.findById(userData.id)
    const userDto = UserDto(user)
    const tokens = generateTokens({...userDto})

    await saveToken(userDto.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userDto
    }
}

export const getAllUsers = async () => {
    const users = await userModel.find()
    return users
}