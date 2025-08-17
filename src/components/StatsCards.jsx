import React from 'react'
import { ShoppingCart, Package, TrendingUp, Calendar, User } from 'lucide-react'
import { useSales } from '../hooks/useSales'

const StatsCards = ({ esAdmin, usuarios, productos }) => {
  const { adminStats, userStats } = useSales()

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${esAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-8`}>
      {esAdmin ? (
        <>
          {/* Total de Ventas - calculado desde el contexto */}
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
                  {formatearMoneda(adminStats.totalVentas)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {adminStats.cantidadVentas} venta
                  {adminStats.cantidadVentas !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Total Usuarios */}
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
                  {usuarios?.filter((u) => !u.admin).length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Usuarios registrados
                </p>
              </div>
            </div>
          </div>

          {/* Total Productos */}
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
                  {productos?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">En catálogo</p>
              </div>
            </div>
          </div>

          {/* Ventas de Hoy - calculado desde el contexto */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatearMoneda(adminStats.ventasHoy)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {adminStats.ventasHoyCount} venta
                  {adminStats.ventasHoyCount !== 1 ? 's' : ''} hoy
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Total Gastado - calculado desde el contexto */}
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
                  {formatearMoneda(userStats.totalGastado)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  En todas tus compras
                </p>
              </div>
            </div>
          </div>

          {/* Compras Realizadas - calculado desde el contexto */}
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
                  {userStats.comprasRealizadas}
                </p>
                <p className="text-xs text-gray-500 mt-1">Órdenes totales</p>
              </div>
            </div>
          </div>

          {/* Pedidos Entregados - calculado desde el contexto */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pedidos Entregados
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.comprasEntregadas}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  De {userStats.comprasRealizadas} compras realizadas
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
