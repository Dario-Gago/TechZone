import * as CategoriaModel from '../models/Categoria.js'

export class CategoryService {
  // Obtener todas las categorías activas
  static async getAllCategories() {
    return await CategoriaModel.getAllCategorias()
  }

  // Obtener categoría por ID
  static async getCategoryById(id) {
    const categoria = await CategoriaModel.getCategoriaById(id)
    if (!categoria) {
      throw new Error('Categoría no encontrada')
    }
    return categoria
  }

  // Crear nueva categoría
  static async createCategory(nombre) {
    // Validaciones de negocio
    this._validateCategoryName(nombre)
    
    // Verificar que no existe una categoría con el mismo nombre
    const existingCategory = await CategoriaModel.getCategoriaByName(nombre)
    if (existingCategory) {
      throw new Error('Ya existe una categoría con ese nombre')
    }
    
    return await CategoriaModel.createCategoria(nombre)
  }

  // Actualizar categoría
  static async updateCategory(id, nombre, activo = true) {
    // Verificar que existe
    await this.getCategoryById(id)
    
    // Validaciones de negocio
    this._validateCategoryName(nombre)
    
    return await CategoriaModel.updateCategoria(id, nombre, activo)
  }

  // Eliminar categoría (soft delete)
  static async deleteCategory(id) {
    // Verificar que existe
    await this.getCategoryById(id)
    
    return await CategoriaModel.deleteCategoria(id)
  }

  // Asignar categoría a producto
  static async assignToProduct(productId, categoryId) {
    // Verificar que la categoría existe
    await this.getCategoryById(categoryId)
    
    return await CategoriaModel.assignCategoriaToProduct(productId, categoryId)
  }

  // Remover categoría de producto
  static async removeFromProduct(productId, categoryId) {
    return await CategoriaModel.removeCategoriaFromProduct(productId, categoryId)
  }

  // Obtener categorías de un producto
  static async getCategoriesOfProduct(productId) {
    return await CategoriaModel.getCategoriasOfProduct(productId)
  }

  // Validación privada del nombre de categoría
  static _validateCategoryName(nombre) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error('El nombre de la categoría es obligatorio')
    }
    
    if (nombre.length > 100) {
      throw new Error('El nombre de la categoría no puede exceder 100 caracteres')
    }
  }
}
