import pool from '../../db/config.js'

// Obtener todas las categorías activas
export const getAllCategorias = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM categoria WHERE activo = true ORDER BY nombre ASC'
    )
    return result.rows
  } catch (error) {
    throw new Error('Error al obtener categorías: ' + error.message)
  }
}

// Obtener categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM categoria WHERE categoria_id = $1', [id])
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al obtener categoría: ' + error.message)
  }
}

// Crear nueva categoría
export const createCategoria = async (nombre) => {
  try {
    const result = await pool.query(
      'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *',
      [nombre]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error('Error al crear categoría: ' + error.message)
  }
}

// Actualizar categoría
export const updateCategoria = async (id, nombre, activo = true) => {
  try {
    const result = await pool.query(
      'UPDATE categoria SET nombre = $1, activo = $2 WHERE categoria_id = $3 RETURNING *',
      [nombre, activo, id]
    )
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al actualizar categoría: ' + error.message)
  }
}

// Eliminar categoría (marcar como inactiva)
export const deleteCategoria = async (id) => {
  try {
    const result = await pool.query(
      'UPDATE categoria SET activo = false WHERE categoria_id = $1 RETURNING *',
      [id]
    )
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al eliminar categoría: ' + error.message)
  }
}

// Asignar categoría a producto
export const assignCategoriaToProduct = async (productoId, categoriaId) => {
  try {
    const result = await pool.query(
      'INSERT INTO producto_categoria (producto_id, categoria_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [productoId, categoriaId]
    )
    return result.rowCount > 0
  } catch (error) {
    throw new Error('Error al asignar categoría a producto: ' + error.message)
  }
}

// Remover categoría de producto
export const removeCategoriaFromProduct = async (productoId, categoriaId) => {
  try {
    const result = await pool.query(
      'DELETE FROM producto_categoria WHERE producto_id = $1 AND categoria_id = $2',
      [productoId, categoriaId]
    )
    return result.rowCount > 0
  } catch (error) {
    throw new Error('Error al remover categoría de producto: ' + error.message)
  }
}

// Obtener categorías de un producto
export const getCategoriasOfProduct = async (productoId) => {
  try {
    const result = await pool.query(`
      SELECT c.* FROM categoria c
      JOIN producto_categoria pc ON c.categoria_id = pc.categoria_id
      WHERE pc.producto_id = $1 AND c.activo = true
      ORDER BY c.nombre ASC
    `, [productoId])
    return result.rows
  } catch (error) {
    throw new Error('Error al obtener categorías del producto: ' + error.message)
  }
}
