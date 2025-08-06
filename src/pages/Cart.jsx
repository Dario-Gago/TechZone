import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  CreditCard,
  Truck,
  ChevronRight
} from 'lucide-react'

const Cart = () => {
  // Simular estado de autenticación - cambia esto según tu lógica de auth
  const { isAuthenticated } = useAuth()

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Nombre Producto',
      brand: 'Marca',
      price: 95,
      discountedPrice: 70,
      discount: 25,
      quantity: 1,
      shipping: '2 - 4 días',
      image: '/placeholder-product.jpg'
    },
    {
      id: 2,
      name: 'Nombre Producto',
      brand: 'Marca',
      price: 54,
      discountedPrice: 54,
      discount: 0,
      quantity: 2,
      shipping: '6 días',
      image: '/placeholder-product.jpg'
    }
  ])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  )
  const discount = 25.0
  const total = subtotal - discount

  // Si no hay sesión iniciada, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-600 mb-6">
            Para ver tu carrito de compras necesitas estar autenticado
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition duration-200 font-medium block text-center"
            >
              Iniciar Sesión
            </Link>

            <p className="text-gray-500 text-sm">¿No tienes cuenta?</p>

            <Link
              to="/register"
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-200 font-medium block text-center"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-800"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedido</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Despacho: {item.shipping}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.price}
                              </span>
                              <span className="text-lg font-semibold text-gray-900 ml-2">
                                ${item.discountedPrice}
                              </span>
                              <div className="text-sm text-green-600">
                                Ahorras un {item.discount}%
                              </div>
                            </>
                          )}
                          {item.discount === 0 && (
                            <span className="text-lg font-semibold text-gray-900">
                              ${item.discountedPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Compra segura y fácil
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Devoluciones gratuitas durante 30 días (*)
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Métodos de pago convenientes
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Entregar a domicilio o retiro
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
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
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento aplicado</span>
                  <span className="text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              </div>

              <hr className="mb-4" />

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-900 transition duration-200 font-medium">
                PAGAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
