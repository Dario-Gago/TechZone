import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const FeaturedProducts = () => {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability)
      return () => scrollElement.removeEventListener('scroll', checkScrollability)
    }
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const products = [
    {
      id: 1,
      name: "GeForce RTX 5060 OC, 8GB 128-bit, PCI-e 5.0 x8",
      brand: "GIGABYTE",
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: "https://placehold.co/200x380"
    },
    {
      id: 2,
      name: "Monitor 27\" Full HD, 200Hz, 1ms, Rapid IPS",
      brand: "MSI",
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: "https://placehold.co/200x380"
    },
    {
      id: 3,
      name: "Prime Radeon RX 9070 XT OC, 16GB GDDR6, 256-bit",
      brand: "ASUS",
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: "https://placehold.co/200x380"
    },
    {
      id: 4,
      name: "Audífonos Gamer Wireless HyperX Cloud Stinger USB",
      brand: "HyperX",
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: "https://placehold.co/200x380"
    },
    {
      id: 5,
      name: "Gabinete Gamer XYZ AIRONE 100 Mesh Black",
      brand: "XYZ PC GEAR",
      originalPrice: 499999,
      discountPrice: 389990,
      discount: 20,
      image: "https://placehold.co/200x380"
    }
  ]

  const formatPrice = (price) => {
    return `$${price.toLocaleString('es-CL')}`
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

      {/* Carousel horizontal con navegación */}
      <div className="relative">
        {/* Botón izquierdo */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Botón derecho */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Contenedor del carousel */}
        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-12">
          <div className="flex gap-2 min-w-max">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white overflow-hidden flex-shrink-0 w-48 sm:w-52 md:w-56 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                {/* Imagen del producto */}
                <div className="relative bg-gray-100 h-70 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge de descuento */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    -{product.discount}%
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-3">
                  {/* Marca */}
                  {product.brand && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                  )}

                  {/* Nombre del producto - altura fija para consistencia */}
                  <div className="h-10 mb-2">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Precios */}
                  <div className="space-y-1">
                    {/* Precio original tachado */}
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                    
                    {/* Precio con descuento */}
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(product.discountPrice)}
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

export default FeaturedProducts
