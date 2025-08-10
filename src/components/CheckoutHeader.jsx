import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CheckoutHeader = ({ title = "Pagar", subtitle = "Los gastos de envío y códigos de descuento se aplican al finalizar la compra." }) => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Navigation */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-900 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a la Tienda
          </Link>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutHeader
