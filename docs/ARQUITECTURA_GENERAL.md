# 🏗️ Arquitectura General - TechZone

## 📋 Índice
1. [Visión General del Sistema](#visión-general-del-sistema)
2. [Arquitectura de Capas](#arquitectura-de-capas)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Flujo de Datos](#flujo-de-datos)
5. [Comunicación Entre Capas](#comunicación-entre-capas)
6. [Escalabilidad y Performance](#escalabilidad-y-performance)
7. [Seguridad](#seguridad)

## 🎯 Visión General del Sistema

TechZone es una aplicación de **comercio electrónico Full-Stack** que implementa una arquitectura moderna de **3 capas** con separación clara de responsabilidades:

### Características Arquitectónicas Principales
- **Frontend**: SPA (Single Page Application) con React 18
- **Backend**: API RESTful con Node.js + Express
- **Base de Datos**: PostgreSQL con modelo relacional normalizado
- **Comunicación**: HTTP/HTTPS con JSON como formato de intercambio
- **Autenticación**: JWT (JSON Web Tokens) stateless
- **Estado**: Context API + Custom Hooks para gestión global

## 🏛️ Arquitectura de Capas

### Capa 1: Presentación (Frontend - React)
```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    Pages    │    │ Components  │    │   Assets    │     │
│  │             │    │             │    │             │     │
│  │ • Home      │    │ • Navbar    │    │ • Images    │     │
│  │ • Login     │    │ • Footer    │    │ • Icons     │     │
│  │ • Dashboard │    │ • Forms     │    │ • Styles    │     │
│  │ • Cart      │    │ • Modals    │    │             │     │
│  │ • Checkout  │    │ • Cards     │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Contexts   │    │    Hooks    │    │  Services   │     │
│  │             │    │             │    │             │     │
│  │ • AuthCtx   │    │ • useAuth   │    │ • authSrv   │     │
│  │ • CartCtx   │    │ • useCart   │    │ • productSrv│     │
│  │ • ProductCtx│    │ • useProds  │    │ • apiClient │     │
│  │ • SalesCtx  │    │ • useSales  │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Responsabilidades:**
- Renderizado de interfaces de usuario
- Gestión de estado local y global
- Manejo de eventos del usuario
- Navegación entre páginas
- Comunicación con la capa de lógica

### Capa 2: Lógica de Negocio (Backend - Node.js)
```
┌─────────────────────────────────────────────────────────────┐
│                   LÓGICA DE NEGOCIO LAYER                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Routes    │    │ Controllers │    │ Middleware  │     │
│  │             │    │             │    │             │     │
│  │ • /auth     │    │ • authCtrl  │    │ • authMW    │     │
│  │ • /products │    │ • prodCtrl  │    │ • corsMW    │     │
│  │ • /users    │    │ • userCtrl  │    │ • helmetMW  │     │
│  │ • /sales    │    │ • salesCtrl │    │ • validMW   │     │
│  │ • /brands   │    │ • brandCtrl │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Models    │    │  Services   │    │ Validators  │     │
│  │             │    │             │    │             │     │
│  │ • User      │    │ • UserSrv   │    │ • userVal   │     │
│  │ • Product   │    │ • ProdSrv   │    │ • prodVal   │     │
│  │ • Sale      │    │ • SalesSrv  │    │ • commonVal │     │
│  │ • Category  │    │ • CategorySrv│   │             │     │
│  │ • Brand     │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Responsabilidades:**
- Procesamiento de requests HTTP
- Validación de datos de entrada
- Implementación de reglas de negocio
- Autenticación y autorización
- Transformación de datos
- Gestión de errores

### Capa 3: Datos (PostgreSQL)
```
┌─────────────────────────────────────────────────────────────┐
│                      DATOS LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Entidades  │    │ Relaciones  │    │   Índices   │     │
│  │   Core      │    │             │    │             │     │
│  │             │    │ • 1:N       │    │ • Primary   │     │
│  │ • usuario   │    │ • N:M       │    │ • Foreign   │     │
│  │ • producto  │    │ • FK        │    │ • Composite │     │
│  │ • ventas    │    │             │    │ • Unique    │     │
│  │ • marca     │    │             │    │             │     │
│  │ • categoria │    │             │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Constraints │    │   Triggers  │    │   Views     │     │
│  │             │    │             │    │             │     │
│  │ • NOT NULL  │    │ • Audit     │    │ • Reports   │     │
│  │ • UNIQUE    │    │ • Validation│    │ • Analytics │     │
│  │ • CHECK     │    │ • Update    │    │ • Joins     │     │
│  │ • FOREIGN   │    │ • Timestamp │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Responsabilidades:**
- Almacenamiento persistente de datos
- Integridad referencial
- Optimización de consultas
- Backup y recuperación
- Seguridad a nivel de datos

## 🎨 Patrones de Diseño Implementados

### 1. Model-View-Controller (MVC)

#### **Model (Modelos de Datos)**
```javascript
// backend/src/models/User.js
export class User {
  constructor(userData) {
    this.usuario_id = userData.usuario_id
    this.nombre = userData.nombre
    this.email = userData.email
    this.admin = userData.admin || false
    // ... más propiedades
  }
  
  // Métodos de negocio
  static async create(userData) { /* lógica */ }
  static async findById(id) { /* lógica */ }
  static async findByEmail(email) { /* lógica */ }
}
```

#### **View (Componentes React)**
```jsx
// src/pages/Home.jsx
const Home = () => {
  const { products } = useProducts()
  const { user } = useAuth()
  
  return (
    <div>
      <FeaturedProducts products={products} />
      <ProductCarousel />
      {user && <PersonalizedRecommendations />}
    </div>
  )
}
```

#### **Controller (Controladores Express)**
```javascript
// backend/src/controllers/productController.js
export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### 2. Repository Pattern

```javascript
// Implementado en Services para abstracción de datos
export class ProductService {
  static async getAllProducts() {
    const query = 'SELECT * FROM producto WHERE en_stock = 1'
    const result = await db.query(query)
    return result.rows
  }
}
```

### 3. Context Provider Pattern

```jsx
// src/contexts/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const value = {
    user,
    login,
    logout,
    register,
    loading
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 4. Custom Hooks Pattern

```javascript
// src/hooks/useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 5. Service Layer Pattern

```javascript
// src/services/apiClient.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.token = localStorage.getItem('token')
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    }
    
    const response = await fetch(url, config)
    return this.handleResponse(response)
  }
}
```

## 🔄 Flujo de Datos

### Flujo de Lectura (GET)
```
1. Usuario interactúa con UI Component
2. Component usa Custom Hook
3. Hook llama a Service
4. Service hace HTTP Request
5. Backend Route recibe request
6. Route llama a Controller
7. Controller usa Service/Model
8. Model consulta Database
9. Database retorna datos
10. Response viaja de vuelta hasta UI
11. UI se actualiza con nuevos datos
```

### Flujo de Escritura (POST/PUT/DELETE)
```
1. Usuario envía formulario
2. Component valida datos localmente
3. Service envía datos a API
4. Backend Middleware valida request
5. Controller procesa datos
6. Service ejecuta lógica de negocio
7. Model interactúa con Database
8. Database confirma operación
9. Response indica éxito/error
10. UI actualiza estado global
11. Componentes se re-renderizan
```

## 🔗 Comunicación Entre Capas

### Frontend ↔ Backend
```javascript
// Configuración base de API
const API_BASE_URL = 'http://localhost:3000/api'

// Interceptor para requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout automático si token expiró
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Backend ↔ Database
```javascript
// Configuración de conexión
import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Query helper con manejo de errores
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Query executed', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', { text, error })
    throw error
  }
}
```

## ⚡ Escalabilidad y Performance

### Frontend Optimization
```javascript
// Lazy Loading de páginas
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

// Memoización de componentes pesados
const ProductList = memo(({ products, filters }) => {
  return products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))
})

