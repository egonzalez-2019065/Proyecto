import { Router } from 'express'
import { billRechazed, getBill, saveBill, test } from './bill.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/test', test)
api.post('/saveBill',[validateJwt], saveBill)
api.get('/getBill',[validateJwt], getBill)
api.put('/billRechazed/:id',[validateJwt], billRechazed)
export default api