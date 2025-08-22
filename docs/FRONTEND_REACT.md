# ⚛️ Frontend React - TechZone

## 📋 Índice
1. [Arquitectura del Frontend](#arquitectura-del-frontend)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Configuración y Setup](#configuración-y-setup)
4. [Enrutamiento y Navegación](#enrutamiento-y-navegación)
5. [Gestión de Estado](#gestión-de-estado)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Servicios y API](#servicios-y-api)
8. [Estilos y UI](#estilos-y-ui)
9. [Optimización de Performance](#optimización-de-performance)

## 🏗️ Arquitectura del Frontend

### Stack Tecnológico
- **Framework**: React 18.3.1 (con hooks y Concurrent Features)
- **Build Tool**: Vite 6.0.1 (HMR y bundling optimizado)
- **Routing**: React Router DOM 6.26.2 (SPA navigation)
- **Styling**: Tailwind CSS 3.4.13 (utility-first)
- **HTTP Client**: Axios 1.7.7 (promesas y interceptors)
- **Icons**: Lucide React 0.447.0 + FontAwesome 6.6.0
- **Notifications**: SweetAlert2 11.14.1
- **JWT**: jwt-decode 4.0.0

### Patrón Arquitectónico: Component-Based + Context API
```
┌─────────────────────────────────────────────────────────────┐
│                     REACT APPLICATION                       │
├─────────────────────────────────────────────────────────────┤
│  App.jsx → Routes → Pages → Components → Context/Hooks     │
│     ↓        ↓        ↓         ↓            ↓             │
│  Router   Protected  Business  Reusable   Global State     │
│  Config   Routes     Logic     UI Parts   Management       │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Directorios

```
src/
├── App.jsx                     # Componente raíz de la aplicación
├── main.jsx                    # Punto de entrada React 18
├── index.css                   # Estilos globales y Tailwind imports
│
├── assets/                     # Recursos estáticos
│   ├── Logo.png                    # Logo principal TechZone
│   ├── favicon.svg                 # Favicon de la aplicación
│   ├── asus.png                    # Imagen de marca ASUS
│   ├── rtx5000.png                 # Imagen producto RTX
│   └── rxAMD.png                   # Imagen producto AMD
│
├── components/                 # Componentes reutilizables
│   ├── layout/                     # Componentes de layout
│   │   ├── Navbar.jsx                  # Barra de navegación principal
│   │   ├── Footer.jsx                  # Pie de página
│   │   └── ScrollToTop.jsx             # Auto-scroll al cambiar ruta
│   │
│   ├── auth/                       # Componentes de autenticación
│   │   ├── PrivateRoute.jsx            # Rutas protegidas (requieren auth)
│   │   └── PublicRoute.jsx             # Rutas públicas (solo no auth)
│   │
│   ├── ui/                         # Componentes de UI básicos
│   │   ├── LoadingSpinner.jsx          # Indicador de carga
│   │   ├── SearchBar.jsx               # Barra de búsqueda
│   │   ├── UserAvatar.jsx              # Avatar de usuario
│   │   └── BannerOferta.jsx            # Banner promocional
│   │
│   ├── product/                    # Componentes relacionados con productos
│   │   ├── Carousel.jsx                # Slider de productos
│   │   ├── FeaturedProducts.jsx        # Productos destacados
│   │   ├── BrandBanner.jsx             # Banner de marcas
│   │   ├── ProductForm.jsx             # Formulario CRUD productos
│   │   └── ProductForm/                # Componentes modulares del form
│   │       ├── index.jsx                   # Componente principal del form
│   │       ├── ProductFormFields.jsx       # Campos del formulario
│   │       └── CategoryManager.jsx         # Gestión de categorías
│   │
│   ├── cart/                       # Componentes del carrito
│   │   ├── CartItem.jsx                # Item individual del carrito
│   │   ├── OrderSummary.jsx            # Resumen de pedido
│   │   └── ShippingOptions.jsx         # Opciones de envío
│   │
│   ├── checkout/                   # Componentes de checkout
│   │   ├── CheckoutHeader.jsx          # Header del proceso de pago
│   │   ├── PaymentForm.jsx             # Formulario de pago
│   │   └── PaymentMethods.jsx          # Métodos de pago disponibles
│   │
│   ├── admin/                      # Componentes de administración
│   │   ├── AdminTabs.jsx               # Pestañas del panel admin
│   │   ├── ProductsTab.jsx             # Tab gestión productos
│   │   ├── UsersTab.jsx                # Tab gestión usuarios
│   │   ├── SalesTab.jsx                # Tab gestión ventas
│   │   └── StatsCards.jsx              # Tarjetas de estadísticas
│   │
│   └── user/                       # Componentes de perfil usuario
│       ├── UserInfo.jsx                # Información del usuario
│       └── UserPurchases.jsx           # Historial de compras
│
├── pages/                      # Páginas principales de la aplicación
│   ├── Home.jsx                    # Página de inicio
│   ├── Login.jsx                   # Página de login
│   ├── Register.jsx                # Página de registro
│   ├── Cart.jsx                    # Página del carrito
│   ├── Checkout.jsx                # Página de checkout
│   ├── PaymentSuccess.jsx          # Página de confirmación de pago
│   ├── Dashboard.jsx               # Panel de usuario/admin
│   ├── ProductDetail.jsx           # Detalle de producto
│   ├── CategoryPage.jsx            # Página de categoría
│   ├── SearchPage.jsx              # Página de resultados búsqueda
│   └── Contact.jsx                 # Página de contacto
│
├── contexts/                   # Contextos de estado global
│   ├── AuthContext.jsx             # Contexto de autenticación
│   ├── ProductContext.jsx          # Contexto de productos
│   ├── CartContext.jsx             # Contexto del carrito
│   └── SalesContext.jsx            # Contexto de ventas
│
├── hooks/                      # Custom hooks reutilizables
│   ├── useAuth.js                  # Hook de autenticación
│   ├── useProducts.js              # Hook de productos
│   ├── useCart.js                  # Hook del carrito
│   ├── useSales.js                 # Hook de ventas
│   └── useScrollToTop.js           # Hook para scroll automático
│
├── services/                   # Servicios de comunicación con API
│   ├── apiClient.js                # Cliente HTTP base (Axios config)
│   ├── authService.js              # Servicios de autenticación
│   ├── productService.js           # Servicios de productos
│   └── categoryService.js          # Servicios de categorías
│
└── config/                     # Configuraciones
    └── api.js                      # Configuración de endpoints API
```

## ⚙️ Configuración y Setup

### Punto de Entrada: `main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// React 18 Concurrent Mode
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Aplicación Principal: `App.jsx`
```jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Layout Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Pages
import Inicio from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PagoExitoso from './pages/PaymentSuccess'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import Contact from './pages/Contact'

// Route Protection
import RutaPrivada from './components/PrivateRoute'
import RutaPublica from './components/PublicRoute'

// Context Providers
import { ProveedorAutenticacion } from './contexts/AuthContext'
import { ProveedorProducto } from './contexts/ProductContext'
import { ProveedorCarrito } from './contexts/CartContext'
import { SalesProvider } from './contexts/SalesContext'

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,      // React 18 Concurrent Features
        v7_relativeSplatPath: true     // React Router DOM 6.26 features
      }}
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Context Providers - Orden jerárquico importante */}
        <ProveedorAutenticacion>
          <ProveedorProducto>
            <ProveedorCarrito>
              <SalesProvider>
                <ScrollToTop>
                  <Navbar />

                  <main className="flex-1">
                    <Routes>
                      {/* Rutas Públicas */}
                      <Route path="/" element={<Inicio />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/category/:categorySlug" element={<CategoryPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/contact" element={<Contact />} />

                      {/* Rutas Solo para No Autenticados */}
                      <Route
                        path="/login"
                        element={
                          <RutaPublica>
                            <Login />
                          </RutaPublica>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <RutaPublica>
                            <Register />
                          </RutaPublica>
                        }
                      />

                      {/* Rutas de E-commerce */}
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/payment-success" element={<PagoExitoso />} />

                      {/* Rutas Protegidas */}
                      <Route
                        path="/dashboard"
                        element={
                          <RutaPrivada>
                            <Dashboard />
                          </RutaPrivada>
                        }
                      />
                    </Routes>
                  </main>

                  <Footer />
                </ScrollToTop>
              </SalesProvider>
            </ProveedorCarrito>
          </ProveedorProducto>
        </ProveedorAutenticacion>
      </div>
    </Router>
  )
}

export default App
```

### Configuración Vite: `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true
  },
  
  // Configuración del build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    // Optimización del bundle
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'sweetalert2']
        }
      }
    }
  },
  
  // Configuración de preview
  preview: {
    port: 4173,
    host: true
  }
})
```

### Estilos Globales: `index.css`
```css
/* Tailwind CSS imports */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables */
:root {
  --primary-color: #1f2937;
  --secondary-color: #374151;
  --accent-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Base Styles */
body {
  font-family: var(--font-family-sans);
  line-height: 1.6;
  color: var(--primary-color);
  background-color: #f9fafb;
}

/* Scroll Behavior */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus States */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Transitions */
.transition-base {
  @apply transition-all duration-200 ease-in-out;
}

/* Loading Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom Components */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus-ring transition-base;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 focus-ring transition-base;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* Responsive Design Helpers */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Dark Mode Support (preparado para futuro) */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    --primary-color: #f9fafb;
    --secondary-color: #e5e7eb;
    background-color: #1f2937;
    color: var(--primary-color);
  }
}
```

## 🛣️ Enrutamiento y Navegación

### Configuración de Rutas
```jsx
// Estructura jerárquica de rutas
const routeStructure = {
  public: [
    '/',                           // Home page
    '/product/:id',                // Product detail
    '/category/:categorySlug',     // Category page
    '/search',                     // Search results
    '/contact',                    // Contact page
    '/cart',                       // Shopping cart
    '/checkout'                    // Checkout process
  ],
  authOnly: [
    '/login',                      // Login (redirect if authenticated)
    '/register'                    // Register (redirect if authenticated)
  ],
  protected: [
    '/dashboard',                  // User/Admin dashboard
    '/payment-success'             // Payment confirmation
  ]
}
```

### Protección de Rutas: `PrivateRoute.jsx`
```jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAutenticacion } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const RutaPrivada = ({ children }) => {
  const { estaAutenticado, token } = useAutenticacion()
  const location = useLocation()

  // Mostrar loading mientras se verifica la autenticación
  if (token === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirigir a login si no está autenticado, guardando la URL destino
  if (!estaAutenticado) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  return children
}

export default RutaPrivada
```

### Rutas Públicas: `PublicRoute.jsx`
```jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAutenticacion } from '../contexts/AuthContext'

