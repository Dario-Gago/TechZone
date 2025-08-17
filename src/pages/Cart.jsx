import React from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../hooks/useCart'
import { useAutenticacion } from '../contexts/AuthContext'

import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  CreditCard,
  Truck,
  ChevronRight,
  AlertTriangle,
  Package
} from 'lucide-react'

const Carrito = () => {
  const {
    articulosCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    obtenerPrecioTotal
  } = useCarrito()

  const { estaAutenticado } = useAutenticacion()

  // Usar el total calculado del contexto que ya tiene los precios actuales
  const total = obtenerPrecioTotal()
  const descuento = 25000 // Descuento fijo por simplicidad
  const subtotal = total + descuento

  // ✅ Función para manejar cambio de cantidad con validación de stock
  const manejarCambioCantidad = (item, nuevaCantidad) => {
    // No permitir cantidad menor a 1
    if (nuevaCantidad < 1) return

    // ✅ Verificar si hay stock suficiente
    if (nuevaCantidad > item.stock) {
      // Opcionalmente mostrar una alerta
      alert(`Solo hay ${item.stock} unidades disponibles de ${item.name}`)
      return
    }

    actualizarCantidad(item.id, nuevaCantidad)
  }

  // ✅ Verificar si un item tiene problemas de stock
  const tieneProblemasStock = (item) => {
    return item.cantidadCarrito > item.stock
  }

  // ✅ Verificar si el carrito tiene productos con problemas de stock
  const carritoTieneProblemasStock = articulosCarrito.some(tieneProblemasStock)

  // Si el carrito está vacío
  if (articulosCarrito.length === 0) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Explora nuestros productos y agrega algunos a tu carrito.
          </p>
          <Link
            to="/category/todo"
            className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition duration-200 font-medium"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-900 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a la Tienda
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carrito de Compra
          </h1>
          <p className="text-gray-600">
            El precio final se actualizará una vez definas retiro o despacho.
          </p>
        </div>

        {/* ✅ Alerta de problemas de stock */}
        {carritoTieneProblemasStock && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-700 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Atención: Problema de stock</span>
            </div>
            <p className="text-sm text-red-600">
              Algunos productos en tu carrito superan el stock disponible. Por
              favor, ajusta las cantidades antes de proceder al pago.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedido</h2>

            <div className="space-y-4">
              {articulosCarrito.map((item) => {
                const sinStock = item.stock <= 0
                const excedeCantidad = item.cantidadCarrito > item.stock
                const tieneProblemas = sinStock || excedeCantidad

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg p-6 shadow-sm ${
                      tieneProblemas ? 'border-l-4 border-red-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 aspect-square bg-white rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                        <img
                          src={item.imagen || 'https://via.placeholder.com/80x80?text=Sin+Imagen'}
                          alt={item.nombre}
                          className={`w-full h-full object-contain ${
                            tieneProblemas ? 'opacity-60 grayscale' : ''
                          }`}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.nombre}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.marca}
                            </p>

                            {/* ✅ Información de stock */}
                            <div className="mt-1 flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span
                                className={`text-xs ${
                                  sinStock
                                    ? 'text-red-600 font-medium'
                                    : excedeCantidad
                                    ? 'text-orange-600 font-medium'
                                    : 'text-gray-500'
                                }`}
                              >
                                {sinStock
                                  ? 'Sin stock'
                                  : `${item.stock} disponibles`}
                              </span>
                            </div>

                            {/* ✅ Alertas específicas */}
                            {excedeCantidad && !sinStock && (
                              <div className="mt-2 flex items-center space-x-1 text-orange-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  Cantidad excede stock disponible
                                </span>
                              </div>
                            )}

                            {sinStock && (
                              <div className="mt-2 flex items-center space-x-1 text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  Producto no disponible
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                manejarCambioCantidad(
                                  item,
                                  item.cantidadCarrito - 1
                                )
                              }
                              disabled={item.cantidadCarrito <= 1}
                              className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span
                              className={`px-3 py-1 text-sm min-w-[3rem] text-center ${
                                excedeCantidad ? 'text-red-600 font-medium' : ''
                              }`}
                            >
                              {item.cantidadCarrito}
                            </span>
                            <button
                              onClick={() =>
                                manejarCambioCantidad(
                                  item,
                                  item.cantidadCarrito + 1
                                )
                              }
                              disabled={
                                item.cantidadCarrito >= item.stock || sinStock
                              }
                              className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* ✅ Indicador de máximo disponible */}
                          {item.stock > 0 && (
                            <span className="text-xs text-gray-500">
                              Máx. {item.stock}
                            </span>
                          )}

                          <div className="text-right">
                            {item.precio_descuento &&
                            item.precio_descuento < item.precio_original ? (
                              <div>
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.precio_original.toLocaleString('es-CL')}
                                </span>
                                <span
                                  className={`text-lg font-semibold ml-2 ${
                                    tieneProblemas
                                      ? 'text-gray-500'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  ${item.precio_descuento.toLocaleString('es-CL')}
                                </span>
                              </div>
                            ) : (
                              <span
                                className={`text-lg font-semibold ${
                                  tieneProblemas
                                    ? 'text-gray-500'
                                    : 'text-gray-900'
                                }`}
                              >
                                ${(item.precio_descuento || item.precio_original || item.precioFinal || 0).toLocaleString('es-CL')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ✅ Botón de ajuste rápido para exceso de cantidad */}
                        {excedeCantidad && !sinStock && (
                          <div className="mt-3">
                            <button
                              onClick={() =>
                                manejarCambioCantidad(item, item.stock)
                              }
                              className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-md hover:bg-orange-200 transition-colors"
                            >
                              Ajustar a máximo disponible ({item.stock})
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Security Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compra segura y fácil
              </h3>

              <div className="space-y-3">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Devoluciones gratuitas durante 30 días (*)
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Métodos de pago convenientes
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Entregar a domicilio o retiro
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sub-Total
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Artículos en el carrito</span>
                  <span className="text-gray-900">
                    ${subtotal.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento aplicado</span>
                  <span className="text-green-600">
                    -${descuento.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <hr className="mb-4" />

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>

              {/* ✅ Validación antes del checkout */}
              {carritoTieneProblemasStock ? (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Ajusta las cantidades antes de continuar
                      </span>
                    </div>
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-4 rounded-md cursor-not-allowed font-medium"
                  >
                    RESOLVER PROBLEMAS DE STOCK
                  </button>
                </div>
              ) : estaAutenticado ? (
                <Link
                  to="/checkout"
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-900 transition duration-200 font-medium block text-center"
                >
                  PAGAR
                </Link>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Inicia sesión para completar tu compra
                  </p>
                  <Link
                    to="/login"
                    state={{ from: '/checkout' }}
                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-900 transition duration-200 font-medium block text-center"
                  >
                    INICIAR SESIÓN
                  </Link>
                  <Link
                    to="/register"
                    state={{ from: '/checkout' }}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition duration-200 font-medium block text-center"
                  >
                    CREAR CUENTA
                  </Link>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 text-center">
                (*) Aplican términos y condiciones
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito
