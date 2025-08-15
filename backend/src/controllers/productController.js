import * as productModel from '../models/Product.js'

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.getAllProducts()
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
    const product = await productModel.getProductById(id)

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'El producto solicitado no existe'
      })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const getFeaturedProductsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await productModel.getFeaturedProducts(limit)
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const getProductsByCategoryController = async (req, res) => {
  try {
    const { category, subcategory } = req.params
    const products = await productModel.getProductsByCategory(
      category,
      subcategory
    )
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const searchProductsController = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Debe proporcionar un término de búsqueda'
      })
    }

    const products = await productModel.searchProducts(q)
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const createProductController = async (req, res) => {
  try {
    const product = await productModel.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({
      error: 'Error al crear producto',
      message: error.message
    })
  }
}
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params
    const product = await productModel.deleteProduct(id)

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'No existe un producto con el ID proporcionado'
      })
    }

    res.json({
      message: 'Producto eliminado correctamente',
      deletedProduct: product
    })
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar producto',
      message: error.message
    })
  }
}
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params
    const updatedProduct = await productModel.updateProduct(id, req.body)

    if (!updatedProduct) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'No existe un producto con el ID proporcionado'
      })
    }

    res.json({
      message: 'Producto actualizado correctamente',
      product: updatedProduct
    })
  } catch (error) {
    res.status(400).json({
      error: 'Error al actualizar producto',
      message: error.message
    })
  }
}
