import React, { useState } from 'react'
import { Package, Edit, User } from 'lucide-react'
import SalesTab from './SalesTab'
import ProductsTab from './ProductsTab'
import UsersTab from './UsersTab'

const AdminTabs = ({
  pedidos,
  productos,
  usuarios,
  onEliminarUsuario,
  onEliminarProducto,
  onGuardarProducto
}) => {
  const [tabActiva, setTabActiva] = useState('productos')

  const tabs = [
    { id: 'productos', label: 'Productos', icon: Edit },
    { id: 'ventas', label: 'Últimas Ventas', icon: Package },
    { id: 'usuarios', label: 'Usuarios', icon: User }
  ]

  return (
    <div className="space-y-6">
      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  tabActiva === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-gray-50 rounded-lg p-6">
        {tabActiva === 'ventas' && <SalesTab pedidos={pedidos} />}

        {tabActiva === 'productos' && (
          <ProductsTab
            productos={productos}
            onEliminarProducto={onEliminarProducto}
            onGuardarProducto={onGuardarProducto}
          />
        )}

        {tabActiva === 'usuarios' && (
          <UsersTab usuarios={usuarios} onEliminarUsuario={onEliminarUsuario} />
        )}
      </div>
    </div>
  )
}

export default AdminTabs
