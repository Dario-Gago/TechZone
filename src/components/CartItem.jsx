import React from 'react'

const CartItem = ({ item, alCambiarCantidad, alEliminar, formatearPrecio }) => {
  const handleQuantityChange = (e) => {
    const quantity = Math.max(1, Math.min(99, parseInt(e.target.value) || 1))
    alCambiarCantidad(item.id, quantity)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-16 h-16 aspect-square bg-white rounded-lg overflow-hidden border flex items-center justify-center p-1">
            <img 
              src={item.imagen_url || 'https://via.placeholder.com/80x80?text=Sin+Imagen'} 
              alt={item.nombre}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-base">{item.nombre}</h4>
            <p className="text-sm text-gray-500 mt-1">{item.marca || 'Producto TechZone'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => alEliminar(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Eliminar del carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Cantidad:</label>
          <input
            type="number"
            min="1"
            max="99"
            value={item.cantidadCarrito || item.quantity || 1}
            onChange={handleQuantityChange}
            className="w-20 px-3 py-1 border border-gray-300 rounded text-sm text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="text-right">
          {item.precio_normal && item.precio_oferta && item.precio_oferta < item.precio_normal ? (
            <div className="flex items-center space-x-2">
              <span className="line-through text-gray-400 text-sm">{formatearPrecio(item.precio_normal)}</span>
              <span className="font-semibold text-gray-900">{formatearPrecio(item.precio_oferta)}</span>
            </div>
          ) : (
            <span className="font-semibold text-gray-900">
              {formatearPrecio(item.precio_oferta || item.precio_normal || item.precioFinal || 0)}
            </span>
          )}
          {item.precio_normal && item.precio_oferta && item.precio_oferta < item.precio_normal && (
            <p className="text-xs text-green-600 mt-1">
              Ahorras un {Math.round((1 - item.precio_oferta / item.precio_normal) * 100)}%
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartItem
