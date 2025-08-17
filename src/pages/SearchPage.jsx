import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'

const PaginaBusqueda = () => {
  const [parametrosBusqueda] = useSearchParams()
  const { buscarProductos, formatearPrecio, cargando } = useProductos()
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])

  const consulta = parametrosBusqueda.get('q') || ''

  // ✅ Memoizar la función de búsqueda para evitar dependencias que cambien
  const realizarBusqueda = useCallback(() => {
    if (consulta && !cargando && buscarProductos) {
      const resultados = buscarProductos(consulta)
      setResultadosBusqueda(resultados)
    } else if (!consulta) {
      setResultadosBusqueda([])
    }
  }, [consulta, cargando, buscarProductos])

  useEffect(() => {
    realizarBusqueda()
  }, [realizarBusqueda]) // Solo depende de la función memoizada

  if (cargando) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado de búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resultados de búsqueda
          </h1>
          <p className="text-gray-600">
            {consulta && (
              <>
                Buscando por: <strong>"{consulta}"</strong> -
              </>
            )}{' '}
            {resultadosBusqueda.length} resultado
            {resultadosBusqueda.length !== 1 ? 's' : ''} encontrado
            {resultadosBusqueda.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Resultados de búsqueda */}
        {resultadosBusqueda.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {resultadosBusqueda.map((product) => {
              // ✅ Calcular precio con descuento en tiempo real
              const precioConDescuento =
                product.discount > 0
                  ? product.originalPrice -
                    (product.originalPrice * product.discount) / 100
                  : product.originalPrice

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Imagen del producto */}
                  <div className="relative bg-white aspect-square flex items-center justify-center p-4 border border-gray-100">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />

                    {/* Badge de descuento */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-4">
                    {/* Marca */}
                    {product.brand && (
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                        {product.brand}
                      </p>
                    )}

                    {/* Nombre del producto */}
                    <h3 className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    {/* Precios */}
                    <div className="space-y-1">
                      {/* Precio original tachado - Solo mostrar si es mayor a 0 y hay descuento */}
                      {product.discount > 0 && product.originalPrice > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatearPrecio(product.originalPrice)}
                        </p>
                      )}

                      {/* Precio con descuento calculado */}
                      <p className="text-xl font-bold text-gray-900">
                        {formatearPrecio(precioConDescuento)}
                      </p>
                    </div>

                    {/* Estado del stock */}
                    <div className="mt-3">
                      {product.inStock ? (
                        <span className="text-sm text-green-600 font-medium">
                          En stock
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 font-medium">
                          Agotado
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : consulta ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                No hay productos que coincidan con tu búsqueda "{consulta}".
                Intenta con otras palabras clave.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition-colors duration-200"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ingresa un término de búsqueda
              </h3>
              <p className="text-gray-600 mb-6">
                Usa la barra de búsqueda para encontrar productos específicos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginaBusqueda
