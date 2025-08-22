import { useContext, useMemo, useCallback } from 'react'
import { ProductContext } from '../contexts/ProductContext'

export const useProductos = () => {
  // ✅ Usar el contexto existente en lugar de hacer peticiones duplicadas
  const {
    productos: todosLosProductos,
    cargando,
    error,
    formatearPrecio: formatearPrecioContexto
  } = useContext(ProductContext)

  // ✅ Función para obtener productos destacados (solo con stock > 0)
  const obtenerProductosDestacados = useCallback(() => {
    return todosLosProductos.filter(
      (producto) => producto.destacado === true && producto.stock > 0
    )
  }, [todosLosProductos])

  // ✅ Función para obtener productos por categoría (solo con stock > 0)
  const obtenerProductosPorCategoria = useCallback(
    (categoria) => {
      return todosLosProductos.filter(
        (producto) =>
          (producto.category || producto.categoria)?.toLowerCase() === categoria.toLowerCase() &&
          producto.stock > 0
      )
    },
    [todosLosProductos]
  )

  // ✅ Función para buscar productos (memoizada)
  const buscarProductos = useCallback(
    (consulta) => {
      if (!consulta || consulta.trim() === '') {
        return []
      }

      const terminoBusqueda = consulta.toLowerCase().trim()

      return todosLosProductos.filter((producto) => {
        // Solo mostrar productos con stock > 0
        if (producto.stock <= 0) return false

        // Buscar en nombre, marca, categoría y descripción
        const coincideNombre = (producto.name || producto.nombre)
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideMarca = (producto.brand || producto.marca)
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideCategoria = (producto.category || producto.categoria)
          ?.toLowerCase()
          .includes(terminoBusqueda)
        const coincideDescripcion = (producto.description || producto.descripcion)
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
    [todosLosProductos]
  )

  // ✅ Función para formatear precio (usar la del contexto si está disponible)
  const formatearPrecio = useCallback((precio) => {
    if (formatearPrecioContexto) {
      return formatearPrecioContexto(precio)
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio)
  }, [formatearPrecioContexto])

  // ✅ Productos con stock (memoizado)
  const productosConStock = useMemo(() => {
    return todosLosProductos.filter((producto) => producto.stock > 0)
  }, [todosLosProductos])

  return {
    productos: productosConStock, // ✅ Por defecto solo productos con stock
    todosLosProductos, // ✅ ARRAY de todos los productos para admin
    obtenerProductosDestacados,
    obtenerProductosPorCategoria,
    buscarProductos,
    formatearPrecio,
    cargando,
    error,
    recargarProductos: () => {
      // El contexto maneja la recarga automáticamente}
  }
}
