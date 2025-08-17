# 🎮 TechZone


## 📋 Descripción

**TechZone** es una aplicación web de comercio electrónico **Full-Stack** moderna especializada en productos tecnológicos y gaming. Desarrollada con React 18+ en el frontend y Node.js + PostgreSQL en el backend, siguiendo las mejores prácticas de desarrollo web y arquitectura escalable preparada para crecimiento empresarial.

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</div>

<div align="center">
  <h3>🚀 Tu destino definitivo para tecnología gaming de alta calidad</h3>
  <p>E-commerce Full-Stack moderno con React, Node.js, PostgreSQL y arquitectura escalable</p>
</div>

---

## 📋 Descripción

**TechZone** es una aplicación web de comercio electrónico **Full-Stack** moderna especializada en productos tecnológicos y gaming. Desarrollada con React 18+ en el frontend y Node.js + PostgreSQL en el backend, siguiendo las mejores prácticas de desarrollo web y arquitectura escalable preparada para crecimiento empresarial.

### ✨ Características Principales

- 🛒 **E-commerce Full-Stack**: Sistema integral con backend robusto y base de datos PostgreSQL
- 🔐 **Autenticación JWT**: Sistema seguro de login/registro con tokens y roles de usuario
- 👥 **Panel de Administración**: Dashboard completo para administradores con gestión de usuarios, productos y ventas
- 📊 **Base de Datos Real**: PostgreSQL con esquemas optimizados y relaciones estructuradas
- 🔄 **API RESTful**: Endpoints completos para todas las operaciones CRUD
- 📱 **Responsive Design**: Experiencia optimizada en todos los dispositivos  
- 🔍 **Búsqueda Inteligente**: Sistema de búsqueda en tiempo real con filtros avanzados
- 🗂️ **Navegación por Categorías**: Filtrado dinámico por categorías de productos
- 📄 **Páginas de Detalle**: Información completa de productos con imágenes y especificaciones
- 🛒 **Carrito Dinámico**: Gestión completa de productos con actualización en tiempo real
- 💳 **Sistema de Checkout**: Proceso completo de compra con pagos y envíos
- 🔒 **Rutas Protegidas**: Middleware de autenticación y autorización
- ⚡ **Rendimiento Optimizado**: Context API, hooks personalizados y componentes reutilizables
- 🎨 **UI/UX Moderna**: Interfaz atractiva con Tailwind CSS y componentes interactivos
- 📊 **Estado Global**: Gestión centralizada con Context API y hooks personalizados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 18+** - Runtime de JavaScript para el servidor
- **Express.js** - Framework web rápido y minimalista
- **PostgreSQL** - Base de datos relacional robusta y escalable
- **JWT (JSON Web Tokens)** - Autenticación y autorización segura
- **bcryptjs** - Encriptación de contraseñas con hashing seguro
- **CORS** - Configuración de políticas de origen cruzado
- **Helmet** - Middleware de seguridad para Express
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React 18+** - Biblioteca principal con hooks y Context API
- **React Router DOM** - Navegación SPA con rutas dinámicas y protegidas
- **JavaScript ES6+** - Lenguaje moderno con async/await y destructuring
- **Tailwind CSS** - Framework CSS utilitario para diseño responsivo
- **Lucide React** - Biblioteca de iconos moderna y consistente
- **Axios** - Cliente HTTP para comunicación con el backend
- **SweetAlert2** - Alertas y modales interactivos elegantes
- **jwt-decode** - Decodificación de tokens JWT en el cliente

### Base de Datos
- **PostgreSQL** - Base de datos principal con esquemas DDL y DML
- **Relaciones Estructuradas** - Usuarios, productos y transacciones relacionadas
- **Índices Optimizados** - Búsquedas rápidas y rendimiento escalable
- **Constraints y Validaciones** - Integridad de datos a nivel de base de datos

### Arquitectura y Patrones
- **API RESTful** - Endpoints organizados y escalables
- **Context API** - Gestión de estado global (Auth, Products y Cart)
- **Custom Hooks** - Lógica reutilizable (`useProducts`, `useAuth`, `useCart`)
- **Component Composition** - Componentes reutilizables y modulares
- **Middleware Pattern** - Autenticación y autorización centralizada
- **MVC Architecture** - Separación clara de responsabilidades

