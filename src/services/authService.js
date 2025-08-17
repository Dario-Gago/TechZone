import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const authService = {
  // Iniciar sesión
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas')
      }
      throw new Error(`Error al iniciar sesión: ${error.response?.data?.message || error.message}`)
    }
  },

  // Registrar usuario
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData)
      return response.data
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Este email ya está registrado')
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Datos inválidos')
      }
      throw new Error(`Error al registrar usuario: ${error.response?.data?.message || error.message}`)
    }
  },

  // Obtener todos los usuarios (solo admin)
  async getAllUsers() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USUARIOS)
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción')
      }
      throw new Error(`Error al obtener usuarios: ${error.response?.data?.message || error.message}`)
    }
  },

  // Eliminar usuario (solo admin)
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USUARIO_BY_ID(userId))
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción')
      }
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado')
      }
      throw new Error(`Error al eliminar usuario: ${error.response?.data?.message || error.message}`)
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
  }
}
