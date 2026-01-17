// pix.routes.js
import { Router } from 'express'
import { gerarPix } from '../controllers/pix.controller.js'

const router = Router()
router.post('/', gerarPix)

export default router