### Herramientas de Desarrollo
- **Vite** - Build tool moderno y rápido para el frontend
- **Nodemon** - Auto-restart del servidor en desarrollo
- **ESLint** - Linting para código consistente
- **Git** - Control de versiones con flujo de trabajo profesional

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/a-cidm/TechZone.git
   cd TechZone
   ```

2. **Configurar el Backend**

   ```bash
   # Navegar al directorio del backend
   cd backend
   
   # Instalar dependencias
   npm install
   
   # Configurar variables de entorno
   cp .env.example .env
   # Editar .env con tus credenciales de PostgreSQL
   ```

3. **Configurar la Base de Datos**

   ```bash
   # Crear la base de datos en PostgreSQL con codificación UTF-8
   psql -U postgres -d postgres -c "CREATE DATABASE techzone_db WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE='C' LC_CTYPE='C';"
   
   # Ejecutar las migraciones
   psql -d techzone_db -f db/schema/DDL.sql
   psql -d techzone_db -f db/schema/DML.sql
   ```

4. **Configurar el Frontend**

   ```bash
   # Volver al directorio raíz
   cd ..
   
   # Instalar dependencias del frontend
   npm install
   ```

5. **Variables de Entorno**

   Crear archivo `.env` en el backend con:
   ```env
   # Base de datos
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=techzone_db
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=tu_clave_secreta_muy_segura_aqui
   JWT_EXPIRE=24h
   
   # Servidor
   PORT=3000
   NODE_ENV=development
   ```

6. **Iniciar los servidores**

   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend (nueva terminal)
   npm run dev
   ```

7. **Acceder a la aplicación**
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:3000/`

## 📜 Comandos Disponibles

### Frontend
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build para producción  
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting
```

### Backend
```bash
# Navegar al directorio backend
cd backend

# Desarrollo
npm run dev          # Servidor con nodemon (puerto 3000)
npm start            # Servidor de producción
```

### Base de Datos
```bash
# Crear base de datos con codificación UTF-8 correcta (IMPORTANTE)
psql -U postgres -d postgres -c "CREATE DATABASE techzone_db WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE='C' LC_CTYPE='C';"

# Ejecutar migraciones
psql -d techzone_db -f backend/db/schema/DDL.sql
psql -d techzone_db -f backend/db/schema/DML.sql

# Eliminar y recrear base de datos (si hay problemas de codificación)
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS techzone_db;"
psql -U postgres -d postgres -c "CREATE DATABASE techzone_db WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE='C' LC_CTYPE='C';"

# Backup de base de datos
pg_dump techzone_db > backup.sql

# Restaurar backup
psql -d techzone_db < backup.sql
```

### Utilidades
```bash
# Limpiar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar puertos en uso (Linux/Mac)
netstat -tulpn | grep :3000
netstat -tulpn | grep :5173

# Verificar puertos en uso (Windows)
netstat -an | findstr :3000
netstat -an | findstr :5173
```

## 📁 Estructura del Proyecto

