import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import ProductFormFields from './ProductFormFields'
import CategoryManager from './CategoryManager'

const ProductForm = ({ productoEditando, onGuardar, onCerrar }) => {
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    precio_normal: 0,
    precio_oferta: 0,
    imagen_url: '',
    caracteristicas: '',
    destacado: false,
    stock: 0
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Cargar datos del producto si está editando
  useEffect(() => {
    if (productoEditando) {
      // Procesar características
      const caracteristicasText = (() => {
        if (Array.isArray(productoEditando.caracteristicas) && productoEditando.caracteristicas.length > 0) {
          return productoEditando.caracteristicas.join('\n')
        }
        if (typeof productoEditando.caracteristicas === 'string' && productoEditando.caracteristicas.trim()) {
          return productoEditando.caracteristicas
        }
        if (typeof productoEditando.descripcion === 'string' && productoEditando.descripcion.trim()) {
          return productoEditando.descripcion
        }
        return ''
      })()
      
      setFormProducto({
        nombre: productoEditando.nombre || '',
        marca: productoEditando.marca || '',
        categoria: productoEditando.categoria || '',
        precio_normal: productoEditando.precio_normal || 0,
        precio_oferta: productoEditando.precio_oferta || 0,
        imagen_url: productoEditando.imagen_url || '',
        caracteristicas: caracteristicasText,
        destacado: productoEditando.destacado || false,
        stock: productoEditando.stock || 0
      })
    } else {
      // Limpiar formulario para nuevo producto
      setFormProducto({
        nombre: '',
        marca: '',
        categoria: '',
        precio_normal: 0,
        precio_oferta: 0,
        imagen_url: '',
        caracteristicas: '',
        destacado: false,
        stock: 0
      })
    }
    setErrors({})
  }, [productoEditando])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px'
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = 'unset'
    }
  }, [])

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    if (!formProducto.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

    if (!formProducto.marca?.trim()) {
      newErrors.marca = 'La marca es obligatoria'
    }

    if (!formProducto.categoria?.trim()) {
      newErrors.categoria = 'La categoría es obligatoria'
    }

    if (!formProducto.imagen_url?.trim()) {
      newErrors.imagen_url = 'La URL de imagen es obligatoria'
    }

    // Validar precios
    const precio_normal = Number(formProducto.precio_normal) || 0
    const precio_oferta = Number(formProducto.precio_oferta) || 0

    if (precio_normal <= 0) {
      newErrors.precio_normal = 'El precio normal debe ser mayor a 0'
    }

    if (precio_oferta > precio_normal) {
      newErrors.precio_oferta = 'El precio con descuento no puede ser mayor al precio normal'
    }

    // Validar stock
    const stock = Number(formProducto.stock) || 0
    if (stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar cambios en los campos
  const handleInputChange = (field, value) => {
    setFormProducto(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo modificado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Procesar características: convertir texto a array
      const caracteristicasArray = formProducto.caracteristicas
        ? formProducto.caracteristicas
            .split('\n')
            .map(feature => feature.trim())
            .filter(feature => feature.length > 0)
        : []

      // Preparar datos para el backend
      const productoParaBackend = {
        nombre: formProducto.nombre.trim(),
        marca: formProducto.marca.trim(),
        categoria: formProducto.categoria,
        precio_normal: Number(formProducto.precio_normal),
        precio_oferta: Number(formProducto.precio_oferta),
        imagen_url: formProducto.imagen_url.trim(),
        caracteristicas: caracteristicasArray,
        descripcion: '',
        descuento: formProducto.precio_oferta > 0
          ? Math.round(((formProducto.precio_normal - formProducto.precio_oferta) / formProducto.precio_normal) * 100)
          : 0,
        envio: 'Envío estándar',
        stock: Number(formProducto.stock),
        en_stock: Number(formProducto.stock) > 0 ? 1 : 0,
        destacado: formProducto.destacado
      }

      console.log('🟢 Enviando al backend:', productoParaBackend)
      
      // Llamar a la función onGuardar pasada como prop
      await onGuardar(productoParaBackend)
      
    } catch (error) {
      console.error('Error al procesar formulario:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Manejar clic en el overlay para cerrar el modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCerrar()
    }
  }

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
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ProductFormFields
              formData={formProducto}
              onChange={handleInputChange}
              errors={errors}
            />

            <CategoryManager
              selectedCategory={formProducto.categoria}
              onCategoryChange={(categoria) => handleInputChange('categoria', categoria)}
              error={errors.categoria}
            />

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCerrar}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : (productoEditando ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ProductForm
