// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      setToken(storedToken)
      setIsAdmin(storedIsAdmin)

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const login = (newToken, admin = false, userData = null) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('isAdmin', admin)
    setToken(newToken)
    setIsAdmin(admin)

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    setToken(null)
    setIsAdmin(false)
    setUser(null)
  }

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        user,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
