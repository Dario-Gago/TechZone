import pool from '../../db/config.js'

// Función para formatear un producto
export const formatProduct = (product) => {
  // Parsear características si están en formato JSON
  let caracteristicas = {}
  if (product.caracteristicas) {
    try {
      caracteristicas =
        typeof product.caracteristicas === 'string'
          ? JSON.parse(product.caracteristicas)
          : product.caracteristicas
    } catch (e) {
      console.warn('Error al parsear características:', e.message)
      caracteristicas = {}
    }
  }

  return {
    id: product.producto_id,
    nombre: product.nombre,
    marca: product.marca_nombre || '',
    descripcion: product.descripcion,
    precio_original: parseFloat(product.precio_normal),
    precio_descuento: parseFloat(product.precio_oferta),
    descuento: product.descuento,
    imagen: product.imagen_url,
    caracteristicas: caracteristicas,
    categoria: product.categoria_nombres || '',
    envio: product.envio || 'Envío estándar',
    en_stock: product.en_stock || 0,
    stock: product.stock || 0,
    destacado: product.destacado || false,
    marca_id: product.marca_id,
    disponibilidad: product.disponibilidad
  }
}

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.nombre as marca_nombre,
             STRING_AGG(c.nombre, ', ') as categoria_nombres
      FROM producto p
      LEFT JOIN marca m ON p.marca_id = m.marca_id
      LEFT JOIN producto_categoria pc ON p.producto_id = pc.producto_id
      LEFT JOIN categoria c ON pc.categoria_id = c.categoria_id AND c.activo = true
      GROUP BY p.producto_id, m.nombre
      ORDER BY p.precio_oferta ASC
    `)
    return result.rows.map(formatProduct)
  } catch (error) {
    throw new Error('Error al obtener productos: ' + error.message)
  }
}

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.nombre as marca_nombre,
             STRING_AGG(c.nombre, ', ') as categoria_nombres
      FROM producto p
      LEFT JOIN marca m ON p.marca_id = m.marca_id
      LEFT JOIN producto_categoria pc ON p.producto_id = pc.producto_id
      LEFT JOIN categoria c ON pc.categoria_id = c.categoria_id AND c.activo = true
      WHERE p.producto_id = $1
      GROUP BY p.producto_id, m.nombre
    `, [id])
    
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
    console.log('🟣 productData recibido:', JSON.stringify(productData, null, 2))

    const {
      nombre,
      descripcion,
      precio_normal, // ✅ CORREGIDO: usar precio_normal
      precio_oferta, // ✅ CORREGIDO: usar precio_oferta
      descuento,
      marca, // ✅ Aceptar marca como string
      marca_id, // ✅ También aceptar marca_id
      imagen_url, // ✅ CORREGIDO: usar imagen_url
      stock,
      disponibilidad,
      en_stock,
      destacado,
      envio,
      caracteristicas
    } = productData

    console.log('🟣 Campos extraídos:')
    console.log('  - nombre:', nombre, '(tipo:', typeof nombre, ')')
    console.log('  - marca:', marca, '(tipo:', typeof marca, ')')
    console.log('  - marca_id:', marca_id, '(tipo:', typeof marca_id, ')')
    console.log('  - destacado:', destacado, '(tipo:', typeof destacado, ')')
    console.log('  - precio_normal:', precio_normal, '(tipo:', typeof precio_normal, ')')

    // ✅ VALIDACIÓN
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      throw new Error(`Nombre inválido: recibido ${nombre} (tipo: ${typeof nombre})`)
    }

    if (!precio_normal || Number(precio_normal) <= 0) {
      throw new Error(`Precio normal inválido: recibido ${precio_normal}`)
    }

    // ✅ Resolver marca_id si solo se proporcionó el nombre de la marca
    let marcaIdFinal = marca_id
    if (!marcaIdFinal && marca) {
      console.log('🔍 Buscando marca_id para marca:', marca)
      try {
        const marcaResult = await pool.query(
          'SELECT marca_id FROM marca WHERE LOWER(nombre) = LOWER($1)',
          [marca]
        )
        if (marcaResult.rows.length > 0) {
          marcaIdFinal = marcaResult.rows[0].marca_id
          console.log('✅ Marca encontrada, marca_id:', marcaIdFinal)
        } else {
          console.log('⚠️ Marca no encontrada, creando nueva marca:', marca)
          // Crear nueva marca si no existe
          const nuevaMarcaResult = await pool.query(
            'INSERT INTO marca (nombre) VALUES ($1) RETURNING marca_id',
            [marca]
          )
          marcaIdFinal = nuevaMarcaResult.rows[0].marca_id
          console.log('✅ Nueva marca creada con ID:', marcaIdFinal)
        }
      } catch (marcaError) {
        console.warn('⚠️ Error al buscar/crear marca:', marcaError.message)
        marcaIdFinal = null
      }
    }

    console.log('✅ Validaciones pasadas en modelo')

    const result = await pool.query(
      `INSERT INTO producto
       (nombre, descripcion, precio_normal, precio_oferta, descuento, marca_id, 
        stock, disponibilidad, imagen_url, caracteristicas, envio, en_stock, destacado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        nombre, // $1
        descripcion || '', // $2
        Number(precio_normal), // $3
        Number(precio_oferta) || Number(precio_normal), // $4
        Number(descuento) || 0, // $5
        marcaIdFinal, // $6 - Usar el ID resuelto
        Number(stock) || 0, // $7
        disponibilidad || 'disponible', // $8
        imagen_url || '', // $9
        caracteristicas ? JSON.stringify(caracteristicas) : null, // $10
        envio || 'Envío estándar', // $11
        Number(en_stock) || 1, // $12
        Boolean(destacado) // $13
      ]
    )

    console.log('✅ Producto creado exitosamente:', result.rows[0])
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

    const {
      nombre,
      descripcion,
      precio_normal, // ✅ CORREGIDO: usar precio_normal
      precio_oferta, // ✅ CORREGIDO: usar precio_oferta
      descuento,
      marca, // ✅ Aceptar marca como string
      marca_id, // ✅ También aceptar marca_id
      imagen_url, // ✅ CORREGIDO: usar imagen_url
      stock,
      disponibilidad,
      en_stock,
      destacado,
      envio,
      caracteristicas
    } = productData

    console.log('🟡 Campo destacado recibido:', destacado, '(tipo:', typeof destacado, ')')

    // ✅ Resolver marca_id si solo se proporcionó el nombre de la marca
    let marcaIdFinal = marca_id
    if (!marcaIdFinal && marca) {
      console.log('🔍 Buscando marca_id para marca:', marca)
      try {
        const marcaResult = await pool.query(
          'SELECT marca_id FROM marca WHERE LOWER(nombre) = LOWER($1)',
          [marca]
        )
        if (marcaResult.rows.length > 0) {
          marcaIdFinal = marcaResult.rows[0].marca_id
          console.log('✅ Marca encontrada, marca_id:', marcaIdFinal)
        } else {
          console.log('⚠️ Marca no encontrada, creando nueva marca:', marca)
          // Crear nueva marca si no existe
          const nuevaMarcaResult = await pool.query(
            'INSERT INTO marca (nombre) VALUES ($1) RETURNING marca_id',
            [marca]
          )
          marcaIdFinal = nuevaMarcaResult.rows[0].marca_id
          console.log('✅ Nueva marca creada con ID:', marcaIdFinal)
        }
      } catch (marcaError) {
        console.warn('⚠️ Error al buscar/crear marca:', marcaError.message)
        marcaIdFinal = null
      }
    }

    const result = await pool.query(
      `UPDATE producto
       SET nombre = $1, descripcion = $2, precio_normal = $3, precio_oferta = $4,
           descuento = $5, marca_id = $6, imagen_url = $7, caracteristicas = $8,
           stock = $9, disponibilidad = $10, envio = $11, en_stock = $12,
           destacado = $13, updated_at = CURRENT_TIMESTAMP
       WHERE producto_id = $14
       RETURNING *`,
      [
        nombre,
        descripcion || '',
        Number(precio_normal) || 0,
        Number(precio_oferta) || 0,
        Number(descuento) || 0,
        marcaIdFinal, // Usar el ID resuelto
        imagen_url || '',
        caracteristicas ? JSON.stringify(caracteristicas) : null,
        Number(stock) || 0,
        disponibilidad || 'disponible',
        envio || 'Envío estándar',
        Number(en_stock) || 1,
        Boolean(destacado),
        id
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    console.log('✅ Producto actualizado:', result.rows[0])
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
      'DELETE FROM producto WHERE producto_id = $1 RETURNING *',
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
