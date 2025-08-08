import React from 'react'
import Carrusel from '../components/Carousel'
import ProductosDestacados from '../components/FeaturedProducts'

const Inicio = () => {
  return (
    <div>
      <Carrusel />
      <ProductosDestacados />
    </div>
  )
}

// Exportación con compatibilidad
export default Inicio
export const Home = Inicio
