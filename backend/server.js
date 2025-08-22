import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import usuarios from './src/routes/usuarios.js'
import product from './src/routes/product.js'
import sales from './src/routes/sales.js'
import marca from './src/routes/marca.js'
import categoria from './src/routes/categoria.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Configuración CORS específica
const corsOptions = {
  origin: (origin, callback) => {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      // Dominios de producción en Render
      process.env.FRONTEND_URL, // Variable de entorno para frontend en producción
      // Ejemplos para Render:
      'https://techzone-frontend.onrender.com',
    ].filter(Boolean) // Eliminar valores undefined
    
    // Permitir requests sin origin (ej: apps móviles, Postman)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`🚨 CORS blocked for origin: ${origin}`)
      callback(new Error('Blocked by CORS policy'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Rutas
app.use('/api', authRoutes)
app.use('/api/usuarios', usuarios)
app.use('/api/productos', product)
app.use('/api/ventas', sales)
app.use('/api/marcas', marca)
app.use('/api/categorias', categoria)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
