import React from 'react'
import { useDesplazarHaciaArriba } from '../hooks/useScrollToTop'

/**
 * Componente que maneja el scroll automático al inicio 
 * cuando cambia la ruta
 */
const DesplazarHaciaArriba = ({ children }) => {
  useDesplazarHaciaArriba()
  return children
}

export default DesplazarHaciaArriba

// Compatibilidad hacia atrás - exportación nombrada del mismo componente
export const ScrollToTop = DesplazarHaciaArriba
