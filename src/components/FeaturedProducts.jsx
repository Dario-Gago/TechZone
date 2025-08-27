import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'
import LikeButton from './LikeButton'

const ProductosDestacados = () => {
  const { productos, formatearPrecio, cargando } = useProductos()
  const referenciaScroll = useRef(null)
  const [puedeDesplazarIzquierda, setPuedeDesplazarIzquierda] = useState(false)
  const [puedeDesplazarDerecha, setPuedeDesplazarDerecha] = useState(true)

  //Filtrar productos destacados con stock > 0
  const productosDestacados = productos.filter(
    (producto) => producto.destacado === true && producto.stock > 0
  )

  const calcularDescuento = (precioOriginal, precioOferta) => {
    if (!precioOriginal || !precioOferta) return 0
    return Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
  }

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
      return () =>
        elementoScroll.removeEventListener('scroll', verificarDesplazamiento)
    }
  }, [productosDestacados])

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

  //Si no hay productos destacados, no mostrar la sección
  if (productosDestacados.length === 0) {
    return null
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Productos Destacados
        </h2>
      </div>

      {/* Slider horizontal con navegación */}
      <div className="relative">
        {/* Botón izquierdo */}
        {puedeDesplazarIzquierda && (
          <button
            onClick={desplazarIzquierda}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Anterior"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
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
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Contenedor del Slider */}
        <div
          ref={referenciaScroll}
          className="overflow-x-auto scrollbar-hide px-12"
        >
          <div className="flex gap-4 min-w-max">
            {productosDestacados.map((producto) => {
              //Calcular descuento usando los campos correctos
              const descuento =
                producto.precio_oferta > 0
                  ? calcularDescuento(
                      producto.precio_normal,
                      producto.precio_oferta
                    )
                  : 0

              return (
                <Link
                  key={producto.id}
                  to={`/product/${producto.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 w-48 sm:w-52 md:w-56 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                >
                  {/* Imagen del producto */}
                  <div className="relative bg-white aspect-square flex items-center justify-center p-4 border border-gray-100">
                    <img
                      src={producto.imagen_url || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}
                      alt={producto.nombre}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/200x200?text=Sin+Imagen'
                      }}
                    />

                    {/* Badge de descuento */}
                    {descuento > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{descuento}%
                      </div>
                    )}

                    {/* Botón de like */}
                    <div className="absolute top-2 left-2">
                      <LikeButton 
                        productoId={producto.id} 
                        size="sm" 
                        variant="floating" 
                      />
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="p-4">
                    {/* Marca */}
                    {producto.marca && (
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {producto.marca}
                      </p>
                    )}

                    {/* Nombre del producto */}
                    <div className="h-12 mb-3">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                        {producto.nombre}
                      </h3>
                    </div>

                    {/* Precios */}
                    <div className="space-y-1">
                      {producto.precio_oferta > 0 &&
                      producto.precio_oferta < producto.precio_normal ? (
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

                    {/*Características destacadas */}
                    {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {producto.caracteristicas[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductosDestacados
