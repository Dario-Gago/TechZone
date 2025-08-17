import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const ProductForm = ({ productoEditando, onGuardar, onCerrar }) => {
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    precio_original: 0,
    precio_descuento: 0,
    imagen: '',
    caracteristicas: '',  // Cambiar a string en lugar de array
    destacado: false,
    stock: 0
  })

  // Ya no necesitamos el estado para nueva característica
  // const [nuevaCaracteristica, setNuevaCaracteristica] = useState('')

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px' // Evitar el salto por scrollbar
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }
  }, [])

  useEffect(() => {
    if (productoEditando) {
      console.log('🔍 Producto completo:', productoEditando)
      console.log('🔍 Características del producto:', productoEditando.caracteristicas)
      console.log('🔍 Tipo de características:', typeof productoEditando.caracteristicas)
      console.log('🔍 Es array características?:', Array.isArray(productoEditando.caracteristicas))
      
      // ✅ Usar directamente los datos del backend en español
      const caracteristicasText = (() => {
        // Usar características del backend
        if (Array.isArray(productoEditando.caracteristicas) && productoEditando.caracteristicas.length > 0) {
          console.log('🟢 Usando caracteristicas como array:', productoEditando.caracteristicas)
          return productoEditando.caracteristicas.join('\n')
        }
        if (typeof productoEditando.caracteristicas === 'string' && productoEditando.caracteristicas.trim()) {
          console.log('🟢 Usando caracteristicas como string:', productoEditando.caracteristicas)
          return productoEditando.caracteristicas
        }
        // Si no hay características específicas, usar la descripción como base
        if (typeof productoEditando.descripcion === 'string' && productoEditando.descripcion.trim()) {
          console.log('🟢 Usando descripcion como características:', productoEditando.descripcion)
          return productoEditando.descripcion
        }
        console.log('🔴 No se encontraron características válidas')
        return ''
      })()
      
      console.log('🔍 Características procesadas finales:', caracteristicasText)
      console.log('🔍 Length de características procesadas:', caracteristicasText.length)
      
      const nuevoEstado = {
        nombre: productoEditando.nombre || '',
        marca: productoEditando.marca || '',
        categoria: productoEditando.categoria || '',
        precio_original: productoEditando.precio_original || 0,
        precio_descuento: productoEditando.precio_descuento || 0,
        imagen: productoEditando.imagen || '',
        caracteristicas: caracteristicasText,
        destacado: productoEditando.destacado || false,
        stock: productoEditando.stock || 0
      }
      
      console.log('🔍 Estado que se va a establecer:', nuevoEstado)
      setFormProducto(nuevoEstado)
    } else {
      setFormProducto({
        nombre: '',
        marca: '',
        categoria: '',
        precio_original: 0,
        precio_descuento: 0,
        imagen: '',
        caracteristicas: '',
        destacado: false,
        stock: 0
      })
    }
  }, [productoEditando])

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ Normalizar todos los campos a string antes de usar trim()
    const nombre = String(formProducto.nombre || '').trim()
    const marca = String(formProducto.marca || '').trim()
    const categoria = String(formProducto.categoria || '').trim()
    const imagen = String(formProducto.imagen || '').trim()

    if (!nombre || !marca || !categoria || !imagen) {
      alert(
        'Por favor completa todos los campos requeridos (Nombre, Marca, Categoría e Imagen)'
      )
      return
    }

    // Validar precios
    const precio_original = Number(formProducto.precio_original) || 0
    const precio_descuento = Number(formProducto.precio_descuento) || 0

    if (precio_original <= 0) {
      alert('El precio original debe ser mayor a 0')
      return
    }

    if (precio_descuento > precio_original) {
      alert('El precio con descuento no puede ser mayor al precio original')
      return
    }

    // Validar stock
    const stock = Number(formProducto.stock) || 0

    if (stock < 0) {
      alert('El stock no puede ser negativo')
      return
    }

    // ✅ Procesar características: convertir texto a array
    const caracteristicasArray = formProducto.caracteristicas
      ? formProducto.caracteristicas
          .split('\n') // Dividir por saltos de línea
          .map(feature => feature.trim()) // Eliminar espacios extra
          .filter(feature => feature.length > 0) // Eliminar líneas vacías
      : []

    // ✅ Mapear campos del frontend al formato que espera el backend
    const productoParaBackend = {
      // Campos en español para el backend
      nombre: nombre,
      marca: marca,
      categoria: categoria.toLowerCase(),
      precio_original: precio_original,
      precio_descuento: precio_descuento,
      imagen: imagen,
      caracteristicas: caracteristicasArray, // Usar el array procesado

      // Campos adicionales con valores por defecto
      descripcion: '',
      descuento:
        precio_descuento > 0
          ? Math.round(((precio_original - precio_descuento) / precio_original) * 100)
          : 0,
      subcategoria: '',
      envio: 'Envío estándar',
      stock: stock, // ✅ Usar el valor ingresado
      en_stock: stock > 0 ? 1 : 0, // ✅ Automático basado en stock
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

  // Manejar clic en el overlay para cerrar el modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCerrar()
    }
  }

  // Alternativa sin portal para debugging
  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 999999
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '448px',
          width: '100%',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1000000
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
              value={formProducto.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
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
              value={formProducto.marca}
              onChange={(e) => handleInputChange('marca', e.target.value)}
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
              value={formProducto.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
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
              value={formProducto.precio_original}
              onChange={(e) =>
                handleInputChange(
                  'precio_original',
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
              value={formProducto.precio_descuento}
              onChange={(e) =>
                handleInputChange(
                  'precio_descuento',
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional - dejar en 0 si no hay descuento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Disponible *
            </label>
            <input
              type="number"
              min="0"
              value={formProducto.stock}
              onChange={(e) =>
                handleInputChange('stock', parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cantidad disponible"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formProducto.stock > 0
                ? `✅ En stock (${formProducto.stock} unidades)`
                : '❌ Sin stock'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen *
            </label>
            <input
              type="url"
              value={formProducto.imagen}
              onChange={(e) => handleInputChange('imagen', e.target.value)}
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

          {/* ✅ Sección de características simplificada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Características
            </label>
            <textarea
              value={formProducto.caracteristicas}
              onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Escribe las características del producto, una por línea:&#10;• 8GB RAM&#10;• Procesador Intel i7&#10;• Tarjeta gráfica dedicada"
              rows={4}
              onFocus={() => console.log('🔍 Valor actual en textarea al hacer focus:', formProducto.caracteristicas)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Escribe cada característica en una línea separada. Las características se agregarán automáticamente al crear el producto.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
            >
              {productoEditando ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ProductForm
