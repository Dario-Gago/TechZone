import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

export class UserService {
  // Autenticar usuario
  static async authenticateUser(email, password) {
    // Validaciones básicas
    this._validateAuthData(email, password)
    
    // Buscar usuario por email
    const user = await User.findByEmail(email)
    if (!user) {
      throw new Error('Credenciales inválidas')
    }
    
    // Verificar contraseña
    const isValidPassword = await User.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas')
    }
    
    // Generar token
    const token = this._generateToken(user)
    
    // Retornar datos del usuario sin contraseña
    const userData = this._formatUserData(user)
    
    return { token, user: userData }
  }

  // Registrar nuevo usuario
  static async registerUser(userData) {
    const { nombre, email, password, telefono, direccion } = userData
    
    // Validaciones de negocio
    await this._validateRegistrationData(userData)
    
    // Verificar si el email ya existe
    const emailExists = await User.emailExists(email)
    if (emailExists) {
      throw new Error('Este email ya está registrado')
    }
    
    // Crear usuario
    const newUser = await User.create({
      nombre,
      email,
      password,
      telefono,
      direccion
    })
    
    // Generar token para el nuevo usuario
    const token = this._generateToken(newUser)
    
    // Retornar datos formateados
    const formattedUser = this._formatUserData(newUser)
    
    return { token, user: formattedUser }
  }

  // Obtener todos los usuarios (solo admin)
  static async getAllUsers() {
    return await User.findAll()
  }

  // Obtener usuario por ID
  static async getUserById(userId) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    return user
  }

  // Eliminar usuario
  static async deleteUser(userId, requestingUser) {
    // Verificar que el usuario existe
    const userToDelete = await this.getUserById(userId)
    
    // Validaciones de negocio
    if (userToDelete.admin) {
      throw new Error('No se puede eliminar a otro administrador')
    }
    
    if (requestingUser.userId === userId) {
      throw new Error('No puedes eliminar tu propia cuenta')
    }
    
    return await User.deleteById(userId)
  }

  // Validaciones privadas
  static _validateAuthData(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }
  }

  static async _validateRegistrationData(userData) {
    const { nombre, email, password, telefono } = userData
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      throw new Error('Nombre, email y contraseña son requeridos')
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido')
    }
    
    // Validar longitud de contraseña
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }
    
    // Validar longitud de campos
    if (nombre.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres')
    }
    
    if (email.length > 100) {
      throw new Error('El email no puede exceder 100 caracteres')
    }
    
    if (telefono && telefono.length > 20) {
      throw new Error('El teléfono no puede exceder 20 caracteres')
    }
  }

  // Generar token JWT
  static _generateToken(user) {
    return jwt.sign(
      {
        userId: user.usuario_id,
        email: user.email,
        admin: user.admin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1d' }
    )
  }

  // Formatear datos del usuario para respuesta
  static _formatUserData(user) {
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
}