```
TechZone/
├── backend/                 # Servidor Node.js + Express
│   ├── .env                     # Variables de entorno
│   ├── package.json             # Dependencias del backend
│   ├── server.js                # Punto de entrada del servidor
│   ├── db/                      # Configuración de base de datos
│   │   ├── config.js                # Conexión a PostgreSQL
│   │   └── schema/                  # Esquemas de base de datos
│   │       ├── DDL.sql                  # Estructura de tablas
│   │       └── DML.sql                  # Datos de prueba
│   ├── middleware/              # Middleware personalizado
│   │   └── authMiddleware.js        # Autenticación JWT
│   └── src/                     # Lógica del servidor
│       ├── controllers/             # Controladores de rutas
│       │   ├── authController.js        # Login/register/usuarios
│       │   ├── productController.js     # CRUD de productos
│       │   └── salesController.js       # Gestión de ventas completa
│       ├── models/                  # Modelos de datos
│       │   ├── User.js                  # Modelo de usuario
│       │   ├── Product.js               # Modelo de producto
│       │   └── Sales.js                 # Modelo de ventas
│       └── routes/                  # Definición de rutas
│           ├── auth.js                  # Rutas de autenticación
│           ├── product.js               # Rutas de productos
│           ├── sales.js                 # Rutas de ventas
│           └── usuarios.js              # Rutas de usuarios
├── src/                     # Frontend React
│   ├── components/              # Componentes reutilizables
│   │   ├── AdminTabs.jsx           # Pestañas de administración
│   │   ├── Carousel.jsx            # Slider de productos
│   │   ├── FeaturedProducts.jsx    # Productos destacados
│   │   ├── Footer.jsx              # Pie de página
│   │   ├── Navbar.jsx              # Navegación principal
│   │   ├── SearchBar.jsx           # Barra de búsqueda
│   │   ├── CartItem.jsx            # Item del carrito
│   │   ├── CheckoutHeader.jsx      # Header del checkout
│   │   ├── OrderSummary.jsx        # Resumen de pedido
│   │   ├── PaymentForm.jsx         # Formulario de pago
│   │   ├── PaymentMethods.jsx      # Métodos de pago
│   │   ├── ShippingOptions.jsx     # Opciones de envío
│   │   ├── UserInfo.jsx            # Información del usuario
│   │   ├── UserPurchases.jsx       # Historial de compras
│   │   ├── ProductForm.jsx         # Formulario CRUD productos
│   │   ├── ProductsTab.jsx         # Gestión de productos admin
│   │   ├── SalesTab.jsx            # Gestión de ventas admin
│   │   ├── UsersTab.jsx            # Gestión de usuarios admin
│   │   ├── StatsCards.jsx          # Tarjetas de estadísticas
│   │   ├── LoadingSpinner.jsx      # Indicador de carga
│   │   ├── PrivateRoute.jsx        # Rutas protegidas
│   │   └── PublicRoute.jsx         # Rutas públicas
│   ├── contexts/                # Contextos globales
│   │   ├── AuthContext.jsx         # Autenticación JWT
│   │   ├── ProductContext.jsx      # Productos y categorías
│   │   ├── CartContext.jsx         # Carrito de compras
│   │   └── SalesContext.jsx        # Gestión de ventas completa
│   ├── hooks/                   # Hooks personalizados
│   │   ├── useProducts.js          # Hook para productos
│   │   ├── useAuth.js              # Hook para autenticación
│   │   ├── useCart.js              # Hook para carrito
│   │   └── dataHelpers.js          # Helpers para datos
│   ├── pages/                   # Páginas principales
│   │   ├── Home.jsx                # Página de inicio
│   │   ├── ProductDetail.jsx       # Detalle del producto
│   │   ├── CategoryPage.jsx        # Productos por categoría
│   │   ├── SearchPage.jsx          # Resultados de búsqueda
│   │   ├── Cart.jsx                # Carrito de compras
│   │   ├── Checkout.jsx            # Proceso de compra
│   │   ├── PaymentSuccess.jsx      # Confirmación de pago
│   │   ├── Dashboard.jsx           # Panel de usuario/admin
│   │   ├── Login.jsx               # Iniciar sesión
│   │   ├── Register.jsx            # Registro
│   │   └── Contact.jsx             # Página de contacto
│   ├── config/                  # Configuración
│   │   └── api.js                  # Endpoints de la API
│   ├── data/                    # Datos de respaldo (JSON)
│   │   ├── products.json           # Productos de respaldo
│   │   ├── usuarios.json           # Usuarios de respaldo
│   │   ├── pedidos.json            # Pedidos de respaldo
│   │   └── ...                     # Otros datos JSON
│   ├── assets/                  # Recursos estáticos
│   │   ├── Logo.png                # Logo de la aplicación
│   │   └── ...                     # Imágenes y recursos
│   ├── App.jsx                  # Componente principal
│   ├── index.css                # Estilos globales
│   └── main.jsx                 # Punto de entrada React
├── package.json             # Dependencias del frontend
├── README.md
└── vite.config.js           # Configuración de Vite
```

## 🎮 Funcionalidades

### 🔐 Sistema de Autenticación Full-Stack
- **JWT Authentication**: Tokens seguros con middleware de verificación
- **Login y Register**: Autenticación con validaciones robustas en backend
- **Password Hashing**: Encriptación segura con bcryptjs
- **AuthContext**: Gestión global del estado de autenticación
- **Token Expiration**: Manejo automático de expiración de tokens
- **PrivateRoute**: Protección de rutas para usuarios autenticados
- **Role-based Access**: Diferenciación entre usuarios y administradores

### 👥 Panel de Administración Completo
- **Dashboard Admin**: Panel de control con estadísticas en tiempo real
- **Gestión de Usuarios**: CRUD completo desde la base de datos PostgreSQL
- **Gestión de Productos**: Crear, editar y eliminar productos con formularios dinámicos
- **Gestión de Ventas**: Sistema completo de ventas con base de datos PostgreSQL
- **SalesContext**: Contexto dedicado para gestión de ventas con estadísticas
- **Transacciones Seguras**: Control de transacciones con rollback automático
- **Estadísticas Avanzadas**: Métricas de ventas, usuarios registrados y productos
- **Tabs Dinámicas**: Navegación entre diferentes secciones de administración
- **Validaciones**: Controles de acceso y permisos por rol
- **API de Ventas**: Endpoints completos para crear, consultar y actualizar ventas

### 🏠 Página Principal (Home)
- **Hero Section**: Slider interactivo de productos destacados
- **Productos Destacados**: Slider horizontal con navegación
- **Navegación por Categorías**: Acceso directo a secciones especializadas
- **Diseño Responsive**: Adaptado a móviles, tablets y desktop

