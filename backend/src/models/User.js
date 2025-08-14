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

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
