import React, { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  Edit2,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import productsData from '../data/products.json'

const Dashboard = () => {
  const { isAdmin } = useAuth()
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({})

  const [purchases] = useState([
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
      category: 'Tablets',
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
      category: 'Accesorios Móviles',
      amount: 129990,
      date: '2025-01-12',
      image: 'https://placehold.co/80x80/1f2937/ffffff?text=Anker+27K'
    }
  ])

  // Datos para vista de administrador (productos desde JSON)
  const [products, setProducts] = useState([])

  // Cargar productos desde JSON al montar el componente
  useEffect(() => {
    // Adaptar la estructura del JSON a la que usa el componente
    const adaptedProducts = productsData.products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: formatCategoryName(product.category),
      price: product.discountPrice || product.originalPrice,
      stock: product.stock,
      sold: Math.floor(Math.random() * 20) + 1, // Valor simulado para ventas
      image: product.image
    }))
    setProducts(adaptedProducts)
  }, [])

  // Función para formatear nombres de categorías
  const formatCategoryName = (category) => {
    const categoryMap = {
      'gaming-streaming': 'Gaming y Streaming',
      computacion: 'Computación',
      componentes: 'Componentes',
      'conectividad-redes': 'Conectividad y Redes',
      'hogar-oficina': 'Hogar y Oficina',
      'audio-video': 'Audio y Video',
      'otras-categorias': 'Otras Categorías'
    }
    return categoryMap[category] || 'Otras Categorías'
  }

  const totalSpent = purchases.reduce(
    (total, purchase) => total + purchase.amount,
    0
  )
  const thisMonthPurchases = purchases.filter(
    (purchase) => new Date(purchase.date).getMonth() === new Date().getMonth()
  )
  const monthlyTotal = thisMonthPurchases.reduce(
    (total, purchase) => total + purchase.amount,
    0
  )

  // Cálculos para vista de administrador
  const totalRevenue = products.reduce(
    (total, product) => total + product.price * product.sold,
    0
  )
  const totalProductsSold = products.reduce(
    (total, product) => total + product.sold,
    0
  )
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  )
  const lowStockProducts = products.filter((product) => product.stock <= 10)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      Componentes: 'bg-blue-100 text-blue-800',
      'Gaming y Streaming': 'bg-purple-100 text-purple-800',
      Computación: 'bg-green-100 text-green-800',
      'Conectividad y Redes': 'bg-yellow-100 text-yellow-800',
      'Hogar y Oficina': 'bg-red-100 text-red-800',
      'Audio y Video': 'bg-indigo-100 text-indigo-800',
      'Otras Categorías': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || colors['Otras Categorías']
  }

  const getStockStatus = (stock) => {
    if (stock <= 5) return { color: 'text-red-600', label: 'Stock Crítico' }
    if (stock <= 10) return { color: 'text-yellow-600', label: 'Stock Bajo' }
    return { color: 'text-green-600', label: 'Stock OK' }
  }

  const startEditing = (product) => {
    setEditingProduct(product.id)
    setEditForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock
    })
  }

  const cancelEditing = () => {
    setEditingProduct(null)
    setEditForm({})
  }

  const saveProduct = () => {
    setProducts(
      products.map((product) =>
        product.id === editingProduct
          ? {
              ...product,
              ...editForm,
              price: Number(editForm.price),
              stock: Number(editForm.stock)
            }
          : product
      )
    )
    setEditingProduct(null)
    setEditForm({})
  }

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value })
  }

  const categories = [
    'Componentes',
    'Gaming y Streaming',
    'Computación',
    'Conectividad y Redes',
    'Hogar y Oficina',
    'Audio y Video',
    'Otras Categorías'
  ]

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Panel Administrativo
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestión de productos y análisis de ventas
            </p>
          </div>

          {/* Admin Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Ingresos Totales
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Productos Vendidos
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {totalProductsSold}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Stock Total
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {totalStock}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Productos
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Inventory */}
          <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Inventario de Productos
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-100"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0 w-full">
                        {editingProduct === product.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nombre del Producto
                                </label>
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) =>
                                    handleInputChange('name', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Marca
                                </label>
                                <input
                                  type="text"
                                  value={editForm.brand}
                                  onChange={(e) =>
                                    handleInputChange('brand', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Categoría
                                </label>
                                <select
                                  value={editForm.category}
                                  onChange={(e) =>
                                    handleInputChange(
                                      'category',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Precio
                                </label>
                                <input
                                  type="number"
                                  value={editForm.price}
                                  onChange={(e) =>
                                    handleInputChange('price', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Stock
                                </label>
                                <input
                                  type="number"
                                  value={editForm.stock}
                                  onChange={(e) =>
                                    handleInputChange('stock', e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={cancelEditing}
                                className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancelar</span>
                              </button>
                              <button
                                onClick={saveProduct}
                                className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                              >
                                <Save className="w-4 h-4" />
                                <span>Guardar</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-2 space-y-2 sm:space-y-0">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {product.brand}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="text-lg sm:text-xl font-bold text-green-600">
                                  {formatCurrency(product.price)}
                                </span>
                                <button
                                  onClick={() => startEditing(product)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Editar producto"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between text-xs sm:text-sm text-gray-600 space-y-2 lg:space-y-0">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                                    product.category
                                  )}`}
                                >
                                  {product.category}
                                </span>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <span>📦 Stock:</span>
                                  <span
                                    className={`font-semibold ${
                                      getStockStatus(product.stock).color
                                    }`}
                                  >
                                    {product.stock}
                                  </span>
                                  <span className="hidden sm:inline text-xs text-gray-500">
                                    ({getStockStatus(product.stock).label})
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                <span>
                                  📈 Vendidos: <strong>{product.sold}</strong>
                                </span>
                                <span className="hidden sm:inline">
                                  💰 Ingresos:{' '}
                                  <strong>
                                    {formatCurrency(
                                      product.price * product.sold
                                    )}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Ventas por Categoría
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(
                products.reduce((acc, product) => {
                  const revenue = product.price * product.sold
                  acc[product.category] = (acc[product.category] || 0) + revenue
                  return acc
                }, {})
              ).map(([category, revenue]) => (
                <div key={category} className="text-center">
                  <div
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 ${getCategoryColor(
                      category
                    )}`}
                  >
                    <span className="truncate block">{category}</span>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                    {formatCurrency(revenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {products
                      .filter((p) => p.category === category)
                      .reduce((total, p) => total + p.sold, 0)}{' '}
                    vendidos
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-4">
                ⚠️ Productos con Stock Bajo
              </h3>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={`low-stock-${product.id}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-red-100 last:border-b-0 space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-red-900 truncate text-sm sm:text-base">
                          {product.name}
                        </p>
                        <p className="text-xs sm:text-sm text-red-600">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="font-bold text-red-800 text-sm sm:text-base">
                        Stock: {product.stock}
                      </p>
                      <p className="text-xs text-red-600">
                        {getStockStatus(product.stock).label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vista de Usuario Regular - Mostrar Compras
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* User Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Mis Compras
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Historial de todas tus compras realizadas
          </p>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(totalSpent)}
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
                  {formatCurrency(monthlyTotal)}
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
                  {purchases.length}
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
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Historial de Compras
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {purchases.map((purchase) => (
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
                            {formatCurrency(purchase.amount)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(purchase.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getCategoryColor(
                              purchase.category
                            )}`}
                          >
                            {purchase.category}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          <span>
                            🛒 Comprado el {formatDate(purchase.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Summary by Category */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoría
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(
              purchases.reduce((acc, purchase) => {
                acc[purchase.category] =
                  (acc[purchase.category] || 0) + purchase.amount
                return acc
              }, {})
            ).map(([category, total]) => (
              <div key={category} className="text-center">
                <div
                  className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 ${getCategoryColor(
                    category
                  )}`}
                >
                  <span className="truncate block">{category}</span>
                </div>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(total)}
                </p>
                <p className="text-xs text-gray-500">
                  {purchases.filter((p) => p.category === category).length}{' '}
                  compras
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            📅 Compras Recientes (Este Mes)
          </h3>
          {thisMonthPurchases.length > 0 ? (
            <div className="space-y-3">
              {thisMonthPurchases.map((purchase) => (
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
                      {formatCurrency(purchase.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(purchase.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No tienes compras este mes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