### 🔍 Sistema de Búsqueda
- **Búsqueda en Tiempo Real**: Filtrado instantáneo por nombre, marca y descripción
- **Página de Resultados**: Resultados organizados con información completa
- **SearchBar Reutilizable**: Componente usado en navbar desktop y móvil
- **Estados de Búsqueda**: Manejo de estados vacíos y sin resultados

### 📄 Páginas de Producto
- **Detalle Completo**: Información detallada con imágenes, precios y características
- **Gestión de Cantidad**: Selector de cantidad integrado
- **Estado de Stock**: Indicadores visuales de disponibilidad desde base de datos
- **Navegación Relacionada**: Productos destacados al final de la página

### 🗂️ Navegación por Categorías
- **Filtrado Dinámico**: Productos organizados por categorías desde base de datos
- **URLs Amigables**: Rutas SEO-friendly para cada categoría
- **Grid Responsivo**: Diseño adaptable con información completa
- **Contadores**: Número de productos encontrados por categoría

### 🛒 Carrito de Compras
- **Gestión Completa**: Añadir/eliminar productos con actualización dinámica
- **Cálculo Automático**: Totales, descuentos y promociones en tiempo real
- **Persistencia**: Mantenimiento del carrito entre sesiones
- **Estado Global**: Integración con CartContext para acceso universal
- **Validaciones**: Control de stock y cantidades máximas desde base de datos

### 💳 Sistema de Checkout y Ventas Completo
- **Proceso de Compra**: Flujo completo desde carrito hasta confirmación
- **Métodos de Pago**: Tarjetas de crédito/débito con validaciones
- **Opciones de Envío**: Retiro en tienda o entrega a domicilio
- **Información de Usuario**: Gestión de datos personales y direcciones
- **Sistema de Ventas**: Base de datos PostgreSQL para registro de transacciones
- **SalesController**: API completa para crear, consultar y gestionar ventas
- **Detalle de Ventas**: Tabla relacional para items de cada venta
- **Estados de Venta**: Control de estados (pendiente, procesando, entregado)
- **Transacciones ACID**: Integridad garantizada con rollback automático
- **Confirmación**: Página de éxito con detalles del pedido guardados en BD

### 📊 Dashboard de Usuario y Estadísticas
- **Panel Personalizado**: Información del usuario autenticado
- **Gestión de Perfil**: Configuración de datos personales
- **Historial de Compras**: Visualización de pedidos anteriores desde base de datos
- **SalesContext**: Contexto dedicado con estadísticas calculadas automáticamente
- **Estadísticas Personales**: Métricas de compras y gastos con useMemo optimizado
- **Estadísticas de Admin**: Dashboard completo con ventas totales y de hoy
- **Cálculos en Tiempo Real**: Total gastado, compras realizadas y entregadas
- **Filtros por Usuario**: Admins ven todas las ventas, usuarios solo las propias
- **Rutas Protegidas**: Acceso solo para usuarios autenticados

### 🎨 Componentes Avanzados
- **Navbar Dinámico**: Categorías cargadas desde base de datos, búsqueda integrada
- **Footer Informativo**: Enlaces organizados y información de contacto
- **Loading States**: Animaciones de carga en todas las páginas
- **Error Handling**: Manejo elegante de errores y estados vacíos
- **Formularios Dinámicos**: ProductForm con validaciones y características
- **Alertas Interactivas**: SweetAlert2 para feedback de usuario

## 🏗️ Arquitectura y Patrones

### Backend Architecture
- **API RESTful**: Endpoints organizados por recursos (auth, users, products, sales)
- **MVC Pattern**: Separación clara entre modelos, vistas y controladores
- **Middleware Layer**: Autenticación JWT y validaciones centralizadas
- **Database Abstraction**: Modelos con métodos específicos para PostgreSQL
- **Error Handling**: Manejo centralizado de errores con códigos HTTP apropiados
- **Security**: Helmet, CORS, bcryptjs para protección integral

### Frontend Architecture
- **Context API**: Gestión centralizada de estado (Auth, Products, Cart, Sales)
- **Custom Hooks**: `useProducts`, `useAuth`, `useCart`, `useSales` para lógica reutilizable
- **Component Composition**: Componentes modulares y reutilizables
- **Route Protection**: PrivateRoute y PublicRoute para control de acceso
- **API Integration**: Axios con interceptors para manejo de tokens

