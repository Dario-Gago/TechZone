// Validadores para usuarios
export const validateUserRegistration = (req, res, next) => {
  const { nombre, email, password } = req.body
  
  // Validar campos requeridos
  if (!nombre || !email || !password) {
    return res.status(400).json({
      error: 'Campos requeridos',
      message: 'Nombre, email y contraseña son requeridos'
    })
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Campo inválido',
      message: 'El formato del email no es válido'
    })
  }
  
  // Validar longitud de contraseña
  if (password.length < 8) {
    return res.status(400).json({
      error: 'Campo inválido',
      message: 'La contraseña debe tener al menos 8 caracteres'
    })
  }
  
  next()
}

export const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Campos requeridos',
      message: 'Email y contraseña son requeridos'
    })
  }
  
  next()
}

export const validateUserId = (req, res, next) => {
  const { id } = req.params
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Parámetro inválido',
      message: 'ID de usuario inválido'
    })
  }
  
  next()
}
