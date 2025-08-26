import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useSales } from '../hooks/useSales'

const UserPurchases = () => {
  const { sales: comprasUsuario, loading, error } = useSales()

  // 🔍 Debug logs para diagnosticar el problema
  console.log('🔍 UserPurchases Debug:', {
    comprasUsuario,
    loading,
    error,
    length: comprasUsuario?.length
  })
  
  if (comprasUsuario && comprasUsuario.length > 0) {
    console.log('🔍 Primera compra completa:', comprasUsuario[0])
    console.log('🔍 Campo envio de primera compra:', comprasUsuario[0].envio)
    console.log('🔍 Tipo de envio:', typeof comprasUsuario[0].envio)
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
      day: 'numeric'
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

  const formatearEstado = (estado) => {
    const estados = {
      entregado: 'Entregado',
      en_proceso: 'En Proceso',
      confirmado: 'Confirmado',
      cancelado: 'Cancelado',
      pendiente: 'Pendiente'
    }
    return estados[estado] || estado
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Cargando tus compras...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!comprasUsuario || comprasUsuario.length === 0) {
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
          key={compra.venta_id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900">
                  {compra.user_name || compra.nombreUsuario}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerEstadoColor(
                    compra.estado
                  )}`}
                >
                  {formatearEstado(compra.estado)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Pedido #{compra.venta_id} • {formatearFecha(compra.created_at)}
              </p>
            </div>

            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <p className="font-bold text-gray-900 text-lg">
                {formatearMoneda(compra.total)}
              </p>
              
              {/* Información de envío */}
              <div className="text-xs text-gray-500 mt-1">
                {(() => {
                  // 🔍 Debug específico para el envío
                  console.log(`🔍 Evaluando envío para venta ${compra.venta_id}:`, {
                    envio: compra.envio,
                    tipoEntrega: compra.envio?.tipo_entrega,
                    direccion: compra.envio?.direccion,
                    existeEnvio: !!compra.envio
                  })
                  
                  if (compra.envio) {
                    if (compra.envio.tipo_entrega === 'domicilio') {
                      return (
                        <div>
                          <p>🚚 Envío a domicilio</p>
                          {compra.envio.direccion && (
                            <p className="mt-1 max-w-32 break-words">{compra.envio.direccion}</p>
                          )}
                        </div>
                      )
                    } else {
                      return <p>🏪 Retiro en tienda</p>
                    }
                  } else {
                    return <p>🏪 Retiro en tienda</p>
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Detalle de productos comprados */}
          {compra.items && compra.items.length > 0 && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Productos comprados ({compra.items.length} {compra.items.length === 1 ? 'artículo' : 'artículos'})
              </h4>
              <div className="space-y-2">
                {compra.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.nombre || item.producto}
                      </p>
                      {item.marca && (
                        <p className="text-xs text-gray-500">
                          Marca: {item.marca}
                        </p>
                      )}
                      {item.descripcion && (
                        <p className="text-xs text-gray-600 mt-1">
                          {item.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.cantidad}x
                      </p>
                      {item.precio && (
                        <p className="text-xs text-gray-500">
                          {formatearMoneda(item.precio)} c/u
                        </p>
                      )}
                      {item.precio && item.cantidad && (
                        <p className="text-sm font-bold text-gray-700">
                          {formatearMoneda(item.precio * item.cantidad)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default UserPurchases
