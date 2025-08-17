import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const productService = {
  // Obtener todos los productos
  async getAllProducts() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTOS)
      return response.data
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.response?.data?.message || error.message}`)
    }
  },

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTO_BY_ID(id))
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      throw new Error(`Error al obtener producto: ${error.response?.data?.message || error.message}`)
    }
  },

  // Crear nuevo producto
  async createProduct(productData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTOS, productData)
      return response.data
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.response?.data?.message || error.message}`)
    }
  },

  // Actualizar producto
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCTO_BY_ID(id), productData)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      throw new Error(`Error al actualizar producto: ${error.response?.data?.message || error.message}`)
    }
  },

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PRODUCTO_BY_ID(id))
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado')
      }
      throw new Error(`Error al eliminar producto: ${error.response?.data?.message || error.message}`)
    }
  },

  // Buscar productos
  async searchProducts(query) {
    try {
      const allProducts = await this.getAllProducts()
      const searchTerm = query.toLowerCase().trim()
      
      return allProducts.filter(product => {
        const matchesName = product.nombre?.toLowerCase().includes(searchTerm)
        const matchesBrand = product.marca?.toLowerCase().includes(searchTerm)
        const matchesCategory = product.categoria?.toLowerCase().includes(searchTerm)
        const matchesDescription = product.descripcion?.toLowerCase().includes(searchTerm)
        
        return product.stock > 0 && (matchesName || matchesBrand || matchesCategory || matchesDescription)
      })
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`)
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts() {
    try {
      const allProducts = await this.getAllProducts()
      return allProducts.filter(product => product.destacado === true && product.stock > 0)
    } catch (error) {
      throw new Error(`Error al obtener productos destacados: ${error.message}`)
    }
  },

  // Obtener productos por categoría
  async getProductsByCategory(categorySlug) {
    try {
      const allProducts = await this.getAllProducts()
      return allProducts.filter(product => 
        product.categoria?.toLowerCase() === categorySlug.toLowerCase() && product.stock > 0
      )
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`)
    }
  }
}
