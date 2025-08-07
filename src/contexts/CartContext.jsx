import React, { createContext, useState } from 'react'
import cartData from '../data/carrito.json' // Importamos los datos del carrito

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(cartData.cart.items || [])

  // Lista de productos disponibles (extraída del JSON)
  const availableProducts = cartData.cart.items || []

  const addToCart = (productId, quantity = 1) => {
    const product = availableProducts.find((p) => p.id === productId)
    if (!product) return

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === productId)
      if (existingItem) {
        return items.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...items, { ...product, quantity }]
      }
    })
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    isInCart,
    getItemQuantity,
    getTotalPrice,
    availableProducts // Exponemos los productos disponibles
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
