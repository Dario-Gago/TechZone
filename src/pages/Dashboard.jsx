import React, { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, DollarSign, Filter } from 'lucide-react'
import { useAutenticacion } from '../contexts/AuthContext'
import datosProductos from '../data/products.json'

const Dashboard = () => {
  const { usuario } = useAutenticacion() // Obtener información del usuario
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todo')

  const [compras] = useState([
    {
      id: 1,
      item: 'GeForce RTX 5060 OC, 8GB 128-bit, PCI-e 5.0 x8',
      brand: 'GIGABYTE',
      category: 'Componentes',
      amount: 389990,
      date: '2025-01-15',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=RTX+5060'
    },
    {
      id: 2,
      item: 'Sony WH-1000XM6 Wireless Headphones',
      brand: 'Sony',
      category: 'Audio y Video',
      amount: 399990,
      date: '2025-01-20',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Sony+XM6'
    },
    {
      id: 3,
      item: 'AMD Ryzen 7 7800X3D, 3D‑VCache',
      brand: 'AMD',
      category: 'Componentes',
      amount: 399990,
      date: '2025-01-25',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Ryzen+7+7800X3D'
    },
    {
      id: 4,
      item: 'Shure MV7+ USB/XLR Micrófono',
      brand: 'Shure',
      category: 'Gaming y Streaming',
      amount: 349990,
      date: '2025-02-01',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Shure+MV7%2B'
    },
    {
      id: 5,
      item: 'Samsung Galaxy Tab S25 Ultra 5G',
      brand: 'Samsung',
      category: 'Otras Categorías',
      amount: 1149990,
      date: '2025-02-03',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Tab+S25+Ultra'
    },
    {
      id: 6,
      item: 'ASUS ZenWiFi BT10 Wi‑Fi 7 Mesh',
      brand: 'ASUS',
      category: 'Conectividad y Redes',
      amount: 319990,
      date: '2025-01-10',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=ZenWiFi+BT10'
    },
    {
      id: 7,
      item: 'Philips Hue Bridge y Kit Iniciación',
      brand: 'Philips',
      category: 'Hogar y Oficina',
      amount: 179990,
      date: '2025-01-28',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Philips+Hue'
    },
    {
      id: 8,
      item: 'Anker PowerCore 27,000mAh PD 140W',
      brand: 'Anker',
      category: 'Otras Categorías',
      amount: 129990,
      date: '2025-01-12',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Anker+27K'
    }
  ])

  const [categorias, setCategorias] = useState([])

  // Cargar categorías desde JSON al montar el componente
  useEffect(() => {
    setCategorias(datosProductos.categories)
  }, [])

  // Función para formatear nombres de categorías
  const formatearNombreCategoria = (categoria) => {
    const mapaCategoria = {
      'gaming-streaming': 'Gaming y Streaming',
      computacion: 'Computación',
      componentes: 'Componentes',
      'conectividad-redes': 'Conectividad y Redes',
      'hogar-oficina': 'Hogar y Oficina',
      'audio-video': 'Audio y Video',
      'otras-categorias': 'Otras Categorías'
    }
    return mapaCategoria[categoria] || 'Otras Categorías'
  }

  // Función para filtrar compras según la categoría seleccionada
  const filtrarPorCategoria = (items, slugCategoria) => {
    if (slugCategoria === 'todo') return items

    const nombreCategoria = categorias.find((cat) => cat.id === slugCategoria)?.name
    if (!nombreCategoria) return items

    return items.filter(
      (item) =>
        item.category === nombreCategoria ||
        item.category === formatearNombreCategoria(slugCategoria)
    )
  }

  // Compras filtradas
  const comprasFiltradas = filtrarPorCategoria(compras, categoriaSeleccionada)

  const totalGastado = comprasFiltradas.reduce(
    (total, compra) => total + compra.amount,
    0
  )
  const comprasEsteMes = comprasFiltradas.filter(
    (compra) => new Date(compra.date).getMonth() === new Date().getMonth()
  )
  const totalMensual = comprasEsteMes.reduce(
    (total, compra) => total + compra.amount,
    0
  )

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  const formatearFecha = (cadenaFecha) => {
    return new Date(cadenaFecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      Componentes: 'bg-blue-100 text-blue-800',
      'Gaming y Streaming': 'bg-purple-100 text-purple-800',
      Computación: 'bg-green-100 text-green-800',
      'Conectividad y Redes': 'bg-yellow-100 text-yellow-800',
      'Hogar y Oficina': 'bg-red-100 text-red-800',
      'Audio y Video': 'bg-indigo-100 text-indigo-800',
      'Otras Categorías': 'bg-pink-100 text-pink-800'
    }
    return colores[categoria] || colores['Otras Categorías']
  }

  // Componente de filtro de categorías
  const FiltroCategorias = () => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Filtrar por Categoría
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
              categoriaSeleccionada === categoria.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoria.name}
            {categoria.id !== 'todo' && (
              <span className="ml-1 sm:ml-2 text-xs opacity-75">
                ({filtrarPorCategoria(compras, categoria.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {categoriaSeleccionada !== 'todo' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">
              Mostrando{' '}
              {categoriaSeleccionada === 'todo'
                ? 'todas las categorías'
                : categorias.find((c) => c.id === categoriaSeleccionada)?.name}
            </span>
            <span className="ml-2">({comprasFiltradas.length} compras)</span>
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* User Header con información del usuario */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Hola, {usuario?.name || 'Usuario'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {usuario?.email || 'usuario@ejemplo.com'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Aquí puedes ver el historial de todas tus compras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <FiltroCategorias />

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatearMoneda(totalGastado)}
                </p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Compras Este Mes
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatearMoneda(totalMensual)}
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Productos
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {comprasFiltradas.length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Purchases List */}
        <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Historial de Compras
                  {categoriaSeleccionada !== 'todo' && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({categorias.find((c) => c.id === categoriaSeleccionada)?.name}
                      )
                    </span>
                  )}
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                {comprasFiltradas.length} compras
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {comprasFiltradas.length > 0 ? (
              <div className="space-y-4">
                {comprasFiltradas.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Purchase Image */}
                      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
                        <img
                          src={purchase.image}
                          alt={purchase.item}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-100"
                        />
                      </div>

                      {/* Purchase Info */}
                      <div className="flex-grow min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-2 space-y-2 sm:space-y-0">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                              {purchase.item}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {purchase.brand}
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <p className="text-xl sm:text-2xl font-bold text-green-600">
                              {formatearMoneda(purchase.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {formatearFecha(purchase.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${obtenerColorCategoria(
                                purchase.category
                              )}`}
                            >
                              {purchase.category}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            <span>
                              🛒 Comprado el {formatearFecha(purchase.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No tienes compras en esta categoría
                </p>
                <p className="text-sm">
                  Selecciona otra categoría para ver más compras
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Summary by Category - Only show if showing all categories */}
        {categoriaSeleccionada === 'todo' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Gastos por Categoría
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(
                compras.reduce((acc, purchase) => {
                  acc[purchase.category] =
                    (acc[purchase.category] || 0) + purchase.amount
                  return acc
                }, {})
              ).map(([category, total]) => (
                <div key={category} className="text-center">
                  <div
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 ${obtenerColorCategoria(
                      category
                    )}`}
                  >
                    <span className="truncate block">{category}</span>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                    {formatearMoneda(total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {compras.filter((p) => p.category === category).length}{' '}
                    compras
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            📅 Compras Recientes (Este Mes)
            {categoriaSeleccionada !== 'todo' && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categorias.find((c) => c.id === categoriaSeleccionada)?.name})
              </span>
            )}
          </h3>
          {comprasEsteMes.length > 0 ? (
            <div className="space-y-3">
              {comprasEsteMes.map((purchase) => (
                <div
                  key={`recent-${purchase.id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0 space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <img
                      src={purchase.image}
                      alt={purchase.item}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {purchase.item}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {purchase.brand}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-bold text-green-600 text-sm sm:text-base">
                      {formatearMoneda(purchase.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatearFecha(purchase.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                {categoriaSeleccionada === 'todo'
                  ? 'No tienes compras este mes'
                  : `No tienes compras este mes en ${
                      categorias.find((c) => c.id === categoriaSeleccionada)?.name
                    }`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard