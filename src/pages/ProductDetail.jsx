import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import axios from 'axios'
import { useProductos } from '../hooks/useProducts'
import ProductosDestacados from '../components/FeaturedProducts'
import { API_ENDPOINTS } from '../config/api'
const DetalleProducto = () => {
  const { id } = useParams()
  const { formatearPrecio } = useProductos()
  const [cantidad, setCantidad] = useState(1)
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

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

  const manejarAgregarCarrito = () => {
    // Aquí podrías hacer un POST al backend o al contexto del carrito
    console.log(
      `Añadiendo ${cantidad} unidades del producto ${producto.id} al carrito`
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
                  -{producto.discount}%
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
                className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>AÑADIR AL CARRITO</span>
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
