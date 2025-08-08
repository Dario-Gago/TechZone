import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'

const ProductosDestacados = () => {
  const { obtenerProductosDestacados, formatearPrecio, cargando } = useProductos()
  const referenciaScroll = useRef(null)
  const [puedeDesplazarIzquierda, setPuedeDesplazarIzquierda] = useState(false)
  const [puedeDesplazarDerecha, setPuedeDesplazarDerecha] = useState(true)

  const productos = obtenerProductosDestacados()

  const verificarDesplazamiento = () => {
    if (referenciaScroll.current) {
      const { scrollLeft, scrollWidth, clientWidth } = referenciaScroll.current
      setPuedeDesplazarIzquierda(scrollLeft > 0)
      setPuedeDesplazarDerecha(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    verificarDesplazamiento()
    const elementoScroll = referenciaScroll.current
    if (elementoScroll) {
      elementoScroll.addEventListener('scroll', verificarDesplazamiento)
      return () => elementoScroll.removeEventListener('scroll', verificarDesplazamiento)
    }
  }, [])

  const desplazarIzquierda = () => {
    if (referenciaScroll.current) {
      referenciaScroll.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const desplazarDerecha = () => {
    if (referenciaScroll.current) {
      referenciaScroll.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Mostrar loading si los productos aún no se han cargado
  if (cargando) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Productos Destacados
        </h2>
        <p className="text-gray-600">
          Los mejores productos con ofertas especiales
        </p>
      </div>

      {/* Carrusel horizontal con navegación */}
      <div className="relative">
        {/* Botón izquierdo */}
        {puedeDesplazarIzquierda && (
          <button
            onClick={desplazarIzquierda}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Botón derecho */}
        {puedeDesplazarDerecha && (
          <button
            onClick={desplazarDerecha}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Contenedor del carrusel */}
        <div ref={referenciaScroll} className="overflow-x-auto scrollbar-hide px-12">
          <div className="flex gap-2 min-w-max">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                to={`/product/${producto.id}`}
                className="bg-white overflow-hidden flex-shrink-0 w-48 sm:w-52 md:w-56 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                {/* Imagen del producto */}
                <div className="relative bg-gray-100 h-70 flex items-center justify-center">
                  <img
                    src={producto.image}
                    alt={producto.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Badge de descuento */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    -{producto.discount}%
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-3">
                  {/* Marca */}
                  {producto.brand && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {producto.brand}
                    </p>
                  )}

                  {/* Nombre del producto - altura fija para consistencia */}
                  <div className="h-10 mb-2">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                      {producto.name}
                    </h3>
                  </div>

                  {/* Precios */}
                  <div className="space-y-1">
                    {/* Precio original tachado */}
                    <p className="text-sm text-gray-500 line-through">
                      {formatearPrecio(producto.originalPrice)}
                    </p>
                    
                    {/* Precio con descuento */}
                    <p className="text-xl font-bold text-gray-900">
                      {formatearPrecio(producto.discountPrice)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Exportación con compatibilidad
export default ProductosDestacados
export const FeaturedProducts = ProductosDestacados
