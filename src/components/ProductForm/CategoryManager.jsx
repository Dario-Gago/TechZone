import React, { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { categoryService } from '../../services/categoryService'

const CategoryManager = ({ selectedCategory, onCategoryChange, error }) => {
  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [mostrandoNuevaCategoria, setMostrandoNuevaCategoria] = useState(false)
  const [loading, setLoading] = useState(false)

  // Función para formatear nombre de categoría
  const formatearNombreCategoria = (slug) => {
    if (!slug) return ''
    
    const nombresCategorias = {
      'gaming-streaming': 'Gaming & Streaming',
      'computacion': 'Computación',
      'componentes': 'Componentes',
      'conectividad-redes': 'Conectividad & Redes',
      'hogar-oficina': 'Hogar & Oficina',
      'audio-video': 'Audio & Video',
      'otras-categorias': 'Otras Categorías'
    }
    
    return nombresCategorias[slug] || slug
      .split('-')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ')
  }

  // Función para convertir a slug
  const convertirASlug = (nombre) => {
    if (!nombre) return ''
    
    const slugsCategorias = {
      'Gaming & Streaming': 'gaming-streaming',
      'Computación': 'computacion',
      'Componentes': 'componentes',
      'Conectividad & Redes': 'conectividad-redes',
      'Hogar & Oficina': 'hogar-oficina',
      'Audio & Video': 'audio-video',
      'Otras Categorías': 'otras-categorias'
    }
    
    return slugsCategorias[nombre] || nombre
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/&/g, '')
      .replace(/-+/g, '-')
      .trim('-')
  }

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true)
        const categoriasData = await categoryService.getAllCategories()
        setCategorias(categoriasData)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarCategorias()
  }, [])

  // Crear nueva categoría
  const crearNuevaCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      alert('Por favor ingresa un nombre para la categoría')
      return
    }

    try {
      setLoading(true)
      const slugCategoria = convertirASlug(nuevaCategoria.trim())
      const nuevaCategoriaCreada = await categoryService.createCategory(slugCategoria)
      
      // Agregar a la lista local
      setCategorias(prev => [...prev, nuevaCategoriaCreada])
      
      // Seleccionar automáticamente
      onCategoryChange(nuevaCategoriaCreada.nombre)
      
      // Limpiar estado
      setNuevaCategoria('')
      setMostrandoNuevaCategoria(false)
      
      alert('Categoría creada exitosamente')
    } catch (error) {
      console.error('Error al crear categoría:', error)
      alert(`Error al crear categoría: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    if (value === 'nueva') {
      setMostrandoNuevaCategoria(true)
      onCategoryChange('')
    } else {
      onCategoryChange(value)
      setMostrandoNuevaCategoria(false)
    }
  }

  const cancelarNuevaCategoria = () => {
    setMostrandoNuevaCategoria(false)
    setNuevaCategoria('')
  }

  if (loading && categorias.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
          Cargando categorías...
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categoría *
      </label>
      <div className="space-y-2">
        <select
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          required
          disabled={loading}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => {
            const nombreLegible = formatearNombreCategoria(cat.nombre)
            return (
              <option key={cat.categoria_id} value={cat.nombre}>
                {nombreLegible}
              </option>
            )
          })}
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
              disabled={loading}
            />
            <button
              type="button"
              onClick={crearNuevaCategoria}
              disabled={loading}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={cancelarNuevaCategoria}
              disabled={loading}
              className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </div>
  )
}

export default CategoryManager
