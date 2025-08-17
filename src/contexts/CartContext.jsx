import React, { createContext, useState, useContext, useEffect } from 'react'
import { ProductContext } from './ProductContext'

const ContextoCarrito = createContext()

export const ProveedorCarrito = ({ children }) => {
  const contextoProducto = useContext(ProductContext)
  const [articulosCarrito, setArticulosCarrito] = useState([])
  const [carritoInicializado, setCarritoInicializado] = useState(false)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      try {
        const carrito = JSON.parse(carritoGuardado)
        setArticulosCarrito(carrito)
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error)
        setArticulosCarrito([])
      }
    }
    setCarritoInicializado(true)
  }, [])

  // Guardar carrito en localStorage cada vez que cambie (solo después de inicializar)
  useEffect(() => {
    if (carritoInicializado) {
      localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
    }
  }, [articulosCarrito, carritoInicializado])

  // Función para obtener el producto completo con datos actuales
  const obtenerItemCarritoConDatos = (itemCarrito) => {
    // Verificar que el contexto de productos esté disponible y tenga datos
    if (!contextoProducto || !contextoProducto.obtenerProductoPorId) {
      return null
    }

    const producto = contextoProducto.obtenerProductoPorId(
      itemCarrito.productId
    )
    if (!producto) return null

    return {
      ...producto,
      cantidadCarrito: itemCarrito.quantity,
      // Usar precio actual del producto, no datos obsoletos
      precioFinal: producto.discountPrice || producto.originalPrice
    }
  }

  // Función para obtener todos los items del carrito con datos completos
  const obtenerItemsCarritoConDatos = () => {
    return articulosCarrito
      .map(obtenerItemCarritoConDatos)
      .filter((item) => item !== null) // Filtrar productos que ya no existen
  }

  const agregarAlCarrito = (idProducto, cantidad = 1) => {
    // Verificar que el contexto de productos esté disponible
    if (!contextoProducto || !contextoProducto.obtenerProductoPorId) {
      console.error('Contexto de productos no disponible')
      return false
    }

    const producto = contextoProducto.obtenerProductoPorId(idProducto)
    if (!producto) {
      console.error('Producto no encontrado')
      return false
    }

    setArticulosCarrito((items) => {
      const indiceItemExistente = items.findIndex(
        (item) => item.productId === idProducto
      )

      if (indiceItemExistente >= 0) {
        // Si el producto ya está en el carrito, actualizar cantidad
        const nuevaCantidad = items[indiceItemExistente].quantity + cantidad

        return items.map((item, index) =>
          index === indiceItemExistente
            ? { ...item, quantity: nuevaCantidad }
            : item
        )
      } else {
        // Agregar nuevo producto al carrito
        return [...items, { productId: idProducto, quantity: cantidad }]
      }
    })

    return true
  }

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(idProducto)
      return
    }

    setArticulosCarrito((items) =>
      items.map((item) =>
        item.productId === idProducto
          ? { ...item, quantity: nuevaCantidad }
          : item
      )
    )

    return true
  }

  const eliminarDelCarrito = (idProducto) => {
    setArticulosCarrito((items) =>
      items.filter((item) => item.productId !== idProducto)
    )
  }

  const vaciarCarrito = () => {
    setArticulosCarrito([])
  }

  const obtenerTotalItems = () => {
    return articulosCarrito.reduce((total, item) => total + item.quantity, 0)
  }

  const estaEnCarrito = (idProducto) => {
    return articulosCarrito.some((item) => item.productId === idProducto)
  }

  const obtenerCantidadItem = (idProducto) => {
    const item = articulosCarrito.find((item) => item.productId === idProducto)
    return item ? item.quantity : 0
  }

  const obtenerPrecioTotal = () => {
    return obtenerItemsCarritoConDatos().reduce((suma, item) => {
      if (!item) return suma
      return suma + item.precioFinal * item.cantidadCarrito
    }, 0)
  }

  const value = {
    articulosCarrito: obtenerItemsCarritoConDatos(), // Retornar items con datos completos
    articulosCarritoBasicos: articulosCarrito, // Para acceso directo a los datos básicos
    obtenerItemCarritoConDatos,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    obtenerTotalItems,
    estaEnCarrito,
    obtenerCantidadItem,
    obtenerPrecioTotal
  }

  return (
    <ContextoCarrito.Provider value={value}>
      {children}
    </ContextoCarrito.Provider>
  )
}

// Exportaciones para compatibilidad
export default ContextoCarrito
export const CartContext = ContextoCarrito
export const CartProvider = ProveedorCarrito
