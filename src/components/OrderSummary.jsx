import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSummary = ({ 
  totalCarrito, 
  envio, 
  ahorrosAplicados, 
  promocionMODUPS, 
  finalTotal, 
  formatearPrecio
}) => {
  const navigate = useNavigate()

  const handleSubmit = () => {
    // Redirigir a la página de éxito del pago
    navigate('/payment-success')
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Resumen</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Artículos en el carrito</span>
          <span className="text-gray-900 font-medium">{formatearPrecio(totalCarrito)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-gray-900 font-medium">{formatearPrecio(envio)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ahorros aplicados</span>
          <span className="text-gray-400">-{formatearPrecio(ahorrosAplicados)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Promoción MODUPS</span>
          <span className="text-gray-400">-{formatearPrecio(promocionMODUPS)}</span>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>{formatearPrecio(finalTotal)}</span>
        </div>
      </div>

      {/* Complete Purchase Button */}
      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-gray-800 text-white py-4 rounded-md hover:bg-gray-900 transition-colors font-medium"
      >
        COMPLETAR COMPRA
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Al hacer clic en "Finalizar compra" confirmas que aceptas los términos y condiciones de uso y confirmas que has leído la Política de Privacidad.
      </p>
    </div>
  )
}

export default OrderSummary