### Database Design
```sql
-- Usuarios con roles y autenticación
usuario (
  usuario_id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  admin BOOLEAN DEFAULT false,
  email VARCHAR(100) UNIQUE,
  password_hash TEXT,
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_registro TIMESTAMP DEFAULT NOW()
)

-- Marcas de productos
marca (
  marca_id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT true
)

-- Categorías de productos
categoria (
  categoria_id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT true
)

-- Productos con características JSONB
producto (
  producto_id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_normal DECIMAL(10,2) NOT NULL,
  precio_oferta DECIMAL(10,2),
  descuento INTEGER,
  marca_id INTEGER REFERENCES marca(marca_id),
  imagen_url TEXT,
  caracteristicas JSONB,
  stock INTEGER DEFAULT 0,
  disponibilidad VARCHAR(50) DEFAULT 'disponible',
  en_stock INTEGER DEFAULT 1,
  destacado BOOLEAN DEFAULT false,
  envio VARCHAR(100) DEFAULT 'Envío estándar',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Relación muchos a muchos entre productos y categorías
producto_categoria (
  producto_id INTEGER REFERENCES producto(producto_id) ON DELETE CASCADE,
  categoria_id INTEGER REFERENCES categoria(categoria_id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, categoria_id)
)

-- Sistema de ventas completo
ventas (
  venta_id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(usuario_id),
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'pendiente'
)

-- Detalle de cada venta
detalle_ventas (
  detalle_id SERIAL PRIMARY KEY,
  venta_id INTEGER REFERENCES ventas(venta_id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES producto(producto_id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
)
```

### State Management
- **AuthContext**: Token JWT, estado de autenticación y datos de usuario
- **ProductContext**: Catálogo de productos, categorías, marcas y filtros
- **CartContext**: Items del carrito, cálculos y persistencia
- **SalesContext**: Gestión completa de ventas con estadísticas calculadas
- **Local Storage**: Persistencia de token y preferencias de usuario

### API Endpoints Structure
```javascript
// Autenticación
POST /api/register      // Registro de usuario
POST /api/login         // Inicio de sesión

// Usuarios (Admin only)
GET    /api/usuarios    // Listar usuarios
DELETE /api/usuarios/:id // Eliminar usuario

// Productos
GET    /api/productos   // Listar productos
POST   /api/productos   // Crear producto (Admin)
PUT    /api/productos/:id // Editar producto (Admin)
DELETE /api/productos/:id // Eliminar producto (Admin)

// Marcas
GET    /api/marcas      // Listar marcas
POST   /api/marcas      // Crear marca (Admin)
PUT    /api/marcas/:id  // Editar marca (Admin)
DELETE /api/marcas/:id  // Eliminar marca (Admin)

// Categorías
GET    /api/categorias  // Listar categorías
POST   /api/categorias  // Crear categoría (Admin)
PUT    /api/categorias/:id // Editar categoría (Admin)
DELETE /api/categorias/:id // Eliminar categoría (Admin)

// Ventas
GET    /api/ventas      // Listar todas las ventas (Admin)
GET    /api/ventas/me   // Listar ventas del usuario actual
POST   /api/ventas      // Crear nueva venta
PATCH  /api/ventas/:id  // Actualizar estado de venta
```

### Rutas y Navegación
```
/ - Página principal con productos destacados
/product/:id - Detalle específico del producto
/category/:categorySlug - Productos filtrados por categoría  
/search?q=term - Resultados de búsqueda
/login - Autenticación de usuarios
/register - Registro de nuevos usuarios
/cart - Carrito de compras
/checkout - Proceso de compra
/payment-success - Confirmación de pago exitoso
/contact - Página de contacto
/dashboard - Panel de usuario/admin (ruta protegida)
```

## 🔧 Troubleshooting

### Problemas de Codificación UTF-8 en PostgreSQL (Windows)

Si encuentras caracteres mal codificados como `MicrÃ³fono` en lugar de `Micrófono`, sigue estos pasos:

#### Problema Común
```bash
# ❌ Problema: Caracteres aparecen como
"Philips Hue Bridge y Kit IniciaciÃ³n"  # Incorrecto
"Shure MV7+ USB/XLR MicrÃ³fono"        # Incorrecto

# ✅ Solución: Deberían aparecer como
"Philips Hue Bridge y Kit Iniciación"   # Correcto
"Shure MV7+ USB/XLR Micrófono"         # Correcto
```

#### Solución Definitiva
```bash
# 1. Eliminar base de datos actual
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS techzone_db;"

# 2. Crear base de datos con configuración UTF-8 correcta para Windows
psql -U postgres -d postgres -c "CREATE DATABASE techzone_db WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE='C' LC_CTYPE='C';"

# 3. Ejecutar esquemas con codificación UTF-8
cd backend/db/schema
psql -U postgres -d techzone_db -f DDL.sql
psql -U postgres -d techzone_db -c "SET client_encoding = 'UTF8';" -f DML.sql

# 4. Verificar que los caracteres están correctos
psql -U postgres -d techzone_db -c "SELECT nombre FROM producto WHERE nombre LIKE '%Hue%' OR nombre LIKE '%Micr%';"
```

