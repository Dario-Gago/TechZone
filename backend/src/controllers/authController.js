import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

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
    const token = jwt.sign(
      {
        userId: user.usuario_id,
        email: user.email,
        admin: user.admin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '5m' }
    )

    // Preparar datos del usuario (sin la contraseña)
    const userData = {
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      admin: user.admin,
      fecha_registro: user.fecha_registro
    }

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
