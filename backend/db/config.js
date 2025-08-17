import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg
dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  // Configuración para UTF-8
  client_encoding: 'UTF8',
  ssl: false
})

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect()
    console.log('✅ Database connected successfully')
    client.release()
  } catch (err) {
    console.error('❌ Database connection error:', err.message)
  }
}

// Probar conexión al inicializar
testConnection()

export default pool
