import React, { createContext, useState, useEffect } from 'react'
import productsData from '../data/products.json'

// Crear el contexto
const ProductContext = createContext()

// Proveedor del contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Simular carga de datos (preparación para futura API)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setProducts(productsData.products)
        setCategories(productsData.categories)
        setError(null)
      } catch (err) {
        setError('Error al cargar los productos')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Función para obtener producto por ID
  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id))
  }

  // Función para obtener productos por categoría
  const getProductsByCategory = (categorySlug) => {
    if (categorySlug === 'todo' || !categorySlug) {
      return products
    }
    return products.filter(product => product.category === categorySlug)
  }

  // Función para obtener productos destacados (primeros 6)
  const getFeaturedProducts = () => {
    return products.slice(0, 6)
  }

  // Función para buscar productos
  const searchProducts = (query) => {
    if (!query.trim()) return products
    
    const searchTerm = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )
  }

  // Función para actualizar stock (preparación para carrito)
  const updateProductStock = (productId, newStock) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    )
  }

  // Función para formatear precios
  const formatPrice = (price) => {
    return `$${price.toLocaleString('es-CL')}`
  }

  const value = {
    products,
    categories,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    updateProductStock,
    formatPrice
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContext
