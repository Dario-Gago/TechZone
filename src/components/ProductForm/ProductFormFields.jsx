import React from 'react'

const ProductFormFields = ({ formData, onChange, errors = {} }) => {
  const handleInputChange = (field, value) => {
    onChange(field, value)
  }

  const handleDestacadoChange = (e) => {
    onChange('destacado', e.target.checked)
  }

  return (
    <div className="space-y-4">
      {/* Nombre del Producto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Producto *
        </label>
        <input
          type="text"
          value={formData.nombre || ''}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* Marca */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marca *
        </label>
        <input
          type="text"
          value={formData.marca || ''}
          onChange={(e) => handleInputChange('marca', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.marca ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.marca && (
          <p className="text-red-500 text-xs mt-1">{errors.marca}</p>
        )}
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Normal *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio_normal || 0}
            onChange={(e) => handleInputChange('precio_normal', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.precio_normal ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.precio_normal && (
            <p className="text-red-500 text-xs mt-1">{errors.precio_normal}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio con Oferta
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio_oferta || 0}
            onChange={(e) => handleInputChange('precio_oferta', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Opcional - dejar en 0 si no hay oferta"
          />
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Disponible *
        </label>
        <input
          type="number"
          min="0"
          value={formData.stock || 0}
          onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Cantidad disponible"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.stock > 0
            ? `✅ En stock (${formData.stock} unidades)`
            : '❌ Sin stock'}
        </p>
        {errors.stock && (
          <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
        )}
      </div>

      {/* URL de imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de imagen *
        </label>
        <input
          type="url"
          value={formData.imagen_url || ''}
          onChange={(e) => handleInputChange('imagen_url', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.imagen_url ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
        {errors.imagen_url && (
          <p className="text-red-500 text-xs mt-1">{errors.imagen_url}</p>
        )}
      </div>

      {/* Producto destacado */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="destacado"
          checked={formData.destacado || false}
          onChange={handleDestacadoChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
          Producto Destacado
        </label>
      </div>

      {/* Características */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Características
        </label>
        <textarea
          value={formData.caracteristicas || ''}
          onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Escribe las características del producto, una por línea:&#10;• 8GB RAM&#10;• Procesador Intel i7&#10;• Tarjeta gráfica dedicada"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          Escribe cada característica en una línea separada.
        </p>
      </div>
    </div>
  )
}

export default ProductFormFields
