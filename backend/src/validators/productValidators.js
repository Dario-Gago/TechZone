// Validadores para productos
export const validateProductCreation = (req, res, next) => {
  const { nombre, precio_normal } = req.body
  
  // Validar nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      error: 'Campo inválido',
      message: 'El nombre del producto es obligatorio'
    })
  }
  
  // Validar precio normal
  if (!precio_normal || Number(precio_normal) <= 0) {
    return res.status(400).json({
      error: 'Campo inválido', 
      message: 'El precio normal debe ser un número mayor a 0'
    })
  }
  
  next()
}

export const validateProductUpdate = (req, res, next) => {
  const { nombre, precio_normal, stock } = req.body
  
  // Validar nombre si se proporciona
  if (nombre !== undefined) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        error: 'Campo inválido',
        message: 'El nombre del producto no puede estar vacío'
      })
    }
  }
  
  // Validar precio normal si se proporciona
  if (precio_normal !== undefined) {
    if (Number(precio_normal) <= 0) {
      return res.status(400).json({
        error: 'Campo inválido',
        message: 'El precio normal debe ser mayor a 0'
      })
    }
  }
  
  // Validar stock si se proporciona
  if (stock !== undefined) {
    if (Number(stock) < 0) {
      return res.status(400).json({
        error: 'Campo inválido',
        message: 'El stock no puede ser negativo'
      })
    }
  }
  
  next()
}

export const validateProductId = (req, res, next) => {
  const { id } = req.params
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Parámetro inválido',
      message: 'ID de producto inválido'
    })
  }
  
  next()
}
