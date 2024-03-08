import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String, 
        requerid: true
    },
    password: {
        type: String, 
        required: true
    },
    phone: {
        type: String, 
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String, 
        uppercase: true, 
        enum: ['ADMIN', 'CLIENT'],
        required: true
    }
},{
    versionKey: false
})

export default mongoose.model('user', userSchema)