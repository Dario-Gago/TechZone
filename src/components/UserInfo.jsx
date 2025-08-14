import React from 'react'
import UserAvatar from './UserAvatar'

const UserInfo = ({ user, alCambiarDireccion }) => {
  const nombreUsuario = user?.nombre || user?.name || 'John Doe'
  const emailUsuario = user?.email || 'johndoe@gmail.com'

  // Extraer dirección completa del backend
  const direccion = user?.direccion || 'Dirección no disponible'
  const telefono = user?.telefono || user?.phone || user?.mobile || '+1 0****99'

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <UserAvatar name={nombreUsuario} />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-lg">
            {nombreUsuario}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Email</span>
              <p className="text-blue-600 font-medium">{emailUsuario}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Dirección</span>
              <p className="text-gray-900">{direccion}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-gray-500 text-xs">Teléfono Móvil</span>
            <p className="text-gray-900">{telefono}</p>
          </div>
        </div>
      </div>
      <button
        onClick={alCambiarDireccion}
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Cambiar dirección
      </button>
    </div>
  )
}

export default UserInfo
