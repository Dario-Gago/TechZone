# 🚀 Deployment y DevOps - TechZone

## 📋 Índice
1. [Arquitectura de Deployment](#arquitectura-de-deployment)
2. [Configuración de Entornos](#configuración-de-entornos)
3. [Frontend - Netlify](#frontend---netlify)
4. [Backend - Render](#backend---render)
5. [Base de Datos - PostgreSQL](#base-de-datos---postgresql)
6. [Variables de Entorno](#variables-de-entorno)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoreo y Logs](#monitoreo-y-logs)

## 🏗️ Arquitectura de Deployment

### Diagrama de Infraestructura
```
                  ┌─────────────────┐
                  │   USUARIOS      │
                  │   (Navegador)   │
                  └─────────┬───────┘
                           │ HTTPS
                           ▼
                  ┌─────────────────┐
                  │   NETLIFY CDN   │
                  │  (React App)    │
                  │ Frontend Static │
                  └─────────┬───────┘
                           │ API Calls
                           ▼
                  ┌─────────────────┐
                  │    RENDER       │
                  │ (Node.js API)   │
                  │  Backend Server │
                  └─────────┬───────┘
                           │ Database
                           ▼
                  ┌─────────────────┐
                  │  POSTGRESQL     │
                  │  (Database)     │
                  │  Managed Cloud  │
                  └─────────────────┘
```

### Servicios de Cloud Utilizados

#### **Netlify** (Frontend)
- **Tipo**: Static Site Hosting & CDN
- **Ventajas**: 
  - Deploy automático desde Git
  - CDN global integrado
  - HTTPS automático
  - Redirects y rewrites para SPA
  - Preview deploys en PRs

#### **Render** (Backend)
- **Tipo**: Platform-as-a-Service (PaaS)
- **Ventajas**:
  - Auto-scaling automático
  - Zero-downtime deploys
  - Integración con PostgreSQL
  - Logs centralizados
  - Health checks automáticos

#### **PostgreSQL Cloud** (Database)
- **Tipo**: Database-as-a-Service
- **Ventajas**:
  - Backups automáticos
  - High availability
  - Escalabilidad vertical
  - Monitoring integrado
  - Seguridad enterprise

## ⚙️ Configuración de Entornos

### Estructura de Entornos
```
📁 Entornos de TechZone
├── 🛠️  Development (Local)
│   ├── Frontend: http://localhost:5173
│   ├── Backend: http://localhost:3001
│   └── Database: PostgreSQL local
├── 🧪 Testing (CI/CD)
│   ├── Tests automáticos
│   ├── Database temporal
│   └── Validaciones
├── 🎭 Staging (Preview)
│   ├── Deploy de ramas feature
│   ├── Testing de integración
│   └── QA manual
└── 🚀 Production
    ├── Frontend: https://techzone-app.netlify.app
    ├── Backend: https://techzone-api.render.com
    └── Database: PostgreSQL production
```

### Variables por Entorno

#### **Development (.env.local)**
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techzone_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# API
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001/api

# Security
JWT_SECRET=development_secret_key_very_long_and_complex
JWT_EXPIRES_IN=24h

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_ENVIRONMENT=development

# Logging
LOG_LEVEL=debug
ENABLE_CONSOLE_LOGS=true
```

#### **Testing (.env.test)**
```bash
# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=techzone_test
DB_USER=test_user
DB_PASSWORD=test_password

# API
PORT=3002
NODE_ENV=test
API_BASE_URL=http://localhost:3002/api

# Security
JWT_SECRET=test_secret_key_for_testing_only_not_production
JWT_EXPIRES_IN=1h

# Testing
ENABLE_TEST_ROUTES=true
MOCK_EXTERNAL_APIS=true
```

#### **Production (.env)**
```bash
# Database (Variables de Render)
DATABASE_URL=${DATABASE_URL}

# API
PORT=${PORT}
NODE_ENV=production
API_BASE_URL=https://techzone-api.render.com/api

# Security (Variables secretas de Render)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://techzone-app.netlify.app

# Performance
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMITING=true
```

## 🌐 Frontend - Netlify

### Configuración: `netlify.toml`
```toml
[build]
  # Directorio de build
  publish = "dist"
  
  # Comando de build
  command = "npm run build"
  
  # Node.js version
  environment = { NODE_VERSION = "18" }

[build.environment]
  # Variables públicas de build
  VITE_API_URL = "https://techzone-api.render.com/api"
  VITE_APP_ENVIRONMENT = "production"
  VITE_APP_VERSION = "1.0.0"

# SPA Routing - Redirigir todo a index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API Proxy para desarrollo (opcional)
[[redirects]]
  from = "/api/*"
  to = "https://techzone-api.render.com/api/:splat"
  status = 200
  headers = {X-From = "Netlify"}

# Headers de seguridad
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://techzone-api.render.com"

# Caché para assets estáticos
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Caché para HTML
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Configuración de formularios (si se usan)
[forms]
  settings = true

# Configuración de Edge Functions (si se necesitan)
[functions]
  directory = "netlify/functions"
```

### Build Configuration
```json
// package.json - Scripts de build
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "build:preview": "vite build && vite preview",
    "deploy:netlify": "netlify deploy --prod --dir=dist"
  }
}
```

### Optimizaciones de Build
```javascript
// vite.config.js - Configuración optimizada
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Análisis de bundle size
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  
  build: {
    // Optimizaciones de producción
    minify: 'terser',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        // Code splitting manual
        manualChunks: {
          // Separar vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Asset optimizations
    assetsInlineLimit: 4096
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  }
})
```

## 🖥️ Backend - Render

### Configuración: `render.yaml`
```yaml
services:
  # Backend API Service
  - type: web
    name: techzone-backend
    env: node
    region: oregon
    plan: starter # free, starter, standard, pro
    
    # Build configuration
    buildCommand: npm install && npm run build
    startCommand: npm start
    
    # Health check
    healthCheckPath: /api/health
    
    # Environment
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        fromService:
          type: web
          name: techzone-backend
          property: port
      - key: DATABASE_URL
        fromDatabase:
          name: techzone-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
        length: 64
      - key: FRONTEND_URL
        value: https://techzone-app.netlify.app
    
    # Auto-deploy
    autoDeploy: true
    branch: main
    
    # Custom domains (opcional)
    domains:
      - api.techzone.com

  # PostgreSQL Database
  - type: database
    name: techzone-db
    databaseName: techzone_production
    user: techzone_user
    region: oregon
    plan: free # free, starter, standard, pro
    
    # Backup configuration
    backupRetentionDays: 7
    
    # Version
    version: "13"
```

### Server Configuration
```javascript
// server.js - Configuración optimizada para producción
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy (importante para Render)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// Compression for better performance
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // límite de requests
  message: {
    error: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// CORS configurado específicamente
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'https://techzone-app.netlify.app', // Production
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint (requerido por Render)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
import authRoutes from './src/routes/auth.js'
import productRoutes from './src/routes/product.js'
import usuariosRoutes from './src/routes/usuarios.js'
import salesRoutes from './src/routes/sales.js'
import categoriaRoutes from './src/routes/categoria.js'
import marcaRoutes from './src/routes/marca.js'

app.use('/api', authRoutes)
app.use('/api/productos', productRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/ventas', salesRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/marcas', marcaRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error)
  
  // No exponer detalles del error en producción
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(error.status || 500).json({
    message: isDevelopment ? error.message : 'Error interno del servidor',
    ...(isDevelopment && { stack: error.stack })
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
  console.log(`📊 Entorno: ${process.env.NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export default app
```

### Performance Optimizations
```javascript
// Performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    
    // Log requests lentos
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}ms`)
    }
    
    // Métricas para monitoring
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
  })
  
  next()
}

app.use(performanceMiddleware)
```

## 🗄️ Base de Datos - PostgreSQL

### Configuración de Conexión
```javascript
// db/config.js - Configuración optimizada
import pkg from 'pg'
const { Pool } = pkg

// Configuración de pool de conexiones
const config = {
  // URL de conexión (Render proporciona DATABASE_URL)
  connectionString: process.env.DATABASE_URL,
  
  // Pool configuration
  max: process.env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  
  // SSL en producción
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
}

const pool = new Pool(config)

// Event handlers para debugging
pool.on('connect', (client) => {
  console.log('📊 Nueva conexión a PostgreSQL establecida')
})

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en cliente PostgreSQL:', err)
  process.exit(-1)
})

