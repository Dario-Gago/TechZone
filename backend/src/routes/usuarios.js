import { Router } from 'express'
import { getAllUsers, deleteUser } from '../controllers/authController.js'
import { verifyToken } from '../../middleware/authMiddleware.js'

const router = Router()

// Ruta para obtener todos los usuarios (solo admin)
router.get('/', verifyToken, getAllUsers)
// En tu backend, añade esta ruta:
router.delete('/:id', verifyToken, deleteUser)
export default router
