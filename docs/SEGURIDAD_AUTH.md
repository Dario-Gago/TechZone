# 🔐 Seguridad y Autenticación - TechZone

## 📋 Índice
1. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
2. [Autenticación JWT](#autenticación-jwt)
3. [Autorización y Roles](#autorización-y-roles)
4. [Validación de Datos](#validación-de-datos)
5. [Protección de Rutas](#protección-de-rutas)
6. [Seguridad en el Frontend](#seguridad-en-el-frontend)
7. [Mejores Prácticas](#mejores-prácticas)

## 🛡️ Arquitectura de Seguridad

### Principios de Seguridad Implementados
- **Defense in Depth**: Múltiples capas de seguridad
- **Principle of Least Privilege**: Permisos mínimos necesarios
- **Zero Trust**: Verificación en cada request
- **Secure by Design**: Seguridad desde el diseño
- **Data Protection**: Encriptación y hashing

### Flujo de Seguridad
```
Cliente → HTTPS → CORS → Helmet → JWT Validation → Authorization → Route Handler
```

## 🔑 Autenticación JWT

### Implementación Backend

#### Generación de Tokens
```javascript
// backend/src/services/UserService.js
import jwt from 'jsonwebtoken'

export class UserService {
  // Generar token JWT con payload específico
  static _generateToken(user) {
    const payload = {
      userId: user.usuario_id,
      email: user.email,
      admin: user.admin,
      iat: Math.floor(Date.now() / 1000),  // Issued at
    }

    const options = {
      expiresIn: process.env.JWT_EXPIRE || '24h',
      issuer: 'techzone-api',
      audience: 'techzone-client',
      algorithm: 'HS256'
    }

    return jwt.sign(payload, process.env.JWT_SECRET, options)
  }

  // Verificar token (usado en middleware)
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'techzone-api',
        audience: 'techzone-client'
      })
    } catch (error) {
      throw new Error('Token inválido')
    }
  }
}
```

#### Middleware de Autenticación
```javascript
// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Token de autorización requerido',
        code: 'MISSING_TOKEN'
      })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Verificar expiración manualmente para logs
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp <= now) {
      return res.status(401).json({ 
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      admin: decoded.admin,
      iat: decoded.iat,
      exp: decoded.exp
    }
    
    // Log de acceso para auditoría
    console.log(`🔐 Auth: ${decoded.email} (${decoded.admin ? 'admin' : 'user'}) - ${req.method} ${req.originalUrl}`)
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    let message = 'Error de autenticación'
    let code = 'AUTH_ERROR'
    
    if (error.name === 'JsonWebTokenError') {
      message = 'Token inválido'
      code = 'INVALID_TOKEN'
    } else if (error.name === 'TokenExpiredError') {
      message = 'Token expirado'
      code = 'TOKEN_EXPIRED'
    } else if (error.name === 'NotBeforeError') {
      message = 'Token no válido aún'
      code = 'TOKEN_NOT_ACTIVE'
    }
    
    res.status(401).json({ message, code })
  }
}

// Middleware específico para verificar admin
export const adminMiddleware = (req, res, next) => {
  if (!req.user?.admin) {
    console.warn(`🚨 Admin access denied: ${req.user?.email} tried to access ${req.originalUrl}`)
    return res.status(403).json({ 
      message: 'Permisos de administrador requeridos',
      code: 'INSUFFICIENT_PERMISSIONS'
    })
  }
  
  next()
}

// Middleware combinado: auth + admin
export const requireAdmin = [authMiddleware, adminMiddleware]
```

### Implementación Frontend

#### AuthContext con JWT
```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cerrar sesión y limpiar estado
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setIsAdmin(false)
    
    console.log('🚪 Sesión cerrada')
  }, [])

  // Verificar expiración del token
  const checkTokenExpiration = useCallback(async () => {
    if (!token) return
    
    try {
      const decoded = jwtDecode(token)
      const now = Date.now() / 1000
      
      // Verificar si el token expira en los próximos 5 minutos
      const timeUntilExpiration = decoded.exp - now
      
      if (timeUntilExpiration <= 0) {
        // Token ya expirado
        await Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        })
        logout()
      } else if (timeUntilExpiration <= 300) {
        // Token expira en 5 minutos o menos
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Sesión por Expirar',
          text: 'Tu sesión expirará pronto. ¿Deseas renovarla?',
          showCancelButton: true,
          confirmButtonText: 'Renovar',
          cancelButtonText: 'Cerrar Sesión'
        })
        
        if (!result.isConfirmed) {
          logout()
        }
        // TODO: Implementar renovación automática de token
      }
    } catch (error) {
      console.error('Error verificando token:', error)
      logout()
    }
  }, [token, logout])

  // Cargar datos iniciales desde localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'
      const storedUser = localStorage.getItem('user')

      if (storedToken) {
        // Verificar que el token no esté expirado
        const decoded = jwtDecode(storedToken)
        const now = Date.now() / 1000
        
        if (decoded.exp > now) {
          setToken(storedToken)
          setIsAdmin(storedIsAdmin)
          
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        } else {
          // Token expirado, limpiar localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('isAdmin')
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Error cargando datos de autenticación:', error)
      // Limpiar datos corruptos
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar expiración periódicamente
  useEffect(() => {
    if (!token) return

    // Verificar inmediatamente
    checkTokenExpiration()

    // Verificar cada 30 segundos
    const interval = setInterval(checkTokenExpiration, 30000)
    
    return () => clearInterval(interval)
  }, [token, checkTokenExpiration])

  // Iniciar sesión
  const login = useCallback((newToken, userData) => {
    try {
      // Verificar que el token sea válido
      const decoded = jwtDecode(newToken)
      const adminFlag = Boolean(userData?.admin)

      localStorage.setItem('token', newToken)
      localStorage.setItem('isAdmin', adminFlag.toString())
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(newToken)
      setIsAdmin(adminFlag)
      setUser(userData)

      console.log(`🔐 Login exitoso: ${userData.email} (${adminFlag ? 'admin' : 'user'})`)
    } catch (error) {
      console.error('Error en login:', error)
      throw new Error('Token inválido recibido del servidor')
    }
  }, [])

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!token && !!user

  // Obtener información del token actual
  const getTokenInfo = useCallback(() => {
    if (!token) return null
    
    try {
      const decoded = jwtDecode(token)
      return {
        userId: decoded.userId,
        email: decoded.email,
        admin: decoded.admin,
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000),
        timeUntilExpiration: decoded.exp - (Date.now() / 1000)
      }
    } catch (error) {
      console.error('Error decodificando token:', error)
      return null
    }
  }, [token])

  const value = {
    token,
    user,
    isAdmin,
    loading,
    isAuthenticated,
    login,
    logout,
    getTokenInfo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
```

## 👮 Autorización y Roles

### Sistema de Roles
```javascript
// Roles definidos en el sistema
const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Permisos por rol
const PERMISSIONS = {
  [ROLES.USER]: [
    'view_products',
    'purchase_products',
    'view_own_orders',
    'manage_own_cart'
  ],
  [ROLES.ADMIN]: [
    'view_products',
    'manage_products',
    'view_all_users',
    'manage_users',
    'view_all_orders',
    'manage_orders',
    'view_analytics'
  ]
}

// Verificador de permisos
export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.includes(permission) || false
}
```

### Protección de Rutas Backend
```javascript
// Rutas con diferentes niveles de autorización
router.get('/productos', getProducts)                    // Público
router.post('/productos', requireAdmin, createProduct)   // Solo admin
router.get('/usuarios', authMiddleware, getUsers)        // Autenticado
router.delete('/usuarios/:id', requireAdmin, deleteUser) // Solo admin

// Middleware para verificar ownership
export const requireOwnership = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId
  const requestingUserId = req.user.userId
  
  // Admin puede acceder a todo
  if (req.user.admin) {
    return next()
  }
  
  // Usuario solo puede acceder a sus propios recursos
  if (resourceUserId && resourceUserId != requestingUserId) {
    return res.status(403).json({
      message: 'No tienes permisos para acceder a este recurso',
      code: 'RESOURCE_ACCESS_DENIED'
    })
  }
  
  next()
}
```

## 🛡️ Validación de Datos

### Validación Backend
```javascript
// backend/src/validators/userValidators.js
export const validateUserRegistration = (userData) => {
  const { nombre, email, password, telefono } = userData
  const errors = []

  // Validaciones obligatorias
  if (!nombre || nombre.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Email inválido')
  }

  if (!password || password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  // Validaciones de formato
  if (nombre && nombre.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres')
  }

  if (telefono && !isValidPhone(telefono)) {
    errors.push('Formato de teléfono inválido')
  }

  // Validaciones de seguridad
  if (password && !isStrongPassword(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Funciones de validación
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

const isStrongPassword = (password) => {
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasUpper && hasLower && hasNumber
}

// Sanitización de datos
export const sanitizeUserInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()                           // Eliminar espacios
    .replace(/[<>]/g, '')             // Prevenir XSS básico
    .substring(0, 1000)               // Limitar longitud
}
```

### Validación Frontend
```jsx
// src/hooks/useFormValidation.js
import { useState, useCallback } from 'react'

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name]
    if (!rules) return null

    for (const rule of rules) {
      const error = rule(value, values)
      if (error) return error
    }
    return null
  }, [validationRules, values])

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validar si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField, values])

  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {}))

    return isValid
  }, [validationRules, validateField, values])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).length === 0
  }
}

// Reglas de validación reutilizables
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Este campo es obligatorio'
    }
    return null
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido'
    }
    return null
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Debe tener al menos ${min} caracteres`
    }
    return null
  },

  strongPassword: (value) => {
    if (value && value.length >= 8) {
      const hasUpper = /[A-Z]/.test(value)
      const hasLower = /[a-z]/.test(value)
      const hasNumber = /\d/.test(value)
      
      if (!hasUpper || !hasLower || !hasNumber) {
        return 'Debe contener mayúscula, minúscula y número'
      }
    }
    return null
  }
}
```

## 🔒 Protección de Rutas

### Rutas Protegidas Frontend
```jsx
// src/components/PrivateRoute.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const PrivateRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Debes iniciar sesión para acceder a esta página'
        }} 
        replace 
      />
    )
  }

  // Verificar permisos de admin si es requerido
  if (adminRequired && !isAdmin) {
    return (
      <Navigate 
        to="/dashboard" 
        state={{ 
          message: 'No tienes permisos para acceder a esta página'
        }} 
        replace 
      />
    )
  }

  return children
}

