import { HydratedDocument } from 'mongoose'
import { IUser, IUserDto } from '../types'

export const UserDto = (model : HydratedDocument<IUser>): IUserDto => {
    return {
        email : model.email,
        id: model._id,
        isActivated: model.isActivated
    }
}