import pool from '../../db/config.js'

// Obtener todas las marcas
export const getAllMarcas = async () => {
  try {
    const result = await pool.query('SELECT * FROM marca ORDER BY nombre ASC')
    return result.rows
  } catch (error) {
    throw new Error('Error al obtener marcas: ' + error.message)
  }
}

// Obtener marca por ID
export const getMarcaById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM marca WHERE marca_id = $1', [id])
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al obtener marca: ' + error.message)
  }
}

// Crear nueva marca
export const createMarca = async (nombre) => {
  try {
    const result = await pool.query(
      'INSERT INTO marca (nombre) VALUES ($1) RETURNING *',
      [nombre]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error('Error al crear marca: ' + error.message)
  }
}

// Actualizar marca
export const updateMarca = async (id, nombre) => {
  try {
    const result = await pool.query(
      'UPDATE marca SET nombre = $1 WHERE marca_id = $2 RETURNING *',
      [nombre, id]
    )
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al actualizar marca: ' + error.message)
  }
}

// Eliminar marca
export const deleteMarca = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM marca WHERE marca_id = $1 RETURNING *',
      [id]
    )
    return result.rows[0] || null
  } catch (error) {
    throw new Error('Error al eliminar marca: ' + error.message)
  }
}
