import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const ProductForm = ({ productoEditando, onGuardar, onCerrar }) => {
  const [formProducto, setFormProducto] = useState({
    name: '',
    brand: '',
    category: '',
    originalPrice: 0,
    discountPrice: 0,
    image: '',
    features: [],
    destacado: false // ✅ Campo agregado para destacado
  })

  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('')

  useEffect(() => {
    if (productoEditando) {
      // ✅ Mapear datos del backend (en inglés) al estado del frontend
      setFormProducto({
        name: productoEditando.name || '',
        brand: productoEditando.brand || '',
        category: productoEditando.category || '',
        originalPrice: productoEditando.originalPrice || 0,
        discountPrice: productoEditando.discountPrice || 0,
        image: productoEditando.image || '',
        features: productoEditando.features || [],
        destacado: productoEditando.destacado || false // ✅ Mapear destacado del backend
      })
    } else {
      setFormProducto({
        name: '',
        brand: '',
        category: '',
        originalPrice: 0,
        discountPrice: 0,
        image: '',
        features: [],
        destacado: false
      })
    }
  }, [productoEditando])

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ Normalizar todos los campos a string antes de usar trim()
    const name = String(formProducto.name || '').trim()
    const brand = String(formProducto.brand || '').trim()
    const category = String(formProducto.category || '').trim()
    const image = String(formProducto.image || '').trim()

    if (!name || !brand || !category || !image) {
      alert(
        'Por favor completa todos los campos requeridos (Nombre, Marca, Categoría e Imagen)'
      )
      return
    }

    // Validar precios
    const originalPrice = Number(formProducto.originalPrice) || 0
    const discountPrice = Number(formProducto.discountPrice) || 0

    if (originalPrice <= 0) {
      alert('El precio original debe ser mayor a 0')
      return
    }

    if (discountPrice > originalPrice) {
      alert('El precio con descuento no puede ser mayor al precio original')
      return
    }

    // ✅ Mapear campos del frontend al formato que espera el backend
    const productoParaBackend = {
      // Campos en español para el backend
      nombre: name,
      marca: brand,
      categoria: category.toLowerCase(),
      precio_original: originalPrice,
      precio_descuento: discountPrice,
      imagen: image,
      caracteristicas: Array.isArray(formProducto.features)
        ? formProducto.features
        : [],

      // Campos adicionales con valores por defecto
      descripcion: '',
      descuento:
        discountPrice > 0
          ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
          : 0,
      subcategoria: '',
      envio: 'Envío estándar',
      stock: 0,
      en_stock: 1,
      destacado: formProducto.destacado // ✅ Usar el valor seleccionado
    }

    console.log('🟢 Enviando al backend:', productoParaBackend)
    onGuardar(productoParaBackend)
  }

  const handleInputChange = (field, value) => {
    setFormProducto((prev) => ({
      ...prev,
      [field]: value || '' // ✅ Asegurar que siempre sea una cadena o número válido
    }))
  }

  // ✅ Función específica para manejar el checkbox de destacado
  const handleDestacadoChange = (e) => {
    setFormProducto((prev) => ({
      ...prev,
      destacado: e.target.checked
    }))
  }

  // ✅ Función para agregar característica
  const agregarCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      setFormProducto((prev) => ({
        ...prev,
        features: [...prev.features, nuevaCaracteristica.trim()]
      }))
      setNuevaCaracteristica('')
    }
  }

  // ✅ Función para eliminar característica
  const eliminarCaracteristica = (index) => {
    setFormProducto((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  // ✅ Manejar Enter en el input de características
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      agregarCaracteristica()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto *
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
              Marca *
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
              Categoría *
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
              Precio Original *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formProducto.originalPrice}
              onChange={(e) =>
                handleInputChange(
                  'originalPrice',
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio con Descuento
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formProducto.discountPrice}
              onChange={(e) =>
                handleInputChange(
                  'discountPrice',
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional - dejar en 0 si no hay descuento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen *
            </label>
            <input
              type="url"
              value={formProducto.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>

          {/* ✅ Nueva sección para producto destacado */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="destacado"
              checked={formProducto.destacado}
              onChange={handleDestacadoChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="destacado"
              className="text-sm font-medium text-gray-700"
            >
              Producto Destacado
            </label>
          </div>

          {/* ✅ Sección de características */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Características
            </label>

            {/* Input para agregar nueva característica */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={nuevaCaracteristica}
                onChange={(e) => setNuevaCaracteristica(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe una característica..."
              />
              <button
                type="button"
                onClick={agregarCaracteristica}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de características */}
            {formProducto.features.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formProducto.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 flex-1">
                      {feature}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarCaracteristica(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formProducto.features.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No hay características agregadas
              </p>
            )}
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
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {productoEditando ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductForm
