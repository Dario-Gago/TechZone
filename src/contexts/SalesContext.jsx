// src/contexts/SalesContext.jsx
import { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from './AuthContext'

const SalesContext = createContext()

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { usuario, estaAutenticado, token } = useAuth()

  // Ref para evitar múltiples llamadas simultáneas
  const fetchSalesRef = useRef(false)

  // Función segura para obtener datos de autenticación (sin logs redundantes)
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

      return { token: tokenFromContext, usuario: userFromContext }
    } catch (error) {
      console.error('❌ Error obteniendo datos de auth:', error)
      return { token: null, usuario: null }
    }
  }, [token, usuario])

  // ✅ Get sales from backend (con prevención de llamadas duplicadas)
  const fetchSales = useCallback(async () => {
    // Prevenir múltiples llamadas simultáneas
    if (fetchSalesRef.current) {
      return
    }

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
      fetchSalesRef.current = true
      setLoading(true)
      setError(null)

      // Usamos el endpoint /me para traer solo las ventas del usuario actual
      const url = usuario?.admin
        ? API_ENDPOINTS.VENTAS
        : `${API_ENDPOINTS.VENTAS}/me`

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
      setIsInitialized(true)
    } catch (err) {
      console.error('❌ Error en fetchSales:', err)
      setError(
        err.response?.data?.error || err.message || 'Error cargando ventas'
      )
      setSales([])
    } finally {
      setLoading(false)
      fetchSalesRef.current = false
    }
  }, [getAuthData])

  // ✅ Create new sale
  const createSale = async (items, total) => {

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
      
      // Actualizar localmente en lugar de recargar todo
      setSales(prevSales => 
        prevSales.map(sale => 
          (sale.id === ventaId || sale.venta_id === ventaId)
            ? { ...sale, estado: nuevoEstado, estado_pedido: nuevoEstado }
            : sale
        )
      )
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
            venta.usuario_id === currentUser?.usuario_id ||
            venta.user_id === currentUser?.usuario_id ||
            venta.usuario_id === currentUser?.id ||
            venta.user_id === currentUser?.id
        )

    let totalGastado = 0
    const comprasEntregadas = []

    ventasUsuario.forEach((venta) => {
      // Calcular total gastado
      let montoVenta = 0
      if (venta.total !== undefined && venta.total !== null) {
        montoVenta = parseFloat(venta.total)
        if (isNaN(montoVenta)) {
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

    return {
      totalGastado,
      comprasRealizadas: ventasUsuario.length,
      comprasEntregadas: comprasEntregadas.length,
      comprasEntregadasData: comprasEntregadas
    }
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

    sales.forEach((venta) => {
      // Convertir el total a número
      let montoVenta = 0
      if (venta.total !== undefined && venta.total !== null) {
        montoVenta = parseFloat(venta.total)
        if (isNaN(montoVenta)) {
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

    return {
      totalVentas,
      ventasHoy,
      cantidadVentas,
      ventasHoyCount
    }
  }, [sales, usuario, estaAutenticado])

  // Cargar ventas cuando el componente se monte o cambien las credenciales (solo una vez por sesión)
  useEffect(() => {
    // Solo proceder si hay usuario autenticado y no se ha inicializado
    if (!usuario || !estaAutenticado) {
      setSales([])
      setError(null)
      setIsInitialized(false)
      return
    }

    // Si ya se inicializó para este usuario, no volver a cargar
    if (isInitialized) {
      return
    }

    const { token, usuario: userData } = getAuthData()

    if (token && userData) {
      fetchSales()
    } else {
      setSales([])
      setError(null)
      setIsInitialized(false)
    }
  }, [usuario, estaAutenticado, isInitialized, getAuthData, fetchSales])

  // Limpiar estado cuando el usuario cambie o se desconecte
  useEffect(() => {
    if (!usuario || !estaAutenticado) {
      setSales([])
      setError(null)
      setIsInitialized(false)
    }
  }, [usuario, estaAutenticado]) // Solo reaccionar al cambio real de usuario

  // Escuchar cambios en localStorage (solo si no está inicializado)
  useEffect(() => {
    if (isInitialized) return // No hacer nada si ya está inicializado

    const handleStorageChange = () => {
      // Solo proceder si hay usuario autenticado en el contexto
      if (!usuario || !estaAutenticado) {
        setSales([])
        setError(null)
        setIsInitialized(false)
        return
      }

      const { token, usuario: userData } = getAuthData()

      if (token && userData) {
        fetchSales()
      } else {
        setSales([])
        setError(null)
        setIsInitialized(false)
      }
    }

    // Solo añadir el listener si hay sesión activa
    if (usuario && estaAutenticado) {
      window.addEventListener('storage', handleStorageChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [usuario, estaAutenticado, isInitialized, getAuthData, fetchSales])

  // Debug del estado - solo en desarrollo y limitado
  useEffect(() => {
    if (usuario && estaAutenticado && import.meta.env.DEV) {
    }
  }, [sales?.length, loading, error, usuario, estaAutenticado])

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
