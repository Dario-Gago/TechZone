import express from 'express'
import {
  getSales,
  createSale,
  updateSale,
  getUserSales
} from '../controllers/salesController.js'
import { verifyToken } from '../../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, getSales)
router.post('/', verifyToken, createSale)
router.patch('/:ventaId', verifyToken, updateSale)
router.get('/me', verifyToken, getUserSales)

export default router
