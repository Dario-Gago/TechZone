import { useState, useEffect } from 'react'

const LIKES_STORAGE_KEY = 'techzone_likes'

export const useLikes = () => {
  const [likes, setLikes] = useState([])

  // Cargar likes del localStorage al inicializar
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem(LIKES_STORAGE_KEY)
      if (storedLikes) {
        setLikes(JSON.parse(storedLikes))
      }
    } catch (error) {
      console.error('Error al cargar likes del localStorage:', error)
    }
  }, [])

  // Guardar likes en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes))
    } catch (error) {
      console.error('Error al guardar likes en localStorage:', error)
    }
  }, [likes])

  // Agregar un producto a favoritos
  const agregarLike = (productoId) => {
    setLikes(prev => {
      if (!prev.includes(productoId)) {
        return [...prev, productoId]
      }
      return prev
    })
  }

  // Quitar un producto de favoritos
  const quitarLike = (productoId) => {
    setLikes(prev => prev.filter(id => id !== productoId))
  }

  // Alternar like de un producto
  const toggleLike = (productoId) => {
    if (likes.includes(productoId)) {
      quitarLike(productoId)
    } else {
      agregarLike(productoId)
    }
  }

  // Verificar si un producto tiene like
  const tienelike = (productoId) => {
    return likes.includes(productoId)
  }

  // Obtener cantidad total de likes
  const totalLikes = likes.length

  // Limpiar todos los likes
  const limpiarLikes = () => {
    setLikes([])
  }

  return {
    likes,
    agregarLike,
    quitarLike,
    toggleLike,
    tienelike,
    totalLikes,
    limpiarLikes
  }
}
