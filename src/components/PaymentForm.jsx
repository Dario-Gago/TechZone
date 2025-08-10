import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons'

const PaymentForm = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 mt-4">
      <input
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={onInputChange}
        placeholder="1234 5678 9012 3456"
        className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={onInputChange}
          placeholder="MM/AA"
          className="px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
        />
        <div className="relative">
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={onInputChange}
            placeholder="CVV o Código"
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
          />
          <span className="absolute right-3 top-3 text-gray-400">?</span>
        </div>
      </div>
      <input
        type="text"
        name="cardName"
        value={formData.cardName}
        onChange={onInputChange}
        placeholder="Nombre de la titular de la tarjeta"
        className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
      />
      
      {/* Card Icons */}
      <div className="flex space-x-2">
        <FontAwesomeIcon icon={faCcVisa} className="text-gray-500 text-2xl" />
        <FontAwesomeIcon icon={faCcMastercard} className="text-gray-500 text-2xl" />
        <FontAwesomeIcon icon={faCcAmex} className="text-gray-500 text-2xl" />
      </div>
      
      <p className="text-xs text-gray-500 flex items-center">
        🔒 Todas las transacciones son seguras y encriptadas con <span className="underline ml-1">SecuritySystem</span>
      </p>
    </div>
  )
}

export default PaymentForm
