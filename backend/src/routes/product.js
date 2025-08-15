import express from 'express'
import {
  getAllProductsController,
  getProductByIdController,
  getFeaturedProductsController,
  createProductController,
  getProductsByCategoryController,
  searchProductsController,
  deleteProductController,
  updateProductController
} from '../controllers/productController.js'
import { verifyToken } from '../../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/productos - Obtener todos los productos
router.get('/', getAllProductsController)

// GET /api/productos/search?q=termino - Buscar productos
router.get('/search', searchProductsController)

// GET /api/productos/destacados - Obtener productos destacados
router.get('/destacados', getFeaturedProductsController)

// GET /api/productos/categoria/:category - Obtener productos por categoría
router.get('/categoria/:category', getProductsByCategoryController)

// GET /api/productos/categoria/:category/:subcategory - Obtener productos por categoría y subcategoría
router.get('/categoria/:category/:subcategory', getProductsByCategoryController)

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', getProductByIdController)

// POST /api/productos - Crear un nuevo producto
router.post('/', verifyToken, createProductController)

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', verifyToken, deleteProductController)

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', verifyToken, updateProductController)

export default router
