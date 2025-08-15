import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const ContextoProducto = createContext()

export const ProveedorProducto = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = `${API_ENDPOINTS.PRODUCTOS}`

  // Función para actualizar categorías
  const actualizarCategorias = (productosActualizados) => {
    const categoriasUnicas = [
      ...new Set(productosActualizados.map((p) => p.category))
    ].filter(Boolean)

    const categoriasObjetos = categoriasUnicas.map((categoria, index) => ({
      id: index + 1,
      name: categoria,
      slug: categoria.toLowerCase().replace(/\s+/g, '-')
    }))

    setCategorias(categoriasObjetos)
  }

  // Cargar productos inicial
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        const response = await axios.get(API_URL)
        setProductos(response.data)
        actualizarCategorias(response.data)
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

  // ---------------- CRUD ----------------

  // Agregar producto
  // Agregar producto - VERSIÓN CORREGIDA
  const agregarProducto = async (nuevoProducto) => {
    try {
      console.log('=== AGREGANDO PRODUCTO ===')
      console.log('Datos recibidos del form:', nuevoProducto)

      // Validación antes del mapeo
      if (!nuevoProducto.name || !nuevoProducto.name.trim()) {
        const error = 'El nombre del producto es obligatorio'
        setError(error)
        return { success: false, error }
      }

      // Mapear los campos del frontend a los de la base de datos
      const productoCompleto = {
        nombre: nuevoProducto.name.trim(), // ✅ Asegurar que no esté vacío y sin espacios
        marca: nuevoProducto.brand?.trim() || '', // ✅ Usar optional chaining y trim
        descripcion: nuevoProducto.description?.trim() || '',
        precio_original: parseFloat(nuevoProducto.originalPrice) || 0,
        precio_descuento: parseFloat(nuevoProducto.discountPrice) || 0,
        descuento: nuevoProducto.discount || 0,
        imagen: nuevoProducto.image?.trim() || '',
        categoria: nuevoProducto.category?.trim() || '',
        subcategoria: nuevoProducto.subcategory?.trim() || '',
        stock: parseInt(nuevoProducto.stock) || 0,
        destacado: Boolean(nuevoProducto.destacado)
      }

      console.log('Datos a enviar a la API:', productoCompleto)

      // Validación adicional
      if (!productoCompleto.nombre) {
        const error = 'Error en el procesamiento: nombre vacío'
        setError(error)
        return { success: false, error }
      }

      // POST a la API
      const { data } = await axios.post(
        API_ENDPOINTS.PRODUCTOS,
        productoCompleto
      )

      console.log('Respuesta de la API:', data)

      // Actualizar estado de productos
      setProductos((prevProductos) => {
        const nuevosProductos = [...prevProductos, data]
        actualizarCategorias(nuevosProductos)
        return nuevosProductos
      })

      setError(null)
      return { success: true, data }
    } catch (err) {
      console.error('❌ Error agregando producto:', err)
      console.error('Response data:', err.response?.data)
      console.error('Response status:', err.response?.status)

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error desconocido al crear el producto'

      setError(`Error al agregar el producto: ${errorMessage}`)
      return { success: false, error: err }
    }
  }

  const editarProducto = async (id, productoActualizado) => {
    try {
      console.log('=== EDITANDO PRODUCTO ===')
      console.log('ID:', id, 'Tipo:', typeof id)
      console.log('Datos:', productoActualizado)

      // Preparar datos completos
      const productoCompleto = {
        ...productoActualizado,
        discountPrice: productoActualizado.discountPrice ?? 0,
        originalPrice: productoActualizado.originalPrice || 0
      }

      // Limpiar campos vacíos
      const productoLimpio = Object.fromEntries(
        Object.entries(productoCompleto).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ''
        )
      )

      console.log('Enviando a API:', productoLimpio)

      // Hacer la petición
      const { data: productoEditado } = await axios.put(
        `${API_URL}/${id}`,
        productoLimpio,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      console.log('Respuesta del servidor:', productoEditado)

      // ✅ CLAVE: Usar callback y asegurar ID consistente
      setProductos((prevProductos) => {
        const idNumerico = parseInt(id)
        const nuevosProductos = prevProductos.map((producto) => {
          if (producto.id === idNumerico) {
            // ✅ Crear objeto completamente nuevo con todos los campos
            return {
              ...producto, // Mantener campos existentes
              ...productoEditado, // Sobrescribir con datos actualizados
              id: idNumerico, // Garantizar ID consistente
              // Forzar timestamp para key única
              lastUpdated: Date.now()
            }
          }
          return producto
        })

        console.log(
          'Estado actualizado - Producto editado:',
          nuevosProductos.find((p) => p.id === idNumerico)
        )

        // Actualizar categorías con los nuevos productos
        actualizarCategorias(nuevosProductos)
        return nuevosProductos
      })

      setError(null)
      return { success: true, data: productoEditado }
    } catch (err) {
      console.error('❌ Error editando producto:', err)
      const errorMessage =
        err.response?.data?.message || err.message || 'Error desconocido'
      setError(`Error al editar el producto: ${errorMessage}`)
      return { success: false, error: err }
    }
  }

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)

      setProductos((prevProductos) => {
        const nuevosProductos = prevProductos.filter(
          (p) => p.id !== parseInt(id)
        )
        actualizarCategorias(nuevosProductos)
        return nuevosProductos
      })

      setError(null)
      return { success: true }
    } catch (err) {
      console.error('Error eliminando producto:', err)
      setError('Error al eliminar el producto')
      return { success: false, error: err }
    }
  }

  // ---------------- Funciones auxiliares ----------------
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
    return `$${precio.toLocaleString('es-CL')}`
  }

  // ---------------- Context Value ----------------
  const value = {
    productos,
    categorias,
    cargando,
    error,
    formatearPrecio,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosDestacados,
    buscarProductos,
    setError
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