// Debounce en búsquedas
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

### Backend Optimization
```javascript
// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Query optimization con índices
CREATE INDEX CONCURRENTLY idx_producto_categoria ON producto_categoria (categoria_id);
CREATE INDEX CONCURRENTLY idx_producto_precio ON producto (precio_normal) WHERE en_stock = 1;

// Caching de responses comunes
const cache = new Map()

export const getCachedProducts = async () => {
  const cacheKey = 'featured_products'
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const products = await ProductService.getFeaturedProducts()
  cache.set(cacheKey, products, { ttl: 300000 }) // 5 minutos
  
  return products
}
```

## 🔒 Seguridad

### Autenticación JWT
```javascript
// Generación de token
const generateToken = (user) => {
  const payload = {
    usuario_id: user.usuario_id,
    email: user.email,
    admin: user.admin
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'techzone-api',
    audience: 'techzone-client'
  })
}

// Verificación de token
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}
```

### Validación y Sanitización
```javascript
// Validadores personalizados
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /\d/.test(password)
}

// Sanitización de inputs
export const sanitizeInput = (input) => {
  return input.trim()
              .replace(/[<>]/g, '') // Prevenir XSS básico
              .substring(0, 255)     // Limitar longitud
}
```

### Headers de Seguridad
```javascript
// Configuración de Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

## 📊 Monitoreo y Logging

### Logging Centralizado
```javascript
// Logger personalizado
class Logger {
  static info(message, meta = {}) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
  
  static error(message, error = {}, meta = {}) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.stack || error.message || error,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
}

// Uso en controllers
export const login = async (req, res) => {
  try {
    Logger.info('Login attempt', { email: req.body.email })
    
    const user = await UserService.authenticate(req.body)
    
    Logger.info('Login successful', { 
      userId: user.usuario_id,
      email: user.email 
    })
    
    res.json({ token, user })
  } catch (error) {
    Logger.error('Login failed', error, { 
      email: req.body.email,
      ip: req.ip 
    })
    
    res.status(401).json({ error: 'Credenciales inválidas' })
  }
}
```

---

*Esta arquitectura está diseñada para ser escalable, mantenible y segura, siguiendo las mejores prácticas de desarrollo Full-Stack moderno.*
