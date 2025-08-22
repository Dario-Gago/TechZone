# 🔧 Backend API - TechZone

## 📋 Índice
1. [Arquitectura del Backend](#arquitectura-del-backend)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Configuración y Setup](#configuración-y-setup)
4. [Rutas y Endpoints](#rutas-y-endpoints)
5. [Controladores](#controladores)
6. [Modelos](#modelos)
7. [Servicios](#servicios)
8. [Middleware](#middleware)
9. [Validadores](#validadores)
10. [Testing](#testing)

## 🏗️ Arquitectura del Backend

### Stack Tecnológico
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Base de Datos**: PostgreSQL con driver `pg`
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcryptjs, Helmet, CORS
- **Testing**: Jest + Supertest
- **Variables de Entorno**: dotenv

### Patrón Arquitectónico: MVC + Service Layer
```
┌─────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                        │
├─────────────────────────────────────────────────────────────┤
│  Routes → Middleware → Controllers → Services → Models      │
│     ↓          ↓           ↓           ↓         ↓         │
│   HTTP     Validation   Business    Complex    Database    │
│  Routing   Security     Logic       Logic      Access      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Directorios

```
backend/
├── server.js                    # Punto de entrada principal
├── package.json                 # Dependencias y scripts
├── .env                         # Variables de entorno
├── babel.config.cjs             # Configuración Babel para tests
├── jest.config.json             # Configuración Jest
├── render.yaml                  # Configuración para deployment
│
├── db/                          # Configuración de base de datos
│   ├── config.js                    # Conexión PostgreSQL
│   └── schema/                      # Scripts SQL
│       ├── DDL.sql                      # Estructura de tablas
│       └── DML.sql                      # Datos iniciales
│
├── middleware/                  # Middleware personalizado
│   └── authMiddleware.js            # Autenticación JWT
│
├── src/                         # Código fuente principal
│   ├── controllers/                 # Controladores de rutas
│   │   ├── authController.js            # Login/Register
│   │   ├── productController.js         # CRUD Productos
│   │   ├── categoriaController.js       # CRUD Categorías
│   │   ├── marcaController.js           # CRUD Marcas
│   │   └── salesController.js           # Gestión de Ventas
│   │
│   ├── models/                      # Modelos de datos
│   │   ├── User.js                      # Modelo Usuario
│   │   ├── Product.js                   # Modelo Producto
│   │   ├── Categoria.js                 # Modelo Categoría
│   │   ├── Marca.js                     # Modelo Marca
│   │   └── Sales.js                     # Modelo Ventas
│   │
│   ├── routes/                      # Definición de rutas
│   │   ├── auth.js                      # Rutas autenticación
│   │   ├── product.js                   # Rutas productos
│   │   ├── categoria.js                 # Rutas categorías
│   │   ├── marca.js                     # Rutas marcas
│   │   ├── sales.js                     # Rutas ventas
│   │   └── usuarios.js                  # Rutas usuarios
│   │
│   ├── services/                    # Lógica de negocio
│   │   ├── UserService.js               # Servicios de usuario
│   │   ├── ProductService.js            # Servicios de producto
│   │   ├── CategoryService.js           # Servicios de categoría
│   │   └── SalesService.js              # Servicios de ventas
│   │
│   └── validators/                  # Validación de datos
│       ├── userValidators.js            # Validaciones usuario
│       ├── productValidators.js         # Validaciones producto
│       └── commonValidators.js          # Validaciones comunes
│
└── tests/                       # Tests automatizados
    ├── .eslintrc.json               # Config ESLint para tests
    └── api.test.js                  # Tests de API REST
```

## ⚙️ Configuración y Setup

### Archivo Principal: `server.js`
```javascript
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

// Configuración CORS específica para múltiples entornos
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',          // Desarrollo local
      'http://127.0.0.1:5173',          // Desarrollo local alternativo
      process.env.FRONTEND_URL,         // Producción (variable de entorno)
      'https://techzone-frontend.onrender.com'  // Render deployment
    ].filter(Boolean)
    
    if (!origin) return callback(null, true) // Apps móviles, Postman
    
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

// Middleware global
app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Rutas de la API
app.use('/api', authRoutes)
app.use('/api/usuarios', usuarios)
app.use('/api/productos', product)
app.use('/api/ventas', sales)
app.use('/api/marcas', marca)
app.use('/api/categorias', categoria)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
```

### Configuración de Base de Datos: `db/config.js`
```javascript
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Configuración del pool de conexiones
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'techzone_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Configuración de pool para performance
  max: 20,                    // Máximo de conexiones
  idleTimeoutMillis: 30000,   // Tiempo antes de cerrar conexión idle
  connectionTimeoutMillis: 2000, // Timeout para nuevas conexiones
})

// Helper function para queries con logging
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    
    console.log('📊 Query executed', { 
      text: text.substring(0, 100) + '...', 
      duration: `${duration}ms`, 
      rows: res.rowCount 
    })
    
    return res
  } catch (error) {
    console.error('💥 Database query error', { 
      text: text.substring(0, 100) + '...',
      error: error.message,
      params: params ? params.length : 0
    })
    throw error
  }
}

// Función para cerrar todas las conexiones (testing)
export const closePool = async () => {
  await pool.end()
}

export default pool
```

### Variables de Entorno: `.env`
```bash
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techzone_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (para CORS en producción)
FRONTEND_URL=https://your-frontend-domain.com

# Render Configuration (para deployment)
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🛣️ Rutas y Endpoints

### 1. Rutas de Autenticación: `/api`
```javascript
// src/routes/auth.js
import express from 'express'
import { login, register } from '../controllers/authController.js'

const router = express.Router()

// POST /api/login - Autenticación de usuario
router.post('/login', login)

// POST /api/register - Registro de nuevo usuario
router.post('/register', register)

export default router
```

### 2. Rutas de Productos: `/api/productos`
```javascript
// src/routes/product.js
import express from 'express'
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts
} from '../controllers/productController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getProducts)                    // GET /api/productos
router.get('/featured', getFeaturedProducts)    // GET /api/productos/featured
router.get('/search', searchProducts)           // GET /api/productos/search?q=term
router.get('/category/:slug', getProductsByCategory) // GET /api/productos/category/gaming
router.get('/:id', getProductById)              // GET /api/productos/123

// Rutas protegidas (requieren autenticación admin)
router.post('/', authMiddleware, createProduct)        // POST /api/productos
router.put('/:id', authMiddleware, updateProduct)      // PUT /api/productos/123
router.delete('/:id', authMiddleware, deleteProduct)   // DELETE /api/productos/123

export default router
```

### 3. Rutas de Usuarios: `/api/usuarios`
```javascript
// src/routes/usuarios.js
import express from 'express'
import { getAllUsers, deleteUser } from '../controllers/authController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(authMiddleware)

// GET /api/usuarios - Obtener todos los usuarios (solo admin)
router.get('/', getAllUsers)

// DELETE /api/usuarios/123 - Eliminar usuario (solo admin)
router.delete('/:id', deleteUser)

export default router
```

### 4. Rutas de Ventas: `/api/ventas`
```javascript
// src/routes/sales.js
import express from 'express'
import { 
  createSale, 
  getUserSales, 
  getAllSales,
  getSaleDetails,
  getSalesStats
} from '../controllers/salesController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(authMiddleware)

// POST /api/ventas - Crear nueva venta
router.post('/', createSale)

// GET /api/ventas/user - Obtener ventas del usuario actual
router.get('/user', getUserSales)

// GET /api/ventas - Obtener todas las ventas (solo admin)
router.get('/', getAllSales)

// GET /api/ventas/stats - Estadísticas de ventas (solo admin)
router.get('/stats', getSalesStats)

// GET /api/ventas/123 - Obtener detalles de venta específica
router.get('/:id', getSaleDetails)

export default router
```

## 🎮 Controladores

### AuthController: Gestión de Autenticación
```javascript
// src/controllers/authController.js
import { UserService } from '../services/UserService.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos'
      })
    }
    
    // Autenticar usuario a través del servicio
    const result = await UserService.authenticateUser(email, password)
    
    res.status(200).json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    })
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      })
    }
    
    res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

export const register = async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body)
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: result.token,
      user: result.user
    })
  } catch (error) {
    console.error('Register error:', error)

    // Manejar errores específicos de validación
    if (error.message === 'Este email ya está registrado') {
      return res.status(409).json({ message: error.message })
    }
    
    if (error.message.includes('requeridos') || 
        error.message.includes('válido') || 
        error.message.includes('caracteres')) {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    // Verificar permisos de administrador
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    const users = await UserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    const { id } = req.params
    const deletedUser = await UserService.deleteUser(id, req.user)

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        usuario_id: deletedUser.usuario_id,
        nombre: deletedUser.nombre,
        email: deletedUser.email
      }
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)

    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: error.message })
    }

    if (error.message.includes('administrador') || 
        error.message.includes('propia cuenta')) {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
```

### ProductController: Gestión de Productos
```javascript
// src/controllers/productController.js (extracto principal)
import { ProductService } from '../services/ProductService.js'

export const getProducts = async (req, res) => {
  try {
    const { 
      categoria, 
      marca, 
      precio_min, 
      precio_max, 
      search,
      limit = 50,
      offset = 0
    } = req.query

    const filters = {
      categoria,
      marca,
      precio_min: precio_min ? parseFloat(precio_min) : null,
      precio_max: precio_max ? parseFloat(precio_max) : null,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }

    const products = await ProductService.getProducts(filters)
    
    res.status(200).json({
      products,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        total: products.length
      }
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const createProduct = async (req, res) => {
  try {
    // Solo administradores pueden crear productos
    if (!req.user?.admin) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    const productData = req.body
    const newProduct = await ProductService.createProduct(productData)

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: newProduct
    })
  } catch (error) {
    console.error('Error al crear producto:', error)

    if (error.message.includes('requerido') || 
        error.message.includes('válido')) {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
```

## 🗃️ Modelos

### User Model: Gestión de Usuarios
```javascript
// src/models/User.js
import bcrypt from 'bcryptjs'
import { query } from '../../db/config.js'

export class User {
  constructor(userData) {
    this.usuario_id = userData.usuario_id
    this.nombre = userData.nombre
    this.email = userData.email
    this.password_hash = userData.password_hash
    this.telefono = userData.telefono
    this.direccion = userData.direccion
    this.admin = userData.admin || false
    this.fecha_registro = userData.fecha_registro
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    return new User(result.rows[0])
  }

  // Buscar usuario por ID
  static async findById(userId) {
    const result = await query(
      'SELECT * FROM usuario WHERE usuario_id = $1',
      [userId]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    return new User(result.rows[0])
  }

  // Verificar si email existe
  static async emailExists(email) {
    const result = await query(
      'SELECT 1 FROM usuario WHERE email = $1',
      [email]
    )
    
    return result.rows.length > 0
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { nombre, email, password, telefono, direccion } = userData
    
    // Hash de la contraseña
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    const result = await query(
      `INSERT INTO usuario (nombre, email, password_hash, telefono, direccion, admin, fecha_registro)
       VALUES ($1, $2, $3, $4, $5, false, NOW())
       RETURNING *`,
      [nombre, email, passwordHash, telefono, direccion]
    )
    
    return new User(result.rows[0])
  }

  // Verificar contraseña
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Obtener todos los usuarios (admin only)
  static async findAll() {
    const result = await query(
      `SELECT usuario_id, nombre, email, telefono, direccion, admin, fecha_registro 
       FROM usuario 
       ORDER BY fecha_registro DESC`
    )
    
    return result.rows
  }

  // Eliminar usuario por ID
  static async deleteById(userId) {
    const result = await query(
      'DELETE FROM usuario WHERE usuario_id = $1 RETURNING *',
      [userId]
    )
    
    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado')
    }
    
    return new User(result.rows[0])
  }

  // Actualizar información del usuario
  static async updateById(userId, updateData) {
    const { nombre, telefono, direccion } = updateData
    
    const result = await query(
      `UPDATE usuario 
       SET nombre = $1, telefono = $2, direccion = $3, updated_at = NOW()
       WHERE usuario_id = $4 
       RETURNING *`,
      [nombre, telefono, direccion, userId]
    )
    
    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado')
    }
    
    return new User(result.rows[0])
  }
}
```

### Product Model: Gestión de Productos
```javascript
// src/models/Product.js (extracto principal)
import { query } from '../../db/config.js'

export class Product {
  constructor(productData) {
    this.producto_id = productData.producto_id
    this.nombre = productData.nombre
    this.descripcion = productData.descripcion
    this.precio_normal = parseFloat(productData.precio_normal)
    this.precio_oferta = parseFloat(productData.precio_oferta)
    this.descuento = productData.descuento
    this.marca_id = productData.marca_id
    this.stock = productData.stock
    this.disponibilidad = productData.disponibilidad
    this.imagen_url = productData.imagen_url
    this.caracteristicas = productData.caracteristicas
    this.envio = productData.envio
    this.en_stock = productData.en_stock
    this.destacado = productData.destacado
    this.created_at = productData.created_at
    this.updated_at = productData.updated_at
  }

  // Obtener todos los productos con filtros
  static async findAll(filters = {}) {
    let queryText = `
      SELECT 
        p.*,
        m.nombre as marca_nombre,
        array_agg(DISTINCT c.nombre) as categorias
      FROM producto p
      LEFT JOIN marca m ON p.marca_id = m.marca_id
      LEFT JOIN producto_categoria pc ON p.producto_id = pc.producto_id
      LEFT JOIN categoria c ON pc.categoria_id = c.categoria_id
      WHERE p.en_stock = 1
    `
    
    const queryParams = []
    let paramCount = 1

    // Aplicar filtros dinámicamente
    if (filters.categoria) {
      queryText += ` AND c.nombre ILIKE $${paramCount}`
      queryParams.push(`%${filters.categoria}%`)
      paramCount++
    }

    if (filters.marca) {
      queryText += ` AND m.nombre ILIKE $${paramCount}`
      queryParams.push(`%${filters.marca}%`)
      paramCount++
    }

    if (filters.precio_min) {
      queryText += ` AND p.precio_oferta >= $${paramCount}`
      queryParams.push(filters.precio_min)
      paramCount++
    }

    if (filters.precio_max) {
      queryText += ` AND p.precio_oferta <= $${paramCount}`
      queryParams.push(filters.precio_max)
      paramCount++
    }

    if (filters.search) {
      queryText += ` AND (p.nombre ILIKE $${paramCount} OR p.descripcion ILIKE $${paramCount})`
      queryParams.push(`%${filters.search}%`)
      paramCount++
    }

    queryText += `
      GROUP BY p.producto_id, m.nombre
      ORDER BY p.destacado DESC, p.precio_oferta ASC
    `

    // Aplicar paginación
    if (filters.limit) {
      queryText += ` LIMIT $${paramCount}`
      queryParams.push(filters.limit)
      paramCount++
    }

    if (filters.offset) {
      queryText += ` OFFSET $${paramCount}`
      queryParams.push(filters.offset)
    }

    const result = await query(queryText, queryParams)
    
    return result.rows.map(row => ({
      ...new Product(row),
      marca_nombre: row.marca_nombre,
      categorias: row.categorias.filter(cat => cat !== null)
    }))
  }

  // Buscar producto por ID
  static async findById(productId) {
    const result = await query(
      `SELECT 
        p.*,
        m.nombre as marca_nombre,
        array_agg(DISTINCT c.nombre) as categorias
       FROM producto p
       LEFT JOIN marca m ON p.marca_id = m.marca_id
       LEFT JOIN producto_categoria pc ON p.producto_id = pc.producto_id
       LEFT JOIN categoria c ON pc.categoria_id = c.categoria_id
       WHERE p.producto_id = $1
       GROUP BY p.producto_id, m.nombre`,
      [productId]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    const row = result.rows[0]
    return {
      ...new Product(row),
      marca_nombre: row.marca_nombre,
      categorias: row.categorias.filter(cat => cat !== null)
    }
  }

  // Crear nuevo producto
  static async create(productData) {
    const {
      nombre, descripcion, precio_normal, precio_oferta, descuento,
      marca_id, stock, disponibilidad, imagen_url, caracteristicas,
      envio, destacado, categorias
    } = productData

    // Insertar producto
    const result = await query(
      `INSERT INTO producto (
        nombre, descripcion, precio_normal, precio_oferta, descuento,
        marca_id, stock, disponibilidad, imagen_url, caracteristicas,
        envio, en_stock, destacado, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1, $12, NOW(), NOW())
      RETURNING *`,
      [
        nombre, descripcion, precio_normal, precio_oferta, descuento,
        marca_id, stock, disponibilidad, imagen_url, 
        JSON.stringify(caracteristicas), envio, destacado
      ]
    )

    const newProduct = new Product(result.rows[0])

    // Asociar categorías si se proporcionan
    if (categorias && categorias.length > 0) {
      await this.associateCategories(newProduct.producto_id, categorias)
    }

    return newProduct
  }

  // Asociar producto con categorías
  static async associateCategories(productId, categoryIds) {
    // Primero eliminar asociaciones existentes
    await query(
      'DELETE FROM producto_categoria WHERE producto_id = $1',
      [productId]
    )

    // Luego insertar nuevas asociaciones
    for (const categoryId of categoryIds) {
      await query(
        'INSERT INTO producto_categoria (producto_id, categoria_id) VALUES ($1, $2)',
        [productId, categoryId]
      )
    }
  }
}
```

## 🔧 Servicios

### UserService: Lógica de Negocio de Usuarios
```javascript
// src/services/UserService.js
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
      nombre, email, password, telefono, direccion
    })
    
    // Generar token para el nuevo usuario
    const token = this._generateToken(newUser)
    
    // Retornar datos formateados
    const formattedUser = this._formatUserData(newUser)
    
    return { token, user: formattedUser }
  }

  // Validaciones privadas
  static async _validateRegistrationData(userData) {
    const { nombre, email, password, telefono } = userData
    
    if (!nombre || !email || !password) {
      throw new Error('Nombre, email y contraseña son requeridos')
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido')
    }
    
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }
    
    if (nombre.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres')
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
```

## 🛡️ Middleware

### Authentication Middleware: `authMiddleware.js`
```javascript
// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Token de autorización requerido' 
      })
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      admin: decoded.admin
    }
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token inválido' 
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado' 
      })
    }
    
    res.status(401).json({ 
      message: 'Error de autenticación' 
    })
  }
}

// Middleware específico para verificar admin
export const adminMiddleware = (req, res, next) => {
  if (!req.user?.admin) {
    return res.status(403).json({ 
      message: 'Permisos de administrador requeridos' 
    })
  }
  
  next()
}
```

## ✅ Testing

### Configuración Jest: `jest.config.json`
```json
{
  "testEnvironment": "node",
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "testMatch": [
    "**/tests/**/*.test.js"
  ],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/**/*.test.js"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"]
}
```

### Tests de API: `tests/api.test.js`
```javascript
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from '../src/routes/auth.js'
import productRoutes from '../src/routes/product.js'

dotenv.config()

// Crear app de testing
const createTestApp = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  
  app.use('/api', authRoutes)
  app.use('/api/productos', productRoutes)
  
  return app
}

describe('API REST Tests', () => {
  let app

  beforeAll(() => {
    app = createTestApp()
  })

  describe('POST /api/login', () => {
    test('400 - Datos faltantes', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    test('401 - Credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'usuario_falso@test.com',
          password: 'password_incorrecto'
        })

      expect(response.status).toBe(401)
      expect(response.body.message).toContain('inválidas')
    })
  })

  describe('GET /api/productos', () => {
    test('200 - Obtener productos', async () => {
      const response = await request(app)
        .get('/api/productos')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.products || response.body)).toBe(true)
    })

    test('200 - Filtros de búsqueda', async () => {
      const response = await request(app)
        .get('/api/productos?search=NVIDIA&limite=5')

      expect(response.status).toBe(200)
    })
  })
})
```

### Scripts de Testing
```json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

---

*Este backend está diseñado siguiendo las mejores prácticas de Node.js/Express con una arquitectura escalable, segura y bien testeable.*
