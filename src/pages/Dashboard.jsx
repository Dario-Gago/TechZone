import React, { useState, useEffect, useContext } from 'react'
import { User } from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import axios from 'axios'

import StatsCards from '../components/StatsCards'
import UserPurchases from '../components/UserPurchases'
import AdminTabs from '../components/AdminTabs'
import LoadingSpinner from '../components/LoadingSpinner'
import { ProductContext } from '../contexts/ProductContext'

const Dashboard = () => {
  const { esAdmin, usuario } = useAutenticacion()
  const [comprasUsuario, setComprasUsuario] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const { productos } = useContext(ProductContext)
  const [pedidos, setPedidos] = useState([])

  // Función para obtener usuarios de la base de datos
  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('No hay token de autenticación')
        return
      }

      const { data } = await axios.get(API_ENDPOINTS.USUARIOS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('Usuarios cargados desde la base de datos:', data)
      setUsuarios(data)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      setUsuarios([])
    }
  }

  // Función para cargar pedidos desde la base de datos
  const cargarPedidos = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('No hay token de autenticación')
        return
      }

      const { data } = await axios.get(API_ENDPOINTS.PEDIDOS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPedidos(data)
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
      setPedidos([])
    }
  }

  // Función para cargar compras del usuario actual
  const cargarComprasUsuario = async () => {
    if (!usuario?.usuario_id) return

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('No hay token de autenticación')
        return
      }

      const { data } = await axios.get(
        `${API_ENDPOINTS.USUARIOS}/${usuario.usuario_id}/compras`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setComprasUsuario(data)
    } catch (error) {
      console.error('Error al obtener compras del usuario:', error)
      setComprasUsuario([])
    }
  }

  // Función para cargar estadísticas desde la base de datos
  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('No hay token de autenticación')
        return
      }

      const { data } = await axios.get(API_ENDPOINTS.ESTADISTICAS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setEstadisticas(data)
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      setEstadisticas({})
    }
  }

  const eliminarUsuario = async (usuarioId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          alert('No hay token de autenticación')
          return
        }

        await axios.delete(`${API_ENDPOINTS.USUARIOS}/${usuarioId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setUsuarios(usuarios.filter((u) => u.usuario_id !== usuarioId))
        console.log(`Usuario ${usuarioId} eliminado exitosamente`)
        alert('Usuario eliminado exitosamente')
      } catch (error) {
        console.error('Error al eliminar usuario:', error)

        if (error.response?.status === 403) {
          alert('No tienes permisos para eliminar usuarios')
        } else if (error.response?.status === 404) {
          alert('Usuario no encontrado')
        } else if (error.response?.status === 400) {
          alert(error.response?.data?.message || 'Error al eliminar usuario')
        } else {
          alert('Error al eliminar el usuario')
        }
      }
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)

      // Cargar estadísticas para todos los usuarios
      await cargarEstadisticas()

      if (esAdmin) {
        // Si es admin, cargar usuarios y pedidos
        await cargarUsuarios()
        await cargarPedidos()
      } else {
        // Si es usuario normal, cargar solo sus compras
        await cargarComprasUsuario()
      }

      setLoading(false)
    }

    cargarDatos()
  }, [usuario, esAdmin])

  if (loading) {
    return <LoadingSpinner />
  }

  const totalGastado = comprasUsuario.reduce(
    (total, compra) => total + compra.precio,
    0
  )
  const comprasEntregadas = comprasUsuario.filter(
    (c) => c.estado_pedido === 'entregado'
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {esAdmin ? 'Panel de Administración' : 'Mi Panel'}
              </h1>
              <p className="text-gray-600">
                Hola, {usuario?.nombre || 'Usuario'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          esAdmin={esAdmin}
          estadisticas={estadisticas}
          usuarios={usuarios}
          productos={productos}
          totalGastado={totalGastado}
          comprasUsuario={comprasUsuario}
          comprasEntregadas={comprasEntregadas}
        />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {esAdmin ? 'Resumen de Actividad' : 'Mis Compras'}
            </h2>
          </div>
          <div className="p-6">
            {esAdmin ? (
              <AdminTabs
                pedidos={pedidos}
                productos={productos}
                usuarios={usuarios}
                onEliminarUsuario={eliminarUsuario}
              />
            ) : (
              <UserPurchases comprasUsuario={comprasUsuario} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
