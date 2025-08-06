import React from 'react'
import { useScrollToTop } from '../hooks/useScrollToTop'

/**
 * Componente que maneja el scroll automático al inicio 
 * cuando cambia la ruta
 */
const ScrollToTop = ({ children }) => {
  useScrollToTop()
  return children
}

export default ScrollToTop
