import React, { createContext, useState, useEffect } from 'react'

const LikesContext = createContext()

export const LikesProvider = ({ children }) => {
  const [likes, setLikes] = useState([])
  const [likesInicializados, setLikesInicializados] = useState(false)

  // Cargar likes desde localStorage al iniciar
  useEffect(() => {
    const likesGuardados = localStorage.getItem('techzone_likes')
    if (likesGuardados) {
      try {
        const likesParseados = JSON.parse(likesGuardados)
        setLikes(likesParseados)
      } catch (error) {
        console.error('Error al cargar likes desde localStorage:', error)
        setLikes([])
      }
    }
    setLikesInicializados(true)
  }, [])

  // Guardar likes en localStorage cada vez que cambien (solo después de inicializar)
  useEffect(() => {
    if (likesInicializados) {
      localStorage.setItem('techzone_likes', JSON.stringify(likes))
    }
  }, [likes, likesInicializados])

  // Agregar un producto a favoritos
  const agregarLike = (productoId) => {
    const id = String(productoId)
    setLikes(prev => {
      if (!prev.includes(id)) {
        const newLikes = [...prev, id]
        return newLikes
      }
      return prev
    })
  }

  // Quitar un producto de favoritos
  const quitarLike = (productoId) => {
    const id = String(productoId)
    setLikes(prev => {
      const newLikes = prev.filter(currentId => currentId !== id)
      return newLikes
    })
  }

  // Alternar like de un producto
  const toggleLike = (productoId) => {
    const id = String(productoId)
    if (likes.includes(id)) {
      quitarLike(id)
    } else {
      agregarLike(id)
    }
  }

  // Verificar si un producto tiene like
  const tienelike = (productoId) => {
    const id = String(productoId)
    const hasLike = likes.includes(id)
    return hasLike
  }

  // Obtener cantidad total de likes
  const totalLikes = likes.length

  // Limpiar todos los likes
  const limpiarLikes = () => {
    setLikes([])
  }

  const valor = {
    likes,
    agregarLike,
    quitarLike,
    toggleLike,
    tienelike,
    totalLikes,
    limpiarLikes,
    likesInicializados
  }

  return (
    <LikesContext.Provider value={valor}>
      {children}
    </LikesContext.Provider>
  )
}

export default LikesContext
