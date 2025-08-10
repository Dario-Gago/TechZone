import React from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../hooks/useCart'
import { useAutenticacion } from '../contexts/AuthContext'

const PagoExitoso = () => {
  const { vaciarCarrito } = useCarrito()
  const { usuario } = useAutenticacion()

  // Generar número de orden una sola vez
  const [numeroPedido] = React.useState(() => `TZ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  
  // Obtener fecha actual una sola vez
  const [fechaActual] = React.useState(() => new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))

  const nombreUsuario = usuario?.nombre || usuario?.name || 'Cliente'
  const emailUsuario = usuario?.email || 'cliente@example.com'

  React.useEffect(() => {
    // Limpiar carrito al llegar a esta página
    vaciarCarrito()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo queremos ejecutar esto una vez al montar el componente

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Icon and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Compra realizada con éxito!
          </h1>
          
          <p className="text-lg text-gray-600">
            Gracias por tu compra, {nombreUsuario}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles de tu pedido
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Número de orden</p>
                <p className="text-lg font-semibold text-gray-900">{numeroPedido}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de compra</p>
                <p className="text-lg font-semibold text-gray-900">{fechaActual}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Email de confirmación</p>
                <p className="text-lg font-semibold text-gray-900">{emailUsuario}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado del pedido</p>
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Confirmado
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Qué sigue ahora?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmación por email</p>
                  <p className="text-gray-600 text-sm">
                    Te enviaremos un email de confirmación con todos los detalles de tu compra.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Preparación del pedido</p>
                  <p className="text-gray-600 text-sm">
                    Nuestro equipo comenzará a preparar tu pedido para el envío.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Seguimiento del envío</p>
                  <p className="text-gray-600 text-sm">
                    Recibirás un código de seguimiento una vez que tu pedido sea enviado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium text-center"
          >
            Continuar comprando
          </Link>
          
          <Link
            to="/dashboard"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Ver mis pedidos
          </Link>
        </div>

        {/* Support Section */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            ¿Tienes alguna pregunta sobre tu pedido?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:soporte@techzone.com" className="text-blue-600 hover:text-blue-800">
              📧 soporte@techzone.com
            </a>
            <a href="tel:+56912345678" className="text-blue-600 hover:text-blue-800">
              📞 +56 9 1234 5678
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoExitoso
