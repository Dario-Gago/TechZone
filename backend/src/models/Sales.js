import pool from '../../db/config.js'

// ✅ Get all sales (admin) or only user sales
export const findSales = async (user) => {
  if (user.admin) {
    const query = `
      SELECT v.venta_id, v.fecha as created_at, v.total, v.estado, u.nombre AS user_name
      FROM ventas v
      JOIN usuario u ON v.usuario_id = u.usuario_id
      ORDER BY v.fecha DESC
    `
    const result = await pool.query(query)
    return result.rows
  } else {
    const query = `
      SELECT v.venta_id, v.fecha as created_at, v.total, v.estado
      FROM ventas v
      WHERE v.usuario_id = $1
      ORDER BY v.fecha DESC
    `
    const result = await pool.query(query, [user.userId])
    return result.rows
  }
}

// ✅ Create new sale with items
export const createSaleWithItems = async (userId, items, total) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Insert sale
    const saleResult = await client.query(
      `INSERT INTO ventas (usuario_id, total, estado)
       VALUES ($1, $2, 'completada') RETURNING venta_id`,
      [userId, total]
    )

    const ventaId = saleResult.rows[0].venta_id

    // Insert items
    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [ventaId, item.productId, item.quantity, item.unitPrice]
      )
    }

    await client.query('COMMIT')
    return ventaId
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
// ✅ Update sale status
export const updateSaleStatus = async (ventaId, nuevoEstado) => {
  const query = `UPDATE ventas SET estado = $1 WHERE venta_id = $2 RETURNING *`
  const result = await pool.query(query, [nuevoEstado, ventaId])
  return result.rows[0] // Devuelve la venta actualizada
}
