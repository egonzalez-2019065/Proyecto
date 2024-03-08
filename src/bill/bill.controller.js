'use strict'

import Bill from './bill.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const test = (req, res) => {
    console.log('test is running')
    res.send({message: 'test bill is running'})
}

export const saveBill = async(req, res) => {
    try{
        // Traer el id del usuario por medio del token
        const userID = req.user.id
        const data = req.body
        // traer el carrito de compras
        let cart = await Cart.findOne({user: userID}).populate('products.product', 'name')
        if(!cart) return res.status(404).send({message: 'Cart not found or not exists'})

        let user = await User.findOne({_id: userID})
        // Traspasar la información entre arreglos 
        const cartBill = cart.products.map(cartItem => {
            return {
                product: cartItem.product,
                quantity: cartItem.quantity,
                subtotal: cartItem.subtotal
            }
        })
        // Buscar producto por producto y descontar al stock y sumar al sold
        for (const cartO of cartBill) {
            const productID = cartO.product._id
            const quantity = cartO.quantity

            const product = await Product.findOne(productID)
            if (!product) return res.status(404).send({ message: 'Product not found or not exists'})
            product.stock -= quantity
            product.sold += quantity
            if(product.stock === 0 ) product.state = 'SOLD OUT'
            await product.save()
        }
        // Sumar todos los subtotales y generar un total
        let total = 0
        cartBill.forEach(cartItem => {
            total += cartItem.subtotal;
        })
        // Guardar
        data.date = new Date()
        data.number = Math.floor(Math.random() * 10000)
        data.user = user
        data.products = cartBill
        data.total = total
        if(!data.nit) data.nit = 'CF'
        data.state = 'AUTHORIZED'
        const bill = new Bill(data)
        await bill.save()
        
        
        const pdfDoc = new PDFDocument()

        //Cómo se va guardar el PDF
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Factura_${user.name}.pdf`,
        });

        // La respuesta conectada al PDF
        pdfDoc.pipe(res)

        // Elementos que llevará el PDF
        pdfDoc.text('Factura', { align: 'center', underline: true })
        pdfDoc.text(`Número de factura: ${data.number}`)
        pdfDoc.text(`Fecha: ${data.date}`)
        pdfDoc.text(`Cliente: ${user.name} ${user.surname}`)
        pdfDoc.text(`NIT: ${data.nit}`)
        pdfDoc.text('Productos:')
        cartBill.forEach((cartItem, index) => {
            pdfDoc.text(`${index + 1}. ${cartItem.product.name} - Cantidad: ${cartItem.quantity} - Subtotal: ${cartItem.subtotal}`,  { align: 'center' })
        })
        pdfDoc.text(`Total: ${total}`,  { align: 'right' })

       // Finalizar acción
        pdfDoc.end();

        // Eliminar el carrito de compras
        await Cart.findOneAndDelete({ user: user })
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating a bill'})
    }
}


export const getBill = async(req, res) => {
    try{
        const userID = req.user.id
        let bill = await Bill.find({user: userID}).populate('user', ['name', 'surname']).populate('products.product', ['name', 'price'])
        if (!bill) return res.status(404).send({message: 'Bill not found or not exists'})
        return res.send({message: 'Bill found:', bill})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting bill'})
    }
}


export const billRechazed = async(req, res) => {
    try{
        // Traer al usuario 
        let user = req.user.id
        // Traer el id de la factura
        let { id } = req.params
        // Data 
        let data = req.body

        // Ver si existe la factura 
        let bill = await Bill.findOne({_id: id, user: user})
        if(!bill || bill.state == 'RECHAZED') return res.status(404).send({message: 'Bill not found or is rechazed'})
        // Cambiar el estado de bill a RECHAZED 
        data.state = 'RECHAZED'
        // Volver a sumar el stock y descontar el sold al product
        for (const cart of bill.products) {
            const productID = cart.product._id
            const quantity = cart.quantity

            const product = await Product.findOne(productID)
            if (!product) return res.status(404).send({ message: 'Product not found or not exists'})
            product.stock += quantity
            product.sold -= quantity
            if(product.stock != 0) product.state = 'AVAILABLE'
            await product.save()
        }
        // Guardar los cambios enbill
        let billsaved = await Bill.findOneAndUpdate(
            {_id: id, user: user},
            data,
            {new: true}
        )
        // Responder
        return res.send({message: 'Bill rechazed:', billsaved })
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error rechazing bill'})
    }
}