// Función para verificar conexión
export const testConnection = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    
    console.log('✅ Conexión a base de datos exitosa:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('❌ Error de conexión a base de datos:', error.message)
    return false
  }
}

// Queries preparados para mejor performance
export const queries = {
  // Usuarios
  findUserByEmail: 'SELECT * FROM usuarios WHERE email = $1',
  createUser: 'INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
  
  // Productos
  findAllProducts: 'SELECT * FROM productos WHERE activo = true ORDER BY producto_id',
  findProductById: 'SELECT * FROM productos WHERE producto_id = $1 AND activo = true',
  
  // Ventas
  createSale: 'INSERT INTO ventas (usuario_id, total, productos_detalle) VALUES ($1, $2, $3) RETURNING *'
}

export default pool
```

### Migraciones y Schema
```sql
-- db/migrations/001_initial_schema.sql
-- Ejecutar en orden en base de datos de producción

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    admin BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Crear tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla marcas
CREATE TABLE IF NOT EXISTS marcas (
    marca_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_original DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    categoria_id INTEGER REFERENCES categorias(categoria_id),
    marca_id INTEGER REFERENCES marcas(marca_id),
    imagen_url VARCHAR(500),
    especificaciones JSONB,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para productos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_marca ON productos(marca_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productos_precio ON productos(precio_oferta);

-- Crear tabla ventas
CREATE TABLE IF NOT EXISTS ventas (
    venta_id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(usuario_id),
    total DECIMAL(10,2) NOT NULL,
    productos_detalle JSONB NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para ventas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ventas_estado ON ventas(estado);

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para auto-actualizar timestamps
CREATE TRIGGER update_usuarios_modtime 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_fecha_actualizacion_column();

CREATE TRIGGER update_productos_modtime 
    BEFORE UPDATE ON productos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_fecha_actualizacion_column();
```

## 🔐 Variables de Entorno

### Configuración en Render
```bash
# En el dashboard de Render, configurar estas variables:

# Database
DATABASE_URL=postgresql://user:password@host:port/database
# (Render lo proporciona automáticamente cuando conectas una base de datos)

# Security
JWT_SECRET=super_secret_key_very_long_and_complex_for_production_use_only
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://techzone-app.netlify.app

# Performance
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMITING=true
MAX_REQUEST_SIZE=10mb

# Monitoring
LOG_LEVEL=info
ENABLE_PERFORMANCE_LOGS=true
```

### Configuración en Netlify
```bash
# En el dashboard de Netlify, configurar estas variables:

# API Connection
VITE_API_URL=https://techzone-api.render.com/api

# Application
VITE_APP_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=TechZone

# Analytics (opcional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=HOTJAR_SITE_ID
```

## 🔄 CI/CD Pipeline

### Workflow Completo
```yaml
# .github/workflows/deploy.yml
name: Deploy TechZone

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Testing
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install backend dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm run test:ci
        env:
          NODE_ENV: test
          JWT_SECRET: test_secret
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  # Build Frontend
  build-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://techzone-api.render.com/api
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  # Deploy Backend (Render se encarga automáticamente al hacer push a main)
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST "https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}"
```

## 📊 Monitoreo y Logs

### Health Check Endpoints
```javascript
// routes/health.js
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    const dbStatus = await testConnection()
    
    // Verificar uso de memoria
    const memoryUsage = process.memoryUsage()
    const memoryUsageInMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    }
    
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: dbStatus ? 'connected' : 'disconnected',
      memory: memoryUsageInMB,
      pid: process.pid
    }
    
    res.status(200).json(healthStatus)
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Endpoint de métricas básicas
app.get('/api/metrics', async (req, res) => {
  try {
    // Contar usuarios activos
    const activeUsers = await pool.query('SELECT COUNT(*) FROM usuarios WHERE activo = true')
    
    // Contar productos
    const totalProducts = await pool.query('SELECT COUNT(*) FROM productos WHERE activo = true')
    
    // Ventas del último mes
    const recentSales = await pool.query(`
      SELECT COUNT(*) as count, SUM(total) as revenue 
      FROM ventas 
      WHERE fecha_venta > NOW() - INTERVAL '30 days'
    `)
    
    res.json({
      users: {
        active: parseInt(activeUsers.rows[0].count)
      },
      products: {
        total: parseInt(totalProducts.rows[0].count)
      },
      sales: {
        last30Days: parseInt(recentSales.rows[0].count),
        revenue30Days: parseFloat(recentSales.rows[0].revenue) || 0
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener métricas' })
  }
})
```

### Logging Strategy
```javascript
// utils/logger.js
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Logs a consola (Render los captura automáticamente)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

// En producción, también enviar logs críticos a servicio externo
if (process.env.NODE_ENV === 'production') {
  // Ejemplo: Enviar a Papertrail, LogDNA, etc.
  logger.add(new winston.transports.Http({
    host: process.env.LOG_SERVICE_HOST,
    port: process.env.LOG_SERVICE_PORT,
    level: 'error'
  }))
}

export default logger
```

---

*Esta configuración de deployment asegura alta disponibilidad, escalabilidad automática y monitoreo completo de la aplicación TechZone.*
