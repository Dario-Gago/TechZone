/* eslint-disable react-refresh/only-export-components */
// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const ContextoAutenticacion = createContext()

export const useAutenticacion = () => useContext(ContextoAutenticacion)

export const ProveedorAutenticacion = ({ children }) => {
  const [token, setToken] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [usuario, setUsuario] = useState(null)

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

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    setToken(null)
    setEsAdmin(false)
    setUsuario(null)
  }

  const actualizarUsuario = (datosUsuario) => {
    localStorage.setItem('user', JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)
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
        usuario,
        actualizarUsuario,
        // Mantener compatibilidad con nombres en inglés
        login: iniciarSesion,
        logout: cerrarSesion,
        isAuthenticated: estaAutenticado,
        isAdmin: esAdmin,
        user: usuario,
        updateUser: actualizarUsuario
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  )
}

// Exportaciones para compatibilidad
export const AuthContext = ContextoAutenticacion
export const useAuth = useAutenticacion
export const AuthProvider = ProveedorAutenticacion
