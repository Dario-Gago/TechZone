import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  UserPlus,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const categories = [
    'Todo',
    'Gaming y Streaming',
    'Computación',
    'Componentes',
    'Conectividad y Redes',
    'Hogar y Oficina',
    'Audio y Video',
    'Otras Categorías'
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Barra Superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-sm font-bold">@</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  TechZone
                </span>
              </Link>
            </div>
          </div>

          {/* Barra de Búsqueda - Escritorio */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm"
                placeholder="Buscador..."
              />
            </div>
          </div>

          {/* Iconos del Lado Derecho */}
          <div className="flex items-center space-x-4">
            {/* Icono de Búsqueda - Móvil */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Enlaces de Autenticación */}
            {!isAuthenticated && (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Iniciar sesión</span>
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Registrarse</span>
                </Link>
              </div>
            )}

            {/* Enlaces cuando está autenticado - Escritorio */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <User className="h-4 w-4" />
                  <span>Mi cuenta</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}

            {/* Carrito */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 relative transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Móvil */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm"
                placeholder="Buscador..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Menú de Categorías - Escritorio */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 hover:text-gray-900 ${
                  index === 0
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                    : 'text-gray-600'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Enlaces de Autenticación Móvil */}
            {!isAuthenticated && (
              <div className="sm:hidden space-y-2 py-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Registrarse</span>
                </Link>
              </div>
            )}

            {/* Enlaces cuando está autenticado - Móvil */}
            {isAuthenticated && (
              <div className="py-2 border-b border-gray-200 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Mi cuenta</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}

            {/* Categorías Móvil */}
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      index === 0
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
