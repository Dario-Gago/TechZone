import { useContext } from 'react'
import ContextoCarrito from '../contexts/CartContext'

export const useCarrito = () => {
  const context = useContext(ContextoCarrito)

  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un ProveedorCarrito')
  }

  return context
}
