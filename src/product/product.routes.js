import express from 'express'
import { deleteProduct, editProduct, getCategory, getProducts, getSoldProduct, saveProduct, searchProduct, searchProductByID, test, updateStock } from './product.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'
 
const api = express.Router()

api.get('/test', test)
api.post('/saveProduct',[validateJwt], [isAdmin], saveProduct)
api.put('/editProduct/:id',[validateJwt], [isAdmin], editProduct)
api.put('/updateStock/:id',[validateJwt], [isAdmin], updateStock)
api.delete('/deleteProduct/:id',[validateJwt], [isAdmin], deleteProduct)
api.post('/searchProduct',[validateJwt], searchProduct)
api.get('/searchProductById/:id',[validateJwt], searchProductByID)
api.get('/getProducts',[validateJwt], getProducts)
api.get('/getSoldProduct',[validateJwt], getSoldProduct)
api.get('/getCategory/:id',[validateJwt], getCategory)

export default api