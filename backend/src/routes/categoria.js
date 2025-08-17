import express from 'express'
import {
  getAllCategoriasController,
  getCategoriaByIdController,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController,
  assignCategoriaToProductController,
  removeCategoriaFromProductController,
  getCategoriasOfProductController
} from '../controllers/categoriaController.js'
import { authMiddleware, adminMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getAllCategoriasController) // Obtener todas las categorías
router.get('/:id', getCategoriaByIdController) // Obtener categoría por ID
router.get('/product/:productId', getCategoriasOfProductController) // Obtener categorías de un producto

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, adminMiddleware, createCategoriaController) // Crear categoría
router.put('/:id', authMiddleware, adminMiddleware, updateCategoriaController) // Actualizar categoría
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategoriaController) // Eliminar categoría

// Rutas para asignación de categorías a productos
router.post('/assign', authMiddleware, adminMiddleware, assignCategoriaToProductController) // Asignar categoría a producto
router.delete('/product/:productId/category/:categoryId', authMiddleware, adminMiddleware, removeCategoriaFromProductController) // Remover categoría de producto

export default router
