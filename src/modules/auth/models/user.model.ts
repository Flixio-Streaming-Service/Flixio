import { Schema, model } from 'mongoose'
import { IUser } from '../types'


const UserSchema = new Schema<IUser>({
    username: {type: String, unique: true, required: true },
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}]
})

export default model<IUser>('User', UserSchema)