// Componente específico para rutas de admin
export const AdminRoute = ({ children }) => (
  <PrivateRoute adminRequired={true}>
    {children}
  </PrivateRoute>
)

export default PrivateRoute
```

### Hook de Permisos
```jsx
// src/hooks/usePermissions.js
import { useAuth } from '../contexts/AuthContext'

export const usePermissions = () => {
  const { isAuthenticated, isAdmin, user } = useAuth()

  const can = (permission) => {
    if (!isAuthenticated) return false

    const permissions = {
      'view_products': true,
      'manage_products': isAdmin,
      'view_users': isAdmin,
      'manage_users': isAdmin,
      'view_analytics': isAdmin,
      'make_purchases': isAuthenticated
    }

    return permissions[permission] || false
  }

  const canAccess = (resource, action = 'view') => {
    // Lógica más compleja de permisos por recurso
    const rules = {
      'products': {
        'view': true,
        'create': isAdmin,
        'edit': isAdmin,
        'delete': isAdmin
      },
      'users': {
        'view': isAdmin,
        'edit': (userId) => isAdmin || user?.usuario_id === userId,
        'delete': isAdmin
      },
      'orders': {
        'view': (userId) => isAdmin || user?.usuario_id === userId,
        'create': isAuthenticated,
        'edit': isAdmin
      }
    }

    return rules[resource]?.[action] || false
  }

  return {
    can,
    canAccess,
    isAuthenticated,
    isAdmin
  }
}
```

## 🔐 Mejores Prácticas Implementadas

### Seguridad de Contraseñas
```javascript
// Hashing con bcrypt (backend)
import bcrypt from 'bcryptjs'

