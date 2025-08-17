import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const ContextoProducto = createContext()

export const ProveedorProducto = ({ children }) => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = API_ENDPOINTS.PRODUCTOS

  // ---------------- Instancia de Axios con token ----------------
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  // Interceptor para agregar token automáticamente
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // ---------------- Categorías ----------------
  const actualizarCategorias = (productosActualizados) => {
    // Orden correcto según la base de datos
    const ordenCategorias = [
      'gaming-streaming',
      'computacion', 
      'componentes',
      'conectividad-redes',
      'hogar-oficina',
      'audio-video',
      'otras-categorias'
    ]

    const categoriasEncontradas = [
      ...new Set(productosActualizados.map((p) => p.categoria || p.category))
    ].filter(Boolean)

    // Ordenar según el orden predefinido
    const categoriasOrdenadas = ordenCategorias
      .filter(categoriaOrden => categoriasEncontradas.includes(categoriaOrden))
      .map((categoria, index) => ({
        id: index + 1,
        name: categoria.replace(/-/g, ' '),
        slug: categoria
      }))

    setCategorias(categoriasOrdenadas)
  }

  // ---------------- Cargar productos ----------------
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        const response = await api.get('/')
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

  const agregarProducto = async (nuevoProducto) => {
    try {
      console.log('🟢 Datos recibidos en agregarProducto:', nuevoProducto)

      // ✅ CORRECCIÓN: El formulario ahora envía datos en español, usar esos directamente
      const payload = {
        nombre: (nuevoProducto.nombre || '').trim(),
        marca: (nuevoProducto.marca || '').trim(),
        descripcion: nuevoProducto.descripcion || '',
        precio_original: Number(nuevoProducto.precio_original) || 0,
        precio_descuento: Number(nuevoProducto.precio_descuento) || 0,
        descuento: Number(nuevoProducto.descuento) || 0,
        imagen: (nuevoProducto.imagen || '').trim(),
        categoria: (nuevoProducto.categoria || '').trim(),
        subcategoria: nuevoProducto.subcategoria || '',
        stock: Number(nuevoProducto.stock) || 0,
        en_stock: Number(nuevoProducto.en_stock) || 1,
        destacado: Boolean(nuevoProducto.destacado),
        envio: nuevoProducto.envio || 'Envío estándar',
        caracteristicas: nuevoProducto.caracteristicas || null // ✅ Características incluidas
      }

      console.log('🟢 Payload enviado al backend:', payload)

      const response = await api.post('/', payload)

      const productoCreado = {
        ...response.data,
        name: response.data.nombre || response.data.name,
        brand: response.data.marca || response.data.brand,
        description:
          response.data.descripcion || response.data.description || '',
        originalPrice:
          response.data.precio_original || response.data.originalPrice,
        discountPrice:
          response.data.precio_descuento || response.data.discountPrice,
        category: response.data.categoria || response.data.category,
        subcategory:
          response.data.subcategoria || response.data.subcategory || '',
        image: response.data.imagen || response.data.image,
        features: response.data.features || [] // ✅ Asegurar que features esté presente
      }

      setProductos((prev) => {
        const nuevosProductos = [...prev, productoCreado]
        actualizarCategorias(nuevosProductos)
        return nuevosProductos
      })

      setError(null)
      return { success: true, data: productoCreado }
    } catch (err) {
      console.error('Error al agregar producto:', err)
      const errorMessage =
        err.response?.data?.message || err.message || 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const editarProducto = async (id, productoActualizado) => {
    try {
      console.log('🟡 Datos recibidos en editarProducto:', productoActualizado)

      // ✅ CORRECCIÓN: Manejar tanto formato español como inglés para compatibilidad
      const payload = {
        nombre: (
          productoActualizado.nombre ||
          productoActualizado.name ||
          ''
        ).trim(),
        marca: (
          productoActualizado.marca ||
          productoActualizado.brand ||
          ''
        ).trim(),
        descripcion: (
          productoActualizado.descripcion ||
          productoActualizado.description ||
          ''
        ).trim(),
        precio_original:
          Number(
            productoActualizado.precio_original ||
              productoActualizado.originalPrice
          ) || 0,
        precio_descuento:
          Number(
            productoActualizado.precio_descuento ||
              productoActualizado.discountPrice
          ) || 0,
        descuento: Number(productoActualizado.descuento) || 0,
        imagen: (
          productoActualizado.imagen ||
          productoActualizado.image ||
          ''
        ).trim(),
        categoria: (
          productoActualizado.categoria ||
          productoActualizado.category ||
          ''
        ).trim(),
        subcategoria: (
          productoActualizado.subcategoria ||
          productoActualizado.subcategory ||
          ''
        ).trim(),
        stock: Number(productoActualizado.stock) || 0,
        en_stock: Number(productoActualizado.en_stock) || 1,
        destacado: Boolean(productoActualizado.destacado),
        envio: productoActualizado.envio || 'Envío estándar',
        caracteristicas:
          productoActualizado.caracteristicas ||
          productoActualizado.features ||
          null // ✅ Manejar ambos nombres
      }

      console.log('🟡 Payload enviado al backend:', payload)

      const response = await api.put(`/${id}`, payload)

      const productoEditado = {
        ...response.data,
        name: response.data.nombre || response.data.name,
        brand: response.data.marca || response.data.brand,
        description: response.data.descripcion || response.data.description,
        originalPrice:
          response.data.precio_original || response.data.originalPrice,
        discountPrice:
          response.data.precio_descuento || response.data.discountPrice,
        category: response.data.categoria || response.data.category,
        subcategory: response.data.subcategoria || response.data.subcategory,
        image: response.data.imagen || response.data.image,
        features: response.data.features || [] // ✅ Asegurar que features esté presente
      }

      setProductos((prev) =>
        prev.map((p) =>
          p.id === parseInt(id) ? { ...p, ...productoEditado } : p
        )
      )

      actualizarCategorias(productos)
      setError(null)
      return { success: true, data: productoEditado }
    } catch (err) {
      console.error('Error editando producto:', err)
      const errorMessage =
        err.response?.data?.message || err.message || 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/${id}`)
      setProductos((prev) => {
        const nuevosProductos = prev.filter((p) => p.id !== parseInt(id))
        actualizarCategorias(nuevosProductos)
        return nuevosProductos
      })
      setError(null)
      return { success: true }
    } catch (err) {
      console.error('Error eliminando producto:', err)
      const errorMessage =
        err.response?.data?.message || err.message || 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // ---------------- Funciones auxiliares ----------------
  const obtenerProductoPorId = (id) =>
    productos.find((p) => p.id === parseInt(id))

  const obtenerProductosPorCategoria = (category) =>
    category === 'todo'
      ? productos
      : productos.filter((p) => (p.category || p.categoria) === category)

  const obtenerProductosDestacados = () => productos.slice(0, 6)

  const buscarProductos = (query) => {
    if (!query.trim()) return productos
    const q = query.toLowerCase()
    return productos.filter(
      (p) =>
        (p.name || p.nombre || '').toLowerCase().includes(q) ||
        (p.brand || p.marca || '').toLowerCase().includes(q) ||
        (p.description || p.descripcion || '').toLowerCase().includes(q)
    )
  }

  const formatearPrecio = (precio) =>
    typeof precio === 'number' ? `$${precio.toLocaleString('es-CL')}` : precio

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
