import React from 'react'
import UserAvatar from './UserAvatar'

const UserInfo = ({ user, onChangeAddress }) => {
  const userName = user?.nombre || user?.name || 'John Doe'
  const userEmail = user?.email || 'johndoe@gmail.com'

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <UserAvatar name={userName} />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-lg">{userName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Email</span>
              <p className="text-blue-600 font-medium">{userEmail}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Dirección</span>
              <p className="text-gray-900">Dirección #1234,</p>
              <p className="text-gray-900">Comuna, Ciudad.</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-gray-500 text-xs">Teléfono Móvil</span>
            <p className="text-gray-900">+1 0****99</p>
          </div>
        </div>
      </div>
      <button 
        onClick={onChangeAddress}
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Cambiar dirección
      </button>
    </div>
  )
}

export default UserInfo
