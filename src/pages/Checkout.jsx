import React, { useState } from 'react'
import { useCarrito } from '../hooks/useCart'
import { useAutenticacion } from '../contexts/AuthContext'
import CheckoutHeader from '../components/CheckoutHeader'
import UserInfo from '../components/UserInfo'
import CartItem from '../components/CartItem'
import ShippingOptions from '../components/ShippingOptions'
import PaymentMethods from '../components/PaymentMethods'
import OrderSummary from '../components/OrderSummary'

const Checkout = () => {
  const { cartItems, getTotalPrice, updateQuantity, removeFromCart } = useCarrito()
  const { usuario } = useAutenticacion()
  
  const [shippingMethod, setShippingMethod] = useState('retiro')
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const totalCarrito = getTotalPrice()
  const envioRetiro = 0
  const envioEntrega = 3690
  const envio = shippingMethod === 'retiro' ? envioRetiro : envioEntrega
  const ahorrosAplicados = totalCarrito * 0.15 // 15% de descuento
  const promocionMODUPS = 3900
  const finalTotal = Math.max(0, totalCarrito + envio - ahorrosAplicados - promocionMODUPS)

  // Formatear precio en pesos chilenos
  const formatChileanPrice = (price) => {
    if (!price && price !== 0) return '$0'
    return `$${Math.round(price).toLocaleString('es-CL')}`
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleQuantityChange = (productId, newQuantity) => {
    // Validar que la cantidad sea válida
    const quantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1))
    
    // Actualizar la cantidad en el carrito
    updateQuantity(productId, quantity)
  }

  const handleChangeAddress = () => {
    alert('Funcionalidad de cambiar dirección')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <CheckoutHeader title="Pagar" subtitle="Los gastos de envío y códigos de descuento se aplican al finalizar la compra." />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* User Information */}
            <UserInfo user={usuario} onChangeAddress={handleChangeAddress} />

            {/* Detalles de Envío */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-700">Detalles de Envío</h3>

              {/* Products - Solo mostrar si hay productos */}
              {cartItems.length > 0 && (
                <div className="space-y-4 mb-8">
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item.id || index}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={removeFromCart}
                      formatPrice={formatChileanPrice}
                    />
                  ))}
                </div>
              )}

              {/* Shipping Options */}
              <ShippingOptions
                shippingMethod={shippingMethod}
                onShippingChange={setShippingMethod}
                formatPrice={formatChileanPrice}
                envioRetiro={envioRetiro}
                envioEntrega={envioEntrega}
              />
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Método de pago</h3>
              
              <PaymentMethods
                paymentMethod={paymentMethod}
                onPaymentChange={setPaymentMethod}
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              totalCarrito={totalCarrito}
              envio={envio}
              ahorrosAplicados={ahorrosAplicados}
              promocionMODUPS={promocionMODUPS}
              finalTotal={finalTotal}
              formatPrice={formatChileanPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
