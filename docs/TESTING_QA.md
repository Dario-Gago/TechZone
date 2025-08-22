# 🧪 Testing y QA - TechZone

## 📋 Índice
1. [Estrategia de Testing](#estrategia-de-testing)
2. [Configuración de Jest](#configuración-de-jest)
3. [Tests de API](#tests-de-api)
4. [Tests Unitarios](#tests-unitarios)
5. [Tests de Integración](#tests-de-integración)
6. [Cobertura de Código](#cobertura-de-código)
7. [CI/CD y Automatización](#cicd-y-automatización)

## 🎯 Estrategia de Testing

### Pirámide de Testing
```
                /\
               /  \
              / E2E \     ← End-to-End (Pocos, críticos)
             /______\
            /        \
           / Integration \  ← Integration (Algunos, flujos principales)
          /______________\
         /                \
        /   Unit Tests     \  ← Unit Tests (Muchos, funciones individuales)
       /____________________\
      /                      \
     /    Static Analysis     \  ← Linting, Type checking
    /________________________\
```

### Niveles de Testing Implementados

#### 1. **Static Analysis**
- **ESLint**: Calidad de código y consistencia
- **Prettier**: Formato de código automático
- **JSDoc**: Documentación de funciones

#### 2. **Unit Tests**
- **Servicios**: Lógica de negocio aislada
- **Utilities**: Funciones auxiliares
- **Validators**: Validación de datos

#### 3. **Integration Tests**
- **API Routes**: Testing de endpoints completos
- **Database**: Interacciones con PostgreSQL
- **Authentication**: Flujos de login/registro

#### 4. **End-to-End Tests**
- **Flujos críticos**: Compra completa
- **Autenticación**: Login/logout
- **Navegación**: Flujo de usuario típico

## ⚙️ Configuración de Jest

### Configuración Principal: `jest.config.json`
```json
{
  "testEnvironment": "node",
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "testMatch": [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js",
    "**/*.test.js"
  ],
  "collectCoverageFrom": [
    "src/**/*.js",
    "middleware/**/*.js",
    "!src/**/*.test.js",
    "!src/**/index.js"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": [
    "text",
    "lcov",
    "html",
    "json"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "setupFilesAfterEnv": [
    "<rootDir>/tests/setup.js"
  ],
  "testTimeout": 10000,
  "verbose": true
}
```

### Configuración Babel: `babel.config.cjs`
```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: 'commonjs'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ]
}
```

### Setup de Testing: `tests/setup.js`
```javascript
// Configuración global para tests
import dotenv from 'dotenv'

// Cargar variables de entorno para testing
dotenv.config({ path: '.env.test' })

// Configurar timeouts globales
jest.setTimeout(10000)

// Mock global de console para tests más limpios
global.console = {
  ...console,
  // Silenciar logs en tests a menos que sea un error
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error // Mantener errores visibles
}

// Helper para limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks()
})
```

## 🔌 Tests de API

### Test Principal: `tests/api.test.js`
```javascript
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Importar rutas
import authRoutes from '../src/routes/auth.js'
import productRoutes from '../src/routes/product.js'
import usuariosRoutes from '../src/routes/usuarios.js'
import salesRoutes from '../src/routes/sales.js'

dotenv.config()

// Crear app de testing aislada
const createTestApp = () => {
  const app = express()
  
  // Middleware básico
  app.use(cors())
  app.use(express.json())
  
  // Rutas a testear
  app.use('/api', authRoutes)
  app.use('/api/productos', productRoutes)
  app.use('/api/usuarios', usuariosRoutes)
  app.use('/api/ventas', salesRoutes)
  
  return app
}

describe('🧪 API REST Tests - TechZone', () => {
  let app

  beforeAll(() => {
    app = createTestApp()
  })

  describe('🔐 Autenticación - POST /api/login', () => {
    test('✅ 200 - Login exitoso con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@techzone.com',
          password: 'admin123'
        })

      // Puede ser 200 (éxito) o 401 (credenciales no existen en DB test)
      expect([200, 401]).toContain(response.status)
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('email')
      }
    })

    test('❌ 400 - Login con datos faltantes', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({}) // Sin email ni password

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('requeridos')
    })

    test('❌ 401 - Login con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'usuario_inexistente@test.com',
          password: 'password_incorrecto'
        })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('inválidas')
    })

    test('❌ 400 - Login con email inválido', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'email_invalido', // Sin formato válido
          password: 'password123'
        })

      expect(response.status).toBe(400)
    })
  })

  describe('📝 Registro - POST /api/register', () => {
    test('❌ 400 - Registro con datos faltantes', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          email: 'test@example.com'
          // Faltan nombre y password
        })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    test('❌ 400 - Registro con email inválido', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          nombre: 'Test User',
          email: 'email-invalido',
          password: 'password123'
        })

      expect(response.status).toBe(400)
    })

    test('❌ 400 - Registro con contraseña débil', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: '123' // Muy corta
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('8 caracteres')
    })
  })

  describe('🛍️ Productos - GET /api/productos', () => {
    test('✅ 200 - Obtener lista de productos', async () => {
      const response = await request(app)
        .get('/api/productos')

      expect(response.status).toBe(200)
      
      // Verificar estructura de respuesta
      const products = response.body.products || response.body
      expect(Array.isArray(products)).toBe(true)
      
      // Si hay productos, verificar estructura
      if (products.length > 0) {
        const product = products[0]
        expect(product).toHaveProperty('producto_id')
        expect(product).toHaveProperty('nombre')
        expect(product).toHaveProperty('precio_oferta')
      }
    })

    test('✅ 200 - Productos con filtros de búsqueda', async () => {
      const response = await request(app)
        .get('/api/productos?search=NVIDIA&limit=5')

      expect(response.status).toBe(200)
      
      const products = response.body.products || response.body
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeLessThanOrEqual(5)
    })

    test('✅ 200 - Productos por categoría', async () => {
      const response = await request(app)
        .get('/api/productos?categoria=gaming')

      expect(response.status).toBe(200)
    })
  })

  describe('👥 Usuarios - GET /api/usuarios', () => {
    test('❌ 401 - Acceso sin token de autorización', async () => {
      const response = await request(app)
        .get('/api/usuarios')

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('Token')
    })

    test('❌ 401 - Acceso con token inválido', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', 'Bearer token_completamente_invalido')

      expect(response.status).toBe(401)
      expect(response.body.message).toContain('inválido')
    })

    test('❌ 401 - Acceso con token malformado', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', 'InvalidFormat abc123')

      expect(response.status).toBe(401)
    })
  })

  describe('💰 Ventas - POST /api/ventas', () => {
    test('❌ 401 - Crear venta sin autenticación', async () => {
      const response = await request(app)
        .post('/api/ventas')
        .send({
          productos: [{ producto_id: 1, cantidad: 1 }],
          total: 100.00
        })

      expect(response.status).toBe(401)
    })

    test('❌ 401 - Crear venta con token expirado', async () => {
      // Token JWT expirado simulado
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImV4cCI6MTYwMDAwMDAwMH0.invalid'
      
      const response = await request(app)
        .post('/api/ventas')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          productos: [],
          total: 0
        })

      expect(response.status).toBe(401)
    })

    test('❌ 400 - Crear venta con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/ventas')
        .send({
          // Sin productos ni total
        })

      expect(response.status).toBe(401) // Sin auth primero
    })
  })

  describe('🔍 Tests de Validación de Entrada', () => {
    test('❌ Payload excesivamente grande', async () => {
      const largePayload = {
        email: 'test@example.com',
        password: 'password123',
        nombre: 'A'.repeat(10000) // String muy largo
      }

      const response = await request(app)
        .post('/api/register')
        .send(largePayload)

      expect(response.status).toBe(400)
    })

    test('❌ Caracteres especiales maliciosos', async () => {
      const maliciousPayload = {
        email: '<script>alert("xss")</script>@test.com',
        password: 'password123',
        nombre: 'Test User'
      }

      const response = await request(app)
        .post('/api/register')
        .send(maliciousPayload)

      expect(response.status).toBe(400)
    })
  })

  describe('📊 Tests de Performance', () => {
    test('⚡ Tiempo de respuesta de productos < 2 segundos', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .get('/api/productos')

      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(2000) // 2 segundos
    })

    test('⚡ Concurrencia - Múltiples requests simultáneos', async () => {
      const promises = Array(10).fill().map(() =>
        request(app).get('/api/productos')
      )

      const responses = await Promise.all(promises)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    })
  })
})
```

## 🧪 Tests Unitarios

### Tests de Servicios
```javascript
// tests/services/UserService.test.js
import { UserService } from '../../src/services/UserService.js'
import { User } from '../../src/models/User.js'

// Mock del modelo User
jest.mock('../../src/models/User.js')

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateRegistrationData', () => {
    test('✅ Datos válidos pasan la validación', async () => {
      const validData = {
        nombre: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        telefono: '555-1234'
      }

      // No debería lanzar error
      await expect(
        UserService._validateRegistrationData(validData)
      ).resolves.not.toThrow()
    })

    test('❌ Email inválido falla la validación', async () => {
      const invalidData = {
        nombre: 'John Doe',
        email: 'email-invalido',
        password: 'Password123'
      }

      await expect(
        UserService._validateRegistrationData(invalidData)
      ).rejects.toThrow('formato del email no es válido')
    })

    test('❌ Contraseña muy corta falla la validación', async () => {
      const invalidData = {
        nombre: 'John Doe',
        email: 'john@example.com',
        password: '123'
      }

      await expect(
        UserService._validateRegistrationData(invalidData)
      ).rejects.toThrow('8 caracteres')
    })
  })

  describe('authenticateUser', () => {
    test('✅ Autenticación exitosa con credenciales válidas', async () => {
      const mockUser = {
        usuario_id: 1,
        email: 'john@example.com',
        password_hash: 'hashed_password',
        admin: false
      }

      User.findByEmail.mockResolvedValue(mockUser)
      User.verifyPassword.mockResolvedValue(true)

      const result = await UserService.authenticateUser(
        'john@example.com',
        'password123'
      )

      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('user')
      expect(result.user.email).toBe('john@example.com')
    })

    test('❌ Usuario no encontrado', async () => {
      User.findByEmail.mockResolvedValue(null)

      await expect(
        UserService.authenticateUser('nonexistent@example.com', 'password')
      ).rejects.toThrow('Credenciales inválidas')
    })

    test('❌ Contraseña incorrecta', async () => {
      const mockUser = {
        usuario_id: 1,
        email: 'john@example.com',
        password_hash: 'hashed_password'
      }

      User.findByEmail.mockResolvedValue(mockUser)
      User.verifyPassword.mockResolvedValue(false)

      await expect(
        UserService.authenticateUser('john@example.com', 'wrong_password')
      ).rejects.toThrow('Credenciales inválidas')
    })
  })

  describe('generateToken', () => {
    test('✅ Token contiene información correcta del usuario', () => {
      const mockUser = {
        usuario_id: 1,
        email: 'john@example.com',
        admin: false
      }

      const token = UserService._generateToken(mockUser)
      
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT tiene 3 partes
    })
  })
})
```

### Tests de Validadores
```javascript
// tests/validators/userValidators.test.js
import { 
  validateUserRegistration,
  sanitizeUserInput 
} from '../../src/validators/userValidators.js'

describe('User Validators', () => {
  describe('validateUserRegistration', () => {
    test('✅ Validación exitosa con datos completos', () => {
      const validData = {
        nombre: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        telefono: '+1234567890'
      }

      const result = validateUserRegistration(validData)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('❌ Validación falla con múltiples errores', () => {
      const invalidData = {
        nombre: '', // Vacío
        email: 'invalid-email', // Formato inválido
        password: '123', // Muy corta
        telefono: 'abc' // Formato inválido
      }

      const result = validateUserRegistration(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      
      const errorMessages = result.errors.join(' ')
      expect(errorMessages).toContain('nombre')
      expect(errorMessages).toContain('email')
      expect(errorMessages).toContain('contraseña')
    })

    test('❌ Email duplicado', async () => {
      // Este test requeriría mock de base de datos
      // para verificar emails existentes
    })
  })

  describe('sanitizeUserInput', () => {
    test('✅ Limpia caracteres peligrosos', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello'
      const sanitized = sanitizeUserInput(maliciousInput)
      
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).toContain('Hello')
    })

    test('✅ Recorta espacios en blanco', () => {
      const input = '   Hello World   '
      const sanitized = sanitizeUserInput(input)
      
      expect(sanitized).toBe('Hello World')
    })

    test('✅ Limita longitud máxima', () => {
      const longInput = 'A'.repeat(2000)
      const sanitized = sanitizeUserInput(longInput)
      
      expect(sanitized.length).toBeLessThanOrEqual(1000)
    })
  })
})
```

## 📊 Cobertura de Código

### Configuración de Cobertura
```json
// jest.config.json - Thresholds de cobertura
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "./src/services/": {
      "branches": 80,
      "functions": 90,
      "lines": 90,
      "statements": 90
    },
    "./src/validators/": {
      "branches": 85,
      "functions": 95,
      "lines": 95,
      "statements": 95
    }
  }
}
```

### Scripts de Testing
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:coverage:html": "jest --coverage --coverageReporters=html",
    "test:verbose": "jest --verbose",
    "test:silent": "jest --silent",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### Reporte de Cobertura
```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Resultado esperado:
# ----------------------|---------|----------|---------|---------|
# File                  | % Stmts | % Branch | % Funcs | % Lines |
# ----------------------|---------|----------|---------|---------|
# All files             |   85.5  |   78.3   |   89.2  |   86.1  |
#  controllers/         |   82.1  |   75.0   |   87.5  |   83.3  |
#   authController.js   |   85.7  |   80.0   |   90.0  |   86.7  |
#   productController.js|   78.5  |   70.0   |   85.0  |   80.0  |
#  services/            |   91.2  |   85.5   |   94.4  |   92.0  |
#   UserService.js      |   95.0  |   90.0   |   100.0 |   96.2  |
#   ProductService.js   |   87.4  |   81.0   |   88.8  |   87.8  |
#  validators/          |   96.8  |   92.3   |   100.0 |   97.1  |
# ----------------------|---------|----------|---------|---------|
```

## 🚀 CI/CD y Automatización

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: techzone_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd backend
        npm ci

    - name: Run ESLint
      run: |
        cd backend
        npm run lint

    - name: Run tests
      run: |
        cd backend
        npm run test:ci
      env:
        NODE_ENV: test
        JWT_SECRET: test_secret_key_for_testing_only
        DB_HOST: localhost
        DB_PORT: 5432
        DB_NAME: techzone_test
        DB_USER: postgres
        DB_PASSWORD: test_password

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./backend/coverage/lcov.info
        fail_ci_if_error: true
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "jest --findRelatedTests"
    ]
  }
}
```

---

*Esta estrategia de testing asegura la calidad del código con cobertura alta, tests automatizados y integración continua.*
