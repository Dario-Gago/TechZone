import React from 'react'
import { Package } from 'lucide-react'

const SalesTab = ({ pedidos }) => {
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

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Ventas</h3>
      <div className="space-y-3">
        {pedidos.slice(0, 6).map((pedido) => (
          <div
            key={pedido.pedido_id}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Pedido #{pedido.pedido_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {pedido.nombreUsuario} •{' '}
                      {formatearFecha(pedido.fecha_pedido)}
                      {pedido.pago &&
                        ` • ${pedido.pago.metodo_pago
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}`}
                      {pedido.envio &&
                        ` • ${
                          pedido.envio.tipo_entrega === 'domicilio'
                            ? pedido.envio.direccion_envio
                            : pedido.envio.sucursal_retiro
                        }`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatearMoneda(pedido.total)}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${obtenerEstadoColor(
                    pedido.estado_pedido
                  )}`}
                >
                  {pedido.estado_pedido}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesTab
