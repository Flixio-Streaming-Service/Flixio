import userModel from "../models/user.model"
import roleModel from "../models/role.model"
import { sendActivationMail } from "./mail.service"
import { generateTokens, saveToken, removeToken, validateRefreshToken, findToken } from './token.service'
import { UserDto } from "../dtos/user.dto"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { IUserRegistrationResult } from "../types"
import ApiError from "../exceptions/api.error"

export const userRegistration = async (username: string, email: string, password: string): Promise<IUserRegistrationResult> => {
    const candidateEmail = await userModel.findOne({email})
    if(candidateEmail){
        throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const candidateUsername = await userModel.findOne({username})
    if(candidateUsername){
        throw ApiError.BadRequest(`Пользователь с ником ${username} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()
    let userRole = await roleModel.findOne({value: "USER"})
    if(!userRole){
        userRole = await roleModel.create({value: "USER"})
    }
    const user = await userModel.create(
        { username, email, password: hashPassword,
          activationLink, roles: [userRole.value]
        })

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

export const loginUser = async (username: string, password: string) => {
    const user = await userModel.findOne({username})
    if(!user){
        throw ApiError.BadRequest('Пользователь с таким никнеймом не найден')
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

export const getAllUsers = async ()  => {
    const users = await userModel.find()
    return users
}

export const createRole = async (roleName?: string) => {
    const role = await roleModel.create({value: roleName})
    return role
}