import React from 'react'

const ShippingOptions = ({ shippingMethod, onShippingChange, formatPrice, envioRetiro, envioEntrega }) => {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-4">
          <input
            type="radio"
            id="retiro"
            name="shipping"
            value="retiro"
            checked={shippingMethod === 'retiro'}
            onChange={(e) => onShippingChange(e.target.value)}
            className="text-blue-600 mt-1"
          />
          <label htmlFor="retiro" className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">Retiro</p>
                <p className="text-sm text-gray-500">Disponibilidad: 2 - 4 días</p>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Retira en:</p>
                  <p className="text-sm text-gray-900">Groceries Kiosk, 35 Illinois St, Toronto</p>
                  <button className="text-sm text-gray-600 underline hover:text-gray-800 mt-1">Cambiar</button>
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(envioRetiro)}</span>
            </div>
          </label>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-4">
          <input
            type="radio"
            id="entrega"
            name="shipping"
            value="entrega"
            checked={shippingMethod === 'entrega'}
            onChange={(e) => onShippingChange(e.target.value)}
            className="text-blue-600 mt-1"
          />
          <label htmlFor="entrega" className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">Entrega a domicilio</p>
                <p className="text-sm text-gray-500">Disponibilidad: 3 - 5 días</p>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(envioEntrega)}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default ShippingOptions
