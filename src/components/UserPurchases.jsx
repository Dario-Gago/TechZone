import React from 'react'
import { ShoppingCart } from 'lucide-react'

const UserPurchases = ({ comprasUsuario }) => {
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const obtenerEstadoColor = (estado) => {
    const colores = {
      entregado: 'bg-green-100 text-green-800',
      en_proceso: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return colores[estado] || 'bg-gray-100 text-gray-800'
  }

  const formatearEstado = (estado) => {
    const estados = {
      entregado: 'Entregado',
      en_proceso: 'En Proceso',
      confirmado: 'Confirmado',
      cancelado: 'Cancelado'
    }
    return estados[estado] || estado
  }

  if (comprasUsuario.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No tienes compras aún</p>
        <p className="text-sm">
          ¡Explora nuestros productos y realiza tu primera compra!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comprasUsuario.map((compra) => (
        <div
          key={compra.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900">{compra.producto}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerEstadoColor(
                    compra.estado_pedido
                  )}`}
                >
                  {formatearEstado(compra.estado_pedido)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Pedido #{compra.pedido_id} •{' '}
                {formatearFecha(compra.fecha_pedido)}
              </p>
              {compra.descuento > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Descuento: {formatearMoneda(compra.descuento)}
                </p>
              )}
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <p className="font-bold text-gray-900 text-lg">
                {formatearMoneda(compra.precio)}
              </p>
              {compra.envio && (
                <p className="text-xs text-gray-500">
                  {compra.envio.tipo_entrega === 'domicilio'
                    ? '🏠 Domicilio'
                    : '🏪 Sucursal'}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserPurchases
