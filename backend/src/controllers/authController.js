import { UserService } from '../services/UserService.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await UserService.authenticateUser(email, password)
    
    res.status(200).json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    })
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }
    
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

export const register = async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body)
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: result.token,
      user: result.user
    })
  } catch (error) {
    console.error('Register error:', error)

    // Manejar errores específicos
    if (error.message === 'Este email ya está registrado') {
      return res.status(409).json({
        message: 'Este email ya está registrado'
      })
    }
    
    // Errores de validación
    if (error.message.includes('requeridos') || 
        error.message.includes('válido') || 
        error.message.includes('caracteres')) {
      return res.status(400).json({
        message: error.message
      })
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    const users = await UserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    const { id } = req.params
    const deletedUser = await UserService.deleteUser(id, req.user)

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        usuario_id: deletedUser.usuario_id,
        nombre: deletedUser.nombre,
        email: deletedUser.email
      }
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)

    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    if (error.message.includes('administrador') || error.message.includes('propia cuenta')) {
      return res.status(400).json({
        message: error.message
      })
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}
