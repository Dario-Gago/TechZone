/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

const ContextoAutenticacion = createContext()

export const useAutenticacion = () => useContext(ContextoAutenticacion)

export const ProveedorAutenticacion = ({ children }) => {
  const [token, setToken] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [usuario, setUsuario] = useState(null)

  // Cerrar sesión
  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    setToken(null)
    setEsAdmin(false)
    setUsuario(null)
    console.log('Sesión cerrada automáticamente - token inválido')
  }, [])

  // Revisar expiración del token
  const verificarExpiracionToken = useCallback(async () => {
    if (!token) return
    try {
      const { exp } = jwtDecode(token)
      const ahora = Date.now() / 1000
      if (exp <= ahora) {
        await Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
        cerrarSesion()
      }
    } catch (error) {
      console.error('Error verificando el token:', error)
      cerrarSesion()
    }
  }, [token, cerrarSesion])

  // Cargar datos iniciales
  useEffect(() => {
    const tokenAlmacenado = localStorage.getItem('token')
    const esAdminAlmacenado = localStorage.getItem('isAdmin') === 'true'
    const usuarioAlmacenado = localStorage.getItem('user')

    if (tokenAlmacenado) {
      setToken(tokenAlmacenado)
      setEsAdmin(esAdminAlmacenado)
      if (usuarioAlmacenado) {
        setUsuario(JSON.parse(usuarioAlmacenado))
      }
    }
  }, [])

  // Vigilar expiración cada 5s
  useEffect(() => {
    const intervalo = setInterval(() => {
      verificarExpiracionToken()
    }, 5000)
    return () => clearInterval(intervalo)
  }, [verificarExpiracionToken])

  // Iniciar sesión
  const iniciarSesion = (nuevoToken, admin = false, datosUsuario = null) => {
    localStorage.setItem('token', nuevoToken)
    localStorage.setItem('isAdmin', admin)
    setToken(nuevoToken)
    setEsAdmin(admin)

    if (datosUsuario) {
      localStorage.setItem('user', JSON.stringify(datosUsuario))
      setUsuario(datosUsuario)
    }
  }

  const estaAutenticado = !!token

  return (
    <ContextoAutenticacion.Provider
      value={{
        token,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado,
        esAdmin,
        usuario
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  )
}

// Exportaciones
export const AuthContext = ContextoAutenticacion
export const useAuth = useAutenticacion
export const AuthProvider = ProveedorAutenticacion
