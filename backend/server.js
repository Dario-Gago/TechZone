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
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
