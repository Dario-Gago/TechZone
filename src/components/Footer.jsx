import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Ayuda Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Ayuda?</h3>
            <button className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
              Contacto
            </button>
          </div>

          {/* Categorías Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Categorías
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Gaming y Streaming
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Computación
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Componentes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Conectividad y Redes
                </a>
              </li>
            </ul>
          </div>

          {/* Segunda columna de categorías */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6 invisible">
              Categorías
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hogar y Oficina
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Audio y Video
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Otras Categorías
                </a>
              </li>
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
                <a
                  href="#"
                  className="block text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cuenta
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Carrito
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
