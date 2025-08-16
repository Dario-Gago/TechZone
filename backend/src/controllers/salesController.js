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
    res.status(500).json({ error: err.message })
  }
}

// ✅ Create sale
export const createSale = async (req, res) => {
  try {
    const user = req.user
    const { items, total } = req.body

    const ventaId = await createSaleWithItems(user.userId, items, total)

    res.json({ message: 'Sale created successfully', ventaId })
  } catch (err) {
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
    res.json({ message: 'Estado actualizado correctamente', sale: updatedSale })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// salesController.js
export const getUserSales = async (req, res) => {
  try {
    const userId = req.user.userId // viene del middleware verifyToken
    const sales = await findSales(req.user) // tu función findSales ya filtra por user si no es admin
    res.json(sales)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
