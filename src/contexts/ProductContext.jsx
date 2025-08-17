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
      ...new Set(productosActualizados.map((p) => p.categoria))
    ].filter(Boolean)

    // Ordenar según el orden predefinido
    const categoriasOrdenadas = ordenCategorias
      .filter(categoriaOrden => categoriasEncontradas.includes(categoriaOrden))
      .map((categoria, index) => ({
        id: index + 1,
        name: categoria
          .split('-')
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' '),
        slug: categoria
      }))

    setCategorias(categoriasOrdenadas)
  }

  // ---------------- Cargar productos ----------------
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        const response = await axios.get(API_ENDPOINTS.PRODUCTOS)
        
        // ✅ Convertir datos del backend (español) a formato del frontend (inglés/español mixto)
        const productosConvertidos = response.data.map(producto => {
          const caracteristicasProcessed = (() => {
            if (Array.isArray(producto.caracteristicas)) {
              return producto.caracteristicas
            }
            if (typeof producto.caracteristicas === 'string' && producto.caracteristicas.trim()) {
              try {
                return JSON.parse(producto.caracteristicas)
              } catch {
                return [producto.caracteristicas]
              }
            }
            return []
          })()
          
          return {
            // Backend fields (Spanish)
            ...producto,
            caracteristicas: caracteristicasProcessed,
            destacado: Boolean(producto.destacado),
            stock: Number(producto.stock) || 0,
            
            // Frontend compatibility fields (English names for components)
            name: producto.nombre,
            brand: producto.marca,
            description: producto.descripcion,
            originalPrice: Number(producto.precio_original) || 0,
            discountPrice: Number(producto.precio_descuento) || 0,
            image: producto.imagen,
            category: producto.categoria,
            features: caracteristicasProcessed,
            inStock: Number(producto.en_stock) || 1,
            shipping: producto.envio || 'Envío estándar',
            availability: producto.disponibilidad || 'disponible'
          }
        })
        
        setProductos(productosConvertidos)
        actualizarCategorias(productosConvertidos)
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

      // ✅ Mapear campos del frontend al formato exacto que espera el backend
      const payload = {
        nombre: (nuevoProducto.nombre || '').trim(),
        marca: (nuevoProducto.marca || '').trim(),
        descripcion: nuevoProducto.descripcion || '',
        precio_normal: Number(nuevoProducto.precio_original) || 0, // ✅ Mapear correctamente
        precio_oferta: Number(nuevoProducto.precio_descuento) || 0, // ✅ Mapear correctamente
        descuento: Number(nuevoProducto.descuento) || 0,
        imagen_url: (nuevoProducto.imagen || '').trim(), // ✅ Usar imagen_url
        categoria: (nuevoProducto.categoria || '').trim(),
        subcategoria: nuevoProducto.subcategoria || '',
        stock: Number(nuevoProducto.stock) || 0,
        en_stock: Number(nuevoProducto.en_stock) || 1,
        destacado: Boolean(nuevoProducto.destacado),
        envio: nuevoProducto.envio || 'Envío estándar',
        caracteristicas: nuevoProducto.caracteristicas || null
      }

      console.log('🟢 Payload enviado al backend:', payload)

      const response = await api.post('/', payload)

      // ✅ Convertir respuesta del backend (español) con compatibilidad frontend (inglés)
      const productoCreado = {
        ...response.data,
        caracteristicas: response.data.caracteristicas || [],
        
        // Frontend compatibility fields
        name: response.data.nombre,
        brand: response.data.marca,
        description: response.data.descripcion,
        originalPrice: Number(response.data.precio_original) || 0,
        discountPrice: Number(response.data.precio_descuento) || 0,
        image: response.data.imagen,
        category: response.data.categoria,
        features: response.data.caracteristicas || [],
        inStock: Number(response.data.en_stock) || 1,
        shipping: response.data.envio || 'Envío estándar',
        availability: response.data.disponibilidad || 'disponible'
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

      // ✅ Mapear campos del frontend al formato exacto que espera el backend
      const payload = {
        nombre: (productoActualizado.nombre || '').trim(),
        marca: (productoActualizado.marca || '').trim(),
        descripcion: (productoActualizado.descripcion || '').trim(),
        precio_normal: Number(productoActualizado.precio_original) || 0, // ✅ Mapear correctamente
        precio_oferta: Number(productoActualizado.precio_descuento) || 0, // ✅ Mapear correctamente
        descuento: Number(productoActualizado.descuento) || 0,
        imagen_url: (productoActualizado.imagen || '').trim(), // ✅ Usar imagen_url
        categoria: (productoActualizado.categoria || '').trim(),
        subcategoria: (productoActualizado.subcategoria || '').trim(),
        stock: Number(productoActualizado.stock) || 0,
        en_stock: Number(productoActualizado.en_stock) || 1,
        destacado: Boolean(productoActualizado.destacado),
        envio: productoActualizado.envio || 'Envío estándar',
        caracteristicas: productoActualizado.caracteristicas || null
      }

      console.log('🟡 Payload enviado al backend:', payload)

      const response = await api.put(`/${id}`, payload)

      // ✅ Convertir respuesta del backend (español) con compatibilidad frontend (inglés)
      const productoEditado = {
        ...response.data,
        caracteristicas: response.data.caracteristicas || [],
        
        // Frontend compatibility fields
        name: response.data.nombre,
        brand: response.data.marca,
        description: response.data.descripcion,
        originalPrice: Number(response.data.precio_original) || 0,
        discountPrice: Number(response.data.precio_descuento) || 0,
        image: response.data.imagen,
        category: response.data.categoria,
        features: response.data.caracteristicas || [],
        inStock: Number(response.data.en_stock) || 1,
        shipping: response.data.envio || 'Envío estándar',
        availability: response.data.disponibilidad || 'disponible'
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

  const obtenerProductosPorCategoria = (categoria) =>
    categoria === 'todo'
      ? productos
      : productos.filter((p) => p.categoria === categoria)

  const obtenerProductosDestacados = () => productos.slice(0, 6)

  const buscarProductos = (query) => {
    if (!query.trim()) return productos
    const q = query.toLowerCase()
    return productos.filter(
      (p) =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.marca || '').toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q)
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
