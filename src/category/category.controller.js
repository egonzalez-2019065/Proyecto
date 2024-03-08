'use strict'

import Product from '../product/product.model.js'
import Category from './category.model.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test category is running'})
}
// Categoría creada por defecto
const defaultCategory = {
    name: 'Default',
    description: 'Categoria creada por defecto'
}

// Inserción de datos 
export const insertDefaultCategory = async(req, res) =>{
    try{
        //Verificar que se cree una única vez la categoría de Default
        const uniqueCategory = await Category.findOne({name: defaultCategory.name})
        if(uniqueCategory){
            console.log('This category alread exists')
        }else{
            //Crear la nueva categoría
            await Category.create(defaultCategory)
            //Responder al usuario
            console.log('Create default category')
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating a default category'})
    }
}

export const saveCategory = async(req, res) =>{
    try{
        //Capturar los datos
        let data = req.body
        //Guardar la categoría 
        let category = new Category(data)
        await category.save()
        //Responder al usuario
        return res.send({message: `Category saved succesfully: ${category.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving category'})
    }
}

export const updateCategory = async(req, res) =>{
    try{
        //Categoría a actualizar
        let { id }  = req.params
        //Datos a actualizar
        let data  = req.body
        //Actualizar
        let category  = await Category.findOne({_id: id})
        if(!category) return res.status(404).send({message: 'Category not exist or not found'})
        //Responder
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        return res.send({message: 'Category updated successfully', updatedCategory})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const gettAllCategories = async(req, res) =>{
    try{
        let categories = await Category.find()
        return res.send({message: 'Categories found:', categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting categories'})
    }
}

export const deleteCategory = async(req, res) => {
    try{
        //Id de la categoría a eliminar 
        let { id } = req.params
        // Ver que exista
        let category = await Category.findOne({_id: id}) 
        if(!category ) return res.status(500).send({message: 'Category not exists or not found'})
        //Asignar  una categoría por defecto a los productos
        let defaultCategory = await Category.findOne({name: 'Default'})
        await Product.updateMany({category: category._id}, {$set: {category: defaultCategory._id}});
        // Eliminar
        let deletedCategory = await Category.findOneAndDelete({ _id: id });
        // Responder
        return res.send({message: `Category ${deletedCategory.name} was deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting category'})
    }
}


