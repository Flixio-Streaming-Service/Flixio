import { Schema, model } from 'mongoose'
import { IUserRole } from '../types'

const RoleShema = new Schema<IUserRole>({
    value: { type: String, unique: true, default: "USER" }
})

export default model('Role', RoleShema)