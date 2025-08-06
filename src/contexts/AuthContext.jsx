import React, { createContext, useContext, useState, useEffect } from 'react'

// Crear el contexto
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext)

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  // Revisar si hay token en localStorage al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  // Función para loguearse
  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  // Función para desloguearse
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  // Saber si el usuario está autenticado
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
