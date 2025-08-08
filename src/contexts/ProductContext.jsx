import React, { createContext, useState, useEffect } from 'react'
import productsData from '../data/products.json'

// Crear el contexto
const ContextoProducto = createContext()

// Proveedor del contexto
export const ProveedorProducto = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Simular carga de datos (preparación para futura API)
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setProductos(productsData.products)
        setCategorias(productsData.categories)
        setError(null)
      } catch (err) {
        setError('Error al cargar los productos')
        console.error('Error loading products:', err)
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  // Función para obtener producto por ID
  const obtenerProductoPorId = (id) => {
    return productos.find(producto => producto.id === parseInt(id))
  }

  // Función para obtener productos por categoría
  const obtenerProductosPorCategoria = (categorySlug) => {
    if (categorySlug === 'todo' || !categorySlug) {
      return productos
    }
    
    // Convertir slug de categoría a format interno del producto
    let categoryKey = categorySlug
    if (categorySlug === 'gaming-y-streaming') {
      categoryKey = 'gaming-streaming'
    } else if (categorySlug === 'conectividad-y-redes') {
      categoryKey = 'conectividad-redes'
    } else if (categorySlug === 'hogar-y-oficina') {
      categoryKey = 'hogar-oficina'
    } else if (categorySlug === 'audio-y-video') {
      categoryKey = 'audio-video'
    }
    
    return productos.filter(producto => producto.category === categoryKey)
  }

  // Función para obtener productos destacados (primeros 6)
  const obtenerProductosDestacados = () => {
    return productos.slice(0, 6)
  }

  // Función para buscar productos
  const buscarProductos = (query) => {
    if (!query.trim()) return productos
    
    const terminoBusqueda = query.toLowerCase()
    return productos.filter(producto => 
      producto.name.toLowerCase().includes(terminoBusqueda) ||
      producto.brand.toLowerCase().includes(terminoBusqueda) ||
      producto.description.toLowerCase().includes(terminoBusqueda)
    )
  }

  // Función para actualizar stock (preparación para carrito)
  const actualizarStockProducto = (idProducto, nuevoStock) => {
    setProductos(productosAnteriores => 
      productosAnteriores.map(producto => 
        producto.id === idProducto 
          ? { ...producto, stock: nuevoStock }
          : producto
      )
    )
  }

  // Función para formatear precios
  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`
  }

  const value = {
    productos,
    categorias,
    cargando,
    error,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosDestacados,
    buscarProductos,
    actualizarStockProducto,
    formatearPrecio,
    // Mantener compatibilidad con nombres en inglés
    products: productos,
    categories: categorias,
    loading: cargando,
    getProductById: obtenerProductoPorId,
    getProductsByCategory: obtenerProductosPorCategoria,
    getFeaturedProducts: obtenerProductosDestacados,
    searchProducts: buscarProductos,
    updateProductStock: actualizarStockProducto,
    formatPrice: formatearPrecio
  }

  return (
    <ContextoProducto.Provider value={value}>
      {children}
    </ContextoProducto.Provider>
  )
}

// Exportaciones para compatibilidad
export default ContextoProducto
export const ProductContext = ContextoProducto
export const ProductProvider = ProveedorProducto
