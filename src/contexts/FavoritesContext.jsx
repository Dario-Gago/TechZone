import React, { createContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([])

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    try {
      const favoritosGuardados = localStorage.getItem('techzone_favoritos')
      if (favoritosGuardados) {
        const favoritosParsed = JSON.parse(favoritosGuardados)
        if (Array.isArray(favoritosParsed)) {
          setFavoritos(favoritosParsed)
        }
      }
    } catch (error) {
      console.error('Error al cargar favoritos desde localStorage:', error)
      setFavoritos([])
    }
  }, [])

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('techzone_favoritos', JSON.stringify(favoritos))
    } catch (error) {
      console.error('Error al guardar favoritos en localStorage:', error)
    }
  }, [favoritos])

  // Verificar si un producto está en favoritos
  const esFavorito = (productoId) => {
    return favoritos.some(fav => fav.id === productoId)
  }

  // Agregar producto a favoritos
  const agregarFavorito = (producto) => {
    if (!esFavorito(producto.id)) {
      const nuevoFavorito = {
        id: producto.id,
        nombre: producto.nombre,
        marca: producto.marca,
        precio_normal: producto.precio_normal,
        precio_oferta: producto.precio_oferta,
        imagen_url: producto.imagen_url,
        categoria: producto.categoria,
        fechaAgregado: new Date().toISOString()
      }
      
      setFavoritos(prev => [...prev, nuevoFavorito])
      return true
    }
    return false
  }

  // Quitar producto de favoritos
  const quitarFavorito = (productoId) => {
    setFavoritos(prev => prev.filter(fav => fav.id !== productoId))
    return true
  }

  // Toggle favorito (agregar si no está, quitar si está)
  const toggleFavorito = (producto) => {
    if (esFavorito(producto.id)) {
      quitarFavorito(producto.id)
      return false // Quitado
    } else {
      agregarFavorito(producto)
      return true // Agregado
    }
  }

  // Limpiar todos los favoritos
  const limpiarFavoritos = () => {
    setFavoritos([])
  }

  // Obtener cantidad de favoritos
  const cantidadFavoritos = favoritos.length

  const value = {
    favoritos,
    esFavorito,
    agregarFavorito,
    quitarFavorito,
    toggleFavorito,
    limpiarFavoritos,
    cantidadFavoritos
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesContext
