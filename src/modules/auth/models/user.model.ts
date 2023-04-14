import { Schema, model } from 'mongoose'
import { IUser } from '../types'

//!add new fields to model

const UserSchema = new Schema<IUser>({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

export default model<IUser>('User', UserSchema)