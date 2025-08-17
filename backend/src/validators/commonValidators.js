// Validadores comunes reutilizables

// Validar ID numérico genérico
export const validateNumericId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName]
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        error: 'Parámetro inválido',
        message: `${paramName} debe ser un número válido`
      })
    }
    
    next()
  }
}

// Validar que el request body no esté vacío
export const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Datos requeridos',
      message: 'El cuerpo de la petición no puede estar vacío'
    })
  }
  
  next()
}

// Validar campos de texto no vacíos
export const validateRequiredString = (field, message) => {
  return (req, res, next) => {
    const value = req.body[field]
    
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return res.status(400).json({
        error: 'Campo requerido',
        message: message || `${field} es obligatorio`
      })
    }
    
    next()
  }
}

// Validar números positivos
export const validatePositiveNumber = (field, message) => {
  return (req, res, next) => {
    const value = req.body[field]
    
    if (value !== undefined && (isNaN(Number(value)) || Number(value) <= 0)) {
      return res.status(400).json({
        error: 'Campo inválido',
        message: message || `${field} debe ser un número positivo`
      })
    }
    
    next()
  }
}

// Validar longitud máxima de string
export const validateMaxLength = (field, maxLength, message) => {
  return (req, res, next) => {
    const value = req.body[field]
    
    if (value && typeof value === 'string' && value.length > maxLength) {
      return res.status(400).json({
        error: 'Campo inválido',
        message: message || `${field} no puede exceder ${maxLength} caracteres`
      })
    }
    
    next()
  }
}
