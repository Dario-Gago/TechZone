# 🎮 TechZone

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</div>

<div align="center">
  <h3>🚀 Tu destino definitivo para tecnología gaming de alta calidad</h3>
  <p>E-commerce moderno con React, Context API y arquitectura escalable</p>
</div>

---

## 📋 Descripción

**TechZone** es una aplicación web de comercio electrónico moderna especializada en productos tecnológicos y gaming. Desarrollada con React 18+ y siguiendo las mejores prácticas de desarrollo frontend, ofrece una experiencia de usuario fluida e intuitiva con arquitectura escalable preparada para crecimiento empresarial.

### ✨ Características Principales

- � **E-commerce Completo**: Sistema integral de productos, categorías y navegación
- 📱 **Responsive Design**: Experiencia optimizada en todos los dispositivos  
- 🔍 **Búsqueda Inteligente**: Sistema de búsqueda en tiempo real con filtros avanzados
- 🗂️ **Navegación por Categorías**: Filtrado dinámico por categorías de productos
- 📄 **Páginas de Detalle**: Información completa de productos con imágenes y especificaciones
- 🛒 **Carrito Dinámico**: Gestión fluida de productos con actualización en tiempo real
- � **Autenticación Segura**: Sistema de login/registro con rutas protegidas
- ⚡ **Rendimiento Optimizado**: Context API, hooks personalizados y componentes reutilizables
- 🎨 **UI/UX Moderna**: Interfaz atractiva con Tailwind CSS y componentes interactivos
- 📊 **Estado Global**: Gestión centralizada con Context API y hooks personalizados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18+** - Biblioteca principal con hooks y Context API
- **React Router DOM** - Navegación SPA con rutas dinámicas y protegidas
- **JavaScript ES6+** - Lenguaje moderno con async/await y destructuring
- **Tailwind CSS** - Framework CSS utilitario para diseño responsivo
- **Lucide React** - Biblioteca de iconos moderna y consistente

### Arquitectura y Patrones
- **Context API** - Gestión de estado global (Auth y Products)
- **Custom Hooks** - Lógica reutilizable (`useProducts`, `useAuth`)
- **Component Composition** - Componentes reutilizables y modulares
- **Render Props** - Patrones avanzados de React

### Herramientas de Desarrollo
- **Vite** - Build tool moderno y rápido
- **ESLint** - Linting para código consistente
- **Git** - Control de versiones

