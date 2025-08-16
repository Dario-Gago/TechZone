import React from 'react'
import { ShoppingCart, Package, TrendingUp, Calendar, User } from 'lucide-react'

const StatsCards = ({
  esAdmin,
  estadisticas,
  usuarios,
  productos, // ← Agregar productos como prop
  totalGastado,
  comprasUsuario,
  comprasEntregadas
}) => {
  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {esAdmin ? (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ventas Totales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatearMoneda(estadisticas.totalVentas || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Usuarios
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {usuarios.filter((u) => !u.admin).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Productos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {productos?.length || 0} {/* ← Modificar esta línea */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatearMoneda(estadisticas.ventasHoy || 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatearMoneda(totalGastado)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Compras Realizadas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {comprasUsuario.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pedidos Entregados
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {comprasEntregadas.length}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StatsCards
