import mongoose, { Schema }  from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    }, 
    description: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: ['AVAILABLE', 'SOLD OUT']
    },
    sold: {
        type: Number,
        required: false, 
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    }
},{
    versionKey: false  
})

export default mongoose.model('product', productSchema)