import mongoose, { Schema } from 'mongoose'

const cartSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        subtotal: {
            type: Number,
            required: true,
            default: 0
        }
    }]
},{
    versionKey: false
})

export default mongoose.model('cart', cartSchema)