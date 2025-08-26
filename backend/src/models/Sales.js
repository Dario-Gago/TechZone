// Sales.js
import pool from '../../db/config.js'

// Obtener todas las ventas (administrador) o solo las ventas del usuario
export const findSales = async (user) => {
  if (user.admin) {
    const query = `
      SELECT 
        v.venta_id, 
        v.fecha_venta as created_at, 
        v.total, 
        v.estado, 
        u.nombre AS user_name,
        u.direccion as usuario_direccion,
        JSON_AGG(
          CASE 
            WHEN dv.producto_id IS NOT NULL THEN
              JSON_BUILD_OBJECT(
                'producto_id', dv.producto_id,
                'nombre', p.nombre,
                'marca', m.nombre,
                'descripcion', COALESCE(p.descripcion, ''),
                'cantidad', dv.cantidad,
                'precio', dv.precio_unitario
              )
            ELSE NULL
          END
        ) FILTER (WHERE dv.producto_id IS NOT NULL) as items,
        JSON_BUILD_OBJECT(
          'tipo_entrega', CASE 
            WHEN u.direccion IS NOT NULL AND u.direccion != '' THEN 'domicilio'
            ELSE 'retiro_tienda'
          END,
          'direccion', u.direccion,
          'sucursal', NULL,
          'estado_envio', NULL
        ) as envio
      FROM ventas v
      JOIN usuario u ON v.usuario_id = u.usuario_id
      LEFT JOIN detalle_ventas dv ON v.venta_id = dv.venta_id
      LEFT JOIN producto p ON dv.producto_id = p.producto_id
      LEFT JOIN marca m ON p.marca_id = m.marca_id
      GROUP BY v.venta_id, v.fecha_venta, v.total, v.estado, u.nombre, u.direccion
      ORDER BY v.fecha_venta DESC
    `
    const result = await pool.query(query)
    return result.rows
  } else {
    const query = `
      SELECT 
        v.venta_id, 
        v.fecha_venta as created_at, 
        v.total, 
        v.estado,
        u.direccion as usuario_direccion,
        JSON_AGG(
          CASE 
            WHEN dv.producto_id IS NOT NULL THEN
              JSON_BUILD_OBJECT(
                'producto_id', dv.producto_id,
                'nombre', p.nombre,
                'marca', m.nombre,
                'descripcion', COALESCE(p.descripcion, ''),
                'cantidad', dv.cantidad,
                'precio', dv.precio_unitario
              )
            ELSE NULL
          END
        ) FILTER (WHERE dv.producto_id IS NOT NULL) as items,
        JSON_BUILD_OBJECT(
          'tipo_entrega', CASE 
            WHEN u.direccion IS NOT NULL AND u.direccion != '' THEN 'domicilio'
            ELSE 'retiro_tienda'
          END,
          'direccion', u.direccion,
          'sucursal', NULL,
          'estado_envio', NULL
        ) as envio
      FROM ventas v
      JOIN usuario u ON v.usuario_id = u.usuario_id
      LEFT JOIN detalle_ventas dv ON v.venta_id = dv.venta_id
      LEFT JOIN producto p ON dv.producto_id = p.producto_id
      LEFT JOIN marca m ON p.marca_id = m.marca_id
      WHERE v.usuario_id = $1
      GROUP BY v.venta_id, v.fecha_venta, v.total, v.estado, u.direccion
      ORDER BY v.fecha_venta DESC
    `
    const result = await pool.query(query, [user.userId])
    return result.rows
  }
}

// Create new sale with items
export const createSaleWithItems = async (userId, items, total) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Insert sale
    const saleResult = await client.query(
      `INSERT INTO ventas (usuario_id, total, estado)
       VALUES ($1, $2, 'pendiente') RETURNING venta_id`,
      [userId, total]
    )

    const ventaId = saleResult.rows[0].venta_id

    // Insert items
    for (const item of items) {
      // Validar que el item tenga todos los campos requeridos
      if (!item.producto_id || !item.cantidad || !item.precio_unitario) {
        throw new Error(`Item inválido: ${JSON.stringify(item)}`)
      }

      await client.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [ventaId, item.producto_id, item.cantidad, item.precio_unitario]
      )
    }

    await client.query('COMMIT')

    return { id: ventaId, venta_id: ventaId }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Update sale status
export const updateSaleStatus = async (ventaId, nuevoEstado) => {
  const query = `UPDATE ventas SET estado = $1 WHERE venta_id = $2 RETURNING *`
  const result = await pool.query(query, [nuevoEstado, ventaId])
  return result.rows[0]
}
