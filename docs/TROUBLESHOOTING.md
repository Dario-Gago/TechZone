# 🔧 Troubleshooting y Optimización - TechZone

## 📋 Índice
1. [Problemas Comunes](#problemas-comunes)
2. [Debugging Frontend](#debugging-frontend)
3. [Debugging Backend](#debugging-backend)
4. [Problemas de Base de Datos](#problemas-de-base-de-datos)
5. [Performance Issues](#performance-issues)
6. [Deployment Issues](#deployment-issues)
7. [Herramientas de Debugging](#herramientas-de-debugging)
8. [Guías de Optimización](#guías-de-optimización)

## 🚨 Problemas Comunes

### 1. **Error de CORS**
```javascript
// ❌ Error común:
Access to fetch at 'http://localhost:3001/api/productos' from origin 'http://localhost:5173' 
has been blocked by CORS policy

// ✅ Solución:
// En backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',    // Desarrollo
    'http://localhost:4173',    // Preview
    'https://techzone-app.netlify.app'  // Producción
  ],
  credentials: true
}))
```

### 2. **Token JWT Expirado**
```javascript
// ❌ Error:
"Token inválido o expirado"

// ✅ Diagnóstico:
// 1. Verificar en localStorage
console.log('Token:', localStorage.getItem('token'))

// 2. Decodificar token (sin verificar)
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))

// 3. Limpiar token expirado
localStorage.removeItem('token')
window.location.href = '/login'
```

### 3. **Error de Conexión a Base de Datos**
```bash
# ❌ Error común:
Error: connect ECONNREFUSED 127.0.0.1:5432

# ✅ Verificaciones:
# 1. PostgreSQL está ejecutándose
sudo service postgresql status

# 2. Variables de entorno correctas
echo $DATABASE_URL

# 3. Permisos de usuario
psql -U postgres -c "\du"
```

### 4. **Módulo No Encontrado**
```bash
# ❌ Error:
Error: Cannot find module 'some-package'

# ✅ Soluciones:
# 1. Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# 2. Verificar dependencias
npm ls

# 3. Reinstalar dependencia específica
npm uninstall some-package
npm install some-package
```

## 🌐 Debugging Frontend

### React Developer Tools
```javascript
// Habilitar debugging en desarrollo
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}
```

### Debug de Context API
```jsx
// contexts/AuthContext.jsx - Versión debug
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState)
  
  // Debug helper en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Auth State Changed:', state)
    }
  }, [state])
  
  return (
    <AuthContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Network Debugging
```javascript
// services/apiClient.js - Con logging detallado
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// Request interceptor para debug
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('🔄 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers
      })
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor para debug
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      })
    }
    return response
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)
```

### React Error Boundaries
```jsx
// components/ErrorBoundary.jsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary Caught:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // En producción, enviar error a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Ejemplo: Sentry, LogRocket, etc.
      // Sentry.captureException(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ¡Oops! Algo salió mal
              </h2>
              <p className="text-gray-600 mb-4">
                Ha ocurrido un error inesperado. Por favor, recarga la página.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Recargar Página
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

## 🖥️ Debugging Backend

### Logging Avanzado
```javascript
// utils/debugger.js
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true })
    })
  ]
})

// Debug middleware para requests
export const debugMiddleware = (req, res, next) => {
  const start = Date.now()
  
  logger.info('📥 Incoming Request', {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    headers: req.headers
  })

  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 400 ? 'error' : 'info'
    
    logger[level]('📤 Response Sent', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    })
  })

  next()
}
```

### Database Query Debugging
```javascript
// db/debugQueries.js
import pool from './config.js'

// Wrapper para queries con logging
export const debugQuery = async (text, params = []) => {
  const start = Date.now()
  
  try {
    console.log('🔍 Executing query:', {
      sql: text,
      params: params,
      timestamp: new Date().toISOString()
    })
    
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    
    console.log('✅ Query completed:', {
      duration: `${duration}ms`,
      rows: result.rowCount,
      command: result.command
    })
    
    return result
  } catch (error) {
    const duration = Date.now() - start
    
    console.error('❌ Query failed:', {
      error: error.message,
      duration: `${duration}ms`,
      sql: text,
      params: params
    })
    
    throw error
  }
}

// Mostrar queries lentas
export const slowQueryLogger = async (text, params = []) => {
  const start = Date.now()
  const result = await pool.query(text, params)
  const duration = Date.now() - start
  
  if (duration > 1000) { // Queries > 1 segundo
    console.warn('🐌 Slow Query Detected:', {
      duration: `${duration}ms`,
      sql: text,
      params: params,
      suggestion: 'Consider adding indexes or optimizing query'
    })
  }
  
  return result
}
```

### Memory Leak Detection
```javascript
// utils/memoryMonitor.js
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV !== 'production') {
    setInterval(() => {
      const memUsage = process.memoryUsage()
      const memInMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      }
      
      // Alertar si el uso de memoria es alto
      if (memInMB.heapUsed > 100) { // > 100MB
        console.warn('⚠️ High memory usage:', memInMB)
      }
      
      console.log('📊 Memory usage:', memInMB)
    }, 30000) // Cada 30 segundos
  }
}
```

## 🗄️ Problemas de Base de Datos

### Conexión Perdida
```javascript
// db/reconnection.js
import pool from './config.js'

export const handleDatabaseReconnection = () => {
  pool.on('error', async (err) => {
    console.error('❌ Database connection error:', err)
    
    if (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND') {
      console.log('🔄 Attempting to reconnect to database...')
      
      // Intentar reconectar después de un delay
      setTimeout(async () => {
        try {
          const client = await pool.connect()
          console.log('✅ Database reconnection successful')
          client.release()
        } catch (reconnectError) {
          console.error('❌ Reconnection failed:', reconnectError)
        }
      }, 5000)
    }
  })
}
```

### Optimización de Queries
```sql
-- Queries de diagnóstico
-- 1. Encontrar queries lentas
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- 2. Verificar uso de índices
EXPLAIN ANALYZE SELECT * FROM productos WHERE categoria_id = 1;

-- 3. Mostrar tamaño de tablas
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public';

-- 4. Encontrar índices no utilizados
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_scan = 0;
```

### Backup y Recovery
```bash
#!/bin/bash
# scripts/backup_db.sh

# Variables
DB_NAME="techzone_production"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/techzone_backup_$DATE.sql"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup completed: $BACKUP_FILE"
    
    # Comprimir backup
    gzip $BACKUP_FILE
    echo "🗜️ Backup compressed: $BACKUP_FILE.gz"
    
    # Eliminar backups antiguos (mantener últimos 7 días)
    find $BACKUP_DIR -name "techzone_backup_*.sql.gz" -mtime +7 -delete
    echo "🧹 Old backups cleaned up"
else
    echo "❌ Backup failed!"
    exit 1
fi
```

## ⚡ Performance Issues

### Frontend Performance
```javascript
// Performance monitoring component
import { useEffect } from 'react'

export const PerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Web Vitals monitoring
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
      
      // Performance observer para long tasks
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks > 50ms
              console.warn('🐌 Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              })
            }
          })
        })
        
        observer.observe({ entryTypes: ['longtask'] })
      }
    }
  }, [])
  
  return null
}
```

### React Performance Optimizations
```jsx
// Ejemplo de optimización con memo y useMemo
import React, { memo, useMemo, useCallback } from 'react'

const ProductCard = memo(({ product, onAddToCart }) => {
  // Memoizar cálculos costosos
  const discountPercentage = useMemo(() => {
    if (!product.precio_original || !product.precio_oferta) return 0
    return Math.round(((product.precio_original - product.precio_oferta) / product.precio_original) * 100)
  }, [product.precio_original, product.precio_oferta])
  
  // Memoizar handlers para evitar re-renders
  const handleAddToCart = useCallback(() => {
    onAddToCart(product)
  }, [product, onAddToCart])
  
  return (
    <div className="product-card">
      {/* Contenido del producto */}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison para optimizar re-renders
  return (
    prevProps.product.producto_id === nextProps.product.producto_id &&
    prevProps.product.precio_oferta === nextProps.product.precio_oferta &&
    prevProps.product.stock === nextProps.product.stock
  )
})
```

### Backend Performance
```javascript
// middleware/caching.js
import NodeCache from 'node-cache'

const cache = new NodeCache({ 
  stdTTL: 600, // 10 minutos
  checkperiod: 120 // Limpiar cada 2 minutos
})

export const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url
    const cachedResponse = cache.get(key)
    
    if (cachedResponse) {
      console.log('📦 Cache hit:', key)
      return res.json(cachedResponse)
    }
    
    // Override res.json para cachear respuesta
    const originalJson = res.json
    res.json = function(data) {
      cache.set(key, data, duration)
      console.log('💾 Response cached:', key)
      return originalJson.call(this, data)
    }
    
    next()
  }
}

// Uso en rutas
app.get('/api/productos', cacheMiddleware(300), productController.getAllProducts)
```

## 🚀 Deployment Issues

### Netlify Build Errors
```bash
# Error común: Build time limit exceeded
# Solución: Optimizar build process

# 1. Analizar bundle size
npm run build -- --analyze

# 2. Implementar code splitting
# vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react']
        }
      }
    }
  }
})

# 3. Optimizar imágenes
# Usar formato WebP y lazy loading
```

### Render Deployment Issues
```javascript
// Problemas comunes y soluciones

// 1. Port binding error
// Asegurar que el server escuche en 0.0.0.0
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

// 2. Database connection timeout
// Aumentar timeout en config
const pool = new Pool({
  connectionTimeoutMillis: 5000, // 5 segundos
  idleTimeoutMillis: 30000,      // 30 segundos
  max: 20
})

// 3. Memory limit exceeded
// Optimizar uso de memoria
process.on('warning', (warning) => {
  console.warn('⚠️ Warning:', warning.message)
  if (warning.name === 'MaxListenersExceededWarning') {
    console.log('Stack trace:', warning.stack)
  }
})
```

## 🛠️ Herramientas de Debugging

### React DevTools
```javascript
// Configuración para mejor debugging
if (process.env.NODE_ENV === 'development') {
  // Instalar React DevTools Profiler
  import('react-dom/profiling')
  
  // Configurar nombres de componentes para DevTools
  const ComponentWithDisplayName = () => <div />
  ComponentWithDisplayName.displayName = 'ComponentWithDisplayName'
}
```

### Chrome DevTools
```javascript
// Debugging avanzado con console
console.group('🔍 API Call Debug')
console.time('API Response Time')
console.log('Request:', requestData)
console.trace('Call stack')
console.timeEnd('API Response Time')
console.groupEnd()

// Performance profiling
const performanceMarker = (name) => {
  performance.mark(`${name}-start`)
  return () => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    console.log(`⏱️ ${name}:`, performance.getEntriesByName(name)[0].duration, 'ms')
  }
}

// Uso
const endTimer = performanceMarker('Product Loading')
// ... operación costosa
endTimer()
```

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development",
        "PORT": "3001"
      },
      "runtimeArgs": ["--experimental-modules"],
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## 📈 Guías de Optimización

### Checklist de Performance
```markdown
## Frontend Optimization Checklist

### ✅ Bundle Optimization
- [ ] Code splitting implementado
- [ ] Lazy loading de rutas
- [ ] Tree shaking configurado
- [ ] Bundle size < 500KB (gzipped)

### ✅ React Optimization  
- [ ] React.memo en componentes apropiados
- [ ] useMemo para cálculos costosos
- [ ] useCallback para handlers
- [ ] Virtualization para listas largas

### ✅ Assets Optimization
- [ ] Imágenes optimizadas (WebP)
- [ ] Lazy loading de imágenes
- [ ] Sprites para iconos
- [ ] CDN para assets estáticos

### ✅ Network Optimization
- [ ] HTTP/2 habilitado
- [ ] Compression (gzip/brotli)
- [ ] Cache headers configurados
- [ ] Service Worker implementado

## Backend Optimization Checklist

### ✅ Database Optimization
- [ ] Índices en columnas frecuentes
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Query result caching

### ✅ API Optimization
- [ ] Response caching
- [ ] Pagination implementada
- [ ] Rate limiting
- [ ] Compression middleware

### ✅ Security Optimization
- [ ] HTTPS enforced
- [ ] Security headers
- [ ] Input validation
- [ ] SQL injection prevention
```

### Performance Budgets
```javascript
// vite.config.js - Budget de performance
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    // Advertencias de tamaño
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096
  }
})

// Performance budgets para Lighthouse
// lighthouse-budget.json
{
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 300
    },
    {
      "resourceType": "total",
      "budget": 1000
    }
  ],
  "timings": [
    {
      "metric": "first-contentful-paint",
      "budget": 2000
    },
    {
      "metric": "largest-contentful-paint", 
      "budget": 4000
    }
  ]
}
```

---

*Esta guía de troubleshooting cubre los problemas más comunes y proporciona soluciones prácticas para mantener TechZone funcionando óptimamente.*
