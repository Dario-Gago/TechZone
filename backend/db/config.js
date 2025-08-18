import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg
dotenv.config()

// Configuración simplificada para producción
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      client_encoding: 'UTF8',
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      client_encoding: 'UTF8',
      ssl: false,
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
