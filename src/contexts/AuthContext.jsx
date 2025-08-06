// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'
    if (storedToken) {
      setToken(storedToken)
      setIsAdmin(storedIsAdmin)
    }
  }, [])

  const login = (newToken, admin = false) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('isAdmin', admin)
    setToken(newToken)
    setIsAdmin(admin)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    setToken(null)
    setIsAdmin(false)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}
