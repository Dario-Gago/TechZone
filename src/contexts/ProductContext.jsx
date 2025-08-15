import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const ContextoProducto = createContext()

export const ProveedorProducto = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        const response = await axios.get('http://localhost:3000/api/productos')
        setProductos(response.data)

        // Extraer categorías únicas
        const categoriasUnicas = [
          ...new Set(response.data.map((producto) => producto.category))
        ]
        setCategorias(categoriasUnicas)

        setError(null)
      } catch (err) {
        console.error(err)
        setError('Error al cargar los productos')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  // Funciones auxiliares (igual que antes)
  const obtenerProductoPorId = (id) =>
    productos.find((p) => p.id === parseInt(id))
  const obtenerProductosPorCategoria = (category) =>
    category === 'todo'
      ? productos
      : productos.filter((p) => p.category === category)
  const obtenerProductosDestacados = () => productos.slice(0, 6)
  const buscarProductos = (query) => {
    if (!query.trim()) return productos
    const q = query.toLowerCase()
    return productos.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }
  const formatearPrecio = (precio) => {
    if (typeof precio !== 'number') return precio
    return `$${precio.toLocaleString('es-CL')}` // Formato chileno, por ejemplo
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
    formatearPrecio,
    products: productos,
    categories: categorias,
    loading: cargando,
    getProductById: obtenerProductoPorId,
    getProductsByCategory: obtenerProductosPorCategoria,
    getFeaturedProducts: obtenerProductosDestacados,
    searchProducts: buscarProductos
  }

  return (
    <ContextoProducto.Provider value={value}>
      {children}
    </ContextoProducto.Provider>
  )
}

export default ContextoProducto
export const ProductContext = ContextoProducto
export const ProductProvider = ProveedorProducto
