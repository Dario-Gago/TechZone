import React from 'react'
import { Link } from 'react-router-dom'

const BannerOferta = () => {
  // Usar categorías que existen en la base de datos
  const categorias = [
    {
      id: 'componentes-gpu',
      name: 'Componentes',
      name2: 'y GPU',
      price: '$199.990',
      slug: 'componentes',
      imageKey: 'gpu', //Clave única para imagen
      tall: true // Ocupa 2 filas
    },
    {
      id: 'gaming-streaming',
      name: 'Gaming',
      price: '$129.990',
      slug: 'gaming-streaming',
      imageKey: 'gaming',
      tall: false
    },
    {
      id: 'componentes-motherboard',
      name: 'Motherboard',
      price: '$160.900',
      slug: 'componentes',
      imageKey: 'motherboard',
      tall: true // Ocupa 2 filas
    },
    {
      id: 'otras-categorias',
      name2: 'SSD',
      price: '$299.990',
      slug: 'otras-categorias',
      imageKey: 'ssd',
      tall: false
    }
  ]

  return (
    <section className="bg-gray-100">
      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Grid responsivo con diferentes layouts según el dispositivo */}
        <div className="grid gap-4">
          {/* Desktop: Grid complejo 3x2 */}
          <div className="hidden lg:grid grid-cols-[1fr_1.2fr_1fr] grid-rows-[280px_260px] gap-6 w-full px-4">
            {/* Tarjetas Gráficas - Columna 1, ocupa 2 filas */}
            <Link
              to={`/category/${categorias[0].slug}`}
              className="bg-gray-200 rounded-lg p-6 flex flex-col justify-center items-start row-span-2 hover:shadow-lg transition-all duration-300 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  'url(https://i.blogs.es/3c6697/nvidia/1200_800.jpeg)'
              }}
            >
              {/* Contenido con texto en blanco y sombras fuertes */}
              <div className="relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[0].name}
                  </h3>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[0].name2}
                  </h3>
                  <p className="text-white text-sm mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                    desde
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[0].price}
                  </p>
                </div>
              </div>
            </Link>

            {/* Monitores - Fila 1, Columna 2 */}
            <Link
              to={`/category/${categorias[1].slug}`}
              className="bg-gray-200 rounded-lg p-6 flex flex-col justify-center items-start hover:shadow-lg transition-all duration-300 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  'url(https://i.blogs.es/1a9ebd/guiamonitoresap/1366_2000.jpg)'
              }}
            >
              {/* Contenido con texto en blanco y sombras fuertes */}
              <div className="relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[1].name}
                  </h3>
                  <p className="text-white text-sm mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                    desde
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[1].price}
                  </p>
                </div>
              </div>
            </Link>

            {/* Placa Madre - Columna 3, ocupa 2 filas */}
            <Link
              to={`/category/${categorias[2].slug}`}
              className="bg-gray-200 rounded-lg p-6 flex flex-col justify-center items-start row-span-2 hover:shadow-lg transition-all duration-300 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  'url(https://i.blogs.es/ab4820/placas-base-cabecera/1200_800.jpeg)'
              }}
            >
              {/* Contenido con texto en blanco y sombras fuertes */}
              <div className="relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[2].name}
                  </h3>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[2].name2}
                  </h3>
                  <p className="text-white text-sm mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                    desde
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[2].price}
                  </p>
                </div>
              </div>
            </Link>

            {/* Almacenamiento SSD - Fila 2, Columna 2 */}
            <Link
              to={`/category/${categorias[3].slug}`}
              className="bg-gray-200 rounded-lg p-6 flex flex-col justify-center items-start hover:shadow-lg transition-all duration-300 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  'url(https://i.blogs.es/dbc59f/m2/1366_2000.jpeg)'
              }}
            >
              {/* Contenido con texto en blanco y sombras fuertes */}
              <div className="relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[3].name}
                  </h3>
                  <h3 className="text-2xl font-bold text-white leading-tight mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[3].name2}
                  </h3>
                  <p className="text-white text-sm mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                    desde
                  </p>
                  <p className="text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                    {categorias[3].price}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Tablet: Grid 2x2 */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
            {categorias.map((categoria) => {
              const backgroundImages = {
                'gpu':
                  'url(https://i.blogs.es/3c6697/nvidia/1200_800.jpeg)',
                'gaming':
                  'url(https://i.blogs.es/1a9ebd/guiamonitoresap/1366_2000.jpg)',
                'motherboard':
                  'url(https://i.blogs.es/ab4820/placas-base-cabecera/1200_800.jpeg)',
                'ssd':
                  'url(https://i.blogs.es/dbc59f/m2/1366_2000.jpeg)'
              }

              return (
                <Link
                  key={categoria.id}
                  to={`/category/${categoria.slug}`}
                  className="bg-gray-200 rounded-lg p-6 flex flex-col justify-center items-start hover:shadow-lg transition-all duration-300 min-h-[200px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: backgroundImages[categoria.imageKey]
                  }}
                >
                  {/* Contenido con texto en blanco y sombras fuertes */}
                  <div className="relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                        {categoria.name}
                      </h3>
                      {categoria.name2 && (
                        <h3 className="text-xl font-bold text-white leading-tight mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                          {categoria.name2}
                        </h3>
                      )}
                      <p className="text-white text-sm mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                        desde
                      </p>
                      <p className="text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                        {categoria.price}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Móvil: Grid 1 columna */}
          <div className="grid md:hidden grid-cols-1 gap-4">
            {categorias.map((categoria) => {
              const backgroundImages = {
                'gpu':
                  'url(https://i.blogs.es/3c6697/nvidia/1200_800.jpeg)',
                'gaming':
                  'url(https://i.blogs.es/1a9ebd/guiamonitoresap/1366_2000.jpg)',
                'motherboard':
                  'url(https://i.blogs.es/ab4820/placas-base-cabecera/1200_800.jpeg)',
                'ssd':
                  'url(https://i.blogs.es/dbc59f/m2/1366_2000.jpeg)'
              }

              return (
                <Link
                  key={categoria.id}
                  to={`/category/${categoria.slug}`}
                  className="bg-gray-200 rounded-lg p-6 flex flex-row items-center hover:shadow-lg transition-all duration-300 min-h-[120px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: backgroundImages[categoria.imageKey]
                  }}
                >
                  {/* Contenido con texto en blanco y sombras fuertes */}
                  <div className="relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                        {categoria.name}
                      </h3>
                      {categoria.name2 && (
                        <h3 className="text-lg font-bold text-white leading-tight mb-2 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                          {categoria.name2}
                        </h3>
                      )}
                      <p className="text-white text-xs mb-1 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                        desde
                      </p>
                      <p className="text-lg font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                        {categoria.price}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerOferta
