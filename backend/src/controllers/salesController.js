// salesController.js - VERSIÓN CORREGIDA
import {
  findSales,
  createSaleWithItems,
  updateSaleStatus
} from '../models/Sales.js'

// ✅ Get sales
export const getSales = async (req, res) => {
  try {
    const user = req.user
    const sales = await findSales(user)
    res.json(sales)
  } catch (err) {
    console.error('❌ Error en getSales:', err)
    res.status(500).json({ error: err.message })
  }
}

// ✅ Create sale - CORREGIDO
export const createSale = async (req, res) => {
  try {
    const user = req.user
    const { items, total } = req.body

    console.log('📡 Datos recibidos en createSale:')
    console.log('👤 Usuario:', user)
    console.log('📦 Items:', items)
    console.log('💰 Total:', total)

    // Validaciones
    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'Items son requeridos y deben ser un array' })
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total debe ser mayor a 0' })
    }

    // Validar cada item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.producto_id || !item.cantidad || !item.precio_unitario) {
        return res.status(400).json({
          error: `Item ${
            i + 1
          } inválido: requiere producto_id, cantidad y precio_unitario`,
          item: item
        })
      }

      if (item.cantidad <= 0 || item.precio_unitario <= 0) {
        return res.status(400).json({
          error: `Item ${
            i + 1
          }: cantidad y precio_unitario deben ser mayores a 0`,
          item: item
        })
      }
    }

    const result = await createSaleWithItems(user.userId, items, total)

    res.status(201).json({
      message: 'Venta creada exitosamente',
      id: result.id,
      venta_id: result.venta_id
    })
  } catch (err) {
    console.error('❌ Error en createSale:', err)
    res.status(500).json({ error: err.message })
  }
}

// ✅ Update sale status
export const updateSale = async (req, res) => {
  try {
    const { ventaId } = req.params
    const { estado } = req.body

    if (!estado) {
      return res.status(400).json({ error: 'Estado es requerido' })
    }

    const updatedSale = await updateSaleStatus(ventaId, estado)

    if (!updatedSale) {
      return res.status(404).json({ error: 'Venta no encontrada' })
    }

    res.json({ message: 'Estado actualizado correctamente', sale: updatedSale })
  } catch (err) {
    console.error('❌ Error en updateSale:', err)
    res.status(500).json({ error: err.message })
  }
}

// ✅ Get user sales
export const getUserSales = async (req, res) => {
  try {
    const userId = req.user.userId
    const sales = await findSales(req.user)
    res.json(sales)
  } catch (err) {
    console.error('❌ Error en getUserSales:', err)
    res.status(500).json({ error: err.message })
  }
}
