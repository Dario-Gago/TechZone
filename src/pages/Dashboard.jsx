import React, { useState, useEffect, useContext } from 'react'
import { User } from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import apiClient from '../services/apiClient' //Usar apiClient en lugar de axios

import StatsCards from '../components/StatsCards'
import UserPurchases from '../components/UserPurchases'
import AdminTabs from '../components/AdminTabs'
import LoadingSpinner from '../components/LoadingSpinner'
import { ProductContext } from '../contexts/ProductContext'
import { useSales } from '../hooks/useSales'

const Dashboard = () => {
  const { esAdmin, usuario } = useAutenticacion()
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const { productos } = useContext(ProductContext)
  
  // Usar SalesContext para obtener las ventas y estadísticas
  const { loading: salesLoading } = useSales()

  // Función para obtener usuarios de la base de datos
  const cargarUsuarios = async () => {
    try {
      
      const { data } = await apiClient.get(API_ENDPOINTS.USUARIOS)
      setUsuarios(data)
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error.message || error)
      
      // Manejar diferentes tipos de errores
      if (error.code === 'ECONNABORTED') {
        console.log('⏱️ Timeout en la petición - Render puede estar "durmiendo"')
      }
      
      setUsuarios([])
    }
  }

  // Función para cargar pedidos desde la base de datos (usando ventas)
  // NOTA: Ahora SalesTab maneja esto directamente a través del SalesContext

  const eliminarUsuario = async (usuarioId) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.USUARIOS}/${usuarioId}`)
      setUsuarios(usuarios.filter((u) => u.usuario_id !== usuarioId))
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error.message || error)
      
      let errorMessage = 'Error al eliminar el usuario'
      
      if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar usuarios'
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado'
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Error al eliminar usuario'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout en la petición - El servidor puede estar ocupado, intenta de nuevo'
      }

      // Re-lanzar el error para que UsersTab lo capture y muestre la alerta
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)

      if (esAdmin) {
        // Si es admin, cargar usuarios
        // Los pedidos ahora se manejan directamente en SalesTab
        await cargarUsuarios()
      }
      setLoading(false)
    }

    cargarDatos()
  }, [usuario, esAdmin, productos])

  // Mostrar loading si está cargando datos generales o sales
  if (loading || salesLoading) {
    return <LoadingSpinner />
  }

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
          usuarios={usuarios}
          productos={productos}
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
                productos={productos}
                usuarios={usuarios}
                onEliminarUsuario={eliminarUsuario}

              />
            ) : (
              <UserPurchases />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
