import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

// Función auxiliar para generar token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.usuario_id,
      email: user.email,
      admin: user.admin
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '5m' }
  )
}

// Función auxiliar para formatear datos del usuario
const formatUserData = (user) => {
  return {
    usuario_id: user.usuario_id,
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    direccion: user.direccion,
    admin: user.admin,
    fecha_registro: user.fecha_registro
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos'
      })
    }

    // Buscar usuario por email
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }

    // Verificar contraseña
    const isValidPassword = await User.verifyPassword(
      password,
      user.password_hash
    )

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }

    // Generar JWT token
    const token = generateToken(user)

    // Preparar datos del usuario (sin la contraseña)
    const userData = formatUserData(user)

    // Devolver token y datos del usuario
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: userData
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

export const register = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, email y contraseña son requeridos'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'El formato del email no es válido'
      })
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres'
      })
    }

    // Validar longitud de campos
    if (nombre.length > 100) {
      return res.status(400).json({
        message: 'El nombre no puede exceder 100 caracteres'
      })
    }

    if (email.length > 100) {
      return res.status(400).json({
        message: 'El email no puede exceder 100 caracteres'
      })
    }

    if (telefono && telefono.length > 20) {
      return res.status(400).json({
        message: 'El teléfono no puede exceder 20 caracteres'
      })
    }

    // Verificar si el email ya existe
    const emailExists = await User.emailExists(email)
    if (emailExists) {
      return res.status(409).json({
        message: 'Este email ya está registrado'
      })
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password,
      telefono: telefono?.trim(),
      direccion: direccion?.trim()
    })

    // Generar token para el nuevo usuario
    const token = generateToken(newUser)

    // Preparar datos del usuario
    const userData = formatUserData(newUser)

    // Responder con éxito
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userData
    })
  } catch (error) {
    console.error('Register error:', error)

    // Manejar errores específicos de base de datos
    if (error.code === '23505') {
      // Unique violation
      return res.status(409).json({
        message: 'Este email ya está registrado'
      })
    }

    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}
