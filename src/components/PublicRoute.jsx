// components/RutaPublica.jsx
import { Navigate } from 'react-router-dom'
import { useAutenticacion } from '../contexts/AuthContext'

const RutaPublica = ({ children }) => {
  const { estaAutenticado } = useAutenticacion()

  if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Exportación con compatibilidad
export default RutaPublica
export const PublicRoute = RutaPublica
