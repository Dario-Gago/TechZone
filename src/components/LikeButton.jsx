import React from 'react'
import { Heart } from 'lucide-react'
import { useLikes } from '../hooks/useLikes'

const LikeButton = ({ 
  productoId, 
  size = 'md', 
  showText = false, 
  className = '',
  variant = 'default' 
}) => {
  const { toggleLike, tienelike } = useLikes()
  const isLiked = tienelike(productoId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(productoId)
  }

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      button: 'p-1.5',
      icon: 'h-4 w-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'h-6 w-6',
      text: 'text-base'
    }
  }

  // Configuración de variantes
  const variantConfig = {
    default: isLiked 
      ? 'bg-red-500 text-white hover:bg-red-600 shadow-md' 
      : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200',
    minimal: isLiked 
      ? 'text-red-500 hover:text-red-600' 
      : 'text-gray-400 hover:text-red-500',
    floating: isLiked 
      ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
      : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 shadow-md border border-gray-200'
  }

  const config = sizeConfig[size]
  const variantStyles = variantConfig[variant]

  return (
    <button
      onClick={handleClick}
      className={`
        ${config.button} 
        ${variantStyles}
        rounded-full 
        transition-all 
        duration-200 
        transform 
        hover:scale-105 
        ${isLiked ? 'shadow-lg' : ''}
        focus:outline-none 
        focus:ring-2 
        focus:ring-red-500 
        focus:ring-offset-2
        ${showText ? 'flex items-center space-x-2' : ''}
        ${className}
      `}
      title={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`${config.icon} transition-all duration-200`} 
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
      />
      {showText && (
        <span className={`${config.text} font-medium`}>
          {isLiked ? 'En favoritos' : 'Agregar a favoritos'}
        </span>
      )}
    </button>
  )
}

export default LikeButton
