import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'
import { useAutenticacion } from '../contexts/AuthContext'
import { ShoppingCart, Package, AlertTriangle } from 'lucide-react'

const PaginaCategoria = () => {
  const { categorySlug } = useParams()
  const { productos, todosLosProductos, formatearPrecio, cargando } =
    useProductos()
  const { esAdmin } = useAutenticacion()

  // ✅ Usar productos apropiados según el tipo de usuario
  const productosDisponibles = esAdmin ? todosLosProductos : productos

  // ✅ Extraer categorías únicas de los productos con orden específico
  const categorias = useMemo(() => {
    if (
      !Array.isArray(productosDisponibles) ||
      productosDisponibles.length === 0
    ) {
      return []
    }

    // Orden correcto según la base de datos
    const ordenCategorias = [
      'gaming-streaming',
      'computacion', 
      'componentes',
      'conectividad-redes',
      'hogar-oficina',
      'audio-video',
      'otras-categorias'
    ]

    const categoriasEncontradas = [
      ...new Set(productosDisponibles.map((producto) => producto.categoria))
    ].filter((categoria) => categoria && categoria.trim() !== '')

    // Ordenar según el orden predefinido
    const categoriasOrdenadas = ordenCategorias
      .filter(categoriaOrden => categoriasEncontradas.includes(categoriaOrden))
      .map((categoria, index) => ({
        id: index + 1,
        slug: categoria,
        name: categoria
          .split('-')
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(' ')
      }))

    return [{ id: 'todo', slug: 'todo', name: 'Todo' }, ...categoriasOrdenadas]
  }, [productosDisponibles])

  // ✅ Filtrar productos por categoría
  const productosFiltrados = useMemo(() => {
    if (!Array.isArray(productosDisponibles)) return []

    if (categorySlug === 'todo') {
      return productosDisponibles
    }

    return productosDisponibles.filter((producto) => {
      const slugProducto = producto.categoria
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      return slugProducto === categorySlug
    })
  }, [productosDisponibles, categorySlug])

  // ✅ Encontrar el nombre de la categoría
  const categoriaActual = categorias.find((cat) => cat.slug === categorySlug)
  const nombreCategoria = categoriaActual ? categoriaActual.name : 'Categoría'

  const calcularDescuento = (precioOriginal, precioOferta) => {
    if (!precioOriginal || !precioOferta) return 0
    return Math.round(((precioOriginal - precioOferta) / precioOriginal) * 100)
  }

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
        {/* Encabezado de la categoría */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {nombreCategoria}
          </h1>
          <p className="text-gray-600">
            {productosFiltrados.length} producto
            {productosFiltrados.length !== 1 ? 's' : ''} encontrado
            {productosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((product) => {
              const descuento =
                product.precio_oferta > 0
                  ? calcularDescuento(
                      product.precio_normal,
                      product.precio_oferta
                    )
                  : 0

              const sinStock = product.stock <= 0

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-200 ${
                    sinStock ? 'opacity-60' : 'hover:shadow-lg'
                  }`}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className={
                      sinStock && !esAdmin ? 'pointer-events-none' : ''
                    }
                  >
                    {/* Imagen del producto */}
                    <div className="relative bg-white aspect-square flex items-center justify-center p-4 border border-gray-100">
                      <img
                        src={product.imagen_url || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}
                        alt={product.nombre}
                        className={`w-full h-full object-contain ${
                          sinStock ? 'grayscale' : ''
                        }`}
                        onError={(e) => {
                          e.target.src =
                            'https://via.placeholder.com/200x200?text=Sin+Imagen'
                        }}
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.destacado && (
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                            ⭐ Destacado
                          </div>
                        )}

                        {descuento > 0 && !sinStock && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{descuento}%
                          </div>
                        )}
                      </div>

                      {/* Overlay para productos sin stock (solo para admin) */}
                      {sinStock && esAdmin && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">
                            AGOTADO
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="p-4">
                      {/* Marca */}
                      {product.marca && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {product.marca}
                        </p>
                      )}

                      {/* Nombre del producto */}
                      <div className="h-12 mb-3">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                          {product.nombre}
                        </h3>
                      </div>

                      {/* Stock info para admin */}
                      {esAdmin && (
                        <div className="mb-2">
                          <p
                            className={`text-xs font-medium ${
                              sinStock ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            Stock: {product.stock} unidades
                          </p>
                        </div>
                      )}

                      {/* Precios */}
                      <div className="space-y-1">
                        {product.precio_oferta > 0 &&
                        product.precio_oferta < product.precio_normal ? (
                          <>
                            <p className="text-sm text-gray-500 line-through">
                              {formatearPrecio(product.precio_normal)}
                            </p>
                            <p
                              className={`text-lg font-bold ${
                                sinStock ? 'text-gray-500' : 'text-green-600'
                              }`}
                            >
                              {formatearPrecio(product.precio_oferta)}
                            </p>
                          </>
                        ) : (
                          <p
                            className={`text-lg font-bold ${
                              sinStock ? 'text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {formatearPrecio(product.precio_normal)}
                          </p>
                        )}
                      </div>

                      {/* Características destacadas */}
                      {product.caracteristicas && product.caracteristicas.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {product.caracteristicas[0]}
                          </p>
                        </div>
                      )}

                      {/* Botón de acción (solo si hay stock o es admin) */}
                      {(!sinStock || esAdmin) && (
                        <div className="mt-4">
                          {sinStock ? (
                            esAdmin && (
                              <button className="w-full py-2 px-4 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed">
                                Producto Agotado
                              </button>
                            )
                          ) : (
                            <button className="w-full bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Ver Producto
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                No hay productos disponibles en esta categoría en este momento.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition-colors duration-200"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginaCategoria
