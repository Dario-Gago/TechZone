import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSales } from '../hooks/useSales'
import { useAuth } from '../contexts/AuthContext'
import ContextoCarrito from '../contexts/CartContext'

const OrderSummary = ({
  totalCarrito,
  envio,
  ahorrosAplicados,
  promocionMODUPS,
  finalTotal,
  formatearPrecio
}) => {
  const navigate = useNavigate()
  const { createSale } = useSales()
  const { usuario } = useAuth()
  const { articulosCarrito } = useContext(ContextoCarrito)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {

    // Validaciones iniciales
    if (!usuario) {
      setError('Debes iniciar sesión para completar la compra.')
      return
    }

    if (!finalTotal || finalTotal <= 0) {
      setError('El total debe ser mayor a 0.')
      return
    }

    if (!articulosCarrito || articulosCarrito.length === 0) {
      setError('El carrito está vacío.')
      return
    }

    setLoading(true)
    setError(null)

    try {

      // Mapear los items del carrito al formato esperado por el backend
      const itemsParaVenta = articulosCarrito.map((item, index) => {
        const producto_id = item.id || item.productId || item.producto_id
        const cantidad =
          item.cantidadCarrito || item.quantity || item.cantidad || 1
        const precio_unitario =
          item.precioFinal ||
          item.precio_oferta ||
          item.precio_normal ||
          item.precio ||
          item.price

        return {
          producto_id,
          cantidad,
          precio_unitario
        }
      })

      // Validar que todos los items tengan los campos requeridos
      const itemsInvalidos = itemsParaVenta.filter((item, index) => {
        const isInvalid =
          !item.producto_id ||
          !item.cantidad ||
          item.cantidad <= 0 ||
          !item.precio_unitario ||
          item.precio_unitario <= 0

        if (isInvalid) {
          console.error(`❌ Item ${index + 1} inválido:`, item)
        }
        return isInvalid
      })

      if (itemsInvalidos.length > 0) {
        console.error('❌ Items con datos inválidos:', itemsInvalidos)
        throw new Error(
          `${itemsInvalidos.length} productos tienen datos inválidos (ID, cantidad o precio)`
        )
      }

      // Crear la venta usando los items mapeados
      const nuevaVenta = await createSale(itemsParaVenta, finalTotal)

      // Redirigir a la página de éxito
      navigate('/payment-success', {
        state: {
          ventaId: nuevaVenta?.id || nuevaVenta?.venta_id,
          total: finalTotal
        }
      })
    } catch (error) {
      console.error('❌ Error al crear la venta:', error)

      // Manejo específico de errores
      let errorMessage = 'Ocurrió un error al procesar la compra.'

      if (
        error.message.includes('No autorizado') ||
        error.message.includes('401')
      ) {
        errorMessage =
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      } else if (
        error.message.includes('No tienes permisos') ||
        error.message.includes('403')
      ) {
        errorMessage = 'No tienes permisos para realizar esta compra.'
      } else if (error.message.includes('No hay token')) {
        errorMessage =
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      } else if (error.message.includes('not-null constraint')) {
        errorMessage =
          'Error en los datos del producto. Por favor, recarga la página e intenta nuevamente.'
      } else if (error.message.includes('datos inválidos')) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Resumen</h3>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Artículos en el carrito</span>
          <span className="text-gray-900 font-medium">
            {formatearPrecio(totalCarrito)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-gray-900 font-medium">
            {formatearPrecio(envio)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ahorros aplicados</span>
          <span className="text-gray-400">
            -{formatearPrecio(ahorrosAplicados)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Promoción MODUPS</span>
          <span className="text-gray-400">
            -{formatearPrecio(promocionMODUPS)}
          </span>
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
        disabled={loading || !usuario || !articulosCarrito?.length}
        className={`w-full mt-6 py-4 rounded-md font-medium transition-colors ${
          loading || !usuario || !articulosCarrito?.length
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-gray-800 text-white hover:bg-gray-900'
        }`}
      >
        {loading ? 'Procesando...' : 'COMPLETAR COMPRA'}
      </button>

      {/* Información adicional */}
      {!usuario && (
        <p className="text-sm text-red-600 text-center mt-2">
          Debes iniciar sesión para completar la compra
        </p>
      )}

      {!articulosCarrito?.length && usuario && (
        <p className="text-sm text-red-600 text-center mt-2">
          Tu carrito está vacío
        </p>
      )}

      <p className="text-xs text-gray-500 text-center mt-4">
        Al hacer clic en "Finalizar compra" confirmas que aceptas los términos y
        condiciones de uso y confirmas que has leído la Política de Privacidad.
      </p>
    </div>
  )
}

export default OrderSummary
