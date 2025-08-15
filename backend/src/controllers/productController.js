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
    console.log('🟢 === CREATE PRODUCT CONTROLLER ===')
    console.log('🟢 Headers recibidos:', req.headers)
    console.log('🟢 Body RAW recibido:', JSON.stringify(req.body, null, 2))
    console.log('🟢 Tipo de req.body:', typeof req.body)
    console.log('🟢 ¿Es array?:', Array.isArray(req.body))
    console.log('🟢 ¿Es null?:', req.body === null)
    console.log('🟢 ¿Es undefined?:', req.body === undefined)

    // Verificar si el body está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ Body vacío o undefined')
      return res.status(400).json({
        error: 'Datos requeridos',
        message: 'No se recibieron datos del producto'
      })
    }

    // Log detallado de cada campo
    console.log('🔍 Análisis de campos recibidos:')
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key]
      console.log(
        `  - ${key}: ${JSON.stringify(value)} (tipo: ${typeof value})`
      )
    })

    // Validación específica del campo nombre
    if (!req.body.nombre) {
      console.log('❌ Campo "nombre" no existe en req.body')
      console.log('❌ Campos disponibles:', Object.keys(req.body))
      return res.status(400).json({
        error: 'Campo requerido faltante',
        message: 'El campo "nombre" es obligatorio',
        receivedFields: Object.keys(req.body)
      })
    }

    if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
      console.log('❌ Campo "nombre" no es válido:', req.body.nombre)
      return res.status(400).json({
        error: 'Campo inválido',
        message: 'El campo "nombre" debe ser un texto válido y no estar vacío'
      })
    }

    // Validación del precio_original
    if (!req.body.precio_original || Number(req.body.precio_original) <= 0) {
      console.log(
        '❌ Campo "precio_original" no es válido:',
        req.body.precio_original
      )
      return res.status(400).json({
        error: 'Campo inválido',
        message: 'El campo "precio_original" debe ser un número mayor a 0'
      })
    }

    console.log('✅ Validaciones básicas pasadas en controller')
    console.log(
      '✅ Llamando a productModel.createProduct con:',
      JSON.stringify(req.body, null, 2)
    )

    const product = await productModel.createProduct(req.body)

    console.log('✅ Producto creado exitosamente:', product)
    res.status(201).json(product)
  } catch (error) {
    console.error('❌ Error en createProductController:', error)
    console.error('❌ Error stack:', error.stack)

    res.status(400).json({
      error: 'Error al crear producto',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    console.log('🟡 === UPDATE PRODUCT CONTROLLER ===')
    console.log('🟡 ID:', req.params.id)
    console.log('🟡 Body recibido:', JSON.stringify(req.body, null, 2))

    const { id } = req.params
    const updatedProduct = await productModel.updateProduct(id, req.body)

    if (!updatedProduct) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: 'No existe un producto con el ID proporcionado'
      })
    }

    console.log('✅ Producto actualizado:', updatedProduct)
    res.json({
      message: 'Producto actualizado correctamente',
      product: updatedProduct
    })
  } catch (error) {
    console.error('❌ Error en updateProductController:', error)
    res.status(400).json({
      error: 'Error al actualizar producto',
      message: error.message
    })
  }
}
