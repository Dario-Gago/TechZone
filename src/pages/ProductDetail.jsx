import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Check, AlertTriangle, Package } from 'lucide-react'
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

  // ✅ Calcular stock disponible
  const cantidadEnCarrito = obtenerCantidadItem(producto.id)
  const stockDisponible = producto.stock - cantidadEnCarrito
  const sinStock = producto.stock <= 0
  const stockInsuficiente = stockDisponible <= 0

  const manejarCambioCantidad = (nuevaCantidad) => {
    if (nuevaCantidad >= 1) {
      // ✅ No permitir más del stock disponible
      const cantidadMaxima = Math.min(nuevaCantidad, stockDisponible)
      setCantidad(cantidadMaxima)
    }
  }

  const manejarAgregarCarrito = async () => {
    // ✅ Verificar stock antes de agregar
    if (stockInsuficiente) {
      setMensajeExito('No hay stock suficiente disponible')
      setTimeout(() => setMensajeExito(''), 3000)
      return
    }

    setAgregandoCarrito(true)
    try {
      const exito = agregarAlCarrito(producto.id, cantidad)
      if (exito) {
        setMensajeExito(
          `¡${cantidad} ${
            cantidad === 1 ? 'producto agregado' : 'productos agregados'
          } al carrito!`
        )
        // Resetear cantidad a 1 después de agregar
        setCantidad(1)
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

  return (
    <div className="min-h-screen bg-white">
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div
          className={`fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
            mensajeExito.includes('stock')
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
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
              <div className="relative aspect-square w-full">
                <img
                  src={producto.imagen_url || 'https://via.placeholder.com/400x400?text=Sin+Imagen'}
                  alt={producto.nombre}
                  className={`w-full h-full object-contain ${
                    sinStock ? 'grayscale opacity-60' : ''
                  }`}
                />

                {/* Overlay de sin stock */}
                {sinStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
                      AGOTADO
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {producto.nombre}
              </h1>
              {producto.marca && (
                <p className="text-lg text-gray-600 mb-4">{producto.marca}</p>
              )}
            </div>

            {/* Precios */}
            <div className="space-y-2">
              {/* Solo mostrar precio original tachado si hay descuento real */}
              {producto.precio_oferta > 0 &&
                producto.precio_oferta < producto.precio_normal && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl text-gray-500 line-through">
                      {formatearPrecio(producto.precio_normal)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -
                      {calcularDescuento(
                        producto.precio_normal,
                        producto.precio_oferta
                      )}
                      %
                    </span>
                  </div>
                )}

              <div className="text-4xl font-bold text-gray-900">
                {formatearPrecio(
                  producto.precio_oferta > 0 &&
                    producto.precio_oferta < producto.precio_normal
                    ? producto.precio_oferta
                    : producto.precio_normal
                )}
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Características */}
            {producto.caracteristicas && producto.caracteristicas.length > 0 && (
              <ul className="space-y-3">
                {producto.caracteristicas.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

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

            {/* ✅ Selector cantidad y botón de compra */}
            {!sinStock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Cantidad:
                  </span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => manejarCambioCantidad(cantidad - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cantidad <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                      {cantidad}
                    </span>
                    <button
                      onClick={() => manejarCambioCantidad(cantidad + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cantidad >= stockDisponible}
                    >
                      +
                    </button>
                  </div>

                  {stockDisponible > 0 && (
                    <span className="text-sm text-gray-500">
                      Máx. {stockDisponible}
                    </span>
                  )}
                </div>

                <button
                  onClick={manejarAgregarCarrito}
                  disabled={agregandoCarrito || stockInsuficiente}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    agregandoCarrito || stockInsuficiente
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-800'
                  } text-white`}
                >
                  {agregandoCarrito ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>AGREGANDO...</span>
                    </>
                  ) : stockInsuficiente ? (
                    <>
                      <AlertTriangle className="h-5 w-5" />
                      <span>SIN STOCK DISPONIBLE</span>
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
            )}

                        {/* ✅ Información de stock */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Disponibilidad
                </span>
              </div>

              {sinStock ? (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Producto agotado</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {producto.stock} unidades en stock
                    </span>
                  </div>

                  {stockDisponible <= 5 && stockDisponible > 0 && (
                    <p className="text-sm text-red-600 font-medium">
                      ¡Últimas {stockDisponible} unidades disponibles!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Mensaje para productos sin stock */}
            {sinStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-700 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Producto no disponible</span>
                </div>
                <p className="text-sm text-red-600">
                  Este producto está temporalmente agotado. Te notificaremos
                  cuando vuelva a estar disponible.
                </p>
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
