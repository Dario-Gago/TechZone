// components/RutaPrivada.jsx
import { Navigate } from 'react-router-dom'
import { useAutenticacion } from '../contexts/AuthContext'

const RutaPrivada = ({ children }) => {
  const { estaAutenticado } = useAutenticacion()

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Exportación con compatibilidad
export default RutaPrivada
export const PrivateRoute = RutaPrivada
