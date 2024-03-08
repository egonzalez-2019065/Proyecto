import mongoose, {Schema} from 'mongoose'

const billSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    nit: {
        type: String,
        required: true,
        default: 'CF'
    },
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
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    state: {
        type: String,
        uppercase: true, 
        enum: ['AUTHORIZED', 'RECHAZED'],
        required: true,
    }
},{
    versionKey: false
})

export default mongoose.model('bill', billSchema)