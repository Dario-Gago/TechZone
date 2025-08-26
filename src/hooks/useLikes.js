import { useContext } from 'react'
import LikesContext from '../contexts/LikesContext'

export const useLikes = () => {
  const context = useContext(LikesContext)
  if (!context) {
    throw new Error('useLikes debe ser usado dentro de un LikesProvider')
  }
  return context
}
