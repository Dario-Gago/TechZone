import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import axios from 'axios'
import {
  obtenerComprasUsuario,
  obtenerEstadisticasAdmin,
  obtenerUsuario
} from '../hooks/dataHelpers'
import datosUsuarios from '../data/usuarios.json'
import datosProductos from '../data/products.json'
import datosPedidos from '../data/pedidos.json'

import StatsCards from '../components/StatsCards'
import UserPurchases from '../components/UserPurchases'
import AdminTabs from '../components/AdminTabs'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { esAdmin, usuario } = useAutenticacion()
  const [comprasUsuario, setComprasUsuario] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [productos, setProductos] = useState(
    datosProductos.products.slice(0, 6)
  )
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
      console.log('Estructura del primer usuario:', data[0])
      setUsuarios(data)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      setUsuarios([])
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

  const eliminarProducto = (productoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductos(productos.filter((p) => p.id !== productoId))
    }
  }

  const guardarProducto = (formProducto, productoEditando) => {
    if (productoEditando) {
      setProductos(
        productos.map((p) =>
          p.id === productoEditando.id
            ? {
                ...p,
                ...formProducto,
                category: formProducto.category.toLowerCase()
              }
            : p
        )
      )
    } else {
      const nuevoProducto = {
        ...formProducto,
        id: Math.max(...productos.map((p) => p.id)) + 1,
        rating: 4.5,
        reviews: 0,
        inStock: 1,
        stock: 10,
        category: formProducto.category.toLowerCase()
      }
      setProductos([...productos, nuevoProducto])
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      const stats = obtenerEstadisticasAdmin()
      setEstadisticas(stats)

      if (esAdmin) {
        await cargarUsuarios()

        const pedidosConUsuarios = datosPedidos.pedidos.map((pedido) => {
          const usuarioEncontrado = datosUsuarios.usuarios.find(
            (u) => u.usuario_id === pedido.usuario_id
          )
          return {
            ...pedido,
            nombreUsuario: usuarioEncontrado
              ? usuarioEncontrado.nombre
              : 'Desconocido'
          }
        })
        setPedidos(pedidosConUsuarios)
      }

      if (usuario?.email) {
        const usuarioData = obtenerUsuario(usuario.email)
        if (usuarioData) {
          const compras = obtenerComprasUsuario(usuarioData.usuario_id)
          setComprasUsuario(compras)
        }
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
                onEliminarProducto={eliminarProducto}
                onGuardarProducto={guardarProducto}
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
