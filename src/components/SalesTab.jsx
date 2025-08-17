import React from 'react'
import { Package, AlertCircle, Loader2 } from 'lucide-react'
import { useSales } from '../hooks/useSales'

const SalesTab = () => {
  // Agregar try-catch para manejar errores del contexto
  let sales, loading, error, fetchSales, updateSaleStatus

  try {
    const salesContext = useSales()
    sales = salesContext?.sales || []
    loading = salesContext?.loading || false
    error = salesContext?.error || null
    fetchSales = salesContext?.fetchSales
    updateSaleStatus = salesContext?.updateSaleStatus
  } catch (contextError) {
    console.error('❌ Error accediendo al contexto de ventas:', contextError)
    sales = []
    loading = false
    error = 'Error al acceder a los datos de ventas'
    fetchSales = () => {}
  }

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const obtenerEstadoColor = (estado) => {
    const colores = {
      entregado: 'bg-green-100 text-green-800',
      en_proceso: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      cancelado: 'bg-red-100 text-red-800',
      pendiente: 'bg-orange-100 text-orange-800'
    }
    return colores[estado] || 'bg-gray-100 text-gray-800'
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando ventas...</span>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar ventas
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('500') && (
                <p className="text-xs text-red-600 mt-1">
                  Error del servidor. Verifica que el backend esté funcionando
                  correctamente.
                </p>
              )}
            </div>
          </div>
          {fetchSales && (
            <button
              onClick={fetchSales}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded-md transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    )
  }

  // Sin ventas
  if (!sales || sales.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay ventas registradas
        </h3>
        <p className="text-gray-500">
          Las ventas aparecerán aquí una vez que se realicen.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Últimas Ventas</h3>
        <span className="text-sm text-gray-500">
          {sales.length} venta{sales.length !== 1 ? 's' : ''} total
          {sales.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sales.slice(0, 10).map((venta) => (
          <div
            key={venta.id || venta.venta_id || venta.pedido_id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {venta.user_name ||
                        venta.nombreUsuario ||
                        venta.cliente ||
                        venta.usuario}
                    </p>

                    <div className="text-sm text-gray-500 space-y-1">
                      {/* Información del cliente */}
                      {(venta.nombreUsuario ||
                        venta.cliente ||
                        venta.usuario) && (
                        <p>
                          {venta.nombreUsuario ||
                            venta.cliente ||
                            venta.usuario}
                        </p>
                      )}

                      {/* Fecha */}
                      <p>
                        {formatearFecha(
                          venta.fecha_pedido ||
                            venta.fecha_venta ||
                            venta.created_at ||
                            venta.fecha
                        )}
                      </p>

                      {/* Información de pago */}
                      {venta.pago && (
                        <p>
                          {venta.pago.metodo_pago
                            ?.replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                      )}

                      {/* Información de envío */}
                      {venta.envio && (
                        <p>
                          {venta.envio.tipo_entrega === 'domicilio'
                            ? venta.envio.direccion_envio
                            : venta.envio.sucursal_retiro}
                        </p>
                      )}

                      {/* Número de items */}
                      {venta.items && (
                        <p>
                          {venta.items.length} producto
                          {venta.items.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatearMoneda(venta.total)}
                </p>
                {(venta.estado_pedido || venta.estado) && (
                  <select
                    value={venta.estado_pedido || venta.estado}
                    onChange={(e) =>
                      updateSaleStatus(
                        venta.id || venta.venta_id,
                        e.target.value
                      )
                    }
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${obtenerEstadoColor(
                      venta.estado_pedido || venta.estado
                    )}`}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                )}
              </div>
            </div>

            {/* Detalles de los productos (si están disponibles) */}
            {venta.items && venta.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {venta.items.slice(0, 3).map((item, index) => (
                    <span key={index}>
                      {item.nombre || item.producto} ({item.cantidad}x)
                      {index < Math.min(venta.items.length, 3) - 1 && ', '}
                    </span>
                  ))}
                  {venta.items.length > 3 && (
                    <span> y {venta.items.length - 3} más...</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sales.length > 10 && (
        <div className="text-center mt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todas las ventas ({sales.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default SalesTab
