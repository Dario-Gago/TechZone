import express from 'express'
import { login, register } from '../controllers/authController.js'
import { validateUserLogin, validateUserRegistration } from '../validators/userValidators.js'

const router = express.Router()

// Ruta para login
router.post('/login', validateUserLogin, login)

// Ruta para registro
router.post('/register', validateUserRegistration, register)

export default router
