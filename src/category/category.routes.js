'use strict'

import express from 'express'
import { deleteCategory, gettAllCategories, saveCategory, test, updateCategory } from './category.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.get('/test', test)
api.post('/saveCategory', [validateJwt], [isAdmin], saveCategory)
api.put('/updateCategory/:id',[validateJwt], [isAdmin], updateCategory)
api.get('/getAllCategories',[validateJwt], gettAllCategories)
api.delete('/deleteCategory/:id',[validateJwt], [isAdmin], deleteCategory)

export default api