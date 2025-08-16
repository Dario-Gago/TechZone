// src/contexts/SalesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const SalesContext = createContext()

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Función segura para obtener datos de autenticación
  const getAuthData = () => {
    try {
      // Primero intentar desde localStorage directamente
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      let usuario = null
      if (userStr) {
        try {
          usuario = JSON.parse(userStr)
        } catch (parseError) {
          console.warn('⚠️ Error parsing user from localStorage:', parseError)
        }
      }

      console.log('🔑 Auth data desde localStorage:', {
        token: token ? 'Disponible' : 'No disponible',
        usuario
      })

      return { token, usuario }
    } catch (error) {
      console.error('❌ Error obteniendo datos de auth:', error)
      return { token: null, usuario: null }
    }
  }

  // ✅ Get sales from backend
  const fetchSales = async () => {
    console.log('🔍 fetchSales llamado')

    const { token, usuario } = getAuthData()

    console.log('🔍 Token disponible:', !!token)
    console.log('🔍 Usuario:', usuario)
    console.log('🔍 API Endpoint:', API_ENDPOINTS?.VENTAS)

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

      console.log('🌐 Haciendo petición GET a:', `${API_ENDPOINTS.VENTAS}`)

      const res = await axios.get(`${API_ENDPOINTS.VENTAS}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('✅ Respuesta exitosa:')
      console.log('📊 Status:', res.status)
      console.log('📊 Data:', res.data)
      console.log('📊 Tipo de data:', typeof res.data)
      console.log('📊 Es array:', Array.isArray(res.data))
      console.log('📊 Longitud:', res.data?.length)

      if (res.data && Array.isArray(res.data)) {
        console.log('📊 Primera venta:', res.data[0])
        setSales(res.data)
        console.log('✅ Sales actualizadas en el contexto')
      } else if (res.data && typeof res.data === 'object' && res.data.ventas) {
        console.log('📊 Datos en estructura anidada')
        setSales(res.data.ventas)
      } else if (res.data && typeof res.data === 'object' && res.data.data) {
        console.log('📊 Datos en estructura data')
        setSales(res.data.data)
      } else {
        console.warn('⚠️ Los datos no son un array válido:', res.data)
        setSales([])
      }
    } catch (err) {
      console.error('❌ Error en fetchSales:')
      console.error('❌ Error completo:', err)
      console.error('❌ Response:', err.response)
      console.error('❌ Response data:', err.response?.data)
      console.error('❌ Response status:', err.response?.status)

      let errorMessage = 'Error loading sales'

      if (err.response?.status === 401) {
        errorMessage = 'No autorizado para ver las ventas'
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para ver las ventas'
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint de ventas no encontrado'
      } else if (err.response?.status === 500) {
        errorMessage = 'Error interno del servidor'
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      setSales([])
    } finally {
      setLoading(false)
      console.log('🏁 fetchSales finalizado')
    }
  }

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

  // Cargar ventas cuando el componente se monte
  useEffect(() => {
    console.log('🔄 SalesProvider montado, verificando autenticación...')

    const { token, usuario } = getAuthData()

    if (token && usuario) {
      console.log('🔄 Datos de auth disponibles, cargando ventas...')
      fetchSales()
    } else {
      console.log('🚫 No hay datos de auth, esperando...')
      setSales([])
      setError(null)
    }
  }, []) // Solo se ejecuta una vez al montar

  // Escuchar cambios en localStorage (cuando el usuario haga login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('📱 Cambio detectado en localStorage')
      const { token, usuario } = getAuthData()

      if (token && usuario) {
        console.log('🔄 Nueva sesión detectada, cargando ventas...')
        fetchSales()
      } else {
        console.log('🚫 Sesión cerrada, limpiando datos...')
        setSales([])
        setError(null)
      }
    }

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange)

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Debug del estado cada vez que cambie
  useEffect(() => {
    console.log('🎯 ESTADO DEL CONTEXTO SALES:')
    console.log('🎯 Sales count:', sales?.length || 0)
    console.log('🎯 Loading:', loading)
    console.log('🎯 Error:', error)

    const { token, usuario } = getAuthData()
    console.log('🎯 Token actual:', token ? 'Disponible' : 'No disponible')
    console.log('🎯 Usuario actual:', usuario?.email || 'No disponible')
  }, [sales, loading, error])

  const contextValue = {
    sales: sales || [],
    loading: loading || false,
    error,
    fetchSales,
    createSale,
    updateSaleStatus
  }

  return (
    <SalesContext.Provider value={contextValue}>
      {children}
    </SalesContext.Provider>
  )
}

// Hook para usar en componentes
export const useSales = () => {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSales debe ser usado dentro de SalesProvider')
  }
  return context
}
