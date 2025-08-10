import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { faCcPaypal, faCcApplePay } from '@fortawesome/free-brands-svg-icons'
import PaymentForm from './PaymentForm'

const PaymentMethods = ({ metodoPago, alCambiarPago, formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      {/* Credit Card Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="radio"
            id="credit-card"
            name="payment"
            value="credit-card"
            checked={metodoPago === 'credit-card'}
            onChange={(e) => alCambiarPago(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="credit-card" className="font-medium">Tarjeta de débito/crédito</label>
          <div className="ml-auto">
            <FontAwesomeIcon icon={faCreditCard} className="text-gray-500 text-3xl" />
          </div>
        </div>
        
        {metodoPago === 'credit-card' && (
          <PaymentForm formData={formData} onInputChange={onInputChange} />
        )}
      </div>

      {/* PayPal Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="paypal"
            name="payment"
            value="paypal"
            checked={metodoPago === 'paypal'}
            onChange={(e) => alCambiarPago(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="paypal" className="font-medium">PayPal</label>
          <div className="ml-auto">
            <FontAwesomeIcon icon={faCcPaypal} className="text-gray-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Apple Pay Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="apple-pay"
            name="payment"
            value="apple-pay"
            checked={metodoPago === 'apple-pay'}
            onChange={(e) => alCambiarPago(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="apple-pay" className="font-medium">ApplePay</label>
          <div className="ml-auto">
            <FontAwesomeIcon icon={faCcApplePay} className="text-gray-500 text-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
