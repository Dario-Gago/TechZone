# 🧩 Componentes UI - TechZone

## 📋 Índice
1. [Arquitectura de Componentes](#arquitectura-de-componentes)
2. [Componentes de Layout](#componentes-de-layout)
3. [Componentes de Productos](#componentes-de-productos)
4. [Componentes de Autenticación](#componentes-de-autenticación)
5. [Componentes del Carrito](#componentes-del-carrito)
6. [Componentes de Administración](#componentes-de-administración)

## 🏗️ Arquitectura de Componentes

### Principios de Diseño
- **Reutilización**: Componentes modulares y parametrizables
- **Composición**: Combinación de componentes pequeños
- **Separación de Responsabilidades**: UI separada de lógica
- **Props Typing**: Validación implícita con JSX
- **Performance**: Memoización y lazy loading

### Jerarquía de Componentes
```
App
├── Navbar (Layout)
├── Router
│   └── Pages
│       ├── Home
│       │   ├── Carousel (Products)
│       │   ├── FeaturedProducts (Products)
│       │   └── BrandBanner (Products)
│       ├── ProductDetail
│       ├── Cart
│       │   ├── CartItem (Cart)
│       │   └── OrderSummary (Cart)
│       └── Dashboard
│           └── AdminTabs (Admin)
└── Footer (Layout)
```

## 🏠 Componentes de Layout

### Navbar.jsx - Barra de Navegación Principal
```jsx
// Funcionalidades principales:
// - Navegación responsive
// - Búsqueda integrada
// - Autenticación UI
// - Categorías dinámicas
// - Contador de carrito

const Navbar = () => {
  const [estaMenuAbierto, setEstaMenuAbierto] = useState(false)
  const [estaBusquedaAbierta, setEstaBusquedaAbierta] = useState(false)
  const { estaAutenticado, cerrarSesion } = useAutenticacion()
  const { todosLosProductos: productos, cargando } = useProductos()
  const { obtenerTotalItems } = useCarrito()

  // Extraer categorías únicas de productos
  const categoriasValidas = useMemo(() => {
    if (cargando || !Array.isArray(productos)) return []

    const ordenCategorias = [
      'gaming-streaming',
      'computacion', 
      'componentes',
      'conectividad-redes',
      'hogar-oficina',
      'audio-video'
    ]

    const categoriasEncontradas = [
      ...new Set(productos.map(producto => producto.categoria))
    ].filter(categoria => categoria && categoria.trim() !== '')

    return [
      { id: 'nav-todo', slug: 'todo', name: 'Todo' },
      ...ordenCategorias
        .filter(cat => categoriasEncontradas.includes(cat))
        .map((categoria, index) => ({
          id: `nav-cat-${index}`,
          slug: categoria,
          name: categoria.split('-').map(palabra => 
            palabra.charAt(0).toUpperCase() + palabra.slice(1)
          ).join(' ')
        }))
    ]
  }, [productos, cargando])

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Header con logo, búsqueda y acciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="TechZone" className="h-8 w-auto" />
          </Link>

          {/* Búsqueda - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <BarraDeBusqueda />
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Botones de autenticación */}
            {!estaAutenticado ? (
              <div className="hidden sm:flex items-center space-x-4">
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link to="/dashboard">Mi cuenta</Link>
                <button onClick={cerrarSesion}>Cerrar sesión</button>
              </div>
            )}

            {/* Carrito con contador */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {obtenerTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {obtenerTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menú de categorías - Desktop */}
      <div className="hidden lg:block bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-3">
            {cargando ? (
              // Skeleton loader
              [...Array(6)].map((_, index) => (
                <div key={index} className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
              ))
            ) : (
              categoriasValidas.map(category => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Características clave:**
- **Responsive**: Desktop y móvil con diferentes layouts
- **Estado dinámico**: Categorías extraídas de productos reales
- **Búsqueda integrada**: Componente SearchBar embebido
- **Autenticación visual**: UI diferente según estado de login
- **Performance**: Memoización de categorías con useMemo

### Footer.jsx - Pie de Página
```jsx
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="col-span-1 md:col-span-2">
            <img src={Logo} alt="TechZone" className="h-8 w-auto mb-4" />
            <p className="text-gray-300 mb-4">
              Tu destino definitivo para tecnología gaming de alta calidad.
              Productos innovadores con garantía y soporte técnico especializado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li><Link to="/category/gaming" className="text-gray-300 hover:text-white">Gaming</Link></li>
              <li><Link to="/category/componentes" className="text-gray-300 hover:text-white">Componentes</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Términos de Servicio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Garantías</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2025 TechZone. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### ScrollToTop.jsx - Scroll Automático
```jsx
// Hook personalizado para scroll automático en cambio de ruta
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
```

## 🛍️ Componentes de Productos

### FeaturedProducts.jsx - Productos Destacados
```jsx
const FeaturedProducts = () => {
  const { productosDestacados, cargando } = useProductos()
  const { agregarAlCarrito } = useCarrito()
  const navigate = useNavigate()

  const manejarAgregarCarrito = useCallback(async (product) => {
    try {
      await agregarAlCarrito({
        producto_id: product.producto_id,
        nombre: product.nombre,
        precio_oferta: product.precio_oferta,
        imagen_url: product.imagen_url,
        stock: product.stock,
        cantidad: 1
      })

      await Swal.fire({
        icon: 'success',
        title: '¡Agregado al carrito!',
        text: `${product.nombre} se agregó correctamente`,
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el producto al carrito'
      })
    }
  }, [agregarAlCarrito])

  if (cargando) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!productosDestacados?.length) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-gray-600">No hay productos destacados disponibles</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productosDestacados.slice(0, 8).map((product) => (
            <ProductCard
              key={product.producto_id}
              product={product}
              onAddToCart={() => manejarAgregarCarrito(product)}
              onViewDetails={() => navigate(`/product/${product.producto_id}`)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/category/todo"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver todos los productos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

### Carousel.jsx - Slider de Productos
```jsx
const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { productosDestacados, cargando } = useProductos()

  // Auto-play del carousel
  useEffect(() => {
    if (!productosDestacados?.length) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev === productosDestacados.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [productosDestacados])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide(prev => 
      prev === 0 ? productosDestacados.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentSlide(prev => 
      prev === productosDestacados.length - 1 ? 0 : prev + 1
    )
  }

  if (cargando) {
    return (
      <div className="relative h-96 bg-gray-200 animate-pulse rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!productosDestacados?.length) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">TechZone</h2>
          <p className="text-xl">Tu destino para tecnología gaming</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-96 overflow-hidden rounded-lg bg-gray-900">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {productosDestacados.slice(0, 5).map((product, index) => (
          <div 
            key={product.producto_id} 
            className="w-full flex-shrink-0 relative"
          >
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {product.nombre}
                  </h3>
                  <p className="text-xl text-gray-200 mb-4">
                    ${product.precio_oferta}
                  </p>
                  <Link
                    to={`/product/${product.producto_id}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100"
                  >
                    Ver producto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {productosDestacados.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

### SearchBar.jsx - Barra de Búsqueda
```jsx
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { buscarProductos } = useProductos()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  // Debounce para búsqueda en tiempo real
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length >= 2) {
        try {
          const results = await buscarProductos({ search: term, limit: 5 })
          setSuggestions(results)
          setShowSuggestions(true)
        } catch (error) {
          console.error('Error en búsqueda:', error)
          setSuggestions([])
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300),
    [buscarProductos]
  )

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.producto_id}`)
    setSearchTerm('')
    setShowSuggestions(false)
  }

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </form>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.producto_id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.nombre}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  ${product.precio_oferta}
                </p>
              </div>
            </button>
          ))}
          
          {searchTerm && (
            <button
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
                setShowSuggestions(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 text-blue-600 border-t border-gray-200"
            >
              Ver todos los resultados para "{searchTerm}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Utility function debounce
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

**Características clave de los componentes:**
- **Performance**: Lazy loading, memoización, debounce
- **UX**: Loading states, error handling, animaciones suaves
- **Responsive**: Adaptación a diferentes tamaños de pantalla
- **Accesibilidad**: Aria labels, keyboard navigation
- **Modularidad**: Componentes reutilizables y composables
