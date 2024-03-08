'use strict'
import Cart from './cart.model.js'
import User from '../user/user.model.js'
import Product from '../product/product.model.js'

export const test = (req, res) => {
    console.log('test is running')
    res.send({message: 'test cart is running'})
}

export const saveCart = async (req, res) => {
    try {
        const userID = req.user.id
        const data = req.body
        data.quantity = parseInt(data.quantity, 10)
        let user = await User.findOne({_id: userID})
        console.log(user)
        if(!user) return res.status(404).send({message: 'User not found or not exists'})

        let uniqueCart = await Cart.findOne({ user: user })

        let product = await Product.findOne({_id: data.product})
        if (!uniqueCart) {
            if(product.stock < data.quantity) return res.status(400).send({ message: `We only have: ${product.stock}`})
            uniqueCart = new Cart({
                user: user.id,
                products: [{ 
                    product: data.product, 
                    quantity: data.quantity, 
                    subtotal: product.price * data.quantity }]
            })
        } else {
            const productExists = uniqueCart.products.find(item => item.product.toString() === data.product)            
                if (productExists) {
                    let NotMoreThanStock = productExists.quantity + data.quantity
                    if(product.stock >= NotMoreThanStock){
                        productExists.quantity += data.quantity
                        console.log(productExists.quantity, '2')
                        let newSubtotal = product.price * data.quantity
                        productExists.subtotal += newSubtotal
                    }else{
                        return res.status(400).send({ message: `We only have: ${product.stock}`})
                    }
                } else {
                    uniqueCart.products.push({ 
                        product: data.product, 
                        quantity: data.quantity, 
                        subtotal: product.price * data.quantity})
                }
        }
        const CartAndProduct = await uniqueCart.save()
        return res.send({message: 'Product and Cart saved successfully', CartAndProduct})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving product' })
    }
}

export const updateCart = async (req, res) => {
    try {
        const userID = req.user.id
        const {id} = req.params
        const data = req.body
        data.quantity = parseInt(data.quantity, 10)


        let cart = await Cart.findOne({ _id: id, user: userID })
        if (!cart) return res.status(404).send({message: 'Cart not found or not exist'})
        let product = await Product.findOne({_id: data.product})
        if (product.stock < data.quantity) return res.status(400).send({ message: `We only have: ${product.stock}`})

        const productO = cart.products.findIndex(item => item.product.toString() === data.product)
        if (productO !== -1) {
            const updatedCart = await Cart.findOneAndUpdate(
                { _id: id, 'products.product': data.product},
                {'products.$.quantity': data.quantity,
                'products.$.subtotal': data.quantity * product.price},
                {new: true}
            )
            return res.send({message: 'Cart updated successfully', updatedCart })
        } else {
            return res.status(404).send({ message: 'Product not found or not exist'})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating cart'})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const userID = req.user.id
        const { id } = req.params
        const data = req.body

        let cart = await Cart.findOne({ _id: id, user: userID })
        if (!cart)return res.status(404).send({message: 'Cart not found or not exists'})

        const productIndex = cart.products.findIndex(item => item.product.toString() === data.product)
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1)
            const updatedCart = await cart.save()
            return res.send({ message: 'Product deleted successfully', updatedCart })
        } else {
            return res.status(404).send({ message: 'Product not found or not exist' })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting product' })
    }
}

export const deleteCart = async(req, res) => {
    try{
        const userID = req.user.id
        const { id } = req.params
        let cart = await Cart.findOneAndDelete({ _id: id, user: userID })
        if (!cart)return res.status(404).send({message: 'Cart not found or not exists'})
        return res.send({message: 'Cart deleted Successfully', cart})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting cart'})
    }
}

export const getCart = async(req, res) => {
    try{
        const userID = req.user.id
        let cart = await Cart.find({user: userID }).populate('user', ['name', 'surname']).populate('products.product', 'name')
        if (!cart) return res.status(404).send({message: 'Cart not found or not exists'})
        return res.send({message: 'Cart found:', cart})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting cart'})
    }
}