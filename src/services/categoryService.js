import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const categoryService = {
  // Obtener todas las categorías
  async getAllCategories() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIAS)
      return response.data
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.response?.data?.message || error.message}`)
    }
  },

  // Obtener categoría por ID
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIA_BY_ID(id))
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada')
      }
      throw new Error(`Error al obtener categoría: ${error.response?.data?.message || error.message}`)
    }
  },

  // Crear nueva categoría
  async createCategory(nombre) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIAS, { nombre })
      return response.data
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.response?.data?.message || error.message}`)
    }
  },

  // Actualizar categoría
  async updateCategory(id, nombre, activo = true) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CATEGORIA_BY_ID(id), { nombre, activo })
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada')
      }
      throw new Error(`Error al actualizar categoría: ${error.response?.data?.message || error.message}`)
    }
  },

  // Eliminar categoría
  async deleteCategory(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CATEGORIA_BY_ID(id))
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada')
      }
      throw new Error(`Error al eliminar categoría: ${error.response?.data?.message || error.message}`)
    }
  }
}
