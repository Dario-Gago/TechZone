import React from 'react'
import { Link } from 'react-router-dom'

const BrandBanner = () => {
  const brands = [
    {
      name: 'ASUS',
      backgroundImage: 'url(https://www.asus.com/campaign/powered-by-asus/upload/scenario/20250610172920_pic0.jpg)',
      slug: 'asus'
    },
    {
      name: 'MSI',
      backgroundImage: 'url(https://storage-asset.msi.com/global/picture/news/2019/mb/paris-games-week-20191030-1.jpg)',
      slug: 'msi'
    },
    {
      name: 'HP',
      backgroundImage: 'url(https://www.zdnet.com/a/img/resize/c7217adb15c8791a9070189cd20d3402a2b896cb/2025/01/06/8a629fbd-721e-4e4f-b814-537ff4175696/hp-revamps-it-desktops-and-shows-off-three-next-gen-laptops-at-ces-2025.jpg?auto=webp&fit=crop&height=675&width=1200)',
      slug: 'hp'
    },
    {
      name: 'SAMSUNG',
      backgroundImage: 'url(https://static.ebayinc.com/static/assets/Uploads/Stories/Articles/_resampled/FillWzgwMCw0NTBd/eBay-Adds-Select-Samsung-Galaxy-Products-to-Refurbished-Program.jpeg?v=2&fs=41f53e02ed806e30)',
      slug: 'samsung'
    }
  ]

  return (
    <section className="bg-gray-100">
      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Grid responsivo para las marcas */}
        <div className="grid gap-4">
          
          {/* Desktop: Grid 4 columnas */}
          <div className="hidden lg:grid grid-cols-4 gap-6 px-4">
            {brands.map((brand, index) => (
              <Link
                key={index}
                to={`/search?q=${brand.slug}`}
                className="bg-gray-200 rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-all duration-300 bg-cover bg-center relative aspect-square"
                style={{
                  backgroundImage: brand.backgroundImage
                }}
              >
                {/* Contenido con texto en blanco y sombras */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Tablet: Grid 2 columnas */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
            {brands.map((brand, index) => (
              <Link
                key={index}
                to={`/search?q=${brand.slug}`}
                className="bg-gray-200 rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-all duration-300 bg-cover bg-center relative aspect-square"
                style={{
                  backgroundImage: brand.backgroundImage
                }}
              >
                {/* Contenido con texto en blanco y sombras */}
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Móvil: Grid 2 columnas */}
          <div className="grid md:hidden grid-cols-2 gap-4">
            {brands.map((brand, index) => (
              <Link
                key={index}
                to={`/search?q=${brand.slug}`}
                className="bg-gray-200 rounded-lg flex flex-col justify-center items-center hover:shadow-lg transition-all duration-300 bg-cover bg-center relative aspect-square"
                style={{
                  backgroundImage: brand.backgroundImage
                }}
              >
                {/* Contenido con texto en blanco y sombras */}
                <div className="relative z-10 text-center">
                  <h3 className="text-lg font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default BrandBanner
