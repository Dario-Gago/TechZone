import express from 'express'
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  deleteProductController,
  updateProductController
} from '../controllers/productController.js'
import { verifyToken } from '../../middleware/authMiddleware.js'
import { 
  validateProductCreation, 
  validateProductUpdate, 
  validateProductId 
} from '../validators/productValidators.js'

const router = express.Router()

// GET /api/productos - Obtener todos los productos
router.get('/', getAllProductsController)

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', validateProductId, getProductByIdController)

// POST /api/productos - Crear un nuevo producto
router.post('/', verifyToken, validateProductCreation, createProductController)

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', verifyToken, validateProductId, deleteProductController)

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', verifyToken, validateProductId, validateProductUpdate, updateProductController)

export default router
