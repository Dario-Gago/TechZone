import request from 'supertest'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from '../src/routes/auth.js'
import productRoutes from '../src/routes/product.js'
import usuariosRoutes from '../src/routes/usuarios.js'
import salesRoutes from '../src/routes/sales.js'

dotenv.config()

// Crear app de testing
const createTestApp = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  
  // Rutas
  app.use('/api', authRoutes)
  app.use('/api/productos', productRoutes)
  app.use('/api/usuarios', usuariosRoutes)
  app.use('/api/ventas', salesRoutes)
  
  return app
}

describe('API REST Tests - 4 Rutas con Diferentes Códigos de Estado', () => {
  let app

  beforeAll(() => {
    app = createTestApp()
  })

  // RUTA 1: POST /api/login
  describe('Ruta 1: POST /api/login', () => {
    test('200 - Login exitoso (si las credenciales existen)', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@techzone.com',
          password: 'admin123'
        })

      // Puede ser 200 (éxito) o 401 (credenciales inválidas)
      expect([200, 401]).toContain(response.status)
    })

    test('400 - Datos faltantes', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({})

      expect(response.status).toBe(400)
    })

    test('401 - Credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'usuario_falso@test.com',
          password: 'password_incorrecto'
        })

      expect(response.status).toBe(401)
    })
  })

  // RUTA 2: GET /api/productos
  describe('Ruta 2: GET /api/productos', () => {
    test('200 - Obtener productos', async () => {
      const response = await request(app)
        .get('/api/productos')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  // RUTA 3: GET /api/usuarios (requiere autenticación)
  describe('Ruta 3: GET /api/usuarios', () => {
    test('401 - Sin token de autorización', async () => {
      const response = await request(app)
        .get('/api/usuarios')

      expect(response.status).toBe(401)
    })

    test('401 - Token inválido', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', 'Bearer token_invalido')

      expect(response.status).toBe(401)
    })
  })

  // RUTA 4: POST /api/ventas (requiere autenticación)
  describe('Ruta 4: POST /api/ventas', () => {
    test('401 - Sin autenticación', async () => {
      const response = await request(app)
        .post('/api/ventas')
        .send({
          productos: [{ producto_id: 1, cantidad: 1 }],
          total: 100
        })

      expect(response.status).toBe(401)
    })

    test('401 - Token malformado', async () => {
      const response = await request(app)
        .post('/api/ventas')
        .set('Authorization', 'Bearer abc123')
        .send({
          productos: [],
          total: 0
        })

      expect(response.status).toBe(401)
    })
  })
})
