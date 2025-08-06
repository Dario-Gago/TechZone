import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import FeaturedProducts from '../components/FeaturedProducts'

const ProductDetail = () => {
  const { id } = useParams()
  const { getProductById, formatPrice, loading } = useProducts()
  const [quantity, setQuantity] = useState(1)

  const product = getProductById(id)
  // Manejar estados de carga y producto no encontrado
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <p className="text-gray-600">El producto que buscas no existe o ha sido removido.</p>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // Lógica para añadir al carrito
    console.log(`Añadiendo ${quantity} unidades del producto ${product.id} al carrito`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sección de detalle del producto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen del producto */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-8 w-full max-w-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título y marca */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              )}
            </div>

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -{product.discount}%
                </span>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {formatPrice(product.discountPrice)}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Características */}
            <div>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selector de cantidad y botón de compra */}
            <div className="space-y-4">
              {/* Selector de cantidad */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón añadir al carrito */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>AÑADIR AL CARRITO</span>
              </button>

              {/* Información de envío */}
              <div className="text-center">
                <p className="text-sm text-gray-600">{product.shipping}</p>
              </div>
            </div>

            {/* Estado del stock */}
            {product.inStock && (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">En stock</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de productos destacados */}
      <div className="bg-gray-50">
        <FeaturedProducts />
      </div>
    </div>
  )
}

export default ProductDetail
