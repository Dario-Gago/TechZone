import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useProductos } from '../hooks/useProducts'
import { useCarrito } from '../hooks/useCart'
import FavoriteButton from '../components/FavoriteButton'

const FavoritesPage = () => {
  const { favoritos, cantidadFavoritos } = useFavorites()
  const { formatearPrecio } = useProductos()
  const { agregarAlCarrito } = useCarrito()

  const calcularDescuento = (precioOriginal, precioOferta) => {
    if (!precioOriginal || !precioOferta) return 0
    return Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
  }

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto)
  }

  if (cantidadFavoritos === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu Lista de Favoritos está vacía
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestros productos y agrega tus favoritos haciendo clic en el corazón ❤️
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-gray-600">
            {cantidadFavoritos} {cantidadFavoritos === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        {/* Grid de productos favoritos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoritos.map((producto) => {
            const descuento = producto.precio_oferta > 0 
              ? calcularDescuento(producto.precio_normal, producto.precio_oferta)
              : 0

            return (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Imagen del producto */}
                <div className="relative bg-white aspect-square flex items-center justify-center p-4">
                  <Link to={`/product/${producto.id}`}>
                    <img
                      src={producto.imagen_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                      alt={producto.nombre}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'
                      }}
                    />
                  </Link>

                  {/* Badge de descuento */}
                  {descuento > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{descuento}%
                    </div>
                  )}

                  {/* Botón de favoritos */}
                  <div className="absolute top-2 left-2">
                    <FavoriteButton producto={producto} />
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-4">
                  {/* Marca */}
                  {producto.marca && (
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {producto.marca}
                    </p>
                  )}

                  {/* Nombre del producto */}
                  <Link to={`/product/${producto.id}`}>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 hover:text-gray-600 transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>

                  {/* Categoría */}
                  {producto.categoria && (
                    <p className="text-xs text-gray-400 mb-3 capitalize">
                      {producto.categoria.replace('-', ' ')}
                    </p>
                  )}

                  {/* Precios */}
                  <div className="space-y-1 mb-4">
                    {producto.precio_oferta > 0 && producto.precio_oferta < producto.precio_normal ? (
                      <>
                        <p className="text-sm text-gray-500 line-through">
                          {formatearPrecio(producto.precio_normal)}
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {formatearPrecio(producto.precio_oferta)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-gray-900">
                        {formatearPrecio(producto.precio_normal)}
                      </p>
                    )}
                  </div>

                  {/* Botón agregar al carrito */}
                  <button
                    onClick={() => handleAgregarAlCarrito(producto)}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar al Carrito</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage
