import { useContext } from 'react'
import ProductContext from '../contexts/ProductContext'

// Hook personalizado para usar el contexto
export const useProductos = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductos debe ser usado dentro de un ProveedorProducto')
  }
  return context
}