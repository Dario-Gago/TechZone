import React from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const FavoriteButton = ({ producto, className = '', size = 'default' }) => {
  const { esFavorito, toggleFavorito } = useFavorites()
  
  const isFavorito = esFavorito(producto.id)
  
  const handleClick = (e) => {
    e.preventDefault() // Evitar navegación si está dentro de un Link
    e.stopPropagation() // Evitar propagación del evento
    toggleFavorito(producto)
  }

  // Tamaños predefinidos
  const sizes = {
    small: 'w-6 h-6 p-1',
    default: 'w-8 h-8 p-1.5',
    large: 'w-10 h-10 p-2'
  }

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4', 
    large: 'w-5 h-5'
  }

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizes[size]}
        rounded-full 
        transition-all 
        duration-200 
        hover:scale-110 
        active:scale-95
        ${isFavorito 
          ? 'bg-red-500 text-white hover:bg-red-600 shadow-md' 
          : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
        }
        ${className}
      `}
      title={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-label={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorito ? 'fill-current' : ''}`}
      />
    </button>
  )
}

export default FavoriteButton
