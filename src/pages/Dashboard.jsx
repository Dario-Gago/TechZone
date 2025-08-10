import React, { useState, useEffect } from 'react'
import { ShoppingCart, Package, TrendingUp, Calendar, User, Trash2, Edit, Plus, X } from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import { 
  obtenerComprasUsuario, 
  obtenerEstadisticasAdmin,
  obtenerUsuario
} from '../data/dataHelpers'
import datosUsuarios from '../data/usuarios.json'
import datosProductos from '../data/products.json'
import datosPedidos from '../data/pedidos.json'
import datosEnvios from '../data/envios.json'
import datosPagos from '../data/pagos.json'

const Dashboard = () => {
  const { esAdmin, usuario } = useAutenticacion()
  const [comprasUsuario, setComprasUsuario] = useState([])
  const [estadisticas, setEstadisticas] = useState({})
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState(datosUsuarios.usuarios)
  const [productos, setProductos] = useState(datosProductos.products.slice(0, 6)) // Mostramos solo los primeros 6
  const [pedidos, setPedidos] = useState([])
  const [tabActiva, setTabActiva] = useState('ventas')
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [formProducto, setFormProducto] = useState({
    name: '',
    brand: '',
    category: '',
    originalPrice: 0,
    image: ''
  })

  useEffect(() => {
    const cargarDatos = () => {
      // Siempre cargar estadísticas generales
      const stats = obtenerEstadisticasAdmin()
      setEstadisticas(stats)

      // Si es admin, cargar pedidos con información de usuarios
      if (esAdmin) {
        const pedidosConUsuarios = datosPedidos.pedidos.map(pedido => {
          const usuarioPedido = datosUsuarios.usuarios.find(u => u.usuario_id === pedido.usuario_id)
          const envio = datosEnvios.envios.find(e => e.pedido_id === pedido.pedido_id)
          const pago = datosPagos.pagos.find(p => p.pedido_id === pedido.pedido_id)
          return {
            ...pedido,
            nombreUsuario: usuarioPedido ? usuarioPedido.nombre : 'Usuario desconocido',
            emailUsuario: usuarioPedido ? usuarioPedido.email : '',
            envio: envio || null,
            pago: pago || null
          }
        }).sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido)) // Ordenar por fecha más reciente
        setPedidos(pedidosConUsuarios)
      }

      // Si hay usuario logueado, cargar sus compras
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
      'entregado': 'bg-green-100 text-green-800',
      'en_proceso': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    return colores[estado] || 'bg-gray-100 text-gray-800'
  }

  const formatearEstado = (estado) => {
    const estados = {
      'entregado': 'Entregado',
      'en_proceso': 'En Proceso',
      'confirmado': 'Confirmado',
      'cancelado': 'Cancelado'
    }
    return estados[estado] || estado
  }

  const eliminarUsuario = (usuarioId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.usuario_id !== usuarioId))
    }
  }

  const agregarProducto = () => {
    setFormProducto({
      name: '',
      brand: '',
      category: '',
      originalPrice: 0,
      image: ''
    })
    setProductoEditando(null)
    setMostrarFormProducto(true)
  }

  const editarProducto = (producto) => {
    setFormProducto({
      name: producto.name,
      brand: producto.brand,
      category: producto.category,
      originalPrice: producto.originalPrice,
      image: producto.image
    })
    setProductoEditando(producto)
    setMostrarFormProducto(true)
  }

  const eliminarProducto = (productoId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== productoId))
    }
  }

  const guardarProducto = (e) => {
    e.preventDefault()
    
    if (productoEditando) {
      // Editar producto existente
      setProductos(productos.map(p => 
        p.id === productoEditando.id 
          ? { ...p, ...formProducto, category: formProducto.category.toLowerCase() }
          : p
      ))
    } else {
      // Agregar nuevo producto
      const nuevoProducto = {
        ...formProducto,
        id: Math.max(...productos.map(p => p.id)) + 1,
        rating: 4.5,
        reviews: 0,
        inStock: 1,
        stock: 10,
        category: formProducto.category.toLowerCase()
      }
      setProductos([...productos, nuevoProducto])
    }
    
    setMostrarFormProducto(false)
    setProductoEditando(null)
    setFormProducto({
      name: '',
      brand: '',
      category: '',
      originalPrice: 0,
      image: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const totalGastado = comprasUsuario.reduce((total, compra) => total + compra.precio, 0)
  const comprasEntregadas = comprasUsuario.filter(c => c.estado_pedido === 'entregado')

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
                Hola, {usuario?.name || 'Usuario'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {esAdmin ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{formatearMoneda(estadisticas.totalVentas || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.totalUsuarios || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Productos</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.totalProductos || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{formatearMoneda(estadisticas.ventasHoy || 0)}</p>
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
                    <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                    <p className="text-2xl font-bold text-gray-900">{formatearMoneda(totalGastado)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-1">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compras Realizadas</p>
                    <p className="text-2xl font-bold text-gray-900">{comprasUsuario.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pedidos Entregados</p>
                    <p className="text-2xl font-bold text-gray-900">{comprasEntregadas.length}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {esAdmin ? 'Resumen de Actividad' : 'Mis Compras'}
            </h2>
          </div>
          <div className="p-6">
            {!esAdmin && comprasUsuario.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No tienes compras aún</p>
                <p className="text-sm">¡Explora nuestros productos y realiza tu primera compra!</p>
              </div>
            ) : esAdmin ? (
              <div className="space-y-6">
                {/* Navegación por pestañas */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-8">
                    {[
                      { id: 'ventas', label: 'Últimas Ventas', icon: Package },
                      { id: 'productos', label: 'Productos', icon: Edit },
                      { id: 'usuarios', label: 'Usuarios', icon: User }
                    ].map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setTabActiva(tab.id)}
                          className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                            tabActiva === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Contenido de las pestañas */}
                <div className="bg-gray-50 rounded-lg p-6">
                  {tabActiva === 'ventas' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Ventas</h3>
                      <div className="space-y-3">
                        {pedidos.slice(0, 6).map((pedido) => (
                          <div key={pedido.pedido_id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Package className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">Pedido #{pedido.pedido_id}</p>
                                    <p className="text-sm text-gray-500">
                                      {pedido.nombreUsuario} • {formatearFecha(pedido.fecha_pedido)}
                                      {pedido.pago && ` • ${pedido.pago.metodo_pago.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                                      {pedido.envio && ` • ${pedido.envio.tipo_entrega === 'domicilio' 
                                        ? pedido.envio.direccion_envio 
                                        : pedido.envio.sucursal_retiro}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">{formatearMoneda(pedido.total)}</p>
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${obtenerEstadoColor(pedido.estado_pedido)}`}>
                                  {pedido.estado_pedido}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tabActiva === 'productos' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Gestión de Productos</h3>
                        <button
                          onClick={agregarProducto}
                          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Agregar</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productos.map((producto) => (
                          <div key={producto.id} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="w-full h-24 bg-gray-50 rounded-md mb-2 flex items-center justify-center">
                              <img src={producto.image} alt={producto.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <h4 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">{producto.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{producto.brand}</p>
                            <p className="font-bold text-green-600 text-sm mb-2">{formatearMoneda(producto.discountPrice || producto.originalPrice)}</p>
                            <div className="flex space-x-1">
                              <button onClick={() => editarProducto(producto)} className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 flex items-center justify-center">
                                <Edit className="w-3 h-3" />
                              </button>
                              <button onClick={() => eliminarProducto(producto.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tabActiva === 'usuarios' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Usuarios Registrados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {usuarios.filter(u => u.rol === 'user').map((usuario) => (
                          <div key={usuario.usuario_id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{usuario.nombre}</p>
                                  <p className="text-sm text-gray-500">{usuario.email}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => eliminarUsuario(usuario.usuario_id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {comprasUsuario.map((compra) => (
                  <div key={compra.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{compra.producto}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerEstadoColor(compra.estado_pedido)}`}>
                            {formatearEstado(compra.estado_pedido)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Pedido #{compra.pedido_id} • {formatearFecha(compra.fecha_pedido)}
                        </p>
                        {compra.descuento > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            Descuento: {formatearMoneda(compra.descuento)}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="font-bold text-gray-900 text-lg">{formatearMoneda(compra.precio)}</p>
                        {compra.envio && (
                          <p className="text-xs text-gray-500">
                            {compra.envio.tipo_entrega === 'domicilio' ? '🏠 Domicilio' : '🏪 Sucursal'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {mostrarFormProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => setMostrarFormProducto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formProducto.name}
                  onChange={(e) => setFormProducto({...formProducto, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={formProducto.brand}
                  onChange={(e) => setFormProducto({...formProducto, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formProducto.category}
                  onChange={(e) => setFormProducto({...formProducto, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Tarjetas gráficas">Tarjetas gráficas</option>
                  <option value="Procesadores">Procesadores</option>
                  <option value="Placas madre">Placas madre</option>
                  <option value="Memoria RAM">Memoria RAM</option>
                  <option value="Almacenamiento">Almacenamiento</option>
                  <option value="Monitores">Monitores</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  value={formProducto.originalPrice}
                  onChange={(e) => setFormProducto({...formProducto, originalPrice: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                <input
                  type="url"
                  value={formProducto.image}
                  onChange={(e) => setFormProducto({...formProducto, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormProducto(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {productoEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard