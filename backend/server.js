import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/auth.js'
import usuarios from './src/routes/usuarios.js'
import product from './src/routes/product.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api', authRoutes)
app.use('/api/usuarios', usuarios)
app.use('/api/productos', product)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
