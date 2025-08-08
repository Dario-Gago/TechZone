import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import rtx5000 from '../assets/rtx5000.png'
import rxAMD from '../assets/rxAMD.png'
import asus from '../assets/asus.png'

const Carrusel = () => {
  const [indiceActual, setIndiceActual] = useState(0)

  const imagenes = [
    {
      id: 1,
      src: asus,
      alt: 'ASUS'
    },
    {
      id: 2,
      src: rxAMD,
      alt: 'AMD RX'
    },
    {
      id: 3,
      src: rtx5000,
      alt: 'NVIDIA RTX 5000'
    }
  ]

  const siguienteDiapositiva = () => {
    setIndiceActual((indiceAnterior) =>
      indiceAnterior === imagenes.length - 1 ? 0 : indiceAnterior + 1
    )
  }

  const anteriorDiapositiva = () => {
    setIndiceActual((indiceAnterior) =>
      indiceAnterior === 0 ? imagenes.length - 1 : indiceAnterior - 1
    )
  }

  const irADiapositiva = (indice) => {
    setIndiceActual(indice)
  }

  return (
    <div className="w-full bg-white">
      {/* Contenedor del Carrusel */}
      <div className="relative w-full">
        {/* Contenedor de Imagen */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={imagenes[indiceActual].src}
            alt={imagenes[indiceActual].alt}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {/* Overlay degradado para mejor visibilidad de botones */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        </div>

        {/* Flechas de Navegación */}
        <button
          onClick={anteriorDiapositiva}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all duration-200 z-10 group"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-gray-900" />
        </button>

        <button
          onClick={siguienteDiapositiva}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all duration-200 z-10 group"
        >
          <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-gray-900" />
        </button>

        {/* Indicador de Puntos */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {imagenes.map((_, indice) => (
            <button
              key={indice}
              onClick={() => irADiapositiva(indice)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                indice === indiceActual
                  ? 'bg-black scale-125 shadow-lg'
                  : 'bg-black/60 hover:bg-black/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Exportación con compatibilidad
export default Carrusel
export const Carousel = Carrusel
