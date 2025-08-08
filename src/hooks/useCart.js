import { useContext } from 'react'
import CartContext from '../contexts/CartContext'

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un ProveedorCarrito')
  }
  return context
}

// Mantener exportación original para compatibilidad
export const useCart = useCarrito
