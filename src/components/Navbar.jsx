import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, Menu, X, UserPlus } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
      {/* Top Bar */}
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

          {/* Search Bar - Desktop */}
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

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Auth Links */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span className="text-sm">Iniciar sesión</span>
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

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 relative transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Button */}
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

        {/* Mobile Search Bar */}
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

      {/* Categories Menu - Desktop */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3 overflow-x-auto">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Auth Links */}
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

            {/* Mobile Categories */}
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
