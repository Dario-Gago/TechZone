import datosProductos from './products.json'
import datosPedidos from './pedidos.json'
import datosPedidoProductos from './pedido_productos.json'
import datosPagos from './pagos.json'
import datosEnvios from './envios.json'
import datosUsuarios from './usuarios.json'

// Helper functions para procesar datos de la "base de datos" simulada

export const obtenerPedidosPorUsuario = (usuarioId) => {
  return datosPedidos.pedidos.filter(pedido => pedido.usuario_id === usuarioId)
}

export const obtenerProductosPorPedido = (pedidoId) => {
  const productosDelPedido = datosPedidoProductos.pedido_productos.filter(
    pp => pp.pedido_id === pedidoId
  )
  
  return productosDelPedido.map(pp => {
    const producto = datosProductos.products.find(p => p.id === pp.producto_id)
    return {
      ...producto,
      cantidad: pp.cantidad,
      precio_unitario: pp.precio_unitario,
      subtotal: pp.cantidad * pp.precio_unitario
    }
  })
}

export const obtenerComprasUsuario = (usuarioId) => {
  const pedidosUsuario = obtenerPedidosPorUsuario(usuarioId)
  
  return pedidosUsuario.map(pedido => {
    const productos = obtenerProductosPorPedido(pedido.pedido_id)
    const pago = datosPagos.pagos.find(p => p.pedido_id === pedido.pedido_id)
    const envio = datosEnvios.envios.find(e => e.pedido_id === pedido.pedido_id)
    
    return {
      pedido_id: pedido.pedido_id,
      fecha_pedido: pedido.fecha_pedido,
      total: pedido.total,
      descuento: pedido.descuento,
      estado_pedido: pedido.estado_pedido,
      productos: productos,
      pago: pago,
      envio: envio,
      // Para compatibilidad con el componente actual
      id: pedido.pedido_id,
      producto: productos[0]?.name || 'Producto no encontrado',
      precio: pedido.total,
      fecha: new Date(pedido.fecha_pedido).toISOString().split('T')[0]
    }
  })
}

export const obtenerEstadisticasAdmin = () => {
  const totalVentas = datosPedidos.pedidos.reduce((sum, pedido) => sum + pedido.total, 0)
  const totalUsuarios = datosUsuarios.usuarios.filter(u => u.rol === 'user').length
  const totalProductos = datosProductos.products.length
  
  // Ventas de hoy (simulado)
  const hoy = new Date().toISOString().split('T')[0]
  const ventasHoy = datosPedidos.pedidos
    .filter(pedido => pedido.fecha_pedido.split('T')[0] === hoy)
    .reduce((sum, pedido) => sum + pedido.total, 0)
  
  return {
    totalVentas,
    totalUsuarios,
    totalProductos,
    ventasHoy
  }
}

export const obtenerUsuario = (email) => {
  return datosUsuarios.usuarios.find(usuario => usuario.email === email)
}

export const obtenerResumenVentas = () => {
  const pedidosPorEstado = datosPedidos.pedidos.reduce((acc, pedido) => {
    acc[pedido.estado_pedido] = (acc[pedido.estado_pedido] || 0) + 1
    return acc
  }, {})

  const pagosPorMetodo = datosPagos.pagos.reduce((acc, pago) => {
    acc[pago.metodo_pago] = (acc[pago.metodo_pago] || 0) + 1
    return acc
  }, {})

  const ventasPorMes = datosPedidos.pedidos.reduce((acc, pedido) => {
    const mes = new Date(pedido.fecha_pedido).toISOString().slice(0, 7) // YYYY-MM
    acc[mes] = (acc[mes] || 0) + pedido.total
    return acc
  }, {})

  return {
    pedidosPorEstado,
    pagosPorMetodo,
    ventasPorMes
  }
}

// Función para obtener productos más vendidos
export const obtenerProductosMasVendidos = (limite = 5) => {
  const ventasPorProducto = datosPedidoProductos.pedido_productos.reduce((acc, pp) => {
    acc[pp.producto_id] = (acc[pp.producto_id] || 0) + pp.cantidad
    return acc
  }, {})

  const productosOrdenados = Object.entries(ventasPorProducto)
    .map(([productId, cantidad]) => {
      const producto = datosProductos.products.find(p => p.id === parseInt(productId))
      return {
        producto,
        cantidadVendida: cantidad
      }
    })
    .filter(item => item.producto) // Filtrar productos no encontrados
    .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
    .slice(0, limite)

  return productosOrdenados
}
