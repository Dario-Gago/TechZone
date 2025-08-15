import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const ProductForm = ({ productoEditando, onGuardar, onCerrar }) => {
  const [formProducto, setFormProducto] = useState({
    name: '',
    brand: '',
    category: '',
    originalPrice: 0,
    image: ''
  })

  useEffect(() => {
    if (productoEditando) {
      setFormProducto({
        name: productoEditando.name,
        brand: productoEditando.brand,
        category: productoEditando.category,
        originalPrice: productoEditando.originalPrice,
        image: productoEditando.image
      })
    } else {
      setFormProducto({
        name: '',
        brand: '',
        category: '',
        originalPrice: 0,
        image: ''
      })
    }
  }, [productoEditando])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (productoEditando) {
      // ✅ Cuando edita: pasa el ID y los datos
      onGuardar(productoEditando.id, formProducto)
    } else {
      // Para crear nuevo producto (si es necesario)
      onGuardar(formProducto)
    }
  }

  const handleInputChange = (field, value) => {
    setFormProducto((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto
            </label>
            <input
              type="text"
              value={formProducto.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              value={formProducto.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={formProducto.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              value={formProducto.originalPrice}
              onChange={(e) =>
                handleInputChange(
                  'originalPrice',
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen
            </label>
            <input
              type="url"
              value={formProducto.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
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
  )
}

export default ProductForm
