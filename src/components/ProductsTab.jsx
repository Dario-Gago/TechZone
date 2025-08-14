import React, { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import ProductForm from './ProductForm'

const ProductsTab = ({ productos, onEliminarProducto, onGuardarProducto }) => {
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(cantidad)
  }

  const agregarProducto = () => {
    setProductoEditando(null)
    setMostrarFormProducto(true)
  }

  const editarProducto = (producto) => {
    setProductoEditando(producto)
    setMostrarFormProducto(true)
  }

  const handleGuardarProducto = (formProducto) => {
    onGuardarProducto(formProducto, productoEditando)
    setMostrarFormProducto(false)
    setProductoEditando(null)
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Gestión de Productos
          </h3>
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
            <div
              key={producto.id}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="w-full h-24 bg-gray-50 rounded-md mb-2 flex items-center justify-center">
                <img
                  src={producto.image}
                  alt={producto.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h4 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
                {producto.name}
              </h4>
              <p className="text-xs text-gray-500 mb-2">{producto.brand}</p>
              <p className="font-bold text-green-600 text-sm mb-2">
                {formatearMoneda(
                  producto.discountPrice || producto.originalPrice
                )}
              </p>
              <div className="flex space-x-1">
                <button
                  onClick={() => editarProducto(producto)}
                  className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 flex items-center justify-center"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onEliminarProducto(producto.id)}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {mostrarFormProducto && (
        <ProductForm
          productoEditando={productoEditando}
          onGuardar={handleGuardarProducto}
          onCerrar={() => setMostrarFormProducto(false)}
        />
      )}
    </>
  )
}

export default ProductsTab