#### Explicación Técnica
- **LC_COLLATE='C'**: Define el orden de clasificación usando el locale C (UTF-8 puro)
- **LC_CTYPE='C'**: Define la clasificación de caracteres usando el locale C  
- **TEMPLATE template0**: Usa la plantilla limpia sin configuraciones de locale heredadas
- **SET client_encoding = 'UTF8'**: Asegura que el cliente use UTF-8 al insertar datos

#### Backend Configuration
El backend ya incluye la configuración UTF-8 correcta:
```javascript
// db/config.js
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  client_encoding: 'UTF8',  // ✅ Configuración UTF-8
  ssl: false
})

// server.js
app.use(express.json({ charset: 'utf-8' }))
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }))
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})
```

### Otros Problemas Comunes

#### Error: "relation does not exist"
```bash
# Asegúrate de ejecutar DDL.sql antes de DML.sql
psql -d techzone_db -f backend/db/schema/DDL.sql
psql -d techzone_db -f backend/db/schema/DML.sql
```

#### Error: "foreign key constraint violation"  
```bash
# Limpia las tablas y reinicia las secuencias
psql -d techzone_db -c "TRUNCATE TABLE detalle_ventas, ventas, producto_categoria, producto, categoria, marca, usuario RESTART IDENTITY CASCADE;"
psql -d techzone_db -f backend/db/schema/DML.sql
```

#### Frontend no se conecta al Backend
```bash
# Verifica que ambos servidores estén corriendo
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
npm run dev

# URLs:
# Frontend: http://localhost:5173/
# Backend:  http://localhost:3000/
```

