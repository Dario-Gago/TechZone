import jwt from 'jsonwebtoken'

// Middleware para verificar token JWT
export const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization

    // Verificar si existe el header Authorization
    if (!authHeader) {
      return res.status(401).json({
        message: 'Token de acceso requerido'
      })
    }

    // Verificar si el header tiene el formato correcto (Bearer token)
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Formato de token inválido. Use: Bearer <token>'
      })
    }

    // Extraer el token del header
    const token = authHeader.substring(7) // Remover "Bearer "

    // Verificar si el token existe después de extraerlo
    if (!token) {
      return res.status(401).json({
        message: 'Token no proporcionado'
      })
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Agregar la información del usuario decodificada al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      admin: decoded.admin
    }

    // Continuar con el siguiente middleware o controlador
    next()
  } catch (error) {
    console.error('Token verification error:', error)

    // Manejar diferentes tipos de errores de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado'
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token inválido'
      })
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        message: 'Token aún no válido'
      })
    }

    // Error genérico
    return res.status(401).json({
      message: 'Error de autenticación'
    })
  }
}

// Middleware para verificar si el usuario es administrador
export const adminMiddleware = (req, res, next) => {
  try {
    // Verificar si el usuario está autenticado (debe ejecutarse después de authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    // Verificar si el usuario es administrador
    if (!req.user.admin) {
      return res.status(403).json({
        message: 'Acceso denegado. Se requieren privilegios de administrador'
      })
    }

    // El usuario es administrador, continuar
    next()
  } catch (error) {
    console.error('Admin verification error:', error)
    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

// Exportar también verifyToken para compatibilidad hacia atrás
export const verifyToken = authMiddleware
