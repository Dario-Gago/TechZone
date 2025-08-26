import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import Swal from 'sweetalert2'
import { useLikes } from '../hooks/useLikes'
import { useProductos } from '../hooks/useProducts'
import { useCarrito } from '../hooks/useCart'
import LikeButton from '../components/LikeButton'

const FavoritesPage = () => {
  const { likes, totalLikes, limpiarLikes } = useLikes()
  const { todosLosProductos, formatearPrecio, cargando } = useProductos()
  const { agregarAlCarrito } = useCarrito()

  // Filtrar productos que están en la lista de favoritos
  const productosFavoritos = todosLosProductos.filter(producto => {
    const productoIdString = String(producto.id)
    return likes.includes(productoIdString)
  })

  const calcularDescuento = (precioOriginal, precioOferta) => {
    if (!precioOriginal || !precioOferta) return 0
    return Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
  }

  const handleAddToCart = (producto) => {
    agregarAlCarrito(producto.id, 1)
  }

  const handleLimpiarLikes = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres quitar todos los productos de tu lista de favoritos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, limpiar lista',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      limpiarLikes()
      
      Swal.fire({
        title: '¡Lista limpia!',
        text: 'Todos los productos han sido removidos de tu lista de favoritos.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Favoritos
              </h1>
              <p className="text-gray-600">
                {totalLikes} {totalLikes === 1 ? 'producto' : 'productos'} en tu lista de favoritos
              </p>
            </div>
          </div>

          {/* Botón para limpiar todos los favoritos */}
          {totalLikes > 0 && (
            <button
              onClick={handleLimpiarLikes}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-colors duration-200"
            >
              Limpiar lista
            </button>
          )}
        </div>

        {/* Contenido */}
        {totalLikes === 0 ? (
          /* Estado vacío */
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Tu lista de favoritos está vacía
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explora nuestros productos y agrega los que más te gusten a tu lista de favoritos
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <span>Explorar productos</span>
            </Link>
          </div>
        ) : (
          /* Grid de productos favoritos */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {productosFavoritos.map((producto) => {
              const descuento = producto.precio_oferta > 0
                ? calcularDescuento(producto.precio_normal, producto.precio_oferta)
                : 0

              return (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Imagen del producto */}
                  <Link to={`/product/${producto.id}`} className="block relative">
                    <div className="aspect-square bg-white flex items-center justify-center p-4">
                      <img
                        src={producto.imagen_url || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}
                        alt={producto.nombre}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen'
                        }}
                      />
                    </div>

                    {/* Badge de descuento */}
                    {descuento > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{descuento}%
                      </div>
                    )}

                    {/* Botón de like */}
                    <div className="absolute top-2 right-2">
                      <LikeButton 
                        productoId={producto.id} 
                        size="sm" 
                        variant="floating" 
                      />
                    </div>
                  </Link>

                  {/* Información del producto */}
                  <div className="p-4">
                    {/* Marca */}
                    {producto.marca && (
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {producto.marca}
                      </p>
                    )}

                    {/* Nombre del producto */}
                    <Link to={`/product/${producto.id}`}>
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-3 hover:text-gray-600">
                        {producto.nombre}
                      </h3>
                    </Link>

                    {/* Precios */}
                    <div className="space-y-1 mb-4">
                      {producto.precio_oferta > 0 && producto.precio_oferta < producto.precio_normal ? (
                        <>
                          <p className="text-sm text-gray-500 line-through">
                            {formatearPrecio(producto.precio_normal)}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatearPrecio(producto.precio_oferta)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          {formatearPrecio(producto.precio_normal)}
                        </p>
                      )}
                    </div>

                    {/* Botón agregar al carrito */}
                    {producto.stock > 0 ? (
                      <button
                        onClick={() => handleAddToCart(producto)}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Agregar al carrito</span>
                      </button>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-center text-sm font-medium">
                        Sin stock
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
