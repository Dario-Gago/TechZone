import express from 'express'
import { login, register } from '../controllers/authController.js'
const router = express.Router()

// Ruta para login
router.post('/login', login)

// Ruta para registro
router.post('/register', register)

export default router
