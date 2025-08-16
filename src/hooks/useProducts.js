import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Función para obtener productos destacados (solo con stock > 0)
  const obtenerProductosDestacados = useCallback(() => {
    return productos.filter(
      (producto) => producto.destacado === true && producto.stock > 0
    )
  }, [productos])

  // ✅ Función para obtener productos por categoría (solo con stock > 0)
  const obtenerProductosPorCategoria = useCallback(
    (categoria) => {
      return productos.filter(
        (producto) =>
          producto.category.toLowerCase() === categoria.toLowerCase() &&
          producto.stock > 0
      )
    },
    [productos]
  )

  // ✅ Función para buscar productos (memoizada)
  const buscarProductos = useCallback(
    (consulta) => {
      if (!consulta || consulta.trim() === '') {
        return []
      }

      const terminoBusqueda = consulta.toLowerCase().trim()

      return productos.filter((producto) => {
        // Solo mostrar productos con stock > 0
        if (producto.stock <= 0) return false

        // Buscar en nombre, marca, categoría y descripción
        const coincideNombre = producto.name
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideMarca = producto.brand
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideCategoria = producto.category
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideDescripcion = producto.description
          ?.toLowerCase()
          .includes(terminoBusqueda)

        return (
          coincideNombre ||
          coincideMarca ||
          coincideCategoria ||
          coincideDescripcion
        )
      })
    },
    [productos]
  )

  // ✅ Función para formatear precio (memoizada)
  const formatearPrecio = useCallback((precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio)
  }, [])

  // ✅ Función para cargar productos (memoizada)
  const cargarProductos = useCallback(async () => {
    try {
      setCargando(true)
      const { data } = await axios.get(API_ENDPOINTS.PRODUCTOS)
      setProductos(data)
      setError(null)
    } catch (err) {
      console.error('Error cargando productos:', err)
      setError('Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }, [])

  // ✅ Productos con stock (memoizado)
  const productosConStock = useMemo(() => {
    return productos.filter((producto) => producto.stock > 0)
  }, [productos])

  // ✅ CORRECCIÓN: Retornar arrays en lugar de funciones
  const todosLosProductos = useMemo(() => {
    return productos // Todos los productos para admin
  }, [productos])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  return {
    productos: productosConStock, // ✅ Por defecto solo productos con stock
    todosLosProductos, // ✅ ARRAY de todos los productos para admin
    obtenerProductosDestacados,
    obtenerProductosPorCategoria,
    buscarProductos,
    formatearPrecio,
    cargando,
    error,
    recargarProductos: cargarProductos
  }
}
