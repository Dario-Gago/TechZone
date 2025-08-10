import React from 'react'
import Slider from '../components/Carousel'
import ProductosDestacados from '../components/FeaturedProducts'
import BannerOferta from '../components/BannerOferta'
import BrandBanner from '../components/BrandBanner'

const Inicio = () => {
  return (
    <div>
      <Slider />
      <ProductosDestacados />
      <BannerOferta />
      <BrandBanner />
    </div>
  )
}

// Exportación con compatibilidad
export default Inicio