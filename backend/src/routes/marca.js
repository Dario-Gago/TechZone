import express from 'express'
import {
  getAllMarcasController,
  getMarcaByIdController,
  createMarcaController,
  updateMarcaController,
  deleteMarcaController
} from '../controllers/marcaController.js'
import { authMiddleware, adminMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getAllMarcasController) // Obtener todas las marcas
router.get('/:id', getMarcaByIdController) // Obtener marca por ID

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, adminMiddleware, createMarcaController) // Crear marca
router.put('/:id', authMiddleware, adminMiddleware, updateMarcaController) // Actualizar marca
router.delete('/:id', authMiddleware, adminMiddleware, deleteMarcaController) // Eliminar marca

export default router
