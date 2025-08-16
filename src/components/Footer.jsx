import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'

const PieDePagina = () => {
  const { productos, cargando } = useProductos()

  // Función para capitalizar
  const capitalizar = (texto) =>
    texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : ''

  // Categorías extraídas de productos
  const categoriasValidas = useMemo(() => {
    if (cargando || !Array.isArray(productos) || productos.length === 0) {
      return []
    }

    const categoriasUnicas = [...new Set(productos.map((p) => p.category))]
      .filter((c) => c && c.trim() !== '')
      .map((c, index) => ({
        id: index + 1,
        slug: c
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        name: capitalizar(c.trim())
      }))

    return categoriasUnicas
  }, [productos, cargando])

  return (
    <footer className="bg-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Ayuda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Ayuda?</h3>
            <Link
              to="/contact"
              className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Categorías
            </h3>
            <ul className="space-y-3">
              {cargando ? (
                [...Array(4)].map((_, i) => (
                  <li key={i}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </li>
                ))
              ) : categoriasValidas.length > 0 ? (
                categoriasValidas.slice(0, 4).map((categoria) => (
                  <li key={categoria.id}>
                    <Link
                      to={`/category/${categoria.slug}`}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {categoria.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  No hay categorías disponibles
                </li>
              )}
            </ul>
          </div>

          {/* Categorías segunda columna */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6 invisible">
              Categorías
            </h3>
            <ul className="space-y-3">
              {!cargando &&
                categoriasValidas.length > 4 &&
                categoriasValidas.slice(4).map((categoria) => (
                  <li key={categoria.id}>
                    <Link
                      to={`/category/${categoria.slug}`}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {categoria.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Dirección
            </h3>
            <div className="space-y-3">
              <p className="text-gray-600">Address #1234 - Location - City</p>
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cuenta
                </Link>
                <Link
                  to="/cart"
                  className="block text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PieDePagina
