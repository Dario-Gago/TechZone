import React from 'react'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProducts'

const PieDePagina = () => {
  const { categorias } = useProductos()

  return (
    <footer className="bg-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Ayuda Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Ayuda?</h3>
            <Link
              to="/contact"
              className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Categorías Section - Primera columna */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Categorías
            </h3>
            <ul className="space-y-3">
              {categorias.slice(0, 4).map((categoria) => (
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

          {/* Categorías Section - Segunda columna */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6 invisible">
              Categorías
            </h3>
            <ul className="space-y-3">
              {categorias.slice(4).map((categoria) => (
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

          {/* Dirección Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Dirección
            </h3>
            <div className="space-y-3">
              <div className="text-gray-600">
                <p>Address #1234 - Location - City</p>
              </div>
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
// Compatibilidad hacia atrás
export { PieDePagina as Footer }