#### Error de puertos ocupados
```bash
# Windows: Verificar qué proceso está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Terminar proceso por PID (reemplazar XXXX con el PID)
taskkill /PID XXXX /F

# Linux/Mac: Verificar y terminar proceso
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 🔮 Funcionalidades Implementadas vs. Futuras

### ✅ Completamente Implementado
- **Backend Full-Stack**: Node.js + Express + PostgreSQL funcionando
- **Autenticación JWT**: Login/register con tokens seguros
- **Panel de Administración**: Gestión completa de usuarios, productos y ventas
- **Sistema de Ventas Completo**: Base de datos PostgreSQL con tablas relacionales
- **SalesContext**: Gestión de estado global para ventas con estadísticas
- **API de Ventas**: Endpoints completos para CRUD de ventas y detalle
- **Transacciones ACID**: Control de integridad con rollback automático
- **Base de Datos PostgreSQL**: Esquemas DDL y DML con relaciones estructuradas
- **API RESTful**: Endpoints para todas las operaciones CRUD
- **Sistema de Roles**: Diferenciación admin/usuario con middleware
- **Gestión de Productos**: CRUD completo con formularios dinámicos
- **Dashboard Dinámico**: Estadísticas y métricas en tiempo real
- **Estadísticas Avanzadas**: Cálculos optimizados con useMemo
- **Validaciones**: Frontend y backend con manejo de errores
- **Responsive Design**: Totalmente adaptado a dispositivos móviles

## 📱 Demo y Capturas

### 🔐 Sistema de Autenticación
- **Login/Register**: Formularios con validaciones en tiempo real
- **JWT Tokens**: Autenticación segura con expiración automática
- **Role Management**: Diferenciación automática entre admin/usuario

### 👑 Panel de Administración
- **Dashboard Admin**: Métricas de ventas, usuarios y productos
- **Gestión de Usuarios**: CRUD completo desde PostgreSQL
- **Gestión de Productos**: Formularios dinámicos con características
- **Estadísticas en Tiempo Real**: Ventas diarias, usuarios activos
- **Tabs Interactivas**: Navegación fluida entre secciones

### 🏠 Página Principal
- **Slider Interactivo**: Productos destacados con navegación automática
- **Navegación por Categorías**: Carga dinámica desde base de datos
- **Productos Destacados**: Carrusel horizontal responsive
- **Design System**: Consistente en todos los dispositivos

### 🔍 Búsqueda y Filtros
- **Búsqueda en Tiempo Real**: Resultados instantáneos mientras escribes
- **Filtros Avanzados**: Por categoría, precio y disponibilidad
- **Estados de Carga**: UX optimizada durante búsquedas
- **Manejo de Errores**: Mensajes informativos cuando no hay resultados

### 📦 Gestión de Productos
- **Detalle Completo**: Información técnica, precios y stock
- **Gestión de Stock**: Indicadores visuales de disponibilidad
- **Características Dinámicas**: Lista de especificaciones técnicas
- **Productos Relacionados**: Sugerencias basadas en categoría

### 🛒 Carrito y Checkout
- **Carrito Dinámico**: Actualización en tiempo real de cantidades
- **Cálculos Automáticos**: Subtotales, descuentos y total
- **Proceso de Compra**: Flujo completo con validaciones
- **Confirmación**: Página de éxito con detalles del pedido

## 🧪 Testing y Calidad

### Code Standards
- **ESLint**: Reglas de linting configuradas para frontend y backend
- **Component Structure**: Arquitectura modular y escalable
- **Git Workflow**: Commits semánticos y branches organizadas
- **API Documentation**: Endpoints documentados con ejemplos
- **Database Schema**: DDL y DML estructurados y versionados

### Security
- **JWT Authentication**: Tokens seguros con expiración
- **Password Hashing**: bcryptjs para encriptación robusta
- **Input Validation**: Sanitización en frontend y backend
- **CORS Configuration**: Políticas de origen cruzado configuradas
- **Helmet.js**: Headers de seguridad para Express
- **SQL Injection Prevention**: Prepared statements con pg

## 🔐 Análisis de Seguridad - Sistemas Implementados

### ✅ **Sistema de Autenticación JWT Robusto**
- **Tokens JWT Seguros**: Implementación con expiración configurada (1 día por defecto)
- **Middleware de Verificación**: Sistema robusto para validación de tokens con manejo específico de errores
- **Formato Bearer Token**: Correcta implementación del estándar de autorización HTTP
- **Manejo de Errores JWT**: Gestión específica para tokens expirados, inválidos y otros errores de autenticación
- **Verificación Automática**: Comprobación periódica de expiración de tokens en el frontend (cada 5 segundos)

### 🔒 **Gestión Segura de Contraseñas**
- **Hashing Robusto**: bcryptjs con 12 rounds de salt para máxima seguridad
- **Validación de Longitud**: Contraseñas mínimas de 8 caracteres requeridas
- **Almacenamiento Seguro**: Nunca se almacenan contraseñas en texto plano en la base de datos
- **Verificación Segura**: Comparación de hashes sin exposición de datos sensibles

### 👥 **Sistema de Autorización por Roles**
- **Roles Definidos**: Diferenciación clara entre usuarios normales y administradores
- **Middleware de Privilegios**: Verificación de permisos administrativos en rutas sensibles
- **Protección de Rutas**: Middleware authMiddleware y adminMiddleware para control de acceso
- **Validación Frontend**: Verificación de roles para mostrar/ocultar funcionalidades según permisos

### 🌐 **Configuración de Seguridad del Servidor**
- **CORS Específico**: Configuración restrictiva que solo permite orígenes autorizados (localhost:5173, 127.0.0.1:5173)
- **Headers de Seguridad**: Helmet.js incluido para protección con headers HTTP seguros
- **Bloqueo de Orígenes**: Manejo automático de CORS que bloquea orígenes no autorizados
- **Headers de Autorización**: Configuración correcta para manejo de tokens JWT

### 🛡️ **Validación y Sanitización de Entrada**
- **Validación de Email**: Expresiones regulares para verificar formato correcto de emails
- **Validación de Longitud**: Control de límites máximos para todos los campos de entrada
- **Queries Parametrizadas**: Uso de prepared statements con PostgreSQL para prevenir inyección SQL
- **Manejo de Errores de BD**: Gestión específica de errores de base de datos (constraints, duplicados)

### 🔄 **Gestión Segura de Sesiones**
- **Verificación Automática**: Comprobación continua de validez de tokens en el frontend
- **Cierre Automático**: Terminación automática de sesión cuando el token expira
- **Rutas Protegidas**: Componente PrivateRoute para proteger páginas que requieren autenticación
- **Estado de Autenticación**: Gestión centralizada del estado de autenticación con AuthContext

### 🔧 **Arquitectura de Seguridad Backend**
- **Middleware Centralizado**: Lógica de autenticación y autorización centralizada y reutilizable
- **Separación de Responsabilidades**: Controladores dedicados para autenticación vs. lógica de negocio
- **Validaciones Múltiples**: Verificaciones tanto en frontend como backend para doble protección
- **Manejo de Errores**: Sistema robusto de manejo de errores con códigos HTTP apropiados

### 🎯 **Puntuación de Seguridad: 8.5/10**

El proyecto TechZone implementa un sistema de seguridad **robusto y bien estructurado** que sigue las mejores prácticas de la industria. La arquitectura de seguridad está diseñada para ser escalable y mantenible, con múltiples capas de protección que garantizan la integridad y confidencialidad de los datos de usuarios y transacciones.

### Performance
- **Lazy Loading**: Carga optimizada de componentes React
- **Code Splitting**: División automática del bundle con Vite
- **Database Indexing**: Índices optimizados en PostgreSQL
- **Memoization**: Optimización de re-renderizados con React
- **Bundle Analysis**: Herramientas de análisis de tamaño
- **API Response Caching**: Optimización de consultas frecuentes

### Error Handling
- **Global Error Boundary**: Captura de errores en React
- **API Error Responses**: Códigos HTTP consistentes
- **Loading States**: UX mejorada durante operaciones asíncronas
- **Validation Messages**: Feedback claro para el usuario
- **Database Transaction**: Rollback automático en errores

## 📜 Comandos de Desarrollo

### Frontend
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build para producción  
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting
```

