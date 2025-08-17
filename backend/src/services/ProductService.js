import * as ProductModel from '../models/Product.js'

export class ProductService {
  // Obtener todos los productos con filtros
  static async getAllProducts(filters = {}) {
    try {
      return await ProductModel.getAllProducts(filters)
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`)
    }
  }

  // Obtener producto por ID
  static async getProductById(id) {
    const product = await ProductModel.getProductById(id)
    if (!product) {
      throw new Error('Producto no encontrado')
    }
    return product
  }

  // Crear nuevo producto
  static async createProduct(productData) {
    // El modelo ya maneja la lógica de marca y categoría
    return await ProductModel.createProduct(productData)
  }

  // Actualizar producto existente
  static async updateProduct(id, productData) {
    // Verificar que el producto existe
    await this.getProductById(id)
    
    // El modelo ya maneja la lógica de marca
    return await ProductModel.updateProduct(id, productData)
  }

  // Eliminar producto
  static async deleteProduct(id) {
    // Verificar que el producto existe
    await this.getProductById(id)
    
    // El modelo ya maneja todas las relaciones
    return await ProductModel.deleteProduct(id)
  }

  // Lógica de negocio específica: Obtener productos destacados
  static async getFeaturedProducts() {
    try {
      const allProducts = await this.getAllProducts()
      return allProducts.filter(product => 
        product.destacado === true && 
        product.stock > 0
      )
    } catch (error) {
      throw new Error(`Error al obtener productos destacados: ${error.message}`)
    }
  }

  // Lógica de negocio específica: Buscar productos
  static async searchProducts(query) {
    try {
      const allProducts = await this.getAllProducts()
      const searchTerm = query.toLowerCase().trim()
      
      if (!searchTerm) {
        return allProducts.filter(product => product.stock > 0)
      }
      
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
  }

  // Lógica de negocio: Verificar disponibilidad de stock
  static async checkStock(id, quantity) {
    try {
      const product = await this.getProductById(id)
      return product.stock >= quantity
    } catch (error) {
      throw new Error(`Error al verificar stock: ${error.message}`)
    }
  }

  // Lógica de negocio: Actualizar stock
  static async updateStock(id, quantity) {
    try {
      const product = await this.getProductById(id)
      const newStock = product.stock - quantity
      
      if (newStock < 0) {
        throw new Error('Stock insuficiente')
      }
      
      return await ProductModel.updateProduct(id, { stock: newStock })
    } catch (error) {
      throw error
    }
  }
}
