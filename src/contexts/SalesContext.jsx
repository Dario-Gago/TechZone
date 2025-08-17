// src/contexts/SalesContext.jsx
import { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from './AuthContext'

const SalesContext = createContext()

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { usuario, estaAutenticado, token } = useAuth()

  // Función segura para obtener datos de autenticación
  const getAuthData = useCallback(() => {
    try {
      const tokenFromContext = token || localStorage.getItem('token')
      const userFromContext = usuario || (() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            return JSON.parse(userStr)
          } catch (parseError) {
            console.warn('⚠️ Error parsing user from localStorage:', parseError)
            return null
          }
        }
        return null
      })()

      // Solo logear si hay datos de auth disponibles
      if (tokenFromContext && userFromContext) {
        console.log('🔑 Auth data disponible:', {
          token: 'Disponible',
          usuario: userFromContext
        })
      }

      return { token: tokenFromContext, usuario: userFromContext }
    } catch (error) {
      console.error('❌ Error obteniendo datos de auth:', error)
      return { token: null, usuario: null }
    }
  }, [token, usuario])

  // ✅ Get sales from backend
  const fetchSales = useCallback(async () => {
    console.log('🔍 fetchSales llamado')

    const { token, usuario } = getAuthData()

    if (!token) {
      console.warn('⚠️ No hay token disponible')
      setError('No hay sesión activa')
      setSales([])
      return
    }

    if (!API_ENDPOINTS?.VENTAS) {
      console.error('❌ API_ENDPOINTS.VENTAS no está definido')
      setError('Configuración de API no disponible')
      setSales([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Usamos el endpoint /me para traer solo las ventas del usuario actual
      const url = usuario?.admin
        ? API_ENDPOINTS.VENTAS
        : `${API_ENDPOINTS.VENTAS}/me`

      console.log('🌐 Haciendo petición GET a:', url)

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data && Array.isArray(res.data)) {
        setSales(res.data)
      } else if (res.data && typeof res.data === 'object' && res.data.ventas) {
        setSales(res.data.ventas)
      } else if (res.data && typeof res.data === 'object' && res.data.data) {
        setSales(res.data.data)
      } else {
        setSales([])
      }
    } catch (err) {
      console.error('❌ Error en fetchSales:', err)
      setError(
        err.response?.data?.error || err.message || 'Error cargando ventas'
      )
      setSales([])
    } finally {
      setLoading(false)
    }
  }, [getAuthData])

  // ✅ Create new sale
  const createSale = async (items, total) => {
    console.log('💾 createSale llamado con:', { items, total })

    const { token } = getAuthData()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    if (!API_ENDPOINTS?.VENTAS) {
      throw new Error('Configuración de API no disponible')
    }

    try {
      setError(null)

      const res = await axios.post(
        `${API_ENDPOINTS.VENTAS}`,
        { items, total },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log('✅ Venta creada exitosamente:', res.data)

      // Recargar todas las ventas
      await fetchSales()
      return res.data
    } catch (err) {
      console.error('❌ Error creando venta:', err)

      let errorMessage = 'Error creating sale'

      if (err.response?.status === 401) {
        errorMessage = 'No autorizado para crear ventas'
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para crear ventas'
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // ✅ Update sale status
  const updateSaleStatus = async (ventaId, nuevoEstado) => {
    const { token } = getAuthData()

    if (!token) throw new Error('No hay token disponible')

    try {
      await axios.patch(
        `${API_ENDPOINTS.VENTAS}/${ventaId}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchSales() // refrescar ventas después del cambio
    } catch (err) {
      console.error('Error actualizando estado de venta:', err)
      throw err
    }
  }

  // 🆕 Estadísticas calculadas con useMemo para optimizar rendimiento - SOLO SI HAY SESIÓN
  const userStats = useMemo(() => {
    // No calcular estadísticas si no hay usuario autenticado
    if (!usuario || !estaAutenticado) {
      return {
        totalGastado: 0,
        comprasRealizadas: 0,
        comprasEntregadas: 0,
        comprasEntregadasData: []
      }
    }

    console.log('📊 Calculando estadísticas del usuario')

    if (!sales || sales.length === 0) {
      return {
        totalGastado: 0,
        comprasRealizadas: 0,
        comprasEntregadas: 0,
        comprasEntregadasData: []
      }
    }

    const { usuario: currentUser } = getAuthData()

    // Para usuarios normales, filtrar solo sus compras
    // Para admins, mostrar todas las ventas
    const ventasUsuario = currentUser?.admin
      ? sales
      : sales.filter(
          (venta) =>
            venta.usuario_id === currentUser?.id ||
            venta.user_id === currentUser?.id
        )

    let totalGastado = 0
    const comprasEntregadas = []

    ventasUsuario.forEach((venta, index) => {
      // Calcular total gastado
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
      totalGastado += montoVenta

      // Filtrar compras entregadas
      if (
        venta.estado === 'entregado' ||
        venta.estado === 'entregada' ||
        venta.estado === 'delivered'
      ) {
        comprasEntregadas.push(venta)
      }
    })

    const stats = {
      totalGastado,
      comprasRealizadas: ventasUsuario.length,
      comprasEntregadas: comprasEntregadas.length,
      comprasEntregadasData: comprasEntregadas
    }

    console.log('📊 Estadísticas del usuario calculadas:', stats)
    return stats
  }, [sales, usuario, estaAutenticado, getAuthData])

  // 🆕 Estadísticas de administrador calculadas con useMemo - SOLO SI HAY SESIÓN
  const adminStats = useMemo(() => {
    // No calcular estadísticas si no hay usuario autenticado
    if (!usuario || !estaAutenticado) {
      return {
        totalVentas: 0,
        ventasHoy: 0,
        cantidadVentas: 0,
        ventasHoyCount: 0
      }
    }

    console.log('📊 Calculando estadísticas de administrador')

    if (!sales || sales.length === 0) {
      return {
        totalVentas: 0,
        ventasHoy: 0,
        cantidadVentas: 0,
        ventasHoyCount: 0
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
    let ventasHoyCount = 0

    sales.forEach((venta, index) => {
      console.log(`📊 Procesando venta ${index + 1}:`, venta)

      // Convertir el total a número
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
        ventasHoyCount++
      }
    })

    const stats = {
      totalVentas,
      ventasHoy,
      cantidadVentas,
      ventasHoyCount
    }

    console.log('📊 Estadísticas de admin calculadas:', stats)
    return stats
  }, [sales, usuario, estaAutenticado])

  // Cargar ventas cuando el componente se monte - SOLO SI HAY SESIÓN
  useEffect(() => {
    console.log('🔄 SalesProvider montado, verificando autenticación...')

    // Solo proceder si hay usuario autenticado
    if (!usuario || !estaAutenticado) {
      console.log('🚫 No hay sesión activa, no se cargarán ventas')
      setSales([])
      setError(null)
      return
    }

    const { token, usuario: userData } = getAuthData()

    if (token && userData) {
      console.log('🔄 Datos de auth disponibles, cargando ventas...')
      fetchSales()
    } else {
      console.log('🚫 No hay datos de auth válidos, esperando...')
      setSales([])
      setError(null)
    }
  }, [usuario, estaAutenticado, getAuthData, fetchSales]) // Dependencias específicas

  // Escuchar cambios en localStorage - SOLO SI HAY SESIÓN
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('📱 Cambio detectado en localStorage')
      
      // Solo proceder si hay usuario autenticado en el contexto
      if (!usuario || !estaAutenticado) {
        console.log('🚫 No hay sesión activa después del cambio en storage')
        setSales([])
        setError(null)
        return
      }

      const { token, usuario: userData } = getAuthData()

      if (token && userData) {
        console.log('🔄 Nueva sesión detectada, cargando ventas...')
        fetchSales()
      } else {
        console.log('🚫 Sesión cerrada, limpiando datos...')
        setSales([])
        setError(null)
      }
    }

    // Solo añadir el listener si hay sesión activa
    if (usuario && estaAutenticado) {
      window.addEventListener('storage', handleStorageChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [usuario, estaAutenticado, getAuthData, fetchSales])

  // Recargar ventas cuando cambie el usuario - SOLO SI HAY SESIÓN
  useEffect(() => {
    if (usuario && estaAutenticado) {
      console.log('🔄 Usuario cambió, recargando ventas...')
      fetchSales()
    } else {
      console.log('🚫 Usuario se desconectó, limpiando ventas...')
      setSales([])
      setError(null)
    }
  }, [usuario, estaAutenticado, fetchSales])

  // Debug del estado - SOLO SI HAY SESIÓN PARA EVITAR LOGS INNECESARIOS
  useEffect(() => {
    // Solo logear si hay sesión activa
    if (usuario && estaAutenticado) {
      console.log('🎯 ESTADO DEL CONTEXTO SALES:')
      console.log('🎯 Sales count:', sales?.length || 0)
      console.log('🎯 Loading:', loading)
      console.log('🎯 Error:', error)
      console.log('🎯 User Stats:', userStats)
      console.log('🎯 Admin Stats:', adminStats)
    }
  }, [sales, loading, error, userStats, adminStats, usuario, estaAutenticado])

  const contextValue = {
    sales: sales || [],
    loading: loading || false,
    error,
    fetchSales,
    createSale,
    updateSaleStatus,
    // 🆕 Nuevas estadísticas calculadas
    userStats,
    adminStats
  }

  return (
    <SalesContext.Provider value={contextValue}>
      {children}
    </SalesContext.Provider>
  )
}

export { SalesContext }
