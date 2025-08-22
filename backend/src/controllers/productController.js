import { ProductService } from '../services/ProductService.js'

export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const product = await ProductService.getProductById(id)
    res.json(product)
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'El producto solicitado no existe'
      })
    }
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const createProductController = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    console.error('❌ Error en createProductController:', error)
    res.status(400).json({
      error: 'Error al crear producto',
      message: error.message
    })
  }
}

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params
    const updatedProduct = await ProductService.updateProduct(id, req.body)
    res.json(updatedProduct)
  } catch (error) {
    console.error('❌ Error en updateProductController:', error)
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'El producto solicitado no existe'
      })
    }
    res.status(400).json({
      error: 'Error al actualizar producto',
      message: error.message
    })
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await ProductService.deleteProduct(id)
    res.json({
      message: 'Producto eliminado exitosamente',
      deletedProduct
    })
  } catch (error) {
    console.error('❌ Error en deleteProductController:', error)
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'El producto solicitado no existe'
      })
    }
    res.status(500).json({
      error: 'Error al eliminar producto',
      message: error.message
    })
  }
}
