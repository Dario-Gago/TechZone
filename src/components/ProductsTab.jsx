import React, { useState, useContext } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import ProductForm from './ProductForm'
import { ProductContext } from '../contexts/ProductContext' // Asegúrate de que la ruta sea correcta

const ProductsTab = () => {
  const {
    productos,
    formatearPrecio,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    error,
    setError
  } = useContext(ProductContext)

  const [mostrarFormProducto, setMostrarFormProducto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [cargando, setCargando] = useState(false)

  const abrirAgregar = () => {
    setProductoEditando(null)
    setMostrarFormProducto(true)
    if (setError) setError(null) // Limpiar errores previos
  }

  const abrirEditar = (producto) => {
    setProductoEditando(producto)
    setMostrarFormProducto(true)
    if (setError) setError(null) // Limpiar errores previos
  }

  const handleGuardarProducto = async (formProducto) => {
    console.log('=== HANDLE GUARDAR PRODUCTO ===')
    console.log('productoEditando:', productoEditando)
    console.log('formProducto recibido:', formProducto)

    setCargando(true)
    try {
      let resultado

      if (productoEditando) {
        console.log('Editando producto ID:', productoEditando.id)
        console.log('Datos a enviar:', JSON.stringify(formProducto, null, 2))
        resultado = await editarProducto(productoEditando.id, formProducto)
      } else {
        console.log('Agregando nuevo producto:', formProducto)
        resultado = await agregarProducto(formProducto)
      }

      if (resultado && resultado.success) {
        setMostrarFormProducto(false)
        setProductoEditando(null)
        console.log('✅ Producto guardado exitosamente')

        // Recargar la página después de guardar exitosamente
        window.location.reload()
      } else {
        console.error('❌ Error al guardar producto:', resultado?.error)
      }
    } catch (error) {
      console.error('❌ Error en handleGuardarProducto:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleEliminarProducto = async (id) => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este producto?')
    ) {
      setCargando(true)
      try {
        const resultado = await eliminarProducto(id)
        if (resultado && resultado.success) {
          console.log('Producto eliminado exitosamente')
          // También recargar después de eliminar si lo deseas
          window.location.reload()
        } else {
          console.error('Error al eliminar producto:', resultado?.error)
        }
      } catch (error) {
        console.error('Error en handleEliminarProducto:', error)
      } finally {
        setCargando(false)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Gestión de Productos ({productos.length})
        </h3>
        <button
          onClick={abrirAgregar}
          disabled={cargando}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {cargando && (
        <div className="text-center py-4">
          <p className="text-gray-600">Procesando...</p>
        </div>
      )}

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
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/150x150?text=No+Image'
                }}
              />
            </div>
            <h4 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
              {producto.name}
            </h4>
            <p className="text-xs text-gray-500 mb-2">{producto.brand}</p>
            <p className="font-bold text-green-600 text-sm mb-2">
              {formatearPrecio(
                producto.discountPrice || producto.originalPrice
              )}
            </p>
            <div className="flex space-x-1">
              <button
                onClick={() => abrirEditar(producto)}
                disabled={cargando}
                className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleEliminarProducto(producto.id)}
                disabled={cargando}
                className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && !cargando && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      )}

      {mostrarFormProducto && (
        <ProductForm
          productoEditando={productoEditando}
          onGuardar={handleGuardarProducto}
          onCerrar={() => {
            setMostrarFormProducto(false)
            setProductoEditando(null)
          }}
          cargando={cargando}
        />
      )}
    </>
  )
}

export default ProductsTab
