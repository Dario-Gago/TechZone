import pool from '../../db/config.js'
import bcrypt from 'bcryptjs'

export const User = {
  // Buscar usuario por email
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [
      email
    ])

    return result.rows[0]
  },

  // Crear nuevo usuario
  async create(userData) {
    const { nombre, email, password, telefono, direccion } = userData

    // Hash de la contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const result = await pool.query(
      `INSERT INTO usuario (nombre, email, password_hash, telefono, direccion, admin, fecha_registro)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING usuario_id, nombre, email, telefono, direccion, admin, fecha_registro`,
      [
        nombre,
        email,
        hashedPassword,
        telefono || null,
        direccion || null,
        false
      ]
    )

    return result.rows[0]
  },

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  },

  // Verificar si email ya existe
  async emailExists(email) {
    const result = await pool.query(
      'SELECT COUNT(*) FROM usuario WHERE email = $1',
      [email]
    )
    return parseInt(result.rows[0].count) > 0
  }
}
