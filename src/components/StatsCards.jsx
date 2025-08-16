import React, { useMemo } from 'react'
import { ShoppingCart, Package, TrendingUp, Calendar, User } from 'lucide-react'
import { useSales } from '../contexts/SalesContext' // Importar el contexto de ventas

const StatsCards = ({
  esAdmin,
  estadisticas,
  usuarios,
  productos,
  totalGastado,
  comprasUsuario,
  comprasEntregadas
}) => {
  const { sales } = useSales() // Obtener ventas del contexto

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  // Calcular estadísticas de ventas usando useMemo para optimizar
  const ventasStats = useMemo(() => {
    console.log('📊 Calculando estadísticas de ventas')
    console.log('📊 Sales data:', sales)

    if (!sales || sales.length === 0) {
      console.log('📊 No hay ventas disponibles')
      return {
        totalVentas: 0,
        ventasHoy: 0,
        cantidadVentas: 0
      }
    }

    const ahora = new Date()
    const hoyInicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate()
    )

    let totalVentas = 0
    let ventasHoy = 0
    let cantidadVentas = sales.length

    sales.forEach((venta, index) => {
      console.log(`📊 Procesando venta ${index + 1}:`, venta)

      // Convertir el total a número, manejando diferentes formatos
      let montoVenta = 0
      if (venta.total !== undefined && venta.total !== null) {
        montoVenta = parseFloat(venta.total)
        if (isNaN(montoVenta)) {
          console.warn(
            `⚠️ Venta ${index + 1}: total no es un número válido:`,
            venta.total
          )
          montoVenta = 0
        }
      }

      console.log(`📊 Venta ${index + 1} - Monto procesado:`, montoVenta)
      totalVentas += montoVenta

      // Verificar si la venta es de hoy
      const fechaVenta = new Date(
        venta.fecha_venta ||
          venta.created_at ||
          venta.fecha_pedido ||
          venta.fecha
      )

      if (fechaVenta >= hoyInicio) {
        ventasHoy += montoVenta
      }
    })

    console.log('📊 Resultado final:', {
      totalVentas,
      ventasHoy,
      cantidadVentas
    })

    return {
      totalVentas,
      ventasHoy,
      cantidadVentas
    }
  }, [sales])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  {formatearMoneda(ventasStats.totalVentas)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ventasStats.cantidadVentas} venta
                  {ventasStats.cantidadVentas !== 1 ? 's' : ''}
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
                  {formatearMoneda(ventasStats.ventasHoy)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {sales?.filter((venta) => {
                    const ahora = new Date()
                    const hoyInicio = new Date(
                      ahora.getFullYear(),
                      ahora.getMonth(),
                      ahora.getDate()
                    )
                    const fechaVenta = new Date(
                      venta.fecha_venta ||
                        venta.created_at ||
                        venta.fecha_pedido ||
                        venta.fecha
                    )
                    return fechaVenta >= hoyInicio
                  }).length || 0}{' '}
                  venta
                  {sales?.filter((venta) => {
                    const ahora = new Date()
                    const hoyInicio = new Date(
                      ahora.getFullYear(),
                      ahora.getMonth(),
                      ahora.getDate()
                    )
                    const fechaVenta = new Date(
                      venta.fecha_venta ||
                        venta.created_at ||
                        venta.fecha_pedido ||
                        venta.fecha
                    )
                    return fechaVenta >= hoyInicio
                  }).length !== 1
                    ? 's'
                    : ''}{' '}
                  hoy
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Vista para usuarios normales - sin cambios */}
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
                  {formatearMoneda(totalGastado || 0)}
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
                  {comprasUsuario?.length || 0}
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
                  {comprasEntregadas?.length || 0}
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
