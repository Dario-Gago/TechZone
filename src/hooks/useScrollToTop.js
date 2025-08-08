import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook personalizado que hace scroll al inicio de la página 
 * cada vez que cambia la ruta
 */
export const useDesplazarHaciaArriba = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Scroll suave en lugar de instantáneo
    })
  }, [pathname])
}

export default useDesplazarHaciaArriba
// Compatibilidad hacia atrás
export { useDesplazarHaciaArriba as useScrollToTop }