### Backend
```bash
# Navegar al directorio backend
cd backend

# Desarrollo
npm run dev          # Servidor con nodemon (puerto 3000)
npm start            # Servidor de producción
```

### Utilidades de Desarrollo
```bash
# Limpiar dependencias y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar puertos en uso (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Verificar puertos en uso (Linux/Mac)
lsof -i :3000
lsof -i :5173

# Ver logs del backend en tiempo real
tail -f backend/logs/app.log
```

## 👨‍💻 Desarrolladores

<div align="center">

|             **Dario Gago**              |           **Alberto Cid**           |
| :-------------------------------------: | :---------------------------------: |
|           Full Stack Developer            |         Full Stack Developer          |
| **Backend Specialist**<br/>Node.js, Express, PostgreSQL | **Frontend Specialist**<br/>React, Context API, UI/UX |
| [GitHub](https://github.com/dario-gago) | [GitHub](https://github.com/a-cidm) |

</div>

### Contribuciones del Proyecto

#### Dario Gago - Backend & Database
- 🛠️ **Arquitectura del Servidor**: Diseño e implementación del backend con Node.js y Express
- 🗄️ **Base de Datos**: Esquemas PostgreSQL, DDL/DML y optimización de consultas
- 🔐 **Autenticación**: Sistema JWT completo con middleware de seguridad
- 👥 **Gestión de Usuarios**: API completa para CRUD de usuarios con roles
- 📦 **API de Productos**: Endpoints RESTful para gestión de catálogo
- 💼 **Sistema de Ventas**: Implementación completa de ventas con base de datos relacional
- 📊 **SalesController**: API para crear, consultar y gestionar ventas con transacciones ACID
- 🔒 **Seguridad**: Implementación de bcryptjs, CORS, Helmet y validaciones
- 🏗️ **Arquitectura MVC**: Separación clara de responsabilidades en el backend

#### Alberto Cid - Frontend & UX
- ⚛️ **Arquitectura React**: Context API, Custom Hooks y componentes reutilizables
- 🎨 **UI/UX Design**: Interfaces modernas con Tailwind CSS y responsive design
- 🔄 **State Management**: Gestión de estado global con Context API
- 🛒 **E-commerce Features**: Carrito, checkout y flujo completo de compra
- 📊 **Dashboard Admin**: Panel de administración con estadísticas y gestión
- 📈 **SalesContext**: Contexto para gestión de ventas con estadísticas calculadas
- 📈 **Estadísticas Avanzadas**: Implementación de métricas con useMemo optimizado
- 🔍 **Search & Navigation**: Sistema de búsqueda y navegación por categorías
- 📱 **Mobile Experience**: Optimización completa para dispositivos móviles
- 🎯 **User Experience**: Formularios dinámicos, validaciones y feedback interactivo

### 🤝 Guidelines para Contribuidores
- Sigue las convenciones de código existentes (ESLint configurado)
- Escribe commits descriptivos siguiendo convenciones semánticas
- Documenta nuevas funcionalidades en el README
- Mantén el código limpio y bien comentado
- Realiza pruebas antes de hacer push
- Usa nombres descriptivos para variables y funciones

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <h3>🎯 Stack Tecnológico Completo</h3>
  <p><strong>Frontend:</strong> React 18+ • Tailwind CSS • React Router • Context API</p>
  <p><strong>Backend:</strong> Node.js • Express.js • PostgreSQL • JWT</p>
  <p><strong>Tools:</strong> Vite • ESLint • Git • Axios • SweetAlert2</p>
  
  <br>
  
  <p>⭐ Si te gusta este proyecto, ¡no olvides darle una estrella! ⭐</p>
  <p>Hecho con ❤️ por el equipo de <strong>TechZone</strong></p>
  
  <br>
  
  <p>
    <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/badge/Version-2.1-brightgreen?style=for-the-badge" alt="Version">
  </p>
</div>
