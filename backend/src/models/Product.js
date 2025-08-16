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
    destacado: product.destacado || false // ✅ CORREGIDO: usar 'destacado' en lugar de 'featured'
  }
}

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY precio_descuento ASC'
    )
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

// ✅ CREAR PRODUCTO
export const createProduct = async (productData) => {
  try {
    console.log('🟣 === PRODUCT MODEL CREATE ===')
    console.log(
      '🟣 productData recibido:',
      JSON.stringify(productData, null, 2)
    )

    const {
      nombre, // ✅ En español
      marca, // ✅ En español
      descripcion, // ✅ En español
      precio_original, // ✅ En español
      precio_descuento, // ✅ En español
      descuento, // ✅ En español
      imagen, // ✅ En español
      categoria, // ✅ En español
      subcategoria, // ✅ En español
      stock, // ✅ Ya está bien
      en_stock, // ✅ En español
      destacado, // ✅ En español
      envio, // ✅ En español
      caracteristicas // ✅ En español
    } = productData

    console.log('🟣 Campos extraídos:')
    console.log('  - nombre:', nombre, '(tipo:', typeof nombre, ')')
    console.log('  - marca:', marca, '(tipo:', typeof marca, ')')
    console.log('  - destacado:', destacado, '(tipo:', typeof destacado, ')') // ✅ Log del campo destacado
    console.log(
      '  - precio_original:',
      precio_original,
      '(tipo:',
      typeof precio_original,
      ')'
    )

    // ✅ VALIDACIÓN
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error(
        `Nombre inválido: recibido ${nombre} (tipo: ${typeof nombre})`
      )
    }

    if (!precio_original || Number(precio_original) <= 0) {
      throw new Error(`Precio original inválido: recibido ${precio_original}`)
    }

    console.log('✅ Validaciones pasadas en modelo')
    console.log(
      '🟣 Valor final de destacado antes de insertar:',
      Boolean(destacado)
    )

    const result = await pool.query(
      `INSERT INTO productos
       (nombre, marca, descripcion, precio_original, precio_descuento,
        descuento, imagen, caracteristicas, categoria, subcategoria, envio, en_stock, stock, destacado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        nombre, // $1
        marca || '', // $2
        descripcion || '', // $3
        Number(precio_original), // $4
        Number(precio_descuento) || 0, // $5
        Number(descuento) || 0, // $6
        imagen || '', // $7
        caracteristicas ? JSON.stringify(caracteristicas) : null, // $8
        categoria || '', // $9
        subcategoria || '', // $10
        envio || 'Envío estándar', // $11
        Number(en_stock) || 1, // $12
        Number(stock) || 0, // $13
        Boolean(destacado) // $14 ✅ CORREGIDO: Asegurar conversión a boolean
      ]
    )

    console.log('✅ Producto creado exitosamente:', result.rows[0])
    console.log('✅ Campo destacado en BD:', result.rows[0].destacado)
    return formatProduct(result.rows[0])
  } catch (error) {
    console.error('❌ Error en createProduct:', error)
    throw new Error('Error al crear producto: ' + error.message)
  }
}

// ✅ ACTUALIZAR PRODUCTO
export const updateProduct = async (id, productData) => {
  try {
    console.log('🟡 === PRODUCT MODEL UPDATE ===')
    console.log('🟡 ID:', id)
    console.log('🟡 productData:', JSON.stringify(productData, null, 2))

    // ✅ CORRECCIÓN: Mapear correctamente el campo destacado
    const {
      // Usar nombres en español (que es lo que envía el frontend)
      nombre,
      marca,
      descripcion,
      precio_original,
      precio_descuento,
      descuento,
      imagen,
      categoria,
      subcategoria,
      stock,
      en_stock,
      destacado, // ✅ CORREGIDO: usar 'destacado' directamente
      envio,
      caracteristicas
    } = productData

    console.log(
      '🟡 Campo destacado recibido:',
      destacado,
      '(tipo:',
      typeof destacado,
      ')'
    )

    const result = await pool.query(
      `UPDATE productos
       SET nombre = $1, marca = $2, descripcion = $3, precio_original = $4,
           precio_descuento = $5, descuento = $6, imagen = $7, caracteristicas = $8,
           categoria = $9, subcategoria = $10, envio = $11, en_stock = $12,
           stock = $13, destacado = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        nombre,
        marca || '',
        descripcion || '',
        Number(precio_original) || 0,
        Number(precio_descuento) || 0,
        Number(descuento) || 0,
        imagen || '',
        caracteristicas ? JSON.stringify(caracteristicas) : null,
        categoria || '',
        subcategoria || '',
        envio || 'Envío estándar',
        Number(en_stock) || 1,
        Number(stock) || 0,
        Boolean(destacado), // ✅ CORREGIDO: Asegurar conversión a boolean
        id
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    console.log('✅ Producto actualizado:', result.rows[0])
    console.log(
      '✅ Campo destacado actualizado en BD:',
      result.rows[0].destacado
    )
    return formatProduct(result.rows[0])
  } catch (error) {
    console.error('❌ Error en updateProduct:', error)
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