export class PasswordService {
  // Hash de contraseña con salt rounds altos
  static async hashPassword(password) {
    const saltRounds = 12 // Alto para seguridad
    return await bcrypt.hash(password, saltRounds)
  }

  // Verificación de contraseña
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Validación de fortaleza
  static validatePasswordStrength(password) {
    const minLength = 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpper && hasLower && hasNumber,
      strength: {
        length: password.length >= minLength,
        uppercase: hasUpper,
        lowercase: hasLower,
        number: hasNumber,
        special: hasSpecial
      }
    }
  }
}
```

### Headers de Seguridad
```javascript
// Configuración de Helmet (backend)
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' }
}))
```

### Logging de Seguridad
```javascript
// Logger de eventos de seguridad
export class SecurityLogger {
  static logAuthAttempt(email, success, ip, userAgent) {
    const event = {
      type: 'AUTH_ATTEMPT',
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    }
    
    console.log(JSON.stringify(event))
    
    // En producción: enviar a servicio de logging
    // this.sendToLogService(event)
  }

  static logSuspiciousActivity(userId, activity, details) {
    const event = {
      type: 'SUSPICIOUS_ACTIVITY',
      userId,
      activity,
      details,
      timestamp: new Date().toISOString()
    }
    
    console.warn(JSON.stringify(event))
  }
}
```

---

*Esta implementación de seguridad sigue las mejores prácticas de la industria con múltiples capas de protección, validación robusta y logging de seguridad.*
