// src/hooks/useSales.js
import { useContext } from 'react'
import { SalesContext } from '../contexts/SalesContext'

// Hook para usar en componentes
export const useSales = () => {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSales debe ser usado dentro de SalesProvider')
  }
  return context
}
