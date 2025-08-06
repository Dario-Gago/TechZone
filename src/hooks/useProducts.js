import { useContext } from 'react'
import ProductContext from '../contexts/ProductContext'

// Hook personalizado para usar el contexto
export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider')
  }
  return context
}
