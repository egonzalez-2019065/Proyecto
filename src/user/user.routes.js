import express from 'express'
import { validateJwt, isOneSelf, isAdmin } from '../middlewares/validate-jwt.js'
import { test, register, login, updateUser, deleteUser, updatePassword, registerAdmin } from './user.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/registerAdmin', [validateJwt], [isAdmin], registerAdmin)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], [isOneSelf] , updateUser)
api.delete('/deleteUser/:id', [validateJwt], [isOneSelf], deleteUser)
api.put('/updatePassword', [validateJwt], updatePassword)

export default api