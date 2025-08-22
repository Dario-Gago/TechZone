import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus } from 'lucide-react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

const ProductForm = ({ productoEditando, onGuardar, onCerrar }) => {
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    precio_normal: 0,
    precio_oferta: 0,
    imagen_url: '',
    caracteristicas: '',  // Cambiar a string en lugar de array
    destacado: false,
    stock: 0
  })

  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [mostrandoNuevaCategoria, setMostrandoNuevaCategoria] = useState(false)

  // Función para convertir slug a nombre legible
  const formatearNombreCategoria = (slug) => {
    if (!slug) return ''
    
    // Mapeo de slugs a nombres legibles
    const nombresCategorias = {
      'gaming-streaming': 'Gaming & Streaming',
      'computacion': 'Computación',
      'componentes': 'Componentes',
      'conectividad-redes': 'Conectividad & Redes',
      'hogar-oficina': 'Hogar & Oficina',
      'audio-video': 'Audio & Video',
      'otras-categorias': 'Otras Categorías'
    }
    
    // Si existe en el mapeo, usar el nombre legible
    if (nombresCategorias[slug]) {
      return nombresCategorias[slug]
    }
    
    // Si no está en el mapeo, formatear automáticamente
    return slug
      .split('-')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ')
  }

  // Función para convertir nombre legible a slug
  const convertirASlug = (nombre) => {
    if (!nombre) return ''
    
    // Mapeo inverso de nombres legibles a slugs
    const slugsCategorias = {
      'Gaming & Streaming': 'gaming-streaming',
      'Computación': 'computacion',
      'Componentes': 'componentes',
      'Conectividad & Redes': 'conectividad-redes',
      'Hogar & Oficina': 'hogar-oficina',
      'Audio & Video': 'audio-video',
      'Otras Categorías': 'otras-categorias'
    }
    
    // Si existe en el mapeo, usar el slug
    if (slugsCategorias[nombre]) {
      return slugsCategorias[nombre]
    }
    
    // Si no está en el mapeo, convertir automáticamente
    return nombre
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/&/g, '') // Remover ampersands
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim('-') // Remover guiones al inicio y final
  }

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CATEGORIAS)
        
        const categoriasData = response.data)
        
        setCategorias(categoriasData)
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error)
        console.error('❌ Response data:', error.response?.data)
      }
    }
    cargarCategorias()
  }, [])

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
    if (productoEditando) {)
      
      // ✅ Usar directamente los datos del backend en español
      const caracteristicasText = (() => {
        // Usar características del backend
        if (Array.isArray(productoEditando.caracteristicas) && productoEditando.caracteristicas.length > 0) {
          return productoEditando.caracteristicas.join('\n')
        }
        if (typeof productoEditando.caracteristicas === 'string' && productoEditando.caracteristicas.trim()) {
          return productoEditando.caracteristicas
        }
        // Si no hay características específicas, usar la descripción como base
        if (typeof productoEditando.descripcion === 'string' && productoEditando.descripcion.trim()) {
          return productoEditando.descripcion
        }
        return ''
      })()
      
      const nuevoEstado = {
        nombre: productoEditando.nombre || '',
        marca: productoEditando.marca || '',
        categoria: productoEditando.categoria || '', // Mantener el slug como valor
        precio_normal: productoEditando.precio_normal || 0,
        precio_oferta: productoEditando.precio_oferta || 0,
        imagen_url: productoEditando.imagen_url || '',
        caracteristicas: caracteristicasText,
        destacado: productoEditando.destacado || false,
        stock: productoEditando.stock || 0
      }
      setFormProducto(nuevoEstado)
    } else {
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
  }, [productoEditando])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ Normalizar todos los campos a string antes de usar trim()
    const nombre = String(formProducto.nombre || '').trim()
    const marca = String(formProducto.marca || '').trim()
    const categoria = String(formProducto.categoria || '').trim()
    const imagen_url = String(formProducto.imagen_url || '').trim()

    // ✅ Validación modificada para manejar nuevas categorías
    if (!nombre || !marca || !imagen_url) {
      alert(
        'Por favor completa todos los campos requeridos (Nombre, Marca e Imagen)'
      )
      return
    }

    // ✅ Validar categoría solo si no se está creando una nueva
    if (!mostrandoNuevaCategoria && !categoria) {
      alert('Por favor selecciona una categoría o crea una nueva')
      return
    }

    // ✅ Si se está mostrando nueva categoría, validar que tenga nombre
    if (mostrandoNuevaCategoria && !nuevaCategoria.trim()) {
      alert('Por favor ingresa el nombre de la nueva categoría')
      return
    }

    // Validar precios
    const precio_normal = Number(formProducto.precio_normal) || 0
    const precio_oferta = Number(formProducto.precio_oferta) || 0

    if (precio_normal <= 0) {
      alert('El precio original debe ser mayor a 0')
      return
    }

    if (precio_oferta > precio_normal) {
      alert('El precio con descuento no puede ser mayor al precio original')
      return
    }

    // Validar stock
    const stock = Number(formProducto.stock) || 0

    if (stock < 0) {
      alert('El stock no puede ser negativo')
      return
    }

    // ✅ Manejar creación de nueva categoría si es necesario
    let categoriaFinal = categoria
    
    if (mostrandoNuevaCategoria && nuevaCategoria.trim()) {
      try {
        // Crear la nueva categoría primero
        const slugCategoria = convertirASlug(nuevaCategoria.trim())
        
        const response = await axios.post(API_ENDPOINTS.CATEGORIAS, {
          nombre: slugCategoria
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        const nuevaCategoriaCreada = response.data
        categoriaFinal = nuevaCategoriaCreada.nombre // Usar el slug de la nueva categoría
        
        // Agregar la nueva categoría a la lista para futuros usos
        setCategorias(prev => [...prev, nuevaCategoriaCreada])
      } catch (error) {
        console.error('❌ Error al crear categoría:', error)
        alert(`Error al crear categoría: ${error.response?.data?.message || error.message}`)
        return
      }
    }

    // ✅ Procesar características: convertir texto a array
    const caracteristicasArray = formProducto.caracteristicas
      ? formProducto.caracteristicas
          .split('\n') // Dividir por saltos de línea
          .map(feature => feature.trim()) // Eliminar espacios extra
          .filter(feature => feature.length > 0) // Eliminar líneas vacías
      : []

    const productoParaBackend = {
      // Usar directamente los nombres del backend
      nombre: nombre,
      marca: marca,
      categoria: categoriaFinal, // Usar la categoría final (existente o recién creada)
      precio_normal: precio_normal,
      precio_oferta: precio_oferta,
      imagen_url: imagen_url,
      caracteristicas: caracteristicasArray, // Usar el array procesado

      // Campos adicionales con valores por defecto
      descripcion: '',
      descuento:
        precio_oferta > 0
          ? Math.round(((precio_normal - precio_oferta) / precio_normal) * 100)
          : 0,
      subcategoria: '',
      envio: 'Envío estándar',
      stock: stock, // ✅ Usar el valor ingresado
      en_stock: stock > 0 ? 1 : 0, // ✅ Automático basado en stock
      destacado: formProducto.destacado // ✅ Usar el valor seleccionado
    }
    
    // Limpiar el estado de nueva categoría después de usar
    if (mostrandoNuevaCategoria) {
      setNuevaCategoria('')
      setMostrandoNuevaCategoria(false)
    }
    
    onGuardar(productoParaBackend)
  }

  // Función para crear nueva categoría (opcional, para crear sin producto)
  const crearNuevaCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      alert('Por favor ingresa un nombre para la categoría')
      return
    }

    try {
      // Convertir el nombre legible a slug para enviar al backend
      const slugCategoria = convertirASlug(nuevaCategoria.trim())
      
      const response = await axios.post(API_ENDPOINTS.CATEGORIAS, {
        nombre: slugCategoria // Enviar como slug
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const nuevaCategoriaCreada = response.data
      
      // Agregar la nueva categoría a la lista
      setCategorias(prev => [...prev, nuevaCategoriaCreada])
      
      // Seleccionar automáticamente la nueva categoría (usando el slug)
      setFormProducto(prev => ({
        ...prev,
        categoria: nuevaCategoriaCreada.nombre // Esto será el slug
      }))
      
      // Limpiar y ocultar el formulario de nueva categoría
      setNuevaCategoria('')
      setMostrandoNuevaCategoria(false)
        
      alert('Categoría creada exitosamente')
    } catch (error) {
      console.error('Error al crear categoría:', error)
      alert(`Error al crear categoría: ${error.response?.data?.message || error.message}`)
    }
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
            <div className="space-y-2">
              <select
                value={formProducto.categoria}
                onChange={(e) => {
                  if (e.target.value === 'nueva') {
                    setMostrandoNuevaCategoria(true)
                    setFormProducto(prev => ({ ...prev, categoria: '' }))
                  } else {
                    setFormProducto(prev => ({ ...prev, categoria: e.target.value }))
                    setMostrandoNuevaCategoria(false)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                {(() => {
                  return categorias.map((cat) => {
                    const nombreLegible = formatearNombreCategoria(cat.nombre)
                    return (
                      <option key={cat.categoria_id} value={cat.nombre}>
                        {nombreLegible}
                      </option>
                    )
                  })
                })()}
                <option value="nueva">+ Agregar nueva categoría</option>
              </select>

              {mostrandoNuevaCategoria && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Nombre de la nueva categoría"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        crearNuevaCategoria()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={crearNuevaCategoria}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrandoNuevaCategoria(false)
                      setNuevaCategoria('')
                    }}
                    className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Normal *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formProducto.precio_normal}
              onChange={(e) =>
                handleInputChange(
                  'precio_normal',
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio con Oferta
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formProducto.precio_oferta}
              onChange={(e) =>
                handleInputChange(
                  'precio_oferta',
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional - dejar en 0 si no hay oferta"
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
              value={formProducto.imagen_url}
              onChange={(e) => handleInputChange('imagen_url', e.target.value)}
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
              onFocus={() =>}
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