const RutaPublica = ({ children }) => {
  const { estaAutenticado } = useAutenticacion()

  // Redirigir al dashboard si ya está autenticado
  if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RutaPublica
```

### Scroll Automático: `ScrollToTop.jsx`
```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll suave al top en cada cambio de ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  return children
}

export default ScrollToTop
```

## 🔄 Gestión de Estado

### AuthContext: Estado de Autenticación
```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

const ContextoAutenticacion = createContext()

export const useAutenticacion = () => useContext(ContextoAutenticacion)

export const ProveedorAutenticacion = ({ children }) => {
  const [token, setToken] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [usuario, setUsuario] = useState(null)

  // Cerrar sesión y limpiar estado
  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    setToken(null)
    setEsAdmin(false)
    setUsuario(null)
    console.log('Sesión cerrada automáticamente - token inválido')
  }, [])

  // Verificar expiración del token
  const verificarExpiracionToken = useCallback(async () => {
    if (!token) return
    
    try {
      const { exp } = jwtDecode(token)
      const ahora = Date.now() / 1000
      
      if (exp <= ahora) {
        await Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        cerrarSesion()
      }
    } catch (error) {
      console.error('Error verificando el token:', error)
      cerrarSesion()
    }
  }, [token, cerrarSesion])

  // Cargar datos iniciales desde localStorage
  useEffect(() => {
    const tokenAlmacenado = localStorage.getItem('token')
    const esAdminAlmacenado = localStorage.getItem('isAdmin') === 'true'
    const usuarioAlmacenado = localStorage.getItem('user')

    if (tokenAlmacenado) {
      setToken(tokenAlmacenado)
      setEsAdmin(esAdminAlmacenado)
      
      if (usuarioAlmacenado) {
        try {
          setUsuario(JSON.parse(usuarioAlmacenado))
        } catch (error) {
          console.error('Error al cargar usuario desde localStorage:', error)
          localStorage.removeItem('user')
          setUsuario(null)
        }
      }
    }
  }, [])

  // Verificar expiración cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      verificarExpiracionToken()
    }, 5000)
    
    return () => clearInterval(intervalo)
  }, [verificarExpiracionToken])

  // Iniciar sesión
  const iniciarSesion = (nuevoToken, datosUsuario) => {
    const adminFlag = Boolean(datosUsuario?.admin)

    localStorage.setItem('token', nuevoToken)
    localStorage.setItem('isAdmin', adminFlag)
    localStorage.setItem('user', JSON.stringify(datosUsuario))

    setToken(nuevoToken)
    setEsAdmin(adminFlag)
    setUsuario(datosUsuario)
  }

  const estaAutenticado = !!token

  return (
    <ContextoAutenticacion.Provider
      value={{
        token,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado,
        esAdmin,
        usuario
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  )
}

// Exportaciones con compatibilidad
export const AuthContext = ContextoAutenticacion
export const useAuth = useAutenticacion
export const AuthProvider = ProveedorAutenticacion
```

### ProductContext: Estado de Productos
```jsx
// src/contexts/ProductContext.jsx (extracto principal)
import React, { createContext, useContext, useState, useEffect } from 'react'
import { productService } from '../services/productService'

const ProductContext = createContext()

export const useProductos = () => useContext(ProductContext)

export const ProveedorProducto = ({ children }) => {
  const [todosLosProductos, setTodosLosProductos] = useState([])
  const [productosDestacados, setProductosDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos iniciales
  useEffect(() => {
    cargarProductosIniciales()
  }, [])

  const cargarProductosIniciales = async () => {
    try {
      setCargando(true)
      setError(null)

      // Cargar productos en paralelo
      const [productos, destacados, categoriasData] = await Promise.all([
        productService.getAllProducts(),
        productService.getFeaturedProducts(),
        productService.getCategories()
      ])

      setTodosLosProductos(productos)
      setProductosDestacados(destacados)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Error cargando productos:', error)
      setError('Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }

  // Buscar productos con filtros
  const buscarProductos = async (filtros) => {
    try {
      setCargando(true)
      const resultados = await productService.searchProducts(filtros)
      return resultados
    } catch (error) {
      console.error('Error en búsqueda:', error)
      throw error
    } finally {
      setCargando(false)
    }
  }

  // Obtener productos por categoría
  const obtenerProductosPorCategoria = async (categoria) => {
    try {
      setCargando(true)
      const productos = await productService.getProductsByCategory(categoria)
      return productos
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error)
      throw error
    } finally {
      setCargando(false)
    }
  }

  return (
    <ProductContext.Provider
      value={{
        todosLosProductos,
        productosDestacados,
        categorias,
        cargando,
        error,
        buscarProductos,
        obtenerProductosPorCategoria,
        cargarProductosIniciales
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
```

## 🪝 Hooks Personalizados

### useAuth Hook
```javascript
// src/hooks/useAuth.js
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
}

// Hook con funcionalidades extendidas
export const useAuthExtended = () => {
  const auth = useAuth()
  
  const isAuthenticated = !!auth.token
  const isAdmin = auth.esAdmin
  const user = auth.usuario
  
  // Helpers adicionales
  const getUserId = () => user?.usuario_id
  const getUserName = () => user?.nombre
  const getUserEmail = () => user?.email
  
  const hasPermission = (requiredRole) => {
    if (requiredRole === 'admin') return isAdmin
    if (requiredRole === 'user') return isAuthenticated
    return true
  }
  
  return {
    ...auth,
    isAuthenticated,
    isAdmin,
    user,
    getUserId,
    getUserName,
    getUserEmail,
    hasPermission
  }
}
```

### useCart Hook
```javascript
// src/hooks/useCart.js
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'

export const useCart = () => {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  
  return context
}

// Hook con utilidades del carrito
export const useCartUtils = () => {
  const cart = useCart()
  
  // Calcular estadísticas del carrito
  const getCartStats = () => {
    const items = cart.items || []
    
    return {
      totalItems: items.reduce((total, item) => total + item.cantidad, 0),
      totalPrice: items.reduce((total, item) => 
        total + (item.precio_oferta * item.cantidad), 0
      ),
      uniqueProducts: items.length,
      isEmpty: items.length === 0
    }
  }
  
  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.items?.some(item => item.producto_id === productId) || false
  }
  
  // Obtener cantidad de un producto específico
  const getProductQuantity = (productId) => {
    const item = cart.items?.find(item => item.producto_id === productId)
    return item?.cantidad || 0
  }
  
  return {
    ...cart,
    getCartStats,
    isInCart,
    getProductQuantity
  }
}
```

## 🌐 Servicios y API

### API Client Base: `apiClient.js`
```javascript
// src/services/apiClient.js
import axios from 'axios'

// Configuración base del cliente HTTP
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }
  
  setupInterceptors() {
    // Request interceptor - Agregar token automáticamente
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )
    
    // Response interceptor - Manejo de errores globales
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
        return response
      },
      (error) => {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`)
        
        // Manejo automático de errores de autenticación
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('isAdmin')
          localStorage.removeItem('user')
          
          // Redirigir al login si no estamos ya ahí
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  // Métodos HTTP simplificados
  async get(endpoint, config = {}) {
    const response = await this.client.get(endpoint, config)
    return response.data
  }
  
  async post(endpoint, data = {}, config = {}) {
    const response = await this.client.post(endpoint, data, config)
    return response.data
  }
  
  async put(endpoint, data = {}, config = {}) {
    const response = await this.client.put(endpoint, data, config)
    return response.data
  }
  
  async delete(endpoint, config = {}) {
    const response = await this.client.delete(endpoint, config)
    return response.data
  }
  
  // Método para requests con FormData (upload de archivos)
  async postFormData(endpoint, formData, config = {}) {
    const response = await this.client.post(endpoint, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
    return response.data
  }
}

// Singleton instance
export const apiClient = new ApiClient()
export default apiClient
```

### Product Service: `productService.js`
```javascript
// src/services/productService.js
import apiClient from './apiClient'

export class ProductService {
  // Obtener todos los productos
  static async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value)
        }
      })
      
      const endpoint = queryParams.toString() 
        ? `/productos?${queryParams.toString()}`
        : '/productos'
      
      const response = await apiClient.get(endpoint)
      
      // Manejar diferentes formatos de respuesta
      return response.products || response.data || response || []
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw new Error('Error al cargar productos')
    }
  }
  
  // Obtener productos destacados
  static async getFeaturedProducts() {
    try {
      const response = await apiClient.get('/productos/featured')
      return response.products || response.data || response || []
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error)
      return []
    }
  }
  
  // Buscar productos
  static async searchProducts(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...filters
      })
      
      const response = await apiClient.get(`/productos/search?${queryParams.toString()}`)
      return response.products || response.data || response || []
    } catch (error) {
      console.error('Error en búsqueda de productos:', error)
      throw new Error('Error en la búsqueda')
    }
  }
  
  // Obtener producto por ID
  static async getProductById(productId) {
    try {
      const response = await apiClient.get(`/productos/${productId}`)
      return response.product || response.data || response
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      
      throw new Error('Error al cargar producto')
    }
  }
  
  // Obtener productos por categoría
  static async getProductsByCategory(categorySlug) {
    try {
      const response = await apiClient.get(`/productos/category/${categorySlug}`)
      return response.products || response.data || response || []
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error)
      throw new Error('Error al cargar productos de la categoría')
    }
  }
  
  // Crear producto (admin)
  static async createProduct(productData) {
    try {
      const response = await apiClient.post('/productos', productData)
      return response.product || response.data || response
    } catch (error) {
      console.error('Error creando producto:', error)
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para crear productos')
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Datos del producto inválidos')
      }
      
      throw new Error('Error al crear producto')
    }
  }
  
  // Actualizar producto (admin)
  static async updateProduct(productId, productData) {
    try {
      const response = await apiClient.put(`/productos/${productId}`, productData)
      return response.product || response.data || response
    } catch (error) {
      console.error('Error actualizando producto:', error)
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para editar productos')
      }
      
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      
      throw new Error('Error al actualizar producto')
    }
  }
  
  // Eliminar producto (admin)
  static async deleteProduct(productId) {
    try {
      const response = await apiClient.delete(`/productos/${productId}`)
      return response
    } catch (error) {
      console.error('Error eliminando producto:', error)
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar productos')
      }
      
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      
      throw new Error('Error al eliminar producto')
    }
  }
}

// Export instance for convenience
export const productService = ProductService
```

## 🎨 Estilos y UI

### Configuración Tailwind: `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      
      // Espaciado personalizado
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      
      // Tipografía
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      
      // Breakpoints personalizados
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      // Animaciones
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    // Plugin para formularios
    require('@tailwindcss/forms'),
    
    // Plugin para aspect ratio
    require('@tailwindcss/aspect-ratio'),
    
    // Plugin personalizado para componentes
    function({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply btn bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': {},
        },
        '.btn-secondary': {
          '@apply btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500': {},
        },
        '.card': {
          '@apply bg-white rounded-lg shadow-sm border border-gray-200': {},
        },
        '.input': {
          '@apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500': {},
        }
      })
    }
  ],
}
```

## ⚡ Optimización de Performance

### Code Splitting con React.lazy
```jsx
// Lazy loading de páginas pesadas
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

// Componentes lazy
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const AdminTabs = lazy(() => import('./components/AdminTabs'))

// Wrapper con Suspense
const LazyWrapper = ({ children }) => (
  <Suspense 
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    }
  >
    {children}
  </Suspense>
)