### Preparado para Backend
- **Estructura JSON** - Base de datos simulada preparada para PostgreSQL
- **API-Ready** - Funciones abstractas listas para integración con backend
- **Async Patterns** - Manejo de estados de carga y errores

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/a-cidm/TechZone.git
   cd TechZone
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173/
   ```

## 📁 Estructura del Proyecto

```
TechZone/
├── public/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Carousel.jsx         # Carrusel de productos
│   │   ├── FeaturedProducts.jsx # Productos destacados
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── Navbar.jsx           # Navegación principal
│   │   ├── SearchBar.jsx        # Barra de búsqueda
│   │   ├── PrivateRoute.jsx     # Rutas protegidas
│   │   └── PublicRoute.jsx      # Rutas públicas
│   ├── contexts/            # Contextos globales
│   │   ├── AuthContext.jsx      # Autenticación
│   │   └── ProductContext.jsx   # Productos y categorías
│   ├── hooks/               # Hooks personalizados
│   │   └── useProducts.js       # Hook para productos
│   ├── pages/               # Páginas principales
│   │   ├── Home.jsx             # Página de inicio
│   │   ├── ProductDetail.jsx    # Detalle del producto
│   │   ├── CategoryPage.jsx     # Productos por categoría
│   │   ├── SearchPage.jsx       # Resultados de búsqueda
│   │   ├── Cart.jsx             # Carrito de compras
│   │   ├── Dashboard.jsx        # Panel de usuario
│   │   ├── Login.jsx            # Iniciar sesión
│   │   └── Register.jsx         # Registro
│   ├── data/                # Datos y configuración
│   │   └── products.json        # Base de datos de productos
│   ├── App.jsx              # Componente principal
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada
├── package.json
├── README.md
└── vite.config.js
```

## 🎮 Funcionalidades

### 🔐 Sistema de Autenticación
- **Login y Register**: Autenticación segura de usuarios
- **AuthContext**: Gestión global del estado de autenticación
- **PrivateRoute**: Protección de rutas para usuarios autenticados
- **PublicRoute**: Redirección automática si ya está autenticado

### 🏠 Página Principal (Home)
- **Hero Section**: Carrusel interactivo de productos destacados
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
- **Estado de Stock**: Indicadores visuales de disponibilidad
- **Navegación Relacionada**: Productos destacados al final de la página

### 🗂️ Navegación por Categorías
- **Filtrado Dinámico**: Productos organizados por categorías desde JSON
- **URLs Amigables**: Rutas SEO-friendly para cada categoría
- **Grid Responsivo**: Diseño adaptable con información completa
- **Contadores**: Número de productos encontrados por categoría

### 🛒 Carrito de Compras (En desarrollo)
- **Gestión de Productos**: Añadir/eliminar productos
- **Actualización Dinámica**: Cantidades y totales en tiempo real
- **Persistencia**: Mantenimiento del carrito entre sesiones

### 📊 Dashboard de Usuario
- **Panel Personalizado**: Información del usuario autenticado
- **Gestión de Perfil**: Configuración de datos personales
- **Rutas Protegidas**: Acceso solo para usuarios autenticados

### 🎨 Componentes Avanzados
- **Navbar Dinámico**: Categorías cargadas desde contexto, búsqueda integrada
- **Footer Informativo**: Enlaces organizados y información de contacto
- **Loading States**: Animaciones de carga en todas las páginas
- **Error Handling**: Manejo elegante de errores y estados vacíos

## � Arquitectura y Patrones

### Context API y Estado Global
- **ProductContext**: Gestión centralizada de productos y categorías
- **AuthContext**: Estado de autenticación global
- **Custom Hooks**: `useProducts` para lógica de negocio reutilizable

### Rutas y Navegación
```
/ - Página principal con productos destacados
/product/:id - Detalle específico del producto
/category/:categorySlug - Productos filtrados por categoría  
/search?q=term - Resultados de búsqueda
/login - Autenticación de usuarios
/register - Registro de nuevos usuarios
/cart - Carrito de compras
/dashboard - Panel de usuario (ruta protegida)
```

### Componentes Reutilizables
- **Composición**: Componentes modulares y reutilizables
- **Props**: Paso de datos dinámicos entre componentes
- **Renderizado Condicional**: Adaptación según estado y datos
- **Event Handling**: Gestión de eventos de usuario

### Gestión de Datos
- **JSON Database**: `products.json` con estructura escalable
- **API-Ready**: Funciones preparadas para migración a backend
- **Error Boundaries**: Manejo robusto de errores
- **Loading States**: UX mejorada durante cargas

## 🔮 Próximas Funcionalidades

### Backend Integration
- [ ] Migración a PostgreSQL con pgAdmin
- [ ] API RESTful para productos y usuarios
- [ ] Autenticación JWT con refresh tokens

### E-commerce Features
- [ ] Carrito de compras completamente funcional
- [ ] Sistema de checkout y pagos
- [ ] Gestión de pedidos y historial

## 📱 Demo

### Página Principal
- Carrusel interactivo con productos destacados
- Navegación por categorías dinámicas
- Diseño responsive y moderno

### Detalle de Producto
- Información completa con imágenes y especificaciones
- Gestión de cantidad y estado de stock
- Productos relacionados

### Búsqueda y Filtros
- Búsqueda en tiempo real
- Resultados organizados con filtros
- Estados de carga y manejo de errores

## 🧪 Testing y Calidad

### Code Standards
- **ESLint**: Reglas de linting configuradas
- **Component Structure**: Arquitectura modular y escalable
- **Git Workflow**: Commits semánticos y branches organizadas

### Performance
- **Lazy Loading**: Carga optimizada de componentes
- **Code Splitting**: División automática del bundle
- **Memoization**: Optimización de re-renderizados
- **Bundle Analysis**: Herramientas de análisis de tamaño

## � Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción  
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting

# Utilidades
npm run clean        # Limpiar node_modules y reinstalar
npm run analyze      # Analizar bundle size
```

## 👨‍💻 Desarrolladores

<div align="center">

|             **Dario Gago**              |           **Alberto Cid**           |
| :-------------------------------------: | :---------------------------------: |
|           Full Stack Developer            |         Full Stack Developer          |
| [GitHub](https://github.com/dario-gago) | [GitHub](https://github.com/a-cidm) |

</div>

### Guidelines
- Sigue las convenciones de código existentes
- Escribe commits descriptivos
- Documenta nuevas funcionalidades
- Mantén el código limpio y comentado

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p>⭐ Si te gusta este proyecto, ¡no olvides darle una estrella! ⭐</p>
  <p>Hecho con ❤️ por el equipo de TechZone</p>
</div>
