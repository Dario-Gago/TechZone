import React, { createContext, useState, useEffect, useMemo } from 'react'
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
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    // Interceptor para agregar token automáticamente
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    return instance
  }, [API_URL])

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

    // Ordenar según el orden predefinido y crear IDs únicos
    const categoriasOrdenadas = ordenCategorias
      .filter(categoriaOrden => categoriasEncontradas.includes(categoriaOrden))
      .map((categoria, index) => ({
        id: `cat-${index}`, // ID único usando prefijo
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
        const response = await api.get('/')
        
        // ✅ Usar directamente los datos del backend sin mapeo innecesario
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
            // Usar directamente los campos del backend
            ...producto,
            caracteristicas: caracteristicasProcessed,
            destacado: Boolean(producto.destacado),
            stock: Number(producto.stock) || 0
          }
        })
        
        setProductos(productosConvertidos)
        actualizarCategorias(productosConvertidos)
        setError(null)
      } catch (err) {
        console.error('❌ Error al cargar productos:', err)
        console.error('❌ Error details:', err.response?.data)
        setError('Error al cargar los productos')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [api]) // API_URL está incluido indirectamente a través de api

  // ---------------- CRUD ----------------

  const agregarProducto = async (nuevoProducto) => {
    try {

      // ✅ Usar directamente los nombres del backend sin mapeo innecesario
      const payload = {
        nombre: (nuevoProducto.nombre || '').trim(),
        marca: (nuevoProducto.marca || '').trim(),
        descripcion: nuevoProducto.descripcion || '',
        precio_normal: Number(nuevoProducto.precio_normal) || 0,
        precio_oferta: Number(nuevoProducto.precio_oferta) || 0,
        descuento: Number(nuevoProducto.descuento) || 0,
        imagen_url: (nuevoProducto.imagen_url || '').trim(),
        categoria: (nuevoProducto.categoria || '').trim(),
        subcategoria: nuevoProducto.subcategoria || '',
        stock: Number(nuevoProducto.stock) || 0,
        en_stock: Number(nuevoProducto.en_stock) || 1,
        destacado: Boolean(nuevoProducto.destacado),
        envio: nuevoProducto.envio || 'Envío estándar',
        caracteristicas: nuevoProducto.caracteristicas || null
      }

      const response = await api.post('/', payload)

      // ✅ Usar directamente la respuesta del backend
      const productoCreado = {
        ...response.data,
        caracteristicas: response.data.caracteristicas || []
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

      // ✅ Usar directamente los nombres del backend sin mapeo innecesario
      const payload = {
        nombre: (productoActualizado.nombre || '').trim(),
        marca: (productoActualizado.marca || '').trim(),
        descripcion: (productoActualizado.descripcion || '').trim(),
        precio_normal: Number(productoActualizado.precio_normal) || 0,
        precio_oferta: Number(productoActualizado.precio_oferta) || 0,
        descuento: Number(productoActualizado.descuento) || 0,
        imagen_url: (productoActualizado.imagen_url || '').trim(),
        categoria: (productoActualizado.categoria || '').trim(),
        subcategoria: (productoActualizado.subcategoria || '').trim(),
        stock: Number(productoActualizado.stock) || 0,
        en_stock: Number(productoActualizado.en_stock) || 1,
        destacado: Boolean(productoActualizado.destacado),
        envio: productoActualizado.envio || 'Envío estándar',
        caracteristicas: productoActualizado.caracteristicas || null
      }

      const response = await api.put(`/${id}`, payload)

      // ✅ Usar directamente la respuesta del backend
      const productoEditado = {
        ...response.data,
        caracteristicas: response.data.caracteristicas || []
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