// Uso en rutas
<Route 
  path="/dashboard" 
  element={
    <LazyWrapper>
      <Dashboard />
    </LazyWrapper>
  } 
/>
```

### Memoización de Componentes
```jsx
import React, { memo, useMemo, useCallback } from 'react'

// Componente memoizado
const ProductCard = memo(({ product, onAddToCart, onViewDetails }) => {
  // Memoizar cálculos pesados
  const discountPercentage = useMemo(() => {
    if (product.precio_normal > product.precio_oferta) {
      return Math.round(
        ((product.precio_normal - product.precio_oferta) / product.precio_normal) * 100
      )
    }
    return 0
  }, [product.precio_normal, product.precio_oferta])

  // Memoizar handlers
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.producto_id)
  }, [onAddToCart, product.producto_id])

  const handleViewDetails = useCallback(() => {
    onViewDetails(product.producto_id)
  }, [onViewDetails, product.producto_id])

  return (
    <div className="card">
      {/* Contenido del producto */}
      <img 
        src={product.imagen_url} 
        alt={product.nombre}
        loading="lazy"  // Lazy loading nativo
        className="w-full h-48 object-cover rounded-t-lg"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.nombre}</h3>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-xl font-bold text-green-600">
              ${product.precio_oferta}
            </span>
            {discountPercentage > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.precio_normal}
              </span>
            )}
          </div>
          
          {discountPercentage > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <button onClick={handleViewDetails} className="btn-secondary flex-1">
            Ver detalles
          </button>
          <button onClick={handleAddToCart} className="btn-primary flex-1">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
```

### Optimización de Imágenes
```jsx
// Componente de imagen optimizada
const OptimizedImage = ({ src, alt, className, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded">
          <span className="text-gray-400 text-sm">Imagen no disponible</span>
        </div>
      )}
    </div>
  )
}
```

---

*Este frontend está optimizado para performance, accesibilidad y experiencia de usuario, siguiendo las mejores prácticas de React 18 y desarrollo web moderno.*
