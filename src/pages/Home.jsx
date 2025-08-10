import React from 'react'
import Slider from '../components/Carousel'
import ProductosDestacados from '../components/FeaturedProducts'
import BannerOferta from '../components/BannerOferta'

const Inicio = () => {
  return (
    <div>
      <Slider />
      <ProductosDestacados />
      <BannerOferta />
    </div>
  )
}

// Exportación con compatibilidad
export default Inicio