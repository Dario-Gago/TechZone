import React, { createContext, useState, useContext } from 'react'
import ProductContext from './ProductContext'
import cartData from '../data/carrito.json' // Solo para datos iniciales del carrito

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { getProductById } = useContext(ProductContext)
  const [cartItems, setCartItems] = useState(cartData.cart.items || [])

  // Función para obtener el producto completo con datos actuales
  const getCartItemWithProductData = (cartItem) => {
    const product = getProductById(cartItem.productId)
    if (!product) return null
    
    return {
      ...product,
      cartQuantity: cartItem.quantity,
      // Usar precio actual del producto, no datos obsoletos
      finalPrice: product.discountPrice || product.originalPrice
    }
  }

  // Función para obtener todos los items del carrito con datos completos
  const getCartItemsWithProductData = () => {
    return cartItems
      .map(getCartItemWithProductData)
      .filter(item => item !== null) // Filtrar productos que ya no existen
  }

  const addToCart = (productId, quantity = 1) => {
    const product = getProductById(productId)
    if (!product || product.stock < quantity) return false

    setCartItems((items) => {
      const existingItemIndex = items.findIndex((item) => item.productId === productId)
      
      if (existingItemIndex >= 0) {
        // Si el producto ya está en el carrito, actualizar cantidad
        const newQuantity = items[existingItemIndex].quantity + quantity
        if (newQuantity > product.stock) return items // No exceder stock
        
        return items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        // Agregar nuevo producto al carrito
        return [...items, { productId, quantity }]
      }
    })
    
    return true
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    const product = getProductById(productId)
    if (!product || newQuantity > product.stock) return false
    
    setCartItems((items) =>
      items.map((item) =>
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    )
    
    return true
  }

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.productId !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId)
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return getCartItemsWithProductData().reduce((sum, item) => {
      if (!item) return sum
      return sum + item.finalPrice * item.cartQuantity
    }, 0)
  }

  const value = {
    cartItems: getCartItemsWithProductData(), // Retornar items con datos completos
    rawCartItems: cartItems, // Para acceso directo a los datos básicos
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    isInCart,
    getItemQuantity,
    getTotalPrice,
    getCartItemWithProductData
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
