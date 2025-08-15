import pool from '../../db/config.js'

// Función para formatear un producto
export const formatProduct = (product) => {
  // Parsear características si están en formato JSON
  let features = []
  if (product.caracteristicas) {
    try {
      features =
        typeof product.caracteristicas === 'string'
          ? JSON.parse(product.caracteristicas)
          : product.caracteristicas
    } catch (e) {
      features = []
    }
  }

  return {
    id: product.id,
    name: product.nombre,
    brand: product.marca,
    description: product.descripcion,
    originalPrice: parseFloat(product.precio_original),
    discountPrice: parseFloat(product.precio_descuento),
    discount: product.descuento,
    image: product.imagen,
    features: features,
    category: product.categoria,
    subcategory: product.subcategoria,
    shipping: product.envio || 'Envío estándar',
    inStock: product.en_stock || 0,
    stock: product.stock || 0,
    featured: product.destacado || false
  }
}

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id')
    return result.rows.map(formatProduct)
  } catch (error) {
    throw new Error('Error al obtener productos: ' + error.message)
  }
}

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [
      id
    ])
    if (result.rows.length === 0) {
      return null
    }
    return formatProduct(result.rows[0])
  } catch (error) {
    throw new Error('Error al obtener producto: ' + error.message)
  }
}

// Obtener productos destacados
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE destacado = true ORDER BY id LIMIT $1',
      [limit]
    )
    return result.rows.map(formatProduct)
  } catch (error) {
    throw new Error('Error al obtener productos destacados: ' + error.message)
  }
}

// Obtener productos por categoría
export const getProductsByCategory = async (category, subcategory = null) => {
  try {
    let queryText = 'SELECT * FROM productos WHERE categoria = $1'
    let params = [category]

    if (subcategory) {
      queryText += ' AND subcategoria = $2'
      params.push(subcategory)
    }

    queryText += ' ORDER BY id'

    const result = await pool.query(queryText, params)
    return result.rows.map(formatProduct)
  } catch (error) {
    throw new Error(
      'Error al obtener productos por categoría: ' + error.message
    )
  }
}

// Buscar productos
export const searchProducts = async (searchTerm) => {
  try {
    const result = await pool.query(
      `SELECT * FROM productos
       WHERE nombre ILIKE $1 OR marca ILIKE $1 OR descripcion ILIKE $1
       ORDER BY id`,
      [`%${searchTerm}%`]
    )
    return result.rows.map(formatProduct)
  } catch (error) {
    throw new Error('Error al buscar productos: ' + error.message)
  }
}

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const {
      name,
      brand,
      description,
      originalPrice,
      discountPrice,
      discount,
      image,
      features,
      category,
      subcategory,
      shipping,
      inStock,
      stock,
      featured
    } = productData

    const result = await pool.query(
      `INSERT INTO productos
       (nombre, marca, descripcion, precio_original, precio_descuento,
        descuento, imagen, caracteristicas, categoria, subcategoria, envio, en_stock, stock, destacado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        name,
        brand,
        description,
        originalPrice,
        discountPrice,
        discount,
        image,
        JSON.stringify(features),
        category,
        subcategory,
        shipping,
        inStock,
        stock,
        featured
      ]
    )

    return formatProduct(result.rows[0])
  } catch (error) {
    throw new Error('Error al crear producto: ' + error.message)
  }
}

// Actualizar un producto
export const updateProduct = async (id, productData) => {
  try {
    const {
      name,
      brand,
      description,
      originalPrice,
      discountPrice,
      discount,
      image,
      features,
      category,
      subcategory,
      shipping,
      inStock,
      stock,
      featured
    } = productData

    const result = await pool.query(
      `UPDATE productos
       SET nombre = $1, marca = $2, descripcion = $3, precio_original = $4,
           precio_descuento = $5, descuento = $6, imagen = $7, caracteristicas = $8,
           categoria = $9, subcategoria = $10, envio = $11, en_stock = $12,
           stock = $13, destacado = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        name,
        brand,
        description,
        originalPrice,
        discountPrice,
        discount,
        image,
        JSON.stringify(features),
        category,
        subcategory,
        shipping,
        inStock,
        stock,
        featured,
        id
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    return formatProduct(result.rows[0])
  } catch (error) {
    throw new Error('Error al actualizar producto: ' + error.message)
  }
}

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return formatProduct(result.rows[0])
  } catch (error) {
    throw new Error('Error al eliminar producto: ' + error.message)
  }
}

// Obtener productos con paginación
export const getProductsPaginated = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit

    // Obtener total de productos
    const countResult = await pool.query('SELECT COUNT(*) FROM productos')
    const total = parseInt(countResult.rows[0].count)

    // Obtener productos paginados
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    )

    return {
      products: result.rows.map(formatProduct),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  } catch (error) {
    throw new Error('Error al obtener productos paginados: ' + error.message)
  }
}
