import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    {
      id: 1,
      src: 'https://dlcdnwebimgs.asus.com/gain/f1d62101-2045-4a90-ba86-2cd1f1317ffd/',
      alt: 'Monitor'
    },
    {
      id: 2,
      src: 'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-ch520_Primary_image?$categorypdpnav$&fmt=png-alpha',
      alt: 'Auriculares'
    },
    {
      id: 3,
      src: 'https://assets2.razerzone.com/images/pnx.assets/89b592e45a60be05a671c021f3363ac0/daessential-500x500.png',
      alt: 'Mouse'
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="w-full bg-white">
      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Image Container */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-full object-contain transition-opacity duration-500"
          />

          {/* Gradient Overlay for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all duration-200 z-10 group"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-gray-900" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white transition-all duration-200 z-10 group"
        >
          <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-gray-900" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
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

export default Carousel
