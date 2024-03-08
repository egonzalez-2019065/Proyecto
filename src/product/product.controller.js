'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test product is running'})
}


// Guardar un producto
export const saveProduct = async(req, res) =>{
    try{
        //Capturar los datos
        let data = req.body
        //Guardar el product 
        let product = new Product(data)
        // Guardar por defecto el AVAILABLE
        product.state = 'AVAILABLE'
        //Verificar que existe la categoría
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(404).send({message: 'Category not found or not exist'})
        await product.save()
        //Responder al usuario
        return res.send({message: `Producto saved succesfully: ${product.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving product'})
    }
}

// Editar un producto
export const editProduct  = async(req, res) => {
    try{
        // Obtener id 
        let { id } = req.params
        // Identificar que existe
        let product = await Product.findOne({_id: id})
        if(!product) return res.status(404).send({message: 'Product not exists'})
        // Obtener los datos que voy a actualizar 
        let data = req.body
        // Actualizar 
        let updateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data, 
            {new:true}
        )
        // Responder al usuario
        return res.send({message: 'Updated product', updateProduct})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error editing product'})
    }
}

// Editar el stock
export const updateStock  = async(req, res) => {
    try{
        // Obtener id 
        let { id } = req.params
        // Identificar que existe
        let product = await Product.findOne({_id: id})
        if(!product) return res.status(404).send({message: 'Product not exists'})
        // Obtener los datos que voy a actualizar 
        let data  = req.body
        // Validar que el stock no sea menor a cero
        if(data.stock < 0) return res.status(500).send({message: 'Stock cannot less than 0'})
        //Actualizar estado 
        if(data.stock != 0){
            data.state = 'AVAILABLE' 
        }else{
            data.state = 'SOLD OUT'
        }
        //Actualizar el stock 
        data.stock = product.stock + parseInt(data.stock)
        // Actualizar 
        let updateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data, 
            {new:true}
        )
        // Responder al usuario
        return res.send({message: 'Updated product', updateProduct})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error editing product'})
    }
}

// Eliminar un producto 
export const deleteProduct = async(req, res) => {
    try{
        // Traer el id 
        let { id } = req.params
        // Ver si existe y eliminarlo
        let product = await Product.findOneAndDelete({_id: id})
        if(!product) return res.status(404).send({message: 'Product not found and not deleted'})
        // Responder al usuario
        return res.send({message: `Product eliminated succesfully: ${product.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleted product'})
    }
}

// Buscar un producto por nombre
export const searchProduct = async(req, res) => {
    try{
        // Obtener el dato de busqueda 
        let { name } = req.body
        const regex = new RegExp(name, 'i') 
        // Buscar 
        let product = await Product.find(
            {name: regex}
        ).populate('category', 'name')
        // Responder si todo sale bien 
        return res.send({message: 'Product found:', product})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error searching product'})
    }
}

export const searchProductByID = async(req, res) => {
    try{
        // Obtener el dato de busqueda 
        let { id } = req.params 
        // Buscar 
        let product = await Product.find(
            {_id: id}
        ).populate('category', 'name')
        // Responder si todo sale bien 
        return res.send({message: 'Product found:', product})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error searching product'})
    }
}

// Traer todo el catalogo de productos
export const getProducts = async(req, res) => {
    try{ 
        // Buscar 
        let product = await Product.find().populate('category', 'name')
        // Responder si todo sale bien 
        return res.send({message: 'Product found:', product})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error searching product'})
    }
}

//Traer los productos más vendidos
export const getSoldProduct = async (req, res) => {
    try {
        //Buscar los productos
      const soldProducts = await Product.find()
        .sort({ sold: -1 }).populate('category', 'name') // Sort los ordena de forma descendente
        .exec() // Ejecución
        return res.send({message: 'Product found:', soldProducts})
    } catch (err) {
        console.error(err)
        return res.status(404).send({message: 'Error searching product'})
    }
  }

// Traer los productos por categorías 
export const getCategory = async(req, res) => {
    try{
        //Traer el id de la categoría
        let { id } = req.params
        // Buscar a la categoría
        let category = await Product.find({category: id}).populate('category', 'name')
        if(!category) return res.status(404).send({message: 'Category not exists'})
        // Responder al usuario
        return res.send({message: 'Products found:', category})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}
