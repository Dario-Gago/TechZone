import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

const SearchBar = ({ className = "", placeholder = "Buscador..." }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navegar a una página de resultados de búsqueda
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </form>
  )
}

export default SearchBar
