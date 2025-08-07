import React, { useState } from 'react'
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
  // Datos de ejemplo para simular productos y carrito
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'GeForce RTX 5060 OC, 8GB 128-bit, PCI-e 5.0 x8',
      brand: 'GIGABYTE',
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: 'https://placehold.co/400x400/1f2937/ffffff?text=RTX+5060',
      description:
        'Tarjeta gráfica de alto rendimiento para gaming y streaming profesional. Perfecta para juegos en 1440p con ray tracing.',
      features: [
        'Arquitectura NVIDIA Ada Lovelace',
        '8GB GDDR6X de memoria de video',
        'Ray Tracing de 3ra generación',
        'DLSS 3 con Frame Generation',
        'Diseño con triple ventilador'
      ],
      category: 'componentes',
      subcategory: 'tarjetas-graficas',
      shipping: 'Envío en 3 - 4 días',
      inStock: 1,
      stock: 15,
      quantity: 1
    },
    {
      id: 2,
      name: 'Prime Radeon RX 9070 XT OC, 16GB GDDR6',
      brand: 'ASUS',
      originalPrice: 699999,
      discountPrice: 559990,
      discount: 20,
      image: 'https://placehold.co/400x400/1f2937/ffffff?text=RX+9070+XT',
      description:
        'Potente tarjeta gráfica AMD con 16GB de memoria para gaming en 4K y creación de contenido profesional.',
      features: [
        'Arquitectura RDNA 4',
        '16GB GDDR6',
        'Ray Tracing acelerado',
        'AMD FidelityFX Super Resolution',
        'Cold triple-fan cooling'
      ],
      category: 'componentes',
      subcategory: 'tarjetas-graficas',
      shipping: 'Envío en 3 - 4 días',
      inStock: 1,
      stock: 5,
      quantity: 1
    },
    {
      id: 3,
      name: 'Intel Arc B580, 12GB GDDR6',
      brand: 'Intel',
      originalPrice: 249990,
      discountPrice: 229990,
      discount: 8,
      image: 'https://placehold.co/400x400/1f2937/ffffff?text=Intel+Arc+B580',
      description:
        'Opción económica para gaming 1440p con buena estabilidad de drivers.',
      features: [
        '12GB GDDR6',
        '≈92 FPS promedio en 1440p',
        'Soporte básico para Ray Tracing'
      ],
      category: 'componentes',
      subcategory: 'tarjetas-graficas',
      shipping: 'Envío en 2 - 3 días',
      inStock: 1,
      stock: 20,
      quantity: 1
    }
  ])

  const isAuthenticated = true // Simulamos que el usuario está autenticado

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  // Función para obtener los detalles completos de los productos en el carrito
  const getCartItemsWithDetails = () => {
    return cartItems.map((item) => ({
      ...item,
      // Convertir precios de centavos a pesos
      price: item.originalPrice / 1000,
      discountedPrice: item.discountPrice / 1000
    }))
  }

  const cartItemsWithDetails = getCartItemsWithDetails()

  const subtotal = cartItemsWithDetails.reduce(
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
            Inicia sesión para continuar
          </h2>
          <p className="text-gray-600 mb-6">
            Accede a tu cuenta para ver los productos que agregaste a tu
            carrito.
          </p>

          <div className="space-y-3">
            <button className="w-full bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition duration-200 font-medium block text-center">
              Iniciar Sesión
            </button>

            <p className="text-gray-500 text-sm">¿No tienes cuenta?</p>

            <button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-200 font-medium block text-center">
              Crear Cuenta
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si el carrito está vacío
  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Explora nuestros productos y agrega algunos a tu carrito.
          </p>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition duration-200 font-medium">
            Continuar Comprando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a la Tienda
          </button>
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
              {cartItemsWithDetails.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

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
                          onClick={() => removeFromCart(item.id)}
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
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 transition-colors"
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
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.price.toLocaleString('es-CL')}
                              </span>
                              <span className="text-lg font-semibold text-gray-900 ml-2">
                                ${item.discountedPrice.toLocaleString('es-CL')}
                              </span>
                              <div className="text-sm text-green-600">
                                Ahorras un {item.discount}%
                              </div>
                            </>
                          )}
                          {item.discount === 0 && (
                            <span className="text-lg font-semibold text-gray-900">
                              ${item.discountedPrice.toLocaleString('es-CL')}
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
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Devoluciones gratuitas durante 30 días (*)
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">
                      Métodos de pago convenientes
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
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
                  <span className="text-gray-900">
                    ${subtotal.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento aplicado</span>
                  <span className="text-green-600">
                    -${discount.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <hr className="mb-4" />

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>

              <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-900 transition duration-200 font-medium">
                PAGAR
              </button>

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

export default Cart
