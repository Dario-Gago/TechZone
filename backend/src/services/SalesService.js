import * as SalesModel from '../models/Sales.js'

export class SalesService {
  // Obtener ventas (admin: todas, usuario: solo las suyas)
  static async getSales(user) {
    return await SalesModel.findSales(user)
  }

  // Crear nueva venta
  static async createSale(userId, saleData) {
    const { items, total } = saleData
    
    // Validaciones de negocio
    this._validateSaleData(userId, items, total)
    
    // Procesar items para asegurar formato correcto
    const processedItems = this._processItems(items)
    
    // Validar total calculado vs enviado
    const calculatedTotal = this._calculateTotal(processedItems)
    if (Math.abs(calculatedTotal - total) > 0.01) {
      throw new Error('El total enviado no coincide con el total calculado')
    }
    
    // Crear venta
    return await SalesModel.createSaleWithItems(userId, processedItems, total)
  }

  // Actualizar estado de venta
  static async updateSaleStatus(ventaId, nuevoEstado, requestingUser) {
    // Solo admin puede actualizar estado
    if (!requestingUser.admin) {
      throw new Error('Solo los administradores pueden actualizar el estado de las ventas')
    }
    
    // Validar estado
    this._validateSaleStatus(nuevoEstado)
    
    return await SalesModel.updateSaleStatus(ventaId, nuevoEstado)
  }

  // Obtener ventas de un usuario específico
  static async getUserSales(userId) {
    const userObj = { userId, admin: false }
    return await SalesModel.findSales(userObj)
  }

  // Validaciones privadas
  static _validateSaleData(userId, items, total) {
    if (!userId) {
      throw new Error('ID de usuario requerido')
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items de venta requeridos')
    }
    
    if (!total || total <= 0) {
      throw new Error('Total de venta debe ser mayor a 0')
    }
    
    // Validar cada item
    items.forEach((item, index) => {
      if (!item.producto_id) {
        throw new Error(`Item ${index + 1}: ID de producto requerido`)
      }
      
      if (!item.cantidad || item.cantidad <= 0) {
        throw new Error(`Item ${index + 1}: Cantidad debe ser mayor a 0`)
      }
      
      if (!item.precio_unitario || item.precio_unitario <= 0) {
        throw new Error(`Item ${index + 1}: Precio unitario debe ser mayor a 0`)
      }
    })
  }

  static _validateSaleStatus(estado) {
    const validStatuses = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
    if (!validStatuses.includes(estado)) {
      throw new Error(`Estado inválido. Estados válidos: ${validStatuses.join(', ')}`)
    }
  }

  // Procesar items para formato consistente
  static _processItems(items) {
    return items.map(item => ({
      producto_id: item.producto_id || item.id,
      cantidad: Number(item.cantidad || item.quantity),
      precio_unitario: Number(item.precio_unitario || item.price)
    }))
  }

  // Calcular total de items
  static _calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (item.cantidad * item.precio_unitario)
    }, 0)
  }
}
