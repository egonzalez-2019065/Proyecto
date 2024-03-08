import { Router } from 'express'
import { deleteCart, deleteProduct, getCart, saveCart, test, updateCart } from './cart.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'


const api = Router()

api.post('/test', test)
api.post('/saveCart', [validateJwt],  saveCart)
api.put('/updateCart/:id', [validateJwt], updateCart)
api.post('/deleteProduct/:id', [validateJwt], deleteProduct)
api.delete('/deleteCart/:id', [validateJwt], deleteCart)
api.get('/getCart', [validateJwt], getCart)

export default api