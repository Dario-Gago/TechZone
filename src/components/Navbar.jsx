import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  UserPlus,
  LogOut
} from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import { useProductos } from '../hooks/useProducts'
import { useCarrito } from '../hooks/useCart'
import BarraDeBusqueda from './SearchBar'
import Logo from '../assets/Logo.png'

const BarraNavegacion = () => {
  const [estaMenuAbierto, setEstaMenuAbierto] = useState(false)
  const [estaBusquedaAbierta, setEstaBusquedaAbierta] = useState(false)
  const { estaAutenticado, cerrarSesion } = useAutenticacion()
  const { categorias } = useProductos()
  const { obtenerTotalItems } = useCarrito()
  const location = useLocation()

  const totalArticulos = obtenerTotalItems()

  // Función para determinar si una categoría está activa
  const esCategoriaActiva = (categorySlug) => {
    return location.pathname === `/category/${categorySlug}`
  }

  // Función para manejar el click en categoría
  const manejarClicCategoria = () => {
    setEstaMenuAbierto(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Barra Superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={Logo} 
                  alt="TechZone" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Barra de Búsqueda - Escritorio */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <BarraDeBusqueda />
          </div>

          {/* Iconos del Lado Derecho */}
          <div className="flex items-center space-x-4">
            {/* Icono de Búsqueda - Móvil */}
            <button
              onClick={() => setEstaBusquedaAbierta(!estaBusquedaAbierta)}
              className="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Enlaces de Autenticación */}
            {!estaAutenticado && (
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
            {estaAutenticado && (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <User className="h-4 w-4" />
                  <span>Mi cuenta</span>
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}

            {/* Carrito con contador */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 relative transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalArticulos > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px]">
                  {totalArticulos > 99 ? '99+' : totalArticulos}
                </span>
              )}
            </Link>

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setEstaMenuAbierto(!estaMenuAbierto)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {estaMenuAbierto ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Móvil */}
        {estaBusquedaAbierta && (
          <div className="md:hidden pb-4">
            <BarraDeBusqueda />
          </div>
        )}
      </div>

      {/* Menú de Categorías - Escritorio */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
            {categorias.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 hover:text-gray-900 ${
                  esCategoriaActiva(category.slug)
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                    : 'text-gray-600'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {estaMenuAbierto && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Enlaces de Autenticación Móvil */}
            {!estaAutenticado && (
              <div className="sm:hidden space-y-2 py-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setEstaMenuAbierto(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setEstaMenuAbierto(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Registrarse</span>
                </Link>
              </div>
            )}

            {/* Enlaces cuando está autenticado - Móvil */}
            {estaAutenticado && (
              <div className="py-2 border-b border-gray-200 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setEstaMenuAbierto(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Mi cuenta</span>
                </Link>
                <button
                  onClick={() => {
                    cerrarSesion()
                    setEstaMenuAbierto(false)
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
                {categorias.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    onClick={manejarClicCategoria}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      esCategoriaActiva(category.slug)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
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

// Exportación con compatibilidad
export default BarraNavegacion
export const Navbar = BarraNavegacion
