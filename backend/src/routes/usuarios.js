import { Router } from 'express'
import { getAllUsers } from '../controllers/authController.js'
import { verifyToken } from '../../middleware/authMiddleware.js'

const router = Router()

// Ruta para obtener todos los usuarios (solo admin)
router.get('/', verifyToken, getAllUsers)

export default router
