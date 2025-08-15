import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import axios from 'axios'
import { useProductos } from '../hooks/useProducts'
import { useCarrito } from '../hooks/useCart'
import ProductosDestacados from '../components/FeaturedProducts'
import { API_ENDPOINTS } from '../config/api'

const DetalleProducto = () => {
  const { id } = useParams()
  const { formatearPrecio } = useProductos()
  const { agregarAlCarrito, estaEnCarrito, obtenerCantidadItem } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [agregandoCarrito, setAgregandoCarrito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')

  const calcularDescuento = (precioOriginal, precioOferta) => {
    if (!precioOriginal || !precioOferta) return 0
    return Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
  }

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setCargando(true)
        const { data } = await axios.get(`${API_ENDPOINTS.PRODUCTO_BY_ID(id)}`)
        setProducto(data)
      } catch (err) {
        console.error(err)
        setError('No se pudo obtener el producto.')
      } finally {
        setCargando(false)
      }
    }
    fetchProducto()
  }, [id])

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600">
            {error || 'Este producto no existe o ha sido removido.'}
          </p>
        </div>
      </div>
    )
  }

  const manejarCambioCantidad = (nuevaCantidad) => {
    if (nuevaCantidad >= 1) {
      setCantidad(nuevaCantidad)
    }
  }

  const manejarAgregarCarrito = async () => {
    setAgregandoCarrito(true)
    try {
      const exito = agregarAlCarrito(producto.id, cantidad)
      if (exito) {
        setMensajeExito(
          `¡${cantidad} ${
            cantidad === 1 ? 'producto agregado' : 'productos agregados'
          } al carrito!`
        )
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMensajeExito('')
        }, 3000)
      } else {
        console.error('No se pudo agregar el producto al carrito')
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
    } finally {
      setAgregandoCarrito(false)
    }
  }

  const yaEstaEnCarrito = estaEnCarrito(producto.id)
  const cantidadEnCarrito = obtenerCantidadItem(producto.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Check className="h-5 w-5" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Sección de detalle del producto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen del producto */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <img
                src={producto.image}
                alt={producto.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {producto.name}
              </h1>
              {producto.brand && (
                <p className="text-lg text-gray-600 mb-4">{producto.brand}</p>
              )}
            </div>

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-gray-500 line-through">
                  {formatearPrecio(producto.originalPrice)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -
                  {calcularDescuento(
                    producto.originalPrice,
                    producto.discountPrice
                  )}
                  %
                </span>
              </div>

              <div className="text-4xl font-bold text-gray-900">
                {formatearPrecio(producto.discountPrice)}
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 leading-relaxed">
              {producto.description}
            </p>

            {/* Características */}
            <ul className="space-y-3">
              {producto.features?.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Estado del carrito */}
            {yaEstaEnCarrito && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-700">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Ya tienes {cantidadEnCarrito}{' '}
                    {cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} en tu
                    carrito
                  </span>
                </div>
              </div>
            )}

            {/* Selector cantidad */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Cantidad:
                </span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => manejarCambioCantidad(cantidad - 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => manejarCambioCantidad(cantidad + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={manejarAgregarCarrito}
                disabled={agregandoCarrito}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  agregandoCarrito
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-800'
                } text-white`}
              >
                {agregandoCarrito ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AGREGANDO...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>AÑADIR AL CARRITO</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">{producto.shipping}</p>
              </div>
            </div>

            {/* Estado del stock */}
            {producto.inStock && (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">En stock</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productos destacados */}
      <div className="bg-gray-50">
        <ProductosDestacados />
      </div>
    </div>
  )
}

export default DetalleProducto
